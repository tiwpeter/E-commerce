"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  if (isAuthenticated) {
    router.replace("/cart");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      setSuccess(true);
      // ✅ Do not redirect to cart — let the user verify email first
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* ── Header ── */}
        <div className="auth-header">
          <div className="auth-logo">⬡</div>
          <h1>Create account</h1>
          <p>Start shopping right away</p>
        </div>

        {/* ── Success State: check email ── */}
        {success ? (
          <div className="email-sent">
            <div className="email-icon">📧</div>
            <h2>Check your email</h2>
            <p>
              We sent a verification link to
              <br />
              <strong>{email}</strong>
            </p>
            <p className="email-note">
              Please click the link in your email to verify your account before logging in
            </p>
            <Link href="/login" className="back-login-btn">
              Go to Login
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="auth-error">{error}</div>}

            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Type your password again"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Register"}
            </button>
          </form>
        )}

        {!success && (
          <p className="auth-footer">
            Already have an account?{" "}
            <Link href="/login">Log in</Link>
          </p>
        )}
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          font-family: "DM Sans", system-ui, sans-serif;
          padding: 1.5rem;
        }

        .auth-card {
          width: 100%;
          max-width: 460px;
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 1.25rem;
          padding: 2.5rem 2rem;
          box-shadow: 0 0 60px rgba(99, 102, 241, 0.08);
        }

        /* ── Header ── */
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-logo {
          font-size: 2.5rem;
          line-height: 1;
          color: #6366f1;
          margin-bottom: 1rem;
        }
        .auth-header h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #f0f0f8;
          margin: 0 0 0.35rem;
          letter-spacing: -0.03em;
        }
        .auth-header p {
          color: #6b6b85;
          font-size: 0.9rem;
          margin: 0;
        }

        /* ── Email sent state ── */
        .email-sent {
          text-align: center;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .email-icon {
          font-size: 3.5rem;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .email-sent h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f0f0f8;
          margin: 0;
        }
        .email-sent p {
          color: #9090aa;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.6;
        }
        .email-sent strong {
          color: #a5b4fc;
        }
        .email-note {
          font-size: 0.8rem !important;
          color: #6b6b85 !important;
          background: #0d0d16;
          border: 1px solid #1e1e2e;
          border-radius: 0.5rem;
          padding: 0.6rem 1rem;
          width: 100%;
          box-sizing: border-box;
        }
        .back-login-btn {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.7rem 2rem;
          background: #6366f1;
          color: #fff;
          border-radius: 0.6rem;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .back-login-btn:hover {
          background: #4f52e0;
        }

        /* ── Error ── */
        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          border-radius: 0.6rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
        }

        /* ── Fields ── */
        .field {
          margin-bottom: 1.1rem;
          flex: 1;
        }
        .field-row {
          display: flex;
          gap: 0.75rem;
        }
        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #9090aa;
          margin-bottom: 0.45rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .field input {
          width: 100%;
          background: #0d0d16;
          border: 1px solid #1e1e2e;
          border-radius: 0.6rem;
          padding: 0.7rem 0.9rem;
          color: #e8e8f0;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field input::placeholder { color: #3a3a55; }
        .field input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        /* ── Button ── */
        .auth-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.8rem;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 0.6rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 2.75rem;
        }
        .auth-btn:hover:not(:disabled) { background: #4f52e0; }
        .auth-btn:active:not(:disabled) { transform: scale(0.98); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Spinner ── */
        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Footer ── */
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #6b6b85;
        }
        .auth-footer a { color: #6366f1; text-decoration: none; font-weight: 500; }
        .auth-footer a:hover { color: #818cf8; }
      `}</style>
    </main>
  );
}