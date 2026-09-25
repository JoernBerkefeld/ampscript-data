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
    BOOLEAN_LIKE_LITERAL_VALUES,
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

test('RaiseError boolean flags reference the shared BOOLEAN_LIKE_LITERAL_VALUES array', () => {
    const raiseError = functionLookup.get('raiseerror');
    assert.ok(raiseError, 'RaiseError must exist');
    const skipSubscriber = raiseError.params.find(
        (parameter) => parameter.name === 'skipSubscriber',
    );
    const preserveDataExtension = raiseError.params.find(
        (parameter) => parameter.name === 'preserveDataExt',
    );
    assert.ok(skipSubscriber, 'RaiseError skipSubscriber parameter must exist');
    assert.ok(preserveDataExtension, 'RaiseError preserveDataExt parameter must exist');
    for (const parameter of [skipSubscriber, preserveDataExtension]) {
        assert.equal(parameter.type, 'string|boolean|number');
        assert.equal(parameter.enum, BOOLEAN_LIKE_LITERAL_VALUES);
    }
    assert.deepEqual(BOOLEAN_LIKE_LITERAL_VALUES, [true, false, 1, 0, 'true', 'false', '1', '0']);
    assert.ok(Object.isFrozen(BOOLEAN_LIKE_LITERAL_VALUES));
});

test('every runtime-verified boolean flag parameter references the shared enum', () => {
    const expected = {
        Field: ['exceptionIfNotFound'],
        BuildRowsetFromJSON: ['returnEmptyOnError'],
        BuildRowSetFromXML: ['returnEmptyOnError'],
        Base64Decode: ['abortOnFailure'],
        BarcodeURL: ['showText', 'transparentBG'],
        ContentArea: ['errorOnMissingContentArea'],
        ContentAreaByName: ['errorOnMissingContentArea'],
        ContentBlockByID: ['errorOnMissingContentBlock'],
        ContentBlockByKey: ['errorOnMissingContentBlock'],
        ContentBlockByName: ['errorOnMissingContentBlock'],
        HTTPGet: ['continueOnError'],
        HTTPPost2: ['exceptionOnError'],
        HTTPPostWithRetry: ['returnExceptionOnError'],
        RaiseError: ['skipSubscriber', 'preserveDataExt'],
        DateParse: ['useUtc'],
        GetSendTime: ['boolAllSubscribers'],
        Now: ['persistFormat'],
        URLEncode: ['encodeAllChars', 'encodeAllStrings'],
    };
    for (const [functionName, parameterNames] of Object.entries(expected)) {
        const function_ = functionLookup.get(functionName.toLowerCase());
        assert.ok(function_, `${functionName} must exist`);
        for (const parameterName of parameterNames) {
            const parameter = function_.params.find(
                (parameter) => parameter.name === parameterName,
            );
            assert.ok(parameter, `${functionName}.${parameterName} must exist`);
            assert.equal(
                parameter.enum,
                BOOLEAN_LIKE_LITERAL_VALUES,
                `${functionName}.${parameterName} must reference the shared frozen enum`,
            );
            assert.equal(
                parameter.type,
                'string|boolean|number',
                `${functionName}.${parameterName} must be widened to the boolean-like union`,
            );
        }
    }
});

