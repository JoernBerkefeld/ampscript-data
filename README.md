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
    PERSONALIZATION_STRINGS,
    DEPRECATED_FUNCTIONS,
    functionLookup,
    functionNames,
    CANONICAL_FUNCTIONS,
    FUNCTION_CANONICAL_MAP,
    deprecatedFunctionLookup,
    isEmailExcluded,
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
}
```

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

### `AMPSCRIPT_KEYWORDS`

An array of AMPscript language keywords (`IF`, `FOR`, `SET`, etc.):

```js
import { AMPSCRIPT_KEYWORDS } from 'ampscript-data';
```

### `PERSONALIZATION_STRINGS`

An array of AMPscript personalization string descriptors (subscriber attributes, system variables, etc.):

```js
import { PERSONALIZATION_STRINGS } from 'ampscript-data';

for (const ps of PERSONALIZATION_STRINGS) {
    console.log(ps.name);        // e.g. 'emailaddr'
    console.log(ps.description); // human-readable description
}
```

## License

MIT
