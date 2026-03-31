<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";

	let { ...restProps }: MenubarPrimitive.PortalProps = $props();
</script>

<MenubarPrimitive.Portal {...restProps} />
