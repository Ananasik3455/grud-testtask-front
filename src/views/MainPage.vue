<template>
  <div id="app">
    <dialog-form v-model="dialog" :is-edit="isEdit" :form-data="formData" />

    <k-table
      :tableOptions.sync="tableOptions"
      :items="getCurrentBodies"
      :headers="headers"
      @refresh="loadBodies"
      @add="openDialog"
    >
      <template #actions>
        <button id="addButton" class="button button__secondary button__outline" @click="handleCreate">Добавить</button>

        <div>
          <input v-model="isArchived" type="checkbox" id="showArchived" class="checkbox" />
          <label for="showArchived" style="cursor: pointer; padding: 0 5px">{{ isArchived ? 'Скрыть удаленные' : 'Показать удаленные'}}</label>
        </div>
      </template>

      <template #center-actions>
        <div class="form-item">
          <label for="planetName">Поиск</label>
          <div class="input-block">
            <input v-model="search" type="text" placeholder="Имя космического объекта">
          </div>
        </div>
      </template>

      <template #item.isPlanet="{ item }">
        {{ item.isPlanet ? '✓' : 'х' }}
      </template>

      <template #item.actions="{ item }">
        <div v-if="!isArchived">
          <button :disabled="item.isLocal" class="button button__secondary" @click="handleView(item.id, item.isLocal)">Просмотр</button>
          <button class="button button__secondary" @click="handleEdit(item.id, item.isLocal)">Редактировать</button>
          <button class="button button__error" @click="handleDelete(item.id, item.isLocal)">Удалить</button>
        </div>
      </template>
    </k-table>
  </div>
</template>

<script>
import KTable from '@/components/KTable';
import KDialog from '@/components/KDialog';
import DialogForm from './DialogForm';

const dataConfigure = [
  { name: 'name',           width: '20%',  type: 'text',     title: 'Имя космического объекта'},
  { name: 'isPlanet',       width: '20%',  type: 'checkbox', title: 'Является ли планетой'},
  { name: 'discoveredBy',   width: '20%',  type: 'text',     title: 'Кем открыта'},
  { name: 'discoveryDate',  width: '15%',  type: 'text',     title: 'Дата открытия'},
  { name: 'actions',        width: '25%',  type: 'none',     title: ''},
]

export default {
  name: 'MainPage',

  components: {
    DialogForm,
    KDialog,
    KTable,
  },

  created() {
    this.loadBodies();
  },

  data: () => ({
    dataConfigure,

    isArchived: false,
    dialog: false,
    isEdit: false,

    search: '',

    tableOptions: {
      rowsPerPage: 20,
      page: 1,

      orderAsc: true,
      orderBy: 'id',
    }
  }),

  computed: {
    headers() {
      return this.dataConfigure.map(({ name, title, width }) => ({ name, title, width }));
    },
    formData() {
      return this.dataConfigure.filter(dc => dc.type !== 'none');
    },

    bodies() {
      return this.$store.getters['getBodies'];
    },
    getArchivedBodies() {
      return this.$store.getters['getArchivedBodies'];
    },
    getCurrentBodies() {
      return this.isArchived ? this.getArchivedBodies : this.bodies;
    },
  },

  methods: {
    async loadBodies() {
      let page = '';

      if (this.tableOptions.rowsPerPage !== -1) {
        page = `${this.tableOptions.page},${this.tableOptions.rowsPerPage}`;
      }
      await this.$store.dispatch('loadBodies', {
        order: `${this.tableOptions.orderBy},${this.tableOptions.orderAsc ? 'asc' : 'desc'}`,
        filter: [`name,cs,${this.search}`],
        page,
      });
    },

    async handleEdit(id, isLocal) {
      this.isEdit = true;
      await this.$store.dispatch('loadBodyFromLocal', { id, isLocal });
      this.openDialog();
    },
    handleView(id) {
      this.$router.push({
        name: 'ViewPage',
        params: { id },
      });
    },
    handleDelete(id, isLocal) {
      this.$store.dispatch('deleteBody', { id, isLocal });
      this.loadBodies();
    },
    handleCreate() {
      this.isEdit = false;
      this.cleanCurrentBody();
      this.openDialog();
    },

    openDialog() {
      this.dialog = true;
    },
    cleanCurrentBody() {
      this.$store.dispatch('cleanCurrentBody');
    },
  },

  watch: {
    search() {
      this.loadBodies();
    },
  },
};
</script>
