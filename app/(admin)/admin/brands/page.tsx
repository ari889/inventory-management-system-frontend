import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
import BrandTable from "./_components/BrandTable";
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Brands | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Manage your brand settings",
  };
};

const BrandPage = async () => {
  handleResponse(await checkPermission("brand-access"));
  return <BrandTable />;
};

export default BrandPage;
