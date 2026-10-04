// Bosses Engine for Path of the Blind Sun

import { audioEngine } from './audioEngine';
import { comicUI, CutsceneDialogue } from './comicUI';
import { WeaponType } from './player';

export type BossId = 'achala' | 'maruta' | 'tejo' | 'jala' | 'mahaketu';

export interface BossReward {
  weapon: WeaponType;
  name: string;
}

export class Boss {
  public id: BossId;
  public name: string;
  public title: string;
  public element: string;
  public x: number;
  public y: number;
  public width: number = 64;
  public height: number = 80;
  public hp: number;
  public maxHp: number;
  public phase: number = 1;

  public vx: number = 0;
  public vy: number = 0;
  public isFacingRight: boolean = false;
  public attackTimer: number = 0;
  public attackCooldown: number = 0;
  public isDead: boolean = false;
  public introDialogue: CutsceneDialogue[];
  public defeatDialogue: CutsceneDialogue[];
  public reward: BossReward | null = null;

  constructor(id: BossId, x = 650, y = 350) {
    this.id = id;
    this.x = x;
    this.y = y;

    if (id === 'achala') {
      this.name = 'Achala Simha';
      this.title = 'The Earth Guardian';
      this.element = 'Earth';
      this.hp = 220;
      this.maxHp = 220;
      this.reward = { weapon: 'baghnakh', name: 'Bagh-Nakh (Tiger Claws)' };
      this.introDialogue = [
        {
          speaker: 'Achala Simha',
          avatar: 'achala',
          text: 'Halt, Rajput warrior! The divine light fragment you carry is a curse, not a savior!',
          side: 'right'
        },
        {
          speaker: 'Vikram',
          avatar: 'vikram',
          text: 'I must reach the Sky Citadel to save our people from darkness! Stand aside!',
          side: 'left'
        },
        {
          speaker: 'Achala Simha',
          avatar: 'achala',
          text: 'Then I shall break your resolve with the power of the earth!',
          side: 'right'
        }
      ];
      this.defeatDialogue = [
        {
          speaker: 'Achala Simha',
          avatar: 'achala',
          text: 'You have defeated me... take my Tiger Claws (Bagh-Nakh)... scale the roots... but beware the shadow...',
          side: 'right'
        }
      ];
    } else if (id === 'maruta') {
      this.name = 'Maruta-Vega';
      this.title = 'The Air Guardian';
      this.element = 'Air';
      this.hp = 280;
      this.maxHp = 280;
      this.reward = { weapon: 'urumi', name: 'Urumi (Whip-Sword)' };
      this.introDialogue = [
        {
          speaker: 'Maruta-Vega',
          avatar: 'maruta',
          text: 'Achala could not stop you... but the howling winds of the stepwell shall shred your false hope!',
          side: 'right'
        },
        {
          speaker: 'Vikram',
          avatar: 'vikram',
          text: 'Why do all the elemental guardians fight me? I am delivering the solar seed!',
          side: 'left'
        },
        {
          speaker: 'Maruta-Vega',
          avatar: 'maruta',
          text: 'Because you do not deliver salvation—you carry Mahaketu’s key to the cosmic seal!',
          side: 'right'
        }
      ];
      this.defeatDialogue = [
        {
          speaker: 'Maruta-Vega',
          avatar: 'maruta',
          text: 'The wind whispers the tragic truth... take my Urumi whip-sword and leap across the flooded deep...',
          side: 'right'
        }
      ];
    } else if (id === 'tejo') {
      this.name = 'Tejo-Bala';
      this.title = 'The Fire Guardian';
      this.element = 'Fire';
      this.hp = 340;
      this.maxHp = 340;
      this.reward = { weapon: 'katar', name: 'Katar (Punch Dagger)' };
      this.introDialogue = [
        {
          speaker: 'Tejo-Bala',
          avatar: 'tejo',
          text: 'Welcome to the Iron Gorge! Your foolish journey ends in molten flame!',
          side: 'right'
        },
        {
          speaker: 'Vikram',
          avatar: 'vikram',
          text: 'I have sworn an oath! Nothing will halt my ascent!',
          side: 'left'
        },
        {
          speaker: 'Tejo-Bala',
          avatar: 'tejo',
          text: 'Your pure intent is his conduit, Vikram! Mahaketu laughs as you march into his trap!',
          side: 'right'
        }
      ];
      this.defeatDialogue = [
        {
          speaker: 'Tejo-Bala',
          avatar: 'tejo',
          text: 'Flame fades... take my Katar punch dagger to shatter the heavy armor ahead...',
          side: 'right'
        }
      ];
    } else if (id === 'jala') {
      this.name = 'Jala-Taranga';
      this.title = 'The Water Guardian';
      this.element = 'Water';
      this.hp = 400;
      this.maxHp = 400;
      this.reward = { weapon: 'pata', name: 'Pata (Gauntlet Sword)' };
      this.introDialogue = [
        {
          speaker: 'Jala-Taranga',
          avatar: 'jala',
          text: 'This is the threshold of the Sky Citadel. Beyond lies only eternal night!',
          side: 'right'
        },
        {
          speaker: 'Jala-Taranga',
          avatar: 'jala',
          text: 'Look at the sky! The solar eclipse has already begun! The Surya-Bija is the void sorcerer’s core!',
          side: 'right'
        },
        {
          speaker: 'Vikram',
          avatar: 'vikram',
          text: 'No... it cannot be! I was chosen to save the sun!',
          side: 'left'
        }
      ];
      this.defeatDialogue = [
        {
          speaker: 'Jala-Taranga',
          avatar: 'jala',
          text: 'Take my Pata gauntlet sword... shatter the Surya-Bija before Mahaketu devours all creation!',
          side: 'right'
        }
      ];
    } else {
      // Final Boss Mahaketu
      this.name = 'Mahaketu, the Shadow Asura';
      this.title = 'The Void Sorcerer';
      this.element = 'Shadow';
      this.hp = 600;
      this.maxHp = 600;
      this.width = 84;
      this.height = 100;
      this.introDialogue = [
        {
          speaker: 'Mahaketu',
          avatar: 'mahaketu',
          text: 'Hahaha! You brought it to me! The final Surya-Bija seed to shatter the seven cosmic seals!',
          side: 'right'
        },
        {
          speaker: 'Vikram',
          avatar: 'vikram',
          text: 'You deceived me, Asura! But I will not let you destroy this world!',
          side: 'left'
        },
        {
          speaker: 'Mahaketu',
          avatar: 'mahaketu',
          text: 'Too late, noble fool! Bask in the radiance of the Eternal Eclipse!',
          side: 'right'
        }
      ];
      this.defeatDialogue = [
        {
          speaker: 'Vikram',
          avatar: 'vikram',
          text: 'Forgive me, solar divine... I must shatter the seed to destroy the shadow forever!',
          side: 'left'
        }
      ];
    }
  }

