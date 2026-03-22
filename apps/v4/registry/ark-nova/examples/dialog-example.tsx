"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-nova/components/example"
import { Button } from "@/registry/ark-nova/ui/button"
import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
} from "@/registry/ark-nova/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/ark-nova/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/registry/ark-nova/ui/field"
import { Input } from "@/registry/ark-nova/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/ark-nova/ui/input-group"
import { Kbd } from "@/registry/ark-nova/ui/kbd"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/ark-nova/ui/native-select"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/ark-nova/ui/select"
import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchThumb,
} from "@/registry/ark-nova/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/ark-nova/ui/tabs"
import { Textarea } from "@/registry/ark-nova/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/ark-nova/ui/tooltip"
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
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
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
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </Example>
  )
}

function DialogScrollableContent() {
  return (
    <Example title="Scrollable Content" className="items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Scrollable Content</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4">
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
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function DialogWithStickyFooter() {
  return (
    <Example title="With Sticky Footer" className="items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Sticky Footer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4">
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
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function DialogNoCloseButton() {
  return (
    <Example title="No Close Button" className="items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">No Close Button</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>No Close Button</DialogTitle>
            <DialogDescription>
              This dialog doesn&apos;t have a close button in the top-right
              corner.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

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

const themeItems = createListCollection({
  items: [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ],
})

const accentColorItems = createListCollection({
  items: [
    { label: "Default", value: "default", color: "bg-neutral-500 dark:bg-neutral-400" },
    { label: "Red", value: "red", color: "bg-red-500 dark:bg-red-400" },
    { label: "Blue", value: "blue", color: "bg-blue-500 dark:bg-blue-400" },
    { label: "Green", value: "green", color: "bg-green-500 dark:bg-green-400" },
    { label: "Purple", value: "purple", color: "bg-purple-500 dark:bg-purple-400" },
    { label: "Pink", value: "pink", color: "bg-pink-500 dark:bg-pink-400" },
  ],
})

const spokenLanguageItems = createListCollection({
  items: [
    { label: "Auto", value: "auto" },
    ...spokenLanguages,
  ],
})

const voiceItems = createListCollection({
  items: voices,
})

function DialogChatSettings() {
  const [tab, setTab] = React.useState("general")
  const [theme, setTheme] = React.useState("system")
  const [accentColor, setAccentColor] = React.useState("default")
  const [spokenLanguage, setSpokenLanguage] = React.useState("en")
  const [voice, setVoice] = React.useState("samantha")

  return (
    <Example title="Chat Settings" className="items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Chat Settings</Button>
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
              <div className="border style-vega:min-h-[550px] style-vega:rounded-lg style-vega:p-6 style-nova:min-h-[460px] style-nova:rounded-lg style-nova:p-4 style-lyra:min-h-[450px] style-lyra:rounded-none style-lyra:p-4 style-maia:min-h-[550px] style-maia:rounded-xl style-maia:p-6 style-mira:min-h-[450px] style-mira:rounded-md style-mira:p-4 [&_[data-slot=select-trigger]]:min-w-[125px]">
                <TabsContent value="general">
                  <FieldSet>
                    <FieldGroup>
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="theme">Theme</FieldLabel>
                        <Select collection={themeItems} value={[theme]} onValueChange={(details) => setTheme(details.value[0])}>
                          <SelectControl>
                            <SelectTrigger id="theme">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectIndicator />
                          </SelectControl>
                          <SelectContent align="end">
                            <SelectItemGroup>
                              {themeItems.items.map((item) => (
                                <SelectItem key={item.value} item={item}>
                                  <SelectItemText>{item.label}</SelectItemText>
                                  <SelectItemIndicator />
                                </SelectItem>
                              ))}
                            </SelectItemGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <FieldSeparator />
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="accent-color">
                          Accent Color
                        </FieldLabel>
                        <Select
                          collection={accentColorItems}
                          value={[accentColor]}
                          onValueChange={(details) => setAccentColor(details.value[0])}
                        >
                          <SelectControl>
                            <SelectTrigger id="accent-color">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectIndicator />
                          </SelectControl>
                          <SelectContent align="end">
                            <SelectItemGroup>
                              {accentColorItems.items.map((item) => (
                                <SelectItem key={item.value} item={item}>
                                  <SelectItemText>
                                    <div className={`size-3 rounded-full ${item.color}`} />
                                    {item.label}
                                  </SelectItemText>
                                  <SelectItemIndicator />
                                </SelectItem>
                              ))}
                            </SelectItemGroup>
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
                          collection={spokenLanguageItems}
                          value={[spokenLanguage]}
                          onValueChange={(details) => setSpokenLanguage(details.value[0])}
                        >
                          <SelectControl>
                            <SelectTrigger id="spoken-language">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectIndicator />
                          </SelectControl>
                          <SelectContent align="end">
                            <SelectItemGroup>
                              <SelectItem item={spokenLanguageItems.items[0]}>
                                <SelectItemText>Auto</SelectItemText>
                                <SelectItemIndicator />
                              </SelectItem>
                            </SelectItemGroup>
                            <SelectSeparator />
                            <SelectItemGroup>
                              {spokenLanguages.map((language) => (
                                <SelectItem
                                  key={language.value}
                                  item={language}
                                >
                                  <SelectItemText>{language.label}</SelectItemText>
                                  <SelectItemIndicator />
                                </SelectItem>
                              ))}
                            </SelectItemGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <FieldSeparator />
                      <Field orientation="horizontal">
                        <FieldLabel htmlFor="voice">Voice</FieldLabel>
                        <Select collection={voiceItems} value={[voice]} onValueChange={(details) => setVoice(details.value[0])}>
                          <SelectControl>
                            <SelectTrigger id="voice">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectIndicator />
                          </SelectControl>
                          <SelectContent align="end">
                            <SelectItemGroup>
                              {voices.map((v) => (
                                <SelectItem
                                  key={v.value}
                                  item={v}
                                >
                                  <SelectItemText>{v.label}</SelectItemText>
                                  <SelectItemIndicator />
                                </SelectItem>
                              ))}
                            </SelectItemGroup>
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
                          <Checkbox id="push" defaultChecked disabled>
                            <CheckboxControl>
                              <CheckboxIndicator />
                            </CheckboxControl>
                            <CheckboxHiddenInput />
                          </Checkbox>
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
                          <Checkbox id="push-tasks">
                            <CheckboxControl>
                              <CheckboxIndicator />
                            </CheckboxControl>
                            <CheckboxHiddenInput />
                          </Checkbox>
                          <FieldLabel
                            htmlFor="push-tasks"
                            className="font-normal"
                          >
                            Push notifications
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox id="email-tasks">
                            <CheckboxControl>
                              <CheckboxIndicator />
                            </CheckboxControl>
                            <CheckboxHiddenInput />
                          </Checkbox>
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
                            <TooltipTrigger asChild>
                              <InputGroupButton size="icon-xs">
                                <IconPlaceholder
                                  lucide="InfoIcon"
                                  tabler="IconInfoCircle"
                                  hugeicons="AlertCircleIcon"
                                  phosphor="InfoIcon"
                                  remixicon="RiInformationLine"
                                />
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
                        <Switch id="customization" defaultChecked>
                          <SwitchControl>
                            <SwitchThumb />
                          </SwitchControl>
                          <SwitchHiddenInput />
                        </Switch>
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
                      <Switch id="2fa">
                        <SwitchControl>
                          <SwitchThumb />
                        </SwitchControl>
                        <SwitchHiddenInput />
                      </Switch>
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
    </Example>
  )
}
