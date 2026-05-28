"use client";
import TaxAutocomplete from "@/components/common/autocompletes/TaxAutocomplete";
import WarehouseAutocomplete from "@/components/common/autocompletes/WarehouseAutocomplete";
import CustomSelect from "@/components/common/CustomSelect";
import FileUploader from "@/components/common/FileUploader";
import FormInput from "@/components/common/FormInput";
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
import {
  saleCreateSchema,
  SaleCreateSchemaType,
  SaleProductSchemaType,
} from "@/schemas/sale.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  Edit,
  Save,
  ShoppingBasket,
  Trash,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Product } from "@/@types/product.types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonGroup } from "@/components/ui/button-group";
import { setApiErrors } from "@/utils/setFormErrors";
import { createSale } from "@/actions/SaleAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SaleProductType } from "@/@types/sale.types";
import { Input } from "@/components/ui/input";
import { Unit } from "@/@types/unit.types";
import { Tax } from "@/@types/tax.types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import SelectProductAutocomplete from "../../../purchases/_components/SelectProductAutocomplete";
import AccountAutocomplete from "@/components/common/autocompletes/AccountAutocomplete";
import CustomerAutocomplete from "@/components/common/autocompletes/CustomerAutocomplete";
import SalesProductEditModal from "../../_components/SalesProductEditModal";

