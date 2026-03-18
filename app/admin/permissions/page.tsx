import PermissionTable from "./_components/PermissionTable";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Permissions | Inventory Management System",
  description: "Create and manage permissions",
};

const PermissionPage = () => {
  return <PermissionTable />;
};

export default PermissionPage;
