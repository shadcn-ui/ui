<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	let { ...restProps }: TooltipPrimitive.PortalProps = $props();
</script>

<TooltipPrimitive.Portal {...restProps} />
