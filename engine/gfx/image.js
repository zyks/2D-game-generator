var Gfx = Gfx || {};

Gfx.Image = function(x, y, image) {
    Gfx.Primitive.call(this, x, y);
    this.image = image;
    return this;
};

Gfx.Image.prototype = Object.create(Gfx.Primitive.prototype);
Gfx.Image.constructor = Gfx.Image;

Gfx.Image.prototype.render = function(ctx, x, y) {
    ctx.drawImage(this.image, this.x + x, this.y + y);
}
