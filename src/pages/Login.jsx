import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

import { Card, CardHeader, CardBody, Input, Button } from "../components/UI";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(username, password);
      nav("/feed");
    } catch {
      setErr("Login failed. Check username/password.");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader title="Welcome back" subtitle="Login to continue your Ascend journey." />
        <CardBody>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {err ? <div className="text-sm text-rose-400">{err}</div> : null}
            <Button className="w-full" type="submit">Login</Button>
          </form>

          <p className="mt-4 text-sm text-slate-300">
            No account? <Link className="text-indigo-400 hover:text-indigo-300" to="/register">Register</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
