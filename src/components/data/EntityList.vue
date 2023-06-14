<template>
  <div ref="root">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, toValue } from 'vue'
import { Column } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useElementSize } from '@vueuse/core'
import { EntityClass, EntityAttribute, Entity } from '~/stores/model/meta/entity'
import { Store } from '~/stores'

const props = defineProps<{
  type: EntityClass
  store: Store
  columns?: Column<Entity>[]
  actions: CallableFunction[]
  enabledFeatures: any[]
}>()

const { t } = useI18n()

const root = ref<HTMLElement|null>(null)
const isLoading = ref<boolean>(false)
const initialWidth = ref<number>(0)

const { width } = useElementSize(root)
watch(width, () => {
  if (initialWidth.value == 0 && width.value != 0) {
    initialWidth.value = width.value
  }
  // resize columns propotionally
  let usedWidth = 0
  for (let i=0, count=cols.value.length; i<count; i++) {
    const remainingCols = count-i
    const w = cols.value[i].initialWidth !== 0 ? cols.value[i].initialWidth/initialWidth.value*width.value : (width.value-usedWidth)/remainingCols
    cols.value[i].width = w
    usedWidth += w
  }
})

const generateColumns = (type: EntityClass, width: number): Column<Entity>[] =>
  Array.from(type.attributes).map((a: EntityAttribute) => ({
    dataKey: a.name,
    title: t(a.name),
    width: width,
    sortable: true,
  })
)
const cols = reactive({
  value: (props.columns?.map((c) => { return {...c, initialWidth: c.width} }) || generateColumns(props.type, 0))
})

onMounted(async() => {
  isLoading.value = true
  await props.store.fetch()
  isLoading.value = false
})
</script>