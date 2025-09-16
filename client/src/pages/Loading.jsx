import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="bg-gradient-to-b from-[#531b81] to-[#29184b] dark:from-black dark:to-black flex items-center justify-center h-screen w-screen text-white text-2xl">
  <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent dark:border-purple-600 dark:border-t-transparent animate-spin"></div>
</div>

  );
};

export default Loading;
