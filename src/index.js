/**
 * Canonical AMPscript function catalog, keywords, and personalization strings.
 *
 * Single source of truth consumed by:
 *   - prettier-plugin-sfmc (casing normalization)
 *   - eslint-plugin-sfmc  (unknown-function detection, arity validation)
 *   - vscode-sfmc-language (completions, hover, diagnostics)
 *
 * The catalog is split across small, self-documenting files under `src/`:
 *   - `functions/<category>.js` — the FUNCTIONS entries, grouped by their `category`
 *   - `functions/index.js`      — reassembles FUNCTIONS in original source order
 *   - `derived.js`              — lookups, canonical-casing maps, email/MCN helpers
 *   - `keywords.js` / `operators.js` / `globals.js` / `personalization.js`
 *   - `constants.js`            — shared constants (INF sentinel, blocked reasons)
 *
 * This file is a thin re-export barrel that preserves the package's public API.
 *
 * Optional verification-state fields on a FUNCTIONS entry:
 *   - isConfirmed?: boolean — true when the entry's behavior was verified against the
 *       live AMPscript engine. Absent means "never checked".
 *   - verificationBlocked?: boolean — true when a runtime verification was ATTEMPTED but
 *       could not complete for a concrete technical/environmental reason (no working
 *       invocation, missing auth/session context, absent test data). This is a THIRD state,
 *       distinct from both "verified" (isConfirmed: true) and "never checked" (neither flag
 *       set). When true, isConfirmed MUST be explicitly false and verificationBlockedReason
 *       MUST name the blocker category. The concrete, human-readable detail (error text,
 *       what was tried) belongs in officialDocsNote, not in the enum value.
 *   - verificationBlockedReason?: string — REQUIRED whenever verificationBlocked is true;
 *       one of the VERIFICATION_BLOCKED_REASONS enum values. Never set on its own.
 *   - differsFromOfficialDocs?: boolean — true when the verified runtime behavior contradicts
 *       the official Salesforce reference. Requires officialDocsNote to spell out the
 *       difference.
 *   - officialDocsNote?: string — human-readable evidence: what the official docs claim, what
 *       the runtime actually did, and what was tried.
 *   - supportedInCloudPage?: boolean — RUNTIME-PROVEN runtime-context flag (orthogonal to the
 *       Engagement/Next PLATFORM flags mcnSince/mcnNotes). true when a live CloudPage/landing-page
 *       probe rendered the function successfully; false when the function was actually probed in a
 *       CloudPage context and proven NOT to work there (the reached call aborts the page, or the
 *       parser refuses it). ABSENT means the function was never probed in that context — absence
 *       MUST NOT be read as unsupported. Never defaults to false.
 *   - supportedInEmail?: boolean — same semantics for the email/send context: true when a live
 *       email/send probe rendered/evaluated the function successfully (a data/connector/asset gate
 *       that still lets the function itself run counts as supported); false when the send-content
 *       parser proved it does not work there (rejected as not valid in sendable content, or the
 *       engine does not recognise it). ABSENT means never probed — not unsupported. Never defaults
 *       to false.
 */

// The FUNCTIONS catalog, reassembled from the per-category files.
export { FUNCTIONS } from './functions/index.js';

// Lookups, canonical-casing maps, deprecated/non-functional lookups, MCN/email helpers.
export {
    functionLookup,
    functionNames,
    CANONICAL_FUNCTIONS,
    FUNCTION_CANONICAL_MAP,
    deprecatedFunctionLookup,
    nonFunctionalFunctionLookup,
    isEmailExcluded,
    getMcnApiVersion,
    isMcnSupported,
    getMcnNotes,
} from './derived.js';

// Language surface: keywords, operators, globals, personalization strings.
export { AMPSCRIPT_KEYWORDS } from './keywords.js';
export { AMPSCRIPT_OPERATORS } from './operators.js';
export { AMPSCRIPT_GLOBALS } from './globals.js';
export { PERSONALIZATION_STRINGS, isSystemPersonalizationString } from './personalization.js';

// Shared constants (only the public enum is re-exported).
export { VERIFICATION_BLOCKED_REASONS } from './constants.js';
