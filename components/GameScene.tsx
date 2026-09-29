import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LevelConfig, Fruit, FruitType, ObstacleType, Obstacle, Skin } from '../types';
import { ORCHARD_BG, FRUIT_ICONS, OBSTACLE_ICONS, SKINS } from '../constants';
import { 
  useWindSystem, 
  calculateFruitSway, 
  WindEffectsOverlay, 
  WindHUD, 
  HangingFruit 
} from './WindSystem';

interface GameSceneProps {
  level: LevelConfig;
  onComplete: (score: number, fruitsCut: number, totalFruits: number) => void;
  onQuit: () => void;
  equippedSkin?: Skin;
  customFruits?: Fruit[];
  customObstacles?: Obstacle[];
  turnTitle?: string;
}

export const BoomerangSVG: React.FC<{ className?: string, opacity?: number, speedFactor?: number, isImpacted?: boolean, skin?: Skin }> = ({ 
  className, 
  opacity = 1, 
  speedFactor = 0, 
  isImpacted = false,
  skin = SKINS[0]
}) => {
  const gradId = `boomGrad-${skin.id}`;
  
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ width: '80px', height: '80px', opacity, transition: 'filter 0.1s' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: isImpacted ? '#fff' : (speedFactor > 0.8 || skin.glow ? skin.colors[0] : skin.colors[0]), stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: isImpacted ? '#fff' : (speedFactor > 0.8 || skin.glow ? skin.colors[1] : skin.colors[1]), stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: isImpacted ? '#fff' : skin.colors[2], stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="impactGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feFlood floodColor="white" result="flood" />
          <feComposite in="flood" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path 
        d="M 15 85 Q 50 10 85 85 L 75 90 Q 50 30 25 90 Z" 
        fill={`url(#${gradId})`} 
        stroke={isImpacted ? "#fff" : "rgba(0,0,0,0.3)"} 
        strokeWidth="2.5"
        filter={isImpacted ? "url(#impactGlow)" : (speedFactor > 0.8 || skin.glow ? "url(#glow)" : "none")}
      />
      {!isImpacted && (
        <>
          <path d="M 22 85 Q 50 25 78 85" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d="M 28 87 Q 50 40 72 87" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="50" cy="40" r="3" fill={skin.trailColor} />
        </>
      )}
    </svg>
  );
};

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  rot: number;
  speed: number;
  id: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number; 
  size: number;
}

const FRUIT_COLORS: Record<FruitType, string> = {
  [FruitType.APPLE]: '#ff4d4d',
  [FruitType.BANANA]: '#ffcc00',
  [FruitType.PINEAPPLE]: '#ff9900',
  [FruitType.ORANGE]: '#ff7700',
};

