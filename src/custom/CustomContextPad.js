export default class CustomContextPad {
  constructor(modeling, contextPad,translate,rules) {
    this.modeling = modeling;
    this.translate = translate;
    this.rules = rules


    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      rules,
      translate,
      modeling
    } = this;

    var actions = {};
    function removeElement(e) {
      modeling.removeElements([ element ]);
    }
  // delete element entry, only show if allowed by rules
    var deleteAllowed = rules.allowed('elements.delete', { elements: [ element ] });

    if (Array.isArray(deleteAllowed)) {
      // was the element returned as a deletion candidate?
      deleteAllowed = deleteAllowed[0] === element;
    }

    if (deleteAllowed) {
      Object.assign(actions, {
        'delete': {
          group: 'edit',
          className: 'bpmn-icon-trash',
          title: translate('Remove'),
          action: {
            click: removeElement
          }
        }
      });
    }
    return actions
  }
}

CustomContextPad.$inject = [
  'modeling',
  'contextPad',
  'translate',
  'rules'
];