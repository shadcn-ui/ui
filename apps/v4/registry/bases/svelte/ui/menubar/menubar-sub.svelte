<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps }: MenubarPrimitive.SubProps = $props();
</script>

<MenubarPrimitive.Sub bind:open {...restProps} />
