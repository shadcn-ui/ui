import Script from "next/script"

// The preview iframe translates its keyboard shortcuts into typed commands;
// the parent handles them once in TypesetPreview and calls the real actions.
export const TYPESET_COMMAND_MESSAGE = "typeset-command"

export type TypesetCommand =
  | "shuffle"
  | "reset"
  | "undo"
  | "redo"
  | "toggle-theme"

export function RandomizeScript() {
  return (
    <Script
      id="randomize-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // r shuffles, Shift+R resets.
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${TYPESET_COMMAND_MESSAGE}',
                      command: e.shiftKey ? 'reset' : 'shuffle'
                    }, window.location.origin);
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}

export function DarkModeScript() {
  return (
    <Script
      id="dark-mode-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // D toggles the theme.
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${TYPESET_COMMAND_MESSAGE}',
                      command: 'toggle-theme'
                    }, window.location.origin);
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}

export function HistoryScript() {
  return (
    <Script
      id="history-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              document.addEventListener('keydown', function(e) {
                if (!e.metaKey && !e.ctrlKey) return;
                if (
                  (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                  e.target instanceof HTMLInputElement ||
                  e.target instanceof HTMLTextAreaElement ||
                  e.target instanceof HTMLSelectElement
                ) {
                  return;
                }
                var key = e.key.toLowerCase();
                var command = null;
                if ((key === 'z' && e.shiftKey) || (key === 'y' && e.ctrlKey)) {
                  command = 'redo';
                } else if (key === 'z') {
                  command = 'undo';
                }
                if (command) {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${TYPESET_COMMAND_MESSAGE}',
                      command: command
                    }, window.location.origin);
                  }
                }
              });
            })();
          `,
      }}
    />
  )
}
