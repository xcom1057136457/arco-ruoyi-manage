import Cookies from 'js-cookie'

const TOKEN_KEY: string = 'arco-design-key'

export function useAuth() {
  const getToken = () => {
    return Cookies.get(TOKEN_KEY)
  }

  const setToken = (token: string) => {
    Cookies.set(TOKEN_KEY, token)
  }

  const removeToken = () => {
    Cookies.remove(TOKEN_KEY)
  }

  return {
    getToken,
    setToken,
    removeToken,
  }
}
