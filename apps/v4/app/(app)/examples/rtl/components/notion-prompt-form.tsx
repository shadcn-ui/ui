"use client"

import { useMemo, useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/examples/base/ui-rtl/avatar"
import { Badge } from "@/examples/base/ui-rtl/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/examples/base/ui-rtl/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/examples/base/ui-rtl/dropdown-menu"
import { Field, FieldLabel } from "@/examples/base/ui-rtl/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/examples/base/ui-rtl/input-group"
import { Popover, PopoverContent } from "@/examples/base/ui-rtl/popover"
import { Switch } from "@/examples/base/ui-rtl/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui-rtl/tooltip"
import {
  IconApps,
  IconArrowUp,
  IconAt,
  IconBook,
  IconCircleDashedPlus,
  IconPaperclip,
  IconPlus,
  IconWorld,
  IconX,
} from "@tabler/icons-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    prompt: "الأمر",
    placeholder: "اسأل، ابحث، أو أنشئ أي شيء...",
    addContext: "أضف سياق",
    mentionTooltip: "اذكر شخصًا أو صفحة أو تاريخًا",
    searchPages: "البحث في الصفحات...",
    noPagesFound: "لم يتم العثور على صفحات",
    pages: "الصفحات",
    users: "المستخدمون",
    attachFile: "إرفاق ملف",
    selectModel: "اختر نموذج الذكاء الاصطناعي",
    selectAgentMode: "اختر وضع الوكيل",
    webSearch: "البحث على الويب",
    appsIntegrations: "التطبيقات والتكاملات",
    allSourcesAccess: "جميع المصادر التي يمكنني الوصول إليها",
    findKnowledge: "ابحث أو استخدم المعرفة في...",
    noKnowledgeFound: "لم يتم العثور على معرفة",
    helpCenter: "مركز المساعدة",
    connectApps: "ربط التطبيقات",
    searchSourcesNote: "سنبحث فقط في المصادر المحددة هنا.",
    send: "إرسال",
    allSources: "جميع المصادر",
    auto: "تلقائي",
    agentMode: "وضع الوكيل",
    planMode: "وضع التخطيط",
    beta: "تجريبي",
    workspace: "مساحة العمل",
    meetingNotes: "ملاحظات الاجتماع",
    projectDashboard: "لوحة المشروع",
    ideasBrainstorming: "أفكار وعصف ذهني",
    calendarEvents: "التقويم والأحداث",
    documentation: "التوثيق",
    goalsObjectives: "الأهداف والغايات",
    budgetPlanning: "تخطيط الميزانية",
    teamDirectory: "دليل الفريق",
    technicalSpecs: "المواصفات التقنية",
    analyticsReport: "تقرير التحليلات",
  },
  he: {
    dir: "rtl" as const,
    prompt: "פקודה",
    placeholder: "שאל, חפש, או צור משהו...",
    addContext: "הוסף הקשר",
    mentionTooltip: "הזכר אדם, עמוד או תאריך",
    searchPages: "חפש עמודים...",
    noPagesFound: "לא נמצאו עמודים",
    pages: "עמודים",
    users: "משתמשים",
    attachFile: "צרף קובץ",
    selectModel: "בחר מודל AI",
    selectAgentMode: "בחר מצב סוכן",
    webSearch: "חיפוש באינטרנט",
    appsIntegrations: "אפליקציות ואינטגרציות",
    allSourcesAccess: "כל המקורות שיש לי גישה אליהם",
    findKnowledge: "מצא או השתמש בידע ב...",
    noKnowledgeFound: "לא נמצא ידע",
    helpCenter: "מרכז עזרה",
    connectApps: "חבר אפליקציות",
    searchSourcesNote: "נחפש רק במקורות שנבחרו כאן.",
    send: "שלח",
    allSources: "כל המקורות",
    auto: "אוטומטי",
    agentMode: "מצב סוכן",
    planMode: "מצב תכנון",
    beta: "בטא",
    workspace: "סביבת עבודה",
    meetingNotes: "הערות פגישה",
    projectDashboard: "לוח מחוונים לפרויקט",
    ideasBrainstorming: "רעיונות וסיעור מוחות",
    calendarEvents: "יומן ואירועים",
    documentation: "תיעוד",
    goalsObjectives: "מטרות ויעדים",
    budgetPlanning: "תכנון תקציב",
    teamDirectory: "ספריית צוות",
    technicalSpecs: "מפרט טכני",
    analyticsReport: "דוח אנליטיקה",
  },
}

