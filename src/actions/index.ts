import { Component } from 'vue'
import { Entity } from '~/stores/model/meta/entity'

export * from './edit'

export interface Action<T> {
  /**
   * Name of the action
   */
  name: string

  /**
   * Icon representing the action
   */
  icon?: Component

  /**
   * Entity associated with the action (set dynamically when action is used in tables)
   */
  entity?: Entity

  /**
   * Url that executes the action if applicaple (e.g. edit action)
   */
  url?: string

  /**
   * Execute the action.
   */
  execute(): Promise<T>
}