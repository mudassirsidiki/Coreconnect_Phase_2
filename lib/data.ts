export const industries = ['Banking','Healthcare','Retail','Energy','Telecom','Technology','Manufacturing','Professional Services'] as const
export const regions = ['USA','Canada','Saudi Arabia'] as const
export const channels = ['Email','LinkedIn','Call'] as const
export const statuses = ['New','In Progress','Qualified','Won','Lost','Pending'] as const
export type Industry = typeof industries[number]
export type Region = typeof regions[number]
export type Channel = typeof channels[number]
export const industryRegionMap: Record<Industry, Region> = {
  'Banking': 'USA',
  'Healthcare': 'Canada',
  'Retail': 'Saudi Arabia',
  'Energy': 'USA',
  'Telecom': 'Canada',
  'Technology': 'Saudi Arabia',
  'Manufacturing': 'USA',
  'Professional Services': 'Canada'
}
export type Lead = { id:number; name:string; account:string; industry:Industry; region:Region; channel:Channel; response:'Positive'|'Negative'|'Prospect'|'No response'; status:typeof statuses[number]; date:string; responseDate:string; action:string }
export type Meeting = { id:number; account:string; lead:string; industry:Industry; region:Region; added:string; date:string; type:'New'|'Follow-up'; status:string; comments:string; agenda:string; attendees:string }
export type Opportunity = { id:number; date:string; industry:Industry; account:string; contact:string; meeting:string; comments:string; status:'Won'|'Lost'|'Pending'|'Submitted'|'Researched' }
export type Win = { id:number; account:string; lead:string; value:number; meetingDate:string; dateWon:string; region:Region; industry:Industry; project:string }
export type Support = { id:number; date:string; location:string; name:string; website:string; industry:Industry }
export type Conference = { id:number; date:string; status:string; category:string; description:string; actionPlan:string }
export type Proposal = { id:number; name:string; date:string; status:'Won'|'Lost'|'Pending'; selected:boolean; researched:boolean }
const companies = ['Meridian Bank','Northstar Health','Pinnacle Retail Group','BluePeak Energy','Atlas Telecom','Vertex Systems','Cedar Manufacturing','Summit Advisory','Harbor Logistics','BrightPath Education','Signal Media','Horizon Properties','Oakline Financial','Greenfield Clinics','Apex Commerce','Lumen Utilities','Orbit Networks','Cobalt Works','Crestview Partners','Ridgeway Transport']
const firstNames = ['Avery','Jordan','Taylor','Morgan','Riley','Casey','Cameron','Quinn','Drew','Reese','Alex','Jamie','Skyler','Parker','Rowan']
const ago = (days:number) => new Date(Date.now()-days*86400000).toISOString().slice(0,10)
export const leads: Lead[] = Array.from({length:150},(_,i)=>{
  const industry = industries[i%industries.length]
  const region = industryRegionMap[industry]
  return { id:i+1, name:`${firstNames[i%firstNames.length]} ${['Miller','Chen','Patel','Williams','Garcia'][i%5]}`, account:companies[i%companies.length], industry, region, channel:channels[i%3], response:(['Positive','Negative','Prospect','No response'] as const)[i%4], status:statuses[i%statuses.length], date:ago((i*3)%360), responseDate:ago((i*3+1)%350), action:['Follow up','Send proposal','Schedule meeting','Nurture'][i%4] }
})
export const meetings: Meeting[] = Array.from({length:25},(_,i)=>{
  const industry = industries[(i+2)%industries.length]
  const region = industryRegionMap[industry]
  return { id:i+1, account:companies[(i+2)%companies.length], lead:`${firstNames[(i+3)%firstNames.length]} ${['Miller','Chen','Patel'][i%3]}`, industry, region, added:ago((i*9)%300), date:ago(-((i%20)+1)), type:i%3===0?'Follow-up':'New', status:i%4===0?'Completed':'Scheduled', comments:'Discovery conversation with buying committee.', agenda:'Business priorities and next-quarter roadmap.', attendees:'Account lead, prospect sponsor, sales manager' }
})
export const opportunities: Opportunity[] = Array.from({length:20},(_,i)=>({id:i+1,date:ago((i*13)%330),industry:industries[(i+4)%industries.length],account:companies[(i+4)%companies.length],contact:`${firstNames[i%firstNames.length]} ${['Miller','Chen','Patel'][i%3]}`,meeting:ago(-((i%16)+2)),comments:'Strong fit for the transformation program.',status:(['Won','Lost','Pending','Submitted','Researched'] as const)[i%5]}))
export const wins: Win[] = Array.from({length:15},(_,i)=>{
  const industry = industries[(i+1)%industries.length]
  const region = industryRegionMap[industry]
  return {id:i+1,account:companies[(i+1)%companies.length],lead:`${firstNames[(i+4)%firstNames.length]} Patel`,value:35000+(i*11750),meetingDate:ago((i*11)%250),dateWon:ago((i*7)%200),region,industry,project:['Cloud modernization','Customer insights','Digital workplace'][i%3]}
})
export const supportRecords: Support[] = Array.from({length:10},(_,i)=>({id:i+1,date:ago(i*15),location:['New York','London','Singapore','Sydney'][i%4],name:['CRM roundtable','Pipeline clinic','Enablement workshop'][i%3],website:'www.example.com',industry:industries[i%industries.length]}))
export const conferences: Conference[] = Array.from({length:12},(_,i)=>({id:i+1,date:ago(i*19),status:i%3===0?'Planned':'Completed',category:['Industry','Partner','Internal'][i%3],description:'Strategic conference and relationship-building session.',actionPlan:'Share recap and assign follow-up owners.'}))
export const proposals: Proposal[] = Array.from({length:8},(_,i)=>({id:i+1,name:`${companies[i]} proposal.pdf`,date:ago(i*21),status:(['Won','Pending','Lost'] as const)[i%3],selected:i%2===0,researched:true}))
export const crmSeed = {leads,meetings,opportunities,wins,supportRecords,conferences,proposals}
export const countBy = <T,>(rows:T[], key:(row:T)=>string) => rows.reduce<Record<string,number>>((acc,row)=>{const value=key(row);acc[value]=(acc[value]||0)+1;return acc},{})
export const money = (value:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value)
export const csv = (rows:Record<string,unknown>[]) => { if(!rows.length)return ''; const keys=Object.keys(rows[0]); return [keys.join(','),...rows.map(r=>keys.map(k=>JSON.stringify(r[k]??'')).join(','))].join('\n') }
export const downloadCsv = (name:string,rows:Record<string,unknown>[]) => { const blob=new Blob([csv(rows)],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href) }
export const navItems = ['Dashboard','Account Business Plans','Revenue Pipeline & Sales','Account Management Activities','Documents','Proposals','Creative Support','Ratios']
export type Filters = { industries:string[]; regions:string[]; channel:string; response:string; status:string[]; account:string; range:string }
export const defaultFilters: Filters = {industries:[],regions:[],channel:'All',response:'All',status:[],account:'All',range:'YTD'}
export const filterLeads = (filters:Filters) => leads.filter(l=>(!filters.industries.length||filters.industries.includes(l.industry))&&(!filters.regions.length||filters.regions.includes(l.region))&&(filters.channel==='All'||l.channel===filters.channel)&&(filters.response==='All'||l.response===filters.response)&&(!filters.status.length||filters.status.includes(l.status))&&(filters.account==='All'||l.account===filters.account))
export const filterMeetings = (filters:Filters) => meetings.filter(m=>(!filters.industries.length||filters.industries.includes(m.industry))&&(!filters.regions.length||filters.regions.includes(m.region))&&(filters.account==='All'||m.account===filters.account))
export const filterWins = (filters:Filters) => wins.filter(w=>(!filters.industries.length||filters.industries.includes(w.industry))&&(!filters.regions.length||filters.regions.includes(w.region))&&(filters.account==='All'||w.account===filters.account))
export const mediaCards = [{label:'Instagram',items:['Reels','Posts','Videos','Stories']},{label:'LinkedIn',items:['Posts','Videos','Banners','Content creation']},{label:'Proposal Management',items:['Proposal template preview']}]
export const gtmRows = [['Segment','Message','Primary channel','Owner'],['Enterprise','Outcome-led transformation','Executive events','Avery Miller'],['Mid-market','Reduce operating friction','Email nurture','Jordan Chen'],['Strategic accounts','Co-create the future','Leadership briefings','Taylor Patel']]
export const emailDraft = (target:string) => `Subject: A practical growth conversation for ${target}\n\nHi there,\n\nI'm reaching out because teams in ${target} are rethinking how they turn strategic priorities into measurable outcomes. We help revenue leaders align their operating model, customer experience, and technology roadmap.\n\nWould a 20-minute conversation next week be useful?\n\nBest,\nThe Coreconnect V2 team`
export const ratioRows = industries.flatMap((industry,i)=>regions.slice(0,4).map((region,j)=>({industry,region,opening:42+((i*7+j*5)%35),meeting:12+((i*5+j*3)%24),win:3+((i+j)%13)})))
export const responseCounts = channels.map(channel=>({channel,Positive:leads.filter(l=>l.channel===channel&&l.response==='Positive').length,Negative:leads.filter(l=>l.channel===channel&&l.response==='Negative').length,Prospect:leads.filter(l=>l.channel===channel&&l.response==='Prospect').length}))
export const outreachHeatmap = industries.map(industry=>({industry,...Object.fromEntries(regions.slice(0,4).map(region=>[region,leads.filter(l=>l.industry===industry&&l.region===region).length]))}))
export const chartSeries = industries.slice(0,8).map(industry=>({industry, value:wins.filter(w=>w.industry===industry).length, amount:wins.filter(w=>w.industry===industry).reduce((a,w)=>a+w.value,0)}))
export const makeId = () => Math.max(...Object.values(crmSeed).flatMap((r:any)=>r.map((x:any)=>x.id)),0)+Math.floor(Math.random()*1000)
export const unusedOutreachRecords = Array.from({length:60},(_,i)=>({id:i+1,leadId:(i%150)+1,channel:channels[i%3],kind:i%2?'Follow-up':'New',date:ago(i*4)}))
export const accountBusinessPlans = companies.slice(0,12).map((company,i)=>({company,industry:industries[i%industries.length],status:(['Not Reviewed','Reviewed','Feedback Received','Approved'] as const)[i%4],feedback:''}))
export const allAccounts = companies.map((name,i)=>{
  const industry = industries[i%industries.length]
  return {name,industry,region:industryRegionMap[industry],employees:120+i*85}
})
export const creativePlaceholders = Array.from({length:12},(_,i)=>({id:i,title:['Q3 thought leadership','Customer story','Behind the scenes','Event recap'][i%4],type:['Reel','Post','Video','Story'][i%4]}))
export const supportPlaceholder = 'No records match the current filters.'
export const nowLabel = new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date())
export const meetingsByDay = meetings.reduce<Record<string,Meeting[]>>((a,m)=>(a[m.date]??=[],a[m.date].push(m),a),{})
export const responseMethods = ['Positive','Negative','Prospect'] as const
export const accountNames = allAccounts.map(a=>a.name)
export const recentLeads = leads.slice(0,8)
export const topWins = [...wins].sort((a,b)=>b.value-a.value).slice(0,5)
export const funnelData = [{name:'RFPs Researched',value:opportunities.filter(o=>o.status==='Researched').length},{name:'RFPs Submitted',value:opportunities.filter(o=>o.status==='Submitted'||o.status==='Won').length},{name:'RFP Pending',value:opportunities.filter(o=>o.status==='Pending').length},{name:'Follow-up meetings',value:meetings.filter(m=>m.type==='Follow-up').length}]
export const statusColors:Record<string,string>={Won:'#2f855a',Lost:'#c2410c',Pending:'#d97706',Positive:'#2f855a',Negative:'#c2410c',Prospect:'#2563eb'}
export const formatDate=(date:string)=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(date+'T00:00:00'))
export const unique = (values:string[]) => [...new Set(values)]
export const cloneSeed = () => JSON.parse(JSON.stringify(crmSeed))
export const responseLabel = (value:string) => value==='No response'?'No response':value
export const leadResponses = leads.filter(l=>l.response!=='No response')
export const winLoss = [{name:'Won',value:proposals.filter(p=>p.status==='Won').length},{name:'Pending',value:proposals.filter(p=>p.status==='Pending').length},{name:'Lost',value:proposals.filter(p=>p.status==='Lost').length}]
export const ratioAverages = [{name:'Opening',value:Math.round(ratioRows.reduce((a,r)=>a+r.opening,0)/ratioRows.length)},{name:'Meetings',value:Math.round(ratioRows.reduce((a,r)=>a+r.meeting,0)/ratioRows.length)},{name:'Win',value:Math.round(ratioRows.reduce((a,r)=>a+r.win,0)/ratioRows.length)}]
export const defaultColumns = {wins:['Account','Lead','Value','Meeting Date','Date Won','Region','Industry'],opportunities:['Date Added','Industry','Account','Contact','Meeting','Comments','Status']}
export const datasetStats = {accounts:40,industries:8,regions:3,outreach:60,meetings:25,opportunities:20,wins:15,conferences:12,support:10,proposals:8}
