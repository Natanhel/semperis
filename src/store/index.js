import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    formData: {},
    permission: {},
    mode: '',
  },
  getters: {
  },
  mutations: {
    setFormData(state, data) {
      state.formData = data
    },
    setPermission(state, data) {
      const permissionsArray = JSON.parse(data);
      if (permissionsArray) {
        ['basic', 'advanced'].forEach((key, i) => {
          state.permission[key] = permissionsArray[i] === 1
        })
      } else {
        state.permission = {}
      }

    },
    setMode(state, data) {
      state.mode = data
    }
  },
  actions: {
    getPermissions({ commit }) {
      const persmission = localStorage.getItem("permission")
      commit('setPermission', persmission)
    },
    getMode({ commit }) {
      const mode = localStorage.getItem("mode")
      commit('setMode', mode)
    },
    getFormData({ commit }) {
      const userData = localStorage.getItem("userData");
      userData !== null && commit('setFormData', JSON.parse(userData))
    },

    setFormData({ commit }, fromData) {
      localStorage.setItem("userData", JSON.stringify(fromData));
      commit('setFormData', fromData)
    }
  },
  modules: {
  }
})
