export interface timezone {
    tz_code: string;          // IANA timezone code
    tz_identifier: string;    // Full name of the timezone
    tz_UTC_offset: string;    // UTC offset in HH:mm format
}

export const timezones: timezone[] = [
    {
        tz_code: "UTC",
        tz_identifier: "Universal Time Coordinated",
        tz_UTC_offset: "+00:00"
    },
    {
        tz_code: "America/Los_Angeles",
        tz_identifier: "Pacific Standard Time (PST)",
        tz_UTC_offset: "-08:00"
    },
    {
        tz_code: "America/Denver",
        tz_identifier: "Mountain Standard Time (MST)",
        tz_UTC_offset: "-07:00"
    },
    {
        tz_code: "America/Chicago",
        tz_identifier: "Central Standard Time (CST)",
        tz_UTC_offset: "-06:00"
    },
    {
        tz_code: "America/New_York",
        tz_identifier: "Eastern Standard Time (EST)",
        tz_UTC_offset: "-05:00"
    },
    {
        tz_code: "Europe/London",
        tz_identifier: "Greenwich Mean Time (GMT)",
        tz_UTC_offset: "+00:00"
    },
    {
        tz_code: "Europe/Berlin",
        tz_identifier: "Central European Time (CET)",
        tz_UTC_offset: "+01:00"
    },
    {
        tz_code: "Europe/Athens",
        tz_identifier: "Eastern European Time (EET)",
        tz_UTC_offset: "+02:00"
    },
    {
        tz_code: "Asia/Kolkata",
        tz_identifier: "India Standard Time (IST)",
        tz_UTC_offset: "+05:30"
    },
    {
        tz_code: "Asia/Shanghai",
        tz_identifier: "China Standard Time (CST)",
        tz_UTC_offset: "+08:00"
    },
    {
        tz_code: "Asia/Tokyo",
        tz_identifier: "Japan Standard Time (JST)",
        tz_UTC_offset: "+09:00"
    },
    {
        tz_code: "Australia/Sydney",
        tz_identifier: "Australian Eastern Daylight Time (AEDT)",
        tz_UTC_offset: "+11:00"
    },
    {
        tz_code: "Pacific/Auckland",
        tz_identifier: "New Zealand Daylight Time (NZDT)",
        tz_UTC_offset: "+13:00"
    },
    {
        tz_code: "Asia/Manila",
        tz_identifier: "Philippine Time (PHT)",
        tz_UTC_offset: "+08:00"
    },
    {
        tz_code: "America/Toronto",
        tz_identifier: "Eastern Standard Time (EST) - Canada",
        tz_UTC_offset: "-05:00"
    },
    {
        tz_code: "Europe/Paris",
        tz_identifier: "Central European Time (CET) - France",
        tz_UTC_offset: "+01:00"
    },
    {
        tz_code: "Asia/Dubai",
        tz_identifier: "Gulf Standard Time (GST)",
        tz_UTC_offset: "+04:00"
    },
    {
        tz_code: "America/Sao_Paulo",
        tz_identifier: "Brasília Time (BRT)",
        tz_UTC_offset: "-03:00"
    },
    {
        tz_code: "Africa/Nairobi",
        tz_identifier: "East Africa Time (EAT)",
        tz_UTC_offset: "+03:00"
    },
    {
        tz_code: "America/Argentina/Buenos_Aires",
        tz_identifier: "Argentina Time (ART)",
        tz_UTC_offset: "-03:00"
    },
    {
        tz_code: "Africa/Johannesburg",
        tz_identifier: "South Africa Standard Time (SAST)",
        tz_UTC_offset: "+02:00"
    },
    {
        tz_code: "Europe/Moscow",
        tz_identifier: "Moscow Time (MSK)",
        tz_UTC_offset: "+03:00"
    },
    {
        tz_code: "Asia/Singapore",
        tz_identifier: "Singapore Standard Time (SGT)",
        tz_UTC_offset: "+08:00"
    },
    {
        tz_code: "America/Vancouver",
        tz_identifier: "Pacific Standard Time (PST) - Canada",
        tz_UTC_offset: "-08:00"
    },
    {
        tz_code: "Asia/Seoul",
        tz_identifier: "Korea Standard Time (KST)",
        tz_UTC_offset: "+09:00"
    },
    {
        tz_code: "Europe/Stockholm",
        tz_identifier: "Central European Time (CET) - Sweden",
        tz_UTC_offset: "+01:00"
    },
    {
        tz_code: "America/Phoenix",
        tz_identifier: "Mountain Standard Time (MST) - No DST",
        tz_UTC_offset: "-07:00"
    },
    {
        tz_code: "Europe/Rome",
        tz_identifier: "Central European Time (CET) - Italy",
        tz_UTC_offset: "+01:00"
    },
    {
        tz_code: "Asia/Jakarta",
        tz_identifier: "Western Indonesia Time (WIB)",
        tz_UTC_offset: "+07:00"
    },
    {
        tz_code: "Asia/Bangkok",
        tz_identifier: "Indochina Time (ICT)",
        tz_UTC_offset: "+07:00"
    },
];

