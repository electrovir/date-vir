// cspell:disable

import {TimezoneName} from './timezones.js';

/**
 * Maps a timezone abbreviation that a human would type (or that a web page would print next to a
 * time) to the IANA timezone it most likely means.
 *
 * Both halves of a region's pair map to the same zone: `EST` and `EDT` both give
 * `America/New_York`. The abbreviation says which region, the timestamp says which offset. Mapping
 * `EST` to a fixed -5 zone instead would turn a July time labeled `EST` by a site that never
 * bothers to write `EDT` into an hour-off reading.
 *
 * Abbreviations are not unique across the world and IANA never promised they would be, so each
 * collision here is resolved toward the most populous region that uses it: `CST` is US Central and
 * not China or Cuba, `IST` is India and not Ireland or Israel, `AST` is Atlantic and not Arabia,
 * `GST` is the Gulf and not Chamorro, `AMT` is the Amazon and not Armenia. Pass a real IANA name
 * instead when you need one of the others.
 *
 * `EAST`, `GET`, `NRT`, and `WST` are real abbreviations that are also ordinary words or airport
 * codes. Don't feed arbitrary scraped text through {@link getTimezoneFromAbbreviation} expecting
 * those four to miss.
 *
 * `AMST`, `BRST`, `EGST`, `MSD`, and `PYST` name zones that have since abolished the daylight
 * saving they refer to, but people still type them, so they map to the zone anyway.
 *
 * @category Internal
 * @see {@link getTimezoneFromAbbreviation}
 */
