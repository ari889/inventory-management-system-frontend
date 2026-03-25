export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import MenuTable from "./_components/MenuTable";
import { checkPermission } from "@/actions/PermissionAction";

export const metadata = {
  title: "Menus | Inventory Management System",
  description: "Create and manage menus",
};

const MenusPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <MenuTable />;
};

export default MenusPage;
