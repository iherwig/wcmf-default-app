<template>
  <div ref="root" v-if="type && columns">
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="data?.length == 0"
    >
      <template #empty>
        <div class="flex items-center justify-center h-100%">
          <p>{{ $t('No data') }}</p>
        </div>
      </template>
    </n-data-table>
    <div class="flex items-center justify-end p-1">
      <small>{{ $t('{0} item(s)', [(data ?? []).length]) }}</small>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { NDataTable, NButton, DataTableColumn } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { EntityType, EntityAttribute, Entity } from '~/stores/model/meta/types'
import { Entity as DefaultEntity } from '~/stores/model/Entity'
import { Action } from '~/actions'

const props = defineProps<{
  type?: EntityType
  columns?: DataTableColumn<Entity>[]
  actions?: Action<unknown>[]
  enabledFeatures?: any[]
  data?: Entity[]
  size?: number
}>()

const { t } = useI18n()

const columns = computed<DataTableColumn<Entity>[]>(() => {
  let result: DataTableColumn<Entity>[] = []
  if (props.columns) {
    result = props.columns
  }
  else if (props.type) {
    result = Array.from(props?.type?.attributes).filter((a) => !a.tags.includes('DATATYPE_IGNORE')).map((a: EntityAttribute) => ({
      key: a.name,
      title: t(a.name),
      sorter: 'default',
      resizable: true,
      ellipsis: {
        tooltip: true
      }
    }) as DataTableColumn<Entity>)
  }
  // add action column
  if (props.actions && props.actions.length > 0) {
    result.push({
      key: 'actions',
      title: '',
      width: props.actions.length*70,
      fixed: 'right',
      render(row) {
        return props.actions?.map((action) => {
          action.entity = DefaultEntity.fromObject(row)
          return h(
            NButton,
            {
              //href: action.url,
              size: 'small',
              circle: true,
              style: 'font-size: 24px',
              onClick: () => { action.execute() }
            },
            {
              //default: () => t(action.name),
              icon: () => h(action.icon)
            }
          )
        })
      }
    } as DataTableColumn<Entity>)
  }
  return result
})
</script>