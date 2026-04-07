import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
import CustomerGroupTable from "./_components/CustomerGroupTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Customer Groups | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Manage your account settings",
  };
};

const CustomerGroupPage = async () => {
  handleResponse(await checkPermission("menu-access"));
  return <CustomerGroupTable />;
};

export default CustomerGroupPage;
