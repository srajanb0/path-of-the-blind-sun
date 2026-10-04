// Enemies Module for Path of the Blind Sun

import { audioEngine } from './audioEngine';
import { comicUI } from './comicUI';

export type EnemyType = 'pishacha' | 'naga' | 'vajra';

export class Enemy {
  public id: string;
  public type: EnemyType;
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public width: number;
  public height: number;
  public hp: number;
  public maxHp: number;
  public damage: number;
  public speed: number;
  public isFacingRight: boolean = false;
  public attackCooldown: number = 0;
  public isStunned: boolean = false;
  public stunTimer: number = 0;
  public isDead: boolean = false;

  constructor(id: string, type: EnemyType, x: number, y: number) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;

    if (type === 'pishacha') {
      this.width = 32;
      this.height = 36;
      this.hp = 35;
      this.maxHp = 35;
      this.damage = 12;
      this.speed = 3.5;
    } else if (type === 'naga') {
      this.width = 38;
      this.height = 54;
      this.hp = 65;
      this.maxHp = 65;
      this.damage = 18;
      this.speed = 2.2;
    } else {
      // Vajra Brute
      this.width = 48;
      this.height = 64;
      this.hp = 120;
      this.maxHp = 120;
      this.damage = 30;
      this.speed = 1.4;
    }
  }

  public update(
    playerX: number,
    playerY: number,
    isPlayerIlluminated: boolean,
    platforms: Array<{ x: number; y: number; w: number; h: number }>
  ): { type: 'attack'; damage: number } | null {
    if (this.isDead) return null;

    if (this.stunTimer > 0) {
      this.stunTimer--;
      if (this.stunTimer === 0) this.isStunned = false;
      return null;
    }

    if (this.attackCooldown > 0) this.attackCooldown--;

    // AI Logic
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy);

    this.isFacingRight = dx > 0;

    // Aggro detection range
    const aggroRange = this.type === 'pishacha' && !isPlayerIlluminated ? 380 : 260;

    if (dist < aggroRange && dist > 20) {
      this.vx = this.isFacingRight ? this.speed : -this.speed;
    } else {
      this.vx *= 0.8;
    }

    // Gravity & Physics
    this.vy += 0.55;
    this.x += this.vx;
    this.y += this.vy;

    // Platform collisions
    for (const p of platforms) {
      if (
        this.x + this.width > p.x &&
        this.x < p.x + p.w &&
        this.y + this.height >= p.y &&
        this.y + this.height - this.vy <= p.y + 12
      ) {
        this.y = p.y - this.height;
        this.vy = 0;
      }
    }

    // Melee attack hit check on player
    if (dist < 42 && this.attackCooldown === 0) {
      this.attackCooldown = 50;
      return { type: 'attack', damage: this.damage };
    }

    return null;
  }

  public takeDamage(amount: number, isSolarFlash = false): boolean {
    if (this.isDead) return false;

    // Pishacha crawlers take 1.5x solar light damage
    const actualDamage = isSolarFlash && this.type === 'pishacha' ? amount * 1.5 : amount;
    this.hp -= actualDamage;

    if (isSolarFlash) {
      this.isStunned = true;
      this.stunTimer = 40;
      comicUI.triggerPopup('BLINDED BY LIGHT!', this.x, this.y - 20, '#fbbf24', '#78350f');
    }

    if (this.hp <= 0) {
      this.isDead = true;
      audioEngine.playHit();
      comicUI.triggerPopup('KAPOW!', this.x, this.y, '#ef4444', '#7f1d1d');
      return true;
    } else {
      audioEngine.playHit();
      comicUI.triggerPopup('THWACK!', this.x, this.y, '#facc15');
      return false;
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (this.isDead) return;

    ctx.save();
    const cx = this.x + this.width / 2;

    if (this.type === 'pishacha') {
      // Fast dark feral shadow crawler
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);

      // Glowing feral red eyes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(this.isFacingRight ? this.x + 24 : this.x + 8, this.y + 16, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'naga') {
      // Reptilian Mercenary with Shield
      ctx.fillStyle = '#065f46';
      ctx.fillRect(this.x + 4, this.y + 12, 30, 42);

      // Naga Shield
      ctx.fillStyle = '#78350f';
      ctx.fillRect(this.isFacingRight ? this.x + 24 : this.x, this.y + 18, 12, 28);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(this.isFacingRight ? this.x + 24 : this.x, this.y + 18, 12, 28);
    } else {
      // Vajra Brute Tank Guard with Gada Mace
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);

      // Heavy Gada Mace
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(this.isFacingRight ? this.x + 44 : this.x + 4, this.y + 20, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Health Bar above enemy
    if (this.hp < this.maxHp) {
      const barW = this.width;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(this.x, this.y - 12, barW, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(this.x, this.y - 12, barW * (this.hp / this.maxHp), 6);
    }

    ctx.restore();
  }
}
