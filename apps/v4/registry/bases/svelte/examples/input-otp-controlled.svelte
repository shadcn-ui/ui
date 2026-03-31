<script lang="ts">
	import * as InputOTP from "$lib/registry/ui/input-otp/index.js";

	let value = $state("");
</script>

<div class="space-y-2">
	<InputOTP.Root maxlength={6} bind:value>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells.slice(0, 6) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
	<div class="text-center text-sm">
		{value === "" ? "Enter your one-time password." : `You entered: ${value}`}
	</div>
</div>
