"use client"

import { useState } from "react"
import { CircleIcon, InfoIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

const spokenLanguages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
  { label: "Bengali", value: "bn" },
  { label: "Telugu", value: "te" },
  { label: "Marathi", value: "mr" },
  { label: "Kannada", value: "kn" },
  { label: "Malayalam", value: "ml" },
]

const voices = [
  { label: "Samantha", value: "samantha" },
  { label: "Alex", value: "alex" },
  { label: "Fred", value: "fred" },
  { label: "Victoria", value: "victoria" },
  { label: "Tom", value: "tom" },
  { label: "Karen", value: "karen" },
  { label: "Sam", value: "sam" },
  { label: "Daniel", value: "daniel" },
]

const personalities = [
  {
    label: "Friendly",
    value: "friendly",
    description: "Friendly and approachable.",
  },
  {
    label: "Professional",
    value: "professional",
    description: "Professional and authoritative.",
  },
  { label: "Funny", value: "funny", description: "Funny and light-hearted." },
  {
    label: "Sarcastic",
    value: "sarcastic",
    description: "Sarcastic and witty.",
  },
  { label: "Cynical", value: "cynical", description: "Cynical and skeptical." },
]

const instructions = [
  {
    label: "Witty",
    value: "witty",
    description: "Use quick and clever responses when appropriate.",
  },
  {
    label: "Professional",
    value: "professional",
    description: "Have a professional and authoritative tone.",
  },
  {
    label: "Funny",
    value: "funny",
    description: "Use humor and wit to engage the user.",
  },
  {
    label: "Sarcastic",
    value: "sarcastic",
    description: "Use sarcasm and wit to engage the user.",
  },
  {
    label: "Cynical",
    value: "cynical",
    description: "Use cynicism and skepticism to engage the user.",
  },
]

