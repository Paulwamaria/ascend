import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { Card, CardHeader, CardBody, Textarea, Button, Badge } from "../components/UI";
import OnboardingCard from "../components/OnboardingCard";
import EmptyState from "../components/EmptyState";
import PostHopeModal from "../components/PostHopeModal";

export default function Feed() {
  const { isAuthed, user, refreshMe } = useAuth();
  const qc = useQueryClient();

  const [composer, setComposer] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const profile = user?.profile || {};
  const onboarding = {
    onboard_joined_circle: !!profile.onboard_joined_circle,
    onboard_joined_challenge: !!profile.onboard_joined_challenge,
    onboard_posted_hope: !!profile.onboard_posted_hope,
    onboard_completed: !!profile.onboard_completed,
  };

  const completed = useMemo(
    () => onboarding.onboard_completed,
    [onboarding.onboard_completed]
  );

  const completedSteps = useMemo(() => {
    return [
      onboarding.onboard_joined_circle,
      onboarding.onboard_joined_challenge,
      onboarding.onboard_posted_hope,
    ].filter(Boolean).length;
  }, [
    onboarding.onboard_joined_circle,
    onboarding.onboard_joined_challenge,
    onboarding.onboard_posted_hope,
  ]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hopeFeed"],
    queryFn: async () => (await http.get("/feed/hope/")).data,
  });

  async function createHopePostInline() {
    if (!composer.trim()) return;
    await http.post("/posts/", { type: "hope", content: composer });
    setComposer("");
    await refreshMe();
    qc.invalidateQueries({ queryKey: ["hopeFeed"] });
  }

  async function handlePosted() {
    await refreshMe();
    qc.invalidateQueries({ queryKey: ["hopeFeed"] });
  }

  const feed = data || [];
  const postCount = feed.length;
  const level = profile.level ?? 1;
  const points = profile.points ?? 0;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Page heading */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge>Community</Badge>
          <Badge>Momentum</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Hope Feed
        </h1>
        <p className="max-w-2xl text-sm sm:text-base text-slate-400">
          Share progress, celebrate small wins, and keep your momentum alive.
          Ascend works best when growth is visible.
        </p>
      </section>

      {/* Onboarding / Hero */}
      {!completed ? (
        <div className="space-y-3">
          <OnboardingCard
            onboarding={onboarding}
            onPostClick={() => setModalOpen(true)}
          />
          <Card className="border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/30 shadow-lg">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Getting started</span>
                <span className="font-semibold text-indigo-300">
                  {completedSteps}/3 complete
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${(completedSteps / 3) * 100}%` }}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <Card className="border-emerald-500/20 bg-gradient-to-r from-slate-900 to-emerald-950/20 shadow-lg">
          <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Momentum unlocked 🔥</h2>
              <p className="text-sm text-slate-300">
                You’ve completed onboarding. Keep building by joining challenges and sharing wins.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                onClick={() => window.location.assign("/challenges")}
              >
                View Challenges
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stat strip */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-slate-900/70 shadow-md">
          <CardBody className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Hope Posts
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{postCount}</div>
          </CardBody>
        </Card>

        <Card className="bg-slate-900/70 shadow-md">
          <CardBody className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Level
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{level}</div>
          </CardBody>
        </Card>

        <Card className="bg-slate-900/70 shadow-md">
          <CardBody className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Points
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{points}</div>
          </CardBody>
        </Card>
      </section>

      {/* Composer */}
      <Card className="border-slate-800 bg-slate-900/70 shadow-lg">
        <CardHeader
          title="Share a win"
          subtitle="A comeback, a lesson, or one small step forward can inspire someone else."
          right={<Badge>Public</Badge>}
        />
        <CardBody className="space-y-4">
          {isAuthed ? (
            <>
              <Textarea
                rows={4}
                placeholder="What’s one small win today?"
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                  onClick={createHopePostInline}
                >
                  Share Win
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-300">
              Login to post. You can still read and get inspired.
            </div>
          )}
        </CardBody>
      </Card>

      {/* Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Community Wins
          </h2>
          {isLoading ? <span className="text-sm text-slate-400">Loading...</span> : null}
        </div>

        {isError ? (
          <div className="text-rose-400">Failed to load feed.</div>
        ) : !isLoading && feed.length === 0 ? (
          <EmptyState
            icon="💛"
            title="No posts yet — and that’s okay."
            message="Every journey starts with a single step. Share one small win today and light the way for someone else."
            ctaLabel={isAuthed ? "Post your first win" : "Login to post"}
            onCta={() =>
              isAuthed ? setModalOpen(true) : window.location.assign("/login")
            }
          />
        ) : (
          <div className="grid gap-4">
            {feed.map((p) => (
              <Card
                key={p.id}
                className="border-slate-800 bg-slate-900/60 shadow-md transition hover:shadow-lg"
              >
                <CardBody className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-100">
                      @{p.author_username}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap break-words leading-7 text-slate-200">
                    {p.content}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <PostHopeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPosted={handlePosted}
      />
    </div>
  );
}