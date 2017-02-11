var ItemList = function() {
    this.items = [];
    this.name = "ItemList";
}

ItemList.prototype.add = function(itemId) {
    this.items.push(itemId);
}

ItemList.prototype.containsItemWithId = function(id) {
    return this.items.indexOf(id) > -1;
}


module.exports = ItemList;
