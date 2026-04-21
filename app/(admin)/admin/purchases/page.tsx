export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import PurchaseTable from "./_components/PurchaseTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Purchase | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage purchase",
  };
};

const PurchasePage = async () => {
  handleResponse(await checkPermission("purchase-access"));
  return <PurchaseTable />;
};

export default PurchasePage;
