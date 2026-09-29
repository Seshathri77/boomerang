export enum GameState {
  HOME = 'HOME',
  MAP = 'MAP',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS',
  SKINS = 'SKINS',
  VS_SETUP = 'VS_SETUP',
  VS_PLACE = 'VS_PLACE',
  VS_PLAY = 'VS_PLAY'
}

export enum FruitType {
  APPLE = 'APPLE',
  BANANA = 'BANANA',
  PINEAPPLE = 'PINEAPPLE',
  ORANGE = 'ORANGE'
}

export enum ObstacleType {
  BEEHIVE = 'BEEHIVE',
  BRANCH = 'BRANCH',
  ROCK = 'ROCK',
  SPIDER_WEB = 'SPIDER_WEB',
  BIRD = 'BIRD'
}

export interface Fruit {
  id: string;
  type: FruitType;
  x: number; 
  y: number; 
  isSliced: boolean;
  score: number;
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
}

export interface LevelConfig {
  id: number;
  fruits: Fruit[];
  obstacles?: Obstacle[];
  targetScore: number;
  maxThrows: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Skin {
  id: string;
  name: string;
  colors: [string, string, string]; // [start, mid, end]
  trailColor: string;
  price: number;
  glow?: boolean;
}

export interface PlayerStats {
  totalScore: number;
  unlockedLevels: number;
  currentLevelId: number;
  unlockedSkinIds: string[];
  selectedSkinId: string;
  lastLevelResults?: {
    score: number;
    fruitsCut: number;
    totalFruits: number;
    stars: number;
  };
}

export interface VSPlayer {
  id: number;
  name: string;
  score: number;
  fruitsPlaced: Fruit[];
  obstaclesPlaced: Obstacle[];
}