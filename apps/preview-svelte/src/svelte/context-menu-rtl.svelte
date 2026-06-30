<script lang="ts">
	import ArrowLeftIcon from "~icons/ms/arrow_left";
	import ArrowRightIcon from "~icons/ms/arrow_right";
	import RotateCwIcon from "~icons/ms/rotate_right";

	import * as ContextMenu from "@/svelte-ui/context-menu/index.js";

	let people = $state("pedro");
	let showBookmarks = $state(true);
	let showFullUrls = $state(false);
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
	>
		Right click here
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-48" dir="rtl">
		<ContextMenu.Group>
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>Navigation</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="w-44">
					<ContextMenu.Group>
						<ContextMenu.Item>
							<ArrowLeftIcon />
							Back
							<ContextMenu.Shortcut>⌘[</ContextMenu.Shortcut>
						</ContextMenu.Item>
						<ContextMenu.Item disabled>
							<ArrowRightIcon />
							Forward
							<ContextMenu.Shortcut>⌘]</ContextMenu.Shortcut>
						</ContextMenu.Item>
						<ContextMenu.Item>
							<RotateCwIcon />
							Reload
							<ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
						</ContextMenu.Item>
					</ContextMenu.Group>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>More Tools</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="w-44">
					<ContextMenu.Group>
						<ContextMenu.Item>Save Page...</ContextMenu.Item>
						<ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
						<ContextMenu.Item>Name Window...</ContextMenu.Item>
					</ContextMenu.Group>
					<ContextMenu.Separator />
					<ContextMenu.Group>
						<ContextMenu.Item>Developer Tools</ContextMenu.Item>
					</ContextMenu.Group>
					<ContextMenu.Separator />
					<ContextMenu.Group>
						<ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
					</ContextMenu.Group>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.CheckboxItem bind:checked={showBookmarks}>
				Show Bookmarks
			</ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxItem bind:checked={showFullUrls}>
				Show Full URLs
			</ContextMenu.CheckboxItem>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Label>People</ContextMenu.Label>
			<ContextMenu.RadioGroup bind:value={people}>
				<ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
				<ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
			</ContextMenu.RadioGroup>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>
