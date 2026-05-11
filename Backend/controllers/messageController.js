const Message = require("../models/message");

/**
 * GET /api/messages/:conversationId
 * Query:
 *  - page (default: 0)
 *  - limit (default: 20)
 */
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // validation
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 0, 0);
    const limit = Math.min(parseInt(req.query.limit) || 20, 50); // max 50

    // fetch messages
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 }) // latest first
      .skip(page * limit)
      .limit(limit)
      .populate("sender", "username email avatar");

    // reverse for UI (old → new)
    const orderedMessages = messages.reverse();

    // total count (for frontend optional use)
    const total = await Message.countDocuments({
      conversation: conversationId,
    });

    res.status(200).json({
      success: true,
      data: {
        messages: orderedMessages,
        page,
        limit,
        total,
        hasMore: page * limit + messages.length < total,
      },
    });

  } catch (err) {
    console.log("getMessages error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

module.exports = {
  getMessages,
};