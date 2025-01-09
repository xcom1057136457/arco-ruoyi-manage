<!-- 由 Dioa 创建于 2024-05-31 星期五 -->
<script setup lang="ts">
import icons from './requireIcons'

defineOptions({
  name: 'IconSelect',
})

const searchKey = ref('')

const selectValue = defineModel()

const iconList = ref(icons)

function filterIcons() {
  iconList.value = icons
  if (searchKey.value) {
    iconList.value = icons.filter((item: any) =>
      item.includes(searchKey.value),
    )
  }
}
</script>

<template>
  <div p-3>
    <a-input
      v-model="searchKey"
      allow-clear
      placeholder="请输入图标名..."
      size="small"
      @input="filterIcons"
      @clear="filterIcons"
    >
      <template #prefix>
        <icon-search />
      </template>
    </a-input>
  </div>

  <a-scrollbar :style="{ height: '300px', overflow: 'auto' }">
    <div grid="~ cols-10" gap-3 p="x-3 b-3">
      <template v-for="item in iconList" :key="item">
        <a-tooltip :content="item">
          <div
            border="~ solid border-color-2"
            h-6
            flex
            cursor-pointer
            items-center
            justify-center
            hover="text-primary-6 border-primary-6"
            :class="{
              'border border-solid border-primary-6 text-primary-6':
                selectValue === item,
            }"
            @click="selectValue = item"
          >
            <svg-icon :icon-class="item" outline-none />
          </div>
        </a-tooltip>
      </template>
    </div>
  </a-scrollbar>
</template>

<style scoped lang="scss"></style>
