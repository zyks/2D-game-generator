var TileMap = function(tiles, width, height, spawns = []) {
    this.tiles = tiles;
    this.width = width;
    this.height = height;
    this.name = "TileMap";
    this.spawns = spawns;
}

module.exports = TileMap;
