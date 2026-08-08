# ampscript-data

Canonical AMPscript function catalog, keywords, and personalization strings for Salesforce Marketing Cloud (SFMC) tooling.

This package is the single source of truth consumed by:

- [eslint-plugin-sfmc](https://www.npmjs.com/package/eslint-plugin-sfmc) — unknown-function detection and arity validation
- [prettier-plugin-sfmc](https://www.npmjs.com/package/prettier-plugin-sfmc) — casing normalization
- [VSCode: sfmc-language](https://marketplace.visualstudio.com/items?itemName=joernberkefeld.sfmc-language) — completions, hover, and diagnostics

## Installation

```sh
npm install ampscript-data
```

## Usage

```js
import {
    FUNCTIONS,
    AMPSCRIPT_KEYWORDS,
    AMPSCRIPT_GLOBALS,
    PERSONALIZATION_STRINGS,
    DEPRECATED_FUNCTIONS,
    functionLookup,
    functionNames,
    CANONICAL_FUNCTIONS,
    FUNCTION_CANONICAL_MAP,
    deprecatedFunctionLookup,
    isEmailExcluded,
    isMcnSupported,
    getMcnApiVersion,
    getMcnNotes,
    VERIFICATION_BLOCKED_REASONS,
} from 'ampscript-data';
```

### `FUNCTIONS`

An array of all known AMPscript functions with full metadata:

```js
import { FUNCTIONS } from 'ampscript-data';

for (const fn of FUNCTIONS) {
    console.log(fn.name);        // e.g. 'Lookup'
    console.log(fn.minArgs);     // minimum argument count
    console.log(fn.maxArgs);     // maximum argument count (Infinity = variadic)
    console.log(fn.category);    // e.g. 'Data Extension'
    console.log(fn.description); // human-readable description
    console.log(fn.params);      // array of { name, description, type?, optional? }
    console.log(fn.returnType);  // e.g. 'string'
    console.log(fn.syntax);      // canonical signature string
    console.log(fn.example);     // usage example (where available)
    console.log(fn.docUrl);      // URL to official Salesforce developer docs
    console.log(fn.guideUrl);    // URL to ampscript.guide reference page
    console.log(fn.sfmcGuideUrl); // URL to our own sfmc.guide reference page (only when published)
    console.log(fn.mcnSince);    // API version when MCN support was added (null = MCE only)
    console.log(fn.mcnNotes);    // behavioral differences on MCN (null = none)
    console.log(fn.handlebarsEquivalent); // MCN Handlebars helper name, or null when none exists
    console.log(fn.mcnHandlebarsGap);     // true when MCN-supported but no Handlebars helper yet
}
```

#### Optional: `sfmcGuideUrl`

`docUrl` and `guideUrl` point at third-party documentation and are set for (almost) every function. `sfmcGuideUrl` is different: it links to our own published reference page and only exists once that page has been written, which happens at the end of a runtime verification sweep. It is therefore a reliable marker for "this function has a proven, self-hosted reference page":

```js
const entry = functionLookup.get('add');
entry.sfmcGuideUrl; // 'https://sfmc.guide/engagement/ampscript/functions/add/'
```

The URL is always `https://sfmc.guide/engagement/ampscript/functions/<lowercase-name>/`, and an entry carrying it is always `isConfirmed: true`.

#### Optional: `validArities`

Most functions accept any argument count in the contiguous `minArgs..maxArgs` range. A function with a **discontinuous overload** — where intermediate counts are invalid — additionally sets `validArities`, the exact set of permitted argument counts:

```js
import { functionLookup } from 'ampscript-data';

const entry = functionLookup.get('somefunction');
if (entry.validArities) {
    // e.g. minArgs: 1, maxArgs: 6, validArities: [1, 6] — 2-5 arguments are invalid
    const isValidCall = entry.validArities.includes(argumentCount);
}
```

The array is always strictly ascending integers and includes both `minArgs` (first element) and `maxArgs` (last element). When absent, the arity range is purely contiguous — which is currently the case for every AMPscript function.

#### Optional: verification state

| Field | Type | Description |
|---|---|---|
| `isConfirmed` | `boolean` | `true` when the behavior was verified against the live AMPscript engine; absent means never checked |
| `verificationBlocked` | `boolean` | `true` when verification was attempted but could not complete; requires `isConfirmed: false` and a `verificationBlockedReason` |
| `verificationBlockedReason` | `string` | One of `VERIFICATION_BLOCKED_REASONS`; only valid together with `verificationBlocked: true` |
| `differsFromOfficialDocs` | `boolean` | `true` when the verified runtime behavior contradicts the official Salesforce reference; requires `officialDocsNote` |
| `officialDocsNote` | `string` | What the official docs claim, what the runtime actually did, and what was tried |

### `VERIFICATION_BLOCKED_REASONS`

A frozen array of the blocker categories that may be used as `verificationBlockedReason`:

```js
import { VERIFICATION_BLOCKED_REASONS } from 'ampscript-data';
// ['no-working-invocation', 'needs-auth-context', 'no-test-data',
//  'classic-only-no-assets', 'destructive-unsafe']
```

| Value | Meaning |
|---|---|
| `no-working-invocation` | Probing found no invocation shape that works |
| `needs-auth-context` | Requires an authenticated / session / subscriber state the probe context cannot supply |
| `no-test-data` | Requires pre-existing data or an integration not provisioned on the BU |
| `classic-only-no-assets` | Only works with classic (legacy) assets and none exist to test against |
| `destructive-unsafe` | Cannot be exercised without unacceptable side effects |

### `functionLookup`

A `Map<string, FunctionEntry>` keyed by lowercase function name for O(1) lookups:

```js
import { functionLookup } from 'ampscript-data';

const entry = functionLookup.get('lookup');
```

### `functionNames`

A `Set<string>` of all function names in lowercase — useful for existence checks:

```js
import { functionNames } from 'ampscript-data';

if (functionNames.has('lookup')) { /* ... */ }
```

### `CANONICAL_FUNCTIONS`

An array of function names in their canonical casing (e.g. `'Lookup'`), used for casing normalization:

```js
import { CANONICAL_FUNCTIONS } from 'ampscript-data';
```

### `FUNCTION_CANONICAL_MAP`

A `Map<string, string>` from lowercase name to canonical-cased name:

```js
import { FUNCTION_CANONICAL_MAP } from 'ampscript-data';

FUNCTION_CANONICAL_MAP.get('lookup'); // 'Lookup'
```

### `DEPRECATED_FUNCTIONS`

An array of deprecated function entries with the same shape as `FUNCTIONS`:

```js
import { DEPRECATED_FUNCTIONS } from 'ampscript-data';
```

### `deprecatedFunctionLookup`

A `Map<string, FunctionEntry>` for deprecated functions, keyed by lowercase name:

```js
import { deprecatedFunctionLookup } from 'ampscript-data';
```

### `isEmailExcluded`

Returns `true` if the function is not available in email send contexts:

```js
import { isEmailExcluded } from 'ampscript-data';

isEmailExcluded('HTTPGet'); // true — not available in email
```

## Marketing Cloud Next (MCN) compatibility

Each `FunctionEntry` has two MCN fields:

| Field | Type | Description |
|---|---|---|
| `mcnSince` | `number \| null` | API version when MCN support was added (e.g. `67`); `null` means MCE only |
| `mcnNotes` | `string \| null` | Behavioral differences on MCN vs MCE; `null` means no known differences |
| `handlebarsEquivalent` | `string \| null` | Name of the MCN Handlebars helper that replaces this function (e.g. `'add'`); `null` when no direct helper exists |
| `mcnHandlebarsGap` | `boolean` | `true` when the function is documented as MCN-supported but currently has no working Handlebars helper (runtime gap) |

`handlebarsEquivalent` and `mcnHandlebarsGap` drive AMPscript ↔ Handlebars conversion tooling. When `mcnHandlebarsGap` is `true`, `handlebarsEquivalent` is always `null` — the function cannot yet be expressed in MCN Handlebars and needs a manual rewrite.

Three helper functions are exported for programmatic MCN checks:

### `isMcnSupported`

Returns `true` when the function is available on Marketing Cloud Next:

```js
import { isMcnSupported } from 'ampscript-data';

isMcnSupported('Lookup');   // true
isMcnSupported('HTTPGet');  // false
```

### `getMcnApiVersion`

Returns the API version number (e.g. `67`) when MCN support was added, or `null` for MCE-only functions:

```js
import { getMcnApiVersion } from 'ampscript-data';

getMcnApiVersion('Lookup');  // 67
getMcnApiVersion('HTTPGet'); // null
```

### `getMcnNotes`

Returns a string describing behavioral differences on MCN, or `null` when the function behaves identically across platforms:

```js
import { getMcnNotes } from 'ampscript-data';

getMcnNotes('FormatDate');    // "In Marketing Cloud Next, this function uses ..."
getMcnNotes('Lookup');        // "In Marketing Cloud Next, an odd number of search ..."
getMcnNotes('ProperCase');    // null
```

### `AMPSCRIPT_KEYWORDS`

An array of AMPscript language keyword descriptors (`if`, `for`, `set`, etc.). Each entry carries a short description and a completion snippet with `${n:placeholder}` tab stops:

```js
import { AMPSCRIPT_KEYWORDS } from 'ampscript-data';

for (const kw of AMPSCRIPT_KEYWORDS) {
    console.log(kw.name);        // e.g. 'if'
    console.log(kw.description); // human-readable description
    console.log(kw.snippet);     // completion body, e.g. 'if ${1:condition} then\n\t${2}\nendif'
}
```

### `AMPSCRIPT_GLOBALS`

An array of read-only AMPscript language globals that are not subscriber personalization attributes:

```js
import { AMPSCRIPT_GLOBALS } from 'ampscript-data';

for (const global of AMPSCRIPT_GLOBALS) {
    console.log(global.name);        // e.g. '@@ExecCtx'
    console.log(global.description); // human-readable description
}
```

### `PERSONALIZATION_STRINGS`

An array of AMPscript system personalization string descriptors, including subscriber attributes and message-context values:

```js
import { PERSONALIZATION_STRINGS } from 'ampscript-data';

for (const ps of PERSONALIZATION_STRINGS) {
    console.log(ps.name);        // e.g. 'emailaddr'
    console.log(ps.description); // human-readable description
}
```

## License

MIT
