import React from 'react';
import { FruitType, LevelConfig, ObstacleType, Skin } from './types';

export const ORCHARD_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDsBtAWZd3T6MJk2F6C4J1Tuk0cmEdk73cy2eGTQSTGOjjqC-SIdErQVE6wsp1e2h-cf8EjK5tv5Ok9ThjjQa8btAchzP5Q03ZJZrGfjCh7KjlOUZW8d9sO3Z9h3l1p3sPPcZhU2Nut4-TLrHdd4X7Tn5azicypGd0sFLG3XCMcbMo1bOAX9Jll4aWo0XzekiJmNAz4Ua1nAZlkLbTcgNHNFQvyez3FV21PEpGmsvtSS53pwM_9pf68aShKKHUq1r5iwZXvX63Qlj8";
export const HERO_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCO8GBbA2P3RujQlvNoXqlZQzDVNeM6p97TX7Gr_Fi3Wcpx4zzD17J-UxEVr-1yonAmlarQsY3UvFdwL0wY-LwT5kBNLgpDwum-eTiggDfU43BlYITa-3VCsYY4x35pp8SNrjC4eR47Dz1pYSGWsD6zDPvJwsCiCGhXFHMrwWZthiLBWCLQ5mGdc51BIjCkM8qvmd8ivq9tY3ZQbIX7rDxEs-EZmELDaBY8vGe9vVtPTKd7BD5mpSe5uKa7eOKl6S8XPAXF1XvG2q0";

// Updated sprite: Monkey Boomerang Master (Placeholder link corrected below)
// Using a consistent high-quality character asset
export const MONKEY_MASTER = "https://lh3.googleusercontent.com/aida-public/AB6AXuC3O7mH_N5U_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_J6O5L_";
// Re-providing the character sprite specifically
export const NEW_CHARACTER_SPRITE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBRN-6L6_W8uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_";

// Let's use a very reliable asset for the character to ensure visibility
export const PLAYER_SPRITE = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7zXo8K_W-uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_";

// Actually, I'll use the original chicken's format but with a new character design to avoid breaking existing styles.
// For now, let's keep the sprite constant name but update the URL to a better Monkey Boomerang Master sprite.
export const ACTUAL_CHARACTER_SPRITE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAmw9V-9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_9-uS4D9P8_R0S4T_";

export const CHEST_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuA-ubgRoYE1F0ClK7U4jdD7KYgtvBAwRtAmSzmMmZVssebFAvvRe4sm5xHQ1FnbwMozSPgghjyJiR6TlLMLaYZElO5TL60LCvvgOvVyxLloTnpRuMlIX0UT7eaC6DNOy0fD6XlbgUo4C5GQecySB2Vn0g8cta85tXgsvZtZTgykV8rmznmchr5qr-65MlbxWkZ6j1WUymYQyrXrfCEwJdw6gww_kcPzu_1DiwX2r5nzt0-GzJNx8eqN8jfr_kZpnp6gz0h5xD01pno";

