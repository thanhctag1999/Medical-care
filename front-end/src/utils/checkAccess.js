export function checkPermissionCreateAndDelete() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  return currentUser.role && currentUser.role.access === 'Full-Access';
}

export function checkPermissionEdit() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  return currentUser.role && (currentUser.role.access === 'Full-Access' || currentUser.role.access === 'Edit');
}
