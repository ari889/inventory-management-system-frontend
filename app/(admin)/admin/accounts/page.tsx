export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import AccountTable from "./_components/AccountTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Accounts | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage accounts",
  };
};

const AccountsPage = async () => {
  handleResponse(await checkPermission("account-access"));
  return <AccountTable />;
};

export default AccountsPage;
