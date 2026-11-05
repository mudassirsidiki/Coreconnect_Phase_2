import { type Industry, type Region, industries, industryRegionMap } from './data'

export type OpportunityStage = 'RFP Researched' | 'RFP Submitted' | 'RFP Pending'
export type OpportunityStatus = 'Researched' | 'Submitted' | 'Won' | 'Lost' | 'Pending'

export interface OpportunityContact {
  name: string
  title: string
  email: string
  phone?: string
}

export interface OpportunityMeeting {
  status: 'Scheduled' | 'Completed' | 'Pending'
  type: 'Discovery' | 'Executive Briefing' | 'Demo' | 'Follow-up'
  date: string
  display: string
}

export interface OpportunityRecord {
  id: number
  serialNumber: string
  dateAdded: string
  industry: Industry
  region: Region
  account: string
  contactPerson: OpportunityContact
  meeting: OpportunityMeeting
  comments: string
  actions: string
  status: OpportunityStatus
  stage: OpportunityStage
  rfpTitle: string
  value: number
  reasonToLostOrWin?: string
}

// Reason to lost or win lookup dictionary
const reasonBySerial: Record<string, string> = {
  'OPP-001': 'Won: Outperformed competitors on SOC2 compliance audits and open banking API integration.',
  'OPP-002': 'O1 (High): RFP requirements scoped; technical blueprint and wealth advisory architecture in progress.',
  'OPP-003': 'O3 (LOW): Submitted initial proposal; currently awaiting executive steering committee budget allocation.',
  'OPP-004': 'O2 (MEDIUM): Shortlisted in top 2 vendors; oral defense presentation scheduled with procurement.',
  'OPP-005': 'O1 (High): Public tender requirements scoped; PIPEDA data privacy qualification in progress.',
  'OPP-006': 'O3 (LOW): RFP draft finalized; awaiting internal legal authorization on cloud data residency.',
  'OPP-007': 'Won: Selected for native Arabic omni-channel customer intelligence architecture across 45 hypermarkets.',
  'OPP-008': 'O3 (LOW): Proposal submitted for journey orchestration; awaiting board valuation review.',
  'OPP-009': 'O1 (High): Warehouse dispatch and supply chain RFP specifications analyzed and benchmarked.',
  'OPP-010': 'Won: Rigorous NERC-CIP cybersecurity audits passed; best overall grid modernization value.',
  'OPP-011': 'O2 (MEDIUM): RFP submitted for smart meter CRM; awaiting evaluation committee final scoring post-regulatory hearing.',
  'OPP-012': 'O1 (High): Industrial battery telemetry RFP scoped; creating functional matrix for real-time alerts.',
  'OPP-013': 'Won: Selected for 5G enterprise B2B partner billing and automated provisioning across Eastern Canada.',
  'OPP-014': 'Lost: Lost to incumbent carrier partner due to existing multi-year hardware infrastructure contracts.',
  'OPP-015': 'O3 (LOW): RFP submitted for customer retention analytics; pending financial sign-off from group CFO.',
  'OPP-016': 'Won: Awarded sovereign multi-tenant government cloud operations tender in Riyadh.',
  'OPP-017': 'O3 (LOW): Tender submission completed; pending final compliance vetting by National Cybersecurity Authority.',
  'OPP-018': 'O1 (High): Open Banking API gateway tender specifications and competitive benchmarking completed.',
  'OPP-019': 'Won: Selected for connected factory floor operations and real-time IIoT dispatch tracking.',
  'OPP-020': 'Lost: Lost to incumbent hardware vendor due to deeply bundled capital lease arrangements.',
  'OPP-021': 'O1 (High): Automated warehouse robotics RFP requirements gathered; partner integration underway.',
  'OPP-022': 'Won: Chosen for practice management and utilization analytics suite across Canadian regional offices.',
  'OPP-023': 'O3 (LOW): Submitted response for consultant allocation engine; awaiting committee scoring results.',
  'OPP-024': 'O1 (High): RFP requirements scoped for automated conflict-check workflows and matter management.'
}

