// Player Entity (Vikramaditya Simha) for Path of the Blind Sun

import { audioEngine } from './audioEngine';
import { comicUI } from './comicUI';

export type WeaponType = 'talwar' | 'baghnakh' | 'urumi' | 'katar' | 'pata';

export class Player {
  public x: number = 100;
  public y: number = 400;
  public vx: number = 0;
  public vy: number = 0;
  public width: number = 36;
  public height: number = 56;

  // Stats
  public hp: number = 100;
  public maxHp: number = 100;
  public stamina: number = 100;
  public maxStamina: number = 100;
  public solarEnergy: number = 100;
  public maxSolarEnergy: number = 100;

  // Combat & State Flags
  public isGrounded: boolean = false;
  public isFacingRight: boolean = true;
  public isAttacking: boolean = false;
  public attackTimer: number = 0;
  public isDodging: boolean = false;
  public dodgeTimer: number = 0;
  public isParrying: boolean = false;
  public parryTimer: number = 0;
  public isWallSliding: boolean = false;
  public canDoubleJump: boolean = false;
  public hasDoubleJumped: boolean = false;
  public invulnerableTimer: number = 0;

  // Weapon Inventory
  public unlockedWeapons: WeaponType[] = ['talwar'];
  public currentWeapon: WeaponType = 'talwar';

  // Light Source
  public lightRadius: number = 160;

  constructor(x = 100, y = 400) {
    this.x = x;
    this.y = y;
  }

  public resetStats() {
    this.hp = this.maxHp;
    this.stamina = this.maxStamina;
    this.solarEnergy = this.maxSolarEnergy;
    this.vx = 0;
    this.vy = 0;
  }

  public unlockWeapon(weapon: WeaponType) {
    if (!this.unlockedWeapons.includes(weapon)) {
      this.unlockedWeapons.push(weapon);
      this.currentWeapon = weapon;
      comicUI.triggerPopup(`WEAPON UNLOCKED: ${weapon.toUpperCase()}!`, this.x, this.y - 40, '#38bdf8', '#0284c7');
    }
  }

  public selectWeapon(weapon: WeaponType) {
    if (this.unlockedWeapons.includes(weapon)) {
      this.currentWeapon = weapon;
      audioEngine.playSlash(weapon);
    }
  }

