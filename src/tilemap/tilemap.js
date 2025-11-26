/**
 * @file tilemap.js
 * @module tilemap
 * @description
 * Tile map engine for rendering tile-based maps from a tileset.
 * Supports efficient rendering with viewport culling and multiple map layouts.
 */

/**
 * Creates a tile map object with grid-based tile data.
 * @param {number} columns - Number of columns in the grid
 * @param {number} rows - Number of rows in the grid
 * @param {number[]} tiles - Array of tile IDs (row-major order)
 * @returns {object} Map object with properties and helper methods
 */
export function createMap(columns, rows, tiles) {
    const size = columns * rows;
    
    return {
        columns,
        rows,
        size,
        tiles,
        /**
         * Gets the tile ID at the specified column and row.
         * @param {number} col - Column index (0-based)
         * @param {number} row - Row index (0-based)
         * @returns {number} Tile ID, or 0 if out of bounds
         */
        getTile(col, row) {
            if (col < 0 || col >= this.columns || row < 0 || row >= this.rows) {
                return 0;
            }
            return this.tiles[row * this.columns + col] || 0;
        },
        /**
         * Sets the tile ID at the specified column and row.
         * @param {number} col - Column index (0-based)
         * @param {number} row - Row index (0-based)
         * @param {number} tileId - Tile ID to set
         */
        setTile(col, row, tileId) {
            if (col >= 0 && col < this.columns && row >= 0 && row < this.rows) {
                this.tiles[row * this.columns + col] = tileId;
            }
        }
    };
}

/**
 * Tile map renderer that efficiently renders tiles from a tileset.
 */
