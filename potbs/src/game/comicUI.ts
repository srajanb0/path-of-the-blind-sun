// Comic UI & Aesthetic Renderer for Path of the Blind Sun

export interface ComicPopup {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  bgColor?: string;
  scale: number;
  rotation: number;
  lifetime: number; // in frames
  maxLifetime: number;
}

export interface CutsceneDialogue {
  speaker: string;
  avatar: string;
  text: string;
  side: 'left' | 'right';
}

export class ComicUI {
  public popups: ComicPopup[] = [];
  public currentDialogue: CutsceneDialogue | null = null;
  public showHalftone: boolean = true;
  private popupCounter = 0;

  public triggerPopup(text: string, x: number, y: number, color = '#facc15', bgColor = '#dc2626') {
    this.popupCounter++;
    this.popups.push({
      id: `popup_${this.popupCounter}`,
      text,
      x,
      y: y - 10,
      color,
      bgColor,
      scale: 1.4,
      rotation: (Math.random() - 0.5) * 0.4,
      lifetime: 45,
      maxLifetime: 45
    });
  }

  public update() {
    // Update popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i];
      p.lifetime--;
      p.y -= 0.6; // float upwards
      p.scale = Math.max(1, p.scale - 0.01);
      if (p.lifetime <= 0) {
        this.popups.splice(i, 1);
      }
    }
  }

  // Render Golden-Age Comic Book Frame & Panel Gutters
  public renderComicFrame(ctx: CanvasRenderingContext2D, width: number, height: number, pageTitle: string, pageNum: number) {
    ctx.save();

    // 1. Outer Dark Ink Border
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // 2. Inner Golden Comic Panel Line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // 3. Top Banner Issue Header (Classic Comic Style)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 16, width - 32, 38);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(16, 52, width - 32, 3);

    // Issue Info Text
    ctx.font = '900 14px "Comic Sans MS", "Trebuchet MS", sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'left';
    ctx.fillText('TGC COMICS #2026', 30, 40);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 14px sans-serif';
    ctx.fillText(`PATH OF THE BLIND SUN • PAGE ${pageNum} / 18`, 210, 40);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(pageTitle.toUpperCase(), width - 30, 40);

    ctx.restore();
  }

  // Render dynamic action SFX popups ("KAPOW!", "SHHHWIP!", etc.)
  public renderPopups(ctx: CanvasRenderingContext2D) {
    for (const p of this.popups) {
      ctx.save();
      const alpha = p.lifetime / p.maxLifetime;
      ctx.globalAlpha = Math.min(1, alpha * 1.5);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);

      // Starburst background bubble if specified
      if (p.bgColor) {
        ctx.fillStyle = p.bgColor;
        ctx.beginPath();
        const numPoints = 10;
        const outerRadius = 35;
        const innerRadius = 18;
        for (let i = 0; i < numPoints * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const a = (i * Math.PI) / numPoints;
          const bx = Math.cos(a) * r;
          const by = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
        }
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      }

      // Dynamic Ink Text
      ctx.font = '900 24px "Impact", "Comic Sans MS", fantasy';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Thick black shadow / outline
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeText(p.text, 0, 0);

      // Glowing text fill
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, 0, 0);

      ctx.restore();
    }
  }

  // Render Speech Bubble Cutscene overlay
  public renderSpeechBubble(ctx: CanvasRenderingContext2D, width: number, height: number, dialogue: CutsceneDialogue) {
    ctx.save();

    // Dark background tint behind dialogue box
    ctx.fillStyle = 'rgba(10, 10, 18, 0.75)';
    ctx.fillRect(0, 0, width, height);

    const boxWidth = width - 180;
    const boxHeight = 110;
    const boxX = 90;
    const boxY = height - 165;

    // Speech bubble container (White with thick black ink border)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;

    // Rounded rectangle bubble
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 16);
    ctx.fill();
    ctx.stroke();

    // Speaker Name Tag Box
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(boxX + 20, boxY - 18, 180, 28);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX + 20, boxY - 18, 180, 28);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dialogue.speaker.toUpperCase(), boxX + 110, boxY + 1);

    // Dialogue text inside speech bubble
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 16px "Comic Sans MS", "Trebuchet MS", sans-serif';
    ctx.textAlign = 'left';

    // Wrap text into 2-3 lines
    const words = dialogue.text.split(' ');
    let line = '';
    let lineY = boxY + 35;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > boxWidth - 50 && n > 0) {
        ctx.fillText(line, boxX + 30, lineY);
        line = words[n] + ' ';
        lineY += 24;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, boxX + 30, lineY);

    // Continue prompt banner
    ctx.font = '800 12px sans-serif';
    ctx.fillStyle = '#2563eb';
    ctx.textAlign = 'right';
    ctx.fillText('[ PRESS SPACE OR CLICK TO CONTINUE ] ▶', boxX + boxWidth - 20, boxY + boxHeight - 15);

    ctx.restore();
  }

  // Render Halftone Dot Shader Texture Overlay
  public renderHalftoneOverlay(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (!this.showHalftone) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';

    // Subtle 4x4 halftone dot pattern
    for (let x = 0; x < width; x += 6) {
      for (let y = 0; y < height; y += 6) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

export const comicUI = new ComicUI();
