import { computed, defineComponent, h, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { ComputedRef, InjectionKey, PropType, Ref } from 'vue'
import { PanelLeft } from 'lucide-vue-next'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'
import Sheet from '../sheet/Sheet.vue'
import SheetContent from '../sheet/SheetContent.vue'

interface SidebarContext {
  open: ComputedRef<boolean>
  openMobile: ComputedRef<boolean>
  isMobile: Ref<boolean>
  setOpen: (open: boolean) => void
  setOpenMobile: (open: boolean) => void
  toggle: () => void
  toggleSidebar: () => void
}

const SIDEBAR_KEY: InjectionKey<SidebarContext> = Symbol('saaze-sidebar')

export const SidebarProvider = defineComponent({
  name: 'SidebarProvider',
  inheritAttrs: false,
  props: {
    defaultOpen: { type: Boolean, default: true },
    open: { type: Boolean, default: undefined },
    openMobile: { type: Boolean, default: undefined },
  },
  emits: ['update:open', 'update:openMobile', 'openChange'],
  setup(props, { attrs, slots, emit }) {
    const localOpen = ref(props.defaultOpen)
    const localOpenMobile = ref(false)
    const isMobile = ref(false)
    const open = computed(() => props.open ?? localOpen.value)
    const openMobile = computed(() => props.openMobile ?? localOpenMobile.value)
    const setOpen = (value: boolean) => {
      localOpen.value = value
      emit('update:open', value)
      emit('openChange', value)
    }
    const setOpenMobile = (value: boolean) => {
      localOpenMobile.value = value
      emit('update:openMobile', value)
    }
    const toggle = () => setOpen(!open.value)
    const toggleSidebar = () => {
      if (isMobile.value) setOpenMobile(!openMobile.value)
      else toggle()
    }
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault()
        toggleSidebar()
      }
    }
    let mediaQuery: MediaQueryList | undefined
    const onMediaChange = (event: MediaQueryListEvent) => {
      isMobile.value = event.matches
    }
    onMounted(() => {
      mediaQuery = window.matchMedia('(max-width: 767px)')
      isMobile.value = mediaQuery.matches
      mediaQuery.addEventListener('change', onMediaChange)
      window.addEventListener('keydown', onKeydown)
    })
    onBeforeUnmount(() => {
      mediaQuery?.removeEventListener('change', onMediaChange)
      window.removeEventListener('keydown', onKeydown)
    })

    provide(SIDEBAR_KEY, {
      open,
      openMobile,
      isMobile,
      setOpen,
      setOpenMobile,
      toggle,
      toggleSidebar,
    })
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'sidebar-provider',
          'data-state': open.value ? 'expanded' : 'collapsed',
          'data-mobile': isMobile.value ? 'true' : 'false',
          class: cn('group/sidebar-provider flex min-h-svh w-full min-w-0', attrs.class),
        },
        slots.default?.(),
      )
  },
})

export function useSidebar(): SidebarContext {
  const context = inject(SIDEBAR_KEY)
  if (!context) throw new Error('Sidebar components must be used inside SidebarProvider.')
  return context
}

export const Sidebar = defineComponent({
  name: 'Sidebar',
  inheritAttrs: false,
  props: {
    /** لبه منطقی نوار کناری؛ `left`/`right` برای سازگاری با shadcn معادل `start`/`end` هستند. */
    side: { type: String as PropType<'start' | 'end' | 'left' | 'right'>, default: 'start' },
    variant: { type: String as PropType<'sidebar' | 'floating' | 'inset'>, default: 'sidebar' },
    collapsible: {
      type: String as PropType<'offcanvas' | 'icon' | 'none'>,
      default: 'icon',
    },
  },
  setup(props, { attrs, slots }) {
    const { open, openMobile, isMobile, setOpenMobile } = useSidebar()
    const collapsed = computed(() => !open.value && props.collapsible !== 'none')
    const side = computed<'start' | 'end'>(() =>
      props.side === 'end' || props.side === 'right' ? 'end' : 'start',
    )
    return () => {
      const sidebar = h(
        'aside',
        {
          ...attrs,
          'data-slot': 'sidebar',
          'data-state': collapsed.value ? 'collapsed' : 'expanded',
          'data-side': side.value,
          'data-variant': props.variant,
          'data-collapsible': collapsed.value ? props.collapsible : 'none',
          class: cn(
            'group/sidebar relative flex h-svh shrink-0 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 ease-linear',
            side.value === 'start' ? 'order-first border-e' : 'order-last border-s',
            props.variant === 'floating' && 'm-2 h-[calc(100svh-1rem)] rounded-xl border shadow-sm',
            props.variant === 'inset' && 'rounded-xl',
            !collapsed.value && 'w-64',
            collapsed.value && props.collapsible === 'icon' && 'w-14',
            collapsed.value && props.collapsible === 'offcanvas' && 'w-0 overflow-hidden border-0',
            attrs.class,
            isMobile.value && 'h-full',
          ),
        },
        slots.default?.(),
      )
      if (!isMobile.value) return sidebar
      return h(
        Sheet,
        {
          open: openMobile.value,
          'onUpdate:open': setOpenMobile,
        },
        {
          default: () =>
            h(
              SheetContent,
              {
                side: side.value,
                showCloseButton: false,
                class: 'h-full w-[var(--sidebar-width-mobile,18rem)] max-w-[85vw] p-0',
              },
              { default: () => sidebar },
            ),
        },
      )
    }
  },
})

