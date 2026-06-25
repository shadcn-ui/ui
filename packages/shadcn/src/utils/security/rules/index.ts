import type { SecurityRule } from "../types"
import { rule as noBase64Decode } from "./no-base64-decode"
import { rule as noChildProcess } from "./no-child-process"
import { rule as noCookieAccess } from "./no-cookie-access"
import { rule as noDocumentWrite } from "./no-document-write"
import { rule as noDynamicImport } from "./no-dynamic-import"
import { rule as noDynamicTimeout } from "./no-dynamic-timeout"
import { rule as noEval } from "./no-eval"
import { rule as noFsAccess } from "./no-fs-access"
import { rule as noFunctionConstructor } from "./no-function-constructor"
import { rule as noHardcodedFetch } from "./no-hardcoded-fetch"
import { rule as noInnerHtml } from "./no-inner-html"
import { rule as noPrototypePollution } from "./no-prototype-pollution"
import { rule as noScriptInjection } from "./no-script-injection"
import { rule as noSendBeacon } from "./no-send-beacon"
import { rule as noWebassembly } from "./no-webassembly"

/**
 * Default set of security rules for scanning components
 * Add or remove rules here - this is the single source of truth
 */
export const defaultRules: SecurityRule[] = [
  // Critical severity
  noEval,
  noFunctionConstructor,
  noDocumentWrite,
  noSendBeacon,
  noChildProcess,
  noScriptInjection,
  noPrototypePollution,

  // Warning severity
  noBase64Decode,
  noInnerHtml,
  noHardcodedFetch,
  noCookieAccess,
  noFsAccess,
  noDynamicTimeout,

  // Info severity
  noWebassembly,
  noDynamicImport,
]
