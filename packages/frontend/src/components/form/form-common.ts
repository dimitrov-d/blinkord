import { RoleData, ServerFormProps } from "@/lib/types";

export const handleInputChange = (
  field: keyof ServerFormProps["formData"],
  value: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  setFormData((prev: any) => ({ ...prev, [field]: value }));
};

export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<any>>,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setRoleErrors: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
) => {
  const role = roleData.roles.find((role: any) => role.id === roleId);

  if (!role) return;

  if (roleData.blinkordRolePosition < (role.position || 0)) {
    console.log(role.position, roleData.blinkordRolePosition);
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  const updatedRoles = roleData.roles.map((r: any) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((r: any) => r.enabled)
    .map((r: any) => ({
      id: r.id,
      name: r.name,
      amount: r.price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<any>>,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  const updatedRoles = roleData.roles.map((role: any) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role: any) => role.enabled)
    .map((role: any) => ({
      id: role.id,
      name: role.name,
      amount: price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};