function MentionableIcon({
  item,
}: {
  item: { type: string; title: string; image: string }
}) {
  return item.type === "page" ? (
    <span className="flex size-4 items-center justify-center">
      {item.image}
    </span>
  ) : (
    <Avatar className="size-4">
      <AvatarImage src={item.image} />
      <AvatarFallback>{item.title[0]}</AvatarFallback>
    </Avatar>
  )
}

export function NotionPromptForm() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]

  const SAMPLE_DATA = useMemo(
    () => ({
      mentionable: [
        { type: "page", title: t.meetingNotes, image: "📝" },
        { type: "page", title: t.projectDashboard, image: "📊" },
        { type: "page", title: t.ideasBrainstorming, image: "💡" },
        { type: "page", title: t.calendarEvents, image: "📅" },
        { type: "page", title: t.documentation, image: "📚" },
        { type: "page", title: t.goalsObjectives, image: "🎯" },
        { type: "page", title: t.budgetPlanning, image: "💰" },
        { type: "page", title: t.teamDirectory, image: "👥" },
        { type: "page", title: t.technicalSpecs, image: "🔧" },
        { type: "page", title: t.analyticsReport, image: "📈" },
        {
          type: "user",
          title: "shadcn",
          image: "https://github.com/shadcn.png",
          workspace: t.workspace,
        },
        {
          type: "user",
          title: "maxleiter",
          image: "https://github.com/maxleiter.png",
          workspace: t.workspace,
        },
        {
          type: "user",
          title: "evilrabbit",
          image: "https://github.com/evilrabbit.png",
          workspace: t.workspace,
        },
      ],
      models: [
        { name: t.auto },
        { name: t.agentMode, badge: t.beta },
        { name: t.planMode },
      ],
    }),
    [t]
  )

  const [mentions, setMentions] = useState<string[]>([])
  const [mentionPopoverOpen, setMentionPopoverOpen] = useState(false)
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<
    (typeof SAMPLE_DATA.models)[0]
  >(SAMPLE_DATA.models[0])
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false)

  const grouped = useMemo(() => {
    return SAMPLE_DATA.mentionable.reduce(
      (acc, item) => {
        const isAvailable = !mentions.includes(item.title)

        if (isAvailable) {
          if (!acc[item.type]) {
            acc[item.type] = []
          }
          acc[item.type].push(item)
        }
        return acc
      },
      {} as Record<string, typeof SAMPLE_DATA.mentionable>
    )
  }, [mentions, SAMPLE_DATA])

  const hasMentions = mentions.length > 0

  return (
    <div dir={t.dir}>
      <form>
        <Field>
          <FieldLabel htmlFor="rtl-notion-prompt" className="sr-only">
            {t.prompt}
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="rtl-notion-prompt"
              placeholder={t.placeholder}
            />
            <InputGroupAddon align="block-start">
              <Popover
                open={mentionPopoverOpen}
                onOpenChange={setMentionPopoverOpen}
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <InputGroupButton
                        variant="outline"
                        size={!hasMentions ? "sm" : "icon-sm"}
                        className="rounded-full transition-transform"
                      />
                    }
                    onFocusCapture={(e) => e.stopPropagation()}
                  >
                    <IconAt /> {!hasMentions && t.addContext}
                  </TooltipTrigger>
                  <TooltipContent>{t.mentionTooltip}</TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0" align="start" dir={t.dir}>
                  <Command>
                    <CommandInput placeholder={t.searchPages} />
                    <CommandList>
                      <CommandEmpty>{t.noPagesFound}</CommandEmpty>
                      {Object.entries(grouped).map(([type, items]) => (
                        <CommandGroup
                          key={type}
                          heading={type === "page" ? t.pages : t.users}
                        >
                          {items.map((item) => (
                            <CommandItem
                              key={item.title}
                              value={item.title}
                              onSelect={(currentValue) => {
                                setMentions((prev) => [...prev, currentValue])
                                setMentionPopoverOpen(false)
                              }}
                            >
                              <MentionableIcon item={item} />
                              {item.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="-m-1.5 no-scrollbar flex gap-1 overflow-y-auto p-1.5">
                {mentions.map((mention) => {
                  const item = SAMPLE_DATA.mentionable.find(
                    (item) => item.title === mention
                  )

                  if (!item) {
                    return null
                  }

                  return (
                    <InputGroupButton
                      key={mention}
                      size="sm"
                      variant="secondary"
                      className="rounded-full pr-2!"
                      onClick={() => {
                        setMentions((prev) => prev.filter((m) => m !== mention))
                      }}
                    >
                      <MentionableIcon item={item} />
                      {item.title}
                      <IconX />
                    </InputGroupButton>
                  )
                })}
              </div>
            </InputGroupAddon>
            <InputGroupAddon align="block-end" className="gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      size="icon-sm"
                      className="rounded-full"
                      aria-label={t.attachFile}
                    />
                  }
                >
                  <IconPaperclip />
                </TooltipTrigger>
                <TooltipContent>{t.attachFile}</TooltipContent>
              </Tooltip>
              <DropdownMenu
                open={modelPopoverOpen}
                onOpenChange={setModelPopoverOpen}
              >
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <InputGroupButton size="sm" className="rounded-full" />
                    }
                  >
                    {selectedModel.name}
                  </TooltipTrigger>
                  <TooltipContent>{t.selectModel}</TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="w-48"
                  dir={t.dir}
                >
                  <DropdownMenuGroup className="w-48">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {t.selectAgentMode}
                    </DropdownMenuLabel>
                    {SAMPLE_DATA.models.map((model) => (
                      <DropdownMenuCheckboxItem
                        key={model.name}
                        checked={model.name === selectedModel.name}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedModel(model)
                          }
                        }}
                        className="pr-2 *:[span:first-child]:right-auto *:[span:first-child]:left-2"
                      >
                        {model.name}
                        {model.badge && (
                          <Badge
                            variant="secondary"
                            className="h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            {model.badge}
                          </Badge>
                        )}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu
                open={scopeMenuOpen}
                onOpenChange={setScopeMenuOpen}
              >
                <DropdownMenuTrigger
                  render={
                    <InputGroupButton size="sm" className="rounded-full" />
                  }
                >
                  <IconWorld /> {t.allSources}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-72"
                  dir={t.dir}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      render={
                        <label htmlFor="rtl-web-search">
                          <IconWorld /> {t.webSearch}{" "}
                          <Switch
                            id="rtl-web-search"
                            className="ms-auto"
                            defaultChecked
                            size="sm"
                          />
                        </label>
                      }
                      onSelect={(e) => e.preventDefault()}
                    ></DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      render={
                        <label htmlFor="rtl-apps">
                          <IconApps /> {t.appsIntegrations}
                          <Switch
                            id="rtl-apps"
                            className="ms-auto"
                            defaultChecked
                            size="sm"
                          />
                        </label>
                      }
                      onSelect={(e) => e.preventDefault()}
                    ></DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconCircleDashedPlus /> {t.allSourcesAccess}
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Avatar className="size-4">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        shadcn
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent
                        className="w-72 rounded-lg p-0"
                        dir={t.dir}
                        side="left"
                      >
                        <Command>
                          <CommandInput
                            placeholder={t.findKnowledge}
                            autoFocus
                          />
                          <CommandList>
                            <CommandEmpty>{t.noKnowledgeFound}</CommandEmpty>
                            <CommandGroup>
                              {SAMPLE_DATA.mentionable
                                .filter((item) => item.type === "user")
                                .map((user) => (
                                  <CommandItem
                                    key={user.title}
                                    value={user.title}
                                    onSelect={() => {
                                      console.log("Selected user:", user.title)
                                    }}
                                  >
                                    <Avatar className="size-4">
                                      <AvatarImage src={user.image} />
                                      <AvatarFallback>
                                        {user.title[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    {user.title}{" "}
                                    <span className="text-muted-foreground">
                                      -{" "}
                                      {
                                        (user as { workspace?: string })
                                          .workspace
                                      }
                                    </span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                      <IconBook /> {t.helpCenter}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <IconPlus /> {t.connectApps}
                    </DropdownMenuItem>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {t.searchSourcesNote}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <InputGroupButton
                aria-label={t.send}
                className="ms-auto rounded-full"
                variant="default"
                size="icon-sm"
              >
                <IconArrowUp />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </form>
    </div>
  )
}
