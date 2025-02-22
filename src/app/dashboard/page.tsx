import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table-components/data-table";
import { columns } from "./data-table-components/columns";
import path from "path";
import fs from "fs"; // Importing the fs module

async function getData() {
  const filePath = path.join(
    process.cwd(),
    "src/app/dashboard/data-table-components",
    "data.json"
  );
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const data = await getData(); // Corrected function name to getData

  return (
    <div className="pb-2 pt-3">
      <h1>Dashboard Page</h1>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
