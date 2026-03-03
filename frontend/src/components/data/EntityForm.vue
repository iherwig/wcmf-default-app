<template>
  <n-form
    ref="entityForm"
    :model="formModel"
    size="medium"
    label-placement="top"
  >
    <n-flex>
      <template v-for="[section, groups] of Object.entries(attributeSections)">
        <n-collapse display-directive="show">
          <conditional-collapse-item :visible="section != 'default'">
            <n-flex>
              <template v-for="[group, attributes] of Object.entries(groups)">
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
                    <small>{{ t(group != 'default' ? t(group) : '') }}</small>
                  </template>
                </n-card>
              </template>
            </n-flex>
            <template #header>
              <p>{{ t(section != 'default' ? t(section) : '') }}</p>
            </template>
          </conditional-collapse-item>
        </n-collapse>
      </template>
    </n-flex>
  </n-form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NForm, NFlex, NCollapse, NCard, NFormItem, NInput, NTooltip, NIcon, FormRules, FormItemRule, FormInst } from 'naive-ui'
import { QuestionCircle16Regular as HelpIcon } from '@vicons/fluent'
import { Entity, EntityAttribute, EntityType } from '~/model/meta/types'
import { useModel } from '~/composables/model'
import { useI18n } from 'vue-i18n'
import ConditionalCollapseItem from '~/components/ConditionalCollapseItem.vue'

const props = defineProps<{
  entity: Entity
}>()

const { t } = useI18n()
const model = useModel()

const typeClass = computed<EntityType>(() => model.getTypeFromOid(props.entity.oid))

/**
 * Type's attributes grouped together by SECTION_ and GROUP_ tags. A section contains one or more groups.
 * Attributes without SECTION_ tag are listed in a section named 'default'.
 * Attributes without GROUP_ tag are listed in a group named 'default'.
 */
const attributeSections = computed<Record<string, Record<string, EntityAttribute[]>>>(() => {
  let sections: Record<string, Record<string, EntityAttribute[]>> = {}
  for (const attribute of typeClass.value.attributes) {
    const sectionTags = attribute.tags.filter((a) => a.startsWith('SECTION_'))
    const groupTags = attribute.tags.filter((a) => a.startsWith('GROUP_'))
    const sectionName = (sectionTags.length > 0 ? sectionTags[0].replace(/^SECTION_/, '') : 'default')
    const groupName = (groupTags.length > 0 ? groupTags[0].replace(/^GROUP_/, '') : 'default')
    if (!sections[sectionName]) {
      sections[sectionName] = {}
    }
    if (!sections[sectionName][groupName]) {
        sections[sectionName][groupName] = []
    }
    sections[sectionName][groupName].push(attribute)
  }
  return sections
})

const formRef = ref<FormInst|null>(null)
const formModel = ref<Entity>({...props.entity})
</script>