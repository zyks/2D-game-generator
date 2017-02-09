var SAT = require('sat');


var Geometry = function(x, y) {
    this._toEntityX = x;
    this._toEntityY = y;
    this._SATfigure = null;
    this._SATtestWithCircle = null;
    this._SATtestWithSquare = null;
    this.name = "Geometry";
}

Geometry.prototype.setPosition = function(x, y) {
    this._SATfigure.pos = new SAT.Vector(this._toEntityX + x, this._toEntityY + y);
}

Geometry.prototype.getFigure = function() {
    return this._SATfigure;
}

Geometry.prototype.checkIntersection = function(geometryComponent) {
    if (geometryComponent instanceof Circle)
        return this._checkIntersectionWithCircle(geometryComponent.getFigure());
    else if (geometryComponent instanceof Square)
        return this._checkIntersectionWithSquare(geometryComponent.getFigure());
}

Geometry.prototype._checkIntersectionWithCircle = function(SATcircle) {
    let response = new SAT.Response();
    response.result = this._SATtestWithCircle(SATcircle, this._SATfigure, response);
    return response;
}

Geometry.prototype._checkIntersectionWithSquare = function(SATpolygon) {
    let response = new SAT.Response();
    response.result = this._SATtestWithSquare(this._SATfigure, SATpolygon, response);
    return response;
}



var Square = function(size, x=0, y=0) {
    Geometry.call(this, x, y);
    this._SATfigure = new SAT.Box(new SAT.Vector(x, y), size, size).toPolygon();
    this._SATtestWithCircle = SAT.testCirclePolygon;
    this._SATtestWithSquare = SAT.testPolygonPolygon;
}

Square.prototype = Object.create(Geometry.prototype);
Square.prototype.constructor = Square;


var Circle = function(radius, x=0, y=0) {
    Geometry.call(this, x, y);
    this._SATfigure = new SAT.Circle(new SAT.Vector(x, y), radius);
    this._SATtestWithCircle = SAT.testCircleCircle;
    this._SATtestWithSquare = SAT.testCirclePolygon;
}

Circle.prototype = Object.create(Geometry.prototype);
Circle.prototype.constructor = Circle;


module.exports.Square = Square;
module.exports.Circle = Circle;
