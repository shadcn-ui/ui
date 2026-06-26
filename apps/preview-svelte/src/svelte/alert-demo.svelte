<script lang="ts">
	import * as Alert from "@/svelte-ui/alert/index.js";
	import CheckCircle2Icon from "~icons/ms/check_circle";
	import AlertCircleIcon from "~icons/ms/error";
	import PopcornIcon from "~icons/ms/theaters";
</script>

<div class="grid w-full max-w-xl items-start gap-4">
	<Alert.Root>
		<CheckCircle2Icon />
		<Alert.Title>Success! Your changes have been saved</Alert.Title>
		<Alert.Description>This is an alert with icon, title and description.</Alert.Description>
	</Alert.Root>
	<Alert.Root>
		<PopcornIcon />
		<Alert.Title>This Alert has a title and an icon. No description.</Alert.Title>
	</Alert.Root>
	<Alert.Root variant="destructive">
		<AlertCircleIcon />
		<Alert.Title>Unable to process your payment.</Alert.Title>
		<Alert.Description>
			<p>Please verify your billing information and try again.</p>
			<ul class="list-inside list-disc text-sm">
				<li>Check your card details</li>
				<li>Ensure sufficient funds</li>
				<li>Verify billing address</li>
			</ul>
		</Alert.Description>
	</Alert.Root>
</div>
