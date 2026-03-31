import Root from "./pagination.svelte";
import Content from "./pagination-content.svelte";
import Item from "./pagination-item.svelte";
import Link from "./pagination-link.svelte";
import PrevButton from "./pagination-prev-button.svelte";
import NextButton from "./pagination-next-button.svelte";
import Ellipsis from "./pagination-ellipsis.svelte";
import Previous from "./pagination-previous.svelte";
import Next from "./pagination-next.svelte";

export {
	Root,
	Content,
	Item,
	Link,
	PrevButton, // old
	NextButton, // old
	Ellipsis,
	Previous,
	Next,
	//
	Root as Pagination,
	Content as PaginationContent,
	Item as PaginationItem,
	Link as PaginationLink,
	PrevButton as PaginationPrevButton, // old
	NextButton as PaginationNextButton, // old
	Ellipsis as PaginationEllipsis,
	Previous as PaginationPrevious,
	Next as PaginationNext,
};
