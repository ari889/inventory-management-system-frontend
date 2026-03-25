import { handleResponse } from "@/utils/handle-response";
import RoleTable from "./_components/RoleTable";
import { checkPermission } from "@/actions/PermissionAction";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Roles | Inventory Management System",
  description: "Create and manage roles",
};

const RolesPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <RoleTable />;
};

export default RolesPage;
