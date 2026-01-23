import React from "react";
import { Card, CardBody, Button } from "./UI";

// onboarding card empth state

export default function EmptyState({ title, message, ctaLabel, onCta, icon = "✨" }) {
  return (
    <Card>
      <CardBody className="py-10 text-center space-y-3">
        <div className="text-3xl">{icon}</div>
        <div className="text-lg font-bold">{title}</div>
        <p className="mx-auto max-w-md text-sm text-slate-300">{message}</p>
        {ctaLabel ? (
          <div className="pt-2">
            <Button onClick={onCta}>{ctaLabel}</Button>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
