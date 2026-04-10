import { handleResponse } from "@/utils/handle-response";
import UserTable from "./_components/UserTable";
import { checkPermission } from "@/actions/PermissionAction";
import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Users | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Manage your users and their permissions",
  };
};

const UsersPage = async () => {
  handleResponse(await checkPermission("user-access"));
  return <UserTable />;
};

export default UsersPage;
