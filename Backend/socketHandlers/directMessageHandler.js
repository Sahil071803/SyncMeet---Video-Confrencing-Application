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
    const messageType = data?.messageType || "text";
    const fileUrl = data?.fileUrl || "";
    const fileName = data?.fileName || "";
    const fileSize = data?.fileSize || 0;

    // =============================
    // VALIDATION
    // =============================
    if (!receiverId) {
      return {
        status: "error",
        message: "Invalid message data",
      };
    }

    if (messageType === "text" && !content) {
      return {
        status: "error",
        message: "Message content required",
      };
    }

    if ((messageType === "image" || messageType === "file") && !fileUrl) {
      return {
        status: "error",
        message: "File URL required",
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
        content: content || (messageType !== "text" ? fileName : ""),
        messageType,
        fileUrl,
        fileName,
        fileSize,
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

      content: newMessage.content,

      conversationId:
        conversation._id.toString(),

      createdAt:
        newMessage.createdAt,

      messageType:
        newMessage.messageType,

      fileUrl: newMessage.fileUrl,
      fileName: newMessage.fileName,
      fileSize: newMessage.fileSize,
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