import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Button, Badge } from "./UI";

export default function OnboardingCard({ onboarding, onPostClick }) {
  const steps = [
    { key: "joinedCircle", label: "Join a Circle", to: "/circles" },
    { key: "joinedChallenge", label: "Take a Challenge", to: "/challenges" },
    { key: "posted", label: "Post Your First Win", to: null },
  ];

  return (
    <Card className="border-indigo-600/30 bg-slate-900/40">
      <CardHeader
        title="Welcome to Ascend 🌱"
        subtitle="Your journey starts with 3 simple steps. You don’t need to be perfect — just begin."
        right={<Badge>Start here</Badge>}
      />
      <CardBody className="space-y-4">
        <div className="grid gap-2">
          {steps.map((s) => {
            const done = !!onboarding[s.key];
            return (
              <div
                key={s.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3"
              >
                <div className="text-sm">
                  <span className={done ? "text-emerald-300" : "text-slate-100"}>
                    {done ? "✓ " : ""}
                    {s.label}
                  </span>
                </div>

                {s.key === "posted" ? (
                  done ? (
                    <Badge>Done</Badge>
                  ) : (
                    <Button onClick={onPostClick}>Post</Button>
                  )
                ) : done ? (
                  <Badge>Done</Badge>
                ) : (
                  <Link to={s.to}>
                    <Button variant="secondary">Go</Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
