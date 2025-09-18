import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
import { API_PATHS } from "../utils/apiPaths";

const ChatBox = () => {
  const { selectedChat, theme, user, axios, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const containerRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) return toast.error("Login to chat");
      if (!selectedChat?._id) return toast.error("Please create/select a chat");

      setLoading(true);

      const promptCopy = prompt.trim();
      if (!promptCopy) {
        setLoading(false);
        return;
      }

      // optimistic append of user's message
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: promptCopy,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);
      setPrompt("");

      const MESSAGE_ENDPOINT = {
        text: API_PATHS.MESSAGE.TEXT,
        image: API_PATHS.MESSAGE.IMAGE,
      };
      const endpoint = MESSAGE_ENDPOINT[mode];

      const body =
        mode === "image"
          ? { chatId: selectedChat._id, prompt: promptCopy, isPublished }
          : { chatId: selectedChat._id, prompt: promptCopy };

      const { data } = await axios.post(endpoint, body);

      if (data?.success) {
        setMessages((prev) => [...prev, data.reply]);
        if (mode === "image") {
          setUser((prev) => ({ ...prev, credits: (prev?.credits ?? 0) - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credits: (prev?.credits ?? 0) - 1 }));
        }
      } else {
        toast.error(data?.message || "Something went wrong");
        // restore input on failure
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error?.message || "Request failed");
    } finally {
      setLoading(false);
      setPrompt('')
    }
  };

  
  useEffect(() => {
    if (selectedChat?.messages) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);
 
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  return (
    <div className=" flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* chat messages */}
      <div ref={containerRef} className=" flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className=" h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className=" w-full max-w-56 sm:max-w-68 "
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {loading && (
          <div className=" loader flex items-center gap-1.5">
            <div className=" w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className=" w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className=" w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Publish image */}
      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <span className="text-xs">Publish Generated Image to Community</span>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="peer appearance-none w-4 h-4 border-1 border-gray-400 rounded-full 
               checked:bg-purple-600 checked:border-purple-600 relative cursor-pointer"
          />
        </label>
      )}

      {/* prompt input box */}
      <form
        onSubmit={onSubmit}
        className=" bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className=" text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
        </select>
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="flex-1 w-full text-sm outline-none"
          required
        />
        <button disabled={loading} type="submit">
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className=" w-8 cursor-pointer"
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
