var PlayerInfo = function(nickname, socket) {
    this.nickname = nickname;
    this.score = 0;
    this.socket = socket;
    this.name = "PlayerInfo";
    this.pressed = {
        MOVE_UP: false,
        MOVE_DOWN: false,
        MOVE_LEFT: false,
        MOVE_RIGHT: false,
        SHOOT: false,
        ACTION: false
    };
    this.mousePosition = { x: 0, y: 0 };
    this.shootingInterval = 700;
    this.lastShoot = 0;
}


module.exports = PlayerInfo;
