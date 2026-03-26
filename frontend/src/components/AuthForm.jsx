import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({
  mode,
  eyebrow,
  title,
  subtitle,
  submitLabel,
  alternateLabel,
  alternatePath,
  alternateActionLabel
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || `Request failed with ${response.status}`);
      }

      setStatus({ type: "success", message: payload.message });

      if (mode === "signup") {
        setEmail("");
        setPassword("");
      } else {
        setPassword("");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-wrapper">
      <Link className="text-link" to="/">
        Back to home
      </Link>

      <div className="form-card">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </label>

          <button className="primary-button wide-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : submitLabel}
          </button>
        </form>

        {status.message ? (
          <p className={status.type === "error" ? "notice error-notice" : "notice success-notice"}>
            {status.message}
          </p>
        ) : null}

        <p className="switch-copy">
          {alternateLabel}{" "}
          <Link className="inline-link" to={alternatePath}>
            {alternateActionLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
