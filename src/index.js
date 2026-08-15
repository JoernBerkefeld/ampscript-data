/**
 * Canonical AMPscript function catalog, keywords, and personalization strings.
 *
 * Single source of truth consumed by:
 *   - prettier-plugin-sfmc (casing normalization)
 *   - eslint-plugin-sfmc  (unknown-function detection, arity validation)
 *   - vscode-sfmc-language (completions, hover, diagnostics)
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
 */

const INF = Infinity;

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

// ── Function catalog ─────────────────────────────────────────────────────────

/**
 * `repeat` (variadic functions only): describes how trailing arguments repeat when
 * `maxArgs === Infinity`. Coordinates are 0-based ARGUMENT-STREAM indices (the actual
 * call arguments), not `params[]` indices. Each element is one repeating group; most
 * functions have a single group, but the DataExtension Update/Upsert family has two.
 *  - `startIndex`  first argument index where the group begins
 *  - `groupSize`   number of arguments forming one repeatable unit
 *  - `minGroups`   minimum number of complete groups required
 *  - `countParam`  optional name of an earlier param whose literal value dictates how many
 *                  groups of this block are present (e.g. `columnValuePairs`)
 *
 * Param naming convention for variadic functions: the first required occurrence of a
 * group member is `<base>1` and the repeating occurrence is `<base>N` (with `optional`).
 *
 * `validArities` (OPTIONAL): exact set of permitted argument counts for a DISCONTINUOUS
 * OVERLOAD, where a contiguous `minArgs..maxArgs` range would wrongly accept intermediate
 * counts. When present, a call is valid only when its argument count is within
 * [minArgs, maxArgs] AND a member of this array. The array MUST be strictly ascending
 * integers, and both `minArgs` and `maxArgs` MUST be members (so `validArities[0] === minArgs`
 * and the last element `=== maxArgs`). Example shape: a function that accepts exactly 1 or 6
 * arguments (2-5 fail) would set `minArgs: 1, maxArgs: 6, validArities: [1, 6]`.
 * Absent → behavior is a pure contiguous range. No AMPscript function currently needs it.
 *
 * `sfmcGuideUrl` (OPTIONAL): absolute URL of our own published reference page,
 * `https://sfmc.guide/engagement/ampscript/functions/<lowercase-name>/`. Present ONLY when
 * that page actually exists — it is written by the verification skills at step 4j, together
 * with the page itself, and therefore always accompanies `isConfirmed: true`. Unlike `docUrl`
 * (Salesforce) and `guideUrl` (ampscript.guide), this one points at content we own and have
 * runtime-proven. Kept in sync by a cross-package test in `tests/cross-package.test.mjs`.
 *
 * `handlebarsExact` (OPTIONAL): only meaningful when `handlebarsEquivalent` names a helper.
 * `true` means the helper is an argument-for-argument drop-in replacement for the AMPscript
 * function. `false` means the helper does the same job but with a different call shape (dropped,
 * shifted, or renamed arguments, or different error behaviour), so a converter must emit a hint
 * for a human to finish the rewrite rather than a mechanical substitution. Must be present
 * whenever `handlebarsEquivalent` is non-null.
 *
  @type {{name: string, mcnSince: number | null, mcnNotes: string | null, handlebarsEquivalent?: string | null, handlebarsExact?: boolean, docUrl?: string, guideUrl?: string, sfmcGuideUrl?: string, minArgs: number, maxArgs: number, validArities?: number[], category: string, description: string, params: {name: string, description: string, type?: string, enum?: (string | number)[], optional?: boolean, default?: string | number | boolean}[], returnType?: string, returnDescription?: string, returnEnum?: (string | number)[], syntax?: string, example?: string, repeat?: {startIndex: number, groupSize: number, minGroups: number, countParam?: string}[], deprecated?: boolean, deprecatedReplacement?: string, deprecatedReason?: string, isConfirmed?: boolean, verificationBlocked?: boolean, verificationBlockedReason?: string, differsFromOfficialDocs?: boolean, officialDocsNote?: string}[]} */
