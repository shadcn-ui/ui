<script lang="ts">
	import * as Tooltip from "@/svelte-ui/tooltip/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<span class="inline-block w-fit">
				<button class={buttonVariants({ variant: "outline" })} disabled>
					Disabled
				</button>
			</span>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>This feature is currently unavailable</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
