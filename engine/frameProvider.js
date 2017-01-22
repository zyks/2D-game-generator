var FrameProvider = function() {
    this._time = 0;
    this._actions = [];
    this._working = false;
}

FrameProvider.prototype.addAction = function (action) {
    this._actions.push(action);
};

FrameProvider.prototype.start = function (fps = 20) {
    this._interval = Math.floor(1000 / fps);
    this._working = true;
    this._intervalId = setInterval(this.runActions.bind(this), this._interval);
};

FrameProvider.prototype.runActions = function () {
    // TODO: should be calculated, not hardcoded
    delta = this._interval;
    for(let action of this._actions) {
        action(delta);
    }
};

FrameProvider.prototype.stop = function () {
    this._working = false;
    clearInterval(this._intervalId);
};

module.exports = FrameProvider;