export const timezoneAbbreviations: Record<string, TimezoneName> = {
    ACDT: TimezoneName['Australia/Adelaide'],
    ACRT: TimezoneName['America/Rio_Branco'],
    ACST: TimezoneName['Australia/Adelaide'],
    ACT: TimezoneName['Australia/Adelaide'],
    ACWST: TimezoneName['Australia/Eucla'],
    ADT: TimezoneName['America/Halifax'],
    AEDT: TimezoneName['Australia/Sydney'],
    AEST: TimezoneName['Australia/Sydney'],
    AET: TimezoneName['Australia/Sydney'],
    AFT: TimezoneName['Asia/Kabul'],
    AKDT: TimezoneName['America/Anchorage'],
    AKST: TimezoneName['America/Anchorage'],
    AKT: TimezoneName['America/Anchorage'],
    AMST: TimezoneName['America/Manaus'],
    AMT: TimezoneName['America/Manaus'],
    ANAT: TimezoneName['Asia/Kamchatka'],
    AOE: TimezoneName['Etc/GMT+12'],
    ART: TimezoneName['America/Argentina/Buenos_Aires'],
    AST: TimezoneName['America/Halifax'],
    AT: TimezoneName['America/Halifax'],
    AWST: TimezoneName['Australia/Perth'],
    AWT: TimezoneName['Australia/Perth'],
    AZOST: TimezoneName['Atlantic/Azores'],
    AZOT: TimezoneName['Atlantic/Azores'],
    AZT: TimezoneName['Asia/Baku'],
    BNT: TimezoneName['Asia/Brunei'],
    BOT: TimezoneName['America/La_Paz'],
    BRST: TimezoneName['America/Sao_Paulo'],
    BRT: TimezoneName['America/Sao_Paulo'],
    BST: TimezoneName['Europe/London'],
    BTT: TimezoneName['Asia/Thimphu'],
    CAT: TimezoneName['Africa/Maputo'],
    CCT: TimezoneName['Indian/Cocos'],
    CDT: TimezoneName['America/Chicago'],
    CEST: TimezoneName['Europe/Berlin'],
    CET: TimezoneName['Europe/Berlin'],
    CHADT: TimezoneName['Pacific/Chatham'],
    CHAST: TimezoneName['Pacific/Chatham'],
    CHOT: TimezoneName['Asia/Choibalsan'],
    CHST: TimezoneName['Pacific/Guam'],
    CHUT: TimezoneName['Pacific/Chuuk'],
    CKT: TimezoneName['Pacific/Rarotonga'],
    CLST: TimezoneName['America/Santiago'],
    CLT: TimezoneName['America/Santiago'],
    COT: TimezoneName['America/Bogota'],
    CST: TimezoneName['America/Chicago'],
    CT: TimezoneName['America/Chicago'],
    CVT: TimezoneName['Atlantic/Cape_Verde'],
    CXT: TimezoneName['Indian/Christmas'],
    EASST: TimezoneName['Pacific/Easter'],
    EAST: TimezoneName['Pacific/Easter'],
    EAT: TimezoneName['Africa/Nairobi'],
    EDT: TimezoneName['America/New_York'],
    EEST: TimezoneName['Europe/Athens'],
    EET: TimezoneName['Europe/Athens'],
    EGST: TimezoneName['America/Scoresbysund'],
    EGT: TimezoneName['America/Scoresbysund'],
    EST: TimezoneName['America/New_York'],
    ET: TimezoneName['America/New_York'],
    FJT: TimezoneName['Pacific/Fiji'],
    FKST: TimezoneName['Atlantic/Stanley'],
    FNT: TimezoneName['America/Noronha'],
    GALT: TimezoneName['Pacific/Galapagos'],
    GAMT: TimezoneName['Pacific/Gambier'],
    GET: TimezoneName['Asia/Tbilisi'],
    GFT: TimezoneName['America/Cayenne'],
    GILT: TimezoneName['Pacific/Tarawa'],
    GMT: TimezoneName.UTC,
    GST: TimezoneName['Asia/Dubai'],
    GYT: TimezoneName['America/Guyana'],
    HADT: TimezoneName['America/Adak'],
    HAST: TimezoneName['America/Adak'],
    HAT: TimezoneName['America/Adak'],
    HDT: TimezoneName['Pacific/Honolulu'],
    HKT: TimezoneName['Asia/Hong_Kong'],
    HOVT: TimezoneName['Asia/Hovd'],
    HST: TimezoneName['Pacific/Honolulu'],
    HT: TimezoneName['Pacific/Honolulu'],
    ICT: TimezoneName['Asia/Bangkok'],
    IDT: TimezoneName['Asia/Jerusalem'],
    IOT: TimezoneName['Indian/Chagos'],
    IRKT: TimezoneName['Asia/Irkutsk'],
    IRST: TimezoneName['Asia/Tehran'],
    IST: TimezoneName['Asia/Kolkata'],
    JST: TimezoneName['Asia/Tokyo'],
    KALT: TimezoneName['Europe/Kaliningrad'],
    KGT: TimezoneName['Asia/Bishkek'],
    KOST: TimezoneName['Pacific/Kosrae'],
    KRAT: TimezoneName['Asia/Krasnoyarsk'],
    KST: TimezoneName['Asia/Seoul'],
    LHST: TimezoneName['Australia/Lord_Howe'],
    LINT: TimezoneName['Pacific/Kiritimati'],
    MAGT: TimezoneName['Asia/Magadan'],
    MART: TimezoneName['Pacific/Marquesas'],
    MDT: TimezoneName['America/Denver'],
    MESZ: TimezoneName['Europe/Berlin'],
    MEZ: TimezoneName['Europe/Berlin'],
    MHT: TimezoneName['Pacific/Majuro'],
    MMT: TimezoneName['Asia/Yangon'],
    MSD: TimezoneName['Europe/Moscow'],
    MSK: TimezoneName['Europe/Moscow'],
    MST: TimezoneName['America/Denver'],
    MT: TimezoneName['America/Denver'],
    MUT: TimezoneName['Indian/Mauritius'],
    MVT: TimezoneName['Indian/Maldives'],
    MYT: TimezoneName['Asia/Kuala_Lumpur'],
    NCT: TimezoneName['Pacific/Noumea'],
    NDT: TimezoneName['America/St_Johns'],
    NFT: TimezoneName['Pacific/Norfolk'],
    NOVT: TimezoneName['Asia/Novosibirsk'],
    NPT: TimezoneName['Asia/Kathmandu'],
    NRT: TimezoneName['Pacific/Nauru'],
    NST: TimezoneName['America/St_Johns'],
    NT: TimezoneName['America/St_Johns'],
    NUT: TimezoneName['Pacific/Niue'],
    NZDT: TimezoneName['Pacific/Auckland'],
    NZST: TimezoneName['Pacific/Auckland'],
    NZT: TimezoneName['Pacific/Auckland'],
    OMST: TimezoneName['Asia/Omsk'],
    PDT: TimezoneName['America/Los_Angeles'],
    PET: TimezoneName['America/Lima'],
    PGT: TimezoneName['Pacific/Port_Moresby'],
    PHST: TimezoneName['Asia/Manila'],
    PHT: TimezoneName['Asia/Manila'],
    PKT: TimezoneName['Asia/Karachi'],
    PMDT: TimezoneName['America/Miquelon'],
    PMST: TimezoneName['America/Miquelon'],
    PONT: TimezoneName['Pacific/Pohnpei'],
    PST: TimezoneName['America/Los_Angeles'],
    PT: TimezoneName['America/Los_Angeles'],
    PWT: TimezoneName['Pacific/Palau'],
    PYST: TimezoneName['America/Asuncion'],
    PYT: TimezoneName['America/Asuncion'],
    RET: TimezoneName['Indian/Reunion'],
    SAKT: TimezoneName['Asia/Sakhalin'],
    SAMT: TimezoneName['Europe/Samara'],
    SAST: TimezoneName['Africa/Johannesburg'],
    SBT: TimezoneName['Pacific/Guadalcanal'],
    SCT: TimezoneName['Indian/Mahe'],
    SGT: TimezoneName['Asia/Singapore'],
    SLST: TimezoneName['Asia/Colombo'],
    SRT: TimezoneName['America/Paramaribo'],
    SST: TimezoneName['Pacific/Pago_Pago'],
    TAHT: TimezoneName['Pacific/Tahiti'],
    TJT: TimezoneName['Asia/Dushanbe'],
    TLT: TimezoneName['Asia/Dili'],
    TMT: TimezoneName['Asia/Ashgabat'],
    TOT: TimezoneName['Pacific/Tongatapu'],
    TRT: TimezoneName['Europe/Istanbul'],
    TVT: TimezoneName['Pacific/Funafuti'],
    ULAT: TimezoneName['Asia/Ulaanbaatar'],
    UT: TimezoneName.UTC,
    UTC: TimezoneName.UTC,
    UYT: TimezoneName['America/Montevideo'],
    UZT: TimezoneName['Asia/Tashkent'],
    VET: TimezoneName['America/Caracas'],
    VLAT: TimezoneName['Asia/Vladivostok'],
    WAKT: TimezoneName['Pacific/Wake'],
    WAST: TimezoneName['Africa/Windhoek'],
    WAT: TimezoneName['Africa/Lagos'],
    WEST: TimezoneName['Europe/Lisbon'],
    WET: TimezoneName['Europe/Lisbon'],
    WFT: TimezoneName['Pacific/Wallis'],
    WGST: TimezoneName['America/Nuuk'],
    WGT: TimezoneName['America/Nuuk'],
    WIB: TimezoneName['Asia/Jakarta'],
    WIT: TimezoneName['Asia/Jayapura'],
    WITA: TimezoneName['Asia/Makassar'],
    WST: TimezoneName['Pacific/Apia'],
    YAKT: TimezoneName['Asia/Yakutsk'],
    YEKT: TimezoneName['Asia/Yekaterinburg'],
    Z: TimezoneName.UTC,
    ZULU: TimezoneName.UTC,
};

/**
 * Same as indexing {@link timezoneAbbreviations} directly but accepts any casing and surrounding
 * whitespace, and accepts a string that isn't an abbreviation at all. Returns `undefined` rather
 * than a guess when the abbreviation is unknown, so callers can fall back or alert instead of
 * silently picking a wrong offset.
 *
 * @category Timezone
 * @example
 *
 * ```ts
 * import {getTimezoneFromAbbreviation} from 'date-vir';
 *
 * getTimezoneFromAbbreviation('pst'); // 'America/Los_Angeles'
 * getTimezoneFromAbbreviation('nope'); // undefined
 * ```
 */
export function getTimezoneFromAbbreviation(abbreviation: string): TimezoneName | undefined {
    const searchedAbbreviation = abbreviation.trim().toUpperCase();

    return timezoneAbbreviations[searchedAbbreviation];
}
