'use client'

import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Search, Moon, Sun, Settings, ChevronDown, Download, Plus, Filter, LayoutDashboard, Building2, TrendingUp, Activity, FileText, Presentation, Palette, Ratio, Mail, Network, Phone, CalendarDays, MoreHorizontal, Check, X, Menu, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { industries, regions, channels, statuses, leads as seedLeads, meetings as seedMeetings, opportunities as seedOpportunities, wins, supportRecords as seedSupport, conferences as seedConferences, proposals, countBy, money, downloadCsv, navItems, type Filters, defaultFilters, filterLeads, filterMeetings, filterWins, formatDate, gtmRows, emailDraft, creativePlaceholders, accountNames, accountBusinessPlans } from '@/lib/data'
import { OutreachSection } from '@/components/outreach/OutreachSection'

type Page = typeof navItems[number]
const icons = [LayoutDashboard, Building2, TrendingUp, Activity, FileText, Presentation, Palette, Ratio]
const colors = ['#0B1F5C','#FFC000','#B6E4A0','#78A6D8','#E49B7A']

export default function Page() {
  const [page, setPage] = useState<Page>('Dashboard')
  const [dark, setDark] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All')
  const [selectedRegion, setSelectedRegion] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [leads, setLeads] = useState(seedLeads)
  const [meetings, setMeetings] = useState(seedMeetings)
  const [opportunities, setOpportunities] = useState(seedOpportunities)
  const [support, setSupport] = useState(seedSupport)
  const [conferences, setConferences] = useState(seedConferences)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [totalOpportunities, setTotalOpportunities] = useState(48)
  const [mobileNav, setMobileNav] = useState(false)

  const filteredWins = useMemo(() => {
    return wins.filter(w => {
      if (selectedIndustry !== 'All' && w.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && w.region !== selectedRegion) return false
      return true
    })
  }, [selectedIndustry, selectedRegion])

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (selectedIndustry !== 'All' && l.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && l.region !== selectedRegion) return false
      if (search && !`${l.name} ${l.account}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, search, leads])

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (selectedIndustry !== 'All' && m.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && m.region !== selectedRegion) return false
      if (search && !`${m.lead} ${m.account}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, search, meetings])

  return <div className={dark ? 'dark' : ''}>
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B1F5C] text-white transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b border-white/15 px-5"><div className="grid size-9 place-items-center rounded-lg bg-[#FFC000] text-[#0B1F5C] font-black text-xs">CC</div><div><div className="font-bold tracking-wide">CORECONNECT V2</div><div className="text-[10px] uppercase tracking-[.2em] text-blue-200">Revenue operations</div></div></div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item, i) => {
            // Only show Dashboard for now, other sections preserved
            if (item !== 'Dashboard') return null
            const Icon = icons[i]
            return (
              <button
                key={item}
                onClick={() => {
                  setPage(item)
                  setMobileNav(false)
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                  page === item
                    ? 'bg-white text-[#0B1F5C] font-semibold'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon className="size-4" />
                <span>{item}</span>
                {item === 'Dashboard' && <span className="ml-auto size-2 rounded-full bg-[#FFC000]" />}
              </button>
            )
          })}
        </nav>
        {/* Quarter progress widget hidden per user request */}
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setMobileNav(true)}><Menu/></Button><div><div className="text-xs font-medium uppercase tracking-widest text-slate-400">Workspace / {page}</div><h1 className="font-semibold text-[#0B1F5C] dark:text-white">{page}</h1></div></div><div className="flex items-center gap-2"><div className="relative hidden md:block"><Search className="absolute left-3 top-2.5 size-4 text-slate-400"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search accounts, leads..." className="w-64 pl-9"/></div><Button variant="ghost" size="icon" onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</Button><Button variant="ghost" size="icon" onClick={()=>setSettingsOpen(true)}><Settings/></Button><div className="grid size-8 place-items-center rounded-full bg-[#B6E4A0] text-xs font-bold text-[#0B1F5C]">AM</div></div></header>
        <FilterBar selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}/>
        <div className="p-4 lg:p-8">{page==='Dashboard'&&<Dashboard selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}/>} {page==='Account Business Plans'&&<BusinessPlans/>} {page==='Revenue Pipeline & Sales'&&<Revenue wins={filteredWins}/>} {page==='Account Management Activities'&&<Activities support={support} setSupport={setSupport} conferences={conferences} setConferences={setConferences}/>} {page==='Documents'&&<Documents/>} {page==='Proposals'&&<Proposals/>} {page==='Creative Support'&&<Creative/>} {page==='Ratios'&&<Ratios leads={filteredLeads} wins={filteredWins}/>}</div>
      </main>
      <Sheet open={!!selectedMeeting} onOpenChange={(open)=>{if(!open) setSelectedMeeting(null)}}><SheetContent><SheetHeader><SheetTitle>Meeting details</SheetTitle></SheetHeader>{selectedMeeting&&<div className="mt-6 flex flex-col gap-5"><div><div className="text-lg font-semibold">{selectedMeeting.account}</div><div className="text-sm text-muted-foreground">{selectedMeeting.lead} · {formatDate(selectedMeeting.date)}</div></div><Field label="Attendees" value={selectedMeeting.attendees}/><Field label="Agenda" value={selectedMeeting.agenda}/><Field label="Notes" value={selectedMeeting.comments}/><Button onClick={()=>{toast.success('Meeting updated');setSelectedMeeting(null)}}>Save changes</Button></div>}</SheetContent></Sheet>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}><DialogContent><DialogHeader><DialogTitle>Workspace settings</DialogTitle></DialogHeader><div className="flex flex-col gap-5"><label className="text-sm font-medium">Backend total opportunities<Input type="number" value={totalOpportunities} onChange={e=>setTotalOpportunities(+e.target.value)} className="mt-2"/></label><div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900">Calculated from dataset: <b>{opportunities.length}</b></div><Button variant="outline" onClick={()=>{toast.success('Filters reset');setSelectedIndustry('All');setSelectedRegion('All')}}>Reset filters</Button></div></DialogContent></Dialog>
    </div>
  </div>
}

