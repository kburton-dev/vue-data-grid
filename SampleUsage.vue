<template>
    <div class="some-data">
        <simple-grid
            v-bind="simpleGridOptions"
            @sort="changeOrder"
            @change-page="changePage"
        ></simple-grid>
    </div>
</template>

<script>
import SimpleGrid from './SimpleGrid.vue';
import { PageInfo, OrderBy, ColumnConfig } from './models';

import axios from 'axios';

export default {
    components: { SimpleGrid },
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
    },
    mounted() {
        this.getData(1);
    },
    methods: {
        getData(page, sort = null, dir = null) {
            axios.get('/gridData', { params: { page, sort, dir } })
                .then(response => {
                    this.simpleGridOptions.dataset = response.data.results;

                    this.simpleGridOptions.pageInfo = new PageInfo(response.data.page, response.data.totalPages);
                    this.simpleGridOptions.order = new OrderBy(sort, dir);
                })
                .catch(() => this.$toastr.e('Something went wrong while trying to load the data, please try again.'));
        },
        changeOrder(order) {
            this.getData(1, order.key, order.direction);
        },
        changePage(page) {
            this.getData(page, this.simpleGridOptions.order.key, this.simpleGridOptions.order.direction);
        }
    }
}
</script>