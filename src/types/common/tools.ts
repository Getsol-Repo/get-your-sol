/** Combines members of an intersection into a readable type. */
// https://x.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
// export type Prettify<type> = { [key in keyof type]: type[key] extends object ? Prettify<type[key]> : type[key] } & unknown
export type Prettify<type> = { [key in keyof type]: type[key] } & unknown
