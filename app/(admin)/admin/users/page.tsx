import { handleResponse } from "@/utils/handle-response";
import UserTable from "./_components/UserTable";
import { checkPermission } from "@/actions/PermissionAction";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Users | Inventory Management System",
  description: "Create and manage users",
};

const UsersPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <UserTable />;
};

export default UsersPage;
