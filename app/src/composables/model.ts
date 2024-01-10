import types from '~/app/model/types'
import { Model } from '~/stores/model/meta/Model'

const model = new Model()

// register entity types
types.forEach((type) => {
  model.registerType(type)
})

export function useModel() {
  return model
}