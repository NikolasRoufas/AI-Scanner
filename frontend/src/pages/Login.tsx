import React, { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await loginApi({ email, password });
      if (result.success && result.user_id) {
        login({ id: result.user_id, email: email });
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-16 w-16 mx-auto bg-gradient-to-tr from-[hsl(var(--primary))] to-purple-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4"
          >
            <FileText className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Sign in to continue analyzing CVs</p>
        </div>

        <Card className="backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[hsl(var(--muted-foreground))]">Don't have an account? </span>
            <Link to="/register" className="text-[hsl(var(--primary))] font-medium hover:underline">
              Create one now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
