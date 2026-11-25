# ColorPicker

An unstyled color picker for React. Values are hex (`#rrggbb`, `#rrggbbaa`) or
`oklch()` strings, so they can be used directly as theme tokens.

## Usage

```tsx
import { ColorPicker } from "@shadcn/react/color-picker"

export function BrandColor() {
  return (
    <ColorPicker.Root defaultValue="oklch(0.62 0.19 259)" name="brand">
      <ColorPicker.Area>
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>
      <ColorPicker.Slider channel="hue">
        <ColorPicker.SliderThumb />
      </ColorPicker.Slider>
      <ColorPicker.Slider channel="alpha">
        <ColorPicker.SliderThumb />
      </ColorPicker.Slider>
      <ColorPicker.Swatch />
      <ColorPicker.Input aria-label="Brand color" />
      <ColorPicker.EyeDropper />
      <ColorPicker.Copy />
    </ColorPicker.Root>
  )
}
```

## Exports

All from `@shadcn/react/color-picker`. Every part accepts a `render` prop.

### Parts

| Part                      | Role                                                                                    | Notable props                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `ColorPicker.Root`        | Owns the value. Renders a `role="group"`                                                | `value`, `defaultValue`, `onValueChange`, `format`, `disabled`, `aria-invalid`, `name`, `dir` |
| `ColorPicker.Area`        | 2D saturation (x) and brightness (y) area                                               | `aria-label`, `aria-labelledby`, `getAriaValueText`                                           |
| `ColorPicker.AreaThumb`   | Area thumb with two visually hidden range inputs, one tab stop                          | —                                                                                             |
| `ColorPicker.Slider`      | Hue (0–360°) or alpha (0–100%) track                                                    | `channel`, `aria-label`, `aria-labelledby`, `getAriaValueText`                                |
| `ColorPicker.SliderThumb` | Slider thumb with a visually hidden range input                                         | —                                                                                             |
| `ColorPicker.Input`       | Text input. Commits on Enter or blur, reverts on Escape or invalid text                 | —                                                                                             |
| `ColorPicker.Swatch`      | `role="img"` preview of the current color over a checkerboard                           | `data-alpha` when the color is translucent                                                    |
| `ColorPicker.EyeDropper`  | Button that picks a color from the screen. Renders only where the EyeDropper API exists | `data-picking` while the browser picker is open                                               |
| `ColorPicker.Copy`        | Button that copies the value. Announces "Copied"                                        | `data-copied` for two seconds after copying                                                   |

### Behavior

- `onValueChange` emits a string in `format`. Without `format`, it uses the
  format of the current value, then hex.
- The value is shown as given until the user changes it, so a token is never
  rewritten by rounding.
- Hue is kept when the value turns gray or black.
- Colors are edited in sRGB. An `oklch()` value outside sRGB keeps its
  lightness and hue and loses chroma.
- `aria-invalid` on `Root` sets `data-invalid` there and `aria-invalid` on the
  inputs. `disabled` disables every part.
- `dir` mirrors the x axis, gradients and horizontal keys. Without it, the
  direction is read from the page on mount.
- `EyeDropper` uses the browser EyeDropper API (Chromium browsers). It renders
  nothing elsewhere and on the server, keeps the current alpha, and leaves the
  color unchanged when the pick is cancelled.
- Area and slider tracks set their gradients inline. Recolor the dark
  checkerboard squares with `--color-picker-checkerboard`.

### Keyboard

| Part   | Keys                                                                                                                                               |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Area   | ←/→ saturation, ↑/↓ brightness, Shift for steps of 10, PageUp/PageDown brightness by 10, Home/End saturation by 10. Focus follows the changed axis |
| Slider | ←/→ and ↑/↓ by 1, Shift or PageUp/PageDown by 10, Home/End to the ends                                                                             |
| Input  | Enter commits, Escape reverts                                                                                                                      |

In RTL, ← and → are mirrored, and so are Home and End in the area.

### Types

| Type                   | Meaning            |
| ---------------------- | ------------------ |
| `ColorPickerFormat`    | `"hex" \| "oklch"` |
| `ColorPickerChannel`   | `"hue" \| "alpha"` |
| `ColorPickerDirection` | `"ltr" \| "rtl"`   |

## Tests

| File                            | Environment | Covers                                                                    |
| ------------------------------- | ----------- | ------------------------------------------------------------------------- |
| `color.test.ts`                 | node        | Parsing, formatting, conversion and gamut mapping.                        |
| `color-picker.test.tsx`         | jsdom       | State, keyboard, RTL, input, controlled mode, form and field integration. |
| `color-picker-ssr.test.tsx`     | jsdom       | Server rendering and hydration.                                           |
| `color-picker.browser.test.tsx` | chromium    | Pointer input with real layout, pointer capture, focus and page RTL.      |

```bash
pnpm test            # unit (jsdom)
pnpm test:browser    # behavior (chromium)
```