function FilterBar({
  selectedIndustry,
  setSelectedIndustry,
  selectedRegion,
  setSelectedRegion
}: {
  selectedIndustry: string
  setSelectedIndustry: (v: string) => void
  selectedRegion: string
  setSelectedRegion: (v: string) => void
}) {
  return (
    <div className="sticky top-16 z-20 border-b bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B1F5C] dark:text-[#FFC000]">
          <Filter className="size-4" />
          <span>Filters:</span>
        </div>

        {/* Industry Slicer */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500">Industry:</span>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="h-8.5 w-44 text-xs font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Industries</SelectItem>
              {industries.map(ind => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Slicer */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500">Region:</span>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="h-8.5 w-40 text-xs font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Regions</SelectItem>
              {regions.map(reg => (
                <SelectItem key={reg} value={reg}>{reg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {(selectedIndustry !== 'All' || selectedRegion !== 'All') && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSelectedIndustry('All')
              setSelectedRegion('All')
              toast.info('Filters reset to default view')
            }}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

function Dashboard({
  selectedIndustry,
  setSelectedIndustry,
  selectedRegion,
  setSelectedRegion
}: {
  selectedIndustry: string
  setSelectedIndustry: (v: string) => void
  selectedRegion: string
  setSelectedRegion: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <OutreachSection
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
    </div>
  )
}

function OpportunityTable({opportunities,setOpportunities}:{opportunities:any[];setOpportunities:(x:any)=>void}) { const [open,setOpen]=useState(false); return <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Opportunity funnel</CardTitle><p className="mt-1 text-sm text-muted-foreground">{opportunities.filter(o=>o.status==='Won').length} won · {opportunities.filter(o=>o.status==='Pending').length} pending</p></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button size="sm"><Plus/>Add opportunity</Button>} /><DialogContent><DialogHeader><DialogTitle>Add opportunity</DialogTitle></DialogHeader><div className="flex flex-col gap-3"><Input placeholder="Account name" id="new-account"/><Input placeholder="Contact person" id="new-contact"/><Button onClick={()=>{const a=(document.getElementById('new-account') as HTMLInputElement).value||'New account';setOpportunities([{id:Date.now(),date:new Date().toISOString().slice(0,10),industry:'Technology',account:a,contact:(document.getElementById('new-contact') as HTMLInputElement).value||'New contact',meeting:'TBD',comments:'New opportunity created in CRM.',status:'Pending'},...opportunities]);setOpen(false);toast.success('Opportunity added')}}>Create opportunity</Button></div></DialogContent></Dialog></CardHeader><CardContent><div className="grid gap-2 md:grid-cols-4">{['Researched','Submitted','Pending','Won'].map(s=><div key={s} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{s}</div><div className="mt-1 text-2xl font-bold">{opportunities.filter(o=>o.status===s).length}</div></div>)}</div><div className="mt-5"><DataTable title="" rows={opportunities.slice(0,6)} columns={['account','industry','contact','status']}/></div></CardContent></Card> }

function SectionTitle({eyebrow,title,action}:{eyebrow?:string;title:string;action?:string}){return <div className="flex items-end justify-between"><div>{eyebrow&&<div className="text-xs font-bold uppercase tracking-[.18em] text-[#b18400]">{eyebrow}</div>}<h2 className="mt-1 text-2xl font-bold text-[#0B1F5C] dark:text-white">{title}</h2></div>{action&&<Button variant="outline" size="sm"><Download/> {action}</Button>}</div>}
function Kpi({title,value,change,accent}:{title:string;value:any;change:string;accent?:boolean}){return <Card className={accent?'border-l-4 border-l-[#FFC000]':''}><CardContent className="p-5"><div className="text-sm text-muted-foreground">{title}</div><div className="mt-2 text-3xl font-bold text-[#0B1F5C] dark:text-white">{value}</div><div className="mt-2 text-xs text-muted-foreground">{change}</div></CardContent></Card>}
function DataTable({title,rows,columns}:{title:string;rows:any[];columns:string[]}){return <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>{title||'Records'}</CardTitle><Button variant="ghost" size="sm" onClick={()=>downloadCsv('crm-export.csv',rows)}><Download/>CSV</Button></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-muted-foreground">{columns.map(c=><th key={c} className="px-2 py-3 font-medium">{c.replace(/([A-Z])/g,' $1')}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={r.id||i} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900">{columns.map(c=><td key={c} className="px-2 py-3">{c==='value'&&typeof r[c]==='number'?money(r[c]):c==='status'||c==='response'?<Badge variant={r[c]==='Won'||r[c]==='Positive'?'default':'secondary'}>{r[c]}</Badge>:c.toLowerCase().includes('date')||c==='added'?formatDate(r[c]):r[c]}</td>)}</tr>)}</tbody></table></div>{!rows.length&&<div className="py-8 text-center text-sm text-muted-foreground">No records match the current filters.</div>}</CardContent></Card>}
function Field({label,value}:{label:string;value:string}){return <label className="text-sm font-medium">{label}<Input defaultValue={value} className="mt-1"/></label>}

function BusinessPlans(){const [selected,setSelected]=useState<any>(null); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Accounts" title="Account business plans"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{accountBusinessPlans.map(p=><Card key={p.company} onClick={()=>setSelected(p)} className="cursor-pointer hover:border-[#FFC000]"><CardContent className="p-5"><div className="text-xs text-muted-foreground">{p.industry}</div><div className="mt-2 font-semibold">{p.company}</div><Badge className="mt-4" variant="secondary">{p.status}</Badge></CardContent></Card>)}</div>{selected&&<Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>{selected.company} · Account plan</CardTitle><p className="text-sm text-muted-foreground">{selected.industry} growth plan</p></div><Button variant="outline" onClick={()=>toast.success('Plan upload simulated')}>Replace document</Button></CardHeader><CardContent><div className="grid min-h-72 place-items-center rounded-lg border-2 border-dashed bg-slate-50 p-8 text-center dark:bg-slate-900"><FileText className="size-12 text-[#FFC000]"/><div><div className="font-semibold">Account Business Plan.pdf</div><div className="text-sm text-muted-foreground">Preview · 12 pages · last updated today</div></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Select defaultValue={selected.status}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{['Not Reviewed','Reviewed','Feedback Received','Approved'].map(x=><SelectItem value={x} key={x}>{x}</SelectItem>)}</SelectContent></Select><Input placeholder="Feedback comments"/></div></CardContent></Card>}</div>}
function Revenue({wins}:{wins:any[]}){const byIndustry=industries.map(industry=>({industry,value:wins.filter(w=>w.industry===industry).reduce((a,w)=>a+w.value,0)})).filter(x=>x.value); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Sales" title="Revenue pipeline & sales"/><div className="grid gap-4 md:grid-cols-3"><Kpi title="Total won value" value={money(wins.reduce((a,w)=>a+w.value,0))} change="Filtered business wins"/><Kpi title="Business wins" value={wins.length} change="Closed opportunities"/><Kpi title="Average deal size" value={money(wins.length?wins.reduce((a,w)=>a+w.value,0)/wins.length:0)} change="Per closed win"/></div><Card><CardHeader><CardTitle>Wins by industry</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={byIndustry}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="industry" tick={{fontSize:10}} angle={-25} textAnchor="end" height={55}/><YAxis tickFormatter={v=>`$${v/1000}k`}/><Tooltip formatter={(v:any)=>money(v)}/><Bar dataKey="value" fill="#FFC000" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></CardContent></Card><DataTable title="Business wins" rows={wins} columns={['account','lead','value','meetingDate','dateWon','region','industry']}/></div>}
function Activities({support,setSupport,conferences,setConferences}:{support:any[];setSupport:(x:any)=>void;conferences:any[];setConferences:(x:any)=>void}){return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Enablement" title="Account management activities"/><div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader className="flex-row items-center justify-between"><CardTitle>CRM support</CardTitle><Button size="sm" onClick={()=>{setSupport([{id:Date.now(),date:new Date().toISOString().slice(0,10),location:'Virtual',name:'New support session',website:'www.example.com',industry:'Technology'},...support]);toast.success('Support record added')}}><Plus/>Add</Button></CardHeader><CardContent><DataTable title="" rows={support} columns={['date','location','name','industry']}/></CardContent></Card><Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Conferences</CardTitle><Button size="sm" onClick={()=>{setConferences([{id:Date.now(),date:new Date().toISOString().slice(0,10),status:'Planned',category:'Industry',description:'New conference',actionPlan:'Assign owner'},...conferences]);toast.success('Conference added')}}><Plus/>Add</Button></CardHeader><CardContent><DataTable title="" rows={conferences} columns={['date','status','category','description']}/></CardContent></Card></div></div>}
function Documents(){const [target,setTarget]=useState('USA'); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Content" title="Documents"/><div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-6"><FileText className="mb-5 text-[#FFC000]"/><h3 className="font-semibold">GTM strategy</h3><p className="mt-1 text-sm text-muted-foreground">Editable go-to-market planning grid.</p><Button className="mt-5" onClick={()=>toast.success('GTM spreadsheet downloaded')}><Download/>Download</Button></CardContent></Card><Card><CardContent className="p-6"><Mail className="mb-5 text-[#FFC000]"/><h3 className="font-semibold">Email drafts</h3><Select value={target} onValueChange={setTarget}><SelectTrigger className="mt-4"><SelectValue/></SelectTrigger><SelectContent>{regions.map(x=><SelectItem value={x} key={x}>{x}</SelectItem>)}</SelectContent></Select><div className="mt-4 rounded border bg-slate-50 p-3 text-xs whitespace-pre-line dark:bg-slate-900">{emailDraft(target)}</div><Button variant="outline" className="mt-3" onClick={()=>toast.success('Draft copied')}>Copy draft</Button></CardContent></Card><Card><CardContent className="p-6"><Presentation className="mb-5 text-[#FFC000]"/><h3 className="font-semibold">Proposals</h3><p className="mt-1 text-sm text-muted-foreground">Manage proposal documents and outcomes.</p><Button className="mt-5" onClick={()=>toast.success('Navigate to Proposals from sidebar')}>Open proposals</Button></CardContent></Card></div><Card><CardHeader><CardTitle>GTM spreadsheet</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm">{gtmRows.map((row,i)=><tr key={i} className={i===0?'bg-[#0B1F5C] text-white':''}>{row.map((cell,j)=><td key={j} className="border p-3">{i===0?cell:<Input defaultValue={cell} className="border-0 bg-transparent"/>}</td>)}</tr>)}</table></div></CardContent></Card></div>}
function Proposals(){const data=proposals.map(p=>({name:p.name,value:p.status==='Won'?1:0})); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="RFPs" title="Proposals" action="Download register"/><div className="grid gap-4 md:grid-cols-4"><Kpi title="RFPs researched" value={proposals.filter(p=>p.researched).length} change="From proposal register"/><Kpi title="Selected for work" value={proposals.filter(p=>p.selected).length} change="Prioritized RFPs"/><Kpi title="Submitted" value={proposals.length} change="Active register"/><Kpi title="Win rate" value={`${Math.round(proposals.filter(p=>p.status==='Won').length/proposals.length*100)}%`} change="Won / total"/></div><Card><CardContent className="grid items-center gap-6 p-6 md:grid-cols-[260px_1fr]"><div className="h-56"><ResponsiveContainer><PieChart><Pie data={[{name:'Won',value:proposals.filter(p=>p.status==='Won').length},{name:'Pending',value:proposals.filter(p=>p.status==='Pending').length},{name:'Lost',value:proposals.filter(p=>p.status==='Lost').length}]} dataKey="value" innerRadius={60} outerRadius={90}>{[0,1,2].map(i=><Cell key={i} fill={colors[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div><div className="mb-4 rounded-lg border-2 border-dashed p-6 text-center"><Download className="mx-auto text-muted-foreground"/><p className="mt-2 text-sm font-medium">Drag and drop proposals here</p><Button variant="outline" className="mt-3" onClick={()=>toast.success('Mock upload complete')}>Choose files</Button></div><DataTable title="Proposal register" rows={proposals} columns={['name','date','status']}/></div></CardContent></Card></div>}
function Creative(){return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Studio" title="Creative support"/><Tabs defaultValue="Instagram"><TabsList>{['Instagram','LinkedIn','Proposal Management'].map(x=><TabsTrigger key={x} value={x}>{x}</TabsTrigger>)}</TabsList>{['Instagram','LinkedIn','Proposal Management'].map(tab=><TabsContent key={tab} value={tab}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{creativePlaceholders.map((x,i)=><Card key={x.id}><div className="aspect-video bg-gradient-to-br from-[#0B1F5C] via-[#39549a] to-[#B6E4A0]"/><CardContent className="p-4"><Badge variant="secondary">{tab==='Proposal Management'?'Template':x.type}</Badge><div className="mt-2 text-sm font-medium">{tab} · {x.title}</div><Button variant="ghost" size="sm" className="mt-2" onClick={()=>toast.success('Creative item opened')}>View</Button></CardContent></Card>)}</div></TabsContent>)}</Tabs></div>}
function Ratios({leads,wins}:{leads:any[];wins:any[]}){const data=industries.map(industry=>({industry,opening:leads.filter(l=>l.industry===industry&&l.channel==='Email').length?Math.round(leads.filter(l=>l.industry===industry&&l.channel==='Email'&&l.response==='Positive').length/leads.filter(l=>l.industry===industry&&l.channel==='Email').length*100):0,meeting:Math.round(leads.filter(l=>l.industry===industry&&l.response==='Positive').length/Math.max(1,leads.filter(l=>l.industry===industry).length)*100),win:wins.filter(w=>w.industry===industry).length})); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Analytics" title="Ratios"/><div className="grid gap-6 lg:grid-cols-3">{[['Email opening ratio','opening'],['Meeting ratio','meeting'],['Business win ratio','win']].map(([title,key])=><Card key={key}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={240}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="industry" tick={{fontSize:9}} angle={-35} textAnchor="end" height={60}/><YAxis/><Tooltip/><Line type="monotone" dataKey={key} stroke="#0B1F5C" strokeWidth={3}/></LineChart></ResponsiveContainer></CardContent></Card>)}</div><DataTable title="Ratio detail by industry" rows={data} columns={['industry','opening','meeting','win']}/></div>}