export class TileMapRenderer {
    /**
     * @param {HTMLImageElement} tilesetImage - The tileset image containing all tiles
     * @param {number} tileSize - Size of each tile in pixels (assumes square tiles)
     * @param {number} tilesPerRow - Number of tiles per row in the tileset
     * @param {HTMLElement} container - DOM element to render tiles into
     */
    constructor(tilesetImage, tileSize, tilesPerRow, container) {
        this.tilesetImage = tilesetImage;
        this.tileSize = tileSize;
        this.tilesPerRow = tilesPerRow;
        this.container = container;
        this.currentMap = null;
        this.tileElements = new Map(); // Cache of DOM elements for each tile position
        this.viewport = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * Sets the current map to render.
     * @param {object} map - Map object created with createMap()
     */
    setMap(map) {
        this.currentMap = map;
        this.clear();
        this.render();
    }

    /**
     * Updates the viewport for culling optimization.
     * @param {number} x - Viewport X position
     * @param {number} y - Viewport Y position
     * @param {number} width - Viewport width
     * @param {number} height - Viewport height
     */
    setViewport(x, y, width, height) {
        const oldViewport = this.viewport.width ? { ...this.viewport } : null;
        this.viewport = { x, y, width, height };
        // Only re-render if viewport changed significantly (to avoid spam)
        if (!oldViewport || 
            Math.abs(oldViewport.width - width) > 10 || 
            Math.abs(oldViewport.height - height) > 10) {
            this.render();
        }
    }

    /**
     * Clears all rendered tiles from the container.
     */
    clear() {
        // Remove all existing tile elements
        this.tileElements.forEach((element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.tileElements.clear();
    }

    /**
     * Renders the current map, only drawing visible tiles for performance.
     */
    render() {
        if (!this.currentMap) {
            // Don't log warning - this is normal during initialization
            return;
        }
        if (!this.tilesetImage) {
            console.warn('TileMapRenderer: No tileset image');
            return;
        }
        if (!this.tilesetImage.complete) {
            // Don't log warning - image is still loading
            return;
        }

        const map = this.currentMap;
        const tileSize = this.tileSize;
        
        // Calculate visible tile range based on viewport
        // Don't add extra tiles outside viewport to prevent artifacts
        const startCol = Math.max(0, Math.floor(this.viewport.x / tileSize));
        const endCol = Math.min(map.columns, Math.ceil((this.viewport.x + this.viewport.width) / tileSize));
        const startRow = Math.max(0, Math.floor(this.viewport.y / tileSize));
        const endRow = Math.min(map.rows, Math.ceil((this.viewport.y + this.viewport.height) / tileSize));
        
        // Only log on first render or when viewport changes significantly
        if (!this._lastViewport || 
            Math.abs(this._lastViewport.width - this.viewport.width) > 10 ||
            Math.abs(this._lastViewport.height - this.viewport.height) > 10) {
            console.log('TileMapRenderer: Rendering tiles', {
                viewport: this.viewport,
                tileSize,
                mapSize: { columns: map.columns, rows: map.rows },
                visibleRange: { startCol, endCol, startRow, endRow },
                expectedTiles: (endCol - startCol) * (endRow - startRow),
                tilesetSrc: this.tilesetImage.src?.substring(0, 50) + '...'
            });
            this._lastViewport = { ...this.viewport };
        }

        // Render only visible tiles
        let tilesCreated = 0;
        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tileId = map.getTile(col, row);
                if (tileId === 0) continue; // Skip empty tiles
                
                // Calculate tile position
                const tileLeft = col * tileSize;
                const tileTop = row * tileSize;
                
                // Only render tiles that are at least partially visible
                if (tileLeft + tileSize < 0 || tileLeft > this.viewport.width ||
                    tileTop + tileSize < 0 || tileTop > this.viewport.height) {
                    // Tile is completely outside viewport, skip creating it
                    continue;
                }
                
                tilesCreated++;

                const key = `${col},${row}`;
                let tileElement = this.tileElements.get(key);

                if (!tileElement) {
                    // Create new tile element
                    tileElement = document.createElement('div');
                    tileElement.className = 'tile';
                    tileElement.style.position = 'absolute';
                    tileElement.style.width = `${tileSize}px`;
                    tileElement.style.height = `${tileSize}px`;
                    tileElement.style.imageRendering = 'pixelated';
                    tileElement.style.imageRendering = '-moz-crisp-edges';
                    tileElement.style.imageRendering = 'crisp-edges';
                    this.container.appendChild(tileElement);
                    this.tileElements.set(key, tileElement);
                }

                // Calculate source position in tileset
                const tilesetCol = (tileId - 1) % this.tilesPerRow;
                const tilesetRow = Math.floor((tileId - 1) / this.tilesPerRow);
                const sourceX = tilesetCol * tileSize;
                const sourceY = tilesetRow * tileSize;
                
                tileElement.style.left = `${tileLeft}px`;
                tileElement.style.top = `${tileTop}px`;
                // Use the tileset image source (should be a data URL for programmatically generated tiles)
                const tilesetSrc = this.tilesetImage.src;
                if (!tilesetSrc) {
                    console.error('Tileset image has no src!', this.tilesetImage);
                    continue;
                }
                // Escape the data URL properly for CSS
                tileElement.style.backgroundImage = `url("${tilesetSrc}")`;
                tileElement.style.backgroundPosition = `-${sourceX}px -${sourceY}px`;
                // Background size should match the full tileset dimensions
                const tilesetRows = Math.ceil(6 / this.tilesPerRow); // 6 colors total
                tileElement.style.backgroundSize = `${this.tilesPerRow * tileSize}px ${tilesetRows * tileSize}px`;
                tileElement.style.backgroundRepeat = 'no-repeat';
                tileElement.style.opacity = '0.5'; // Make tiles semi-transparent so they don't cover game
                tileElement.style.zIndex = '0';
                // Ensure tiles are visible
                tileElement.style.display = 'block';
                tileElement.style.visibility = 'visible';
                // Remove border - tiles should be subtle background
                tileElement.style.border = 'none';
                tileElement.style.boxSizing = 'border-box';
                // Force repaint and hardware acceleration
                tileElement.style.transform = 'translateZ(0)';
                tileElement.style.willChange = 'transform';
                // Ensure tile is above background but below entities
                tileElement.style.pointerEvents = 'none';
            }
        }

        // Remove or hide tiles that are outside the viewport completely
        const tilesToRemove = [];
        this.tileElements.forEach((element, key) => {
            const [col, row] = key.split(',').map(Number);
            const tileLeft = col * tileSize;
            const tileTop = row * tileSize;
            
            // Check if tile is completely outside viewport (with some margin)
            if (col < startCol || col >= endCol || row < startRow || row >= endRow ||
                tileLeft + tileSize < -tileSize || tileLeft > this.viewport.width + tileSize ||
                tileTop + tileSize < -tileSize || tileTop > this.viewport.height + tileSize) {
                // Tile is outside viewport - hide it
                element.style.display = 'none';
                element.style.opacity = '0';
                element.style.visibility = 'hidden';
                // Optionally remove from DOM if it's far outside (to prevent memory issues)
                if (tileLeft < -tileSize * 2 || tileLeft > this.viewport.width + tileSize * 2 ||
                    tileTop < -tileSize * 2 || tileTop > this.viewport.height + tileSize * 2) {
                    tilesToRemove.push(key);
                }
            } else {
                // Tile is visible
                element.style.display = 'block';
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }
        });
        
        // Remove tiles that are very far outside viewport
        tilesToRemove.forEach(key => {
            const element = this.tileElements.get(key);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.tileElements.delete(key);
        });
        
        // Only log on first render or significant changes
        if (!this._hasLoggedInitialRender) {
            console.log(`TileMapRenderer: Initial render complete - ${tilesCreated} tiles visible, ${this.container.children.length} total in DOM`);
            this._hasLoggedInitialRender = true;
            this._lastTileCount = this.container.children.length;
        } else if (tilesCreated > 50 && Math.abs(this._lastTileCount - this.container.children.length) > 20) {
            console.log(`TileMapRenderer: Significant change - ${tilesCreated} tiles visible, ${this.container.children.length} total`);
            this._lastTileCount = this.container.children.length;
        }
    }

    /**
     * Updates the render (useful for scrolling or viewport changes).
     */
    update() {
        this.render();
    }
}

/**
 * Loads a tileset image and returns a promise that resolves when loaded.
 * @param {string} tilesetPath - Path to the tileset image
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
 */
export function loadTileset(tilesetPath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load tileset: ${tilesetPath}`));
        img.src = tilesetPath;
    });
}

