import Vue from 'vue'
import Vuex from 'vuex'
// import { eventBus } from '../bpmn'
Vue.use(Vuex)

function obj2JSON(obj) {
  // 如果是数值则转换成字符串类型，使 JSON.stringify 格式统一不调用多次 watch, element-ui number picker 会采用数值
  return JSON.stringify(obj, (_, value) =>
    isNaN(value) ? value : String(value)
  )
}
let reusableModule = {
  state(){
    return  {
      currentNodeId: null,
      isRunning: false,
      zoomLevel: undefined,
      inputModel: {},
      outputModel: {},
      transferModel: {}
    }
  },
  mutations: {
    selectNode:(state, node) => {
      state.currentNodeId = node.id
    },
    startProject:(state) => {
      state.isRunning = true
    },
    setZoomLevel(state, level){
      state.zoomLevel = parseFloat(level)
    },
    setInput:(state, payload) => {
      // state.inputModel[payload.id] = payload.obj
      Vue.set(state.inputModel, payload.id, payload.obj)
    },
    setOutput:(state, payload) => {
      // state.outputModel[payload.id] = payload.obj
      Vue.set(state.outputModel, payload.id, payload.obj)
    },
    setTransfer:(state, payload) => {
      // state.transferModel[payload.id] = payload.obj
      let oldTransferJSON = obj2JSON(state.transferModel[payload.id])
      if(payload.key) {
        // set specific value for tranferModel[paylod.id], comply vuex strict mode
        Vue.set(state.transferModel[payload.id], payload.key, payload.obj)
      }
      else {
        Vue.set(state.transferModel, payload.id, payload.obj)
      }
      let newTransferJSON = obj2JSON(state.transferModel[payload.id])
      if(oldTransferJSON !== newTransferJSON) {
        console.log(
          `${payload.init ? "Load" : "Modify"} Node ${payload.id} Data :`,
          oldTransferJSON,
          '=>',
          newTransferJSON
        )
        // Transfer update will update diagram XML, payload.diagram must be provided
        let node = payload.diagram.getNodeById(payload.id)
        node.set('PROPERTY', newTransferJSON)
        // if not init loading, BFS to update all child nodes
        if(!payload.init) {
          payload.diagram.eventBus.fire('commandStack.changed', {
            node: node,
          })
        }
      }
    },
    updateTransfer:(state, payload) => {
      // loop input model object, modify transferModel if necessary，
      let input = state.inputModel[payload.id]
      let transfer = state.transferModel[payload.id]
      for (const [key, inputArray] of Object.entries(input)) {
        let transferValue = transfer[key]
        // TODO: maybe double check transfer area is from the input, before check the key
        if(transferValue === "" || transferValue === undefined) {
          continue
        }
        if(transferValue.length !== undefined){
            let newTransfer = transferValue.filter(value => inputArray.find(item => JSON.stringify(item) === JSON.stringify(value)))
            Vue.set(state.transferModel[payload.id], key, newTransfer)
        }
        else {
          if(inputArray.find(item => JSON.stringify(item) === JSON.stringify(transferValue)) === undefined){
            Vue.set(state.transferModel[payload.id], key, undefined)
          }
        }
      }
    }
  },
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true
}
export default reusableModule
