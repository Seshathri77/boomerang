import React, { useEffect, useRef } from 'react';
import { LEVELS } from '../constants';

interface MapProps {
  unlockedLevels: number;
  totalScore: number;
  onSelectLevel: (id: number) => void;
  onBack: () => void;
  onShop?: () => void;
}

const Map: React.FC<MapProps> = ({ unlockedLevels, totalScore, onSelectLevel, onBack, onShop }) => {
  const currentLevelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const targetLevelId = Math.min(Math.max(1, unlockedLevels), LEVELS.length);

  useEffect(() => {
    const scrollToActiveLevel = (behavior: ScrollBehavior = 'auto') => {
      if (currentLevelRef.current) {
        currentLevelRef.current.scrollIntoView({
          behavior,
          block: 'center',
          inline: 'nearest'
        });
      }
    };

    // Auto-scroll immediately on mount and after layout settles so user never starts at the wrong end
    scrollToActiveLevel('auto');
    const t1 = setTimeout(() => scrollToActiveLevel('auto'), 40);
    const t2 = setTimeout(() => scrollToActiveLevel('smooth'), 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [targetLevelId]);

  return (
    <div className="relative h-full flex flex-col bg-sky-100 dark:bg-slate-900 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-100 dark:from-green-900/30 to-transparent"></div>
      </div>

      <header className="relative z-10 flex items-center p-4 pt-8 justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-white/20">
        <button 
          onClick={onBack}
          className="bg-white dark:bg-slate-700 size-10 flex items-center justify-center rounded-full shadow-sm hover:scale-105 border border-slate-200 dark:border-slate-600 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-xl font-extrabold flex-1 text-center text-slate-900 dark:text-white uppercase tracking-tight">World Map</h2>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-600">
          <span className="text-lg">🍊</span>
          <p className="text-sm font-bold text-slate-800 dark:text-white">{totalScore.toLocaleString()}</p>
        </div>
      </header>

      <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto no-scrollbar pb-36 px-6 pt-12">
        {/* Dynamic winding path based on level count */}
        <svg className="absolute top-0 left-0 w-full h-[2500px] pointer-events-none opacity-20" viewBox="0 0 400 2500" preserveAspectRatio="none">
          <path 
            d="M 200 2450 Q 50 2200 200 1950 T 200 1450 T 200 950 T 200 450 T 200 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeDasharray="20 20"
            className="text-slate-500 dark:text-slate-400"
          />
        </svg>

        {/* Level List: col-reverse to have Level 1 at bottom */}
        <div className="flex flex-col-reverse items-center gap-28 relative min-h-[2500px]">
          {LEVELS.map((level, idx) => {
            const isUnlocked = level.id <= unlockedLevels;
            const isCurrent = level.id === targetLevelId;
            
            // Winding offsets
            const offset = (idx % 2 === 0 ? -70 : 70);

            return (
              <div 
                key={level.id}
                ref={isCurrent ? currentLevelRef : undefined}
                className="relative transition-all duration-300 scroll-mt-32"
                style={{ transform: `translateX(${offset}px)` }}
              >
                <div className="flex flex-col items-center group">
                  {isUnlocked ? (
                    <button 
                      onClick={() => onSelectLevel(level.id)}
                      className={`relative size-20 md:size-24 rounded-full border-4 border-white dark:border-slate-700 shadow-2xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center
                        ${isCurrent ? 'bg-primary ring-4 ring-primary/40 animate-pulse shadow-primary/50' : 'bg-primary/80 hover:bg-primary'}`}
                    >
                      <span className="text-slate-900 text-3xl font-black">{level.id}</span>
                      <div className="absolute -top-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-0.5 rounded shadow-lg text-[9px] font-black uppercase text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700">
                        {level.difficulty}
                      </div>
                      {isCurrent && (
                        <div className="absolute -bottom-10 bg-primary text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter whitespace-nowrap shadow-xl border-2 border-white/50 animate-bounce">
                          Play Now!
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="size-16 md:size-20 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-800 flex items-center justify-center opacity-60">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">lock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Jump to Active Level button */}
      <button 
        onClick={() => {
          currentLevelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        className="absolute bottom-24 right-4 z-20 bg-primary hover:brightness-105 active:scale-95 text-slate-900 px-4 py-2 rounded-full font-black text-xs uppercase shadow-xl border-2 border-white flex items-center gap-1.5 transition-all"
        title="Jump to current level"
      >
        <span className="material-symbols-outlined text-base">my_location</span>
        <span>Level {targetLevelId}</span>
      </button>

      <nav className="absolute bottom-0 w-full bg-white dark:bg-slate-800 p-4 border-t dark:border-slate-700 flex justify-around items-center rounded-t-[2rem] shadow-2xl z-20">
         <button 
           onClick={onShop} 
           className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors"
         >
           <span className="material-symbols-outlined text-3xl">storefront</span>
           <span className="text-[10px] font-black uppercase mt-1">Shop</span>
         </button>
         <button 
           onClick={() => currentLevelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
           className="flex flex-col items-center text-primary transform -translate-y-6 bg-white dark:bg-slate-800 size-16 rounded-full shadow-2xl border-4 border-primary transition-transform active:scale-90"
           title="Center current level"
         >
           <span className="material-symbols-outlined text-4xl">my_location</span>
         </button>
         <button 
           onClick={onBack}
           className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors"
         >
           <span className="material-symbols-outlined text-3xl">home</span>
           <span className="text-[10px] font-black uppercase mt-1">Home</span>
         </button>
      </nav>
    </div>
  );
};

export default Map;
