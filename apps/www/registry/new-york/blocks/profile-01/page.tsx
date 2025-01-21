import type { JSX } from "react"
import { ClipboardCheck, Clock3, DollarSign, Eye, Star } from "lucide-react"

import Banner from "./components/banner"
import Certifications from "./components/certifications"
import ClientReviews from "./components/client-reviews"
import TechnicalSkills from "./components/technical-skills"
import UserCard from "./components/user-card"
import WorkHistory from "./components/work-history"

const userStats = [
  {
    icon: <DollarSign size={18} className="text-foreground/70" />,
    title: "Earnings",
    children: <p className="text-2xl font-bold">$ 1,200</p>,
  },
  {
    icon: <Star size={18} className="text-foreground/70" />,
    title: "Rating",
    children: (
      <div className="flex items-center gap-2 font-bold">
        <span className="text-2xl text-foreground">4.5</span>
        <span className="text-foreground/60">/ 5</span>
      </div>
    ),
  },
  {
    icon: <ClipboardCheck size={18} className="text-foreground/70" />,
    title: "Contracts Completed",
    children: (
      <div className="flex items-center gap-2 font-bold">
        <span className="text-2xl text-foreground">12</span>
        <span className="text-foreground/60">/ 13</span>
      </div>
    ),
  },
  {
    icon: <Clock3 size={18} className="text-foreground/70" />,
    title: "Hours Worked",
    children: (
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">1,400</p>
        <p className="text-foreground/60">Hrs</p>
      </div>
    ),
  },
  {
    icon: <Eye size={18} className="text-foreground/70" />,
    title: "Profile Views",
    children: <p className="text-2xl font-bold">540k</p>,
  },
]

const technicalSkills = [
  {
    label: "JavaScript",
    value: 90,
  },
  {
    label: "TypeScript",
    value: 80,
  },
  {
    label: "React",
    value: 85,
  },
  {
    label: "Next.js",
    value: 85,
  },
  {
    label: "Tailwind CSS",
    value: 90,
  },
]

const certifications = [
  {
    title: "React.js Developer",
    issuer: "Udemy",
    date: "Jan 2023",
  },
  {
    title: "AWS Certified Developer - Associate",
    issuer: "Amazon Web Services",
    date: "Mar 2023",
  },
  {
    title: "TypeScript: The Complete Developer's Guide",
    issuer: "Udemy",
    date: "Dec 2023",
  },
  {
    title: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    date: "Mar 2023",
  },
]

const projects = [
  {
    title: "Mobile App Development",
    description:
      "Developed a cross-platform mobile app using React Native for a fitness tracking startup",
    technologies: ["React Native", "Firebase", "Redux"],
    hours: 200,
    earnings: 2000,
    date: "Apr 2023 - Jun 2023",
  },
  {
    title: "E-commerce Website",
    description:
      "Built a custom e-commerce website for a local business using Next.js and Tailwind CSS",
    technologies: ["Next.js", "Tailwind CSS", "Stripe"],
    hours: 150,
    earnings: 1500,
    date: "Jan 2023 - Mar 2023",
  },
  {
    title: "SaaS Application",
    description:
      "Developed a SaaS application for a startup using React, Node.js, and MongoDB",
    technologies: ["React", "Node.js", "MongoDB"],
    hours: 250,
    earnings: 2500,
    date: "Oct 2022 - Dec 2022",
  },
]

const reviews = [
  {
    rating: 4.3,
    reviewer: "Mobile App Development",
    roleReviewer: "CEO, Acme Corp",
    review:
      "John delivered an outstanding e-commerce platform. His expertise in Next.js and Node.js was evident throughout the project. Highly recommended!",
    date: "Jan 2023",
  },
  {
    rating: 4.8,
    reviewer: "E-commerce Website",
    roleReviewer: "CTO, XYZ Corp",
    review: "John is a highly skilled developer with a great work ethic. She delivered a top-notch mobile app for our startup. Will definitely hire her again!",
    date: "Dec 2022",
  },
  {
    rating: 4.5,
    reviewer: "SaaS Application",
    roleReviewer: "Founder, ABC Corp",
    review: "John is a true professional. She developed a complex SaaS application for our company and exceeded our expectations. Will hire her again for future projects!",
    date: "Nov 2022",
  },
]

export default function Page(): JSX.Element {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-4">
      <section className="">
        <Banner />
      </section>
      <section className="grid h-fit w-full gap-4 self-end  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {userStats.map((userStat) => (
          <UserCard
            key={userStat.title}
            icon={userStat.icon}
            title={userStat.title}
          >
            {userStat.children}
          </UserCard>
        ))}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-bold">Skills & Expertise</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TechnicalSkills items={technicalSkills} />
          <Certifications items={certifications} />
        </div>
      </section>
      <section className="">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <WorkHistory projects={projects} />
          <ClientReviews reviews={reviews} />
        </div>
      </section>
    </div>
  )
}
