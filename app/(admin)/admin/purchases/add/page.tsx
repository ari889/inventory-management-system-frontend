import { Setting } from "@/@types/settings.types";
import { getSettings } from "@/actions/SettingsAction";
import { Card, CardContent } from "@/components/ui/card";
import { handleResponse } from "@/utils/handle-response";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import CreatePurchase from "./_components/CreatePurchaseForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Add New Purchase | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Create new purchase",
  };
};

const AddPurchasePage = () => {
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent>
          <div className="flex flex-row justify-between items-center my-3">
            <div className="flex flex-row justify-start items-center">
              <ShoppingCart className="mr-2 border rounded border-gray-300 p-2 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Add New Purchase</h2>
                <h3 className="text-gray-500">
                  Create and manage your purchases
                </h3>
              </div>
            </div>
            <Button type="button" asChild>
              <Link href="/admin/purchases">
                <ArrowLeft />
                Back
              </Link>
            </Button>
          </div>
          <CreatePurchase />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPurchasePage;