const CreateSaleForm = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<SaleProductType[]>([]);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    setError: setFormError,
  } = useForm<SaleCreateSchemaType>({
    defaultValues: {
      warehouseId: undefined,
      customerId: undefined,
      taxId: null,
      orderTaxRate: "0.00",
      orderDiscount: "0.00",
      shippingCost: "0.00",
      saleStatus: false,
      paymentStatus: undefined,
      accountId: undefined,
      amount: "0.00",
      change: "0.00",
      paymentMethod: undefined,
      document: null,
      note: "",
    },
    resolver: zodResolver(saleCreateSchema),
  });

  const saleStatus = useWatch({ control, name: "saleStatus" });

  const paymentStatus = useWatch({ control, name: "paymentStatus" });

  const amount = useWatch({ control, name: "amount" });

  const setProduct = (product: Product) => {
    setProducts((prevProducts: SaleProductType[]) => {
      if (prevProducts.find((p) => p.productId === product.id))
        return prevProducts;
      const newProduct: SaleProductType = {
        id: null,
        productId: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
        taxId: product?.tax?.id ?? undefined,
        taxRate: product?.tax?.rate ? product.tax.rate : "0.00",
        taxName: product?.tax?.name,
        unitId: product?.unit?.id,
        unitName: product?.unit?.unitName,
        unitPrice: product.price,
        quantity: 1,
        discount: "0.00",
        subtotal: String(parseFloat(product.price) * 1),
      };

      return [...prevProducts, newProduct];
    });
  };

  const selectedProductData = products?.find(
    (p: SaleProductType) => p.productId === selectedProduct,
  );

  const updateProduct = (
    id: number,
    product: SaleProductSchemaType & {
      unit: Pick<Unit, "id" | "unitName">;
      tax?: Pick<Tax, "id" | "name" | "rate"> | null;
    },
  ) => {
    const newProduct = products.map((p: SaleProductType) => {
      if (p.productId === id) {
        return {
          ...p,
          quantity: product?.quantity,
          unitPrice: product?.unitPrice,
          price: product?.unitPrice,
          discount: product?.discount,
          taxId: product?.tax?.id,
          taxRate: product?.tax?.rate ? product.tax.rate : "0.00",
          taxName: product?.tax?.name,
          unitId: product?.unit?.id,
          unitName: product?.unit?.unitName,
        };
      }
      return p;
    });

    setProducts(newProduct);
    setSelectedProduct(null);
  };

  const watchedOrderDiscount = useWatch({ control, name: "orderDiscount" });
  const watchedShippingCost = useWatch({ control, name: "shippingCost" });

  const onSubmit = (data: SaleCreateSchemaType) =>
    startTransition(async () => {
      try {
        if (!products.length)
          throw new Error("Please add at least one product");
        const body = new FormData();

        body.append("customerId", String(data.customerId));
        body.append("warehouseId", String(data.warehouseId));
        body.append("saleStatus", String(data.saleStatus));
        if (data?.saleStatus) {
          body.append("paymentStatus", String(data.paymentStatus));
        }

        if (
          (data?.paymentStatus && data?.paymentStatus == "PAID") ||
          data?.paymentStatus == "PARTIAL"
        ) {
          body.append("accountId", String(data.accountId));
          body.append("amount", String(data.amount));
          body.append("change", String(data.change));
          body.append("paymentMethod", String(data.paymentMethod));
        }

        body.append("item", String(products.length));

        const totalQty = products.reduce(
          (acc, p) => acc + Number(p.quantity),
          0,
        );
        body.append("totalQty", String(totalQty));

        const totalDiscount = products.reduce(
          (acc, p) =>
            acc + parseFloat(p.discount || "0.00") * Number(p.quantity),
          0,
        );
        body.append("totalDiscount", totalDiscount.toFixed(2));

        const totalTax = products.reduce((acc, p) => {
          const { taxAmount } = calculateLineAmounts(p);
          return acc + taxAmount;
        }, 0);
        body.append("totalTax", totalTax.toFixed(2));

        const totalPrice = products.reduce((acc, p) => {
          const { subtotal } = calculateLineAmounts(p);
          return acc + subtotal;
        }, 0);
        body.append("totalPrice", totalPrice.toFixed(2));

        if (data.taxId != null) {
          body.append("taxId", String(data?.taxId ?? null));
          body.append("orderTaxRate", data.orderTaxRate ?? "0.00");
          body.append("orderTax", orderTaxAmount.toFixed(2));
        }
        if (data.orderDiscount != null) {
          body.append("orderDiscount", data.orderDiscount);
        }
        if (data.shippingCost != null) {
          body.append("shippingCost", data.shippingCost);
        }

        body.append("grandTotal", grandTotal.toFixed(2));

        body.append("paidAmount", String(data.amount));

        const productsMap = products.map((p) => {
          const { taxAmount, subtotal } = calculateLineAmounts(p);
          return {
            id: p.id,
            productId: p.productId,
            unitId: p.unitId,
            taxId: p.taxId ?? null,
            qty: p.quantity,
            netUnitPrice: p.unitPrice,
            discount: p.discount,
            taxRate: p.taxRate,
            tax: taxAmount.toFixed(2),
            total: subtotal.toFixed(2),
          };
        });
        body.append("products", JSON.stringify(productsMap));

        if (data.document instanceof File) {
          body.append("document", data.document);
        }

        if (data.note) {
          body.append("note", data.note);
        }

        const response = await createSale(body);

        if (!response.success && response?.errors) {
          setApiErrors(response.errors, setFormError);
        } else if (!response.success) {
          throw new Error(response?.message || "Failed to create sale");
        } else {
          toast.success("Sale created successfully");
          router.push("/admin/sales");
        }
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("Something went wrong");
      }
    });

  const calculateLineAmounts = (item: SaleProductType) => {
    const qty = Number(item.quantity);
    const cost = parseFloat(item.unitPrice || "0.00");
    const discount = parseFloat(item.discount || "0.00");
    const taxRate = parseFloat(item.taxRate || "0.00");

    const total = qty * cost;
    const discountTotal = discount;
    const afterDiscount = total - discountTotal;
    const taxAmount = parseFloat(((afterDiscount * taxRate) / 100).toFixed(2));
    const subtotal = parseFloat((afterDiscount + taxAmount).toFixed(2));

    return { taxAmount, subtotal };
  };

  // Line-level totals
  const totals = products.reduce(
    (acc, product) => {
      const { taxAmount, subtotal } = calculateLineAmounts(product);

      return {
        quantity: acc.quantity + Number(product.quantity),
        unitPrice: acc.unitPrice + parseFloat(product.unitPrice || "0.00"),
        discount: acc.discount + parseFloat(product.discount || "0.00"),
        tax: acc.tax + taxAmount,
        subtotal: acc.subtotal + subtotal,
      };
    },
    { quantity: 0, unitPrice: 0, discount: 0, tax: 0, subtotal: 0 },
  );

  // Order-level calculations
  // orderTax is a tax rate (%) applied on top of products subtotal
  const watchedOrderTaxRate = useWatch({ control, name: "orderTaxRate" });
  const orderTaxRate = parseFloat(watchedOrderTaxRate || "0");

  const orderDiscount = parseFloat(watchedOrderDiscount || "0");
  const shippingCost = parseFloat(watchedShippingCost || "0");

  const orderTaxAmount = Number(
    ((totals.subtotal * orderTaxRate) / 100).toFixed(2),
  );
  const grandTotal = Number(
    (totals.subtotal + orderTaxAmount - orderDiscount + shippingCost).toFixed(
      2,
    ),
  );

  useEffect(() => {
    const total = parseFloat(grandTotal.toFixed(2) || "0.00");

    if (paymentStatus === "PAID") {
      setValue("amount", String(total));
      setValue("change", "0.00");
    } else {
      setValue("amount", "0.00");
      setValue("change", total.toFixed(2));
    }
  }, [grandTotal, paymentStatus, setValue]);

  useEffect(() => {
    const total = parseFloat(grandTotal.toFixed(2) || "0.00");
    const paid = parseFloat(amount || "0.00");
    const change = total - paid;
    setValue("change", change.toFixed(2));
  }, [amount, grandTotal, setValue]);

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
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <WarehouseAutocomplete
            control={control}
            name="warehouseId"
            label="Warehouse"
          />
          <CustomerAutocomplete
            control={control}
            name="customerId"
            label="Customer"
          />
        </div>

        <SelectProductAutocomplete setProduct={setProduct} />
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Net Unit Price</TableHead>
              <TableHead className="text-center">Discount</TableHead>
              <TableHead className="text-center">Tax</TableHead>
              <TableHead className="text-center">Subtotal</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ShoppingBasket />
                      </EmptyMedia>
                      <EmptyTitle>No products are added</EmptyTitle>
                      <EmptyDescription>
                        You have not added any products to your sale. Go to the
                        search bar type product name or code and select a
                        product.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => {
                const { taxAmount, subtotal } = calculateLineAmounts(product);
                return (
                  <TableRow key={`${product.productId}${index}`}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="left">{product.code}</TableCell>
                    <TableCell align="center">
                      <Field>
                        <Input
                          id="username"
                          placeholder="Eg: 10"
                          type="number"
                          className="text-center"
                          value={product.quantity}
                          min={1}
                          onChange={(e) =>
                            setProducts(
                              products?.map((p) =>
                                p.productId === product.productId
                                  ? { ...p, quantity: Number(e.target.value) }
                                  : p,
                              ),
                            )
                          }
                        />
                      </Field>
                    </TableCell>
                    <TableCell align="center">
                      {Number(product.price) * Number(product.quantity)}
                    </TableCell>
                    <TableCell align="center">{product?.discount}</TableCell>
                    <TableCell align="center">
                      {taxAmount.toFixed(2)}{" "}
                      <span className="text-xs text-gray-500">
                        (By: {product.taxRate}%)
                      </span>
                    </TableCell>
                    <TableCell align="center">{subtotal.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup>
                        <Button
                          variant="default"
                          type="button"
                          onClick={() => {
                            setSelectedProduct(product?.productId);
                            setEditOpen(true);
                          }}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() =>
                            setProducts(
                              products?.filter((p) => p.id !== product.id),
                            )
                          }
                        >
                          <Trash />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableHead colSpan={2} className="text-right">
                Total
              </TableHead>
              <TableHead className="text-center">
                {totals.quantity.toFixed(2)}
              </TableHead>
              <TableHead className="text-center">
                {totals.unitPrice.toFixed(2)}
              </TableHead>
              <TableHead className="text-center">
                {totals.discount.toFixed(2)}
              </TableHead>
              <TableHead className="text-center">
                {totals.tax.toFixed(2)}
              </TableHead>
              <TableHead className="text-center">
                {totals.subtotal.toFixed(2)}
              </TableHead>
              <TableHead />
            </TableRow>
          </TableFooter>
        </Table>
        <div className="grid grid-cols-3 gap-4">
          {/* Order-level fields */}
          <TaxAutocomplete
            control={control}
            name="taxId"
            label="Order Tax"
            onSelectTax={(tax) => {
              setValue("orderTaxRate", tax?.rate?.toString() ?? "0.00");
            }}
          />
          <FormInput
            control={control}
            name="orderDiscount"
            label="Order Discount"
            placeholder="Eg: 2"
            disabled={isPending}
            type="number"
            min={0}
            step="0.01"
            decimalScale={2}
          />
          <FormInput
            control={control}
            name="shippingCost"
            label="Shipping Cost"
            placeholder="Eg: 2"
            disabled={isPending}
            type="number"
            min={0}
            step="0.01"
            decimalScale={2}
          />
          <CustomSelect
            control={control}
            name="saleStatus"
            label="Sale Status"
            data={[
              { label: "Completed", value: true },
              { label: "Pending", value: false },
            ]}
            disabled={isPending}
          />
          {saleStatus && (
            <CustomSelect
              control={control}
              name="paymentStatus"
              label="Payment Status"
              data={[
                { label: "Paid", value: "PAID" },
                { label: "Partial", value: "PARTIAL" },
                { label: "Due", value: "DUE" },
              ]}
              disabled={isPending}
            />
          )}

          {paymentStatus == "PAID" || paymentStatus == "PARTIAL" ? (
            <>
              <CustomSelect
                control={control}
                name="paymentMethod"
                label="Payment Method"
                data={[
                  { label: "Cash", value: "CASH" },
                  { label: "Cheque", value: "CHEQUE" },
                  { label: "Mobile", value: "MOBILE" },
                ]}
              />
              <AccountAutocomplete
                control={control}
                name="accountId"
                label="Account"
              />
              <FormInput
                control={control}
                name="amount"
                label="Paying Amount"
                placeholder="Eg: 1000.00"
                disabled={grandTotal == 0 || isPending}
                type="number"
                min={0}
                max={grandTotal}
                step="0.01"
                decimalScale={2}
              />
              <FormInput
                control={control}
                name="change"
                label="Change"
                placeholder="Eg: 1000.00"
                disabled={true}
                type="number"
                min={0}
                step="0.01"
                decimalScale={2}
              />
            </>
          ) : null}

          <div className="col-span-3">
            <FileUploader
              control={control}
              name="document"
              label="Attach Document"
              acceptTypes={[
                "application/pdf",
                "image/gif",
                "image/jpeg",
                "image/png",
                "image/webp",
                "video/mp4",
                "audio/mp3",
              ]}
              placeholder="Upload your document here"
              disabled={isPending}
            />
          </div>
          <div className="col-span-3">
            <FormTextarea
              control={control}
              name="note"
              label="Note"
              placeholder="Eg: Note here"
              disabled={isPending}
            />
          </div>

          {/* Grand total summary */}
          <div className=" flex justify-end col-span-3">
            <div className="w-full rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Products Subtotal</span>
                <span className="font-medium">
                  {totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Order Tax ({orderTaxRate}%)
                </span>
                <span className="font-medium">
                  + {orderTaxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Discount</span>
                <span className="font-medium text-destructive">
                  - {orderDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Cost</span>
                <span className="font-medium">+ {shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>Grand Total</span>
                <span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4 col-span-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : <Save />}
              Save
            </Button>
          </div>
        </div>
      </FieldGroup>
      {selectedProduct && selectedProductData ? (
        <SalesProductEditModal
          key={selectedProduct}
          open={editOpen}
          setOpen={setEditOpen}
          product={selectedProductData}
          update={updateProduct}
        />
      ) : null}
    </form>
  );
};

export default CreateSaleForm;
