import pygame
import sys
from enum import Enum

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60
GRAVITY = 0.6
JUMP_STRENGTH = -15

# Colors
BLACK = (0, 0, 0)
BLUE = (135, 206, 235)
GREEN = (34, 139, 34)
RED = (220, 20, 60)
YELLOW = (255, 255, 0)

class GameState(Enum):
    PLAYING = 1
    GAME_OVER = 2
    WIN = 3

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((32, 48))
        self.image.fill(RED)
        self.rect = self.image.get_rect(topleft=(x, y))
        self.velocity_y = 0
        self.velocity_x = 0
        self.is_jumping = False
        self.facing_right = True
        
    def update(self, platforms, enemies):
        # Handle input
        keys = pygame.key.get_pressed()
        self.velocity_x = 0
        
        if keys[pygame.K_LEFT]:
            self.velocity_x = -5
            self.facing_right = False
        if keys[pygame.K_RIGHT]:
            self.velocity_x = 5
            self.facing_right = True
        if keys[pygame.K_SPACE] and not self.is_jumping:
            self.velocity_y = JUMP_STRENGTH
            self.is_jumping = True
        
        # Apply gravity
        self.velocity_y += GRAVITY
        if self.velocity_y > 15:
            self.velocity_y = 15
        
        # Update position
        self.rect.x += self.velocity_x
        self.rect.y += self.velocity_y
        
        # Keep player in bounds horizontally
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > SCREEN_WIDTH:
            self.rect.right = SCREEN_WIDTH
        
        # Check collisions with platforms
        self.is_jumping = True
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.velocity_y > 0 and self.rect.bottom <= platform.rect.centery:
                    self.rect.bottom = platform.rect.top
                    self.velocity_y = 0
                    self.is_jumping = False
        
        # Fall off screen
        if self.rect.top > SCREEN_HEIGHT:
            return False
        
        # Check enemy collisions
        for enemy in enemies:
            if self.rect.colliderect(enemy.rect):
                if self.velocity_y > 0 and self.rect.bottom <= enemy.rect.centery:
                    enemy.kill()
                else:
                    return False
        
        return True

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, width, height, is_goal=False):
        super().__init__()
        self.image = pygame.Surface((width, height))
        self.image.fill(YELLOW if is_goal else GREEN)
        self.rect = self.image.get_rect(topleft=(x, y))
        self.is_goal = is_goal

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y, width=32, height=32):
        super().__init__()
        self.image = pygame.Surface((width, height))
        self.image.fill(RED)
        self.rect = self.image.get_rect(topleft=(x, y))
        self.velocity_x = -2
        self.min_x = x - 100
        self.max_x = x + 100
        
    def update(self):
        self.rect.x += self.velocity_x
        
        if self.rect.x <= self.min_x or self.rect.x >= self.max_x:
            self.velocity_x *= -1

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Super Mario 2D")
        self.clock = pygame.time.Clock()
        self.state = GameState.PLAYING
        self.score = 0
        
        # Create sprite groups
        self.platforms = pygame.sprite.Group()
        self.enemies = pygame.sprite.Group()
        self.all_sprites = pygame.sprite.Group()
        
        # Initialize game
        self.setup_level()
        
    def setup_level(self):
        # Create platforms
        platforms_data = [
            (0, SCREEN_HEIGHT - 40, SCREEN_WIDTH, 40, False),  # Ground
            (150, 500, 200, 20, False),
            (450, 500, 200, 20, False),
            (100, 400, 150, 20, False),
            (550, 400, 150, 20, False),
            (250, 300, 200, 20, False),
            (500, 250, 150, 20, False),
            (300, 150, 200, 20, False),
            (600, 100, 150, 20, True),  # Goal platform
        ]
        
        for x, y, w, h, is_goal in platforms_data:
            platform = Platform(x, y, w, h, is_goal)
            self.platforms.add(platform)
            self.all_sprites.add(platform)
        
        # Create player
        self.player = Player(50, SCREEN_HEIGHT - 80)
        self.all_sprites.add(self.player)
        
        # Create enemies
        enemy_positions = [(300, 460), (550, 460), (400, 350), (650, 350)]
        for x, y in enemy_positions:
            enemy = Enemy(x, y)
            self.enemies.add(enemy)
            self.all_sprites.add(enemy)
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r and self.state != GameState.PLAYING:
                    return self.restart()
        return True
    
    def restart(self):
        self.platforms.empty()
        self.enemies.empty()
        self.all_sprites.empty()
        self.state = GameState.PLAYING
        self.score = 0
        self.setup_level()
        return True
    
    def update(self):
        if self.state == GameState.PLAYING:
            self.all_sprites.update()
            
            # Check if player is alive
            if not self.player.update(self.platforms, self.enemies):
                self.state = GameState.GAME_OVER
            
            # Check win condition
            for platform in self.platforms:
                if platform.is_goal and self.player.rect.colliderect(platform.rect):
                    self.state = GameState.WIN
                    self.score += 1000
    
    def draw(self):
        self.screen.fill(BLUE)
        
        # Draw sprites
        self.all_sprites.draw(self.screen)
        
        # Draw UI
        font = pygame.font.Font(None, 36)
        score_text = font.render(f"Score: {self.score}", True, BLACK)
        self.screen.blit(score_text, (10, 10))
        
        if self.state == GameState.GAME_OVER:
            game_over_text = pygame.font.Font(None, 72).render("GAME OVER", True, RED)
            restart_text = pygame.font.Font(None, 36).render("Press R to Restart", True, BLACK)
            self.screen.blit(game_over_text, (SCREEN_WIDTH // 2 - 200, SCREEN_HEIGHT // 2 - 50))
            self.screen.blit(restart_text, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT // 2 + 50))
        
        if self.state == GameState.WIN:
            win_text = pygame.font.Font(None, 72).render("YOU WIN!", True, YELLOW)
            restart_text = pygame.font.Font(None, 36).render("Press R to Play Again", True, BLACK)
            self.screen.blit(win_text, (SCREEN_WIDTH // 2 - 180, SCREEN_HEIGHT // 2 - 50))
            self.screen.blit(restart_text, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT // 2 + 50))
        
        pygame.display.flip()
    
    def run(self):
        running = True
        while running:
            running = self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
