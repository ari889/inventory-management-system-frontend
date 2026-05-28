export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { getSaleById } from "@/actions/SaleAction";
import { Sale } from "@/@types/sale.types";
import EditSaleForm from "./_components/EditSaleForm";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Edit Sale | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Edit your sale data",
  };
};

const EditSalePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = handleResponse<Sale>(await getSaleById(Number(id)));
  return <EditSaleForm sale={data} id={Number(id)} />;
};

export default EditSalePage;
