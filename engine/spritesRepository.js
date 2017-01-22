var SpritesRepository = function() {
    this._sprites = {};
    this._inProgress = 0;
}

SpritesRepository.prototype.add = function(name, src) {
    this._sprites[name] = new Image();
    this._inProgress += 1;
    this._sprites[name].onload = () => {
        this._inProgress -= 1;
        if(this._inProgress == 0 && this._onCompleted)
            this._onCompleted();
    }
    this._sprites[name].src = src;
};

SpritesRepository.prototype.get = function(name) {
    if(name in this._sprites)
        return this._sprites[name];
}

SpritesRepository.prototype.onCompleted = function (callback) {
    if(this._inProgress == 0)
        callback();
    else
        this._onCompleted = callback;
};

module.exports = SpritesRepository;
