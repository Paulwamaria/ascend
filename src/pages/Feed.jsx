import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import useAuth from "../auth/useAuth";
import { Card, CardHeader, CardBody, Textarea, Button, Badge } from "../components/UI";

export default function Feed() {
  const { isAuthed, booting } = useAuth();
  const qc = useQueryClient();
  const [content, setContent] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hopeFeed"],
    queryFn: async () => (await http.get("/feed/hope/")).data,
    enabled: !booting && isAuthed,
  });

  async function createHopePost() {
    if (!content.trim()) return;
    await http.post("/posts/", { type: "hope", content });
    setContent("");
    qc.invalidateQueries({ queryKey: ["hopeFeed"] });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Hope Feed"
          subtitle="Share wins, comebacks, lessons — fuel someone’s day."
          right={<Badge>Public</Badge>}
        />
        <CardBody>
          {isAuthed ? (
            <div className="space-y-3">
              <Textarea
                rows={3}
                placeholder="Share a win, a lesson, a comeback..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={createHopePost}>Post</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-300">
              Login to post. You can still read and get inspired.
            </div>
          )}
        </CardBody>
      </Card>

      {isLoading ? <div className="text-slate-300">Loading...</div> : null}
      {isError ? <div className="text-rose-400">Failed to load feed.</div> : null}

      <div className="grid gap-4">
        {(data || []).map((p) => (
          <Card key={p.id}>
            <CardBody className="space-y-2">
              <div className="text-xs text-slate-400">
                @{p.author_username} • {new Date(p.created_at).toLocaleString()}
              </div>
              <div className="whitespace-pre-wrap text-slate-100">{p.content}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
