export const DOCS_SIDEBAR_SCROLL_STORAGE_KEY = "docs-sidebar-scroll"

export const DOCS_SIDEBAR_SCROLL_RESTORE_SCRIPT = `(function () {
  if (location.pathname !== "/docs" && !location.pathname.startsWith("/docs/")) return

  var stored = null
  try {
    stored = JSON.parse(sessionStorage.getItem("${DOCS_SIDEBAR_SCROLL_STORAGE_KEY}"))
  } catch (e) {}

  function getActiveItem(container) {
    var items = container.querySelectorAll('[data-active="true"]')
    var active = null
    var activePathLength = -1
    var activeDistance = Infinity
    var containerCenter = container.getBoundingClientRect().top + container.clientHeight / 2

    for (var i = 0; i < items.length; i++) {
      var link = items[i].querySelector('a[href]')
      var href = items[i].getAttribute('href') || (link && link.getAttribute('href'))
      var pathLength = href ? href.length : 0
      var itemRect = items[i].getBoundingClientRect()
      var distance = Math.abs(itemRect.top + itemRect.height / 2 - containerCenter)

      if (pathLength > activePathLength || (pathLength === activePathLength && distance < activeDistance)) {
        active = items[i]
        activePathLength = pathLength
        activeDistance = distance
      }
    }

    return active
  }

  function restoreScroll() {
    var container = document.querySelector('[data-docs-sidebar-content]')
    if (!container || !container.clientHeight) return

    if (stored && stored.pathname === location.pathname) {
      container.scrollTop = stored.scrollTop
      return
    }

    var active = getActiveItem(container)
    if (!active) return

    var containerRect = container.getBoundingClientRect()
    var activeRect = active.getBoundingClientRect()
    if (activeRect.top >= containerRect.top && activeRect.bottom <= containerRect.bottom) return

    container.scrollTop += activeRect.top - containerRect.top - (container.clientHeight - activeRect.height) / 2
  }

  var observer = new MutationObserver(restoreScroll)
  observer.observe(document.documentElement, { childList: true, subtree: true })
  restoreScroll()

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      restoreScroll()
      observer.disconnect()
    }, { once: true })
  } else {
    observer.disconnect()
  }
})()`
