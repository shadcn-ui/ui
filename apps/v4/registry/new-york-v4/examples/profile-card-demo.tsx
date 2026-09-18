"use client"

import { ProfileCard } from "@/registry/new-york-v4/ui/profilecard"

export function ProfileCardDemo() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <ProfileCard
                name="Sarah Anderson"
                role="Full Stack Developer"
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                bio="Passionate about creating beautiful and functional web experiences with modern technologies"
                github="https://github.com"
                website="https://sarahdev.com"
                linkedin="https://linkedin.com"
                email="sarah@example.com"
            />
        </div>
    )
}
