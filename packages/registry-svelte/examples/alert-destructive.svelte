<script lang="ts">
	import CircleAlertIcon from "~icons/ms/error";
	import * as Alert from "$lib/registry/ui/alert/index.js";
</script>

<Alert.Root variant="destructive">
	<CircleAlertIcon class="size-4" />
	<Alert.Title>Error</Alert.Title>
	<Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
