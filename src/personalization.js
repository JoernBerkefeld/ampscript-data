// AUTO-SPLIT from the original single-file src/index.js. Data moved verbatim.

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
