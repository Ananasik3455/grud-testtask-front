<template>
  <div
    :class="value ? 'modal__show' : 'modal__hiddden'"
    class="modal"
    @click.self="closeDialog"
  >
    <div class="modal-card">
      <div class="modal-actions">
        <slot name="title">{{ title }}</slot>
        <span class="close" @click="closeDialog">&times;</span>
      </div>

      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KDialog',

  props: {
    value: Boolean,
    title: String,
  },

  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);

  &__show {
    display: block;
  }
  &__hiddden {
    display: none;
  }
}

.modal-card {
  background-color: #fefefe;
  border: 1px solid #888;
  margin: 15% auto;
  width: 30%;

  .modal-actions {
    padding: 20px 30px 10px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;

    .close {
      color: #aaa;
      font-size: 40px;
      font-weight: bold;
    }
  }

  .modal-content {
    padding: 20px 30px 40px 30px;
    font-size: 18px;
  }
}

.close:hover,
.close:focus {
  text-decoration: none;
  color: black;
  cursor: pointer;
}
</style>
