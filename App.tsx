
import React, { useState, useCallback, useMemo } from 'react';
import { GameState, PlayerStats, LevelConfig, VSPlayer, Fruit, Obstacle } from './types';
import { LEVELS, SKINS } from './constants';
import Home from './components/Home';
import Map from './components/Map';
import GameScene from './components/GameScene';
import Results from './components/Results';
import SkinsShop from './components/SkinsShop';
import PlacementScene from './components/PlacementScene';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [stats, setStats] = useState<PlayerStats>({
    totalScore: 500,
    unlockedLevels: 1,
    currentLevelId: 1,
    unlockedSkinIds: ['classic'],
    selectedSkinId: 'classic',
  });

  // VS Mode State
  const [vsPlayers, setVsPlayers] = useState<VSPlayer[]>([
    { id: 1, name: 'Player 1', score: 0, fruitsPlaced: [], obstaclesPlaced: [] },
    { id: 2, name: 'Player 2', score: 0, fruitsPlaced: [], obstaclesPlaced: [] },
  ]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0); // Who is throwing
  // Use isVsMode to track if we are in a VS session
  const [isVsMode, setIsVsMode] = useState(false);

  const currentLevel = useMemo(() => 
    LEVELS.find(l => l.id === stats.currentLevelId) || LEVELS[0]
  , [stats.currentLevelId]);

  const currentSkin = useMemo(() => 
    SKINS.find(s => s.id === stats.selectedSkinId) || SKINS[0]
  , [stats.selectedSkinId]);

  const handleStartGame = useCallback((levelId: number) => {
    setStats(prev => ({ ...prev, currentLevelId: levelId }));
    setIsVsMode(false);
    setGameState(GameState.PLAYING);
  }, []);

  const handleLevelComplete = useCallback((score: number, fruitsCut: number, totalFruits: number) => {
    if (gameState === GameState.VS_PLAY) {
      const updatedPlayers = [...vsPlayers];
      updatedPlayers[currentPlayerIdx].score = score;
      setVsPlayers(updatedPlayers);
      
      if (currentPlayerIdx === 0) {
        // Player 1 finished, Player 1 now places for Player 2
        setCurrentPlayerIdx(1);
        setGameState(GameState.VS_PLACE);
      } else {
        // Player 2 finished throwing
        setGameState(GameState.RESULTS);
      }
      return;
    }

    const stars = fruitsCut === totalFruits ? 3 : fruitsCut >= totalFruits * 0.6 ? 2 : 1;
    const isSuccess = score >= currentLevel.targetScore;

    setStats(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      unlockedLevels: isSuccess ? Math.max(prev.unlockedLevels, stats.currentLevelId + 1) : prev.unlockedLevels,
      lastLevelResults: {
        score,
        fruitsCut,
        totalFruits,
        stars
      }
    }));
    setGameState(GameState.RESULTS);
  }, [currentLevel.targetScore, stats.currentLevelId, gameState, vsPlayers, currentPlayerIdx]);

  const handlePlacementFinish = (fruits: Fruit[], obstacles: Obstacle[]) => {
    const updatedPlayers = [...vsPlayers];
    // These fruits/obstacles are for the CURRENT player (the thrower) to hit
    updatedPlayers[currentPlayerIdx].fruitsPlaced = fruits;
    updatedPlayers[currentPlayerIdx].obstaclesPlaced = obstacles;
    setVsPlayers(updatedPlayers);
    setGameState(GameState.VS_PLAY);
  };

  const handleBuySkin = useCallback((skinId: string, price: number) => {
    setStats(prev => {
      if (prev.totalScore >= price) {
        return {
          ...prev,
          totalScore: prev.totalScore - price,
          unlockedSkinIds: [...prev.unlockedSkinIds, skinId],
          selectedSkinId: skinId
        };
      }
      return prev;
    });
  }, []);

  const handleEquipSkin = useCallback((skinId: string) => {
    setStats(prev => ({ ...prev, selectedSkinId: skinId }));
  }, []);

  const navigateToMap = useCallback(() => {
    setIsVsMode(false);
    setGameState(GameState.MAP);
  }, []);
  const navigateToHome = useCallback(() => {
    setIsVsMode(false);
    setGameState(GameState.HOME);
  }, []);
  const navigateToSkins = useCallback(() => {
    setIsVsMode(false);
    setGameState(GameState.SKINS);
  }, []);
  const startVSMode = () => {
    setVsPlayers([
      { id: 1, name: 'Player 1', score: 0, fruitsPlaced: [], obstaclesPlaced: [] },
      { id: 2, name: 'Player 2', score: 0, fruitsPlaced: [], obstaclesPlaced: [] },
    ]);
    setCurrentPlayerIdx(0);
    setIsVsMode(true);
    // Player 2 places first for Player 1
    setGameState(GameState.VS_PLACE);
  };

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-md mx-auto h-full relative overflow-hidden bg-white dark:bg-background-dark shadow-2xl">
        {gameState === GameState.HOME && (
          <Home 
            onPlay={navigateToMap} 
            onSkins={navigateToSkins}
            onVSMode={startVSMode}
            totalScore={stats.totalScore} 
            selectedSkinId={stats.selectedSkinId}
          />
        )}
        
        {gameState === GameState.MAP && (
          <Map 
            unlockedLevels={stats.unlockedLevels} 
            totalScore={stats.totalScore}
            onSelectLevel={handleStartGame}
            onBack={navigateToHome}
            onShop={navigateToSkins}
          />
        )}

        {gameState === GameState.SKINS && (
          <SkinsShop 
            unlockedSkinIds={stats.unlockedSkinIds}
            selectedSkinId={stats.selectedSkinId}
            totalScore={stats.totalScore}
            onSelect={handleEquipSkin}
            onBuy={handleBuySkin}
            onBack={navigateToHome}
          />
        )}

        {gameState === GameState.VS_PLACE && (
          <PlacementScene 
            playerName={vsPlayers[1 - currentPlayerIdx].name} 
            opponentName={vsPlayers[currentPlayerIdx].name}
            onFinish={handlePlacementFinish}
          />
        )}

        {gameState === GameState.VS_PLAY && (
          <GameScene 
            level={{ ...currentLevel, maxThrows: 3, targetScore: 0 }}
            customFruits={vsPlayers[currentPlayerIdx].fruitsPlaced}
            customObstacles={vsPlayers[currentPlayerIdx].obstaclesPlaced}
            turnTitle={`${vsPlayers[currentPlayerIdx].name}'s Turn`}
            onComplete={handleLevelComplete}
            onQuit={navigateToHome}
            equippedSkin={currentSkin}
          />
        )}

        {gameState === GameState.PLAYING && (
          <GameScene 
            level={currentLevel}
            onComplete={handleLevelComplete}
            onQuit={navigateToMap}
            equippedSkin={currentSkin}
          />
        )}

        {gameState === GameState.RESULTS && (
          <Results 
            levelId={stats.currentLevelId}
            /* Fix: Use isVsMode instead of checking GameState.VS_PLAY which is unreachable when gameState is RESULTS */
            results={isVsMode ? {
              score: vsPlayers[0].score, // Overloaded for VS mode display
              fruitsCut: vsPlayers[0].score,
              totalFruits: vsPlayers[1].score,
              stars: vsPlayers[0].score > vsPlayers[1].score ? 3 : 1
            } : stats.lastLevelResults!}
            vsMode={isVsMode}
            vsPlayers={vsPlayers}
            onRetry={isVsMode ? startVSMode : () => handleStartGame(stats.currentLevelId)}
            onNext={navigateToMap}
            onHome={navigateToHome}
          />
        )}
      </div>
    </div>
  );
};

export default App;
