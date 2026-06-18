<script lang="ts">
	import * as Alert from "@/svelte-ui/alert/index.js";
	import CircleCheckBigIcon from "@lucide/svelte/icons/circle-check-big";
	import InfoIcon from "@lucide/svelte/icons/info";
	import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
</script>

<div class="flex w-full max-w-md flex-col gap-4">
	<Alert.Root variant="success">
		<CircleCheckBigIcon />
		<Alert.Title>Payment received</Alert.Title>
		<Alert.Description>Your invoice has been paid in full.</Alert.Description>
	</Alert.Root>
	<Alert.Root variant="info">
		<InfoIcon />
		<Alert.Title>Scheduled maintenance</Alert.Title>
		<Alert.Description>The service will be unavailable on Sunday from 02:00–04:00 UTC.</Alert.Description>
	</Alert.Root>
	<Alert.Root variant="warning">
		<TriangleAlertIcon />
		<Alert.Title>Your subscription expires soon</Alert.Title>
		<Alert.Description>Renew within 3 days to avoid any interruption to your service.</Alert.Description>
	</Alert.Root>
</div>
