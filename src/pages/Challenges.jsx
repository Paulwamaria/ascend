import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { Card, CardHeader, CardBody, Button, Badge, Input, Textarea } from "../components/UI";

export default function StaffChallenges() {
  const { ensureAccessToken } = useAuth();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [points, setPoints] = useState(10);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function validate() {
    if (!title.trim() || !startDate || !endDate) {
      return "Title, start date and end date are required.";
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      return "Invalid dates.";
    }
    if (e < s) {
      return "End date must be the same day or after the start date.";
    }
    const p = Number(points);
    if (!Number.isFinite(p) || p <= 0) {
      return "Points must be a positive number.";
    }
    return null;
  }

  async function createChallenge() {
    setMsg("");
    const err = validate();
    if (err) {
      setMsg(`❌ ${err}`);
      return;
    }

    setLoading(true);
    try {
      const token = await ensureAccessToken();
      if (!token) {
        setMsg("❌ Not logged in. Please login again.");
        return;
      }

      await http.post(
        "/challenges/create/",
        {
          title: title.trim(),
          description,
          start_date: startDate,
          end_date: endDate,
          points: Number(points),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setPoints(10);

      setMsg("✅ Challenge created.");
      qc.invalidateQueries({ queryKey: ["challenges"] });
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setMsg("❌ Unauthorized (401). Please login again.");
      else if (status === 403) setMsg("❌ Forbidden (403). Your account is not staff.");
      else setMsg("❌ Failed to create challenge.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="border-indigo-600/30 bg-slate-900/40">
        <CardHeader
          title="Staff • Create Challenge"
          subtitle="Only staff can access this page."
          right={<Badge>Admin</Badge>}
        />
        <CardBody className="space-y-3">
          {msg ? <div className="text-sm text-slate-200">{msg}</div> : null}

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            rows={4}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
          </div>

          <div className="flex justify-end">
            <Button onClick={createChallenge} disabled={loading}>
              {loading ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
