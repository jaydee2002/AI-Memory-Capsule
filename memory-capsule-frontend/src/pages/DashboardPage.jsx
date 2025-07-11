import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Lock,
  Unlock,
  FileText,
  Trash2,
  Edit2,
  MoreVertical,
  ExternalLink,
  Clipboard,
  Check,
} from "lucide-react";
import ClickSpark from "../components/ClickSpark.jsx";

async function fetchFileUrl(fileName, token) {
  const res = await fetch(
    `http://localhost:8080/api/files/url?fileName=${fileName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.ok) {
    const url = await res.text();
    return url;
  } else {
    throw new Error("Failed to get file URL");
  }
}

export default function DashboardPage() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [fileUrls, setFileUrls] = useState({}); // Store pre-signed URLs
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
        .then((res) => setCapsules(res.data))
        .catch((error) => console.error("Error fetching capsules:", error))
        .finally(() => setLoading(false));
    }
  }, [navigate, token]);

  // Fetch pre-signed URLs for capsules with fileUrl
  useEffect(() => {
    const fetchUrls = async () => {
      const urlPromises = capsules
        .filter((c) => c.fileUrl && !fileUrls[c.id]) // Only fetch for capsules without cached URLs
        .map(async (c) => {
          try {
            const fileKey = c.fileUrl.replace(
              "https://memory-capsule-bucket.s3.eu-north-1.amazonaws.com/",
              ""
            );
            const url = await fetchFileUrl(fileKey, token);
            return { id: c.id, url };
          } catch (error) {
            console.error(`Error fetching URL for capsule ${c.id}:`, error);
            return { id: c.id, url: null };
          }
        });

      const results = await Promise.all(urlPromises);
      setFileUrls((prev) => ({
        ...prev,
        ...results.reduce((acc, { id, url }) => ({ ...acc, [id]: url }), {}),
      }));
    };

    if (capsules.length > 0) {
      fetchUrls();
    }
  }, [capsules, token, fileUrls]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/capsules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCapsules(capsules.filter((c) => c.id !== id));
      setFileUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[id]; // Remove URL for deleted capsule
        return newUrls;
      });
    } catch (error) {
      console.error("Error deleting capsule:", error);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <ClickSpark
        sparkColor="#6366f1"
        sparkSize={12}
        sparkRadius={18}
        sparkCount={10}
        duration={500}
      >
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Your Time Capsules
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl">
                Preserve your memories, messages, or media for the future.
                Create and manage your time capsules, securely stored and
                unlocked at your chosen date.
              </p>
            </div>
            <button
              onClick={() => navigate("/create")}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 animate-blink"
            >
              <Plus className="w-5 h-5" />
              Create New Capsule
            </button>
          </header>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : capsules.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
              <FileText className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-4">
                No capsules yet. Start by creating your first one!
              </p>
              <button
                onClick={() => navigate("/create")}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 animate-pulse"
              >
                Create Now
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {capsules.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-6 rounded-2xl border border-gray-200 transition-all duration-100 transform hover:-translate-y-1 relative"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {c.title}
                  </h3>

                  {c.textContent && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {c.textContent}
                    </p>
                  )}

                  <div className="text-sm space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      {c.unlocked ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Unlock className="w-4 h-4 mr-1" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Lock className="w-4 h-4 mr-1" />
                          Locked
                        </span>
                      )}
                      {c.fileUrl && (
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                          {c.messageType}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-medium">Hash:</span>
                      <span
                        onClick={() => {
                          navigator.clipboard.writeText(c.blockchainHash);
                          setCopiedId(c.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 truncate max-w-[150px]"
                        title="Click to copy"
                      >
                        {c.blockchainHash}
                      </span>
                      {copiedId === c.id ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clipboard className="w-4 h-4 text-gray-400 hover:text-gray-600 flex-shrink-0" />
                      )}
                    </div>

                    <div className="text-gray-600">
                      <span className="font-medium">Unlock Date:</span>{" "}
                      {new Date(c.unlockDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {c.aiSummary && (
                      <div className="text-sm text-gray-500 italic line-clamp-2">
                        <span className="font-medium text-gray-600">
                          Reflection:
                        </span>{" "}
                        {c.aiSummary}
                      </div>
                    )}
                  </div>

                  {c.fileUrl && fileUrls[c.id] && (
                    <a
                      href={fileUrls[c.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4 transition-colors"
                    >
                      View Media <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === c.id ? null : c.id)
                      }
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === c.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-10 transform transition-all duration-200 ease-in-out">
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            navigate(`/edit/${c.id}`);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 inline mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            handleDelete(c.id);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
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
