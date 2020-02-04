import Vue from 'vue'
import Vuex from 'vuex'
import { getNodeById } from '../bpmn'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentNodeId: null,
    isRunning: false,
    inputModel: {},
    outputModel: {},
  },
  getters: {
    currentNode: state => {
        return getNodeById(state.currentNodeId)
    },
    currentInput: state => {
        return state.inputModel[state.currentNodeId]
    },
    getNodeOutputById: (state) => (id) => {
      return state.outputModel[id]
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
    },
    setInput:(state, payload) => {
      state.inputModel[payload.id] = payload.obj
    },
    setOutput:(state, payload) => {
      state.outputModel[payload.id] = payload.obj
    }
  },
  actions: {
    // loadXML({ commit, state }, xml) {},
  },
  strict: process.env.NODE_ENV !== 'production',
})

export default store
