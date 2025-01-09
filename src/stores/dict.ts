export const useDictStore = defineStore('dict', () => {
  const dict = ref<any[]>([])

  const getDict = (_key: string) => {
    // 如果键值为null或为空字符串，则返回null
    if (_key === null || _key === '') {
      return null
    }
    try {
      // 循环遍历字典数组
      for (let i = 0; i < dict.value.length; i++) {
        // 如果当前字典对象的键值与指定的键值相等，则返回对应的值
        if (dict.value[i].key === _key) {
          return dict.value[i].value
        }
      }
    }
    catch (e) {
      // 异常情况下返回null
      return null
    }
  }

  const setDict = (_key: any, value: any) => {
    if (_key !== null && _key !== '') {
      dict.value.push({
        key: _key,
        value,
      })
    }
  }

  const removeDict = (_key: any) => {
    let bln = false
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key === _key) {
          dict.value.splice(i, 1)
          return true
        }
      }
    }
    catch (e) {
      bln = false
    }
    return bln
  }

  const cleanDict = () => {
    dict.value = []
  }

  return {
    dict,
    getDict,
    setDict,
    removeDict,
    cleanDict,
  }
})
