import { fetchAPI } from "@/lib/api";
import { Stats } from "@/types";

export default async function Dashboard() {
  // Fetching data from Python - fastapi Backend
  let stats: Stats = { total: 0, published: 0, drafts: 0 };
  
  try {
    stats = await fetchAPI("/dashboard/stats");
  } catch (e) {
    console.error("Not logged in or API down");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">Total Posts</h3>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500">Published</h3>
          <p className="text-4xl font-bold">{stats.published}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500">Drafts</h3>
          <p className="text-4xl font-bold">{stats.drafts}</p>
        </div>
      </div>
    </div>
  );
}