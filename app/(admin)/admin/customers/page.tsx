import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import CustomerTable from "./_components/CustomerTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Customers | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage customers",
  };
};

const CustomersPage = async () => {
  handleResponse(await checkPermission("customer-access"));
  return <CustomerTable />;
};

export default CustomersPage;
