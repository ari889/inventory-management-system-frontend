"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Printer, Eye } from "lucide-react";

import ProductAutocomplete from "@/components/common/autocompletes/ProductAutoComplete";
import CustomSelect from "@/components/common/CustomSelect";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { getProductById } from "@/actions/ProductAction";
import { setApiErrors } from "@/utils/setFormErrors";
import { toast } from "sonner";

import {
  printBarcodeSchema,
  PrintBarcodeSchemaType,
} from "@/schemas/print-barcode.schema";

import PrintBarcode from "./PrintBarcode";
import { Product } from "@/@types/product.types";

const PrintBarcodeForm = ({
  appName,
  currencySymbol,
}: {
  appName: string;
  currencySymbol: string;
}) => {
  const [product, setProduct] = useState<Product>();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    setError: setFormError,
    watch,
  } = useForm<PrintBarcodeSchemaType>({
    resolver: zodResolver(printBarcodeSchema),
    defaultValues: {
      productId: undefined,
      noOfBarcode: 12,
      qtyEachRow: 4,
      productName: true,
      price: true,
      width: 3,
      height: 65,
    },
  });

  const onSubmit = (data: PrintBarcodeSchemaType) =>
    startTransition(async () => {
      try {
        const res = await getProductById(data.productId);

        if (!res.success && res.errors) {
          setApiErrors(res.errors, setFormError);
          return;
        }

        if (!res.success) throw new Error(res.message);

        setProduct(res.data);
        toast.success("Barcode loaded!");
      } catch (err) {
        toast.error("Failed to load product");
      }
    });

  return (
    <div>
      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="print:hidden">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <ProductAutocomplete
              control={control}
              name="productId"
              label="Product"
            />
          </div>

          <FormInput
            control={control}
            name="noOfBarcode"
            label="No. of Barcodes"
            type="number"
          />
          <FormInput
            control={control}
            name="qtyEachRow"
            label="Qty Each Row"
            type="number"
          />

          <CustomSelect
            control={control}
            name="productName"
            label="Product Name"
            data={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ]}
          />

          <CustomSelect
            control={control}
            name="price"
            label="Price"
            data={[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ]}
          />

          <FormInput
            control={control}
            name="width"
            label="Width"
            type="number"
          />
          <FormInput
            control={control}
            name="height"
            label="Height"
            type="number"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.print()}
          >
            <Printer /> Print
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : <Eye />}
            Show
          </Button>
        </div>
      </form>

      {/* PRINT AREA */}
      {product && (
        <PrintBarcode
          product={product}
          width={watch("width") ?? 0}
          height={watch("height") ?? 0}
          noOfBarcode={watch("noOfBarcode") ?? 0}
          qtyEachRow={watch("qtyEachRow") ?? 0}
          appName={appName}
          showProductName={watch("productName") ?? false}
          showPrice={watch("price") ?? false}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
};

export default PrintBarcodeForm;
