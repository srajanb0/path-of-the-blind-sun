// Light Engine for Path of the Blind Sun

export interface LightSource {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  color: string;
}

export interface Mirror {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number; // in degrees
  id: string;
  isActivated?: boolean;
}

export interface LightRay {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export class LightEngine {
  public lightSources: LightSource[] = [];
  public mirrors: Mirror[] = [];
  public activeRays: LightRay[] = [];
  public ambientDarkness: number = 0.85; // 0 = bright, 1 = pitch black

  public reset() {
    this.lightSources = [];
    this.mirrors = [];
    this.activeRays = [];
  }

  public setDarkness(level: number) {
    this.ambientDarkness = Math.max(0, Math.min(0.95, level));
  }

  public addLightSource(source: LightSource) {
    this.lightSources.push(source);
  }

  // Calculate light beam reflection from a light emitter source through interactive mirrors
  public calculateMirrorReflections(startX: number, startY: number, dirX: number, dirY: number, maxBounces = 3): LightRay[] {
    const rays: LightRay[] = [];
    let curX = startX;
    let curY = startY;
    let dx = dirX;
    let dy = dirY;

    for (let bounce = 0; bounce < maxBounces; bounce++) {
      let closestDist = 800; // max ray length per segment
      let endX = curX + dx * closestDist;
      let endY = curY + dy * closestDist;
      let hitMirror: Mirror | null = null;

      // Check collision with mirrors
      for (const mirror of this.mirrors) {
        // Simple bounding check for ray intersection with mirror center
        const mx = mirror.x + mirror.width / 2;
        const my = mirror.y + mirror.height / 2;
        const dist = Math.hypot(mx - curX, my - curY);

        if (dist < closestDist && dist > 10) {
          // Check if ray is pointing towards mirror
          const dot = (mx - curX) * dx + (my - curY) * dy;
          if (dot > 0) {
            closestDist = dist;
            endX = mx;
            endY = my;
            hitMirror = mirror;
          }
        }
      }

      rays.push({ startX: curX, startY: curY, endX, endY });

      if (hitMirror) {
        hitMirror.isActivated = true;
        // Reflect angle
        const rad = (hitMirror.angle * Math.PI) / 180;
        const normalX = Math.cos(rad);
        const normalY = Math.sin(rad);

        // r = d - 2(d . n)n
        const dot = dx * normalX + dy * normalY;
        dx = dx - 2 * dot * normalX;
        dy = dy - 2 * dot * normalY;

        curX = endX;
        curY = endY;
      } else {
        break;
      }
    }

    this.activeRays = rays;
    return rays;
  }

  // Draw dynamic darkness mask over canvas with glowing radial light sources
  public renderLightMask(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerX: number,
    playerY: number,
    suryaBijaRadius: number,
    pulseActive: boolean
  ) {
    if (this.ambientDarkness <= 0.05) return; // Full daylight level

    // Create offscreen dark overlay
    ctx.save();
    ctx.fillStyle = `rgba(5, 5, 12, ${this.ambientDarkness})`;
    ctx.fillRect(0, 0, width, height);

    // Punch out radial lights using destination-out composite mode
    ctx.globalCompositeOperation = 'destination-out';

    // Player's Surya-Bija (Solar Seed) light source
    const playerRadius = pulseActive ? suryaBijaRadius * 2.5 : suryaBijaRadius;
    const pGrad = ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, playerRadius);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.4, 'rgba(255, 240, 180, 0.8)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Additional light sources (Light Altars, Torches, Solar Orbs)
    for (const src of this.lightSources) {
      const grad = ctx.createRadialGradient(src.x, src.y, 0, src.x, src.y, src.radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.6, 'rgba(255, 220, 120, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(src.x, src.y, src.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Render light beams / rays if active
    if (this.activeRays.length > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 235, 120, 0.85)';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;

      for (const ray of this.activeRays) {
        ctx.beginPath();
        ctx.moveTo(ray.startX, ray.startY);
        ctx.lineTo(ray.endX, ray.endY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Check if a point is within active light range
  public isPointIlluminated(x: number, y: number, playerX: number, playerY: number, playerLightRadius: number): boolean {
    if (this.ambientDarkness < 0.3) return true;

    // Check player light distance
    const dPlayer = Math.hypot(x - playerX, y - playerY);
    if (dPlayer < playerLightRadius) return true;

    // Check other light sources
    for (const src of this.lightSources) {
      if (Math.hypot(x - src.x, y - src.y) < src.radius) {
        return true;
      }
    }

    return false;
  }
}

export const lightEngine = new LightEngine();
