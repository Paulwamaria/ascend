import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { http } from "../api/http";
import { Card, CardHeader, CardBody, Input, Textarea, Button, Badge } from "../components/UI";

export default function Profile() {
  const { user, refreshMe } = useAuth();

  const p = user?.profile || {};
  const badges = user?.badges || [];

  const [display_name, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setDisplayName(p.display_name || "");
    setBio(p.bio || "");
    setGoals((p.goals || []).join(", "));
    setSkills((p.skills || []).join(", "));
    setInterests((p.interests || []).join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function save() {
    setMsg("");
    await http.patch("/profile/me/", {
      display_name,
      bio,
      goals: goals.split(",").map((s) => s.trim()).filter(Boolean),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
    });
    await refreshMe();
    setMsg("Saved!");
  }

  const level = p.level ?? 1;
  const points = p.points ?? 0;

  const progressToNextLevel = useMemo(() => {
    // simple frontend display formula
    const currentLevelFloor = (level - 1) * 100;
    const nextLevelTarget = level * 100;
    const currentProgress = Math.max(0, points - currentLevelFloor);
    const needed = nextLevelTarget - currentLevelFloor;
    const percent = Math.min(100, Math.round((currentProgress / needed) * 100));
    return { percent, nextLevelTarget };
  }, [level, points]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Profile</Badge>
          <Badge>Growth</Badge>
          <Badge>Progress</Badge>
        </div>

        <Card className="overflow-hidden border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 shadow-xl">
          <CardBody className="space-y-5 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="text-sm text-slate-400">@{user?.username}</div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {display_name || user?.username}
                </h1>
                <p className="max-w-2xl text-sm sm:text-base text-slate-300">
                  {bio || "This is your growth dashboard. Track progress, earn badges, and keep building momentum."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>Level {level}</Badge>
                <Badge>{points} pts</Badge>
                <Badge>{badges.length} badges</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Progress to next level</span>
                <span className="font-semibold text-indigo-300">
                  {progressToNextLevel.percent}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${progressToNextLevel.percent}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                Target: {progressToNextLevel.nextLevelTarget} total points
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
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

        <Card className="bg-slate-900/70 shadow-md">
          <CardBody className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Badges
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{badges.length}</div>
          </CardBody>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Achievements</h2>
          <p className="text-sm text-slate-400">
            Milestones you’ve unlocked on your growth journey.
          </p>
        </div>

        {badges.length === 0 ? (
          <Card className="bg-slate-900/60 shadow-md">
            <CardBody className="py-8 text-center">
              <div className="text-3xl">🏅</div>
              <div className="mt-3 text-lg font-semibold text-white">No badges yet</div>
              <p className="mt-2 text-sm text-slate-400">
                Complete challenges, post wins, and stay consistent to unlock your first badge.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <Card
                key={badge.code}
                className="border-slate-800 bg-slate-900/60 shadow-md transition hover:shadow-lg"
              >
                <CardBody className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{badge.icon || "🏅"}</div>
                    <Badge>Unlocked</Badge>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{badge.name}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {badge.description}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Edit Profile */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
          <p className="text-sm text-slate-400">
            Keep your profile updated so Ascend feels more personal and motivating.
          </p>
        </div>

        <Card className="bg-slate-900/70 shadow-lg">
          <CardHeader
            title="Profile Details"
            subtitle={`@${user?.username}`}
            right={<Badge>Level {level} • {points} pts</Badge>}
          />
          <CardBody className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Display name
                </div>
                <Input
                  value={display_name}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Goals
                </div>
                <Input
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Build products, get fit, stay consistent"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Bio
                </div>
                <Textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community a little about yourself..."
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Skills
                </div>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, discipline, writing"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Interests
                </div>
                <Input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. startups, fitness, books"
                />
              </div>
            </div>

            {msg ? <div className="text-sm text-emerald-400">{msg}</div> : null}

            <div className="flex justify-end">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                onClick={save}
              >
                Save Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}