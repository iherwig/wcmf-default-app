<template>
  <div>
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
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
import { useI18n } from 'vue-i18n';
import { EntityClass, EntityAttribute, Entity } from '~/stores/model/meta/entity'

const props = defineProps<{
  type: EntityClass
  entities: Entity[]
  actions: CallableFunction[]
  enabledFeatures: any[]
}>();

const { t } = useI18n()

const generateColumns = (type: EntityClass) =>
  Array.from(type.attributes).map((a: EntityAttribute, columnIndex) => ({
    key: `column-${columnIndex}`,
    dataKey: `column-${columnIndex}`,
    title: t(a.name),
    width: `${100/(type.attributes.length)}%`,
  })
)

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData: any, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const columns = generateColumns(props.type)
const data = props.entities
</script>