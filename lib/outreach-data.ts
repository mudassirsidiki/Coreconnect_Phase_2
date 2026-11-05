import { industries, regions, channels, industryRegionMap, type Industry, type Region, type Channel } from './data'

export interface EmailLog {
  id: string
  leadName: string
  account: string
  industry: Industry
  region: Region
  type: 'New Email' | 'Follow-up Email'
  subject: string
  date: string
  time: string
  status: 'Delivered' | 'Opened' | 'Clicked' | 'Replied'
  opens: number
  clicks: number
  snippet: string
}

export interface LinkedInLog {
  id: string
  leadName: string
  account: string
  industry: Industry
  region: Region
  type: 'Connection Request' | 'Direct Message'
  date: string
  time: string
  status: 'Pending' | 'Connected' | 'Replied' | 'Viewed'
  snippet: string
}

export interface CallLog {
  id: string
  leadName: string
  account: string
  industry: Industry
  region: Region
  type: 'New Call' | 'Follow-up Call'
  outcome: 'Connected' | 'Voicemail' | 'Gatekeeper' | 'No Answer'
  duration: string
  date: string
  time: string
  notes: string
}

export interface MeetingItem {
  type: 'New Meeting' | 'Follow-up Meeting'
  date: string
  time?: string
}

export interface ScheduledMeetingDetails {
  meetingDate: string
  meetingTime: string
  followUpMeetingDate?: string
  type: 'New Meeting' | 'Follow-up Meeting'
  status: 'Scheduled' | 'Confirmed' | 'Completed'
  agenda: string
  attendees: string
  location: string
  meetingsList?: MeetingItem[]
}

export interface ResponseLeadRecord {
  id: number
  leadAddedDate: string
  account: string
  leadName: string
  title: string
  email: string
  responseDate: string
  channel: Channel
  outreachType?: 'New Outreach' | 'Follow-up'
  response: 'Positive' | 'Negative' | 'Prospect'
  actionStatus: string
  action?: string
  notes?: string
  industry: Industry
  region: Region
  meetingsScheduled?: string
  meetingDetails?: ScheduledMeetingDetails
  leadOwner?: string
}

export const leadTeamMembers = ['Bilal Tahir', 'Batool Fatima', 'Kinza Imran', 'Umar Shazad']

const companies = [
  'Meridian Bank', 'Northstar Health', 'Pinnacle Retail Group', 'BluePeak Energy',
  'Atlas Telecom', 'Vertex Systems', 'Cedar Manufacturing', 'Summit Advisory',
  'Harbor Logistics', 'BrightPath Education', 'Signal Media', 'Horizon Properties',
  'Oakline Financial', 'Greenfield Clinics', 'Apex Commerce', 'Lumen Utilities',
  'Orbit Networks', 'Cobalt Works', 'Crestview Partners', 'Ridgeway Transport'
]

