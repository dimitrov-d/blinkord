import { RoleData, ServerFormProps } from "@/lib/types";
import { fetchRoles } from "@/lib/actions/discord.actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

export const handleInputChange = (
  field: keyof ServerFormProps["formData"],
  value: any,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  setFormData((prev: any) => {
    const updatedFormData = { ...prev, [field]: value };

    if (field === "limitedTimeRoles") {
      const limitedTimeValues = value
        ? { limitedTimeQuantity: "1", limitedTimeUnit: "Months" }
        : { limitedTimeQuantity: null, limitedTimeUnit: null };

      updatedFormData.roles = updatedFormData.roles.map((role: any) => ({
        ...role,
        ...limitedTimeValues,
      }));
    }

    return updatedFormData;
  });
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

  if (roleData.blinkordRolePosition <= (role.position || 0)) {
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
      limitedTimeQuantity: r.limitedTimeQuantity,
      limitedTimeUnit: r.limitedTimeUnit,
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
      limitedTimeQuantity: role.limitedTimeQuantity,
      limitedTimeUnit: role.limitedTimeUnit,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

export const handleLimitedTimeChange = (
  roleId: string,
  field: "limitedTimeQuantity" | "limitedTimeUnit",
  value: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<any>>,
  setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
  const updatedRoles = roleData.roles.map((role: any) =>
    role.id === roleId ? { ...role, [field]: value } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role: any) => role.enabled)
    .map((role: any) => ({
      id: role.id,
      name: role.name,
      amount: role.price,
      limitedTimeQuantity: role.limitedTimeQuantity,
      limitedTimeUnit: role.limitedTimeUnit,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<any>>,
  setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>
) => {
  setIsRefreshingRoles(true);
  try {
    const allRoles = await fetchRoles(formDataId);
    const mergedRoles = allRoles.roles.map((role: any) => {
      const selectedRole = roleData.roles.find((r: any) => r.id === role.id);
      return selectedRole
        ? {
            ...role,
            price: selectedRole.price,
            enabled: selectedRole.enabled,
            limitedTimeQuantity: selectedRole.limitedTimeQuantity,
            limitedTimeUnit: selectedRole.limitedTimeUnit,
          }
        : role;
    });
    setRoleData({ ...allRoles, roles: mergedRoles });
    setRoleErrors({});
    toast.success("Roles refreshed successfully");
  } catch (error) {
    console.error("Error refreshing roles", error);
    toast.error("Failed to refresh roles");
  } finally {
    setIsRefreshingRoles(false);
  }
};
