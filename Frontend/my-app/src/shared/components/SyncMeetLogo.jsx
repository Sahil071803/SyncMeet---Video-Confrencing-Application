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

const HexLogo = ({ size }) => {
  const s = size || 40;
  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hex-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#4F46E5"/>
        </linearGradient>
        <linearGradient id="hex-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
      <polygon points="256,68 406,148 406,364 256,444 106,364 106,148" fill="url(#hex-bg)"/>
      <polygon points="256,96 380,164 380,348 256,416 132,348 132,164" fill="rgba(15,23,42,0.55)"/>
      <rect x="140" y="200" width="180" height="120" rx="20" fill="rgba(167,139,250,0.2)"/>
      <rect x="150" y="210" width="160" height="100" rx="12" fill="#0F172A"/>
      <circle cx="230" cy="260" r="32" fill="rgba(167,139,250,0.25)"/>
      <circle cx="230" cy="260" r="20" fill="url(#hex-accent)"/>
      <polygon points="223,250 223,270 241,260" fill="#fff"/>
      <path d="M326 220l22-16-22-16" fill="none" stroke="url(#hex-accent)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M326 254l22-16-22-16" fill="none" stroke="url(#hex-accent)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,34)"/>
    </svg>
  );
};

const SyncMeetLogo = ({ size = 40, showText = true, textVariant = "full" }) => {
  return (
    <LogoContainer>
      <LogoMark size={size}>
        <HexLogo size={size} />
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