const firstNames = ['Avery', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Cameron', 'Quinn', 'Drew', 'Reese', 'Alex', 'Jamie', 'Skyler', 'Parker', 'Rowan']
const lastNames = ['Miller', 'Chen', 'Anderson', 'Williams', 'Garcia', 'Davies', 'Foster', 'Kim', 'O\'Connor', 'Novak']
const titles = ['VP of Sales', 'Chief Technology Officer', 'Head of Revenue Ops', 'VP of Procurement', 'Director of Operations', 'Head of Digital Strategy', 'Managing Director', 'Chief Information Officer']

// Generate relative dates within Oct 2026 and surrounding months
function getDateStr(offsetDays: number): string {
  // Base date centered around October 2026 (local project simulated timeline)
  const base = new Date('2026-10-15T12:00:00Z')
  base.setDate(base.getDate() + offsetDays)
  return base.toISOString().slice(0, 10)
}

// Exactly 65 emails distributed across 8 industries (sum = 65)
const emailIndustryDistribution: Industry[] = [
  // 9 Banking (USA)
  'Banking', 'Banking', 'Banking', 'Banking', 'Banking', 'Banking', 'Banking', 'Banking', 'Banking',
  // 8 Healthcare (Canada)
  'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare',
  // 8 Retail (Saudi Arabia)
  'Retail', 'Retail', 'Retail', 'Retail', 'Retail', 'Retail', 'Retail', 'Retail',
  // 8 Energy (USA)
  'Energy', 'Energy', 'Energy', 'Energy', 'Energy', 'Energy', 'Energy', 'Energy',
  // 8 Telecom (Canada)
  'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom',
  // 9 Technology (Saudi Arabia)
  'Technology', 'Technology', 'Technology', 'Technology', 'Technology', 'Technology', 'Technology', 'Technology', 'Technology',
  // 8 Manufacturing (USA)
  'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing',
  // 7 Professional Services (Canada)
  'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services'
]

// Exactly 50 LinkedIn outreaches distributed across 8 industries (sum = 50)
const linkedInIndustryDistribution: Industry[] = [
  // 6 Banking (USA)
  'Banking', 'Banking', 'Banking', 'Banking', 'Banking', 'Banking',
  // 6 Healthcare (Canada)
  'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare',
  // 7 Retail (Saudi Arabia)
  'Retail', 'Retail', 'Retail', 'Retail', 'Retail', 'Retail', 'Retail',
  // 6 Energy (USA)
  'Energy', 'Energy', 'Energy', 'Energy', 'Energy', 'Energy',
  // 6 Telecom (Canada)
  'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom',
  // 7 Technology (Saudi Arabia)
  'Technology', 'Technology', 'Technology', 'Technology', 'Technology', 'Technology', 'Technology',
  // 6 Manufacturing (USA)
  'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing',
  // 6 Professional Services (Canada)
  'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services'
]

// Exactly 45 Calls distributed across 8 industries (sum = 45)
const callIndustryDistribution: Industry[] = [
  // 5 Banking (USA)
  'Banking', 'Banking', 'Banking', 'Banking', 'Banking',
  // 6 Healthcare (Canada)
  'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare', 'Healthcare',
  // 5 Retail (Saudi Arabia)
  'Retail', 'Retail', 'Retail', 'Retail', 'Retail',
  // 6 Energy (USA)
  'Energy', 'Energy', 'Energy', 'Energy', 'Energy', 'Energy',
  // 6 Telecom (Canada)
  'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom', 'Telecom',
  // 5 Technology (Saudi Arabia)
  'Technology', 'Technology', 'Technology', 'Technology', 'Technology',
  // 6 Manufacturing (USA)
  'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing', 'Manufacturing',
  // 6 Professional Services (Canada)
  'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services', 'Professional Services'
]

// Generate Realistic Email Logs
export const seedEmailLogs: EmailLog[] = Array.from({ length: 65 }, (_, i) => {
  const isFollowUp = i % 2 !== 0
  const account = companies[i % companies.length]
  const leadName = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`
  const industry = emailIndustryDistribution[i]
  const region = industryRegionMap[industry]
  const offset = -(i % 30)
  const statusPool: ('Delivered' | 'Opened' | 'Clicked' | 'Replied')[] = ['Delivered', 'Opened', 'Clicked', 'Replied']
  const status = statusPool[i % 4]
  const opens = status === 'Delivered' ? 0 : (i % 4) + 1
  const clicks = (status === 'Clicked' || status === 'Replied') ? (i % 3) + 1 : 0

  const subjects = isFollowUp ? [
    `Follow-up: Coreconnect roadmap consultation for ${account}`,
    `Quick check-in regarding enterprise data pipelines - ${account}`,
    `Re: Scaling revenue operations at ${account}`,
    `Sharing executive benchmarks for ${industry} leaders`
  ] : [
    `Modernizing revenue architecture for ${account}`,
    `Introducing Coreconnect V2 enterprise platform`,
    `Strategic initiatives for ${industry} in Q4`,
    `Discussion: accelerating operational cycle times at ${account}`
  ]

  return {
    id: `EM-${1000 + i}`,
    leadName,
    account,
    industry,
    region,
    type: isFollowUp ? 'Follow-up Email' : 'New Email',
    subject: subjects[i % subjects.length],
    date: getDateStr(offset),
    time: `${9 + (i % 8)}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    status,
    opens,
    clicks,
    snippet: isFollowUp
      ? `Following up on our note from earlier this week. We recently completed a benchmark with a peer in ${industry} showing a 28% efficiency boost.`
      : `Hi ${firstNames[i % firstNames.length]}, I noticed ${account} is expanding its digital transformation initiatives. We help leading ${industry} teams streamline revenue intelligence.`
  }
})

