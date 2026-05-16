import { styled } from "@mui/system";

const LogoContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const LogoMark = styled("div")(({ size }) => ({
  width: size || 40,
  height: size || 40,
  flexShrink: 0,
  position: "relative",
}));

const SvgLogo = ({ size }) => {
  const s = size || 40;
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#6D28D9"/>
        </linearGradient>
        <linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C4B5FD"/>
          <stop offset="100%" stopColor="#A78BFA"/>
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="432" height="432" rx="96" fill="url(#sg1)"/>
      <rect x="64" y="64" width="384" height="384" rx="76" fill="rgba(255,255,255,0.06)"/>
      <rect x="100" y="170" width="260" height="170" rx="32" fill="none" stroke="#fff" strokeWidth="14" opacity="0.5"/>
      <rect x="116" y="186" width="228" height="138" rx="20" fill="#0F172A"/>
      <circle cx="230" cy="255" r="46" fill="none" stroke="url(#sg2)" strokeWidth="10"/>
      <circle cx="230" cy="255" r="28" fill="url(#sg2)"/>
      <circle cx="230" cy="255" r="9" fill="#fff"/>
      <path d="M348 200l-24 18 24 18" fill="none" stroke="url(#sg2)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M348 310l-24-18 24-18" fill="none" stroke="url(#sg2)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const SyncMeetLogo = ({ size = 40, showText = true, textVariant = "full" }) => {
  return (
    <LogoContainer>
      <LogoMark size={size}>
        <SvgLogo size={size} />
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
