import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { Card, CardHeader, CardBody, Button, Badge } from "../components/UI";
import EmptyState from "../components/EmptyState";

export default function Challenges() {
  const { isAuthed, refreshMe } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => (await http.get("/challenges/")).data,
  });

  async function join(id) {
    await http.post(`/challenges/${id}/join/`);

    // ✅ backend sets onboard_joined_challenge automatically
    await refreshMe();

    alert("Joined!");
    qc.invalidateQueries({ queryKey: ["challenges"] });
  }

  async function submit(id) {
    const note = prompt("Add a note (optional):") || "";
    await http.post(`/challenges/submit/`, { challenge: id, note });
    alert("Submitted!");
  }

  const challenges = data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card>
        <CardHeader
          title="Challenges"
          subtitle="Compete with yourself. Earn points. Level up."
          right={<Badge>Weekly</Badge>}
        />
        <CardBody className="text-sm text-slate-300">
          {isAuthed
            ? "Join a challenge and submit proof/notes."
            : "Login to join and submit challenges."}
        </CardBody>
      </Card>

      {isLoading ? <div className="text-slate-300">Loading...</div> : null}
      {isError ? <div className="text-rose-400">Failed to load challenges.</div> : null}

      {!isLoading && !isError && challenges.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No challenges yet."
          message="Growth needs direction. Add a starter set of challenges so people can begin today."
          ctaLabel={isAuthed ? "" : "Login"}
          onCta={() => window.location.assign("/login")}
        />
      ) : (
        <div className="grid gap-4">
          {challenges.map((ch) => (
            <Card key={ch.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold">{ch.title}</div>
                    <div className="text-sm text-slate-300 whitespace-pre-wrap">
                      {ch.description}
                    </div>
                  </div>
                  <Badge>{ch.points} pts</Badge>
                </div>

                <div className="text-xs text-slate-400">
                  {ch.start_date} → {ch.end_date}
                </div>

                {isAuthed ? (
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => join(ch.id)}>
                      Join
                    </Button>
                    <Button onClick={() => submit(ch.id)}>Submit</Button>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
