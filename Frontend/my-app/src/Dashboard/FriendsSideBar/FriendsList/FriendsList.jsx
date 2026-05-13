import React, { useMemo, useCallback, useState, memo } from "react";
import { styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { Typography, InputBase } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import FriendsListItem from "./FriendsListItem";
import { removeFriend } from "../../../store/actions/friendsActions";

const MainContainer = styled("div")({
  flexGrow: 1,
  width: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const SearchBox = styled("div")({
  width: "100%",
  height: "50px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 15px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(255,255,255,0.075)",
  backdropFilter: "blur(16px)",
  boxSizing: "border-box",
  marginBottom: "14px",
});

const SearchInput = styled(InputBase)({
  flex: 1,
  color: "#fff",
  fontSize: "14px",

  "& input::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },
});

const FriendsContainer = styled("div")({
  flex: 1,
  overflowY: "auto",
  padding: "2px 2px 8px 2px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",

  "&::-webkit-scrollbar": {
    display: "none",
  },

  scrollbarWidth: "none",
  msOverflowStyle: "none",
});

const EmptyContainer = styled("div")({
  width: "100%",
  minHeight: "190px",
  borderRadius: "24px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))",
  border: "1px solid rgba(255,255,255,0.07)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "12px",
  textAlign: "center",
  padding: "22px",
  boxSizing: "border-box",
});

const EmptyIcon = styled("div")({
  width: "58px",
  height: "58px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#C4B5FD",
  background: "rgba(139,92,246,0.12)",
  border: "1px solid rgba(139,92,246,0.18)",
});

const FriendsList = ({ setSelectedFriend }) => {
  const dispatch = useDispatch();

  const [activeFriendId, setActiveFriendId] = useState(null);
  const [search, setSearch] = useState("");

  const friends = useSelector((state) => state.friends?.friends || []);
  const onlineUsers = useSelector((state) => state.friends?.onlineUsers || []);

  const onlineUsersSet = useMemo(() => {
    return new Set(
      onlineUsers
        .map((user) => {
          if (typeof user === "string") return user;
          return user?.userId || user?._id || user?.id;
        })
        .filter(Boolean)
        .map((id) => id.toString())
    );
  }, [onlineUsers]);

  const enhancedFriends = useMemo(() => {
    if (!Array.isArray(friends)) return [];

    return friends
      .filter(Boolean)
      .map((friend) => {
        const friendId = friend?._id || friend?.id || friend?.userId;

        return {
          ...friend,
          id: friendId,
          isOnline: friendId ? onlineUsersSet.has(friendId.toString()) : false,
        };
      })
      .sort((a, b) => {
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return (a.username || "").localeCompare(b.username || "");
      });
  }, [friends, onlineUsersSet]);

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return enhancedFriends;

    return enhancedFriends.filter((friend) => {
      return (
        friend.username?.toLowerCase().includes(query) ||
        friend.email?.toLowerCase().includes(query)
      );
    });
  }, [enhancedFriends, search]);

  const handleSelectFriend = useCallback(
    (friend) => {
      setSelectedFriend?.(friend);
      setActiveFriendId(friend.id);
    },
    [setSelectedFriend]
  );

  const handleRemoveFriend = useCallback(
    (friendId) => {
      dispatch(removeFriend(friendId));
    },
    [dispatch]
  );

  return (
    <MainContainer>
      <SearchBox>
        <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 21 }} />

        <SearchInput
          placeholder="Search participants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBox>

      <FriendsContainer>
        {enhancedFriends.length === 0 ? (
          <EmptyContainer>
            <EmptyIcon>
              <GroupsRoundedIcon />
            </EmptyIcon>

            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 19 }}>
              No Participants Yet
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                maxWidth: "270px",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              Add friends to start realtime chatting and video collaboration.
            </Typography>
          </EmptyContainer>
        ) : filteredFriends.length === 0 ? (
          <EmptyContainer>
            <EmptyIcon>
              <SearchRoundedIcon />
            </EmptyIcon>

            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>
              No Participant Found
            </Typography>

            <Typography sx={{ color: "#94A3B8", fontSize: "14px" }}>
              Try another name or email.
            </Typography>
          </EmptyContainer>
        ) : (
          filteredFriends.map((friend) => (
            <FriendsListItem
              key={friend.id}
              id={friend.id}
              username={friend.username || "Unknown"}
              email={friend.email || ""}
              isOnline={friend.isOnline}
              active={activeFriendId === friend.id}
              onClick={() => handleSelectFriend(friend)}
              onRemoveFriend={() => handleRemoveFriend(friend.id)}
            />
          ))
        )}
      </FriendsContainer>
    </MainContainer>
  );
};

export default memo(FriendsList);