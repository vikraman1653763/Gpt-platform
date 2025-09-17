import Chat from "../models/Chat.js";

// new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };
    await Chat.create(chatData);
    return res.status(500).json({ success: true, message: "Chat created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// delete chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const { chatId } = req.body;
    await Chat.deleteOne({ _id: chatId, userId });

    return res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
