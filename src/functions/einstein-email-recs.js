// AUTO-SPLIT from the original single-file src/index.js. Data moved verbatim.
// AMPscript FUNCTIONS — category: Einstein Email Recommendations (1 entries).

export const EINSTEIN_EMAIL_RECS_FUNCTIONS = [
    {
        name: 'RatingStars',
        supportedInCloudPage: false,
        supportedInEmail: false,
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
            'No working CloudPage invocation exists. Any valid-arity call aborts the whole page with HTTP 422 at compile time, even when placed inside an unreached IF branch, so it cannot be hidden behind a query-string switch. Two signature shapes both abort: the catalog form RatingStars(4, 5, "https://example.com/star.png") and the ampscript.guide form RatingStars(5, "yellow", 25). An otherwise identical page returns HTTP 200 once the RatingStars call is removed, confirming the abort is caused by the function itself rather than the surrounding page. RatingStars is an Einstein Email Recommendations helper that appears to resolve only inside the recommendations rendering context, which a bare CloudPage does not supply.',
    },
];
