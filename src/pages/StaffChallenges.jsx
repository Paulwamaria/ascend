import React, { useState } from "react";
import { http } from "../api/http";
import { Card, CardHeader, CardBody, Input, Textarea, Button, Badge } from "../components/UI";

export default function StaffChallenges() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [points, setPoints] = useState(10);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function createChallenge() {
    setMsg("");
    if (!title.trim() || !startDate || !endDate) {
      setMsg("Title, start date and end date are required.");
      return;
    }

    setLoading(true);
    try {
      await http.post("/challenges/create/", {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
        points: Number(points),
      });

      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setPoints(10);
      setMsg("✅ Challenge created.");
    } catch (e) {
      setMsg("❌ Failed to create challenge. Are you staff?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card>
        <CardHeader
          title="Staff • Create Challenge"
          subtitle="Only staff can access this page."
          right={<Badge>Admin</Badge>}
        />
        <CardBody className="space-y-3">
          {msg ? <div className="text-sm text-slate-200">{msg}</div> : null}

          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            rows={4}
            placeholder="Description"
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
