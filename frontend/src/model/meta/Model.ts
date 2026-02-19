import { EntityType } from './types'

export class Model {
  private types: Record<string, EntityType> = {}
  private typeNameMap: Record<string, string> = {}

  public registerType(type: EntityType) {
    // register fully qualified type name
    const fqTypeName = type.typeName
    this.types[fqTypeName] = type
    // also register simple type name
    var simpleTypeName = this.calculateSimpleTypeName(fqTypeName)
    if (this.typeNameMap[simpleTypeName] === undefined) {
      this.types[simpleTypeName] = type
      this.typeNameMap[simpleTypeName] = fqTypeName
    }
    else {
      // if the simple type name already exists, we remove
      // it in order to prevent collisions with the new type
      delete(this.types[simpleTypeName])
      delete(this.typeNameMap[simpleTypeName])
    }
  }

  private calculateSimpleTypeName(typeName: string): string {
    var pos = typeName.lastIndexOf('.')
    if (pos !== -1) {
      return typeName.substring(pos+1)
    }
    return typeName
  }

  public isKnownType(typeName: string): boolean {
    return this.types[typeName] !== undefined
  }

  public getFullyQualifiedTypeName(typeName: string): string {
    if (this.typeNameMap[typeName] !== undefined) {
      return this.typeNameMap[typeName]
    }
    if (this.isKnownType(typeName)) {
      return typeName
    }
    throw new Error(`Unknown type name '${typeName}'`)
  }

  public getSimpleTypeName(typeName: string): string {
    const simpleTypeName = this.calculateSimpleTypeName(typeName)
    // if there is a entry for the type name but not for the simple type name,
    // the type is ambiquous and we return the type name
    return (this.types[typeName] !== undefined && this.typeNameMap[simpleTypeName] === undefined) ? typeName : simpleTypeName
  }

  public getTypeNameFromOid(oid: string): string {
    if (oid) {
      var pos = oid.indexOf(':')
      if (pos !== -1) {
        return oid.substring(0, pos)
      }
    }
    return oid
  }

  public getIdFromOid(oid: string): string {
    if (oid) {
      var pos = oid.indexOf(':')
      if (pos !== -1) {
        return oid.substring(pos+1)
      }
    }
    return oid
  }

  public getOid(type: string, id: string|number): string {
    return `${this.getFullyQualifiedTypeName(type)}:${id}`
  }

  public createDummyOid(type: string): string {
    return this.getOid(type, '~')
  }

  public isDummyOid(oid: string): boolean {
    return oid.match(/:~$/) !== null
  }

  public removeDummyOid(oid: string): string {
    return oid.replace(/:~$/, '')
  }

  public getType(typeName: string): EntityType {
    return this.types[typeName]
  }

  public getTypeFromOid(oid: string): EntityType {
    const typeName = this.getTypeNameFromOid(oid)
    return this.types[typeName]
  }

  public getAllTypes(): EntityType[] {
    return Object.values(this.types)
  }
}