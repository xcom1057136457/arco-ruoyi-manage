import { getDicts } from '@/api/system/dict/data'

/**
 * 使用字典数据
 * @returns 字典数据的响应式对象
 */
export function useDict(...args: any) {
  const res = ref<any>({})

  return (() => {
    args.forEach((dictType: any) => {
      res.value[dictType] = []

      // 获取字典数据
      const dicts = useDictStore().getDict(dictType)
      if (dicts) {
        res.value[dictType] = dicts
      }
      else {
        // 获取字典数据并设置到响应式对象中
        getDicts(dictType).then((resp) => {
          res.value[dictType] = resp.data.map((p: any) => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass,
          }))
          useDictStore().setDict(dictType, res.value[dictType])
        })
      }
    })

    return toRefs(res.value)
  })()
}
