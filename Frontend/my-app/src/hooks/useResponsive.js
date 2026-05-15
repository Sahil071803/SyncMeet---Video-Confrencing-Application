import {
  useTheme,
  useMediaQuery,
} from "@mui/material";

// ======================================================
// RESPONSIVE HOOK
// ======================================================

const useResponsive = () => {
  const theme = useTheme();

  // ======================================================
  // BREAKPOINTS
  // ======================================================

  const isXs = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const isTablet = useMediaQuery(
    theme.breakpoints.between(
      "md",
      "lg"
    )
  );

  const isDesktop = useMediaQuery(
    theme.breakpoints.up("lg")
  );

  const isLargeDesktop =
    useMediaQuery(
      theme.breakpoints.up(
        "xl"
      )
    );

  // ======================================================
  // ORIENTATION
  // ======================================================

  const isLandscape =
    useMediaQuery(
      "(orientation: landscape)"
    );

  // ======================================================
  // CUSTOM WIDTHS
  // ======================================================

  const isVerySmallMobile =
    useMediaQuery(
      "(max-width:420px)"
    );

  const isTabletLandscape =
    useMediaQuery(
      "(min-width:900px) and (max-width:1200px)"
    );

  // ======================================================
  // DERIVED VALUES
  // ======================================================

  const appBarHeight = isMobile ? 64 : 72;
  const sidebarWidth = isMobile ? 0 : 84;

  // ======================================================
  // RETURN
  // ======================================================

  return {
    isXs,

    isMobile,

    isTablet,

    isDesktop,

    isLargeDesktop,

    isLandscape,

    isVerySmallMobile,

    isTabletLandscape,

    appBarHeight,

    sidebarWidth,
  };
};

export default useResponsive;