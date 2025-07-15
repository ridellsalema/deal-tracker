import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [deals, setDeals] = useState([]);
  const [selectedSector, setSelectedSector] = useState("All");

  useEffect(() => {
    axios.get("http://localhost:8000/api/deals").then((res) => {
      setDeals(res.data);
    });
  }, []);

  const sectors = [...new Set(deals.map((d) => d.sector))];

  // Filtered deals
  const filteredDeals =
    selectedSector === "All"
      ? deals
      : deals.filter((d) => d.sector === selectedSector);

  // Total metrics
  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);
  const totalDeals = filteredDeals.length;

  // Bar Chart – Deal Value by Sector
  const sectorTotals = sectors.map((sector) => {
    const total = deals
      .filter((d) => d.sector === sector)
      .reduce((sum, d) => sum + d.value, 0);
    return { sector, total };
  });

  const barData = {
    labels: sectorTotals.map((s) => s.sector),
    datasets: [
      {
        label: "Total Deal Value ($)",
        data: sectorTotals.map((s) => s.total / 1e9), // in billions
        backgroundColor: "#5192a5",
      },
    ],
  };

  // Line Chart – Deal Value Over Time
  const lineData = {
    labels: filteredDeals.map((d) => d.date),
    datasets: [
      {
        label: "Deal Value ($)",
        data: filteredDeals.map((d) => d.value / 1e9),
        fill: false,
        borderColor: "#ff791f",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] px-6 py-10">
      <h1 className="text-3xl font-bold text-[#565656] mb-4">📊 Analytics</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[#5192a5] text-lg">Total Deal Value</div>
          <div className="text-2xl font-bold">${(totalValue / 1e9).toFixed(2)}B</div>
        </div>
        <div>
          <div className="text-[#5192a5] text-lg">Total Deals</div>
          <div className="text-2xl font-bold">{totalDeals}</div>
        </div>
        <div>
          <label className="text-[#565656] font-semibold mr-2">Sector:</label>
          <select
            className="rounded-lg border p-2"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option>All</option>
            {sectors.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-[#565656]">By Sector</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-[#565656]">Over Time</h2>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
