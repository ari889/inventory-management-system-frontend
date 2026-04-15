"use client";
import { Product } from "@/@types/product.types";
import { updateProduct } from "@/actions/ProductAction";
import BrandAutocomplete from "@/components/common/autocompletes/BrandAutoComplete";
import ProductCategoryAutocomplete from "@/components/common/autocompletes/ProductCategoryAutocomplete";
import TaxAutocomplete from "@/components/common/autocompletes/TaxAutocomplete";
import UnitAutocomplete from "@/components/common/autocompletes/UnitAutocomplete";
import CustomSelect from "@/components/common/CustomSelect";
import FileUploader from "@/components/common/FileUploader";
import FormInput from "@/components/common/FormInput";
import FormInputGroup from "@/components/common/FormInputGroup";
import FormTextarea from "@/components/common/FormTextarea";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { productSchema, ProductSchemaType } from "@/schemas/product.schema";
import { setApiErrors } from "@/utils/setFormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { AlertCircleIcon, Repeat2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UpdateProductForm = ({
  data,
  onSuccess,
}: {
  data: Product;
  onSuccess: (data: Product) => void;
}) => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormError,
    setValue,
  } = useForm<ProductSchemaType>({
    defaultValues: {
      name: data?.name || "",
      code: data?.code || "",
      barcodeSymbology: data?.barcodeSymbology || "CODE128",
      image: data?.image || undefined,
      brandId: data?.brand?.id || null,
      categoryId: data?.category?.id || undefined,
      unitId: data?.unit?.id || undefined,
      purchaseUnitId: data?.purchaseUnit?.id || undefined,
      saleUnitId: data?.saleUnit?.id || undefined,
      cost: String(data?.cost) || "",
      price: String(data?.price) || "",
      qty: data?.qty || null,
      alertQty: data?.alertQty || null,
      taxId: data?.tax?.id || null,
      taxMethod: data?.taxMethod || true,
      description: data?.description || null,
      status: data?.status || false,
    },
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (payload: ProductSchemaType) =>
    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("name", payload.name);
        body.append("code", payload.code);
        body.append("barcodeSymbology", payload.barcodeSymbology);
        body.append("brandId", String(payload.brandId));
        body.append("categoryId", String(payload.categoryId));
        body.append("unitId", String(payload.unitId));
        body.append("purchaseUnitId", String(payload.purchaseUnitId));
        body.append("saleUnitId", String(payload.saleUnitId));
        body.append("cost", String(payload.cost));
        body.append("price", String(payload.price));
        body.append("qty", String(payload.qty));
        body.append("alertQty", String(payload.alertQty));
        body.append("taxId", String(payload.taxId));
        body.append("taxMethod", String(payload.taxMethod));
        body.append("description", String(payload.description));
        body.append("status", String(payload.status));

        if (payload.image instanceof File) {
          body.append("image", payload.image as File, payload.image.name);
        }
        const response = await updateProduct(data.id, body);

        if (!response.success && response?.errors)
          setApiErrors(response.errors, setFormError);
        else if (!response.success)
          throw new Error(response?.message || "Failed to update product");
        else {
          onSuccess(response?.data);
          toast.success("Product updated successfully");
        }
      } catch (error) {
        if (error instanceof Error) setError(error?.message);
        else setError("Something went wrong");
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertAction>
            <Button size="xs" variant="default" onClick={() => setError("")}>
              Close
            </Button>
          </AlertAction>
        </Alert>
      )}
      <FieldGroup className="grid grid-cols-2">
        <FormInput
          control={control}
          name="name"
          label="Product Name"
          placeholder="Eg: Apple"
          disabled={isPending}
        />
        <FormInputGroup
          control={control}
          name="code"
          label="Product Code"
          placeholder="Eg: ABC123"
          disabled={isPending}
          addon={<Repeat2 size={16} />}
          onAddonClick={() => {
            const randomCode = _.random(10000000, 99999999).toString();
            setValue("code", randomCode);
          }}
          addonAlign="inline-end"
        />
        <div className="col-span-2">
          <CustomSelect
            control={control}
            name="barcodeSymbology"
            label="Barcode Symbology"
            disabled={isPending}
            data={[
              { value: "CODE128", label: "CODE128 (Auto)" },
              { value: "CODE128A", label: "CODE128A" },
              { value: "CODE128B", label: "CODE128B" },
              { value: "CODE128C", label: "CODE128C" },
              { value: "EAN13", label: "EAN-13" },
              { value: "EAN8", label: "EAN-8" },
              { value: "UPC", label: "UPC" },
              { value: "CODE39", label: "CODE-39" },
              { value: "ITF14", label: "ITF-14" },
              { value: "MSI", label: "MSI" },
              { value: "pharmacode", label: "Pharmacode" },
            ]}
          />
        </div>
        <div className="col-span-2">
          <FileUploader
            control={control}
            name="image"
            label="Product Image"
            acceptTypes={["image/jpeg", "image/png", "image/gif"]}
            placeholder="Upload your product image"
            disabled={isPending}
          />
        </div>
        <BrandAutocomplete
          control={control}
          name="brandId"
          label="Brand"
          defaultBrand={
            data?.brand
              ? {
                  id: data.brand.id,
                  title: data.brand.title,
                }
              : null
          }
        />
        <ProductCategoryAutocomplete
          control={control}
          name="categoryId"
          label="Category"
          defaultProductCategory={
            data?.category
              ? {
                  id: data.category.id,
                  name: data.category.name,
                }
              : null
          }
        />
        <UnitAutocomplete
          control={control}
          name="unitId"
          label="Unit"
          defaultUnit={
            data?.unit
              ? {
                  id: data.unit.id,
                  unitName: data.unit.unitName,
                }
              : null
          }
        />
        <UnitAutocomplete
          control={control}
          name="purchaseUnitId"
          label="Pruchase Unit"
          defaultUnit={
            data?.unit
              ? {
                  id: data.unit.id,
                  unitName: data.unit.unitName,
                }
              : null
          }
        />
        <UnitAutocomplete
          control={control}
          name="saleUnitId"
          label="Sale Unit"
          defaultUnit={
            data?.unit
              ? {
                  id: data.unit.id,
                  unitName: data.unit.unitName,
                }
              : null
          }
        />
        <FormInput
          control={control}
          name="cost"
          label="Cost"
          placeholder="Eg: 1000.00"
          disabled={isPending}
          type="number"
          min={0}
          step="0.01"
          decimalScale={2}
        />
        <FormInput
          control={control}
          name="price"
          label="Price"
          placeholder="Eg: 1000.00"
          disabled={isPending}
          type="number"
          min={0}
          step="0.01"
          decimalScale={2}
        />
        <FormInput
          control={control}
          name="qty"
          label="Qty"
          placeholder="Eg: 1000"
          disabled={isPending}
          type="number"
          min={0}
          step="0.01"
        />
        <FormInput
          control={control}
          name="alertQty"
          label="Alert Qty"
          placeholder="Eg: 1000"
          disabled={isPending}
          type="number"
          min={0}
          step="0.01"
        />
        <TaxAutocomplete
          control={control}
          name="taxId"
          label="Tax"
          defaultTax={
            data?.tax
              ? {
                  id: data.tax.id,
                  name: data.tax.name,
                }
              : null
          }
        />
        <CustomSelect
          control={control}
          name="taxMethod"
          label="Tax Method"
          disabled={isPending}
          data={[
            { value: true, label: "Exclusive" },
            { value: false, label: "Inclusive" },
          ]}
        />
        <CustomSelect
          control={control}
          name="status"
          label="Status"
          disabled={isPending}
          data={[
            { value: true, label: "Active" },
            { value: false, label: "Inactive" },
          ]}
        />
        <div className="col-span-2">
          <FormTextarea
            control={control}
            name="description"
            label="Description"
            placeholder="Eg: Apple"
            disabled={isPending}
          />
        </div>

        <div className="col-span-2">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner data-icon="inline-start" /> : ""}
              Update
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  );
};

export default UpdateProductForm;
