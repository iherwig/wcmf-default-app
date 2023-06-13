import { t } from '~/i18n'
import { Model } from './model'

type Values<T> = T[keyof T]

const RelationTypeName = {
  All: 'all',
  Parent: 'parent',
  Child: 'child',
} as const;
export type RelationType = Values<typeof RelationTypeName>

const MultiplicityConstName = {
  Unbounded: 'unbounded'
} as const;
type MultiplicityConst = Values<typeof MultiplicityConstName>

const AggregationTypeName = {
  None: 'none',
  Shared: 'shared',
  Composite: 'composite',
} as const
export type AggregationType = Values<typeof AggregationTypeName>

export type AttributeFilter = {
  include: string[],
  exclude: string[],
}

export type Multiplicity = number|MultiplicityConst

export interface EntityType {
  typeName: string,
  description: string,
  isSortable: boolean,
  displayValues: string[],
  pkNames: string[],
  relationOrder: string[],
  attributes: EntityAttribute[],
  relations: EntityRelation[],
  listView: string,
  detailView: string,

  getRelation(typeName: string): EntityRelation|null
  getAttribute(name: string): EntityAttribute|null
  getSummary(entity?: Entity): string
}

export interface EntityAttribute {
  name: string,
  type: string,
  description: string,
  isEditable: boolean,
  inputType: string,
  displayType: string,
  validateType: string,
  validateDesc: string,
  tags: string[],
  defaultValue: any,
  isReference: boolean,
  isTransient: boolean,
}

export interface EntityRelation {
  name: string,
  type: string,
  fkName: string,
  aggregationKind: AggregationType,
  maxMultiplicity: Multiplicity,
  thisEndName: string,
  isSortable: boolean,
  relationType: RelationType,
}

export class Entity extends Map {}

export class EntityClass implements EntityType {

  public typeName: string = ''
  public description: string = ''
  public isSortable: boolean = false
  public displayValues: string[] = []
  public pkNames: string[] = []
  public relationOrder: string[] = []
  public attributes: EntityAttribute[] = []
  public relations: EntityRelation[] = []
  public listView: string = ''
  public detailView: string = ''

  private relationsByType: Record<RelationType, EntityRelation[]|null> = {
    [RelationTypeName.All]: null,
    [RelationTypeName.Parent]: null,
    [RelationTypeName.Child]: null,
  }

  /**
   * Get a summary of the entity for display
   */
  public getSummary(entity?: Entity): string {
    return ''
  }

  public getEntityAttributes(entity?: Entity): EntityAttribute[] {
    return this.attributes
  }

  public getEntityRelations(entity?: Entity): EntityRelation[] {
    return this.relations
  }

  public getRelations(relationType: RelationType, entity?: Entity): EntityRelation[] {
    if (!this.relationsByType[relationType] || entity) {
      const relations = this.getEntityRelations(entity);
      const rel = relations.filter((r: EntityRelation) => relationType == RelationTypeName.All || r.relationType === relationType)
       const sortingArr = this.relationOrder
      rel.sort((a, b) => {
        return sortingArr.indexOf(a.name) - sortingArr.indexOf(b.name)
      })
      this.relationsByType[relationType] = rel
    }
    return this.relationsByType[relationType]!
  }

  public getRelation(roleName: string): EntityRelation|null {
    const rel = this.relations.filter((r: EntityRelation) => r.name === roleName)
    return rel.length > 0 ? rel[0] : null
  }

  public isManyToManyRelation(roleName: string): boolean {
    const relation = this.getRelation(roleName)
    const otherRelation = relation ? Model.getType(relation.type).getRelation(relation.thisEndName) : null
    return relation !== null && otherRelation !== null && this.isMany(relation.maxMultiplicity) && this.isMany(otherRelation.maxMultiplicity)
  }

  public isMany(multiplicity: Multiplicity): boolean {
    return multiplicity === MultiplicityConstName.Unbounded || multiplicity > 1
  }

  public getTypeForRole(roleName: string): EntityType|null {
    const relation = this.getRelation(roleName)
    return relation !== null ? Model.getType(relation.type) : null
  }

  public getAttributes(filter?: AttributeFilter, entity?: Entity): EntityAttribute[] {
    const result = []
    const include = filter ? filter.include : undefined
    const exclude = filter ? filter.exclude : undefined
    const attributes = this.getEntityAttributes(entity)
    for (let i=0, count=attributes.length; i<count; i++) {
      const attribute = attributes[i]
      const tags = attribute.tags
      const includeOk = !include || (tags && tags.filter((n) => {
      return include.indexOf(n) !== -1
    }).length === include.length)
    const excludeOk = !exclude || (!tags || tags.filter((n) => {
      return exclude.indexOf(n) !== -1
    }).length === 0)
    if (includeOk && excludeOk) {
      result.push(attribute)
    }
    }
    return result
  }

  public getAttribute(name: string): EntityAttribute|null {
    const attributes = this.attributes.filter((a: EntityAttribute) => a.name == name)
    return attributes.length > 0 ? attributes[0] : null
  }

  public getDisplayValue(entity: Entity): string {
    let result = ''
    if (entity) {
      const oid = entity.get('oid')
      const type = Model.getTypeFromOid(oid)
      if (type) {
        if (Model.isDummyOid(oid)) {
          result = t("New <em>%0%</em>", [t(Model.getSimpleTypeName(type.typeName))])
        }
        else {
          const values: string[] = []
          const renderOptions = {}
          for (let i=0; i<type.displayValues.length; i++) {
            const curValue = type.displayValues[i]
            const curAttribute = type.getAttribute(curValue)
            const context = { 'data': entity, 'place': 'form' }
            when(Renderer.render(entity[curValue], curAttribute, renderOptions, context), function(value) {
              const length = value ? value.toString().length : 0
              if (value && length > 0) {
                values.push(value)
              }
            });
          }
          result = values.join(' ')
        }
      }
      else {
        result = oid || t('Object')
      }
    }
    else {
      result = t('Object')
    }
    return result;
  }

  public isEditable(attribute: EntityAttribute, entity?: Entity) {
    return attribute.isEditable;
  }
}