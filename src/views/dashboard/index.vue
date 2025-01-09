<!-- 由 Dioa 创建于 2024-05-27 星期一 -->
<script setup lang="ts">
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import {
  chart1Option,
  chart2Option,
  chart3Option,
  chart4Option,
  normList,
  tableColumns,
  tableData,
  technologyList,
  todolist,
} from './constance'

defineOptions({
  name: 'Dashboard',
})

const checkList = ref([])

const chart1 = shallowRef<ECharts>()

async function initChart1() {
  const chartDom: any = document.getElementById('dashboard-chart-1')
  if (!chart1.value) {
    chart1.value = echarts.init(chartDom)
  }
  chart1Option && chart1.value.setOption(chart1Option)
  return Promise.resolve()
}

const chart2 = shallowRef<ECharts>()

async function initChart2() {
  const chartDom: any = document.getElementById('dashboard-chart-2')
  if (!chart2.value) {
    chart2.value = echarts.init(chartDom)
  }
  chart2Option && chart2.value.setOption(chart2Option)
  return Promise.resolve()
}

const chart3 = shallowRef<ECharts>()

async function initChart3() {
  const chartDom: any = document.getElementById('dashboard-chart-3')
  if (!chart3.value) {
    chart3.value = echarts.init(chartDom)
  }
  chart3Option && chart3.value.setOption(chart3Option)
  return Promise.resolve()
}

const chart4 = shallowRef<ECharts>()

async function initChart4() {
  const chartDom: any = document.getElementById('dashboard-chart-4')
  if (!chart4.value) {
    chart4.value = echarts.init(chartDom)
  }
  chart4Option && chart4.value.setOption(chart4Option)
  return Promise.resolve()
}

const DashBoardRef = ref(null)

useResizeObserver(DashBoardRef, () => {
  chart1.value?.resize()
  chart2.value?.resize()
  chart3.value?.resize()
  chart4.value?.resize()
})

function loadData() {
  Promise.all([initChart1(), initChart2(), initChart3(), initChart4()])
}

onMounted(() => {
  setTimeout(() => {
    loadData()
  })
})
</script>

<template>
  <div ref="DashBoardRef" space-y-3>
    <div grid="~ cols-4" gap-x-3>
      <div
        v-for="item in normList"
        :key="item.id"
        flex
        justify-between
        rounded-lg
        bg-bg-color-2
        p="x-6 y-4"
      >
        <div :class="item.icon" text-6xl :style="{ color: item.color }" />

        <div flex="~ col" justify-center space-y-4px>
          <div text="base text-color-1" font-semibold>
            {{ item.label }}
          </div>

          <div text="xl text-color-2" font-bold>
            {{ Number(item.count).toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <div box-border h-366px bg-bg-color-2 p-4>
      <div id="dashboard-chart-1" h-full />
    </div>

    <div grid="~ cols-3" gap-x-3>
      <div h-316px bg-bg-color-2 p-4>
        <div id="dashboard-chart-2" h-full w-full />
      </div>

      <div h-316px bg-bg-color-2 p-4>
        <div id="dashboard-chart-3" h-full w-full />
      </div>

      <div h-316px bg-bg-color-2 p-4>
        <div id="dashboard-chart-4" h-full w-full />
      </div>
    </div>

    <div grid="~ cols-4" gap-x-3>
      <div col-span-2 box-border h-full bg-bg-color-2 p-3>
        <a-table
          :data="tableData"
          :columns="tableColumns"
          :pagination="false"
          :bordered="false"
          stripe
        >
          <template #price="{ record }">
            {{ `$ ${Number(record.price).toLocaleString()}` }}
          </template>

          <template #status="{ record }">
            <a-tag :color="record.status === 0 ? 'green' : 'orangered'">
              {{ record.status === 0 ? "Success" : "Pending" }}
            </a-tag>
          </template>
        </a-table>
      </div>

      <div bg-bg-color-2>
        <div
          border="0 b solid border-color-1"
          p="y-2 x-3"
          text="base text-color-2"
          font-bold
        >
          Todo List
        </div>

        <div px-3>
          <a-checkbox-group v-model="checkList" w-full>
            <div
              v-for="item in todolist"
              :key="item.id"
              border="0 b solid border-color-1"
              py-3
            >
              <a-checkbox
                :value="item.id"
                text="sm text-color-2"
                font-500
                capitalize
              >
                {{ item.label }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>

      <div overflow-hidden bg-bg-color-2>
        <div h-243px w-full overflow-hidden>
          <img
            class="hover:scale-110"
            block
            h-full
            w-full
            cursor-pointer
            transition-all
            src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png"
            alt=""
          >
        </div>

        <div relative p="x-10px t-50px b-30px">
          <div
            absolute
            left-10px
            h-70px
            w-70px
            flex
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-bg-color-2
            top="-35px"
          >
            <img
              h-60px
              w-60px
              rounded-full
              src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
              alt=""
            >
          </div>

          <div space-y-4>
            <div v-for="item in technologyList" :key="item.id">
              <label text-text-color-2>{{ item.label }}</label>
              <a-progress :percent="item.progress / 100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
