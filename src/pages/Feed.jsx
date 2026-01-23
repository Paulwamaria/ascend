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

  // ✅ Backend-driven onboarding
  const profile = user?.profile || {};
  const onboarding = {
    onboard_joined_circle: !!profile.onboard_joined_circle,
    onboard_joined_challenge: !!profile.onboard_joined_challenge,
    onboard_posted_hope: !!profile.onboard_posted_hope,
    onboard_completed: !!profile.onboard_completed,
  };

  const completed = useMemo(() => onboarding.onboard_completed, [onboarding.onboard_completed]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hopeFeed"],
    queryFn: async () => (await http.get("/feed/hope/")).data,
  });

  async function createHopePostInline() {
    if (!composer.trim()) return;
    await http.post("/posts/", { type: "hope", content: composer });
    setComposer("");

    // ✅ refresh backend profile flags (onboard_posted_hope)
    await refreshMe();

    qc.invalidateQueries({ queryKey: ["hopeFeed"] });
  }

  async function handlePosted() {
    // Modal posted — refresh onboarding + feed
    await refreshMe();
    qc.invalidateQueries({ queryKey: ["hopeFeed"] });
  }

  const feed = data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {!completed ? (
        <OnboardingCard onboarding={onboarding} onPostClick={() => setModalOpen(true)} />
      ) : null}

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
                placeholder="What’s one small win today?"
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={createHopePostInline}>Post</Button>
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

      {!isLoading && !isError && feed.length === 0 ? (
        <EmptyState
          icon="💛"
          title="No posts yet — and that’s okay."
          message="Every journey starts with a single step. Share one small win today and light the way for someone else."
          ctaLabel={isAuthed ? "Post your first win" : "Login to post"}
          onCta={() => (isAuthed ? setModalOpen(true) : window.location.assign("/login"))}
        />
      ) : (
        <div className="grid gap-4">
          {feed.map((p) => (
            <Card key={p.id}>
              <CardBody className="space-y-2">
                <div className="text-xs text-slate-400">
                  @{p.author_username} • {new Date(p.created_at).toLocaleString()}
                </div>
                <div className="whitespace-pre-wrap break-words text-slate-100">{p.content}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <PostHopeModal open={modalOpen} onClose={() => setModalOpen(false)} onPosted={handlePosted} />
    </div>
  );
}
