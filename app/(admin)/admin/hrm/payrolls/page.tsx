export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import PayrollTable from "./_components/PayrollTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Payroll | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage payrolls",
  };
};

const PayrollPage = async () => {
  handleResponse(await checkPermission("payroll-access"));
  return <PayrollTable />;
};

export default PayrollPage;
