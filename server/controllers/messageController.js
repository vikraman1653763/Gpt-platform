import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

// helper
const bufferToBase64DataUrl = (buf, mime = "image/png") =>
  `data:${mime};base64,${Buffer.from(buf, "binary").toString("base64")}`;

// -------------------- TEXT GENERATION --------------------
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.status(200).json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;
    if (!chatId || !prompt) {
      return res.status(400).json({ success: false, message: "chatId and prompt are required" });
    }

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    // respond first for snappy UX
    res.status(200).json({ success: true, reply });

    // then persist + debit
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- IMAGE GENERATION --------------------
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.status(200).json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;
    if (!chatId || !prompt) {
      return res.status(400).json({ success: false, message: "chatId and prompt are required" });
    }

    // find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // IMPORTANT: no on-the-fly transform query (?tr=...)
    const encodedPrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png`;

    // fetch the generated image bytes
    const { data: imgBuffer } = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // upload the raw image to your ImageKit storage (no transformation)
    const uploadResponse = await imagekit.upload({
      file: bufferToBase64DataUrl(imgBuffer, "image/png"),
      fileName: `${Date.now()}.png`,
      folder: "vikgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    // respond first
    res.status(200).json({ success: true, reply });

    // then persist + debit
    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
