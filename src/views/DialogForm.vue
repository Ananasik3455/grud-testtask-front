<template>
  <k-dialog
    v-model="dialog"
    :title="currentTitle"
  >
    <div class="form">
      <div
        v-for="input in formData"
        :key="input.name"
        class="form-item"
      >
        <label for="planetName">{{ input.title }}</label>
        <div class="input-block">
          <input v-model="currentBody[input.name]" :type="input.type" :placeholder="input.title">
        </div>
      </div>

      <div class="form-actions">
        <button class="button button__secondary" @click="handleSubmit">{{ currentButtonTitle }}</button>
      </div>
    </div>
  </k-dialog>
    
</template>

<script>
import KDialog from '../components/KDialog.vue';

export default {
  name: 'DialogForm',

  components: { KDialog },

  props: {
    value: Boolean,
    isEdit: Boolean,
    formData: Array,
  },

  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit('input', newVal);
      },
    },

    currentBody() {
      return this.$store.getters['getCurrentBody'];
    },

    currentTitle() {
      return this.isEdit ? 'Редактирование объекта' : 'Добавление объекта';
    },
    currentButtonTitle() {
      return this.isEdit ? 'Редактировать' : 'Добавить';
    },
  },

  methods: {
    handleSubmit() {
      if (!this.currentBody.name) return;
      if (this.isEdit) {
        this.editBody();
      }
      else {
        this.createBody();
      }

      this.dialog = false;
    },
  
    createBody() {
      this.$store.dispatch('addBody');
    },
    editBody() {
      this.$store.dispatch('editBody');
    },

    cleanCurrentBody() {
      this.$store.dispatch('cleanCurrentBody');
    },
  },
};
</script>

<style>

</style>