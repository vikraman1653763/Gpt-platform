import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { API_PATHS, BASE_URL } from "../utils/apiPaths";

axios.defaults.baseURL = BASE_URL;

// Global interceptor to always send Bearer token if present
axios.interceptors.request.use((config) => {
  const tok = localStorage.getItem("token");
  if (tok) {
    config.headers = config.headers || {};
    config.headers.Authorization = tok.startsWith("Bearer ")
      ? tok
      : `Bearer ${tok}`;
  }
  return config;
});

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);

  const triedAutoCreateRef = useRef(false);

  const getErrMsg = (err) =>
    err?.response?.data?.message || err?.message || "Something went wrong";

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const { data } = await axios.get(API_PATHS.USER.DATA);
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
        if (data?.message) toast.error(data.message);
      }
    } catch (error) {
      setUser(null);
      toast.error(getErrMsg(error));
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast.error("Please log in to create a new chat.");
      navigate("/");
      const { data } = await axios.post(API_PATHS.CHAT.CREATE, {});
      if (data?.success) {
        if (data?.chat) {
          setChats((prev) => [data.chat, ...prev]);
          setSelectedChat(data.chat);
        } else {
          await fetchUsersChats();
        }
        toast.success("Chat created");
      } else {
        toast.error(data?.message || "Failed to create chat");
      }
    } catch (error) {
      toast.error(getErrMsg(error));
    }
  };

  const fetchUsersChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await axios.get(API_PATHS.CHAT.GET);
      if (data?.success) {
        const list = Array.isArray(data.chats) ? data.chats : [];
        setChats(list);

        if (list.length === 0) {
          if (!triedAutoCreateRef.current) {
            triedAutoCreateRef.current = true;
            await createNewChat();
          } else {
            setSelectedChat(null);
          }
        } else {
          setSelectedChat(list[0]);
        }
      } else if (data?.message) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrMsg(error));
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    triedAutoCreateRef.current = false;

    if (token) {
      localStorage.setItem("token", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
      fetchUser();
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user, token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    toast.success("Logged out");
  };

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,

    chats,
    setChats,
    selectedChat,
    setSelectedChat,

    theme,
    setTheme,

    token,
    setToken,

    loadingUser,
    loadingChats,

    createNewChat,
    fetchUsersChats,

    axios, // expose configured axios
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
