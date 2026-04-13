import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import { Card, CardHeader, CardBody, Input, Button } from "../components/UI";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await register(username, email, password);
      nav("/feed");
    } catch {
      setErr("Registration failed. Try a different username.");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader title="Create your account" subtitle="Join circles, complete challenges, and level up." />
        <CardBody>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {err ? <div className="text-sm text-rose-400">{err}</div> : null}
            <Button className="w-full" type="submit">Create account</Button>
          </form>

          <p className="mt-4 text-sm text-slate-300">
            Already have an account? <Link className="text-indigo-400 hover:text-indigo-300" to="/login">Login</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
