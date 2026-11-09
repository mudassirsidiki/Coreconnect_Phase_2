/**
 * Centralized Configuration for Ideal Customer Profile & Go-To-Market Strategy
 * Clients and administrators can update choices, prefill values, and defaults here.
 */

import { type GtmStrategyFormData } from './gtm-types'

export const GTM_CONFIG = {
  // Section 1: Products / Services
  products: {
    prefilledList: [
      'BIM Coordination',
      'BIM Modeling',
      'MEP Framing',
      'Clash Detection',
      'Shop Drawings Generation',
      'Point Cloud to BIM',
      'Facility Management BIM (COBie)'
    ],
    defaultSelected: ['BIM Coordination', 'BIM Modeling', 'MEP Framing']
  },

  // Section 2: Geography
  geography: {
    countries: [
      { value: 'USA', label: 'United States of America' },
      { value: 'Canada', label: 'Canada' },
      { value: 'Saudi Arabia', label: 'Saudi Arabia' },
      { value: 'United Arab Emirates', label: 'United Arab Emirates' },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'Australia', label: 'Australia' },
      { value: 'Other', label: 'Other International' }
    ],
    defaultCountry: 'USA',
    prefilledRegions: [
      'California, Nevada, Oregon/Seattle',
      'North Carolina',
      'Texas',
      'Florida',
      'New York'
    ]
  },

  // Section 3: Target Industry
  industry: {
    subContractorTrades: [
      'Electrical',
      'Mechanical',
      'Plumbing',
      'Structural/Framing',
      'Drywall & Acoustical',
      'Fire Protection',
      'HVAC & Sheet Metal'
    ],
    defaultTrades: ['Electrical', 'Mechanical', 'Plumbing', 'Structural/Framing']
  },

  // Section 4: Company Size
  companySize: {
    employeeRanges: [
      { id: 'size_2_50', label: '2–50 (SME)' },
      { id: 'size_51_200', label: '51–200' },
      { id: 'size_201_500', label: '201–500' },
      { id: 'size_500_plus', label: '500+' },
      { id: 'size_custom', label: 'Custom range' }
    ],
    revenueRanges: [
      { id: 'rev_under_5m', label: '< $5M ARR (SME)' },
      { id: 'rev_5m_25m', label: '$5M – $25M' },
      { id: 'rev_25m_100m', label: '$25M – $100M' },
      { id: 'rev_100m_plus', label: '$100M+' },
      { id: 'rev_custom', label: 'Custom range' }
    ]
  },

  // Section 5: Target Job Titles
  jobTitles: {
    prefilledList: [
      'Project Manager',
      'Estimator',
      'Pre-construction Manager',
      'Project Engineer',
      'VP of Operations',
      'VDC / BIM Director',
      'Chief Estimator'
    ],
    defaultSelected: ['Project Manager', 'Estimator', 'Pre-construction Manager', 'Project Engineer']
  },

  // Section 7: Outreach Channels
  outreach: {
    channels: [
      { id: 'email', label: 'Email Outreach', defaultDetails: '3-stage cold sequence, personalized value proposition with case studies.' },
      { id: 'linkedIn', label: 'LinkedIn Social Selling', defaultDetails: 'Connection request + 2 nurture direct messages sharing relevant project wins.' },
      { id: 'calls', label: 'Direct Cold Calling', defaultDetails: 'Targeted follow-up calls to opened emails and tier-1 decision makers.' }
    ]
  },

  // Section 10: CRM Providers
  crm: {
    providers: [
      'HubSpot',
      'Salesforce',
      'Pipedrive',
      'Zoho CRM',
      'Microsoft Dynamics 365',
      'ActiveCampaign',
      'Other'
    ]
  },

  // Section 11: Weekly Meeting
  weeklyMeeting: {
    daysOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    defaultDay: 'Tuesday',
    defaultTime: '10:00 AM',
    timeZones: [
      { value: 'PST/America/Los_Angeles', label: 'PST / America/Los_Angeles (UTC-8)' },
      { value: 'MST/America/Denver', label: 'MST / America/Denver (UTC-7)' },
      { value: 'CST/America/Chicago', label: 'CST / America/Chicago (UTC-6)' },
      { value: 'EST/America/New_York', label: 'EST / America/New_York (UTC-5)' },
      { value: 'GMT/Europe/London', label: 'GMT / Europe/London (UTC+0)' },
      { value: 'AST/Asia/Riyadh', label: 'AST / Asia/Riyadh (UTC+3)' },
      { value: 'GST/Asia/Dubai', label: 'GST / Asia/Dubai (UTC+4)' }
    ],
    defaultTimeZone: 'PST/America/Los_Angeles'
  },

  // Section 13: Communication Modes
  communicationModes: [
    'Email',
    'Phone',
    'WhatsApp',
    'Slack',
    'Microsoft Teams',
    'Zoom',
    'Other'
  ],
  defaultModes: ['Email', 'Microsoft Teams', 'Slack']
}

