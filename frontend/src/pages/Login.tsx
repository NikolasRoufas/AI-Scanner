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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="h-20 w-20 mx-auto bg-gradient-to-tr from-[hsl(var(--primary))] to-indigo-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6 rotate-3"
          >
            <FileText className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue analyzing CVs</p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-panel border-border/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <div className="space-y-1">
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <div className="text-right">
                  <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm font-medium flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </motion.div>
              )}

              <Button type="submit" className="w-full shadow-lg shadow-indigo-500/25" isLoading={isSubmitting} size="lg">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                Create one now
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
