const SuccessToast = ({
  closeToast,
  onUndo,
  onViewList,
  message = "Created Successfully!",
  description = "Your item has been added to the list.",
  undoText = "Undo",
  viewText = "Shopping List",
}) => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
  };

  const cardStyle = {
    backgroundColor: "var(--color-bg-card)",
    padding: "32px 24px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    textAlign: "center",
    width: "calc(100% - 40px)",
    maxWidth: "360px",
    animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    fontFamily: "var(--font-family-base)",
    color: "var(--color-text-primary)",
  };

  const iconCircleStyle = {
    width: "64px",
    height: "64px",
    backgroundColor: "#ecfdf5",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
    color: "var(--color-success)",
  };

  const btnGroupStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  };

  const btnBase = {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    transition: "opacity 0.2s",
    fontFamily: "var(--font-family-base)",
  };

  return (
    <div style={overlayStyle} onClick={closeToast}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconCircleStyle}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h3 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>
          {message}
        </h3>
        <p
          style={{
            margin: "0 0 24px 0",
            color: "var(--color-text-secondary)",
            fontSize: "14px",
          }}
        >
          {description}
        </p>

        <div style={btnGroupStyle}>
          <button
            style={{
              ...btnBase,
              backgroundColor: "var(--color-bg-sidebar)",
              color: "var(--color-text-secondary)",
            }}
            onClick={() => {
              onUndo();
              closeToast();
            }}
          >
            {undoText}
          </button>

          <button
            style={{
              ...btnBase,
              background: "var(--btn-primary-bg)",
              color: "var(--btn-primary-text)",
              boxShadow: "var(--btn-primary-shadow)",
            }}
            onClick={() => {
              onViewList();
              closeToast();
            }}
          >
            {viewText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        button:active { opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default SuccessToast;
