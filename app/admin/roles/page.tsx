import RoleTable from "./_components/RoleTable";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Roles | Inventory Management System",
  description: "Create and manage roles",
};

const RolesPage = () => {
  return <RoleTable />;
};

export default RolesPage;
