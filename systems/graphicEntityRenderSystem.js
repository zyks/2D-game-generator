var Config = require('../Config');
var PrimitiveCreator = require('../creators/primitiveCreator');
var Viewport = require('../helpers/Viewport');

var GraphicEntityRenderSystem = function(engine, ctx) {
    this._engine = engine;
    this._ctx = ctx;
    this._primitiveCreator = new PrimitiveCreator();
}


GraphicEntityRenderSystem.prototype.start = function() {

}

GraphicEntityRenderSystem.prototype.update = function(deltaTime) {
    // TODO: We should not render entities which are whole outside viewport
    let entities = this._engine.entities.getByGroup("graphicsEntities");
    let camera = this._engine.entities.getByName("camera");
    let layer = this._engine.entities.getByGroup("mapLayers")[0].components.get("TileMap");
    let viewport = new Viewport(layer, camera).coordinates();
    for(let e of entities) {
        let position = e.components.get("Position");
        let primitive = this._getPrimitive(e.components.get("Graphics"));
        primitive.render(this._ctx, position.x - viewport.x, position.y - viewport.y);
    }
}

GraphicEntityRenderSystem.prototype.end = function() {

}

GraphicEntityRenderSystem.prototype._getPrimitive = function(graphics) {
    if (typeof graphics.primitive === 'string' || graphics.primitive instanceof String)
        return this._primitiveCreator.create(graphics.primitive);
    else
        return graphics.primitive;
}

module.exports = GraphicEntityRenderSystem;