export const FUNCTIONS = [
    {
        name: 'Add',
        mcnSince: 67,
        handlebarsEquivalent: 'add',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-math/mc-ampscript-reference-math-add.html',
        guideUrl: 'https://ampscript.guide/add/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/add/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Math',
        description: 'Computes the sum of two numeric values.',
        params: [
            { name: 'number1', description: 'First operand', type: 'string|number' },
            { name: 'number2', description: 'Second operand', type: 'string|number' },
        ],
        returnType: 'number',
        returnDescription: 'The numeric sum of the two operands.',
        syntax: 'Add(number1, number2)',
        example: '%%=Add(15, 27)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'AddMscrmListMember',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-add-list-member.html',
        guideUrl: 'https://ampscript.guide/addmscrmlistmember/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Microsoft Dynamics CRM',
        description: 'Appends a member to a Dynamics CRM list.',
        params: [
            {
                name: 'recordGuid',
                description: 'The GUID of the record that you want to add to the marketing list',
                type: 'string',
            },
            {
                name: 'listGuid',
                description: 'The GUID of the marketing list that you want to add the record to',
                type: 'string',
            },
        ],
        returnType: 'void',
        returnDescription: 'No value is returned.',
        syntax: 'AddMscrmListMember(recordGuid, listGuid)',
        example:
            '%%[\n' +
            'var @member = "43b4a7c9-7360-4753-955f-738bd89934b5"\n' +
            'var @list = "fdc5dfe4-e5e1-48af-87a1-4ac10433e895"\n' +
            'AddMscrmListMember(@member, @list)\n' +
            ']%%',
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'AddObjectArrayItem',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-add-object-array.html',
        guideUrl: 'https://ampscript.guide/addobjectarrayitem/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/addobjectarrayitem/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Marketing Cloud API',
        description: "Appends an item to an API object's array property.",
        params: [
            { name: 'apiObject', description: 'API object reference', type: 'object' },
            { name: 'arrayProperty', description: 'Array property name', type: 'string' },
            { name: 'itemToAdd', description: 'Value to append', type: 'string' },
        ],
        returnType: 'void',
        returnDescription:
            'No value is returned; the item is appended to the named array property.',
        syntax: 'AddObjectArrayItem(apiObject, arrayProperty, itemToAdd)',
        example: "AddObjectArrayItem(@apiObject, 'Recipients', @recipient)",
        isConfirmed: true,
    },
    {
        name: 'AttachFile',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-attach-file.html',
        guideUrl: 'https://ampscript.guide/attachfile/',
        minArgs: 2,
        maxArgs: 8,
        category: 'Content',
        description: 'Includes a file attachment in the outgoing message.',
        params: [
            {
                name: 'fileLocationType',
                description:
                    'The type of location to pull the file from. Accepted values: http, ftp, contentbuilder',
                type: 'string',
                enum: ['http', 'ftp', 'contentbuilder'],
            },
            {
                name: 'fileLocation',
                description:
                    'The location to pull the file from. This parameter can contain a maximum of 2088 characters. If you specify http for the first parameter, this parameter must contain a URL. If you specify ftp for the first parameter, this parameter must contain the name of a file in the Import folder of your Enhanced FTP site. If you specify contentbuilder for the first parameter, this parameter must contain the external key of the file to attach.',
                type: 'string',
            },
            {
                name: 'attachmentFileName',
                description:
                    "The name assigned to a file when it's attached to an email message. If you don't specify a new name, the function uses the original file name. If you specify http for the first parameter and don't provide a value for this parameter, the function uses the Content-Disposition information from the HTTP header. If the server providing the file doesn't provide Content-Disposition information, the function uses an auto-generated value.",
                type: 'string',
                optional: true,
            },
            {
                name: 'viewOnWeb',
                description:
                    'If `true` or `1`, a link to the file is included when a recipient selects the "View as a Web Page" link in the email. If `false` or `0`, the link is omitted. You can only use this parameter if the value of the first parameter is `http`.',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'viewOnWebUrl',
                description:
                    'The URL to use when including a link to the file in the "View as a Web Page" context. If the value of `viewOnWeb` is true, you must provide a value for this parameter. You can only use this parameter if the value of the first parameter is `http`.',
                type: 'string',
                optional: true,
            },
            {
                name: 'viewOnWebFileName',
                description:
                    'The file name to use when including a link to the file in the "View as a Web Page" context. You can only use this parameter if the value of the first parameter is `http`.',
                type: 'string',
                optional: true,
            },
            {
                name: 'viewOnWebDuration',
                description:
                    'The number of days the link appears in the "View as a Web Page" context. You can only use this parameter if the value of the first parameter is `http`.',
                type: 'number',
                optional: true,
            },
            {
                name: 'contentDispositionAttachment',
                description:
                    'If `true` or `1`, the function changes the value of the `content-disposition` header for the attachment to `attachment`. If `false` or `0`, the value of this header is set to `inline`.',
                type: 'boolean',
                optional: true,
            },
        ],
        returnType: 'void',
        returnDescription: 'No value is returned; the file is attached to the outgoing email.',
        syntax: 'AttachFile(fileLocationType, fileLocation, attachmentFileName, viewOnWeb, viewOnWebUrl, viewOnWebFileName, viewOnWebDuration, contentDispositionAttachment)',
        example: "%%=AttachFile('http', 'https://example.com/catalog.pdf', 'Catalog.pdf')=%%",
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        officialDocsNote:
            'AttachFile targets the outgoing email at send time; it has no working invocation on a CloudPage. Every reached call — contentbuilder key, http URL, and the two-argument minimum form — aborted the page with HTTP 422 and no partial output, on the child QA BU (MID 518005426) and again on the parent BU (MID 7281698). The abort only happens when the call is actually reached: gating it behind an unmatched query-string branch leaves the page at HTTP 200, so the failure is a runtime abort of the reached call rather than a compile-time rejection. The official reference additionally documents that the capability must be provisioned per account, which cannot be observed from a full-access probe.',
    },
    {
        name: 'AttributeValue',
        mcnSince: null,
        handlebarsEquivalent: 'personalizationResult',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-attribute-value.html',
        guideUrl: 'https://ampscript.guide/attributevalue/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/attributevalue/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Reads an attribute of the current message or page context by name, giving an empty value instead of failing when the name is unknown. The name is matched without regard to case, and system attributes such as the message context resolve on a CloudPage even though no subscriber is involved.',
        params: [
            {
                name: 'attributeName',
                description:
                    'Attribute name, matched without regard to case; an empty name aborts the page',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The attribute value as a string, or an empty value when the name resolves to nothing.',
        syntax: 'AttributeValue(attributeName)',
        example: "%%=AttributeValue('firstname')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'AuthenticatedEmployeeID',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-authenticated-employee-id.html',
        guideUrl: 'https://ampscript.guide/authenticatedemployeeid/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Returns the numeric employee ID of the Marketing Cloud user tied to the current context. On a public CloudPage, where nobody is signed in, it still returns a non-empty ID rather than an empty value, so it cannot be used to tell an authenticated visitor apart from an anonymous one.',
        params: [],
        returnType: 'string',
        returnDescription:
            'The employee ID as a numeric string, usable directly in Concat and in comparisons. It was non-empty even without a signed-in visitor.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/authenticatedemployeeid/',
        syntax: 'AuthenticatedEmployeeID()',
        example: '%%=AuthenticatedEmployeeID()=%%',
    },
    {
        name: 'AuthenticatedEmployeeNotificationAddress',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-authenticated-employee-notification-address.html',
        guideUrl: 'https://ampscript.guide/authenticatedemployeenotificationaddress/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Returns the notification email address of the Marketing Cloud user tied to the current context. On a public CloudPage, where nobody is signed in, it still returns a non-empty address rather than an empty value, so it cannot be used to tell an authenticated visitor apart from an anonymous one. It is a separate value from AuthenticatedEmployeeUserName() — neither can be derived from the other.',
        params: [],
        returnType: 'string',
        returnDescription:
            'The notification address as a string, usable directly in Concat and in comparisons. On the business unit tested it was a real email address on a registered domain, and it was non-empty even without a signed-in visitor.',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Proven on the child BU MCDEV_Training_QA (MID 518005426); the parent BU was not needed. The official reference scopes the function to microsites that use sender authenticated redirection and explicitly says it is not for use with CloudPages. At runtime the opposite happened: an anonymous GET of a public CloudPage rendered at HTTP 200 and the call returned a well-formed, non-empty notification email address — Empty() answered false, Length() reported 29 characters and IsEmailAddress() accepted it. The value behaved as an ordinary string when used inline, nested inside Concat and compared against the empty string. The literal address is redacted here because it identifies an account user; only its shape is described.',
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/authenticatedemployeenotificationaddress/',
        syntax: 'AuthenticatedEmployeeNotificationAddress()',
        example: '%%=AuthenticatedEmployeeNotificationAddress()=%%',
    },
    {
        name: 'AuthenticatedEmployeeUserName',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-authenticated-employee-username.html',
        guideUrl: 'https://ampscript.guide/authenticatedemployeeusername/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Returns the login username of the Marketing Cloud user tied to the current context. On a public CloudPage, where nobody is signed in, it still returns a non-empty username rather than an empty value, so it cannot be used to tell an authenticated visitor apart from an anonymous one.',
        params: [],
        returnType: 'string',
        returnDescription:
            'The username as a string, usable directly in Concat and in comparisons. On the business unit tested it was shaped like an email address and was non-empty even without a signed-in visitor.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/authenticatedemployeeusername/',
        syntax: 'AuthenticatedEmployeeUserName()',
        example: '%%=AuthenticatedEmployeeUserName()=%%',
    },
    {
        name: 'AuthenticatedEnterpriseID',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-authenticated-enterprise-id.html',
        guideUrl: 'https://ampscript.guide/authenticatedenterpriseid/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Returns the enterprise ID (EID) of the Marketing Cloud account tied to the current context. On a public CloudPage, where nobody is signed in, it still returns a non-empty ID rather than an empty value, so it cannot be used to tell an authenticated visitor apart from an anonymous one. Called from a child business unit it reports the parent (enterprise) MID, not the child MID, and it is a different value from AuthenticatedEmployeeID().',
        params: [],
        returnType: 'string',
        returnDescription:
            'The enterprise ID as a digits-only numeric string, usable directly in Concat, in comparisons and in arithmetic. It was non-empty even without a signed-in visitor.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/authenticatedenterpriseid/',
        syntax: 'AuthenticatedEnterpriseID()',
        example: '%%=AuthenticatedEnterpriseID()=%%',
    },
    {
        name: 'AuthenticatedMemberID',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-authenticated-member-id.html',
        guideUrl: 'https://ampscript.guide/authenticatedmemberid/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/authenticatedmemberid/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Returns the member ID (MID) of the business unit the code runs on. On a public CloudPage, where nobody is signed in, it still returns a non-empty MID rather than an empty value, so it cannot be used to tell an authenticated visitor apart from an anonymous one. Called from a child business unit it reports that CHILD MID, unlike AuthenticatedEnterpriseID(), which reports the parent (enterprise) MID in the same render.',
        params: [],
        returnType: 'string',
        returnDescription:
            'The member ID as a digits-only numeric string, usable directly in Concat, in comparisons and in arithmetic. It was non-empty even without a signed-in visitor.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        syntax: 'AuthenticatedMemberID()',
        example: '%%=AuthenticatedMemberID()=%%',
    },
    {
        name: 'AuthenticatedMemberName',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-authenticated-member-name.html',
        guideUrl: 'https://ampscript.guide/authenticatedmembername/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/authenticatedmembername/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Returns the display name of the business unit the code runs on. On a public CloudPage, where nobody is signed in, it still returns a non-empty name rather than an empty value, so it cannot be used to tell an authenticated visitor apart from an anonymous one. It is the business unit name as shown in the Marketing Cloud UI — spaces and punctuation included — not a person and not the login username returned by AuthenticatedEmployeeUserName() in the same render.',
        params: [],
        returnType: 'string',
        returnDescription:
            'The business unit display name as a free-text string that can contain spaces and punctuation, usable directly in Concat and in comparisons. It was non-empty even without a signed-in visitor.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        syntax: 'AuthenticatedMemberName()',
        example: '%%=AuthenticatedMemberName()=%%',
    },
    {
        name: 'BarcodeURL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-barcode-url.html',
        guideUrl: 'https://ampscript.guide/barcodeurl/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/barcodeurl/',
        minArgs: 4,
        maxArgs: 9,
        category: 'Content',
        description:
            'Generates a URL that renders a barcode image from the given value, symbology, width, and height, plus optional formatting. An empty value aborts the page instead of returning an empty result.',
        params: [
            {
                name: 'valueToConvert',
                description: 'Data to convert into a barcode',
                type: 'string',
            },
            {
                name: 'barcodeType',
                description: 'Type of barcode to generate',
                type: 'string',
                enum: [
                    'codabar',
                    'code11',
                    'code128auto',
                    'code128a',
                    'code128b',
                    'code128c',
                    'code39',
                    'code39ext',
                    'code93',
                    'code93ext',
                    'datamatrix',
                    'ean13',
                    'ean8',
                    'industr25',
                    'interl25',
                    'msi',
                    'pdf417',
                    'upca',
                    'upce',
                ],
            },
            { name: 'width', description: 'Barcode image width in pixels', type: 'number' },
            { name: 'height', description: 'Barcode image height in pixels', type: 'number' },
            {
                name: 'checksumValue',
                description: 'Checksum value for barcode',
                type: 'string',
                optional: true,
            },
            {
                name: 'showText',
                description:
                    "If `true` or `1`, the function includes the text of `valueToConvert` under the barcode. If `false` or `0`, the function doesn't include the text of `valueToConvert` under the barcode. The default value is `false`.",
                type: 'boolean',
                optional: true,
            },
            {
                name: 'altText',
                description: 'Alternate text to display under the barcode if `showText` is `false`',
                type: 'string',
                optional: true,
            },
            {
                name: 'rotation',
                description: 'Orientation of barcode in degrees',
                type: 'number',
                enum: [0, 90, 180, 270],
                optional: true,
            },
            {
                name: 'transparentBG',
                description:
                    'If `true` or `1`, the barcode includes a transparent background. Otherwise, the background is white. The default value is `false`.',
                type: 'boolean',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'A URL that renders the requested barcode image.',
        syntax: 'BarcodeURL(valueToConvert, barcodeType, width, height, checksumValue, showText, altText, rotation, transparentBG)',
        example: "<img src=\"%%=BarcodeURL('12345678901', 'code128auto', 150, 50)=%%\">",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'Base64Decode',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-base64-decode.html',
        guideUrl: 'https://ampscript.guide/base64decode/',
        minArgs: 1,
        maxArgs: 3,
        category: 'Encryption and Encoding',
        description:
            'Decodes a Base64-encoded string. The decoded bytes are read as UTF-8 unless encoding names another character encoding, and any value that is not well-formed Base64 aborts the page instead of returning an empty or partial result.',
        params: [
            {
                name: 'encodedString',
                description:
                    'Base64 string to decode; it must be well-formed, because malformed input aborts the page',
                type: 'string',
            },
            {
                name: 'encoding',
                description:
                    'Name of the character encoding used to turn the decoded bytes back into text; defaults to UTF-8, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
            {
                name: 'abortOnFailure',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Flag reserved for send-time failure handling; 0, 1, true and false are all accepted and none of them changes the value a successful decode returns',
                type: 'number|boolean',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The decoded string.',
        syntax: 'Base64Decode(encodedString[, encoding, abortOnFailure])',
        example: "%%=Base64Decode('SGVsbG8=')=%%",
        isConfirmed: true,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/base64decode/',
    },
    {
        name: 'Base64Encode',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-base64-encode.html',
        guideUrl: 'https://ampscript.guide/base64encode/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Encryption and Encoding',
        description:
            'Encodes a value as a Base64 string. The bytes encoded are the UTF-8 representation of the input unless encoding names another character encoding.',
        params: [
            {
                name: 'value',
                description: 'Value to encode; the empty string encodes to the empty string',
                type: 'string',
            },
            {
                name: 'encoding',
                description:
                    'Name of the character encoding applied before encoding; any encoding name the platform recognises works, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The Base64-encoded representation of the input, padded with = to a multiple of four characters.',
        syntax: 'Base64Encode(value[, encoding])',
        example: "%%=Base64Encode('Hello')=%%",
        isConfirmed: true,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/base64encode/',
    },
    {
        name: 'BeginImpressionRegion',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-begin-impression-region.html',
        guideUrl: 'https://ampscript.guide/beginimpressionregion/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/beginimpressionregion/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Content',
        description:
            'Marks the start of an impression tracking region. The region name must be a literal — a variable argument aborts the page.',
        params: [{ name: 'regionName', description: 'Impression region name', type: 'string' }],
        returnType: 'void',
        returnDescription: 'No value is returned; it marks the start of an impression region.',
        syntax: 'BeginImpressionRegion(regionName)',
        example: "BeginImpressionRegion('Region A')",
    },
    {
        name: 'BuildOptionList',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-build-option-list.html',
        guideUrl: 'https://ampscript.guide/buildoptionlist/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/buildoptionlist/',
        minArgs: 3,
        maxArgs: INF,
        category: 'Content',
        description:
            'Builds HTML <option> elements from supplied value/text pairs for use in a <select> dropdown, marking the pair whose value matches the default selection as selected.',
        params: [
            {
                name: 'defaultSelection',
                mcnSince: null,
                mcnNotes: null,
                description: 'The option that is selected by default',
                type: 'string|number',
            },
            {
                name: 'option1Value',
                description:
                    'An identifier for the first option. The function sets the `value` parameter in the `<option>` tag to this value.',
                type: 'string',
            },
            {
                name: 'option1Text',
                description: 'The display text for the option tag.',
                type: 'string',
            },
            {
                name: 'optionValueN',
                description:
                    'An identifier for an additional option. The function sets the `value` parameter in the `<option>` tag to this value.',
                type: 'string',
                optional: true,
            },
            {
                name: 'optionTextN',
                description: 'The display text for the additional option tag.',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'An HTML string of option elements built from the supplied values.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'BuildOptionList(defaultSelection, option1Value, option1Text[, optionValueN, optionTextN, ...])',
        example:
            '%%[\n' +
            'set @DefaultOption = 2\n' +
            'set @OptionList = BuildOptionList(@DefaultOption, "1", "Option A", "2", "Option B", "3", "Option C")\n' +
            ']%%\n' +
            '<p>Choose an option:</p>\n' +
            '<select name="choice">\n%%=v(@OptionList)=%%\n</select>',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'BuildRowsetFromJSON',
        mcnSince: 67,
        handlebarsEquivalent: 'jsonPath',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-build-rowset-from-json.html',
        guideUrl: 'https://ampscript.guide/buildrowsetfromjson/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/buildrowsetfromjson/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Content',
        description: 'Parses a JSON string and returns a rowset.',
        params: [
            {
                name: 'jsonData',
                description: 'The JSON data that you want to parse',
                type: 'string',
            },
            {
                name: 'jsonPathExpression',
                mcnSince: null,
                mcnNotes: null,
                description: 'The JSONPath expression that parses the source data',
                type: 'string',
            },
            {
                name: 'returnEmptyOnError',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Pass 1 or true to get an empty rowset when the payload or path cannot be parsed; 0 or false makes the same input abort the page',
                type: 'boolean|number',
            },
        ],
        returnType: 'rowset',
        returnDescription:
            'A rowset built from the matched JSON nodes. A path that matches nothing yields a rowset with zero rows rather than an error.',
        syntax: 'BuildRowsetFromJSON(jsonData, jsonPathExpression, returnEmptyOnError)',
        example: "%%[ SET @rows = BuildRowsetFromJSON(@json, '$.items[*]', 1) ]%%",
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official syntax section states that a false third argument yields an empty rowset and a true one raises an exception; runtime on the child BU (MID 518005426, CloudPage GET) does the opposite. Malformed JSON with 1 rendered a rowset of zero rows, while the identical payload with 0 aborted the page with HTTP 422. The same page also proved that an unparsable payload, an unset variable, an empty string, [] and a path matching nothing all yield zero rows when 1 is passed. Note the official Errors section already describes the runtime ordering, so the page contradicts itself.',
    },
    {
        name: 'BuildRowSetFromString',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-build-rowset-from-string.html',
        guideUrl: 'https://ampscript.guide/buildrowsetfromstring/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/buildrowsetfromstring/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Content',
        description: 'Splits a delimited string into a single-column rowset.',
        params: [
            {
                name: 'sourceData',
                description: 'A string that contains the data to load into a rowset',
                type: 'string',
            },
            {
                name: 'delimiter',
                description:
                    'The separator to split on; it may be several characters long, and an empty separator leaves the input as a single row',
                type: 'string',
            },
        ],
        returnType: 'rowset',
        returnDescription:
            'A rowset where each row holds one delimited segment of the input string. The single column has no name, so read it with Field(row, 1). An empty or unset input gives zero rows.',
        syntax: 'BuildRowSetFromString(sourceData, delimiter)',
        example: "%%=BuildRowSetFromString('a,b,c', ',')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'BuildRowSetFromXML',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-build-rowset-from-xml.html',
        guideUrl: 'https://ampscript.guide/buildrowsetfromxml/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/buildrowsetfromxml/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Content',
        description: 'Parses an XML string using an XPath expression and returns a rowset.',
        params: [
            { name: 'xmlData', description: 'The XML data that you want to parse', type: 'string' },
            {
                name: 'xpathExpression',
                description: 'The XPath expression that parses the source data',
                type: 'string',
            },
            {
                name: 'returnEmptyOnError',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Pass 1 or true to get an empty rowset when the payload or path cannot be parsed; 0 or false makes the same input abort the page',
                type: 'boolean|number',
            },
        ],
        returnType: 'rowset',
        returnDescription:
            'A rowset built from the matched XML nodes, with a Value column, an Xml column holding the inner markup, and one <attribute>_att column per attribute seen on any matched node. An XPath that matches nothing yields zero rows rather than an error.',
        syntax: 'BuildRowSetFromXML(xmlData, xpathExpression, returnEmptyOnError)',
        example: "%%[ SET @rows = BuildRowSetFromXML(@xml, '/root/item', 1) ]%%",
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official syntax section states that a false third argument yields an empty rowset and a true one raises an exception; runtime on the child BU (MID 518005426, CloudPage GET) behaves the other way round. Unclosed XML parsed with 1 rendered a rowset of zero rows, whereas the identical payload with 0 aborted the page with HTTP 422. An empty string, an unset variable, an empty root element and an XPath matching nothing likewise gave zero rows under 1.',
    },
    {
        name: 'Char',
        mcnSince: null,
        handlebarsEquivalent: 'char',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-char.html',
        guideUrl: 'https://ampscript.guide/char/',
        minArgs: 1,
        maxArgs: 2,
        category: 'String',
        description:
            'Returns the character for the given numeric character code. Codes above 255 are not rejected — they resolve to the matching Unicode character.',
        params: [
            {
                name: 'characterCode',
                description: 'Character code, as a whole number',
                type: 'string|number',
            },
            {
                name: 'numRepetitions',
                mcnSince: null,
                mcnNotes: null,
                description: 'Number of times to repeat the returned character, as a whole number',
                type: 'string|number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The character for the supplied code, repeated when a repetition count is given. A count of 0 yields an empty string.',
        syntax: 'Char(characterCode[, numRepetitions])',
        example: '%%=Char(10)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/char/',
    },
    {
        name: 'ClaimRow',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-claim-row.html',
        guideUrl: 'https://ampscript.guide/claimrow/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/claimrow/',
        minArgs: 4,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Atomically claims an unclaimed row in a data extension by setting a key column value.',
        params: [
            {
                name: 'dataExt',
                mcnSince: null,
                mcnNotes: null,
                description: 'The data extension that contains the value to return (hard-coded)',
                type: 'string',
            },
            {
                name: 'claimColumn',
                mcnSince: null,
                mcnNotes: null,
                description: 'The column the function uses to track whether a row is claimed',
                type: 'string',
            },
            {
                name: 'claimantColumn',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The column the function uses to track the subscriber who claimed the row',
                type: 'string',
            },
            {
                name: 'claimantValue',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The value to enter in the claimantColumn when the function claims a row',
            },
            {
                name: 'additionalColumnNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional column name to populate',
                type: 'string',
                optional: true,
            },
            {
                name: 'additionalColumnValueN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional column value to populate',
                optional: true,
            },
        ],
        returnType: 'row',
        returnDescription: 'The claimed row, or an empty row when none could be claimed.',
        repeat: [{ startIndex: 4, groupSize: 2, minGroups: 0 }],
        syntax: 'ClaimRow(dataExt, claimColumn, claimantColumn, claimantValue[, additionalColumnNameN, additionalColumnValueN, ...])',
        example: "%%[ SET @row = ClaimRow('Coupons', 'Claimed', 'SubKey', _subscriberkey) ]%%",
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Runtime-proven on a Marketing Cloud Engagement CloudPage (child BU MID 518005426) against a data extension built to the documented claimable schema (Text primary key, Text claimant column, required non-nullable Boolean claim column defaulting to False, nullable Date column). Each call passing a NEW claimant value claims the next unclaimed row and advances: four distinct claimants received C1, C2, C3, C4 in order, each row flipping to claimed with its claimant recorded and ClaimedDate auto-populated. Re-calling with a claimant value that already holds a row returns that same row rather than advancing (per-subscriber idempotency). The official reference states that ClaimRow returns an exception when no unclaimed rows remain; at runtime it instead returned an empty row that does not abort the page (Empty() on it is true), so a caller must guard with Empty() rather than expecting a raised error. Each claim was driven by a separate HTTP request carrying the claimant value as a RequestParameter — the prior single-render probe that reused one claimant value never advanced because of the idempotency rule, not a provisioning gap.',
    },
    {
        name: 'ClaimRowValue',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-claim-row-value.html',
        guideUrl: 'https://ampscript.guide/claimrowvalue/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/claimrowvalue/',
        minArgs: 6,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Atomically claims a row and returns a specific column value from it, or a caller-supplied fallback when no unclaimed rows remain.',
        params: [
            {
                name: 'dataExt',
                mcnSince: null,
                mcnNotes: null,
                description: 'The data extension that contains the value to return (hard-coded)',
                type: 'string',
            },
            {
                name: 'returnValueColumn',
                description: 'The name of the column that contains the data to return',
                type: 'string',
            },
            {
                name: 'claimColumn',
                mcnSince: null,
                mcnNotes: null,
                description: 'The column the function uses to track whether a row is claimed',
                type: 'string',
            },
            {
                name: 'fallbackValue',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Value returned when no unclaimed rows remain (required at runtime, despite ampscript.guide marking it optional)',
            },
            {
                name: 'claimantColumn',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The column the function uses to track the subscriber who claimed the row (required at runtime)',
                type: 'string',
            },
            {
                name: 'claimantValue',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The value to enter in the claimant column when the function claims a row (required at runtime)',
            },
            {
                name: 'additionalColumnNameN',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Name of a further column to write on the claimed row (record extra context at claim time). Repeatable as name/value pairs.',
                type: 'string',
                optional: true,
            },
            {
                name: 'additionalColumnValueN',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Value written to the paired additionalColumnNameN column on the claimed row',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The value from the requested column of the claimed row, or the fallbackValue when no unclaimed rows remain.',
        repeat: [{ startIndex: 6, groupSize: 2, minGroups: 0 }],
        syntax: 'ClaimRowValue(dataExt, returnValueColumn, claimColumn, fallbackValue, claimantColumn, claimantValue[, additionalColumnNameN, additionalColumnValueN, ...])',
        example:
            "%%=ClaimRowValue('Coupons', 'Code', 'Claimed', 'SOLD OUT', 'SubKey', _subscriberkey)=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'CloudPagesURL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-cloud-pages-url.html',
        guideUrl: 'https://ampscript.guide/cloudpagesurl/',
        minArgs: 1,
        maxArgs: INF,
        category: 'Utility',
        description:
            'Builds the published URL of a CloudPages landing page. Name-value pairs are appended in PAIRS and are folded into a single encrypted query token rather than readable parameters; an odd trailing argument or a page ID that matches no page aborts the page.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/cloudpagesurl/',
        params: [
            {
                name: 'pageId',
                description: 'CloudPages page ID (number or string)',
                type: 'string|number',
            },
            {
                name: 'paramName1',
                description: 'Query parameter name',
                type: 'string',
                optional: true,
            },
            {
                name: 'paramValue1',
                description: 'Query parameter value',
                type: 'string',
                optional: true,
            },
            {
                name: 'paramNameN',
                description: 'Additional query parameter name',
                type: 'string',
                optional: true,
            },
            {
                name: 'paramValueN',
                description: 'Additional query parameter value',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The page URL. With no extra pairs it is the bare published URL; with pairs it carries one encrypted query token that changes on every call, so the result must never be compared or cached.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 0 }],
        syntax: 'CloudPagesURL(pageId[, paramName1, paramValue1, paramNameN, paramValueN, ...])',
        example: "%%=CloudPagesURL(123, 'key', 'value')=%%",
    },
    {
        name: 'Concat',
        mcnSince: 67,
        handlebarsEquivalent: 'concat',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-concat.html',
        guideUrl: 'https://ampscript.guide/concat/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/concat/',
        minArgs: 1,
        maxArgs: INF,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'String',
        description: 'Concatenates two or more string values.',
        params: [
            { name: 'string1', description: 'First string', type: 'string|number|date' },
            {
                name: 'string2',
                description: 'Second string',
                type: 'string|number|date',
                optional: true,
            },
            {
                name: 'stringN',
                description: 'Additional string',
                type: 'string|number|date',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The concatenation of all supplied values as a single string.',
        repeat: [{ startIndex: 0, groupSize: 1, minGroups: 1 }],
        syntax: 'Concat(string1, string2[, stringN, ...])',
        example: "%%=Concat('Hello', ' ', 'World')=%%",
    },
    {
        name: 'ContentArea',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-area.html',
        guideUrl: 'https://ampscript.guide/contentarea/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentarea/',
        minArgs: 1,
        maxArgs: 5,
        category: 'Content',
        description: 'Inserts a classic content area by its numeric ID.',
        params: [
            {
                name: 'contentAreaId',
                mcnSince: null,
                mcnNotes: null,
                description: 'The ID of the content area to retrieve',
                type: 'number|string',
            },
            {
                name: 'impressionRegionName',
                mcnSince: null,
                mcnNotes: null,
                description: 'The name of the impression region to associate with the content area',
                type: 'string',
                optional: true,
            },
            {
                name: 'errorOnMissingContentArea',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "Determines whether the function returns an error when the system can't locate the specified content area or returns an invalid content area. A value of true returns an error. Defaults to true.",
                type: 'boolean',
                optional: true,
                default: true,
            },
            {
                name: 'errorMessage',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Default content to return if an error occurs. This value is emitted literally - any AMPscript it contains is not evaluated.',
                type: 'string',
                optional: true,
            },
            {
                name: 'statusCode',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'An output variable that contains the exit code of the function. A value of 0 indicates the function found the content area and successfully rendered the content. A value of -1 indicates either no content or an invalid content area.',
                type: 'number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The rendered HTML of the referenced content area.',
        syntax: 'ContentArea(contentAreaId[, impressionRegionName, errorOnMissingContentArea, errorMessage, statusCode])',
        example: '%%=ContentArea(12345)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        deprecated: true,
        deprecatedReplacement: 'ContentBlockByID',
        deprecatedReason:
            'ContentArea references classic content areas, which are no longer supported. Use Content Builder content blocks instead.',
    },
    {
        name: 'ContentAreaByName',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-area-by-name.html',
        guideUrl: 'https://ampscript.guide/contentareabyname/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentareabyname/',
        minArgs: 1,
        maxArgs: 5,
        category: 'Content',
        description: 'Inserts a classic content area by its folder path and name.',
        params: [
            {
                name: 'contentAreaName',
                description: 'The name of the content area to retrieve',
                type: 'string',
            },
            {
                name: 'impressionRegionName',
                mcnSince: null,
                mcnNotes: null,
                description: 'The name of the impression region to associate with the content area',
                type: 'string',
                optional: true,
            },
            {
                name: 'errorOnMissingContentArea',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "Determines whether the function returns an error when the system can't locate the specified content area or returns an invalid content area. A value of true returns an error. Defaults to true.",
                type: 'boolean',
                optional: true,
                default: true,
            },
            {
                name: 'errorMessage',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Default content to return if an error occurs. This value is emitted literally - any AMPscript it contains is not evaluated.',
                type: 'string',
                optional: true,
            },
            {
                name: 'statusCode',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'An output variable that contains the exit code of the function. A value of 0 indicates the function found the content area and successfully rendered the content. A value of -1 indicates either no content or an invalid content area.',
                type: 'number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The rendered HTML of the named content area.',
        syntax: 'ContentAreaByName(contentAreaName[, impressionRegionName, errorOnMissingContentArea, errorMessage, statusCode])',
        example: String.raw`%%=ContentAreaByName('My Folder\My Content')=%%`,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        deprecated: true,
        deprecatedReplacement: 'ContentBlockByName',
        deprecatedReason:
            'ContentAreaByName references classic content areas, which are no longer supported. Use Content Builder content blocks instead.',
    },
    {
        name: 'ContentBlockByID',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-block-by-id.html',
        guideUrl: 'https://ampscript.guide/contentblockbyid/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentblockbyid/',
        minArgs: 1,
        maxArgs: 5,
        category: 'Content',
        description: 'Retrieves and renders a Content Builder content block by its numeric ID.',
        params: [
            {
                name: 'contentBlockId',
                description: 'The ID of the content block to retrieve',
                type: 'number|string',
            },
            {
                name: 'impressionRegionName',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The name of the impression region to associate with the content block',
                type: 'string',
                optional: true,
            },
            {
                name: 'errorOnMissingContentBlock',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "If true, the function returns an error if the content block can't be found. If false, the function doesn't return an error. The default value is true",
                type: 'boolean',
                optional: true,
                default: true,
            },
            {
                name: 'errorMessage',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Default content to return if an error occurs. This value is emitted literally - any AMPscript it contains is not evaluated.',
                type: 'string',
                optional: true,
            },
            {
                name: 'statusCode',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The exit code of the function. A value of 0 indicates the function found the content block and successfully rendered the content. A value of -1 indicates either no content or an invalid content block.',
                type: 'number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The rendered HTML of the content block identified by ID.',
        syntax: 'ContentBlockByID(contentBlockId[, impressionRegionName, errorOnMissingContentBlock, errorMessage, statusCode])',
        example: '%%=ContentBlockByID(12345)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'ContentBlockByKey',
        mcnSince: 67,
        handlebarsEquivalent: 'getContentBlock',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-block-by-key.html',
        guideUrl: 'https://ampscript.guide/contentblockbykey/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentblockbykey/',
        minArgs: 1,
        maxArgs: 5,
        category: 'Content',
        description: 'Retrieves and renders a Content Builder content block by its customer key.',
        params: [
            {
                name: 'contentBlockKey',
                description: 'The key of the content block to retrieve',
                type: 'string',
            },
            {
                name: 'impressionRegionName',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The name of the impression region to associate with the content block',
                type: 'string',
                optional: true,
            },
            {
                name: 'errorOnMissingContentBlock',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "If true, the function returns an error if the content block can't be found. If false, the function doesn't return an error. The default value is true",
                type: 'boolean',
                optional: true,
                default: true,
            },
            {
                name: 'errorMessage',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Default content to return if an error occurs. This value is emitted literally - any AMPscript it contains is not evaluated.',
                type: 'string',
                optional: true,
            },
            {
                name: 'statusCode',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The exit code of the function. A value of 0 indicates the function found the content block and successfully rendered the content. A value of -1 indicates either no content or an invalid content block.',
                type: 'number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The rendered HTML of the content block identified by customer key.',
        syntax: 'ContentBlockByKey(contentBlockKey[, impressionRegionName, errorOnMissingContentBlock, errorMessage, statusCode])',
        example: "%%=ContentBlockByKey('welcome-header')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'ContentBlockByName',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-block-by-name.html',
        guideUrl: 'https://ampscript.guide/contentblockbyname/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentblockbyname/',
        minArgs: 1,
        maxArgs: 5,
        category: 'Content',
        description:
            'Retrieves and renders a Content Builder content block by its folder path and name.',
        params: [
            {
                name: 'contentBlockName',
                description: 'The full path of the content block to retrieve',
                type: 'string',
            },
            {
                name: 'impressionRegionName',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The name of the impression region to associate with the content block',
                type: 'string',
                optional: true,
            },
            {
                name: 'errorOnMissingContentBlock',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "If true, the function returns an error if the content block can't be found. If false, the function doesn't return an error. The default value is true",
                type: 'boolean',
                optional: true,
                default: true,
            },
            {
                name: 'errorMessage',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Default content to return if an error occurs. This value is emitted literally - any AMPscript it contains is not evaluated.',
                type: 'string',
                optional: true,
            },
            {
                name: 'statusCode',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The exit code of the function. A value of 0 indicates the function found the content block and successfully rendered the content. A value of -1 indicates either no content or an invalid content block.',
                type: 'number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The rendered HTML of the content block identified by name or path.',
        syntax: 'ContentBlockByName(contentBlockName[, impressionRegionName, errorOnMissingContentBlock, errorMessage, statusCode])',
        example: String.raw`%%=ContentBlockByName('My Folder\Welcome Header')=%%`,
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'ContentImageByID',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-image-by-id.html',
        guideUrl: 'https://ampscript.guide/contentimagebyid/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentimagebyid/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Content',
        description:
            'Returns an HTML img tag for a Content Builder image asset by its numeric ID. A missing image with no fallback aborts the page.',
        params: [
            {
                name: 'id',
                description: 'The ID of an image in Content Builder',
                type: 'number|string',
            },
            {
                name: 'defaultImageExternalId',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "The ID of a fallback image in Content Builder. The function uses this image if it can't find the image that you specified in the first parameter",
                type: 'number|string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'An HTML img tag for the referenced image, with title, alt, border and thid attributes.',
        syntax: 'ContentImageByID(id[, defaultImageExternalId])',
        example: '%%=ContentImageByID(12345)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'ContentImageByKey',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-image-by-key.html',
        guideUrl: 'https://ampscript.guide/contentimagebykey/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/contentimagebykey/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Content',
        description:
            'Returns an HTML img tag for a Content Builder image asset by its customer key. A missing image with no fallback aborts the page.',
        params: [
            {
                name: 'imageExternalKey',
                description: 'External key of the image asset',
                type: 'string',
            },
            {
                name: 'defaultImageExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key of the fallback image asset',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'An HTML img tag for the referenced image, with title, alt, border and thid attributes.',
        syntax: 'ContentImageByKey(imageExternalKey[, defaultImageExternalKey])',
        example: "%%=ContentImageByKey('hero-image')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'CreateMSCRMRecord',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-create-record.html',
        guideUrl: 'https://ampscript.guide/createmscrmrecord/',
        minArgs: 4,
        maxArgs: INF,
        category: 'Microsoft Dynamics CRM',
        description: 'Creates a new record in Microsoft Dynamics CRM.',
        params: [
            {
                name: 'entityName',
                description: 'The name of the Microsoft Dynamics CRM entity',
                type: 'string',
            },
            {
                name: 'numFields',
                description: 'The number of name and value pairs of fields to create',
                type: 'number',
            },
            {
                name: 'attributeName1',
                description: 'The name of the first attribute to populate in the record',
                type: 'string',
            },
            {
                name: 'attributeValue1',
                description: 'The value of the first attribute to populate in the record',
            },
            {
                name: 'attributeNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional attribute name',
                type: 'string',
                optional: true,
            },
            { name: 'attributeValueN', description: 'Additional attribute value', optional: true },
        ],
        returnType: 'string',
        returnDescription: 'The GUID of the newly created Microsoft Dynamics CRM record.',
        repeat: [{ startIndex: 2, groupSize: 2, minGroups: 1, countParam: 'numFields' }],
        syntax: 'CreateMSCRMRecord(entityName, numFields, attributeName1, attributeValue1[, attributeNameN, attributeValueN, ...])',
        example: "%%=CreateMSCRMRecord('contact', 1, 'lastname', 'Smith')=%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'CreateObject',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-create-object.html',
        guideUrl: 'https://ampscript.guide/createobject/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/createobject/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Marketing Cloud API',
        description:
            'Instantiates a Marketing Cloud SOAP API object for use with Invoke* functions.',
        params: [
            { name: 'objectName', description: 'The name of the new API Object', type: 'string' },
        ],
        returnType: 'object',
        returnDescription: 'A new API object instance for use with the Invoke* functions.',
        syntax: 'CreateObject(objectName)',
        example: "%%=CreateObject('DataExtensionObject')=%%",
        isConfirmed: true,
    },
    {
        name: 'CreateSalesforceObject',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-salesforce/mc-ampscript-reference-salesforce-create-object.html',
        guideUrl: 'https://ampscript.guide/createsalesforceobject/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/createsalesforceobject/',
        minArgs: 4,
        maxArgs: INF,
        category: 'Sales and Service Cloud',
        description:
            'Creates a new record in a connected Salesforce Sales or Service Cloud object via Marketing Cloud Connect and returns the 18-character ID of the created record. Requires an active Marketing Cloud Connect integration; the field names must be valid API names on the target object, and a fault (unknown object or field) aborts the whole page rather than returning an error value.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        officialDocsNote:
            'The success path was runtime-proven on cred/DEV (MID 510007949), which has an active Marketing Cloud Connect integration to a real Salesforce org. Creating a benign Task with a single opaque field returned a real 18-character Salesforce ID (an 00T-prefixed Task ID), confirming the documented return shape. The fault path was also proven: an unknown object name and an unknown field name on a real object each aborted the CloudPage with HTTP 422 — the SOAP fault from the connected org propagates as an uncatchable page abort (AMPscript has no try/catch), exactly like RetrieveSalesforceObjects against an unknown object — so there is no testable error value, the function either returns an ID or aborts. AMPscript has no delete function for Salesforce objects, so the created Task remains as benign residue in the org. Catalog signature, returnType and repeat group all match the official reference and ampscript.guide, so differsFromOfficialDocs stays false.',
        params: [
            {
                name: 'objectName',
                description: 'The API name of the Salesforce object to insert the record into',
                type: 'string',
            },
            {
                name: 'numFields',
                description:
                    'The number of fields to insert. Must match the number of name-value pairs specified',
                type: 'number',
            },
            {
                name: 'fieldName1',
                description: 'The name of the field to insert in the object',
                type: 'string',
            },
            { name: 'fieldValue1', description: 'The value to insert for the field' },
            {
                name: 'fieldNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional field name',
                type: 'string',
                optional: true,
            },
            { name: 'fieldValueN', description: 'Additional field value', optional: true },
        ],
        returnType: 'string',
        returnDescription: 'The 18-character ID of the newly created Salesforce object record.',
        repeat: [{ startIndex: 2, groupSize: 2, minGroups: 1, countParam: 'numFields' }],
        syntax: 'CreateSalesforceObject(objectName, numFields, fieldName1, fieldValue1[, fieldNameN, fieldValueN, ...])',
        example: "%%=CreateSalesforceObject('Contact', 1, 'LastName', 'Smith')=%%",
    },
    {
        name: 'CreateSmsConversation',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-create-sms-conversation.html',
        guideUrl: 'https://ampscript.guide/createsmsconversation/',
        minArgs: 4,
        maxArgs: 4,
        category: 'MobileConnect',
        description:
            'Initiates an SMS conversation with a contact from within a MobileConnect message. Returns true when a conversation is created inside a MobileConnect message context, and false in any other context (for example a CloudPage or email). The success path cannot be exercised outside a live MobileConnect send.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        differsFromOfficialDocs: true,
        officialDocsNote:
            "Runtime-observed on cred/DEV (MID 510007949), the only BU available for this batch (no parent-BU escalation). Unlike Msg()/Noun()/Verb(), this is an ordinary function call, so it compiles and runs on a CloudPage: called there with a real short code, the authorized destination number and app 'MOBILECONNECT', it returned the literal boolean false (Empty() false) and the page rendered fully with no exception — no SMS was sent. Passing an invalid app value also returned false, so the CloudPage context masks any app-validation error. This confirms the ampscript.guide claim that the function returns false outside a MobileConnect message context; the official Salesforce reference omits this and describes only the in-context behaviour (true on success, exception on failure). The success path (true, real conversation creation) requires a live MobileConnect message context that does not exist on a CloudPage and cannot be captured on this tenant, so the function is recorded blocked for the success path while the CloudPage false-return is proven. The catalogued signature was also corrected here: the four parameters are originationNumber, destinationNumber, nextKeyword and app, and the return is a boolean, not void.",
        params: [
            {
                name: 'originationNumber',
                description: 'The MobileConnect short code or long code used to send',
                type: 'string',
            },
            {
                name: 'destinationNumber',
                description: "The contact's phone number, including country code",
                type: 'string',
            },
            {
                name: 'nextKeyword',
                description: 'The keyword to set as the next conversation keyword',
                type: 'string',
            },
            {
                name: 'app',
                description: "The application for the conversation; must be 'MOBILECONNECT'",
                type: 'string',
            },
        ],
        returnType: 'boolean',
        returnDescription:
            'true when a conversation is created inside a MobileConnect message context; false in any other context (proven on a CloudPage). Fails with an exception in-context if unsuccessful.',
        syntax: 'CreateSmsConversation(originationNumber, destinationNumber, nextKeyword, app)',
        example: '%%=CreateSmsConversation("12345", MOBILE_NUMBER, "KEYWORD", "MOBILECONNECT")=%%',
    },
    {
        name: 'DataExtensionRowCount',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-de-row-count.html',
        guideUrl: 'https://ampscript.guide/dataextensionrowcount/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/dataextensionrowcount/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 1,
        maxArgs: 1,
        category: 'Data Extension',
        description: 'Returns the total number of rows in a data extension.',
        params: [
            {
                name: 'dataExtensionName',
                mcnSince: null,
                mcnNotes: null,
                description: 'Data extension name or external key',
                type: 'string',
            },
        ],
        returnType: 'number',
        returnDescription: 'The total number of rows in the data extension.',
        syntax: 'DataExtensionRowCount(dataExtensionName)',
        example: "%%=DataExtensionRowCount('MyDE')=%%",
    },
    {
        name: 'DateAdd',
        mcnSince: 67,
        handlebarsEquivalent: 'dateAdd',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-date-add.html',
        guideUrl: 'https://ampscript.guide/dateadd/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/dateadd/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: 3,
        category: 'Date and Time',
        description:
            'Adds a whole number of intervals to a date value. Only the five documented units are accepted and every other unit, including seconds and weeks, aborts the page — as does a non-integer amount or a date the engine cannot parse.',
        params: [
            {
                name: 'date',
                description:
                    'The date to adjust, either a real date value or a parseable date string',
                type: 'string|date',
            },
            {
                name: 'amountToAdd',
                description:
                    'Whole number of intervals to add; negative subtracts, zero returns the date unchanged, and a decimal aborts the page',
                type: 'string|number',
            },
            {
                name: 'unitToAdd',
                description:
                    'The unit to add, case-insensitive. Accepted values: Y (years), M (months), D (days), H (hours), MI (minutes). Any other value aborts the page',
                type: 'string',
            },
        ],
        returnType: 'date',
        returnDescription:
            'The resulting date value, which the other date functions accept directly. Adding months clamps to the last day of the shorter target month.',
        syntax: 'DateAdd(date, amountToAdd, unitToAdd)',
        example: "%%=DateAdd(Now(), 7, 'D')=%%",
    },
    {
        name: 'DateDiff',
        mcnSince: 67,
        handlebarsEquivalent: 'dateDiff',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-date-diff.html',
        guideUrl: 'https://ampscript.guide/datediff/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Date and Time',
        description:
            'Counts how many boundaries of the requested unit lie between two dates, by truncating both to that unit and subtracting — so a 23-hour gap that crosses midnight counts as 1 day, while 23 hours within one day counts as 0. Finer units than the one requested are ignored rather than rounded.',
        params: [
            {
                name: 'startDate',
                description:
                    'The starting date, either a real date value or a parseable date string',
                type: 'string|date',
            },
            {
                name: 'endDate',
                description:
                    'The end date, either a real date value or a parseable date string; a later end date gives a positive result and an earlier one a negative result',
                type: 'string|date',
            },
            {
                name: 'unitOfDifference',
                description:
                    'The unit to count in, case-insensitive. Accepted values: Y (years), M (months), D (days), H (hours), MI (minutes). Any other value aborts the page',
                type: 'string',
                enum: ['Y', 'M', 'D', 'H', 'MI'],
            },
        ],
        returnType: 'number',
        returnDescription:
            'A whole number that is negative when the end date precedes the start date and 0 when both fall inside the same unit.',
        syntax: 'DateDiff(startDate, endDate, unitOfDifference)',
        example: "%%=DateDiff(Now(), DateAdd(Now(), 1, 'D'), 'MI')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/datediff/',
    },
    {
        name: 'DateParse',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-date-parse.html',
        guideUrl: 'https://ampscript.guide/dateparse/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Date and Time',
        description:
            'Parses a date string into a date value. A string the parser cannot read aborts the page instead of returning a sentinel, and an ambiguous day-first string such as 5/8/2026 is silently read month-first rather than rejected. An offset or GMT marker in the input is honoured and converted to the account time zone.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/dateparse/',
        params: [
            {
                name: 'dateString',
                description:
                    'A date or timestamp string, or an existing date value; anything the parser cannot read aborts the page',
                type: 'string|date',
            },
            {
                name: 'useUtc',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'If true, return the instant in UTC; otherwise in the account time zone. Accepts 1/0, true/false, or those spellings quoted, and is not validated',
                type: 'string|boolean|number',
                optional: true,
                default: false,
            },
        ],
        returnType: 'date',
        returnDescription:
            'A real date value the other date functions accept directly. Rendered on its own it prints as a US short date followed by a 12-hour clock with an AM/PM suffix.',
        syntax: 'DateParse(dateString[, useUtc])',
        example: "%%=DateParse('2026-01-15T08:30:00', 1)=%%",
    },
    {
        name: 'DatePart',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-date-part.html',
        guideUrl: 'https://ampscript.guide/datepart/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Date and Time',
        description:
            'Extracts one component from a date. The hour is reported on a 12-hour clock with no AM/PM indicator, so 19:35 yields 7 and any time at midnight — including a date with no time part at all — yields 12. Month and day come back zero-padded to two digits while hour and minute do not.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/datepart/',
        params: [
            {
                name: 'dateString',
                description:
                    'A real date value or a parseable date string; an unreadable or empty value aborts the page',
                type: 'string|date',
            },
            {
                name: 'datePart',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The component to extract, case-insensitive. Any other value aborts the page',
                type: 'string',
                enum: [
                    'year',
                    'Y',
                    'month',
                    'M',
                    'monthName',
                    'day',
                    'D',
                    'hour',
                    'H',
                    'minute',
                    'MI',
                ],
            },
        ],
        returnType: 'string',
        returnDescription:
            'The requested component as text — a zero-padded two-digit month or day, an unpadded hour or minute, a four-digit year, or the full English month name. Numeric components still feed the math functions directly.',
        syntax: 'DatePart(dateString, datePart)',
        example: "%%=DatePart('2026-01-15', 'Y')=%%",
    },
    {
        name: 'DecryptSymmetric',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-decrypt-symmetric.html',
        guideUrl: 'https://ampscript.guide/decryptsymmetric/',
        minArgs: 8,
        maxArgs: 8,
        category: 'Encryption and Encoding',
        isConfirmed: true,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/decryptsymmetric/',
        description:
            'Decrypts a Base64 ciphertext produced by EncryptSymmetric, using the same algorithm, passphrase, salt and initialization vector.',
        params: [
            {
                name: 'encryptedValue',
                description: 'Base64 ciphertext to decrypt',
                type: 'string',
            },
            {
                name: 'algorithm',
                description:
                    'Cipher name, optionally followed by semicolon-separated mode and padding settings; must match the settings used to encrypt, and an unrecognised name aborts the page',
                type: 'string',
                enum: ['aes', 'des', 'tripledes'],
            },
            {
                name: 'passwordExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key for the password',
                type: 'string',
            },
            {
                name: 'password',
                mcnSince: null,
                mcnNotes: null,
                description: 'Password value or empty to use external key',
                type: 'string',
            },
            { name: 'saltExternalKey', description: 'External key for the salt', type: 'string' },
            {
                name: 'salt',
                mcnSince: null,
                mcnNotes: null,
                description: 'Salt value or empty to use external key',
                type: 'string',
            },
            {
                name: 'ivExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key for the initialization vector',
                type: 'string',
            },
            { name: 'iv', description: 'IV value or empty to use external key', type: 'string' },
        ],
        returnType: 'string',
        returnDescription: 'The decrypted plain-text value.',
        syntax: 'DecryptSymmetric(encryptedValue, algorithm, passwordExternalKey, password, saltExternalKey, salt, ivExternalKey, iv)',
        example:
            "%%=DecryptSymmetric(@encrypted, 'aes', 'pwKey', '', 'saltKey', '', 'ivKey', '')=%%",
    },
    {
        name: 'DeleteData',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-delete-data.html',
        guideUrl: 'https://ampscript.guide/deletedata/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/deletedata/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Deletes rows from a data extension matching the specified key column criteria.',
        params: [
            {
                name: 'dataExt',
                description:
                    'The name of the data extension that contains the data you want to delete',
                type: 'string',
            },
            {
                name: 'columnName1',
                description: 'The name of the column to search for the data you want to delete',
                type: 'string',
            },
            {
                name: 'valueToDelete1',
                description: 'The value that determines which row to delete',
            },
            {
                name: 'columnNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column name',
                type: 'string',
                optional: true,
            },
            { name: 'valueToDeleteN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows deleted.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'DeleteData(dataExt, columnName1, valueToDelete1[, columnNameN, valueToDeleteN, ...])',
        example: "%%=DeleteData('Subscribers', 'SubscriberKey', _subscriberkey)=%%",
    },
    {
        name: 'DeleteDE',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-delete-de.html',
        guideUrl: 'https://ampscript.guide/deletede/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/deletede/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: INF,
        category: 'Data Extension',
        description: 'Deletes rows from a data extension. Email-context variant of DeleteData.',
        params: [
            {
                name: 'dataExt',
                description:
                    'The name of the data extension that contains the data you want to delete',
                type: 'string',
            },
            {
                name: 'columnName1',
                description: 'The name of the column to search for the data you want to delete',
                type: 'string',
            },
            {
                name: 'valueToDelete1',
                description: 'The value that determines which row to delete',
            },
            {
                name: 'columnNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column name',
                type: 'string',
                optional: true,
            },
            { name: 'valueToDeleteN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows deleted.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'DeleteDE(dataExt, columnName1, valueToDelete1[, columnNameN, valueToDeleteN, ...])',
        example: "%%=DeleteDE('Subscribers', 'SubscriberKey', _subscriberkey)=%%",
    },
    {
        name: 'DescribeMSCRMEntities',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-describe-entities.html',
        guideUrl: 'https://ampscript.guide/describemscrmentities/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Microsoft Dynamics CRM',
        description: 'Returns a rowset describing all available Dynamics CRM entity types.',
        params: [],
        returnType: 'rowset',
        returnDescription: 'A rowset describing the available Microsoft Dynamics CRM entities.',
        syntax: 'DescribeMSCRMEntities()',
        example: '%%[ SET @entities = DescribeMSCRMEntities() ]%%',
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'DescribeMSCRMEntityAttributes',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-describe-entity-attributes.html',
        guideUrl: 'https://ampscript.guide/describemscrmentityattributes/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Microsoft Dynamics CRM',
        description: 'Returns a rowset of attributes for the specified CRM entity type.',
        params: [{ name: 'entityType', description: 'CRM entity type name', type: 'string' }],
        returnType: 'rowset',
        returnDescription: 'A rowset describing the attributes of the requested CRM entity.',
        syntax: 'DescribeMSCRMEntityAttributes(entityType)',
        example: "%%[ SET @attrs = DescribeMSCRMEntityAttributes('contact') ]%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'Divide',
        mcnSince: 67,
        handlebarsEquivalent: 'divide',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-math/mc-ampscript-reference-math-divide.html',
        guideUrl: 'https://ampscript.guide/divide/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/divide/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Math',
        description: 'Divides the first number by the second.',
        params: [
            { name: 'dividend', description: 'Number to divide', type: 'string|number' },
            { name: 'divisor', description: 'Number to divide by', type: 'string|number' },
        ],
        returnType: 'number',
        returnDescription:
            'The quotient of the two operands. A zero divisor does not raise an error: a non-zero dividend yields the infinity symbol and a zero dividend yields NaN, so guard against a zero divisor before rendering the result.',
        syntax: 'Divide(dividend, divisor)',
        example: '%%=Divide(100, 4)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'Domain',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-domain.html',
        guideUrl: 'https://ampscript.guide/domain/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/domain/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Utility',
        description:
            'Returns everything after the first at sign, without validating the address or the domain. A value with no at sign, an empty string and a number all return an empty string.',
        params: [
            {
                name: 'emailAddress',
                description: 'Email address; the text after the first at sign is returned verbatim',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The text following the first at sign, preserving the original case and any further at signs. Empty when the value contains no at sign or nothing follows it.',
        syntax: 'Domain(emailAddress)',
        example: "%%=Domain('user@example.com')=%%",
    },
    {
        name: 'Empty',
        mcnSince: 67,
        handlebarsEquivalent: 'isEmpty',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-empty.html',
        guideUrl: 'https://ampscript.guide/empty/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/empty/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Returns true when the value is an empty string, an unset variable, or an undeclared variable. Whitespace, the number 0, the string "0" and the string "false" are all treated as present.',
        params: [
            {
                name: 'value',
                description:
                    'Value to test; a variable, literal, attribute or nested function call is accepted',
                type: 'string|number|boolean|date',
            },
        ],
        returnType: 'boolean',
        returnDescription: 'True when the value is empty or missing, otherwise false.',
        returnEnum: [true, false],
        isConfirmed: true,
        syntax: 'Empty(value)',
        example: '%%=Empty(@myVar)=%%',
    },
    {
        name: 'EncryptSymmetric',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-encrypt-symmetric.html',
        guideUrl: 'https://ampscript.guide/encryptsymmetric/',
        minArgs: 8,
        maxArgs: 8,
        category: 'Encryption and Encoding',
        isConfirmed: true,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/encryptsymmetric/',
        description:
            'Encrypts a value using symmetric key encryption and returns the ciphertext as Base64. The result is deterministic: the same inputs produce the same ciphertext on every call.',
        params: [
            { name: 'value', description: 'Value to encrypt', type: 'string' },
            {
                name: 'algorithm',
                description:
                    'Cipher name, optionally followed by semicolon-separated mode and padding settings such as des;mode=ecb;padding=zeros; an unrecognised name aborts the page',
                type: 'string',
                enum: ['aes', 'des', 'tripledes'],
            },
            {
                name: 'passwordExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key for the password',
                type: 'string',
            },
            {
                name: 'password',
                mcnSince: null,
                mcnNotes: null,
                description: 'Password value or empty to use external key',
                type: 'string',
            },
            { name: 'saltExternalKey', description: 'External key for the salt', type: 'string' },
            {
                name: 'salt',
                mcnSince: null,
                mcnNotes: null,
                description: 'Salt value or empty to use external key',
                type: 'string',
            },
            {
                name: 'ivExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key for the initialization vector',
                type: 'string',
            },
            { name: 'iv', description: 'IV value or empty to use external key', type: 'string' },
        ],
        returnType: 'string',
        returnDescription: 'The ciphertext, Base64-encoded.',
        syntax: 'EncryptSymmetric(value, algorithm, passwordExternalKey, password, saltExternalKey, salt, ivExternalKey, iv)',
        example: "%%=EncryptSymmetric('secret', 'aes', 'pwKey', '', 'saltKey', '', 'ivKey', '')=%%",
    },
    {
        name: 'EndImpressionRegion',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-end-impression-region.html',
        guideUrl: 'https://ampscript.guide/endimpressionregion/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/endimpressionregion/',
        minArgs: 0,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Content',
        description: 'Marks the end of an impression tracking region.',
        params: [
            {
                name: 'endAllRegions',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Whether to end all open impression regions. A truthy value ends every open region; the default ends only the most recent one.',
                type: 'string|boolean|number',
                optional: true,
            },
        ],
        returnType: 'void',
        returnDescription: 'No value is returned; it marks the end of an impression region.',
        syntax: 'EndImpressionRegion([endAllRegions])',
        example: 'EndImpressionRegion(0)',
    },
    {
        name: 'EndSmsConversation',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-end-sms-conversation.html',
        guideUrl: 'https://ampscript.guide/endsmsconversation/',
        minArgs: 2,
        maxArgs: 2,
        category: 'MobileConnect',
        description:
            'Ends an active SMS conversation with a contact from within a MobileConnect message. Returns true when the conversation is ended inside a MobileConnect message context, and false in any other context (for example a CloudPage or email). The success path cannot be exercised outside a live MobileConnect send.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Runtime-observed on cred/DEV (MID 510007949), the only BU available (no parent-BU escalation). This is an ordinary function call, so it compiles and runs on a CloudPage: called there with a real short code and the authorized destination number, it returned the literal boolean false (Empty() false) and the page rendered fully with no exception — no SMS was sent and no conversation state changed. This confirms the ampscript.guide claim that the function returns false outside a MobileConnect message context; the official Salesforce reference omits this and describes only the in-context behaviour (true on success, exception on failure). The success path (true, real conversation end) requires a live MobileConnect message context that cannot be captured on this tenant, so the function is recorded blocked for the success path while the CloudPage false-return is proven. The catalogued signature was corrected here: the two parameters are originationNumber and destinationNumber, and the return is a boolean, not void.',
        params: [
            {
                name: 'originationNumber',
                description: 'The MobileConnect short code or long code used to send',
                type: 'string',
            },
            {
                name: 'destinationNumber',
                description: "The contact's phone number, including country code",
                type: 'string',
            },
        ],
        returnType: 'boolean',
        returnDescription:
            'true when the conversation is ended inside a MobileConnect message context; false in any other context (proven on a CloudPage). Fails with an exception in-context if unsuccessful.',
        syntax: 'EndSmsConversation(originationNumber, destinationNumber)',
        example: '%%=EndSmsConversation("12345", MOBILE_NUMBER)=%%',
    },
    {
        name: 'ExecuteFilter',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-execute-filter.html',
        guideUrl: 'https://ampscript.guide/executefilter/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/executefilter/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 1,
        maxArgs: 1,
        category: 'Data Extension',
        description: 'Executes a predefined data filter and returns the resulting rowset.',
        params: [
            {
                name: 'dataFilterExternalId',
                description:
                    'The external ID of the data filter to execute. This function only works with data filters that are based on data extensions',
                type: 'string',
            },
        ],
        returnType: 'rowset',
        returnDescription: 'A rowset containing the rows that match the data filter.',
        syntax: 'ExecuteFilter(dataFilterExternalId)',
        example: "%%[ SET @rows = ExecuteFilter('FilterExternalKey') ]%%",
    },
    {
        name: 'ExecuteFilterOrderedRows',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-execute-filter-ordered-rows.html',
        guideUrl: 'https://ampscript.guide/executefilterorderedrows/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/executefilterorderedrows/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: 3,
        category: 'Data Extension',
        description: 'Executes a predefined data filter and returns results sorted by a column.',
        params: [
            {
                name: 'dataFilterExternalId',
                description:
                    'The external ID of the data filter to execute. This function only works with data filters that are based on data extensions',
                type: 'string',
            },
            {
                name: 'numRows',
                description:
                    'The number of rows to return in the rowset. A value of 0 returns all results. There is no maximum number of rows that can be returned',
                type: 'number',
            },
            {
                name: 'sortColumn',
                description:
                    'The column to sort data by, followed by a space and either "ASC" (for ascending order) or "DESC" (descending)',
                type: 'string',
            },
        ],
        returnType: 'rowset',
        returnDescription: 'A sorted, row-limited rowset of rows that match the data filter.',
        syntax: 'ExecuteFilterOrderedRows(dataFilterExternalId, numRows, sortColumn)',
        example:
            "%%[ SET @rows = ExecuteFilterOrderedRows('FilterExternalKey', 10, 'LastName ASC') ]%%",
    },
    {
        name: 'Field',
        mcnSince: 67,
        handlebarsEquivalent: 'get',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-field.html',
        guideUrl: 'https://ampscript.guide/field/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/field/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 2,
        maxArgs: 3,
        category: 'Data Extension',
        description:
            'Retrieves the value of a named field from a rowset row. The two-argument form aborts the page when the column is absent; pass the optional third argument as 0 (or false) to get an empty string for a possibly-missing column instead.',
        params: [
            { name: 'row', description: 'Row object from a rowset', type: 'row' },
            { name: 'fieldName', description: 'Column name to retrieve', type: 'string' },
            {
                name: 'exceptionIfNotFound',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "If true, the function returns an exception if the specified field doesn't exist. If false, the function returns an empty string if the field doesn't exist. The default value is true.",
                type: 'boolean',
                optional: true,
                default: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The value of the named field from the supplied row.',
        syntax: 'Field(row, fieldName[, exceptionIfNotFound])',
        example: "%%=Field(Row(@rows, 1), 'Name')=%%",
    },
    {
        name: 'Format',
        mcnSince: 67,
        handlebarsEquivalent: 'format',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-format.html',
        guideUrl: 'https://ampscript.guide/format/',
        minArgs: 2,
        maxArgs: 4,
        category: 'Utility',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Proven on the child BU MCDEV_Training_QA (MID 518005426). The official reference names two possible values for the third parameter, Date and Number, but at runtime only Date is usable. Passing the literal Number aborts the page with HTTP 422 and discards all output, whether or not a locale follows it — Format(1234.555, "C2", "Number") and Format(1234.555, "C2", "Number", "de-DE") both aborted, exactly like the invented value Banana. Date works in any capitalisation, and the empty string works and still allows a locale in the fourth parameter, so Format(1234.555, "C2", "", "de-DE") is the way to format a localised number. Number formatting also happens correctly with the third parameter omitted entirely, so the documented value is not merely optional, it is unusable.',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/format/',
        description:
            'Formats a number, a date or a string with a .NET format pattern. The third parameter only accepts Date or the empty string; the documented value Number aborts the page.',
        params: [
            {
                name: 'value',
                description:
                    'The value to format; a number, a numeric string, a date value or a parseable date string',
                type: 'string|number|date',
            },
            {
                name: 'formatString',
                description:
                    'Standard or custom .NET format pattern; an unusable pattern is echoed back instead of failing',
                type: 'string',
            },
            {
                name: 'dataFormat',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Only Date, in any capitalisation, or the empty string; any other value including the documented Number aborts the page',
                type: 'string',
                optional: true,
            },
            {
                name: 'cultureCode',
                description:
                    'The locale for separators, symbols and month and day names, written with either a hyphen or an underscore',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The formatted value, or an unformatted echo of the input or of the pattern when the pattern does not suit the input.',
        syntax: 'Format(value, formatString[, dataFormat, cultureCode])',
        example: '%%=Format("2026-03-04 13:52:07", "yyyy-MM-dd HH:mm:ss", "Date")=%%',
    },
    {
        name: 'FormatCurrency',
        mcnSince: 67,
        handlebarsEquivalent: 'formatCurrency',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-formatCurrency.html',
        guideUrl: 'https://ampscript.guide/formatcurrency/',
        minArgs: 2,
        maxArgs: 4,
        category: 'Utility',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/formatcurrency/',
        description:
            'Formats a number as a currency amount for a locale, choosing the symbol, the separators and the symbol position from that locale. Rounding is half-up.',
        params: [
            {
                name: 'value',
                description:
                    'The amount to format, as a number or as a numeric string; a string may carry thousands separators',
                type: 'string|number',
            },
            {
                name: 'locale',
                description:
                    'The locale that supplies the symbol, the separators and the symbol position, written with either a hyphen or an underscore; a language-only code works and an unknown code falls back to a generic currency sign',
                type: 'string',
            },
            {
                name: 'decimalPlaces',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Number of decimal places; without it the locale decides, which is zero places for currencies that have no minor unit',
                type: 'string|number',
                optional: true,
                default: 2,
            },
            {
                name: 'symbol',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "Replaces the locale's currency symbol while keeping the locale's separators and symbol position; requires decimalPlaces to be supplied as well",
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The amount formatted as a currency string for the requested locale.',
        syntax: 'FormatCurrency(value, locale[, decimalPlaces, symbol])',
        example: "%%=FormatCurrency(1234.555, 'en-US')=%%",
    },
    {
        name: 'FormatDate',
        mcnSince: 67,
        handlebarsEquivalent: 'format',
        handlebarsExact: false,
        mcnNotes:
            'In MCN, uses Java SimpleDateFormat format strings instead of .NET. Omitting dateFormat returns the G standard format (e.g. "5/15/2026 1:23:45 PM").',
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-format-date.html',
        guideUrl: 'https://ampscript.guide/formatdate/',
        minArgs: 1,
        maxArgs: 4,
        category: 'Date and Time',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Proven on the child BU MCDEV_Training_QA (MID 518005426). The official reference presents one .NET-style custom-pattern table and shows it applied to the dateFormat argument, but at runtime the two format arguments use SEPARATE, case-INSENSITIVE token sets. In dateFormat, mm and MM both render the MONTH, so the documented pattern yyyy-MM-dd HH:mm:ss returned 2026-03-04 13:03:07 for the instant 2026-03-04 13:52:07 — the minutes position printed 03, the month. The same pattern moved to timeFormat returned 13:52:07 correctly, because there mm and MM mean minutes. Single-letter tokens also disagree with the doc: d rendered the whole short date 3/4/2026 rather than the day number, M rendered March 4 rather than 3, and h or H alone in timeFormat aborts the page with HTTP 422 instead of rendering an hour. The day-name tokens are off by one repetition — dddd rendered Wed where the doc promises Wednesday, ddddd rendered Wednesday, and ddd rendered the corrupted string We4ne74a26 in which digits from the date replaced letters of the day name.',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/formatdate/',
        description:
            'Formats a date according to a date pattern, a time pattern and a locale. The two pattern arguments use separate, case-insensitive token sets: in the date pattern mm means month, and minutes are only reachable from the time pattern.',
        params: [
            {
                name: 'dateString',
                description:
                    'The date to format, either a real date value or a parseable date string',
                type: 'string|date',
            },
            {
                name: 'dateFormat',
                mcnSince: 67,
                mcnNotes: null,
                description:
                    'The date pattern, or a single-letter standard format such as D, G or s. Case-insensitive, and mm here means month, not minutes',
                type: 'string',
                optional: true,
            },
            {
                name: 'timeFormat',
                description:
                    'The time pattern. Case-insensitive, and this is the only argument in which mm means minutes',
                type: 'string',
                optional: true,
            },
            {
                name: 'localeCode',
                description:
                    'The locale for month and day names and for the standard formats, written with either a hyphen or an underscore',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The formatted date, or an empty string when the first argument cannot be parsed as a date.',
        syntax: 'FormatDate(dateString[, dateFormat, timeFormat, localeCode])',
        example: '%%=FormatDate(Now(), "dddd, MMMM d yyyy", "HH:mm:ss")=%%',
    },
    {
        name: 'FormatNumber',
        mcnSince: 67,
        handlebarsEquivalent: 'formatNumber',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-formatNumber.html',
        guideUrl: 'https://ampscript.guide/formatnumber/',
        minArgs: 2,
        maxArgs: 3,
        category: 'Utility',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/formatnumber/',
        description:
            'Formats a number with a standard or custom .NET numeric pattern, optionally for a locale. Rounding is half-up.',
        params: [
            {
                name: 'number',
                description:
                    'The value to format, as a number or as a numeric string; a string may carry thousands separators',
                type: 'string|number',
            },
            {
                name: 'format',
                description:
                    'Standard pattern letter with an optional precision digit, such as N2 or C0, or a custom pattern; an unrecognised pattern is echoed back',
                type: 'string',
            },
            {
                name: 'locale',
                description:
                    'The locale that supplies separators and the currency symbol, written with either a hyphen or an underscore; an unknown code falls back rather than failing',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The number formatted according to the supplied pattern.',
        syntax: 'FormatNumber(number, format[, locale])',
        example: "%%=FormatNumber(1234.555, 'N2', 'de-DE')=%%",
    },
    {
        name: 'GetJWT',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-get-jwt.html',
        guideUrl: 'https://ampscript.guide/getjwt/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Encryption and Encoding',
        description:
            'Generates a JSON Web Token signed with the supplied inline secret. The payload is passed through verbatim and is only Base64url-encoded, never encrypted.',
        params: [
            {
                name: 'secret',
                description:
                    'Secret used to sign the token; the empty string aborts the page rather than signing with an empty key',
                type: 'string',
            },
            {
                name: 'algorithm',
                description:
                    'HMAC algorithm name, matched case-insensitively; an unknown name aborts the page',
                type: 'string',
                enum: ['HS256', 'HS384', 'HS512'],
            },
            {
                name: 'jsonPayload',
                description:
                    'Payload to encode. It is copied into the token untouched and is not validated as JSON, so a non-JSON string is signed just as readily.',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The token as three Base64url segments joined by dots, with no padding. The same arguments always produce the same token.',
        isConfirmed: true,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/getjwt/',
        syntax: 'GetJWT(secret, algorithm, jsonPayload)',
        example: "%%=GetJWT(@secret, 'HS256', @payload)=%%",
    },
    {
        name: 'GetJWTByKeyName',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-get-jwt-by-key-name.html',
        guideUrl: 'https://ampscript.guide/getjwtbykeyname/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Encryption and Encoding',
        description: 'Generates a JSON Web Token using a named encryption key from Key Management.',
        params: [
            { name: 'keyName', description: 'Key Management key external key', type: 'string' },
            {
                name: 'algorithm',
                description: 'Signing algorithm',
                type: 'string',
                enum: ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'],
            },
            {
                name: 'jsonPayload',
                description:
                    "The payload of the JWT. Typically, the payload is a JSON object with name-value pairs. The JWT payload isn't encrypted.",
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription: 'A signed JSON Web Token string created with the named key.',
        isConfirmed: true,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/getjwtbykeyname/',
        syntax: 'GetJWTByKeyName(keyName, algorithm, jsonPayload)',
        example: "%%=GetJWTByKeyName('MyKeyName', 'HS256', @payload)=%%",
    },
    {
        name: 'GetPortfolioItem',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-get-portfolio-item.html',
        guideUrl: 'https://ampscript.guide/getportfolioitem/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Content',
        description: 'Retrieves metadata for a classic portfolio item.',
        params: [
            {
                name: 'itemExternalKey',
                description: 'External key of the portfolio item',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription: 'The content of the requested Portfolio item.',
        syntax: 'GetPortfolioItem(itemExternalKey)',
        example: "%%=GetPortfolioItem('my-portfolio-key')=%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        officialDocsNote:
            'Classic Portfolio is retired on this tenant, so no Portfolio item exists to retrieve. A reached call with an external key that does not resolve aborted the page with HTTP 422 and no partial output, on both the child QA BU (MID 518005426) and the parent BU (MID 7281698); the same call gated behind an unmatched query-string branch left the page at HTTP 200, confirming a runtime abort of the reached call. No valid key could be sourced because Portfolio asset creation and applications were retired, so the documented success path could not be exercised here.',
    },
    {
        name: 'GetPublishedSocialContent',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-social/mc-ampscript-reference-social-get-published-social-content.html',
        guideUrl: 'https://ampscript.guide/getpublishedsocialcontent/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Social',
        description: 'Retrieves published social media content by its identifier.',
        params: [
            { name: 'socialContentId', description: 'Social content ID', type: 'string|number' },
        ],
        returnType: 'string',
        returnDescription: 'The published social content for the supplied identifier.',
        syntax: 'GetPublishedSocialContent(socialContentId)',
        example: "%%=GetPublishedSocialContent('socialContentId')=%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        officialDocsNote:
            'The community guide flags this as usable only inside Microsites and Landing Pages and only for content regions built in Classic Content, which is retired on this tenant. A reached call aborted the page with HTTP 422 and no partial output for both a string region name and a numeric region id, on the child QA BU (MID 518005426) and again on the parent BU (MID 7281698). The same call gated behind an unmatched query-string branch left the page at HTTP 200, confirming a runtime abort of the reached call rather than a compile-time failure. No Classic Content region exists here to source a resolvable identifier, so the documented success path could not be exercised.',
    },
    {
        name: 'GetSendTime',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-get-send-time.html',
        guideUrl: 'https://ampscript.guide/getsendtime/',
        minArgs: 0,
        maxArgs: 1,
        category: 'Date and Time',
        description:
            'Returns a send timestamp: by default the time the send completed for the individual subscriber, or with a true argument the job start or publish time. Outside a send context, such as on a CloudPage, it returns the current system time instead of a send time, in every argument spelling.',
        params: [
            {
                name: 'boolAllSubscribers',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'If true, return the job start or publish time instead of the individual subscriber send-completed time; outside a send context it makes no difference. Accepts 1/0, true/false, or those spellings quoted, and is not validated',
                type: 'string|boolean|number',
                optional: true,
            },
        ],
        returnType: 'date',
        returnDescription:
            'A real date value the other date functions accept directly, in the same system time zone as Now().',
        syntax: 'GetSendTime([boolAllSubscribers])',
        example: '%%=GetSendTime(1)=%%',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'needs-auth-context',
        differsFromOfficialDocs: false,
        officialDocsNote:
            'Send-context semantics could not be proven: a CloudPage GET has no send, so both documented paths collapse. Probed on the child BU MCDEV_Training_QA (MID 518005426), one deploy and eight gated fetches. GetSendTime() rendered 8/8/2026 7:35:16 PM against Now()=8/8/2026 7:35:16 PM in the same render, with FormatDate(..., "ffffff") giving 507042 for both, so the two are the same instant to the microsecond rather than merely the same second. Every argument spelling (1, 0, true, false, "1", "0", "true", "false", and the non-flag word spring) was accepted at HTTP 200 and returned that same current time, and DateDiff(GetSendTime(1), Now(), "MI") was 0. What IS proven on a CloudPage: the value is a real date (FormatDate gave 2026-08-08, DatePart gave 2026 and 7, DateAdd of three hours advanced it, DateDiff measured that gap as 3), it renders as a US short date plus a 12-hour clock (Length 19 for that instant), Empty() over it is False, it sits on the system side of the clock (DateDiff to SystemDateToLocalDate was 480 minutes, identical to the same measurement over Now()), arity 0 and 1 both work and arity 2 aborts the page with HTTP 422. What is NOT proven and needs a real list, data extension, triggered or journey send: the individual subscriber send-completed time, the job start time, the job publish time and the STO-optimized time.',
    },
    {
        name: 'GetSocialPublishURL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-social/mc-ampscript-reference-social-get-social-publish-url.html',
        guideUrl: 'https://ampscript.guide/getsocialpublishurl/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/getsocialpublishurl/',
        minArgs: 2,
        maxArgs: INF,
        category: 'Social',
        isConfirmed: true,
        description:
            'Returns HTML for sharing a content region on a supported social network via Social Forward. Optionally accepts repeating key/value parameter pairs.',
        params: [
            {
                name: 'socialNetworkCode',
                description: 'The number code of the social network to share to',
                type: 'string|number',
            },
            {
                name: 'contentRegion',
                description: 'The name of the content region to share on the social network',
                type: 'string',
            },
            {
                name: 'socialNetworkParamKey1',
                description: 'The key of a parameter to pass to the target social network',
                type: 'string',
                optional: true,
            },
            {
                name: 'socialNetworkParamValue1',
                description: 'The value of a parameter to pass to the target social network',
                type: 'string',
                optional: true,
            },
            {
                name: 'socialNetworkParamKeyN',
                description: 'Additional parameter key',
                type: 'string',
                optional: true,
            },
            {
                name: 'socialNetworkParamValueN',
                description: 'Additional parameter value',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'HTML that publishes the social-forward content for the region.',
        repeat: [{ startIndex: 2, groupSize: 2, minGroups: 0 }],
        syntax: 'GetSocialPublishURL(socialNetworkCode, contentRegion[, socialNetworkParamKey1, socialNetworkParamValue1, ...])',
        example: "%%=GetSocialPublishURL(1, 'Shared content region 1')=%%",
    },
    {
        name: 'GetSocialPublishURLByName',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-social/mc-ampscript-reference-social-get-social-publish-url-by-name.html',
        guideUrl: 'https://ampscript.guide/getsocialpublishurlbyname/',
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/getsocialpublishurlbyname/',
        minArgs: 3,
        maxArgs: INF,
        category: 'Social',
        isConfirmed: true,
        description:
            'Returns HTML for sharing a content region on a supported social network (identified by name) via Social Forward. Optionally accepts repeating key/value parameter pairs.',
        params: [
            {
                name: 'socialNetworkName',
                description: 'The name of the social network to share to',
                type: 'string',
            },
            { name: 'countryCode', description: 'An ISO country code', type: 'string' },
            {
                name: 'contentRegion',
                description: 'The name of the content region to share on the social network',
                type: 'string',
            },
            {
                name: 'socialNetworkParamKey1',
                description: 'The key of a parameter to pass to the target social network',
                type: 'string',
                optional: true,
            },
            {
                name: 'socialNetworkParamValue1',
                description: 'The value of a parameter to pass to the target social network',
                type: 'string',
                optional: true,
            },
            {
                name: 'socialNetworkParamKeyN',
                description: 'Additional parameter key',
                type: 'string',
                optional: true,
            },
            {
                name: 'socialNetworkParamValueN',
                description: 'Additional parameter value',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'HTML that publishes the social-forward content for the named region.',
        repeat: [{ startIndex: 3, groupSize: 2, minGroups: 0 }],
        syntax: 'GetSocialPublishURLByName(socialNetworkName, countryCode, contentRegion[, socialNetworkParamKey1, socialNetworkParamValue1, ...])',
        example: "%%=GetSocialPublishURLByName('Facebook', 'US', 'Shared content region 1')=%%",
    },
    {
        name: 'GUID',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-guid.html',
        guideUrl: 'https://ampscript.guide/guid/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/guid/',
        minArgs: 0,
        maxArgs: 0,
        category: 'Utility',
        description:
            'Generates a new globally unique identifier. Every call returns a different value, so store the result in a variable when the same identifier is needed twice.',
        params: [],
        returnType: 'string',
        returnDescription:
            'A 36-character lowercase identifier in the eight-four-four-four-twelve hyphenated form, without surrounding braces.',
        syntax: 'GUID()',
        example: '%%=GUID()=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'HTTPGet',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        isConfirmed: true,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-get.html',
        guideUrl: 'https://ampscript.guide/httpget/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/httpget/',
        minArgs: 1,
        maxArgs: 4,
        category: 'HTTP',
        description: 'Performs an HTTP GET request and returns the response body.',
        params: [
            {
                name: 'httpGetUrl',
                description: 'The URL to perform the HTTP GET operation on',
                type: 'string',
            },
            {
                name: 'continueOnError',
                mcnSince: null,
                mcnNotes: null,
                description: 'If true, ignore errors encountered during the GET operation',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'emptyContentHandling',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'How empty content is handled: 0 allows empty content, 1 returns an error, 2 skips the subscriber in a send',
                type: 'number',
                optional: true,
            },
            {
                name: 'status',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Output variable that receives the function status: 0 success, -1 not found, -2 HTTP request error, -3 empty content',
                type: 'number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The body of the HTTP response as a string.',
        syntax: 'HTTPGet(httpGetUrl[, continueOnError, emptyContentHandling, status])',
        example: "%%=HTTPGet('https://example.com/api')=%%",
    },
    {
        name: 'HTTPPost',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-post.html',
        guideUrl: 'https://ampscript.guide/httppost/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/httppost/',
        minArgs: 3,
        maxArgs: INF,
        category: 'HTTP',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference labels the fourth argument as an output parameter holding the "status" of the request, but on a live Engagement CloudPage (child MID 518005426) that variable receives the response BODY, not the status. The HTTP status code is the function return value. A non-2xx response (proven with a 404) and an empty URL both abort the whole page rather than returning the status, so a failing status can never be read from the return value.',
        description:
            'Performs an HTTP POST request and returns the HTTP status code. The response body is written to the optional output variable.',
        params: [
            {
                name: 'urlEndpoint',
                description: 'The URL to post the specified content to',
                type: 'string',
            },
            {
                name: 'contentTypeHeader',
                description: 'The content-type header to use in the POST request',
                type: 'string',
            },
            {
                name: 'contentToPost',
                description: 'The content to send to the specified URL in the POST request',
                type: 'string',
            },
            {
                name: 'response',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable that receives the response body',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerName1',
                description: 'The name of an additional header to include in the request',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerValue1',
                description: 'The value of an additional header to include in the request',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerNameN',
                description: 'The name of a further additional header',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerValueN',
                description: 'The value of a further additional header',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'number',
        returnDescription: 'The HTTP status code of the POST request.',
        repeat: [{ startIndex: 4, groupSize: 2, minGroups: 0 }],
        syntax: 'HTTPPost(urlEndpoint, contentTypeHeader, contentToPost[, @response, headerName1, headerValue1, headerNameN, headerValueN, ...])',
        example:
            "%%=HTTPPost('https://example.com/api', 'application/json', @payload, @response)=%%",
    },
    {
        name: 'HTTPPost2',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-post2.html',
        guideUrl: 'https://ampscript.guide/httppost2/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/httppost2/',
        minArgs: 3,
        maxArgs: INF,
        category: 'HTTP',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference labels the fifth argument (response) as storing the "status" of the request, but on a live Engagement CloudPage (child MID 518005426) it receives the response BODY and the sixth argument (responseRowSet) receives the response HEADERS as a rowset (11 header rows observed). The HTTP status code is the function return value. The boolean exceptionOnError flag is accepted at position four.',
        description:
            'Performs an HTTP POST and returns the HTTP status code. The response body and the response headers (as a rowset) are written to optional output variables.',
        params: [
            { name: 'url', description: 'Request URL', type: 'string' },
            { name: 'contentType', description: 'Content-Type header', type: 'string' },
            { name: 'contentToPost', description: 'Request body', type: 'string' },
            {
                name: 'exceptionOnError',
                description:
                    'If `true`, raise an exception when the request fails; if `false`, continue after an error',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'response',
                description: 'Output variable for the response body',
                type: 'string',
                optional: true,
            },
            {
                name: 'responseRowSet',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the response headers, returned as a rowset',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerName1',
                description: 'First request header name',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerValue1',
                description: 'First request header value',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerNameN',
                description: 'Additional request header name',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerValueN',
                description: 'Additional request header value',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'number',
        returnDescription: 'The HTTP status code of the POST request.',
        repeat: [{ startIndex: 6, groupSize: 2, minGroups: 0 }],
        syntax: 'HTTPPost2(url, contentType, contentToPost[, exceptionOnError, @response, @responseRowSet, headerName1, headerValue1, headerNameN, headerValueN, ...])',
        example:
            "%%=HTTPPost2('https://example.com/api', 'application/json', @payload, true, @response, @responseRows)=%%",
    },
    {
        name: 'HTTPPostWithRetry',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-post-with-retry.html',
        guideUrl: 'https://ampscript.guide/httppostwithretry/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/httppostwithretry/',
        minArgs: 3,
        maxArgs: INF,
        category: 'HTTP',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference labels the responseStatus argument as storing the "status" of the request, but on a live Engagement CloudPage (child MID 518005426) it receives the response BODY and responseContentRowset receives the response HEADERS as a rowset (11 header rows observed). The HTTP status code is the function return value. The numRetries, reschedule and returnExceptionOnError arguments are all accepted at runtime; retry-on-failure is documented but was not forced here because a transient failure could not be induced safely against the echo endpoint.',
        description:
            'Posts content to the specified URL with automatic retry logic on failure, and returns the HTTP status code. Similar to HTTPPost2 but adds configurable retries and rescheduling; the response body and headers (as a rowset) are written to optional output variables.',
        params: [
            { name: 'urlEndpoint', description: 'The URL to send the content to', type: 'string' },
            {
                name: 'contentTypeHeader',
                description: 'The content-type header to use in the POST request',
                type: 'string',
            },
            {
                name: 'content',
                description: 'The content to send to the specified URL in the POST request',
                type: 'string',
            },
            {
                name: 'numRetries',
                description: 'The number of times the request can be retried',
                type: 'number',
                optional: true,
                default: 3,
            },
            {
                name: 'reschedule',
                description:
                    'Whether the request is rescheduled (retried after 15 minutes) if it still fails after all retries',
                type: 'boolean',
                optional: true,
                default: false,
            },
            {
                name: 'returnExceptionOnError',
                description:
                    'If true, raise an exception on error; if false, continue after an error',
                type: 'boolean',
                optional: true,
            },
            {
                name: 'responseStatus',
                description: 'An AMPscript variable that receives the response body',
                type: 'string',
                optional: true,
            },
            {
                name: 'responseContentRowset',
                description: 'An AMPscript variable that stores the response content as a rowset',
                type: 'rowset',
                optional: true,
            },
            {
                name: 'headerName1',
                description: 'The name of an additional header to include in the request',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerValue1',
                description: 'The value of an additional header to include in the request',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerNameN',
                description: 'The name of a further additional header',
                type: 'string',
                optional: true,
            },
            {
                name: 'headerValueN',
                description: 'The value of a further additional header',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'number',
        returnDescription: 'The HTTP status code of the POST request.',
        repeat: [{ startIndex: 8, groupSize: 2, minGroups: 0 }],
        syntax: 'HTTPPostWithRetry(urlEndpoint, contentTypeHeader, content[, numRetries, reschedule, returnExceptionOnError, @responseStatus, @responseContentRowset, headerName1, headerValue1, headerNameN, headerValueN, ...])',
        example: "%%=HTTPPostWithRetry('https://example.com/api', 'application/json', @payload)=%%",
    },
    {
        name: 'HTTPRequestHeader',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Runtime-verified on a live Marketing Cloud Engagement CloudPage (child BU MID 518005426). The official reference states this function can only retrieve the standard HTTP headers listed in RFC 7231, but at runtime it also returns the value of a non-standard custom request header: a request sent with an X-Amp-Probe header returned that exact value, so the RFC 7231 restriction is not enforced when reading headers. A header that is absent from the request (for example Referer when none was sent) returns the empty string, matching the documented note.',
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-request-header.html',
        guideUrl: 'https://ampscript.guide/httprequestheader/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/httprequestheader/',
        minArgs: 1,
        maxArgs: 1,
        category: 'HTTP',
        description:
            'Returns the value of a specified HTTP request header from the inbound request.',
        params: [
            {
                name: 'headerToRetrieve',
                description: 'The header that you want to retrieve',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription: 'The value of the named HTTP request header.',
        syntax: 'HTTPRequestHeader(headerToRetrieve)',
        example: "%%=HTTPRequestHeader('X-Forwarded-For')=%%",
    },
    {
        name: 'IIf',
        mcnSince: 67,
        handlebarsEquivalent: 'iif',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-iif.html',
        guideUrl: 'https://ampscript.guide/iif/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/iif/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Utility',
        description:
            'Returns one of two values based on a boolean expression (inline if). Only a real comparison or a boolean-returning function selects the true branch; a plain string or number always selects the false branch. Only the selected branch is evaluated, so a call that would abort the page is safe in the branch that is not taken.',
        params: [
            {
                name: 'expression',
                description:
                    'Boolean expression to evaluate; a non-boolean value always selects the false branch',
                type: 'boolean',
            },
            {
                name: 'trueValue',
                description: 'Value returned when true; evaluated only when true is selected',
                type: 'string|number|boolean|date',
            },
            {
                name: 'falseValue',
                description: 'Value returned when false; evaluated only when false is selected',
                type: 'string|number|boolean|date',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The second argument when the condition is true, otherwise the third argument.',
        isConfirmed: true,
        syntax: 'IIf(expression, trueValue, falseValue)',
        example: "%%=IIf(Empty(@name), 'Friend', @name)=%%",
    },
    {
        name: 'Image',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-image.html',
        guideUrl: 'https://ampscript.guide/image/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Content',
        description:
            'Returns an HTML img tag for the Portfolio image matching the specified external key.',
        params: [
            {
                name: 'imageExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key of an image in your Portfolio',
                type: 'string',
            },
            {
                name: 'defaultImageExternalKey',
                mcnSince: null,
                mcnNotes: null,
                description: 'External key of a fallback image used if the primary is not found',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'An HTML img tag for the referenced image.',
        syntax: 'Image(imageExternalKey[, defaultImageExternalKey])',
        example: "%%=Image('CorpLogo', 'DefaultImage')=%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The classic Portfolio / Classic Content area this function reads from was retired in April 2023, so no image assets exist for it to reference on any current tenant, and every invocation aborts the page at runtime. Use ContentImageByKey or ContentImageByID against Content Builder image assets instead.',
        officialDocsNote:
            'No working invocation was found on either the child QA BU (MID 518005426) or the parent BU (MID 7281698). Image resolves images from the legacy Portfolio, whose creation and applications have been retired; no Portfolio assets exist on either BU to reference. Every attempt aborted the CloudPage with HTTP 422 and no output: a literal URL, a Content Builder asset external key, and a plausible Portfolio-style key were all tried on the child BU, and a Portfolio-style key on the parent BU. Use ContentImageByKey or ContentImageByID against Content Builder image assets instead.',
    },
    {
        name: 'IndexOf',
        mcnSince: 67,
        handlebarsEquivalent: 'indexOf',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-index-of.html',
        guideUrl: 'https://ampscript.guide/indexof/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/indexof/',
        minArgs: 2,
        maxArgs: 3,
        category: 'String',
        description:
            'Returns the 1-based position of a substring, matching case-insensitively. An undocumented third argument selects which occurrence to locate.',
        params: [
            {
                name: 'sourceString',
                description: 'String to search in',
                type: 'string|number',
            },
            { name: 'substring', description: 'Substring to find', type: 'string|number' },
            {
                name: 'occurrence',
                description: 'Which occurrence to locate, as a whole number; defaults to the first',
                type: 'string|number',
            },
        ],
        returnType: 'number',
        returnDescription:
            'The 1-based position of the substring, or 0 when it is not found or the requested occurrence does not exist.',
        syntax: 'IndexOf(sourceString, substring[, occurrence])',
        example: "%%=IndexOf('Hello World', 'World')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'InsertData',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-insert-data.html',
        guideUrl: 'https://ampscript.guide/insertdata/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/insertdata/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: INF,
        category: 'Data Extension',
        description: 'Inserts a new row into a data extension.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension to insert data into',
                type: 'string',
            },
            {
                name: 'columnName1',
                description: 'The name of the column to insert into the data extension',
                type: 'string',
            },
            {
                name: 'valueToInsert1',
                description: 'The value to insert into the specified column',
            },
            {
                name: 'columnNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional column name',
                type: 'string',
                optional: true,
            },
            { name: 'valueToInsertN', description: 'Additional column value', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows inserted.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'InsertData(dataExt, columnName1, valueToInsert1[, columnNameN, valueToInsertN, ...])',
        example: "%%=InsertData('Log', 'SubscriberKey', _subscriberkey, 'Status', 'Sent')=%%",
    },
    {
        name: 'InsertDE',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-insert-de.html',
        guideUrl: 'https://ampscript.guide/insertde/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/insertde/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Inserts a new row into a data extension. Email-context variant of InsertData.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension to insert data into',
                type: 'string',
            },
            {
                name: 'columnName1',
                description: 'The name of the column to insert into the data extension',
                type: 'string',
            },
            {
                name: 'valueToInsert1',
                description: 'The value to insert into the specified column',
            },
            {
                name: 'columnNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional column name',
                type: 'string',
                optional: true,
            },
            { name: 'valueToInsertN', description: 'Additional column value', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows inserted.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'InsertDE(dataExt, columnName1, valueToInsert1[, columnNameN, valueToInsertN, ...])',
        example: "%%=InsertDE('Log', 'SubscriberKey', _subscriberkey, 'Status', 'Sent')=%%",
    },
    {
        name: 'InvokeCreate',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-invoke-create.html',
        guideUrl: 'https://ampscript.guide/invokecreate/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/invokecreate/',
        minArgs: 3,
        maxArgs: 4,
        category: 'Marketing Cloud API',
        description: 'Calls the SOAP API Create method on the given API object.',
        params: [
            { name: 'apiObject', description: 'API object to create', type: 'object' },
            {
                name: 'statusMessage',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting status message',
                type: 'string',
            },
            {
                name: 'errorCode',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting error code',
                type: 'string',
            },
            {
                name: 'createOptionsObject',
                mcnSince: null,
                mcnNotes: null,
                description: 'Optional CreateOptions API object',
                type: 'object',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            "The SOAP OverallStatus as a string — 'OK' on success, 'Error' on failure. The human-readable message goes to the statusMessage out-variable and the numeric error code to errorCode.",
        returnEnum: ['OK', 'Error'],
        syntax: 'InvokeCreate(apiObject, @statusMessage, @errorCode[, createOptionsObject])',
        example: '%%=InvokeCreate(@apiObject, @statusMessage, @errorCode)=%%',
        isConfirmed: true,
    },
    {
        name: 'InvokeDelete',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-invoke-delete.html',
        guideUrl: 'https://ampscript.guide/invokedelete/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/invokedelete/',
        minArgs: 3,
        maxArgs: 4,
        category: 'Marketing Cloud API',
        description: 'Calls the SOAP API Delete method on the given API object.',
        params: [
            { name: 'apiObject', description: 'API object to delete', type: 'object' },
            {
                name: 'statusMessage',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting status message',
                type: 'string',
            },
            {
                name: 'errorCode',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting error code',
                type: 'string',
            },
            {
                name: 'deleteOptionsObject',
                mcnSince: null,
                mcnNotes: null,
                description: 'Optional DeleteOptions API object',
                type: 'object',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            "The SOAP OverallStatus as a string — 'OK' on success, 'Error' on failure. The human-readable message goes to the statusMessage out-variable and the numeric error code to errorCode.",
        returnEnum: ['OK', 'Error'],
        syntax: 'InvokeDelete(apiObject, @statusMessage, @errorCode[, deleteOptionsObject])',
        example: '%%=InvokeDelete(@apiObject, @statusMessage, @errorCode)=%%',
        isConfirmed: true,
    },
    {
        name: 'InvokeExecute',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-invoke-execute.html',
        guideUrl: 'https://ampscript.guide/invokeexecute/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/invokeexecute/',
        minArgs: 1,
        maxArgs: 3,
        category: 'Marketing Cloud API',
        description:
            'Calls the SOAP API Execute method on the given API object and returns the API status code.',
        params: [
            { name: 'apiObject', description: 'The API object to execute', type: 'object' },
            {
                name: 'statusMessage',
                mcnSince: null,
                mcnNotes: null,
                description: 'An AMPscript variable that stores the API status message',
                type: 'string',
                optional: true,
            },
            {
                name: 'requestId',
                description: 'An AMPscript variable that stores the request ID',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'rowset',
        returnDescription:
            'A rowset containing the API Results. Use Row() and Field() to read each result — StatusCode, StatusMessage and ErrorCode. The optional @statusMessage out-variable receives the OverallStatus string and @requestId receives the RequestID GUID.',
        syntax: 'InvokeExecute(apiObject[, @statusMessage, @requestId])',
        example: '%%[ SET @rows = InvokeExecute(@apiObject, @statusMessage, @requestId) ]%%',
        isConfirmed: true,
    },
    {
        name: 'InvokePerform',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-invoke-perform.html',
        guideUrl: 'https://ampscript.guide/invokeperform/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/invokeperform/',
        minArgs: 2,
        maxArgs: 3,
        category: 'Marketing Cloud API',
        description: 'Calls the SOAP API Perform method on the given API object.',
        params: [
            { name: 'apiObject', description: 'API object to perform on', type: 'object' },
            {
                name: 'actionToPerform',
                description: 'Action to perform; valid values vary by object type',
                type: 'string',
            },
            {
                name: 'statusMessage',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting status message',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            "The SOAP OverallStatus as a string — 'OK' on success, 'Error' on failure. The human-readable message goes to the optional @statusMessage out-variable.",
        returnEnum: ['OK', 'Error'],
        syntax: 'InvokePerform(apiObject, actionToPerform[, @statusMessage])',
        example: "%%=InvokePerform(@apiObject, 'Start', @statusMessage)=%%",
        isConfirmed: true,
    },
    {
        name: 'InvokeRetrieve',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-invoke-retrieve.html',
        guideUrl: 'https://ampscript.guide/invokeretrieve/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/invokeretrieve/',
        minArgs: 1,
        maxArgs: 3,
        category: 'Marketing Cloud API',
        description: 'Calls the SOAP API Retrieve method and returns a rowset of results.',
        params: [
            {
                name: 'apiObject',
                description: 'API object defining the retrieve filter',
                type: 'object',
            },
            {
                name: 'statusMessage',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting status message',
                type: 'string',
                optional: true,
            },
            {
                name: 'requestId',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting RequestID',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'rowset',
        returnDescription: 'A rowset containing the retrieved API records.',
        syntax: 'InvokeRetrieve(apiObject[, @statusMessage, @requestId])',
        example: '%%[ SET @rows = InvokeRetrieve(@apiObject, @statusMessage, @requestId) ]%%',
        isConfirmed: true,
    },
    {
        name: 'InvokeUpdate',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-invoke-update.html',
        guideUrl: 'https://ampscript.guide/invokeupdate/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/invokeupdate/',
        minArgs: 1,
        maxArgs: 4,
        category: 'Marketing Cloud API',
        description: 'Calls the SOAP API Update method on the given API object.',
        params: [
            { name: 'apiObject', description: 'API object to update', type: 'object' },
            {
                name: 'statusMessage',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting status message',
                type: 'string',
                optional: true,
            },
            {
                name: 'errorCode',
                mcnSince: null,
                mcnNotes: null,
                description: 'Output variable for the resulting error code',
                type: 'string',
                optional: true,
            },
            {
                name: 'updateOptions',
                mcnSince: null,
                mcnNotes: null,
                description: 'Optional UpdateOptions API object',
                type: 'object',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            "The SOAP OverallStatus as a string — 'OK' on success, 'Error' on failure. The human-readable message goes to the statusMessage out-variable and the numeric error code to errorCode.",
        returnEnum: ['OK', 'Error'],
        syntax: 'InvokeUpdate(apiObject[, @statusMessage, @errorCode, updateOptions])',
        example: '%%=InvokeUpdate(@apiObject, @statusMessage, @errorCode)=%%',
        isConfirmed: true,
    },
    {
        name: 'IsCHTMLBrowser',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-is-chtml-browser.html',
        guideUrl: 'https://ampscript.guide/ischtmlbrowser/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/ischtmlbrowser/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Utility',
        description:
            'Tests a user agent string for a compact HTML (cHTML) feature-phone browser. Feature-phone agents such as i-mode and KDDI handsets are recognised; modern desktop and mobile agents are not.',
        params: [
            {
                name: 'userAgent',
                description:
                    'User agent string to test, typically HTTPRequestHeader("user-agent") on a CloudPage',
                type: 'string',
            },
        ],
        returnType: 'boolean',
        returnDescription: 'True when the user agent indicates a cHTML browser, otherwise false.',
        returnEnum: [true, false],
        syntax: 'IsCHTMLBrowser(userAgent)',
        example: '%%=IsCHTMLBrowser(@userAgent)=%%',
    },
    {
        name: 'IsEmailAddress',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-is-email-address.html',
        guideUrl: 'https://ampscript.guide/isemailaddress/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/isemailaddress/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference states that an address whose domain has no top-level domain is accepted, giving a call on a bare single-label domain as an example of a true result. On a live Engagement CloudPage on the child business unit (MID 518005426) that shape returned False, in a gate that printed its own start and done markers at HTTP 200 alongside a known-good control block. Every other example in the same table matched: the missing at sign, the double at sign, the missing local part and the missing second-level domain all returned False, and a well-formed address returned True. Surrounding whitespace is also rejected, which no source mentions.',
        category: 'Utility',
        description:
            'Checks a value against email address syntax only; it never tests whether the mailbox or domain exists. Surrounding whitespace and a domain without a top-level domain are both rejected.',
        params: [
            {
                name: 'value',
                description:
                    'Value to validate; trim it first, as a leading or trailing space fails',
                type: 'string',
            },
        ],
        returnType: 'boolean',
        returnDescription:
            'True when the value is a syntactically valid email address, otherwise false.',
        returnEnum: [true, false],
        syntax: 'IsEmailAddress(value)',
        example: "%%=IsEmailAddress('test@example.com')=%%",
    },
    {
        name: 'IsNull',
        mcnSince: 67,
        handlebarsEquivalent: 'isEmpty',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-is-null.html',
        guideUrl: 'https://ampscript.guide/isnull/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/isnull/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Returns true only for a genuine null, which in practice means a data extension field with no value. An unset or undeclared variable, an empty string, whitespace and every ordinary value all return false, so this is not a general emptiness test.',
        params: [
            {
                name: 'value',
                description:
                    'Value to test; typically a data extension field value retrieved with Lookup',
                type: 'string|number|boolean|date',
            },
        ],
        returnType: 'boolean',
        returnDescription:
            'True when the value is null, otherwise false. Prefer Empty when the intent is to detect a missing or blank value.',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference shows a variable declared with VAR and never assigned, and states IsNull returns true for it. On a live Engagement CloudPage on the child business unit (MID 518005426) that exact shape returned False, in a gate that printed its own start and done markers at HTTP 200 alongside a known-good control block. The same False came back for an undeclared variable, an empty string, whitespace, 0, "0", "false", a real value, a date, an absent attribute, an absent request parameter and the subscriber-context tokens. Use Empty for a missing-value test.',
        syntax: 'IsNull(value)',
        example: '%%=IsNull(@value)=%%',
    },
    {
        name: 'IsNullDefault',
        mcnSince: null,
        handlebarsEquivalent: 'fallback',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-is-null-default.html',
        guideUrl: 'https://ampscript.guide/isnulldefault/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/isnulldefault/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Utility',
        description:
            'Returns the value if not null, otherwise returns the default. Outside a Smart Capture form the default is never reached: on a CloudPage every empty-ish input returns the empty string instead, so it cannot be used as a general fallback.',
        params: [
            {
                name: 'value',
                description: 'Value to test; returned unchanged whenever it is present',
                type: 'string|number|boolean|date',
            },
            {
                name: 'defaultValue',
                description:
                    'Default to return when the value is null; only reached in a Smart Capture form context',
                type: 'string|number|boolean|date',
            },
        ],
        returnType: 'string',
        returnDescription: 'The original value, or the default value when the original is null.',
        isConfirmed: true,
        syntax: 'IsNullDefault(value, defaultValue)',
        example: "%%=IsNullDefault(@name, 'Friend')=%%",
    },
    {
        name: 'IsPhoneNumber',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-is-phone-number.html',
        guideUrl: 'https://ampscript.guide/isphonenumber/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/isphonenumber/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Utility',
        description:
            'Checks a value against the North American Numbering Plan. Dashes, dots, spaces and parentheses are tolerated, but a leading plus sign, any letter, a number outside the plan and a leading country-code digit all fail.',
        params: [
            {
                name: 'value',
                description:
                    'Phone number to validate; strip any leading plus sign or country code first',
                type: 'string|number',
            },
        ],
        returnType: 'boolean',
        returnDescription: 'True when the value is a valid phone number, otherwise false.',
        returnEnum: [true, false],
        syntax: 'IsPhoneNumber(value)',
        example: "%%=IsPhoneNumber('425-555-0142')=%%",
    },
    {
        name: 'Length',
        mcnSince: 67,
        handlebarsEquivalent: 'length',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-length.html',
        guideUrl: 'https://ampscript.guide/length/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/length/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'String',
        description: 'Returns the number of characters in a string.',
        params: [
            {
                name: 'sourceString',
                description: 'String to measure',
                type: 'string|number|date',
            },
        ],
        returnType: 'number',
        returnDescription:
            'The number of UTF-16 code units in the string, so characters outside the Basic Multilingual Plane (such as emoji) count as 2.',
        syntax: 'Length(sourceString)',
        example: "%%=Length('Hello')=%%",
    },
    {
        name: 'LiveContentMicrositeURL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-live-content-microsite-url.html',
        guideUrl: 'https://ampscript.guide/livecontentmicrositeurl/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Content',
        description: 'Generates a URL to a microsite page that serves live, dynamic content.',
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'Live Offers (Live Content) was removed from Marketing Cloud in 2019 and the Classic Microsites this URL points at were retired in June 2022, so there is no provisionable modern equivalent and every invocation aborts the page at runtime.',
        officialDocsNote:
            "Attempted on both the child QA BU (MID 518005426) and the parent BU (MID 7281698). Every invocation shape aborted the CloudPage with HTTP 200 lost to a 422 page abort: the documented-valid LiveContentMicrositeURL('coupon','MyCoupon'), an unknown content type, and an empty external key all failed identically. The function resolves a Live Offers (Live Content) coupon by external key, and no such Live Content asset is provisioned on either BU, so no working invocation could be produced. Left blocked pending a tenant with a real Live Offers coupon.",
        params: [
            {
                name: 'contentType',
                description:
                    'The type of content to generate a URL for. Accepted values: microsite, landingpage',
                type: 'string',
                enum: ['coupon'],
            },
            {
                name: 'externalKey',
                description: 'The external key of the live content',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription: 'A URL to the referenced live content microsite.',
        syntax: 'LiveContentMicrositeURL(contentType, externalKey)',
        example: '%%=LiveContentMicrositeURL("coupon", "50percent")=%%',
    },
    {
        name: 'LocalDateToSystemDate',
        mcnSince: null,
        handlebarsEquivalent: 'timeZoneConversion',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-local-date-to-system-date.html',
        guideUrl: 'https://ampscript.guide/localdatetosystemdate/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Date and Time',
        description:
            'Converts a date in the time zone configured on the account to the Marketing Cloud system date (Central Time, no daylight saving). The shift is not constant: the local side observes daylight saving, so a summer instant moves one hour further than a winter one. A value the date parser cannot read aborts the page instead of returning a sentinel.',
        params: [
            {
                name: 'timeToConvert',
                description:
                    'The local time value to convert, as a date value or a parseable date string',
                type: 'string|date',
            },
        ],
        returnType: 'date',
        returnDescription:
            'A real date value the other date functions accept directly. Rendered on its own it prints as a US short date followed by a 12-hour clock with an AM/PM suffix.',
        syntax: 'LocalDateToSystemDate(timeToConvert)',
        example: '%%=LocalDateToSystemDate(Now())=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/localdatetosystemdate/',
    },
    {
        name: 'LongSFID',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-salesforce/mc-ampscript-reference-salesforce-long-sfid.html',
        guideUrl: 'https://ampscript.guide/longsfid/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/longsfid/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 1,
        maxArgs: 1,
        category: 'Sales and Service Cloud',
        description:
            'Converts a 15-character case-sensitive Salesforce ID to the 18-character case-insensitive version.',
        params: [{ name: 'sfid15', description: '15-character Salesforce ID', type: 'string' }],
        returnType: 'string',
        returnDescription: 'The 18-character Salesforce ID derived from the 15-character ID.',
        syntax: 'LongSFID(sfid15)',
        example: "%%=LongSFID('001A000000ABCDE')=%%",
    },
    {
        name: 'Lookup',
        mcnSince: 67,
        handlebarsEquivalent: 'queryFirst',
        handlebarsExact: false,
        mcnNotes:
            'In MCN, search arguments must be provided in column/value pairs - an odd count causes an error. All filter keys must fully specify the composite primary key.',
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-lookup.html',
        guideUrl: 'https://ampscript.guide/lookup/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/lookup/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 4,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Returns a single field value from the first matching row in a data extension. A no-match returns an empty string.',
        params: [
            {
                name: 'dataObject',
                description:
                    'The data object (data extension or marketing object) that contains the data to look up',
                type: 'string',
            },
            {
                name: 'returnColumn',
                description: 'The name of the column to return data from',
                type: 'string',
            },
            {
                name: 'searchColumn1',
                description: 'The name of the column to search',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the rows to retrieve' },
            {
                name: 'searchColumnN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column',
                type: 'string',
                optional: true,
            },
            { name: 'searchValueN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'string',
        returnDescription: 'The value from the requested column of the first matching row.',
        repeat: [{ startIndex: 2, groupSize: 2, minGroups: 1 }],
        syntax: 'Lookup(dataObject, returnColumn, searchColumn1, searchValue1[, searchColumnN, searchValueN, ...])',
        example: "%%=Lookup('MyDE', 'Email', 'ID', '123')=%%",
    },
    {
        name: 'LookupOrderedRows',
        mcnSince: null,
        handlebarsEquivalent: 'query',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-lookup-ordered-rows.html',
        guideUrl: 'https://ampscript.guide/lookuporderedrows/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/lookuporderedrows/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 5,
        maxArgs: INF,
        category: 'Data Extension',
        description: 'Returns a sorted rowset of matching rows from a data extension.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension that contains the data to retrieve',
                type: 'string',
            },
            {
                name: 'numRows',
                description:
                    'The number of rows to return. A value less than 1 returns all rows (max 2,000)',
                type: 'number',
            },
            {
                name: 'sortColumn',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'The column to sort data by, followed by ASC or DESC (case-insensitive)',
                type: 'string',
            },
            {
                name: 'searchColumn1',
                description: 'The name of the column to search',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the rows to retrieve' },
            {
                name: 'searchColumnN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column',
                type: 'string',
                optional: true,
            },
            { name: 'searchValueN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'rowset',
        returnDescription: 'A sorted, row-limited rowset of matching rows.',
        repeat: [{ startIndex: 3, groupSize: 2, minGroups: 1 }],
        syntax: 'LookupOrderedRows(dataExt, numRows, sortColumn, searchColumn1, searchValue1[, searchColumnN, searchValueN, ...])',
        example:
            "%%[ SET @rows = LookupOrderedRows('Orders', 5, 'OrderDate DESC', 'SubKey', _subscriberkey) ]%%",
    },
    {
        name: 'LookupOrderedRowsCS',
        mcnSince: null,
        handlebarsEquivalent: 'query',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-lookup-ordered-rows-cs.html',
        guideUrl: 'https://ampscript.guide/lookuporderedrowscs/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/lookuporderedrowscs/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 5,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Case-sensitive version of LookupOrderedRows. Returns a sorted rowset of matching rows.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension that contains the data to retrieve',
                type: 'string',
            },
            {
                name: 'numRows',
                description:
                    'The number of rows to return. A value less than 1 returns all rows (max 2,000)',
                type: 'number',
            },
            {
                name: 'sortColumn',
                description:
                    'The column to sort data by, followed by ASC or DESC (case-insensitive)',
                type: 'string',
            },
            {
                name: 'searchColumn1',
                description: 'The name of the column to search',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the rows to retrieve' },
            {
                name: 'searchColumnN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column',
                type: 'string',
                optional: true,
            },
            { name: 'searchValueN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'rowset',
        returnDescription: 'A case-sensitive, sorted, row-limited rowset of matching rows.',
        repeat: [{ startIndex: 3, groupSize: 2, minGroups: 1 }],
        syntax: 'LookupOrderedRowsCS(dataExt, numRows, sortColumn, searchColumn1, searchValue1[, searchColumnN, searchValueN, ...])',
        example:
            "%%[ SET @rows = LookupOrderedRowsCS('Orders', 5, 'OrderDate DESC', 'SubKey', _subscriberkey) ]%%",
    },
    {
        name: 'LookupRows',
        mcnSince: null,
        handlebarsEquivalent: 'query',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-lookup-rows.html',
        guideUrl: 'https://ampscript.guide/lookuprows/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/lookuprows/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: INF,
        category: 'Data Extension',
        description: 'Returns a rowset of all matching rows from a data extension.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension that contains the data to retrieve',
                type: 'string',
            },
            {
                name: 'searchColumn1',
                description: 'The name of the column to search',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the rows to retrieve' },
            {
                name: 'searchColumnN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column',
                type: 'string',
                optional: true,
            },
            { name: 'searchValueN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'rowset',
        returnDescription: 'A rowset of all rows that match the search criteria.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'LookupRows(dataExt, searchColumn1, searchValue1[, searchColumnN, searchValueN, ...])',
        example: "%%=LookupRows('MyDE', 'Status', 'Active')=%%",
    },
    {
        name: 'LookupRowsCS',
        mcnSince: null,
        handlebarsEquivalent: 'query',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-lookup-rows-cs.html',
        guideUrl: 'https://ampscript.guide/lookuprowscs/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/lookuprowscs/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: INF,
        category: 'Data Extension',
        description: 'Case-sensitive version of LookupRows. Returns a rowset of matching rows.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension that contains the data to retrieve',
                type: 'string',
            },
            {
                name: 'searchColumn1',
                description: 'The name of the column to search',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the rows to retrieve' },
            {
                name: 'searchColumnN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional filter column',
                type: 'string',
                optional: true,
            },
            { name: 'searchValueN', description: 'Additional filter value', optional: true },
        ],
        returnType: 'rowset',
        returnDescription: 'A case-sensitive rowset of all rows that match the search criteria.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 1 }],
        syntax: 'LookupRowsCS(dataExt, searchColumn1, searchValue1[, searchColumnN, searchValueN, ...])',
        example: "%%[ SET @rows = LookupRowsCS('Orders', 'SubKey', _subscriberkey) ]%%",
    },
    {
        name: 'Lowercase',
        mcnSince: 67,
        handlebarsEquivalent: 'lowercase',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-lowercase.html',
        guideUrl: 'https://ampscript.guide/lowercase/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/lowercase/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'String',
        description: 'Converts a string to all lowercase characters.',
        params: [
            {
                name: 'sourceString',
                description: 'String to convert',
                type: 'string|number|date',
            },
        ],
        returnType: 'string',
        returnDescription: 'The string converted to lower case.',
        syntax: 'Lowercase(sourceString)',
        example: "%%=Lowercase('HELLO')=%%",
    },
    {
        name: 'MD5',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-md5.html',
        guideUrl: 'https://ampscript.guide/md5/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/md5/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Encryption and Encoding',
        description:
            'Returns the MD5 hash of the input value. The bytes hashed are the UTF-8 encoding of the input unless charSet names another encoding, and a number or date argument is hashed as the text it renders as.',
        params: [
            {
                name: 'stringToConvert',
                description:
                    'The value to hash; a number or date is hashed as its rendered text, and the empty string yields the well-known empty-input digest',
                type: 'string|number|date',
            },
            {
                name: 'charSet',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Name of the character encoding applied before hashing; any encoding name the platform recognises works, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
        ],
        returnType: 'string',
        returnDescription: 'The MD5 hash of the input as 32 lowercase hexadecimal characters.',
        syntax: 'MD5(stringToConvert[, charSet])',
        example: '%%=MD5("This is a string of text.")=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'MMS_Content_URL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-mms-content-url.html',
        guideUrl: 'https://ampscript.guide/mobileconnect-data-strings/',
        minArgs: 1,
        maxArgs: 1,
        category: 'MobileConnect',
        description:
            'Returns the URL of MMS content from an inbound mobile-originated (MO) message. Only usable in MobileConnect.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        officialDocsNote:
            'Could not runtime-verify on the only available context (a CloudPage GET on cred/DEV, MID 510007949; no parent-BU escalation is configured on this tenant). Including an MMS_Content_URL(0) call in the injected content block aborted the whole page at compile time (HTTP 422) even when the call sat inside a non-matching IF branch, while an otherwise identical page with the call removed rendered HTTP 200. This matches the official reference, which states the function is usable only in MobileConnect and not in landing pages or other content types; there is no mobile-originated message context on a CloudPage to exercise it against.',
        params: [
            {
                name: 'position',
                description:
                    'Zero-based index of the MMS content to return; 0 returns the first attachment',
                type: 'number',
            },
        ],
        returnType: 'string',
        returnDescription: 'The URL of the requested MMS content from the inbound message.',
        syntax: 'MMS_Content_URL(position)',
        example: '%%=MMS_Content_URL(0)=%%',
    },
    {
        name: 'MicrositeURL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-microsite-url.html',
        guideUrl: 'https://ampscript.guide/micrositeurl/',
        minArgs: 1,
        maxArgs: INF,
        category: 'Utility',
        description:
            'Builds a Classic Content microsite URL whose single encrypted query string carries the page reference and any extra name-value pairs. Every call produces a fresh token, so two calls with identical arguments never match.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/micrositeurl/',
        params: [
            { name: 'pageId', description: 'Microsite page ID', type: 'string|number' },
            {
                name: 'paramName1',
                description: 'Query parameter name',
                type: 'string',
                optional: true,
            },
            {
                name: 'paramValue1',
                description: 'Query parameter value',
                type: 'string',
                optional: true,
            },
            {
                name: 'paramNameN',
                description: 'Additional query parameter name',
                type: 'string',
                optional: true,
            },
            {
                name: 'paramValueN',
                description: 'Additional query parameter value',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'A microsite page URL carrying one encrypted token; extra name-value pairs are folded into that token rather than appended as readable query parameters.',
        repeat: [{ startIndex: 1, groupSize: 2, minGroups: 0 }],
        syntax: 'MicrositeURL(pageId[, paramName1, paramValue1, paramNameN, paramValueN, ...])',
        example: '%%=MicrositeURL(12345)=%%',
    },
    {
        name: 'Mod',
        mcnSince: 67,
        handlebarsEquivalent: 'modulo',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-math/mc-ampscript-reference-math-mod.html',
        guideUrl: 'https://ampscript.guide/mod/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/mod/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Math',
        description:
            'Returns the remainder after dividing the first number by the second (modulo).',
        params: [
            { name: 'dividend', description: 'Number to divide', type: 'string|number' },
            { name: 'divisor', description: 'Number to divide by', type: 'string|number' },
        ],
        returnType: 'number',
        returnDescription:
            'The remainder after dividing the first number by the second. The result takes the sign of the dividend, and a divisor of 0 yields NaN instead of raising an error.',
        syntax: 'Mod(dividend, divisor)',
        example: '%%=Mod(10, 3)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'Msg',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-msg.html',
        guideUrl: 'https://ampscript.guide/mobileconnect-data-strings/',
        minArgs: 1,
        maxArgs: 1,
        category: 'MobileConnect',
        description:
            'Returns the content of an inbound mobile-originated (MO) message. Only usable in MobileConnect. The only accepted argument value is 0.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        officialDocsNote:
            'Could not runtime-verify on the only available context (a CloudPage GET on cred/DEV, MID 510007949; no parent-BU escalation is configured on this tenant). A page containing a Msg(0) call aborted at compile time (HTTP 422) even when the call sat inside a non-matching IF branch, whereas the same page with no Msg construct rendered HTTP 200 — so the abort happens at parse time, before any runtime gate. This matches the official reference, which states the function is usable only in MobileConnect and not in landing pages or other content types; a CloudPage supplies no mobile-originated message to read.',
        params: [
            {
                name: 'index',
                description: 'Message index; the only accepted value is 0 (the current message)',
                type: 'number',
            },
        ],
        returnType: 'string',
        returnDescription: 'The full content of the inbound mobile-originated message.',
        syntax: 'Msg(0)',
        example: '%%=Msg(0)=%%',
    },
    {
        name: 'Multiply',
        mcnSince: 67,
        handlebarsEquivalent: 'multiply',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-math/mc-ampscript-reference-math-multiply.html',
        guideUrl: 'https://ampscript.guide/multiply/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/multiply/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Math',
        description: 'Computes the product of two numeric values.',
        params: [
            { name: 'number1', description: 'First operand', type: 'string|number' },
            { name: 'number2', description: 'Second operand', type: 'string|number' },
        ],
        returnType: 'number',
        returnDescription: 'The product of the two operands.',
        syntax: 'Multiply(number1, number2)',
        example: '%%=Multiply(5, 3)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'Noun',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-noun.html',
        guideUrl: 'https://ampscript.guide/mobileconnect-data-strings/',
        minArgs: 1,
        maxArgs: 1,
        category: 'MobileConnect',
        description:
            'Returns a single word that follows the keyword in an inbound mobile-originated (MO) message, by position. Only usable in MobileConnect, chained off Msg(0).',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        officialDocsNote:
            'Could not runtime-verify on the only available context (a CloudPage GET on cred/DEV, MID 510007949; no parent-BU escalation on this tenant). Noun is chained off Msg(0), and any page containing a Msg(0) construct aborts at compile time (HTTP 422) on a CloudPage while an otherwise identical page without it renders HTTP 200. This matches the official reference, which restricts the function to MobileConnect and forbids landing pages / other content types; a CloudPage supplies no mobile-originated message to parse.',
        params: [
            {
                name: 'position',
                description:
                    'Zero-based index of the word after the keyword to return (0 = first word after the keyword)',
                type: 'number',
            },
        ],
        returnType: 'string',
        returnDescription: 'The requested word that follows the keyword in the inbound message.',
        syntax: 'Msg(0).Noun(position)',
        example: '%%=Msg(0).Noun(1)=%%',
    },
    {
        name: 'Nouns',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-nouns.html',
        guideUrl: 'https://ampscript.guide/mobileconnect-data-strings/',
        minArgs: 0,
        maxArgs: 0,
        category: 'MobileConnect',
        description:
            'Returns all message content that follows the keyword in an inbound mobile-originated (MO) message. Only usable in MobileConnect, chained off Msg(0). Takes no arguments.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        officialDocsNote:
            'Could not runtime-verify on the only available context (a CloudPage GET on cred/DEV, MID 510007949; no parent-BU escalation on this tenant). Nouns is chained off Msg(0), and any page containing a Msg(0) construct aborts at compile time (HTTP 422) on a CloudPage while an otherwise identical page without it renders HTTP 200. This matches the official reference, which restricts the function to MobileConnect and forbids landing pages / other content types; a CloudPage supplies no mobile-originated message to parse.',
        params: [],
        returnType: 'string',
        returnDescription: 'All content that follows the keyword in the inbound message.',
        syntax: 'Msg(0).Nouns',
        example: '%%=Msg(0).Nouns=%%',
    },
    {
        name: 'Now',
        mcnSince: 67,
        handlebarsEquivalent: 'now',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-now.html',
        guideUrl: 'https://ampscript.guide/now/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/now/',
        minArgs: 0,
        maxArgs: 1,
        category: 'Date and Time',
        description:
            'Returns the current system date and time in Central Standard Time, with no daylight-saving adjustment. Every call within one render returns the same instant.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        params: [
            {
                name: 'persistFormat',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'In a send context, a true value returns the send job start or publish time instead of the current time; on a CloudPage it makes no difference. Accepts 1/0, true/false, or those spellings quoted',
                type: 'string|boolean|number',
                optional: true,
            },
        ],
        returnType: 'date',
        returnDescription:
            'The system date and time, as a date value that the other date functions accept directly.',
        syntax: 'Now([persistFormat])',
        example: '%%=Now()=%%',
    },
    {
        name: 'Output',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-output.html',
        guideUrl: 'https://ampscript.guide/output/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/output/',
        minArgs: 0,
        maxArgs: Infinity,
        category: 'Utility',
        description:
            'Writes the result of a nested function call into the rendered content. A string literal, a bare variable or a number renders nothing at all, without raising an error.',
        params: [
            {
                name: 'content',
                description:
                    'Function call whose result is written; a literal or bare variable renders nothing',
            },
        ],
        returnType: 'void',
        returnDescription:
            'No value is returned, so the call cannot be nested inside another function; the result is written straight into the rendered content.',
        syntax: 'Output(content)',
        example: "%%=Output(Concat('Hello ', @firstName))=%%",
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference states that a value which is not a function call, such as a string literal, makes the function return an error. On a live Engagement CloudPage on the child business unit (MID 518005426) a literal argument, a bare variable and a bare number each rendered nothing at all while the page still returned HTTP 200 and every surrounding marker printed, so no error surfaced anywhere. The same page also accepted zero arguments and up to three arguments, writing each one in turn.',
    },
    {
        name: 'OutputLine',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-output-line.html',
        guideUrl: 'https://ampscript.guide/outputline/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/outputline/',
        minArgs: 0,
        maxArgs: Infinity,
        category: 'Utility',
        description:
            'Writes the result of a nested function call into the rendered content, followed by a carriage return and line feed. A string literal, a bare variable or a number renders only the line break. The break is not an HTML line break, so an HTML view keeps everything on one line unless the content sits inside a preformatted element.',
        params: [
            {
                name: 'content',
                description:
                    'Function call whose result is written; a literal or bare variable renders only the line break',
            },
        ],
        returnType: 'void',
        returnDescription:
            'No value is returned, so the call cannot be nested inside another function; the result and a carriage return plus line feed are written straight into the rendered content.',
        syntax: 'OutputLine(content)',
        example: "%%=OutputLine(Concat('Hello ', @firstName))=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'ProperCase',
        mcnSince: 67,
        handlebarsEquivalent: 'properCase',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-propercase.html',
        guideUrl: 'https://ampscript.guide/propercase/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/propercase/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'String',
        description:
            'Converts a value to proper (title) case. Every letter after the first of a word is forced to lower case, so existing internal capitals are lost.',
        params: [
            { name: 'sourceString', description: 'Value to convert', type: 'string|number|date' },
        ],
        returnType: 'string',
        returnDescription:
            'The value with the first letter of each word capitalized and the rest lower-cased.',
        syntax: 'ProperCase(sourceString)',
        example: "%%=ProperCase('hello world')=%%",
    },
    {
        name: 'QueryParameter',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-query-parameter.html',
        guideUrl: 'https://ampscript.guide/queryparameter/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/queryparameter/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Returns the value of a URL query string parameter from the current page request. The name is matched without regard to case, percent-encoded characters arrive decoded, and a name supplied more than once yields the values joined by a comma.',
        params: [
            {
                name: 'parameterName',
                description: 'Query parameter name, matched without regard to case',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The decoded value of the named query-string parameter, or an empty string when the request carries no such parameter. The value is returned exactly as supplied, so escape it before rendering it into markup.',
        syntax: 'QueryParameter(parameterName)',
        example: "%%=QueryParameter('utm_source')=%%",
        isConfirmed: true,
    },
    {
        name: 'RaiseError',
        mcnSince: 67,
        handlebarsEquivalent: 'raiseError',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-raise-error.html',
        guideUrl: 'https://ampscript.guide/raiseerror/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/raiseerror/',
        minArgs: 1,
        maxArgs: 5,
        category: 'Utility',
        description:
            'Raises a runtime error, optionally skipping the current subscriber or returning an API error. Outside a send it is not a graceful abort: on a landing page it discards everything already written and answers the same generic failure any other aborting call gives, with the message nowhere in the response.',
        params: [
            { name: 'message', description: 'Error message', type: 'string' },
            {
                name: 'skipSubscriber',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'If true, the function skips only the subscriber for which the error was raised, and proceeds with the rest of the email job. If false, the function stops the entire email job when an error is raised. The default value is false.',
                type: 'string|boolean|number',
                optional: true,
            },
            {
                name: 'apiErrorCode',
                mcnSince: null,
                mcnNotes: null,
                description: 'Custom API error code',
                type: 'string',
                optional: true,
            },
            {
                name: 'apiErrorNumber',
                mcnSince: null,
                mcnNotes: null,
                description: 'Custom API error message',
                type: 'number',
                optional: true,
            },
            {
                name: 'preserveDataExt',
                mcnSince: null,
                mcnNotes: null,
                description:
                    "If true, the function retains information written to data extensions before the error occurs, even if the subscriber is skipped. If false, the function doesn't retain data extension information recorded before the error. This parameter applies to information that is inserted, updated, upserted, or deleted using AMPscript functions",
                type: 'boolean',
                optional: true,
            },
        ],
        returnType: 'void',
        returnDescription:
            'No value is returned; processing is halted. On a landing page the whole request is abandoned and the response body is a fixed failure notice rather than the supplied message.',
        syntax: 'RaiseError(message[, skipSubscriber, apiErrorCode, apiErrorNumber, preserveDataExt])',
        example: "RaiseError('Missing required field', 0)",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'Random',
        mcnSince: 67,
        handlebarsEquivalent: 'random',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-random.html',
        guideUrl: 'https://ampscript.guide/random/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/random/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Math',
        description:
            'Returns a random integer between the two specified values (inclusive). Both bounds must be whole numbers; a decimal bound aborts the page. The bounds may be supplied in either order.',
        params: [
            { name: 'min', description: 'Lower bound (inclusive)', type: 'string|number' },
            { name: 'max', description: 'Upper bound (inclusive)', type: 'string|number' },
        ],
        returnType: 'number',
        returnDescription: 'A random whole number within the supplied range.',
        syntax: 'Random(min, max)',
        example: '%%=Random(1, 100)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference states the bounds may be decimal numbers. On the child QA BU (MID 518005426) every decimal bound aborted the CloudPage with HTTP 422 — Random(1.2,1.8), Random(1,2.5), Random(1.0,3.0) and the quoted form Random("1.5","3.5") all failed, while the equivalent whole-number and numeric-string calls returned values normally. The same decimal calls also aborted on the parent BU (MID 7281698), so this is not a child-BU limitation. Only whole-number bounds are usable at runtime.',
    },
    {
        name: 'RatingStars',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        guideUrl: 'https://ampscript.guide/ratingstars/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Einstein Email Recommendations',
        description: 'Renders a star-rating image using Einstein recommendations data.',
        params: [
            { name: 'rating', description: 'Current rating value', type: 'number' },
            { name: 'maxRating', description: 'Maximum rating value', type: 'number' },
            { name: 'imageUrl', description: 'Base URL for star images', type: 'string' },
        ],
        returnType: 'string',
        returnDescription: 'An HTML string of star images representing the rating.',
        syntax: 'RatingStars(rating, maxRating, imageUrl)',
        example: "%%=RatingStars(4, 5, 'https://example.com/star.png')=%%",
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-test-data',
        officialDocsNote:
            'No working CloudPage invocation was found. Any valid-arity call aborts the whole page with HTTP 422 at compile time, even when placed inside an unreached IF gate, so it cannot be probed behind a query-string switch. Two signature shapes were each deployed as the whole page: the catalog form RatingStars(4, 5, "https://example.com/star.png") and the ampscript.guide form RatingStars(5, "yellow", 25). Both returned HTTP 422 on the child BU (MID 518005426) and again on the parent BU (MID 7281698). The surrounding harness structure (RequestParameter gating, IF/ELSE/ENDIF) returned HTTP 200 once the RatingStars call was removed, confirming the abort is caused by the function itself, not the harness. RatingStars is an Einstein Email Recommendations helper that appears to resolve only inside the recommendations rendering context, which a bare CloudPage does not supply.',
    },
    {
        name: 'Redirect',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-redirect.html',
        guideUrl: 'https://ampscript.guide/redirect/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/redirect/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Performs an HTTP redirect to the specified URL. Landing pages only. The response is a 302 whose Location is the supplied value verbatim, and everything written before the call is discarded along with the page body. Not to be confused with RedirectTo, which emits no redirect at all.',
        params: [{ name: 'url', description: 'Target URL', type: 'string|number' }],
        returnType: 'void',
        returnDescription:
            'No value is returned; the request answers 302 and the supplied value becomes the Location header unchanged, even when it is not an absolute URL.',
        syntax: 'Redirect(url)',
        example: "Redirect('https://example.com')",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'RedirectTo',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-redirect-to.html',
        guideUrl: 'https://ampscript.guide/redirectto/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Marks a URL held in a variable or field as a tracked email link. It never redirects the current request and never halts the script; outside a tracked send it hands the value straight back.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/redirectto/',
        params: [{ name: 'url', description: 'Target URL', type: 'string|number' }],
        returnType: 'string',
        returnDescription:
            'The link-tracking target for the supplied address during a tracked send; on a CloudPage the supplied value unchanged.',
        syntax: 'RedirectTo(url)',
        example: '%%=RedirectTo(@targetUrl)=%%',
    },
    {
        name: 'RegExMatch',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-regex-match.html',
        guideUrl: 'https://ampscript.guide/regexmatch/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/regexmatch/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 3,
        maxArgs: Infinity,
        category: 'String',
        description:
            'Returns the first occurrence of a regular expression match in a string, selected by capture group. Matching is case-sensitive unless the IgnoreCase option is passed.',
        params: [
            {
                name: 'sourceString',
                description: 'String to match against',
                type: 'string|number',
            },
            {
                name: 'regExPattern',
                description: 'The regular expression to use in the search',
                type: 'string',
            },
            {
                name: 'returnValue',
                description:
                    'Index or name of the capture group to return; 0 returns the whole match',
                type: 'string|number',
            },
            {
                name: 'regExOptions',
                description:
                    'A .NET RegexOptions member name to apply to the search, such as IgnoreCase or Multiline',
                type: 'string',
                optional: true,
            },
            {
                name: 'regExOptionsN',
                description: 'Additional RegexOptions member name',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The text of the selected capture group, or an empty string when the pattern does not match or the group does not exist.',
        syntax: 'RegExMatch(sourceString, regExPattern, returnValue[, regExOptions, ...])',
        example:
            'Var @couponCode, @regEx, @regExMatch\n' +
            'Set @couponCode = "SAVE23"\n' +
            'Set @regEx = "^[A-Z0-9]{5,7}$"\n' +
            'Set @regExMatch = RegExMatch(@couponCode, @regEx, 0, "IgnoreCase")',
    },
    {
        name: 'Replace',
        mcnSince: 67,
        handlebarsEquivalent: 'replace',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-replace.html',
        guideUrl: 'https://ampscript.guide/replace/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/replace/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 2,
        maxArgs: 3,
        category: 'String',
        description:
            'Replaces all occurrences of a substring with a new value, matching case-insensitively. The source is scanned once, so text formed by a replacement is not replaced again.',
        params: [
            { name: 'sourceString', description: 'Source string', type: 'string|number' },
            { name: 'searchSubstring', description: 'Substring to find', type: 'string|number' },
            {
                name: 'replacementSubstring',
                description: 'Replacement string. If omitted, the search text is removed.',
                type: 'string|number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The string with every occurrence of the search text replaced, or the source unchanged when the search text is not found.',
        syntax: 'Replace(sourceString, searchSubstring[, replacementSubstring])',
        example: "%%=Replace('Hello World', 'World', 'There')=%%",
    },
    {
        name: 'ReplaceList',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-replace-list.html',
        guideUrl: 'https://ampscript.guide/replacelist/',
        minArgs: 3,
        maxArgs: INF,
        category: 'String',
        description:
            'Replaces every occurrence of each supplied search value with one common replacement value, matching case-insensitively. The search values are applied one after another in the order given, so text produced by an earlier replacement can still be matched by a later one.',
        params: [
            { name: 'sourceString', description: 'Source string', type: 'string|number' },
            { name: 'replacementString', description: 'Replacement string', type: 'string|number' },
            { name: 'searchString1', description: 'First value to replace', type: 'string|number' },
            {
                name: 'searchStringN',
                description: 'Additional value to replace',
                type: 'string|number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The string with every supplied search value replaced by the replacement, or the source unchanged when none of them is found.',
        repeat: [{ startIndex: 2, groupSize: 1, minGroups: 1 }],
        syntax: 'ReplaceList(sourceString, replacementString, searchString1[, searchStringN, ...])',
        example: "%%=ReplaceList('a-b/c', '_', '-', '/')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/replacelist/',
    },
    {
        name: 'RequestParameter',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sites/mc-ampscript-reference-sites-request-parameter.html',
        guideUrl: 'https://ampscript.guide/requestparameter/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/requestparameter/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Returns the value of a form post or query string parameter from the current request. The name is matched without regard to case, percent-encoded characters arrive decoded, and a name supplied more than once yields the values joined by a comma.',
        params: [
            {
                name: 'parameterName',
                description: 'Parameter name, matched without regard to case',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The decoded value of the named request parameter, or an empty string when the request carries no such parameter. The value is returned exactly as supplied, so escape it before rendering it into markup.',
        syntax: 'RequestParameter(parameterName)',
        example: "%%=RequestParameter('id')=%%",
        isConfirmed: true,
    },
    {
        name: 'RetrieveMSCRMRecords',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-retrieve-records.html',
        guideUrl: 'https://ampscript.guide/retrievemscrmrecords/',
        minArgs: 5,
        maxArgs: 5,
        category: 'Microsoft Dynamics CRM',
        description: 'Retrieves records from Dynamics CRM using a simple filter.',
        params: [
            {
                name: 'entityName',
                description:
                    'The name of the Microsoft Dynamics CRM entity to retrieve records from',
                type: 'string',
            },
            {
                name: 'fieldsToRetrieve',
                mcnSince: null,
                mcnNotes: null,
                description: 'A comma-separated list of fields to retrieve',
                type: 'string',
            },
            {
                name: 'queryFieldName',
                description: 'The name of the field to filter on',
                type: 'string',
            },
            {
                name: 'queryFieldOperator',
                description: 'The operator to use for the filter',
                type: 'string',
            },
            { name: 'queryFieldValue', description: 'The value to filter on' },
        ],
        returnType: 'rowset',
        returnDescription: 'A rowset of matching Microsoft Dynamics CRM records.',
        syntax: 'RetrieveMSCRMRecords(entityName, fieldsToRetrieve, queryFieldName, queryFieldOperator, queryFieldValue)',
        example:
            "%%[ SET @rows = RetrieveMSCRMRecords('contact', 'fullname,emailaddress1', 'lastname', 'eq', 'Smith') ]%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'RetrieveMSCRMRecordsFetchXML',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-retrieve-records-fetch-xml.html',
        guideUrl: 'https://ampscript.guide/retrievemscrmrecordsfetchxml/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Microsoft Dynamics CRM',
        description: 'Retrieves records from Dynamics CRM using a FetchXML query.',
        params: [{ name: 'fetchXml', description: 'FetchXML query string', type: 'string' }],
        returnType: 'rowset',
        returnDescription: 'A rowset of CRM records matching the FetchXML query.',
        syntax: 'RetrieveMSCRMRecordsFetchXML(fetchXml)',
        example: '%%[ SET @rows = RetrieveMSCRMRecordsFetchXML(@fetchXml) ]%%',
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'RetrieveSalesforceJobSources',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-salesforce/mc-ampscript-reference-salesforce-retrieve-job-sources.html',
        guideUrl: 'https://ampscript.guide/retrievesalesforcejobsources/',
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/retrievesalesforcejobsources/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 1,
        maxArgs: 1,
        category: 'Sales and Service Cloud',
        description:
            'Retrieves the source records (SourceID, SourceType, IsInclusionSource) that made up the audience of a Salesforce-triggered send, matched by its numeric job ID, and returns them as a rowset. Requires an active Marketing Cloud Connect integration. A job ID with no matching sources returns an empty rowset rather than an error; the function reports nothing about the job status.',
        params: [
            {
                name: 'jobId',
                description: 'The numeric job ID of the Salesforce send',
                type: 'number',
            },
        ],
        returnType: 'rowset',
        returnDescription:
            'A rowset of the send sources (SourceID, SourceType, IsInclusionSource); an empty rowset when the job ID has no matching sources.',
        syntax: 'RetrieveSalesforceJobSources(jobId)',
        example: '%%[ SET @rows = RetrieveSalesforceJobSources(@jobId) ]%%',
    },
    {
        name: 'RetrieveSalesforceObjects',
        mcnSince: 67,
        handlebarsEquivalent: 'query',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-salesforce/mc-ampscript-reference-salesforce-retrieve-objects.html',
        guideUrl: 'https://ampscript.guide/retrievesalesforceobjects/',
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/retrievesalesforceobjects/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 5,
        maxArgs: INF,
        category: 'Sales and Service Cloud',
        description:
            'Retrieves records from a connected Salesforce Sales or Service Cloud object via Marketing Cloud Connect and returns them as a rowset. Requires an active Marketing Cloud Connect integration; a call against an unknown object name aborts the page.',
        params: [
            {
                name: 'objectName',
                description: 'The API name of the Salesforce object to retrieve information from',
                type: 'string',
            },
            {
                name: 'fieldsToRetrieve',
                description: 'A comma-separated list of fields to retrieve information from',
                type: 'string',
            },
            {
                name: 'queryFieldName1',
                description: 'The name of the field to filter on',
                type: 'string',
            },
            {
                name: 'queryFieldOperator1',
                description: 'The comparison operator to use for the filter',
                type: 'string',
                enum: ['=', '!=', '<', '<=', '>', '>='],
            },
            { name: 'queryFieldValue1', description: 'The value to filter on' },
            {
                name: 'queryFieldNameN',
                description: 'Additional filter field name (joined with AND)',
                type: 'string',
                optional: true,
            },
            {
                name: 'queryFieldOperatorN',
                description: 'Additional comparison operator',
                type: 'string',
                enum: ['=', '!=', '<', '<=', '>', '>='],
                optional: true,
            },
            {
                name: 'queryFieldValueN',
                description: 'Additional filter value',
                optional: true,
            },
        ],
        returnType: 'rowset',
        returnDescription: 'A rowset of matching Salesforce object records.',
        repeat: [{ startIndex: 2, groupSize: 3, minGroups: 1 }],
        syntax: 'RetrieveSalesforceObjects(objectName, fieldsToRetrieve, queryFieldName1, queryFieldOperator1, queryFieldValue1[, queryFieldNameN, queryFieldOperatorN, queryFieldValueN, ...])',
        example:
            "%%[ SET @rows = RetrieveSalesforceObjects('Contact', 'Id,Email', 'LastName', '=', 'Smith') ]%%",
    },
    {
        name: 'Row',
        mcnSince: 67,
        handlebarsEquivalent: 'get',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-row.html',
        guideUrl: 'https://ampscript.guide/row/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/row/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 2,
        maxArgs: 2,
        category: 'Data Extension',
        description:
            'Returns a specific row from a rowset by its 1-based index. Index 0 (or any out-of-range index) aborts the page rather than returning an empty row.',
        params: [
            { name: 'rowset', description: 'Rowset to access', type: 'rowset' },
            { name: 'rowIndex', description: '1-based row index', type: 'number' },
        ],
        returnType: 'row',
        returnDescription: 'The row at the requested 1-based index within the rowset.',
        syntax: 'Row(rowset, rowIndex)',
        example: '%%=Row(@rows, 1)=%%',
    },
    {
        name: 'RowCount',
        mcnSince: 67,
        handlebarsEquivalent: 'length',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-row-count.html',
        guideUrl: 'https://ampscript.guide/rowcount/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/rowcount/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 1,
        maxArgs: 1,
        category: 'Data Extension',
        description: 'Returns the number of rows in a rowset.',
        params: [{ name: 'rowset', description: 'Rowset to count', type: 'rowset' }],
        returnType: 'number',
        returnDescription: 'The number of rows in the rowset.',
        syntax: 'RowCount(rowset)',
        example: '%%=RowCount(@rows)=%%',
    },
    {
        name: 'SetObjectProperty',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-api/mc-ampscript-reference-api-set-object-property.html',
        guideUrl: 'https://ampscript.guide/setobjectproperty/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/setobjectproperty/',
        minArgs: 3,
        maxArgs: 3,
        category: 'Marketing Cloud API',
        description: 'Sets a property value on a Marketing Cloud API object.',
        params: [
            { name: 'apiObject', description: 'API object reference', type: 'object' },
            {
                name: 'propertyName',
                description: 'The name of the property to assign a value to',
                type: 'string',
            },
            {
                name: 'propertyValue',
                description: 'The value to assign to the property',
                type: 'string',
            },
        ],
        returnType: 'void',
        returnDescription: 'No value is returned; the named property is set on the object.',
        syntax: 'SetObjectProperty(apiObject, propertyName, propertyValue)',
        example: "SetObjectProperty(@apiObject, 'LastName', 'Smith')",
        isConfirmed: true,
    },
    {
        name: 'SetSmsConversationNextKeyword',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-set-sms-conversation-next-keyword.html',
        guideUrl: 'https://ampscript.guide/setsmsconversationnextkeyword/',
        minArgs: 3,
        maxArgs: 3,
        category: 'MobileConnect',
        description:
            'Sets the keyword for the next path of an existing SMS conversation, applied when the contact next replies. Does not create a new conversation. Returns true when set inside a MobileConnect message context, and false in any other context (for example a CloudPage or email). The success path cannot be exercised outside a live MobileConnect send.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        differsFromOfficialDocs: true,
        officialDocsNote:
            'Runtime-observed on cred/DEV (MID 510007949), the only BU available (no parent-BU escalation). This is an ordinary function call, so it compiles and runs on a CloudPage: called there with a real short code, the authorized destination number and a keyword, it returned the literal boolean false (Empty() false) and the page rendered fully with no exception — no SMS was sent and no conversation state changed. This confirms the ampscript.guide claim that the function returns false outside a MobileConnect message context; the official Salesforce reference omits this and describes only the in-context behaviour. The success path (true, keyword actually set) requires a live MobileConnect message context that cannot be captured on this tenant, so the function is recorded blocked for the success path while the CloudPage false-return is proven. The catalogued signature was corrected here: the three parameters are originationNumber, destinationNumber and keyword, and the return is a boolean, not void. A docUrl to the official reference was also added.',
        params: [
            {
                name: 'originationNumber',
                description: 'The MobileConnect short code or long code used to send',
                type: 'string',
            },
            {
                name: 'destinationNumber',
                description: "The contact's phone number, including country code",
                type: 'string',
            },
            {
                name: 'keyword',
                description: 'The string to set as the next conversation keyword',
                type: 'string',
            },
        ],
        returnType: 'boolean',
        returnDescription:
            'true when the next keyword is set inside a MobileConnect message context; false in any other context (proven on a CloudPage). Fails with an exception in-context if unsuccessful.',
        syntax: 'SetSmsConversationNextKeyword(originationNumber, destinationNumber, keyword)',
        example: '%%=SetSmsConversationNextKeyword("12345", MOBILE_NUMBER, "EXAMPLE")=%%',
    },
    {
        name: 'SetStateMscrmRecord',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-set-state-record.html',
        guideUrl: 'https://ampscript.guide/setstatemscrmrecord/',
        minArgs: 4,
        maxArgs: 4,
        category: 'Microsoft Dynamics CRM',
        description: 'Sets the state and status of a Dynamics CRM record.',
        params: [
            {
                name: 'recordGuid',
                description: 'The GUID of the record to set the state and status of',
                type: 'string',
            },
            {
                name: 'entityName',
                description: 'The name of the Microsoft Dynamics CRM entity',
                type: 'string',
            },
            {
                name: 'stateToSet',
                description: 'The state to set for the record.',
                type: 'string',
                enum: ['active', 'inactive'],
            },
            {
                name: 'statusToSet',
                description: 'The status to set for the record.',
                type: 'number',
                enum: [0, 1, -1],
            },
        ],
        returnType: 'void',
        returnDescription: 'No value is returned; the record state and status are updated.',
        syntax: 'SetStateMscrmRecord(recordGuid, entityName, stateToSet, statusToSet)',
        example: "SetStateMscrmRecord(@guid, 'contact', 'active', 1)",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'SHA1',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-sha1.html',
        guideUrl: 'https://ampscript.guide/sha1/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/sha1/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Encryption and Encoding',
        description:
            'Returns the SHA-1 hash of the input value. The bytes hashed are the UTF-8 encoding of the input unless charSet names another encoding, and a number or date argument is hashed as the text it renders as.',
        params: [
            {
                name: 'stringToConvert',
                description:
                    'The value to hash; a number or date is hashed as its rendered text, and the empty string yields the well-known empty-input digest',
                type: 'string|number|date',
            },
            {
                name: 'charSet',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Name of the character encoding applied before hashing; any encoding name the platform recognises works, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
        ],
        returnType: 'string',
        returnDescription: 'The SHA-1 hash of the input as 40 lowercase hexadecimal characters.',
        syntax: 'SHA1(stringToConvert[, charSet])',
        example: "%%=SHA1('This is a string of text.')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'SHA256',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-sha256.html',
        guideUrl: 'https://ampscript.guide/sha256/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/sha256/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Encryption and Encoding',
        description:
            'Returns the SHA-256 hash of the input value. The bytes hashed are the UTF-8 encoding of the input unless charSet names another encoding, and a number or date argument is hashed as the text it renders as.',
        params: [
            {
                name: 'stringToConvert',
                description:
                    'The value to hash; a number or date is hashed as its rendered text, and the empty string yields the well-known empty-input digest',
                type: 'string|number|date',
            },
            {
                name: 'charSet',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Name of the character encoding applied before hashing; any encoding name the platform recognises works, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
        ],
        returnType: 'string',
        returnDescription: 'The SHA-256 hash of the input as 64 lowercase hexadecimal characters.',
        syntax: 'SHA256(stringToConvert[, charSet])',
        example: '%%=SHA256("This is a string of text.")=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'SHA512',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-encryption/mc-ampscript-reference-encryption-sha512.html',
        guideUrl: 'https://ampscript.guide/sha512/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/sha512/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Encryption and Encoding',
        description:
            'Returns the SHA-512 hash of the input value. The bytes hashed are the UTF-8 encoding of the input unless charSet names another encoding, and a number or date argument is hashed as the text it renders as.',
        params: [
            {
                name: 'stringToConvert',
                description:
                    'The value to hash; a number or date is hashed as its rendered text, and the empty string yields the well-known empty-input digest',
                type: 'string|number|date',
            },
            {
                name: 'charSet',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'Name of the character encoding applied before hashing; any encoding name the platform recognises works, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
        ],
        returnType: 'string',
        returnDescription: 'The SHA-512 hash of the input as 128 lowercase hexadecimal characters.',
        syntax: 'SHA512(stringToConvert[, charSet])',
        example: "%%=SHA512('This is a string of text.')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'StringToDate',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes:
            'In MCN, returns a locale-formatted string (G standard format, e.g. "5/15/2026 1:23:45 PM") instead of a dateTime object. Cannot be reliably passed to FormatDate() or other date functions in MCN - use FormatDate() directly instead.',
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-string-to-date.html',
        guideUrl: 'https://ampscript.guide/stringtodate/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/stringtodate/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Date and Time',
        description:
            'Converts a date string to a date value. Behaves identically to DateParse for every input format tested, but takes no second argument, so DateParse is the only one of the two that can return the instant in UTC. A string the parser cannot read aborts the page instead of returning a sentinel, and an ambiguous day-first string such as 5/8/2026 is silently read month-first rather than rejected.',
        params: [
            {
                name: 'dateString',
                description:
                    'A date or timestamp string, or an existing date value; anything the parser cannot read aborts the page',
                type: 'string|date',
            },
        ],
        returnType: 'date',
        returnDescription:
            'A real date value the other date functions accept directly. Rendered on its own it prints as a US short date followed by a 12-hour clock with an AM/PM suffix.',
        syntax: 'StringToDate(dateString)',
        example: "%%=StringToDate('2026-01-15')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'StringToHex',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-to-hex.html',
        guideUrl: 'https://ampscript.guide/stringtohex/',
        minArgs: 1,
        maxArgs: 2,
        category: 'Encryption and Encoding',
        description:
            'Converts a string to its hexadecimal representation. The bytes rendered are the UTF-8 encoding of the input unless charSet names another encoding.',
        params: [
            {
                name: 'sourceString',
                description:
                    'The string to convert to hexadecimal character codes; the empty string yields the empty string',
                type: 'string',
            },
            {
                name: 'charSet',
                description:
                    'Character set to use for encoding; any encoding name the platform recognises works, and an unrecognised or empty name aborts the page',
                type: 'string',
                enum: ['UTF-8', 'UTF-16', 'UTF-16BE', 'UTF-32', 'ASCII', 'ISO-8859-1'],
                optional: true,
                default: 'UTF-8',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The hexadecimal representation of the input string, in lowercase digits with no separators.',
        syntax: 'StringToHex(sourceString[, charSet])',
        example: "%%=StringToHex('AB')=%%",
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/stringtohex/',
    },
    {
        name: 'Substring',
        mcnSince: 67,
        handlebarsEquivalent: 'substring',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-substring.html',
        guideUrl: 'https://ampscript.guide/substring/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/substring/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 2,
        maxArgs: 3,
        category: 'String',
        description:
            'Extracts a portion of a string starting at the given index for the specified length. A start position below 1 is treated as the first character.',
        params: [
            { name: 'sourceString', description: 'Source string', type: 'string|number' },
            {
                name: 'startPosition',
                description: '1-based start position, as a whole number',
                type: 'string|number',
            },
            {
                name: 'substringLength',
                mcnSince: 67,
                mcnNotes: null,
                description:
                    'Number of characters to extract, as a whole number. If omitted, returns the remainder of the string.',
                type: 'string|number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The requested portion of the string, or an empty string when the start position is past the end of the source.',
        syntax: 'Substring(sourceString, startPosition[, substringLength])',
        example: "%%=Substring('Hello World', 1, 5)=%%",
    },
    {
        name: 'Subtract',
        mcnSince: 67,
        handlebarsEquivalent: 'subtract',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-math/mc-ampscript-reference-math-subtract.html',
        guideUrl: 'https://ampscript.guide/subtract/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/subtract/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Math',
        description: 'Computes the difference between two numeric values.',
        params: [
            { name: 'minuend', description: 'Value to subtract from', type: 'string|number' },
            { name: 'subtrahend', description: 'Value to subtract', type: 'string|number' },
        ],
        returnType: 'number',
        returnDescription: 'The difference of the two operands.',
        syntax: 'Subtract(minuend, subtrahend)',
        example: '%%=Subtract(50, 15)=%%',
        isConfirmed: true,
        differsFromOfficialDocs: false,
    },
    {
        name: 'SystemDateToLocalDate',
        mcnSince: null,
        handlebarsEquivalent: 'timeZoneConversion',
        handlebarsExact: false,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-date-time/mc-ampscript-reference-date-time-system-date-to-local-date.html',
        guideUrl: 'https://ampscript.guide/systemdatetolocaldate/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Date and Time',
        description:
            'Converts a Marketing Cloud system date (Central Time, no daylight saving) to the time zone configured on the account. The shift is not constant: the local side observes daylight saving, so a summer instant moves one hour further than a winter one. A value the date parser cannot read aborts the page instead of returning a sentinel.',
        params: [
            {
                name: 'systemTime',
                description:
                    'The system time value to convert, as a date value or a parseable date string',
                type: 'string|date',
            },
        ],
        returnType: 'date',
        returnDescription:
            'A real date value the other date functions accept directly. Rendered on its own it prints as a US short date followed by a 12-hour clock with an AM/PM suffix.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/systemdatetolocaldate/',
        syntax: 'SystemDateToLocalDate(systemTime)',
        example: '%%=SystemDateToLocalDate(Now())=%%',
    },
    {
        name: 'TransformXML',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-transform-xml.html',
        guideUrl: 'https://ampscript.guide/transformxml/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/transformxml/',
        minArgs: 2,
        maxArgs: 2,
        category: 'Content',
        description: 'Transforms an XML document using an XSLT stylesheet.',
        isConfirmed: true,
        params: [
            { name: 'xmlDocument', description: 'XML document string', type: 'string' },
            { name: 'xslDocument', description: 'XSLT stylesheet string', type: 'string' },
        ],
        returnType: 'string',
        returnDescription: 'The result of applying the XSL transform to the XML document.',
        syntax: 'TransformXML(xmlDocument, xslDocument)',
        example: '%%=TransformXML(@xml, @xsl)=%%',
    },
    {
        name: 'TreatAsContent',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-treat-as-content.html',
        guideUrl: 'https://ampscript.guide/treatascontent/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/treatascontent/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Content',
        description:
            'Evaluates a string as AMPscript content, rendering any embedded AMPscript expressions, and returns the rendered string. Plain text and the empty string pass through unchanged.',
        params: [
            {
                name: 'stringToReturn',
                mcnSince: null,
                mcnNotes: null,
                description: 'String containing AMPscript to evaluate',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription: 'The supplied string rendered as AMPscript content.',
        syntax: 'TreatAsContent(stringToReturn)',
        example: '%%=TreatAsContent(@dynamicContent)=%%',
    },
    {
        name: 'TreatAsContentArea',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-treat-as-content-area.html',
        guideUrl: 'https://ampscript.guide/treatascontentarea/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/treatascontentarea/',
        minArgs: 2,
        maxArgs: 3,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'Content',
        description:
            'Stores a content string under a key for the duration of a send and renders it, evaluating any embedded AMPscript. An optional third argument names an impression region.',
        params: [
            { name: 'contentKey', description: 'Content area key identifier', type: 'string' },
            { name: 'contentValue', description: 'HTML/AMPscript content', type: 'string' },
            {
                name: 'impressionRegion',
                mcnSince: null,
                mcnNotes: null,
                description: 'Impression region name',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The supplied value rendered as a content area.',
        syntax: 'TreatAsContentArea(contentKey, contentValue[, impressionRegion])',
        example: "%%=TreatAsContentArea('region-key', @content)=%%",
    },
    {
        name: 'Trim',
        mcnSince: 67,
        handlebarsEquivalent: 'trim',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-trim.html',
        guideUrl: 'https://ampscript.guide/trim/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/trim/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'String',
        description:
            'Removes leading and trailing whitespace from a value. Tabs, line breaks and the non-breaking space count as whitespace.',
        params: [
            { name: 'sourceString', description: 'Value to trim', type: 'string|number|date' },
        ],
        returnType: 'string',
        returnDescription: 'The string with leading and trailing whitespace removed.',
        syntax: 'Trim(sourceString)',
        example: "%%=Trim('  hello  ')=%%",
    },
    {
        name: 'UpdateData',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-update-data.html',
        guideUrl: 'https://ampscript.guide/updatedata/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/updatedata/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 6,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Updates existing rows in a data extension that match the specified search columns. Returns the number of rows updated.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension that contains the data to update',
                type: 'string',
            },
            {
                name: 'columnValuePairs',
                description:
                    'The number of column and value pairs for the function to match against',
                type: 'number',
            },
            {
                name: 'searchColumnName1',
                description: 'The name of a column to search for the data to update',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the row to update' },
            {
                name: 'searchColumnNameN',
                description: 'Additional search column name (count given by columnValuePairs)',
                type: 'string',
                optional: true,
            },
            {
                name: 'searchValueN',
                description: 'Additional search value (count given by columnValuePairs)',
                optional: true,
            },
            {
                name: 'columnToUpdate1',
                description: 'The column that contains the data to update',
                type: 'string',
            },
            { name: 'updatedValue1', description: 'The data to update in the specified column' },
            {
                name: 'columnToUpdateN',
                description: 'Additional column to update',
                type: 'string',
                optional: true,
            },
            { name: 'updatedValueN', description: 'Additional value to update', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows updated.',
        repeat: [
            { startIndex: 2, groupSize: 2, minGroups: 1, countParam: 'columnValuePairs' },
            { startIndex: 4, groupSize: 2, minGroups: 1 },
        ],
        syntax: 'UpdateData(dataExt, columnValuePairs, searchColumnName1, searchValue1[, searchColumnNameN, searchValueN, ...], columnToUpdate1, updatedValue1[, columnToUpdateN, updatedValueN, ...])',
        example:
            "%%=UpdateData('Subscribers', 1, 'SubscriberKey', _subscriberkey, 'Status', 'Active')=%%",
    },
    {
        name: 'UpdateDE',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-update-de.html',
        guideUrl: 'https://ampscript.guide/updatede/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/updatede/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 6,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Updates existing rows in a data extension. Email-context variant of UpdateData. Returns the number of rows updated.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension that contains the data to update',
                type: 'string',
            },
            {
                name: 'columnValuePairs',
                description:
                    'The number of column and value pairs for the function to match against',
                type: 'number',
            },
            {
                name: 'searchColumnName1',
                description: 'The name of a column to search for the data to update',
                type: 'string',
            },
            { name: 'searchValue1', description: 'The value that identifies the row to update' },
            {
                name: 'searchColumnNameN',
                description: 'Additional search column name (count given by columnValuePairs)',
                type: 'string',
                optional: true,
            },
            {
                name: 'searchValueN',
                description: 'Additional search value (count given by columnValuePairs)',
                optional: true,
            },
            {
                name: 'columnToUpdate1',
                description: 'The column that contains the data to update',
                type: 'string',
            },
            { name: 'updatedValue1', description: 'The data to update in the specified column' },
            {
                name: 'columnToUpdateN',
                description: 'Additional column to update',
                type: 'string',
                optional: true,
            },
            { name: 'updatedValueN', description: 'Additional value to update', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows updated.',
        repeat: [
            { startIndex: 2, groupSize: 2, minGroups: 1, countParam: 'columnValuePairs' },
            { startIndex: 4, groupSize: 2, minGroups: 1 },
        ],
        syntax: 'UpdateDE(dataExt, columnValuePairs, searchColumnName1, searchValue1[, searchColumnNameN, searchValueN, ...], columnToUpdate1, updatedValue1[, columnToUpdateN, updatedValueN, ...])',
        example:
            "%%=UpdateDE('Subscribers', 1, 'SubscriberKey', _subscriberkey, 'Status', 'Active')=%%",
    },
    {
        name: 'UpdateMSCRMRecords',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-update-records.html',
        guideUrl: 'https://ampscript.guide/updatemscrmrecords/',
        minArgs: 4,
        maxArgs: INF,
        category: 'Microsoft Dynamics CRM',
        description:
            'Updates one or more records in a Microsoft Dynamics CRM entity, and returns the number of successfully updated records.',
        params: [
            {
                name: 'entityName',
                description:
                    'The name of the Microsoft Dynamics CRM entity that contains the records to update',
                type: 'string',
            },
            {
                name: 'guidsToUpdate',
                description: 'A comma-separated list of GUIDs to update',
                type: 'string',
            },
            {
                name: 'attributeName1',
                description: 'The name of the attribute to update on the target records',
                type: 'string',
            },
            {
                name: 'attributeValue1',
                description: 'The attribute value to update on the target records',
            },
            {
                name: 'attributeNameN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional attribute name',
                type: 'string',
                optional: true,
            },
            { name: 'attributeValueN', description: 'Additional attribute value', optional: true },
        ],
        returnType: 'number',
        returnDescription: 'The number of Microsoft Dynamics CRM records updated.',
        repeat: [{ startIndex: 2, groupSize: 2, minGroups: 1 }],
        syntax: 'UpdateMSCRMRecords(entityName, guidsToUpdate, attributeName1, attributeValue1[, attributeNameN, attributeValueN, ...])',
        example: "%%=UpdateMSCRMRecords('contact', @guids, 'lastname', 'Smith')=%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'UpdateSingleSalesforceObject',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-salesforce/mc-ampscript-reference-salesforce-update-single-object.html',
        guideUrl: 'https://ampscript.guide/updatesinglesalesforceobject/',
        sfmcGuideUrl:
            'https://sfmc.guide/engagement/ampscript/functions/updatesinglesalesforceobject/',
        minArgs: 4,
        maxArgs: INF,
        category: 'Sales and Service Cloud',
        description:
            'Updates a single record in a connected Salesforce Sales or Service Cloud object via Marketing Cloud Connect. Accepts one or more field name and value pairs. Returns 1 on success; per the official reference it returns 0 on failure, but on a CloudPage a failed update (unknown object, malformed or non-existent record ID) instead surfaces the SOAP fault as an uncatchable page abort rather than returning 0.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        officialDocsNote:
            'The success token 1 was runtime-proven on cred/DEV (MID 510007949), which has an active Marketing Cloud Connect integration to a real Salesforce org: updating one field of a record created moments earlier in the same run (a benign Task) returned the literal 1 with the page rendering fully. The failure token 0 is NOT observable in CloudPage GET context: every safe induced failure (unknown object, a malformed ID, and a well-formed but non-existent Lead ID at both 15 and 18 characters, on a real field) aborted the whole page with HTTP 422 — the SOAP fault propagates as an uncatchable page abort (identical to CreateSalesforceObject and RetrieveSalesforceObjects against a bad target), so the documented 0 return never materialises to be read. returnEnum is therefore left unset: only 1 is provable here, and asserting a [0,1] enum would ship the unproven 0 token. returnType stays number and the 0/1 semantics are retained in the description as a documented fact attributed to the official reference. The 0-on-CloudPage-abort behaviour is a context observation, not a contradiction of the send/preview-context 0/1 contract, so differsFromOfficialDocs stays false.',
        params: [
            {
                name: 'objectName',
                description: 'The API name of the Salesforce object to update',
                type: 'string',
            },
            { name: 'idToUpdate', description: 'The ID of the record to update', type: 'string' },
            {
                name: 'fieldName1',
                description: 'The name of the first field to update',
                type: 'string',
            },
            { name: 'fieldValue1', description: 'The value to assign to the first named field' },
            {
                name: 'fieldNameN',
                description: 'Additional field name',
                type: 'string',
                optional: true,
            },
            { name: 'fieldValueN', description: 'Additional field value', optional: true },
        ],
        returnType: 'number',
        returnDescription:
            '1 when the record was updated successfully (runtime-proven). Per the official reference a failed update returns 0, but on a CloudPage a failure aborts the page (HTTP 422) instead of returning 0, so the 0 token is not observable in that context.',
        repeat: [{ startIndex: 2, groupSize: 2, minGroups: 1 }],
        syntax: 'UpdateSingleSalesforceObject(objectName, idToUpdate, fieldName1, fieldValue1[, fieldNameN, fieldValueN, ...])',
        example: "%%=UpdateSingleSalesforceObject('Contact', @recordId, 'LastName', 'Smith')=%%",
    },
    {
        name: 'Uppercase',
        mcnSince: 67,
        handlebarsEquivalent: 'uppercase',
        handlebarsExact: true,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-string/mc-ampscript-reference-string-uppercase.html',
        guideUrl: 'https://ampscript.guide/uppercase/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/uppercase/',
        minArgs: 1,
        maxArgs: 1,
        isConfirmed: true,
        differsFromOfficialDocs: false,
        category: 'String',
        description:
            'Converts a string to all uppercase characters. The German sharp s remains unchanged rather than expanding to SS.',
        params: [
            {
                name: 'sourceString',
                description: 'String to convert',
                type: 'string|number|date',
            },
        ],
        returnType: 'string',
        returnDescription: 'The string converted to upper case.',
        syntax: 'Uppercase(sourceString)',
        example: "%%=Uppercase('hello')=%%",
    },
    {
        name: 'UpsertContact',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-contacts/mc-ampscript-reference-contacts-upsert-contact.html',
        guideUrl: 'https://ampscript.guide/upsertcontact/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/upsertcontact/',
        minArgs: 5,
        maxArgs: INF,
        category: 'MobileConnect',
        description:
            "Upserts attributes onto a mobile contact matched by phone number. If the contact exists it is updated; otherwise a new contact is created. Returns a status code: 0 when the upsert succeeds and 1 when an error occurs. The only supported channel is 'mobile' and the only supported match attribute is 'phone'. An unknown attribute name returns the error status without writing anything.",
        isConfirmed: true,
        differsFromOfficialDocs: false,
        officialDocsNote:
            'Both return tokens were runtime-proven on cred/DEV (MID 510007949). The success status 0 was proven by creating a brand-new mobile contact keyed on an opaque, unreachable phone number in a reserved test range with a documented system attribute (_ZipCode); calling the same key a second time with a different value updated that contact and again returned 0, so both the create and update branches of the upsert return 0. The error status 1 was proven three independent ways (unsupported channel, unsupported match attribute, non-numeric phone) and again by passing an attribute name that is not a defined MobileConnect attribute — each returned 1 with the page rendering fully and no write performed. The return is a status code (0 success / 1 error), not a count of records. The phone-number argument accepts both an integer literal and a numeric string (both returned 0 for a successful create). runtime matches the official reference, so differsFromOfficialDocs stays false.',
        params: [
            {
                name: 'channel',
                description: "The contact channel. The only supported value is 'mobile'",
                type: 'string',
            },
            {
                name: 'attribute',
                description:
                    "The attribute to use to match the contact. The only supported value is 'phone'",
                type: 'string',
            },
            {
                name: 'phoneNumber',
                description: 'The phone number of the contact, including the country code',
                type: 'string|number',
            },
            {
                name: 'keyToUpsert1',
                description: 'The name of the attribute to upsert',
                type: 'string',
            },
            {
                name: 'valueToUpsert1',
                description: 'The value of the attribute to upsert',
                type: 'string',
            },
            {
                name: 'keyToUpsertN',
                mcnSince: null,
                mcnNotes: null,
                description: 'Additional attribute name',
                type: 'string',
                optional: true,
            },
            { name: 'valueToUpsertN', description: 'Additional attribute value', optional: true },
        ],
        returnType: 'number',
        returnEnum: [0, 1],
        returnDescription:
            'A status code: 0 when the upsert succeeds (both creating a new contact and updating an existing one), 1 when an error occurs. Both tokens were proven at runtime.',
        repeat: [{ startIndex: 3, groupSize: 2, minGroups: 1 }],
        syntax: 'UpsertContact(channel, attribute, phoneNumber, keyToUpsert1, valueToUpsert1[, keyToUpsertN, valueToUpsertN, ...])',
        example: "%%=UpsertContact('mobile', 'phone', 14255550142, '_ZipCode', '98026')=%%",
    },
    {
        name: 'UpsertData',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-upsert-data.html',
        guideUrl: 'https://ampscript.guide/upsertdata/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/upsertdata/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 6,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Updates a row in a data extension if matching columns and values are found, or inserts a row if no matches are found. Returns the number of rows affected.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension to update or insert data into',
                type: 'string',
            },
            {
                name: 'columnValuePairs',
                description:
                    'The number of column and value pairs for the function to match against',
                type: 'number',
            },
            {
                name: 'searchColumnName1',
                description: 'The name of the column to search',
                type: 'string',
            },
            {
                name: 'searchValue1',
                description: 'The value that identifies the row to update or insert',
            },
            {
                name: 'searchColumnNameN',
                description: 'Additional search column name (count given by columnValuePairs)',
                type: 'string',
                optional: true,
            },
            {
                name: 'searchValueN',
                description: 'Additional search value (count given by columnValuePairs)',
                optional: true,
            },
            {
                name: 'columnToUpsert1',
                description: 'The column to update or insert data into',
                type: 'string',
            },
            {
                name: 'upsertedValue1',
                description: 'The value to update or insert into the specified column',
            },
            {
                name: 'columnToUpsertN',
                description: 'Additional column to update or insert',
                type: 'string',
                optional: true,
            },
            {
                name: 'upsertedValueN',
                description: 'Additional value to update or insert',
                optional: true,
            },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows inserted or updated.',
        repeat: [
            { startIndex: 2, groupSize: 2, minGroups: 1, countParam: 'columnValuePairs' },
            { startIndex: 4, groupSize: 2, minGroups: 1 },
        ],
        syntax: 'UpsertData(dataExt, columnValuePairs, searchColumnName1, searchValue1[, searchColumnNameN, searchValueN, ...], columnToUpsert1, upsertedValue1[, columnToUpsertN, upsertedValueN, ...])',
        example:
            "%%=UpsertData('Subscribers', 1, 'SubscriberKey', _subscriberkey, 'Status', 'Active')=%%",
    },
    {
        name: 'UpsertDE',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-data-extension/mc-ampscript-reference-data-extension-upsert-de.html',
        guideUrl: 'https://ampscript.guide/upsertde/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/upsertde/',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        minArgs: 6,
        maxArgs: INF,
        category: 'Data Extension',
        description:
            'Updates or inserts a row in a data extension. Email-context variant of UpsertData. Returns the number of rows affected.',
        params: [
            {
                name: 'dataExt',
                description: 'The name of the data extension to update or insert data into',
                type: 'string',
            },
            {
                name: 'columnValuePairs',
                description:
                    'The number of column and value pairs for the function to match against',
                type: 'number',
            },
            {
                name: 'searchColumnName1',
                description: 'The name of the column to search',
                type: 'string',
            },
            {
                name: 'searchValue1',
                description: 'The value that identifies the row to update or insert',
            },
            {
                name: 'searchColumnNameN',
                description: 'Additional search column name (count given by columnValuePairs)',
                type: 'string',
                optional: true,
            },
            {
                name: 'searchValueN',
                description: 'Additional search value (count given by columnValuePairs)',
                optional: true,
            },
            {
                name: 'columnToUpsert1',
                description: 'The column to update or insert data into',
                type: 'string',
            },
            {
                name: 'upsertedValue1',
                description: 'The value to update or insert into the specified column',
            },
            {
                name: 'columnToUpsertN',
                description: 'Additional column to update or insert',
                type: 'string',
                optional: true,
            },
            {
                name: 'upsertedValueN',
                description: 'Additional value to update or insert',
                optional: true,
            },
        ],
        returnType: 'number',
        returnDescription: 'The number of rows inserted or updated.',
        repeat: [
            { startIndex: 2, groupSize: 2, minGroups: 1, countParam: 'columnValuePairs' },
            { startIndex: 4, groupSize: 2, minGroups: 1 },
        ],
        syntax: 'UpsertDE(dataExt, columnValuePairs, searchColumnName1, searchValue1[, searchColumnNameN, searchValueN, ...], columnToUpsert1, upsertedValue1[, columnToUpsertN, upsertedValueN, ...])',
        example:
            "%%=UpsertDE('Subscribers', 1, 'SubscriberKey', _subscriberkey, 'Status', 'Active')=%%",
    },
    {
        name: 'UpsertMSCRMRecord',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-mscrm/mc-ampscript-reference-microsoft-dynamics-crm-upsert-record.html',
        guideUrl: 'https://ampscript.guide/upsertmscrmrecord/',
        minArgs: 9,
        maxArgs: 9,
        category: 'Microsoft Dynamics CRM',
        description:
            'Upserts a Microsoft Dynamics CRM record. Updates the matched record or creates one if no match is found. Returns the GUID of the record.',
        params: [
            {
                name: 'entityName',
                description: 'The name of the Microsoft Dynamics CRM entity to upsert',
                type: 'string',
            },
            {
                name: 'sortField',
                mcnSince: null,
                mcnNotes: null,
                description: 'The field to sort the retrieve results on',
                type: 'string',
            },
            {
                name: 'sortType',
                description: 'The order to sort retrieve results. Accepted values: ASC or DESC',
                type: 'string',
            },
            {
                name: 'numPairsForRetrieve',
                description: 'The number of name-value pairs used to retrieve results',
                type: 'number',
            },
            {
                name: 'filterAttributeName',
                description: 'The name of the attribute to filter the target entity by',
                type: 'string',
            },
            {
                name: 'filterAttributeValue',
                description: 'The value of the attribute to filter the target entity by',
                type: 'string',
            },
            {
                name: 'numPairsForUpdate',
                description: 'The number of name-value pairs used to update records',
                type: 'number',
            },
            {
                name: 'updateAttributeName',
                description: 'The name of the attribute to update in the target entity',
                type: 'string',
            },
            {
                name: 'updateAttributeValue',
                description: 'The value of the attribute to update in the target entity',
                type: 'string',
            },
        ],
        returnType: 'string',
        returnDescription: 'The GUID of the created or updated Microsoft Dynamics CRM record.',
        syntax: 'UpsertMSCRMRecord(entityName, sortField, sortType, numPairsForRetrieve, filterAttributeName, filterAttributeValue, numPairsForUpdate, updateAttributeName, updateAttributeValue)',
        example:
            "%%=UpsertMSCRMRecord('contact', 'createdon', 'DESC', 1, 'emailaddress1', @email, 1, 'lastname', 'Smith')=%%",
        isConfirmed: true,
        nonFunctionalAtRuntime: true,
        deprecated: true,
        deprecatedReason:
            'The Marketing Cloud Connector for Microsoft Dynamics CRM was retired (online integration in December 2020, on-premises in October 2021), so the Dynamics CRM AMPscript functions no longer have a live integration to call and are non-functional. No replacement AMPscript function exists; integrate Dynamics data through the SFTP import/export or a custom API instead.',
    },
    {
        name: 'URLEncode',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-url-encode.html',
        guideUrl: 'https://ampscript.guide/urlencode/',
        minArgs: 1,
        maxArgs: 3,
        category: 'Encryption and Encoding',
        description:
            'URL-encodes a string for safe inclusion in a URL. By default only the part after a question mark is touched, so a value that is not a URL passes through unchanged unless the third argument is switched on.',
        isConfirmed: true,
        differsFromOfficialDocs: false,
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/urlencode/',
        params: [
            {
                name: 'urlToEncode',
                description: 'The string to convert to a format that is safe to include in URLs',
                type: 'string|number',
            },
            {
                name: 'encodeAllChars',
                mcnSince: null,
                mcnNotes: null,
                description:
                    'When switched on, every reserved character of the query string is percent-encoded and spaces become plus signs; when off, only spaces are encoded, as %20. Accepts 1/0, true/false, or those spellings quoted. Defaults to off',
                type: 'string|boolean|number',
                optional: true,
                default: false,
            },
            {
                name: 'encodeAllStrings',
                description:
                    'When switched on, the whole input is encoded even if it is not a URL; when off, only the part after a question mark is encoded. Accepts 1/0, true/false, or those spellings quoted. Defaults to off',
                type: 'string|boolean|number',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription: 'The URL-encoded representation of the input.',
        syntax: 'URLEncode(urlToEncode[, encodeAllChars, encodeAllStrings])',
        example: "%%=URLEncode('hello world')=%%",
    },
    {
        name: 'Verb',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-sms/mc-ampscript-reference-sms-verb.html',
        guideUrl: 'https://ampscript.guide/mobileconnect-data-strings/',
        minArgs: 0,
        maxArgs: 0,
        category: 'MobileConnect',
        description:
            'Returns the keyword (verb) from an inbound mobile-originated (MO) message. Only usable in MobileConnect, chained off Msg(0). Takes no arguments.',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
        officialDocsNote:
            'Could not runtime-verify on the only available context (a CloudPage GET on cred/DEV, MID 510007949; no parent-BU escalation on this tenant). Verb is chained off Msg(0), and any page containing a Msg(0) construct aborts at compile time (HTTP 422) on a CloudPage while an otherwise identical page without it renders HTTP 200. This matches the official reference, which restricts the function to MobileConnect and forbids landing pages / other content types; a CloudPage supplies no mobile-originated message to parse.',
        params: [],
        returnType: 'string',
        returnDescription: 'The keyword (first word) of the inbound mobile-originated message.',
        syntax: 'Msg(0).Verb',
        example: '%%=Msg(0).Verb=%%',
    },
    {
        name: 'v',
        mcnSince: 67,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-utilities/mc-ampscript-reference-utilities-v.html',
        guideUrl: 'https://ampscript.guide/v/',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/v/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Outputs a value inline, normally a variable reference. A string or number literal and a nested function call are accepted as well, each rendering its own value.',
        params: [
            {
                name: 'variableName',
                description: 'Variable reference, literal or nested function call to output',
                type: 'string|number',
            },
        ],
        returnType: 'string',
        returnDescription: 'The referenced value rendered as a string.',
        syntax: 'v(variableName)',
        example: '%%=v(@myVar)=%%',
        isConfirmed: true,
    },
    {
        name: 'WAT',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-wat.html',
        guideUrl: 'https://ampscript.guide/wat/',
        minArgs: 2,
        maxArgs: INF,
        category: 'Utility',
        description:
            'Returns the values of the Web Analytics Tracking (WAT) parameter set with the specified external key, substituting the supplied values for the matching WATP references in the Sender Profile tracking parameter.',
        params: [
            {
                name: 'parameterSetKey',
                description: 'The external key of the WAT parameter set',
                type: 'string',
            },
            {
                name: 'parameterValue1',
                description: 'Value used to replace the WATP(1) tracking parameter reference',
                type: 'string',
            },
            {
                name: 'parameterValueN',
                description: 'Additional value used to replace the WATP(N) reference',
                type: 'string',
                optional: true,
            },
        ],
        returnType: 'string',
        returnDescription:
            'The resolved Web Analytics tracking parameter value with the supplied substitutions applied.',
        repeat: [{ startIndex: 1, groupSize: 1, minGroups: 1 }],
        syntax: 'WAT(parameterSetKey, parameterValue1[, parameterValueN, ...])',
        example: "%%=WAT('Omniture', '1234', '5678')=%%",
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
    },
    {
        name: 'WATP',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-content/mc-ampscript-reference-content-wat.html',
        guideUrl: 'https://ampscript.guide/watp/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Ordinal placeholder for a parameter value configured in a WAT parameter set. The ordinal maps to the position of the value passed to the WAT function. Configured by Marketing Cloud Support as part of the WAT string.',
        params: [
            {
                name: 'ordinal',
                description: 'The position of the parameter value within the WAT string (1-based)',
                type: 'number',
            },
        ],
        returnType: 'string',
        returnDescription:
            'The parameter value supplied to the WAT function at the given ordinal position.',
        syntax: 'WATP(ordinal)',
        example: '%%=urlencode(WATP(1))=%%',
        isConfirmed: false,
        verificationBlocked: true,
        verificationBlockedReason: 'no-working-invocation',
    },
    {
        name: 'WrapLongURL',
        mcnSince: null,
        handlebarsEquivalent: null,
        mcnNotes: null,
        docUrl: 'https://developer.salesforce.com/docs/marketing/marketing-cloud-ampscript/references/mc-ampscript-http/mc-ampscript-reference-http-wrap-long-url.html',
        guideUrl: 'https://ampscript.guide/wraplongurl/',
        minArgs: 1,
        maxArgs: 1,
        category: 'Utility',
        description:
            'Shortens a long URL for email clients that truncate long hyperlinks. Outside an email send the argument comes back unchanged, so a CloudPage never sees a shortened link.',
        isConfirmed: true,
        differsFromOfficialDocs: true,
        officialDocsNote:
            'The official reference states that a URL longer than 975 characters comes back as a shortened link that redirects through the platform. On a live Engagement CloudPage on the child business unit (MID 518005426) a 1048-character URL was returned byte for byte unchanged at the same length, twice in one render, and the same held for a 27-character URL, an empty string and a string that is not a URL at all. The community guide notes that shortening only happens on a send, which the official page does not mention.',
        sfmcGuideUrl: 'https://sfmc.guide/engagement/ampscript/functions/wraplongurl/',
        params: [{ name: 'url', description: 'URL to shorten', type: 'string|number' }],
        returnType: 'string',
        returnDescription:
            'The shortened URL when the call happens during a send; in any other context the supplied value unchanged.',
        syntax: 'WrapLongURL(url)',
        example: "%%=WrapLongURL('https://example.com/a/very/long/path')=%%",
    },
];

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

// ── Email-context restrictions ───────────────────────────────────────────────

const EMAIL_EXCLUDED_CATEGORIES = new Set(['Marketing Cloud API']);

const EMAIL_EXCLUDED_FUNCTIONS = new Set([
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

// ── Keywords ─────────────────────────────────────────────────────────────────

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

// ── Operators ────────────────────────────────────────────────────────────────

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

// ── Personalization strings ──────────────────────────────────────────────────

export const AMPSCRIPT_GLOBALS = [
    {
        name: '@@ExecCtx',
        description:
            'Read-only web-page execution context indicator. Returns load or post, although current Marketing Cloud behavior always returns load.',
    },
];

export const PERSONALIZATION_STRINGS = [
    {
        name: '_subscriberkey',
        mcnSince: null,
        mcnNotes: null,
        description: 'Unique identifier for the current subscriber or contact',
    },
    { name: 'emailaddr', description: 'Email address associated with the current subscriber' },
    { name: 'subscriberid', description: 'Numeric identifier in the All Subscribers list' },
    { name: 'firstname', description: 'First name attribute of the subscriber' },
    {
        name: 'firstname_',
        description: 'First name attribute of the subscriber (underscored alias)',
    },
    { name: 'lastname', description: 'Last name attribute of the subscriber' },
    { name: 'lastname_', description: 'Last name attribute of the subscriber (underscored alias)' },
    { name: 'emailname_', description: 'Display name of the current email message' },
    { name: '_emailid', description: 'Numeric identifier of the current email' },
    { name: 'jobid', description: 'Numeric job identifier for the current send operation' },
    { name: '_JobSubscriberBatchID', description: 'Batch identifier within the current send job' },
    {
        name: '_PreHeader',
        description:
            'Preheader text associated with the current email; resolves only when retrieved through AttributeValue()',
    },
    { name: '_DataSourceName', description: 'Name of the data source driving the current send' },
    {
        name: '_messagecontext',
        mcnSince: null,
        mcnNotes: null,
        description:
            'Render context indicator: SEND, PREVIEW, VAWP, FTAF, LANDINGPAGE, VALIDATION, LINKRESOLUTION, SMS, or SOCIAL',
    },
    { name: '_IsTestSend', description: 'Flag indicating whether this is a test send' },
    {
        name: '_messagetypepreference',
        mcnSince: null,
        mcnNotes: null,
        description: 'Subscriber preference for HTML or plain-text messages',
    },
    { name: 'listid', description: 'Numeric identifier of the current send list' },
    { name: '_listname', description: 'Display name of the current send list' },
    {
        name: 'list_',
        description: 'List identifier suffixed with _TEXT or _HTML for the subscriber email type',
    },
    { name: 'listsubid', description: 'Subscriber identifier within a specific list' },
    { name: 'xtmonth', description: 'Full month name of the send date' },
    { name: 'xtmonthnumeric', description: 'Numeric month of the send date (1 through 12)' },
    { name: 'xtday', description: 'Day of month of the send date' },
    { name: 'xtdayofweek', description: 'Weekday name of the send date' },
    { name: 'xtyear', description: 'Four-digit year of the send date' },
    { name: 'xtshortdate', description: 'Send date in short date format' },
    { name: 'xtlongdate', description: 'Send date in long date format' },
    { name: 'replyname', description: 'From name configured for the current send' },
    {
        name: 'replyemailaddress',
        mcnSince: null,
        mcnNotes: null,
        description: 'From email address configured for the current send',
    },
    { name: 'memberid', description: 'Member ID (MID) of the sending business unit' },
    { name: 'member_busname', description: 'Business name of the sending business unit' },
    { name: 'member_addr', description: 'Street address of the sending business unit' },
    { name: 'member_city', description: 'City of the sending business unit' },
    { name: 'member_state', description: 'State or province of the sending business unit' },
    { name: 'member_postalcode', description: 'Postal code of the sending business unit' },
    { name: 'member_country', description: 'Country of the sending business unit' },
    { name: 'view_email_url', description: 'URL for the View as Web Page version of the email' },
    { name: 'ftaf_url', description: 'Forward to a Friend URL' },
    { name: 'subscription_center_url', description: 'URL to the subscription management center' },
    { name: 'profile_center_url', description: 'URL to the subscriber profile center' },
    { name: 'unsub_center_url', description: 'URL to the unsubscribe center' },
    { name: 'double_opt_in_url', description: 'URL for double opt-in confirmation' },
    {
        name: '_replycontent',
        mcnSince: null,
        mcnNotes: null,
        description:
            'Plain-text abstract of the first 10,000 characters from a subscriber reply via Reply Mail Management',
    },
    {
        name: '_RMM_Headers',
        description: 'Full email message header of the reply via Reply Mail Management',
    },
    {
        name: '_RMM_ReplyBodyText',
        description: 'Plain-text body of the reply via Reply Mail Management',
    },
    {
        name: '_RMM_ReplyBodyHTML',
        description: 'HTML body of the reply via Reply Mail Management',
    },
    {
        name: '_RMM_ReplySubject',
        description: 'Subject line of the reply via Reply Mail Management',
    },
    {
        name: '_RMM_JobID',
        description: 'Job ID of the email the subscriber replied to via Reply Mail Management',
    },
    {
        name: '_RMM_ListID',
        description: 'List ID of the email the subscriber replied to via Reply Mail Management',
    },
    {
        name: '_RMM_BatchID',
        description: 'Batch ID of the email the subscriber replied to via Reply Mail Management',
    },
    {
        name: '_RMM_SubscriberID',
        description: 'Subscriber ID of the replying subscriber via Reply Mail Management',
    },
    {
        name: '_RMM_RecipientEmailAddress',
        description: 'Email address of the replying subscriber via Reply Mail Management',
    },
    {
        name: '_RMM_RecipientSubscriberKey',
        description: 'Subscriber key of the replying subscriber via Reply Mail Management',
    },
    { name: 'linkname', description: 'Alias or name assigned to the current tracked link' },
    {
        name: '_ImpressionRegionID',
        mcnSince: null,
        mcnNotes: null,
        description: 'Numeric identifier of the current impression region',
    },
    { name: '_ImpressionRegionName', description: 'Display name of the current impression region' },
    {
        name: 'AdditionalInfo_',
        description:
            'Value of the Additional Info field, appended to email links (Parameter Manager)',
    },
    {
        name: '__AdditionalEmailAttribute[n]',
        description:
            'Value of an Additional Email Attribute field (n is 1 through 5), appended to email links (Parameter Manager)',
        matcher: /^__AdditionalEmailAttribute[1-5]$/i,
    },
    { name: 'PAGEURL', description: 'URL of the current CloudPages or microsite page' },
    { name: 'MOBILE_NUMBER', description: 'Mobile number of the inbound SMS sender' },
    { name: 'SHORT_CODE', description: 'Short code or long code that received the SMS' },
    { name: 'MSG(0)', description: 'Complete text of the inbound SMS message' },
    { name: 'MSG(0).VERB', description: 'First word (keyword) of the inbound SMS' },
    { name: 'MSG(0).NOUNS', description: 'All text following the keyword in the inbound SMS' },
    {
        name: 'MSG(0).NOUN([n])',
        description: 'The nth word (noun) of the inbound SMS message, zero-based index',
        matcher: /^MSG\(0\)\.NOUN\(\d+\)$/i,
    },
    {
        name: 'MMS_CONTENT_URL([n])',
        description: 'URL of the nth MMS attachment, zero-based index',
        matcher: /^MMS_CONTENT_URL\(\d+\)$/i,
    },
    { name: '_CarrierID', description: 'Carrier identifier for a MobileConnect contact' },
    { name: '_Channel', description: 'Messaging channel for a MobileConnect contact' },
    { name: '_City', description: 'City from MobileConnect contact demographics' },
    { name: '_ContactID', description: 'Contact identifier in MobileConnect' },
    { name: '_CountryCode', description: 'Country code from MobileConnect contact demographics' },
    { name: '_CreatedBy', description: 'User who created the MobileConnect contact record' },
    { name: '_CreatedDate', description: 'Timestamp when the MobileConnect contact was created' },
    { name: '_FirstName', description: 'First name of the MobileConnect contact' },
    {
        name: '_IsHonorDST',
        description: "Whether the MobileConnect contact's time zone honors Daylight Savings Time",
    },
    { name: '_LastName', description: 'Last name of the MobileConnect contact' },
    { name: '_MobileNumber', description: 'Mobile number of the MobileConnect contact' },
    { name: '_ModifiedBy', description: 'User who last modified the MobileConnect contact' },
    {
        name: '_ModifiedDate',
        mcnSince: null,
        mcnNotes: null,
        description: 'Timestamp of the last modification to the MobileConnect contact',
    },
    { name: '_Priority', description: 'Message priority for the MobileConnect contact' },
    {
        name: '_Source',
        mcnSince: null,
        mcnNotes: null,
        description: 'Origin channel through which the MobileConnect contact was added',
    },
    {
        name: '_SourceObjectID',
        mcnSince: null,
        mcnNotes: null,
        description: 'Source object identifier for the MobileConnect contact',
    },
    { name: '_State', description: 'State from MobileConnect contact demographics' },
    { name: '_Status', description: 'Subscription status of the MobileConnect contact' },
    { name: '_UTCOffset', description: 'UTC offset for the MobileConnect contact timezone' },
    { name: '_ZipCode', description: 'ZIP or postal code from MobileConnect contact demographics' },
    { name: 'LINE_ADDRESS_ID', description: 'LINE user address identifier for GroupConnect' },
    { name: 'LINE_JOB_ID', description: 'Unique LINE job identifier for GroupConnect' },
    {
        name: 'LINE_SUBSCRIBER_ID',
        description: 'Corresponding Marketing Cloud subscriber identifier for GroupConnect',
    },
    { name: 'TEXT', description: 'Complete inbound GroupConnect message text' },
    { name: 'VERB', description: 'First word (keyword) of the inbound GroupConnect message' },
    { name: 'TEXT.NOUN', description: 'All words after the verb in the GroupConnect message' },
    {
        name: 'TEXT.NOUN([n])',
        description: 'The nth word (noun) of the GroupConnect message, zero-based index',
        matcher: /^TEXT\.NOUN\(\d+\)$/i,
    },
    {
        name: 'STKR.STKPKGID',
        description: 'Package ID of a sticker in a LINE GroupConnect message',
    },
    { name: 'STKR.STKID', description: 'ID of a sticker in a LINE GroupConnect message' },
    { name: 'STKR.STKTXT', description: 'Text of a sticker in a LINE GroupConnect message' },
];

/**
 * Set of lowercase names for system personalization strings that are matched
 * exactly (i.e. entries without a `matcher` pattern).
 */
const personalizationStringExactNames = new Set(
    PERSONALIZATION_STRINGS.filter((entry) => !entry.matcher).map((entry) =>
        entry.name.toLowerCase(),
    ),
);

/**
 * Regex matchers for parameterized system personalization strings (e.g.
 * `MSG(0).NOUN([n])`). Each matcher is anchored and case-insensitive.
 */
const personalizationStringMatchers = PERSONALIZATION_STRINGS.filter((entry) => entry.matcher).map(
    (entry) => entry.matcher,
);

/**
 * Returns true when the given name is a known Marketing Cloud system
 * personalization string, either as an exact catalog entry or a valid
 * parameterized form (e.g. `MSG(0).NOUN(0)`). Matching is case-insensitive.
 *
 * @param {string} name - Personalization string name to test (without brackets).
 * @returns {boolean} True when the name is a known system personalization string.
 */
export function isSystemPersonalizationString(name) {
    if (typeof name !== 'string' || name.length === 0) {
        return false;
    }
    const trimmed = name.trim();
    if (personalizationStringExactNames.has(trimmed.toLowerCase())) {
        return true;
    }
    return personalizationStringMatchers.some((matcher) => matcher.test(trimmed));
}
