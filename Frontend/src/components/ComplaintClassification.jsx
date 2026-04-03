import { useState } from "react";
import { predictComplaint } from "../hooks/api";
import { Header } from "./layout/header";

function ComplaintClassification() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handlePredict = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await predictComplaint(text);

      const record = {
        text,
        department: res.department,
        time: new Date().toLocaleString(),
      };

      setResult(res.department);
      setHistory((prev) => [record, ...prev]);
      setText("");
    } catch (err) {
      alert("Error calling ML API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Content Wrapper */}
      <div className="max-w-6xl mx-auto mt-6 px-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT SIDE — Prediction */}
<div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 h-fit">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-primary to-[#F7941D] px-6 py-5 rounded-t-2xl text-white">
              <h2 className="text-2xl font-bold">MNGL Issue Classification</h2>
              <p className="text-sm text-white/90 mt-1">
                AI-powered complaint routing system
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              <textarea
                rows={5}
                placeholder="Enter customer complaint..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full mt-5 bg-primary hover:bg-primary/90 disabled:opacity-50 py-3 rounded-xl text-sm font-medium text-white shadow-md transition"
              >
                {loading ? "Predicting..." : "Predict Department"}
              </button>

              {result && (
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Predicted Department
                  </p>
                  <h3 className="text-xl font-semibold mt-2 text-primary">
                    {result}
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE — History */}
<div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Prediction History
            </h3>

            {history.length > 0 ? (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <p className="text-sm text-gray-700 mb-3">{item.text}</p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {item.department}
                      </span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No predictions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintClassification;
