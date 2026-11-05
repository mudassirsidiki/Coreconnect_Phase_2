import { industries, regions, industryRegionMap, type Industry, type Region } from './data'

export interface ResearchedContract {
  id: string
  title: string
  clientOrAgency: string
  estimatedValue: number
  publishedDate: string
  submissionDeadline: string
  status: 'Active' | 'Under Review' | 'Upcoming' | 'Awarded'
  scope: string
}

export interface ResearchedCompany {
  id: string
  companyName: string
  industry: Industry
  region: Region
  city: string
  researchDate: string
  researchedBy: string
  annualRevenue: string
  employeeCount: number
  opportunityScore: number // 0-100
  status: 'High Priority' | 'In Evaluation' | 'Qualified for Outreach' | 'Nurturing'
  website: string
  contractsCount: number
  contactsCount?: number
  totalContractValue: number
  painPoints: string[]
  techStack: string[]
  executiveContact: {
    name: string
    title: string
    email: string
  }
  contracts: ResearchedContract[]
  researchNotes: string
}

export const initialResearchData: ResearchedCompany[] = [
  {
    id: 'RES-001',
    companyName: 'Meridian National Bank',
    industry: 'Banking',
    region: 'USA',
    city: 'New York, NY',
    researchDate: '2026-10-14',
    researchedBy: 'Sarah Chen',
    annualRevenue: '$2.4B',
    employeeCount: 4200,
    opportunityScore: 94,
    status: 'High Priority',
    website: 'www.meridianbank.com',
    contractsCount: 3,
    totalContractValue: 2450000,
    painPoints: ['Legacy core banking migration', 'Real-time AML compliance bottlenecks', 'Mobile branch automation'],
    techStack: ['Finacle', 'AWS GovCloud', 'Kafka', 'Salesforce Financial Services'],
    executiveContact: {
      name: 'Arthur Vance',
      title: 'Chief Technology Officer',
      email: 'a.vance@meridianbank.com'
    },
    researchNotes: 'High readiness for digital core transformation. 3 active tenders out for cloud modernization and zero-trust perimeter.',
    contracts: [
      {
        id: 'CON-BNK-101',
        title: 'Core Banking API Middleware Architecture',
        clientOrAgency: 'Meridian Digital Transformation Office',
        estimatedValue: 1200000,
        publishedDate: '2026-10-02',
        submissionDeadline: '2026-11-15',
        status: 'Active',
        scope: 'Design and deploy resilient API Gateway for open banking compliance and fintech integration.'
      },
      {
        id: 'CON-BNK-102',
        title: 'Enterprise Fraud Detection AI CoE',
        clientOrAgency: 'Risk & Governance Committee',
        estimatedValue: 750000,
        publishedDate: '2026-09-20',
        submissionDeadline: '2026-10-30',
        status: 'Under Review',
        scope: 'Machine learning streaming pipeline for sub-millisecond fraud pattern detection.'
      },
      {
        id: 'CON-BNK-103',
        title: 'Private Cloud Infrastructure Refresh',
        clientOrAgency: 'Meridian IT Infrastructure',
        estimatedValue: 500000,
        publishedDate: '2026-08-15',
        submissionDeadline: '2026-09-30',
        status: 'Awarded',
        scope: 'Hybrid cloud deployment with RedHat OpenShift across 2 data center sites.'
      }
    ]
  },
  {
    id: 'RES-002',
    companyName: 'Northstar Health Network',
    industry: 'Healthcare',
    region: 'Canada',
    city: 'Toronto, ON',
    researchDate: '2026-10-12',
    researchedBy: 'Alex Miller',
    annualRevenue: '$1.1B',
    employeeCount: 3100,
    opportunityScore: 91,
    status: 'High Priority',
    website: 'www.northstarhealth.ca',
    contractsCount: 2,
    totalContractValue: 1650000,
    painPoints: ['Provincial health record interoperability', 'Telehealth triage wait times', 'Data privacy compliance'],
    techStack: ['Epic EHR', 'Microsoft Azure Canada', 'Cerner Integration', 'Snowflake Healthcare'],
    executiveContact: {
      name: 'Dr. Evelyn Dubois',
      title: 'VP of Digital Clinical Informatics',
      email: 'evelyn.dubois@northstarhealth.ca'
    },
    researchNotes: 'Provincial funding approved for unified patient registry. Strong potential for consulting and cloud integration.',
    contracts: [
      {
        id: 'CON-HLT-201',
        title: 'Integrated Clinical Data Lakehouse',
        clientOrAgency: 'Ontario Health Technology Authority',
        estimatedValue: 1100000,
        publishedDate: '2026-09-28',
        submissionDeadline: '2026-11-20',
        status: 'Active',
        scope: 'Centralized HL7 FHIR-compliant repository for multi-site patient diagnostic imaging.'
      },
      {
        id: 'CON-HLT-202',
        title: 'Remote Care Monitoring Portal Implementation',
        clientOrAgency: 'Northstar Outpatient Strategy',
        estimatedValue: 550000,
        publishedDate: '2026-10-04',
        submissionDeadline: '2026-11-10',
        status: 'Active',
        scope: 'Secure mobile and web portal for post-operative remote physiological telemetry.'
      }
    ]
  },
  {
    id: 'RES-003',
    companyName: 'Pinnacle Retail Group',
    industry: 'Retail',
    region: 'Saudi Arabia',
    city: 'Riyadh',
    researchDate: '2026-10-11',
    researchedBy: 'Tariq Mansoor',
    annualRevenue: '$850M',
    employeeCount: 2800,
    opportunityScore: 88,
    status: 'Qualified for Outreach',
    website: 'www.pinnacleretail.sa',
    contractsCount: 3,
    totalContractValue: 1950000,
    painPoints: ['Omnichannel inventory latency', 'E-commerce logistics last-mile sync', 'Loyalty app retention'],
    techStack: ['SAP S/4HANA', 'Oracle Commerce Cloud', 'Shopify Plus', 'MuleSoft'],
    executiveContact: {
      name: 'Faisal Al-Zahrani',
      title: 'Chief Commercial & Supply Officer',
      email: 'f.alzahrani@pinnacleretail.sa'
    },
    researchNotes: 'Expanding across 45 new hypermarket locations across GCC. Actively procuring unified POS and supply chain analytics.',
    contracts: [
      {
        id: 'CON-RET-301',
        title: 'Smart Automated Warehouse Sorting Grid',
        clientOrAgency: 'Pinnacle Logistics KSA',
        estimatedValue: 950000,
        publishedDate: '2026-10-01',
        submissionDeadline: '2026-11-25',
        status: 'Active',
        scope: 'Automated guided vehicles and IoT RFID sorting systems for central Riyadh fulfillment hub.'
      },
      {
        id: 'CON-RET-302',
        title: 'Hyper-Personalized Recommendation Engine',
        clientOrAgency: 'Digital Marketing & CRM Division',
        estimatedValue: 600000,
        publishedDate: '2026-09-15',
        submissionDeadline: '2026-10-25',
        status: 'Under Review',
        scope: 'AI real-time personalization for mobile shopping app with Arabic NLP support.'
      },
      {
        id: 'CON-RET-303',
        title: 'In-Store Frictionless Checkout Prototype',
        clientOrAgency: 'Pinnacle Innovation Labs',
        estimatedValue: 400000,
        publishedDate: '2026-07-20',
        submissionDeadline: '2026-08-30',
        status: 'Awarded',
        scope: 'Computer vision assisted self-checkout kiosks in 10 flagship Jeddah branches.'
      }
    ]
  },
  {
    id: 'RES-004',
    companyName: 'BluePeak Energy Systems',
    industry: 'Energy',
    region: 'USA',
    city: 'Houston, TX',
    researchDate: '2026-10-10',
    researchedBy: 'Sarah Chen',
    annualRevenue: '$3.8B',
    employeeCount: 6200,
    opportunityScore: 92,
    status: 'High Priority',
    website: 'www.bluepeakenergy.com',
    contractsCount: 2,
    totalContractValue: 2800000,
    painPoints: ['Grid renewable intermittency tracking', 'Asset predictive maintenance', 'Cybersecurity for OT/SCADA'],
    techStack: ['OSIsoft PI System', 'Siemens MindSphere', 'AWS IoT', 'Splunk Industrial'],
    executiveContact: {
      name: 'Marcus Sterling',
      title: 'VP Grid Modernization & Operations',
      email: 'm.sterling@bluepeakenergy.com'
    },
    researchNotes: 'Awarded federal DOE infrastructure grant for wind/solar grid stabilization. High willingness to spend.',
    contracts: [
      {
        id: 'CON-ENG-401',
        title: 'Renewable Generation SCADA Security Uplift',
        clientOrAgency: 'NERC Compliance Board',
        estimatedValue: 1800000,
        publishedDate: '2026-10-05',
        submissionDeadline: '2026-11-30',
        status: 'Active',
        scope: 'Zero-trust architecture deployment across 14 substation control networks and distributed battery storage.'
      },
      {
        id: 'CON-ENG-402',
        title: 'Predictive Turbine Vibration AI System',
        clientOrAgency: 'Offshore Asset Reliability Unit',
        estimatedValue: 1000000,
        publishedDate: '2026-09-10',
        submissionDeadline: '2026-10-28',
        status: 'Under Review',
        scope: 'Edge IoT sensor telemetry and deep learning for bearing wear early anomaly warning.'
      }
    ]
  },
  {
    id: 'RES-005',
    companyName: 'Atlas Telecom Solutions',
    industry: 'Telecom',
    region: 'Canada',
    city: 'Montreal, QC',
    researchDate: '2026-10-09',
    researchedBy: 'Alex Miller',
    annualRevenue: '$2.1B',
    employeeCount: 5400,
    opportunityScore: 89,
    status: 'In Evaluation',
    website: 'www.atlastelecom.ca',
    contractsCount: 3,
    totalContractValue: 2100000,
    painPoints: ['5G standalone core monetization', 'Customer churn in enterprise fiber', 'BSS/OSS decoupling'],
    techStack: ['Ericsson 5G Core', 'Amdocs BSS', 'Kubernetes', 'Google Cloud Anthos'],
    executiveContact: {
      name: 'Nathalie Lemieux',
      title: 'Chief Network & Information Officer',
      email: 'n.lemieux@atlastelecom.ca'
    },
    researchNotes: 'Planning multi-million dollar transformation of legacy billing system into cloud native microservices.',
    contracts: [
      {
        id: 'CON-TEL-501',
        title: '5G Edge Slicing Management Orchestrator',
        clientOrAgency: 'Atlas Advanced Networks',
        estimatedValue: 1300000,
        publishedDate: '2026-09-25',
        submissionDeadline: '2026-11-12',
        status: 'Active',
        scope: 'Automated network slice provisioning for private enterprise 5G campuses.'
      },
      {
        id: 'CON-TEL-502',
        title: 'Enterprise Billing & Self-Service Portal Modernization',
        clientOrAgency: 'Atlas BSS Transformation Group',
        estimatedValue: 800000,
        publishedDate: '2026-10-03',
        submissionDeadline: '2026-11-18',
        status: 'Upcoming',
        scope: 'Modern React-based portal with real-time CDR invoice generation.'
      }
    ]
  },
  {
    id: 'RES-006',
    companyName: 'Vertex Systems KSA',
    industry: 'Technology',
    region: 'Saudi Arabia',
    city: 'Dammam',
    researchDate: '2026-10-08',
    researchedBy: 'Tariq Mansoor',
    annualRevenue: '$620M',
    employeeCount: 1950,
    opportunityScore: 87,
    status: 'Qualified for Outreach',
    website: 'www.vertexsystems.sa',
    contractsCount: 2,
    totalContractValue: 1450000,
    painPoints: ['Sovereign cloud data residency', 'DevSecOps tooling standardization', 'Talent shortage in AI engineering'],
    techStack: ['Oracle Cloud Saudi Region', 'GitLab Enterprise', 'Terraform', 'PostgreSQL'],
    executiveContact: {
      name: 'Hassan Al-Ghamdi',
      title: 'VP of Platform Engineering',
      email: 'hassan@vertexsystems.sa'
    },
    researchNotes: 'Key partner in Vision 2030 digital government initiatives. Seeking external advisory on high-concurrency microservices.',
    contracts: [
      {
        id: 'CON-TEC-601',
        title: 'National Citizen Portal Micro-frontend Migration',
        clientOrAgency: 'Digital Government Authority (DGA)',
        estimatedValue: 950000,
        publishedDate: '2026-09-18',
        submissionDeadline: '2026-11-05',
        status: 'Active',
        scope: 'Modernizing 12 legacy departmental portals into a single responsive micro-frontend architecture.'
      },
      {
        id: 'CON-TEC-602',
        title: 'Automated CI/CD Governance & SBOM Enforcement',
        clientOrAgency: 'Vertex Security Office',
        estimatedValue: 500000,
        publishedDate: '2026-10-01',
        submissionDeadline: '2026-11-20',
        status: 'Active',
        scope: 'Enterprise-wide pipeline scanning with automated vulnerability remediation.'
      }
    ]
  },
  {
    id: 'RES-007',
    companyName: 'Cedar Manufacturing Corp',
    industry: 'Manufacturing',
    region: 'USA',
    city: 'Detroit, MI',
    researchDate: '2026-10-07',
    researchedBy: 'Jordan Chen',
    annualRevenue: '$1.8B',
    employeeCount: 4600,
    opportunityScore: 86,
    status: 'In Evaluation',
    website: 'www.cedarmfg.com',
    contractsCount: 2,
    totalContractValue: 1850000,
    painPoints: ['Supply chain visibility across tier-2 suppliers', 'Plant floor machine downtime', 'Quality inspection scrap rate'],
    techStack: ['Rockwell Automation', 'PTC ThingWorx', 'SAP ERP', 'Azure IoT Edge'],
    executiveContact: {
      name: 'Robert Kowalski',
      title: 'Senior VP Global Operations',
      email: 'r.kowalski@cedarmfg.com'
    },
    researchNotes: 'Upgrading 3 assembly plants to Industry 4.0 standards. RFE released for smart factory machine vision.',
    contracts: [
      {
        id: 'CON-MFG-701',
        title: 'Automated Optical Quality Inspection Vision System',
        clientOrAgency: 'Cedar Advanced Manufacturing Lab',
        estimatedValue: 1150000,
        publishedDate: '2026-09-22',
        submissionDeadline: '2026-11-15',
        status: 'Active',
        scope: 'Deploying high-speed cameras and deep learning defect classification across stamping lines.'
      },
      {
        id: 'CON-MFG-702',
        title: 'Supplier EDI & Real-time Material Tracking Hub',
        clientOrAgency: 'Cedar Procurement Office',
        estimatedValue: 700000,
        publishedDate: '2026-08-30',
        submissionDeadline: '2026-10-20',
        status: 'Under Review',
        scope: 'Cloud-based supplier portal with automated ASN matching and demurrage alerts.'
      }
    ]
  },
  {
    id: 'RES-008',
    companyName: 'Summit Advisory Partners',
    industry: 'Professional Services',
    region: 'Canada',
    city: 'Vancouver, BC',
    researchDate: '2026-10-06',
    researchedBy: 'Alex Miller',
    annualRevenue: '$420M',
    employeeCount: 1400,
    opportunityScore: 84,
    status: 'Nurturing',
    website: 'www.summitadvisory.ca',
    contractsCount: 2,
    totalContractValue: 1200000,
    painPoints: ['Knowledge siloed across partner practices', 'Proposal drafting turnaround time', 'Client billing reconciliation'],
    techStack: ['Workday', 'Microsoft 365 Copilot', 'Salesforce CRM', 'Intapp'],
    executiveContact: {
      name: 'Claire Tremblay',
      title: 'Managing Director & Head of Innovation',
      email: 'claire@summitadvisory.ca'
    },
    researchNotes: 'Leadership keen on GenAI knowledge graph to unlock internal IP for accelerated RFP generation.',
    contracts: [
      {
        id: 'CON-PRO-801',
        title: 'Enterprise Semantic Knowledge Search & Synthesis',
        clientOrAgency: 'Summit Practice Leadership',
        estimatedValue: 750000,
        publishedDate: '2026-09-14',
        submissionDeadline: '2026-10-31',
        status: 'Active',
        scope: 'RAG-based search engine indexing 15 years of client deliverables with role-based access control.'
      },
      {
        id: 'CON-PRO-802',
        title: 'Automated Time & Billing Real-Time Analytics',
        clientOrAgency: 'Summit Financial Operations',
        estimatedValue: 450000,
        publishedDate: '2026-08-10',
        submissionDeadline: '2026-09-25',
        status: 'Awarded',
        scope: 'Power BI embedded dashboard for partner utilization and WIP realization metrics.'
      }
    ]
  },
  {
    id: 'RES-009',
    companyName: 'Harbor Logistics & Freight',
    industry: 'Retail',
    region: 'Saudi Arabia',
    city: 'Jeddah',
    researchDate: '2026-10-05',
    researchedBy: 'Tariq Mansoor',
    annualRevenue: '$510M',
    employeeCount: 2300,
    opportunityScore: 85,
    status: 'In Evaluation',
    website: 'www.harborlogistics.sa',
    contractsCount: 2,
    totalContractValue: 1400000,
    painPoints: ['Red Sea port clearance delays', 'Refrigerated container temperature tracking', 'Fleet route optimization'],
    techStack: ['Oracle Transportation Mgmt', 'Geotab Telematics', 'AWS Middle East'],
    executiveContact: {
      name: 'Mansoor Al-Otaibi',
      title: 'Director of Maritime & Fleet Logistics',
      email: 'm.otaibi@harborlogistics.sa'
    },
    researchNotes: 'Fast-growing logistics concession holder at King Abdullah Port. Evaluating cold-chain telematics platforms.',
    contracts: [
      {
        id: 'CON-LOG-901',
        title: 'Real-Time Reefer Container Telemetry & Alerting',
        clientOrAgency: 'Saudi Ports Authority Joint Initiative',
        estimatedValue: 850000,
        publishedDate: '2026-09-29',
        submissionDeadline: '2026-11-15',
        status: 'Active',
        scope: 'Continuous temperature and humidity tracking via satellite uplink for pharmaceutical freight.'
      },
      {
        id: 'CON-LOG-902',
        title: 'Customs Clearance Automation OCR Pipeline',
        clientOrAgency: 'Harbor Digital Office',
        estimatedValue: 550000,
        publishedDate: '2026-09-02',
        submissionDeadline: '2026-10-18',
        status: 'Under Review',
        scope: 'Bilingual Arabic-English bill of lading parsing and automated declaration filing.'
      }
    ]
  },
  {
    id: 'RES-010',
    companyName: 'Oakline Financial Group',
    industry: 'Banking',
    region: 'USA',
    city: 'Chicago, IL',
    researchDate: '2026-10-04',
    researchedBy: 'Sarah Chen',
    annualRevenue: '$1.7B',
    employeeCount: 3400,
    opportunityScore: 90,
    status: 'High Priority',
    website: 'www.oaklinefinancial.com',
    contractsCount: 3,
    totalContractValue: 2250000,
    painPoints: ['Commercial lending underwriting cycle', 'Disjointed customer onboarding', 'Regulatory reporting audits'],
    techStack: ['nCino', 'Salesforce CRM', 'AWS Serverless', 'Tableau'],
    executiveContact: {
      name: 'Deborah Klein',
      title: 'EVP Head of Commercial Banking',
      email: 'dklein@oaklinefinancial.com'
    },
    researchNotes: 'Initiating multi-state commercial credit modernization. Targeted proposal ready for review.',
    contracts: [
      {
        id: 'CON-BNK-1001',
        title: 'Commercial Loan Underwriting Automation Engine',
        clientOrAgency: 'Oakline Credit Committee',
        estimatedValue: 1350000,
        publishedDate: '2026-09-26',
        submissionDeadline: '2026-11-08',
        status: 'Active',
        scope: 'Automated spreading of tax returns, bank statements, and debt covenants into decision matrix.'
      },
      {
        id: 'CON-BNK-1002',
        title: 'Compliance Audit Trail & Basel III Reporting',
        clientOrAgency: 'Chief Risk Officer Office',
        estimatedValue: 600000,
        publishedDate: '2026-08-18',
        submissionDeadline: '2026-10-05',
        status: 'Awarded',
        scope: 'Immutable audit logs and liquidity stress testing analytical models.'
      },
      {
        id: 'CON-BNK-1003',
        title: 'Customer Identity Verification & Biometric KYC',
        clientOrAgency: 'Oakline Digital Channels',
        estimatedValue: 300000,
        publishedDate: '2026-10-02',
        submissionDeadline: '2026-11-28',
        status: 'Upcoming',
        scope: 'Fast identity onboarding with instant facial matching and sanction screening.'
      }
    ]
  },
  {
    id: 'RES-011',
    companyName: 'Greenfield Clinics & Diagnostics',
    industry: 'Healthcare',
    region: 'Canada',
    city: 'Calgary, AB',
    researchDate: '2026-09-28',
    researchedBy: 'Alex Miller',
    annualRevenue: '$680M',
    employeeCount: 2100,
    opportunityScore: 83,
    status: 'In Evaluation',
    website: 'www.greenfieldclinics.ca',
    contractsCount: 2,
    totalContractValue: 1350000,
    painPoints: ['Patient appointment no-show rate', 'Diagnostic imaging transfer delays', 'Paper consent forms'],
    techStack: ['Telus Health', 'Microsoft Teams Healthcare', 'Postgres Cloud'],
    executiveContact: {
      name: 'Dr. Aaron Fletcher',
      title: 'Chief Medical Officer',
      email: 'a.fletcher@greenfieldclinics.ca'
    },
    researchNotes: 'Provincial pilot underway for outpatient digital check-in and automated SMS reminders.',
    contracts: [
      {
        id: 'CON-HLT-1101',
        title: 'Integrated PACS Cloud Diagnostic Archive',
        clientOrAgency: 'Alberta Health Services Liaison',
        estimatedValue: 850000,
        publishedDate: '2026-09-15',
        submissionDeadline: '2026-10-30',
        status: 'Active',
        scope: 'Cloud PACS migration allowing multi-clinic radiologists instant access to 3D tomography.'
      },
      {
        id: 'CON-HLT-1102',
        title: 'Digital Patient Engagement & Check-In Kiosks',
        clientOrAgency: 'Greenfield Clinic Operations',
        estimatedValue: 500000,
        publishedDate: '2026-08-22',
        submissionDeadline: '2026-09-29',
        status: 'Awarded',
        scope: 'Self-serve check-in kiosks in 28 clinic locations with multilingual consent workflows.'
      }
    ]
  },
  {
    id: 'RES-012',
    companyName: 'Apex Commerce Holding',
    industry: 'Retail',
    region: 'Saudi Arabia',
    city: 'Riyadh',
    researchDate: '2026-09-25',
    researchedBy: 'Tariq Mansoor',
    annualRevenue: '$920M',
    employeeCount: 3100,
    opportunityScore: 87,
    status: 'Qualified for Outreach',
    website: 'www.apexcommerce.sa',
    contractsCount: 2,
    totalContractValue: 1700000,
    painPoints: ['Cross-border GCC tax & invoicing', 'Payment gateway checkout drops', 'Warehouse picking speed'],
    techStack: ['Magento Enterprise', 'SAP Hybris', 'Checkout.com', 'Kubernetes'],
    executiveContact: {
      name: 'Sultan Al-Harbi',
      title: 'Chief Digital Officer',
      email: 'sultan@apexcommerce.sa'
    },
    researchNotes: 'Scaling digital market presence into UAE and Kuwait. Requesting vendor pitches for unified payments.',
    contracts: [
      {
        id: 'CON-RET-1201',
        title: 'Cross-Border Unified Payment Switch Gateway',
        clientOrAgency: 'Apex Fintech Subsidiary',
        estimatedValue: 1100000,
        publishedDate: '2026-09-10',
        submissionDeadline: '2026-10-28',
        status: 'Active',
        scope: 'Multi-currency settlement switch integrating Mada, Apple Pay, and local GCC payment rails.'
      },
      {
        id: 'CON-RET-1202',
        title: 'ZATCA Phase 2 E-Invoicing Real-Time Integration',
        clientOrAgency: 'Apex Group Finance',
        estimatedValue: 600000,
        publishedDate: '2026-08-14',
        submissionDeadline: '2026-09-20',
        status: 'Awarded',
        scope: 'Cryptographic invoice signing and automated submission to Saudi tax authority clearance server.'
      }
    ]
  },
  {
    id: 'RES-013',
    companyName: 'Lumen Utilities Corporation',
    industry: 'Energy',
    region: 'USA',
    city: 'Phoenix, AZ',
    researchDate: '2026-09-22',
    researchedBy: 'Sarah Chen',
    annualRevenue: '$2.9B',
    employeeCount: 5100,
    opportunityScore: 91,
    status: 'High Priority',
    website: 'www.lumenutilities.com',
    contractsCount: 2,
    totalContractValue: 2150000,
    painPoints: ['Peak demand load shedding', 'Smart meter AMI telemetry scale', 'Wildfire prevention sensors'],
    techStack: ['Itron AMI', 'Oracle Utilities CC&B', 'AWS Cloud', 'Palantir Foundry'],
    executiveContact: {
      name: 'Gerald Barnes',
      title: 'VP Power Delivery & Smart Grid',
      email: 'gbarnes@lumenutilities.com'
    },
    researchNotes: 'Deploying 1.2 million smart electric meters. Looking for advanced analytics for customer time-of-use tariffs.',
    contracts: [
      {
        id: 'CON-ENG-1301',
        title: 'Smart Meter AMI Big Data Ingestion Lake',
        clientOrAgency: 'Lumen Meter Operations',
        estimatedValue: 1450000,
        publishedDate: '2026-09-08',
        submissionDeadline: '2026-10-31',
        status: 'Active',
        scope: 'Streaming pipeline handling 15-minute interval reads across 1.2M devices with anomaly flags.'
      },
      {
        id: 'CON-ENG-1302',
        title: 'Vegetation Risk & Satellite Thermal Detection',
        clientOrAgency: 'Environmental Safety Committee',
        estimatedValue: 700000,
        publishedDate: '2026-07-30',
        submissionDeadline: '2026-09-15',
        status: 'Awarded',
        scope: 'Satellite multispectral imagery analysis for power transmission line clearance compliance.'
      }
    ]
  },
  {
    id: 'RES-014',
    companyName: 'Orbit Networks Inc',
    industry: 'Telecom',
    region: 'Canada',
    city: 'Ottawa, ON',
    researchDate: '2026-09-20',
    researchedBy: 'Alex Miller',
    annualRevenue: '$1.4B',
    employeeCount: 3800,
    opportunityScore: 85,
    status: 'In Evaluation',
    website: 'www.orbitnetworks.ca',
    contractsCount: 2,
    totalContractValue: 1550000,
    painPoints: ['Rural broadband latency', 'LEO satellite ground station link', 'Subscriber service assurance'],
    techStack: ['Nokia IP Routing', 'Cisco DNA', 'OpenStack', 'Elasticsearch'],
    executiveContact: {
      name: 'Philippe Tremblay',
      title: 'VP Broadband Engineering',
      email: 'p.tremblay@orbitnetworks.ca'
    },
    researchNotes: 'Canadian Universal Broadband Fund beneficiary. Upgrading rural fiber backhaul to gigabit capability.',
    contracts: [
      {
        id: 'CON-TEL-1401',
        title: 'Rural Fiber Optical Transport Architecture',
        clientOrAgency: 'CRTC Broadband Acceleration Project',
        estimatedValue: 1050000,
        publishedDate: '2026-09-05',
        submissionDeadline: '2026-10-25',
        status: 'Active',
        scope: 'DWDM optical transport ring installation connecting 60 northern communities.'
      },
      {
        id: 'CON-TEL-1402',
        title: 'Network Operations Center AI Event Correlation',
        clientOrAgency: 'Orbit NOC Operations',
        estimatedValue: 500000,
        publishedDate: '2026-08-10',
        submissionDeadline: '2026-09-20',
        status: 'Awarded',
        scope: 'Root-cause analysis engine reducing noise from 50,000 daily network SNMP traps.'
      }
    ]
  },
  {
    id: 'RES-015',
    companyName: 'Cobalt Works Technologies',
    industry: 'Technology',
    region: 'Saudi Arabia',
    city: 'Riyadh',
    researchDate: '2026-09-18',
    researchedBy: 'Tariq Mansoor',
    annualRevenue: '$780M',
    employeeCount: 2400,
    opportunityScore: 90,
    status: 'High Priority',
    website: 'www.cobaltworks.sa',
    contractsCount: 3,
    totalContractValue: 2300000,
    painPoints: ['AI Sovereign Foundation Model deployment', 'Cyber defense against nation-state APTs', 'Container security'],
    techStack: ['NVIDIA DGX SuperPOD', 'Red Hat OpenShift', 'CrowdStrike', 'Kubernetes'],
    executiveContact: {
      name: 'Dr. Bader Al-Dosari',
      title: 'Chief AI & Research Scientist',
      email: 'bader@cobaltworks.sa'
    },
    researchNotes: 'Leading research lab contracted by sovereign fund to build bilingual generative models. Highest priority.',
    contracts: [
      {
        id: 'CON-TEC-1501',
        title: 'Arabic Foundation Model Training Cluster Optimization',
        clientOrAgency: 'National AI Initiative',
        estimatedValue: 1400000,
        publishedDate: '2026-09-02',
        submissionDeadline: '2026-10-29',
        status: 'Active',
        scope: 'Distributed GPU training fabric tuning, InfiniBand topology, and checkpoint storage optimization.'
      },
      {
        id: 'CON-TEC-1502',
        title: 'Sovereign Cloud Data Guardrail & Watermarking',
        clientOrAgency: 'Cyber Security Regulatory Authority',
        estimatedValue: 600000,
        publishedDate: '2026-08-15',
        submissionDeadline: '2026-09-30',
        status: 'Under Review',
        scope: 'Data leakage prevention and synthetic content provenance watermarking algorithms.'
      },
      {
        id: 'CON-TEC-1503',
        title: 'AI Sandbox Environment for Government FinTech',
        clientOrAgency: 'Central Bank Innovation Sandbox',
        estimatedValue: 300000,
        publishedDate: '2026-07-12',
        submissionDeadline: '2026-08-20',
        status: 'Awarded',
        scope: 'Secure multi-tenant synthetic transaction environment for banking algorithmic models.'
      }
    ]
  },
  {
    id: 'RES-016',
    companyName: 'Ridgeway Transport & Heavy Rail',
    industry: 'Manufacturing',
    region: 'USA',
    city: 'Pittsburgh, PA',
    researchDate: '2026-09-15',
    researchedBy: 'Jordan Chen',
    annualRevenue: '$2.3B',
    employeeCount: 5200,
    opportunityScore: 88,
    status: 'In Evaluation',
    website: 'www.ridgewaytransport.com',
    contractsCount: 2,
    totalContractValue: 1900000,
    painPoints: ['Locomotive engine telemetry failure prediction', 'Rail weld crack acoustic sensing', 'Inventory spare parts lead time'],
    techStack: ['GE Predix', 'SAP S/4HANA', 'PTC Windchill', 'Azure Databricks'],
    executiveContact: {
      name: 'Kenneth Wright',
      title: 'Chief Mechanical & Safety Officer',
      email: 'kwright@ridgewaytransport.com'
    },
    researchNotes: 'Procuring condition-based maintenance system to reduce unscheduled mainline train stoppages.',
    contracts: [
      {
        id: 'CON-MFG-1601',
        title: 'Acoustic Wayside Track Geometry & Bearing Scanner',
        clientOrAgency: 'Federal Railroad Administration Grant',
        estimatedValue: 1250000,
        publishedDate: '2026-08-28',
        submissionDeadline: '2026-10-22',
        status: 'Active',
        scope: 'High-speed trackside microphone arrays and thermal imaging scanners at 80 strategic rail junctions.'
      },
      {
        id: 'CON-MFG-1602',
        title: 'Predictive Rail Yard Maintenance Dispatch AI',
        clientOrAgency: 'Ridgeway Operations Center',
        estimatedValue: 650000,
        publishedDate: '2026-07-18',
        submissionDeadline: '2026-08-29',
        status: 'Awarded',
        scope: 'Automated work-order generation and parts reservation when ultrasonic testing detects metal fatigue.'
      }
    ]
  },
  {
    id: 'RES-017',
    companyName: 'Crestview Strategic Partners',
    industry: 'Professional Services',
    region: 'Canada',
    city: 'Toronto, ON',
    researchDate: '2026-09-12',
    researchedBy: 'Alex Miller',
    annualRevenue: '$380M',
    employeeCount: 1100,
    opportunityScore: 82,
    status: 'Nurturing',
    website: 'www.crestviewpartners.ca',
    contractsCount: 2,
    totalContractValue: 980000,
    painPoints: ['M&A deal virtual data room speed', 'Regulatory antitrust filings', 'Consultant staffing mismatch'],
    techStack: ['Intralinks', 'Salesforce Financial Cloud', 'Power Automate', 'Box Enterprise'],
    executiveContact: {
      name: 'Simon Lefevre',
      title: 'Managing Partner - M&A Practice',
      email: 's.lefevre@crestviewpartners.ca'
    },
    researchNotes: 'Boutique investment advisory seeing record deal volume in Canadian renewable energy assets.',
    contracts: [
      {
        id: 'CON-PRO-1701',
        title: 'Intelligent Deal Sourcing & Target Screening Platform',
        clientOrAgency: 'Crestview Analytics Group',
        estimatedValue: 580000,
        publishedDate: '2026-08-25',
        submissionDeadline: '2026-10-15',
        status: 'Active',
        scope: 'Scraping and analyzing private company filings and patent databases for M&A synergy scoring.'
      },
      {
        id: 'CON-PRO-1702',
        title: 'Automated Financial Due Diligence Parser',
        clientOrAgency: 'Crestview Due Diligence Team',
        estimatedValue: 400000,
        publishedDate: '2026-07-20',
        submissionDeadline: '2026-08-30',
        status: 'Awarded',
        scope: 'Spreadsheet formula audit and anomaly flagger for rapid target financial statement normalization.'
      }
    ]
  },
  {
    id: 'RES-018',
    companyName: 'Pacific Sovereign Capital',
    industry: 'Banking',
    region: 'USA',
    city: 'San Francisco, CA',
    researchDate: '2026-09-10',
    researchedBy: 'Sarah Chen',
    annualRevenue: '$3.2B',
    employeeCount: 4800,
    opportunityScore: 93,
    status: 'High Priority',
    website: 'www.pacificsovereign.com',
    contractsCount: 3,
    totalContractValue: 2600000,
    painPoints: ['Private wealth client digital onboarding', 'Real-time portfolio stress testing', 'SEC compliance audits'],
    techStack: ['Charles River Development', 'Snowflake Financial', 'AWS Fargate', 'HashiCorp Vault'],
    executiveContact: {
      name: 'Victoria Hastings',
      title: 'Chief Digital Officer & Partner',
      email: 'vhastings@pacificsovereign.com'
    },
    researchNotes: 'Expanding institutional family office services. High budget for ultra-secure customer portals.',
    contracts: [
      {
        id: 'CON-BNK-1801',
        title: 'Ultra-High-Net-Worth Mobile Client Experience App',
        clientOrAgency: 'Private Wealth Management Division',
        estimatedValue: 1400000,
        publishedDate: '2026-08-30',
        submissionDeadline: '2026-10-20',
        status: 'Active',
        scope: 'Bespoke iOS application with encrypted messaging, capital call approvals, and wealth visualizations.'
      },
      {
        id: 'CON-BNK-1802',
        title: 'Monte Carlo Portfolio Stress Engine on Snowflake',
        clientOrAgency: 'Risk Modeling & Governance',
        estimatedValue: 800000,
        publishedDate: '2026-08-05',
        submissionDeadline: '2026-09-22',
        status: 'Under Review',
        scope: '10,000-scenario macroeconomic stress test simulation engine executing in under 2 minutes.'
      },
      {
        id: 'CON-BNK-1803',
        title: 'Hardware Security Module Key Management Upgrade',
        clientOrAgency: 'Cyber Security Operations',
        estimatedValue: 400000,
        publishedDate: '2026-06-25',
        submissionDeadline: '2026-08-10',
        status: 'Awarded',
        scope: 'Thales Luna HSM cluster deployment for cryptographic signing of SWIFT wire transfers.'
      }
    ]
  },
  {
    id: 'RES-019',
    companyName: 'Maple Leaf BioSciences',
    industry: 'Healthcare',
    region: 'Canada',
    city: 'Halifax, NS',
    researchDate: '2026-09-08',
    researchedBy: 'Alex Miller',
    annualRevenue: '$590M',
    employeeCount: 1750,
    opportunityScore: 86,
    status: 'In Evaluation',
    website: 'www.mapleleafbio.ca',
    contractsCount: 2,
    totalContractValue: 1300000,
    painPoints: ['Clinical trial participant retention', 'Genome sequencing storage cost', 'Health Canada submission logs'],
    techStack: ['Veeva Vault', 'AWS HealthOmics', 'SAS Analytics', 'Docker'],
    executiveContact: {
      name: 'Dr. Jean-Luc Roy',
      title: 'VP Clinical Research Operations',
      email: 'jl.roy@mapleleafbio.ca'
    },
    researchNotes: 'Phase III oncology trial initiating across 14 Canadian clinical sites. Veeva integration expertise required.',
    contracts: [
      {
        id: 'CON-HLT-1901',
        title: 'Decentralized Clinical Trial e-Consent & Mobile App',
        clientOrAgency: 'Canadian Institutes of Health Research',
        estimatedValue: 800000,
        publishedDate: '2026-08-20',
        submissionDeadline: '2026-10-14',
        status: 'Active',
        scope: 'HIPAA and PIPEDA compliant patient telemetry application with video consultation.'
      },
      {
        id: 'CON-HLT-1902',
        title: 'High-Throughput Genomic Variant Annotation Pipeline',
        clientOrAgency: 'BioSciences Genomics Lab',
        estimatedValue: 500000,
        publishedDate: '2026-07-15',
        submissionDeadline: '2026-08-25',
        status: 'Awarded',
        scope: 'Nextflow bioinformatics pipeline for automated variant calling on whole-exome sequencing.'
      }
    ]
  },
  {
    id: 'RES-020',
    companyName: 'Red Sea Petrochemical Industries',
    industry: 'Energy',
    region: 'Saudi Arabia',
    city: 'Yanbu',
    researchDate: '2026-09-05',
    researchedBy: 'Tariq Mansoor',
    annualRevenue: '$4.6B',
    employeeCount: 7800,
    opportunityScore: 95,
    status: 'High Priority',
    website: 'www.redseapetrochem.sa',
    contractsCount: 3,
    totalContractValue: 3400000,
    painPoints: ['Cracker unit emission compliance', 'Refinery flare gas monitoring', 'Field worker safety IoT'],
    techStack: ['Honeywell Experion', 'Yokogawa DCS', 'SAP Plant Maintenance', 'Azure Cloud'],
    executiveContact: {
      name: 'Eng. Khalid Al-Majed',
      title: 'Executive VP Manufacturing & Engineering',
      email: 'khalid@redseapetrochem.sa'
    },
    researchNotes: 'Massive carbon reduction initiative funded by Ministry of Energy. High strategic priority for enterprise transformation.',
    contracts: [
      {
        id: 'CON-ENG-2001',
        title: 'Continuous Emissions Monitoring & AI Reduction Model',
        clientOrAgency: 'Royal Commission for Jubail & Yanbu',
        estimatedValue: 1800000,
        publishedDate: '2026-08-18',
        submissionDeadline: '2026-10-25',
        status: 'Active',
        scope: 'Real-time flue gas analyzer integration and automated fuel-air ratio optimization across 6 boilers.'
      },
      {
        id: 'CON-ENG-2002',
        title: 'Hazardous Area ATEX Certified Wearable Safety IoT',
        clientOrAgency: 'Health, Safety & Environment Board',
        estimatedValue: 950000,
        publishedDate: '2026-08-01',
        submissionDeadline: '2026-09-18',
        status: 'Under Review',
        scope: 'Zone 1 certified smart helmets with toxic gas sensors, man-down motion detection, and mesh radios.'
      },
      {
        id: 'CON-ENG-2003',
        title: 'Pipeline Cathodic Protection Sensor Mesh',
        clientOrAgency: 'Offsite Pipeline Operations',
        estimatedValue: 650000,
        publishedDate: '2026-06-15',
        submissionDeadline: '2026-07-30',
        status: 'Awarded',
        scope: 'Corrosion prevention monitoring across 320 km of ethylene transport pipelines.'
      }
    ]
  }
]
