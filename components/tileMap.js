var TileMap = function(tiles, width, height, spawns = [], doors=[]) {
    this.tiles = tiles;
    this.width = width;
    this.height = height;
    this.name = "TileMap";
    this.spawns = spawns;
    this.doors = doors;
}

module.exports = TileMap;
