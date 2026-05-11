const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    // find invitation
    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(404).send("Invitation not found");
    }

    // users
    const { senderId, receiverId } = invitation;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).send("Users not found");
    }

    // prevent duplicates
    if (
      !sender.friends.includes(receiverId)
    ) {
      sender.friends.push(receiverId);
    }

    if (
      !receiver.friends.includes(senderId)
    ) {
      receiver.friends.push(senderId);
    }

    await sender.save();
    await receiver.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (err) {
    console.log("ACCEPT ERROR:", err);

    return res.status(500).send("Something went wrong");
  }
};

module.exports = postAccept;