  public update(keys: Record<string, boolean>, platforms: Array<{ x: number; y: number; w: number; h: number }>) {
    // 1. Stamina & Solar Energy Regeneration
    if (!this.isDodging && this.stamina < this.maxStamina) {
      this.stamina = Math.min(this.maxStamina, this.stamina + 0.35);
    }
    if (this.solarEnergy < this.maxSolarEnergy) {
      this.solarEnergy = Math.min(this.maxSolarEnergy, this.solarEnergy + 0.15);
    }

    // 2. Timers
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;
    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer === 0) this.isAttacking = false;
    }
    if (this.dodgeTimer > 0) {
      this.dodgeTimer--;
      if (this.dodgeTimer === 0) this.isDodging = false;
    }
    if (this.parryTimer > 0) {
      this.parryTimer--;
      if (this.parryTimer === 0) this.isParrying = false;
    }

    // 3. Horizontal Movement
    const speed = this.isDodging ? 9 : 4.5;
    if (!this.isDodging) {
      if (keys['KeyA'] || keys['ArrowLeft']) {
        this.vx = -speed;
        this.isFacingRight = false;
      } else if (keys['KeyD'] || keys['ArrowRight']) {
        this.vx = speed;
        this.isFacingRight = true;
      } else {
        this.vx *= 0.6; // Friction
      }
    }

    // 4. Gravity & Jump Physics
    const gravity = 0.55;
    this.vy += gravity;

    // Wall slide check (Unlocked with Bagh-Nakh)
    const canWallSlide = this.unlockedWeapons.includes('baghnakh');
    if (canWallSlide && !this.isGrounded && Math.abs(this.vx) > 1) {
      this.isWallSliding = true;
      this.vy = Math.min(this.vy, 2.0); // Slow descent
    } else {
      this.isWallSliding = false;
    }

    // Apply Velocities & Collision Check with Platforms
    this.x += this.vx;
    this.y += this.vy;

    this.isGrounded = false;
    for (const p of platforms) {
      // Check vertical landing
      if (
        this.x + this.width > p.x &&
        this.x < p.x + p.w &&
        this.y + this.height >= p.y &&
        this.y + this.height - this.vy <= p.y + 12
      ) {
        this.y = p.y - this.height;
        this.vy = 0;
        this.isGrounded = true;
        this.hasDoubleJumped = false;
      }
    }
  }

  public jump() {
    if (this.isGrounded) {
      this.vy = -12;
      this.isGrounded = false;
      audioEngine.playDodge();
    } else if (this.isWallSliding) {
      // Wall jump
      this.vy = -11;
      this.vx = this.isFacingRight ? -8 : 8;
      this.isFacingRight = !this.isFacingRight;
      audioEngine.playDodge();
      comicUI.triggerPopup('WALL JUMP!', this.x, this.y, '#f59e0b');
    } else if (this.unlockedWeapons.includes('urumi') && !this.hasDoubleJumped) {
      // Air Double Jump unlocked with Urumi
      this.vy = -10.5;
      this.hasDoubleJumped = true;
      audioEngine.playSlash('urumi');
      comicUI.triggerPopup('AIR DASH!', this.x, this.y, '#38bdf8');
    }
  }

  public dodgeRoll() {
    if (this.isDodging || this.stamina < 20) return;

    this.stamina -= 20;
    this.isDodging = true;
    this.dodgeTimer = 18;
    this.invulnerableTimer = 18;
    this.vx = this.isFacingRight ? 9 : -9;
    audioEngine.playDodge();
    comicUI.triggerPopup('DODGE ROLL!', this.x, this.y, '#10b981');
  }

  public attack(): { x: number; y: number; w: number; h: number; damage: number; weapon: WeaponType } | null {
    if (this.isAttacking || this.isDodging) return null;

    this.isAttacking = true;
    this.attackTimer = 16;
    audioEngine.playSlash(this.currentWeapon);

    let damage = 20;
    let attackWidth = 48;
    let attackHeight = 50;
    let popupText = 'SHHHWIP!';

    if (this.currentWeapon === 'baghnakh') {
      damage = 18;
      attackWidth = 40;
      popupText = 'CLAW SLASH!';
    } else if (this.currentWeapon === 'urumi') {
      damage = 25;
      attackWidth = 85; // Long reach whip
      popupText = 'WHIP SWEEP!';
    } else if (this.currentWeapon === 'katar') {
      damage = 35; // High piercer
      attackWidth = 50;
      popupText = 'PUNCH THRUST!';
    } else if (this.currentWeapon === 'pata') {
      damage = 30;
      attackWidth = 60;
      popupText = 'GAUNTLET CLEAVE!';
    }

    const attackX = this.isFacingRight ? this.x + this.width : this.x - attackWidth;
    const attackY = this.y - 4;

    comicUI.triggerPopup(popupText, attackX + attackWidth / 2, attackY, '#facc15');

    return {
      x: attackX,
      y: attackY,
      w: attackWidth,
      h: attackHeight,
      damage,
      weapon: this.currentWeapon
    };
  }

  public parry() {
    if (this.isParrying || this.isDodging || !this.unlockedWeapons.includes('pata')) {
      if (!this.unlockedWeapons.includes('pata')) {
        comicUI.triggerPopup('REQUIRES PATA GAUNTLET!', this.x, this.y - 20, '#ef4444');
      }
      return;
    }

    this.isParrying = true;
    this.parryTimer = 22;
    audioEngine.playParry();
    comicUI.triggerPopup('PARRY STANCE!', this.x, this.y, '#60a5fa', '#1e3a8a');
  }

  public triggerSolarPulse(): boolean {
    if (this.solarEnergy < 25) {
      comicUI.triggerPopup('LOW LIGHT ENERGY!', this.x, this.y - 20, '#ef4444');
      return false;
    }

    this.solarEnergy -= 25;
    audioEngine.playSolarPulse();
    comicUI.triggerPopup('SOLAR FLASH!', this.x, this.y - 10, '#fbbf24', '#78350f');
    return true;
  }

  public takeDamage(amount: number) {
    if (this.invulnerableTimer > 0 || this.isDodging) return;

    if (this.isParrying) {
      // Perfect parry block!
      audioEngine.playParry();
      comicUI.triggerPopup('PERFECT PARRY!', this.x, this.y, '#38bdf8', '#0284c7');
      this.invulnerableTimer = 20;
      return;
    }

    this.hp -= amount;
    this.invulnerableTimer = 30;
    audioEngine.playHit();
    comicUI.triggerPopup('THWACK!', this.x, this.y, '#ef4444', '#7f1d1d');
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Invulnerability flashing effect
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 3) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    // 1. Draw Rajput Armor Body
    ctx.fillStyle = '#1e293b'; // Slate armor body
    ctx.fillRect(this.x + 4, this.y + 16, 28, 26);

    // 2. Head & Saffron Rajput Turban (Pagh)
    ctx.fillStyle = '#f97316'; // Saffron orange turban
    ctx.beginPath();
    ctx.arc(cx, this.y + 12, 14, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx - 14, this.y + 10, 28, 6);

    // Face
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cx - 10, this.y + 14, 20, 10);

    // 3. Surya-Bija (Solar Seed) Core on Chest
    const seedGrad = ctx.createRadialGradient(cx, this.y + 26, 0, cx, this.y + 26, 8);
    seedGrad.addColorStop(0, '#ffffff');
    seedGrad.addColorStop(0.5, '#fbbf24');
    seedGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = seedGrad;
    ctx.beginPath();
    ctx.arc(cx, this.y + 26, 7, 0, Math.PI * 2);
    ctx.fill();

    // 4. Flowing Rajput Dhoti Skirt
    ctx.fillStyle = '#b45309';
    ctx.fillRect(this.x + 6, this.y + 40, 24, 16);

    // 5. Active Weapon Sprite & Animation
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    const handX = this.isFacingRight ? this.x + this.width + 4 : this.x - 4;
    const handY = this.y + 24;

    if (this.isAttacking) {
      // Weapon Attack Swing Arc
      ctx.save();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      const startAngle = this.isFacingRight ? -Math.PI / 3 : Math.PI + Math.PI / 3;
      const endAngle = this.isFacingRight ? Math.PI / 3 : Math.PI - Math.PI / 3;
      ctx.arc(cx, cy, 38, startAngle, endAngle);
      ctx.stroke();
      ctx.restore();
    } else {
      // Idle / Sheathed weapon stance
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(this.isFacingRight ? handX + 16 : handX - 16, handY - 14);
      ctx.stroke();
    }

    ctx.restore();
  }
}
