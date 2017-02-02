var PlayerInfo = function(nickname, socket) {
    this.nickname = nickname;
    this.score = 0;
    this.socket = socket;
    this.name = "PlayerInfo";
    this.pressed = {
        MOVE_UP: false,
        MOVE_DOWN: false,
        MOVE_LEFT: false,
        MOVE_RIGHT: false
    };
}


module.exports = PlayerInfo;