/**
 * Returns initial default form data for a new GTM questionnaire
 */
export function getInitialGtmFormData(): GtmStrategyFormData {
  const today = new Date().toISOString().slice(0, 10)

  return {
    // Header
    companyName: '',
    contactPerson: '',
    email: '',
    date: today,

    // 1. Products / Services
    products: {
      selectedProducts: ['BIM Coordination', 'BIM Modeling', 'MEP Framing'],
      otherProduct: '',
      hasCollaterals: true,
      collateralsDetails: 'Case studies, Capability statement PDF, and Revit sample models link.'
    },

    // 2. Geographical Locations
    geography: {
      country: GTM_CONFIG.geography.defaultCountry,
      regions: [
        { id: 'geo_1', name: 'California, Nevada, Oregon/Seattle', priority: 1 },
        { id: 'geo_2', name: 'Texas', priority: 2 },
        { id: 'geo_3', name: 'Florida', priority: 3 },
        { id: 'geo_4', name: 'North Carolina', priority: 4 },
        { id: 'geo_5', name: 'New York', priority: 5 }
      ],
      customRegionInput: ''
    },

    // 3. Target Industry
    industry: {
      subContractors: {
        selected: true,
        priority: 1,
        trades: ['Electrical', 'Mechanical', 'Plumbing', 'Structural/Framing'],
        otherTrade: ''
      },
      generalContractors: {
        selected: true,
        priority: 2
      },
      otherIndustry: {
        selected: false,
        priority: null,
        name: ''
      },
      targetStartDate: today
    },

    // 4. Company Size
    companySize: {
      basis: 'employees',
      options: [
        { id: 'size_2_50', label: '2–50 (SME)', selected: true, priority: 2 },
        { id: 'size_51_200', label: '51–200', selected: true, priority: 1 },
        { id: 'size_201_500', label: '201–500', selected: false, priority: null },
        { id: 'size_500_plus', label: '500+', selected: false, priority: null },
        { id: 'size_custom', label: 'Custom range', selected: false, priority: null, customRange: '' }
      ]
    },

    // 5. Target Job Titles
    jobTitles: {
      selectedTitles: ['Project Manager', 'Estimator', 'Pre-construction Manager', 'Project Engineer'],
      customTitles: []
    },

    // 6. Focused Accounts / Customers
    focusedAccounts: {
      decideLater: false,
      accounts: [
        { id: 'acc_1', companyName: 'Meridian Builders', comments: 'Targeting commercial hospital wing projects', targetProjects: 'Healthcare & Higher Ed' },
        { id: 'acc_2', companyName: 'Apex Contracting', comments: 'High volume MEP subcontractor looking for clash detection', targetProjects: 'Data Centers' }
      ]
    },

    // 7. Outreach Strategy
    outreach: {
      email: { enabled: true, details: '3-touch cadence with BIM workflow efficiency proof points.' },
      linkedIn: { enabled: true, details: 'Targeting VDC managers and Project Executives with relevant case studies.' },
      calls: { enabled: false, details: '' }
    },

    // 8. Upcoming Conferences / Trade Shows
    conferences: {
      requestResearchSupport: true,
      conferences: [
        { id: 'conf_1', eventName: 'Autodesk University', date: '2026-11-15', location: 'San Diego, CA', notes: 'Key focus on VDC leadership networking' }
      ]
    },

    // 9. Others
    otherNotes: 'Client prioritizes fast turnaround times (under 72 hours for initial BIM clash models) and native Revit authoring standards.',

    // 10. CRM
    crm: {
      usesCrm: true,
      crmProvider: 'HubSpot',
      crmDetails: 'HubSpot Professional with lead scoring and pipeline tracking.'
    },

    // 11. Weekly Meeting
    weeklyMeeting: {
      day: GTM_CONFIG.weeklyMeeting.defaultDay,
      time: GTM_CONFIG.weeklyMeeting.defaultTime,
      timeZone: GTM_CONFIG.weeklyMeeting.defaultTimeZone
    },

    // 12. Point of Contact
    pointOfContact: {
      contacts: [
        { id: 'poc_1', name: '', role: 'GTM Lead / Sponsor', email: '', phone: '' }
      ]
    },

    // 13. Mode of Communication
    communication: {
      selectedModes: ['Email', 'Microsoft Teams', 'Slack'],
      otherMode: ''
    },

    isCompleted: false
  }
}
