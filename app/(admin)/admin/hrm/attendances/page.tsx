export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import AttendanceTable from "./_components/AttendanceTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Attendances | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage department",
  };
};

const AttendancePage = async () => {
  handleResponse(await checkPermission("attendance-access"));
  return <AttendanceTable />;
};

export default AttendancePage;
