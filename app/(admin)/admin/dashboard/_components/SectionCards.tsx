"use client";
import { SectionCardsType } from "@/@types/dashbboard.types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAmount, formatCount } from "@/utils/common";
import {
  Banknote,
  BanknoteArrowDown,
  CircleDollarSign,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

export function SectionCards({ data }: { data: SectionCardsType }) {
  console.log(data?.profit);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Purchase</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatAmount(data.purchase)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ShoppingCart />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatAmount(data.sale)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Banknote />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Profit</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${data.profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {data.profit >= 0 ? "+" : ""}
            {formatAmount(data.profit)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <CircleDollarSign />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expense</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatAmount(data.expense)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <BanknoteArrowDown />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCount(data.totalCustomers)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Users />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Suppliers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCount(data.totalSuppliers)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Truck />
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
