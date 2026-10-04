// Level Data & 18-Page Structure for Path of the Blind Sun

import { Boss, BossId } from './bosses';
import { Enemy, EnemyType } from './enemies';
import { LightSource, Mirror } from './lightEngine';

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'stone' | 'wood' | 'lava' | 'water' | 'root';
}

export interface LevelData {
  pageNumber: number;
  phase: number;
  title: string;
  environment: string;
  darkness: number; // 0 = bright, 1 = pitch black
  platforms: Platform[];
  lightSources: LightSource[];
  mirrors: Mirror[];
  enemies: Array<{ type: EnemyType; x: number; y: number }>;
  bossId?: BossId;
  doorX: number;
  doorY: number;
  startX: number;
  startY: number;
  narrationText: string;
}

export const LEVELS: Record<number, LevelData> = {
  1: {
    pageNumber: 1,
    phase: 1,
    title: 'The Burnt Village',
    environment: 'Scorched Valley',
    darkness: 0.35,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 400,
    narrationText: 'Deep in the Scorched Valley, Vikram of the fallen Rajput clan begins his desperate quest to deliver the divine Surya-Bija...',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 250, y: 400, w: 160, h: 20, type: 'wood' },
      { x: 500, y: 320, w: 180, h: 20, type: 'stone' },
      { x: 750, y: 420, w: 200, h: 20, type: 'wood' }
    ],
    lightSources: [
      { x: 100, y: 460, radius: 140, intensity: 1, color: '#f59e0b' },
      { x: 920, y: 380, radius: 180, intensity: 1, color: '#fbbf24' }
    ],
    mirrors: [],
    enemies: [
      { type: 'pishacha', x: 400, y: 460 },
      { type: 'pishacha', x: 800, y: 380 }
    ]
  },

  2: {
    pageNumber: 2,
    phase: 1,
    title: 'The Whispering Canyon',
    environment: 'Scorched Valley',
    darkness: 0.65,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 280,
    narrationText: 'Navigating narrow canyon cliffs as shadow entities whisper ancient prophecies from pitch-black crevices...',
    platforms: [
      { x: 0, y: 500, w: 300, h: 60, type: 'stone' },
      { x: 360, y: 430, w: 140, h: 20, type: 'stone' },
      { x: 560, y: 360, w: 150, h: 20, type: 'stone' },
      { x: 780, y: 320, w: 244, h: 60, type: 'stone' }
    ],
    lightSources: [
      { x: 60, y: 460, radius: 120, intensity: 1, color: '#f59e0b' }
    ],
    mirrors: [],
    enemies: [
      { type: 'pishacha', x: 400, y: 390 },
      { type: 'pishacha', x: 600, y: 320 },
      { type: 'naga', x: 850, y: 260 }
    ]
  },

  3: {
    pageNumber: 3,
    phase: 1,
    title: 'The Solar Shard Altar',
    environment: 'Scorched Valley',
    darkness: 0.8,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    narrationText: 'Inside a pitch-black Vedic vault, Vikram awakens the radiant Surya-Bija light core to pierce the shadow darkness...',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 300, y: 380, w: 420, h: 24, type: 'stone' }
    ],
    lightSources: [
      { x: 512, y: 340, radius: 250, intensity: 1, color: '#fbbf24' }
    ],
    mirrors: [],
    enemies: [
      { type: 'pishacha', x: 350, y: 460 },
      { type: 'pishacha', x: 650, y: 460 }
    ]
  },

  4: {
    pageNumber: 4,
    phase: 1,
    title: 'Mountain Slopes',
    environment: 'Scorched Valley',
    darkness: 0.4,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 220,
    narrationText: 'Emerging onto mountain slopes, gazing toward the Canopy of Whispers where the first Elemental Guardian awaits...',
    platforms: [
      { x: 0, y: 500, w: 260, h: 60, type: 'stone' },
      { x: 300, y: 410, w: 180, h: 20, type: 'stone' },
      { x: 520, y: 330, w: 180, h: 20, type: 'stone' },
      { x: 740, y: 260, w: 284, h: 60, type: 'stone' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'naga', x: 350, y: 360 },
      { type: 'pishacha', x: 580, y: 280 }
    ]
  },

  5: {
    pageNumber: 5,
    phase: 2,
    title: 'Overgrowth Ruins (Boss 1)',
    environment: 'Canopy of Whispers',
    darkness: 0.45,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    bossId: 'achala',
    narrationText: 'PAGE 5: Achala Simha, Earth Guardian of the overgrown ruins, steps forth to block Vikram’s path!',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 200, y: 380, w: 150, h: 20, type: 'stone' },
      { x: 674, y: 380, w: 150, h: 20, type: 'stone' }
    ],
    lightSources: [
      { x: 512, y: 200, radius: 220, intensity: 1, color: '#f59e0b' }
    ],
    mirrors: [],
    enemies: []
  },

  6: {
    pageNumber: 6,
    phase: 2,
    title: 'Canopy of Whispers',
    environment: 'Canopy of Whispers',
    darkness: 0.7,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 200,
    narrationText: 'Armed with the Tiger Claws (Bagh-Nakh), Vikram scales vertical vines and jungle roots high above the canopy floor...',
    platforms: [
      { x: 0, y: 500, w: 250, h: 60, type: 'root' },
      { x: 280, y: 400, w: 120, h: 20, type: 'root' },
      { x: 460, y: 310, w: 120, h: 20, type: 'root' },
      { x: 640, y: 240, w: 384, h: 40, type: 'root' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'pishacha', x: 300, y: 360 },
      { type: 'naga', x: 750, y: 180 }
    ]
  },

  7: {
    pageNumber: 7,
    phase: 2,
    title: 'Hanging Roots',
    environment: 'Canopy of Whispers',
    darkness: 0.75,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    narrationText: 'Deep in dense foliage where pitch darkness lurks between giant roots, Naga mercenaries set a lethal trap...',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'root' },
      { x: 250, y: 380, w: 180, h: 20, type: 'root' },
      { x: 580, y: 380, w: 180, h: 20, type: 'root' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'naga', x: 300, y: 440 },
      { type: 'naga', x: 620, y: 440 },
      { type: 'pishacha', x: 800, y: 440 }
    ]
  },

  8: {
    pageNumber: 8,
    phase: 2,
    title: 'Jungle River Crossing',
    environment: 'Canopy of Whispers',
    darkness: 0.5,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 340,
    narrationText: 'Crossing slippery river logs toward the subterranean stepwell entrance...',
    platforms: [
      { x: 0, y: 500, w: 220, h: 60, type: 'root' },
      { x: 280, y: 460, w: 140, h: 20, type: 'wood' },
      { x: 480, y: 420, w: 140, h: 20, type: 'wood' },
      { x: 680, y: 380, w: 344, h: 40, type: 'stone' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'pishacha', x: 320, y: 420 },
      { type: 'naga', x: 800, y: 320 }
    ]
  },

  9: {
    pageNumber: 9,
    phase: 3,
    title: 'Subterranean Wind Shafts (Boss 2)',
    environment: 'Subterranean Stepwell',
    darkness: 0.6,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    bossId: 'maruta',
    narrationText: 'PAGE 9: Maruta-Vega, the Air Guardian, unleashes violent wind tornadoes in the subterranean stepwell!',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 220, y: 360, w: 140, h: 20, type: 'stone' },
      { x: 660, y: 360, w: 140, h: 20, type: 'stone' }
    ],
    lightSources: [
      { x: 512, y: 220, radius: 240, intensity: 1, color: '#38bdf8' }
    ],
    mirrors: [],
    enemies: []
  },

  10: {
    pageNumber: 10,
    phase: 3,
    title: 'Stepwell Mirror Hall (Puzzle 1)',
    environment: 'Subterranean Stepwell',
    darkness: 0.85,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    narrationText: 'Rotate the ancient Sun-Mirror to bounce the Surya-Bija light beam into the solar lock to open the flooded stepwell gate!',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 400, y: 380, w: 220, h: 20, type: 'stone' }
    ],
    lightSources: [
      { x: 60, y: 420, radius: 180, intensity: 1, color: '#f59e0b' }
    ],
    mirrors: [
      { id: 'm1', x: 480, y: 330, width: 40, height: 40, angle: 45 }
    ],
    enemies: [
      { type: 'pishacha', x: 450, y: 460 },
      { type: 'pishacha', x: 750, y: 460 }
    ]
  },

  11: {
    pageNumber: 11,
    phase: 3,
    title: 'Flooded Canals (Puzzle 2)',
    environment: 'Subterranean Stepwell',
    darkness: 0.9,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 240,
    narrationText: 'Pitch darkness envelopes the submerged canal. Use Urumi whip-jumps to cross dark water traps!',
    platforms: [
      { x: 0, y: 500, w: 220, h: 60, type: 'stone' },
      { x: 300, y: 420, w: 120, h: 20, type: 'stone' },
      { x: 480, y: 340, w: 120, h: 20, type: 'stone' },
      { x: 660, y: 280, w: 364, h: 40, type: 'stone' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'naga', x: 320, y: 360 },
      { type: 'pishacha', x: 750, y: 220 }
    ]
  },

  12: {
    pageNumber: 12,
    phase: 3,
    title: 'Flooding Chamber Escape',
    environment: 'Subterranean Stepwell',
    darkness: 0.8,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 180,
    narrationText: 'The stepwell locks rupture! Scale the vertical stepwell ledges before rising waters submerge the chamber!',
    platforms: [
      { x: 0, y: 500, w: 200, h: 60, type: 'stone' },
      { x: 240, y: 420, w: 140, h: 20, type: 'stone' },
      { x: 440, y: 340, w: 140, h: 20, type: 'stone' },
      { x: 640, y: 250, w: 140, h: 20, type: 'stone' },
      { x: 820, y: 200, w: 204, h: 40, type: 'stone' }
    ],
    lightSources: [
      { x: 920, y: 160, radius: 200, intensity: 1, color: '#fbbf24' }
    ],
    mirrors: [],
    enemies: [
      { type: 'pishacha', x: 480, y: 290 },
      { type: 'vajra', x: 860, y: 140 }
    ]
  },

  13: {
    pageNumber: 13,
    phase: 4,
    title: 'Iron Gorge Viaduct',
    environment: 'Iron Gorge & Obsidian Ruins',
    darkness: 0.5,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 360,
    narrationText: 'Entering the volcanic Iron Gorge. Iron bridges crumble above rivers of molten obsidian...',
    platforms: [
      { x: 0, y: 500, w: 240, h: 60, type: 'stone' },
      { x: 300, y: 440, w: 150, h: 20, type: 'stone' },
      { x: 520, y: 400, w: 150, h: 20, type: 'stone' },
      { x: 740, y: 380, w: 284, h: 40, type: 'stone' }
    ],
    lightSources: [
      { x: 400, y: 480, radius: 160, intensity: 1, color: '#ef4444' }
    ],
    mirrors: [],
    enemies: [
      { type: 'vajra', x: 780, y: 315 }
    ]
  },

  14: {
    pageNumber: 14,
    phase: 4,
    title: 'Rope-Bridge Crossings',
    environment: 'Iron Gorge & Obsidian Ruins',
    darkness: 0.6,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 280,
    narrationText: 'Swaying rope-bridges suspended over volcanic chasms guarded by heavyweight Vajra-Brutes...',
    platforms: [
      { x: 0, y: 500, w: 220, h: 60, type: 'stone' },
      { x: 260, y: 420, w: 180, h: 20, type: 'wood' },
      { x: 500, y: 340, w: 180, h: 20, type: 'wood' },
      { x: 740, y: 300, w: 284, h: 40, type: 'stone' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'vajra', x: 300, y: 350 },
      { type: 'naga', x: 560, y: 280 }
    ]
  },

  15: {
    pageNumber: 15,
    phase: 4,
    title: 'Obsidian Fortress Threshold',
    environment: 'Iron Gorge & Obsidian Ruins',
    darkness: 0.85,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    narrationText: 'Pitch darkness shrouds the obsidian citadel gates. Elite Vajra guards defend the volcanic courtyard...',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 300, y: 380, w: 420, h: 20, type: 'stone' }
    ],
    lightSources: [],
    mirrors: [],
    enemies: [
      { type: 'vajra', x: 350, y: 310 },
      { type: 'naga', x: 600, y: 310 }
    ]
  },

  16: {
    pageNumber: 16,
    phase: 4,
    title: 'Volcanic Courtyard (Boss 3)',
    environment: 'Iron Gorge & Obsidian Ruins',
    darkness: 0.45,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    bossId: 'tejo',
    narrationText: 'PAGE 16: Tejo-Bala, the Fire Guardian, erupts in volcanic flames to halt Vikram’s ascent!',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 200, y: 360, w: 150, h: 20, type: 'stone' },
      { x: 674, y: 360, w: 150, h: 20, type: 'stone' }
    ],
    lightSources: [
      { x: 512, y: 200, radius: 260, intensity: 1, color: '#f97316' }
    ],
    mirrors: [],
    enemies: []
  },

  17: {
    pageNumber: 17,
    phase: 5,
    title: 'Sky Citadel Threshold (Boss 4)',
    environment: 'Sky Citadel',
    darkness: 0.7,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    bossId: 'jala',
    narrationText: 'PAGE 17: Jala-Taranga, Water Guardian of the Sky Citadel, reveals the horrifying truth about Mahaketu’s manipulation!',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 220, y: 360, w: 140, h: 20, type: 'stone' },
      { x: 660, y: 360, w: 140, h: 20, type: 'stone' }
    ],
    lightSources: [
      { x: 512, y: 200, radius: 240, intensity: 1, color: '#60a5fa' }
    ],
    mirrors: [],
    enemies: []
  },

  18: {
    pageNumber: 18,
    phase: 5,
    title: 'Sanctum of the Eclipse (Final Boss)',
    environment: 'Sanctum of the Eclipse',
    darkness: 0.9,
    startX: 60,
    startY: 420,
    doorX: 920,
    doorY: 420,
    bossId: 'mahaketu',
    narrationText: 'PAGE 18: THE FINAL CONFRONTATION! Mahaketu the Shadow Asura attempts to unleash eternal darkness. Shatter the Surya-Bija to destroy him!',
    platforms: [
      { x: 0, y: 500, w: 1024, h: 60, type: 'stone' },
      { x: 180, y: 360, w: 160, h: 20, type: 'stone' },
      { x: 684, y: 360, w: 160, h: 20, type: 'stone' }
    ],
    lightSources: [
      { x: 512, y: 220, radius: 280, intensity: 1, color: '#a855f7' }
    ],
    mirrors: [],
    enemies: []
  }
};
