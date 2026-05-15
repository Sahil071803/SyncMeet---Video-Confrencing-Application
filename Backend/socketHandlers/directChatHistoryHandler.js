const Message = require("../models/message");
const Conversation = require("../models/conversation");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;

    if (!userId || !receiverUserId) return;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      const messages = await Message.find({ conversation: conversation._id })
        .sort({ createdAt: 1 })
        .populate("sender", "username email avatar");

      socket.emit("direct-chat-history", {
        conversationId: conversation._id,
        messages: messages || [],
        participants: [userId, receiverUserId],
      });
    } else {
      socket.emit("direct-chat-history", {
        conversationId: null,
        messages: [],
        participants: [],
      });
    }

  } catch (err) {
    console.log("Chat history error:", err);

    if (socket?.io) {
      socket.io.to(socket.id).emit("direct-chat-history", {
        conversationId: null,
        messages: [],
        participants: [],
        error: "Failed to load chat history",
      });
    }
  }
};

module.exports = directChatHistoryHandler;