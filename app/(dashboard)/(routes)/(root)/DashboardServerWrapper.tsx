// DashboardServerWrapper.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardServerWrapper() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return <DashboardClient userId={userId} />;
}
