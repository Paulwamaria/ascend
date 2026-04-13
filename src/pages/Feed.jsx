import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Button, Badge } from "../components/UI";

export default function OnboardingCard({ onboarding, onPostClick }) {
  const steps = [
    {
      key: "onboard_joined_circle",
      label: "Join a Circle",
      description: "Find your people and start building momentum together.",
      to: "/circles",
    },
    {
      key: "onboard_joined_challenge",
      label: "Take a Challenge",
      description: "Commit to growth and give your progress a clear direction.",
      to: "/challenges",
    },
    {
      key: "onboard_posted_hope",
      label: "Post Your First Win",
      description: "Share one small win and inspire someone else to keep going.",
      to: null,
    },
  ];

  return (
    <Card className="overflow-hidden border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 shadow-xl">
      <CardHeader
        title="Welcome to Ascend 🌱"
        subtitle="Your journey starts with three simple steps. You don’t need to be perfect — just begin."
        right={<Badge>Start here</Badge>}
      />
      <CardBody className="space-y-4">
        <div className="grid gap-3">
          {steps.map((s, index) => {
            const done = !!onboarding?.[s.key];

            return (
              <div
                key={s.key}
                className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                      done
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-800 text-slate-300",
                    ].join(" ")}
                  >
                    {done ? "✓" : index + 1}
                  </div>

                  <div className="space-y-1">
                    <div className={done ? "font-semibold text-emerald-300" : "font-semibold text-slate-100"}>
                      {s.label}
                    </div>
                    <p className="max-w-xl text-sm text-slate-400">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="sm:shrink-0">
                  {s.key === "onboard_posted_hope" ? (
                    done ? (
                      <Badge>Done</Badge>
                    ) : (
                      <Button
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
                        onClick={onPostClick}
                      >
                        Post
                      </Button>
                    )
                  ) : done ? (
                    <Badge>Done</Badge>
                  ) : (
                    <Link to={s.to}>
                      <Button variant="secondary">Go</Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}