declare module '@ember/renderer' {
  export function renderComponent(component: unknown, options: { into: Element; owner: object }): Promise<void>
  export function renderSettled(): Promise<void>
}
