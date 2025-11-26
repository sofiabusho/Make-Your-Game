# Tile Map System Usage Guide

## Overview
The tile map system automatically renders tile-based maps behind game entities. It uses a tileset (single image containing all tiles) for efficient rendering.

## Automatic Features

### 1. **Automatic Initialization**
The tile map system initializes when the game starts. It:
- Generates a tileset from individual tile images
- Loads the first map (Ocean Floor pattern)
- Renders tiles behind game entities

### 2. **Automatic Map Switching**
Maps automatically change based on level:
- **Level 1**: Ocean Floor Map (repeating pattern)
- **Level 2**: Checkerboard Map (alternating pattern)
- **Level 3**: Coral Reef Map (organic clusters)
- **Level 4**: Striped Map (horizontal/vertical stripes)
- **Level 5+**: Cycles back through maps

### 3. **Performance Optimization**
- Only visible tiles are rendered (viewport culling)
- Tiles are cached in DOM for efficient updates
- Viewport automatically updates on window resize

## Manual Usage

### Changing Maps Programmatically

If you need to manually switch maps, you can access the `setTileMap()` function:

```javascript
// In main.js, you can call:
setTileMap(0); // Ocean Floor Map
setTileMap(1); // Checkerboard Map
setTileMap(2); // Coral Reef Map
setTileMap(3); // Striped Map
```

### Accessing the Tile Map Renderer

The tile map renderer is available in `main.js`:

```javascript
// Get the current renderer
const renderer = tileMapRenderer;

// Change viewport (for scrolling)
if (renderer) {
    renderer.setViewport(x, y, width, height);
    renderer.update();
}

// Change map
if (renderer) {
    const newMap = getMapByIndex(2); // Get map by index
    renderer.setMap(newMap);
}
```

## Creating Custom Maps

### 1. Add a New Map Function

Edit `src/tilemap/maps.js` and add a new function:

```javascript
export function createMyCustomMap() {
    const columns = 30;
    const rows = 20;
    const tiles = [];
    
    // Generate your tile pattern
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            // Your logic here
            const tileId = /* calculate tile ID */;
            tiles.push(tileId);
        }
    }
    
    return createMap(columns, rows, tiles);
}
```

### 2. Add to Map List

Update the `getMapByIndex()` function in `maps.js`:

```javascript
export function getMapByIndex(index) {
    const maps = [
        createOceanFloorMap,
        createCheckerboardMap,
        createCoralReefMap,
        createStripedMap,
        createMyCustomMap, // Add your new map
    ];
    
    const mapIndex = index % maps.length;
    return maps[mapIndex]();
}
```

## Map Data Structure

Each map uses this structure:

```javascript
{
    columns: 30,        // Number of columns
    rows: 20,           // Number of rows
    size: 600,          // Total tiles (columns * rows)
    tiles: [1, 2, 3...], // Array of tile IDs (row-major order)
    getTile(col, row),  // Get tile at position
    setTile(col, row, id) // Set tile at position
}
```

### Tile IDs
- **1**: Blue tile
- **2**: Brown tile
- **3**: Green tile
- **4**: Red tile
- **5**: Yellow tile
- **6**: Purple tile

## Configuration

### Tile Size
Change tile size in `main.js`:

```javascript
const TILE_SIZE = 64; // Pixels per tile (default: 64)
```

### Tiles Per Row
Configure tileset layout in `main.js`:

```javascript
const TILES_PER_ROW = 3; // Tiles per row in tileset (default: 3)
```

## Troubleshooting

### Map Not Visible
1. Check browser console for errors
2. Verify tile images exist in `style/images/`
3. Check that `tilemap-layer` exists in HTML
4. Ensure tileset loaded successfully

### Performance Issues
- Reduce map size (columns/rows)
- Increase tile size (fewer tiles to render)
- Check viewport culling is working

### Map Not Switching
- Verify level progression is working
- Check `gameLoop.js` map switching logic
- Ensure `getMapByIndex()` includes all maps

