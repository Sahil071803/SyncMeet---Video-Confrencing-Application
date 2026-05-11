import { openAlertMessage } from "./alertActions";
import * as api from "../../api";

// =======================================
// ACTION TYPES
// =======================================

export const friendsActions = {
  SET_FRIENDS: "FRIENDS.SET_FRIENDS",

  SET_PENDING_FRIENDS_INVITATIONS:
    "FRIENDS.SET_PENDING_FRIENDS_INVITATIONS",

  SET_ONLINE_USERS:
    "FRIENDS.SET_ONLINE_USERS",
};

// =======================================
// NORMAL ACTIONS
// =======================================

export const setPendingFriendsInvitations = (
  pendingFriendsInvitations
) => ({
  type:
    friendsActions.SET_PENDING_FRIENDS_INVITATIONS,
  pendingFriendsInvitations,
});

export const setFriends = (friends) => ({
  type: friendsActions.SET_FRIENDS,
  friends,
});

export const setOnlineUsers = (onlineUsers) => ({
  type:
    friendsActions.SET_ONLINE_USERS,
  onlineUsers,
});

// =======================================
// SEND INVITATION
// =======================================

export const sendFriendInvitation =
  (data, closeDialogHandler) =>
  async (dispatch) => {
    try {
      const response =
        await api.sendFriendInvitation(data);

      if (response?.error) {
        return dispatch(
          openAlertMessage(
            response?.exception?.response
              ?.data || "Something went wrong"
          )
        );
      }

      dispatch(
        openAlertMessage(
          "Invitation sent successfully"
        )
      );

      closeDialogHandler?.();
    } catch (error) {
      dispatch(
        openAlertMessage("Server error")
      );
    }
  };

// =======================================
// ACCEPT INVITATION
// =======================================

export const acceptFriendInvitation =
  (data) => async (dispatch) => {
    try {
      const response =
        await api.acceptFriendInvitation(data);

      if (response?.error) {
        return dispatch(
          openAlertMessage(
            response?.exception?.response
              ?.data || "Something went wrong"
          )
        );
      }

      dispatch(
        openAlertMessage(
          "Friend request accepted"
        )
      );
    } catch (error) {
      dispatch(
        openAlertMessage("Server error")
      );
    }
  };

// =======================================
// REJECT INVITATION
// =======================================

export const rejectFriendInvitation =
  (data) => async (dispatch) => {
    try {
      const response =
        await api.rejectFriendInvitation(data);

      if (response?.error) {
        return dispatch(
          openAlertMessage(
            response?.exception?.response
              ?.data || "Something went wrong"
          )
        );
      }

      dispatch(
        openAlertMessage(
          "Invitation rejected"
        )
      );
    } catch (error) {
      dispatch(
        openAlertMessage("Server error")
      );
    }
  };

// =======================================
// REMOVE FRIEND
// =======================================

export const removeFriend =
  (friendId) =>
  async (dispatch, getState) => {
    try {
      console.log(
        "Removing friend:",
        friendId
      );

      const response =
        await api.removeFriend(friendId);

      if (response?.error) {
        return dispatch(
          openAlertMessage(
            response?.exception?.response
              ?.data ||
              "Failed to remove friend"
          )
        );
      }

      const {
        friends: { friends },
      } = getState();

      const updatedFriends =
        friends.filter(
          (friend) =>
            friend._id !== friendId
        );

      dispatch(setFriends(updatedFriends));

      dispatch(
        openAlertMessage(
          "Friend removed"
        )
      );
    } catch (error) {
      console.log(error);

      dispatch(
        openAlertMessage("Server error")
      );
    }
  };