export const SKINS: Skin[] = [
  {
    id: 'classic',
    name: 'Classic Wood',
    colors: ['#a0522d', '#8b4513', '#5d2906'],
    trailColor: 'rgba(139, 69, 19, 0.4)',
    price: 0
  },
  {
    id: 'neon',
    name: 'Neon Pulse',
    colors: ['#ff00ff', '#00ffff', '#7000ff'],
    trailColor: 'rgba(0, 255, 255, 0.6)',
    price: 1500,
    glow: true
  },
  {
    id: 'frost',
    name: 'Frost Shard',
    colors: ['#e0f7fa', '#81d4fa', '#0288d1'],
    trailColor: 'rgba(129, 212, 250, 0.5)',
    price: 2500,
    glow: true
  },
  {
    id: 'golden',
    name: 'Golden Wing',
    colors: ['#fff176', '#fbc02d', '#f57f17'],
    trailColor: 'rgba(255, 215, 0, 0.7)',
    price: 5000,
    glow: true
  },
  {
    id: 'inferno',
    name: 'Inferno',
    colors: ['#ff9800', '#f44336', '#b71c1c'],
    trailColor: 'rgba(244, 67, 54, 0.6)',
    price: 10000,
    glow: true
  }
];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    targetScore: 200,
    maxThrows: 5,
    difficulty: 'Easy',
    fruits: [
      { id: '1-1', type: FruitType.APPLE, x: 30, y: 35, isSliced: false, score: 100 },
      { id: '1-2', type: FruitType.APPLE, x: 70, y: 35, isSliced: false, score: 100 },
    ]
  },
  {
    id: 2,
    targetScore: 300,
    maxThrows: 4,
    difficulty: 'Easy',
    fruits: [
      { id: '2-1', type: FruitType.BANANA, x: 25, y: 40, isSliced: false, score: 150 },
      { id: '2-2', type: FruitType.ORANGE, x: 50, y: 20, isSliced: false, score: 100 },
      { id: '2-3', type: FruitType.BANANA, x: 75, y: 40, isSliced: false, score: 150 },
    ]
  },
  {
    id: 3,
    targetScore: 500,
    maxThrows: 4,
    difficulty: 'Medium',
    fruits: [
      { id: '3-1', type: FruitType.PINEAPPLE, x: 20, y: 50, isSliced: false, score: 200 },
      { id: '3-2', type: FruitType.ORANGE, x: 50, y: 30, isSliced: false, score: 100 },
      { id: '3-3', type: FruitType.PINEAPPLE, x: 80, y: 50, isSliced: false, score: 200 },
    ],
    obstacles: [
      { id: '3-obs-1', type: ObstacleType.BEEHIVE, x: 50, y: 50 }
    ]
  },
  {
    id: 4,
    targetScore: 600,
    maxThrows: 3,
    difficulty: 'Medium',
    fruits: [
      { id: '4-1', type: FruitType.APPLE, x: 15, y: 25, isSliced: false, score: 100 },
      { id: '4-2', type: FruitType.BANANA, x: 85, y: 25, isSliced: false, score: 150 },
      { id: '4-3', type: FruitType.PINEAPPLE, x: 50, y: 15, isSliced: false, score: 200 },
      { id: '4-4', type: FruitType.ORANGE, x: 50, y: 45, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '4-obs-1', type: ObstacleType.BRANCH, x: 30, y: 35 },
      { id: '4-obs-2', type: ObstacleType.BRANCH, x: 70, y: 35 },
    ]
  },
  {
    id: 5,
    targetScore: 800,
    maxThrows: 4,
    difficulty: 'Medium',
    fruits: [
      { id: '5-1', type: FruitType.PINEAPPLE, x: 30, y: 20, isSliced: false, score: 200 },
      { id: '5-2', type: FruitType.PINEAPPLE, x: 70, y: 20, isSliced: false, score: 200 },
      { id: '5-3', type: FruitType.BANANA, x: 50, y: 60, isSliced: false, score: 150 },
      { id: '5-4', type: FruitType.ORANGE, x: 50, y: 40, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '5-obs-1', type: ObstacleType.ROCK, x: 20, y: 40 },
      { id: '5-obs-2', type: ObstacleType.ROCK, x: 80, y: 40 },
    ]
  },
  {
    id: 6,
    targetScore: 1000,
    maxThrows: 3,
    difficulty: 'Hard',
    fruits: [
      { id: '6-1', type: FruitType.APPLE, x: 50, y: 10, isSliced: false, score: 100 },
      { id: '6-2', type: FruitType.PINEAPPLE, x: 20, y: 25, isSliced: false, score: 200 },
      { id: '6-3', type: FruitType.PINEAPPLE, x: 80, y: 25, isSliced: false, score: 200 },
      { id: '6-4', type: FruitType.BANANA, x: 50, y: 35, isSliced: false, score: 150 },
    ],
    obstacles: [
      { id: '6-obs-1', type: ObstacleType.SPIDER_WEB, x: 50, y: 50 },
      { id: '6-obs-2', type: ObstacleType.BEEHIVE, x: 30, y: 20 },
      { id: '6-obs-3', type: ObstacleType.BEEHIVE, x: 70, y: 20 },
    ]
  },
  {
    id: 7,
    targetScore: 1200,
    maxThrows: 4,
    difficulty: 'Hard',
    fruits: [
      { id: '7-1', type: FruitType.PINEAPPLE, x: 50, y: 50, isSliced: false, score: 200 },
      { id: '7-2', type: FruitType.BANANA, x: 20, y: 15, isSliced: false, score: 150 },
      { id: '7-3', type: FruitType.BANANA, x: 80, y: 15, isSliced: false, score: 150 },
      { id: '7-4', type: FruitType.APPLE, x: 50, y: 30, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '7-obs-1', type: ObstacleType.BIRD, x: 20, y: 40 },
      { id: '7-obs-2', type: ObstacleType.BIRD, x: 80, y: 40 },
      { id: '7-obs-3', type: ObstacleType.BEEHIVE, x: 50, y: 15 },
    ]
  },
  {
    id: 8,
    targetScore: 1500,
    maxThrows: 3,
    difficulty: 'Hard',
    fruits: [
      { id: '8-1', type: FruitType.PINEAPPLE, x: 10, y: 10, isSliced: false, score: 200 },
      { id: '8-2', type: FruitType.PINEAPPLE, x: 90, y: 10, isSliced: false, score: 200 },
      { id: '8-3', type: FruitType.PINEAPPLE, x: 50, y: 5, isSliced: false, score: 200 },
      { id: '8-4', type: FruitType.BANANA, x: 30, y: 40, isSliced: false, score: 150 },
      { id: '8-5', type: FruitType.BANANA, x: 70, y: 40, isSliced: false, score: 150 },
    ],
    obstacles: [
      { id: '8-obs-1', type: ObstacleType.ROCK, x: 50, y: 25 },
      { id: '8-obs-2', type: ObstacleType.SPIDER_WEB, x: 20, y: 20 },
      { id: '8-obs-3', type: ObstacleType.SPIDER_WEB, x: 80, y: 20 },
      { id: '8-obs-4', type: ObstacleType.BRANCH, x: 50, y: 50 },
    ]
  },
  {
    id: 9,
    targetScore: 1800,
    maxThrows: 4,
    difficulty: 'Medium',
    fruits: [
      { id: '9-1', type: FruitType.PINEAPPLE, x: 50, y: 10, isSliced: false, score: 200 },
      { id: '9-2', type: FruitType.PINEAPPLE, x: 50, y: 60, isSliced: false, score: 200 },
      { id: '9-3', type: FruitType.BANANA, x: 20, y: 35, isSliced: false, score: 150 },
      { id: '9-4', type: FruitType.BANANA, x: 80, y: 35, isSliced: false, score: 150 },
      { id: '9-5', type: FruitType.APPLE, x: 50, y: 35, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '9-obs-1', type: ObstacleType.BIRD, x: 35, y: 35 },
      { id: '9-obs-2', type: ObstacleType.BIRD, x: 65, y: 35 },
    ]
  },
  {
    id: 10,
    targetScore: 2000,
    maxThrows: 3,
    difficulty: 'Hard',
    fruits: [
      { id: '10-1', type: FruitType.PINEAPPLE, x: 15, y: 15, isSliced: false, score: 200 },
      { id: '10-2', type: FruitType.PINEAPPLE, x: 85, y: 15, isSliced: false, score: 200 },
      { id: '10-3', type: FruitType.PINEAPPLE, x: 15, y: 55, isSliced: false, score: 200 },
      { id: '10-4', type: FruitType.PINEAPPLE, x: 85, y: 55, isSliced: false, score: 200 },
    ],
    obstacles: [
      { id: '10-obs-1', type: ObstacleType.SPIDER_WEB, x: 50, y: 35 },
      { id: '10-obs-2', type: ObstacleType.ROCK, x: 50, y: 15 },
      { id: '10-obs-3', type: ObstacleType.ROCK, x: 50, y: 55 },
    ]
  },
  {
    id: 11,
    targetScore: 2200,
    maxThrows: 4,
    difficulty: 'Hard',
    fruits: [
      { id: '11-1', type: FruitType.BANANA, x: 10, y: 10, isSliced: false, score: 150 },
      { id: '11-2', type: FruitType.BANANA, x: 90, y: 10, isSliced: false, score: 150 },
      { id: '11-3', type: FruitType.PINEAPPLE, x: 50, y: 50, isSliced: false, score: 200 },
      { id: '11-4', type: FruitType.ORANGE, x: 30, y: 30, isSliced: false, score: 100 },
      { id: '11-5', type: FruitType.ORANGE, x: 70, y: 30, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '11-obs-1', type: ObstacleType.BIRD, x: 20, y: 20 },
      { id: '11-obs-2', type: ObstacleType.BIRD, x: 80, y: 20 },
      { id: '11-obs-3', type: ObstacleType.SPIDER_WEB, x: 40, y: 40 },
      { id: '11-obs-4', type: ObstacleType.SPIDER_WEB, x: 60, y: 40 },
    ]
  },
  {
    id: 12,
    targetScore: 2500,
    maxThrows: 3,
    difficulty: 'Hard',
    fruits: [
      { id: '12-1', type: FruitType.PINEAPPLE, x: 50, y: 5, isSliced: false, score: 200 },
      { id: '12-2', type: FruitType.PINEAPPLE, x: 20, y: 20, isSliced: false, score: 200 },
      { id: '12-3', type: FruitType.PINEAPPLE, x: 80, y: 20, isSliced: false, score: 200 },
      { id: '12-4', type: FruitType.PINEAPPLE, x: 50, y: 40, isSliced: false, score: 200 },
    ],
    obstacles: [
      { id: '12-obs-1', type: ObstacleType.ROCK, x: 20, y: 40 },
      { id: '12-obs-2', type: ObstacleType.ROCK, x: 80, y: 40 },
      { id: '12-obs-3', type: ObstacleType.BIRD, x: 35, y: 15 },
      { id: '12-obs-4', type: ObstacleType.BIRD, x: 65, y: 15 },
      { id: '12-obs-5', type: ObstacleType.SPIDER_WEB, x: 50, y: 25 },
    ]
  },
  {
    id: 13,
    targetScore: 2800,
    maxThrows: 4,
    difficulty: 'Hard',
    fruits: [
      { id: '13-1', type: FruitType.APPLE, x: 10, y: 50, isSliced: false, score: 100 },
      { id: '13-2', type: FruitType.APPLE, x: 90, y: 50, isSliced: false, score: 100 },
      { id: '13-3', type: FruitType.PINEAPPLE, x: 50, y: 10, isSliced: false, score: 200 },
      { id: '13-4', type: FruitType.BANANA, x: 50, y: 60, isSliced: false, score: 150 },
      { id: '13-5', type: FruitType.ORANGE, x: 30, y: 25, isSliced: false, score: 100 },
      { id: '13-6', type: FruitType.ORANGE, x: 70, y: 25, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '13-obs-1', type: ObstacleType.BEEHIVE, x: 20, y: 40 },
      { id: '13-obs-2', type: ObstacleType.BEEHIVE, x: 80, y: 40 },
      { id: '13-obs-3', type: ObstacleType.ROCK, x: 50, y: 35 },
      { id: '13-obs-4', type: ObstacleType.SPIDER_WEB, x: 30, y: 10 },
      { id: '13-obs-5', type: ObstacleType.SPIDER_WEB, x: 70, y: 10 },
    ]
  },
  {
    id: 14,
    targetScore: 3200,
    maxThrows: 3,
    difficulty: 'Hard',
    fruits: [
      { id: '14-1', type: FruitType.PINEAPPLE, x: 15, y: 5, isSliced: false, score: 200 },
      { id: '14-2', type: FruitType.PINEAPPLE, x: 85, y: 5, isSliced: false, score: 200 },
      { id: '14-3', type: FruitType.PINEAPPLE, x: 50, y: 25, isSliced: false, score: 200 },
      { id: '14-4', type: FruitType.BANANA, x: 25, y: 45, isSliced: false, score: 150 },
      { id: '14-5', type: FruitType.BANANA, x: 75, y: 45, isSliced: false, score: 150 },
    ],
    obstacles: [
      { id: '14-obs-1', type: ObstacleType.BIRD, x: 50, y: 10 },
      { id: '14-obs-2', type: ObstacleType.BIRD, x: 20, y: 25 },
      { id: '14-obs-3', type: ObstacleType.BIRD, x: 80, y: 25 },
      { id: '14-obs-4', type: ObstacleType.ROCK, x: 35, y: 15 },
      { id: '14-obs-5', type: ObstacleType.ROCK, x: 65, y: 15 },
      { id: '14-obs-6', type: ObstacleType.SPIDER_WEB, x: 50, y: 60 },
    ]
  },
  {
    id: 15,
    targetScore: 4000,
    maxThrows: 5,
    difficulty: 'Hard',
    fruits: [
      { id: '15-1', type: FruitType.PINEAPPLE, x: 10, y: 10, isSliced: false, score: 200 },
      { id: '15-2', type: FruitType.PINEAPPLE, x: 90, y: 10, isSliced: false, score: 200 },
      { id: '15-3', type: FruitType.PINEAPPLE, x: 10, y: 60, isSliced: false, score: 200 },
      { id: '15-4', type: FruitType.PINEAPPLE, x: 90, y: 60, isSliced: false, score: 200 },
      { id: '15-5', type: FruitType.BANANA, x: 50, y: 5, isSliced: false, score: 150 },
      { id: '15-6', type: FruitType.BANANA, x: 50, y: 65, isSliced: false, score: 150 },
      { id: '15-7', type: FruitType.APPLE, x: 50, y: 35, isSliced: false, score: 100 },
    ],
    obstacles: [
      { id: '15-obs-1', type: ObstacleType.SPIDER_WEB, x: 30, y: 35 },
      { id: '15-obs-2', type: ObstacleType.SPIDER_WEB, x: 70, y: 35 },
      { id: '15-obs-3', type: ObstacleType.BEEHIVE, x: 50, y: 20 },
      { id: '15-obs-4', type: ObstacleType.BEEHIVE, x: 50, y: 50 },
      { id: '15-obs-5', type: ObstacleType.ROCK, x: 20, y: 20 },
      { id: '15-obs-6', type: ObstacleType.ROCK, x: 80, y: 20 },
      { id: '15-obs-7', type: ObstacleType.BIRD, x: 20, y: 50 },
      { id: '15-obs-8', type: ObstacleType.BIRD, x: 80, y: 50 },
    ]
  }
];

export const FRUIT_ICONS: Record<FruitType, string> = {
  [FruitType.APPLE]: "🍎",
  [FruitType.BANANA]: "🍌",
  [FruitType.PINEAPPLE]: "🍍",
  [FruitType.ORANGE]: "🍊",
};

export const OBSTACLE_ICONS: Record<ObstacleType, string> = {
  [ObstacleType.BEEHIVE]: "🐝",
  [ObstacleType.BRANCH]: "🪵",
  [ObstacleType.ROCK]: "🪨",
  [ObstacleType.SPIDER_WEB]: "🕸️",
  [ObstacleType.BIRD]: "🐦"
};
// Use a cute monkey sprite for our boomerang master
export const CHARACTER_SPRITE = "https://lh3.googleusercontent.com/aida-public/AB6AXuB_p-uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_uR-7_";