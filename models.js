class PageInfo {
    constructor(current, pages) {
        this.current = current;
        this.pages = pages;
    }
}

class OrderBy {
    constructor(key, direction) {
        this.key = key;
        this.direction = direction;
    }
}

class ColumnConfig {
    constructor(title, key) {
        this.title = title;
        this.key = key;
    }
}

module.exports = { PageInfo, OrderBy, ColumnConfig };