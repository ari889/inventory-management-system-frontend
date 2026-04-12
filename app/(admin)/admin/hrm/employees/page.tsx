export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import EmployeeTable from "./_components/EmployeeTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Employee | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage employees",
  };
};

const EmployeePage = async () => {
  handleResponse(await checkPermission("employee-access"));
  return <EmployeeTable />;
};

export default EmployeePage;
