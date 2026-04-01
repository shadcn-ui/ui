import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

interface TableSignature {
  Element: HTMLTableElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const Table: TOC<TableSignature> = <template>
  <div class="relative w-full overflow-x-auto" data-slot="table-container">
    <table
      class={{cn "w-full caption-bottom text-sm" @class}}
      data-slot="table"
      ...attributes
    >
      {{yield}}
    </table>
  </div>
</template>;

interface TableHeaderSignature {
  Element: HTMLTableSectionElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableHeader: TOC<TableHeaderSignature> = <template>
  <thead
    class={{cn "[&_tr]:border-b" @class}}
    data-slot="table-header"
    ...attributes
  >
    {{yield}}
  </thead>
</template>;

interface TableBodySignature {
  Element: HTMLTableSectionElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableBody: TOC<TableBodySignature> = <template>
  <tbody
    class={{cn "[&_tr:last-child]:border-0" @class}}
    data-slot="table-body"
    ...attributes
  >
    {{yield}}
  </tbody>
</template>;

interface TableFooterSignature {
  Element: HTMLTableSectionElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableFooter: TOC<TableFooterSignature> = <template>
  <tfoot
    class={{cn
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"
      @class
    }}
    data-slot="table-footer"
    ...attributes
  >
    {{yield}}
  </tfoot>
</template>;

interface TableRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableRow: TOC<TableRowSignature> = <template>
  <tr
    class={{cn
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
      @class
    }}
    data-slot="table-row"
    ...attributes
  >
    {{yield}}
  </tr>
</template>;

interface TableHeadSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableHead: TOC<TableHeadSignature> = <template>
  <th
    class={{cn
      "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
      @class
    }}
    data-slot="table-head"
    ...attributes
  >
    {{yield}}
  </th>
</template>;

interface TableCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableCell: TOC<TableCellSignature> = <template>
  <td
    class={{cn
      "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
      @class
    }}
    data-slot="table-cell"
    ...attributes
  >
    {{yield}}
  </td>
</template>;

interface TableCaptionSignature {
  Element: HTMLTableCaptionElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const TableCaption: TOC<TableCaptionSignature> = <template>
  <caption
    class={{cn "text-muted-foreground mt-4 text-sm" @class}}
    data-slot="table-caption"
    ...attributes
  >
    {{yield}}
  </caption>
</template>;

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
