export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import DepartmentTable from "./_components/DepartmentTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Department | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage department",
  };
};

const DepartmentePage = async () => {
  handleResponse(await checkPermission("expence-access"));
  return <DepartmentTable />;
};

export default DepartmentePage;
