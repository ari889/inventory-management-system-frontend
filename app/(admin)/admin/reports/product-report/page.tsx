import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import ProductReportTable from "./_components/ProductReportTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Product Report | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage product report",
  };
};

const ProductReportsPage = async () => {
  handleResponse(await checkPermission("product-access"));
  return <ProductReportTable />;
};

export default ProductReportsPage;
