const FormCardLayout = ({
  title,
  subtitle,
  children,
  onCancel,
  onSubmit,
  submitText,
  loading,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "var(--space-4)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "574px",
          backgroundColor: "var(--color-bg-card)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "var(--gradient-primary)",
            padding: "var(--space-6) var(--space-7)",
            color: "var(--color-text-inverse)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "var(--fs-2xl)",
              fontWeight: "var(--fw-semibold)",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: "var(--fs-sm)",
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            padding: "var(--space-6) var(--space-7)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
          }}
        >
          {children}

          {/* Footer Buttons */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              marginTop: "var(--space-4)",
            }}
          >
            <button
              type="button"
              className="btn"
              style={{
                flex: 1,
                backgroundColor: "var(--color-bg-sidebar)",
                color: "var(--color-text-secondary)",
              }}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 3 }}
              disabled={loading}
            >
              {loading ? "SAVING..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCardLayout;
