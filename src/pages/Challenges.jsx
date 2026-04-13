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

  function getDaysLeft(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <section className="space-y-2">
        <div className="flex gap-2">
          <Badge>Growth</Badge>
          <Badge>Discipline</Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Challenges
        </h1>

        <p className="max-w-2xl text-sm sm:text-base text-slate-400">
          Push yourself forward. Join a challenge, stay consistent, and earn your progress.
        </p>
      </section>

      {/* Intro Card */}
      <Card className="border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/30 shadow-lg">
        <CardBody className="text-sm text-slate-300">
          {isAuthed
            ? "Join a challenge and submit proof to earn points."
            : "Login to join challenges and track your progress."}
        </CardBody>
      </Card>

      {/* States */}
      {isLoading && <div className="text-slate-300">Loading...</div>}
      {isError && <div className="text-rose-400">Failed to load challenges.</div>}

      {!isLoading && !isError && challenges.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No challenges yet."
          message="Growth needs direction. Staff will add challenges soon."
          ctaLabel={isAuthed ? "" : "Login"}
          onCta={() => window.location.assign("/login")}
        />
      ) : (
        <div className="grid gap-5">
          {challenges.map((ch) => {
            const status =
              ch.my_status ||
              (ch.has_submitted
                ? "submitted"
                : ch.is_joined
                ? "joined"
                : null);

            const daysLeft = getDaysLeft(ch.end_date);

            return (
              <Card
                key={ch.id}
                className="border-slate-800 bg-slate-900/60 shadow-md hover:shadow-lg transition"
              >
                <CardBody className="space-y-4 p-5">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-white">
                        {ch.title}
                      </div>
                      <div className="text-sm text-slate-400 whitespace-pre-wrap">
                        {ch.description}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                        {ch.points} pts
                      </Badge>

                      {status === "approved" && (
                        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                          Approved ✅
                        </Badge>
                      )}
                      {status === "submitted" && (
                        <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-300">
                          Submitted
                        </Badge>
                      )}
                      {status === "joined" && (
                        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
                          Joined
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {ch.start_date} → {ch.end_date}
                    </span>

                    <span
                      className={
                        daysLeft <= 2
                          ? "text-rose-400"
                          : "text-slate-400"
                      }
                    >
                      {daysLeft > 0
                        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
                        : "Ended"}
                    </span>
                  </div>

                  {/* CTA */}
                  {isAuthed && (
                    <div className="flex justify-end">
                      {status === "approved" || status === "submitted" ? (
                        <Button variant="secondary" onClick={() => openSubmit(ch)}>
                          Edit submission
                        </Button>
                      ) : status === "joined" ? (
                        <Button
                          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                          onClick={() => openSubmit(ch)}
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={() => join(ch.id)}>
                          Join Challenge
                        </Button>
                      )}
                    </div>
                  )}
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