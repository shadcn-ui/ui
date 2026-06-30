<script lang="ts">
	import * as Avatar from "@/svelte-ui/avatar/index.js";
</script>

<Avatar.Root>
	<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
	<Avatar.Fallback>CN</Avatar.Fallback>
	<Avatar.Badge class="bg-green-600 dark:bg-green-800" />
</Avatar.Root>
