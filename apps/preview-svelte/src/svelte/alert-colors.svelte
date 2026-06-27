<script lang="ts">
	import * as Alert from "@/svelte-ui/alert/index.js";
	import AlertTriangleIcon from "~icons/ms/warning";
</script>

<Alert.Root class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
	<AlertTriangleIcon />
	<Alert.Title>Your subscription will expire in 3 days.</Alert.Title>
	<Alert.Description>
		Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.
	</Alert.Description>
</Alert.Root>
