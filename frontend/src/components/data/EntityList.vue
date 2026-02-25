<template>
  <div ref="table" v-if="type && columns">
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="loading"
      :max-height="rowHeight * 10"
      :row-key="rowKey"
      :row-props="rowProps"
      :on-scroll="handleScroll"
      :on-update:sorter="handleSort"
    >
      <template #empty>{{ $t('No data') }}</template>
    </n-data-table>
    <n-flex v-if="!loading" justify="end"><span>{{ $t('{0} item(s)', [totalCount]) }}</span></n-flex>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, onMounted, ref, watch } from 'vue'
import { NDataTable, NButton, DataTableColumn, NFlex, DataTableSortState, NInput, NIcon, DataTableInst } from 'naive-ui'
import { Filter16Regular as FilterIcon } from '@vicons/fluent'
import { useI18n } from 'vue-i18n'
import { EntityType, EntityAttribute, Entity } from '~/model/meta/types'
import { Action } from '~/actions'
import { useTableStateStore } from '~/stores/tableState'
import { useDebounceFn } from '@vueuse/core'

const ROW_HEIGHT = 55.2

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

const dataTable = ref<DataTableInst|null>(null)

const { t } = useI18n()
const { setSort, getSort, getSortValue, setFilterValue, getFilterValue } = useTableStateStore()

const rowHeight = ref<number>(ROW_HEIGHT)
const loadingNext = ref<boolean>(false)
const loading = computed<boolean>(() => props.data.length == 0 || loadingNext.value)

const rowKey = (row: Entity) => {
  return row.oid
}

const rowProps = (row: Entity) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      console.log('clicked', row.oid)
    }
  }
}

const handleScroll = useDebounceFn((e: Event) => {
  const target = e.target as HTMLElement
  if (target && target.scrollTop + target.clientHeight >= target.scrollHeight - 10 * rowHeight.value) {
    if (!loading.value && props.data.length < props.totalCount) {
      loadingNext.value = true
      emit('loadNext')
    }
  }
}, 200)

const handleSort = (options: DataTableSortState|null) => {
  if (options) {
    setSort(props.type.typeName, { attribute: options.columnKey as string, order: options.order })
  }
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
      resizable: true,
      sorter: true,
      sortOrder: getSortValue(props.type.typeName, a.name),
      filter: true,
      renderFilterIcon: () => h(NIcon,  {
        class: 'n-base-icon',
        color: `var(--n-th-icon-color${getFilterValue(props.type.typeName, a.name)?.length > 0 ? '-active' : ''})`
      }, {
        default: () => h(FilterIcon)
      }),
      renderFilterMenu: ({ hide }) => h(NInput, {
        value: getFilterValue(props.type.typeName, a.name),
        onUpdateValue: (v: string) => {
          setFilterValue(props.type.typeName, a.name, v)
        },
        placeholder: t('Filter {0}', [t(a.name)]),
        onBlur: hide,
        clearable: true
      }),
      ellipsis: {
        tooltip: true
      }
    }) as DataTableColumn<Entity>)
  }
  // add selection column
  result.unshift({
    type: 'selection'
  })
  // add action column
  if (props.actions && props.actions.length > 0) {
    result.push({
      key: 'actions',
      title: '',
      width: props.actions.length * 70,
      fixed: 'right',
      render(row) {
        return props.actions?.map((action) => {
          const btn = h(NButton, {
            size: 'small',
            circle: true,
            tag: 'a',
            href: action.getUrl(row),
            onClick: (e) => {
              e.preventDefault()
              action.execute(row)
            }
          }, {
            icon: () => h(action.icon)
          })
          return btn
        })
      }
    } as DataTableColumn<Entity>)
  }
  return result
})

watch(() => props.data, (oldData, newData) => {
  if (loadingNext.value) {
    loadingNext.value = false
  }
})

onMounted(() => {
  const sortState = getSort(props.type.typeName)
  if (sortState) {
    dataTable.value?.sort(sortState.attribute, sortState.order)
  }
})
</script>