import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DealDetail = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [buttonState, setButtonState] = useState("idle"); // idle | loading | error | done

  // Fetch deal
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/deals/${id}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setDeal(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  // Generating summary with ollama
  const handleGenerateSummary = async () => {
    if (buttonState === "loading" || buttonState === "done") return;
    
    setButtonState("loading");
    setSummary("");
    setError("");
    
    // Create a description from deal data if none exists
    const description = deal.description || `${deal.buyer} acquired ${deal.target} for $${deal.value} in the ${deal.sector} sector.`;
    
    try {
      const res = await axios.post("http://localhost:8000/api/ai/summarize", {
        buyer: deal.buyer,
        target: deal.target,
        description: description,
      });
      setSummary(res.data.summary);
      setButtonState("done");
    } catch (err) {
      setSummary("");
      setButtonState("error");
      setError("Error generating summary: " + (err?.message || err));
    }
  };


  if (loading) return <p>Loading deal...</p>;
  if (error) return <p>{error}</p>;
  if (!deal) return <p>No deal found.</p>;

  console.log("Deal object:", deal); // Debug log

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
      <h2>{deal.title || `${deal.buyer} Acquires ${deal.target}`}</h2>
      <p><strong>Buyer:</strong> {deal.buyer}</p>
      <p><strong>Target:</strong> {deal.target}</p>
      <p><strong>Value:</strong> ${deal.value}</p>
      <p><strong>Sector:</strong> {deal.sector}</p>
      <p><strong>{summary ? "Summary" : "Description"}:</strong> {summary || deal.description || "No description yet."}</p>

      <button
        onClick={handleGenerateSummary}
        className={`bg-[#ff791f] text-white px-4 py-2 mt-3 rounded hover:bg-[#d6681b] transition-colors duration-200 ${buttonState === "error" ? "bg-red-600 hover:bg-red-700" : ""} ${buttonState === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={buttonState === "loading" || buttonState === "done"}
      >
        {buttonState === "loading"
          ? "Generating summary..."
          : buttonState === "error"
          ? "Error"
          : "Generate Summary"}
      </button>
    </div>
  );
};

export default DealDetail;
