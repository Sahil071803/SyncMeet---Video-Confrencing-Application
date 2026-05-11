const Message = require("../models/message");
const Conversation = require("../models/conversation");
const serverStore = require("../serverStore");

const directMessageHandler = async (
  socket,
  data
) => {
  try {
    const senderId = socket.user?.userId;

    if (!senderId) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    const receiverId = data?.receiverId;
    const content = data?.content?.trim();

    // =============================
    // VALIDATION
    // =============================
    if (!receiverId || !content) {
      return {
        status: "error",
        message: "Invalid message data",
      };
    }

    // =============================
    // FIND CONVERSATION
    // =============================
    let conversation =
      await Conversation.findOne({
        participants: {
          $all: [senderId, receiverId],
        },
      });

    // =============================
    // CREATE CONVERSATION
    // =============================
    if (!conversation) {
      conversation =
        await Conversation.create({
          participants: [
            senderId,
            receiverId,
          ],
        });
    }

    // =============================
    // CREATE MESSAGE
    // =============================
    const newMessage =
      await Message.create({
        sender: senderId,
        receiver: receiverId,
        conversation: conversation._id,
        content,
        messageType: "text",
        seenBy: [senderId],
      });

    // =============================
    // UPDATE CONVERSATION
    // =============================
    conversation.lastMessage =
      newMessage._id;

    await conversation.save();

    // =============================
    // SOCKET PAYLOAD
    // =============================
    const messageData = {
      _id: newMessage._id.toString(),

      senderId,
      receiverId,

      content,

      conversationId:
        conversation._id.toString(),

      createdAt:
        newMessage.createdAt,

      messageType:
        newMessage.messageType,
    };

    // =============================
    // GET SOCKETS
    // =============================
    const receiverSockets =
      serverStore.getSocketIds(receiverId);

    const senderSockets =
      serverStore.getSocketIds(senderId);

    const allSockets = [
      ...receiverSockets,
      ...senderSockets,
    ];

    return {
      status: "success",
      message: messageData,
      receiverSockets: [
        ...new Set(allSockets),
      ],
    };

  } catch (err) {
    console.log(
      "❌ directMessageHandler error:",
      err
    );

    return {
      status: "error",
      message: "Server error",
    };
  }
};

module.exports = directMessageHandler;