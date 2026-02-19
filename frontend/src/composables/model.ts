import types from '~/app/types'
import { Model } from '~/model/meta/Model'

const model = new Model()

// register entity types
types.forEach((type) => {
  model.registerType(type)
})

export function useModel() {
  return model
}