
import { Navigate } from "react-router-dom";

export default function Login() {
  // Redirect all login attempts to the redirect page
  return <Navigate to="/redirect" replace />;
}
