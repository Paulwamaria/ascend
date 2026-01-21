import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { http } from "../api/http";
import { Card, CardHeader, CardBody, Input, Textarea, Button, Badge } from "../components/UI";

export default function Profile() {
  const { user, refreshMe } = useAuth();

  const p = user?.profile || {};
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="My Profile"
          subtitle={`@${user?.username}`}
          right={<Badge>Level {p.level ?? 1} • {p.points ?? 0} pts</Badge>}
        />
        <CardBody className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Display name</div>
              <Input value={display_name} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Goals (comma separated)</div>
              <Input value={goals} onChange={(e) => setGoals(e.target.value)} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="text-xs text-slate-400">Bio</div>
              <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400">Skills</div>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">Interests</div>
              <Input value={interests} onChange={(e) => setInterests(e.target.value)} />
            </div>
          </div>

          {msg ? <div className="text-sm text-emerald-400">{msg}</div> : null}

          <div className="flex justify-end">
            <Button onClick={save}>Save</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
