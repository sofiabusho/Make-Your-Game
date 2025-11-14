/**
 * Tilemap Engine
 *
 * A custom tile map engine for rendering grid-based levels.
 * Efficiently renders tiles using a single tileset image and viewport culling.
 */

/**
 * Creates a tilemap system
 * @param {Object} config - Configuration object
 * @param {Object} config.world - World dimensions {width, height}
 * @param {HTMLElement} config.container - Container element for tiles
 * @returns {Object} Tilemap system API
 */
export function createTilemapSystem({ world, container }) {
  let currentMap = null;
  let tileElements = [];
  let isDirty = true;

  /**
   * Loads a map into the tilemap system
   * @param {Object} map - Map configuration object
   */
  function loadMap(map) {
    // Clear existing tiles
    clearMap();

    currentMap = map;
    isDirty = true;

    // Pre-create all tile elements
    createTileElements();
  }

  /**
   * Creates DOM elements for all tiles in the current map
   */
  function createTileElements() {
    if (!currentMap) return;

    const { columns, rows, tiles, tileSize } = currentMap;

    tileElements = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const tileIndex = currentMap.getTile(col, row);

        // Skip empty tiles (0)
        if (tileIndex === 0) continue;

        const tile = createTileElement(col, row, tileIndex, tileSize);
        tileElements.push(tile);
        container.appendChild(tile.el);
      }
    }
  }

  /**
   * Creates a single tile DOM element
   * @param {number} col - Column position
   * @param {number} row - Row position
   * @param {number} tileIndex - Tile type index
   * @param {number} tileSize - Size of each tile in pixels
   * @returns {Object} Tile object with element and metadata
   */
  function createTileElement(col, row, tileIndex, tileSize) {
    const el = document.createElement('div');
    el.className = 'tile';
    el.dataset.tileType = tileIndex;

    // Position the tile
    const x = col * tileSize;
    const y = row * tileSize;

    el.style.position = 'absolute';
    el.style.width = `${tileSize}px`;
    el.style.height = `${tileSize}px`;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    // Apply tile-specific styling using the tileset
    applyTileStyle(el, tileIndex, tileSize);

    return {
      el,
      col,
      row,
      tileIndex,
      x,
      y,
      visible: true
    };
  }

  /**
   * Applies visual styling to a tile element based on its type
   * This uses CSS background positioning to select from a tileset
   * @param {HTMLElement} el - Tile element
   * @param {number} tileIndex - Tile type index
   * @param {number} tileSize - Size of each tile
   */
  function applyTileStyle(el, tileIndex, tileSize) {
    // USE_BACKGROUND_IMAGE mode - cuts sections from background.jpeg
    const USE_BACKGROUND_IMAGE = true;

    if (USE_BACKGROUND_IMAGE) {
      // Use your background image as a tileset
      el.style.backgroundImage = 'url(/style/images/background.jpeg)';
      el.style.backgroundRepeat = 'no-repeat';

      // Define different positions in your background to use as tiles
      // Adjust these X,Y positions to cut different parts of your background
      const tilePositions = {
        1: { x: 0, y: 0 },           // Top-left corner
        2: { x: 200, y: 0 },         // Top area, offset right
        3: { x: 0, y: 300 },         // Bottom-left (sandy area)
        4: { x: 400, y: 200 },       // Middle-right (rocky area)
        5: { x: 100, y: 100 },       // Coral area
        6: { x: 300, y: 400 },       // Plant/seaweed area
        7: { x: 500, y: 300 },       // Dark rock area
        8: { x: 200, y: 500 },       // Dark sand
        9: { x: 150, y: 200 },       // Pink coral
        10: { x: 50, y: 50 }         // Bubble area
      };

      const pos = tilePositions[tileIndex] || { x: 0, y: 0 };
      el.style.backgroundPosition = `-${pos.x}px -${pos.y}px`;
      el.style.backgroundSize = 'auto'; // Keep original background size
    } else {
      // Original CSS gradient mode
      const tileTypes = {
        1: 'tile-water-light',
        2: 'tile-water-dark',
        3: 'tile-sand',
        4: 'tile-rock',
        5: 'tile-coral',
        6: 'tile-seaweed',
        7: 'tile-rock-dark',
        8: 'tile-sand-dark',
        9: 'tile-coral-pink',
        10: 'tile-bubble'
      };

      const className = tileTypes[tileIndex] || 'tile-default';
      el.classList.add(className);
    }
  }

  /**
   * Clears all tiles from the map
   */
  function clearMap() {
    tileElements.forEach(tile => {
      if (tile.el.parentNode) {
        tile.el.parentNode.removeChild(tile.el);
      }
    });
    tileElements = [];
    currentMap = null;
  }

  /**
   * Updates tile visibility based on viewport
   * Only renders tiles that are visible to improve performance
   * @param {Object} viewport - Viewport bounds {x, y, width, height}
   */
  function updateVisibility(viewport) {
    if (!currentMap) return;

    tileElements.forEach(tile => {
      const isVisible = (
        tile.x + currentMap.tileSize > viewport.x &&
        tile.x < viewport.x + viewport.width &&
        tile.y + currentMap.tileSize > viewport.y &&
        tile.y < viewport.y + viewport.height
      );

      if (isVisible !== tile.visible) {
        tile.visible = isVisible;
        tile.el.style.opacity = isVisible ? '1' : '0';
      }
    });
  }

  /**
   * Gets the tile at a specific grid position
   * @param {number} col - Column
   * @param {number} row - Row
   * @returns {number} Tile type index
   */
  function getTileAt(col, row) {
    if (!currentMap) return 0;
    return currentMap.getTile(col, row);
  }

  /**
   * Gets the tile at a specific world position (in pixels)
   * @param {number} x - X position in pixels
   * @param {number} y - Y position in pixels
   * @returns {number} Tile type index
   */
  function getTileAtPosition(x, y) {
    if (!currentMap) return 0;

    const col = Math.floor(x / currentMap.tileSize);
    const row = Math.floor(y / currentMap.tileSize);

    return getTileAt(col, row);
  }

  /**
   * Checks if a tile is solid (for collision detection)
   * @param {number} tileIndex - Tile type index
   * @returns {boolean} True if tile is solid
   */
  function isSolid(tileIndex) {
    // Define which tiles are solid
    const solidTiles = [3, 4, 5, 7, 9]; // sand, rocks, coral
    return solidTiles.includes(tileIndex);
  }

  /**
   * Renders the tilemap (called each frame if needed)
   */
  function render() {
    // Tilemap rendering is handled by DOM elements
    // This could be used for canvas-based rendering or updates
    if (isDirty) {
      isDirty = false;
    }
  }

  /**
   * Gets current map data
   * @returns {Object} Current map object
   */
  function getCurrentMap() {
    return currentMap;
  }

  // Public API
  return {
    loadMap,
    clearMap,
    updateVisibility,
    getTileAt,
    getTileAtPosition,
    isSolid,
    render,
    getCurrentMap
  };
}
