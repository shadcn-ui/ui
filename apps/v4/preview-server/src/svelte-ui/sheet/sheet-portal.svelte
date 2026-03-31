<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";

	let { ...restProps }: SheetPrimitive.PortalProps = $props();
</script>

<SheetPrimitive.Portal {...restProps} />
