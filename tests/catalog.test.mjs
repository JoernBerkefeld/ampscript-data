import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    FUNCTIONS,
    CANONICAL_FUNCTIONS,
    FUNCTION_CANONICAL_MAP,
    functionLookup,
    functionNames,
    deprecatedFunctionLookup,
    nonFunctionalFunctionLookup,
    AMPSCRIPT_KEYWORDS,
    AMPSCRIPT_OPERATORS,
    AMPSCRIPT_GLOBALS,
    PERSONALIZATION_STRINGS,
    VERIFICATION_BLOCKED_REASONS,
    isEmailExcluded,
    isMcnSupported,
    getMcnApiVersion,
    getMcnNotes,
    isSystemPersonalizationString,
} from '../src/index.js';

const VALID_CATEGORIES = new Set([
    'Content',
    'Data Extension',
    'Date and Time',
    'Einstein Email Recommendations',
    'Encryption and Encoding',
    'HTTP',
    'Marketing Cloud API',
    'Math',
    'Microsoft Dynamics CRM',
    'MobileConnect',
    'Sales and Service Cloud',
    'Social',
    'String',
    'Utility',
]);
// AMPscript function names are mostly PascalCase but include documented
// exceptions such as `MMS_Content_URL` (underscores) and `v` (the inline
// variable accessor). Require a letter start and an identifier-safe body.
const FUNCTION_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;
const OPTIONAL_BOOLEAN_FIELDS = [
    'supportedInCloudPage',
    'supportedInEmail',
    'isConfirmed',
    'differsFromOfficialDocs',
    'deprecated',
    'nonFunctionalAtRuntime',
    'verificationBlocked',
    'handlebarsExact',
];

test('FUNCTIONS: every entry has the required core attributes', () => {
    for (const function_ of FUNCTIONS) {
        assert.equal(typeof function_.name, 'string', `name must be a string`);
        assert.ok(function_.name.length > 0, `${function_.name}: non-empty name`);
        assert.ok(FUNCTION_NAME.test(function_.name), `${function_.name}: identifier-safe name`);
        assert.ok(
            VALID_CATEGORIES.has(function_.category),
            `${function_.name}: valid category (${function_.category})`,
        );
        assert.ok(
            typeof function_.description === 'string' && function_.description.length > 0,
            `${function_.name}: description`,
        );
        assert.equal(typeof function_.minArgs, 'number', `${function_.name}: minArgs is number`);
        assert.equal(typeof function_.maxArgs, 'number', `${function_.name}: maxArgs is number`);
        assert.ok(Number.isSafeInteger(function_.minArgs), `${function_.name}: minArgs integer`);
        // maxArgs is either a finite arity or an "unbounded" sentinel
        // (Infinity for variadic functions, or -1).
        assert.ok(
            function_.maxArgs === -1 ||
                function_.maxArgs === Infinity ||
                Number.isSafeInteger(function_.maxArgs),
            `${function_.name}: maxArgs int or unbounded sentinel`,
        );
        assert.ok(Array.isArray(function_.params), `${function_.name}: params array`);
    }
});

test('FUNCTIONS: every param has name and description', () => {
    for (const function_ of FUNCTIONS) {
        for (const parameter of function_.params) {
            assert.equal(typeof parameter.name, 'string', `${function_.name}: param name`);
            assert.ok(parameter.name.length > 0, `${function_.name}: non-empty param name`);
            assert.ok(
                typeof parameter.description === 'string' && parameter.description.length > 0,
                `${function_.name}.${parameter.name}: description`,
            );
        }
    }
});

test('FUNCTIONS: optional boolean flags are booleans when present', () => {
    for (const function_ of FUNCTIONS) {
        for (const field of OPTIONAL_BOOLEAN_FIELDS) {
            if (Object.hasOwn(function_, field)) {
                assert.equal(
                    typeof function_[field],
                    'boolean',
                    `${function_.name}: ${field} must be a boolean when present`,
                );
            }
        }
    }
});

test('FUNCTIONS: names are unique (case-insensitive)', () => {
    const lower = FUNCTIONS.map((f) => f.name.toLowerCase());
    assert.equal(
        new Set(lower).size,
        FUNCTIONS.length,
        'duplicate function name (case-insensitive)',
    );
});

test('functionLookup / functionNames / CANONICAL_FUNCTIONS cover all entries', () => {
    assert.equal(functionLookup.size, FUNCTIONS.length);
    assert.equal(functionNames.size, FUNCTIONS.length);
    assert.equal(CANONICAL_FUNCTIONS.length, FUNCTIONS.length);
    for (const function_ of FUNCTIONS) {
        const lower = function_.name.toLowerCase();
        assert.ok(functionLookup.has(lower), `${function_.name} missing from functionLookup`);
        assert.equal(functionLookup.get(lower).name, function_.name);
        assert.ok(functionNames.has(lower), `${function_.name} missing from functionNames`);
    }
});

test('FUNCTION_CANONICAL_MAP maps lowercase to canonical PascalCase', () => {
    assert.equal(FUNCTION_CANONICAL_MAP.size, FUNCTIONS.length);
    for (const function_ of FUNCTIONS) {
        assert.equal(FUNCTION_CANONICAL_MAP.get(function_.name.toLowerCase()), function_.name);
    }
});

