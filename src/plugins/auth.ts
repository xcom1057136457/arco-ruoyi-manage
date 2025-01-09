function authPermission(permission: any) {
  const all_permission: any = '*:*:*'
  const permissions = useUserStore().permissions
  if (permission && permission.length > 0) {
    return permissions.some((v: any) => {
      return all_permission === v || v === permission
    })
  }
  return false
}

function authRole(role: any): boolean {
  const super_admin: any = 'admin'
  const roles: string[] = useUserStore().roles
  if (role && role.length > 0) {
    return roles.some((v: any) => {
      return super_admin === v || v === role
    })
  }
  return false
}

export default {
  /**
   * 判断用户是否具有指定的权限
   * @param permission 传入待判断的权限
   * @returns 如果用户具有指定的权限则返回true，否则返回false
   */
  hasPermi(permission: any) {
    return authPermission(permission)
  },

  /**
   * 判断用户是否具有某种权限（或某几种权限）之一
   * @param permissions 需要判断的权限列表
   * @returns 如果用户具有某种权限（或某几种权限）之一，则返回true；否则返回false
   */
  hasPermiOr(permissions: any) {
    if (!permissions) {
      return false
    }
    return permissions.some((item: any) => {
      return authPermission(item)
    })
  },

  /**
   * 判断给定的权限数组中是否全部都存在且被授权
   * @param permissions 权限数组
   * @returns 如果所有权限都存在且被授权，则返回true；否则返回false
   */
  hasPermiAnd(permissions: any) {
    if (!permissions || permissions.length === 0) {
      return false
    }
    return permissions.every((item: any) => {
      return authPermission(item)
    })
  },

  /**
   * 判断用户是否具有指定角色
   * @param role 角色
   * @returns 如果用户具有指定角色，返回true；否则返回false
   */
  hasRole(role: any): boolean {
    return authRole(role)
  },

  /**
   * 判断用户是否拥有指定角色之一
   * @param roles - 角色列表
   * @returns 如果用户拥有指定角色之一，则返回true；否则返回false
   */
  hasRoleOr(roles: any) {
    if (!roles) {
      return false
    }
    return roles.some((item: any) => {
      return authRole(item)
    })
  },

  /**
   * 判断用户是否拥有多个角色
   * @param roles - 角色列表
   * @returns 如果用户拥有所有角色，返回true；否则返回false
   */
  hasRoleAnd(roles: any) {
    if (!roles || roles.length === 0) {
      return false
    }
    return roles.every((item: any) => {
      return authRole(item)
    })
  },
}
