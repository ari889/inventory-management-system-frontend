"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const RANGES = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },
] as const;

type Range = (typeof RANGES)[number]["value"];

const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = (searchParams.get("range") ?? "thisYear") as Range;

  const handleSelect = (range: Range) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <ButtonGroup className="mb-5 mr-auto sm:mr-0 ml-auto">
      {RANGES.map(({ label, value }) => (
        <Button
          key={value}
          type="button"
          variant={currentRange === value ? "default" : "outline"}
          onClick={() => handleSelect(value)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default DateFilter;
