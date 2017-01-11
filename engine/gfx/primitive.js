Primitive = function(x, y) {
    this.x = x;
    this.y = y;
};

Primitive.prototype.render = function(ctx, x, y) {
    throw new Error("Primitive.render : Can't call pure virtual method");
}

module.exports = Primitive;
