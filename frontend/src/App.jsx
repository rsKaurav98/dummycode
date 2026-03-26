import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <main className="page-shell">
      <Outlet />
    </main>
  );
}
