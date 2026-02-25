import { Action } from '.'
import { Entity } from '~/model/meta/types'
import { NavigationFailure } from 'vue-router'
import { Edit16Regular as EditIcon } from '@vicons/fluent'
import { useModel } from '~/composables/model'
import router from '~/router'

type EditReturnType = void|undefined|NavigationFailure

const model = useModel()

export class Edit implements Action<EditReturnType> {
  public readonly name = 'edit'
  public readonly icon = EditIcon
  public entity: Entity|undefined = undefined

  constructor(entity?: Entity) {
    if (entity) {
      this.entity = entity
    }
  }

  public getUrl(entity: Entity) {
    const url = router.resolve(this.getRouteParams(entity))
    return url.href
  }

  async execute(entity: Entity): Promise<EditReturnType> {
    router.push(this.getRouteParams(entity))
  }

  private getRouteParams(entity: Entity) {
    const oid = entity.oid
    const type = model.getSimpleTypeName(model.getTypeNameFromOid(oid))
    const id = model.getIdFromOid(oid);
    return { name: 'Entity', params: { type: type, id: id } }
  }
}