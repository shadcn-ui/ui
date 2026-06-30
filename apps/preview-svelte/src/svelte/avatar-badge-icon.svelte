<script lang="ts">
	import PlusIcon from "~icons/ms/add";
	import * as Avatar from "@/svelte-ui/avatar/index.js";
</script>

<Avatar.Root class="grayscale">
	<Avatar.Image src="https://github.com/pranathip.png" alt="@pranathip" />
	<Avatar.Fallback>PP</Avatar.Fallback>
	<Avatar.Badge>
		<PlusIcon />
	</Avatar.Badge>
</Avatar.Root>
