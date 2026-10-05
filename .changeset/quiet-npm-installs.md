---
"@shadcn/registry": patch
"shadcn": patch
---

skip `npm audit` and the funding check when installing or removing dependencies with npm. Their output was never shown, and the audit could add tens of seconds to `shadcn add`.
