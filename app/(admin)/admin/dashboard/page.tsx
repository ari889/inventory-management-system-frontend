import { getDashboardData } from "@/actions/DashboardAction";
import CashFlow from "./_components/CashFlow";
import { MonthlyOverview } from "./_components/MonthlyOverview";
import { SectionCards } from "./_components/SectionCards";
import YearlyReport from "./_components/YearlyReport";
import { handleResponse } from "@/utils/handle-response";
import { DashboardResponse } from "@/@types/dashbboard.types";
import DateFilter from "./_components/DateFilter";

export const dynamic = "force-dynamic";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) => {
  const { range } = await searchParams;

  const { data } = handleResponse<DashboardResponse>(
    await getDashboardData(range),
  );

  return (
    <>
      <DateFilter />
      <SectionCards data={data?.sectionCards} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
        <CashFlow data={data?.cashFlow ?? []} />
        <MonthlyOverview
          purchase={data?.monthlyOverview?.purchase ?? 0}
          sale={data?.monthlyOverview?.sale ?? 0}
          expense={data?.monthlyOverview?.expense ?? 0}
        />
      </div>
      <div className="mt-5">
        <YearlyReport data={data?.yearlyReport ?? []} />
      </div>
    </>
  );
};

export default DashboardPage;
