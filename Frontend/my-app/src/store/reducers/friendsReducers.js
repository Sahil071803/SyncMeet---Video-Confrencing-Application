import { friendsActions } from "../actions/friendsActions";

const initialState = {
  friends: [],
  pendingFriendsInvitations: [],
  onlineUsers: [],
};

const friendsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {

    // ======================================
    // FRIENDS
    // ======================================

    case friendsActions.SET_FRIENDS:
      return {
        ...state,
        friends: Array.isArray(action.friends)
          ? action.friends
          : [],
      };

    // ======================================
    // PENDING INVITATIONS
    // ======================================

    case friendsActions.SET_PENDING_FRIENDS_INVITATIONS:
      return {
        ...state,
        pendingFriendsInvitations:
          Array.isArray(
            action.pendingFriendsInvitations
          )
            ? action.pendingFriendsInvitations
            : [],
      };

    // ======================================
    // ONLINE USERS
    // ======================================

    case friendsActions.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: Array.isArray(
          action.onlineUsers
        )
          ? action.onlineUsers
          : [],
      };

    default:
      return state;
  }
};

export default friendsReducer;