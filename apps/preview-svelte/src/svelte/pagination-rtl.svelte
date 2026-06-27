<script lang="ts">
	import * as Pagination from "@/svelte-ui/pagination/index.js";
</script>

<Pagination.Root count={30} perPage={10} page={2} dir="rtl">
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.Previous />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === "ellipsis"}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.Next />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
