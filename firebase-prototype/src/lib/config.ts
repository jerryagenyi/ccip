
import { Megaphone, Building, Bot, Shield, Home, LucideIcon } from "lucide-react";
import type { AnnouncementType } from "./types";

type AnnouncementStyle = {
    icon: LucideIcon;
    badge: string;
};

export const announcementStyles: Record<AnnouncementType, AnnouncementStyle> = {
    "Platform Update": {
        icon: Bot,
        badge: "inline-flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary",
    },
    "Federal Announcement": {
        icon: Shield,
        badge: "inline-flex items-center gap-2 rounded-md bg-green-500/10 px-2 py-1 text-sm font-semibold text-green-500",
    },
    "State Announcement": {
        icon: Building,
        badge: "inline-flex items-center gap-2 rounded-md bg-orange-500/10 px-2 py-1 text-sm font-semibold text-orange-500",
    },
    "LGA Update": {
        icon: Home,
        badge: "inline-flex items-center gap-2 rounded-md bg-yellow-500/10 px-2 py-1 text-sm font-semibold text-yellow-500",
    },
};
