import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from './game/audioEngine';
import { comicUI } from './game/comicUI';
import { GameEngine } from './game/engine';
import { LEVELS } from './game/levelData';
import { WeaponType } from './game/player';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // UI States
  const [currentHp, setCurrentHp] = useState(100);
  const [currentStamina, setCurrentStamina] = useState(100);
  const [currentSolar, setCurrentSolar] = useState(100);
  const [activeWeapon, setActiveWeapon] = useState<WeaponType>('talwar');
  const [unlockedWeapons, setUnlockedWeapons] = useState<WeaponType[]>(['talwar']);

  const [currentPage, setCurrentPage] = useState(1);
  const [showComicReader, setShowComicReader] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [halftoneEnabled, setHalftoneEnabled] = useState(true);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameVictory, setIsGameVictory] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current);
    engineRef.current = engine;
    engine.start();

    // Sync UI states on ticker
    const timer = setInterval(() => {
      if (engineRef.current) {
        const p = engineRef.current.player;
        setCurrentHp(Math.max(0, Math.round(p.hp)));
        setCurrentStamina(Math.max(0, Math.round(p.stamina)));
        setCurrentSolar(Math.max(0, Math.round(p.solarEnergy)));
        setActiveWeapon(p.currentWeapon);
        setUnlockedWeapons([...p.unlockedWeapons]);
        setCurrentPage(engineRef.current.currentLevelNum);
        setIsGameOver(engineRef.current.isGameOver);
        setIsGameVictory(engineRef.current.isGameVictory);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      engine.stop();
    };
  }, []);

  const handleWeaponSelect = (w: WeaponType) => {
    if (engineRef.current) {
      engineRef.current.player.selectWeapon(w);
      setActiveWeapon(w);
    }
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleHalftone = () => {
    comicUI.showHalftone = !halftoneEnabled;
    setHalftoneEnabled(!halftoneEnabled);
  };

  const handlePageJump = (pageNum: number) => {
    if (engineRef.current) {
      engineRef.current.loadLevel(pageNum);
      setShowComicReader(false);
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restartGame();
    }
  };

  // Touch / Button controls simulation
  const sendKey = (code: string, isDown: boolean) => {
    window.dispatchEvent(new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code }));
  };

  return (
    <div id="app">
      {/* Top Banner Issue Header */}
      <header className="comic-header">
        <div className="game-title-badge">
          <span className="jam-badge">TGC Jam 2026</span>
          <span className="title-text">PATH OF THE BLIND SUN</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ctrl-btn" onClick={() => setShowComicReader(true)}>
            📖 18-PAGE COMIC MAP
          </button>
          <button className="ctrl-btn" onClick={handleToggleHalftone}>
            🎨 HALFTONE: {halftoneEnabled ? 'ON' : 'OFF'}
          </button>
          <button className="ctrl-btn" onClick={handleToggleMute}>
            {isMuted ? '🔇 MUTED' : '🔊 SOUND'}
          </button>
        </div>
      </header>

      {/* Main Game Viewport Wrapper */}
      <div className="game-viewport-wrapper">
        <canvas ref={canvasRef} id="game-canvas" width={1024} height={768} />

        {/* Live HUD Overlay */}
        <div className="hud-overlay">
          <div className="stat-bar-container">
            <span className="stat-label" style={{ color: '#ef4444' }}>
              HP {currentHp}
            </span>
            <div className="stat-bar-bg">
              <div className="stat-bar-fill fill-hp" style={{ width: `${currentHp}%` }} />
            </div>
          </div>
          <div className="stat-bar-container">
            <span className="stat-label" style={{ color: '#10b981' }}>
              STM {currentStamina}
            </span>
            <div className="stat-bar-bg">
              <div className="stat-bar-fill fill-stamina" style={{ width: `${currentStamina}%` }} />
            </div>
          </div>
          <div className="stat-bar-container">
            <span className="stat-label" style={{ color: '#fbbf24' }}>
              SUN {currentSolar}
            </span>
            <div className="stat-bar-bg">
              <div className="stat-bar-fill fill-solar" style={{ width: `${currentSolar}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Weapon Selector Bar */}
        <div className="weapon-bar">
          <button
            className={`weapon-btn ${activeWeapon === 'talwar' ? 'active' : ''}`}
            onClick={() => handleWeaponSelect('talwar')}
          >
            ⚔️ TALWAR
          </button>
          <button
            className={`weapon-btn ${unlockedWeapons.includes('baghnakh') ? '' : 'locked'} ${
              activeWeapon === 'baghnakh' ? 'active' : ''
            }`}
            onClick={() => handleWeaponSelect('baghnakh')}
          >
            🐾 BAGH-NAKH
          </button>
          <button
            className={`weapon-btn ${unlockedWeapons.includes('urumi') ? '' : 'locked'} ${
              activeWeapon === 'urumi' ? 'active' : ''
            }`}
            onClick={() => handleWeaponSelect('urumi')}
          >
            🌀 URUMI
          </button>
          <button
            className={`weapon-btn ${unlockedWeapons.includes('katar') ? '' : 'locked'} ${
              activeWeapon === 'katar' ? 'active' : ''
            }`}
            onClick={() => handleWeaponSelect('katar')}
          >
            🗡️ KATAR
          </button>
          <button
            className={`weapon-btn ${unlockedWeapons.includes('pata') ? '' : 'locked'} ${
              activeWeapon === 'pata' ? 'active' : ''
            }`}
            onClick={() => handleWeaponSelect('pata')}
          >
            🛡️ PATA
          </button>
        </div>

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="game-state-overlay">
            <div className="state-title title-defeat">VIKRAM HAS FALLEN</div>
            <div className="state-subtitle">
              The darkness devours the Surya-Bija seed. Reclaim your Rajput honor and try again!
            </div>
            <button className="action-btn-large" onClick={handleRestart}>
              RETRY PAGE 1
            </button>
          </div>
        )}

        {/* Game Victory Screen */}
        {isGameVictory && (
          <div className="game-state-overlay">
            <div className="state-title title-victory">VICTORY OVER MAHAKETU</div>
            <div className="state-subtitle">
              By shattering the Surya-Bija, Vikram broke Mahaketu's void seal and banished the Asura back into the cosmic abyss!
              The sun shines once more over medieval India!
            </div>
            <button className="action-btn-large" onClick={handleRestart}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Touch / On-Screen Gamepad */}
      <div className="gamepad-container">
        <div className="btn-group">
          <button
            className="ctrl-btn"
            onMouseDown={() => sendKey('KeyA', true)}
            onMouseUp={() => sendKey('KeyA', false)}
            onTouchStart={() => sendKey('KeyA', true)}
            onTouchEnd={() => sendKey('KeyA', false)}
          >
            ◀ LEFT
          </button>
          <button
            className="ctrl-btn"
            onMouseDown={() => sendKey('KeyD', true)}
            onMouseUp={() => sendKey('KeyD', false)}
            onTouchStart={() => sendKey('KeyD', true)}
            onTouchEnd={() => sendKey('KeyD', false)}
          >
            RIGHT ▶
          </button>
          <button
            className="ctrl-btn"
            onMouseDown={() => sendKey('KeyW', true)}
            onMouseUp={() => sendKey('KeyW', false)}
            onTouchStart={() => sendKey('KeyW', true)}
            onTouchEnd={() => sendKey('KeyW', false)}
          >
            ▲ JUMP
          </button>
        </div>

        <div className="btn-group">
          <button className="ctrl-btn btn-action" onClick={() => sendKey('KeyJ', true)}>
            ⚔️ MELEE ATTACK (J)
          </button>
          <button className="ctrl-btn btn-solar" onClick={() => sendKey('KeyK', true)}>
            ☀️ SOLAR FLASH (K)
          </button>
          <button className="ctrl-btn" onClick={() => sendKey('ShiftLeft', true)}>
            🏃 DODGE (SHIFT)
          </button>
          <button className="ctrl-btn" onClick={() => sendKey('KeyI', true)}>
            🛡️ PARRY (I)
          </button>
        </div>
      </div>

      {/* 18-Page Interactive Comic Reader Modal */}
      {showComicReader && (
        <div className="modal-backdrop">
          <div className="comic-reader-modal">
            <div className="modal-header">
              <div className="modal-title">📖 ISSUE #2026: 18-PAGE CONTINUOUS LEVEL MAP</div>
              <button className="close-btn" onClick={() => setShowComicReader(false)}>
                ✕ CLOSE
              </button>
            </div>
            <div className="pages-grid">
              {Object.values(LEVELS).map((lvl) => (
                <div key={lvl.pageNumber} className="page-card">
                  <div>
                    <div className="page-card-num">PAGE {lvl.pageNumber} OF 18</div>
                    <div className="page-card-title">{lvl.title}</div>
                    <div className="page-card-env">
                      PHASE {lvl.phase}: {lvl.environment}
                    </div>
                  </div>
                  <button className="page-card-btn" onClick={() => handlePageJump(lvl.pageNumber)}>
                    JUMP TO PAGE {lvl.pageNumber} ▶
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}