// Reason to lost or win fallback / resolver
export function getReasonToLostOrWin(opp: Partial<OpportunityRecord>): string {
  let text = ''
  if (opp.reasonToLostOrWin) {
    text = opp.reasonToLostOrWin
  } else if (opp.serialNumber && reasonBySerial[opp.serialNumber]) {
    text = reasonBySerial[opp.serialNumber]
  } else {
    switch (opp.status) {
      case 'Won':
        text = 'Won: Passed rigorous compliance audits; chosen for superior technical architecture and best value.'
        break
      case 'Lost':
        text = 'Lost: Lost to incumbent provider due to existing capital lease and hosting contracts.'
        break
      case 'Submitted':
        text = 'O2 (MEDIUM): Shortlisted in top tier; awaiting evaluation committee final scoring.'
        break
      case 'Pending':
        text = 'O3 (LOW): Under executive steering committee review; pending final budget allocation.'
        break
      case 'Researched':
        text = 'O1 (High): RFP requirements scoped; technical blueprint and qualification in progress.'
        break
      default:
        text = 'Active opportunity evaluation in progress.'
    }
  }

  return text
    .replace(/^Researched:\s*/i, 'O1 (High): ')
    .replace(/^Submitted:\s*/i, 'O2 (MEDIUM): ')
    .replace(/^Pending:\s*/i, 'O3 (LOW): ')
}

