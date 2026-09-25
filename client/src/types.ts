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
  album: string,
  likes: string[][],
  rating?: number,
  hours?: number,
  tables?: TableType[],
  dob?: string,
  gender?: string,
  interest?: string,
  dates: number,
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
  reg: boolean,
  step: number | null,
  venue_id: number
}

export type AuctionExtendedType = {
  bidders: [BidderType | null, BidderType | null, BidderType | null],
  deposit: number,
  id: number,
  name: string,
  pic: string,
  reg: boolean,
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