export function ChatSettings() {
  const [tab, setTab] = useState("general")
  const [theme, setTheme] = useState("system")
  const [accentColor, setAccentColor] = useState("default")
  const [spokenLanguage, setSpokenLanguage] = useState("en")
  const [voice, setVoice] = useState("samantha")
  const [personality, setPersonality] = useState("friendly")
  const [customInstructions, setCustomInstructions] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" asChild className="w-full md:hidden">
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value)}
          className="appearance-none"
        >
          <option value="general">General</option>
          <option value="notifications">Notifications</option>
          <option value="personalization">Personalization</option>
          <option value="security">Security</option>
        </select>
      </Button>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="hidden md:flex">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <div className="rounded-lg border p-6 [&_[data-slot=select-trigger]]:min-w-[125px]">
          <TabsContent value="general">
            <FieldSet>
              <FieldGroup>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="theme">Theme</FieldLabel>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <FieldSeparator />
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="accent-color">Accent Color</FieldLabel>
                  <Select value={accentColor} onValueChange={setAccentColor}>
                    <SelectTrigger id="accent-color">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="default">
                        <CircleIcon className="fill-neutral-500 stroke-neutral-500 dark:fill-neutral-400 dark:stroke-neutral-400" />
                        Default
                      </SelectItem>
                      <SelectItem value="red">
                        <CircleIcon className="fill-red-500 stroke-red-500 dark:fill-red-400 dark:stroke-red-400" />
                        Red
                      </SelectItem>
                      <SelectItem value="blue">
                        <CircleIcon className="fill-blue-500 stroke-blue-500 dark:fill-blue-400 dark:stroke-blue-400" />
                        Blue
                      </SelectItem>
                      <SelectItem value="green">
                        <CircleIcon className="fill-green-500 stroke-green-500 dark:fill-green-400 dark:stroke-green-400" />
                        Green
                      </SelectItem>
                      <SelectItem value="purple">
                        <CircleIcon className="fill-purple-500 stroke-purple-500 dark:fill-purple-400 dark:stroke-purple-400" />
                        Purple
                      </SelectItem>
                      <SelectItem value="pink">
                        <CircleIcon className="fill-pink-500 stroke-pink-500 dark:fill-pink-400 dark:stroke-pink-400" />
                        Pink
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <FieldSeparator />
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="spoken-language">
                      Spoken Language
                    </FieldLabel>
                    <FieldDescription>
                      For best results, select the language you mainly speak. If
                      it&apos;s not listed, it may still be supported via
                      auto-detection.
                    </FieldDescription>
                  </FieldContent>
                  <Select
                    value={spokenLanguage}
                    onValueChange={setSpokenLanguage}
                  >
                    <SelectTrigger id="spoken-language">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent align="end" position="item-aligned">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectSeparator />
                      {spokenLanguages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <FieldSeparator />
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="voice">Voice</FieldLabel>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger id="voice">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent align="end" position="item-aligned">
                      {voices.map((voice) => (
                        <SelectItem key={voice.value} value={voice.value}>
                          {voice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>
          </TabsContent>
          <TabsContent value="notifications">
            <FieldGroup>
              <FieldSet>
                <FieldLabel>Responses</FieldLabel>
                <FieldDescription>
                  Get notified when ChatGPT responds to requests that take time,
                  like research or image generation.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  <Field orientation="horizontal">
                    <Checkbox id="push" defaultChecked disabled />
                    <FieldLabel htmlFor="push" className="font-normal">
                      Push notifications
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLabel>Tasks</FieldLabel>
                <FieldDescription>
                  Get notified when tasks you&apos;ve created have updates.{" "}
                  <a href="#">Manage tasks</a>
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  <Field orientation="horizontal">
                    <Checkbox id="push-tasks" />
                    <FieldLabel htmlFor="push-tasks" className="font-normal">
                      Push notifications
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="email-tasks" />
                    <FieldLabel htmlFor="email-tasks" className="font-normal">
                      Email notifications
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </TabsContent>
          <TabsContent value="personalization">
            <FieldGroup>
              <Field orientation="responsive">
                <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="nickname"
                    placeholder="Broski"
                    className="@md/field-group:max-w-[200px]"
                  />
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InputGroupButton size="icon-xs">
                          <InfoIcon />
                        </InputGroupButton>
                      </TooltipTrigger>
                      <TooltipContent className="flex items-center gap-2">
                        Used to identify you in the chat. <Kbd>N</Kbd>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <FieldSeparator />
              <Field
                orientation="responsive"
                className="@md/field-group:flex-col @2xl/field-group:flex-row"
              >
                <FieldContent>
                  <FieldLabel htmlFor="about">More about you</FieldLabel>
                  <FieldDescription>
                    Tell us more about yourself. This will be used to help us
                    personalize your experience.
                  </FieldDescription>
                </FieldContent>
                <Textarea
                  id="about"
                  placeholder="I'm a software engineer..."
                  className="min-h-[120px] @md/field-group:min-w-full @2xl/field-group:min-w-[300px]"
                />
              </Field>
              <FieldSeparator />
              <FieldLabel>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="customization">
                      Enable customizations
                    </FieldLabel>
                    <FieldDescription>
                      Enable customizations to make ChatGPT more personalized.
                    </FieldDescription>
                  </FieldContent>
                  <Switch id="customization" defaultChecked />
                </Field>
              </FieldLabel>
              <FieldSeparator />
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="personality">
                    ChatGPT Personality
                  </FieldLabel>
                  <FieldDescription>
                    Set the style and tone ChatGPT should use when responding.
                  </FieldDescription>
                </FieldContent>
                <Select value={personality} onValueChange={setPersonality}>
                  <SelectTrigger id="personality">
                    {personalities.find((p) => p.value === personality)?.label}
                  </SelectTrigger>
                  <SelectContent align="end">
                    {personalities.map((personality) => (
                      <SelectItem
                        key={personality.value}
                        value={personality.value}
                      >
                        <FieldContent className="gap-0.5">
                          <FieldLabel>{personality.label}</FieldLabel>
                          <FieldDescription className="text-xs">
                            {personality.description}
                          </FieldDescription>
                        </FieldContent>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <FieldSeparator />
              <Field>
                <FieldLabel htmlFor="instructions">
                  Custom Instructions
                </FieldLabel>
                <Textarea
                  id="instructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {instructions.map((instruction) => (
                    <Button
                      variant="outline"
                      key={instruction.value}
                      value={instruction.value}
                      className="rounded-full"
                      size="sm"
                      onClick={() =>
                        setCustomInstructions(
                          `${customInstructions} ${instruction.description}`
                        )
                      }
                    >
                      {instruction.label}
                    </Button>
                  ))}
                </div>
              </Field>
            </FieldGroup>
          </TabsContent>
          <TabsContent value="security">
            <FieldGroup>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="2fa">
                    Multi-factor authentication
                  </FieldLabel>
                  <FieldDescription>
                    Enable multi-factor authentication to secure your account.
                    If you do not have a two-factor authentication device, you
                    can use a one-time code sent to your email.
                  </FieldDescription>
                </FieldContent>
                <Switch id="2fa" />
              </Field>
              <FieldSeparator />
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Log out</FieldTitle>
                  <FieldDescription>
                    Log out of your account on this device.
                  </FieldDescription>
                </FieldContent>
                <Button variant="outline" size="sm">
                  Log Out
                </Button>
              </Field>
              <FieldSeparator />
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Log out of all devices</FieldTitle>
                  <FieldDescription>
                    This will log you out of all devices, including the current
                    session. It may take up to 30 minutes for the changes to
                    take effect.
                  </FieldDescription>
                </FieldContent>
                <Button variant="outline" size="sm">
                  Log Out All
                </Button>
              </Field>
            </FieldGroup>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
