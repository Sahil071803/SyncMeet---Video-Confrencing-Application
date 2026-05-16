import React from "react";

const MobileNav = ({ mobileView, setMobileView }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "60px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "#0f172a",
        borderTop: "1px solid #1f2937",
        zIndex: 99999,
      }}
    >
      <button type="button" onClick={() => setMobileView("friends")}>
        Friends
      </button>

      <button type="button" onClick={() => setMobileView("chat")}>
        Chat
      </button>

      <button type="button" onClick={() => setMobileView("video")}>
        Video
      </button>
    </div>
  );
};

export default MobileNav;