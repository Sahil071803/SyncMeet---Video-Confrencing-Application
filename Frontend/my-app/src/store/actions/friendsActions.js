import { openAlertMessage } from "./alertActions";
import * as api from "../../api";

export const friendsActions = {
  SET_FRIENDS: "FRIENDS.SET_FRIENDS",
  SET_PENDING_FRIENDS_INVITATIONS:
    "FRIENDS.SET_PENDING_FRIENDS_INVITATIONS",
  SET_ONLINE_USERS: "FRIENDS.SET_ONLINE_USERS",
};

const getErrorMessage = (response, fallback = "Something went wrong") => {
  const data =
    response?.exception?.response?.data ||
    response?.response?.data ||
    response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (response?.message) return response.message;
  if (response?.exception?.message) return response.exception.message;

  return fallback;
};

const getFriendId = (friend) => {
  return friend?._id || friend?.id || friend?.userId || friend?.friendId;
};

export const setPendingFriendsInvitations = (
  pendingFriendsInvitations = []
) => ({
  type: friendsActions.SET_PENDING_FRIENDS_INVITATIONS,
  pendingFriendsInvitations,
});

export const setFriends = (friends = []) => ({
  type: friendsActions.SET_FRIENDS,
  friends,
});

export const setOnlineUsers = (onlineUsers = []) => ({
  type: friendsActions.SET_ONLINE_USERS,
  onlineUsers,
});

export const sendFriendInvitation =
  (data, closeDialogHandler) => async (dispatch) => {
    try {
      const targetEmail = data?.targetEmail?.trim()?.toLowerCase();

      if (!targetEmail) {
        const message = "Friend email is required";
        dispatch(openAlertMessage(message));
        return { success: false, message };
      }

      const response = await api.sendFriendInvitation({ targetEmail });

      if (response?.error) {
        const message = getErrorMessage(response, "Failed to send invitation");
        dispatch(openAlertMessage(message));
        return { success: false, message };
      }

      dispatch(openAlertMessage("Invitation sent successfully"));
      closeDialogHandler?.();

      return {
        success: true,
        message: "Invitation sent successfully",
      };
    } catch (error) {
      const message = getErrorMessage(error, "Server error");
      dispatch(openAlertMessage(message));
      return { success: false, message };
    }
  };

export const acceptFriendInvitation = (data) => async (dispatch) => {
  try {
    const response = await api.acceptFriendInvitation(data);

    if (response?.error) {
      const message = getErrorMessage(
        response,
        "Failed to accept friend request"
      );
      dispatch(openAlertMessage(message));
      return { success: false, message };
    }

    dispatch(openAlertMessage("Friend request accepted"));
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Server error");
    dispatch(openAlertMessage(message));
    return { success: false, message };
  }
};

export const rejectFriendInvitation = (data) => async (dispatch) => {
  try {
    const response = await api.rejectFriendInvitation(data);

    if (response?.error) {
      const message = getErrorMessage(response, "Failed to reject invitation");
      dispatch(openAlertMessage(message));
      return { success: false, message };
    }

    dispatch(openAlertMessage("Invitation rejected"));
    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Server error");
    dispatch(openAlertMessage(message));
    return { success: false, message };
  }
};

export const removeFriend = (friendId) => async (dispatch, getState) => {
  try {
    if (!friendId) {
      const message = "Friend ID missing";
      dispatch(openAlertMessage(message));
      return { success: false, message };
    }

    const response = await api.removeFriend(friendId);

    if (response?.error) {
      const message = getErrorMessage(response, "Failed to remove friend");
      dispatch(openAlertMessage(message));
      return { success: false, message };
    }

    const state = getState();
    const currentFriends = state?.friends?.friends || [];

    const updatedFriends = currentFriends.filter((friend) => {
      const id = getFriendId(friend);
      return id?.toString() !== friendId?.toString();
    });

    dispatch(setFriends(updatedFriends));
    dispatch(openAlertMessage("Friend removed"));

    return { success: true };
  } catch (error) {
    const message = getErrorMessage(error, "Server error");
    dispatch(openAlertMessage(message));
    return { success: false, message };
  }
};