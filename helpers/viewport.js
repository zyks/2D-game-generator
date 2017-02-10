var Config = require('./../Config');

var Viewport = function(layer, camera) {
    this._layer = layer;
    this._cameraPosition = camera.components.get("Position");
}

Viewport.prototype.coordinates = function () {
    this.x = this._cameraPosition.x - Math.floor(Config.SCREEN_WIDTH / 2);
    this.x = Math.max(0, this.x);
    this.x = Math.min(this._layer.width * Config.TILE_SIZE - Config.SCREEN_WIDTH, this.x);
    this.y = this._cameraPosition.y - Math.floor(Config.SCREEN_HEIGHT / 2);
    this.y = Math.max(0, this.y);
    this.y = Math.min(this._layer.height * Config.TILE_SIZE - Config.SCREEN_HEIGHT, this.y);
    return this;
};

Viewport.prototype.renderContext = function () {
    this.coordinates();
    this.startXTile = Math.floor(this.x / Config.TILE_SIZE);
    this.startYTile = Math.floor(this.y / Config.TILE_SIZE);
    this.viewportXOffset = this.startXTile * Config.TILE_SIZE - this.x;
    this.viewportYOffset = this.startYTile * Config.TILE_SIZE - this.y;
    this.nbOfRows = Math.ceil(Config.SCREEN_HEIGHT / Config.TILE_SIZE) + 1;
    this.nbOfColumns = Math.ceil(Config.SCREEN_WIDTH / Config.TILE_SIZE) + 1;
    return this;
};

module.exports = Viewport;
