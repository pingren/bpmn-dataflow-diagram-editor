import { assign, isArray } from 'min-dash'

import { is } from 'bpmn-js/lib/util/ModelUtil'

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

import { hasPrimaryModifier } from 'diagram-js/lib/util/Mouse'

/**
 * A provider for BPMN 2.0 elements context pad
 */
export default function ContextPadProvider(
  config,
  injector,
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  popupMenu,
  canvas,
  rules,
  translate
) {
  config = config || {}

  contextPad.registerProvider(this)

  this._contextPad = contextPad

  this._modeling = modeling

  this._elementFactory = elementFactory
  this._connect = connect
  this._create = create
  this._popupMenu = popupMenu
  this._canvas = canvas
  this._rules = rules
  this._translate = translate

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false)
  }

  eventBus.on('create.end', 250, function(event) {
    var shape = event.context.shape

    if (!hasPrimaryModifier(event)) {
      return
    }

    var entries = contextPad.getEntries(shape)

    if (entries.replace) {
      entries.replace.action.click(event, shape)
    }
  })
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
]

ContextPadProvider.prototype.getContextPadEntries = function(element) {
  var modeling = this._modeling
  var connect = this._connect
  var rules = this._rules
  var translate = this._translate

  var actions = {}

  if (element.type === 'label') {
    return actions
  }

  var businessObject = element.businessObject

  function startConnect(event, element) {
    connect.start(event, element)
  }

  function removeElement(e) {
    modeling.removeElements([element])
  }

  /**
   * Create an append action
   *
   * @param {String} type
   * @param {String} className
   * @param {String} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */

  // if (is(businessObject, 'bpmn:FlowNode')) {
  //   if (
  //     !is(businessObject, 'bpmn:EndEvent') &&
  //     !businessObject.isForCompensation &&
  //     !isEventType(
  //       businessObject,
  //       'bpmn:IntermediateThrowEvent',
  //       'bpmn:LinkEventDefinition'
  //     ) &&
  //     !isEventSubProcess(businessObject)
  //   ) {
  //     assign(actions, {
  //       'append.append-task': appendAction(
  //         'bpmn:ScriptTask',
  //         'bpmn-icon-script-task',
  //         translate('Append Task')
  //       ),
  //     })
  //   }
  // }

  if (
    !is(businessObject, 'bpmn:EndEvent') &&
    isAny(businessObject, [
      'bpmn:FlowNode',
      'bpmn:InteractionNode',
      'bpmn:DataObjectReference',
      'bpmn:DataStoreReference',
    ])
  ) {
    assign(actions, {
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate(
          'Connect using ' +
            (businessObject.isForCompensation
              ? ''
              : 'Sequence/MessageFlow or ') +
            'Association'
        ),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    })
  }

  if (
    isAny(businessObject, [
      'bpmn:DataObjectReference',
      'bpmn:DataStoreReference',
    ])
  ) {
    assign(actions, {
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using DataInputAssociation'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    })
  }

  // delete element entry, only show if allowed by rules
  var deleteAllowed = rules.allowed('elements.delete', { elements: [element] })

  if (isArray(deleteAllowed)) {
    // was the element returned as a deletion candidate?
    deleteAllowed = deleteAllowed[0] === element
  }
  let immortalTypes = ['bpmn:StartEvent', 'bpmn:EndEvent']

  if (deleteAllowed && immortalTypes.indexOf(element.type) === -1) {
    assign(actions, {
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement,
        },
      },
    })
  }

  return actions
}
