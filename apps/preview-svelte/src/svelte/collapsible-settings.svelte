<script lang="ts">
	import OpenInFullIcon from "~icons/ms/open_in_full";
	import CloseFullscreenIcon from "~icons/ms/close_fullscreen";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
	import * as Collapsible from "@/svelte-ui/collapsible/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";

	let isOpen = $state(false);
</script>

<Card.Root size="sm" class="mx-auto w-full max-w-xs">
	<Card.Header>
		<Card.Title>Radius</Card.Title>
		<Card.Description>Set the corner radius of the element.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Collapsible.Root bind:open={isOpen} class="flex items-start gap-2">
			<Field.Group class="grid w-full grid-cols-2 gap-2">
				<Field.Field>
					<Field.Label for="radius-x" class="sr-only">Radius X</Field.Label>
					<Input id="radius-x" placeholder="0" value={0} />
				</Field.Field>
				<Field.Field>
					<Field.Label for="radius-y" class="sr-only">Radius Y</Field.Label>
					<Input id="radius-y" placeholder="0" value={0} />
				</Field.Field>
				<Collapsible.Content class="col-span-full grid grid-cols-subgrid gap-2">
					<Field.Field>
						<Field.Label for="radius-x2" class="sr-only">Radius X</Field.Label>
						<Input id="radius-x2" placeholder="0" value={0} />
					</Field.Field>
					<Field.Field>
						<Field.Label for="radius-y2" class="sr-only">Radius Y</Field.Label>
						<Input id="radius-y2" placeholder="0" value={0} />
					</Field.Field>
				</Collapsible.Content>
			</Field.Group>
			<Collapsible.Trigger>
				<Button variant="outline" size="icon">
					{#if isOpen}
						<CloseFullscreenIcon />
					{:else}
						<OpenInFullIcon />
					{/if}
				</Button>
			</Collapsible.Trigger>
		</Collapsible.Root>
	</Card.Content>
</Card.Root>
