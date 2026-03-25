import { useEffect, useState } from "react";

export default function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessage() {
      try {
        const result = await fetch("/api/hello?name=Rohit");
        if (!result.ok) {
          throw new Error(`Request failed with ${result.status}`);
        }

        const payload = await result.json();
        setResponse(payload);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadMessage();
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">React + Node + Lambda-style backend</p>
        <h1>Dummy project wired for local full-stack development.</h1>
        <p className="lead">
          The frontend is a Vite React app. The backend is a plain Node server
          that routes requests into Lambda handler functions instead of Express.
        </p>

        <div className="status-panel">
          <h2>Backend response</h2>
          {loading && <p>Loading Lambda response...</p>}
          {!loading && error && <p className="error-text">{error}</p>}
          {!loading && response && (
            <div className="response-block">
              <p>
                <strong>Message:</strong> {response.message}
              </p>
              <p>
                <strong>Timestamp:</strong> {response.timestamp}
              </p>
              <p>
                <strong>Path:</strong> {response.path}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
