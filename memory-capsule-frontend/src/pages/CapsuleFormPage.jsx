import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function CapsuleFormPage() {
  const [title, setTitle] = useState("");
  const [messageType, setMessageType] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState(null);
  const [unlockDate, setUnlockDate] = useState("");
  const [unlockTime, setUnlockTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && token) {
      axios
        .get(`/capsules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const capsule = res.data;
          setTitle(capsule.title);
          setMessageType(capsule.messageType || "");
          setTextContent(capsule.textContent || "");
          const dateTime = new Date(capsule.unlockDate);
          setUnlockDate(dateTime.toISOString().slice(0, 10));
          setUnlockTime(dateTime.toISOString().slice(11, 16));
        })
        .catch((error) => {
          console.error("Error fetching capsule:", error);
          setError("Failed to load capsule data.");
        });
    } else if (!token) {
      navigate("/login");
    }
  }, [id, isEditing, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!title) {
      setError("Title is required!");
      setIsSubmitting(false);
      return;
    }
    if (!unlockDate || !unlockTime) {
      setError("Both unlock date and time are required!");
      setIsSubmitting(false);
      return;
    }
    if (!token) {
      setError("No authentication token found. Please log in.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    const combinedDateTime = `${unlockDate}T${unlockTime}:00`;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("messageType", messageType);
    formData.append("textContent", textContent);
    formData.append("unlockDate", combinedDateTime);
    if (file) {
      formData.append("file", file);
    }

    try {
      const url = isEditing ? `/capsules/${id}` : "/capsules";
      const method = isEditing ? "put" : "post";
      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(
        `${isEditing ? "Updated" : "Created"} capsule:`,
        response.data
      );
      navigate("/");
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} capsule:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError(
        `Failed to ${isEditing ? "update" : "create"} capsule: ${
          error.response?.data || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 space-y-6 border-1 border-gray-200 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div>
          <h2
            className="text-3xl pb-2 font-extrabold text-gray-900 tracking-tight"
            role="heading"
            aria-level="2"
          >
            {isEditing ? "Edit Time Capsule" : "Create a Time Capsule"}
          </h2>

          <p className=" text-gray-500 text-sm">
            {isEditing
              ? "Update your memory capsule's content or media."
              : "Fill in your memory, attach media, and set an unlock date to preserve your moment."}
          </p>
        </div>

        {/* your form content here */}

        {error && (
          <div
            className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-200 flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter capsule title"
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 hover:border-gray-300 bg-gray-50 placeholder-gray-400"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="textContent"
              className="block text-sm font-semibold text-gray-700"
            >
              Text Content
            </label>
            <textarea
              id="textContent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Write your message for the future..."
              rows={5}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 resize-y hover:border-gray-300 bg-gray-50 placeholder-gray-400"
              aria-label="Capsule text content"
            />
          </div>

          <div>
            <label
              htmlFor="messageType"
              className="block text-sm font-semibold text-gray-700"
            >
              Message Type
            </label>
            <select
              id="messageType"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 hover:border-gray-300 bg-gray-50"
            >
              <option value="">-- Select type --</option>
              <option value="AUDIO">Audio</option>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>

          {messageType && (
            <div className="relative">
              <label
                htmlFor="file"
                className="block text-sm font-semibold text-gray-700"
              >
                Media File
              </label>
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-2 w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-800 file:font-semibold hover:file:bg-indigo-200 transition duration-200"
                aria-label="Upload media file"
              />
              <span
                className=" left-0 -bottom-6 text-xs text-gray-500"
                title="Supported formats: Audio (MP3, WAV), Images (JPG, PNG), Videos (MP4, MOV)"
              >
                Supported: MP3, WAV, JPG, PNG, MP4, MOV
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="unlockDate"
                className="block text-sm font-semibold text-gray-700"
              >
                Unlock Date
              </label>
              <input
                id="unlockDate"
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 hover:border-gray-300 bg-gray-50"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="unlockTime"
                className="block text-sm font-semibold text-gray-700"
              >
                Unlock Time
              </label>
              <input
                id="unlockTime"
                type="time"
                value={unlockTime}
                onChange={(e) => setUnlockTime(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 hover:border-gray-300 bg-gray-50"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200 hover:scale-105"
              aria-label="Cancel and return to dashboard"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={
                isEditing ? "Update time capsule" : "Create time capsule"
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>{isEditing ? "Update Capsule" : "Create Capsule"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
