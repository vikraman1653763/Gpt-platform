import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { navigate, chats, setSelectedChat, theme, setTheme, user } =
    useAppContext();
  const [search, setSearch] = useState("");
  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-[#242124]/30 to-[#000]/30 border-r border-[#80609f]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 
        ${
        !isMenuOpen && "max-md:-translate-x-full"
      }`}
    >
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="logo"
        className=" w-full max-w-48"
      />
      {/* new chat button  */}
      <button className=" flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#a456f7] to-[#3d81f6] text-sm rounded-md cursor-pointer">
        <span className="mr-2 text-xl">+</span> New Chat
      </button>
      {/* search conversation  */}
      <div className=" flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img
          src={assets.search_icon}
          alt="search icon"
          className=" w-4 not-dark:invert"
        />
        <input
          type="text"
          className=" text-xs placeholder:text-gray-400 outline-none"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search conversations"
        />
      </div>
      {/* Recernt chats  */}
      {chats.length > 0 && <p className=" mt-4 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
          navigate("/")
          setIsMenuOpen(false)
          setSelectedChat(chat)
        }}
              className="p-2 px-4 dark:bg-[#57317c]/10 border border-gray-300 dark:border-[#80609f]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className=" truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className=" text-xs text-gray-500 dark:text-[#b1a6c0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                alt="bin"
                className=" hidden group-hover:block w-4 cursor-pointer not-dark:invert"
              />
            </div>
          ))}
      </div>
      {/* community images  */}
      <div
        onClick={() => {
          navigate("/community")
          setIsMenuOpen(false)
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img
          src={assets.gallery_icon}
          alt="gallery icon"
          className=" w-4.5 not-dark:invert"
        />
        <div className=" flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>
      {/* Credit Purchase   */}
      <div
        onClick={() => {navigate("/credits") 
          setIsMenuOpen(false)}}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 translate-all"
      >
        <img
          src={assets.diamond_icon}
          alt="credit"
          className=" w-4.5 not-dark:invert"
        />
        <div className=" flex flex-col text-sm">
          <p>Credits : {user?.credits}</p>
          <p className="text-xs text-gray-400">
            Purchase credits to use vikgpt
          </p>
        </div>
      </div>

      {/* Drak mode toggle  */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md ">
        <div className=" flex  items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            className=" w-4 not-dark:invert"
            alt="theme"
          />
          <p>Dark Mode</p>
          <label className="relative cursor-pointer inline-flex">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              className=" sr-only peer"
            />
            <div className=" w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all">
              <span className=" absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
            </div>
          </label>
        </div>
      </div>
      {/* USer Account*/}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img
          src={assets.user_icon}
          alt="gallery icon"
          className=" w-7 rounded-full"
        />

        <p className=" flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login your account"}
        </p>
        {user && (
          <img
            src={assets.logout_icon}
            className=" h-5 cursor-pointer hidden not-dark:invert group-hover:block"
          />
        )}
      </div>
      {/* close  */}
      <img
        onClick={() => {
          setIsMenuOpen(false);
        }}
        src={assets.close_icon}
        alt="close"
        className=" absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
      />
    </div>
  );
};

export default Sidebar;
