var CharacterDeathSystem = function(engine) {
    this._engine = engine;
}

CharacterDeathSystem.prototype.start = function() {

}

CharacterDeathSystem.prototype.update = function(time) {
    let entities = this._engine.entities.getByGroup("characters");
    for (let entity of entities) {
        let character = entity.components.get("Character");
        if (character.hp <= 0 )
            this._engine.entities.remove(entity);
    }
}

CharacterDeathSystem.prototype.end = function() {
    
}


module.exports = CharacterDeathSystem;
