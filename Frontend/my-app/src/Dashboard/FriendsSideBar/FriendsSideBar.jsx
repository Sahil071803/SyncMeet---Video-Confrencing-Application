import React, { useMemo } from "react";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

import { useSelector } from "react-redux";

import useResponsive from "../../hooks/useResponsive";
import AddFriendButton from "./AddFriendButton";
import FriendsList from "./FriendsList/FriendsList";
import PendingInvitationsList from "./PendingInvitationsList/PendingInvitationsList";

const Sidebar = styled("div")(({ mobile }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  padding: mobile ? "18px 14px" : "24px",
  background:
    "linear-gradient(180deg, rgba(11,17,32,0.98) 0%, rgba(15,23,42,0.96) 100%)",
}));

const Glow = styled("div")({
  position: "absolute",
  top: "-130px",
  left: "-90px",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "rgba(139,92,246,0.20)",
  filter: "blur(95px)",
  pointerEvents: "none",
  zIndex: 0,
});

const Header = styled("div")({
  position: "relative",
  zIndex: 2,
  marginBottom: "18px",
});

const HeaderTop = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  marginBottom: "18px",
});

const TitleBox = styled("div")({
  minWidth: 0,
});

const IconBadge = styled("div")({
  width: "44px",
  height: "44px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  color: "#fff",
  boxShadow: "0 14px 30px rgba(139,92,246,0.34)",
  flexShrink: 0,
});

const StatsGrid = styled("div")(({ mobile }) => ({
  display: "grid",
  gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3,1fr)",
  gap: "10px",
  marginTop: "16px",
}));

const StatCard = styled("div")({
  minHeight: "72px",
  borderRadius: "20px",
  padding: "14px",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.045)",
  border: "1px solid rgba(255,255,255,0.065)",
  backdropFilter: "blur(18px)",
});

const Divider = styled("div")({
  width: "100%",
  height: "1px",
  background:
    "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
  margin: "18px 0",
  position: "relative",
  zIndex: 2,
});

const ScrollableContent = styled("div")({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: "22px",
  position: "relative",
  zIndex: 2,
  minHeight: 0,
  paddingRight: "4px",

  "&::-webkit-scrollbar": {
    width: "5px",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "20px",
  },
});

const Section = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const SectionHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
});

const Pill = styled("div")({
  minWidth: "28px",
  height: "24px",
  padding: "0 9px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#C4B5FD",
  fontSize: "12px",
  fontWeight: 800,
  background: "rgba(139,92,246,0.13)",
  border: "1px solid rgba(139,92,246,0.18)",
});

const FriendsSideBar = ({ setSelectedFriend, onVideoCall }) => {
  const { isMobile } = useResponsive();

  const friends = useSelector((state) => state.friends?.friends || []);
  const onlineUsers = useSelector((state) => state.friends?.onlineUsers || []);
  const pendingInvitations = useSelector(
    (state) => state.friends?.pendingFriendsInvitations || []
  );

  const onlineCount = useMemo(() => {
    const onlineSet = new Set(
      onlineUsers
        .map((user) =>
          typeof user === "string" ? user : user?.userId || user?._id || user?.id
        )
        .filter(Boolean)
        .map((id) => id.toString())
    );

    return friends.filter((friend) => {
      const id = friend?._id || friend?.id || friend?.userId;
      return id ? onlineSet.has(id.toString()) : false;
    }).length;
  }, [friends, onlineUsers]);

  return (
    <Sidebar mobile={isMobile ? 1 : 0}>
      <Glow />

      <Header>
        <HeaderTop>
          <IconBadge>
            <PeopleAltRoundedIcon />
          </IconBadge>

          <TitleBox>
            <Typography
              noWrap
              sx={{
                color: "#fff",
                fontWeight: 900,
                fontSize: isMobile ? "22px" : "28px",
                letterSpacing: "-0.8px",
                lineHeight: 1.05,
              }}
            >
              Participants
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: "13px",
                mt: "5px",
              }}
            >
              Manage friends, chats and requests
            </Typography>
          </TitleBox>

          <AddFriendButton compact />
        </HeaderTop>

        <StatsGrid mobile={isMobile ? 1 : 0}>
          <StatCard>
            <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>
              Total
            </Typography>
            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>
              {friends.length}
            </Typography>
          </StatCard>

          <StatCard>
            <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>
              Online
            </Typography>
            <Typography
              sx={{
                color: "#4ADE80",
                fontWeight: 900,
                fontSize: 24,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CircleRoundedIcon sx={{ fontSize: 10 }} />
              {onlineCount}
            </Typography>
          </StatCard>

          {!isMobile && (
            <StatCard>
              <Typography sx={{ color: "#94A3B8", fontSize: "12px" }}>
                Requests
              </Typography>
              <Typography
                sx={{ color: "#C4B5FD", fontWeight: 900, fontSize: 24 }}
              >
                {pendingInvitations.length}
              </Typography>
            </StatCard>
          )}
        </StatsGrid>
      </Header>

      <Divider />

      <ScrollableContent>
        <Section>
          <SectionHeader>
            <Typography
              sx={{
                color: "#E2E8F0",
                fontWeight: 900,
                fontSize: "12px",
                letterSpacing: "1.4px",
                textTransform: "uppercase",
              }}
            >
              Active Participants
            </Typography>

            <Pill>{friends.length}</Pill>
          </SectionHeader>

          <FriendsList setSelectedFriend={setSelectedFriend} onVideoCall={onVideoCall} />
        </Section>

        <Section>
          <SectionHeader>
            <Typography
              sx={{
                color: "#E2E8F0",
                fontWeight: 900,
                fontSize: "12px",
                letterSpacing: "1.4px",
                textTransform: "uppercase",
              }}
            >
              Pending Requests
            </Typography>

            <Pill>{pendingInvitations.length}</Pill>
          </SectionHeader>

          <PendingInvitationsList />
        </Section>
      </ScrollableContent>
    </Sidebar>
  );
};

export default FriendsSideBar;