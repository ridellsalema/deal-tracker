import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  // Fetch deals from backend API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/deals/')
      .then((res) => res.json())
      .then((data) => setDeals(data))
      .catch((err) => console.error('Failed to fetch deals:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f0f0] px-4 py-8">

      <h1 className="text-5xl font-bold text-[#565656] mb-6">Investment Banking Deals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {deals.map((deal) => (

          <div
            key={deal.id}
            cclassName="cursor-pointer rounded-2xl bg-white shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border-t-4 border-[#5192a5]"
            onClick={() => navigate(`/deals/${deal.id}`)}
          >
            
            <h2 className="text-xl font-semibold text-[#5192a5] mb-1">
              {deal.buyer} → {deal.target}
            </h2>

            <p className="text-sm text-[#565656] mb-1">Sector: <span className="font-medium">{deal.sector}</span></p>

            <p className="text-sm text-[#565656] mb-1">Value: <span className="font-medium text-[#ff791f]">${deal.value.toLocaleString()}</span></p>

            <p className="text-sm text-[#565656]">Date: {deal.date}</p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default DealList;
