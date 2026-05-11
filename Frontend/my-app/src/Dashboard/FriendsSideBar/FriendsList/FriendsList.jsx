import React, {
  useMemo,
  useCallback,
} from "react";

import { styled } from "@mui/system";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import FriendsListItem from "./FriendsListItem";

import {
  removeFriend,
} from "../../../store/actions/friendsActions";

// ======================================================
// STYLES
// ======================================================

const MainContainer = styled("div")({
  flexGrow: 1,
  width: "100%",
  overflowY: "auto",
  padding: "10px",
  boxSizing: "border-box",

  display: "flex",
  flexDirection: "column",
  gap: "10px",

  "&::-webkit-scrollbar": {
    width: "6px",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "#374151",
    borderRadius: "10px",
  },
});

const EmptyContainer = styled("div")({
  width: "100%",
  padding: "20px",
  textAlign: "center",
  color: "#94A3B8",
  fontSize: "14px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  minHeight: "120px",
});

// ======================================================
// COMPONENT
// ======================================================

const FriendsList = ({
  setSelectedFriend,
}) => {

  const dispatch = useDispatch();

  // ======================================================
  // REDUX STATE
  // ======================================================

  const friends = useSelector(
    (state) =>
      state.friends?.friends || []
  );

  const onlineUsers = useSelector(
    (state) =>
      state.friends?.onlineUsers || []
  );

  // ======================================================
  // ONLINE USERS SET
  // ======================================================

  const onlineUsersSet = useMemo(() => {

    return new Set(

      onlineUsers
        .map((user) => {

          if (
            typeof user === "string"
          ) {
            return user;
          }

          return (
            user?.userId ||
            user?._id ||
            user?.id
          );

        })
        .filter(Boolean)
        .map((id) =>
          id.toString()
        )
    );

  }, [onlineUsers]);

  // ======================================================
  // ENHANCED FRIENDS
  // ======================================================

  const enhancedFriends = useMemo(() => {

    if (!Array.isArray(friends)) {
      return [];
    }

    return friends
      .filter(Boolean)
      .map((friend) => {

        const friendId =
          friend?._id ||
          friend?.id ||
          friend?.userId;

        return {
          ...friend,

          id: friendId,

          isOnline: friendId
            ? onlineUsersSet.has(
                friendId.toString()
              )
            : false,
        };
      });

  }, [friends, onlineUsersSet]);

  // ======================================================
  // SELECT FRIEND
  // ======================================================

  const handleSelectFriend =
    useCallback(
      (friend) => {
        setSelectedFriend(friend);
      },
      [setSelectedFriend]
    );

  // ======================================================
  // REMOVE FRIEND
  // ======================================================

  const handleRemoveFriend =
    useCallback(
      (friendId) => {

        console.log(
          "REMOVE FRIEND:",
          friendId
        );

        dispatch(
          removeFriend(friendId)
        );

      },
      [dispatch]
    );

  // ======================================================
  // EMPTY STATE
  // ======================================================

  if (
    enhancedFriends.length === 0
  ) {
    return (
      <MainContainer>
        <EmptyContainer>
          No friends available
        </EmptyContainer>
      </MainContainer>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <MainContainer>

      {enhancedFriends.map(
        (friend) => (

          <FriendsListItem
            key={friend.id}

            id={friend.id}

            username={
              friend.username ||
              "Unknown"
            }

            isOnline={
              friend.isOnline
            }

            active={false}

            onClick={() =>
              handleSelectFriend(
                friend
              )
            }

            onRemoveFriend={() =>
              handleRemoveFriend(
                friend.id
              )
            }
          />

        )
      )}

    </MainContainer>
  );
};

export default FriendsList;