import { Product } from "@/@types/product.types";
import { getProducts } from "@/actions/ProductAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleSelect = useCallback(
    (product: Product) => {
      setProduct(product);
      setSearch("");
      setProducts([]);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [setProduct],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value.trim()) {
          setProducts([]);
          setOpen(false);
          return;
        }
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

          const items = data.data?.items ?? [];

          if (items.length === 1) {
            handleSelect(items[0]);
          } else {
            setProducts(items);
            setOpen(items.length > 0);
            setActiveIndex(-1);
          }
        } catch (error) {
          if (error instanceof Error) setError(error?.message);
          else setError("Failed to fetch products");
        } finally {
          setLoading(false);
        }
      }, 300),
    [handleSelect],
  );

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || products.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < products.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && products[activeIndex]) {
          handleSelect(products[activeIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="relative w-full">
      <FieldLabel>Select Products</FieldLabel>

      <div className="relative mt-1">
        <InputGroup>
          <InputGroupAddon>
            {loading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </InputGroupAddon>
          <InputGroupInput
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => products.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search by product name or code..."
          />
        </InputGroup>

        {open && products.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-72 overflow-y-auto"
          >
            {products.map((product, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={product.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onMouseDown={() => handleSelect(product)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="shrink-0 h-10 w-10 rounded-md border border-border overflow-hidden bg-muted flex items-center justify-center">
                    {product.image ? (
                      <Avatar>
                        <AvatarImage
                          src={
                            `${process.env.NEXT_PUBLIC_API_URL}${product?.image}` ||
                            "https://github.com/shadcn.png"
                          }
                          alt={product?.name}
                        />
                        <AvatarFallback>{product?.name}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">
                        {product.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {highlightMatch(product.name, search)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {highlightMatch(product.code, search)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">{product.price}</p>
                  </div>

                  {isActive && (
                    <div className="shrink-0">
                      <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border">
                        ↵
                      </kbd>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <FieldError>{error}</FieldError>}
    </div>
  );
};

export default SelectProductAutocomplete;
