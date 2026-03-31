<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	let { ...restProps }: SelectPrimitive.PortalProps = $props();
</script>

<SelectPrimitive.Portal {...restProps} />
