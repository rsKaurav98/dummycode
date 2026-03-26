import { useEffect, useState } from "react";

const HOME_ROUTE = "/";
const LOGIN_ROUTE = "/login";
const SIGNUP_ROUTE = "/signup";

function navigateTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function HomePage() {
  return (
    <section className="auth-shell">
      <div className="brand-copy">
        <p className="eyebrow">Dummycode Authentication</p>
        <h1>Welcome back. Let&apos;s get you into your workspace.</h1>
        <p className="lead">
          Choose login if you already have an account, or create a new one with
          signup to save your email and password in MongoDB Atlas.
        </p>

        <div className="hero-actions">
          <button className="primary-button" onClick={() => navigateTo(LOGIN_ROUTE)}>
            Login
          </button>
          <button className="secondary-button" onClick={() => navigateTo(SIGNUP_ROUTE)}>
            Sign up
          </button>
        </div>
      </div>

      <div className="info-card">
        <h2>What this flow does</h2>
        <ul className="feature-list">
          <li>Creates a new user with a hashed password</li>
          <li>Checks login credentials against MongoDB Atlas</li>
          <li>Keeps the UI simple so you can extend it later</li>
        </ul>
      </div>
    </section>
  );
}

function AuthForm({
  mode,
  title,
  subtitle,
  submitLabel,
  alternateLabel,
  alternateRoute
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
      <button className="text-link" onClick={() => navigateTo(HOME_ROUTE)}>
        Back to home
      </button>

      <div className="form-card">
        <p className="eyebrow">{mode === "login" ? "Existing User" : "New User"}</p>
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
          <button className="inline-link" onClick={() => navigateTo(alternateRoute)}>
            {alternateRoute === LOGIN_ROUTE ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </section>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    function syncPath() {
      setPath(window.location.pathname);
    }

    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  if (path === LOGIN_ROUTE) {
    return (
      <main className="page-shell">
        <AuthForm
          mode="login"
          title="Login to Dummycode"
          subtitle="Enter the email and password you used when creating your account."
          submitLabel="Login"
          alternateLabel="Need an account?"
          alternateRoute={SIGNUP_ROUTE}
        />
      </main>
    );
  }

  if (path === SIGNUP_ROUTE) {
    return (
      <main className="page-shell">
        <AuthForm
          mode="signup"
          title="Create your account"
          subtitle="Sign up with your email address and a password to store your account in MongoDB Atlas."
          submitLabel="Create account"
          alternateLabel="Already registered?"
          alternateRoute={LOGIN_ROUTE}
        />
      </main>
    );
  }

  return (
    <main className="page-shell">
      <HomePage />
    </main>
  );
}
