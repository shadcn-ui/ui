import {describe, expect, test} from 'vitest';

import {formatFileName} from '../../src/utils/format-file-name';
import {CASE_CONVENTION} from '../../src/utils/registry';

describe('format file name', async () => {
  test.each([
    {
      input: {
        filesName: 'ui/dropdown-menu.jsx',
        caseConvention: CASE_CONVENTION.KEBAB
      },
      output: 'ui/dropdown-menu.jsx'
    },
    {
      input: {
        filesName: 'ui/radio-group.tsx',
        caseConvention: CASE_CONVENTION.PASCAL
      },
      output: 'ui/RadioGroup.tsx'
    },
    {
      input: {
        filesName: 'ui/toggle-group.tsx',
        caseConvention: CASE_CONVENTION.CAMEL
      },
      output: 'ui/toggleGroup.tsx'
    },
    {
      input: {
        filesName: 'ui/scroll-area.tsx',
        caseConvention: CASE_CONVENTION.SNAKE
      },
      output: 'ui/scroll_area.tsx'
    }
  ])(`formatFileName($input.filesName, $input.caseConvention) -> $output`, async ({input: {filesName, caseConvention}, output}) => {
    expect(
      formatFileName(filesName, caseConvention)
    ).toBe(output);
  });
});
