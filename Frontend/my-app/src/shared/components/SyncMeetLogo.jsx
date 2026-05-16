import { styled } from "@mui/system";

const LogoContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const LogoMark = styled("div")(({ size }) => ({
  width: size || 40,
  height: size || 40,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  boxShadow: "0 8px 20px rgba(139,92,246,0.3)",
  flexShrink: 0,
  position: "relative",
  overflow: "hidden",
}));

const CameraIcon = ({ size }) => (
  <svg width={size * 0.55} height={size * 0.4} viewBox="0 0 280 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="10" width="220" height="172" rx="28" fill="rgba(255,255,255,0.2)" />
    <rect x="14" y="24" width="192" height="144" rx="16" fill="#0F172A" />
    <circle cx="110" cy="96" r="40" fill="rgba(167,139,250,0.3)" />
    <circle cx="110" cy="96" r="28" fill="url(#logo-lens)" />
    <circle cx="110" cy="96" r="10" fill="#fff" />
    <path d="M220 30l40 36-40 36" stroke="rgba(255,255,255,0.5)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logo-lens" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

const SyncMeetLogo = ({ size = 40, showText = true, textVariant = "full" }) => {
  return (
    <LogoContainer>
      <LogoMark size={size}>
        <CameraIcon size={size} />
      </LogoMark>
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
