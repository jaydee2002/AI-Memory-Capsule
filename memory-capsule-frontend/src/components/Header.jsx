import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("email") || ""
  );

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
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-800/30  py-4 ">
      <div className="max-w-6xl mx-auto  flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          <a
            href="/"
            className="hover:text-indigo-200 transition-colors duration-200"
          >
            MemoryCapsule
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 md:space-x-8">
          {isAuthenticated ? (
            <>
              <span className="text-white text-sm md:text-base font-medium truncate max-w-[200px]">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-indigo-100 hover:text-white font-medium text-sm md:text-base transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-white hover:text-white font-medium text-sm md:text-base transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/register"
                className="text-white hover:text-white font-medium text-sm md:text-base transition-colors duration-200"
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
