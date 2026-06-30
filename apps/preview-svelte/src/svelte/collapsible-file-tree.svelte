<script lang="ts">
	import ChevronRightIcon from "~icons/ms/chevron_right";
	import FileIcon from "~icons/ms/draft";
	import FolderIcon from "~icons/ms/folder";
	import { Button, buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
	import * as Collapsible from "@/svelte-ui/collapsible/index.js";
	import * as Tabs from "@/svelte-ui/tabs/index.js";

	type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

	function isFolder(item: FileTreeItem): item is { name: string; items: FileTreeItem[] } {
		return "items" in item;
	}

	const fileTree: FileTreeItem[] = [
		{
			name: "components",
			items: [
				{
					name: "ui",
					items: [
						{ name: "button.tsx" },
						{ name: "card.tsx" },
						{ name: "dialog.tsx" },
						{ name: "input.tsx" },
						{ name: "select.tsx" },
						{ name: "table.tsx" },
					],
				},
				{ name: "login-form.tsx" },
				{ name: "register-form.tsx" },
			],
		},
		{
			name: "lib",
			items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
		},
		{
			name: "hooks",
			items: [
				{ name: "use-media-query.ts" },
				{ name: "use-debounce.ts" },
				{ name: "use-local-storage.ts" },
			],
		},
		{
			name: "types",
			items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
		},
		{
			name: "public",
			items: [{ name: "favicon.ico" }, { name: "logo.svg" }, { name: "images" }],
		},
		{ name: "app.tsx" },
		{ name: "layout.tsx" },
		{ name: "globals.css" },
		{ name: "package.json" },
		{ name: "tsconfig.json" },
		{ name: "README.md" },
		{ name: ".gitignore" },
	];
</script>

{#snippet renderItem(item: FileTreeItem)}
	{#if isFolder(item)}
		<Collapsible.Root>
			<Collapsible.Trigger
				class={buttonVariants({
					variant: "ghost",
					size: "sm",
					class: "group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground",
				})}
			>
				<ChevronRightIcon class="transition-transform group-data-[state=open]:rotate-90" />
				<FolderIcon />
				{item.name}
			</Collapsible.Trigger>
			<Collapsible.Content class="mt-1 ml-5">
				<div class="flex flex-col gap-1">
					{#each item.items as child}
						{@render renderItem(child)}
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{:else}
		<Button variant="link" size="sm" class="w-full justify-start gap-2 text-foreground">
			<FileIcon />
			<span>{item.name}</span>
		</Button>
	{/if}
{/snippet}

<Card.Root class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
	<Card.Header>
		<Tabs.Root value="explorer">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="explorer">Explorer</Tabs.Trigger>
				<Tabs.Trigger value="settings">Outline</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-1">
			{#each fileTree as item}
				{@render renderItem(item)}
			{/each}
		</div>
	</Card.Content>
</Card.Root>
