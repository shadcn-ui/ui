#!/usr/bin/env tsx
/**
 * Builds + validates the lucide -> material-symbols (rounded, unfilled) name map.
 *
 *   pnpm --filter=v4 tsx scripts/build-material-symbols-map.ts          # write map + report
 *   pnpm --filter=v4 tsx scripts/build-material-symbols-map.ts --check  # CI guard, no writes
 *
 * Source of truth for the curated entries is OVERRIDES below. Everything else is
 * derived by snake_case heuristic and validated against the actual svg-400 files.
 */
import * as fs from "fs"
import * as path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

const ROUNDED_DIR = path.join(
  path.dirname(require.resolve("@material-symbols/svg-400/package.json")),
  "rounded"
)
const MAP_PATH = path.join(
  process.cwd(),
  "registry/icons/material-symbols-map.json"
)
const BASES_DIR = path.join(process.cwd(), "registry/bases")

// Hand-curated lucide -> material-symbols(rounded) names. Used where the plain
// snake_case heuristic does not land on a real svg, or lands on a poor match.
const OVERRIDES: Record<string, string> = {
  AlertCircleIcon: "error",
  AlertTriangleIcon: "warning",
  AppWindowIcon: "web_asset",
  ArchiveXIcon: "archive",
  ArrowLeftCircleIcon: "arrow_circle_left",
  ArrowLeftRightIcon: "swap_horiz",
  ArrowUpRightIcon: "north_east",
  AudioLinesIcon: "graphic_eq",
  BadgeCheck: "verified",
  BadgeCheckIcon: "verified",
  BlocksIcon: "widgets",
  BookOpen: "menu_book",
  BookOpenIcon: "menu_book",
  BotIcon: "smart_toy",
  Building2Icon: "apartment",
  CalculatorIcon: "calculate",
  CaptionsIcon: "closed_caption",
  CarIcon: "directions_car",
  ChartBarIcon: "bar_chart",
  ChartLineIcon: "show_chart",
  ChartPieIcon: "pie_chart",
  CheckCircle2Icon: "check_circle",
  ChevronsLeftIcon: "keyboard_double_arrow_left",
  ChevronsRightIcon: "keyboard_double_arrow_right",
  ChevronsUpDownIcon: "unfold_more",
  ChevronDownIcon: "keyboard_arrow_down",
  ChevronUpIcon: "keyboard_arrow_up",
  ChevronLeftIcon: "chevron_left",
  ChevronRightIcon: "chevron_right",
  CircleAlertIcon: "error",
  CircleCheckIcon: "check_circle",
  CircleDashedIcon: "circle",
  CircleHelpIcon: "help",
  CirclePlusIcon: "add_circle",
  CircleUserRoundIcon: "account_circle",
  ClipboardPasteIcon: "content_paste",
  Clock2Icon: "schedule",
  CodeIcon: "code",
  Columns3Icon: "view_column",
  CommandIcon: "keyboard_command_key",
  ContainerIcon: "deployed_code",
  CornerUpLeftIcon: "turn_left",
  CornerUpRightIcon: "turn_right",
  CreditCardIcon: "credit_card",
  EllipsisVerticalIcon: "more_vert",
  ExternalLinkIcon: "open_in_new",
  EyeOffIcon: "visibility_off",
  EyeIcon: "visibility",
  FileBarChartIcon: "bar_chart",
  FileChartColumnIcon: "bar_chart",
  FileCodeIcon: "code",
  FileTextIcon: "description",
  FileIcon: "description",
  FlipHorizontalIcon: "flip",
  FlipVerticalIcon: "flip",
  FolderOpenIcon: "folder_open",
  FolderPlusIcon: "create_new_folder",
  FolderSearchIcon: "folder",
  FrameIcon: "crop_square",
  GalleryVerticalEndIcon: "stacks",
  GaugeIcon: "speed",
  GripVerticalIcon: "drag_indicator",
  HelpCircleIcon: "help",
  LayoutDashboardIcon: "dashboard",
  LayoutGridIcon: "grid_view",
  LayoutIcon: "dashboard",
  LifeBuoy: "support",
  LifeBuoyIcon: "support",
  Loader2Icon: "progress_activity",
  LoaderIcon: "progress_activity",
  LockKeyholeIcon: "lock",
  LogOutIcon: "logout",
  MailIcon: "mail",
  MaximizeIcon: "fullscreen",
  MessageCircleQuestionIcon: "quiz",
  MessageCircleIcon: "chat_bubble",
  MessageSquareIcon: "chat",
  MicIcon: "mic",
  MinimizeIcon: "fullscreen_exit",
  MoreHorizontalIcon: "more_horiz",
  MoreVerticalIcon: "more_vert",
  OctagonXIcon: "dangerous",
  PaintbrushIcon: "brush",
  PanelLeftIcon: "left_panel_open",
  PencilIcon: "edit",
  PieChartIcon: "pie_chart",
  PlusCircleIcon: "add_circle",
  RadioIcon: "radio",
  RefreshCwIcon: "refresh",
  RepeatIcon: "repeat",
  RotateCwIcon: "rotate_right",
  SaveIcon: "save",
  ScissorsIcon: "content_cut",
  Send: "send",
  Settings2Icon: "settings",
  ShoppingBagIcon: "shopping_bag",
  ShoppingCartIcon: "shopping_cart",
  SmileIcon: "mood",
  SparklesIcon: "star_shine",
  StarOffIcon: "star",
  TerminalSquareIcon: "terminal",
  ThermometerIcon: "device_thermostat",
  TimerIcon: "timer",
  Trash2Icon: "delete",
  TrashIcon: "delete",
  TrendingDownIcon: "trending_down",
  TrendingUpIcon: "trending_up",
  TriangleAlertIcon: "warning",
  UnderlineIcon: "format_underlined",
  UploadCloudIcon: "cloud_upload",
  UserRoundXIcon: "person_off",
  Volume2Icon: "volume_up",
  VolumeOffIcon: "volume_off",
  VolumeX: "volume_off",
  WalletIcon: "wallet",
  ZapIcon: "bolt",
  ZoomInIcon: "zoom_in",
  ZoomOutIcon: "zoom_out",
  BoldIcon: "format_bold",
  ItalicIcon: "format_italic",
  ListIcon: "list",
  GlobeIcon: "globe",
  KeyboardIcon: "keyboard",
  // Misses where lucide vocab differs from material-symbols vocab.
  ActivityIcon: "monitor_heart",
  ArrowDownIcon: "arrow_downward",
  ArrowUpIcon: "arrow_upward",
  BellIcon: "notifications",
  CalendarIcon: "calendar_month",
  CopyIcon: "content_copy",
  HeartIcon: "favorite",
  LanguagesIcon: "translate",
  MinusIcon: "remove",
  MoonIcon: "dark_mode",
  PlusIcon: "add",
  ServerIcon: "dns",
  SunIcon: "light_mode",
  UserIcon: "person",
  UsersIcon: "group",
  VideoIcon: "videocam",
  XIcon: "close",
}

function findTsxFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...findTsxFiles(full))
    else if (entry.isFile() && entry.name.endsWith(".tsx")) out.push(full)
  }
  return out
}

function distinctLucideNames(): string[] {
  const re = /lucide=["']([^"']+)["']/g
  const names = new Set<string>()
  for (const file of findTsxFiles(BASES_DIR)) {
    const content = fs.readFileSync(file, "utf-8")
    let m
    while ((m = re.exec(content)) !== null) names.add(m[1])
  }
  return [...names].sort()
}

// "ChevronDownIcon" -> "chevron_down"; strips trailing "Icon".
function snakeCandidate(lucide: string): string {
  return lucide
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase()
}

function exists(ms: string): boolean {
  return fs.existsSync(path.join(ROUNDED_DIR, `${ms}.svg`))
}

function main() {
  const check = process.argv.includes("--check")
  const lucideNames = distinctLucideNames()

  const map: Record<string, string> = {}
  const viaOverride: string[] = []
  const viaHeuristic: string[] = []
  const misses: string[] = []
  const badOverrides: string[] = []

  for (const lucide of lucideNames) {
    if (lucide in OVERRIDES) {
      const ms = OVERRIDES[lucide]
      if (!exists(ms)) badOverrides.push(`${lucide} -> ${ms} (no svg)`)
      else {
        map[lucide] = ms
        viaOverride.push(`${lucide} -> ${ms}`)
      }
      continue
    }
    const cand = snakeCandidate(lucide)
    if (exists(cand)) {
      map[lucide] = cand
      viaHeuristic.push(`${lucide} -> ${cand}`)
    } else {
      misses.push(`${lucide} (tried "${cand}")`)
    }
  }

  console.log(`Rounded SVG dir: ${ROUNDED_DIR}`)
  console.log(
    `lucide icons: ${lucideNames.length} | override: ${viaOverride.length} | heuristic: ${viaHeuristic.length} | MISS: ${misses.length}`
  )
  if (badOverrides.length) {
    console.log("\n❌ Bad overrides (svg not found):")
    badOverrides.forEach((l) => console.log(`  - ${l}`))
  }
  if (misses.length) {
    console.log("\n⚠ Unmapped (add to OVERRIDES):")
    misses.forEach((l) => console.log(`  - ${l}`))
  }

  if (check) {
    if (badOverrides.length || misses.length) {
      console.error("\nMap incomplete or invalid.")
      process.exit(1)
    }
    // Validate the committed map matches what we'd generate.
    const onDisk = fs.existsSync(MAP_PATH)
      ? fs.readFileSync(MAP_PATH, "utf-8")
      : ""
    if (onDisk.trim() !== JSON.stringify(map, null, 2)) {
      console.error("\nmaterial-symbols-map.json is stale. Re-run without --check.")
      process.exit(1)
    }
    console.log("\n✓ Map valid and up to date.")
    return
  }

  if (badOverrides.length) {
    console.error("\nFix bad overrides before writing.")
    process.exit(1)
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + "\n")
  console.log(`\n✓ Wrote ${Object.keys(map).length} entries to ${MAP_PATH}`)
  if (misses.length) {
    console.log("⚠ Map is INCOMPLETE — curate the misses above into OVERRIDES.")
  }
}

main()
