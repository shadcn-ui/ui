/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ChatWidgetConfig {
  welcomeMessages: string[];
  inputPlaceholder: string;
  position: "bottom-left" | "bottom-right";
  brandColor: string;
  brandColorDark: string | null;
  userMessageBubbleColor: string;
  userMessageBubbleColorDark: string | null;
  headerTitle: string | null;
  width: number;
  maxHeight: number;
  offset: { x: number; y: number };
  baseFontSize: number;
  openDelay: number;
  headerUsesBrandColor: boolean;
  chatButtonIcon: string | null;
  assistantAvatar: string | null;
  chatButtonColor: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  chatWidgetConfig: ChatWidgetConfig;
}

export type Theme = "light" | "dark" | "auto";
export type WidgetType = "floating-bubble" | "sidepanel";

export interface InitOptions {
  apiKey: string;
  type?: WidgetType;
  widgetUrl?: string;
  apiUrl?: string;
  theme?: Theme;
  appUserId?: string | null;
  appContainerSelector?: string | null;
  [key: string]: any;
}

export interface IdentifyPayload {
  appUserId?: string;
  email?: string | null;
  name?: string | null;
  attributes?: Record<string, string | null>;
}

export type CommandQueueItem =
  | ["init", InitOptions]
  | ["identify", IdentifyPayload]
  | ["changeTheme", Theme]
  | ["open"]
  | ["close"]
  | ["toggle"]
  | ["track", string, any?];

export type CommandKey = CommandQueueItem[0];

export interface SiteAssistAPI {
  (cmd: "init", opts: InitOptions): void;
  (cmd: "identify", user: IdentifyPayload): void;
  (cmd: "changeTheme", theme: Theme): void;
  (cmd: "track", event: string, data?: any): void;
  (cmd: "open"): void;
  (cmd: "close"): void;
  (cmd: "toggle"): void;
  /** Temp queue set by the stub; cleared once the real API takes over. */
  _q?: CommandQueueItem[];
}

declare global {
  interface Window {
    SiteAssist?: SiteAssistAPI;
  }
}
