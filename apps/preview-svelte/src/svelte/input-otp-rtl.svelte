<script lang="ts">
	import * as InputOTP from "@/svelte-ui/input-otp/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
</script>

<Field.Root class="mx-auto max-w-xs">
	<Field.Label for="input-otp-rtl">رمز التحقق</Field.Label>
	<InputOTP.Root maxlength={6} value="123456" dir="rtl" id="input-otp-rtl">
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
</Field.Root>
