// Master Engine for Path of the Blind Sun

import { audioEngine } from './audioEngine';
import { Boss } from './bosses';
import { comicUI, CutsceneDialogue } from './comicUI';
import { Enemy } from './enemies';
import { LEVELS } from './levelData';
import { lightEngine } from './lightEngine';
import { Player, WeaponType } from './player';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;

  public player: Player;
  public currentLevelNum: number = 1;
  public currentBoss: Boss | null = null;
  public enemies: Enemy[] = [];
  public particles: Particle[] = [];

  public isPaused: boolean = false;
  public isGameOver: boolean = false;
  public isGameVictory: boolean = false;
  public activeCutscene: CutsceneDialogue[] | null = null;
  public cutsceneIndex: number = 0;

  private keys: Record<string, boolean> = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.player = new Player(60, 420);

    this.bindEvents();
    this.loadLevel(1);
  }

  private bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      audioEngine.startBgm();

      // Quick key handlers
      if (this.activeCutscene) {
        if (e.code === 'Space' || e.code === 'Enter') {
          this.advanceCutscene();
        }
        return;
      }

      if (e.code === 'KeyK' || e.code === 'KeyX') {
        if (this.player.triggerSolarPulse()) {
          // Pulse light shockwave damaging near dark enemies
          this.triggerSolarPulseEffect();
        }
      }

      if (e.code === 'ShiftLeft' || e.code === 'KeyL' || e.code === 'KeyC') {
        this.player.dodgeRoll();
      }

      if (e.code === 'KeyI' || e.code === 'KeyE') {
        this.player.parry();
      }

      if (e.code === 'KeyJ' || e.code === 'KeyZ') {
        const hit = this.player.attack();
        if (hit) {
          this.checkPlayerHitEnemies(hit);
        }
      }

      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        this.player.jump();
      }

      // Quick switch weapons 1-5
      if (e.code === 'Digit1') this.player.selectWeapon('talwar');
      if (e.code === 'Digit2') this.player.selectWeapon('baghnakh');
      if (e.code === 'Digit3') this.player.selectWeapon('urumi');
      if (e.code === 'Digit4') this.player.selectWeapon('katar');
      if (e.code === 'Digit5') this.player.selectWeapon('pata');
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    this.canvas.addEventListener('click', () => {
      if (this.activeCutscene) {
        this.advanceCutscene();
      } else {
        const hit = this.player.attack();
        if (hit) {
          this.checkPlayerHitEnemies(hit);
        }
      }
    });
  }

  public start() {
    if (!this.animFrameId) {
      const loop = () => {
        this.update();
        this.render();
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public loadLevel(pageNum: number) {
    const level = LEVELS[pageNum];
    if (!level) return;

    this.currentLevelNum = pageNum;
    lightEngine.reset();
    lightEngine.setDarkness(level.darkness);

    for (const src of level.lightSources) {
      lightEngine.addLightSource(src);
    }
    lightEngine.mirrors = [...level.mirrors];

    this.player.x = level.startX;
    this.player.y = level.startY;
    this.player.vx = 0;
    this.player.vy = 0;

    // Spawn enemies
    this.enemies = level.enemies.map((e, idx) => new Enemy(`e_${pageNum}_${idx}`, e.type, e.x, e.y));

    // Spawn boss if defined
    if (level.bossId) {
      this.currentBoss = new Boss(level.bossId, 680, 350);
      if (this.currentBoss.introDialogue) {
        this.startCutscene(this.currentBoss.introDialogue);
      }
    } else {
      this.currentBoss = null;
    }

    comicUI.triggerPopup(`PAGE ${pageNum}: ${level.title.toUpperCase()}`, 512, 180, '#fbbf24', '#0f172a');
  }

  public startCutscene(dialogue: CutsceneDialogue[]) {
    this.activeCutscene = dialogue;
    this.cutsceneIndex = 0;
    comicUI.currentDialogue = dialogue[0];
  }

  public advanceCutscene() {
    if (!this.activeCutscene) return;

    this.cutsceneIndex++;
    if (this.cutsceneIndex >= this.activeCutscene.length) {
      this.activeCutscene = null;
      comicUI.currentDialogue = null;
    } else {
      comicUI.currentDialogue = this.activeCutscene[this.cutsceneIndex];
    }
  }

  private triggerSolarPulseEffect() {
    // Spawn radial light particles
    for (let i = 0; i < 30; i++) {
      const angle = (i * Math.PI * 2) / 30;
      const speed = 4 + Math.random() * 6;
      this.particles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4,
        color: '#fbbf24',
        alpha: 1,
        life: 0,
        maxLife: 30
      });
    }

    // Damage all dark enemies near player
    for (const enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (dist < 200) {
        enemy.takeDamage(25, true);
      }
    }
    if (this.currentBoss) {
      const dist = Math.hypot(this.currentBoss.x - this.player.x, this.currentBoss.y - this.player.y);
      if (dist < 220) {
        this.currentBoss.takeDamage(20);
      }
    }
  }

  private checkPlayerHitEnemies(hit: { x: number; y: number; w: number; h: number; damage: number; weapon: WeaponType }) {
    // Check hit on minor enemies
    for (const enemy of this.enemies) {
      if (
        hit.x < enemy.x + enemy.width &&
        hit.x + hit.w > enemy.x &&
        hit.y < enemy.y + enemy.height &&
        hit.y + hit.h > enemy.y
      ) {
        const killed = enemy.takeDamage(hit.damage);
        if (killed) {
          // Spawn blood ink particles
          this.spawnInkParticles(enemy.x, enemy.y, '#dc2626');
        }
      }
    }

    // Check hit on boss
    if (this.currentBoss) {
      const boss = this.currentBoss;
      if (
        hit.x < boss.x + boss.width &&
        hit.x + hit.w > boss.x &&
        hit.y < boss.y + boss.height &&
        hit.y + hit.h > boss.y
      ) {
        const bossDefeated = boss.takeDamage(hit.damage);
        this.spawnInkParticles(boss.x, boss.y, '#f59e0b');

        if (bossDefeated) {
          if (boss.reward) {
            this.player.unlockWeapon(boss.reward.weapon);
          }
          if (boss.defeatDialogue) {
            this.startCutscene(boss.defeatDialogue);
          }
          if (boss.id === 'mahaketu') {
            this.isGameVictory = true;
          }
        }
      }
    }
  }

  private spawnInkParticles(x: number, y: number, color = '#ef4444') {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: 25
      });
    }
  }

  private update() {
    if (this.isPaused || this.activeCutscene) return;

    const level = LEVELS[this.currentLevelNum];
    if (!level) return;

    // 1. Player Update
    this.player.update(this.keys, level.platforms);

    if (this.player.hp <= 0) {
      this.isGameOver = true;
    }

    // Check if player reaches page exit door
    const dDoor = Math.hypot(this.player.x - level.doorX, this.player.y - level.doorY);
    if (dDoor < 45 && (!this.currentBoss || this.currentBoss.isDead)) {
      if (this.currentLevelNum < 18) {
        audioEngine.playLightAltar();
        this.loadLevel(this.currentLevelNum + 1);
      } else {
        this.isGameVictory = true;
      }
    }

    // 2. Mirror Raycasting Calculations (Page 10 Puzzle)
    if (level.mirrors.length > 0) {
      lightEngine.calculateMirrorReflections(this.player.x + 18, this.player.y + 26, 1, 0);
    }

    // 3. Enemies Update
    for (const enemy of this.enemies) {
      const isIlluminated = lightEngine.isPointIlluminated(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y,
        this.player.lightRadius
      );
      const attackHit = enemy.update(this.player.x, this.player.y, isIlluminated, level.platforms);
      if (attackHit) {
        this.player.takeDamage(attackHit.damage);
      }
    }

    // 4. Boss Update
    if (this.currentBoss) {
      const bossHit = this.currentBoss.update(this.player.x, this.player.y);
      if (bossHit) {
        this.player.takeDamage(bossHit.damage);
      }
    }

    // 5. Particles Update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // 6. Comic UI Popups update
    comicUI.update();
  }

  private render() {
    const level = LEVELS[this.currentLevelNum];
    if (!level) return;

    // Clear Canvas
    this.ctx.fillStyle = '#0f172a'; // Dark slate sky background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Render Environment & Platforms
    for (const p of level.platforms) {
      this.ctx.fillStyle = p.type === 'root' ? '#3f6212' : p.type === 'wood' ? '#78350f' : '#334155';
      this.ctx.fillRect(p.x, p.y, p.w, p.h);

      // Top golden accent line
      this.ctx.fillStyle = '#f59e0b';
      this.fillRectAcc(p.x, p.y, p.w, 3);
    }

    // Render Exit Door Portal
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.arc(level.doorX, level.doorY + 20, 24, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Render Player, Enemies, Boss
    this.player.render(this.ctx);

    for (const enemy of this.enemies) {
      enemy.render(this.ctx);
    }

    if (this.currentBoss) {
      this.currentBoss.render(this.ctx);
    }

    // 3. Render Dynamic Darkness Mask
    lightEngine.renderLightMask(
      this.ctx,
      this.canvas.width,
      this.canvas.height,
      this.player.x + 18,
      this.player.y + 28,
      this.player.lightRadius,
      false
    );

    // 4. Render Particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 5. Render Comic Popups & Frame Overlay
    comicUI.renderPopups(this.ctx);
    comicUI.renderComicFrame(this.ctx, this.canvas.width, this.canvas.height, level.title, this.currentLevelNum);

    // 6. Halftone Dot Texture Overlay
    comicUI.renderHalftoneOverlay(this.ctx, this.canvas.width, this.canvas.height);

    // 7. Dialogue Bubble Cutscene Overlay if active
    if (this.activeCutscene && comicUI.currentDialogue) {
      comicUI.renderSpeechBubble(this.ctx, this.canvas.width, this.canvas.height, comicUI.currentDialogue);
    }
  }

  private fillRectAcc(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(x, y, w, h);
  }

  public restartGame() {
    this.isGameOver = false;
    this.isGameVictory = false;
    this.player.resetStats();
    this.player.unlockedWeapons = ['talwar'];
    this.player.currentWeapon = 'talwar';
    this.loadLevel(1);
  }
}
