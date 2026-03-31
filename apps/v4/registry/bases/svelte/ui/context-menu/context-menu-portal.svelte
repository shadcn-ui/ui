<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";

	let { ...restProps }: ContextMenuPrimitive.PortalProps = $props();
</script>

<ContextMenuPrimitive.Portal {...restProps} />
