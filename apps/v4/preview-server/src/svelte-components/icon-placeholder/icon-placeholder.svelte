<script lang="ts">
	import SquareIcon from "@lucide/svelte/icons/square";
	import type { SVGAttributes } from "svelte/elements";

	type Props = {
		lucide?: string;
		tabler?: string;
		hugeicons?: string;
		phosphor?: string;
		remixicon?: string;
		class?: string;
	};

	let {
		class: className,
		...restProps
	}: Props & Omit<SVGAttributes<SVGSVGElement>, "class"> = $props();
</script>

<SquareIcon class={className} {...restProps as unknown as object} />
