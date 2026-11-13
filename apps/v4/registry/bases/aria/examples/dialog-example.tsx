"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import { Checkbox } from "@/registry/bases/aria/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/aria/ui/input-group"
import { Kbd } from "@/registry/bases/aria/ui/kbd"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/bases/aria/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"
import { Switch } from "@/registry/bases/aria/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/aria/ui/tabs"
import { Textarea } from "@/registry/bases/aria/ui/textarea"
import { Tooltip, TooltipTrigger } from "@/registry/bases/aria/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function DialogExample() {
  return (
    <ExampleWrapper>
      <DialogWithForm />
      <DialogScrollableContent />
      <DialogWithStickyFooter />
      <DialogNoCloseButton />
      <DialogChatSettings />
    </ExampleWrapper>
  )
}

function DialogWithForm() {
  return (
    <Example title="With Form" className="items-center justify-center">
      <DialogTrigger>
        <form>
          <Button variant="outline">Edit Profile</Button>
          <Dialog>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done. Your profile will be updated immediately.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name-1">Name</FieldLabel>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="username-1">Username</FieldLabel>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue="@peduarte"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose variant="outline">Cancel</DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </Dialog>
        </form>
      </DialogTrigger>
    </Example>
  )
}

function DialogScrollableContent() {
  return (
    <Example title="Scrollable Content" className="items-center justify-center">
      <DialogTrigger>
        <Button variant="outline">Scrollable Content</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4 style-luma:-mx-6 style-luma:px-6 style-rhea:-mx-6 style-rhea:px-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}

function DialogWithStickyFooter() {
  return (
    <Example title="With Sticky Footer" className="items-center justify-center">
      <DialogTrigger>
        <Button variant="outline">Sticky Footer</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4 style-luma:-mx-6 style-luma:px-6 style-rhea:-mx-6 style-rhea:px-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
          <DialogFooter>
            <DialogClose variant="outline">Close</DialogClose>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}

function DialogNoCloseButton() {
  return (
    <Example title="No Close Button" className="items-center justify-center">
      <DialogTrigger>
        <Button variant="outline">No Close Button</Button>
        <Dialog showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>No Close Button</DialogTitle>
            <DialogDescription>
              This dialog doesn&apos;t have a close button in the top-right
              corner.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose variant="outline">Close</DialogClose>
          </DialogFooter>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}

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

function DialogChatSettings() {
  const [tab, setTab] = React.useState("general")
  const [theme, setTheme] = React.useState("system")
  const [accentColor, setAccentColor] = React.useState("default")
  const [spokenLanguage, setSpokenLanguage] = React.useState("en")
  const [voice, setVoice] = React.useState("samantha")

  return (
    <Example title="Chat Settings" className="items-center justify-center">
      <DialogTrigger>
        <Button variant="outline">Chat Settings</Button>
        <Dialog className="min-w-md">
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
            <Tabs
              selectedKey={tab}
              onSelectionChange={(key) => setTab(String(key))}
            >
              <TabsList className="hidden w-full md:flex">
                <TabsTrigger id="general">General</TabsTrigger>
                <TabsTrigger id="notifications">Notifications</TabsTrigger>
                <TabsTrigger id="personalization">Personalization</TabsTrigger>
                <TabsTrigger id="security">Security</TabsTrigger>
              </TabsList>
              <div className="border **:data-[slot=select-trigger]:min-w-[125px] style-vega:min-h-[550px] style-vega:rounded-lg style-vega:p-6 style-nova:min-h-[460px] style-nova:rounded-lg style-nova:p-4 style-lyra:min-h-[450px] style-lyra:rounded-none style-lyra:p-4 style-maia:min-h-[550px] style-maia:rounded-xl style-maia:p-6 style-mira:min-h-[450px] style-mira:rounded-md style-mira:p-4 style-luma:min-h-[550px] style-luma:rounded-xl style-luma:p-6 style-rhea:min-h-[480px] style-rhea:rounded-2xl style-rhea:p-6">
                <TabsContent id="general">
                  <FieldSet>
                    <FieldGroup>
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="theme">Theme</FieldLabel>
                        <Select
                          value={theme}
                          onChange={(value) => setTheme(String(value))}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent placement="bottom end">
                            <SelectGroup>
                              {themes.map((theme) => (
                                <SelectItem key={theme.value} id={theme.value}>
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
                          value={accentColor}
                          onChange={(value) => setAccentColor(String(value))}
                        >
                          <SelectTrigger id="accent-color">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent placement="bottom end">
                            <SelectGroup>
                              {accents.map((accent) => (
                                <SelectItem
                                  key={accent.value}
                                  id={accent.value}
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
                          value={spokenLanguage}
                          onChange={(value) => setSpokenLanguage(String(value))}
                        >
                          <SelectTrigger id="spoken-language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent placement="bottom end">
                            <SelectGroup>
                              {spokenLanguages.map((language) => (
                                <SelectItem
                                  key={language.value}
                                  id={language.value}
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
                          value={voice}
                          onChange={(value) => setVoice(String(value))}
                        >
                          <SelectTrigger id="voice">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent placement="bottom end">
                            <SelectGroup>
                              {voices.map((voice) => (
                                <SelectItem key={voice.value} id={voice.value}>
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
                <TabsContent id="notifications">
                  <FieldGroup>
                    <FieldSet>
                      <FieldLabel>Responses</FieldLabel>
                      <FieldDescription>
                        Get notified when ChatGPT responds to requests that take
                        time, like research or image generation.
                      </FieldDescription>
                      <FieldGroup data-slot="checkbox-group">
                        <Field orientation="horizontal">
                          <Checkbox id="push" defaultSelected isDisabled />
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
                <TabsContent id="personalization">
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
                          <TooltipTrigger>
                            <InputGroupButton size="icon-xs">
                              <IconPlaceholder
                                lucide="InfoIcon"
                                tabler="IconInfoCircle"
                                hugeicons="AlertCircleIcon"
                                phosphor="InfoIcon"
                                remixicon="RiInformationLine"
                              />
                            </InputGroupButton>
                            <Tooltip className="flex items-center gap-2">
                              Used to identify you in the chat. <Kbd>N</Kbd>
                            </Tooltip>
                          </TooltipTrigger>
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
                        <Switch id="customization" defaultSelected />
                      </Field>
                    </FieldLabel>
                  </FieldGroup>
                </TabsContent>
                <TabsContent id="security">
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
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}
