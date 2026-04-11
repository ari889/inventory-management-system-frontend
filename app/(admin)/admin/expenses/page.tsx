export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import ExpenseTable from "./_components/ExpenseTable";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Expense | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage expense",
  };
};

const ExpenseCategoriesPage = async () => {
  handleResponse(await checkPermission("expence-access"));
  return <ExpenseTable />;
};

export default ExpenseCategoriesPage;
