import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentNode: null,
  },
  getters: {

  },
  mutations: {

    // update current dragging element: from panel-right into diagram editor
    // draggingNode: (state, draggingNode) => {
    //   state.draggingNode = draggingNode
    // },
    selectNode:(state, node) => {
      state.currentNode = node
    }
  },
  actions: {
    // loadXML({ commit, state }, xml) {},
  },
  strict: process.env.NODE_ENV !== 'production',
})

export default store
