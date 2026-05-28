import { SaleProductType } from "@/@types/sale.types";
import { Tax } from "@/@types/tax.types";
import { Unit } from "@/@types/unit.types";
import TaxAutocomplete from "@/components/common/autocompletes/TaxAutocomplete";
import UnitAutocomplete from "@/components/common/autocompletes/UnitAutocomplete";
import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  saleProductSchema,
  SaleProductSchemaType,
} from "@/schemas/sale.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

const SalesProductEditModal = ({
  open,
  setOpen,
  product,
  update,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  product: SaleProductType;
  update: (
    id: number,
    product: SaleProductSchemaType & {
      unit: Pick<Unit, "id" | "unitName">;
      tax?: Pick<Tax, "id" | "name" | "rate"> | null;
    },
  ) => void;
}) => {
  const [unit, setUnit] = useState<Pick<Unit, "id" | "unitName">>({
    id: product?.unitId ?? 0,
    unitName: product?.unitName ?? "",
  });
  const [tax, setTax] = useState<Pick<Tax, "id" | "name" | "rate"> | null>(
    product?.taxId
      ? {
          id: product.taxId,
          name: product.taxName ?? "",
          rate: product.taxRate,
        }
      : null,
  );
  const { control, handleSubmit } = useForm<SaleProductSchemaType>({
    defaultValues: {
      taxId: product?.taxId ?? null,
      unitId: product?.unitId,
      quantity: product?.quantity ?? 0,
      discount: product?.discount ?? "0.00",
      unitPrice: product?.unitPrice ?? "0.00",
    },
    resolver: zodResolver(saleProductSchema),
  });

  const onSubmit = (data: SaleProductSchemaType) => {
    if (!unit) return;
    update(product?.productId, {
      ...data,
      unit,
      tax: tax ?? undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{product?.name}</DialogTitle>
          <DialogDescription>Edit and manage product</DialogDescription>
        </DialogHeader>
        <form
          className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
        >
          <FieldGroup>
            <FormInput
              control={control}
              name={`quantity`}
              label="Quantity"
              placeholder="Eg: 1000.00"
              type="number"
              min={0}
            />
            <FormInput
              control={control}
              name={`discount`}
              label="Discount"
              placeholder="Eg: 20.00"
              type="number"
              min={0}
              step="0.01"
              decimalScale={2}
            />
            <FormInput
              control={control}
              name={`unitPrice`}
              label="Unit Price"
              placeholder="Eg: 20.00"
              type="number"
              min={0}
              step="0.01"
              decimalScale={2}
            />
            <TaxAutocomplete
              control={control}
              name={`taxId`}
              label="Tax"
              defaultTax={
                product?.taxId
                  ? { id: product.taxId, name: product.taxName ?? "" }
                  : null
              }
              onSelectTax={(tax: Tax | null) =>
                setTax(
                  tax
                    ? {
                        id: tax?.id,
                        name: tax?.name,
                        rate: tax?.rate,
                      }
                    : null,
                )
              }
            />
            <UnitAutocomplete
              control={control}
              name={`unitId`}
              label="Unit"
              defaultUnit={
                product?.unitId
                  ? { id: product.unitId, unitName: product.unitName ?? "" }
                  : null
              }
              onSelectUnit={(unit) => setUnit(unit as Unit)}
            />
            <Field>
              <Button type="submit">Update</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesProductEditModal;