// Generate realistic seed opportunity records across all 8 industries and 3 stages
export const initialOpportunities: OpportunityRecord[] = [
  // 1. Banking (USA)
  {
    id: 1,
    serialNumber: 'OPP-001',
    dateAdded: '2026-09-12',
    industry: 'Banking',
    region: 'USA',
    account: 'Meridian Bank',
    contactPerson: {
      name: 'Jordan Miller',
      title: 'VP of Commercial Banking Technology',
      email: 'j.miller@meridianbank.com',
      phone: '+1 (415) 890-2134'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-09-28',
      display: 'Completed · Sep 28, 2026'
    },
    comments: 'RFP awarded for nationwide commercial lending CRM transformation; security and compliance audits passed.',
    actions: 'Review contract terms',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: 'Enterprise Commercial Lending CRM Modernization',
    value: 480000
  },
  {
    id: 2,
    serialNumber: 'OPP-002',
    dateAdded: '2026-09-18',
    industry: 'Banking',
    region: 'USA',
    account: 'Oakline Financial',
    contactPerson: {
      name: 'Elena Rostova',
      title: 'Chief Digital Officer',
      email: 'e.rostova@oaklinefinancial.com',
      phone: '+1 (212) 555-0182'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Demo',
      date: '2026-10-20',
      display: 'Scheduled · Oct 20, 2026'
    },
    comments: 'RFP documentation researched and preliminary technical architecture blueprint prepared for core integration.',
    actions: 'Prepare custom demo script',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Digital Wealth Advisory Operating System',
    value: 320000
  },
  {
    id: 3,
    serialNumber: 'OPP-003',
    dateAdded: '2026-09-25',
    industry: 'Banking',
    region: 'USA',
    account: 'Crestview Partners',
    contactPerson: {
      name: 'Marcus Vance',
      title: 'Head of FinTech Operations',
      email: 'm.vance@crestviewpartners.com',
      phone: '+1 (312) 441-8930'
    },
    meeting: {
      status: 'Completed',
      type: 'Discovery',
      date: '2026-10-06',
      display: 'Completed · Oct 06, 2026'
    },
    comments: 'Submitted initial proposal schedule; currently awaiting executive steering committee decision on budget allocations.',
    actions: 'Follow up with procurement team',
    status: 'Pending',
    stage: 'RFP Pending',
    rfpTitle: 'Syndicated Loans Portfolio Management Platform',
    value: 295000
  },

  // 2. Healthcare (Canada)
  {
    id: 4,
    serialNumber: 'OPP-004',
    dateAdded: '2026-09-08',
    industry: 'Healthcare',
    region: 'Canada',
    account: 'Northstar Health',
    contactPerson: {
      name: 'Dr. Sarah Tremblay',
      title: 'Director of Healthcare Informatics',
      email: 's.tremblay@northstarhealth.ca',
      phone: '+1 (416) 723-9041'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-09-22',
      display: 'Completed · Sep 22, 2026'
    },
    comments: 'Formal RFP response delivered for provincial patient care coordination; shortlisted in top 2 vendors.',
    actions: 'Attend shortlist oral defense',
    status: 'Submitted',
    stage: 'RFP Submitted',
    rfpTitle: 'Provincial Integrated Clinical Communication Suite',
    value: 520000
  },
  {
    id: 5,
    serialNumber: 'OPP-005',
    dateAdded: '2026-09-29',
    industry: 'Healthcare',
    region: 'Canada',
    account: 'Greenfield Clinics',
    contactPerson: {
      name: 'Liam MacLeod',
      title: 'VP Clinical Operations',
      email: 'l.macleod@greenfieldclinics.ca',
      phone: '+1 (604) 881-2245'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Discovery',
      date: '2026-10-22',
      display: 'Scheduled · Oct 22, 2026'
    },
    comments: 'Identified public tender requirements and PIPEDA data governance guidelines for multi-clinic deployment.',
    actions: 'Schedule privacy compliance review',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Multi-Clinic Patient Intake & Scheduling Hub',
    value: 210000
  },
  {
    id: 6,
    serialNumber: 'OPP-006',
    dateAdded: '2026-10-02',
    industry: 'Healthcare',
    region: 'Canada',
    account: 'Apex Health Systems',
    contactPerson: {
      name: 'Chantal Beaulieu',
      title: 'Chief Medical Officer',
      email: 'c.beaulieu@apexhealth.ca',
      phone: '+1 (514) 932-6712'
    },
    meeting: {
      status: 'Pending',
      type: 'Follow-up',
      date: '2026-10-28',
      display: 'Pending · Oct 28, 2026'
    },
    comments: 'RFP draft completed; pending internal legal authorization on cloud hosting residency clauses.',
    actions: 'Obtain cloud compliance documentation',
    status: 'Pending',
    stage: 'RFP Pending',
    rfpTitle: 'Telehealth Workflow Automation Platform',
    value: 360000
  },

  // 3. Retail (Saudi Arabia)
  {
    id: 7,
    serialNumber: 'OPP-007',
    dateAdded: '2026-09-04',
    industry: 'Retail',
    region: 'Saudi Arabia',
    account: 'Pinnacle Retail Group',
    contactPerson: {
      name: 'Tariq Al-Mansoor',
      title: 'Chief Merchandising Officer',
      email: 't.almansoor@pinnacleretail.sa',
      phone: '+966 11 482 9901'
    },
    meeting: {
      status: 'Completed',
      type: 'Demo',
      date: '2026-09-19',
      display: 'Completed · Sep 19, 2026'
    },
    comments: 'Won enterprise omni-channel customer intelligence RFP across 45 hypermarkets in KSA.',
    actions: 'Schedule executive onboarding',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: 'Omni-Channel Customer Experience Platform',
    value: 650000
  },
  {
    id: 8,
    serialNumber: 'OPP-008',
    dateAdded: '2026-09-20',
    industry: 'Retail',
    region: 'Saudi Arabia',
    account: 'Apex Commerce KSA',
    contactPerson: {
      name: 'Fatima Al-Harbi',
      title: 'Head of E-Commerce Growth',
      email: 'f.harbi@apexcommerce.sa',
      phone: '+966 12 654 3321'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-10-04',
      display: 'Completed · Oct 04, 2026'
    },
    comments: 'Proposal submitted for Arabic-first customer journey orchestration; awaiting board valuation review.',
    actions: 'Send localized case studies',
    status: 'Pending',
    stage: 'RFP Pending',
    rfpTitle: 'Digital Loyalty & Predictive Personalization Engine',
    value: 410000
  },
  {
    id: 9,
    serialNumber: 'OPP-009',
    dateAdded: '2026-10-05',
    industry: 'Retail',
    region: 'Saudi Arabia',
    account: 'Red Sea Marketplaces',
    contactPerson: {
      name: 'Omar Al-Ghamdi',
      title: 'VP Logistics & Retail Operations',
      email: 'o.ghamdi@redseamarket.sa',
      phone: '+966 13 891 7765'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Discovery',
      date: '2026-10-24',
      display: 'Scheduled · Oct 24, 2026'
    },
    comments: 'Deep dive into retail supply chain RFP specs and warehouse dispatch integrations in Jeddah.',
    actions: 'Prepare technical feasibility brief',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Retail Distribution & Store Inventory Hub',
    value: 275000
  },

  // 4. Energy (USA)
  {
    id: 10,
    serialNumber: 'OPP-010',
    dateAdded: '2026-09-02',
    industry: 'Energy',
    region: 'USA',
    account: 'BluePeak Energy',
    contactPerson: {
      name: 'David Sterling',
      title: 'Senior VP Energy Solutions',
      email: 'd.sterling@bluepeakenergy.com',
      phone: '+1 (713) 621-4490'
    },
    meeting: {
      status: 'Completed',
      type: 'Demo',
      date: '2026-09-17',
      display: 'Completed · Sep 17, 2026'
    },
    comments: 'Signed enterprise contract for clean energy grid client portal and automated billing operations.',
    actions: 'Initiate security audit sign-off',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: 'Grid Modernization & Commercial Energy Portal',
    value: 580000
  },
  {
    id: 11,
    serialNumber: 'OPP-011',
    dateAdded: '2026-09-14',
    industry: 'Energy',
    region: 'USA',
    account: 'Lumen Utilities',
    contactPerson: {
      name: 'Hannah Brooks',
      title: 'Director of Renewable Asset Planning',
      email: 'h.brooks@lumenutilities.com',
      phone: '+1 (303) 789-1120'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-09-30',
      display: 'Completed · Sep 30, 2026'
    },
    comments: 'RFP submitted for smart meter billing CRM; decision postponed due to annual state utility regulatory hearings.',
    actions: 'Re-engage following regulatory review',
    status: 'Submitted',
    stage: 'RFP Submitted',
    rfpTitle: 'Smart Meter Customer Billing & Telemetry Engine',
    value: 390000
  },
  {
    id: 12,
    serialNumber: 'OPP-012',
    dateAdded: '2026-10-01',
    industry: 'Energy',
    region: 'USA',
    account: 'Solaria Power Partners',
    contactPerson: {
      name: 'Keith Patterson',
      title: 'Head of Infrastructure Sourcing',
      email: 'k.patterson@solariapower.com',
      phone: '+1 (512) 334-9021'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Discovery',
      date: '2026-10-21',
      display: 'Scheduled · Oct 21, 2026'
    },
    comments: 'Research completed on industrial battery telemetry RFP; creating scope matrix for real-time alerts.',
    actions: 'Draft functional requirements matrix',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Renewable Telemetry & Battery Storage Monitor',
    value: 340000
  },

  // 5. Telecom (Canada)
  {
    id: 13,
    serialNumber: 'OPP-013',
    dateAdded: '2026-09-10',
    industry: 'Telecom',
    region: 'Canada',
    account: 'Atlas Telecom',
    contactPerson: {
      name: 'Robert Zhang',
      title: 'VP Enterprise Sales & Wholesale Ops',
      email: 'r.zhang@atlastelecom.ca',
      phone: '+1 (416) 901-5543'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-09-24',
      display: 'Completed · Sep 24, 2026'
    },
    comments: 'Won 5G enterprise B2B partner billing and provisioning RFP across eastern Canada.',
    actions: 'Finalize master service agreement',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: '5G Enterprise B2B Service Orchestration System',
    value: 710000
  },
  {
    id: 14,
    serialNumber: 'OPP-014',
    dateAdded: '2026-09-22',
    industry: 'Telecom',
    region: 'Canada',
    account: 'Orbit Networks Canada',
    contactPerson: {
      name: 'Stephanie Roy',
      title: 'Director of B2B Product Delivery',
      email: 's.roy@orbitnetworks.ca',
      phone: '+1 (613) 421-9988'
    },
    meeting: {
      status: 'Completed',
      type: 'Discovery',
      date: '2026-10-08',
      display: 'Completed · Oct 08, 2026'
    },
    comments: 'Comprehensive tender submitted; lost to incumbent carrier partner due to existing hardware infrastructure contracts.',
    actions: 'Review post-mortem feedback for next tender cycle',
    status: 'Lost',
    stage: 'RFP Submitted',
    rfpTitle: 'Fiber Infrastructure Lifecycle Management',
    value: 460000,
    reasonToLostOrWin: 'Lost to incumbent carrier partner due to existing multi-year hardware infrastructure contracts.'
  },
  {
    id: 15,
    serialNumber: 'OPP-015',
    dateAdded: '2026-10-06',
    industry: 'Telecom',
    region: 'Canada',
    account: 'Signal Media & Telecom',
    contactPerson: {
      name: 'Gabriel Tremblay',
      title: 'Chief Technology Architect',
      email: 'g.tremblay@signaltelecom.ca',
      phone: '+1 (514) 778-0012'
    },
    meeting: {
      status: 'Pending',
      type: 'Follow-up',
      date: '2026-10-27',
      display: 'Pending · Oct 27, 2026'
    },
    comments: 'RFP submitted for customer retention analytics; pending financial sign-off from group CFO.',
    actions: 'Follow up with procurement manager',
    status: 'Pending',
    stage: 'RFP Pending',
    rfpTitle: 'AI-Powered Churn Prevention & Retention Suite',
    value: 385000
  },

  // 6. Technology (Saudi Arabia)
  {
    id: 16,
    serialNumber: 'OPP-016',
    dateAdded: '2026-09-06',
    industry: 'Technology',
    region: 'Saudi Arabia',
    account: 'Vertex Systems KSA',
    contactPerson: {
      name: 'Sultan Al-Otaibi',
      title: 'Managing Director & CTO',
      email: 's.otaibi@vertexsystems.sa',
      phone: '+966 11 201 8834'
    },
    meeting: {
      status: 'Completed',
      type: 'Demo',
      date: '2026-09-21',
      display: 'Completed · Sep 21, 2026'
    },
    comments: 'Awarded multi-tenant cloud operations RFP for government-backed digital initiatives in Riyadh.',
    actions: 'Kickoff architecture alignment meeting',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: 'Sovereign Government Cloud Orchestration Stack',
    value: 820000
  },
  {
    id: 17,
    serialNumber: 'OPP-017',
    dateAdded: '2026-09-26',
    industry: 'Technology',
    region: 'Saudi Arabia',
    account: 'Cobalt Works Arabia',
    contactPerson: {
      name: 'Nouf Al-Zahrani',
      title: 'Head of Enterprise Applications',
      email: 'n.zahrani@cobaltworks.sa',
      phone: '+966 12 771 9021'
    },
    meeting: {
      status: 'Completed',
      type: 'Discovery',
      date: '2026-10-09',
      display: 'Completed · Oct 09, 2026'
    },
    comments: 'Tender submission completed; pending final compliance vetting against National Cybersecurity Authority standards.',
    actions: 'Provide compliance audit letter',
    status: 'Pending',
    stage: 'RFP Pending',
    rfpTitle: 'Enterprise DevSecOps Governance Suite',
    value: 430000
  },
  {
    id: 18,
    serialNumber: 'OPP-018',
    dateAdded: '2026-10-08',
    industry: 'Technology',
    region: 'Saudi Arabia',
    account: 'Saudi FinTech Cloud',
    contactPerson: {
      name: 'Waleed Al-Kaltham',
      title: 'VP Product Engineering',
      email: 'w.kaltham@saudifintech.sa',
      phone: '+966 11 982 4432'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Discovery',
      date: '2026-10-23',
      display: 'Scheduled · Oct 23, 2026'
    },
    comments: 'Research underway for Open Banking API gateway tender; benchmark analysis completed.',
    actions: 'Finalize competitive benchmarking report',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Open Banking API Aggregation & Security Gateway',
    value: 390000
  },

  // 7. Manufacturing (USA)
  {
    id: 19,
    serialNumber: 'OPP-019',
    dateAdded: '2026-09-01',
    industry: 'Manufacturing',
    region: 'USA',
    account: 'Cedar Manufacturing',
    contactPerson: {
      name: 'Thomas Bradley',
      title: 'VP Supply Chain Technology',
      email: 't.bradley@cedarmfg.com',
      phone: '+1 (248) 551-8902'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-09-16',
      display: 'Completed · Sep 16, 2026'
    },
    comments: 'Won enterprise plant operations and ERP dispatch tracking RFP across 6 manufacturing facilities.',
    actions: 'Issue procurement milestone billing schedule',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: 'Connected Factory Floor & Logistics Automation',
    value: 610000
  },
  {
    id: 20,
    serialNumber: 'OPP-020',
    dateAdded: '2026-09-15',
    industry: 'Manufacturing',
    region: 'USA',
    account: 'Ridgeway Transport & Mfg',
    contactPerson: {
      name: 'Jessica Vance',
      title: 'Director of Plant Automation',
      email: 'j.vance@ridgewaytransport.com',
      phone: '+1 (313) 992-0199'
    },
    meeting: {
      status: 'Completed',
      type: 'Demo',
      date: '2026-09-29',
      display: 'Completed · Sep 29, 2026'
    },
    comments: 'Submitted detailed proposal; RFP lost to incumbent hardware vendor due to existing capital lease contracts.',
    actions: 'Archive feedback for Q2 renewal cycle',
    status: 'Lost',
    stage: 'RFP Submitted',
    rfpTitle: 'Fleet Telematics & Predictive Maintenance Hub',
    value: 350000
  },
  {
    id: 21,
    serialNumber: 'OPP-021',
    dateAdded: '2026-10-03',
    industry: 'Manufacturing',
    region: 'USA',
    account: 'Harbor Logistics Manufacturing',
    contactPerson: {
      name: 'Paul D’Souza',
      title: 'Chief Operating Officer',
      email: 'p.dsouza@harborlogistics.com',
      phone: '+1 (773) 441-2311'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Discovery',
      date: '2026-10-25',
      display: 'Scheduled · Oct 25, 2026'
    },
    comments: 'Research completed on automated warehouse pick-and-pack optimization RFP; aligning partner ecosystem.',
    actions: 'Draft partner integration framework',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Automated Warehouse Robotics & Dispatch Platform',
    value: 470000
  },

  // 8. Professional Services (Canada)
  {
    id: 22,
    serialNumber: 'OPP-022',
    dateAdded: '2026-09-11',
    industry: 'Professional Services',
    region: 'Canada',
    account: 'Summit Advisory Group',
    contactPerson: {
      name: 'Claire Dupont',
      title: 'Partner & Practice Leader',
      email: 'c.dupont@summitadvisory.ca',
      phone: '+1 (416) 332-9011'
    },
    meeting: {
      status: 'Completed',
      type: 'Executive Briefing',
      date: '2026-09-27',
      display: 'Completed · Sep 27, 2026'
    },
    comments: 'Won enterprise practice management & client billing optimization RFP across Canadian regional offices.',
    actions: 'Schedule kickoff symposium',
    status: 'Won',
    stage: 'RFP Submitted',
    rfpTitle: 'Unified Practice Management & Utilization Suite',
    value: 420000
  },
  {
    id: 23,
    serialNumber: 'OPP-023',
    dateAdded: '2026-09-28',
    industry: 'Professional Services',
    region: 'Canada',
    account: 'BrightPath Education & Consulting',
    contactPerson: {
      name: 'Aaron Wong',
      title: 'Chief Information Officer',
      email: 'a.wong@brightpathconsulting.ca',
      phone: '+1 (604) 992-8812'
    },
    meeting: {
      status: 'Completed',
      type: 'Demo',
      date: '2026-10-10',
      display: 'Completed · Oct 10, 2026'
    },
    comments: 'Submitted response for national consultant allocation tool; pending evaluation committee scoring next week.',
    actions: 'Deliver pricing sensitivity model',
    status: 'Pending',
    stage: 'RFP Pending',
    rfpTitle: 'Consultant Skills Matrix & Real-Time Resourcing Engine',
    value: 310000
  },
  {
    id: 24,
    serialNumber: 'OPP-024',
    dateAdded: '2026-10-09',
    industry: 'Professional Services',
    region: 'Canada',
    account: 'Horizon Legal Advisory',
    contactPerson: {
      name: 'Melanie Fortin',
      title: 'Managing Director of Operations',
      email: 'm.fortin@horizonlegal.ca',
      phone: '+1 (514) 228-7654'
    },
    meeting: {
      status: 'Scheduled',
      type: 'Discovery',
      date: '2026-10-26',
      display: 'Scheduled · Oct 26, 2026'
    },
    comments: 'Researched RFP requirements for matter management and automated conflict-check workflows.',
    actions: 'Review compliance documentation',
    status: 'Researched',
    stage: 'RFP Researched',
    rfpTitle: 'Automated Conflict-Check & Matter Management',
    value: 290000
  }
]
