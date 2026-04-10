export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import TaxTable from "./_components/TaxTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Taxes | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage taxes",
  };
};

const TaxesPage = async () => {
  handleResponse(await checkPermission("tax-access"));
  return <TaxTable />;
};

export default TaxesPage;
