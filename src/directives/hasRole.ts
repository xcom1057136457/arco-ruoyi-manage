import { isArray } from 'lodash-es'

export default {
  mounted(el: any, binding: any) {
    const { value } = binding
    const super_admin: string = 'admin'
    const roles: string[] = useUserStore().roles

    if (value && isArray(value) && value.length > 0) {
      const roleFlag: any[] = value

      const hasRole: boolean = roles.some((role: string) => {
        return super_admin === role || roleFlag.includes(role)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
    else {
      throw new Error(`请设置角色权限标签值`)
    }
  },
}
