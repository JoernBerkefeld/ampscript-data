// AUTO-SPLIT from the original single-file src/index.js. Data moved verbatim.

/**
 * AMPscript symbolic operator with its Handlebars counterpart. These glyphs are not valid
 * keyword names (they fail the identifier grammar), so they live in a dedicated export rather
 * than in AMPSCRIPT_KEYWORDS.
 *  - `name`         the operator glyph as written in source
 *  - `category`     'comparison' or 'assignment'
 *  - `description`  short human-readable explanation
 *  - `handlebarsEquivalent`  name of the Handlebars helper that plays the same role, or `null`
 *  - `handlebarsNote`        caveat about how the Handlebars helper is invoked; only set when
 *       `handlebarsEquivalent` is non-null
 *
 *  @type {{name: string, category: 'comparison' | 'assignment', description: string, handlebarsEquivalent: string | null, handlebarsNote: string | null}[]}
 */
export const AMPSCRIPT_OPERATORS = [
    {
        name: '==',
        category: 'comparison',
        description: 'Equality comparison',
        handlebarsEquivalent: 'equals',
        handlebarsNote: null,
    },
    {
        name: '!=',
        category: 'comparison',
        description: 'Inequality comparison',
        handlebarsEquivalent: 'compare',
        handlebarsNote: 'Pass "!=" as the operator argument to compare.',
    },
    {
        name: '>',
        category: 'comparison',
        description: 'Greater-than comparison',
        handlebarsEquivalent: 'compare',
        handlebarsNote: 'Pass ">" as the operator argument to compare.',
    },
    {
        name: '>=',
        category: 'comparison',
        description: 'Greater-than-or-equal comparison',
        handlebarsEquivalent: 'compare',
        handlebarsNote: 'Pass ">=" as the operator argument to compare.',
    },
    {
        name: '<',
        category: 'comparison',
        description: 'Less-than comparison',
        handlebarsEquivalent: 'compare',
        handlebarsNote: 'Pass "<" as the operator argument to compare.',
    },
    {
        name: '<=',
        category: 'comparison',
        description: 'Less-than-or-equal comparison',
        handlebarsEquivalent: 'compare',
        handlebarsNote: 'Pass "<=" as the operator argument to compare.',
    },
    {
        name: '=',
        category: 'assignment',
        description: 'Assignment operator (inside set)',
        handlebarsEquivalent: 'set',
        handlebarsNote: 'Handlebars set is block-scoped and does not persist outside its block.',
    },
];
