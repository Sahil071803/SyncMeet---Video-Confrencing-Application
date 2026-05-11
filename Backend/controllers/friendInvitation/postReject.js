const FriendInvitation = require("../../models/friendInvitation");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;

    await FriendInvitation.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Invitation rejected",
    });
  } catch (err) {
    console.log("REJECT ERROR:", err);

    return res.status(500).send("Something went wrong");
  }
};

module.exports = postReject;