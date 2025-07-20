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

  // Add new state variables
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Add new function for comprehensive analysis
  const handleAnalyzeDeal = async () => {
    if (!deal) return;
    
    setAnalysisLoading(true);
    try {
      const description = deal.description || `${deal.buyer} acquired ${deal.target} for $${deal.value} in the ${deal.sector} sector.`;
      
      const res = await axios.post("http://localhost:8000/api/ai/analyze", {
        text: description,
        buyer: deal.buyer,
        target: deal.target,
      });
      
      setAnalysis(res.data);
    } catch (err) {
      console.error("Error analyzing deal:", err);
    } finally {
      setAnalysisLoading(false);
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

      {analysis && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
          
          {/* Sentiment */}
          {analysis.sentiment && (
            <div className="mb-3">
              <h4 className="font-medium">Sentiment</h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  analysis.sentiment.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                  analysis.sentiment.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {analysis.sentiment.sentiment}
                </span>
                <span className="text-sm text-gray-600">
                  Confidence: {(analysis.sentiment.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
          
          {/* Suggested Tags */}
          <div className="mb-3">
            <h4 className="font-medium">Suggested Tags</h4>
            <div className="flex gap-2 mt-1">
              {analysis.suggested_sector && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {analysis.suggested_sector}
                </span>
              )}
              {analysis.suggested_geography && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                  {analysis.suggested_geography}
                </span>
              )}
            </div>
          </div>
          
          {/* Entities */}
          {analysis.entities && (
            <div>
              <h4 className="font-medium">Detected Entities</h4>
              <div className="text-sm text-gray-600 mt-1">
                {analysis.entities.organizations.length > 0 && (
                  <div>Organizations: {analysis.entities.organizations.join(', ')}</div>
                )}
                {analysis.entities.locations.length > 0 && (
                  <div>Locations: {analysis.entities.locations.join(', ')}</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleAnalyzeDeal}
        className="bg-purple-600 text-white px-4 py-2 mt-3 ml-3 rounded hover:bg-purple-700 transition-colors duration-200"
        disabled={analysisLoading}
      >
        {analysisLoading ? "Analyzing..." : "AI Analysis"}
      </button>
    </div>
  );
};

export default DealDetail;
