// AUTO-SPLIT from the original single-file src/index.js. Data moved verbatim.
// Shared constants used across the split data files.

/**
 * Sentinel for variadic functions (maxArgs === Infinity).
 */
export const INF = Infinity;

// ── Verification-blocked reasons ─────────────────────────────────────────────
// Fixed enum of concrete technical/environmental reasons why a runtime verification
// was ATTEMPTED but could not complete. Set on an entry as `verificationBlockedReason`
// together with `verificationBlocked: true` and `isConfirmed: false`. The specific
// evidence (error text, invocation shapes tried) belongs in `officialDocsNote`, not here.
//
//   - no-working-invocation  probing found no invocation shape that works; document
//                         exactly what was tried in officialDocsNote.
//   - needs-auth-context  requires an authenticated / session / subscriber state that
//                         the probe context (e.g. a plain CloudPage) cannot supply
//   - no-test-data        requires pre-existing data or an integration that is not
//                         provisioned on the BU
//   - classic-only-no-assets  only works with classic (legacy) assets and none exist
//                         on the BU to test against
//   - destructive-unsafe  cannot be exercised without unacceptable side effects
/**
@type {readonly string[]}
 */
export const VERIFICATION_BLOCKED_REASONS = Object.freeze([
    'no-working-invocation',
    'needs-auth-context',
    'no-test-data',
    'classic-only-no-assets',
    'destructive-unsafe',
]);

export const EMAIL_EXCLUDED_CATEGORIES = new Set(['Marketing Cloud API']);

export const EMAIL_EXCLUDED_FUNCTIONS = new Set([
    'insertdata',
    'updatedata',
    'upsertdata',
    'deletedata',
    'redirect',
    'requestparameter',
    'queryparameter',
    'httprequestheader',
    'isctmlbrowser',
]);