export const SidebarInset = createPrimitive(
  'SidebarInset',
  'main',
  'min-h-svh min-w-0 flex-1 bg-background',
  { 'data-slot': 'sidebar-inset' },
)
export const SidebarHeader = createPrimitive(
  'SidebarHeader',
  'div',
  'sticky top-0 z-10 flex shrink-0 flex-col gap-2 bg-sidebar p-3',
  { 'data-slot': 'sidebar-header' },
)
export const SidebarContent = createPrimitive(
  'SidebarContent',
  'div',
  'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden group-data-[collapsible=icon]/sidebar:overflow-hidden',
  { 'data-slot': 'sidebar-content' },
)
export const SidebarFooter = createPrimitive(
  'SidebarFooter',
  'div',
  'sticky bottom-0 z-10 flex shrink-0 flex-col gap-2 bg-sidebar p-3',
  { 'data-slot': 'sidebar-footer' },
)
export const SidebarGroup = createPrimitive(
  'SidebarGroup',
  'section',
  'relative flex min-w-0 flex-col gap-1 p-2',
  { 'data-slot': 'sidebar-group' },
)
export const SidebarGroupLabel = createPrimitive(
  'SidebarGroupLabel',
  'h3',
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none transition-[margin,opacity] duration-200 group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0',
  { 'data-slot': 'sidebar-group-label' },
)
export const SidebarGroupAction = createPrimitive(
  'SidebarGroupAction',
  'button',
  'absolute end-3 top-3.5 inline-flex size-5 items-center justify-center rounded-md text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]/sidebar:hidden [&>svg]:size-4',
  { type: 'button', 'data-slot': 'sidebar-group-action' },
)
export const SidebarGroupContent = createPrimitive(
  'SidebarGroupContent',
  'div',
  'w-full min-w-0 text-sm',
  { 'data-slot': 'sidebar-group-content' },
)
export const SidebarMenu = createPrimitive(
  'SidebarMenu',
  'ul',
  'flex w-full min-w-0 flex-col gap-1',
  { 'data-slot': 'sidebar-menu' },
)
export const SidebarMenuItem = createPrimitive(
  'SidebarMenuItem',
  'li',
  'group/menu-item relative min-w-0',
  { 'data-slot': 'sidebar-menu-item' },
)

