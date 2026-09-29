import React from 'react';
import { CHEST_IMG } from '../constants';
import { VSPlayer } from '../types';

interface ResultsProps {
  levelId: number;
  results: {
    score: number;
    fruitsCut: number;
    totalFruits: number;
    stars: number;
  };
  vsMode?: boolean;
  vsPlayers?: VSPlayer[];
  onRetry: () => void;
  onNext: () => void;
  onHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ levelId, results, onRetry, onNext, onHome, vsMode, vsPlayers }) => {
  const isSuccess = results.stars > 0;
  const winner = vsMode && vsPlayers ? (vsPlayers[0].score > vsPlayers[1].score ? vsPlayers[0] : vsPlayers[1]) : null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 animate-bounce-slight">
        <div className="bg-primary text-slate-900 px-8 py-2 rounded-full shadow-lg transform rotate-1 border-4 border-white mb-2">
          <h1 className="text-xl font-black uppercase tracking-widest">{vsMode ? 'Match Ended' : `Level ${levelId}`}</h1>
        </div>
        
        <h2 className="text-4xl font-black text-center drop-shadow-sm text-slate-900 dark:text-white uppercase leading-tight">
          {vsMode ? (vsPlayers![0].score === vsPlayers![1].score ? "IT'S A DRAW!" : `${winner?.name} WINS!`) : (isSuccess ? 'LEVEL COMPLETE!' : 'LEVEL FAILED')}
        </h2>

        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col gap-6">
          {vsMode && vsPlayers ? (
             <div className="flex flex-col gap-4">
                {vsPlayers.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 ${p.id === winner?.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center font-black ${p.id === winner?.id ? 'bg-primary text-slate-900' : 'bg-slate-200 text-slate-500'}`}>
                        {p.name[0]}
                      </div>
                      <span className="font-black text-slate-900">{p.name}</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900">{p.score}</span>
                  </div>
                ))}
             </div>
          ) : (
            <>
              <div className="flex justify-center items-end gap-2 h-24 pt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex items-center justify-center ${i === 2 ? 'size-20 -translate-y-2' : 'size-16 translate-y-2'}`}>
                    <span 
                      className={`material-symbols-outlined text-[64px] ${i === 2 ? 'text-[80px]' : ''} drop-shadow-md`}
                      style={{ 
                        fontVariationSettings: "'FILL' 1",
                        color: i <= results.stars ? '#FFD700' : '#e2e8f0'
                      }}
                    >
                      star
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard icon="emoji_events" label="Score" value={results.score.toLocaleString()} color="text-primary-dark" />
                <StatCard icon="nutrition" label="Fruits" value={`${results.fruitsCut}/${results.totalFruits}`} color="text-red-600" />
              </div>
            </>
          )}

          {!vsMode && isSuccess && (
            <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-4 border border-primary/20">
              <div className="size-14 rounded-xl overflow-hidden bg-white border-2 border-white shadow-sm flex-shrink-0">
                <div 
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${CHEST_IMG})` }}
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-primary-dark uppercase">Reward Unlocked</span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Mystery Chest</p>
              </div>
              <span className="material-symbols-outlined text-primary-dark">check_circle</span>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={vsMode ? onRetry : (isSuccess ? onNext : onRetry)}
            className="game-btn w-full h-16 bg-primary text-slate-900 text-xl font-black uppercase rounded-2xl flex items-center justify-center gap-2 hover:brightness-105"
          >
            {vsMode ? 'Rematch!' : (isSuccess ? 'Next Level' : 'Try Again')}
            <span className="material-symbols-outlined">{vsMode || !isSuccess ? 'refresh' : 'arrow_forward'}</span>
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            {!vsMode && (
              <button 
                onClick={onRetry}
                className="h-12 bg-white dark:bg-slate-700 font-bold rounded-xl border-b-4 border-slate-200 dark:border-slate-900 shadow-sm flex items-center justify-center gap-2 active:border-0 active:translate-y-1 text-slate-700 dark:text-slate-200"
              >
                <span className="material-symbols-outlined text-base">refresh</span>
                Retry
              </button>
            )}
            <button 
              onClick={onHome}
              className={`h-12 bg-white dark:bg-slate-700 font-bold rounded-xl border-b-4 border-slate-200 dark:border-slate-900 shadow-sm flex items-center justify-center gap-2 active:border-0 active:translate-y-1 text-slate-700 dark:text-slate-200 ${vsMode ? 'col-span-2' : ''}`}
            >
              <span className="material-symbols-outlined text-base">home</span>
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl text-center flex flex-col items-center gap-1 shadow-inner border border-slate-100 dark:border-slate-600">
    <div className="size-10 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-sm mb-1">
      <span className={`material-symbols-outlined ${color} text-xl`}>{icon}</span>
    </div>
    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-xl font-black leading-none text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default Results;