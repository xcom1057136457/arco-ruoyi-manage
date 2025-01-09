import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetMini,
  presetTagify,
  presetTypography,
  presetUno,
  presetWind,
  transformerAttributifyJsx,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  theme: {
    colors: {
      'primary-6': 'rgba(var(--arcoblue-6))', // 常规
      'primary-5': 'rgba(var(--arcoblue-5))', // 悬浮（hover）
      'primary-7': 'rgba(var(--arcoblue-7))', // 点击（click）
      'primary-4': 'rgba(var(--arcoblue-4))', // 特殊场景
      'primary-3': 'rgba(var(--arcoblue-3))', // 一般禁用
      'primary-2': 'rgba(var(--arcoblue-2))', // 文字禁用
      'primary-1': 'rgba(var(--arcoblue-1))', // 浅色/白底悬浮

      // 边框颜色
      'border-color-1': 'var(--color-neutral-2)', // 浅色
      'border-color-2': 'var(--color-neutral-3)', // 一般
      'border-color-3': 'var(--color-neutral-4)', // 深/悬浮
      'border-color-4': 'var(--color-neutral-6)', // 重/按钮描边

      // 填充颜色
      'fill-color-1': 'var(--color-neutral-1)', // 浅/禁用
      'fill-color-2': 'var(--color-neutral-2)', // 常规/白底悬浮
      'fill-color-3': 'var(--color-neutral-3)', // 深/灰底悬浮
      'fill-color-4': 'var(--color-neutral-4)', // 重/特殊场景

      // 文字颜色
      'text-color-1': 'var(--color-neutral-10)', // 强调/正文标题
      'text-color-2': 'var(--color-neutral-8)', // 次强调/正文标题
      'text-color-3': 'var(--color-neutral-6)', // 次要信息
      'text-color-4': 'var(--color-neutral-4)', // 置灰信息

      // 背景颜色
      'bg-color-1': 'var(--color-bg-1)', // 整体背景色
      'bg-color-2': 'var(--color-bg-2)', // 一级容器背景
      'bg-color-3': 'var(--color-bg-3)', // 二级容器背景
      'bg-color-4': 'var(--color-bg-4)', // 三级容器背景
      'bg-color-5': 'var(--color-bg-5)', // 下拉弹出框、Tooltip 背景颜色
      'bg-color-white': 'var(--color-bg-white)', // 白色背景
    },
    boxShadow: {
      'special-shadow': '0 0 1px rgba(0, 0, 0, 0.3)', // 特殊阴影
      'special-shadow1': '0 -2px 5px rgba(0, 0, 0, 0.1)', // 阴影样式1
      'special-shadow2': '0 0 10px rgba(0, 0, 0, 0.1)', // 阴影样式2
      'special-shadow3': '0 0 20px rgba(0, 0, 0, 0.1)', // 阴影样式3
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetMini(),
    presetTagify(),
    presetTypography(),
    presetWind(),
    presetRemToPx(),
  ],
  transformers: [
    transformerAttributifyJsx(),
    transformerCompileClass(),
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
