import { handleResponse } from "@/utils/handle-response";
import PermissionTable from "./_components/PermissionTable";
import { checkPermission } from "@/actions/PermissionAction";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Permissions | Inventory Management System",
  description: "Create and manage permissions",
};

const PermissionPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <PermissionTable />;
};

export default PermissionPage;
