import { Product } from "@/@types/product.types";
import Barcode, { Options } from "react-barcode";

export type BarcodeFormat = Options["format"];

const PrintBarcode = ({
  product,
  width,
  height,
  noOfBarcode,
  qtyEachRow,
  appName,
  showProductName,
  showPrice,
  currencySymbol,
}: {
  product: Product;
  width: number;
  height: number;
  noOfBarcode: number;
  qtyEachRow: number;
  appName: string;
  showProductName: boolean;
  showPrice: boolean;
  currencySymbol: string;
}) => {
  const barcodes = Array.from({ length: noOfBarcode });

  return (
    <div id="print-area" className="m-0 p-0">
      <div
        className="print-grid m-0 p-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${qtyEachRow}, minmax(0, 1fr))`,
        }}
      >
        {barcodes.map((_, index) => (
          <div
            key={index}
            className="barcode-item flex flex-col items-center text-center"
            style={{
              margin: "6px",
              padding: "4px",
            }}
          >
            {/* App Name */}
            <div style={{ fontSize: "12px", fontWeight: 600 }}>{appName}</div>

            {/* Product Name */}
            {showProductName && (
              <div style={{ fontSize: "11px" }}>{product?.name}</div>
            )}

            {/* Barcode */}
            <Barcode
              value={product?.code}
              width={width}
              height={height}
              format={(product?.barcodeSymbology as BarcodeFormat) || "CODE128"}
              displayValue={false}
            />

            {/* Price */}
            {showPrice && (
              <div style={{ fontSize: "11px", fontWeight: 500 }}>
                M.R.P: {product?.price} {currencySymbol}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintBarcode;
