import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import ProductQuantityAlertReportTable from "./_components/ProductQuantityAlertReportTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Product Quantity Alert Report | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage customer report",
  };
};

const ProductQuantityAlertReportsPage = async () => {
  handleResponse(await checkPermission("customer-access"));
  return <ProductQuantityAlertReportTable />;
};

export default ProductQuantityAlertReportsPage;
