import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("/auth/register", { username, email, password });
    navigate("/login");
  };

  return (
    <form onSubmit={handleRegister} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Register</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="block w-full mb-2 border p-2"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="block w-full mb-2 border p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="block w-full mb-2 border p-2"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}
