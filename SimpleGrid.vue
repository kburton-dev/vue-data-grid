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

export default {
    props: {
        dataset: { require: true, type: Array },
        columns: { require: true, type: Array },
        order: { required: false, default: null, type: OrderBy },
        pageInfo: { required: false, default: null, type: PageInfo },
    },
    data() {
        return {
            movingColumn: null,
            startingX: null,
            startingWidth: null,
            colMovingTarget: null,
            blockNextColClick: false,
        }
    },
    methods: {
        getColumnKey(i) {
            return this.columns[i].key;
        },
        resizeMouseDown(e) {
            this.movingColumn = e.target.closest('th');
            this.startingX = e.pageX;
            this.startingWidth = this.movingColumn.offsetWidth;

            this.colMovingTarget = e.target;
            this.colMovingTarget.classList.add('resizing');

            this.colMovingTarget.style.height = this.$refs.table.clientHeight + 'px';

            this.blockNextColClick = true;
        },
        stopResize(e) {
            if (!this.movingColumn && !this.colMovingTarget) return;

            let diffX = e.pageX - this.startingX;
            this.movingColumn.style.width = (this.startingWidth + diffX) + 'px';
            this.movingColumn.classList.add('pinned');

            this.movingColumn = null;

            this.colMovingTarget.style.removeProperty('left');
            this.colMovingTarget.style.removeProperty('height');
            this.colMovingTarget.classList.remove('resizing');

            this.colMovingTarget = null;
        },
        mouseMoved(e) {
            if (!this.movingColumn || !this.colMovingTarget || e.layerX <= 1) return;

            let diffX = e.pageX - this.startingX;
            this.colMovingTarget.style.left = (this.startingWidth + diffX - 5) + 'px';
        },
        colClicked(key) {
            if (this.blockNextColClick) {
                this.blockNextColClick = false;
                return;
            }

            let direction;
            if (this.order && this.order.key == key)
                direction = this.order.direction == 'asc' ? 'desc' : 'asc';
            else
                direction = 'asc';

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