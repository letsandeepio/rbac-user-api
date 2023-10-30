export const ALL_PERMISSIONS = [
  "users:roles:write", // allowed to add a role to a user
  "users:roles:delete", //allowed to remove a role from a user
  "orders:write",
  "orders:read",
  "orders:delete",
  "orders:edit",
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;
  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS["orders:read"],
  PERMISSIONS["orders:write"],
];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION_USER: "APPLICATION_USER",
};
