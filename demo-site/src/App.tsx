import { useEffect, useState, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Gem,
  HandHeart,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TextLink } from "@/components/ui/text-link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FeatureIcon, type FeatureShape } from "@/components/feature-icon"
import { Marquee } from "@/components/marquee"
import { MorphPhoto } from "@/components/morph-photo"
import { TypewriterHeading } from "@/components/typewriter-heading"
import { cn } from "@/lib/utils"

const PLACEHOLDER_PROMPTS = [
  "Plan a romantic 5 day trip to Rome for couples",
  "Find a sunny beach escape for under £800",
  "Build me a 2 week road trip through California",
  "Where should I go for a long weekend in October?",
]

const EXAMPLE_PROMPTS = [
  "Create a new trip",
  "Inspire me where to go",
  "Plan a road trip",
  "Plan a last-minute escape",
]

const DESTINATIONS = [
  {
    title: "Family - Europe Trip",
    image: "/Card-1.jpg",
  },
  {
    title: "Couples - Honeymoon in Jordan",
    image: "/Card-2.jpg",
  },
  {
    title: "Road Trip Highway 1 - USA",
    image: "/Card-3.jpg",
  },
]

const FEATURES: {
  shape: FeatureShape
  icon: ReactNode
  title: string
  paragraph: string
}[] = [
  {
    shape: "flower",
    icon: <HandHeart />,
    title: "Tailor-made",
    paragraph:
      "Ask Layla to create a personalized itinerary tailored to your preferences and travel style.",
  },
  {
    shape: "quatrefoil",
    icon: <CircleDollarSign />,
    title: "Cheaper",
    paragraph:
      "Layla makes you find the best deals and offers, saving you money on your travel plans.",
  },
  {
    shape: "tulip",
    icon: <Gem />,
    title: "Hidden Gems",
    paragraph:
      "Layla uncovers hidden gems and off-the-beaten-path destinations, ensuring you experience the best of your destination.",
  },
  {
    shape: "stack",
    icon: <ShieldCheck />,
    title: "No Surprises",
    paragraph:
      "Layla ensures everything runs smoothly, from flights to accommodations, with no unpleasant surprises.",
  },
]

const TRAVEL_PARTNERS = [
  { src: "/logos/travel-partners/skyscanner.svg", alt: "Skyscanner", h: "h-7" },
  { src: "/logos/travel-partners/GetYourGuide.svg", alt: "GetYourGuide", h: "h-10" },
  { src: "/logos/travel-partners/Viator.svg", alt: "Viator", h: "h-6" },
  { src: "/logos/travel-partners/hotel-booking-logo.svg", alt: "Booking", h: "h-6" },
]

const HEADLINE_LOGOS = [
  { src: "/logos/headlines/the_new_york_times_logo.svg", alt: "The New York Times", h: "h-6" },
  { src: "/logos/headlines/business_insider_logo.svg", alt: "Business Insider", h: "h-5" },
  { src: "/logos/headlines/usa_today_logo.svg", alt: "USA Today", h: "h-7" },
  { src: "/logos/headlines/tech_crunch_small.png", alt: "TechCrunch", h: "h-7" },
  { src: "/logos/headlines/skift_logo.png", alt: "Skift", h: "h-7" },
  { src: "/logos/headlines/phocuswire_logo.svg", alt: "PhocusWire", h: "h-7" },
  { src: "/logos/headlines/travolution_logo.svg", alt: "Travolution", h: "h-8" },
]

function renderLogo(logo: { src: string; alt: string; h: string }) {
  return (
    <img
      key={logo.alt}
      src={logo.src}
      alt={logo.alt}
      className={cn(
        "w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0",
        logo.h
      )}
    />
  )
}

const INVESTORS = [
  {
    img: "/people/investors/investor_1.jpg",
    name: "Brent Hoberman",
    position: "Co-founder",
    company: "lastminute.com",
    shape: "quatrefoil",
  },
  {
    img: "/people/investors/investor_2.jpg",
    name: "Barry Smith",
    position: "Co-founder",
    company: "Skyscanner",
    shape: "hexagon",
  },
  {
    img: "/people/investors/investor_3.jpg",
    name: "Andy Phillips",
    position: "Founder",
    company: "booking.com",
    shape: "flower",
  },
  {
    img: "/people/investors/investor_4.jpg",
    name: "Paris Hilton",
    position: "Business Woman",
    company: "Hilton Hotels",
    shape: "quatrefoil",
  },
]

