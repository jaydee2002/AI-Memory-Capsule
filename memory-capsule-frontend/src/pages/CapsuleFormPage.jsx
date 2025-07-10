import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function CapsuleFormPage() {
  const [title, setTitle] = useState("");
  const [messageType, setMessageType] = useState("TEXT");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState(null);
  const [unlockDate, setUnlockDate] = useState("");
  const [error, setError] = useState("");
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
          setMessageType(capsule.messageType);
          setTextContent(capsule.textContent || "");
          setUnlockDate(
            new Date(capsule.unlockDate).toISOString().slice(0, 16)
          );
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

    if (!title) {
      setError("Title is required!");
      return;
    }
    if (!unlockDate) {
      setError("Unlock date is required!");
      return;
    }
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("messageType", messageType);
    formData.append("textContent", textContent);
    formData.append("unlockDate", unlockDate);
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
    }
  };

  return (
    <div className=" bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-2xl p-8 space-y-6">
        <h2
          className="text-3xl font-bold text-gray-900 text-center"
          role="heading"
          aria-level="2"
        >
          {isEditing ? "Edit Time Capsule" : "Create a Time Capsule"}
        </h2>

        {error && (
          <div
            className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">
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
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              required
              aria-required="true"
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
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              aria-label="Select message type"
            >
              <option value="TEXT">Text</option>
              <option value="AUDIO">Audio</option>
              <option value="VIDEO">Video</option>
            </select>
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
              placeholder="Enter your message"
              rows={5}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
              aria-label="Capsule text content"
            />
          </div>

          <div>
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
              className="mt-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-800 file:font-semibold hover:file:bg-indigo-200 transition duration-200"
              aria-label="Upload media file"
            />
          </div>

          <div>
            <label
              htmlFor="unlockDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Unlock Date
            </label>
            <input
              id="unlockDate"
              type="datetime-local"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              required
              aria-required="true"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
              aria-label="Cancel and return to dashboard"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
              aria-label={
                isEditing ? "Update time capsule" : "Create time capsule"
              }
            >
              {isEditing ? "Update Capsule" : "Create Capsule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
