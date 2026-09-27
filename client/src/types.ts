export interface AuthContextType {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>;
  activeEmail: string | null;
  setActiveEmail: React.Dispatch<React.SetStateAction<string | null>>;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  customize: number | null;
  setCustomize: React.Dispatch<React.SetStateAction<number | null>>;
}

export type AuthType = null | {
  token: string,
  id: string,
  roles: string[],
  email: string,
  name: string,
  stage: string,
  avatar: string,
  album: string[],
  likes: string[][],
  rating?: number,
  hours?: number,
  tables?: TableType[],
  dob?: string,
  gender?: string,
  interest?: string,
  dates: DateType[],
  credits: number
}

export type TableType = {
  id: number,
  pic: string,
  active: boolean,
  modal: boolean,
  auction: AuctionType
}

export type AuctionType = {
  bidders: [BidderType | null, BidderType | null, BidderType | null],
  deposit: FormDataEntryValue |number | null,
  reg: boolean | string,
  step: number | null,
  venue_id: number
}

export type AuctionExtendedType = {
  bidders: [BidderType | null, BidderType | null, BidderType | null],
  deposit: number,
  id: number,
  name: string,
  pic: string,
  reg: boolean | string,
  step: number,
  venue_email: string,
  venue_id: number
}

export type HostPreviewType = null | {
  avatar: string, 
  id: string,
  interest: string,
  email: string,
  bid: number,
  venue: string,
  auction_id: number
}

export type BidderType = {
  avatar: string,
  bid: number,
  email: string,
  id: string,
  interest: string,
  name: string
}

export type DateType = {
  venue: string,
  venue_id: string,
  venue_name: string,
  table: string,
  table_pic: string,
  host: string,
  host_id: string,
  host_pic: string,
  guest: string,
  guest_id: string,
  guest_pic: string,
  deposit: string,
  status: string,
  endTime?: string
}

export type PreviewSrcType = { 
  pic: string, 
  index: number, 
  file: File | null 
}

export type UserDataType = {
  album: string[],
  avatar: string,
  dates?: DateType[],
  email: string,
  hours?: string,
  likes: [string, string, string, string][] | null,
  role: string,
  tables?: TableType[],
  venue?: string,
  customer?: string,
  dob?: string,
  gender?: string,
  interest?: string
}

export type CustomerType = {
  age: string,
  album: string[],
  avatar: string,
  customer: string,
  dates?: DateType[],
  dob: string,
  email: string,
  gender: string,
  id: number,
  interest: string,
  likes: [string, string, string, string][] | null,
  stage: string
}

export type EmptyTables = Record<string, never>;

export type VenueType = {
  album: string[],
  avatar: string,
  email: string,
  hours: string,
  id: number,
  likes: [string, string, string, string][] | null,
  rating: null,
  stage: string,
  tables: TableType[][] | EmptyTables,
  venue: string,
  dates?: DateType[]
}