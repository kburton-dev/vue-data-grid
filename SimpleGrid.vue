<template>
    <div class="simple-grid">
        <table ref="table" @mousemove="mouseMoved" @mouseleave="stopResize" @mouseup="stopResize">
            <thead>
                <tr>
                    <th v-for="(col, i) in columns" :key="`col-${i}`" @click="colClicked(col.key)">
                        {{ col.title }}

                        <span v-if="order && order.key == col.key" :class="order.direction == 'asc' ? 'asc' : 'desc'">^</span>

                        <div v-if="i < (columns.length - 1)" @mousedown="resizeMouseDown" class="resizer"></div>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, i) in dataset" :key="`row-${i}`">
                    <td v-for="(col, coli) in columns" :key="`row-data-${coli}`">
                        {{ row[getColumnKey(coli)] }}
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="pageInfo" class="pagination">
            <div class="summary">Viewing page {{ pageInfo.current }} of {{ pageInfo.pages }}</div>

            <div class="pages">
                <template v-for="i in pageInfo.pages">
                    <span v-if="pageInfo.current == i" :key="'page-' + i">{{ i }}</span>
                    <a v-else :key="'page-' + i" @click="$emit('change-page', i)">{{ i }}</a>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { PageInfo, OrderBy } from './models';

// Local non-reactive variables, performance is a bit better than using Vue's reactivity if I use the browser API directly.
let movingColumn = null, startingX = null, startingWidth = null, colMovingTarget = null, blockNextColClick = false;

export default {
    props: {
        dataset: { require: true, type: Array },
        columns: { require: true, type: Array },
        order: { required: false, default: null, type: OrderBy },
        pageInfo: { required: false, default: null, type: PageInfo },
    },
    methods: {
        getColumnKey(i) {
            return this.columns[i].key;
        },
        resizeMouseDown(e) {
            movingColumn = e.target.closest('th');
            startingX = e.pageX;
            startingWidth = movingColumn.offsetWidth;

            colMovingTarget = e.target;
            colMovingTarget.classList.add('resizing');

            colMovingTarget.style.height = this.$refs.table.clientHeight + 'px';

            blockNextColClick = true;
        },
        stopResize(e) {
            if (!movingColumn && !colMovingTarget) return;

            let diffX = e.pageX - startingX;
            movingColumn.style.width = (startingWidth + diffX) + 'px';
            movingColumn.classList.add('pinned');

            colMovingTarget.style.removeProperty('left');
            colMovingTarget.style.removeProperty('height');
            colMovingTarget.classList.remove('resizing');

            movingColumn = null, colMovingTarget = null;
        },
        mouseMoved(e) {
            if (!movingColumn || !colMovingTarget) return;

            let diffX = e.pageX - startingX;
            colMovingTarget.style.left = (startingWidth + diffX - 5) + 'px';
        },
        colClicked(key) {
            if (blockNextColClick) {
                blockNextColClick = false;
                return;
            }

            let direction = 'asc';
            if (this.order && this.order.key == key && this.order.direction == 'asc')
                direction = 'desc';

            this.$emit('sort', { key, direction })
        }
    }
}
</script>

<style scoped>
.simple-grid table {
    width: 100%;
    border-collapse: collapse;
}

.simple-grid th, td {
    border: 1px solid white;
    padding: 8px;
}

.simple-grid th {
    position: relative;
    cursor: pointer;
}

.simple-grid th .desc {
    transform: rotate(180deg);
    display: inline-block;
}

.simple-grid .resizer {
    top: 0px;
    right: 0px;
    width: 5px;
    height: 100%;
    position: absolute;
    cursor: col-resize;
    user-select: none;
}

.simple-grid .resizer.resizing {
    background: dimgray;
}

.simple-grid .pagination a {
    cursor: pointer;
}

</style>