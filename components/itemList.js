var ItemList = function(items=[]) {
    this.items = items;
    this.name = "ItemList";
}

ItemList.prototype.add = function(itemId) {
    this.items.push(itemId);
}

ItemList.prototype.clear = function() {
    this.items = [];
}

ItemList.prototype.isEmpty = function() {
    return this.items.length === 0;
}

ItemList.prototype.containsItemWithId = function(id) {
    return this.items.indexOf(id) > -1;
}


module.exports = ItemList;
