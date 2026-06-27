<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Kbd from "@/svelte-ui/kbd/index.js";
	import * as Tooltip from "@/svelte-ui/tooltip/index.js";
	import SaveIcon from "~icons/ms/save";
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger class={buttonVariants({ variant: "outline", size: "icon-sm" })}>
			<SaveIcon />
		</Tooltip.Trigger>
		<Tooltip.Content>
			<div class="flex items-center gap-1">
				Save Changes <Kbd.Root>S</Kbd.Root>
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
