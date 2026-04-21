import { Product } from "@/@types/product.types";
import { getProducts } from "@/actions/ProductAction";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SelectProductAutocomplete = ({
  setProduct,
}: {
  setProduct: (product: Product) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  /**
   * Debounced search for products
   */
  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        setLoading(true);
        try {
          const data = await getProducts({
            page: 0,
            limit: 10,
            order: "id",
            direction: "desc",
            search: value,
          });

          if (!data?.success && !data?.errors) throw new Error(data.message);

          setProducts(data.data?.items ?? []);
        } catch (error) {
          if (error instanceof Error) setError(error?.message);
          setError("Failed to fetch products");
        } finally {
          setLoading(false);
        }
      }, 300),
    [],
  );

  useEffect(() => {
    let mount = false;

    if (!mount) debouncedSearch(search);

    return () => {
      mount = true;
    };
  }, [search, debouncedSearch]);

  /**
   * Highlight matched text
   * @param text
   * @param query
   * @returns String
   */
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-bold text-primary">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <Field>
      <FieldLabel>Select Products</FieldLabel>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={true}
            className={cn("w-full justify-between font-normal")}
          >
            <span className={cn("text-muted-foreground")}>
              {"Search for Products..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search for Products..."
              value={search}
              onValueChange={(value) => setSearch(value)}
            />
            <CommandList>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Spinner className="h-4 w-4" />
                </div>
              ) : (
                <>
                  {products.length === 0 ? (
                    <CommandEmpty>No products found.</CommandEmpty>
                  ) : (
                    <CommandGroup heading="Products">
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => {
                            setProduct(product);
                            setSearch("");
                            setOpen(false);
                          }}
                        >
                          <span>
                            {highlightMatch(product.name, search)} -{" "}
                            {highlightMatch(product.code, search)}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export default SelectProductAutocomplete;
