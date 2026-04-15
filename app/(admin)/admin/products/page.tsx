export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import ProductTable from "./_components/ProductTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Product Categories | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage product",
  };
};

const ProductCategoriesPage = async () => {
  handleResponse(await checkPermission("product-access"));
  return <ProductTable />;
};

export default ProductCategoriesPage;