// Generate Realistic LinkedIn Logs
export const seedLinkedInLogs: LinkedInLog[] = Array.from({ length: 50 }, (_, i) => {
  const isDM = i % 2 === 1
  const account = companies[(i + 3) % companies.length]
  const leadName = `${firstNames[(i + 2) % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`
  const industry = linkedInIndustryDistribution[i]
  const region = industryRegionMap[industry]
  const offset = -((i * 2) % 28)
  const statusPool: ('Pending' | 'Connected' | 'Replied' | 'Viewed')[] = ['Pending', 'Connected', 'Replied', 'Viewed']

  return {
    id: `LI-${2000 + i}`,
    leadName,
    account,
    industry,
    region,
    type: isDM ? 'Direct Message' : 'Connection Request',
    date: getDateStr(offset),
    time: `${10 + (i % 7)}:${(i * 11) % 60 < 10 ? '0' : ''}${(i * 11) % 60} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    status: statusPool[i % 4],
    snippet: isDM
      ? `Great connecting, ${firstNames[(i + 2) % firstNames.length]}! I saw your recent post on enterprise systems scaling and wanted to share our Q3 analysis.`
      : `Hi ${firstNames[(i + 2) % firstNames.length]}, would love to connect and follow your work driving business impact at ${account}.`
  }
})

// Generate Realistic Call Logs
export const seedCallLogs: CallLog[] = Array.from({ length: 45 }, (_, i) => {
  const isFollowUp = i % 3 === 0
  const account = companies[(i + 5) % companies.length]
  const leadName = `${firstNames[(i + 4) % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`
  const industry = callIndustryDistribution[i]
  const region = industryRegionMap[industry]
  const offset = -((i * 3) % 25)

  let outcome: 'Connected' | 'Voicemail' | 'Gatekeeper' | 'No Answer'
  let duration = '0m 45s'

  if (i % 4 === 0) {
    outcome = 'Connected'
    duration = `${8 + (i % 14)}m ${(i * 13) % 60}s`
  } else if (i % 4 === 1) {
    outcome = 'Voicemail'
    duration = `1m ${(i * 9) % 30}s`
  } else if (i % 4 === 2) {
    outcome = 'Gatekeeper'
    duration = `2m ${(i * 5) % 40}s`
  } else {
    outcome = 'No Answer'
    duration = '0m 30s'
  }

  const notesList = [
    'Spoke with EA; confirmed interest in platform briefing. Requested presentation deck sent to inbox.',
    'Connected directly. Discussed current CRM pain points and agreed to schedule an executive demonstration.',
    'Left detailed voicemail regarding automated workflow enhancements and provided callback line.',
    'Gatekeeper indicated the team is currently in budget planning cycles; requested follow-up in 2 weeks.',
    'Productive conversation covering multi-region compliance and data integration needs.'
  ]

  return {
    id: `CL-${3000 + i}`,
    leadName,
    account,
    industry,
    region,
    type: isFollowUp ? 'Follow-up Call' : 'New Call',
    outcome,
    duration,
    date: getDateStr(offset),
    time: `${9 + (i % 8)}:${(i * 13) % 60 < 10 ? '0' : ''}${(i * 13) % 60} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    notes: notesList[i % notesList.length]
  }
})

// Action statuses by sentiment
const positiveActionStatuses = [
  'Meeting Scheduled',
  'Demo Scheduled',
  'POC Scope Approved',
  'Executive Review Pending',
  'Proposal Requested',
  'Trial Environment Active'
]

export const positiveActions = [
  'Send Calendar Invite & Pre-Meeting Brief',
  'Prepare Architecture & Demo Environment',
  'Draft Technical Scope of Work & Pricing Model',
  'Confirm Buying Committee Attendees & Zoom Link',
  'Circulate Enterprise Security Whitepaper',
  'Prepare Discovery Questions & Executive Briefing'
]

export const positiveNotes = [
  'Requested 45-min platform walk-through covering workflow automation and multi-region data security.',
  'Confirmed team attendance for discovery meeting; interested in replacing legacy CRM tooling.',
  'Requested follow-up architecture session with VP Engineering and Security Officer.',
  'Executive sponsor approved POC scope; requested kickoff timeline for next month.',
  'Requested pricing breakdown and reference case study in their industry sector.',
  'Agreed to discovery conversation to explore CRM modernizations and revenue pipeline analytics.'
]

const prospectActionStatuses = [
  'Follow-up in 14 Days',
  'Nurture Sequence Active',
  'Information Sent',
  'Awaiting Internal Alignment',
  'Re-evaluating in Q4',
  'Resource Material Downloaded'
]

export const prospectActions = [
  'Send Q4 Product Benchmark & ROI Calculator',
  'Schedule 14-Day Nurture Follow-up Call',
  'Follow Up via LinkedIn with Industry Case Study',
  'Re-engage after Internal Budget Review',
  'Share Enterprise Compliance One-Pager',
  'Dispatch Quarterly Product Roadmap Brief'
]

export const prospectNotes = [
  'Interested in enterprise pricing tier; reviewing internally with finance committee before scheduling call.',
  'Confirmed receipt of overview deck; requested follow-up in 2 weeks after Q4 strategic planning.',
  'Requested case studies on peer organizations in their sector before committing to a demo.',
  'Expressed interest in API integrations; requested documentation for technical lead review.',
  'In the process of evaluating vendor options; requested contact again mid-month.',
  'Positive reception to outreach; asked for summary of implementation timelines and prerequisites.'
]

const negativeActionStatuses = [
  'Not Interested',
  'Budget Freeze',
  'Competitor Locked',
  'Wrong Decision Maker',
  'Do Not Contact',
  'Project Postponed to 2027'
]

export const negativeActions = [
  'Pause Outreach & Set Q2 Re-visit Reminder',
  'Log Competitor Intelligence & Archive Cadence',
  'Mark DNC & Update RevOps Disqualification Log'
]

export const negativeNotes = [
  'Budget frozen until next fiscal year; requested revisit in Q2 when new allocations open.',
  'Currently locked in a 3-year contract with incumbent vendor; not evaluating alternatives at this time.',
  'Reached wrong division; outreach paused and marked DNC per engagement policy.'
]

// Generate Response Leads (High-performing outreach: 21 Positive, 6 Prospect, 3 Negative = 70% Positive Rate)
export const seedResponseLeads: ResponseLeadRecord[] = (() => {
  const records: ResponseLeadRecord[] = []
  const positiveChannels: Channel[] = ['Email', 'LinkedIn', 'Call', 'Email', 'Call', 'LinkedIn', 'LinkedIn', 'Email', 'Call', 'Email']
  const prospectChannels: Channel[] = ['LinkedIn', 'Email', 'Call', 'LinkedIn', 'Email', 'Call', 'LinkedIn', 'Call', 'Email', 'LinkedIn']
  const negativeChannels: Channel[] = ['Call', 'Email', 'LinkedIn', 'Call', 'LinkedIn', 'Email', 'Call', 'Email', 'LinkedIn', 'Call']

  let emailPositiveCount = 0
  let emailProspectCount = 0
  let emailNegativeCount = 0

  // 1. Positive Responses (21 leads -> 70% positive rate)
  for (let i = 0; i < 21; i++) {
    const account = companies[i % companies.length]
    const leadName = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`
    const title = titles[i % titles.length]
    const email = `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@${account.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    const industry = industries[i % industries.length]
    const region = industryRegionMap[industry]
    const channel = positiveChannels[i % positiveChannels.length]
    const leadAddedOffset = -22 - ((i * 2) % 30)
    const responseOffset = leadAddedOffset + 3 + (i % 4)

    let outreachType: 'New Outreach' | 'Follow-up' = i % 2 === 0 ? 'New Outreach' : 'Follow-up'
    if (channel === 'Email') {
      outreachType = emailPositiveCount % 2 === 0 ? 'New Outreach' : 'Follow-up'
      emailPositiveCount++
    }

    const hasTwoMeetings = i % 3 === 0
    const primaryType: 'New Meeting' | 'Follow-up Meeting' = i % 2 === 0 ? 'New Meeting' : 'Follow-up Meeting'
    const secondaryType: 'New Meeting' | 'Follow-up Meeting' = primaryType === 'New Meeting' ? 'Follow-up Meeting' : 'New Meeting'
    const meetingDayOffset = ((i * 3) % 25) - 10
    const followUpOffset = meetingDayOffset + 7 + (i % 7)
    const primaryDate = getDateStr(meetingDayOffset)
    const secondaryDate = getDateStr(followUpOffset)

    const meetingsList: MeetingItem[] = hasTwoMeetings
      ? [
        { type: primaryType, date: primaryDate },
        { type: secondaryType, date: secondaryDate }
      ]
      : [
        { type: primaryType, date: primaryDate }
      ]

    records.push({
      id: records.length + 1,
      leadAddedDate: getDateStr(leadAddedOffset),
      account,
      leadName,
      title,
      email,
      responseDate: getDateStr(responseOffset),
      channel,
      outreachType,
      response: 'Positive',
      actionStatus: positiveActionStatuses[i % positiveActionStatuses.length],
      action: positiveActions[i % positiveActions.length],
      notes: positiveNotes[i % positiveNotes.length],
      industry,
      region,
      leadOwner: leadTeamMembers[i % leadTeamMembers.length],
      meetingsScheduled: hasTwoMeetings ? '2 Meetings' : '1 Meeting',
      meetingDetails: {
        meetingDate: primaryDate,
        meetingTime: `${10 + (i % 6)}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
        followUpMeetingDate: hasTwoMeetings ? secondaryDate : undefined,
        type: primaryType,
        status: i % 4 === 0 ? 'Completed' : (i % 4 === 1 ? 'Confirmed' : 'Scheduled'),
        agenda: primaryType === 'Follow-up Meeting'
          ? 'Deep-dive architectural review, security review, and enterprise licensing terms.'
          : 'Initial discovery, operational pain points discovery, and Coreconnect V2 capabilities overview.',
        attendees: `${leadName} (${title}), VP Engineering, Account Executive, Solutions Architect`,
        location: i % 2 === 0 ? 'Microsoft Teams Video Call' : 'Zoom Conference Room A',
        meetingsList
      }
    })
  }

  // 2. Prospect Responses (6 leads)
  for (let i = 0; i < 6; i++) {
    const account = companies[(i + 10) % companies.length]
    const leadName = `${firstNames[(i + 5) % firstNames.length]} ${lastNames[(i + 4) % lastNames.length]}`
    const title = titles[(i + 3) % titles.length]
    const email = `${firstNames[(i + 5) % firstNames.length].toLowerCase()}.${lastNames[(i + 4) % lastNames.length].toLowerCase()}@${account.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    const industry = industries[(i + 2) % industries.length]
    const region = industryRegionMap[industry]
    const channel = prospectChannels[i % prospectChannels.length]
    const leadAddedOffset = -25 - (i * 3)
    const responseOffset = leadAddedOffset + 4 + (i % 5)

    let outreachType: 'New Outreach' | 'Follow-up' = i % 2 === 0 ? 'New Outreach' : 'Follow-up'
    if (channel === 'Email') {
      outreachType = emailProspectCount % 2 === 0 ? 'New Outreach' : 'Follow-up'
      emailProspectCount++
    }

    records.push({
      id: records.length + 1,
      leadAddedDate: getDateStr(leadAddedOffset),
      account,
      leadName,
      title,
      email,
      responseDate: getDateStr(responseOffset),
      channel,
      outreachType,
      response: 'Prospect',
      actionStatus: prospectActionStatuses[i % prospectActionStatuses.length],
      action: prospectActions[i % prospectActions.length],
      notes: prospectNotes[i % prospectNotes.length],
      industry,
      region,
      leadOwner: leadTeamMembers[(i + 1) % leadTeamMembers.length]
    })
  }

  // 3. Negative Responses (3 leads)
  for (let i = 0; i < 3; i++) {
    const account = companies[(i + 5) % companies.length]
    const leadName = `${firstNames[(i + 8) % firstNames.length]} ${lastNames[(i + 7) % lastNames.length]}`
    const title = titles[(i + 5) % titles.length]
    const email = `${firstNames[(i + 8) % firstNames.length].toLowerCase()}.${lastNames[(i + 7) % lastNames.length].toLowerCase()}@${account.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
    const industry = industries[(i + 4) % industries.length]
    const region = industryRegionMap[industry]
    const channel = negativeChannels[i % negativeChannels.length]
    const leadAddedOffset = -28 - (i * 2)
    const responseOffset = leadAddedOffset + 2 + (i % 4)

    let outreachType: 'New Outreach' | 'Follow-up' = i % 2 === 0 ? 'New Outreach' : 'Follow-up'
    if (channel === 'Email') {
      outreachType = emailNegativeCount % 2 === 0 ? 'New Outreach' : 'Follow-up'
      emailNegativeCount++
    }

    records.push({
      id: records.length + 1,
      leadAddedDate: getDateStr(leadAddedOffset),
      account,
      leadName,
      title,
      email,
      responseDate: getDateStr(responseOffset),
      channel,
      outreachType,
      response: 'Negative',
      actionStatus: negativeActionStatuses[i % negativeActionStatuses.length],
      action: negativeActions[i % negativeActions.length],
      notes: negativeNotes[i % negativeNotes.length],
      industry,
      region,
      leadOwner: leadTeamMembers[(i + 2) % leadTeamMembers.length]
    })
  }

  return records
})()
