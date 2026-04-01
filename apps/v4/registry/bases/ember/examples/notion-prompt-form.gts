import { fn } from '@ember/helper';
import { get } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
} from '@/ui/dropdown-menu';
import { Field, FieldLabel } from '@/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/ui/input-group';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ui/popover';
import { Switch } from '@/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';

import ArrowUp from '~icons/lucide/arrow-up';
import At from '~icons/lucide/at-sign';
import BookOpen from '~icons/lucide/book-open';
import Globe from '~icons/lucide/globe';
import Grid3x3 from '~icons/lucide/grid-3x3';
import Paperclip from '~icons/lucide/paperclip';
import Plus from '~icons/lucide/plus';
import PlusCircle from '~icons/lucide/plus-circle';
import X from '~icons/lucide/x';

const SAMPLE_DATA = {
  mentionable: [
    {
      type: 'page',
      title: 'Meeting Notes',
      image: '📝',
    },
    {
      type: 'page',
      title: 'Project Dashboard',
      image: '📊',
    },
    {
      type: 'page',
      title: 'Ideas & Brainstorming',
      image: '💡',
    },
    {
      type: 'page',
      title: 'Calendar & Events',
      image: '📅',
    },
    {
      type: 'page',
      title: 'Documentation',
      image: '📚',
    },
    {
      type: 'page',
      title: 'Goals & Objectives',
      image: '🎯',
    },
    {
      type: 'page',
      title: 'Budget Planning',
      image: '💰',
    },
    {
      type: 'page',
      title: 'Team Directory',
      image: '👥',
    },
    {
      type: 'page',
      title: 'Technical Specs',
      image: '🔧',
    },
    {
      type: 'page',
      title: 'Analytics Report',
      image: '📈',
    },
    {
      type: 'user',
      title: 'shadcn',
      image: 'https://github.com/shadcn.png',
      workspace: 'Workspace',
    },
    {
      type: 'user',
      title: 'maxleiter',
      image: 'https://github.com/maxleiter.png',
      workspace: 'Workspace',
    },
    {
      type: 'user',
      title: 'evilrabbit',
      image: 'https://github.com/evilrabbit.png',
      workspace: 'Workspace',
    },
  ],
  models: [
    {
      name: 'Auto',
    },
    {
      name: 'Agent Mode',
      badge: 'Beta',
    },
    {
      name: 'Plan Mode',
    },
  ],
};

type MentionableItem = (typeof SAMPLE_DATA.mentionable)[0];

class MentionableIcon extends Component<{ Args: { item: MentionableItem } }> {
  get isPage() {
    return this.args.item.type === 'page';
  }

  get fallback() {
    return this.args.item.title[0];
  }

