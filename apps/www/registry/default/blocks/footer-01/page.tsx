import React from "react"
import { Dribbble, Github, Instagram, Twitter } from "lucide-react"

const socialLinks = [
  {
    href: "https://twitter.com/",
    label: "Twitter",
    icon: <Twitter size={20} strokeWidth={1.5} />,
  },
  {
    href: "https://instagram.com/",
    label: "Instagram",
    icon: <Instagram size={20} strokeWidth={1.5} />,
  },
  {
    href: "https://dribbble.com/",
    label: "Dribbble",
    icon: <Dribbble size={20} strokeWidth={1.5} />,
  },
  {
    href: "https://github.com/",
    label: "GitHub",
    icon: <Github size={20} strokeWidth={1.5} />,
  },
]

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Support", href: "/support" },
    ],
  },
]

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted dark:bg-muted/40 border-t">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-5">
            <div className="space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight">
                Shadcn Studio
              </h2>
              <p className="text-muted-foreground/80 dark:text-muted-foreground text-sm leading-relaxed">
                Crafting digital experiences with precision and passion.
                Building tomorrow's web solutions today.
              </p>
              <div className="flex items-center space-x-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="border-border text-muted-foreground/80 dark:text-muted-foreground hover:border-foreground hover:text-foreground rounded-full border p-2 transition-all duration-200 hover:shadow-sm"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-8 lg:col-span-7 lg:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted-foreground/80 dark:text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-border/50 mt-12 border-t pt-8">
          <p className="text-muted-foreground/70 dark:text-muted-foreground text-center text-sm">
            &copy; {new Date().getFullYear()} Shadcn Studio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
