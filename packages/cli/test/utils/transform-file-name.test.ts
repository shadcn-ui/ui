import {describe, expect, test} from 'vitest';

import {transformFileName} from '../../src/utils/transformers/transform-file-name';
import {CASE_CONVENTION} from '../../src/utils/registry';

describe('format component file name', async () => {
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
      transformFileName(filesName, caseConvention)
    ).toBe(output)
  })
})

test(`format hook file name w/ chosen the '${CASE_CONVENTION.PASCAL}' case`, async () => {
  expect(transformFileName('ui/use-toast.ts', CASE_CONVENTION.PASCAL)).toBe('ui/useToast.ts')
})
