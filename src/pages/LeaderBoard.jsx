import React from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../api/http";
import useAuth from "../auth/useAuth";
import { Card, CardHeader, CardBody, Badge } from "../components/UI";

export default function Leaderboard() {
  const { isAuthed, booting } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => (await http.get("/leaderboard/")).data,
    enabled: !booting && isAuthed,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Leaderboard" subtitle="Top builders right now." right={<Badge>Global</Badge>} />
        <CardBody className="text-sm text-slate-300">
          Points come from challenge approvals (and future features).
        </CardBody>
      </Card>

      {isLoading ? <div className="text-slate-300">Loading...</div> : null}
      {isError ? <div className="text-rose-400">Failed to load leaderboard.</div> : null}

      <Card>
        <CardBody className="p-0">
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-slate-800/60 text-xs text-slate-400">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Name</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">Level</div>
          </div>

          {(data || []).map((row, idx) => (
            <div key={row.user_id} className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-slate-800/30">
              <div className="col-span-2 text-slate-300">#{idx + 1}</div>
              <div className="col-span-6 font-semibold">{row.display_name}</div>
              <div className="col-span-2 text-right text-slate-200">{row.points}</div>
              <div className="col-span-2 text-right text-slate-200">{row.level}</div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
