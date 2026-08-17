// AUTO-SPLIT from the original single-file src/index.js. Data moved verbatim.
// AMPscript FUNCTIONS — category: Date and Time (10 entries).

export const DATE_TIME_FUNCTIONS = [
    {
        name: 'DateAdd',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        name: 'FormatDate',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
            'Proven on the child BU. The official reference presents one .NET-style custom-pattern table and shows it applied to the dateFormat argument, but at runtime the two format arguments use SEPARATE, case-INSENSITIVE token sets. In dateFormat, mm and MM both render the MONTH, so the documented pattern yyyy-MM-dd HH:mm:ss returned 2026-03-04 13:03:07 for the instant 2026-03-04 13:52:07 — the minutes position printed 03, the month. The same pattern moved to timeFormat returned 13:52:07 correctly, because there mm and MM mean minutes. Single-letter tokens also disagree with the doc: d rendered the whole short date 3/4/2026 rather than the day number, M rendered March 4 rather than 3, and h or H alone in timeFormat aborts the page with HTTP 422 instead of rendering an hour. The day-name tokens are off by one repetition — dddd rendered Wed where the doc promises Wednesday, ddddd rendered Wednesday, and ddd rendered the corrupted string We4ne74a26 in which digits from the date replaced letters of the day name.',
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
        name: 'GetSendTime',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        isConfirmed: true,
        differsFromOfficialDocs: false,
        officialDocsNote:
            'Runtime-verified. The function has a working invocation (arity 0 and 1) that renders a real date value in every argument spelling, and its observed behaviour is consistent with the official reference. Probed on the child BU: GetSendTime() rendered 8/8/2026 7:35:16 PM against Now()=8/8/2026 7:35:16 PM in the same render, with FormatDate(..., "ffffff") giving 507042 for both, so the two are the same instant to the microsecond rather than merely the same second. Every argument spelling (1, 0, true, false, "1", "0", "true", "false", and the non-flag word spring) was accepted at HTTP 200 and returned that same current time, and DateDiff(GetSendTime(1), Now(), "MI") was 0. The value is a real date (FormatDate gave 2026-08-08, DatePart gave 2026 and 7, DateAdd of three hours advanced it, DateDiff measured that gap as 3), it renders as a US short date plus a 12-hour clock (Length 19 for that instant), Empty() over it is False, and it sits on the system side of the clock (DateDiff to SystemDateToLocalDate was 480 minutes, identical to the same measurement over Now()); arity 2 aborts with HTTP 422. This matches the official reference\'s "during a send" row, which states both call forms return the current system time. The after-send value was also captured from a REAL send job via send-context UpsertDE writeback into a results DE: a User-Initiated Send (messaging-experimental/v1/email/send) rendered GetSendTime() as 8/15/2026 10:31:40 AM, identical to Now() in the same send, confirming the send-execution system time. A test send does not fire the writeback (upsert operations run only at send-completion), and the send must target at least one deliverable subscriber or it completes without running the body. The function is fully working and correctly catalogued as verified; it is not a Sender-Authenticated-Redirection / session-state function, so no authenticated-context caveat applies.',
    },
    {
        name: 'LocalDateToSystemDate',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        name: 'Now',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        name: 'StringToDate',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
        name: 'SystemDateToLocalDate',
        supportedInCloudPage: true,
        supportedInEmail: true,
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
];
