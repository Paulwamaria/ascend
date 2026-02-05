import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { Card, CardHeader, CardBody, Button, Badge, Input, Textarea } from "../components/UI";
import EmptyState from "../components/EmptyState";

function SubmitModal({ open, onClose, onSubmit, challengeTitle }) {
  const [note, setNote] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    setLoading(true);
    try {
      await onSubmit({ note, proof_url: proofUrl });
      setNote("");
      setProofUrl("");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold">Submit Challenge</div>
            <div className="text-sm text-slate-300">{challengeTitle}</div>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <Textarea
            rows={4}
            placeholder="Add a short note (what you did, what you learned)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Input
            placeholder="Proof link (optional) e.g. GitHub / Drive / Tweet"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Challenges() {
  const { isAuthed, refreshMe } = useAuth();
  const qc = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => (await http.get("/challenges/")).data,
  });

  async function join(id) {
    await http.post(`/challenges/${id}/join/`);
    await refreshMe();
    qc.invalidateQueries({ queryKey: ["challenges"] });
  }

  function openSubmit(ch) {
    setActiveChallenge(ch);
    setModalOpen(true);
  }

  async function submit({ note, proof_url }) {
    if (!activeChallenge) return;
    await http.post(`/challenges/submit/`, {
      challenge: activeChallenge.id,
      note,
      proof_url,
    });
    await refreshMe();
    qc.invalidateQueries({ queryKey: ["challenges"] });
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
          {isAuthed ? "Join a challenge and submit proof/notes." : "Login to join and submit challenges."}
        </CardBody>
      </Card>

      {isLoading ? <div className="text-slate-300">Loading...</div> : null}
      {isError ? <div className="text-rose-400">Failed to load challenges.</div> : null}

      {!isLoading && !isError && challenges.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No challenges yet."
          message="Staff will add a starter set of challenges soon."
          ctaLabel={isAuthed ? "" : "Login"}
          onCta={() => window.location.assign("/login")}
        />
      ) : (
        <div className="grid gap-4">
          {challenges.map((ch) => {
            const status = ch.my_status || (ch.has_submitted ? "submitted" : ch.is_joined ? "joined" : null);

            return (
              <Card key={ch.id}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold">{ch.title}</div>
                      <div className="text-sm text-slate-300 whitespace-pre-wrap">{ch.description}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge>{ch.points} pts</Badge>
                      {status === "approved" ? <Badge>Approved ✅</Badge> : null}
                      {status === "submitted" ? <Badge>Submitted ✅</Badge> : null}
                      {status === "joined" ? <Badge>Joined ✅</Badge> : null}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    {ch.start_date} → {ch.end_date}
                  </div>

                  {isAuthed ? (
                    <div className="flex justify-end">
                      {status === "approved" || status === "submitted" ? (
                        <Button variant="secondary" onClick={() => openSubmit(ch)}>
                          Edit submission
                        </Button>
                      ) : status === "joined" ? (
                        <Button onClick={() => openSubmit(ch)}>Submit</Button>
                      ) : (
                        <Button variant="secondary" onClick={() => join(ch.id)}>
                          Join
                        </Button>
                      )}
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <SubmitModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveChallenge(null);
        }}
        onSubmit={submit}
        challengeTitle={activeChallenge?.title || ""}
      />
    </div>
  );
}
