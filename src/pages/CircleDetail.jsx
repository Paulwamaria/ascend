import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import useAuth from "../auth/useAuth";
import { Card, CardHeader, CardBody, Textarea, Button, Badge } from "../components/UI";

export default function CircleDetail() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { isAuthed, booting } = useAuth();
  const [content, setContent] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["circlePosts", id],
    queryFn: async () => (await http.get(`/circles/${id}/posts/`)).data,
    enabled: !booting && isAuthed,
  });

  async function postToCircle() {
    if (!content.trim()) return;
    await http.post("/posts/", { type: "circle", circle: Number(id), content });
    setContent("");
    qc.invalidateQueries({ queryKey: ["circlePosts", id] });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title={`Circle #${id}`}
          subtitle="Post updates, ask questions, share progress."
          right={<Badge>Circle</Badge>}
        />
        <CardBody>
          {isAuthed ? (
            <div className="space-y-3">
              <Textarea
                rows={3}
                placeholder="Post to this circle..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={postToCircle}>Post</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-300">Login to post in this circle.</div>
          )}
        </CardBody>
      </Card>

      {isLoading ? <div className="text-slate-300">Loading...</div> : null}
      {isError ? <div className="text-rose-400">Failed to load posts.</div> : null}

      <div className="grid gap-4">
        {(data || []).map((p) => (
          <Card key={p.id}>
            <CardBody className="space-y-2">
              <div className="text-xs text-slate-400">
                @{p.author_username} • {new Date(p.created_at).toLocaleString()}
              </div>
              <div className="whitespace-pre-wrap">{p.content}</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
