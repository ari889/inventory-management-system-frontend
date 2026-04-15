export const dynamic = "force-dynamic";
import { handleResponse } from "@/utils/handle-response";
import { checkPermission } from "@/actions/PermissionAction";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import PrintBarcodeForm from "./_components/PrintBarcodeForm";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Product Barcode | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create and manage product",
  };
};

const ProductBarcodePage = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  handleResponse(await checkPermission("print-barcode-access"));
  return (
    <div className="p-6 w-full min-w-0 overflow-x-hidden">
      <Card className="rounded-2xl shadow-sm w-full min-w-0 overflow-hidden">
        <CardContent className="min-w-0">
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <ShoppingCart className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Product Barcodes</h2>
                <h3 className="text-gray-500">
                  See and manage your product barcodes
                </h3>
              </div>
            </div>
          </div>
          <PrintBarcodeForm
            appName={
              data.find((s) => s.name === "title")?.value ||
              "Inventory Management System"
            }
            currencySymbol={
              data.find((s) => s.name === "currency_symbol")?.value || "$"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductBarcodePage;
