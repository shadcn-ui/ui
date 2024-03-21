import {
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from "../ui/toc"

export default function TOCDNested() {
  return (
    <TableOfContentsList>
      <TableOfContentsTitle>Nested Table of Contents</TableOfContentsTitle>
      <TableOfContentsItem>
        <TableOfContentsLink href="#first-section-nested">
          First Section
        </TableOfContentsLink>
      </TableOfContentsItem>
      <TableOfContentsItem indent>
        <TableOfContentsList>
          <TableOfContentsLink href="#first-nested-section-nested">
            First Nested Section
          </TableOfContentsLink>
          <TableOfContentsItem indent>
            <TableOfContentsLink href="#second-nested-section-nested">
              Second Nested Section
            </TableOfContentsLink>
          </TableOfContentsItem>
        </TableOfContentsList>
      </TableOfContentsItem>
      <TableOfContentsItem>
        <TableOfContentsLink href="#third-section-nested">
          Third Section
        </TableOfContentsLink>
      </TableOfContentsItem>
    </TableOfContentsList>
  )
}
