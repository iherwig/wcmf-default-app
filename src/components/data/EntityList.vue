<template>
  <div ref="root" v-if="type && store && columns">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 v-loading="isLoading"
          :columns="cols.value"
          :data="store.entities.value"
          :width="width"
          :height="height"
          :fixed="true"
        >
          <template #empty>
            <div class="flex items-center justify-center h-100%">
              <p>{{ $t('No data') }}</p>
            </div>
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
    <div class="flex items-center justify-end p-1">
      <small>{{ $t('{0} item(s)', [store.entities.value.length]) }}</small>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, h } from 'vue'
import { Column, ElLink } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useElementSize } from '@vueuse/core'
import { EntityClass, EntityAttribute, Entity } from '~/stores/model/meta/entity'
import { EntityStore } from '~/stores'
import { Action } from '~/actions'
import { VNode } from 'vue'

const props = defineProps<{
  type?: EntityClass
  columns?: Column<Entity>[]
  actions?: Action<unknown>[]
  store?: EntityStore
  enabledFeatures?: any[]
}>()

const { t } = useI18n()

const root = ref<HTMLElement|null>(null)
const isLoading = ref<boolean>(true)

// function for generating columns
const generateColumns = (type: EntityClass, width: number): Column<Entity>[] =>
  Array.from(type.attributes).map((a: EntityAttribute) => ({
    key: a.name,
    dataKey: a.name,
    title: t(a.name),
    width: width,
    sortable: true,
  })
)

// function for detecting fixed columns
const isFixed = ((c: Column<Entity>) => c.minWidth != undefined && c.minWidth > 0)

let initialWidth = 0
let reservedWidth = 0

const { width } = useElementSize(root)
watch(width, () => {
  // calculate initial relative widths for non-fixed columns
  if (initialWidth == 0 && width.value != 0) {
    initialWidth = width.value
    let numZeroWidthCols = 0
    let usedWidth = 0
    cols.value.forEach((c) => {
      if (isFixed(c)) {
        reservedWidth += c.minWidth!
        usedWidth += c.minWidth!
      }
      else if (c.width > 0) {
        c.relWidth = c.width/initialWidth
        usedWidth += c.width
      }
      else {
        numZeroWidthCols++
      }
    })
    const numZeroWidthColRelWidth = (initialWidth-usedWidth)/numZeroWidthCols/initialWidth
    cols.value.filter((c) => !isFixed(c) && c.width == 0).forEach((c) => {
      c.relWidth = numZeroWidthColRelWidth
    })
  }
  // resize columns proportionally
  for (let i=0, count=cols.value.length; i<count; i++) {
    const c = cols.value[i]
    const w = isFixed(c) ? c.minWidth! : c.relWidth*width.value
    cols.value[i].width = w
  }
})

const columns: Column<Entity>[] = (props.columns || (props.type ? generateColumns(props.type, 0) : []))

// add action column
if (props.actions && props.actions.length > 0) {
  columns.push({
    key: 'actions',
    dataKey: 'actions',
    title: '',
    width: props.actions.length*70,
    minWidth: props.actions.length*70,
    sortable: false,
    cellRenderer: ({rowData}) => {
      const buttons: VNode[] = []
      if (props.actions) {
        for (let i=0, count=props.actions.length; i<count; i++) {
          const action: Action<unknown> = props.actions[i]
          action.entity = Entity.fromObject(rowData)
          buttons.push(h(ElLink, {
            icon: action.icon,
            href: action.url,
            onClick: () => { action.execute() }
          }))
        }
      }
      return h('div',
        { class: 'flex flex-justify-center flex-items-center' },
        buttons
      )
    }
  })
}
const cols = reactive({ value: columns })

onMounted(async() => {
  if (props.store) {
    await props.store.fetch()
  }
  isLoading.value = false
})
</script>