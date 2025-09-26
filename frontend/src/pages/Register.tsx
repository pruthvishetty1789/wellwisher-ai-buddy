import React, { useState } from "react";
import API from "../api.ts";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Mail, Lock, User, AlertCircle } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log('🔄 Registration form submitted');
    console.log('📝 Form data:', { 
      name: form.name, 
      email: form.email, 
      passwordLength: form.password.length 
    });

    // Basic validation
    if (form.password !== form.confirmPassword) {
      console.log('❌ Password validation failed: passwords do not match');
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      console.log('❌ Password validation failed: too short');
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    console.log('✅ Frontend validation passed, making API request...');
    
    try {
      const requestData = {
        name: form.name,
        email: form.email,
        password: form.password
      };
      
      console.log('📤 Sending registration request:', { 
        name: requestData.name, 
        email: requestData.email,
        passwordProvided: !!requestData.password 
      });
      
      const res = await API.post("/auth/register", requestData);
      
      console.log('✅ Registration successful:', res.data);
      console.log('🔐 Token received:', !!res.data.token);
      
      localStorage.setItem("token", res.data.token);
      console.log('💾 Token saved to localStorage');
      
      navigate("/"); // redirect after registration
      console.log('🔄 Redirecting to dashboard...');
      
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      console.error('📝 Error response:', err.response?.data);
      console.error('🔍 Full error:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'radial-gradient(ellipse at center, #ddd6fe 0%, #c4b5fd 25%, #a78bfa 50%, #8b5cf6 75%, #7c3aed 100%), radial-gradient(ellipse at center, #dbeafe 0%, #bfdbfe 25%, #93c5fd 50%, #60a5fa 75%, #3b82f6 100%)',
      backgroundBlendMode: 'screen'
    }}>
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-2xl border-border/50">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Join WellWisher AI for your mental wellness journey
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Create a password"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;