PathBasedPrimitive = require('./primitive');

PathBasedPrimitive = function(x, y) {
    Primitive.call(this, x, y);
    return this;
};

PathBasedPrimitive.prototype = Object.create(Primitive.prototype);
PathBasedPrimitive.constructor = PathBasedPrimitive;

PathBasedPrimitive.prototype.stroke = function(strokeStyle, strokeWidth) {
  this.strokeStyle = strokeStyle;
  this.strokeWidth = strokeWidth || 1;
  return this;
}

PathBasedPrimitive.prototype.fill = function(fillStyle) {
  this.fillStyle = fillStyle;
  return this;
}

PathBasedPrimitive.prototype.render = function(ctx, x, y) {
    this.makePath(ctx, x, y);
    if(this.fillStyle) {
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = this.strokeWidth;
        ctx.fill();
    }
    if(this.strokeStyle) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
}

PathBasedPrimitive.prototype.makePath = function(ctx, x, y) {
    throw new Error("PathBasedPrimitive.render : Can't call pure virtual method");
}

module.exports = PathBasedPrimitive;
