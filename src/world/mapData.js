/**
 * Map Data Definitions
 *
 * Contains tile map configurations for different levels/areas.
 * Each map uses a grid-based structure with tile indices.
 *
 * Tile Index Reference:
 * 0 = Empty (transparent)
 * 1 = Light Water
 * 2 = Dark Water
 * 3 = Sand
 * 4 = Rock
 * 5 = Coral (orange)
 * 6 = Seaweed
 * 7 = Dark Rock
 * 8 = Dark Sand
 * 9 = Coral (pink)
 * 10 = Bubble area
 */

/**
 * Map 1: Shallow Reef
 * A bright, sandy area with scattered coral formations
 */
export const SHALLOW_REEF = {
  id: 'shallow_reef',
  name: 'Shallow Reef',
  columns: 16,
  rows: 12,
  tileSize: 64,
  tiles: [
    // Row 0
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Row 1
    1, 1, 10, 1, 1, 1, 1, 10, 1, 1, 1, 1, 10, 1, 1, 1,
    // Row 2
    1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1,
    // Row 3
    1, 1, 1, 5, 5, 5, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1,
    // Row 4
    1, 4, 1, 1, 5, 1, 1, 1, 1, 1, 5, 1, 1, 1, 4, 1,
    // Row 5
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Row 6
    1, 1, 6, 1, 1, 1, 4, 4, 1, 1, 1, 6, 1, 1, 1, 1,
    // Row 7
    1, 1, 6, 1, 1, 4, 4, 4, 1, 1, 1, 6, 1, 1, 1, 1,
    // Row 8
    3, 3, 6, 3, 3, 3, 4, 3, 3, 3, 3, 6, 3, 3, 3, 3,
    // Row 9
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    // Row 10
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    // Row 11
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8
  ],
  getTile: function(col, row) {
    if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) {
      return 0;
    }
    return this.tiles[row * this.columns + col];
  },
  get size() {
    return this.columns * this.rows;
  }
};

/**
 * Map 2: Deep Cavern
 * A darker, more mysterious underwater cave system
 */
export const DEEP_CAVERN = {
  id: 'deep_cavern',
  name: 'Deep Cavern',
  columns: 16,
  rows: 12,
  tileSize: 64,
  tiles: [
    // Row 0
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    // Row 1
    2, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 7, 7, 7, 7, 2,
    // Row 2
    2, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 2,
    // Row 3
    2, 7, 2, 2, 9, 2, 2, 10, 2, 2, 9, 2, 2, 2, 7, 2,
    // Row 4
    2, 2, 2, 9, 9, 9, 2, 2, 2, 9, 9, 9, 2, 2, 2, 2,
    // Row 5
    2, 2, 2, 2, 9, 2, 2, 2, 2, 2, 9, 2, 2, 2, 2, 2,
    // Row 6
    2, 7, 2, 2, 2, 2, 7, 7, 7, 2, 2, 2, 2, 7, 7, 2,
    // Row 7
    2, 7, 7, 2, 2, 7, 7, 7, 7, 7, 2, 2, 7, 7, 7, 2,
    // Row 8
    8, 8, 7, 7, 7, 7, 7, 8, 8, 7, 7, 7, 7, 7, 8, 8,
    // Row 9
    8, 8, 8, 7, 7, 7, 8, 8, 8, 8, 7, 7, 7, 8, 8, 8,
    // Row 10
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    // Row 11
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8
  ],
  getTile: function(col, row) {
    if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) {
      return 0;
    }
    return this.tiles[row * this.columns + col];
  },
  get size() {
    return this.columns * this.rows;
  }
};

/**
 * Map 3: Coral Garden
 * A vibrant area filled with coral formations and plant life
 */
export const CORAL_GARDEN = {
  id: 'coral_garden',
  name: 'Coral Garden',
  columns: 16,
  rows: 12,
  tileSize: 64,
  tiles: [
    // Row 0
    1, 10, 1, 1, 1, 10, 1, 1, 1, 1, 10, 1, 1, 1, 10, 1,
    // Row 1
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Row 2
    1, 5, 5, 1, 9, 9, 1, 1, 1, 5, 5, 1, 9, 9, 1, 1,
    // Row 3
    1, 5, 5, 5, 9, 9, 9, 1, 5, 5, 5, 5, 9, 9, 9, 1,
    // Row 4
    1, 1, 5, 1, 1, 9, 1, 1, 1, 5, 1, 1, 1, 9, 1, 1,
    // Row 5
    1, 6, 1, 1, 6, 1, 1, 6, 1, 1, 1, 6, 1, 1, 6, 1,
    // Row 6
    1, 6, 1, 4, 6, 1, 1, 6, 1, 4, 1, 6, 1, 4, 6, 1,
    // Row 7
    3, 6, 3, 4, 6, 3, 3, 6, 3, 4, 3, 6, 3, 4, 6, 3,
    // Row 8
    3, 6, 3, 4, 6, 3, 3, 6, 3, 4, 3, 6, 3, 4, 6, 3,
    // Row 9
    3, 3, 3, 4, 3, 3, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3,
    // Row 10
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    // Row 11
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8
  ],
  getTile: function(col, row) {
    if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) {
      return 0;
    }
    return this.tiles[row * this.columns + col];
  },
  get size() {
    return this.columns * this.rows;
  }
};

/**
 * Map 4: Open Ocean
 * A more sparse, open water environment
 */
export const OPEN_OCEAN = {
  id: 'open_ocean',
  name: 'Open Ocean',
  columns: 16,
  rows: 12,
  tileSize: 64,
  tiles: [
    // Row 0
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Row 1
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Row 2
    1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Row 3
    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
    // Row 4
    2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2,
    // Row 5
    2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
    // Row 6
    2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
    // Row 7
    2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2,
    // Row 8
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    // Row 9
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    // Row 10
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    // Row 11
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8
  ],
  getTile: function(col, row) {
    if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) {
      return 0;
    }
    return this.tiles[row * this.columns + col];
  },
  get size() {
    return this.columns * this.rows;
  }
};

/**
 * Array of all available maps
 */
export const ALL_MAPS = [
  SHALLOW_REEF,
  DEEP_CAVERN,
  CORAL_GARDEN,
  OPEN_OCEAN
];

/**
 * Gets a map by ID
 * @param {string} id - Map ID
 * @returns {Object|null} Map object or null if not found
 */
export function getMapById(id) {
  return ALL_MAPS.find(map => map.id === id) || null;
}

/**
 * Gets a random map
 * @returns {Object} Random map object
 */
export function getRandomMap() {
  return ALL_MAPS[Math.floor(Math.random() * ALL_MAPS.length)];
}
