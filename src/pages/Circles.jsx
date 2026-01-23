import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Card, CardHeader, CardBody, Input, Button, Badge } from "../components/UI";
import EmptyState from "../components/EmptyState";

export default function Circles() {
  const { isAuthed, refreshMe } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["circles"],
    queryFn: async () => (await http.get("/circles/")).data,
  });

  async function createCircle() {
    if (!name.trim()) return;
    await http.post("/circles/", { name, description });
    setName("");
    setDescription("");
    qc.invalidateQueries({ queryKey: ["circles"] });
  }

  async function joinCircle(id) {
    await http.post(`/circles/${id}/join/`);

    // ✅ backend sets onboard_joined_circle automatically
    await refreshMe();

    alert("Joined!");
    nav(`/circles/${id}`);

    // optional: refresh circles list too
    qc.invalidateQueries({ queryKey: ["circles"] });
  }

  const circles = data || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card>
        <CardHeader
          title="Circles"
          subtitle="Find your people. Build momentum together."
          right={<Badge>Groups</Badge>}
        />
        <CardBody>
          {isAuthed ? (
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Circle name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={createCircle}>Create Circle</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-300">Login to create or join circles.</div>
          )}
        </CardBody>
      </Card>

      {isLoading ? <div className="text-slate-300">Loading...</div> : null}
      {isError ? <div className="text-rose-400">Failed to load circles.</div> : null}

      {!isLoading && !isError && circles.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="You’re not meant to grow alone."
          message="Circles are small communities where people support, challenge, and build momentum together."
          ctaLabel={isAuthed ? "Create a circle" : "Login to join circles"}
          onCta={() =>
            isAuthed
              ? document.querySelector('input[placeholder="Circle name"]')?.focus()
              : window.location.assign("/login")
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {circles.map((c) => (
            <Card key={c.id}>
              <CardBody className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      className="text-lg font-bold hover:text-indigo-300"
                      to={`/circles/${c.id}`}
                    >
                      {c.name}
                    </Link>
                    <div className="text-sm text-slate-300">{c.description}</div>
                  </div>
                  <Badge>{c.members_count} members</Badge>
                </div>

                {isAuthed ? (
                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => joinCircle(c.id)}>
                      Join
                    </Button>
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
