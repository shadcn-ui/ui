<script lang="ts">
	import { Badge, badgeVariants } from "@/svelte-ui/badge/index.js";
	import ArrowUpRightIcon from "~icons/ms/north_east";
</script>

<a href="#link" class={badgeVariants({ variant: "default" })}>
	Open Link <ArrowUpRightIcon data-icon="inline-end" />
</a>
