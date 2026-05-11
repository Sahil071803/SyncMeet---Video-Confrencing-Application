const User = require("../../models/user");

const removeFriend = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const friendId = req.params.id;

    console.log(
      "REMOVE:",
      userId,
      friendId
    );

    // REMOVE FRIEND FROM USER
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          friends: friendId,
        },
      }
    );

    // REMOVE USER FROM FRIEND
    await User.findByIdAndUpdate(
      friendId,
      {
        $pull: {
          friends: userId,
        },
      }
    );

    return res.status(200).json({
      message: "Friend removed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = removeFriend;