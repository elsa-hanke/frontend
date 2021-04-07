export const clamp = (num: number, clamp: number, higher: number) =>
  higher ? Math.min(Math.max(num, clamp), higher) : Math.min(num, clamp)

export function checkCurrentRouteAndRedirect(router: any, path: any) {
  const {
    currentRoute: { path: curPath }
  } = router
  if (curPath !== path) router.push({ path })
}
