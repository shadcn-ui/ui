import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

import { Checkbox } from '@/ember-ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ember-ui/table';

const tableData = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@example.com',
    role: 'User',
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'User',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Editor',
  },
];

export default class CheckboxTable extends Component {
  @tracked selectedRows: Set<string> = new Set(['1']);

  get selectAll() {
    return this.selectedRows.size === tableData.length;
  }

  handleSelectAll = (checked: boolean) => {
    if (checked) {
      this.selectedRows = new Set(tableData.map((row) => row.id));
    } else {
      this.selectedRows = new Set();
    }
  };

  handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(this.selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    this.selectedRows = newSelected;
  };

  isSelected = (id: string) => {
    return this.selectedRows.has(id);
  };

  <template>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-8">
            <Checkbox
              @checked={{this.selectAll}}
              @onCheckedChange={{this.handleSelectAll}}
              id="select-all-checkbox"
              name="select-all-checkbox"
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {{#each tableData as |row|}}
          <TableRow
            data-state={{if (this.isSelected row.id) "selected" undefined}}
          >
            <TableCell>
              <Checkbox
                @checked={{this.isSelected row.id}}
                @onCheckedChange={{fn this.handleSelectRow row.id}}
                id="row-{{row.id}}-checkbox"
                name="row-{{row.id}}-checkbox"
              />
            </TableCell>
            <TableCell class="font-medium">{{row.name}}</TableCell>
            <TableCell>{{row.email}}</TableCell>
            <TableCell>{{row.role}}</TableCell>
          </TableRow>
        {{/each}}
      </TableBody>
    </Table>
  </template>
}
