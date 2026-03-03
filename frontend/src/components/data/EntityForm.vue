<template>
  <n-form
    ref="entityForm"
    :model="formModel"
    size="medium"
    label-placement="top"
  >
    <n-flex>
      <template v-for="[name, attributes] of Object.entries(attributeGroups)">
        <n-card>
          <n-flex justify="space-between" :size="[12, 6]">
            <template v-for="attribute of attributes.filter(a => !a.tags.includes('DATATYPE_IGNORE'))">
              <n-form-item :path="attribute.name" style="flex-basis: calc(50% - 6px);">
                <n-input v-model:value="entity[attribute.name]" :disabled="!attribute.isEditable" />
                <template #label>
                  {{ t(attribute.name) }}
                  <n-tooltip placement="top-start" trigger="click" v-if="attribute.description">
                    <template #trigger>
                      <n-icon><HelpIcon /></n-icon>
                    </template>
                    {{ t(attribute.description) }}
                  </n-tooltip>
                </template>
              </n-form-item>
            </template>
          </n-flex>
          <template #header>
            <small>{{ t(name != 'default' ? t(name) : '') }}</small>
          </template>
        </n-card>
      </template>
    </n-flex>
  </n-form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NForm, NFlex, NCard, NFormItem, NInput, NTooltip, NIcon, FormRules, FormItemRule, FormInst } from 'naive-ui'
import { QuestionCircle16Regular as HelpIcon } from '@vicons/fluent'
import { Entity, EntityAttribute, EntityType } from '~/model/meta/types'
import { useModel } from '~/composables/model';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  entity: Entity
}>()

const { t } = useI18n()
const model = useModel()

const typeClass = computed<EntityType>(() => model.getTypeFromOid(props.entity.oid))
const attributeGroups = computed<Record<string, EntityAttribute[]>>(() => {
  let groups: Record<string, EntityAttribute[]> = {}
  for (const attribute of typeClass.value.attributes) {
    const groupNames = attribute.tags.filter((a) => a.startsWith('GROUP_'))
    const group = (groupNames.length > 0 ? groupNames[0].replace(/^GROUP_/, '') : 'default')
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(attribute)
  }
  return groups
})

const formRef = ref<FormInst|null>(null)
const formModel = ref<Entity>({...props.entity})
</script>