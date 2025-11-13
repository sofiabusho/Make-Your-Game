# Tilemap Engine Documentation

## Overview

This project now includes a custom tilemap engine that renders grid-based tile maps for the underwater game. The engine efficiently manages tile rendering using a single tileset approach and supports multiple unique maps.

## Features

- ✅ Custom tile map engine (no external editors used)
- ✅ Efficient tile rendering using CSS-based tiles
- ✅ 4+ unique tile maps (exceeds requirement of 3)
- ✅ Automatic map switching based on game level
- ✅ Viewport culling for performance optimization
- ✅ Support for collision detection

## File Structure

```
src/world/
├── tilemap.js     - Core tilemap engine
└── mapData.js     - Map configurations (4 maps included)

style/
└── tilemap.css    - Tile visual styles
```

## Tile Types

The engine supports 10 different tile types:

| ID | Type | Description |
|----|------|-------------|
| 0 | Empty | Transparent/no tile |
| 1 | Light Water | Bright blue water |
| 2 | Dark Water | Deep blue water |
| 3 | Sand | Light sandy ground |
| 4 | Rock | Gray rocks/obstacles |
| 5 | Coral (Orange) | Orange coral formations |
| 6 | Seaweed | Green underwater plants |
| 7 | Dark Rock | Dark stone formations |
| 8 | Dark Sand | Darker sandy ground |
| 9 | Coral (Pink) | Pink coral formations |
| 10 | Bubble Area | Animated bubble zones |

## Available Maps

### 1. Shallow Reef (Levels 1-3)
A bright, sandy area with scattered coral formations and rocks. Features:
- Abundant light water
- Scattered coral patches
- Sandy bottom with occasional rocks
- Bubble areas

### 2. Deep Cavern (Levels 4-6)
A darker, more mysterious underwater cave system. Features:
- Dark water throughout
- Rock walls and formations
- Pink coral in cavern areas
- Claustrophobic cave layout

### 3. Coral Garden (Levels 7-9)
A vibrant area filled with coral formations and plant life. Features:
- Mixed coral types (orange and pink)
- Dense seaweed patches
- Scattered rocks
- Bubble zones above

### 4. Open Ocean (Levels 10+)
A more sparse, open water environment. Features:
- Gradient from light to dark water
- Minimal obstacles
- Open swimming space
- Deep water zones

## How It Works

### Map Data Structure

Each map follows this structure:

```javascript
{
  id: 'map_name',
  name: 'Display Name',
  columns: 16,        // Grid width
  rows: 12,           // Grid height
  tileSize: 64,       // Pixels per tile
  tiles: [...],       // Flat array of tile IDs
  getTile: function(col, row) {
    // Returns tile ID at position
    return this.tiles[row * this.columns + col];
  }
}
```

### Rendering Approach

The engine uses **DOM-based rendering** for compatibility with the existing game architecture:

1. Each tile is a `<div>` element
2. Tiles are positioned using `translate3d()` for GPU acceleration
3. CSS classes define visual appearance
4. Viewport culling hides off-screen tiles for performance

### Tileset Image Support

The engine is designed to support tileset images. To use an actual tileset PNG:

1. Create a tileset image (e.g., `style/images/tileset.png`)
2. Uncomment the tileset section in `style/tilemap.css`
3. Configure `tilesPerRow` based on your tileset layout
4. The engine will use `background-position` to select tiles

Example tileset layout:
```
[Tile1] [Tile2] [Tile3] [Tile4]
[Tile5] [Tile6] [Tile7] [Tile8]
[Tile9] [Tile10] ...
```

## Integration with Game

### Automatic Map Loading

Maps automatically load based on level:
- Levels 1-3: Shallow Reef
- Levels 4-6: Deep Cavern
- Levels 7-9: Coral Garden
- Levels 10+: Open Ocean (cycles through all maps)

### Level Transitions

When leveling up, the game:
1. Increments level counter
2. Calls `loadMapForLevel(newLevel)`
3. Clears old tiles
4. Loads and renders new map
5. Shows "LEVEL UP" notification

### Game Start/Restart

When starting or restarting:
1. Level resets to 1
2. `loadMapForLevel(1)` is called
3. Shallow Reef map loads
4. Tiles render before gameplay begins

## API Reference

### Tilemap System

```javascript
const tilemapSystem = createTilemapSystem({
  world: WORLD,        // World dimensions
  container: element   // DOM container for tiles
});
```

