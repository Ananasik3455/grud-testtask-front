<template>
  <div class="view-container card">
    <div class="card-title">
      <div>{{ currentBody.name }}</div>
      <button class="button button__secondary" @click="redirectToTable">Вернуться к таблице</button>
    </div>

    <div class="card-content">
      <div class="content-title">
        <div>Является ли планетой</div>
        <div>Кем открыта</div>
        <div>Дата открытия</div>
      </div>

      <div>
        <div>{{ currentBody.isPlanet ? '✓' : 'х' }}</div>
        <div>{{ currentBody.discoveredBy }}</div>
        <div>{{ currentBody.discoveryDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewPage',

  async created() {
    const { id } = this.$route.params;
    await this.$store.dispatch('loadBody', id);
  },

  computed: {
    currentBody() {
      return this.$store.getters['getCurrentBody'];
    },
  },

  methods: {
    redirectToTable() {
      this.$router.push('/');
    }
  },
};
</script>

<style lang="scss">
.view-container {
  width: 50%;
  margin: 40px auto;
}

.card {
  border-radius: 25px;
  padding: 20px 50px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  font-size: 26px;
  margin-bottom: 20px;
}

.card-content {
  width: 100%;
  display: flex;
  text-align: left;

  .content-title {
    font-weight: 600;
    width: 25%;
  }

  div {
    div {
      padding: 5px 0;
    }
  }
}
</style>
