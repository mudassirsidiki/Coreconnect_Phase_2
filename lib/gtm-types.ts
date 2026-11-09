/**
 * TypeScript Data Models and Schema for Ideal Customer Profile & Go-To-Market Strategy
 */

export type PriorityValue = 1 | 2 | 3 | 4 | 5 | null

export interface ProductServiceConfig {
  selectedProducts: string[]
  otherProduct: string
  hasCollaterals: boolean
  collateralsDetails: string
}

export interface RegionSelection {
  id: string
  name: string
  priority: PriorityValue
  isCustom?: boolean
}

export interface GeoLocationConfig {
  country: string
  regions: RegionSelection[]
  customRegionInput: string
}

export interface SubContractorOptions {
  selected: boolean
  priority: PriorityValue
  trades: string[]
  otherTrade: string
}

export interface GeneralContractorOptions {
  selected: boolean
  priority: PriorityValue
}

export interface OtherIndustryOption {
  selected: boolean
  priority: PriorityValue
  name: string
}

export interface TargetIndustryConfig {
  subContractors: SubContractorOptions
  generalContractors: GeneralContractorOptions
  otherIndustry: OtherIndustryOption
  targetStartDate?: string
}

export interface CompanySizeOption {
  id: string
  label: string
  selected: boolean
  priority: PriorityValue
  customRange?: string
}

export interface CompanySizeConfig {
  basis: 'employees' | 'revenue'
  options: CompanySizeOption[]
}

export interface TargetJobTitlesConfig {
  selectedTitles: string[]
  customTitles: string[]
}

export interface FocusedAccountRow {
  id: string
  companyName: string
  comments: string
  targetProjects: string
}

export interface FocusedAccountsConfig {
  decideLater: boolean
  accounts: FocusedAccountRow[]
}

export interface ChannelDetail {
  enabled: boolean
  details: string
}

export interface OutreachStrategyConfig {
  email: ChannelDetail
  linkedIn: ChannelDetail
  calls: ChannelDetail
}

export interface ConferenceRow {
  id: string
  eventName: string
  date: string
  location: string
  notes: string
}

export interface ConferencesConfig {
  requestResearchSupport: boolean
  conferences: ConferenceRow[]
}

export interface CrmConfig {
  usesCrm: boolean
  crmProvider: string
  crmDetails: string
}

export interface WeeklyMeetingConfig {
  day: string
  time: string
  timeZone: string
}

export interface ContactPersonRow {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

export interface PointOfContactConfig {
  contacts: ContactPersonRow[]
}

export interface CommunicationModeConfig {
  selectedModes: string[]
  otherMode: string
}

export interface GtmStrategyFormData {
  // Header Meta
  companyName: string
  contactPerson: string
  email: string
  date: string

  // Section 1: Products / Services
  products: ProductServiceConfig

  // Section 2: Geographical Locations
  geography: GeoLocationConfig

  // Section 3: Target Industry
  industry: TargetIndustryConfig

  // Section 4: Company Size
  companySize: CompanySizeConfig

  // Section 5: Target Job Titles
  jobTitles: TargetJobTitlesConfig

  // Section 6: Focused Accounts / Customers
  focusedAccounts: FocusedAccountsConfig

  // Section 7: Outreach Strategy
  outreach: OutreachStrategyConfig

  // Section 8: Upcoming Conferences / Trade Shows
  conferences: ConferencesConfig

  // Section 9: Others
  otherNotes: string

  // Section 10: CRM
  crm: CrmConfig

  // Section 11: Weekly Meeting
  weeklyMeeting: WeeklyMeetingConfig

  // Section 12: Point of Contact
  pointOfContact: PointOfContactConfig

  // Section 13: Mode of Communication
  communication: CommunicationModeConfig

  // Meta
  lastSavedAt?: string
  isCompleted?: boolean
}

export interface ValidationErrors {
  companyName?: string
  email?: string
  geoPriorityDuplicate?: string
  industryPriorityDuplicate?: string
  sizePriorityDuplicate?: string
  [key: string]: string | undefined
}
