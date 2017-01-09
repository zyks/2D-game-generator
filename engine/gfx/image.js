Primitive = require('./primitive');

ImagePrimitive = function(x, y, image) {
    Primitive.call(this, x, y);
    this.image = image;
    return this;
};

ImagePrimitive.prototype = Object.create(Primitive.prototype);
ImagePrimitive.constructor = Image;

ImagePrimitive.prototype.render = function(ctx, x, y) {
    ctx.drawImage(this.image, this.x + x, this.y + y);
}

module.exports = ImagePrimitive;
