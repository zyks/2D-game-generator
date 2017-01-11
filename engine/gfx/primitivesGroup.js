PathBasedPrimitive = require('./primitive');

PrimitivesGroup = function(x, y, primitives) {
    Primitive.call(this, x, y);
    this._primitives = primitives;
};

PrimitivesGroup.prototype = Object.create(Primitive.prototype);
PrimitivesGroup.constructor = PrimitivesGroup;

PrimitivesGroup.prototype.render = function(ctx, x, y) {
  for(var primitive of this._primitives)
    primitive.render(ctx, this.x + x, this.y + y);
}

module.exports = PrimitivesGroup;
