var Circle = require('./../engine/gfx/circle');
var Rect = require('./../engine/gfx/rect');
var PrimitivesGroup = require('./../engine/gfx/primitivesGroup');

var PrimitiveCreator = function(spritesRepository) {
    this._spritesRepository = spritesRepository;
    this._creators = {
        player: this.createPlayerPrimitive,
        bullet: this.createBulletPrimitive
    };
}

PrimitiveCreator.prototype.create = function(name) {
    return this._creators[name]();
}

PrimitiveCreator.prototype.createPlayerPrimitive = function() {
    let eye = [
        new Circle(0, 0, 8).fill("white").stroke("black"),
        new Circle(0, 0, 2).fill("blue"),
    ]
    let eyes = new PrimitivesGroup(0, -10, [
        new PrimitivesGroup(-12, 0, eye),
        new PrimitivesGroup(12, 0, eye)
    ]);
    let head = new PrimitivesGroup(0, 0, [
        new Rect(-24, -24, 48, 48).fill("yellow").stroke("goldenrose", 2),
        eyes,
        new Rect(-8, 8, 16, 6).fill("red")
    ]);
    return head;
}

PrimitiveCreator.prototype.createBulletPrimitive = function() {
    return new Circle(0, 0, 12).fill("red");
}

module.exports = PrimitiveCreator;
