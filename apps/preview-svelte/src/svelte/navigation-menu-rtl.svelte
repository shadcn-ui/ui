<script lang="ts">
	import * as NavigationMenu from "@/svelte-ui/navigation-menu/index.js";
	import { cn } from "@/svelte-lib/utils.js";
	import { navigationMenuTriggerStyle } from "@/svelte-ui/navigation-menu/navigation-menu-trigger.svelte";
	import type { HTMLAttributes } from "svelte/elements";

	const components: { title: string; href: string; description: string }[] = [
		{
			title: "حوار التنبيه",
			href: "/docs/components/alert-dialog",
			description: "حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.",
		},
		{
			title: "بطاقة التحويم",
			href: "/docs/components/hover-card",
			description: "للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.",
		},
		{
			title: "التقدم",
			href: "/docs/components/progress",
			description:
				"يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط تقدم.",
		},
		{
			title: "منطقة التمرير",
			href: "/docs/components/scroll-area",
			description: "يفصل المحتوى بصريًا أو دلاليًا.",
		},
		{
			title: "التبويبات",
			href: "/docs/components/tabs",
			description:
				"مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح التبويب—التي يتم عرضها واحدة في كل مرة.",
		},
		{
			title: "تلميح",
			href: "/docs/components/tooltip",
			description:
				"نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس فوقه.",
		},
	];

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};
</script>

{#snippet ListItem({ title, content, href, class: className, ...restProps }: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					class={cn(
						"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
						className
					)}
					{...restProps}
				>
					<div class="text-sm leading-none font-medium">{title}</div>
					<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<div dir="rtl">
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>البدء</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="w-96 p-2">
						{@render ListItem({
							href: "/docs",
							title: "مقدمة",
							content: "مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.",
						})}
						{@render ListItem({
							href: "/docs/installation",
							title: "التثبيت",
							content: "كيفية تثبيت التبعيات وتنظيم تطبيقك.",
						})}
						{@render ListItem({
							href: "/docs/components/typography",
							title: "الطباعة",
							content: "أنماط للعناوين والفقرات والقوائم...إلخ",
						})}
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item class="hidden md:block">
				<NavigationMenu.Trigger>المكونات</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
						{#each components as component, i (i)}
							{@render ListItem({
								href: component.href,
								title: component.title,
								content: component.description,
							})}
						{/each}
					</ul>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Link>
					{#snippet child()}
						<a href="/docs" class={navigationMenuTriggerStyle()}>الوثائق</a>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>
