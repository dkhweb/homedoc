import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dadataSuggestions: [],
    date: '',
    fullname: ''
  },
  mutations: {
    SET_DADATA_SUGGESTIONS(state, payload){
      state.dadataSuggestions = payload
    },
    SET_DATE(state, payload){
      state.date = payload
    },
    SET_FULLNAME(state, payload){
      state.fullname = payload
    }
  },
  actions: {
    getDadataSuggestion({ commit }, query){
      const url = process.env.VUE_APP_DADATA_ADDRESS_URL
      const token = process.env.VUE_APP_DADATA_TOKEN

      var options = {
          method: "POST",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": "Token " + token
          },
          body: JSON.stringify({query: query})
      }

      fetch(url, options)
      .then(response => response.json())
      .then(result => commit('SET_DADATA_SUGGESTIONS', result.suggestions))
      .catch(error => console.log("error", error));
    }
  },
  modules: {
  }
})
