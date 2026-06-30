import { cn } from '@/ember-lib/utils';

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
  <div class="cn-table-container" data-slot="table-container">
    <table
      class={{cn "cn-table" @class}}
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
    class={{cn "cn-table-header" @class}}
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
    class={{cn "cn-table-body" @class}}
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
    class={{cn "cn-table-footer" @class}}
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
    class={{cn "cn-table-row has-aria-expanded:bg-muted/50" @class}}
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
    class={{cn "cn-table-head" @class}}
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
    class={{cn "cn-table-cell" @class}}
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
    class={{cn "cn-table-caption" @class}}
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