const FAQ_ANSWERS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.",
]

const FAQS = [
  "What is Layla.ai?",
  "How does Layla.ai work?",
  "Can a human travel expert plan and book my entire trip?",
  "Is Layla.ai better than a traditional travel agent?",
  "Can Layla.ai save me money on trips?",
  "Can Layla.ai handle multi-city or road trips?",
  "Can Layla.ai plan family trips?",
  "Is Layla.ai good for solo travelers?",
  "Does Layla.ai plan trips for couples?",
  "How many days should I spend on a trip planned with Layla.ai?",
  "What types of experiences does Layla.ai include?",
  "Is Layla.ai free to use?",
]

const MINDS = [
  {
    img: "/people/minds/Wahab.webp",
    name: "A. Wahab Khan",
    role: "Design",
    shape: "flower",
    bio: "Wahab leads product design, shaping how millions of travelers experience Layla from the very first prompt through to their final itinerary. He's happiest sweating the small details that make planning feel effortless.",
  },
  {
    img: "/people/minds/Robin.webp",
    name: "Robin Amorim",
    role: "Design",
    shape: "hexagon",
    bio: "Robin crafts the visual language and interaction details that make planning a trip feel calm and delightful. She believes great design should disappear, leaving only the joy of the journey ahead.",
  },
  {
    img: "/people/minds/Somto.webp",
    name: "Somto Zikora",
    role: "Engineering",
    shape: "quatrefoil",
    bio: "Somto builds the systems behind the scenes, turning messy real-world travel data into fast, reliable recommendations you can trust. He's obsessed with making the complex feel instant.",
  },
  {
    img: "/people/minds/Xavi.webp",
    name: "Xavier Serra",
    role: "Product",
    shape: "hexagon",
    bio: "Xavier sets the product vision, obsessing over the small moments that save travelers time, money, and stress. He's spent a decade figuring out what makes a trip truly unforgettable.",
  },
]

// Four carousel pages. Pages 2–4 are placeholders (reuse page 1) until the
// remaining team members are supplied.
const MIND_PAGES = [MINDS, MINDS, MINDS, MINDS]

function renderMind(
  person: {
    img: string
    name: string
    role: string
    shape: string
    bio: string
  },
  index: number
) {
  const shape = person.shape
  return (
    <Dialog key={`${person.name}-${index}`}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex cursor-pointer flex-col items-center rounded-2xl text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
        >
          {/* Photo morphs its shape on hover */}
          <MorphPhoto
            src={person.img}
            alt={person.name}
            className="aspect-square w-full max-w-48"
          />
          <p className="mt-5 text-xl font-semibold">{person.name}</p>
          <p className="mt-1.5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {person.role}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline">
            Read more
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:text-left">
            <div
              className="size-24 shrink-0"
              style={{ clipPath: `url(#${shape})` }}
            >
              <img
                src={person.img}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <DialogTitle className="text-xl">{person.name}</DialogTitle>
              <p className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {person.role}
              </p>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="text-sm leading-relaxed">
          {person.bio}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

type SliderItem =
  | { type: "image"; src: string }
  | { type: "text"; variant: "plum" | "lilac"; text: string }

const TOP_SLIDER: SliderItem[] = [
  { type: "text", variant: "plum", text: "A foodie trip to Tokyo" },
  { type: "image", src: "/slider-images/lifestyle-1.jpg" },
  { type: "text", variant: "lilac", text: "Plan a weekend in Paris" },
  { type: "image", src: "/slider-images/lifestyle-3.jpg" },
  { type: "text", variant: "plum", text: "Where to next?" },
  { type: "image", src: "/slider-images/lifestyle-8.jpg" },
  { type: "text", variant: "lilac", text: "Find me a beach escape" },
  { type: "image", src: "/slider-images/lifestyle-17.jpg" },
]

const BOTTOM_SLIDER: SliderItem[] = [
  { type: "text", variant: "plum", text: "Surprise me with somewhere new" },
  { type: "image", src: "/slider-images/bottom-row/lifestyle-4.jpg" },
  { type: "text", variant: "lilac", text: "Best time to visit Bali?" },
  { type: "image", src: "/slider-images/bottom-row/lifestyle-5.jpg" },
  { type: "text", variant: "plum", text: "A romantic week in Rome" },
  { type: "image", src: "/slider-images/bottom-row/lifestyle-22.jpg" },
  { type: "text", variant: "lilac", text: "Plan a weekend in Paris" },
  { type: "image", src: "/slider-images/bottom-row/lifestyle-14.jpg" },
]

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: ["Home", "About", "Blog", "Contact", "FAQ", "Press"],
  },
  { title: "Product", links: ["Roam Around"] },
  { title: "Legal", links: ["Privacy", "Terms", "Imprint", "Cookie settings"] },
  {
    title: "Top Countries",
    links: [
      "Spain",
      "Italy",
      "Portugal",
      "Indonesia",
      "Germany",
      "All Countries",
    ],
  },
  { title: "Plan", links: ["Couple Travel Agent", "Family Travel Agent"] },
]

