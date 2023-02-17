import { Example } from "@/types"
import {
  FileQuestion,
  Forward,
  Globe,
  GraduationCap,
  Tag,
  Terminal,
  User,
} from "lucide-react"

export const examples: Example[] = [
  {
    title: "Q&A",
    description: "Answer questions based on existing knowledge.",
    icon: FileQuestion,
    color: "#19c37d",
    href: "/",
  },
  {
    title: "Grammar correction",
    description: "Correct grammatical errors in a sentence.",
    icon: GraduationCap,
    color: "#5436da",
    href: "/",
  },
  {
    title: "Summarize for a 2nd grader",
    description: "Translates difficult text into simpler concepts.",
    icon: Forward,
    color: "#ef4146",
    href: "/",
  },
  {
    title: "Text to command",
    description: "Converts text to a command that can be executed.",
    icon: Terminal,
    color: "#f4ac36",
    href: "/",
  },
  {
    title: "English to other languages",
    description: "Translates English text into French, Spanish and Japanese.",
    icon: Globe,
    color: "#19c37d",
    href: "/",
  },
  {
    title: "Classification",
    description: "Classifies text into categories via example.",
    icon: Tag,
    color: "#F4AC35",
    href: "/",
  },
]
