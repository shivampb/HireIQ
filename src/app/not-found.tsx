import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrapper">
      <main className="main-content container">
        <div
          className="card card-elevated empty-state"
          style={{ padding: "var(--space-12) var(--space-8)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "var(--space-6)",
            }}
          >
            <svg
              width="140"
              height="140"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <linearGradient id="brandGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <rect
                x="6"
                y="6"
                width="108"
                height="108"
                rx="18"
                fill="url(#brandGrad)"
                opacity="0.08"
              />
              <g transform="translate(20,20)">
                <circle
                  cx="40"
                  cy="36"
                  r="28"
                  stroke="#6366f1"
                  strokeWidth="3"
                  fill="white"
                />
                <path
                  d="M70 78 L86 94"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text
                  x="40"
                  y="44"
                  textAnchor="middle"
                  fontSize="26"
                  fontWeight="800"
                  fill="#4338ca"
                >
                  404
                </text>
              </g>
            </svg>
          </div>

          <h1 className="empty-title">Page not found</h1>
          <p className="empty-description">
            We couldn't find the page you're looking for. It may have been
            moved, renamed, or no longer exists.
          </p>

          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              justifyContent: "center",
              marginTop: "var(--space-6)",
            }}
          >
            <Link href="/" className="btn btn-primary btn-lg">
              Return home
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-lg">
              Go to dashboard
            </Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">
              Contact support
            </Link>
          </div>

          <p
            style={{
              marginTop: "var(--space-6)",
              textAlign: "center",
              color: "var(--gray-500)",
              fontSize: "var(--font-size-sm)",
            }}
          >
            If you think this is an error, please{" "}
            <Link href="/contact">reach out</Link> and we'll help.
          </p>
        </div>
      </main>
    </div>
  );
}
