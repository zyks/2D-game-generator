var Config = require('../Config');

var GraphicEntityRenderSystem = function(engine, ctx, primitiveCreator = null) {
    this._engine = engine;
    this._ctx = ctx;
    this._primitiveCreator = primitiveCreator;
}


GraphicEntityRenderSystem.prototype.start = function() {

}

GraphicEntityRenderSystem.prototype.update = function(deltaTime) {
    // TODO: We should not render entities which are whole outside viewport
    let entities = this._engine.entities.getByGroup("graphicsEntities");
    let camera = this._engine.entities.getByName("camera").components.get("Position");
    let yOffset = Math.max(camera.y - Config.GAME_HEIGHT/2, 0);
    let xOffset = Math.max(camera.x - Config.GAME_WIDTH/2, 0);
    for(let e of entities) {
        let position = e.components.get("Position");
        let primitive = this._getPrimitive(e.components.get("Graphics"));
        primitive.render(this._ctx, position.x - xOffset, position.y - yOffset);
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
