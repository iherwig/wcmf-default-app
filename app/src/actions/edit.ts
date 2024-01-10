import { Action } from '.'
import { Entity } from '~/stores/model/meta/types'
import { NavigationFailure } from 'vue-router'
import { Edit as EditIcon } from '@element-plus/icons-vue'
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

  public get url() {
    const url = router.resolve(this.getRouteParams())
    return url.href
  }

  async execute(): Promise<EditReturnType> {
    router.push(this.getRouteParams())
  }

  private getRouteParams() {
    if (!this.entity) {
      throw(new Error('Property entity is not initialized'))
    }
    const oid = this.entity.get('oid')
    const type = model.getSimpleTypeName(model.getTypeNameFromOid(oid))
    const id = model.getIdFromOid(oid);
    return { name: 'Entity', params: { type: type, id: id } }
  }
}