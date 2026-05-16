import { styled } from "@mui/system";

const LogoContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const SyncMeetLogo = ({ size = 40, showText = true, textVariant = "full" }) => {
  return (
    <LogoContainer>
      {showText && textVariant === "full" && (
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.45, lineHeight: 1.1 }}>
            SyncMeet
          </div>
          <div style={{ color: "#94A3B8", fontSize: size * 0.28, marginTop: "3px" }}>
            Realtime Collaboration Platform
          </div>
        </div>
      )}
      {showText && textVariant === "short" && (
        <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.5 }}>
          SyncMeet
        </span>
      )}
    </LogoContainer>
  );
};

export default SyncMeetLogo;
