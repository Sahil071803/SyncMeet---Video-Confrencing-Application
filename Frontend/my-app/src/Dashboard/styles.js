import { styled } from "@mui/system";

// ======================================================
// DASHBOARD WRAPPER
// ======================================================

export const DashboardWrapper = styled("div")(({ mobile }) => ({
  width: "100%",
  height: "100vh",

  display: "flex",
  flexDirection: "column",

  overflow: "hidden",
  position: "relative",

  background:
    "radial-gradient(circle at top,#111827 0%,#020617 45%,#000 100%)",

  ...(mobile && {
    paddingBottom: "90px",
    boxSizing: "border-box",
  }),
}));

// ======================================================
// CONTENT WRAPPER
// ======================================================

export const ContentWrapper = styled("div")(({ mobile }) => ({
  flex: 1,

  width: "100%",
  minHeight: 0,

  display: "grid",

  overflow: "hidden",

  padding: mobile ? "10px" : "18px",

  paddingBottom: mobile ? "90px" : "18px",

  gap: mobile ? "10px" : "18px",

  transition: "all 0.28s ease",

  gridTemplateColumns: mobile
    ? "1fr"
    : "84px minmax(0,1fr)",

  gridTemplateRows: "1fr",

  boxSizing: "border-box",

  ...(mobile && {
    overflowY: "auto",

    scrollbarWidth: "none",
    msOverflowStyle: "none",

    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
}));

// ======================================================
// GLASS CONTAINER
// ======================================================

export const GlassContainer = styled("div")(
  ({ mobile, center, full }) => ({
    width: "100%",

    height: "100%",

    minHeight: 0,

    display: "flex",

    flexDirection: "column",

    overflow: "hidden",

    position: "relative",

    borderRadius: mobile ? "20px" : "28px",

    background: "rgba(15,23,42,0.72)",

    backdropFilter: "blur(22px)",

    border: "1px solid rgba(255,255,255,0.06)",

    boxShadow: center
      ? "0 18px 60px rgba(0,0,0,0.35)"
      : "0 10px 34px rgba(0,0,0,0.24)",

    transition: "all 0.28s ease",

    ...(full && {
      width: "100%",
      height: "100%",
      flex: 1,
    }),

    ...(mobile && {
      borderRadius: "22px",
    }),

    "&::before": {
      content: '""',

      position: "absolute",

      top: 0,
      left: 0,
      right: 0,

      height: "1px",

      background:
        "linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)",
    },
  })
);

// ======================================================
// PAGE CONTENT WRAPPER
// ======================================================

export const FullScreenContent = styled("div")({
  width: "100%",
  height: "100%",

  display: "flex",
  flexDirection: "column",

  overflow: "hidden",

  position: "relative",
});

// ======================================================
// OPTIONAL GLOW
// ======================================================

export const GlowOrb = styled("div")(
  ({ top, left, color, size }) => ({
    position: "absolute",

    top: top || "-100px",

    left: left || "-80px",

    width: size || "220px",

    height: size || "220px",

    borderRadius: "50%",

    background: color || "rgba(139,92,246,0.18)",

    filter: "blur(90px)",

    pointerEvents: "none",

    zIndex: 0,
  })
);