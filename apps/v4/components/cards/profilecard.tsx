"use client";

import Image from "next/image";
import { Card, CardContent } from "@/registry/new-york-v4/ui/card";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, Link2 } from "lucide-react";

interface ProfileCardProps {
    name: string;
    role: string;
    avatar: string;
    bio: string;
    github?: string;
    website?: string;
    linkedin?: string;
    email?: string;
    className?: string;
}

export function ProfileCard({
    name,
    role,
    avatar,
    bio,
    github,
    website,
    linkedin,
    email,
    className,
}: ProfileCardProps) {
    return (
        <Card
            className={cn(
                "w-full max-w-sm rounded-2xl shadow-md border bg-card text-card-foreground transition hover:shadow-lg",
                "p-6 flex flex-col items-center gap-4",
                className
            )}
        >
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden border shadow">
                <Image src={avatar} alt={name} width={112} height={112} />
            </div>

            {/* Name + Role */}
            <div className="text-center">
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-primary font-medium">{role}</p>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground text-center px-2 leading-relaxed">
                {bio}
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
                {github && (
                    <a
                        href={github}
                        target="_blank"
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
                    >
                        <Github className="size-5" />
                    </a>
                )}

                {website && (
                    <a
                        href={website}
                        target="_blank"
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
                    >
                        <Link2 className="size-5" />
                    </a>
                )}

                {linkedin && (
                    <a
                        href={linkedin}
                        target="_blank"
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
                    >
                        <Linkedin className="size-5" />
                    </a>
                )}

                {email && (
                    <a
                        href={`mailto:${email}`}
                        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
                    >
                        <Mail className="size-5" />
                    </a>
                )}
            </div>
        </Card>
    );
}
