export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import ExpenseCategoryTable from "./_components/ExpenseCategoryTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Expense Categories | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage expense categories",
  };
};

const ExpenseCategoriesPage = async () => {
  handleResponse(await checkPermission("expence-category-access"));
  return <ExpenseCategoryTable />;
};

export default ExpenseCategoriesPage;
