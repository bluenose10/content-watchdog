
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
