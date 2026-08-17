// AUTO-SPLIT from the original single-file src/index.js. Logic moved verbatim.
// Lookups, canonical-casing maps, deprecated/non-functional lookups and the
// email/MCN helper functions derived from the FUNCTIONS catalog.

import { FUNCTIONS } from './functions/index.js';
import { EMAIL_EXCLUDED_CATEGORIES, EMAIL_EXCLUDED_FUNCTIONS } from './constants.js';

/**
 * Case-insensitive lookup: lowercase name -> function entry
 */
export const functionLookup = new Map(FUNCTIONS.map((f) => [f.name.toLowerCase(), f]));

/**
 * Set of lowercase function names for quick membership checks
 */
export const functionNames = new Set(FUNCTIONS.map((f) => f.name.toLowerCase()));

// ── Canonical casing map ─────────────────────────────────────────────────────

/**
 * Ordered list of canonical PascalCase function names
 */
export const CANONICAL_FUNCTIONS = FUNCTIONS.map((f) => f.name);

/**
 * Map from lowercase -> canonical PascalCase name
 */
export const FUNCTION_CANONICAL_MAP = new Map(
    CANONICAL_FUNCTIONS.map((name) => [name.toLowerCase(), name]),
);

// ── Deprecated functions ─────────────────────────────────────────────────────
// Deprecation metadata lives inline on each FUNCTIONS entry via the
// `deprecated`, `deprecatedReplacement`, and `deprecatedReason` fields. The
// lookup below is derived from those flags for consumers that need a quick
// name -> entry map of deprecated functions.

/**
 * Case-insensitive lookup of deprecated functions: lowercase name -> function entry
 */
export const deprecatedFunctionLookup = new Map(
    FUNCTIONS.filter((f) => f.deprecated).map((f) => [f.name.toLowerCase(), f]),
);

/**
 * Case-insensitive lookup of functions that resolve at runtime but have no known
 * working invocation (`nonFunctionalAtRuntime`): lowercase name -> function entry.
 * Every reached call aborts the page (e.g. a retired Classic feature), so callers
 * can flag the call site. Kept separate from deprecation because these functions
 * were never formally deprecated by Salesforce.
 */
export const nonFunctionalFunctionLookup = new Map(
    FUNCTIONS.filter((f) => f.nonFunctionalAtRuntime).map((f) => [f.name.toLowerCase(), f]),
);

// ── Email-context restrictions ───────────────────────────────────────────────

export function isEmailExcluded(functionName) {
    const lower = functionName.toLowerCase();
    if (EMAIL_EXCLUDED_FUNCTIONS.has(lower)) {
        return true;
    }
    const entry = functionLookup.get(lower);
    return entry ? EMAIL_EXCLUDED_CATEGORIES.has(entry.category) : false;
}

// ── Marketing Cloud Next (MCN) helpers ───────────────────────────────────────

/**
 * Returns the API version from which this AMPscript function is supported in
 * Marketing Cloud Next, or null if it is not supported in MCN.
 *
 * @param {string} name - AMPscript function name (case-insensitive).
 * @returns {number | null} API version number (e.g. 67) or null.
 */
export function getMcnApiVersion(name) {
    return functionLookup.get(name.toLowerCase())?.mcnSince ?? null;
}

/**
 * Returns true when the given AMPscript function is supported in Marketing
 * Cloud Next (i.e. mcnSince is a non-null API version number).
 *
 * @param {string} name - AMPscript function name (case-insensitive).
 * @returns {boolean} True when the function is supported in Marketing Cloud Next.
 */
export function isMcnSupported(name) {
    return getMcnApiVersion(name) !== null;
}

/**
 * Returns the MCN behavioral difference notes for the given function, or null
 * if there are no differences or the function is not MCN-supported.
 *
 * @param {string} name - AMPscript function name (case-insensitive).
 * @returns {string | null} Behavioral difference notes, or null.
 */
export function getMcnNotes(name) {
    return functionLookup.get(name.toLowerCase())?.mcnNotes ?? null;
}
