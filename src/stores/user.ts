import {
  getUserInfo as getUserInfoApi,
  login as loginApi,
  logout as logoutApi,
} from '@/api/login'

export const useUserStore = defineStore('user', () => {
  const { getToken, setToken, removeToken } = useAuth()

  const token = ref(getToken())

  const userInfo = ref<{
    avatar?: string
    city?: string
    gender?: number | string
    sex?: any
    userId?: string
    userName?: string
    roles?: string[]
    nickName?: string
    phonenumber?: string
  }>({})

  const roles = ref<string[]>([])

  const permissions = ref<string[]>([])

  const isWeakPassword = ref<any>(0)

  const login = async (loginParams: any) => {
    const username = loginParams.username.trim()
    const password = loginParams.password.trim()
    try {
      const {
        code,
        token: tokenData,
        isWeakPassword: isWeakPasswordData,
      }: any = await loginApi({
        username,
        password,
        code: loginParams.code,
        uuid: loginParams.uuid,
      })
      if (code === 200) {
        setToken(tokenData)
        token.value = tokenData
        isWeakPassword.value = isWeakPasswordData
        return Promise.resolve()
      }
      else {
        return Promise.reject(new Error('error'))
      }
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  const logout = async () => {
    try {
      const { code }: any = await logoutApi()
      if (code === 200) {
        token.value = ''
        roles.value = []
        permissions.value = []
        userInfo.value = {}
        removeToken()
        return Promise.resolve()
      }
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  const getUserInfo = async () => {
    try {
      const {
        code,
        roles: rolesData,
        user: userData,
        permissions: permissionsData,
      }: any = await getUserInfoApi()
      if (code === 200) {
        userInfo.value = userData
        if (rolesData && rolesData.length) {
          roles.value = rolesData
          permissions.value = permissionsData
        }
        else {
          roles.value = ['ROLE_DEFAULT']
        }
        return Promise.resolve(userInfo.value)
      }
      else {
        return Promise.reject(new Error('error'))
      }
    }
    catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    token,
    userInfo,
    roles,
    permissions,
    isWeakPassword,
    login,
    logout,
    getUserInfo,
  }
})
