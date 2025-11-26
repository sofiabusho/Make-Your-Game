/**
 * @file tilesetGenerator.js
 * @module tilesetGenerator
 * @description
 * Generates a tileset image by combining individual tile images into a single image.
 * This improves performance and memory usage by using a single image resource.
 */

/**
 * Creates a tileset image from individual tile images.
 * @param {string[]} tilePaths - Array of paths to individual tile images
 * @param {number} tilesPerRow - Number of tiles per row in the tileset
 * @param {number} tileSize - Size of each tile in pixels (assumes square tiles)
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the generated tileset image
 */
export async function generateTileset(tilePaths, tilesPerRow, tileSize) {
    return new Promise((resolve, reject) => {
        // Calculate tileset dimensions
        const totalTiles = tilePaths.length;
        const tilesetRows = Math.ceil(totalTiles / tilesPerRow);
        const tilesetWidth = tilesPerRow * tileSize;
        const tilesetHeight = tilesetRows * tileSize;

        // Create canvas for tileset
        const canvas = document.createElement('canvas');
        canvas.width = tilesetWidth;
        canvas.height = tilesetHeight;
        const ctx = canvas.getContext('2d');

        // Load all tile images
        const imagePromises = tilePaths.map((path) => {
            return new Promise((resolveImg, rejectImg) => {
                const img = new Image();
                img.onload = () => resolveImg(img);
                img.onerror = () => rejectImg(new Error(`Failed to load tile: ${path}`));
                img.src = path;
            });
        });

        Promise.all(imagePromises)
            .then((images) => {
                // Draw each tile onto the canvas
                images.forEach((img, index) => {
                    const col = index % tilesPerRow;
                    const row = Math.floor(index / tilesPerRow);
                    const x = col * tileSize;
                    const y = row * tileSize;

                    // Draw the tile image, scaling it to fit the tile size
                    ctx.drawImage(img, x, y, tileSize, tileSize);
                });

                // Convert canvas to image
                const tilesetImage = new Image();
                tilesetImage.onload = () => resolve(tilesetImage);
                tilesetImage.onerror = () => reject(new Error('Failed to create tileset image'));
                tilesetImage.src = canvas.toDataURL('image/png');
            })
            .catch(reject);
    });
}

/**
 * Creates solid colored tiles programmatically.
 * @param {number} tileSize - Size of each tile in pixels
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the tileset image
 */
function createSolidColorTileset(tileSize = 64) {
    return new Promise((resolve) => {
        const tilesPerRow = 3;
        const colors = [
            { r: 0, g: 150, b: 255 },    // Very Bright Ocean Blue
            { r: 180, g: 100, b: 50 },   // Rich Sandy Brown
            { r: 0, g: 200, b: 0 },      // Very Vibrant Green
            { r: 255, g: 50, b: 50 },    // Bright Red
            { r: 255, g: 255, b: 0 },    // Bright Yellow
            { r: 200, g: 0, b: 255 },   // Bright Purple
        ];

        const tilesetRows = Math.ceil(colors.length / tilesPerRow);
        const tilesetWidth = tilesPerRow * tileSize;
        const tilesetHeight = tilesetRows * tileSize;

        const canvas = document.createElement('canvas');
        canvas.width = tilesetWidth;
        canvas.height = tilesetHeight;
        const ctx = canvas.getContext('2d');

        // Clear canvas first
        ctx.clearRect(0, 0, tilesetWidth, tilesetHeight);

        // Draw each colored tile
        colors.forEach((color, index) => {
            const col = index % tilesPerRow;
            const row = Math.floor(index / tilesPerRow);
            const x = col * tileSize;
            const y = row * tileSize;

            // Fill with solid color - make it more vibrant
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            ctx.fillRect(x, y, tileSize, tileSize);

            // Add a darker border for better definition
            ctx.strokeStyle = `rgba(0, 0, 0, 0.4)`;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
            
            // Add a subtle highlight for depth
            ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, tileSize, tileSize);
        });

        // Convert canvas to image
        const tilesetImage = new Image();
        tilesetImage.onload = () => {
            console.log('Solid colored tileset generated successfully', {
                width: tilesetImage.width,
                height: tilesetImage.height,
                colors: colors.length,
                srcLength: tilesetImage.src.length
            });
            resolve(tilesetImage);
        };
        tilesetImage.onerror = (error) => {
            console.error('Failed to load tileset image:', error);
            reject(new Error('Failed to create tileset image from canvas'));
        };
        // Data URLs cannot have query parameters - remove the timestamp
        tilesetImage.src = canvas.toDataURL('image/png');
    });
}

/**
 * Creates a tileset using programmatically generated solid colored tiles.
 * This ensures consistent tile appearance regardless of available image files.
 * @param {number} tileSize - Size of each tile in pixels
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the tileset image
 */
export async function createGameTileset(tileSize = 64) {
    // Use programmatically generated solid colored tiles
    // This ensures we get proper colored tiles, not fish images
    return createSolidColorTileset(tileSize);
}