  public update(playerX: number, playerY: number): { type: 'attack'; damage: number; name: string } | null {
    if (this.isDead) return null;

    if (this.attackCooldown > 0) this.attackCooldown--;

    // Facing & Movement logic
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy);

    this.isFacingRight = dx > 0;

    // Boss Boss Attack Patterns
    if (dist > 60) {
      this.vx = this.isFacingRight ? 2.5 : -2.5;
    } else {
      this.vx = 0;
    }

    this.x += this.vx;

    // Trigger attack on player
    if (dist < 75 && this.attackCooldown === 0) {
      this.attackCooldown = 65;
      audioEngine.playBossRoar();

      let damage = 22;
      let attackName = 'GUARDIAN STRIKE';

      if (this.id === 'achala') attackName = 'EARTHQUAKE SLAM';
      else if (this.id === 'maruta') attackName = 'TORNADO SLASH';
      else if (this.id === 'tejo') attackName = 'VOLCANIC BURST';
      else if (this.id === 'jala') attackName = 'TIDAL SURGE';
      else if (this.id === 'mahaketu') {
        damage = 35;
        attackName = 'VOID ECLIPSE BLAST';
      }

      comicUI.triggerPopup(attackName, this.x + this.width / 2, this.y - 10, '#ef4444', '#450a0a');
      return { type: 'attack', damage, name: attackName };
    }

    return null;
  }

  public takeDamage(amount: number): boolean {
    if (this.isDead) return false;

    this.hp -= amount;

    // Phase shift for Mahaketu
    if (this.id === 'mahaketu' && this.hp < 300 && this.phase === 1) {
      this.phase = 2;
      audioEngine.playBossRoar();
      comicUI.triggerPopup('PHASE 2: COSMIC ECLIPSE!', this.x, this.y - 30, '#a855f7', '#3b0764');
    }

    if (this.hp <= 0) {
      this.isDead = true;
      audioEngine.playBossRoar();
      comicUI.triggerPopup('GUARDIAN VANQUISHED!', this.x + this.width / 2, this.y - 20, '#38bdf8', '#0369a1');
      return true;
    } else {
      audioEngine.playHit();
      return false;
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (this.isDead) return;

    ctx.save();
    const cx = this.x + this.width / 2;

    if (this.id === 'achala') {
      // Earth Stone Armor Guardian
      ctx.fillStyle = '#451a03';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(this.x + 8, this.y + 12, this.width - 16, 24);
    } else if (this.id === 'maruta') {
      // Air Swift Guardian
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(this.x + 10, this.y + 16, this.width - 20, 20);
    } else if (this.id === 'tejo') {
      // Volcanic Fire Guardian
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(this.x + 6, this.y + 10, this.width - 12, 28);
    } else if (this.id === 'jala') {
      // Water Guardian
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(this.x + 8, this.y + 14, this.width - 16, 22);
    } else {
      // Mahaketu Final Void Asura
      const isPhase2 = this.phase === 2;
      ctx.fillStyle = isPhase2 ? '#2e1065' : '#09090b';
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Glowing multi-eyes of Void Asura
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(cx - 16, this.y + 24, 6, 0, Math.PI * 2);
      ctx.arc(cx + 16, this.y + 24, 6, 0, Math.PI * 2);
      ctx.arc(cx, this.y + 14, 8, 0, Math.PI * 2);
      ctx.fill();

      // Cosmic aura ring
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.strokeRect(this.x - 6, this.y - 6, this.width + 12, this.height + 12);
    }

    // Boss Health Bar Header (Top Screen Style)
    ctx.restore();
  }
}
