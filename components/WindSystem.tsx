import React, { useEffect, useState, useMemo } from 'react';

export interface WindState {
  speed: number;        // in km/h: positive = blowing right (East), negative = blowing left (West)
  isGusting: boolean;   // true during sudden gusts
  gustIntensity: number;// 0 to 1
  windAngle: number;    // angle in radians for drift
}

interface WindLeaf {
  id: number;
  startX: number;
  y: number;
  size: number;
  rotationSpeed: number;
  color: string;
  delay: number;
  duration: number;
}

export const useWindSystem = () => {
  const [windState, setWindState] = useState<WindState>({
    speed: 14,
    isGusting: false,
    gustIntensity: 0,
    windAngle: 0,
  });

  useEffect(() => {
    let targetSpeed = 12;
    let currentSpeed = 12;
    let gustEndTime = 0;

    const interval = setInterval(() => {
      const now = Date.now();

      // Check if gust should end
      const isGust = now < gustEndTime;

      // Every 6-9 seconds, trigger a gust of wind
      if (!isGust && Math.random() < 0.25) {
        gustEndTime = now + 2500 + Math.random() * 1500;
        const gustDirection = currentSpeed >= 0 ? 1 : -1;
        targetSpeed = gustDirection * (28 + Math.random() * 16);
      } else if (!isGust && Math.random() < 0.4) {
        // Change ambient wind target
        const direction = Math.random() > 0.45 ? 1 : -1;
        targetSpeed = direction * (8 + Math.random() * 14);
      }

      // Smoothly interpolate current speed towards target speed
      const diff = targetSpeed - currentSpeed;
      currentSpeed += diff * 0.15;

      const gustActive = now < gustEndTime;
      const gustIntensity = gustActive ? Math.min(1, Math.abs(currentSpeed) / 40) : 0;

      setWindState({
        speed: Math.round(currentSpeed * 10) / 10,
        isGusting: gustActive,
        gustIntensity,
        windAngle: currentSpeed > 0 ? 0 : Math.PI,
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return windState;
};

/**
 * Calculates physics-based sway for fruits on tree branches (strictly aligned with wind direction)
 */
export const calculateFruitSway = (
  fruitX: number,
  fruitY: number,
  timeMs: number,
  windSpeed: number,
  isGusting: boolean
) => {
  const phase = (fruitX * 0.09) + (fruitY * 0.06);
  const windDir = windSpeed >= 0 ? 1 : -1;
  const absSpeed = Math.abs(windSpeed);

  // Persistent lean strictly in the direction of the wind (positive = right, negative = left)
  const baseLean = windDir * ((absSpeed / 25) * 14);

  // Wind turbulence pulses in the wind direction
  const windWave = (Math.sin(timeMs * 0.005 + phase) * 0.5 + 0.5);
  const turbulence = windDir * windWave * (absSpeed * 0.3);

  // High-frequency jitter during strong gusts in the wind direction
  let gustSurge = 0;
  if (isGusting) {
    const gustVibe = (Math.sin(timeMs * 0.018 + phase * 3) * 0.5 + 0.5);
    gustSurge = windDir * (5 + gustVibe * 6);
  }

  const totalAngle = Math.max(-35, Math.min(35, baseLean + turbulence + gustSurge));
  const offsetX = (totalAngle / 20) * 10; // Branches bend in the exact wind direction
  const offsetY = Math.abs(Math.sin(totalAngle * (Math.PI / 180))) * 3;

  return {
    angle: totalAngle,
    offsetX,
    offsetY,
  };
};

/**
 * Visual drifting leaves and wind streaks overlay
 */
export const WindEffectsOverlay: React.FC<{ wind: WindState }> = ({ wind }) => {
  // Pre-generate leaf particles
  const leaves: WindLeaf[] = useMemo(() => {
    const leafColors = ['#84cc16', '#a3e635', '#4ade80', '#eab308', '#f59e0b'];
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      startX: (i / 14) * 100,
      y: 10 + (i * 5.5) % 65,
      size: 10 + (i % 3) * 4,
      rotationSpeed: (i % 2 === 0 ? 1 : -1) * (150 + (i * 20)),
      color: leafColors[i % leafColors.length],
      delay: (i * 0.4) % 3,
      duration: 3 + (i % 4) * 0.8,
    }));
  }, []);

  const isBlowingRight = wind.speed >= 0;
  const absSpeed = Math.max(5, Math.abs(wind.speed));
  // Adjust animation duration inversely with wind speed
  const streamDuration = Math.max(1.2, 5 - (absSpeed / 10));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Wind Streamer Gust Curves */}
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="windStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#d1fae5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Streamline 1 */}
        <path
          d={`M ${isBlowingRight ? '-10%' : '110%'} 22% Q 50% 18% ${isBlowingRight ? '110%' : '-10%'} 25%`}
          fill="none"
          stroke="url(#windStreamGrad)"
          strokeWidth={wind.isGusting ? "3" : "1.5"}
          strokeDasharray="80 160"
          className="animate-[windPass_linear_infinite]"
          style={{
            animationDuration: `${streamDuration}s`,
            transformOrigin: 'center',
          }}
        />

        {/* Streamline 2 */}
        <path
          d={`M ${isBlowingRight ? '-10%' : '110%'} 38% Q 50% 45% ${isBlowingRight ? '110%' : '-10%'} 35%`}
          fill="none"
          stroke="url(#windStreamGrad)"
          strokeWidth={wind.isGusting ? "4" : "2"}
          strokeDasharray="120 180"
          className="animate-[windPass_linear_infinite]"
          style={{
            animationDuration: `${streamDuration * 1.2}s`,
            animationDelay: '0.6s',
          }}
        />

        {/* Streamline 3 (Lower canopy) */}
        <path
          d={`M ${isBlowingRight ? '-10%' : '110%'} 55% Q 40% 50% ${isBlowingRight ? '110%' : '-10%'} 60%`}
          fill="none"
          stroke="url(#windStreamGrad)"
          strokeWidth={wind.isGusting ? "3" : "1.5"}
          strokeDasharray="90 200"
          className="animate-[windPass_linear_infinite]"
          style={{
            animationDuration: `${streamDuration * 0.9}s`,
            animationDelay: '1.2s',
          }}
        />
      </svg>

      {/* Floating Orchard Leaves */}
      {leaves.map((leaf) => {
        const driftDistance = isBlowingRight ? 120 : -120;
        return (
          <div
            key={leaf.id}
            className="absolute transition-opacity duration-300 pointer-events-none"
            style={{
              top: `${leaf.y}%`,
              left: `${leaf.startX}%`,
              opacity: wind.isGusting ? 0.95 : 0.6,
              transform: `scale(${wind.isGusting ? 1.2 : 1})`,
            }}
          >
            <div
              className="animate-[drift_linear_infinite]"
              style={{
                // @ts-ignore
                '--drift-x': `${driftDistance}vw`,
                animationDuration: `${Math.max(2, leaf.duration * (15 / absSpeed))}s`,
                animationDelay: `-${leaf.delay}s`,
              }}
            >
              <svg
                width={leaf.size}
                height={leaf.size}
                viewBox="0 0 24 24"
                className="animate-[spin_linear_infinite]"
                style={{
                  animationDuration: `${Math.max(1, 3000 / leaf.rotationSpeed)}s`,
                }}
              >
                <path
                  d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C18 8.6 17.6 8.2 17 8Z"
                  fill={leaf.color}
                  stroke="#166534"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <path d="M6 20 C10 16, 14 13, 17 9" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              </svg>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes windPass {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: -400; }
        }
        @keyframes drift {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(calc(var(--drift-x) * 0.5)) translateY(14px); }
          100% { transform: translateX(var(--drift-x)) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

/**
 * Wind HUD Indicator Badge
 */
export const WindHUD: React.FC<{ wind: WindState }> = ({ wind }) => {
  const isRight = wind.speed >= 0;
  const absSpeed = Math.abs(wind.speed);

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-md backdrop-blur-md transition-all duration-300 border ${
        wind.isGusting
          ? 'bg-amber-500/90 text-white border-amber-300 scale-105 animate-pulse'
          : 'bg-white/90 text-slate-800 border-white/80'
      }`}
    >
      <span
        className={`material-symbols-outlined text-base transition-transform duration-500 ${
          wind.isGusting ? 'text-white' : 'text-emerald-600'
        }`}
      >
        {wind.isGusting ? 'air' : 'eco'}
      </span>

      <div className="flex items-center gap-1">
        <span className="text-xs font-black tracking-tight tabular-nums">
          {absSpeed.toFixed(0)} <span className="text-[9px] font-bold opacity-80">km/h</span>
        </span>
        <span
          className={`text-xs font-black transition-transform duration-300 inline-block ${
            isRight ? 'rotate-0' : 'rotate-180'
          }`}
        >
          ➔
        </span>
      </div>

      {wind.isGusting && (
        <span className="bg-white text-amber-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-sm ml-0.5 animate-bounce">
          Gust!
        </span>
      )}
    </div>
  );
};

/**
 * Hanging Fruit Component with Stem, Leaves and Pendular Physics Sway
 */
export const HangingFruit: React.FC<{
  fruit: {
    id: string;
    type: any;
    x: number;
    y: number;
    isSliced: boolean;
  };
  fruitIcon: string;
  swayAngle: number;
  swayOffsetX: number;
  swayOffsetY: number;
}> = ({ fruit, fruitIcon, swayAngle, swayOffsetX, swayOffsetY }) => {
  return (
    <div
      className={`absolute z-20 pointer-events-none transition-opacity duration-300 ${
        fruit.isSliced ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        left: `${fruit.x}%`,
        top: `${fruit.y}%`,
        transform: `translate(-50%, -50%) translate(${swayOffsetX}px, ${swayOffsetY}px)`,
        transformOrigin: '50% -12px', // Swing from branch connection point
      }}
    >
      <div
        className="relative flex flex-col items-center select-none"
        style={{
          transform: `rotate(${swayAngle}deg)`,
          transformOrigin: '50% 0px',
          transition: 'transform 0.05s linear',
        }}
      >
        {/* Branch connection stem & leaf */}
        <div className="relative -mb-1 flex flex-col items-center z-10">
          {/* Wooden stem */}
          <div className="w-1.5 h-4 bg-amber-900 rounded-t-full shadow-sm" />
          {/* Small green leaf fluttering on stem */}
          <div
            className="absolute -top-1 -right-3 w-3.5 h-2 bg-emerald-500 rounded-full rotate-[-25deg] shadow-xs"
            style={{
              transform: `rotate(${-25 + swayAngle * 0.4}deg)`,
            }}
          />
        </div>

        {/* Fruit icon hanging directly from branch stem with no white circle */}
        <div className="relative flex items-center justify-center p-2 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] transition-transform hover:scale-110">
          <span className="text-6xl drop-shadow-md select-none transform transition-transform leading-none">
            {fruitIcon}
          </span>
        </div>
      </div>
    </div>
  );
};