const FOOTER_SOCIALS = [
  "TikTok",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Reddit",
]

function renderSliderPills(items: SliderItem[]) {
  return items.map((item, index) =>
    item.type === "image" ? (
      <div
        key={index}
        className="mr-4 h-22 w-60 shrink-0 overflow-hidden rounded-full"
      >
        <img src={item.src} alt="" className="size-full object-cover" />
      </div>
    ) : (
      <div
        key={index}
        className={cn(
          "mr-4 flex h-22 min-w-60 shrink-0 items-center justify-center rounded-full px-8 text-center text-lg font-medium whitespace-nowrap",
          item.variant === "plum"
            ? "dark bg-background text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {item.text}
      </div>
    )
  )
}

export function App() {
  const [prompt, setPrompt] = useState("")
  const [typedPlaceholder, setTypedPlaceholder] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [mindPage, setMindPage] = useState(0)

  // Typewriter effect: type each example prompt, hold, delete, then advance.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    // Respect reduced-motion: show a single static prompt, no animation.
    if (reduceMotion) {
      setTypedPlaceholder(PLACEHOLDER_PROMPTS[0])
      return
    }

    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId: number

    const tick = () => {
      const current = PLACEHOLDER_PROMPTS[phraseIndex]

      if (!deleting) {
        charIndex += 1
        setTypedPlaceholder(current.slice(0, charIndex))
        if (charIndex === current.length) {
          deleting = true
          timeoutId = window.setTimeout(tick, 2200) // hold on the full phrase
          return
        }
        timeoutId = window.setTimeout(tick, 55) // typing speed
      } else {
        charIndex -= 1
        setTypedPlaceholder(current.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % PLACEHOLDER_PROMPTS.length
          timeoutId = window.setTimeout(tick, 500) // pause before next phrase
          return
        }
        timeoutId = window.setTimeout(tick, 28) // deleting speed (faster)
      }
    }

    timeoutId = window.setTimeout(tick, 700)
    return () => window.clearTimeout(timeoutId)
  }, [])

  // Blinking cursor appended to the typewriter placeholder.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }
    const blink = window.setInterval(() => {
      setCursorVisible((visible) => !visible)
    }, 530)

    return () => window.clearInterval(blink)
  }, [])

  return (
    <div className="flex min-h-svh flex-col">
      {/* SVG quatrefoil clip-path (union of four circles), referenced by the video */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="quatrefoil" clipPathUnits="objectBoundingBox">
            <circle cx="0.3" cy="0.3" r="0.3" />
            <circle cx="0.7" cy="0.3" r="0.3" />
            <circle cx="0.3" cy="0.7" r="0.3" />
            <circle cx="0.7" cy="0.7" r="0.3" />
          </clipPath>
          {/* Scalloped flower: 8 petals around a filled centre */}
          <clipPath id="flower" clipPathUnits="objectBoundingBox">
            <circle cx="0.83" cy="0.5" r="0.17" />
            <circle cx="0.733" cy="0.733" r="0.17" />
            <circle cx="0.5" cy="0.83" r="0.17" />
            <circle cx="0.267" cy="0.733" r="0.17" />
            <circle cx="0.17" cy="0.5" r="0.17" />
            <circle cx="0.267" cy="0.267" r="0.17" />
            <circle cx="0.5" cy="0.17" r="0.17" />
            <circle cx="0.733" cy="0.267" r="0.17" />
            <circle cx="0.5" cy="0.5" r="0.32" />
          </clipPath>
          {/* Soft-edged hexagon */}
          <clipPath id="hexagon" clipPathUnits="objectBoundingBox">
            <path d="M 0.6051 0.0328 L 0.8949 0.1922 Q 1 0.25 1 0.37 L 1 0.63 Q 1 0.75 0.8949 0.8078 L 0.6051 0.9672 Q 0.5 1.025 0.3949 0.9672 L 0.1051 0.8078 Q 0 0.75 0 0.63 L 0 0.37 Q 0 0.25 0.1051 0.1922 L 0.3949 0.0328 Q 0.5 -0.025 0.6051 0.0328 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Navigation bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur">
        <nav className="flex h-16 w-full items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <Boxes className="size-5" />
            Made Up Co.
          </a>
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </nav>
      </header>

      {/* Hero — fills the first screen (viewport height minus the 4rem header) */}
      <main className="flex min-h-[calc(100svh-4rem)] flex-col justify-center px-6 py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* Left: headline, prompt box, example prompts */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Your trip. Planned in minutes.
              </h1>
              <p className="text-lg text-muted-foreground">
                Live prices, all in one place, and a human expert when you need
                one.
              </p>
            </div>

            {/* Prompt box: borderless textarea + control row, ring wraps the whole thing */}
            <div className="rounded-2xl border border-input bg-card shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={`${typedPlaceholder}${cursorVisible ? "│" : " "}`}
                className="min-h-[100px] resize-none border-0 bg-transparent px-5 pt-4 shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
              <div className="flex items-center justify-between px-5 pb-5">
                {/* Bottom-left: attachment (no background), pulled left to optically align with the text */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Attach a file"
                  className="-ml-2.5"
                >
                  <Paperclip />
                </Button>
                {/* Bottom-right: microphone (no background) + send (icon button) */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Use microphone"
                  >
                    <Mic />
                  </Button>
                  <Button type="button" size="icon" aria-label="Send prompt">
                    <Send />
                  </Button>
                </div>
              </div>
            </div>

            {/* Example prompt buttons */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <Button
                  key={example}
                  type="button"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>

            {/* Scroll cue */}
            <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
              <span>See how I can help you</span>
              <ArrowDown className="size-4 animate-bounce" />
            </div>
          </div>

          {/* Right: video clipped to the quatrefoil shape */}
          <div className="mx-auto aspect-square w-full max-w-sm">
            <video
              className="size-full object-cover [clip-path:url(#quatrefoil)]"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/hero-intro-variant-c.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </main>

      {/* Dark plum banner (contained/inset panel) */}
      <section className="px-6 py-12">
        <div className="dark mx-auto max-w-6xl rounded-3xl bg-background px-8 py-16 text-foreground lg:px-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Left: copy + CTA */}
            <div className="flex flex-col items-start gap-6">
              <TypewriterHeading
                className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                segments={[
                  { text: "Your trip in " },
                  { text: "minutes", className: "text-primary" },
                  { text: ", not weeks." },
                ]}
              />
              <p className="flex items-baseline gap-2 text-muted-foreground">
                <span className="text-3xl font-semibold text-foreground">
                  2,093,713
                </span>
                trips planned
              </p>
              <Button size="lg">Plan my trip</Button>
            </div>

            {/* Image clipped to the quatrefoil shape (moves to the left on desktop) */}
            <div className="mx-auto aspect-square w-full max-w-sm lg:order-first">
              <img
                src="/lifestyle-13.jpg"
                alt=""
                className="size-full object-cover [clip-path:url(#quatrefoil)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destination cards */}
      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">
            Where to go next
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((destination, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <img
                    src={destination.image}
                    alt=""
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-col gap-4">
                  <CardTitle className="text-xl">
                    {destination.title}
                  </CardTitle>
                  <TextLink
                    href="#"
                    aria-label={`Start planning: ${destination.title}`}
                    className="after:absolute after:inset-0"
                  >
                    Start planning
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </TextLink>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature columns */}
      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              I will be there for you in every step
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Curate, save and get notified about your trips on the go.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-4 text-center"
              >
                <FeatureIcon shape={feature.shape}>{feature.icon}</FeatureIcon>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.paragraph}
                </p>
                <TextLink href="#" className="group mt-auto">
                  Read more
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </TextLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling pills + display text */}
      <section className="space-y-12 py-20">
        <Marquee>{renderSliderPills(TOP_SLIDER)}</Marquee>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-6xl font-extrabold tracking-tight text-balance sm:text-7xl lg:text-8xl">
            Less Stress More Serotonin.
          </h2>
        </div>
        <Marquee reverse>{renderSliderPills(BOTTOM_SLIDER)}</Marquee>
      </section>

      {/* Lilac feature banner (contained/inset panel) */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-3xl bg-primary px-8 py-16 text-primary-foreground lg:px-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Copy + CTA */}
            <div className="flex flex-col items-start gap-6">
              <TypewriterHeading
                className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                segments={[{ text: "All-in-One AI Trip Planner" }]}
              />
              <p className="text-lg">
                Get inspired with personalized destination ideas and stunning
                video content from creators you&rsquo;ll love. Then, customize
                every detail to make the most of your precious vacation days.
              </p>
              <Button variant="plum" size="lg">
                Get started
              </Button>
            </div>

            {/* Image clipped to the scalloped flower shape (left on desktop) */}
            <div className="mx-auto aspect-square w-full max-w-sm lg:order-first">
              <img
                src="/lifestyle-10.jpg"
                alt=""
                className="size-full object-cover [clip-path:url(#flower)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partner + press logos */}
      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
            Powered by trusted travel partners
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {TRAVEL_PARTNERS.map(renderLogo)}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            My investors
          </h2>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {INVESTORS.map((investor) => (
              <div
                key={investor.name}
                className="group flex flex-col items-center text-center"
              >
                <MorphPhoto
                  src={investor.img}
                  alt={investor.name}
                  className="aspect-square w-full max-w-48"
                />
                <p className="mt-5 text-xl font-semibold">{investor.name}</p>
                <p className="mt-1.5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {investor.position}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {investor.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minds behind the Mission (carousel) */}
      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            The minds behind the mission
          </h2>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${mindPage * 100}%)` }}
            >
              {MIND_PAGES.map((people, pageIndex) => (
                <div key={pageIndex} className="w-full shrink-0">
                  <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                    {people.map((person, i) => renderMind(person, i))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls: arrows with page dots between them */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Previous"
              onClick={() =>
                setMindPage(
                  (p) => (p - 1 + MIND_PAGES.length) % MIND_PAGES.length
                )
              }
            >
              <ChevronLeft />
            </Button>

            <div className="flex items-center gap-2">
              {MIND_PAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === mindPage}
                  onClick={() => setMindPage(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === mindPage
                      ? "w-6 bg-foreground"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Next"
              onClick={() => setMindPage((p) => (p + 1) % MIND_PAGES.length)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-10 lg:grid-cols-3 lg:gap-16">
          {/* Title — left column on desktop, first on mobile */}
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Find answers to common questions about Layla's AI travel planning
              service
            </p>
          </div>

          {/* Accordion — left column, two-thirds */}
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((question, i) => (
                <AccordionItem key={question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-base">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {FAQ_ANSWERS[i % FAQ_ANSWERS.length]}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Making headlines */}
      <section className="px-6 py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
            Making headlines worldwide
          </h2>
          <div className="flex flex-col items-center gap-y-10">
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              {HEADLINE_LOGOS.slice(0, 3).map(renderLogo)}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              {HEADLINE_LOGOS.slice(3).map(renderLogo)}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA banner (contained/inset, plum) */}
      <section className="px-6 py-12">
        <div className="dark mx-auto max-w-6xl rounded-3xl bg-background px-8 py-16 text-foreground lg:px-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Copy + CTA */}
            <div className="flex flex-col items-start gap-6">
              <TypewriterHeading
                className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                segments={[{ text: "Ready to give it a try?" }]}
              />
              <p className="text-lg text-muted-foreground">
                Turn any idea into a trip in under a minute.
              </p>
              <Button size="lg">Try Layla now</Button>
            </div>

            {/* Image clipped to the quatrefoil shape (left on desktop) */}
            <div className="mx-auto aspect-square w-full max-w-sm lg:order-first">
              <img
                src="/slider-images/lifestyle-8.jpg"
                alt=""
                className="size-full object-cover [clip-path:url(#quatrefoil)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-16 text-foreground">
        <div className="mx-auto w-full max-w-6xl">
          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-sm font-semibold tracking-wide">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Full-width divider */}
          <hr className="my-10 border-t" />

          {/* Bottom row: attribution (left) + social links (right) */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Made with 💜 in Berlin
              <br />© 2026 All rights reserved by Layla AI GmbH
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_SOCIALS.map((social) => (
                <li key={social}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
