"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui/button"
import { Checkbox } from "@/examples/base/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/base/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import { Kbd } from "@/examples/base/ui/kbd"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/base/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"
import { Switch } from "@/examples/base/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/base/ui/tabs"
import { Textarea } from "@/examples/base/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"
import { InfoIcon } from "lucide-react"

const spokenLanguages = [
  { label: "Auto", value: "auto" },
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

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
]

const accents = [
  { label: "Default", value: "default" },
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Purple", value: "purple" },
  { label: "Pink", value: "pink" },
]

export function DialogChatSettings() {
  const [tab, setTab] = React.useState("general")
  const [theme, setTheme] = React.useState("system")
  const [accentColor, setAccentColor] = React.useState("default")
  const [spokenLanguage, setSpokenLanguage] = React.useState("en")
  const [voice, setVoice] = React.useState("samantha")

  return (
    <>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Chat Settings
        </DialogTrigger>
        <DialogContent className="min-w-md">
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
            <DialogDescription>
              Customize your chat settings: theme, accent color, spoken
              language, voice, personality, and custom instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <NativeSelect
              value={tab}
              onChange={(e) => setTab(e.target.value)}
              className="w-full md:hidden"
            >
              <NativeSelectOption value="general">General</NativeSelectOption>
              <NativeSelectOption value="notifications">
                Notifications
              </NativeSelectOption>
              <NativeSelectOption value="personalization">
                Personalization
              </NativeSelectOption>
              <NativeSelectOption value="security">Security</NativeSelectOption>
            </NativeSelect>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="hidden w-full md:flex">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="personalization">
                  Personalization
                </TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <div className="style-nova:p-4 style-vega:p-6 style-maia:p-6 style-mira:p-4 style-lyra:p-4 style-vega:min-h-[550px] style-maia:min-h-[550px] style-mira:min-h-[450px] style-lyra:min-h-[450px] style-nova:min-h-[460px] style-nova:rounded-lg style-vega:rounded-lg style-maia:rounded-xl style-mira:rounded-md style-lyra:rounded-none border [&_[data-slot=select-trigger]]:min-w-[125px]">
                <TabsContent value="general">
                  <FieldSet>
                    <FieldGroup>
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="theme">Theme</FieldLabel>
                        <Select
                          items={themes}
                          value={theme}
                          onValueChange={(value) => setTheme(value as string)}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectGroup>
                              {themes.map((theme) => (
                                <SelectItem
                                  key={theme.value}
                                  value={theme.value}
                                >
                                  {theme.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <FieldSeparator />
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="accent-color">
                          Accent Color
                        </FieldLabel>
                        <Select
                          items={accents}
                          value={accentColor}
                          onValueChange={(value) =>
                            setAccentColor(value as string)
                          }
                        >
                          <SelectTrigger id="accent-color">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectGroup>
                              {accents.map((accent) => (
                                <SelectItem
                                  key={accent.value}
                                  value={accent.value}
                                >
                                  {accent.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
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
                            For best results, select the language you mainly
                            speak. If it&apos;s not listed, it may still be
                            supported via auto-detection.
                          </FieldDescription>
                        </FieldContent>
                        <Select
                          items={spokenLanguages}
                          value={spokenLanguage}
                          onValueChange={(value) =>
                            setSpokenLanguage(value as string)
                          }
                        >
                          <SelectTrigger id="spoken-language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectGroup>
                              {spokenLanguages.map((language) => (
                                <SelectItem
                                  key={language.value}
                                  value={language.value}
                                >
                                  {language.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <FieldSeparator />
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="voice">Voice</FieldLabel>
                        <Select
                          items={voices}
                          value={voice}
                          onValueChange={(value) => setVoice(value as string)}
                        >
                          <SelectTrigger id="voice">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectGroup>
                              {voices.map((voice) => (
                                <SelectItem
                                  key={voice.value}
                                  value={voice.value}
                                >
                                  {voice.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
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
                        Get notified when ChatGPT responds to requests that take
                        time, like research or image generation.
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
                        Get notified when tasks you&apos;ve created have
                        updates. <a href="#">Manage tasks</a>
                      </FieldDescription>
                      <FieldGroup data-slot="checkbox-group">
                        <Field orientation="horizontal">
                          <Checkbox id="push-tasks" />
                          <FieldLabel
                            htmlFor="push-tasks"
                            className="font-normal"
                          >
                            Push notifications
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox id="email-tasks" />
                          <FieldLabel
                            htmlFor="email-tasks"
                            className="font-normal"
                          >
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
                            <TooltipTrigger
                              render={<InputGroupButton size="icon-xs" />}
                            >
                              <InfoIcon />
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
                          Tell us more about yourself. This will be used to help
                          us personalize your experience.
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
                            Enable customizations to make ChatGPT more
                            personalized.
                          </FieldDescription>
                        </FieldContent>
                        <Switch id="customization" defaultChecked />
                      </Field>
                    </FieldLabel>
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
                          Enable multi-factor authentication to secure your
                          account. If you do not have a two-factor
                          authentication device, you can use a one-time code
                          sent to your email.
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
                          This will log you out of all devices, including the
                          current session. It may take up to 30 minutes for the
                          changes to take effect.
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
        </DialogContent>
      </Dialog>
    </>
  )
}
