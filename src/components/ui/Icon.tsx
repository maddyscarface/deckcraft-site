import {
  Hammer, Paintbrush, Fence, LayoutGrid, Building2, Building, Snowflake, Droplets, Sun, Camera, MessageCircle,
  Calendar, Sparkles, ShieldCheck, Clock, MapPin, Star, Check, Phone, Ruler, FileText, HardHat, House, Users,
  TriangleAlert, CircleCheck, ArrowRight, Lock, ClipboardList, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Hammer, Paintbrush, Fence, LayoutGrid, Building2, Building, Snowflake, Droplets, Sun, Camera, MessageCircle,
  Calendar, Sparkles, ShieldCheck, Clock, MapPin, Star, Check, Phone, Ruler, FileText, HardHat, House, Users,
  TriangleAlert, CircleCheck, ArrowRight, Lock, ClipboardList,
};

export function Icon({ name, className, size = 20 }: { name: string; className?: string; size?: number }) {
  const C = MAP[name] ?? Check;
  return <C className={className} size={size} aria-hidden="true" />;
}
