import { handleResponse } from "@/utils/handle-response";
import PermissionTable from "./_components/PermissionTable";
import { checkPermission } from "@/actions/PermissionAction";
import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Permissions | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Manage your account settings",
  };
};

const PermissionPage = async () => {
  handleResponse(await checkPermission("permission-access"));
  return <PermissionTable />;
};

export default PermissionPage;
