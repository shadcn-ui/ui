"use client"

import Script from "next/script"
import { Redo02Icon, Undo02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/styles/base-force-ui/ui/button"
import { useHistory } from "@/app/(app)/create/hooks/use-history"

export const UNDO_FORWARD_TYPE = "undo-forward"
export const REDO_FORWARD_TYPE = "redo-forward"

export function HistoryButtons() {
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        title="Undo"
        disabled={!canGoBack}
        onClick={goBack}
      >
        <HugeiconsIcon icon={Undo02Icon} />
        <span className="sr-only">Undo</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Redo"
        disabled={!canGoForward}
        onClick={goForward}
      >
        <HugeiconsIcon icon={Redo02Icon} />
        <span className="sr-only">Redo</span>
      </Button>
    </div>
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
                if ((key === 'z' && e.shiftKey) || (key === 'y' && e.ctrlKey)) {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: '${REDO_FORWARD_TYPE}' }, '*');
                  }
                } else if (key === 'z') {
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: '${UNDO_FORWARD_TYPE}' }, '*');
                  }
                }
              });
            })();
          `,
      }}
    />
  )
}