test('deprecatedFunctionLookup covers exactly the deprecated functions', () => {
    const expected = FUNCTIONS.filter((f) => f.deprecated === true);
    assert.ok(expected.length > 0, 'expected at least one deprecated function');
    assert.equal(deprecatedFunctionLookup.size, expected.length);
    for (const function_ of expected) {
        assert.ok(
            deprecatedFunctionLookup.has(function_.name.toLowerCase()),
            `${function_.name} not in lookup`,
        );
    }
});

test('nonFunctionalFunctionLookup covers exactly the nonFunctionalAtRuntime functions', () => {
    const expected = FUNCTIONS.filter((f) => f.nonFunctionalAtRuntime === true);
    assert.ok(expected.length > 0, 'expected at least one nonFunctionalAtRuntime function');
    assert.equal(nonFunctionalFunctionLookup.size, expected.length);
    for (const function_ of expected) {
        assert.ok(
            nonFunctionalFunctionLookup.has(function_.name.toLowerCase()),
            `${function_.name} not in nonFunctionalFunctionLookup`,
        );
    }
});

test('AMPSCRIPT_KEYWORDS are well-formed with unique names', () => {
    assert.ok(AMPSCRIPT_KEYWORDS.length > 0);
    const names = new Set();
    for (const kw of AMPSCRIPT_KEYWORDS) {
        assert.ok(typeof kw.name === 'string' && kw.name.length > 0, 'keyword name');
        assert.ok(!names.has(kw.name), `duplicate keyword: ${kw.name}`);
        names.add(kw.name);
        assert.ok(
            typeof kw.description === 'string' && kw.description.length > 0,
            `${kw.name}: description`,
        );
        assert.ok(typeof kw.snippet === 'string' && kw.snippet.length > 0, `${kw.name}: snippet`);
    }
});

test('AMPSCRIPT_OPERATORS are well-formed with unique names', () => {
    assert.ok(AMPSCRIPT_OPERATORS.length > 0);
    const names = new Set();
    for (const op of AMPSCRIPT_OPERATORS) {
        assert.ok(typeof op.name === 'string' && op.name.length > 0, 'operator name');
        assert.ok(!names.has(op.name), `duplicate operator: ${op.name}`);
        names.add(op.name);
        assert.ok(
            typeof op.category === 'string' && op.category.length > 0,
            `${op.name}: category`,
        );
        assert.ok(
            typeof op.description === 'string' && op.description.length > 0,
            `${op.name}: description`,
        );
    }
});

test('AMPSCRIPT_GLOBALS are well-formed with unique names', () => {
    assert.ok(AMPSCRIPT_GLOBALS.length > 0);
    const names = new Set();
    for (const g of AMPSCRIPT_GLOBALS) {
        assert.ok(typeof g.name === 'string' && g.name.length > 0, 'global name');
        assert.ok(!names.has(g.name), `duplicate global: ${g.name}`);
        names.add(g.name);
        assert.ok(
            typeof g.description === 'string' && g.description.length > 0,
            `${g.name}: description`,
        );
    }
});

test('PERSONALIZATION_STRINGS are well-formed with unique names', () => {
    assert.ok(PERSONALIZATION_STRINGS.length > 0);
    const names = new Set();
    for (const ps of PERSONALIZATION_STRINGS) {
        assert.ok(typeof ps.name === 'string' && ps.name.length > 0, 'personalization name');
        assert.ok(!names.has(ps.name.toLowerCase()), `duplicate personalization: ${ps.name}`);
        names.add(ps.name.toLowerCase());
        assert.ok(
            typeof ps.description === 'string' && ps.description.length > 0,
            `${ps.name}: description`,
        );
    }
});

test('VERIFICATION_BLOCKED_REASONS is a frozen non-empty string enum', () => {
    assert.ok(Array.isArray(VERIFICATION_BLOCKED_REASONS));
    assert.ok(Object.isFrozen(VERIFICATION_BLOCKED_REASONS), 'must be frozen');
    assert.ok(VERIFICATION_BLOCKED_REASONS.length > 0);
    for (const reason of VERIFICATION_BLOCKED_REASONS) {
        assert.ok(typeof reason === 'string' && reason.length > 0, `reason: ${reason}`);
    }
});

test('helper functions behave case-insensitively on known inputs', () => {
    // isMcnSupported / getMcnApiVersion agree with each other
    assert.equal(isMcnSupported('Add'), true);
    assert.equal(isMcnSupported('add'), true);
    assert.equal(typeof getMcnApiVersion('Add'), 'number');
    assert.equal(getMcnApiVersion('add'), getMcnApiVersion('Add'));
    assert.equal(getMcnApiVersion('definitelyNotAFunction'), null);
    assert.equal(isMcnSupported('definitelyNotAFunction'), false);

    // getMcnNotes returns string or null
    const notes = getMcnNotes('Add');
    assert.ok(notes === null || typeof notes === 'string');
    assert.equal(getMcnNotes('definitelyNotAFunction'), null);

    // isEmailExcluded returns a boolean
    assert.equal(typeof isEmailExcluded('Add'), 'boolean');

    // isSystemPersonalizationString recognises a known system string, case-insensitively
    assert.equal(isSystemPersonalizationString('_subscriberkey'), true);
    assert.equal(isSystemPersonalizationString('_SubscriberKey'), true);
    assert.equal(isSystemPersonalizationString('definitely_not_a_personalization_string'), false);
});
