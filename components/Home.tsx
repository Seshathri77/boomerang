import React from 'react';
import { HERO_BG, SKINS } from '../constants';
import { BoomerangSVG } from './GameScene';

interface HomeProps {
  onPlay: () => void;
  onSkins: () => void;
  onVSMode: () => void;
  totalScore: number;
  selectedSkinId: string;
}

const Home: React.FC<HomeProps> = ({ onPlay, onSkins, onVSMode, totalScore, selectedSkinId }) => {
  const currentSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];

  return (
    <div className="flex flex-col h-full p-6 pt-12">
      <header className="flex items-center justify-between mb-8">
        <div className="size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">menu</span>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-black leading-none text-slate-900 dark:text-white">
            BOOMERANG<br/>
            <span className="text-primary text-3xl">ORCHARD</span>
          </h1>
        </div>
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-full h-10 px-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="text-base font-bold mr-1 text-slate-800 dark:text-slate-100">{totalScore.toLocaleString()}</span>
          <span className="text-xl">🍊</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-8">
        <div className="relative group w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
          <div 
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          {/* Boomerang Preview on Character Area */}
          <div className="absolute bottom-10 right-10 rotate-[45deg] animate-bounce-slight scale-150 drop-shadow-xl">
            <BoomerangSVG skin={currentSkin} />
          </div>
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-red-500">eco</span>
          </div>
        </div>

        <div className="mt-auto pb-4">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={onPlay}
              className="game-btn flex-[2] h-20 bg-primary text-slate-900 text-3xl font-black tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:brightness-105"
            >
              PLAY! <span className="material-symbols-outlined text-4xl">play_arrow</span>
            </button>
            <button 
              onClick={onVSMode}
              className="game-btn flex-1 h-20 bg-orange-500 text-white text-xl font-black rounded-2xl flex flex-col items-center justify-center leading-none"
              style={{ boxShadow: '0 6px 0 0 #c2410c' }}
            >
              <span className="material-symbols-outlined text-3xl mb-1">group</span>
              VS
            </button>
          </div>

          <div className="flex gap-3 mt-4">
            <ActionButton icon="map" label="Levels" color="text-blue-600" onClick={onPlay} />
            <ActionButton icon="checkroom" label="Skins" color="text-purple-600" onClick={onSkins} />
            <ActionButton icon="settings" label="Settings" color="text-slate-600" onClick={() => {}} />
          </div>
        </div>
      </main>

      <footer className="text-center pb-2">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-mono opacity-80">v1.0.3 • Multiplayer Update</p>
      </footer>
    </div>
  );
};

const ActionButton: React.FC<{ icon: string; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex-1 flex flex-col items-center justify-center h-20 rounded-xl bg-white dark:bg-slate-800 shadow-sm border-b-4 border-slate-200 dark:border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
  >
    <span className={`material-symbols-outlined ${color} mb-1`}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

export default Home;