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
            'No working CloudPage invocation was found. Any valid-arity call aborts the whole page with HTTP 422 at compile time, even when placed inside an unreached IF gate, so it cannot be probed behind a query-string switch. Two signature shapes were each deployed as the whole page: the catalog form RatingStars(4, 5, "https://example.com/star.png") and the ampscript.guide form RatingStars(5, "yellow", 25). Both returned HTTP 422 on the child BU and again on the parent BU. The surrounding harness structure (RequestParameter gating, IF/ELSE/ENDIF) returned HTTP 200 once the RatingStars call was removed, confirming the abort is caused by the function itself, not the harness. RatingStars is an Einstein Email Recommendations helper that appears to resolve only inside the recommendations rendering context, which a bare CloudPage does not supply.',
    },
];
