export interface AuthContextType {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>;
  activeEmail: string | null;
  setActiveEmail: React.Dispatch<React.SetStateAction<string | null>>;
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  customize: CustomizeType;
  setCustomize: React.Dispatch<React.SetStateAction<CustomizeType>>;
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
  likes: number,
  rating?: number,
  hours?: number,
  tables?: TableType[],
  dob?: string,
  gender?: string,
  interest?: string[],
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
  bidders: [number, number, number],
  deposit: number | null,
  reg: boolean,
  step: number | null,
  venue_id: number
}

export type CustomizeType = number | null

export type AuthProviderProps = {
  children: React.ReactNode;
}