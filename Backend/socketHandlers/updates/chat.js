const Conversation = require("../../models/conversation");
const Message = require("../../models/message");

const updateChatHistory = async (io, socketId, conversationId) => {
  try {
    if (!conversationId || !socketId) return;

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username email avatar");

    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "username email");

    if (!conversation) {
      io.to(socketId).emit("direct-chat-history", {
        conversationId,
        messages: [],
        participants: [],
      });
      return;
    }

    io.to(socketId).emit("direct-chat-history", {
      conversationId: conversation._id,
      messages: messages || [],
      participants: conversation.participants || [],
    });

  } catch (err) {
    console.log("updateChatHistory error:", err);

    io.to(socketId).emit("direct-chat-history", {
      conversationId,
      messages: [],
      participants: [],
      error: "Failed to load chat history",
    });
  }
};

module.exports = {
  updateChatHistory,
};
