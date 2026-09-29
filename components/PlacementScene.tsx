import React, { useState } from 'react';
import { FruitType, ObstacleType, Fruit, Obstacle } from '../types';
import { ORCHARD_BG, FRUIT_ICONS, OBSTACLE_ICONS } from '../constants';
import { useWindSystem, WindEffectsOverlay } from './WindSystem';

interface PlacementSceneProps {
  playerName: string;
  opponentName: string;
  onFinish: (fruits: Fruit[], obstacles: Obstacle[]) => void;
}

const FRUIT_BUDGET = 5;
const OBSTACLE_BUDGET = 3; // Increased budget
const MIN_DISTANCE = 10; // Minimum percentage distance between items

const PlacementScene: React.FC<PlacementSceneProps> = ({ playerName, opponentName, onFinish }) => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [selectedType, setSelectedType] = useState<FruitType | ObstacleType>(FruitType.APPLE);
  const [errorMsg, setErrorMsg] = useState<{ x: number, y: number, text: string } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const wind = useWindSystem();

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const showPlacementError = (x: number, y: number, text: string) => {
    setErrorMsg({ x, y, text });
    setIsShaking(true);
    setTimeout(() => {
      setErrorMsg(null);
      setIsShaking(false);
    }, 800);
  };

  const handlePlace = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Don't place too low (near the character)
    if (y > 75) {
      showPlacementError(x, y, "Too low!");
      return;
    }

    // Proximity check against existing items
    const allItems = [...fruits, ...obstacles];
    const tooClose = allItems.some(item => getDistance(x, y, item.x, item.y) < MIN_DISTANCE);

    if (tooClose) {
      showPlacementError(x, y, "Too close!");
      return;
    }

    if (Object.values(FruitType).includes(selectedType as FruitType)) {
      if (fruits.length >= FRUIT_BUDGET) {
        showPlacementError(x, y, "Fruit limit reached!");
        return;
      }
      setFruits([...fruits, { 
        id: `vs-f-${Date.now()}`, 
        type: selectedType as FruitType, 
        x, y, isSliced: false, score: 100 
      }]);
    } else {
      if (obstacles.length >= OBSTACLE_BUDGET) {
        showPlacementError(x, y, "Trap limit reached!");
        return;
      }
      setObstacles([...obstacles, { 
        id: `vs-o-${Date.now()}`, 
        type: selectedType as ObstacleType, 
        x, y 
      }]);
    }
  };

  const removeLast = () => {
    if (Object.values(FruitType).includes(selectedType as FruitType)) {
      setFruits(fruits.slice(0, -1));
    } else {
      setObstacles(obstacles.slice(0, -1));
    }
  };

  return (
    <div className={`relative h-full flex flex-col overflow-hidden bg-slate-900 transition-transform duration-75 ${isShaking ? 'scale-105' : 'scale-100'}`}>
      <div 
        className="absolute inset-0 bg-cover bg-bottom opacity-60 cursor-crosshair"
        style={{ backgroundImage: `url(${ORCHARD_BG})` }}
        onClick={handlePlace}
      />

      <WindEffectsOverlay wind={wind} />

      <header className="relative z-10 p-6 pt-12 bg-gradient-to-b from-black/80 to-transparent text-center pointer-events-none">
        <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic">
          {playerName}'s Turn to Hide Traps!
        </h2>
        <p className="text-primary font-bold text-sm uppercase">Place items for {opponentName} to hit!</p>
      </header>

      {/* Floating Error Message */}
      {errorMsg && (
        <div 
          className="absolute z-50 pointer-events-none font-black text-red-500 text-xl animate-bounce whitespace-nowrap"
          style={{ 
            left: `${errorMsg.x}%`, 
            top: `${errorMsg.y}%`, 
            transform: 'translate(-50%, -100%)',
            textShadow: '2px 2px 0px white'
          }}
        >
          {errorMsg.text}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        {fruits.map(f => (
          <div 
            key={f.id} 
            className="absolute flex flex-col items-center animate-bounce-slight" 
            style={{ left: `${f.x}%`, top: `${f.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Wooden branch stem & fluttering leaf */}
            <div className="relative -mb-1 flex flex-col items-center">
              <div className="w-1.5 h-3.5 bg-amber-900 rounded-t-full shadow-xs" />
              <div className="absolute -top-1 -right-2.5 w-3 h-1.5 bg-emerald-500 rounded-full rotate-[-25deg]" />
            </div>
            <div className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
              <span className="text-4xl">{FRUIT_ICONS[f.type]}</span>
            </div>
          </div>
        ))}
        {obstacles.map(o => (
          <div 
            key={o.id} 
            className="absolute size-12 bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-slate-900" 
            style={{ left: `${o.x}%`, top: `${o.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span className="text-2xl">{OBSTACLE_ICONS[o.type]}</span>
            <div className="absolute inset-[-80%] rounded-full border-2 border-red-500/10" />
          </div>
        ))}
      </div>

      <footer className="relative z-20 mt-auto p-6 bg-white dark:bg-slate-800 rounded-t-[2.5rem] shadow-2xl border-t border-white/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase transition-colors ${fruits.length === FRUIT_BUDGET ? 'bg-primary text-slate-900' : 'bg-slate-100 dark:bg-slate-700'}`}>
              Fruits: {fruits.length}/{FRUIT_BUDGET}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase transition-colors ${obstacles.length === OBSTACLE_BUDGET ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
              Traps: {obstacles.length}/{OBSTACLE_BUDGET}
            </div>
          </div>
          <button onClick={removeLast} className="text-red-500 font-bold text-xs uppercase flex items-center gap-1 active:opacity-50">
            <span className="material-symbols-outlined text-sm">undo</span> Undo
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[...Object.values(FruitType), ...Object.values(ObstacleType)].map(type => (
            <button 
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-shrink-0 size-14 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-sm
                ${selectedType === type ? 'bg-primary border-4 border-white scale-110' : 'bg-slate-50 dark:bg-slate-700'}`}
            >
              {Object.values(FruitType).includes(type as any) ? FRUIT_ICONS[type as FruitType] : OBSTACLE_ICONS[type as ObstacleType]}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onFinish(fruits, obstacles)}
          disabled={fruits.length === 0}
          className={`w-full h-16 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl transition-all
            ${fruits.length > 0 ? 'bg-primary text-slate-900 active:scale-95' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'}`}
        >
          READY FOR {opponentName}!
        </button>
      </footer>
    </div>
  );
};

export default PlacementScene;