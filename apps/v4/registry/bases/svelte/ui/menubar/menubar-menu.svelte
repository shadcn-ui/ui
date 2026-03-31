<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";

	let { ...restProps }: MenubarPrimitive.MenuProps = $props();
</script>

<MenubarPrimitive.Menu {...restProps} />
