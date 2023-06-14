import { EntityType, EntityAttribute, EntityRelation, EntityClass, Entity } from '~/stores/model/meta/entity'
import { Model } from './meta/model'

// Names to be included by l10n tools
// Dict.translate('_displayValue')
// Dict.translate('_summary')
// Dict.translate('_type')
export class HistoryItem extends EntityClass implements EntityType {
  typeName: string = 'HistoryItem'
  description: string = ''
  isSortable: boolean = false
  displayValues: string[] = [
    '_displayValue', '_summary', '_type', 'created', 'creator', 'modified', 'last_editor'
  ]
  pkNames: string[] = [
    'id'
  ]
  attributes: EntityAttribute[] = [{
      name: 'id',
      type: '',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_IGNORE'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
}, {
      name: '_displayValue',
      type: 'String',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_ATTRIBUTE'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
  }, {
      name: '_type',
      type: 'String',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_ATTRIBUTE'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
  }, {
      name: 'created',
      type: 'Date',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_ATTRIBUTE', 'GROUP_INTERNAL'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
  }, {
      name: 'creator',
      type: 'String',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_ATTRIBUTE', 'GROUP_INTERNAL'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
  }, {
      name: 'modified',
      type: 'Date',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_ATTRIBUTE', 'GROUP_INTERNAL'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
  }, {
      name: 'last_editor',
      type: 'String',
      description: '',
      isEditable: false,
      inputType: 'text',
      displayType: 'text',
      validateType: '',
      validateDesc: '',
      tags: ['DATATYPE_ATTRIBUTE', 'GROUP_INTERNAL'],
      defaultValue: null,
      isReference: false,
      isTransient: false,
  }]
  relations: EntityRelation[] = []
  listView: string = '../data/widget/EntityListWidget'
  detailView: string = '../data/widget/EntityFormWidget'
  public getSummary(entity?: Entity) {
    var typeClass = Model.getType(entity?.get('_type'));
    return typeClass.getSummary(entity);
  }
}
