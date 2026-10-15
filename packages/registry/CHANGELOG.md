# @shadcn/registry

## 0.1.4

### Patch Changes

- [#12195](https://github.com/shadcn-ui/ui/pull/12195) [`97ddbf4`](https://github.com/shadcn-ui/ui/commit/97ddbf4274ed09d02aa7fd34375f2cf1e48cbbf0) Thanks [@shadcn](https://github.com/shadcn)! - Remove narrating comments and no-op guards from @shadcn/registry.

- [#12192](https://github.com/shadcn-ui/ui/pull/12192) [`dd34945`](https://github.com/shadcn-ui/ui/commit/dd34945272729ecd198fabb0e32082f6321c210e) Thanks [@shadcn](https://github.com/shadcn)! - Move @shadcn/registry modules out of utils.

- [#12048](https://github.com/shadcn-ui/ui/pull/12048) [`cfb4cb6`](https://github.com/shadcn-ui/ui/commit/cfb4cb6fce835cda9342fae1592b21ece48ce23d) Thanks [@dependabot](https://github.com/apps/dependabot)! - Update `undici` to 7.29.1.

## 0.1.3

### Patch Changes

- [#12189](https://github.com/shadcn-ui/ui/pull/12189) [`76fd499595ba7cc01f49d159bd7ac82d7aca8e63`](https://github.com/shadcn-ui/ui/commit/76fd499595ba7cc01f49d159bd7ac82d7aca8e63) Thanks [@shadcn](https://github.com/shadcn)! - Drop the ts-morph dependency from @shadcn/registry.

- [#12184](https://github.com/shadcn-ui/ui/pull/12184) [`995c2cfff44c373bd210d451089726ec097ab917`](https://github.com/shadcn-ui/ui/commit/995c2cfff44c373bd210d451089726ec097ab917) Thanks [@shadcn](https://github.com/shadcn)! - Run the icons and asChild transformers without ts-morph.

- [#12160](https://github.com/shadcn-ui/ui/pull/12160) [`6efecd8fe9aa167886fe2cc0c05c5623a5bb5670`](https://github.com/shadcn-ui/ui/commit/6efecd8fe9aa167886fe2cc0c05c5623a5bb5670) Thanks [@shadcn](https://github.com/shadcn)! - Edit the Next.js layout for font items without ts-morph, and skip it with a warning instead of writing a broken layout.

- [#12146](https://github.com/shadcn-ui/ui/pull/12146) [`232d7e2c128d94d37a6dae74e3b0e1a8f08ff6e4`](https://github.com/shadcn-ui/ui/commit/232d7e2c128d94d37a6dae74e3b0e1a8f08ff6e4) Thanks [@shadcn](https://github.com/shadcn)! - Load ts-morph only for `addRegistryItems`, so the read-only API bundles about 6 MB smaller.

- [#12188](https://github.com/shadcn-ui/ui/pull/12188) [`efa11781f756c86debb0392fbea4fe468250b41b`](https://github.com/shadcn-ui/ui/commit/efa11781f756c86debb0392fbea4fe468250b41b) Thanks [@shadcn](https://github.com/shadcn)! - Rewrite imports and crawl file imports without ts-morph.

- [#12177](https://github.com/shadcn-ui/ui/pull/12177) [`e8c3143b1cd191280befcd6c9538284bb43399a8`](https://github.com/shadcn-ui/ui/commit/e8c3143b1cd191280befcd6c9538284bb43399a8) Thanks [@shadcn](https://github.com/shadcn)! - Edit tailwind.config without ts-morph, and skip it with a warning instead of writing a broken config.

- [#12183](https://github.com/shadcn-ui/ui/pull/12183) [`f56bbd7282f0116a925a601cb6d7e0c3fede448b`](https://github.com/shadcn-ui/ui/commit/f56bbd7282f0116a925a601cb6d7e0c3fede448b) Thanks [@shadcn](https://github.com/shadcn)! - Run the rsc, import, CSS variable, cleanup, font and menu transformers without ts-morph.

- [#12185](https://github.com/shadcn-ui/ui/pull/12185) [`4a90344c42dc9ae47494179065219377ff5f2a8f`](https://github.com/shadcn-ui/ui/commit/4a90344c42dc9ae47494179065219377ff5f2a8f) Thanks [@shadcn](https://github.com/shadcn)! - Run the Tailwind prefix and RTL transformers without ts-morph.

## 0.1.2

### Patch Changes

- [#12148](https://github.com/shadcn-ui/ui/pull/12148) [`596be8dda8f94927281184b8c4575150531f85ea`](https://github.com/shadcn-ui/ui/commit/596be8dda8f94927281184b8c4575150531f85ea) Thanks [@shadcn](https://github.com/shadcn)! - Fix `ERR_REQUIRE_CYCLE_MODULE` when running the CLI with `pnpm dlx` on Windows.

## 0.1.1

### Patch Changes

- [#12143](https://github.com/shadcn-ui/ui/pull/12143) [`8c2bf3882cb856ac10abbb162bdc0b8383ebd432`](https://github.com/shadcn-ui/ui/commit/8c2bf3882cb856ac10abbb162bdc0b8383ebd432) Thanks [@shadcn](https://github.com/shadcn)! - Accept `components.json` and `package.json` files that start with a UTF-8 byte order mark.

- [#12142](https://github.com/shadcn-ui/ui/pull/12142) [`95efb5cd8d7f13adba70b58b1119211e8980683f`](https://github.com/shadcn-ui/ui/commit/95efb5cd8d7f13adba70b58b1119211e8980683f) Thanks [@shadcn](https://github.com/shadcn)! - replace cosmiconfig with a smaller custom reader.

- [#12140](https://github.com/shadcn-ui/ui/pull/12140) [`3b1ae6e43f082dd82d0e5710b813cfad929abdb4`](https://github.com/shadcn-ui/ui/commit/3b1ae6e43f082dd82d0e5710b813cfad929abdb4) Thanks [@shadcn](https://github.com/shadcn)! - Skip `npm audit` and the funding check when installing or removing dependencies, or creating a project, with npm.

## 0.1.0

### Minor Changes

- [#12087](https://github.com/shadcn-ui/ui/pull/12087) [`bf6646b449684e687f28531305eca4e4768c2782`](https://github.com/shadcn-ui/ui/commit/bf6646b449684e687f28531305eca4e4768c2782) Thanks [@shadcn](https://github.com/shadcn)! - Add `@shadcn/registry`, the registry engine behind the CLI. `shadcn` now depends on it, and `shadcn/registry` and `shadcn/schema` re-export it, so there are no changes for existing users.
