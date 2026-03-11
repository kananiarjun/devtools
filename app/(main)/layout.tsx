import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100svh",
        background: "var(--bg)",
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 32,
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{ borderTop: "1px solid var(--border)", marginTop: "auto" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Logo + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className="logo-mark"
              style={{ width: 28, height: 28, fontSize: 11, borderRadius: 8 }}
            >
              {" "}
              <span className="logo-mark">
                <img
                  src="/icon.svg"
                  alt="DevTools Hub"
                  width={36}
                  height={36}
                />
              </span>
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "var(--text-primary)",
              }}
            >
              DevTools Hub
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textAlign: "center",
              maxWidth: 320,
            }}
          >
            8 free tools · Secure accounts · Activity tracking · Built with
            Next.js
          </p>

          {/* Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 12,
            }}
          >
            <a href="#" className="footer-link">
              Privacy
            </a>
            <a href="#" className="footer-link">
              Terms
            </a>
            <a href="#" className="footer-link">
              GitHub
            </a>
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.6 }}>
            © {new Date().getFullYear()} DevTools Hub. All rights reserved.
          </p>
        </div>

        <style>{`
          .footer-link {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.15s;
          }
          .footer-link:hover {
            color: var(--brand-light);
          }
        `}</style>
      </footer>
    </div>
  );
}