const GameScene: React.FC<GameSceneProps> = ({ 
  level, onComplete, onQuit, equippedSkin = SKINS[0], 
  customFruits, customObstacles, turnTitle 
}) => {
  const [score, setScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(level.maxThrows);
  const [fruits, setFruits] = useState<Fruit[]>(customFruits || level.fruits.map(f => ({ ...f })));
  const [isFlying, setIsFlying] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const [boomerangPos, setBoomerangPos] = useState({ x: 50, y: 85 });
  const [boomerangRot, setBoomerangRot] = useState(0);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [swipeStart, setSwipeStart] = useState<{ x: number, y: number } | null>(null);
  const [aimDelta, setAimDelta] = useState<{ x: number, y: number } | null>(null);
  const [previewPoints, setPreviewPoints] = useState<{ p1: {x:number, y:number}, p2: {x:number, y:number} } | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [combo, setCombo] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [canCut, setCanCut] = useState(true);
  const [isImpacted, setIsImpacted] = useState(false);
  const [animTime, setAnimTime] = useState(0);

  const wind = useWindSystem();
  
  const requestRef = useRef<number | undefined>(undefined);
  const flightStartTime = useRef<number>(0);
  const lastPos = useRef({ x: 50, y: 85 });
  const flightPoints = useRef<{ p1: {x:number, y:number}, p2: {x:number, y:number} } | null>(null);
  const hasHitBranchRef = useRef<boolean>(false);

  const activeObstacles = customObstacles || level.obstacles || [];

  const fruitsRef = useRef<Fruit[]>([]);
  useEffect(() => { fruitsRef.current = fruits; }, [fruits]);

  const addFloatingText = (x: number, y: number, text: string, color?: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  const addParticleBurst = (x: number, y: number, type: FruitType | string) => {
    const color = typeof type === 'string' ? type : FRUIT_COLORS[type];
    const newParticles: Particle[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      color,
      life: 1.0,
      size: Math.random() * 8 + 4,
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const triggerImpact = () => {
    setIsImpacted(true);
    setTimeout(() => setIsImpacted(false), 150);
  };

  const triggerShake = (intensity = 200) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), intensity);
  };

  const handleLevelEnd = useCallback(() => {
    const fruitsCut = fruitsRef.current.filter(f => f.isSliced).length;
    onComplete(score, fruitsCut, fruitsRef.current.length);
  }, [score, onComplete]);

  const updateFlight = useCallback((time: number) => {
    setAnimTime(time);
    if (!flightStartTime.current) flightStartTime.current = time;

    setParticles(prev => 
      prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.05,
          life: p.life - 0.02,
        }))
        .filter(p => p.life > 0)
    );

    if (!isFlying) {
      requestRef.current = requestAnimationFrame(updateFlight);
      return;
    }

    if (!flightPoints.current) return;

    const progress = (time - flightStartTime.current) / 1600;

    if (progress >= 1) {
      setIsFlying(false);
      setBoomerangPos({ x: 50, y: 85 });
      setBoomerangRot(0);
      setTrail([]);
      setPreviewPoints(null);
      flightStartTime.current = 0;
      setCombo(0);
      setCanCut(true);
      hasHitBranchRef.current = false;
      if (throwsLeft <= 0 || fruitsRef.current.every(f => f.isSliced)) {
         setTimeout(handleLevelEnd, 800);
      }
      return;
    }

    const p0 = { x: 50, y: 85 };
    const { p1, p2 } = flightPoints.current;
    const p3 = { x: 50, y: 85 };

    const t = progress;
    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
    const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    lastPos.current = { x, y };

    const rotationSpeed = progress < 0.5 ? 25 : 45;
    const nextRot = boomerangRot + rotationSpeed;

    setBoomerangPos({ x, y });
    setBoomerangRot(nextRot);

    const maxTrailLen = Math.floor(6 + speed * 1.5);
    setTrail(prev => {
      const newPoint = { x, y, rot: nextRot, speed, id: Math.random() };
      return [newPoint, ...prev].slice(0, maxTrailLen);
    });

    if (activeObstacles && !hasHitBranchRef.current) {
      activeObstacles.forEach(obs => {
        const dist = Math.sqrt(Math.pow(x - obs.x, 2) + Math.pow(y - obs.y, 2));
        if (dist < 6) {
          if (obs.type === ObstacleType.BEEHIVE && canCut) {
            setCanCut(false);
            setScore(prev => Math.max(0, prev - 150));
            addFloatingText(obs.x, obs.y, "-150 OUCH!", "text-yellow-500");
            triggerImpact();
            triggerShake(400);
          } else if (obs.type === ObstacleType.BRANCH) {
            hasHitBranchRef.current = true;
            flightStartTime.current = time - (1600 * 0.8); 
            addFloatingText(obs.x, obs.y, "CLANG!", "text-slate-400");
            triggerImpact();
            triggerShake(300);
          } else if (obs.type === ObstacleType.ROCK) {
            hasHitBranchRef.current = true;
            flightStartTime.current = time - (1600 * 0.9); // Ends turn faster
            addFloatingText(obs.x, obs.y, "SOLID!", "text-slate-500 font-bold");
            addParticleBurst(obs.x, obs.y, "#94a3b8");
            triggerImpact();
            triggerShake(500);
          } else if (obs.type === ObstacleType.SPIDER_WEB) {
            hasHitBranchRef.current = true;
            flightStartTime.current = time - (1600 * 1.0); // Ends turn immediately
            addFloatingText(obs.x, obs.y, "STUCK!", "text-white font-bold");
            addParticleBurst(obs.x, obs.y, "#ffffff");
            triggerImpact();
            triggerShake(100);
          } else if (obs.type === ObstacleType.BIRD && canCut) {
            setCanCut(false);
            setScore(prev => Math.max(0, prev - 250));
            addFloatingText(obs.x, obs.y, "-250 SQUAWK!", "text-red-400");
            addParticleBurst(obs.x, obs.y, "#ef4444");
            triggerImpact();
            triggerShake(300);
          }
        }
      });
    }

    if (canCut) {
      fruitsRef.current.forEach(fruit => {
        if (!fruit.isSliced) {
          const dist = Math.sqrt(Math.pow(x - fruit.x, 2) + Math.pow(y - fruit.y, 2));
          if (dist < 8) {
            const currentCombo = combo + 1;
            setCombo(currentCombo);
            setFruits(prev => prev.map(f => f.id === fruit.id ? { ...f, isSliced: true } : f));
            const comboBonus = currentCombo > 1 ? 50 * currentCombo : 0;
            const pointsEarned = fruit.score + comboBonus;
            setScore(prev => prev + pointsEarned);
            addFloatingText(fruit.x, fruit.y, `+${pointsEarned}${currentCombo > 1 ? ' COMBO!' : ''}`);
            addParticleBurst(fruit.x, fruit.y, fruit.type);
            triggerImpact();
            triggerShake();
          }
        }
      });
    }

    requestRef.current = requestAnimationFrame(updateFlight);
  }, [handleLevelEnd, throwsLeft, combo, canCut, activeObstacles, boomerangRot, isFlying, particles.length]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateFlight);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [updateFlight]);

  const calculatePath = (clientX: number, clientY: number, startX: number, startY: number) => {
    const dx = clientX - startX;
    const dy = clientY - startY;
    if (dy >= -10) return null;

    const power = Math.min(1.2, Math.abs(dy) / 200);
    const sweep = dx / 100;
    const targetY = 20 - (power * 40);
    const midX = 50 + (sweep * 60);

    // Aerodynamic wind drift pushes the boomerang arc
    const windDrift = (wind.speed / 30) * 8;

    return {
      p1: { x: Math.max(5, Math.min(95, midX + windDrift)), y: targetY },
      p2: { x: Math.max(5, Math.min(95, 100 - midX + windDrift)), y: targetY }
    };
  };

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isFlying || throwsLeft <= 0) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setSwipeStart({ x: clientX, y: clientY });
    setAimDelta({ x: 0, y: 0 });
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeStart || isFlying) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setAimDelta({ x: clientX - swipeStart.x, y: clientY - swipeStart.y });
    const points = calculatePath(clientX, clientY, swipeStart.x, swipeStart.y);
    setPreviewPoints(points);
  };

  const onTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeStart || isFlying) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    
    const points = calculatePath(clientX, clientY, swipeStart.x, swipeStart.y);
    if (points) {
      flightPoints.current = points;
      setPreviewPoints(points);
      setIsFlying(true);
      setIsThrowing(true); // Trigger arm throw whip animation
      setTimeout(() => setIsThrowing(false), 500); // Reset animation
      setThrowsLeft(prev => prev - 1);
      flightStartTime.current = 0; 
      lastPos.current = { x: 50, y: 85 };
      hasHitBranchRef.current = false;
    } else {
      setPreviewPoints(null);
    }
    setSwipeStart(null);
    setAimDelta(null);
  };

  return (
    <div 
      className={`relative h-full overflow-hidden select-none touch-none transition-transform duration-75 ${isShaking ? 'scale-105' : 'scale-100'}`}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={() => { setSwipeStart(null); setPreviewPoints(null); }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ORCHARD_BG})` }}
      />
      
      {/* Wind Particles & Streamer Overlay */}
      <WindEffectsOverlay wind={wind} />
      
      {/* Trajectory Path Preview */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {previewPoints && (
          <path
            d={`M ${50}% ${85}% C ${previewPoints.p1.x}% ${previewPoints.p1.y}%, ${previewPoints.p2.x}% ${previewPoints.p2.y}%, ${50}% ${85}%`}
            fill="none"
            stroke={equippedSkin.trailColor}
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeOpacity={isFlying ? 0.15 : 0.6}
            filter="url(#pathGlow)"
            className={`${isFlying ? '' : 'animate-[dash_1s_linear_infinite]'}`}
            style={{ 
              transition: 'stroke-opacity 0.5s ease',
              // @ts-ignore
              '--dash-offset': '16' 
            }}
          />
        )}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -16; }
        }
      `}</style>
      
      {/* HUD */}
      <div className="relative z-30 p-4 pt-12 flex justify-between items-start pointer-events-none">
        <button 
          onClick={onQuit}
          className="pointer-events-auto size-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-b-4 border-slate-200 active:border-0 active:translate-y-1"
        >
          <span className="material-symbols-outlined text-slate-700">pause</span>
        </button>

        <div className="flex flex-col items-center gap-1">
          {turnTitle && (
            <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase shadow-lg border-2 border-white mb-1">
              {turnTitle}
            </div>
          )}
          <div className="bg-white px-6 py-2 rounded-full shadow-lg border-b-4 border-slate-200 flex items-center gap-2">
             <span className="text-primary text-2xl font-black">★</span>
             <span className="text-2xl font-black tabular-nums text-slate-900">{score.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-[10px] font-black uppercase text-slate-600 tracking-tighter">
               Target: {level.targetScore}
            </div>
            <WindHUD wind={wind} />
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-lg border-b-4 border-slate-200 flex items-center gap-2">
           <div className="size-6 flex items-center justify-center -rotate-45">
              <BoomerangSVG className="w-full h-full scale-50" skin={equippedSkin} />
           </div>
           <div className="leading-none ml-1">
             <div className="text-lg font-bold tabular-nums text-slate-900">{throwsLeft}</div>
             <div className="text-[8px] uppercase font-bold text-slate-500">Left</div>
           </div>
        </div>
      </div>

      {combo > 1 && (
        <div className="absolute top-32 left-0 w-full flex justify-center pointer-events-none animate-bounce">
           <div className="bg-orange-600 text-white px-4 py-1 rounded-full font-black text-xl shadow-lg border-2 border-white/20">
             {combo}x COMBO!
           </div>
        </div>
      )}

      {floatingTexts.map(t => (
        <div 
          key={t.id}
          className={`absolute z-50 font-black text-xl pointer-events-none animate-bounce whitespace-nowrap ${t.color || 'text-white'}`}
          style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -100%)', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          {t.text}
        </div>
      ))}

      {/* Juice Particles */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute z-40 rounded-full pointer-events-none shadow-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            transform: `translate(-50%, -50%) scale(${p.life})`,
          }}
        />
      ))}

      {/* Obstacles */}
      {activeObstacles.map(obs => (
        <div 
          key={obs.id}
          className="absolute z-20"
          style={{ left: `${obs.x}%`, top: `${obs.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative size-16 flex items-center justify-center bg-slate-800/20 backdrop-blur rounded-2xl shadow-xl border-2 border-slate-900 animate-pulse">
            <span className="text-4xl drop-shadow-lg">{OBSTACLE_ICONS[obs.type]}</span>
          </div>
        </div>
      ))}

      {/* Hanging Fruits with Realistic Wind Sway and Branches */}
      {fruits.map(fruit => {
        const sway = calculateFruitSway(fruit.x, fruit.y, animTime, wind.speed, wind.isGusting);
        return (
          <HangingFruit
            key={fruit.id}
            fruit={fruit}
            fruitIcon={FRUIT_ICONS[fruit.type]}
            swayAngle={sway.angle}
            swayOffsetX={sway.offsetX}
            swayOffsetY={sway.offsetY}
          />
        );
      })}

      {/* Boomerang Trail */}
      {isFlying && trail.map((p, i) => {
        const speedIntensity = Math.min(1, p.speed / 5);
        const opacityDecay = (1 - i / trail.length) * 0.4;
        return (
          <div 
            key={p.id}
            className="absolute z-30 transition-none pointer-events-none"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              transform: `translate(-50%, -50%) rotate(${p.rot}deg) scale(${1 - (i * 0.08)})`,
              opacity: opacityDecay,
              filter: `blur(${i * 0.5}px)`
            }}
          >
            <BoomerangSVG 
              className="scale-75" 
              opacity={opacityDecay} 
              speedFactor={speedIntensity}
              skin={equippedSkin}
            />
          </div>
        );
      })}

      {/* Boomerang Flight */}
      <div 
        className={`absolute z-40 transition-none pointer-events-none drop-shadow-2xl ${!canCut ? 'brightness-50 grayscale' : ''}`}
        style={{ 
          left: `${boomerangPos.x}%`, 
          top: `${boomerangPos.y}%`, 
          transform: `translate(-50%, -50%) rotate(${boomerangRot}deg)`,
          visibility: isFlying ? 'visible' : 'hidden',
          filter: isFlying ? 'blur(0.5px)' : 'none'
        }}
      >
        <BoomerangSVG 
          speedFactor={isFlying ? (trail[0]?.speed / 5 || 0) : 0} 
          isImpacted={isImpacted}
          skin={equippedSkin}
        />
      </div>

      {/* Resting & Aiming Boomerang at launch position (Boomerang only, no hand) */}
      {!isFlying && throwsLeft > 0 && (
        <div 
          className="absolute z-40 pointer-events-none transition-transform duration-75 drop-shadow-2xl"
          style={{ 
            left: '50%', 
            top: '85%',
            transform: `translate(-50%, -50%) translate(${aimDelta ? Math.max(-35, Math.min(35, aimDelta.x * 0.22)) : 0}px, ${aimDelta ? Math.max(0, Math.min(35, aimDelta.y * 0.28)) : 0}px) rotate(${aimDelta ? Math.max(-40, Math.min(40, (aimDelta.x / 100) * 28)) : -15}deg) scale(1.15)`
          }}
        >
          <BoomerangSVG skin={equippedSkin} speedFactor={aimDelta ? 0.35 : 0} />
        </div>
      )}

      {!isFlying && throwsLeft === level.maxThrows && (
        <div className="absolute bottom-[20%] left-0 w-full flex flex-col items-center pointer-events-none animate-pulse">
           <div className="bg-white/95 backdrop-blur-md px-6 py-2 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
              <span className="material-symbols-outlined text-primary-dark text-4xl">swipe_up</span>
              <h3 className="text-slate-900 text-xl font-black italic uppercase">Swipe to Throw!</h3>
           </div>
        </div>
      )}
    </div>
  );
};

export default GameScene;
