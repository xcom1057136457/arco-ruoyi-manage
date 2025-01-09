import router from '@/router'

export const useTagViewsStore = defineStore('tagViews', () => {
  const { cacheViews } = storeToRefs(useCacheViewsStore())

  const tagsList = ref([
    {
      path: '/dashboard',
      title: '数据舱',
      closeable: false,
    },
  ])

  const handlePageRemove = (name: any) => {
    // 获取当前标签页的数量
    const length = tagsList.value.length
    // 根据传入的标签页名来过滤标签页列表
    tagsList.value = tagsList.value.filter((item: any) => item.path !== name)
    // 根据已缓存的视图列表来过滤视图列表
    cacheViews.value = cacheViews.value.filter(
      (item: any) => item !== router.currentRoute.value.name,
    )
    // 如果当前路由的路径与删除的标签页名相同
    if (router.currentRoute.value.path === name) {
      // 切换到标签页列表中的倒数第二个标签页
      router.push({
        path: tagsList.value[length - 2].path,
      }).then()
    }
  }

  /**
   * 关闭当前标签页
   * @param redirect - 跳转路径（可选）
   */
  const handleCloseCurrent = (redirect?: any) => {
    const length = tagsList.value.length
    tagsList.value = tagsList.value.filter(
      (item: any) => item.path !== router.currentRoute.value.path,
    )
    cacheViews.value = cacheViews.value.filter(
      (item: any) => item !== router.currentRoute.value.name,
    )
    router.push({
      path: redirect || tagsList.value[length - 2].path,
    }).then()
  }

  /**
   * 关闭其他标签页/视图
   */
  const handleCloseOther = () => {
    // 过滤标签页数组，保留当前标签页和Dashboard标签页
    tagsList.value = tagsList.value.filter((item: any) => {
      return (
        item.path === '/dashboard'
        || item.path === router.currentRoute.value.path
      )
    })
    // 过滤缓存的视图数组，保留当前视图和Dashboard视图
    cacheViews.value = cacheViews.value.filter((item: any) => {
      return (
        item.path === '/dashboard'
        || item.path === router.currentRoute.value.path
      )
    })
  }

  /**
   * 关闭所有标签栏
   */
  const handleCloseAll = () => {
    tagsList.value = [
      {
        path: '/dashboard',
        title: '数据舱',
        closeable: false,
      },
    ]
    cacheViews.value = []
    router.push('/dashboard').then()
  }

  return {
    tagsList,
    handleCloseOther,
    handlePageRemove,
    handleCloseCurrent,
    handleCloseAll,
  }
})
