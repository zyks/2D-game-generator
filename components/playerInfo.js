var PlayerInfo = function(nickname, socket) {
    this.nickname = nickname;
    this.score = 0;
    this.socket = socket;
    this.name = "PlayerInfo";
    this.pressed = {
        W: false,
        S: false,
        A: false,
        D: false
    };
}


module.exports = PlayerInfo;
