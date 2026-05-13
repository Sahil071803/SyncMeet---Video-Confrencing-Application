import React, { useEffect } from "react";
import { Box, Typography, Avatar, Stack, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

const PageWrapper = styled(Box)({
  minHeight: "100vh",
  width: "100%",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(14,165,233,0.25), transparent 35%), linear-gradient(135deg, #07111f 0%, #0b1020 45%, #111827 100%)",
  color: "#fff",
});

const GlassCard = styled(motion.div)({
  width: "90%",
  maxWidth: 780,
  padding: "42px 28px",
  borderRadius: 32,
  textAlign: "center",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  backdropFilter: "blur(18px)",
  zIndex: 2,
});

const IconBubble = styled(motion.div)({
  width: 78,
  height: 78,
  borderRadius: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 22px",
  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
  boxShadow: "0 18px 45px rgba(37,99,235,0.45)",
});

const FeaturePill = styled(motion.div)({
  padding: "12px 16px",
  borderRadius: 18,
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#dbeafe",
  fontSize: 14,
  fontWeight: 600,
});

const WelcomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 3800);

    return () => clearTimeout(timer);
  }, [navigate]);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const displayName =
    user?.username || user?.name || user?.email?.split("@")[0] || "User";

  return (
    <PageWrapper>
      <GlassCard
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <IconBubble
          initial={{ rotate: -12, scale: 0.7 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <VideoCameraFrontRoundedIcon sx={{ fontSize: 42, color: "#fff" }} />
        </IconBubble>

        <Typography
          sx={{
            fontSize: { xs: 34, sm: 48, md: 58 },
            fontWeight: 900,
            lineHeight: 1.05,
            mb: 1.5,
          }}
        >
          Welcome to SyncMeet
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 17, sm: 21 },
            color: "#c7d2fe",
            fontWeight: 600,
            mb: 1,
          }}
        >
          Hey {displayName}, your meeting space is getting ready.
        </Typography>

        <Typography
          sx={{
            maxWidth: 560,
            mx: "auto",
            color: "rgba(255,255,255,0.68)",
            fontSize: { xs: 14, sm: 16 },
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          Connect with friends, chat instantly, and start smooth video meetings
          with a clean professional experience.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <FeaturePill>
            <GroupsRoundedIcon fontSize="small" />
            Smart Connections
          </FeaturePill>

          <FeaturePill>
            <VideoCameraFrontRoundedIcon fontSize="small" />
            HD Meetings
          </FeaturePill>

          <FeaturePill>
            <ChatRoundedIcon fontSize="small" />
            Live Chat
          </FeaturePill>
        </Stack>

        <Box sx={{ maxWidth: 420, mx: "auto" }}>
          <Typography
            sx={{
              fontSize: 13,
              color: "rgba(255,255,255,0.55)",
              mb: 1,
              fontWeight: 600,
            }}
          >
            Preparing your dashboard...
          </Typography>

          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.12)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 10,
                background: "linear-gradient(90deg, #6366f1, #06b6d4)",
              },
            }}
          />
        </Box>
      </GlassCard>

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 28, md: 45 },
          display: "flex",
          gap: 1.2,
          opacity: 0.35,
        }}
      >
        {["S", "M", "A", "R"].map((item) => (
          <Avatar
            key={item}
            sx={{
              width: { xs: 38, sm: 46 },
              height: { xs: 38, sm: 46 },
              bgcolor: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {item}
          </Avatar>
        ))}
      </Box>
    </PageWrapper>
  );
};

export default WelcomeScreen;