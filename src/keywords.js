// AUTO-SPLIT from the original single-file src/index.js. Data moved verbatim.

/**
 * AMPscript language keyword with completion metadata.
 *  - `name`         the keyword as written in source
 *  - `description`  short human-readable explanation
 *  - `snippet`      completion body with `${n:placeholder}` tab stops
 *  - `handlebarsEquivalent` (OPTIONAL): name of the Handlebars helper/construct that plays the
 *       same role, or `null` when the keyword has no counterpart. Handlebars models control flow
 *       and logic as helpers, so language constructs (not just functions) map across.
 *  - `handlebarsNote` (OPTIONAL): human-readable caveat about how the Handlebars construct differs
 *       from the AMPscript keyword. Only set when `handlebarsEquivalent` is non-null.
 *
 *  @type {{name: string, description: string, snippet: string, handlebarsEquivalent?: string | null, handlebarsNote?: string | null}[]}
 */
export const AMPSCRIPT_KEYWORDS = [
    {
        name: 'var',
        description: 'Declares one or more variables',
        snippet: 'var @${1:variableName}',
        handlebarsEquivalent: 'set',
        handlebarsNote: 'Handlebars set is block-scoped and does not persist outside its block.',
    },
    {
        name: 'set',
        description: 'Assigns a value to a variable',
        snippet: 'set @${1:variableName} = ${2:value}',
        handlebarsEquivalent: 'set',
        handlebarsNote: 'Handlebars set is block-scoped and does not persist outside its block.',
    },
    {
        name: 'if',
        description: 'Begins a conditional block',
        snippet: 'if ${1:condition} then\n\t${2}\nendif',
        handlebarsEquivalent: 'if',
        handlebarsNote: 'elseif/else become {{else if}} / {{else}} inside the same block.',
    },
    {
        name: 'then',
        description: 'Follows an if/elseif condition',
        snippet: 'then',
        handlebarsEquivalent: null,
    },
    {
        name: 'elseif',
        description: 'Additional condition in an if block',
        snippet: 'elseif ${1:condition} then',
        handlebarsEquivalent: 'if',
        handlebarsNote: 'Written as {{else if condition}} inside the enclosing {{#if}} block.',
    },
    {
        name: 'else',
        description: 'Fallback branch in an if block',
        snippet: 'else',
        handlebarsEquivalent: 'if',
        handlebarsNote: 'Written as {{else}} inside the enclosing {{#if}} block.',
    },
    {
        name: 'endif',
        description: 'Closes an if block',
        snippet: 'endif',
        handlebarsEquivalent: null,
    },
    {
        name: 'for',
        description: 'Begins a counting loop',
        snippet: 'for @${1:i} = ${2:1} to ${3:rowCount} do\n\t${4}\nnext @${1:i}',
        handlebarsEquivalent: 'each',
        handlebarsNote:
            'Use {{#repeat}} for a plain counting loop; {{#each}} iterates a collection.',
    },
    {
        name: 'to',
        description: 'Ascending direction in a for loop',
        snippet: 'to',
        handlebarsEquivalent: null,
    },
    {
        name: 'downto',
        description: 'Descending direction in a for loop',
        snippet: 'downto',
        handlebarsEquivalent: null,
    },
    {
        name: 'do',
        description: 'Marks the start of a loop body',
        snippet: 'do',
        handlebarsEquivalent: null,
    },
    {
        name: 'next',
        description: 'Ends a for loop iteration',
        snippet: 'next',
        handlebarsEquivalent: null,
    },
    {
        name: 'and',
        description: 'Logical AND operator',
        snippet: 'and',
        handlebarsEquivalent: 'and',
    },
    { name: 'or', description: 'Logical OR operator', snippet: 'or', handlebarsEquivalent: 'or' },
    {
        name: 'not',
        description: 'Logical NOT operator',
        snippet: 'not',
        handlebarsEquivalent: 'not',
    },
    {
        name: 'true',
        description: 'Boolean true constant',
        snippet: 'true',
        handlebarsEquivalent: null,
    },
    {
        name: 'false',
        description: 'Boolean false constant',
        snippet: 'false',
        handlebarsEquivalent: null,
    },
];
