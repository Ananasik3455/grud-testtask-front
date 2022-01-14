<template>
  <div class="table-container">
    <div class="table-actions">
      <div>
        <slot name="actions"></slot>
      </div>

      <div>
        <slot name="center-actions"></slot>
      </div>

      <div>
        <button
          :disabled="disablePrevButton"
          class="button button__secondary button__circle"
          @click="paginateTo(page - 1)"
        >ᐊ</button>
        <div class="actions-text">{{ page }}</div>
        <button
          :disabled="disableNextButton"
          class="button button__secondary button__circle"
          @click="paginateTo(page + 1)"
        >ᐅ</button>

        <select name="rowsPerPage" v-model="rowsPerPage" class="select">
          <option
            v-for="pp in rowsPerPageSelect"
            :value="pp"
            :key="pp"
          >{{ pp !== -1 ? pp : 'Все' }}</option>
        </select>
      </div>
    </div>

    <div class="table">
      <div class="table-head">
        <table>
          <tr class="head">
            <slot name="headers" :headers="headers">
              <th
                v-for="header in headers"
                :key="header.name"
                :style="`width: ${ header.width || 'auto'}`"
                class="table__header"
                @click="changeSort(header.name)"
              >
                <slot :name="`header.${header.name}`" :header="header">
                  {{ header.title }}
                </slot>
              </th>
            </slot>
          </tr>
        </table>
      </div>

      <div class="table-body">
        <table>
          <tr v-for="(row, index) in items" :key="index">
            <slot name="items">
              <td
                v-for="header in headers"
                :key="header.name"
                :style="`width: ${ header.width || 'auto'}`"
              >
                <slot :name="`item.${header.name}`" :item="row">
                  {{ row[header.name] }}
                </slot>
              </td>
            </slot>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KTable',

  props: {
    tableOptions: {
      type: Object,
      validation: () => true,
    },
    loading: Boolean,
    headers: Array,
    items: Array,
  },

  data: () => ({
    rowsPerPageSelect: [10, 20, 50, 100, -1],
  }),

  computed: {
    rowsPerPage: {
      get() { return this.tableOptions.rowsPerPage },
      set(value) { this.updateTableOptions({ ...this.tableOptions, rowsPerPage: value }) }
    },
    page: {
      get() { return this.tableOptions.page },
      set(value) { this.updateTableOptions({ ...this.tableOptions, page: value }) }
    },
    orderAsc: {
      get() { return this.tableOptions.orderAsc },
      set(value) { this.updateTableOptions({ ...this.tableOptions, orderAsc: value }) }
    },
    orderBy: {
      get() { return this.tableOptions.orderBy },
      set(value) { this.updateTableOptions({ ...this.tableOptions, orderBy: value }) }
    },
    filters: {
      get() { return this.tableOptions.filters },
      set(value) { this.updateTableOptions({ ...this.tableOptions, filters: value }) }
    },

    isAllRowsPerPage() {
      return this.rowsPerPage === -1;
    },

    disablePrevButton() {
      return this.isAllRowsPerPage || this.page === 1;
    },
    disableNextButton() {
      return this.isAllRowsPerPage || this.items.length < this.rowsPerPage;
    },
  },

  methods: {
    refresfItems() {
      this.$emit('refresh');
    },
    updateTableOptions(pagination) {
      this.$emit('update:tableOptions', pagination);
    },

    changeSort(name) {
      if (this.orderBy === name) {
        this.orderAsc = !this.orderAsc
      }
      else {
        this.orderAsc = true;
        this.orderBy = name;
      }

      this.refresfItems();
    },

    paginateTo(page) {
      this.page = page;
      this.refresfItems();
    },
  },

  watch: {
    rowsPerPage() {
      this.page = 1;
      this.refresfItems();
    },
  },
};
</script>

<style lang="scss">
.table-container {
  display: flex;
  flex-flow: column wrap;
  width: 80%;
  margin: auto;
}

.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  font-size: 18px;

  div {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .select {
    outline: 0;
    margin: 5px 20px;
  }
}
.actions-text {
  font-size: 22px;
}

.table {
  background-color: #fff;
}

</style>
