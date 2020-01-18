import Vue from 'vue'
import Vuex from 'vuex'
import { getNodeById } from '../bpmn'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentNodeId: null,
    isRunning: false,
  },
  getters: {
    currentNode: state => {
        return getNodeById(state.currentNodeId)
      }
  },
  mutations: {

    // update current dragging element: from panel-right into diagram editor
    // draggingNode: (state, draggingNode) => {
    //   state.draggingNode = draggingNode
    // },
    selectNode:(state, node) => {
      state.currentNodeId = node.id
    },
    startProject:(state) => {
      state.isRunning = true
    }
  },
  actions: {
    // loadXML({ commit, state }, xml) {},
  },
  strict: process.env.NODE_ENV !== 'production',
})

export default store
