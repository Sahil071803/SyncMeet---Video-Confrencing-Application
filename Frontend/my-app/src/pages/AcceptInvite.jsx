import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { styled } from "@mui/system";

import { useNavigate, useParams } from "react-router-dom";

import { acceptInvitationByToken } from "../api/api";

const Wrapper = styled(Box)({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(180deg,#020617,#0F172A)",
  padding: "20px",
});

const Card = styled(Box)({
  width: "100%",
  maxWidth: "500px",
  background: "#111827",
  borderRadius: "24px",
  padding: "40px",
  textAlign: "center",
  border: "1px solid #1e293b",
  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
});

function AcceptInvite() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Accepting invitation...");

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        const response = await acceptInvitationByToken({ token });

        if (response?.data?.success) {
          setMessage("Invitation accepted successfully 🎉");

          setTimeout(() => {
            navigate("/dashboard");
          }, 2500);
        } else {
          setMessage(response?.message || "Failed to accept invitation");
        }
      } catch {
        setMessage("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      acceptInvite();
    } else {
      setLoading(false);
      setMessage("Invalid invitation link");
    }
  }, [token, navigate]);

  return (
    <Wrapper>
      <Card>
        <Typography
          variant="h3"
          sx={{
            color: "#60a5fa",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          SyncMeet
        </Typography>

        {loading ? (
          <>
            <CircularProgress />

            <Typography sx={{ color: "#cbd5e1", mt: 3 }}>
              {message}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              sx={{
                color: "#e5e7eb",
                fontSize: "18px",
                mb: 4,
              }}
            >
              {message}
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/dashboard")}
              sx={{
                background: "#2563eb",
                borderRadius: "12px",
                px: 4,
                py: 1.4,
              }}
            >
              Open Dashboard
            </Button>
          </>
        )}
      </Card>
    </Wrapper>
  );
}

export default AcceptInvite;