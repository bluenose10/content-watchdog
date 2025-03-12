
import { Navigate } from "react-router-dom";

const SignUp = () => {
  // Redirect all signup attempts to the redirect page
  return <Navigate to="/redirect" replace />;
};

export default SignUp;
