# vue-data-grid
Basic data-driven Vue.js table for use with server-side heavy-lifting.

Too often I have seen Vue components fetch thousands of records from an API, and then attempt to paginate, filter, sort, etc. in the UI itself. This simple grid emits the events you might need to trigger a call to your API, so that you can do sorting and pagination on the server side.

## Sample implementation
![Data grid in action](https://raw.githubusercontent.com/kburton-dev/vue-data-grid/master/sample.gif)

## Basic usage

### Template
```
<simple-grid v-bind="simpleGridOptions" @sort="changeOrder" @change-page="changePage"></simple-grid>
```

### Import
```
import SimpleGrid from './SimpleGrid.vue';
import { PageInfo, OrderBy, ColumnConfig } from './models';
```

### Data structure
```
data() {
    return {
        simpleGridOptions: {
            columns: [
                new ColumnConfig('First Name', 'firstName'),
                new ColumnConfig('Surname', 'lastName'),
                new ColumnConfig('Age', 'age')
            ],
            dataset: [],
            order: null,
            pageInfo: null,
        }
    }
}
```

### Fetch some data
```
methods: {
    getData(page, sort = null, dir = null) {
        axios.get('/gridData', { params: { page, sort, dir } })
            .then(r => {
                this.simpleGridOptions.dataset = r.data.results;

                this.simpleGridOptions.pageInfo = new PageInfo(r.data.page, r.data.totalPages);
                this.simpleGridOptions.order = sort && dir ? new OrderBy(sort, dir) : null;
            });
    },
    changeOrder(order) {
        this.getData(1, order.key, order.direction);
    },
    changePage(page) {
        this.getData(page, this.simpleGridOptions.order.key, this.simpleGridOptions.order.direction);
    }
}
```
### Set up some API routes to handle a request like the above
```
/gridData
/gridData?page=1
/gridData?page=1&sort=firstName&dir=asc
/gridData?page=3&sort=lastName&dir=desc
```
### Make sure your API returns everything you need
```
{
    "results": [
        { "firstName": "Abbot", "lastName": "Blake", "age": 75 },
        { "firstName": "Aladdin", "lastName": "Franklin", "age": 73 },
        { "firstName": "Amir", "lastName": "Graves", "age": 36 },
        ...
    ],
    "page": "1",
    "totalPages": 10
}
```