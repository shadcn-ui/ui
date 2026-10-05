# @shadcn/registry

## 0.1.1

### Patch Changes

- [#12143](https://github.com/shadcn-ui/ui/pull/12143) [`8c2bf3882cb856ac10abbb162bdc0b8383ebd432`](https://github.com/shadcn-ui/ui/commit/8c2bf3882cb856ac10abbb162bdc0b8383ebd432) Thanks [@shadcn](https://github.com/shadcn)! - Accept `components.json` and `package.json` files that start with a UTF-8 byte order mark.

- [#12142](https://github.com/shadcn-ui/ui/pull/12142) [`95efb5cd8d7f13adba70b58b1119211e8980683f`](https://github.com/shadcn-ui/ui/commit/95efb5cd8d7f13adba70b58b1119211e8980683f) Thanks [@shadcn](https://github.com/shadcn)! - replace cosmiconfig with a smaller custom reader.

- [#12140](https://github.com/shadcn-ui/ui/pull/12140) [`3b1ae6e43f082dd82d0e5710b813cfad929abdb4`](https://github.com/shadcn-ui/ui/commit/3b1ae6e43f082dd82d0e5710b813cfad929abdb4) Thanks [@shadcn](https://github.com/shadcn)! - Skip `npm audit` and the funding check when installing or removing dependencies, or creating a project, with npm.

## 0.1.0

### Minor Changes

- [#12087](https://github.com/shadcn-ui/ui/pull/12087) [`bf6646b449684e687f28531305eca4e4768c2782`](https://github.com/shadcn-ui/ui/commit/bf6646b449684e687f28531305eca4e4768c2782) Thanks [@shadcn](https://github.com/shadcn)! - Add `@shadcn/registry`, the registry engine behind the CLI. `shadcn` now depends on it, and `shadcn/registry` and `shadcn/schema` re-export it, so there are no changes for existing users.
