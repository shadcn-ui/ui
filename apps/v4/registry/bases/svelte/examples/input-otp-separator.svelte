<script lang="ts">
	import * as InputOTP from "$lib/registry/ui/input-otp/index.js";
</script>

<InputOTP.Root maxlength={6}>
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells.slice(0, 2) as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
		<InputOTP.Separator />
		<InputOTP.Group>
			{#each cells.slice(2, 4) as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
		<InputOTP.Separator />
		<InputOTP.Group>
			{#each cells.slice(4, 6) as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>
