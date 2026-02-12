export const enum RelationType {
  All = 'all',
  Parent = 'parent',
  Child = 'child',
}

export const enum MultiplicityConst {
  Unbounded = 'unbounded'
}

export const enum AggregationType {
  None = 'none',
  Shared = 'shared',
  Composite = 'composite',
}

export type AttributeFilter = {
  include: string[],
  exclude: string[],
}

export type Multiplicity = number|MultiplicityConst

export interface Entity {
  get(name: string): any
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