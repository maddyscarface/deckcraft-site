"use client";
import { useEffect } from "react";
import { track } from "@/lib/tracking";

export function ViewService({ name, assessment }: { name: string; assessment?: string }) {
  useEffect(() => { track.viewService(name); if (assessment) track.assessmentView(assessment); }, [name, assessment]);
  return null;
}