  <template>
    {{#if this.isPage}}
      <span class="flex size-4 items-center justify-center">
        {{@item.image}}
      </span>
    {{else}}
      <Avatar @class="size-4">
        <AvatarImage @src={{@item.image}} />
        <AvatarFallback>{{this.fallback}}</AvatarFallback>
      </Avatar>
    {{/if}}
  </template>
}

class NotionPromptForm extends Component {
  @tracked mentions: string[] = [];
  @tracked mentionPopoverOpen = false;
  @tracked modelPopoverOpen = false;
  @tracked selectedModel = SAMPLE_DATA.models[0];
  @tracked scopeMenuOpen = false;
  @tracked webSearchEnabled = true;
  @tracked appsEnabled = true;

  get grouped() {
    return SAMPLE_DATA.mentionable.reduce(
      (acc, item) => {
        const isAvailable = !this.mentions.includes(item.title);

        if (isAvailable) {
          if (!acc[item.type]) {
            acc[item.type] = [];
          }
          acc[item.type]!.push(item);
        }
        return acc;
      },
      {} as Record<string, typeof SAMPLE_DATA.mentionable>
    );
  }

  get hasMentions() {
    return this.mentions.length > 0;
  }

  addMention = (mention: string) => {
    this.mentions = [...this.mentions, mention];
    this.mentionPopoverOpen = false;
  };

  removeMention = (mention: string) => {
    this.mentions = this.mentions.filter((m) => m !== mention);
  };

  selectModel = (model: (typeof SAMPLE_DATA.models)[0]) => {
    this.selectedModel = model;
  };

  handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
  };

  get mentionedItems() {
    return this.mentions
      .map((mention) =>
        SAMPLE_DATA.mentionable.find((item) => item.title === mention)
      )
      .filter((item): item is MentionableItem => item !== undefined);
  }

  get userItems() {
    return SAMPLE_DATA.mentionable.filter((item) => item.type === 'user');
  }

  stopPropagation = (e: Event) => {
    e.stopPropagation();
  };

  noop = () => {};

  getGroupHeading = (type: string) => {
    return type === 'page' ? 'Pages' : 'Users';
  };

  isModelSelected = (modelName: string) => {
    return modelName === this.selectedModel?.name;
  };

  toggleWebSearch = () => {
    this.webSearchEnabled = !this.webSearchEnabled;
  };

  toggleApps = () => {
    this.appsEnabled = !this.appsEnabled;
  };

  <template>
    <form class="[--radius:1.2rem]" {{on "submit" this.handleSubmit}}>
      <Field>
        <FieldLabel @class="sr-only" @for="notion-prompt">
          Prompt
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="notion-prompt"
            placeholder="Ask, search, or make anything..."
          />
          <InputGroupAddon @align="block-start">
            <Popover
              @onOpenChange={{fn (mut this.mentionPopoverOpen)}}
              @open={{this.mentionPopoverOpen}}
            >
              <Tooltip>
                <TooltipTrigger {{on "focusin" this.stopPropagation}}>
                  <PopoverTrigger>
                    <InputGroupButton
                      @class="rounded-full transition-transform"
                      @size={{if this.hasMentions "icon-sm" "sm"}}
                      @variant="outline"
                    >
                      <At />
                      {{#unless this.hasMentions}}Add context{{/unless}}
                    </InputGroupButton>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Mention a person, page, or date</TooltipContent>
              </Tooltip>
              <PopoverContent @align="start" @class="p-0 [--radius:1.2rem]">
                <Command>
                  <CommandInput placeholder="Search pages..." />
                  <CommandList>
                    <CommandEmpty>No pages found</CommandEmpty>
                    {{#each-in this.grouped as |type items|}}
                      <CommandGroup @heading={{this.getGroupHeading type}}>
                        {{#each items as |item|}}
                          <CommandItem
                            @onSelect={{this.addMention}}
                            @value={{item.title}}
                          >
                            <MentionableIcon @item={{item}} />
                            {{item.title}}
                          </CommandItem>
                        {{/each}}
                      </CommandGroup>
                    {{/each-in}}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div
              class="no-scrollbar -m-1.5 flex max-w-full gap-1 overflow-x-auto p-1.5"
            >
              {{#each this.mentionedItems as |item|}}
                <InputGroupButton
                  @class="rounded-full !pl-2"
                  @size="sm"
                  @variant="secondary"
                  {{on "click" (fn this.removeMention item.title)}}
                >
                  <MentionableIcon @item={{item}} />
                  {{item.title}}
                  <X />
                </InputGroupButton>
              {{/each}}
            </div>
          </InputGroupAddon>
          <InputGroupAddon @align="block-end" @class="gap-1">
            <Tooltip>
              <TooltipTrigger>
                <InputGroupButton
                  @class="rounded-full"
                  @size="icon-sm"
                  @variant="ghost"
                  aria-label="Attach file"
                >
                  <Paperclip />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <DropdownMenu
              @onOpenChange={{fn (mut this.modelPopoverOpen)}}
              @open={{this.modelPopoverOpen}}
            >
              <Tooltip>
                <TooltipTrigger>
                  <DropdownMenuTrigger>
                    <InputGroupButton
                      @class="rounded-full"
                      @size="sm"
                      @variant="ghost"
                    >
                      {{this.selectedModel.name}}
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Select AI model</TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                @align="start"
                @class="[--radius:1rem]"
                @side="top"
              >
                <DropdownMenuGroup @class="w-42">
                  <DropdownMenuLabel @class="text-muted-foreground text-xs">
                    Select Agent Mode
                  </DropdownMenuLabel>
                  {{#each SAMPLE_DATA.models as |model|}}
                    <DropdownMenuCheckboxItem
                      @checked={{this.isModelSelected model.name}}
                      @class="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
                      @onCheckedChange={{fn this.selectModel model}}
                    >
                      {{model.name}}
                      {{#if model.badge}}
                        <Badge
                          @class="h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          @variant="secondary"
                        >
                          {{model.badge}}
                        </Badge>
                      {{/if}}
                    </DropdownMenuCheckboxItem>
                  {{/each}}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu
              @onOpenChange={{fn (mut this.scopeMenuOpen)}}
              @open={{this.scopeMenuOpen}}
            >
              <DropdownMenuTrigger>
                <InputGroupButton
                  @class="rounded-full"
                  @size="sm"
                  @variant="ghost"
                >
                  <Globe />
                  All Sources
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent @align="end" @class="[--radius:1rem]">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    @asChild={{true}}
                    @onSelect={{this.noop}}
                    as |item|
                  >
                    <label class={{item.classes}} for="web-search">
                      <Globe />
                      Web Search
                      <Switch
                        @checked={{this.webSearchEnabled}}
                        @class="ml-auto"
                        @onCheckedChange={{this.toggleWebSearch}}
                        id="web-search"
                      />
                    </label>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    @asChild={{true}}
                    @onSelect={{this.noop}}
                    as |item|
                  >
                    <label class={{item.classes}} for="apps">
                      <Grid3x3 />
                      Apps and Integrations
                      <Switch
                        @checked={{this.appsEnabled}}
                        @class="ml-auto"
                        @onCheckedChange={{this.toggleApps}}
                        id="apps"
                      />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PlusCircle />
                    All Sources I can access
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Avatar @class="size-4">
                        <AvatarImage @src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      shadcn
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent @class="w-72 p-0 [--radius:1rem]">
                      <Command>
                        {{! template-lint-disable no-pointer-down-event-binding }}
                        <CommandInput
                          placeholder="Find or use knowledge in..."
                          {{on "click" this.stopPropagation}}
                          {{on "pointerdown" this.stopPropagation}}
                        />
                        <CommandList>
                          <CommandEmpty>No knowledge found</CommandEmpty>
                          <CommandGroup>
                            {{#each this.userItems as |user|}}
                              <CommandItem @value={{user.title}}>
                                <Avatar @class="size-4">
                                  <AvatarImage @src={{user.image}} />
                                  <AvatarFallback>{{get
                                      user.title
                                      0
                                    }}</AvatarFallback>
                                </Avatar>
                                {{user.title}}
                                <span class="text-muted-foreground">
                                  -
                                  {{user.workspace}}
                                </span>
                              </CommandItem>
                            {{/each}}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <BookOpen />
                    Help Center
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Plus />
                    Connect Apps
                  </DropdownMenuItem>
                  <DropdownMenuLabel @class="text-muted-foreground text-xs">
                    We'll only search in the sources selected here.
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              @class="ml-auto rounded-full"
              @size="icon-sm"
              @variant="default"
              aria-label="Send"
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  </template>
}

export default NotionPromptForm;
