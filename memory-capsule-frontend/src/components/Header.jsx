import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("email") || ""
  );

  // Update state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setUserEmail(localStorage.getItem("email") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
    setUserEmail("");
    navigate("/login");
  };

  return (
    <header className="p-4 bg-black border-b-1 border-gray-200 ">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="text-white">
            MemoryCapsule
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-white ">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:underline transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-white hover:underline transition"
              >
                Login
              </a>
              <a
                href="/register"
                className="text-white hover:underline transition"
              >
                Register
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
