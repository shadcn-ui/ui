import {
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from "../ui/toc"

export default function TOCActive() {
  return (
    <TableOfContentsList>
      <TableOfContentsTitle>Active Item Table of Contents</TableOfContentsTitle>
      <TableOfContentsItem>
        <TableOfContentsLink href="#first-section">
          First Section
        </TableOfContentsLink>
      </TableOfContentsItem>
      <TableOfContentsItem indent>
        <TableOfContentsLink isActive href="#second-section">
          Second Section
        </TableOfContentsLink>
      </TableOfContentsItem>
      <TableOfContentsItem>
        <TableOfContentsLink href="#third-section">
          Third Section
        </TableOfContentsLink>
      </TableOfContentsItem>
    </TableOfContentsList>
  )
}
