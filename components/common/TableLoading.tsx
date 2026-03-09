import { Skeleton } from "../ui/skeleton";

const TableLoading = ({
  columns = 5,
  rows = 10,
}: {
  columns?: number;
  rows?: number;
}) => {
  return Array(rows)
    .fill(null)
    .map((_, index) => (
      <tr className="border-t hover:bg-muted/40 transition" key={index}>
        {Array(columns)
          .fill(null)
          .map((_, index2) => (
            <td className="px-4 py-3 text-center" key={index2}>
              <Skeleton className="h-5 w-full" />
            </td>
          ))}
      </tr>
    ));
};

export default TableLoading;
