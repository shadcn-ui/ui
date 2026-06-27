<script lang="ts">
	import * as Pagination from "@/svelte-ui/pagination/index.js";
</script>

<Pagination.Root count={5} perPage={1} page={2}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			{#each pages as page (page.key)}
				{#if page.type === "page"}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
