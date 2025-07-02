import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateCapsulePage() {
  const [title, setTitle] = useState("");
  const [messageType, setMessageType] = useState("TEXT");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState(null);
  const [unlockDate, setUnlockDate] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Title is required!");
      return;
    }
    if (!unlockDate) {
      alert("Unlock date is required!");
      return;
    }
    if (!token) {
      alert("No authentication token found. Please log in.");
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

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // Create a new axios instance for this request
      const customAxios = axios.create({
        baseURL: "http://localhost:8080/api",
      });
      const response = await customAxios.post("/capsules", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating capsule:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      alert(
        `Failed to create capsule: ${error.response?.data || error.message}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Create Capsule</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full mb-2 border p-2"
        required
      />
      <select
        value={messageType}
        onChange={(e) => setMessageType(e.target.value)}
        className="block w-full mb-2 border p-2"
      >
        <option value="TEXT">Text</option>
        <option value="AUDIO">Audio</option>
        <option value="VIDEO">Video</option>
      </select>
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Text content"
        className="block w-full mb-2 border p-2"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-2"
      />
      <input
        type="datetime-local"
        value={unlockDate}
        onChange={(e) => setUnlockDate(e.target.value)}
        className="block w-full mb-2 border p-2"
        required
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
}
