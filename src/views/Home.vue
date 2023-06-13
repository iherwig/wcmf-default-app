<template>
  <el-space :fill="true" wrap>
    <h1>{{ $t('Welcome') }}</h1>
    <EntityList
      style="height: 70vh; width: 90vw"
      :type="historyEntity"
      :entities="entities"
      :actions="[]"
      :enabledFeatures="[]"
    />
  </el-space>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { Store, useHistoryStore } from '~/stores'
import { HistoryItem } from '~/stores/model/history'

const historyEntity = new HistoryItem()
const store = useHistoryStore()
const { entities } = storeToRefs(store)
const { fetch } = store
fetch()
</script>

<style scoped>
h1 {
  font-size: 63px;
}
</style>