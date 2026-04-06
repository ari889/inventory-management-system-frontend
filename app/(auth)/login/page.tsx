import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import Login from "./_components/Login";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";
import { handleResponse } from "@/utils/handle-response";

export const generateMetadata = async () => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  return {
    title: `Login | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Login to your account",
  };
};

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  const params = await searchParams;
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                {data?.find((s) => s.name === "title")?.value ||
                  "Inventory Management System"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Login callbackUrl={params?.callbackUrl || "/admin/dashboard"} />
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            Created By{" "}
            <Link href="https://github.com/ari889" target="_blank">
              Arijit Banarjee
            </Link>
            . &copy;All rights reserved
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
