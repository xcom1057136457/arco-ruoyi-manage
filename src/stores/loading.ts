export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)

  const loadingText = ref('')

  const startLoading = (text = '加载中...') => {
    loadingText.value = text
    loading.value = true
  }

  const endLoading = () => {
    loading.value = false
  }

  return {
    loading,
    loadingText,
    startLoading,
    endLoading,
  }
})
