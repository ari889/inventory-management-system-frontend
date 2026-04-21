export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { getPurchaseById } from "@/actions/PurchaseAction";
import { Purchase } from "@/@types/purchase.types";
import EditPurchase from "./_components/EditPurchaseForm";
import EditPurchaseForm from "./_components/EditPurchaseForm";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Edit Purchase | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Edit your purchase data",
  };
};

const EditPurchasePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = handleResponse<Purchase>(await getPurchaseById(Number(id)));
  return <EditPurchaseForm purchase={data} id={Number(id)} />;
};

export default EditPurchasePage;
