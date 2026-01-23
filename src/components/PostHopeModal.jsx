//A simple "post modal" so onboarding can trigger posting
import React, { useState } from "react";
import { Card, CardBody, CardHeader, Textarea, Button } from "./UI";
import { http } from "../api/http";

export default function PostHopeModal({ open, onClose, onPosted }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  async function submit() {
    if (!content.trim()) return;
    setSaving(true);
    setErr("");
    try {
      await http.post("/posts/", { type: "hope", content });
      setContent("");
      onPosted?.();
      onClose?.();
    } catch {
      setErr("Failed to post. Please login and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader title="Post a win 💛" subtitle="What’s one small win today?"/>
          <CardBody className="space-y-3">
            <Textarea
              rows={4}
              placeholder="Share a win, a lesson, a comeback..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {err ? <div className="text-sm text-rose-400">{err}</div> : null}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Posting..." : "Post"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
