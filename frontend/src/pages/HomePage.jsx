import { Link } from "react-router-dom";

export default function HomePage() {
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
          <Link className="primary-button" to="/login">
            Login
          </Link>
          <Link className="secondary-button" to="/signup">
            Sign up
          </Link>
        </div>
      </div>

      <div className="info-card">
        <h2>What this flow does</h2>
        <ul className="feature-list">
          <li>Creates a new user with a hashed password</li>
          <li>Checks login credentials against MongoDB Atlas</li>
          <li>Uses routed pages you can extend later with a dashboard</li>
        </ul>
      </div>
    </section>
  );
}
