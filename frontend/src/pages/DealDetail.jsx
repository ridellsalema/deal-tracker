
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


const DealDetail = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/deals/${id}`)
      .then((res) => res.json())
      .then((data) => setDeal(data))
      .catch((err) => console.error('Failed to fetch deal:', err));
  }, [id]);

  if (!deal) return <div className="p-8 text-[#565656]">Loading deal...</div>;

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-8">
      <Link to="/deals" className="text-[#5192a5] underline mb-4 inline-block">← Back to deals</Link>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        {/* Info section */}

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#5192a5] mb-2">
            {deal.buyer} → {deal.target}
          </h1>

          <p className="text-[#565656] mb-1">Sector: <strong>{deal.sector}</strong></p>

          <p className="text-[#565656] mb-1">Deal Value: <span className="text-[#ff791f] font-semibold">${deal.value.toLocaleString()}</span></p>

          <p className="text-[#565656] mb-4">Date: {deal.date}</p>


          <div className="mt-4">
            <h2 className="text-xl font-semibold text-[#565656] mb-2">📄 Deal Summary</h2>

            <p className="text-sm text-[#565656] leading-relaxed">
              {/* Placeholder ** will come from OpenAI summary */}
              This deal marked a major consolidation in the {deal.sector} industry. Vodafone's acquisition of {deal.target} allowed it to expand its global footprint and restructure competitive dynamics in the market.
            </p>

            <h2 className="text-xl font-semibold text-[#565656] mt-6 mb-2">🔥 Pain Points</h2>

            <ul className="list-disc pl-6 text-sm text-[#565656]">
              <li>Regulatory hurdles across European jurisdictions</li>
              <li>Integration challenges with telecom infrastructure</li>
              <li>Shareholder concerns over deal size and debt impact</li>
            </ul>
          </div>


        </div>

      </div>
    </div>
  );
};

export default DealDetail;