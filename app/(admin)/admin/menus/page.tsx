export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import MenuTable from "./_components/MenuTable";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Menus | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage menus",
  };
};

const MenusPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <MenuTable />;
};

export default MenusPage;
