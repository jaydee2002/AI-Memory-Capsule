import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("/capsules", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCapsules(res.data);
          console.log("Fetched capsules:", res.data);
        });
    }
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/capsules/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCapsules(capsules.filter((c) => c.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Your Capsules</h2>
      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/create")}
      >
        Create New Capsule
      </button>
      {capsules.map((c) => (
        <div
          key={c.id}
          className={`border p-4 mb-2 rounded shadow ${
            c.unlocked ? "border-green-500" : "border-gray-300"
          }`}
        >
          <h3 className="font-bold">{c.title}</h3>
          <p>Status: {c.unlocked ? "Unlocked 🎉" : "Locked 🔒"}</p>
          <p>Type: {c.messageType}</p>
          <p>Unlock Date: {c.unlockDate}</p>
          {c.aiSummary && (
            <p className="italic text-gray-600">Reflection: {c.aiSummary}</p>
          )}

          {c.fileUrl && (
            <a
              href={c.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              View Media
            </a>
          )}
          <p>{c.textContent}</p>
          <button
            onClick={() => handleDelete(c.id)}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
