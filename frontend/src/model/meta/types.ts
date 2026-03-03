export const RelationType = {
  All: 'all',
  Parent: 'parent',
  Child: 'child',
} as const
export type RelationType = typeof RelationType[keyof typeof RelationType]

export const MultiplicityConst = {
  Unbounded: 'unbounded'
} as const
export type MultiplicityConst = typeof MultiplicityConst[keyof typeof MultiplicityConst]

export const AggregationType = {
  None: 'none',
  Shared: 'shared',
  Composite: 'composite',
} as const
export type AggregationType = typeof AggregationType[keyof typeof AggregationType]

export type AttributeFilter = {
  include: string[],
  exclude: string[],
}

export type Multiplicity = number|MultiplicityConst

export interface Entity {
  oid: string
  [name: string]: any
}

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