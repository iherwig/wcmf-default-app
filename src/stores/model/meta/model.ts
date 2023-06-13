import { EntityType } from './entity'

const types: Record<string, EntityType> = {}
const typeNameMap: Record<string, string> = {}

export class Model {

  public static registerType(type: EntityType) {
    // register fully qualified type name
    const fqTypeName = type.typeName
    types[fqTypeName] = type
    // also register simple type name
    var simpleTypeName = Model.calculateSimpleTypeName(fqTypeName)
    if (typeNameMap[simpleTypeName] === undefined) {
      types[simpleTypeName] = type
      typeNameMap[simpleTypeName] = fqTypeName
    }
    else {
      // if the simple type name already exists, we remove
      // it in order to prevent collisions with the new type
      delete(types[simpleTypeName])
      delete(typeNameMap[simpleTypeName])
    }
  }

  private static calculateSimpleTypeName(typeName: string): string {
    var pos = typeName.lastIndexOf('.')
    if (pos !== -1) {
      return typeName.substring(pos+1)
    }
    return typeName
  }

  public static isKnownType(typeName: string): boolean {
    return types[typeName] !== undefined
  }

  public static getFullyQualifiedTypeName(typeName: string): string {
    if (typeNameMap[typeName] !== undefined) {
      return typeNameMap[typeName]
    }
    if (Model.isKnownType(typeName)) {
      return typeName
    }
    throw new Error(`Unknown type name '${typeName}'`)
  }

  public static getSimpleTypeName(typeName: string): string {
    const simpleTypeName = Model.calculateSimpleTypeName(typeName)
    // if there is a entry for the type name but not for the simple type name,
    // the type is ambiquous and we return the type name
    return (types[typeName] !== undefined && typeNameMap[simpleTypeName] === undefined) ? typeName : simpleTypeName
  }

  public static getTypeNameFromOid(oid: string): string {
    if (oid) {
      var pos = oid.indexOf(':')
      if (pos !== -1) {
        return oid.substring(0, pos)
      }
    }
    return oid
  }

  public static getIdFromOid(oid: string): string {
    if (oid) {
      var pos = oid.indexOf(':')
      if (pos !== -1) {
        return oid.substring(pos+1)
      }
    }
    return oid
  }

  public static getOid(type: string, id: string|number): string {
    return `${Model.getFullyQualifiedTypeName(type)}:${id}`
  }

  public static createDummyOid(type: string): string {
    return Model.getOid(type, '~')
  }

  public static isDummyOid(oid: string): boolean {
    return oid.match(/:~$/) !== null
  }

  public static removeDummyOid(oid: string): string {
    return oid.replace(/:~$/, '')
  }

  public static getType(typeName: string) {
    return types[typeName]
  }

  public static getTypeFromOid(oid: string): EntityType {
    const typeName = Model.getTypeNameFromOid(oid)
    return types[typeName]
  }

  public static getAllTypes(): EntityType[] {
    return Object.values(types)
  }
}