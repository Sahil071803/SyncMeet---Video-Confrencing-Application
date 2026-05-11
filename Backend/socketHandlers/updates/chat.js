const Conversation = require("../../models/conversation");

/**
 * Emit updated chat history to client
 * Optimized for real-time chat apps
 */
const updateChatHistory = async (io, socketId, conversationId) => {
  try {
    if (!conversationId || !socketId) return;

    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "firstName lastName email")
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }, // ensure correct order
      });

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
      messages: conversation.messages || [],
      participants: conversation.participants || [],
    });

  } catch (err) {
    console.log("updateChatHistory error:", err);

    // fallback safe response (avoid frontend crash)
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