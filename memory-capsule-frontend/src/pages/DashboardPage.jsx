import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Plus, Lock, Unlock, FileText, Trash2, Edit2 } from "lucide-react";
import ClickSpark from "../components/ClickSpark.jsx";

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
        })
        .catch((error) => {
          console.error("Error fetching capsules:", error);
        });
    }
  }, [navigate, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/capsules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCapsules(capsules.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting capsule:", error);
    }
  };

  return (
    <div className=" bg-gradient-to-b py-10 px-4 sm:px-6 lg:px-8">
      <ClickSpark
        sparkColor="#f23ff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        {/* Your content here */}

        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
              role="heading"
              aria-level="2"
            >
              Your Time Capsules
            </h2>

            <button
              onClick={() => navigate("/create")}
              className="group inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 transition-all duration-300"
              aria-label="Create a new time capsule"
            >
              <Plus
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                aria-hidden="true"
              />
              New Capsule
            </button>
          </header>

          {capsules.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-2xl border border-gray-200"
              role="alert"
            >
              <FileText
                className="w-12 h-12 mx-auto text-indigo-400 mb-4"
                aria-hidden="true"
              />
              <p className="text-lg font-medium text-gray-600">
                No capsules yet. Start by creating your first time capsule!
              </p>
              <button
                onClick={() => navigate("/create")}
                className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300"
                aria-label="Create your first time capsule"
              >
                Create Now
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {capsules.map((c) => (
                <div
                  key={c.id}
                  className="relative bg-gray-100 p-6 rounded-sm border border-gray-200 "
                  role="article"
                  aria-labelledby={`capsule-title-${c.id}`}
                >
                  <h3
                    id={`capsule-title-${c.id}`}
                    className="text-xl font-semibold text-gray-900 tracking-tight"
                  >
                    {c.title}
                  </h3>

                  {c.textContent && (
                    <p
                      className="text-gray-600 line-clamp-2"
                      aria-label={`Capsule content: ${c.textContent}`}
                    >
                      {c.textContent}
                    </p>
                  )}
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      {c.isUnlocked ? (
                        <span className="flex items-center text-green-600">
                          <Unlock className="w-4 h-4 mr-1" aria-hidden="true" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="flex items-center text-gray500">
                          <Lock className="w-4 h-4 mr-1" aria-hidden="true" />
                          Locked
                        </span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span> {c.messageType}
                    </p>
                    <p className="truncate">
                      <span className="font-medium">Hash:</span>{" "}
                      <span className="text-xs text-gray-400">
                        {c.blockchainHash}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Unlock Date:</span>{" "}
                      {new Date(c.unlockDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {c.aiSummary && (
                      <p className="text-gray-500 italic line-clamp-2">
                        <span className="font-medium">Reflection:</span>{" "}
                        {c.aiSummary}
                      </p>
                    )}
                  </div>

                  {c.fileUrl && (
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
                      aria-label={`View media for capsule ${c.title}`}
                    >
                      View Media
                    </a>
                  )}

                  <div className="mt-5 flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/edit/${c.id}`)}
                      className="group inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300"
                      aria-label={`Edit capsule ${c.title}`}
                    >
                      <Edit2
                        className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="group inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition-all duration-300"
                      aria-label={`Delete capsule ${c.title}`}
                    >
                      <Trash2
                        className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ClickSpark>
    </div>
  );
}
