/**
 * 工具函数示例
 */
export const foo = () => {
  return "bar";
};

export const formatMenus = (menus, parentId, roleId) =>
  menus
    .filter(item => item.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map(({ id, path, name, icon, sort, roles = [] }) => ({
      id,
      path,
      name,
      icon,
      sort,
      checked: roles.map(role => role.id).includes(roleId),
      children: formatMenus(menus, id, roleId),
    }));

export default {
  foo,
  formatMenus,
};
