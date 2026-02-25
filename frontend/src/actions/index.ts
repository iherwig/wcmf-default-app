import { Component } from 'vue'
import { Entity } from '~/model/meta/types'

export * from './edit'

export interface Action<T> {
  /**
   * Name of the action
   */
  name: string

  /**
   * Icon representing the action
   */
  icon: Component

  /**
   * Url that executes the action if applicaple (e.g. edit action)
   */
  getUrl(entity: Entity): string|null

  /**
   * Execute the action.
   */
  execute(entity: Entity): Promise<T>
}