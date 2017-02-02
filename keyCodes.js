var KeyCodes = new (function() {
    let charCodeOffset = "A".charCodeAt(0);
    for(let i = 0 ; i < 26 ; i++)
        this[String.fromCharCode(charCodeOffset + i)] = charCodeOffset + i;
});


module.exports = KeyCodes;