test('user-directed boolean-like parameters reference the shared enum without claiming proof', () => {
    // These were widened to the shared eight-value enum BY USER DIRECTION on the strength of
    // ACCEPTANCE only (all eight literal spellings were accepted without rejection), not on a
    // behavioural on/off proof. The verification DB records each as ASSUMED / acceptance-only.
    const directed = {
        HTTPPostWithRetry: ['reschedule'],
        AttachFile: ['viewOnWeb', 'contentDispositionAttachment'],
    };
    for (const [functionName, parameterNames] of Object.entries(directed)) {
        const function_ = functionLookup.get(functionName.toLowerCase());
        assert.ok(function_, `${functionName} must exist`);
        for (const parameterName of parameterNames) {
            const parameter = function_.params.find(
                (parameter) => parameter.name === parameterName,
            );
            assert.ok(parameter, `${functionName}.${parameterName} must exist`);
            assert.equal(
                parameter.enum,
                BOOLEAN_LIKE_LITERAL_VALUES,
                `${functionName}.${parameterName} must reference the shared frozen enum`,
            );
            assert.equal(
                parameter.type,
                'string|boolean|number',
                `${functionName}.${parameterName} must be widened to the boolean-like union`,
            );
        }
    }
    assert.deepEqual(BOOLEAN_LIKE_LITERAL_VALUES, [true, false, 1, 0, 'true', 'false', '1', '0']);
    assert.ok(Object.isFrozen(BOOLEAN_LIKE_LITERAL_VALUES));
});

test('branch-result and unclassifiable parameters carry no enum', () => {
    const withoutEnum = [
        ['IIf', 'expression', 'boolean'],
        ['IIf', 'trueValue', 'string|number|boolean|date'],
        ['IIf', 'falseValue', 'string|number|boolean|date'],
        ['Empty', 'value', 'string|number|boolean|date'],
        ['IsNull', 'value', 'string|number|boolean|date'],
        ['IsNullDefault', 'value', 'string|number|boolean|date'],
        ['IsNullDefault', 'defaultValue', 'string|number|boolean|date'],
    ];
    for (const [functionName, parameterName, type] of withoutEnum) {
        const function_ = functionLookup.get(functionName.toLowerCase());
        assert.ok(function_, `${functionName} must exist`);
        const parameter = function_.params.find((parameter) => parameter.name === parameterName);
        assert.ok(parameter, `${functionName}.${parameterName} must exist`);
        assert.equal(parameter.type, type, `${functionName}.${parameterName} keeps its type`);
        assert.ok(
            !Object.hasOwn(parameter, 'enum'),
            `${functionName}.${parameterName} must not carry an enum`,
        );
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

test('MC Next API 68 catalog slice is exact and helpers expose it case-insensitively', () => {
    const expectedNames = [
        'DatePart',
        'Char',
        'RegExMatch',
        'StringToHex',
        'Base64Decode',
        'Base64Encode',
        'Domain',
        'GUID',
        'IsEmailAddress',
        'LookupRows',
        'LookupOrderedRows',
        'ClaimRow',
        'ClaimRowValue',
        'BuildRowSetFromString',
        'BuildRowSetFromXML',
        'BeginImpressionRegion',
        'EndImpressionRegion',
        'MD5',
        'SHA1',
        'SHA256',
        'SHA512',
        'IsNullDefault',
        'URLEncode',
    ];
    const expectedNotes =
        'MC Next uses a different regex engine that excludes .NET-only constructs. Options must be literal comma-separated text and can only be IgnoreCase, Multiline, Singleline, IgnorePatternWhitespace, or ExplicitCapture.';

    assert.equal(expectedNames.length, 23);
    assert.deepEqual(
        new Set(
            FUNCTIONS.filter((function_) => function_.mcnSince === 68).map(
                (function_) => function_.name,
            ),
        ),
        new Set(expectedNames),
        'API 68 functions must match the catalog slice exactly',
    );
    for (const name of expectedNames) {
        assert.equal(getMcnApiVersion(name), 68, `${name}: API version`);
        assert.equal(getMcnApiVersion(name.toLowerCase()), 68, `${name}: lowercase API version`);
        assert.equal(isMcnSupported(name), true, `${name}: MC Next support`);
        assert.equal(
            isMcnSupported(name.toLowerCase()),
            true,
            `${name}: lowercase MC Next support`,
        );
        assert.equal(
            getMcnNotes(name),
            name === 'RegExMatch' ? expectedNotes : null,
            `${name}: MC Next notes`,
        );
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
