var PlayerInfo = function(nickname, socket) {
    this.nickname = nickname;
    this.score = 0;
    this.socket = socket;
    this.name = "PlayerInfo";
}


module.exports = PlayerInfo;