export const SidebarMenuButton = defineComponent({
  name: 'SidebarMenuButton',
  inheritAttrs: false,
  props: {
    isActive: { type: Boolean, default: false },
    variant: { type: String as PropType<'default' | 'outline'>, default: 'default' },
    size: { type: String as PropType<'default' | 'sm' | 'lg'>, default: 'default' },
    as: { type: String, default: 'button' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          type: props.as === 'button' ? (attrs.type ?? 'button') : undefined,
          'data-slot': 'sidebar-menu-button',
          'data-size': props.size,
          'data-variant': props.variant,
          'data-active': props.isActive ? 'true' : undefined,
          class: cn(
            'peer/menu-button flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-start text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0 group-data-[collapsible=icon]/sidebar:[&>span:last-child]:hidden [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
            props.size === 'default' && 'h-9',
            props.size === 'sm' && 'h-7 text-xs',
            props.size === 'lg' && 'h-12 text-sm group-data-[collapsible=icon]/sidebar:w-10',
            props.variant === 'outline' &&
              'border border-input bg-background shadow-[0_0_0_1px_hsl(var(--border))]',
            props.isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const SidebarMenuAction = createPrimitive(
  'SidebarMenuAction',
  'button',
  'absolute end-1 top-1.5 inline-flex size-6 items-center justify-center rounded-md text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]/sidebar:hidden [&>svg]:size-4',
  { type: 'button', 'data-slot': 'sidebar-menu-action' },
)
export const SidebarMenuBadge = createPrimitive(
  'SidebarMenuBadge',
  'span',
  'pointer-events-none absolute end-1 top-2 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground peer-data-[size=sm]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-3.5 group-data-[collapsible=icon]/sidebar:hidden',
  { 'data-slot': 'sidebar-menu-badge' },
)
export const SidebarMenuSub = createPrimitive(
  'SidebarMenuSub',
  'ul',
  'mx-3.5 flex min-w-0 flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]/sidebar:hidden',
  { 'data-slot': 'sidebar-menu-sub' },
)
export const SidebarMenuSubItem = createPrimitive(
  'SidebarMenuSubItem',
  'li',
  'group/menu-sub-item relative min-w-0',
  { 'data-slot': 'sidebar-menu-sub-item' },
)
export const SidebarMenuSubButton = createPrimitive(
  'SidebarMenuSubButton',
  'button',
  'flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-start text-sm text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  { type: 'button', 'data-slot': 'sidebar-menu-sub-button' },
)
export const SidebarMenuSkeleton = defineComponent({
  name: 'SidebarMenuSkeleton',
  inheritAttrs: false,
  props: { showIcon: { type: Boolean, default: false } },
  setup(props, { attrs }) {
    // عرض تصادفی بین ۵۰ تا ۹۰ درصد، مانند shadcn
    const width = `${Math.floor(Math.random() * 40) + 50}%`
    return () =>
      h(
        'div',
        {
          ...attrs,
          'aria-hidden': 'true',
          'data-slot': 'sidebar-menu-skeleton',
          class: cn('flex h-8 items-center gap-2 rounded-md px-2', attrs.class),
        },
        [
          props.showIcon &&
            h('div', { class: 'size-4 shrink-0 animate-pulse rounded-md bg-muted' }),
          h('div', {
            class: 'h-4 max-w-[--skeleton-width] flex-1 animate-pulse rounded-md bg-muted',
            style: { '--skeleton-width': width },
          }),
        ],
      )
  },
})

export const SidebarInput = createPrimitive(
  'SidebarInput',
  'input',
  'flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring',
  { 'data-slot': 'sidebar-input' },
)
export const SidebarSeparator = createPrimitive(
  'SidebarSeparator',
  'div',
  'mx-2 h-px w-auto shrink-0 bg-sidebar-border',
  { role: 'separator', 'data-slot': 'sidebar-separator' },
)

function createSidebarToggle(name: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const { toggleSidebar } = useSidebar()
      return () =>
        h(
          'button',
          {
            ...attrs,
            type: 'button',
            tabindex: name === 'SidebarRail' ? -1 : attrs.tabindex,
            'data-slot': name === 'SidebarRail' ? 'sidebar-rail' : 'sidebar-trigger',
            'aria-label':
              attrs['aria-label'] ??
              (name === 'SidebarRail' ? 'تغییر وضعیت نوار کناری' : 'باز و بسته کردن نوار کناری'),
            class: cn(
              name === 'SidebarRail'
                ? 'absolute inset-y-0 z-20 hidden w-4 cursor-ew-resize transition-colors after:absolute after:inset-y-0 after:start-1/2 after:w-px hover:after:bg-sidebar-border group-data-[side=start]/sidebar:-end-2 group-data-[side=end]/sidebar:-start-2 group-data-[collapsible=offcanvas]/sidebar:after:hidden md:flex'
                : 'inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none ring-sidebar-ring transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 [&>svg]:size-4',
              attrs.class,
            ),
            onClick: (event: MouseEvent) => {
              toggleSidebar()
              const handler = attrs.onClick
              if (typeof handler === 'function') handler(event)
            },
          },
          slots.default?.() ??
            (name === 'SidebarRail'
              ? []
              : [h(PanelLeft, { 'aria-hidden': 'true', class: 'rtl:-scale-x-100' })]),
        )
    },
  })
}

export const SidebarTrigger = createSidebarToggle('SidebarTrigger')
export const SidebarRail = createSidebarToggle('SidebarRail')
