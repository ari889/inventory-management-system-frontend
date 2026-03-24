import UserTable from "./_components/UserTable";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Users | Inventory Management System",
  description: "Create and manage users",
};

const UsersPage = () => {
  return <UserTable />;
};

export default UsersPage;
