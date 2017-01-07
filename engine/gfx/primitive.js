
var Gfx = Gfx || {};

Gfx.Primitive = function(x, y) {
    this.x = x;
    this.y = y;
};

Gfx.Primitive.prototype.render = function(ctx, x, y) {
    throw new Error("Gfx.Primitive.render : Can't call pure virtual method");
}