#### Methods

- `loadMap(map)` - Load a map configuration
- `clearMap()` - Remove all tiles
- `getTileAt(col, row)` - Get tile ID at grid position
- `getTileAtPosition(x, y)` - Get tile ID at pixel position
- `isSolid(tileIndex)` - Check if tile is solid (for collisions)
- `updateVisibility(viewport)` - Cull tiles outside viewport
- `render()` - Render frame (currently handled by DOM)

### Map Data

```javascript
import {
  SHALLOW_REEF,
  DEEP_CAVERN,
  CORAL_GARDEN,
  OPEN_OCEAN,
  ALL_MAPS,
  getMapById,
  getRandomMap
} from './src/world/mapData.js';
```

## Performance Considerations

### Current Optimizations

1. **GPU Acceleration**: Uses `translate3d()` for positioning
2. **Viewport Culling**: Hides off-screen tiles with opacity
3. **Static Rendering**: Tiles don't animate or update frequently
4. **CSS Classes**: Minimal DOM manipulation after initial render

### Future Optimizations

If performance issues occur with larger maps:

1. **Canvas Rendering**: Switch to Canvas 2D API for tiles
2. **Chunk Loading**: Only render visible map sections
3. **Sprite Batching**: Combine multiple tiles into single draws
4. **WebGL**: Use WebGL for maximum performance

## Testing the Tilemap

### Visual Test

1. Open `index.html` in a browser
2. Start the game
3. Look for colored tile patterns behind the fish
4. Level up (or use dev tools to skip) to see different maps

### Console Verification

Open browser console and check for log messages:
```
[Tilemap] Loaded map: Shallow Reef for level 1
[Tilemap] Loaded map: Deep Cavern for level 4
```

### Debugging

To inspect tiles:
```javascript
// In browser console
const tiles = document.querySelectorAll('.tile');
console.log(`Rendered tiles: ${tiles.length}`);
console.log('Tile types:', [...new Set([...tiles].map(t => t.dataset.tileType))]);
```

## Customization

### Adding New Maps

1. Open `src/world/mapData.js`
2. Create a new map object following the structure
3. Add it to the `ALL_MAPS` array
4. The map will automatically cycle into rotation

### Modifying Map Cycling

In `main.js`, adjust the `loadMapForLevel` function:

```javascript
function loadMapForLevel(levelNum) {
  // Change cycle rate (every N levels)
  const mapIndex = Math.floor((levelNum - 1) / 3) % ALL_MAPS.length;
  // Or use specific maps for specific levels:
  // const mapIndex = levelNum <= 5 ? 0 : 1;

  // ... rest of function
}
```

### Creating New Tile Types

1. Add new CSS class in `style/tilemap.css`:
```css
.tile-new-type {
  background: /* your styling */;
}
```

2. Update tile mapping in `tilemap.js`:
```javascript
const tileTypes = {
  // ... existing types
  11: 'tile-new-type',
};
```

3. Use new tile ID (11) in your map data

## Technical Details

### Grid Coordinates

- Origin (0,0) is top-left
- X increases rightward (columns)
- Y increases downward (rows)
- Pixel position = grid * tileSize

### Tile Storage

Maps use a **flat array** for tile storage:
```javascript
// For 3x3 grid:
tiles: [
  1, 2, 3,  // Row 0
  4, 5, 6,  // Row 1
  7, 8, 9,  // Row 2
]
// Tile at (col=1, row=2) = tiles[2 * 3 + 1] = tiles[7] = 8
```

### Z-Index Layering

The game uses these layers (back to front):
1. Background image (z-0)
2. Decor (plants, bubbles) (z-0)
3. **Tilemap** (z-5) ← New layer
4. Entities (fish, turtles) (z-6)
5. Coral overlay (z-10)
6. Crosshair (z-30)
7. HUD (z-40)

## Credits

This tilemap engine was created for the Make Your Game project, implementing the requirement for custom tile-based level generation without using external tile editors.

## Future Enhancements

Potential improvements for the tilemap system:

- [ ] Animated tiles (water flow, bubbles)
- [ ] Multi-layer maps (background, foreground)
- [ ] Parallax scrolling effects
- [ ] Tile-based collision system for entities
- [ ] Map editor tool
- [ ] Procedural map generation
- [ ] Save/load map data from JSON files
- [ ] Tile variations (random rotation, mirroring)
