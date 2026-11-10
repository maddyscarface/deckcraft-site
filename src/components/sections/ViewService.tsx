"use client";
import { useEffect } from "react";
import { track } from "@/lib/tracking";

export function ViewService({ name }: { name: string }) {
  useEffect(() => { track.viewService(name); }, [name]);
  return null;
}
