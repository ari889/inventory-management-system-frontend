import { handleResponse } from "@/utils/handle-response";
import StockTable from "./_components/StockTable";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Stocks | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage product stocks",
  };
};

const StocksPage = async () => {
  handleResponse(await checkPermission("stock-access"));
  return <StockTable />;
};

export default StocksPage;
