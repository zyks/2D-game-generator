var Circle = require('./../engine/gfx/circle');
var Rect = require('./../engine/gfx/rect');
var Polygon = require('./../engine/gfx/polygon');
var PrimitivesGroup = require('./../engine/gfx/primitivesGroup');

var PrimitiveCreator = function(spritesRepository) {
    this._spritesRepository = spritesRepository;
    this._creators = {
        player: this.createPlayerPrimitive,
        zombie: this.createZombiePrimitive,
        bullet: this.createBulletPrimitive
    };
}

PrimitiveCreator.prototype.create = function(name) {
    return this._creators[name].bind(this)();
}

PrimitiveCreator.prototype.createBlockCharacter = function(settings) {
    let eye = [
        new Circle(0, 0, 8).fill(settings.eyeColor).stroke("black"),
        new Circle(0, 0, 2).fill(settings.pupilColor),
    ];
    let eyes = new PrimitivesGroup(0, -10, [
        new PrimitivesGroup(-12, 0, eye),
        new PrimitivesGroup(12, 0, eye)
    ]);
    let teeth = new Polygon(-8, 14, [[0,0],[2,-8],[4,0],[6,-8],[8,0],[10,-8],[12,0],[14,-8],[16,0]]).fill("white");
    let elements = [
        new Rect(-24, -24, 48, 48).fill(settings.bodyColor).stroke("goldenrose", 2),
        eyes,
        new Rect(-8, 8, 16, 6).fill(settings.mouthColor)
    ];
    if(settings.hasTeeth) elements = elements.concat(teeth);
    let head = new PrimitivesGroup(0, 0, elements);
    return head;
}

PrimitiveCreator.prototype.createPlayerPrimitive = function() {
    return this.createBlockCharacter({
        bodyColor: "yellow",
        eyeColor: "white",
        pupilColor: "blue",
        mouthColor: "red"
    });
}

PrimitiveCreator.prototype.createZombiePrimitive = function() {
    return this.createBlockCharacter({
        bodyColor: "green",
        eyeColor: "yellow",
        pupilColor: "red",
        mouthColor: "black",
        hasTeeth: true
    });
}

PrimitiveCreator.prototype.createBulletPrimitive = function() {
    return new Circle(0, 0, 12).fill("red");
}

module.exports = PrimitiveCreator;
