<template>
  <div ref="root" v-if="type && columns">
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      :max-height="rowHeight*10"
      :on-scroll="handleScroll"
    >
      <template #empty>{{ $t('No data') }}</template>
    </n-data-table>
    <n-flex v-if="!loading" justify="end"><span>{{ $t('{0} item(s)', [totalCount]) }}</span></n-flex>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NDataTable, NButton, DataTableColumn, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { EntityType, EntityAttribute, Entity } from '~/model/meta/types'
import { Entity as DefaultEntity } from '~/model/Entity'
import { Action } from '~/actions'

const props = defineProps<{
  type: EntityType
  columns?: DataTableColumn<Entity>[]
  actions?: Action<unknown>[]
  enabledFeatures?: any[]
  data: Entity[]
  totalCount: number
  size?: number
}>()
const emit = defineEmits<{
  loadNext: []
}>()

const { t } = useI18n()

const rowHeight = ref<number>(55.2)
const loading = computed<boolean>(() => props.data.length == 0)

let debounceTimeout: number|null = null
const handleScroll = (e: Event) => {
  if (debounceTimeout) {
    return
  }
  debounceTimeout = window.setTimeout(() => {
    const target = e.target as HTMLElement
    if (target && target.scrollTop + target.clientHeight >= target.scrollHeight - 3*rowHeight.value) {
      if (!loading.value && props.data.length < props.totalCount) {
        emit('loadNext')
      }
    }
    debounceTimeout = null
  }, 200)
}

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