const directChatHistoryHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId } = data;

    if (!userId || !receiverUserId) return;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      chatUpdates.updateChatHistory(
        socket.io,
        socket.id,
        conversation._id.toString()
      );
    } else {
      // fallback: no conversation found
      chatUpdates.updateChatHistory(
        socket.io,
        socket.id,
        null
      );
    }

  } catch (err) {
    console.log("Chat history error:", err);

    // safe fallback (avoid frontend crash)
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