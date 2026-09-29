import React from 'react';
import { SKINS } from '../constants';
import { Skin } from '../types';
import { BoomerangSVG } from './GameScene';

interface SkinsShopProps {
  unlockedSkinIds: string[];
  selectedSkinId: string;
  totalScore: number;
  onSelect: (id: string) => void;
  onBuy: (id: string, price: number) => void;
  onBack: () => void;
}

const SkinsShop: React.FC<SkinsShopProps> = ({ 
  unlockedSkinIds, 
  selectedSkinId, 
  totalScore, 
  onSelect, 
  onBuy, 
  onBack 
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center p-4 pt-12 justify-between bg-white dark:bg-slate-800 shadow-sm">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">Skins Shop</h2>
        <div className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
          <span className="text-sm font-black text-primary-dark">{totalScore.toLocaleString()}</span>
          <span className="text-xs">🍊</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {SKINS.map((skin) => {
          const isUnlocked = unlockedSkinIds.includes(skin.id);
          const isSelected = selectedSkinId === skin.id;
          const canAfford = totalScore >= skin.price;

          return (
            <div 
              key={skin.id}
              className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 bg-white dark:bg-slate-800 shadow-sm
                ${isSelected ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="size-24 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-2xl relative overflow-hidden">
                <div className="rotate-[45deg] scale-125">
                  <BoomerangSVG skin={skin} />
                </div>
                {skin.glow && <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-black text-slate-900 dark:text-white text-lg">{skin.name}</h3>
                <div className="flex gap-1">
                  {skin.colors.map((c, i) => (
                    <div key={i} className="size-3 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  ))}
                </div>
                
                <div className="mt-2">
                  {isUnlocked ? (
                    <button 
                      onClick={() => onSelect(skin.id)}
                      disabled={isSelected}
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider
                        ${isSelected ? 'bg-primary text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      {isSelected ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => onBuy(skin.id, skin.price)}
                      disabled={!canAfford}
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1
                        ${canAfford ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 opacity-50'}`}
                    >
                      Buy: {skin.price.toLocaleString()} 🍊
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkinsShop;