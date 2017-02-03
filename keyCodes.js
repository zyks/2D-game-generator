var KeyCodes = new (function() {
    let charCodeOffset = "A".charCodeAt(0);
    for(let i = 0 ; i < 26 ; i++)
        this[String.fromCharCode(charCodeOffset + i)] = charCodeOffset + i;
    this.TAB = 9;
    this.ENTER = 13;
    this.SHIFT = 16;
    this.CTRL = 17;
    this.ALT = 18;
    this.CAPS_LOCK = 20;
    this.ESCAPE = 27;
});


module.exports = KeyCodes;
