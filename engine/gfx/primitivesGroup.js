var Gfx = Gfx || {};

Gfx.PrimitivesGroup = function(x, y, primitives) {
    Gfx.Primitive.call(this, x, y);
    this._primitives = primitives;
};

Gfx.PrimitivesGroup.prototype = Object.create(Gfx.Primitive.prototype);
Gfx.PrimitivesGroup.constructor = Gfx.PrimitivesGroup;

Gfx.PrimitivesGroup.prototype.render = function(ctx, x, y) {
  for(var primitive of this._primitives)
    primitive.render(ctx, this.x + x, this.y + y);
}
