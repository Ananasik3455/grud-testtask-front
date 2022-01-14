import Vue from 'vue';
import Vuex from 'vuex';
import webClient from './WebClient';

Vue.use(Vuex);

const initialBody = () => ({
  name: '',
  isPlanet: false,
  discoveredBy: '',
  discoveryDate: '',
});

export default new Vuex.Store({
  state: {
    body: initialBody(),
    addedBodies: [],
    bodies: [],

    deletedIds: [],
    deletedBodies: [],
  },

  mutations: {
    SET_BODIES: (state, bodies) => state.bodies = bodies,
    SET_BODY: (state, body) => state.body = body,

    ADD_BODY: (state, body) => state.addedBodies.push(body),
    EDIT_BODY: (state, { id, isLocal, body }) => {
      let oldBody = {};
      if (isLocal) {
        oldBody = state.addedBodies.find(b => b.id === id);
      }
      else {
        oldBody = state.bodies.find(b => b.id === id);
      }

      Object.assign(oldBody, body);
    },

    DELETE_BODY(state, { id, isLocal }) {
      let body;
      if (isLocal) {
        body = state.addedBodies.find(b => b.id === id);
        state.addedBodies = state.addedBodies.filter(b => b.id !== id);
      }
      else {
        body = state.bodies.find(b => b.id === id);
        body.isDeleted = true;
        state.deletedIds.push(body.id);
      }

      state.deletedBodies.push({ ...body });
    },

    CLEAN_CURRENT_BODY: state => state.body = initialBody(),
  },

  actions: {
    async loadBodies({ state, commit }, { page, filter, order }) {
      const { bodies } = (await webClient.get('/bodies', {
        params: {
          filter: [...filter, ...state.deletedIds.map(id => `id,neq,${id}`)],
          data: 'id,name,isPlanet,discoveredBy,discoveryDate',
          page,
          order,
        }
      })).data;

      const filteredBodies = bodies.map(b => ({...b, isDeleted: state.deletedIds.find(di => di === b.id)}));
      commit('SET_BODIES', filteredBodies);
    },

    async loadBody({ commit }, id) {
      const body = (await webClient.get(`/bodies/${id}`)).data;
      commit('SET_BODY', { ...body });
    },
    loadBodyFromLocal({ commit, state }, { id, isLocal }) {
      let body = {};
      if (isLocal) {
        body = state.addedBodies.find(b => b.id === id);
      }
      else {
        body = state.bodies.find(b => b.id === id);
      }

      commit('SET_BODY',  { ...body });
    },

    addBody({ commit, state }) {
      const { body } = state;
      commit('ADD_BODY', {
        id: body.name,
        isLocal: true,
        ...body,
      });
    },
    editBody({ commit, state }) {
      const { body } = state;
      commit('EDIT_BODY', {
        isLocal: body.isLocal,
        id: body.id,
        body,
      });
    },

    deleteBody({ commit }, { id, isLocal }) {
      commit('DELETE_BODY', { id, isLocal });
    },
    cleanCurrentBody({ commit }) {
      commit('CLEAN_CURRENT_BODY');
    },
  },
  getters: {
    getBodies: state => [...state.bodies.filter(body => !body.isDeleted), ...state.addedBodies],
    getAllBodies: state => [...state.bodies, ...state.addedBodies],
    getArchivedBodies: state => state.deletedBodies,
    getCurrentBody: state => state.body,
  },
});
