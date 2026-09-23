// Dashboard pages. They require a login and render inside the admin shell.
// Every other page is public, so an unknown URL reaches the 404 page instead of the login screen.
export const ADMIN_PATHS = ['/dashboard', '/preview', '/compose', '/subscribers', '/schedule', '/history', '/settings']

export function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}
