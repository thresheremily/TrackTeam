const { useState, useEffect, useCallback, useRef, useMemo } = React;
const DEFAULT_EVENTS = [
  { name:'100m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'100m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'200m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'200m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'400m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'400m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'800m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'800m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'1600m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Time' },
  { name:'1500m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'3200m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Time' },
  { name:'3000m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'1000m', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Indoor', measurableType:'Time' },
  { name:'1000m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Indoor', measurableType:'Time' },
  { name:'1600m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Indoor', measurableType:'Time' },
  { name:'3200m', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Indoor', measurableType:'Time' },
  { name:'110m Hurdles', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Time' },
  { name:'100m Hurdles', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Outdoor', measurableType:'Time' },
  { name:'55m Hurdles', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Indoor', measurableType:'Time' },
  { name:'55m Hurdles', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Indoor', measurableType:'Time' },
  { name:'400m Hurdles', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Time' },
  { name:'400m Hurdles', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Outdoor', measurableType:'Time' },
  { name:'3000m Steeplechase', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Time' },
  { name:'2000m Steeplechase', eventType:'Track', entryType:'Individual', gender:'Girl', trackType:'Outdoor', measurableType:'Time' },
  { name:'4x100m', eventType:'Track', entryType:'Relay', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'4x100m', eventType:'Track', entryType:'Relay', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'4x400m', eventType:'Track', entryType:'Relay', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'4x400m', eventType:'Track', entryType:'Relay', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'4x800m', eventType:'Track', entryType:'Relay', gender:'Boy', trackType:'Both', measurableType:'Time' },
  { name:'4x800m', eventType:'Track', entryType:'Relay', gender:'Girl', trackType:'Both', measurableType:'Time' },
  { name:'4x200m', eventType:'Track', entryType:'Relay', gender:'Boy', trackType:'Indoor', measurableType:'Time' },
  { name:'4x200m', eventType:'Track', entryType:'Relay', gender:'Girl', trackType:'Indoor', measurableType:'Time' },
  { name:'Long Jump', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Length' },
  { name:'Long Jump', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Length' },
  { name:'Triple Jump', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Length' },
  { name:'Triple Jump', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Length' },
  { name:'High Jump', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Height' },
  { name:'High Jump', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Height' },
  { name:'Pole Vault', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Height' },
  { name:'Pole Vault', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Height' },
  { name:'Shot Put', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Length' },
  { name:'Shot Put', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Both', measurableType:'Length' },
  { name:'Discus', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Length' },
  { name:'Discus', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Outdoor', measurableType:'Length' },
  { name:'Javelin', eventType:'Field', entryType:'Individual', gender:'Boy', trackType:'Outdoor', measurableType:'Length' },
  { name:'Javelin', eventType:'Field', entryType:'Individual', gender:'Girl', trackType:'Outdoor', measurableType:'Length' },
].map((e,i) => ({ id: `evt_${i}`, ...e, qualifyingStandards: [], schoolRecords: [] }));
const INDOOR_LAP = 200;
const OUTDOOR_LAP = 400;
const ROUND_LABELS = ['Open','Trial','Prelim','Quarterfinal','Semifinal','Final'];
const ROUND_COLOR = { Open:'#788396', Trial:'#788396', Prelim:'#788396', Quarterfinal:'#2b6cb0', Semifinal:'#2b6cb0', Final:'#c96a1f' };
const normalizeRound = (r) => (r && ROUND_LABELS.includes(r)) ? r : 'Open';
const CLOSE_THRESHOLD = 0.03;
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const EXERCISE_COLUMNS = [
  { key:'exercise', label:'Exercise', width:'flex', type:'text', placeholder:'e.g. Planks' },
  { key:'type', label:'Type', width:85, type:'text', placeholder:'e.g. Core' },
  { key:'time', label:'Time (m:s)', width:76, type:'text', placeholder:'1:00' },
  { key:'mileage', label:'Miles', width:62, type:'text', placeholder:'2.0' },
  { key:'distance', label:'Meters', width:65, type:'text', placeholder:'400' },
  { key:'reps', label:'Reps', width:52, type:'text', placeholder:'10' },
  { key:'weight', label:'Wt (lbs)', width:65, type:'text', placeholder:'25' },
  { key:'effort', label:'Effort', width:60, type:'text', placeholder:'80%' },
];
const ATTENDANCE_STATUSES = [
  { key:'present', label:'Present', color:'#25763b', icon:'P' },
  { key:'absent', label:'Absent', color:'#c53030', icon:'A' },
  { key:'excused', label:'Excused', color:'#c96a1f', icon:'E' },
  { key:'late', label:'Late', color:'#2b6cb0', icon:'L' },
  { key:'signedout', label:'Signed Out', color:'#6b46c1', icon:'O' },
];
const uid = () => Math.random().toString(36).substr(2,9);
const padDate = (d) => { if(!d) return ''; const s=d+''; if(s.includes('/')) { const p=s.split('/'); if(p.length===3) return `${p[2]}-${p[0].padStart(2,'0')}-${p[1].padStart(2,'0')}`; } const p=s.split('-'); if(p.length===3&&p[0].length===4) return `${p[0]}-${p[1].padStart(2,'0')}-${p[2].padStart(2,'0')}`; return s; };
const formatTime = (ms) => {
  if(!ms && ms!==0) return "--";
  const totalSec = Math.floor(ms/1000);
  const min = Math.floor(totalSec/60);
  const sec = totalSec%60;
  const centis = Math.floor((ms%1000)/10);
  return `${min}:${String(sec).padStart(2,'0')}.${String(centis).padStart(2,'0')}`;
};
const parseTimeToMs = (min, sec) => (parseInt(min||0)*60 + parseFloat(sec||0)) * 1000;
const formatDiff = (ms) => {
  const abs = Math.abs(ms);
  const sign = ms >= 0 ? '+' : '-';
  const totalSec = Math.floor(abs/1000);
  const min = Math.floor(totalSec/60);
  const sec = totalSec%60;
  const centis = Math.floor((abs%1000)/10);
  if(min > 0) return `${sign}${min}:${String(sec).padStart(2,'0')}.${String(centis).padStart(2,'0')}`;
  return `${sign}${sec}.${String(centis).padStart(2,'0')}`;
};
const fieldToStr = (ft, inch, qtr) => `${ft}' ${parseFloat(inch) + parseFloat(qtr)}"`;
const fieldToInches = (ft, inch, qtr) => parseInt(ft)*12 + parseInt(inch) + parseFloat(qtr);
const inchesToField = (total) => {
  const ft = Math.floor(total / 12);
  const rem = total - ft*12;
  const inch = Math.floor(rem);
  const qtr = Math.round((rem - inch)*4)/4;
  return { ft, inch, qtr };
};
const isFieldEvent = (evt) => (evt||{}).eventType === 'Field' || (evt||{}).measurableType === 'Length' || (evt||{}).measurableType === 'Height';
const isRelay = (evt) => (evt||{}).entryType === 'Relay';
const isTrackEvent = (evt) => (evt||{}).eventType === 'Track';
const athLast = (a) => { if(a.lastName) return a.lastName; const p=(a.name||'').trim().split(/\s+/); return p.length>1?p[p.length-1]:p[0]||''; };
const athFirst = (a) => { if(a.firstName) return a.firstName; const p=(a.name||'').trim().split(/\s+/); return p.length>1?p.slice(0,-1).join(' '):''; };
const athPreferred = (a) => a.preferredName || athFirst(a);
const athDisplay = (a, useLegal) => { const l=athLast(a), f=useLegal?athFirst(a):athPreferred(a); return l&&f?`${l}, ${f}`:l||f||'Unknown'; };
const athSearch = (a, q) => { const ql=q.toLowerCase(); return athDisplay(a).toLowerCase().includes(ql) || athDisplay(a,true).toLowerCase().includes(ql) || (a.name||'').toLowerCase().includes(ql) || (a.preferredName||'').toLowerCase().includes(ql); };
const getEventLabel = (evt) => {
  if(!evt) return '';
  const g = evt.gender === 'Boy' ? '(B)' : evt.gender === 'Girl' ? '(G)' : '(Mixed)';
  return `${evt.name} ${g}`;
};
const OPPONENT_CATEGORIES = ['League', 'Non-league', 'Division']; // legacy, kept for migration only
const normalizeOpponent = (o) => {
  if(!o) return o;
  return { ...o, dimensionValues: (o.dimensionValues && typeof o.dimensionValues === 'object') ? o.dimensionValues : {} };
};
const getOpponents = (data) => ((data&&data.opponents)||[]).map(normalizeOpponent);
const getOpponentDimensions = (data) => (((data&&data.opponentDimensions)||[]).slice()).sort((a,b)=>(a.order||0)-(b.order||0));
const getDimensionValues = (dim) => ((dim&&dim.values)||[]).slice().sort((a,b)=>a.name.localeCompare(b.name));
const getOpponentValueName = (opponent, dimensionId, dimensions) => {
  if(!opponent || !opponent.dimensionValues) return '';
  const dim = dimensions.find(d=>d.id===dimensionId);
  if(!dim) return '';
  const v = (dim.values||[]).find(x=>x.id===opponent.dimensionValues[dimensionId]);
  return v ? v.name : '';
};
const getOurTeamDimensionValues = (data) => (data && data.ourTeamDimensionValues) || {};
const getDimensionsLabelForValues = (dimensionValues, dimensions) => {
  if(!dimensions.length) return '';
  return dimensions.map(d => {
    const v = (d.values||[]).find(x=>x.id===(dimensionValues||{})[d.id]);
    return v ? v.name : '—';
  }).join(' · ');
};
const getOpponentDimensionsLabel = (opponentId, opponents, dimensions, data) => {
  if(!opponentId) return '';
  if(opponentId === 'self') return getDimensionsLabelForValues(getOurTeamDimensionValues(data), dimensions);
  const o = opponents.find(x=>x.id===opponentId);
  if(!o) return '';
  return getDimensionsLabelForValues(o.dimensionValues||{}, dimensions);
};
const collectKnownTags = (data) => {
  const set = new Set();
  ((data&&data.meets)||[]).forEach(m => (m.tags||[]).forEach(t => set.add(t)));
  return Array.from(set).sort((a,b)=>a.localeCompare(b));
};
const getOpponentLabel = (opponentId, opponents, team) => {
  if(!opponentId) return '';
  if(opponentId === 'self') return (team && (team.school||team.name)) || 'Our Team';
  const o = (opponents||[]).find(x=>x.id===opponentId);
  return o ? o.name : '(removed)';
};
const TRACK_DISTANCES = {
  '55m':55,'100m':100,'200m':200,'400m':400,'800m':800,'1000m':1000,
  '1500m':1500,'1600m':1600,'3000m':3000,'3200m':3200,
  '55m Hurdles':55,'100m Hurdles':100,'110m Hurdles':110,'400m Hurdles':400,
  '2000m Steeplechase':2000,'3000m Steeplechase':3000,
  '4x100m':400,'4x200m':800,'4x400m':1600,'4x800m':3200,
};
const getDistance = (evt) => TRACK_DISTANCES[(evt||{}).name] || 0;
// Built-in defaults for races whose start line isn't at the lap line. Override on the event itself.
const LAP_STRUCTURE_DEFAULTS = {
  outdoor: {
    '1500m': { firstLap: 300, lapDist: 400 },
    '3000m': { firstLap: 200, lapDist: 400 },
    '5000m': { firstLap: 200, lapDist: 400 },
    '3000m Steeplechase': { firstLap: 270, lapDist: 390 },
    '2000m Steeplechase': { firstLap: 200, lapDist: 360 },
  },
  indoor: {
    '1500m': { firstLap: 100, lapDist: 200 },
  },
};
const getLapStructure = (evt, trackType) => {
  if(!evt) return null;
  const isIndoor = trackType === 'Indoor';
  const trackDefault = isIndoor ? INDOOR_LAP : OUTDOOR_LAP;
  const builtin = (LAP_STRUCTURE_DEFAULTS[isIndoor?'indoor':'outdoor']||{})[evt.name];
  const override = isIndoor
    ? { firstLap: parseFloat(evt.firstLapIndoor), lapDist: parseFloat(evt.lapDistanceIndoor) }
    : { firstLap: parseFloat(evt.firstLapOutdoor), lapDist: parseFloat(evt.lapDistanceOutdoor) };
  const lapDist = override.lapDist > 0 ? override.lapDist : (builtin ? builtin.lapDist : trackDefault);
  const totalDist = getDistance(evt);
  let firstLap;
  if(override.firstLap > 0) firstLap = override.firstLap;
  else if(builtin && builtin.firstLap > 0) firstLap = builtin.firstLap;
  else firstLap = totalDist > 0 ? (totalDist % lapDist || lapDist) : lapDist;
  return { lapDist, firstLap, totalDist };
};
const DEFAULT_MEET_ORDER = [
  {name:'4x800m',gender:'Girl'},{name:'4x800m',gender:'Boy'},
  {name:'100m Hurdles',gender:'Girl'},{name:'110m Hurdles',gender:'Boy'},
  {name:'55m Hurdles',gender:'Girl'},{name:'55m Hurdles',gender:'Boy'},
  {name:'100m',gender:'Girl'},{name:'100m',gender:'Boy'},
  {name:'55m',gender:'Girl'},{name:'55m',gender:'Boy'},
  {name:'1500m',gender:'Girl'},{name:'1600m',gender:'Boy'},
  {name:'1000m',gender:'Girl'},{name:'1000m',gender:'Boy'},
  {name:'4x200m',gender:'Girl'},{name:'4x200m',gender:'Boy'},
  {name:'4x100m',gender:'Girl'},{name:'4x100m',gender:'Boy'},
  {name:'400m',gender:'Girl'},{name:'400m',gender:'Boy'},
  {name:'400m Hurdles',gender:'Girl'},{name:'400m Hurdles',gender:'Boy'},
  {name:'800m',gender:'Girl'},{name:'800m',gender:'Boy'},
  {name:'200m',gender:'Girl'},{name:'200m',gender:'Boy'},
  {name:'3000m',gender:'Girl'},{name:'3200m',gender:'Boy'},
  {name:'3200m',gender:'Girl'},
  {name:'2000m Steeplechase',gender:'Girl'},{name:'3000m Steeplechase',gender:'Boy'},
  {name:'4x400m',gender:'Girl'},{name:'4x400m',gender:'Boy'},
];
const getOrderIndex = (evt, entries) => {
  const list = entries && entries.length ? entries : DEFAULT_MEET_ORDER;
  const idx = list.findIndex(o=>o.name===(evt||{}).name&&o.gender===(evt||{}).gender);
  return idx>=0?idx:500;
};
const getSystemOrderEntries = (data) => {
  const templates = (data||{}).eventOrderTemplates || [];
  const def = templates.find(t=>t.isDefault) || templates[0];
  return def && Array.isArray(def.entries) && def.entries.length ? def.entries : DEFAULT_MEET_ORDER;
};
const getMeetOrderEntries = (data, meet) => {
  const templates = (data||{}).eventOrderTemplates || [];
  if(meet && meet.eventOrderTemplateId) {
    const t = templates.find(t=>t.id===meet.eventOrderTemplateId);
    if(t && Array.isArray(t.entries) && t.entries.length) return t.entries;
  }
  return getSystemOrderEntries(data);
};
const getDefaultOrder = (evt, dataOrEntries, meet) => {
  // back-compat: getDefaultOrder(evt) and getDefaultOrder(evt, entries) both work
  let entries = null;
  if(Array.isArray(dataOrEntries)) entries = dataOrEntries;
  else if(dataOrEntries && typeof dataOrEntries === 'object' && 'eventOrderTemplates' in dataOrEntries) entries = meet ? getMeetOrderEntries(dataOrEntries, meet) : getSystemOrderEntries(dataOrEntries);
  return getOrderIndex(evt, entries);
};
const getSortedMeetEventIds = (data, events, meetId) => {
  const meet = (data.meets||[]).find(m=>m.id===meetId);
  if(!meet) return [];
  const eventOrder = meet.eventOrder || [];
  const excluded = new Set(meet.excludedEvents || []);
  const customIds = meet.customEventIds || [];
  const defaultApplicable = events.filter(e=>(e.trackType===meet.trackType||e.trackType==='Both')&&!e.meetSpecific);
  const customEvts = events.filter(e=>customIds.includes(e.id));
  const applicable = [...defaultApplicable,...customEvts.filter(ce=>!defaultApplicable.some(de=>de.id===ce.id))].filter(e=>!excluded.has(e.id));
  const withEntries = applicable.filter(evt=>{
    const me = (meet.events||[]).find(m=>m.eventId===evt.id);
    return me && (me.entries||[]).length > 0;
  });
  withEntries.sort((a,b)=>{
    const idxA=eventOrder.indexOf(a.id);const idxB=eventOrder.indexOf(b.id);
    if(idxA>=0&&idxB>=0)return idxA-idxB;if(idxA>=0)return -1;if(idxB>=0)return 1;
    return getDefaultOrder(a)-getDefaultOrder(b);
  });
  return withEntries.map(e=>e.id);
};
const getStdBadgeInfo = (data, stdName) => {
  const sn = (stdName||'').trim().toLowerCase();
  if(!sn) return {abbrev:'Q',color:'#2b6cb0'};
  const types = (data.qualifyingStandardTypes||[]);
  for(const t of types) {
    const tn = (t.name||'').trim().toLowerCase();
    const baseAbbrev = t.abbrev||t.name.slice(0,4).toUpperCase();
    const baseColor = t.color||'#2b6cb0';
    if(tn===sn) return {abbrev:baseAbbrev,color:baseColor};
    for(const s of (t.subtypes||[])) {
      if((t.name+' - '+s).trim().toLowerCase()===sn) return {abbrev:baseAbbrev+'-'+s.slice(0,1).toUpperCase(),color:baseColor};
      if((t.name+' '+s).trim().toLowerCase()===sn) return {abbrev:baseAbbrev+'-'+s.slice(0,1).toUpperCase(),color:baseColor};
    }
    if(sn.startsWith(tn+' ') || sn.startsWith(tn+'-')) return {abbrev:baseAbbrev,color:baseColor};
  }
  for(const t of types) {
    const tn = (t.name||'').trim().toLowerCase();
    const baseAbbrev = t.abbrev||t.name.slice(0,4).toUpperCase();
    const baseColor = t.color||'#2b6cb0';
    if(sn.includes(tn) || tn.includes(sn)) return {abbrev:baseAbbrev,color:baseColor};
    const snWords = sn.split(/[\s\-\_\:]+/).filter(w=>w.length>2);
    const tnWords = tn.split(/[\s\-\_\:]+/).filter(w=>w.length>2);
    if(tnWords.length>0 && tnWords.some(w=>snWords.includes(w))) return {abbrev:baseAbbrev,color:baseColor};
    if(snWords.length>0 && snWords.some(w=>tnWords.includes(w))) return {abbrev:baseAbbrev,color:baseColor};
  }
  return {abbrev:(stdName||'Q').slice(0,4).toUpperCase(),color:'#2b6cb0'};
};
const safeHexToRgba = (hex, alpha) => {
  const h = (hex||'#2b6cb0').replace('#','');
  const r = parseInt(h.slice(0,2),16)||43;
  const g = parseInt(h.slice(2,4),16)||108;
  const b = parseInt(h.slice(4,6),16)||176;
  return `rgba(${r},${g},${b},${alpha})`;
};
const QStdBadge = ({data,std}) => {
  if(!std) return null;
  const info = getStdBadgeInfo(data, std.name);
  const matched = info.color!=='#2b6cb0' || (data.qualifyingStandardTypes||[]).length===0;
  return <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:8,background:safeHexToRgba(info.color,0.15),color:info.color||'#2b6cb0',border:`1px solid ${info.color||'#2b6cb0'}`,whiteSpace:'nowrap',opacity:matched?1:0.7}} title={std.name+(matched?'':' [unmatched - check Settings > Qualifying type names]')}>{info.abbrev}</span>;
};
const getStdMinQualifiers = (data, stdName) => {
  const sn = (stdName||'').trim().toLowerCase();
  if(!sn) return 1;
  for(const t of (data.qualifyingStandardTypes||[])) {
    const tn = (t.name||'').trim().toLowerCase();
    const typeDef = Math.max(1, parseInt(t.minQualifiers)||1);
    if(tn===sn) return typeDef;
    for(const s of (t.subtypes||[])) {
      if((t.name+' - '+s).trim().toLowerCase()===sn || (t.name+' '+s).trim().toLowerCase()===sn) {
        const subVal = parseInt((t.subtypeMinQualifiers||{})[s]);
        return Math.max(1, subVal>0 ? subVal : typeDef);
      }
    }
    if(sn.startsWith(tn+' ') || sn.startsWith(tn+'-')) return typeDef;
  }
  return 1;
};
const getStdTimingTypeGlobal = (data, stdName) => {
  const sn = (stdName||'').trim().toLowerCase();
  for(const t of (data.qualifyingStandardTypes||[])) {
    const tn = (t.name||'').trim().toLowerCase();
    if(tn===sn) return t.timingType||'Both';
    for(const s of (t.subtypes||[])) { if((t.name+' - '+s).trim().toLowerCase()===sn) return (t.subtypeTimingTypes||{})[s]||'Both'; }
    if(sn.startsWith(tn)) return t.timingType||'Both';
  }
  return 'Both';
};
const stdMatchesResultTiming = (data, stdName, meetId) => {
  const tt = getStdTimingTypeGlobal(data, stdName);
  if(tt==='Both') return true;
  if(!meetId) return true;
  const meet = (data.meets||[]).find(m=>m.id===meetId);
  if(!meet) return true;
  const meetTiming = meet.timingSystem||'FAT';
  return tt===meetTiming;
};
const handToFAT = (ms) => {
  if(!ms) return 0;
  const sec = ms / 1000;
  const tenths = Math.round(sec * 10);
  const remainder = Math.round(sec * 100) - tenths * 10;
  const roundedUp = remainder > 0 ? (tenths + 1) / 10 : tenths / 10;
  return Math.round((roundedUp + 0.24) * 1000);
};
const getResultTimingSystem = (data, r) => {
  if(!r.meetId) return 'FAT';
  const meet = (data.meets||[]).find(m=>m.id===r.meetId);
  return (meet||{}).timingSystem||'FAT';
};
const getAllQualifyingForResult = (data, events, r, filterTiming) => {
  if(r.isRelaySplit) return [];
  const evt = events.find(e=>e.id===r.eventId);
  if(!evt||!(evt.qualifyingStandards||[]).length) return [];
  const stds = evt.qualifyingStandards||[];
  const applicable = filterTiming ? stds.filter(s=>stdMatchesResultTiming(data,s.name,r.meetId)) : stds;
  const isField = (evt.eventType||'')==='Field';
  if(isField) {
    const myVal = (r.ft||0)*12+(r.inch||0)+(r.qtr||0);
    return applicable.filter(s=>{const sVal=(s.ft||0)*12+(s.inch||0)+(s.qtr||0);return sVal>0&&myVal>=sVal;});
  } else {
    const rawMs = r.timeMs||(r._relayTotal)||0;
    if(!rawMs) return [];
    const resultTiming = getResultTimingSystem(data, r);
    return applicable.filter(s=>{
      if(!s.timeMs||s.timeMs<=0) return false;
      const stdTiming = getStdTimingTypeGlobal(data, s.name);
      let checkMs = rawMs;
      if(resultTiming==='Hand' && (stdTiming==='FAT'||stdTiming==='Both')) {
        checkMs = handToFAT(rawMs);
      }
      return checkMs <= s.timeMs;
    });
  }
};
const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if(lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(/[,\t]/).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const rows = lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = [];
    let current = '';
    let inQuotes = false;
    for(let i = 0; i < line.length; i++) {
      const ch = line[i];
      if(ch === '"' || ch === "'") { inQuotes = !inQuotes; }
      else if((ch === ',' || ch === '\t') && !inQuotes) { vals.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    vals.push(current.trim());
    const obj = {};
    headers.forEach((h,i) => { obj[h] = vals[i] || ''; });
    return obj;
  });
  return { headers, rows };
};
const linearRegression = (xs, ys) => {
  const n = xs.length;
  if(n < 2) return null;
  let sx=0, sy=0, sxy=0, sxx=0;
  for(let i=0;i<n;i++){sx+=xs[i];sy+=ys[i];sxy+=xs[i]*ys[i];sxx+=xs[i]*xs[i];}
  const denom = n*sxx - sx*sx;
  if(!denom) return null;
  const slope = (n*sxy - sx*sy) / denom;
  const intercept = (sy - slope*sx) / n;
  return { slope, intercept };
};
const dateToDay = (d) => {
  const t = new Date((d||'')+'T12:00:00').getTime();
  return isNaN(t) ? 0 : Math.round(t/86400000);
};
const makeProgressionSVG = (points, opts) => {
  const W = (opts||{}).width || 540;
  const H = (opts||{}).height || 150;
  const ML=58, MR=14, MT=14, MB=30;
  const PW = W-ML-MR, PH = H-MT-MB;
  if(!points.length) return `<svg width="${W}" height="${H}"></svg>`;
  const xs = points.map(p=>p.day);
  const ys = points.map(p=>p.value);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const padY = Math.max(0.0001, (maxY-minY)*0.1);
  const lo = minY - padY, hi = maxY + padY;
  const rangeY = (hi-lo) || 1;
  const rangeX = (maxX-minX) || 1;
  const sx = (x) => ML + ((x-minX)/rangeX)*PW;
  const sy = (y) => MT + (1-(y-lo)/rangeY)*PH;
  const fmt = (opts||{}).formatY || ((v)=>v.toFixed(2));
  const fmtDate = (d) => {const dt=new Date(d+'T12:00:00');return (dt.getMonth()+1)+'/'+dt.getDate();};
  const reg = linearRegression(xs, ys);
  let trendLine = '';
  if(reg) {
    const x1 = minX, x2 = maxX;
    const y1 = reg.intercept + reg.slope*x1;
    const y2 = reg.intercept + reg.slope*x2;
    trendLine = `<line x1="${sx(x1)}" y1="${sy(y1)}" x2="${sx(x2)}" y2="${sy(y2)}" stroke="#c53030" stroke-width="2" stroke-dasharray="5,3" />`;
  }
  const ticks = 4;
  let yTicks = '';
  for(let i=0;i<=ticks;i++){
    const v = lo + (rangeY*i/ticks);
    const yp = sy(v);
    yTicks += `<line x1="${ML-3}" y1="${yp}" x2="${ML}" y2="${yp}" stroke="#888" />`;
    yTicks += `<text x="${ML-5}" y="${yp+3}" text-anchor="end" font-size="8" fill="#666">${fmt(v)}</text>`;
  }
  const xTicks = points.length<=8 ? points : [points[0], points[Math.floor(points.length/2)], points[points.length-1]];
  let xTickStr = '';
  xTicks.forEach(p=>{
    const xp = sx(p.day);
    xTickStr += `<line x1="${xp}" y1="${MT+PH}" x2="${xp}" y2="${MT+PH+3}" stroke="#888" />`;
    xTickStr += `<text x="${xp}" y="${MT+PH+12}" text-anchor="middle" font-size="8" fill="#666">${fmtDate(p.date)}</text>`;
  });
  const connect = points.map((p,i)=>(i===0?'M':'L')+sx(p.day)+','+sy(p.value)).join(' ');
  const pts = points.map(p=>`<circle cx="${sx(p.day)}" cy="${sy(p.value)}" r="2.5" fill="#2b6cb0" stroke="#fff" stroke-width="0.5" />`).join('');
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" style="font-family:Helvetica,Arial,sans-serif">
    <rect x="${ML}" y="${MT}" width="${PW}" height="${PH}" fill="#fafafa" stroke="#ddd" />
    ${yTicks}${xTickStr}
    <path d="${connect}" fill="none" stroke="#2b6cb0" stroke-width="1" opacity="0.5" />
    ${trendLine}
    ${pts}
  </svg>`;
};
const makeBarChartSVG = (rows, opts) => {
  const W = (opts||{}).width || 560;
  const rowH = 18;
  const ML = (opts||{}).labelWidth || 140, MR = 50, MT = 8, MB = 8;
  const H = MT + MB + rows.length*rowH;
  if(!rows.length) return `<svg width="${W}" height="${MT+MB+rowH}"><text x="10" y="${MT+12}" font-size="10" fill="#888">No data</text></svg>`;
  const maxV = Math.max(...rows.map(r=>r.value), 1);
  const PW = W-ML-MR;
  let bars = '';
  rows.forEach((r,i)=>{
    const y = MT + i*rowH;
    const bw = (r.value/maxV)*PW;
    bars += `<text x="${ML-6}" y="${y+rowH/2+3}" text-anchor="end" font-size="9" fill="#222">${r.label}</text>`;
    bars += `<rect x="${ML}" y="${y+3}" width="${bw}" height="${rowH-6}" fill="${r.color||'#2b6cb0'}" rx="2" />`;
    bars += `<text x="${ML+bw+4}" y="${y+rowH/2+3}" font-size="9" fill="#222" font-weight="600">${r.value}${r.suffix||''}</text>`;
  });
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" style="font-family:Helvetica,Arial,sans-serif">${bars}</svg>`;
};
const esc = (s) => (s==null?'':(''+s)).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const HAS_FIREBASE = typeof firebase !== 'undefined' && !!firebase.apps;
let db = null;
let authService = null;
if (HAS_FIREBASE) {
  db = firebase.firestore();
  authService = firebase.auth();
  db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
}
const appStorage = {
  async get(key) {
    try { const v = localStorage.getItem(key); if(v) return v; } catch(e) {}
    try { if(window.storage&&window.storage.get) { const r = await window.storage.get(key); if(r&&r.value) { try { localStorage.setItem(key, r.value); } catch(e) {} return r.value; } } } catch(e) {}
    return null;
  },
  async set(key, value) {
    try { localStorage.setItem(key, value); } catch(e) {}
    try { if(window.storage&&window.storage.set) await window.storage.set(key, value); } catch(e) {}
  }
};
const STORE_KEY = "trackapp-data";
const defaultData = () => ({
  athletes: [],
  meets: [],
  results: [],
  attendance: [],
  events: DEFAULT_EVENTS.map(e => ({id:uid(), ...e, qualifyingStandards:[], schoolRecords:[]})),
  workoutGroups: [
    { id:'grp_dist', name:'Distance', levels:['Level 1'] },
    { id:'grp_mid', name:'Mid-Distance', levels:['Level 1'] },
    { id:'grp_sprint', name:'Sprinting', levels:['Level 1'] },
    { id:'grp_jump', name:'Jumping / Pole Vault', levels:['Level 1'] },
    { id:'grp_throw', name:'Throwing', levels:['Level 1'] },
  ],
  workoutLibrary: [],
  workoutPlans: [],
  meetTypes: [
    { id:'mt_league', name:'League', qualifying:false },
    { id:'mt_invite', name:'Invitational', qualifying:false },
    { id:'mt_sect', name:'Sectionals', qualifying:true },
  ],
  qualifyingStandardTypes: [],
  workoutCategories: [
    { id:'wc_main', name:'Main', color:'#2b6cb0' },
    { id:'wc_warmup', name:'Warm-Up', color:'#c96a1f' },
    { id:'wc_cooldown', name:'Cool-Down', color:'#25763b' },
    { id:'wc_strength', name:'Strength/Conditioning', color:'#6b46c1' },
  ],
  seasons: [],
  medicalNotes: [],
  workoutOverrides: [],
});
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!HAS_FIREBASE) { setUser({ uid:'local', email:'local' }); setLoading(false); return; }
    return authService.onAuthStateChanged(u => { setUser(u); setLoading(false); });
  }, []);
  const signUp = async (email, password, name) => {
    const cred = await authService.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    return cred.user;
  };
  const signIn = (email, password) => authService.signInWithEmailAndPassword(email, password).then(c=>c.user);
  const signInGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return (await authService.signInWithPopup(provider)).user;
  };
  const signOut = () => authService.signOut();
  return { user, loading, signUp, signIn, signInGoogle, signOut };
};
const generateJoinCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TF-';
  for(let i=0;i<5;i++) code += chars[Math.floor(Math.random()*chars.length)];
  return code;
};
const useTeam = (userId) => {
  const [team, setTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const unsubRef = useRef([]);
  useEffect(() => {
    unsubRef.current.forEach(fn=>fn());
    unsubRef.current = [];
    if(!HAS_FIREBASE || !userId) {
      (async () => {
        try {
          const saved = await appStorage.get('trackapp-team');
          if(saved) setTeam(JSON.parse(saved));
          else setTeam({ id:'local', name:'My Team', school:'', joinCode:'', colors:{ primary:'#c96a1f', secondary:'#2b6cb0' }, logo:'', members:{} });
        } catch { setTeam({ id:'local', name:'My Team', school:'', joinCode:'', colors:{ primary:'#c96a1f', secondary:'#2b6cb0' }, logo:'', members:{} }); }
        setTeamLoading(false);
      })();
      return;
    }
    const unsub1 = db.collection('users').doc(userId).onSnapshot(snap => {
      const ud = snap.data();
      if((ud||{}).teamId) {
        const unsub2 = db.collection('teams').doc(ud.teamId).onSnapshot(ts => {
          if(ts.exists) setTeam({ id:ts.id, ...ts.data() });
          else setTeam(null);
          setTeamLoading(false);
        });
        unsubRef.current.push(unsub2);
      } else { setTeam(null); setTeamLoading(false); }
    }, () => { setTeam(null); setTeamLoading(false); });
    unsubRef.current.push(unsub1);
    return () => unsubRef.current.forEach(fn=>fn());
  }, [userId]);
  const createTeam = async (name, school, userId, userEmail, userName) => {
    const joinCode = generateJoinCode();
    const teamRef = await db.collection('teams').add({
      name, school, joinCode, createdBy:userId, createdAt:new Date().toISOString(),
      colors:{ primary:'#c96a1f', secondary:'#2b6cb0' }, logo:'',
      members:{ [userId]:{ email:userEmail, name:userName||userEmail, role:'coach' } },
    });
    await db.collection('users').doc(userId).set({ teamId:teamRef.id, email:userEmail, name:userName||userEmail }, { merge:true });
    await teamRef.collection('data').doc('main').set(defaultData());
    return teamRef.id;
  };
  const joinTeam = async (code, userId, userEmail, userName) => {
    const snap = await db.collection('teams').where('joinCode','==',code.toUpperCase().trim()).get();
    if(snap.empty) throw new Error('Invalid join code');
    const teamDoc = snap.docs[0];
    const teamData = teamDoc.data();
    await teamDoc.ref.update({ members:{ ...teamData.members, [userId]:{ email:userEmail, name:userName||userEmail, role:'coach' } } });
    await db.collection('users').doc(userId).set({ teamId:teamDoc.id, email:userEmail, name:userName||userEmail }, { merge:true });
    return teamDoc.id;
  };
  const updateTeam = async (teamId, updates) => {
    if(!HAS_FIREBASE) {
      setTeam(prev => prev ? { ...prev, ...updates } : prev);
      try { await appStorage.set('trackapp-team', JSON.stringify({ ...team, ...updates })); } catch(e) { console.error(e); }
      return;
    }
    await db.collection('teams').doc(teamId).update(updates);
  };
  return { team, teamLoading, createTeam, joinTeam, updateTeam };
};
const useStore = (teamId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(!teamId) { setLoading(false); return; }
    if(!HAS_FIREBASE) {
      (async () => {
        try {
          const r = await appStorage.get(STORE_KEY);
          if(r) {
            const loaded = JSON.parse(r);
            if(!loaded.events || loaded.events.length === 0) loaded.events = DEFAULT_EVENTS.map(e=>({id:uid(), ...e, qualifyingStandards:[], schoolRecords:[]}));
            loaded.events = (loaded.events||[]).map(e=>e.id?e:{...e, id:uid(), qualifyingStandards:e.qualifyingStandards||[], schoolRecords:e.schoolRecords||[]});
            if(!loaded.workoutCategories || loaded.workoutCategories.length === 0) loaded.workoutCategories = defaultData().workoutCategories;
            if(!loaded.meetTypes || loaded.meetTypes.length === 0) loaded.meetTypes = defaultData().meetTypes;
            if(!loaded.workoutGroups || loaded.workoutGroups.length === 0) loaded.workoutGroups = defaultData().workoutGroups;
            if(!loaded._nameSwapDone) {
              loaded.athletes = (loaded.athletes||[]).map(a => {
                if(a.firstName && a.lastName) return {...a, firstName:a.lastName, lastName:a.firstName};
                return a;
              });
              loaded._nameSwapDone = true;
            }
            (loaded.meets||[]).forEach(m=>{ m.startDate=padDate(m.startDate||m.date); m.endDate=padDate(m.endDate); if(m.date) m.date=padDate(m.date); });
            (loaded.seasons||[]).forEach(s=>{ s.startDate=padDate(s.startDate); s.endDate=padDate(s.endDate); });
            (loaded.workoutPlans||[]).forEach(w=>{ w.startDate=padDate(w.startDate); });
            (loaded.attendance||[]).forEach(r=>{ r.date=padDate(r.date); });
            (loaded.results||[]).forEach(r=>{ r.date=padDate(r.date); });
            setData(loaded);
            try { await appStorage.set(STORE_KEY, JSON.stringify(loaded)); } catch(e) {}
          }
          else setData(defaultData());
        } catch { setData(defaultData()); }
        setLoading(false);
      })();
      return;
    }
    return db.collection('teams').doc(teamId).collection('data').doc('main')
      .onSnapshot(snap => {
        if(snap.exists) {
          const loaded = snap.data();
          if(!loaded.events || loaded.events.length === 0) loaded.events = DEFAULT_EVENTS.map(e=>({id:uid(), ...e, qualifyingStandards:[], schoolRecords:[]}));
          loaded.events = (loaded.events||[]).map(e=>e.id?e:{...e, id:uid(), qualifyingStandards:e.qualifyingStandards||[], schoolRecords:e.schoolRecords||[]});
          if(!loaded.workoutCategories || loaded.workoutCategories.length === 0) loaded.workoutCategories = defaultData().workoutCategories;
          if(!loaded.meetTypes || loaded.meetTypes.length === 0) loaded.meetTypes = defaultData().meetTypes;
          if(!loaded.workoutGroups || loaded.workoutGroups.length === 0) loaded.workoutGroups = defaultData().workoutGroups;
          if(!loaded._nameSwapDone) {
            loaded.athletes = (loaded.athletes||[]).map(a => {
              if(a.firstName && a.lastName) return {...a, firstName:a.lastName, lastName:a.firstName};
              return a;
            });
            loaded._nameSwapDone = true;
          }
          (loaded.meets||[]).forEach(m=>{ m.startDate=padDate(m.startDate||m.date); m.endDate=padDate(m.endDate); if(m.date) m.date=padDate(m.date); });
          (loaded.seasons||[]).forEach(s=>{ s.startDate=padDate(s.startDate); s.endDate=padDate(s.endDate); });
          (loaded.workoutPlans||[]).forEach(w=>{ w.startDate=padDate(w.startDate); });
          (loaded.attendance||[]).forEach(r=>{ r.date=padDate(r.date); });
          (loaded.results||[]).forEach(r=>{ r.date=padDate(r.date); });
          setData(loaded);
        }
        else { const d = defaultData(); snap.ref.set(d); setData(d); }
        setLoading(false);
      }, () => { setData(defaultData()); setLoading(false); });
  }, [teamId]);
  const [syncStatus, setSyncStatus] = useState('idle');
  const syncTimerRef = useRef(null);
  const save = useCallback(async (newData) => {
    setData(newData);
    setSyncStatus('saving');
    if(!HAS_FIREBASE) {
      try { await appStorage.set(STORE_KEY, JSON.stringify(newData)); setSyncStatus('saved'); } catch(e) { console.error(e); setSyncStatus('error'); }
      if(syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(()=>setSyncStatus('idle'),3000);
      return;
    }
    if(teamId) {
      try {
        await db.collection('teams').doc(teamId).collection('data').doc('main').set(newData);
        setSyncStatus('saved');
      }
      catch(e) {
        console.error('Save error:', e);
        setSyncStatus('error');
        const sizeKB = Math.round(JSON.stringify(newData).length/1024);
        alert('Save failed! Data size: '+sizeKB+'KB. Error: '+e.message+'\n\nIf data is near 1MB, you may need to archive old results.');
      }
      if(syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(()=>setSyncStatus('idle'),3000);
    }
  }, [teamId]);
  return { data, save, loading, syncStatus };
};
const getActiveSeason = (data) => ((data||{}).seasons||[]).find(s=>s.active);
const isInSeason = (date, season) => {
  if(!season) return true;
  return date >= season.startDate && date <= season.endDate;
};
const hexToRgb = (hex) => {
  const h = hex.replace('#','');
  return { r:parseInt(h.slice(0,2),16), g:parseInt(h.slice(2,4),16), b:parseInt(h.slice(4,6),16) };
};
const lightenChannel = (c, amt) => Math.min(255, Math.round(c + (255-c) * amt));
const makeColors = (primary='#c96a1f', secondary='#2b6cb0') => {
  const p = hexToRgb(primary);
  const s = hexToRgb(secondary);
  const al = `#${[lightenChannel(p.r,0.3),lightenChannel(p.g,0.3),lightenChannel(p.b,0.3)].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
  return {
    bg:'#f5f6f8', surface:'#ffffff', surface2:'#eef0f4', border:'#d8dce3', borderLight:'#e4e7ed',
    accent:primary, accentLight:al, accentMuted:`rgba(${p.r},${p.g},${p.b},0.1)`,
    blue:secondary, blueMuted:`rgba(${s.r},${s.g},${s.b},0.08)`,
    text:'#1a1e26', textSecondary:'#5c6370', textMuted:'#8c929e', white:'#ffffff',
    danger:'#c53030', dangerMuted:'rgba(197,48,48,0.08)',
    success:'#25763b', successMuted:'rgba(37,118,59,0.08)',
  };
};
const HEADING_FONT = "'Montserrat','Rubik',sans-serif";
const itemMult = (e) => Math.max(1, parseInt((e||{}).sets)||1) * Math.max(1, parseInt((e||{}).reps)||1);
const itemMiles = (e) => {
  if(!e) return 0;
  const mult = itemMult(e);
  const mi = (parseFloat(e.mileage)||0) * mult;
  const m = (parseFloat(e.distance)||0) * mult;
  return mi + m/1609.34;
};
const entryTotalMiles = (e) => {
  if(!e) return 0;
  let t = itemMiles(e);
  (e.exercises||[]).forEach(ex => { t += itemMiles(ex); });
  return t;
};
const exTotals = (exercises) => {
  let mi=0, m=0;
  (exercises||[]).forEach(ex=>{ const mult = itemMult(ex); mi+=(parseFloat(ex.mileage)||0)*mult; m+=(parseFloat(ex.distance)||0)*mult; });
  const parts=[];
  if(mi>0) parts.push(`${mi.toFixed(1)} mi`);
  if(m>0) parts.push(`${Math.round(m)}m`);
  return parts.join(' + ');
};
const makeStyles = (C) => ({
  app: { fontFamily:"'Rubik','Inter',system-ui,-apple-system,sans-serif", background:C.bg, minHeight:'100vh', color:C.text, letterSpacing:'-0.01em', },
  container: { maxWidth:1100, margin:'0 auto', padding:'16px 16px', width:'100%', boxSizing:'border-box', minWidth:0 },
  containerDesktop: { marginLeft:250, maxWidth:'none', padding:'20px 32px', width:'calc(100% - 250px)' },
  card: { background:C.surface, borderRadius:8, padding:'14px 18px', marginBottom:10, border:`1px solid ${C.border}`, boxSizing:'border-box' },
  btn: { padding:'8px 16px', borderRadius:6, border:'none', cursor:'pointer', fontWeight:600, fontSize:12, transition:'opacity 0.15s', lineHeight:'18px', textTransform:'uppercase', letterSpacing:'0.04em' },
  btnPrimary: { background:C.accent, color:C.white },
  btnSecondary: { background:C.surface2, color:C.textSecondary, border:`1px solid ${C.border}` },
  btnDanger: { background:C.dangerMuted, color:C.danger },
  btnSuccess: { background:C.successMuted, color:C.success },
  input: { padding:'8px 12px', borderRadius:6, border:`1px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, width:'100%', boxSizing:'border-box', lineHeight:'20px' },
  select: { padding:'8px 12px', borderRadius:6, border:`1px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13 },
  th: { padding:'8px 12px', textAlign:'left', borderBottom:`1px solid ${C.border}`, color:C.textMuted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' },
  td: { padding:'8px 12px', borderBottom:`1px solid ${C.border}`, fontSize:13, color:C.text },
  pill: (active) => ({ display:'inline-block', padding:'3px 10px', borderRadius:16, fontSize:11, fontWeight:500, margin:'2px 3px', cursor:'pointer', background:active ? C.accentMuted : C.surface2, color:active ? C.accent : C.textSecondary, border:`1px solid ${active ? C.accent : C.border}`, transition:'all 0.15s' }),
  bigBtn: { display:'block', width:'100%', padding:'16px 20px', borderRadius:8, border:`1px solid ${C.border}`, cursor:'pointer', fontWeight:600, fontSize:14, marginBottom:8, transition:'opacity 0.15s', textAlign:'left', color:C.text, textTransform:'uppercase', letterSpacing:'0.04em' },
  sidebarFixed: {
    position:'fixed', top:0, left:0, bottom:0, width:240, background:C.surface,
    borderRight:`1px solid ${C.border}`, zIndex:1001, padding:'20px 0',
    overflowY:'auto', transform:'translateX(0)',
  },
  sidebar: (open) => ({
    position:'fixed', top:0, left:0, bottom:0, width:240, background:C.surface,
    borderRight:`1px solid ${C.border}`, zIndex:1001, padding:'20px 0',
    transform:open ? 'translateX(0)' : 'translateX(-100%)',
    transition:'transform 0.25s ease', overflowY:'auto', boxShadow:open ? '4px 0 24px rgba(0,0,0,0.08)' : 'none',
  }),
  sidebarOverlay: (open) => ({
    position:'fixed', inset:0, background:'rgba(0,0,0,0.2)', zIndex:1000,
    opacity:open ? 1 : 0, pointerEvents:open ? 'auto' : 'none', transition:'opacity 0.25s ease',
  }),
  sidebarItem: (active) => ({
    display:'flex', alignItems:'center', gap:12, padding:'10px 20px', cursor:'pointer',
    background:active ? C.accentMuted : 'transparent', color:active ? C.accent : C.textSecondary,
    fontWeight:600, fontSize:12, textTransform:'uppercase', letterSpacing:'0.04em',
    border:'none', width:'100%', textAlign:'left', borderLeft:active ? `3px solid ${C.accent}` : '3px solid transparent',
    transition:'all 0.15s',
  }),
  topBar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:`1px solid ${C.border}`, marginBottom:16, background:C.surface, borderRadius:8 },
  hamburger: { background:'none', border:'none', cursor:'pointer', padding:6, display:'flex', flexDirection:'column', gap:4, justifyContent:'center' },
  backLink: { color:C.textSecondary, cursor:'pointer', fontSize:12, display:'inline-flex', alignItems:'center', gap:4, marginBottom:16, background:'none', border:'none', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.03em' },
  h1: { fontSize:22, fontWeight:700, marginBottom:2, color:C.text, letterSpacing:'0.02em', textTransform:'uppercase', fontFamily:"'Montserrat','Rubik',sans-serif" },
  h2: { fontSize:17, fontWeight:700, marginBottom:2, color:C.text, textTransform:'uppercase', letterSpacing:'0.02em', fontFamily:"'Montserrat','Rubik',sans-serif" },
  h3: { fontSize:13, fontWeight:400, color:C.textSecondary, marginBottom:16 },
  trophy: { color:'#b8860b', marginLeft:4 },
  pr: { background:C.accentMuted, color:C.accent, padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.03em' },
});
let C = makeColors();
let S = makeStyles(C);
const COLOR_PRESETS = [
  { name:'Burnt Orange', primary:'#c96a1f', secondary:'#2b6cb0' },
  { name:'Navy & Gold', primary:'#1a365d', secondary:'#c8a951' },
  { name:'Crimson & White', primary:'#a51c30', secondary:'#1e3a5f' },
  { name:'Forest Green', primary:'#276749', secondary:'#744210' },
  { name:'Royal Purple', primary:'#553c9a', secondary:'#c96a1f' },
  { name:'Cardinal Red', primary:'#c53030', secondary:'#1a365d' },
  { name:'Teal & Silver', primary:'#0d9488', secondary:'#64748b' },
  { name:'Maroon & Gold', primary:'#7b2d26', secondary:'#b8860b' },
  { name:'Steel Blue', primary:'#2b6cb0', secondary:'#c96a1f' },
  { name:'Black & Gold', primary:'#1a1e26', secondary:'#b8860b' },
];
const Modal = ({ open, onClose, children, width }) => {
  if(!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.3)' }} onClick={onClose} />
      <div style={{ position:'relative', background:C.surface, borderRadius:10, padding:24, width:width||520, maxWidth:'90vw', maxHeight:'85vh', overflowY:'auto', border:`1px solid ${C.border}`, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:12, right:12, background:'none', border:'none', color:C.textMuted, cursor:'pointer', fontSize:18 }}>✕</button>
        {children}
      </div>
    </div>
  );
};
const ConfirmModal = ({ open, onClose, onConfirm, message }) => (
  <Modal open={open} onClose={onClose} width={380}>
    <p style={{ fontSize:14, marginBottom:20, color:C.text }}>{message}</p>
    <p style={{ fontSize:12, color:C.textMuted, marginBottom:16 }}>This action cannot be undone.</p>
    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
      <button style={{...S.btn,...S.btnSecondary}} onClick={onClose}>Cancel</button>
      <button style={{...S.btn,...S.btnDanger}} onClick={()=>{onConfirm();onClose();}}>Delete</button>
    </div>
  </Modal>
);
const TagInput = ({ value, onChange, suggestions, placeholder }) => {
  const [draft, setDraft] = useState('');
  const tags = Array.isArray(value) ? value : [];
  const add = (raw) => {
    const t = (raw||'').trim();
    if(!t) return;
    if(tags.some(x => x.toLowerCase() === t.toLowerCase())) { setDraft(''); return; }
    onChange([...tags, t]);
    setDraft('');
  };
  const remove = (i) => onChange(tags.filter((_,idx)=>idx!==i));
  const sugg = (suggestions||[]).filter(s => !tags.some(t => t.toLowerCase() === s.toLowerCase()) && (!draft || s.toLowerCase().includes(draft.toLowerCase()))).slice(0,6);
  const listId = 'tagsugg_' + Math.abs((tags.join('|')+(placeholder||'')).split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0));
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',padding:'6px 8px',border:`1px solid ${C.border}`,borderRadius:6,background:C.surface,minHeight:36}}>
      {tags.map((t,i)=>(
        <span key={t+'_'+i} style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,fontWeight:600,padding:'3px 8px',borderRadius:12,background:C.accentMuted,color:C.accent,border:`1px solid ${C.accent}`}}>
          {t}
          <button type="button" onClick={()=>remove(i)} style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:13,padding:0,lineHeight:1}} title="Remove tag">×</button>
        </span>
      ))}
      <input list={listId} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{
        if(e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(draft); }
        else if(e.key === 'Backspace' && !draft && tags.length) { onChange(tags.slice(0,-1)); }
      }} onBlur={()=>{if(draft.trim()) add(draft);}} placeholder={tags.length?'':(placeholder||'Add tag…')} style={{flex:'1 1 100px',minWidth:80,border:'none',outline:'none',fontSize:12,background:'transparent',color:C.text}} />
      {(suggestions||[]).length>0 && <datalist id={listId}>{sugg.map(s=><option key={s} value={s} />)}</datalist>}
    </div>
  );
};
const TimeDropdown = ({ min, sec, onMinChange, onSecChange, label, compact }) => (
  <div style={{ display:'flex', gap:4, alignItems:'center' }}>
    {label && <span style={{fontSize:11,color:C.textMuted,marginRight:4}}>{label}</span>}
    <select style={{...S.select, width:compact ? 55 : 65}} value={min} onChange={e=>onMinChange(e.target.value)}>
      {Array.from({length:31},(_,i)=><option key={i} value={i}>{i}</option>)}
    </select>
    <span style={{color:C.textMuted}}>:</span>
    <input type="text" inputMode="decimal" placeholder="00.00" style={{...S.input, width:compact ? 65 : 75, textAlign:'center', fontVariantNumeric:'tabular-nums', fontSize:13, padding:'6px 4px'}} value={sec} onChange={e=>onSecChange(e.target.value)} />
  </div>
);
const FieldMeasure = ({ ft, inch, qtr, onFtChange, onInchChange, onQtrChange }) => (
  <div style={{ display:'flex', gap:4, alignItems:'center' }}>
    <select style={{...S.select, width:70}} value={ft} onChange={e=>onFtChange(e.target.value)}>
      {Array.from({length:100},(_,i)=><option key={i} value={i}>{i}'</option>)}
    </select>
    <select style={{...S.select, width:70}} value={inch} onChange={e=>onInchChange(e.target.value)}>
      {Array.from({length:12},(_,i)=><option key={i} value={i}>{i}"</option>)}
    </select>
    <select style={{...S.select, width:80}} value={qtr} onChange={e=>onQtrChange(e.target.value)}>
      {[0,0.25,0.5,0.75].map(v=><option key={v} value={v}>{v}"</option>)}
    </select>
  </div>
);
const RecordBadge = ({ status, small }) => {
  if(!status) return null;
  const config = {
    broken: { bg:'#fef3c7', color:'#92400e', text:'NEW RECORD' },
    close: { bg:'#fef3c7', color:'#b45309', text:'CLOSE' },
  };
  const c = config[status];
  if(!c) return null;
  return <span style={{ background:c.bg, color:c.color, padding:small?'1px 5px':'2px 8px', borderRadius:4, fontSize:small?9:11, fontWeight:600, letterSpacing:'0.03em' }}>{c.text}</span>;
};
const MEDALS = { 1:{emoji:'1st',color:'#b8860b'}, 2:{emoji:'2nd',color:'#8a8a8a'}, 3:{emoji:'3rd',color:'#cd7f32'} };
const MedalBadge = ({ place, small }) => {
  if(!place || !MEDALS[place]) return null;
  const medal = MEDALS[place];
  return <span style={{ fontSize:small?12:16 }}>{medal.emoji}</span>;
};
const VerifiedBadge = ({ verified, small }) => {
  if(!verified) return null;
  return <span style={{ color:'#2b6cb0', fontSize:small?9:11, fontWeight:600, background:'rgba(43,108,176,0.08)', padding:'1px 6px', borderRadius:4 }}>VERIFIED</span>;
};
const QualifyingBadge = ({ status, small }) => {
  if(!status) return null;
  const config = {
    automatic: { bg:'rgba(37,118,59,0.1)', color:'#25763b', text:'AUTO Q' },
    provisional: { bg:'rgba(43,108,176,0.08)', color:'#2b6cb0', text:'PROV Q' },
  };
  const c = config[status];
  if(!c) return null;
  return <span style={{ background:c.bg, color:c.color, padding:small?'1px 5px':'2px 8px', borderRadius:4, fontSize:small?9:11, fontWeight:600 }}>{c.text}</span>;
};
const SavedIndicator = ({ saved }) => {
  if(!saved) return null;
  return <span style={{ color:C.success, fontSize:13, fontWeight:500 }}>✓ Saved</span>;
};
function TrendChart({ points, width=320, height=160, color=C.accent, label, invertY=true }) {
  if(!points || points.length < 2) return null;
  const vals = points.map(p=>p.value);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const pad = 20;
  const chartW = width - pad*2;
  const chartH = height - pad*2;
  const pts = points.map((p,i) => {
    const x = pad + (i/(points.length-1))*chartW;
    const norm = (p.value-minV)/range;
    const y = invertY ? pad + (1-norm)*chartH : pad + norm*chartH;
    return { x, y, ...p };
  });
  const pathD = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display:'block' }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} />
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill={color} />
          <text x={p.x} y={height-4} textAnchor="middle" fontSize={8} fill={C.textMuted}>{p.label||''}</text>
          <text x={p.x} y={p.y-8} textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>
            {typeof p.value === 'number' && p.value > 100 ? formatTime(p.value) : (p.value > 12 ? `${Math.floor(p.value/12)}'${(p.value%12).toFixed(1)}"` : `${p.value.toFixed(1)}"`)}</text>
        </g>
      ))}
      {label && <text x={width/2} y={14} textAnchor="middle" fontSize={10} fill={C.textMuted}>{label}</text>}
    </svg>
  );
}
function ImportModal({ open, onClose, type, onImport }) {
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const handleParse = (text) => {
    setRawText(text);
    setError('');
    if(!text.trim()) { setParsed(null); return; }
    try {
      const result = parseCSV(text);
      if(result.rows.length === 0) { setError('No data rows found'); setParsed(null); return; }
      setParsed(result);
    } catch(e) { setError('Could not parse CSV'); setParsed(null); }
  };
  const placeholders = {
    athletes: { text:'Name,Grad Year,Gender\nJane Smith,2026,F\nJohn Doe,2027,M', help:'Columns: Name (required), Grad Year, Gender (M/F). Groups assigned manually after import.' },
    meets: { text:'Name,Date,Location,Type\nConference Champs,2026-04-15,Lincoln HS,League', help:'Columns: Name, Date, Location, Type, Category.' },
    results: { text:'Athlete,Event,Result,Place\nJane Smith,400m (G),1:02.50,2', help:'Columns: Athlete (must match roster), Event, Result, Place.' },
    workouts: { text:'Category,Workout,Mileage\nMain,4x800,2.0\nWarm-Up,2 laps,0.5', help:'Columns: Category, Workout (name), Mileage.' },
  };
  const ph = placeholders[type] || placeholders.athletes;
  return (
    <Modal open={open} onClose={()=>{onClose();setRawText('');setParsed(null);setError('');}} width={600}>
      <h2 style={S.h2}>Import {type}</h2>
      <p style={{ color:C.textSecondary, fontSize:12, marginTop:4, marginBottom:12 }}>{ph.help}</p>
      {error && <div style={{ color:C.danger, fontSize:12, marginBottom:8 }}>{error}</div>}
      <textarea style={{...S.input, height:120, fontFamily:'monospace', fontSize:12, resize:'vertical'}} placeholder={ph.text} value={rawText} onChange={e=>handleParse(e.target.value)} />
      {parsed && (
        <div style={{ marginTop:12 }}>
          <p style={{ fontSize:12, color:C.success, marginBottom:6 }}>{parsed.rows.length} rows found</p>
          <div style={{ maxHeight:200, overflowY:'auto', border:`1px solid ${C.border}`, borderRadius:6 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>{parsed.headers.map(h=><th key={h} style={{...S.th, fontSize:10, padding:'6px 8px'}}>{h}</th>)}</tr></thead>
              <tbody>{parsed.rows.slice(0,5).map((row,i)=>(<tr key={i}>{parsed.headers.map(h=><td key={h} style={{...S.td, fontSize:12, padding:'4px 8px'}}>{row[h]}</td>)}</tr>))}</tbody>
            </table>
            {parsed.rows.length > 5 && <p style={{ textAlign:'center', fontSize:11, color:C.textMuted, padding:6 }}>...and {parsed.rows.length-5} more</p>}
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
            <button style={{...S.btn,...S.btnSecondary}} onClick={()=>{onClose();setRawText('');setParsed(null);}}>Cancel</button>
            <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{onImport(parsed.rows);onClose();setRawText('');setParsed(null);}}>Import {parsed.rows.length} rows</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
function AuthScreen({ authHook }) {
  const { signIn, signUp, signInGoogle } = authHook;
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const handleSubmit = async () => {
    setError(''); setBusy(true);
    try {
      if(mode==='signup') await signUp(email,password,name);
      else await signIn(email,password);
    } catch(e) { setError((e.message||'').replace('Firebase: ','').replace(/\(auth\/.*\)/,'')||'Something went wrong'); }
    setBusy(false);
  };
  return (
    <div style={{...S.app, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh'}}>
      <div style={{ width:380, padding:32 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:28, fontWeight:700, color:C.accent, textTransform:'uppercase', letterSpacing:'0.04em', fontFamily:HEADING_FONT }}>TrackTeam</div>
          <div style={{ fontSize:14, color:C.textMuted, marginTop:4 }}>Hub</div>
        </div>
        <div style={{...S.card, padding:24}}>
          <h2 style={{...S.h2, textAlign:'center', marginBottom:16}}>{mode==='login'?'Sign In':'Create Account'}</h2>
          {error && <div style={{ background:C.dangerMuted, color:C.danger, padding:'8px 12px', borderRadius:6, fontSize:12, marginBottom:12 }}>{error}</div>}
          {mode==='signup' && <div style={{marginBottom:12}}><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Your Name</label><input style={S.input} value={name} onChange={e=>setName(e.target.value)} placeholder="Coach name" /></div>}
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Email</label><input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@school.edu" /></div>
          <div style={{marginBottom:16}}><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Password</label><input style={S.input} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==='signup'?'6+ characters':'Password'} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} /></div>
          <button style={{...S.btn,...S.btnPrimary, width:'100%', padding:'12px 16px', fontSize:14}} disabled={busy} onClick={handleSubmit}>{busy?'...':mode==='login'?'Sign In':'Create Account'}</button>
          {HAS_FIREBASE && <>
            <div style={{textAlign:'center',color:C.textMuted,fontSize:12,margin:'16px 0'}}>or</div>
            <button style={{...S.btn,...S.btnSecondary, width:'100%', padding:'10px 16px', fontSize:13}} onClick={async()=>{setError('');setBusy(true);try{await signInGoogle();}catch(e){setError(e.message||'Google sign-in failed');}setBusy(false);}} disabled={busy}>Sign in with Google</button>
          </>}
          <div style={{textAlign:'center',marginTop:16}}>
            <button style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:13,fontWeight:600}} onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');}}>
              {mode==='login'?"Don't have an account? Sign Up":'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function TeamSetupScreen({ user, teamHook }) {
  const { createTeam, joinTeam } = teamHook;
  const [mode, setMode] = useState('choose');
  const [teamName, setTeamName] = useState('');
  const [school, setSchool] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const handleCreate = async () => {
    if(!teamName.trim()) return;
    setError(''); setBusy(true);
    try { await createTeam(teamName.trim(),school.trim(),user.uid,user.email,user.displayName||user.email); }
    catch(e) { setError(e.message||'Failed to create team'); }
    setBusy(false);
  };
  const handleJoin = async () => {
    if(!joinCode.trim()) return;
    setError(''); setBusy(true);
    try { await joinTeam(joinCode.trim(),user.uid,user.email,user.displayName||user.email); }
    catch(e) { setError(e.message||'Failed to join team'); }
    setBusy(false);
  };
  return (
    <div style={{...S.app, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh'}}>
      <div style={{ width:400, padding:32 }}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:22,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'0.04em',fontFamily:HEADING_FONT}}>Welcome</div>
          <div style={{fontSize:13,color:C.textMuted,marginTop:4}}>{user.email}</div>
        </div>
        {mode==='choose' && (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <button style={{...S.bigBtn,background:C.accentMuted,borderColor:C.accent}} onClick={()=>setMode('create')}>
              <div style={{fontSize:16,fontWeight:700,color:C.accent}}>Create a Team</div>
              <div style={{fontSize:12,color:C.textSecondary,fontWeight:400,marginTop:4,textTransform:'none'}}>{"Start fresh. You'll get a join code to share with co-coaches."}</div>
            </button>
            <button style={{...S.bigBtn,background:C.blueMuted,borderColor:C.blue}} onClick={()=>setMode('join')}>
              <div style={{fontSize:16,fontWeight:700,color:C.blue}}>Join a Team</div>
              <div style={{fontSize:12,color:C.textSecondary,fontWeight:400,marginTop:4,textTransform:'none'}}>Enter a code from your head coach.</div>
            </button>
          </div>
        )}
        {mode==='create' && (
          <div style={{...S.card,padding:24}}>
            <h2 style={{...S.h2,marginBottom:16}}>Create a Team</h2>
            {error && <div style={{background:C.dangerMuted,color:C.danger,padding:'8px 12px',borderRadius:6,fontSize:12,marginBottom:12}}>{error}</div>}
            <div style={{marginBottom:12}}><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Team Name</label><input style={S.input} value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="e.g. TAE Track & Field" /></div>
            <div style={{marginBottom:16}}><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>School</label><input style={S.input} value={school} onChange={e=>setSchool(e.target.value)} placeholder="e.g. The Academy of Excellence" /></div>
            <div style={{display:'flex',gap:8}}>
              <button style={{...S.btn,...S.btnSecondary}} onClick={()=>{setMode('choose');setError('');}}>Back</button>
              <button style={{...S.btn,...S.btnPrimary,flex:1}} disabled={busy} onClick={handleCreate}>{busy?'Creating...':'Create Team'}</button>
            </div>
          </div>
        )}
        {mode==='join' && (
          <div style={{...S.card,padding:24}}>
            <h2 style={{...S.h2,marginBottom:16}}>Join a Team</h2>
            {error && <div style={{background:C.dangerMuted,color:C.danger,padding:'8px 12px',borderRadius:6,fontSize:12,marginBottom:12}}>{error}</div>}
            <div style={{marginBottom:16}}><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Join Code</label><input style={{...S.input,fontSize:18,textAlign:'center',letterSpacing:'0.1em',fontWeight:600}} value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="TF-XXXXX" onKeyDown={e=>e.key==='Enter'&&handleJoin()} /></div>
            <div style={{display:'flex',gap:8}}>
              <button style={{...S.btn,...S.btnSecondary}} onClick={()=>{setMode('choose');setError('');}}>Back</button>
              <button style={{...S.btn,...S.btnPrimary,flex:1}} disabled={busy} onClick={handleJoin}>{busy?'Joining...':'Join Team'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function App() {
  const authHook = useAuth();
  const { user, loading: authLoading } = authHook;
  const teamHook = useTeam((user||{}).uid);
  const { team, teamLoading } = teamHook;
  const { data, save, loading: dataLoading, syncStatus } = useStore((team||{}).id);
  const [page, setPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth > 900);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  useEffect(() => {
    if((team||{}).colors) {
      C = makeColors(team.colors.primary, team.colors.secondary);
      S = makeStyles(C);
      forceUpdate(n=>n+1);
    }
  }, [((team||{}).colors||{}).primary, ((team||{}).colors||{}).secondary]);
  if(authLoading) return <div style={{...S.app,display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><div style={{fontSize:16,color:C.textSecondary}}>Loading...</div></div>;
  if(HAS_FIREBASE && !user) return <AuthScreen authHook={authHook} />;
  if(HAS_FIREBASE && !teamLoading && !team) return <TeamSetupScreen user={user} teamHook={teamHook} />;
  if(teamLoading || dataLoading || !data) return <div style={{...S.app,display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><div style={{fontSize:16,color:C.textSecondary}}>Loading team data...</div></div>;
  const nav = (pg, params={}) => { setPage(pg); setPageParams(params); setSidebarOpen(false); };
  const season = getActiveSeason(data);
  const today = new Date().toISOString().split('T')[0];
  const events = data.events || [];
  const getEventById = (id) => events.find(e => e.id === id);
  const getAthletePR = (athleteId, eventId) => {
    const evt = getEventById(eventId);
    const isRelayEvt = isRelay(evt);
    const results = isRelayEvt
      ? data.results.filter(r => r.eventId === eventId && r.isRelay && (!athleteId || (r.relayAthletes||[]).includes(athleteId)))
      : data.results.filter(r => r.athleteId === athleteId && r.eventId === eventId && !r.isRelaySplit);
    if(!results.length) return null;
    if(isFieldEvent(evt)) {
      return results.reduce((best,r) => (!best || fieldToInches(r.ft||0,r.inch||0,r.qtr||0) > fieldToInches(best.ft||0,best.inch||0,best.qtr||0)) ? r : best, null);
    }
    return results.reduce((best,r) => (!best || r.timeMs < best.timeMs) ? r : best, null);
  };
  const checkRecord = (eventId, valueMs, valueTotalInches) => {
    const evt = getEventById(eventId);
    if(!evt) return { record:null, status:null, diff:null };
    const records = evt.schoolRecords || [];
    if(!records.length) return { record:null, status:null, diff:null };
    const rec = records[0]; // Check against first (primary) record
    if(isFieldEvent(evt)) {
      if(valueTotalInches == null) return { record:rec, status:null, diff:null };
      const recInches = fieldToInches(rec.ft||0, rec.inch||0, rec.qtr||0);
      if(recInches <= 0) return { record:rec, status:null, diff:null };
      const diff = valueTotalInches - recInches;
      if(diff > 0) return { record:rec, status:'broken', diff };
      if(Math.abs(diff/recInches) <= CLOSE_THRESHOLD) return { record:rec, status:'close', diff };
      return { record:rec, status:null, diff };
    } else {
      if(valueMs == null) return { record:rec, status:null, diff:null };
      const recMs = rec.timeMs || 0;
      if(recMs <= 0) return { record:rec, status:null, diff:null };
      const diff = valueMs - recMs;
      if(diff < 0) return { record:rec, status:'broken', diff };
      if(Math.abs(diff/recMs) <= CLOSE_THRESHOLD) return { record:rec, status:'close', diff };
      return { record:rec, status:null, diff };
    }
  };
  const checkQualifying = (eventId, meetId, valueMs, valueTotalInches) => {
    const evt = getEventById(eventId);
    if(!evt) return { status:null, standard:null };
    const meet = data.meets.find(m=>m.id===meetId);
    const meetType = (data.meetTypes||[]).find(mt=>mt.id===(meet||{}).meetTypeId);
    if(!(meetType||{}).qualifying) return { status:null, standard:null };
    const stds = evt.qualifyingStandards || [];
    if(!stds.length) return { status:null, standard:null };
    for(const std of stds) {
      if(isFieldEvent(evt)) {
        if(valueTotalInches == null) continue;
        const stdInches = fieldToInches(std.ft||0, std.inch||0, std.qtr||0);
        if(stdInches && valueTotalInches >= stdInches) return { status:(std.name||'').toLowerCase().includes('auto') ? 'automatic' : 'provisional', standard:std };
      } else {
        if(valueMs == null) continue;
        if(std.timeMs && valueMs <= std.timeMs) return { status:(std.name||'').toLowerCase().includes('auto') ? 'automatic' : 'provisional', standard:std };
      }
    }
    return { status:null, standard:stds[0] };
  };
  const addResult = (result) => { save({ ...data, results: [...data.results, result] }); };
  const addResults = (results) => { save({ ...data, results: [...data.results, ...results] }); };
  const updateResult = (id, updates) => { save({ ...data, results: data.results.map(r => r.id === id ? {...r,...updates} : r) }); };
  const activeAthletes = data.athletes.filter(a => a.active !== false);
  const currentMeet = data.meets.find(m => today >= (m.startDate||m.date) && today <= (m.endDate||m.startDate||m.date));
  const upcomingMeets = data.meets.filter(m => (m.startDate||m.date) > today).sort((a,b) => (a.startDate||a.date).localeCompare(b.startDate||b.date));
  const featuredMeet = currentMeet || upcomingMeets[0];
  const hasPractice = (date) => {
    return (data.workoutPlans||[]).some(w => {
      const entries = (w.entries||[]).filter(e => e.day === ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(date+'T12:00:00').getDay()]);
      return entries.length > 0;
    });
  };
  const pages = {
    dashboard: () => <Dashboard data={data} save={save} nav={nav} season={season} team={team} events={events} activeAthletes={activeAthletes} featuredMeet={featuredMeet} currentMeet={currentMeet} getAthletePR={getAthletePR} checkQualifying={checkQualifying} />,
    attendance: () => <AttendancePage data={data} save={save} nav={nav} season={season} activeAthletes={activeAthletes} />,
    dailyAttendance: () => <DailyAttendancePage data={data} save={save} nav={nav} activeAthletes={activeAthletes} />,
    practicePlans: () => <PracticePlansPage data={data} save={save} nav={nav} season={season} initialWeekId={pageParams.weekId} />,
    dailyPractice: () => <DailyPracticeView data={data} nav={nav} date={pageParams.date} />,
    meets: () => <MeetsPage data={data} save={save} nav={nav} events={events} />,
    seasonResults: () => <SeasonResultsPage data={data} save={save} nav={nav} events={events} getAthletePR={getAthletePR} season={season} team={team} />,
    meetSub: () => <MeetSubPage data={data} save={save} nav={nav} meetId={pageParams.meetId} events={events} getAthletePR={getAthletePR} checkQualifying={checkQualifying} team={team} />,
    athletes: () => <AthletesPage data={data} save={save} nav={nav} />,
    athleteSub: () => <AthleteSubPage data={data} save={save} nav={nav} athleteId={pageParams.athleteId} athFilter={pageParams.athFilter} events={events} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} season={season} team={team} />,
    eventsPage: () => <EventsPage data={data} save={save} nav={nav} />,
    tools: () => <ToolsPage data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} preset={pageParams} />,
    raceTimer: () => <RaceTimer data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} preset={pageParams} />,
    multiSplit: () => <MultiSplitTimer data={data} save={save} nav={nav} events={events} addResult={addResult} addResults={addResults} getAthletePR={getAthletePR} checkRecord={checkRecord} preset={pageParams} />,
    relayTimer: () => <RelayTimer data={data} save={save} nav={nav} events={events} addResult={addResult} addResults={addResults} getAthletePR={getAthletePR} preset={pageParams} />,
    fieldEvent: () => <FieldEventPage data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} preset={pageParams} />,
    settings: () => <SettingsPage data={data} save={save} team={team} updateTeam={teamHook.updateTeam} user={user} signOut={authHook.signOut} nav={nav} />,
  };
  const menuItems = [
    { key:'dashboard', label:'Dashboard', icon:'🏠' },
    { key:'attendance', label:'Attendance', icon:'📋' },
    { key:'practicePlans', label:'Practice Plans', icon:'📅' },
    { key:'meets', label:'Meets', icon:'🏆' },
    { key:'seasonResults', label:'Results', icon:'📊' },
    { key:'athletes', label:'Athletes', icon:'🏃' },
    { key:'eventsPage', label:'Events', icon:'🎯' },
    { key:'tools', label:'Tools', icon:'⏱️' },
  ];
  const pageLabel = (menuItems.find(m=>m.key===page)||{}).label || (page==='settings'?'Settings':'TrackTeam');
  const teamDisplayName = (team||{}).name || 'TrackTeam';
  const teamSchool = (team||{}).school || 'Hub';
  return (
    <div style={S.app}>
      {!isDesktop && <div style={S.sidebarOverlay(sidebarOpen)} onClick={()=>setSidebarOpen(false)} />}
      <div style={isDesktop ? S.sidebarFixed : S.sidebar(sidebarOpen)}>
        <div style={{ padding:'0 20px 20px', borderBottom:`1px solid ${C.border}`, marginBottom:8 }}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            {(team||{}).logo && <img src={team.logo} style={{width:32,height:32,borderRadius:6,objectFit:'contain'}} />}
            <div>
              <div style={{fontSize:15,fontWeight:700,color:C.text,textTransform:'uppercase',letterSpacing:'0.04em',fontFamily:HEADING_FONT}}>{teamDisplayName}</div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
                <span style={{fontSize:11,color:C.textMuted}}>{teamSchool}</span>
                <span style={{width:8,height:8,borderRadius:'50%',background:syncStatus==='error'?C.danger:syncStatus==='saving'?'#b8860b':syncStatus==='saved'?C.success:C.border,transition:'background 0.3s',flexShrink:0}} title={syncStatus==='error'?'Save failed — changes not synced':syncStatus==='saving'?'Saving...':syncStatus==='saved'?'Saved':'Ready'} />
                {syncStatus==='error'&&<span style={{fontSize:9,color:C.danger,fontWeight:700}}>NOT SAVED</span>}
                {syncStatus==='saving'&&<span style={{fontSize:9,color:'#b8860b',fontWeight:600}}>Saving...</span>}
              </div>
            </div>
          </div>
        </div>
        {menuItems.map(item => (
          <button key={item.key} style={S.sidebarItem(page===item.key)} onClick={()=>{nav(item.key);if(!isDesktop)setSidebarOpen(false);}}>
            <span style={{fontSize:15,width:20,textAlign:'center',opacity:0.7}}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div style={{borderTop:`1px solid ${C.border}`,marginTop:8,paddingTop:8}}>
          <button style={S.sidebarItem(page==='settings')} onClick={()=>{nav('settings');if(!isDesktop)setSidebarOpen(false);}}>
            <span style={{fontSize:15,width:20,textAlign:'center',opacity:0.7}}>⚙️</span>
            Settings
          </button>
        </div>
      </div>
      <div style={isDesktop ? {...S.container,...S.containerDesktop} : S.container}>
        {!isDesktop && <div style={S.topBar}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button style={S.hamburger} onClick={()=>setSidebarOpen(true)}>
              <span style={{width:20,height:2,background:C.text,borderRadius:1,display:'block'}} />
              <span style={{width:20,height:2,background:C.text,borderRadius:1,display:'block'}} />
              <span style={{width:14,height:2,background:C.text,borderRadius:1,display:'block'}} />
            </button>
            <span style={{fontSize:13,fontWeight:600,color:C.text,textTransform:'uppercase',letterSpacing:'0.04em',fontFamily:HEADING_FONT}}>{pageLabel}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:syncStatus==='error'?C.danger:syncStatus==='saving'?'#b8860b':syncStatus==='saved'?C.success:C.border,transition:'background 0.3s'}} />
            {syncStatus==='error'&&<span style={{fontSize:9,color:C.danger,fontWeight:700}}>!</span>}
            {season && <span style={{fontSize:10,color:C.accent,fontWeight:600,background:C.accentMuted,padding:'2px 8px',borderRadius:10}}>{season.name}</span>}
            {(team||{}).logo && <img src={team.logo} style={{width:24,height:24,borderRadius:4,objectFit:'contain'}} />}
          </div>
        </div>}
        {isDesktop && <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <h1 style={{...S.h1,fontSize:20,marginBottom:0}}>{pageLabel}</h1>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {season && <span style={{fontSize:11,color:C.accent,fontWeight:600,background:C.accentMuted,padding:'3px 10px',borderRadius:10}}>{season.name}</span>}
          </div>
        </div>}
        {(pages[page] || pages.dashboard)()}
      </div>
    </div>
  );
}
function Dashboard({ data, save, nav, season, team, events, activeAthletes, featuredMeet, currentMeet, getAthletePR, checkQualifying }) {
  const [followUpsExpanded, setFollowUpsExpanded] = useState(true);
  const today = new Date().toISOString().split('T')[0];
  const todayObj = new Date(today+'T12:00:00');
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const isMeetDay = data.meets.some(m => { const sd=padDate(m.startDate||m.date); const ed=padDate(m.endDate||m.startDate||m.date); return today>=sd&&today<=ed; });
  const isPracticeDay = (data.workoutPlans||[]).some(w => {
    const ws = padDate(w.startDate);
    if(!ws) return false;
    const wStart = new Date(ws+'T12:00:00');
    const wEnd = new Date(wStart); wEnd.setDate(wStart.getDate()+5);
    const weStr = `${wEnd.getFullYear()}-${String(wEnd.getMonth()+1).padStart(2,'0')}-${String(wEnd.getDate()).padStart(2,'0')}`;
    if(today < ws || today > weStr) return false;
    const dayName = dayNames[todayObj.getDay()];
    return (w.entries||[]).some(e => e.day === dayName);
  });
  const dayType = isMeetDay ? 'Meet' : isPracticeDay ? 'Practice' : 'Free';
  const dayTypeColors = { Meet:C.danger, Practice:C.accent, Free:C.textMuted };
  const getWeekDates = () => {
    const d = new Date(todayObj);
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return Array.from({length:6}, (_,i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };
  const weekDates = getWeekDates();
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      
      <div style={{...S.card, padding:'12px 14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{...S.h1, marginBottom:0,fontSize:18}}>{(team||{}).name || 'TrackTeam'}</h1>
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginTop:2}}>
              <span style={{fontSize:11,color:C.textSecondary}}>{new Date(today+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</span>
              {season && <span style={{fontSize:10,color:C.accent,fontWeight:600}}>- {season.name}</span>}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
            <span style={{fontSize:10,fontWeight:700,color:dayTypeColors[dayType],textTransform:'uppercase',letterSpacing:'0.03em',padding:'2px 8px',borderRadius:12,background:dayType==='Meet'?C.dangerMuted:dayType==='Practice'?C.accentMuted:C.surface2}}>
              {dayType}
            </span>
            <div style={{position:'relative'}}>
              <button style={{...S.btn,...S.btnPrimary,fontSize:14,padding:'2px 10px',lineHeight:'18px'}} onClick={()=>setShowAdd(!showAdd)}>+</button>
            {showAdd && (
              <div style={{position:'absolute',right:0,top:'100%',marginTop:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:100,minWidth:160}}>
                {[{label:'Meet',action:()=>nav('meets')},{label:'Practice',action:()=>nav('practicePlans')},{label:'Attendance',action:()=>nav('attendance')},{label:'Athlete',action:()=>nav('athletes')}].map(item => (
                  <button key={item.label} style={{display:'block',width:'100%',padding:'10px 16px',border:'none',background:'none',textAlign:'left',fontSize:13,color:C.text,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onClick={()=>{item.action();setShowAdd(false);}}>{item.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {(()=>{
        const todayRecords = (data.attendance||[]).filter(r=>r.date===today);
        const taken = todayRecords.length > 0;
        const counts = {};
        ATTENDANCE_STATUSES.forEach(s=>{ counts[s.key] = todayRecords.filter(r=>r.status===s.key).length; });
        return (
          <div style={{...S.card,padding:'10px 14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:taken?6:0}}>
              <h2 style={{...S.h2,margin:0,fontSize:14}}>Attendance</h2>
              <div style={{display:'flex',gap:4}}>
                <button style={{...S.btn,fontSize:10,padding:'4px 10px',borderRadius:6,...(taken?{background:C.successMuted,color:C.success,border:`1px solid ${C.success}`}:S.btnPrimary)}} onClick={()=>nav('dailyAttendance')}>
                  {taken?'✓ Taken':'Take Attendance'}
                </button>
                <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 8px'}} onClick={()=>nav('attendance')}>View Week</button>
              </div>
            </div>
            {taken && (
              <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                {ATTENDANCE_STATUSES.map(s=>counts[s.key]>0&&(
                  <div key={s.key} style={{display:'flex',alignItems:'center',gap:4}}>
                    <span style={{fontSize:14,fontWeight:700,color:s.color}}>{counts[s.key]}</span>
                    <span style={{fontSize:12,color:C.textSecondary}}>{s.label}</span>
                  </div>
                ))}
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:14,fontWeight:700,color:C.textMuted}}>{activeAthletes.length - todayRecords.length}</span>
                  <span style={{fontSize:12,color:C.textSecondary}}>Unmarked</span>
                </div>
              </div>
            )}
            {!taken && activeAthletes.length>0 && <div style={{fontSize:12,color:C.textMuted,marginTop:4}}>No attendance recorded today.</div>}
          </div>
        );
      })()}
      
      {(()=>{
        const followUps = (data.medicalNotes||[]).filter(n=>n.needFollowUp&&!n.followUpResolution);
        const today2 = new Date().toISOString().split('T')[0];
        const upcomingAbsences = (data.medicalNotes||[]).filter(n=>n.type==='Planned Absence'&&n.absenceEnd&&n.absenceEnd>=today2);
        if(followUps.length===0) return null;
        return (
          <div style={{...S.card, padding:'12px 14px', borderLeft:`4px solid ${C.danger}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom:followUpsExpanded?8:0}} onClick={()=>setFollowUpsExpanded(!followUpsExpanded)}>
              <h2 style={{...S.h2,marginBottom:0,fontSize:14,color:C.danger}}>Follow-Ups Needed <span style={{fontSize:12,fontWeight:700,color:C.danger,marginLeft:4}}>{followUps.length}</span></h2>
              <span style={{fontSize:12,color:C.danger,fontWeight:600}}>{followUpsExpanded?'▲':'▼'}</span>
            </div>
            {followUpsExpanded && followUps.sort((a,b)=>(b.entryDate||'').localeCompare(a.entryDate||'')).map(n=>{
              const ath = data.athletes.find(a=>a.id===n.athleteId);
              if(!ath) return null;
              const typeColor = n.type==='Injury'?C.danger:n.type==='Illness'?'#b8860b':C.blue;
              return (
                <div key={n.id} style={{padding:'8px 0',borderBottom:`1px solid ${C.borderLight}`,cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:n.athleteId})}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                        <span style={{fontSize:13,fontWeight:600,color:C.text}}>{athDisplay(ath)}</span>
                        <span style={{fontSize:10,fontWeight:600,color:typeColor,background:typeColor+'18',padding:'1px 6px',borderRadius:4}}>{n.type}</span>
                      </div>
                      <div style={{fontSize:12,color:C.textSecondary}}>{n.details}</div>
                      {n.followUpName && <div style={{fontSize:11,color:C.accent,marginTop:2}}>Contact: {n.followUpName}{n.followUpContact?` (${n.followUpContact})`:''}</div>}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',flexShrink:0,marginLeft:8,gap:4}}>
                      <div style={{fontSize:11,color:C.textMuted}}>{n.effectiveDate||n.entryDate}</div>
                      <button style={{fontSize:10,fontWeight:600,color:C.success,background:C.successMuted||'#e6f4ea',border:'none',borderRadius:4,padding:'3px 8px',cursor:'pointer'}} onClick={e=>{e.stopPropagation();save({...data,medicalNotes:(data.medicalNotes||[]).map(mn=>mn.id===n.id?{...mn,followUpResolution:new Date().toISOString().split('T')[0]}:mn)});}}>Resolve</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
      
      {(()=>{
        const qualEvents = events.filter(e=>(e.qualifyingStandards||[]).length>0);
        if(!qualEvents.length) return null;
        const NMP = data.nearMissPct||90;
        const qualifiedAthletes = new Set();
        const closeAthletes = new Set();
        let totalQualPerfs=0, totalClosePerfs=0;
        qualEvents.forEach(evt=>{
          const stds = evt.qualifyingStandards||[];
          const isField = isFieldEvent(evt);
          const matchingAthletes = activeAthletes.filter(a=>evt.gender==='Mixed'||(a.gender==='M'&&evt.gender==='Boy')||(a.gender==='F'&&evt.gender==='Girl'));
          const athPRs = matchingAthletes.map(a=>({a,pr:getAthletePR(a.id,evt.id)})).filter(x=>x.pr);
          stds.forEach(std=>{
            const minQ = Math.max(parseInt(std.minQualifiers)||1, getStdMinQualifiers(data, std.name));
            const metIds=[], closeIds=[];
            athPRs.forEach(({a,pr})=>{
              let met=false, pct=0;
              if(isField){
                const prIn=fieldToInches(pr.ft||0,pr.inch||0,pr.qtr||0);
                const stdIn=fieldToInches(std.ft||0,std.inch||0,std.qtr||0);
                if(stdIn>0){met=prIn>=stdIn;pct=Math.round(prIn/stdIn*100);}
              } else {
                const prMs=pr.timeMs||0;
                const stdMs=std.timeMs||0;
                if(stdMs>0){met=prMs<=stdMs;pct=Math.round(stdMs/(prMs||1)*100);}
              }
              if(met) metIds.push(a.id);
              else if(pct>=NMP) closeIds.push(a.id);
            });
            if(metIds.length>=minQ){metIds.forEach(id=>qualifiedAthletes.add(id));totalQualPerfs+=metIds.length;}
            else closeIds.push(...metIds);
            closeIds.forEach(id=>closeAthletes.add(id));
            totalClosePerfs+=closeIds.length;
          });
        });
        closeAthletes.forEach(id=>{if(qualifiedAthletes.has(id))closeAthletes.delete(id);});
        if(!qualifiedAthletes.size && !closeAthletes.size) return null;
        return (
          <div style={{...S.card,padding:'12px 14px',cursor:'pointer'}} onClick={()=>nav('seasonResults')}>
            <h2 style={{...S.h2,marginBottom:8,fontSize:14}}>Qualifying Progress</h2>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:700,color:C.success}}>{qualifiedAthletes.size}</div><div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase'}}>Athletes Qualified</div><div style={{fontSize:10,color:C.success,fontWeight:600}}>{totalQualPerfs} mark{totalQualPerfs!==1?'s':''}</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:22,fontWeight:700,color:'#b8860b'}}>{closeAthletes.size}</div><div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase'}}>Athletes Close</div><div style={{fontSize:10,color:'#b8860b',fontWeight:600}}>{totalClosePerfs} mark{totalClosePerfs!==1?'s':''} ({data.nearMissPct||90}%+)</div></div>
            </div>
          </div>
        );
      })()}
      
      <div style={{...S.card,padding:'10px 14px'}}>
        <h2 style={{...S.h2,marginBottom:4,fontSize:14}}>This Week</h2>
        {weekDates.map(date => {
          const d = new Date(date+'T12:00:00');
          const dayName = dayNames[d.getDay()];
          const isToday = date === today;
          const meetOnDay = data.meets.find(m => { const sd=padDate(m.startDate||m.date); const ed=padDate(m.endDate||m.startDate||m.date); return date>=sd&&date<=ed; });
          const practiceEntries = (data.workoutPlans||[]).flatMap(w => {
            const ws = padDate(w.startDate);
            if(!ws) return [];
            const wStart = new Date(ws+'T12:00:00');
            const wEnd = new Date(wStart); wEnd.setDate(wStart.getDate()+5);
            const weStr = `${wEnd.getFullYear()}-${String(wEnd.getMonth()+1).padStart(2,'0')}-${String(wEnd.getDate()).padStart(2,'0')}`;
            if(date < ws || date > weStr) return [];
            return (w.entries||[]).filter(e => e.day === dayName);
          });
          const isRest = (data.workoutPlans||[]).some(w => {
            const ws = padDate(w.startDate);
            if(!ws) return false;
            const wStart = new Date(ws+'T12:00:00');
            const wEnd = new Date(wStart); wEnd.setDate(wStart.getDate()+5);
            const weStr = `${wEnd.getFullYear()}-${String(wEnd.getMonth()+1).padStart(2,'0')}-${String(wEnd.getDate()).padStart(2,'0')}`;
            if(date < ws || date > weStr) return false;
            return (w.restDays||[]).some(rd => rd.day === dayName);
          });
          let label = 'Free';
          let labelColor = C.textMuted;
          let clickTarget = null;
          if(meetOnDay) { label = meetOnDay.name; labelColor = C.danger; clickTarget = ()=>nav('meetSub',{meetId:meetOnDay.id}); }
          else if(practiceEntries.length > 0) { label = 'Practice'; labelColor = C.accent; clickTarget = ()=>nav('dailyPractice',{date}); }
          else if(isRest) { label = 'Rest'; labelColor = C.textMuted; }
          return (
            <div key={date} onClick={clickTarget||undefined} style={{display:'flex',alignItems:'center',gap:10,padding:'5px 10px',borderRadius:6,marginBottom:1,background:isToday ? C.accentMuted : 'transparent',cursor:clickTarget?'pointer':'default',border:isToday?`1px solid ${C.accent}33`:'1px solid transparent'}}>
              <div style={{width:44,flexShrink:0}}>
                <div style={{fontSize:10,fontWeight:600,color:isToday?C.accent:C.textMuted,textTransform:'uppercase'}}>{dayName}</div>
                <div style={{fontSize:15,fontWeight:isToday?700:500,color:isToday?C.accent:C.text}}>{d.getDate()}</div>
              </div>
              <div style={{flex:1}}>
                <span style={{fontSize:13,fontWeight:500,color:labelColor}}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {events.length > 0 && data.results.length > 0 && (
        <div style={{...S.card}}>
          <h2 style={{...S.h2,marginBottom:8}}>Team Overview</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={{padding:12,borderRadius:6,background:C.bg}}>
              <div style={{fontSize:11,fontWeight:600,color:C.textMuted,textTransform:'uppercase',marginBottom:4}}>Total Results</div>
              <div style={{fontSize:24,fontWeight:700,color:C.text}}>{season ? data.results.filter(r=>isInSeason(r.date,season)).length : data.results.length}</div>
            </div>
            <div style={{padding:12,borderRadius:6,background:C.bg}}>
              <div style={{fontSize:11,fontWeight:600,color:C.textMuted,textTransform:'uppercase',marginBottom:4}}>Athletes Competed</div>
              <div style={{fontSize:24,fontWeight:700,color:C.text}}>
                {new Set((season ? data.results.filter(r=>isInSeason(r.date,season)) : data.results).map(r=>r.athleteId)).size}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {featuredMeet && (
        <div style={{...S.card, borderLeft:`4px solid ${currentMeet ? C.danger : C.accent}`, cursor:'pointer'}} onClick={()=>nav('meetSub',{meetId:featuredMeet.id})}>
          <div style={{fontSize:11,fontWeight:600,color:currentMeet?C.danger:C.accent,textTransform:'uppercase',letterSpacing:'0.04em'}}>
            {currentMeet ? "Today's Meet" : 'Next Meet'}
          </div>
          <div style={{fontSize:16,fontWeight:600,marginTop:2}}>{featuredMeet.name}</div>
          <div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{featuredMeet.startDate||featuredMeet.date}{featuredMeet.venue ? ` - ${featuredMeet.venue}` : ''}</div>
        </div>
      )}
    </div>
  );
}
function DailyAttendancePage({ data, save, nav, activeAthletes }) {
  const today = new Date().toISOString().split('T')[0];
  const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('lastName');
  const [sortDir, setSortDir] = useState('asc');
  const groups = data.workoutGroups || [];
  const getAbsence = (athleteId, date) => {
    return (data.medicalNotes||[]).find(n=>n.athleteId===athleteId && n.type==='Planned Absence' && n.effectiveDate && n.absenceEnd && date>=n.effectiveDate && date<=n.absenceEnd);
  };
  const getStatus = (athleteId) => {
    const att = (data.attendance||[]).find(r=>r.athleteId===athleteId && r.date===today);
    if((att||{}).status) return att.status;
    if(getAbsence(athleteId, today)) return 'excused';
    return null;
  };
  const setStatus = (athleteId, status) => {
    const existing = (data.attendance||[]).filter(r=>!(r.athleteId===athleteId && r.date===today));
    if(status) existing.push({id:uid(), athleteId, date:today, status});
    save({...data, attendance:existing});
  };
  const markAll = (status) => {
    const existing = [...(data.attendance||[])];
    activeAthletes.forEach(a => {
      const already = existing.find(r => r.athleteId===a.id && r.date===today);
      if(already) return;
      existing.push({id:uid(), athleteId:a.id, date:today, status});
    });
    save({...data, attendance:existing});
  };
  const clearAll = () => {
    save({...data, attendance:(data.attendance||[]).filter(r=>r.date!==today)});
  };
  const filtered = activeAthletes.filter(a => {
    if(search && !athSearch(a, search)) return false;
    if(genderFilter && a.gender !== genderFilter) return false;
    if(groupFilter && !(a.groups||[]).some(g=>g.groupId===groupFilter) && a.trainingGroup !== groupFilter) return false;
    if(statusFilter) {
      const s = getStatus(a.id);
      if(statusFilter === 'unmarked') { if(s) return false; }
      else if(s !== statusFilter) return false;
    }
    return true;
  }).sort((a,b) => {
    let av, bv;
    switch(sortBy) {
      case 'lastName': av=athLast(a).toLowerCase(); bv=athLast(b).toLowerCase(); break;
      case 'firstName': av=athPreferred(a).toLowerCase(); bv=athPreferred(b).toLowerCase(); break;
      case 'gradYear': av=a.gradYear||''; bv=b.gradYear||''; break;
      case 'group': av=(((a.groups||[])[0]||{}).groupId||a.trainingGroup||'zzz'); bv=(((b.groups||[])[0]||{}).groupId||b.trainingGroup||'zzz'); break;
      case 'status': {
        const order = {present:1,late:2,excused:3,signedout:4,absent:5};
        const sa = getStatus(a.id); const sb = getStatus(b.id);
        av = sa ? (order[sa]||6) : 7; bv = sb ? (order[sb]||6) : 7;
        break;
      }
      default: av=''; bv='';
    }
    if(av<bv) return sortDir==='asc'?-1:1;
    if(av>bv) return sortDir==='asc'?1:-1;
    return athLast(a).localeCompare(athLast(b));
  });
  const todayRecords = (data.attendance||[]).filter(r=>r.date===today);
  const counts = {};
  ATTENDANCE_STATUSES.forEach(s=>{ counts[s.key] = todayRecords.filter(r=>r.status===s.key).length; });
  const unmarked = activeAthletes.length - todayRecords.length;
  const toggleSort = (col) => { if(sortBy===col) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortBy(col); setSortDir('asc'); } };
  return (
    <div>
      <button style={S.backLink} onClick={()=>nav('dashboard')}>{"<- Dashboard"}</button>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
        <h1 style={S.h1}>{dayName} Attendance</h1>
      </div>
      <p style={{fontSize:13,color:C.textSecondary,marginBottom:16}}>{new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
      
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12,padding:'10px 16px',background:C.surface,borderRadius:8,border:`1px solid ${C.border}`}}>
        {ATTENDANCE_STATUSES.map(s=>(
          <div key={s.key} style={{display:'flex',alignItems:'center',gap:4,cursor:'pointer'}} onClick={()=>setStatusFilter(statusFilter===s.key?'':s.key)}>
            <span style={{fontSize:16,fontWeight:700,color:s.color}}>{counts[s.key]||0}</span>
            <span style={{fontSize:12,color:statusFilter===s.key?s.color:C.textSecondary,fontWeight:statusFilter===s.key?600:400,textDecoration:statusFilter===s.key?'underline':'none'}}>{s.label}</span>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',gap:4,cursor:'pointer'}} onClick={()=>setStatusFilter(statusFilter==='unmarked'?'':'unmarked')}>
          <span style={{fontSize:16,fontWeight:700,color:C.textMuted}}>{unmarked}</span>
          <span style={{fontSize:12,color:statusFilter==='unmarked'?C.text:C.textSecondary,fontWeight:statusFilter==='unmarked'?600:400,textDecoration:statusFilter==='unmarked'?'underline':'none'}}>Unmarked</span>
        </div>
      </div>
      
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <input style={{...S.input,maxWidth:180}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={S.select} value={genderFilter} onChange={e=>setGenderFilter(e.target.value)}>
          <option value="">All Genders</option><option value="M">Boys</option><option value="F">Girls</option>
        </select>
        {groups.length>0 && <select style={S.select} value={groupFilter} onChange={e=>setGroupFilter(e.target.value)}>
          <option value="">All Groups</option>
          {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
        </select>}
        <select style={S.select} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="lastName">Sort: Last Name</option>
          <option value="firstName">Sort: First Name</option>
          <option value="gradYear">Sort: Grad Year</option>
          <option value="group">Sort: Group</option>
          <option value="status">Sort: Status</option>
        </select>
        <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')}>{sortDir==='asc'?'A->Z':'Z->A'}</button>
        {(search||genderFilter||groupFilter||statusFilter)&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>{setSearch('');setGenderFilter('');setGroupFilter('');setStatusFilter('');}}>Clear</button>}
      </div>
      
      <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 14px'}} onClick={()=>markAll('present')} title="Mark only the unmarked athletes as present (preserves existing statuses)">Rest as Present</button>
        <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 14px'}} onClick={()=>markAll('absent')} title="Mark only the unmarked athletes as absent (preserves existing statuses)">Rest as Absent</button>
        <button style={{...S.btn,fontSize:11,padding:'6px 12px',background:'transparent',color:C.textMuted,border:`1px solid ${C.border}`}} onClick={()=>{if(window.confirm('Clear all attendance statuses for today? This cannot be undone.')) clearAll();}}>Clear All</button>
      </div>
      
      <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>{filtered.length} athlete{filtered.length!==1?'s':''}</div>
      {filtered.map(a => {
        const status = getStatus(a.id);
        const athName = athDisplay(a);
        const grpNames = (a.groups||[]).map(ag=>(groups.find(g=>g.id===ag.groupId)||{}).name).filter(Boolean).join(', ') || ((groups.find(g=>g.id===a.trainingGroup)||{}).name||'');
        return (
          <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:`1px solid ${C.borderLight}`}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:600,color:C.text}}>{athName}</div>
              <div style={{fontSize:11,color:C.textMuted}}>{[a.gradYear?`'${(a.gradYear+'').slice(-2)}`:'',grpNames].filter(Boolean).join(' - ')}</div>
              {(()=>{const ab=getAbsence(a.id,today);const hasManual=(data.attendance||[]).find(r=>r.athleteId===a.id&&r.date===today);return ab&&!hasManual?<div style={{fontSize:10,color:'#6b46c1',fontWeight:600,marginTop:2}}>Planned absence: {ab.details||'Away'}{ab.absenceEnd?' (until '+ab.absenceEnd+')':''}</div>:null;})()}
            </div>
            <div style={{display:'flex',gap:4}}>
              {ATTENDANCE_STATUSES.map(s=>{
                const active = status===s.key;
                return (
                  <button key={s.key} onClick={()=>setStatus(a.id, active?null:s.key)} title={s.label}
                    style={{padding:'10px 14px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',minWidth:44,textAlign:'center',border:`2px solid ${active?s.color:C.border}`,background:active?s.color:C.surface,color:active?'#fff':C.textMuted,transition:'all 0.15s'}}>
                    {s.icon}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {filtered.length===0 && <div style={{textAlign:'center',padding:24,color:C.textMuted}}>No athletes match your filters.</div>}
    </div>
  );
}
function AttendancePage({ data, save, nav, season, activeAthletes }) {
  const [attSortBy, setAttSortBy] = useState('lastName');
  const today = new Date().toISOString().split('T')[0];
  const todayObj = new Date(today+'T12:00:00');
  const [weekOffset, setWeekOffset] = useState(0);
  const getWeekDates = (offset) => {
    const d = new Date(todayObj);
    d.setDate(d.getDate() + offset * 7);
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return Array.from({length:6}, (_,i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };
  const weekDates = getWeekDates(weekOffset);
  const getStatus = (athleteId, date) => ((data.attendance||[]).find(r => r.athleteId===athleteId && r.date===date)||{}).status || null;
  const setStatus = (athleteId, date, status) => {
    const existing = (data.attendance||[]).filter(r => !(r.athleteId===athleteId && r.date===date));
    if(status) existing.push({ id:uid(), athleteId, date, status });
    save({...data, attendance:existing});
  };
  const seasonAttendance = (data.attendance||[]).filter(r => !season || isInSeason(r.date, season));
  const weekAttendance = (data.attendance||[]).filter(r => weekDates.includes(r.date));
  const calcPct = (records, status) => {
    if(!records.length) return 0;
    return Math.round(records.filter(r=>r.status===status).length / records.length * 100);
  };
  return (
    <div>
      <p style={S.h3}>{season ? `${season.name} season` : 'All time'}</p>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:16}}>
        {ATTENDANCE_STATUSES.map(s => (
          <div key={s.key} style={{...S.card,padding:'12px 16px',textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:600,color:s.color,textTransform:'uppercase',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:2}}>Week: {calcPct(weekAttendance,s.key)}%</div>
            <div style={{fontSize:10,color:C.textMuted}}>Season: {calcPct(seasonAttendance,s.key)}%</div>
          </div>
        ))}
      </div>
      
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8}}>
        <button style={{...S.btn,...S.btnSecondary,padding:'4px 12px'}} onClick={()=>setWeekOffset(w=>w-1)}>{"<- "}Prev</button>
        <span style={{fontSize:13,fontWeight:600,color:C.text}}>
          {new Date(weekDates[0]+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})} - {new Date(weekDates[5]+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}
        </span>
        <select style={{...S.select,fontSize:11,padding:'4px 8px'}} value={attSortBy} onChange={e=>setAttSortBy(e.target.value)}>
          <option value="lastName">Sort: Last Name</option>
          <option value="firstName">Sort: First Name</option>
          <option value="gradYear">Sort: Grad Year</option>
          <option value="gender">Sort: Gender</option>
        </select>
        <button style={{...S.btn,...S.btnSecondary,padding:'4px 12px'}} onClick={()=>setWeekOffset(w=>w+1)}>Next -></button>
      </div>
      
      <div style={{...S.card, overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
          <thead>
            <tr>
              <th style={{...S.th,position:'sticky',left:0,background:C.surface,zIndex:1}}>Athlete</th>
              {weekDates.map(d => (
                <th key={d} style={{...S.th,textAlign:'center',minWidth:60}}>
                  <div>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d+'T12:00:00').getDay()]}</div>
                  <div style={{fontSize:10}}>{new Date(d+'T12:00:00').getDate()}</div>
                </th>
              ))}
              <th style={{...S.th,textAlign:'center'}}>% Present</th>
            </tr>
          </thead>
          <tbody>
            {activeAthletes.slice().sort((a,b)=>{
              let av,bv;
              switch(attSortBy){
                case 'firstName': av=athPreferred(a).toLowerCase(); bv=athPreferred(b).toLowerCase(); break;
                case 'gradYear': av=a.gradYear||9999; bv=b.gradYear||9999; break;
                case 'gender': av=a.gender||''; bv=b.gender||''; break;
                default: av=athLast(a).toLowerCase(); bv=athLast(b).toLowerCase();
              }
              if(av<bv) return -1;
              if(av>bv) return 1;
              return athLast(a).localeCompare(athLast(b));
            }).map(a => {
              const weekStatuses = weekDates.map(d => getStatus(a.id,d));
              const attended = weekStatuses.filter(s => s === 'present' || s === 'late' || s === 'signedout').length;
              const total = weekStatuses.filter(s => s !== null).length;
              const pct = total > 0 ? Math.round(attended/total*100) : null;
              return (
                <tr key={a.id}>
                  <td style={{...S.td,position:'sticky',left:0,background:C.surface,zIndex:1,fontWeight:500,cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                    {athDisplay(a)}
                  </td>
                  {weekDates.map(d => {
                    const status = getStatus(a.id,d);
                    const statusObj = ATTENDANCE_STATUSES.find(s=>s.key===status);
                    return (
                      <td key={d} style={{...S.td,textAlign:'center',cursor:'pointer'}} onClick={()=>{
                        const next = ['present','absent','excused','late','signedout',null];
                        const idx = next.indexOf(status);
                        setStatus(a.id,d,next[(idx+1)%next.length]);
                      }}>
                        {statusObj ? <span style={{color:statusObj.color,fontWeight:600,fontSize:14}}>{statusObj.icon}</span> : <span style={{color:C.border}}>-</span>}
                      </td>
                    );
                  })}
                  <td style={{...S.td,textAlign:'center',fontWeight:600,color:pct!==null && pct<75 ? C.danger : pct!==null ? C.success : C.textMuted}}>
                    {pct !== null ? `${pct}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function MeetFormModal({ editId, initial, meetTypes, knownTags, eventOrderTemplates, onSave, onClose }) {
  const [f, setF] = useState({...initial});
  return (
    <Modal open={true} onClose={onClose} width={500}>
      <h2 style={S.h2}>{editId?'Edit Meet':'New Meet'}</h2>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
        <input style={S.input} placeholder="Meet name (e.g. Suffern Invitational)" value={f.name} onChange={e=>setF({...f,name:e.target.value})} />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Start Date</label><input style={S.input} type="text" placeholder="YYYY-MM-DD" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})} onFocus={e=>{try{e.target.type='date';}catch(ex){}}} onBlur={e=>{if(!e.target.value)e.target.type='text';}} /></div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>End Date (optional)</label><input style={S.input} type="text" placeholder="YYYY-MM-DD" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})} onFocus={e=>{try{e.target.type='date';}catch(ex){}}} onBlur={e=>{if(!e.target.value)e.target.type='text';}} /></div>
        </div>
        <input style={S.input} placeholder="Venue (e.g. Lincoln HS Track)" value={f.venue} onChange={e=>setF({...f,venue:e.target.value})} />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <input style={S.input} placeholder="City" value={f.city} onChange={e=>setF({...f,city:e.target.value})} />
          <input style={S.input} placeholder="State" value={f.state} onChange={e=>setF({...f,state:e.target.value})} />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Track Type</label>
            <select style={{...S.select,width:'100%'}} value={f.trackType} onChange={e=>setF({...f,trackType:e.target.value})}><option>Indoor</option><option>Outdoor</option></select>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Timing</label>
            <select style={{...S.select,width:'100%'}} value={f.timingSystem||'FAT'} onChange={e=>setF({...f,timingSystem:e.target.value})}><option value="FAT">FAT (Fully Automatic)</option><option value="Hand">Hand Timing</option></select>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Meet Type</label>
            <select style={{...S.select,width:'100%'}} value={f.meetTypeId} onChange={e=>setF({...f,meetTypeId:e.target.value})}>
              <option value="">Select type...</option>
              {meetTypes.map(mt=><option key={mt.id} value={mt.id}>{mt.name}{mt.qualifying?' (Q)':''}</option>)}
            </select>
          </div>
        </div>
        {(eventOrderTemplates||[]).length>0 && (
          <div><label style={{fontSize:12,color:C.textSecondary}}>Event Order</label>
            <select style={{...S.select,width:'100%'}} value={f.eventOrderTemplateId||''} onChange={e=>setF({...f,eventOrderTemplateId:e.target.value})}>
              <option value="">Use default template</option>
              {eventOrderTemplates.map(t=><option key={t.id} value={t.id}>{t.name}{t.isDefault?' (default)':''}</option>)}
            </select>
            <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>Seeds the running order for this meet. You can still tweak per-meet with the Reorder button.</div>
          </div>
        )}
        <div style={{padding:'10px 12px',background:C.bg,borderRadius:6,border:`1px solid ${C.borderLight}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:8}}>Entry Restrictions</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div>
              <label style={{fontSize:11,color:C.textMuted,display:'block',marginBottom:2}}>Max entries per event</label>
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                <input style={{...S.input,fontSize:13,padding:'6px 8px'}} type="text" inputMode="numeric" placeholder="Unlimited" value={f.maxEntriesPerEvent||''} onChange={e=>setF({...f,maxEntriesPerEvent:e.target.value?parseInt(e.target.value):''})} disabled={f.maxEntriesPerEventUnlimited!==false&&!f.maxEntriesPerEvent} />
                <label style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:C.textMuted,cursor:'pointer',whiteSpace:'nowrap'}}>
                  <input type="checkbox" checked={f.maxEntriesPerEventUnlimited!==false&&!f.maxEntriesPerEvent} onChange={e=>setF({...f,maxEntriesPerEvent:e.target.checked?'':f.maxEntriesPerEvent,maxEntriesPerEventUnlimited:e.target.checked})} />
                  Unlimited
                </label>
              </div>
            </div>
            <div>
              <label style={{fontSize:11,color:C.textMuted,display:'block',marginBottom:2}}>Max events per athlete</label>
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                <input style={{...S.input,fontSize:13,padding:'6px 8px'}} type="text" inputMode="numeric" placeholder="Unlimited" value={f.maxEventsPerAthlete||''} onChange={e=>setF({...f,maxEventsPerAthlete:e.target.value?parseInt(e.target.value):''})} disabled={f.maxEventsPerAthleteUnlimited!==false&&!f.maxEventsPerAthlete} />
                <label style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:C.textMuted,cursor:'pointer',whiteSpace:'nowrap'}}>
                  <input type="checkbox" checked={f.maxEventsPerAthleteUnlimited!==false&&!f.maxEventsPerAthlete} onChange={e=>setF({...f,maxEventsPerAthlete:e.target.checked?'':f.maxEventsPerAthlete,maxEventsPerAthleteUnlimited:e.target.checked})} />
                  Unlimited
                </label>
              </div>
            </div>
          </div>
          <div style={{fontSize:10,color:C.textMuted,marginTop:6,fontStyle:'italic'}}>Relay alternates don't count toward either limit. Relay entries count as one event toward the athlete's total.</div>
        </div>
        <div style={{marginTop:8}}>
          <label style={{fontSize:12,color:C.textSecondary}}>Meet Notes</label>
          <textarea style={{...S.input,width:'100%',minHeight:60,resize:'vertical',fontFamily:'inherit',fontSize:12,padding:'8px'}} placeholder="Entry minimums, special rules, schedule notes..." value={f.notes||''} onChange={e=>setF({...f,notes:e.target.value})} />
        </div>
        <div>
          <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Tags <span style={{color:C.textMuted,fontWeight:400}}>(optional — e.g. Invitational, Championship, Dual)</span></label>
          <TagInput value={f.tags||[]} onChange={tags=>setF({...f,tags})} suggestions={knownTags||[]} placeholder="Type a tag and press Enter" />
        </div>
        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{if(!f.name||!f.startDate)return;onSave({...f,startDate:padDate(f.startDate),endDate:padDate(f.endDate),maxEntriesPerEvent:f.maxEntriesPerEvent||null,maxEventsPerAthlete:f.maxEventsPerAthlete||null,tags:(f.tags||[]).filter(Boolean)});}}>{editId?'Save Changes':'Create Meet'}</button>
      </div>
    </Modal>
  );
}
function MeetsPage({ data, save, nav, events }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editMeet, setEditMeet] = useState(null);
  const [openCount, setOpenCount] = useState(0);
  const startEdit = (m) => {
    setEditMeet(m);
    setOpenCount(c=>c+1);
    setShowAdd(true);
  };
  const [delId, setDelId] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [sortCol, setSortCol] = useState('startDate');
  const [sortDir, setSortDir] = useState('asc');
  const [filterType, setFilterType] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [filterState, setFilterState] = useState('');
  const meetTypes = data.meetTypes || [];
  const allStates = [...new Set(data.meets.map(m=>m.state).filter(Boolean))].sort();
  const toggleSort = (col) => {
    if(sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };
  const filtered = data.meets.filter(m => {
    if(search) {
      const q = search.toLowerCase();
      if(!m.name.toLowerCase().includes(q) && !(m.venue||'').toLowerCase().includes(q) && !(m.city||'').toLowerCase().includes(q) && !(m.state||'').toLowerCase().includes(q)) return false;
    }
    if(filterType && m.meetTypeId !== filterType) return false;
    if(filterTrack && m.trackType !== filterTrack) return false;
    if(filterState && m.state !== filterState) return false;
    return true;
  }).sort((a,b) => {
    let av, bv;
    switch(sortCol) {
      case 'name': av=(a.name||'').toLowerCase(); bv=(b.name||'').toLowerCase(); break;
      case 'startDate': av=new Date(a.startDate||a.date||'1970-01-01').getTime(); bv=new Date(b.startDate||b.date||'1970-01-01').getTime(); break;
      case 'venue': av=(a.venue||'').toLowerCase(); bv=(b.venue||'').toLowerCase(); break;
      case 'city': av=(a.city||'').toLowerCase(); bv=(b.city||'').toLowerCase(); break;
      case 'state': av=(a.state||'').toLowerCase(); bv=(b.state||'').toLowerCase(); break;
      case 'trackType': av=a.trackType||''; bv=b.trackType||''; break;
      case 'meetType': av=((meetTypes.find(t=>t.id===a.meetTypeId)||{}).name||'').toLowerCase(); bv=((meetTypes.find(t=>t.id===b.meetTypeId)||{}).name||'').toLowerCase(); break;
      default: av=''; bv='';
    }
    if(av<bv) return sortDir==='asc'?-1:1;
    if(av>bv) return sortDir==='asc'?1:-1;
    return 0;
  });
  const deleteMeet = () => {
    save({ ...data, meets:data.meets.filter(m=>m.id!==delId), results:data.results.filter(r=>r.meetId!==delId) });
    setDelId(null);
  };
  const SortHeader = ({col, label, width}) => (
    <th style={{...S.th, cursor:'pointer', userSelect:'none', width}} onClick={()=>toggleSort(col)}>
      {label} {sortCol===col ? (sortDir==='asc'?'^':'v') : ''}
    </th>
  );
  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:6,marginBottom:12}}>
          <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowImport(true)}>Import</button>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{setEditMeet(null);setOpenCount(c=>c+1);setShowAdd(true);}}>+ New Meet</button>
      </div>
      
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <input style={{...S.input,maxWidth:200}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={S.select} value={filterTrack} onChange={e=>setFilterTrack(e.target.value)}>
          <option value="">All Track Types</option><option value="Indoor">Indoor</option><option value="Outdoor">Outdoor</option>
        </select>
        <select style={S.select} value={filterType} onChange={e=>setFilterType(e.target.value)}>
          <option value="">All Meet Types</option>
          {meetTypes.map(mt=><option key={mt.id} value={mt.id}>{mt.name}</option>)}
        </select>
        {allStates.length>0&&<select style={S.select} value={filterState} onChange={e=>setFilterState(e.target.value)}>
          <option value="">All States</option>
          {allStates.map(s=><option key={s} value={s}>{s}</option>)}
        </select>}
        {(search||filterTrack||filterType||filterState)&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>{setSearch('');setFilterTrack('');setFilterType('');setFilterState('');}}>Clear</button>}
      </div>
      
      <div style={{...S.card, overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
          <thead><tr>
            <SortHeader col="name" label="Meet" />
            <SortHeader col="startDate" label="Date" width={100} />
            <SortHeader col="venue" label="Venue" />
            <SortHeader col="city" label="City" width={90} />
            <SortHeader col="state" label="State" width={60} />
            <SortHeader col="trackType" label="Track" width={70} />
            <SortHeader col="meetType" label="Type" width={90} />
            <th style={{...S.th,width:100}}></th>
          </tr></thead>
          <tbody>
            {filtered.map(m => {
              const mt = meetTypes.find(t=>t.id===m.meetTypeId);
              return (
                <tr key={m.id} style={{cursor:'pointer'}} onClick={()=>nav('meetSub',{meetId:m.id})}>
                  <td style={{...S.td,fontWeight:600}}>{m.name}</td>
                  <td style={S.td}>{m.startDate||m.date||'-'}{m.endDate?<span style={{color:C.textMuted}}> - {m.endDate}</span>:''}</td>
                  <td style={S.td}>{m.venue||'-'}</td>
                  <td style={S.td}>{m.city||'-'}</td>
                  <td style={S.td}>{m.state||'-'}</td>
                  <td style={S.td}><span style={{fontSize:11,fontWeight:600,color:m.trackType==='Indoor'?C.blue:C.accent}}>{m.trackType}</span></td>
                  <td style={S.td}>{mt?<span style={{fontSize:11,fontWeight:600,color:mt.qualifying?C.success:C.textSecondary}}>{mt.name}{mt.qualifying?' ✓':''}</span>:'-'}</td>
                  <td style={S.td}>
                    <div style={{display:'flex',gap:4}}>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={e=>{e.stopPropagation();startEdit(m);}}>Edit</button>
                      <button style={{...S.btn,...S.btnDanger,fontSize:11,padding:'4px 10px'}} onClick={e=>{e.stopPropagation();setDelId(m.id);}}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && <tr><td colSpan={8} style={{...S.td,textAlign:'center',color:C.textMuted,padding:20}}>No meets found.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>{filtered.length} meet{filtered.length!==1?'s':''}</div>
      {showAdd && <MeetFormModal
        key={openCount}
        editId={(editMeet||{}).id}
        initial={editMeet ? {name:editMeet.name||'',startDate:(editMeet.startDate||editMeet.date||'').split('T')[0],endDate:(editMeet.endDate||'').split('T')[0],venue:editMeet.venue||'',city:editMeet.city||'',state:editMeet.state||'',trackType:editMeet.trackType||'Outdoor',timingSystem:editMeet.timingSystem||'FAT',meetTypeId:editMeet.meetTypeId||'',eventOrderTemplateId:editMeet.eventOrderTemplateId||'',maxEntriesPerEvent:editMeet.maxEntriesPerEvent||'',maxEventsPerAthlete:editMeet.maxEventsPerAthlete||'',notes:editMeet.notes||'',tags:Array.isArray(editMeet.tags)?editMeet.tags:[]} : {name:'',startDate:'',endDate:'',venue:'',city:'',state:'',trackType:'Outdoor',timingSystem:'FAT',meetTypeId:'',eventOrderTemplateId:'',maxEntriesPerEvent:'',maxEventsPerAthlete:'',notes:'',tags:[]}}
        meetTypes={meetTypes}
        knownTags={collectKnownTags(data)}
        eventOrderTemplates={data.eventOrderTemplates||[]}
        onSave={(f)=>{
          if((editMeet||{}).id) { save({...data, meets:data.meets.map(m=>m.id===editMeet.id?{...m,...f}:m)}); }
          else { const meetEvents=events.filter(e=>e.trackType===f.trackType||e.trackType==='Both').map(e=>({eventId:e.id,entries:[]})); save({...data, meets:[...data.meets,{id:uid(),...f,events:meetEvents}]}); }
          setShowAdd(false); setEditMeet(null);
        }}
        onClose={()=>{setShowAdd(false);setEditMeet(null);}}
      />}
      <ImportModal open={showImport} onClose={()=>setShowImport(false)} type="meets" onImport={(rows)=>{
        const newMeets = rows.map(row => ({
          id:uid(), name:(row.name||'').trim(), startDate:(row.date||row.start_date||'').trim(), endDate:'',
          venue:(row.venue||row.location||'').trim(), city:(row.city||'').trim(), state:(row.state||'').trim(),
          trackType:(row.track_type||row.type||'Outdoor').trim()==='Indoor'?'Indoor':'Outdoor',
          meetTypeId:'', events:events.map(e=>({eventId:e.id,entries:[]})),
        })).filter(m=>m.name&&m.startDate);
        save({...data, meets:[...data.meets,...newMeets]});
      }} />
      <ConfirmModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={deleteMeet} message="Delete this meet? All associated results will also be removed." />
    </div>
  );
}
function MeetSubPage({ data, save, nav, meetId, events, getAthletePR, checkQualifying, team }) {
  const [filter, setFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [entryTypeFilter, setEntryTypeFilter] = useState('');
  const [onlyWithResults, setOnlyWithResults] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(null);
  const [editEntryIdx, setEditEntryIdx] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [showRoster, setShowRoster] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderList, setReorderList] = useState([]);
  const [reorderDragIdx, setReorderDragIdx] = useState(null);
  const [reorderDragOver, setReorderDragOver] = useState(null);
  const [selectedForTimer, setSelectedForTimer] = useState({});
  const [meetTab, setMeetTab] = useState('entries');
  const [meetSubTab, setMeetSubTab] = useState('event');
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [newEventForm, setNewEventForm] = useState({ name:'', gender:'Boy', eventType:'Track', entryType:'Individual', measurableType:'Time' });
  const [resultsEntryEvent, setResultsEntryEvent] = useState(null);
  const [resultsEntryData, setResultsEntryData] = useState({});
  const [dayFilter, setDayFilter] = useState(null);
  const [athViewSearch, setAthViewSearch] = useState('');
  const [athViewGender, setAthViewGender] = useState('');
  const [athViewSort, setAthViewSort] = useState('name');
  const [resSearch, setResSearch] = useState('');
  const [resGender, setResGender] = useState('');
  const [resGroup, setResGroup] = useState('');
  const [resGradYear, setResGradYear] = useState('');
  const [resEventFilter, setResEventFilter] = useState('');
  const [resSort, setResSort] = useState('name');
  const [resSortDir, setResSortDir] = useState('asc');
  const [editResultId, setEditResultId] = useState(null);
  const [editResultForm, setEditResultForm] = useState({min:'',sec:'',ft:'',inch:'',qtr:'',place:''});
  const [splitsOpen, setSplitsOpen] = useState({});
  const [showRawMeetRows, setShowRawMeetRows] = useState(false);
  const [teamPickerTarget, setTeamPickerTarget] = useState(null);
  const [teamPickerSearch, setTeamPickerSearch] = useState('');
  const [teamPickerFilters, setTeamPickerFilters] = useState({});
  const [teamPickerSort, setTeamPickerSort] = useState('asc');
  const [teamPickerSelected, setTeamPickerSelected] = useState([]);
  const [pickerNewName, setPickerNewName] = useState('');
  const [pickerAdding, setPickerAdding] = useState(false);
  const [pickerMirror, setPickerMirror] = useState(true);
  const saveEditResult = () => {
    if(!editResultId) return;
    const r = (data.results||[]).find(x=>x.id===editResultId);
    if(!r) return;
    const evt = events.find(e=>e.id===r.eventId);
    let updates;
    if(evt && isFieldEvent(evt)) {
      updates = {ft:parseInt(editResultForm.ft)||0, inch:parseInt(editResultForm.inch)||0, qtr:parseFloat(editResultForm.qtr)||0, verified:true};
    } else {
      updates = {timeMs:parseTimeToMs(editResultForm.min, editResultForm.sec), verified:true};
    }
    if(editResultForm.place !== undefined) updates.place = editResultForm.place;
    save({...data, results:(data.results||[]).map(x=>x.id===editResultId?{...x,...updates}:x)});
    setEditResultId(null);
  };
  const verifyResult = (id) => save({...data, results:(data.results||[]).map(x=>x.id===id?{...x,verified:true}:x)});
  const unverifyResult = (id) => save({...data, results:(data.results||[]).map(x=>x.id===id?{...x,verified:false}:x)});
  const deleteResult = (id) => {
    const all = data.results || [];
    const target = all.find(r => r.id === id);
    if(!target) return;
    save({...data, results: all.filter(r => {
      if(r.id === id) return false;
      // Cascade: if deleting a relay composite, also drop its split rows
      if(target.isRelay) {
        if(r.relayCompositeId && r.relayCompositeId === id) return false;
        if(r.isRelaySplit && r.eventId===target.eventId && r.meetId===target.meetId && r.date===target.date && (target.relayAthletes||[]).includes(r.athleteId)) return false;
      }
      // Cascade the other way too: deleting a split row drops sibling splits and the composite
      if(target.isRelaySplit) {
        if(target.relayCompositeId && (r.id===target.relayCompositeId || r.relayCompositeId===target.relayCompositeId)) return false;
        if(!target.relayCompositeId && r.isRelay && r.eventId===target.eventId && r.meetId===target.meetId && r.date===target.date && (r.relayAthletes||[]).includes(target.athleteId)) return false;
        if(!target.relayCompositeId && r.isRelaySplit && r.eventId===target.eventId && r.meetId===target.meetId && r.date===target.date) return false;
      }
      return true;
    })});
  };
  const meet = data.meets.find(m=>m.id===meetId);
  if(!meet) return <div style={S.card}><p>Meet not found</p><button style={S.backLink} onClick={()=>nav('meets')}>{"<- "}Back to Meets</button></div>;
  const maxEventsPerAthlete = meet.maxEventsPerAthlete || 0;
  const maxEntriesPerEvent = meet.maxEntriesPerEvent || 0;
  const maxRelayEntries = meet.maxRelayEntries || 0;
  const _excludedEventsSet = new Set(meet.excludedEvents || []);
  const athleteEventCounts = (()=>{
    const eventSetByAthlete = {};
    (meet.events||[]).forEach(me=>{
      if(_excludedEventsSet.has(me.eventId)) return;
      (me.entries||[]).forEach(en=>{
        const ids = new Set();
        if(en.athletes) en.athletes.forEach(a=>{if(a.athleteId) ids.add(a.athleteId);});
        else if(en.athleteId) ids.add(en.athleteId);
        ids.forEach(aid=>{
          if(!eventSetByAthlete[aid]) eventSetByAthlete[aid] = 0;
          eventSetByAthlete[aid]++;
        });
      });
    });
    return eventSetByAthlete;
  })();
  const athletesOverLimit = maxEventsPerAthlete>0 ? Object.entries(athleteEventCounts).filter(([,n])=>n>maxEventsPerAthlete).map(([id])=>id) : [];
  const eventEntryCounts = (()=>{
    const m = {};
    (meet.events||[]).forEach(me=>{
      if(_excludedEventsSet.has(me.eventId)) return;
      m[me.eventId]=(me.entries||[]).length;
    });
    return m;
  })();
  const getMaxForEvent = (evtId) => {
    const e = events.find(ev=>ev.id===evtId);
    if(e && e.entryType==='Relay') return maxRelayEntries;
    return maxEntriesPerEvent;
  };
  const eventsOverLimit = Object.entries(eventEntryCounts).filter(([id,n])=>{const mx=getMaxForEvent(id);return mx>0&&n>mx;}).map(([id])=>id);
  const meetType = (data.meetTypes||[]).find(mt=>mt.id===meet.meetTypeId);
  const excludedEvents = meet.excludedEvents || [];
  const customEventIds = meet.customEventIds || [];
  const defaultApplicable = events.filter(e => (e.trackType === meet.trackType || e.trackType === 'Both') && !e.meetSpecific);
  const customEvents = events.filter(e => customEventIds.includes(e.id));
  const applicableEvents = [...defaultApplicable, ...customEvents.filter(ce => !defaultApplicable.some(de => de.id === ce.id))].filter(e => !excludedEvents.includes(e.id));
  const meetDayCount = (() => {
    const sd = meet.startDate, ed = meet.endDate;
    if(sd && ed) {
      const a = new Date(sd+'T12:00:00').getTime();
      const b = new Date(ed+'T12:00:00').getTime();
      if(!isNaN(a) && !isNaN(b) && b >= a) return Math.round((b-a)/86400000) + 1;
    }
    return 1;
  })();
  const storedByEvent = {};
  (meet.events||[]).forEach(me => {
    const r = normalizeRound(me.round);
    if(!storedByEvent[me.eventId]) storedByEvent[me.eventId] = {};
    storedByEvent[me.eventId][r] = me;
  });
  const meetEvents = applicableEvents.flatMap(evt => {
    const stored = storedByEvent[evt.id] || {};
    const rounds = Object.keys(stored);
    if(rounds.length === 0) {
      return [{ eventId: evt.id, evt, round: 'Open', entries: [], day: 1 }];
    }
    // Sort rounds in racing order: Open → Trial → Prelim → Quarter → Semi → Final
    rounds.sort((a,b)=>ROUND_LABELS.indexOf(a)-ROUND_LABELS.indexOf(b));
    return rounds.map(round => ({
      eventId: evt.id,
      evt,
      round,
      entries: stored[round].entries || [],
      day: Math.min(stored[round].day || 1, meetDayCount),
    }));
  });
  const eventOrder = meet.eventOrder || [];
  const filtered = meetEvents.filter(me => {
    if(genderFilter && me.evt.gender !== genderFilter) return false;
    if(typeFilter && me.evt.eventType !== typeFilter) return false;
    if(entryTypeFilter && me.evt.entryType !== entryTypeFilter) return false;
    if(filter && !me.evt.name.toLowerCase().includes(filter.toLowerCase())) return false;
    if(meetDayCount > 1 && dayFilter && me.day !== dayFilter) return false;
    if(meetTab==='results' && onlyWithResults) {
      const r = normalizeRound(me.round);
      const hasResult = (data.results||[]).some(rs => rs.eventId===me.eventId && rs.meetId===meetId && normalizeRound(rs.round)===r && !rs.isRelaySplit);
      if(!hasResult) return false;
    }
    return true;
  }).sort((a,b) => {
    const idxA = eventOrder.indexOf(a.eventId);
    const idxB = eventOrder.indexOf(b.eventId);
    if(idxA >= 0 && idxB >= 0) return idxA - idxB;
    if(idxA >= 0) return -1;
    if(idxB >= 0) return 1;
    const dA = getDefaultOrder(a.evt, data, meet);
    const dB = getDefaultOrder(b.evt, data, meet);
    if(dA !== dB) return dA - dB;
    return a.evt.name.localeCompare(b.evt.name);
  });
  const saveEventOrder = (newOrder) => {
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, eventOrder:newOrder}:m)});
  };
  const allSortedMeetEvents = (() => {
    const list = [...meetEvents].sort((a,b)=>{
      const idxA = eventOrder.indexOf(a.eventId);
      const idxB = eventOrder.indexOf(b.eventId);
      if(idxA >= 0 && idxB >= 0) return idxA - idxB;
      if(idxA >= 0) return -1;
      if(idxB >= 0) return 1;
      const dA = getDefaultOrder(a.evt, data, meet);
      const dB = getDefaultOrder(b.evt, data, meet);
      if(dA !== dB) return dA - dB;
      return a.evt.name.localeCompare(b.evt.name);
    });
    if(meetDayCount > 1) list.sort((a,b)=>(a.day||1)-(b.day||1));
    return list;
  })();
  const buildReorderRows = () => allSortedMeetEvents.map(me=>({eventId:me.eventId, round:normalizeRound(me.round), day:me.day||1}));
  const dedupeEventIds = (rows) => { const seen=new Set(); const out=[]; rows.forEach(r=>{if(!seen.has(r.eventId)){seen.add(r.eventId);out.push(r.eventId);}}); return out; };
  const handleDrop = (fromIdx, toIdx) => {
    if(fromIdx===toIdx) return;
    const ids = filtered.map(me=>me.eventId);
    const [moved] = ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, moved);
    saveEventOrder(ids);
  };
  const moveEvent = (eventId, direction) => {
    const ids = filtered.map(me=>me.eventId);
    const idx = ids.indexOf(eventId);
    if(idx < 0) return;
    let newIdx;
    if(direction === 'top') newIdx = 0;
    else if(direction === 'bottom') newIdx = ids.length - 1;
    else newIdx = idx + direction;
    if(newIdx < 0 || newIdx >= ids.length || newIdx === idx) return;
    const next = [...ids];
    const [moved] = next.splice(idx, 1);
    next.splice(newIdx, 0, moved);
    saveEventOrder(next);
  };
  const saveEntries = (eventId, newEntries, round) => {
    const r = normalizeRound(round);
    const updatedMeetEvents = [...(meet.events||[])];
    const idx = updatedMeetEvents.findIndex(me=>me.eventId===eventId && normalizeRound(me.round)===r);
    if(idx>=0) updatedMeetEvents[idx] = {...updatedMeetEvents[idx], entries:newEntries, round:r};
    else updatedMeetEvents.push({eventId, round:r, entries:newEntries});
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, events:updatedMeetEvents}:m)});
  };
  const setEventDay = (eventId, day, round) => {
    const r = normalizeRound(round);
    const updatedMeetEvents = [...(meet.events||[])];
    const idx = updatedMeetEvents.findIndex(me=>me.eventId===eventId && normalizeRound(me.round)===r);
    if(idx>=0) updatedMeetEvents[idx] = {...updatedMeetEvents[idx], day, round:r};
    else updatedMeetEvents.push({eventId, round:r, entries:[], day});
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, events:updatedMeetEvents}:m)});
  };
  const addRoundCard = (eventId, round) => {
    const r = normalizeRound(round);
    const exists = (meet.events||[]).some(me=>me.eventId===eventId && normalizeRound(me.round)===r);
    if(exists) return;
    const updatedMeetEvents = [...(meet.events||[]), {eventId, round:r, entries:[]}];
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, events:updatedMeetEvents}:m)});
  };
  const removeRoundCard = (eventId, round) => {
    const r = normalizeRound(round);
    if(!window.confirm(`Remove the ${r} card for this event? Any entries on it will be deleted.`)) return;
    const updatedMeetEvents = (meet.events||[]).filter(me=>!(me.eventId===eventId && normalizeRound(me.round)===r));
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, events:updatedMeetEvents}:m)});
  };
  const swapRelayLegs = (eventId, round, entryIdx, legA, legB) => {
    const r = normalizeRound(round);
    const me = (meet.events||[]).find(e=>e.eventId===eventId && normalizeRound(e.round)===r);
    if(!me) return;
    const newEntries = (me.entries||[]).map((en,i)=>{
      if(i!==entryIdx) return en;
      const athletes = [...(en.athletes||[])];
      if(legA<0||legB<0||legA>=athletes.length||legB>=athletes.length) return en;
      [athletes[legA], athletes[legB]] = [athletes[legB], athletes[legA]];
      return {...en, athletes};
    });
    saveEntries(eventId, newEntries, r);
  };
  const toggleExcludeEvent = (eventId) => {
    const cur = meet.excludedEvents || [];
    const next = cur.includes(eventId) ? cur.filter(id=>id!==eventId) : [...cur, eventId];
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, excludedEvents:next}:m)});
  };
  const addCustomEventToMeet = (eventId) => {
    const cur = meet.customEventIds || [];
    if(cur.includes(eventId)) return;
    const excl = (meet.excludedEvents||[]).filter(id=>id!==eventId);
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, customEventIds:[...cur, eventId], excludedEvents:excl}:m)});
  };
  const removeCustomEventFromMeet = (eventId) => {
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, customEventIds:(m.customEventIds||[]).filter(id=>id!==eventId)}:m)});
  };
  const createAndAddEvent = () => {
    if(!newEventForm.name.trim()) return;
    const newEvt = {
      id: uid(),
      name: newEventForm.name.trim(),
      gender: newEventForm.gender,
      eventType: newEventForm.eventType,
      entryType: newEventForm.entryType,
      trackType: meet.trackType || 'Both',
      measurableType: newEventForm.measurableType,
      meetSpecific: true,
      qualifyingStandards: [],
      schoolRecords: [],
    };
    const newEvents = [...(data.events||[]), newEvt];
    save({...data, events:newEvents, meets:data.meets.map(m=>m.id===meetId?{...m, customEventIds:[...(m.customEventIds||[]), newEvt.id]}:m)});
    setNewEventForm({ name:'', gender:'Boy', eventType:'Track', entryType:'Individual', measurableType:'Time' });
  };
  const printMeet = (view) => {
    const w = window.open('','_blank','width=1000,height=700');
    if(!w) return;
    const isEvt = view==='events';
    const orient = isEvt ? '@page{size:landscape;margin:0.4in}' : '@page{size:portrait;margin:0.5in}';
    const header = '<div style="text-align:center;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #222"><div style="font-size:18px;font-weight:700;margin:0">'+meet.name+'</div><div style="font-size:11px;color:#555;margin-top:3px">'+(meet.startDate||'')+(meet.endDate?' - '+meet.endDate:'')+' — '+meet.trackType+(meet.venue?' — '+meet.venue:'')+(meet.city?', '+meet.city:'')+(meet.state?' '+meet.state:'')+'</div></div>';
    const css = '<style>'+orient+'body{font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:11px;padding:0;color:#111;margin:0}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:9px;color:#555;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #333;padding:4px 6px;white-space:nowrap}td{padding:3px 6px;border-bottom:1px solid #ddd;font-size:11px;vertical-align:top}.evt-hdr{background:#f0f0f0;font-weight:700;font-size:12px;padding:6px;border-bottom:2px solid #555;border-top:2px solid #555;margin-top:0}.evt-sub{font-weight:400;font-size:10px;color:#666;margin-left:8px}.relay-hdr td{background:#f8f8f8;font-weight:600;font-size:10px;color:#444;border-bottom:1px solid #bbb}.alt td{font-style:italic;color:#888;font-size:10px}.rl{border-bottom:1px solid #888;display:inline-block;min-width:70px} .rl-sm{border-bottom:1px solid #888;display:inline-block;min-width:35px}@media print{body{padding:0}}</style>';
    let body = '';
    if(isEvt) {
      const sorted = [...meetEvents].sort((a,b)=>{const oa=meet.eventOrder||[];const ia=oa.indexOf(a.eventId);const ib=oa.indexOf(b.eventId);if(ia>=0&&ib>=0)return ia-ib;if(ia>=0)return -1;if(ib>=0)return 1;return getDefaultOrder(a.evt, data, meet)-getDefaultOrder(b.evt, data, meet);});
      body += '<table>';
      sorted.forEach(me=>{
        if(!me.entries.length) return;
        const isField = isFieldEvent(me.evt);
        const isRly = me.evt.entryType==='Relay';
        body += '<tr><td colspan="99" class="evt-hdr">'+getEventLabel(me.evt)+'<span class="evt-sub">'+me.evt.eventType+' — '+me.evt.entryType+'</span></td></tr>';
        const evtNote = (meet.eventNotes||{})[me.eventId];
        if(evtNote) body += '<tr><td colspan="99" style="font-size:10px;color:#92400e;background:#fef3c7;padding:3px 8px;border-bottom:1px solid #f59e0b">'+evtNote+'</td></tr>';
        body += '<tr><th style="width:24px">#</th><th>Athlete</th><th>Yr</th>';
        if(!isField&&!isRly) body += '<th>Heat</th><th>Lane</th>';
        body += '<th style="text-align:right">PR</th>';
        if(!isField) body += '<th style="text-align:right">Goal</th>';
        body += '<th style="text-align:right;width:80px">Result</th>';
        body += '<th style="text-align:right;width:50px">Place</th></tr>';
        let num = 1;
        me.entries.forEach((en,ei) => {
          if(isRly) {
            body += '<tr class="relay-hdr"><td colspan="99">Relay #'+(ei+1)+'</td></tr>';
            (en.athletes||[]).forEach((a,ai) => {
              const ath = data.athletes.find(at=>at.id===a.athleteId);
              const pr = getAthletePR(a.athleteId, me.eventId);
              const prStr = pr ? formatTime(pr.timeMs) : '';
              const goalStr = a.goalMs ? formatTime(a.goalMs) : '';
              const yr = ath&&ath.gradYear ? "'"+(''+ath.gradYear).slice(-2) : '';
              body += '<tr><td>'+(ai+1)+'</td><td>'+(ath?athDisplay(ath,true):'—')+'</td><td>'+yr+'</td>';
              body += '<td style="text-align:right">'+prStr+'</td><td style="text-align:right">'+goalStr+'</td>';
              body += '<td style="text-align:right"><span class="rl">&nbsp;</span></td>';
              body += '<td style="text-align:right">'+(ai===0?'<span class="rl-sm">&nbsp;</span>':'')+'</td></tr>';
            });
            if((en.alternates||[]).length) {
              (en.alternates||[]).forEach(a => {
                const ath = data.athletes.find(at=>at.id===a.athleteId);
                const yr = ath&&ath.gradYear ? "'"+(''+ath.gradYear).slice(-2) : '';
                body += '<tr class="alt"><td></td><td>Alt: '+(ath?athDisplay(ath,true):'—')+'</td><td>'+yr+'</td><td colspan="99"></td></tr>';
              });
            }
          } else {
            const ath = data.athletes.find(a=>a.id===en.athleteId);
            const pr = getAthletePR(en.athleteId, me.eventId);
            const prStr = pr ? (isField ? fieldToStr(pr.ft,pr.inch,pr.qtr) : formatTime(pr.timeMs)) : '';
            const goalStr = en.goalMs ? formatTime(en.goalMs) : '';
            const yr = ath&&ath.gradYear ? "'"+(''+ath.gradYear).slice(-2) : '';
            body += '<tr><td>'+num+'</td><td style="font-weight:500">'+(ath?athDisplay(ath,true):'—')+'</td><td>'+yr+'</td>';
            if(!isField) body += '<td><span class="rl-sm">&nbsp;</span></td><td><span class="rl-sm">&nbsp;</span></td>';
            body += '<td style="text-align:right">'+prStr+'</td>';
            if(!isField) body += '<td style="text-align:right">'+goalStr+'</td>';
            body += '<td style="text-align:right"><span class="rl">&nbsp;</span></td>';
            body += '<td style="text-align:right"><span class="rl-sm">&nbsp;</span></td></tr>';
            num++;
          }
        });
        body += '<tr><td colspan="99" style="border:none;height:8px"></td></tr>';
      });
      body += '</table>';
    } else {
      const np = meet.notParticipating||[];
      const athMap = {};
      meetEvents.forEach(me=>{
        (me.entries||[]).forEach((en,ei)=>{
          if(me.evt.entryType==='Relay') {
            (en.athletes||[]).forEach(a=>{if(a.athleteId){if(!athMap[a.athleteId])athMap[a.athleteId]=[];athMap[a.athleteId].push({evt:me.evt,role:'R'});}});
            (en.alternates||[]).forEach(a=>{if(a.athleteId){if(!athMap[a.athleteId])athMap[a.athleteId]=[];athMap[a.athleteId].push({evt:me.evt,role:'Alt'});}});
          } else {
            if(en.athleteId){if(!athMap[en.athleteId])athMap[en.athleteId]=[];athMap[en.athleteId].push({evt:me.evt,role:''});}
          }
        });
      });
      const activeAth = data.athletes.filter(a=>a.active!==false&&!np.includes(a.id)).sort((a,b)=>athLast(a).localeCompare(athLast(b)));
      body += '<table><thead><tr><th>Athlete</th><th>Yr</th><th>G</th><th>Events</th><th style="text-align:right">PRs</th></tr></thead><tbody>';
      let totalEntries = 0;
      activeAth.forEach(a => {
        const evts = athMap[a.id]||[];
        totalEntries += evts.length;
        const evtStr = evts.map(e=>getEventLabel(e.evt)+(e.role?' ('+e.role+')':'')).join(', ')||'<span style="color:#c53030;font-style:italic">None</span>';
        const prStrs = [];
        const seen = new Set();
        evts.forEach(e=>{
          if(seen.has(e.evt.id)) return; seen.add(e.evt.id);
          const pr = getAthletePR(a.id, e.evt.id);
          if(pr) prStrs.push(isFieldEvent(e.evt)?fieldToStr(pr.ft,pr.inch,pr.qtr):formatTime(pr.timeMs));
        });
        body += '<tr><td style="font-weight:600">'+athDisplay(a,true)+'</td><td>'+(a.gradYear?("'"+(''+a.gradYear).slice(-2)):'-')+'</td><td>'+(a.gender==='M'?'B':'G')+'</td><td>'+evtStr+'</td><td style="text-align:right;color:#666">'+(prStrs.join(' / ')||'-')+'</td></tr>';
      });
      body += '</tbody></table>';
      body += '<div style="margin-top:12px;padding-top:8px;border-top:1px solid #ccc;font-size:10px;color:#666;display:flex;justify-content:space-between"><span>'+activeAth.length+' athletes — '+totalEntries+' entries</span><span>Not participating: '+np.length+'</span></div>';
    }
    w.document.write('<!DOCTYPE html><html><head><title>'+meet.name+' - '+(isEvt?'By Event':'By Athlete')+'</title>'+css+'</head><body>'+header+body+'</body></html>');
    w.document.close();
    setTimeout(()=>w.print(),300);
  };
  const openResultsEntry = (me) => {
    const evt = me.evt;
    const meR = normalizeRound(me.round);
    const isField = isFieldEvent(evt);
    const isRelay = evt.entryType==='Relay';
    const entries = me.entries||[];
    const pre = {};
    if(isRelay) {
      entries.forEach((en,ei)=>{
        const relayKey = '_relay_'+ei;
        const athleteIds = (en.athletes||[]).map(a=>a.athleteId).filter(Boolean);
        const sortedKey = [...athleteIds].sort().join(',');
        const aidSet = new Set(athleteIds);
        const allRelayComposites = (data.results||[]).filter(r=>r.eventId===evt.id&&r.meetId===meetId&&r.isRelay&&normalizeRound(r.round)===meR);
        let existingComposite = allRelayComposites.find(r=>[...(r.relayAthletes||[])].sort().join(',')===sortedKey);
        if(!existingComposite && aidSet.size > 0) {
          existingComposite = allRelayComposites.find(r=>{
            const ra = r.relayAthletes||[];
            if(!ra.length) return false;
            const overlap = ra.filter(a=>aidSet.has(a)).length;
            return overlap >= Math.ceil(Math.min(ra.length, aidSet.size) / 2);
          });
        }
        if(!existingComposite && allRelayComposites.length === 1 && entries.length === 1) {
          existingComposite = allRelayComposites[0];
        }
        if(existingComposite) {
          const ms = existingComposite.timeMs||0;
          const splitRows = (data.results||[]).filter(r => r.isRelaySplit && r.eventId===evt.id && r.meetId===meetId && (
            (existingComposite.id && r.relayCompositeId === existingComposite.id)
            || (!r.relayCompositeId && r.date === existingComposite.date && aidSet.has(r.athleteId))
          ));
          const legs = splitRows.map(sr => {
            const sm = sr.timeMs||0;
            return { id:sr.id, athleteId:sr.athleteId, relayLeg:sr.relayLeg, min:Math.floor(sm/60000)+'', sec:((sm%60000)/1000).toFixed(2) };
          }).sort((a,b)=>(a.relayLeg||99)-(b.relayLeg||99));
          pre[relayKey] = {min:Math.floor(ms/60000)+'',sec:((ms%60000)/1000).toFixed(2),place:(existingComposite.place||'')+'',resultId:existingComposite.id,verified:!!existingComposite.verified,athleteIds,legs};
        } else {
          pre[relayKey] = {min:'',sec:'',place:'',athleteIds,legs:[]};
        }
      });
    } else {
      const athleteIds = entries.flatMap(en=>[en.athleteId]).filter(Boolean);
      const unique = [...new Set(athleteIds)];
      unique.forEach(aid=>{
        const existing = (data.results||[]).find(r=>r.athleteId===aid&&r.eventId===evt.id&&r.meetId===meetId&&!r.isRelay&&!r.isRelaySplit&&normalizeRound(r.round)===meR);
        if(existing) {
          if(isField) pre[aid] = {ft:(existing.ft||'')+'',inch:(existing.inch||'')+'',qtr:(existing.qtr||'')+'',place:(existing.place||'')+'',resultId:existing.id,verified:!!existing.verified};
          else {const ms=existing.timeMs||0;pre[aid]={min:Math.floor(ms/60000)+'',sec:((ms%60000)/1000).toFixed(2),place:(existing.place||'')+'',resultId:existing.id,verified:!!existing.verified};}
        } else {
          pre[aid] = isField?{ft:'',inch:'',qtr:'',place:''}:{min:'',sec:'',place:''};
        }
      });
    }
    setResultsEntryData(pre);
    setResultsEntryEvent(`${me.eventId}|${meR}`);
  };
  const saveResultsEntry = (eventId, round) => {
    const r = normalizeRound(round);
    const evt = events.find(e=>e.id===eventId);
    if(!evt) return;
    const isField = isFieldEvent(evt);
    const isRelay = evt.entryType==='Relay';
    const raceDate = meet.startDate||meet.date||new Date().toISOString().split('T')[0];
    let updatedResults = [...(data.results||[])];
    Object.entries(resultsEntryData).forEach(([key,v])=>{
      if(isRelay && key.startsWith('_relay_')) {
        const hasValue = v.min||v.sec;
        if(!hasValue && !(v.legs||[]).length) return;
        const timeMs = parseTimeToMs(v.min, v.sec);
        if(v.resultId) {
          if(hasValue) updatedResults = updatedResults.map(rr=>rr.id===v.resultId?{...rr,timeMs,place:v.place||'',verified:true,round:r}:rr);
        } else if(hasValue) {
          updatedResults.push({id:uid(),eventId,meetId,date:raceDate,timeMs,isRelay:true,relayAthletes:v.athleteIds||[],place:v.place||'',verified:true,round:r,splits:[]});
        }
        (v.legs||[]).forEach(leg => {
          if(!leg.id) return;
          const legMs = parseTimeToMs(leg.min, leg.sec);
          updatedResults = updatedResults.map(rr => rr.id===leg.id ? {...rr, timeMs:legMs, round:r} : rr);
        });
      } else {
        const aid = key;
        const hasValue = isField?(v.ft||v.inch||v.qtr):(v.min||v.sec);
        if(!hasValue) return;
        if(v.resultId) {
          updatedResults = updatedResults.map(rr=>{
            if(rr.id!==v.resultId) return rr;
            if(isField) return {...rr,ft:parseInt(v.ft)||0,inch:parseInt(v.inch)||0,qtr:parseFloat(v.qtr)||0,place:v.place||'',verified:true,round:r};
            return {...rr,timeMs:parseTimeToMs(v.min,v.sec),place:v.place||'',verified:true,round:r};
          });
        } else {
          const newR = {id:uid(),athleteId:aid,eventId,meetId,date:raceDate,verified:true,place:v.place||'',round:r};
          if(isField) {newR.ft=parseInt(v.ft)||0;newR.inch=parseInt(v.inch)||0;newR.qtr=parseFloat(v.qtr)||0;}
          else newR.timeMs=parseTimeToMs(v.min,v.sec);
          updatedResults.push(newR);
        }
      }
    });
    save({...data,results:updatedResults});
    setResultsEntryEvent(null);
    setResultsEntryData({});
  };
  const goToRecord = (me) => {
    const entries = me.entries || [];
    const athleteIds = entries.flatMap(en => en.athletes ? en.athletes.map(a=>a.athleteId) : [en.athleteId]).filter(Boolean);
    const sortedIds = getSortedMeetEventIds(data, events, meetId);
    const curIdx = sortedIds.indexOf(me.evt.id);
    const nextId = curIdx>=0 && curIdx<sortedIds.length-1 ? sortedIds[curIdx+1] : null;
    const prevId = curIdx>0 ? sortedIds[curIdx-1] : null;
    const navParams = {
      meetId, eventId:me.evt.id, athleteIds, entries,
      sortedEventIds: sortedIds,
      nextEventId: nextId, nextEventLabel: nextId ? getEventLabel(events.find(e=>e.id===nextId)||{}) : null,
      prevEventId: prevId, prevEventLabel: prevId ? getEventLabel(events.find(e=>e.id===prevId)||{}) : null,
    };
    if(me.evt.eventType === 'Field') nav('fieldEvent', navParams);
    else if(me.evt.entryType === 'Relay') nav('relayTimer', navParams);
    else nav('multiSplit', navParams);
  };
  const goToRecordSelected = goToRecord;
  const toggleSelect = (eventId, idx) => {
    setSelectedForTimer(prev=>{
      const cur = {...(prev[eventId]||{})};
      cur[idx] = !cur[idx];
      return {...prev, [eventId]:cur};
    });
  };
  const selCount = (eventId) => Object.values(selectedForTimer[eventId]||{}).filter(Boolean).length;
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  return (
    <div>
      <button style={S.backLink} onClick={()=>nav('meets')}>{"<- "}Back to Meets</button>
      <h1 style={S.h1}>{meet.name}{(meet.tags||[]).filter(Boolean).map(t=><span key={t} style={{fontSize:11,fontWeight:700,padding:'2px 9px',borderRadius:11,background:C.surface2,color:C.textSecondary,border:`1px solid ${C.border}`,marginLeft:8,textTransform:'uppercase',letterSpacing:'0.04em',verticalAlign:'middle'}}>{t}</span>)}</h1>
      <p style={S.h3}>
        {meet.startDate}{meet.endDate?` - ${meet.endDate}`:''} - {meet.trackType} - {meet.timingSystem||'FAT'}
        {meet.venue && ` - ${meet.venue}`}{meet.city && `, ${meet.city}`}{meet.state && ` ${meet.state}`}
        {meetType && <span style={{marginLeft:8,color:meetType.qualifying?C.success:C.textMuted,fontWeight:600}}>({meetType.name})</span>}
      </p>
      {meet.notes&&<div style={{fontSize:12,color:C.textSecondary,padding:'6px 12px',background:'#fef3c7',border:'1px solid #f59e0b',borderRadius:6,marginBottom:8,whiteSpace:'pre-wrap',lineHeight:1.4}}>{meet.notes}</div>}
      {(meet.maxEntriesPerEvent||meet.maxEventsPerAthlete||meet.maxRelayEntries)&&(
        <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
          {meet.maxEntriesPerEvent&&<span style={{fontSize:11,fontWeight:600,color:C.accent,padding:'3px 10px',borderRadius:10,background:C.accentMuted,border:`1px solid ${C.accent}`}}>Max {meet.maxEntriesPerEvent} per individual event</span>}
          {meet.maxRelayEntries&&<span style={{fontSize:11,fontWeight:600,color:'#6b46c1',padding:'3px 10px',borderRadius:10,background:'#6b46c120',border:'1px solid #6b46c1'}}>Max {meet.maxRelayEntries} per relay event</span>}
          {meet.maxEventsPerAthlete&&<span style={{fontSize:11,fontWeight:600,color:C.accent,padding:'3px 10px',borderRadius:10,background:C.accentMuted,border:`1px solid ${C.accent}`}}>Max {meet.maxEventsPerAthlete} events per athlete</span>}
        </div>
      )}
      {(()=>{
        const allMeetResults = (data.results||[]).filter(r=>r.meetId===meetId);
        const indivResults = allMeetResults.filter(r=>!r.isRelay&&!r.isRelaySplit);
        const relayResults = allMeetResults.filter(r=>r.isRelay);
        const athletesEntered = new Set();
        let totalEntries = 0;
        let cardsWithEntries = 0;
        meetEvents.forEach(me => {
          if((me.entries||[]).length > 0) cardsWithEntries++;
          totalEntries += (me.entries||[]).length;
          (me.entries||[]).forEach(en => {
            if(en.athleteId) athletesEntered.add(en.athleteId);
            (en.athletes||[]).forEach(a => a && a.athleteId && athletesEntered.add(a.athleteId));
          });
        });
        const limitIssues = (athletesOverLimit||[]).length + (eventsOverLimit||[]).length;
        const eventResultsByMek = new Set();
        [...indivResults, ...relayResults].forEach(r => { eventResultsByMek.add(`${r.eventId}|${normalizeRound(r.round)}`); });
        const pending = meetEvents.filter(me => (me.entries||[]).length > 0 && !eventResultsByMek.has(`${me.eventId}|${normalizeRound(me.round)}`)).length;
        const prCount = indivResults.filter(r => {
          if(!r.athleteId) return false;
          const evt = events.find(e=>e.id===r.eventId); if(!evt) return false;
          const allForAth = (data.results||[]).filter(rs => rs.athleteId===r.athleteId && rs.eventId===r.eventId && !rs.isRelay && !rs.isRelaySplit);
          if(isFieldEvent(evt)) {
            const myVal = (r.ft||0)*12+(r.inch||0)+(r.qtr||0);
            return !allForAth.some(rs => rs.id!==r.id && (rs.date||'')<=(r.date||'') && ((rs.ft||0)*12+(rs.inch||0)+(rs.qtr||0)) > myVal);
          }
          if(!r.timeMs) return false;
          return !allForAth.some(rs => rs.id!==r.id && (rs.date||'')<=(r.date||'') && rs.timeMs && rs.timeMs < r.timeMs);
        }).length;
        const qualsHit = [...indivResults, ...relayResults].filter(r => (getAllQualifyingForResult(data, events, r)||[]).length > 0).length;
        const isEntriesTab = meetTab === 'entries';
        const tileColor = isEntriesTab ? '#2b6cb0' : C.accent;
        const tiles = isEntriesTab
          ? [{v:athletesEntered.size,l:'Athletes'},{v:cardsWithEntries,l:'Events'},{v:totalEntries,l:'Entries'},{v:limitIssues,l:'Limit issues',dim:limitIssues===0}]
          : [{v:indivResults.length+relayResults.length,l:'Results'},{v:prCount,l:'PRs'},{v:qualsHit,l:'Quals hit'},{v:pending,l:'Pending',dim:pending===0}];
        return (
          <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
            {tiles.map((t,i)=>(
              <div key={i} style={{flex:1,minWidth:96,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 10px',textAlign:'center',background:C.surface,opacity:t.dim?0.55:1}}>
                <div style={{fontSize:20,fontWeight:800,color:tileColor,lineHeight:1.05,fontVariantNumeric:'tabular-nums'}}>{t.v}</div>
                <div style={{fontSize:9,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700,marginTop:2}}>{t.l}</div>
              </div>
            ))}
          </div>
        );
      })()}
      <div style={{display:'flex',gap:0,marginBottom:0,borderBottom:`2px solid ${C.border}`,alignItems:'center'}}>
        {[['entries','Entries'],['results','Results'],['scores','Team Scores']].map(([t,label])=>(
          <button key={t} style={{padding:'10px 24px',fontSize:14,fontWeight:700,border:'none',borderBottom:meetTab===t?`3px solid ${C.accent}`:'3px solid transparent',background:'none',color:meetTab===t?C.accent:C.textMuted,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.05em'}} onClick={()=>setMeetTab(t)}>{label}</button>
        ))}
        <button style={{marginLeft:'auto',background:'none',border:`1px solid ${C.border}`,borderRadius:6,padding:'6px 14px',fontSize:12,fontWeight:600,color:C.textSecondary,cursor:'pointer'}} onClick={()=>setShowManageEvents(true)}>Manage Events</button>
        <button style={{background:'none',border:`1px solid ${C.border}`,borderRadius:6,padding:'6px 14px',fontSize:12,fontWeight:600,color:C.textSecondary,cursor:'pointer'}} onClick={()=>printMeet(meetTab==='entries'?(meetSubTab==='event'?'events':'athletes'):'results')}>Print</button>
      </div>
      {meetTab!=='scores' && (
      <div style={{display:'flex',gap:6,marginBottom:12,marginTop:10,flexWrap:'wrap',alignItems:'center'}}>
        {[['event','By Event'],['athlete','By Athlete']].map(([k,label])=>{
          const on = meetSubTab===k;
          return (<button key={k} style={{padding:'6px 14px',fontSize:11,fontWeight:700,color:on?'#fff':C.textMuted,background:on?(meetTab==='results'?C.accent:'#2b6cb0'):C.surface2,border:`1px solid ${on?(meetTab==='results'?C.accent:'#2b6cb0'):C.border}`,borderRadius:18,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.04em'}} onClick={()=>setMeetSubTab(k)}>{label}</button>);
        })}
      </div>
      )}
      {meetTab!=='scores' && (meet.maxEventsPerAthlete||meet.maxEntriesPerEvent||meet.maxRelayEntries)&&(athletesOverLimit.length>0||eventsOverLimit.length>0)&&(
        <div style={{padding:'10px 14px',marginBottom:12,borderRadius:8,background:C.dangerMuted,border:`1px solid ${C.danger}`,fontSize:12}}>
          <div style={{fontWeight:700,color:C.danger,marginBottom:4}}>Entry Limit Violations</div>
          {athletesOverLimit.length>0&&<div style={{color:C.danger,marginBottom:2}}>Over max events ({maxEventsPerAthlete}): {athletesOverLimit.map(id=>{const a=data.athletes.find(at=>at.id===id);return a?`${athDisplay(a)} (${athleteEventCounts[id]})`:'';}).filter(Boolean).join(', ')}</div>}
          {eventsOverLimit.length>0&&<div style={{color:C.danger}}>Over limit: {eventsOverLimit.map(id=>{const e=events.find(ev=>ev.id===id);const mx=getMaxForEvent(id);return e?`${getEventLabel(e)} (${eventEntryCounts[id]}/${mx})`:'';}).filter(Boolean).join(', ')}</div>}
        </div>
      )}
      {meetSubTab==='event' && (meetTab==='entries' || meetTab==='results') && (<>
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
        <input style={{...S.input,maxWidth:200}} placeholder="Search events..." value={filter} onChange={e=>setFilter(e.target.value)} />
        <select style={S.select} value={genderFilter} onChange={e=>setGenderFilter(e.target.value)}>
          <option value="">All Genders</option><option value="Boy">Boys</option><option value="Girl">Girls</option><option value="Mixed">Mixed</option>
        </select>
        <select style={S.select} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="">All Types</option><option value="Track">Track</option><option value="Field">Field</option>
        </select>
        <select style={S.select} value={entryTypeFilter} onChange={e=>setEntryTypeFilter(e.target.value)}>
          <option value="">Individual & Relay</option><option value="Individual">Individual</option><option value="Relay">Relay</option>
        </select>
        {meetTab==='results' && <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:onlyWithResults?C.accent:C.surface2,color:onlyWithResults?'#fff':C.textSecondary,border:`1px solid ${onlyWithResults?C.accent:C.border}`}} onClick={()=>setOnlyWithResults(v=>!v)} title="Hide event cards that don't have any saved results yet">{onlyWithResults?'✓ Only with results':'Only with results'}</button>}
        <button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'4px 10px'}} onClick={()=>{setReorderList(buildReorderRows());setReorderDragIdx(null);setReorderDragOver(null);setShowReorderModal(true);}}>↕ Reorder events</button>
      </div>
      {meetDayCount > 1 && (
        <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:10,fontWeight:700,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.05em',marginRight:4}}>Day:</span>
          {[null, ...Array.from({length:meetDayCount},(_,i)=>i+1)].map(d=>{
            const active = dayFilter === d;
            return (
              <button key={d===null?'all':d} onClick={()=>setDayFilter(d)} style={{fontSize:11,fontWeight:600,padding:'4px 12px',borderRadius:14,cursor:'pointer',border:`1px solid ${active?C.accent:C.border}`,background:active?C.accent:'transparent',color:active?'#fff':C.textSecondary}}>{d===null?'All Days':`Day ${d}`}</button>
            );
          })}
        </div>
      )}
      {(()=>{
        const activeAthletes = data.athletes.filter(a=>a.active!==false);
        const notParticipating = meet.notParticipating||[];
        const allAssignedIds = new Set();
        meetEvents.forEach(me=>{
          (me.entries||[]).forEach(en=>{
            if(en.athleteId) allAssignedIds.add(en.athleteId);
            (en.athletes||[]).forEach(a=>{if(a.athleteId) allAssignedIds.add(a.athleteId);});
          });
        });
        const unassigned = activeAthletes.filter(a=>!allAssignedIds.has(a.id)&&!notParticipating.includes(a.id));
        const dismissed = activeAthletes.filter(a=>notParticipating.includes(a.id));
        const assigned = activeAthletes.filter(a=>allAssignedIds.has(a.id));
        const toggleNP = (id) => {
          const np = notParticipating.includes(id) ? notParticipating.filter(x=>x!==id) : [...notParticipating, id];
          save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, notParticipating:np}:m)});
        };
        return (
          <div style={{...S.card,padding:'10px 14px',marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setShowRoster(!showRoster)}>
              <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12}}>
                <span style={{fontWeight:700,color:C.text}}>Roster Check</span>
                <span style={{color:C.success,fontWeight:600}}>{assigned.length} assigned</span>
                {unassigned.length>0&&<span style={{color:C.danger,fontWeight:600}}>{unassigned.length} unassigned</span>}
                {dismissed.length>0&&<span style={{color:C.textMuted}}>{dismissed.length} out</span>}
              </div>
              <span style={{fontSize:11,color:C.accent,fontWeight:600}}>{showRoster?'▲':'▼'}</span>
            </div>
            {showRoster&&(<div style={{marginTop:8}}>
              {unassigned.length>0&&(<div style={{marginBottom:8}}>
                <div style={{fontSize:11,fontWeight:600,color:C.danger,textTransform:'uppercase',marginBottom:4}}>Unassigned</div>
                {unassigned.map(a=>(
                  <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0',borderBottom:`1px solid ${C.borderLight}`,fontSize:12}}>
                    <span style={{fontWeight:500,cursor:'pointer',color:C.text}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>{athDisplay(a)}{a.gradYear&&<span style={{color:C.textMuted,marginLeft:4}}>'{(a.gradYear+'').slice(-2)}</span>}</span>
                    <button style={{fontSize:10,fontWeight:600,color:C.textMuted,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:4,padding:'2px 8px',cursor:'pointer'}} onClick={()=>toggleNP(a.id)}>Not Participating</button>
                  </div>
                ))}
              </div>)}
              {unassigned.length===0&&<div style={{fontSize:12,color:C.success,fontWeight:600,padding:'4px 0'}}>All active athletes are assigned or marked out</div>}
              {dismissed.length>0&&(<div>
                <div style={{fontSize:11,fontWeight:600,color:C.textMuted,textTransform:'uppercase',marginBottom:4}}>Not Participating</div>
                {dismissed.map(a=>(
                  <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0',borderBottom:`1px solid ${C.borderLight}`,fontSize:12,opacity:0.6}}>
                    <span>{athDisplay(a)}</span>
                    <button style={{fontSize:10,color:C.accent,background:'none',border:'none',cursor:'pointer',fontWeight:600}} onClick={()=>toggleNP(a.id)}>Restore</button>
                  </div>
                ))}
              </div>)}
            </div>)}
          </div>
        );
      })()}
      {(()=>{
        const showDayGroups = meetDayCount > 1 && dayFilter === null;
        const list = showDayGroups ? [...filtered].sort((a,b)=>(a.day||1)-(b.day||1)) : filtered;
        let lastDay = null;
        return list.map((me, meIdx) => {
        const entries = me.entries;
        const hasEntries = entries.length > 0;
        const showHeader = showDayGroups && me.day !== lastDay;
        lastDay = me.day;
        return (
          <React.Fragment key={me.eventId}>
          {showHeader && <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',letterSpacing:'0.05em',padding:'10px 4px 4px',borderBottom:`2px solid ${C.border}`,marginTop:meIdx===0?0:12,marginBottom:6}}>Day {me.day}</div>}
          <div style={{...S.card,padding:'14px 16px',borderLeft:`3px solid ${me.evt.gender==='Boy'?C.blue:me.evt.gender==='Girl'?'#d53f8c':C.accent}`,border:`1px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:hasEntries?8:0,flexWrap:'wrap',gap:6}}>
              <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                <span style={{fontWeight:700,fontSize:15}}>{getEventLabel(me.evt)}</span>
                {(()=>{const r=normalizeRound(me.round); const existingRounds=meetEvents.filter(x=>x.eventId===me.eventId).map(x=>normalizeRound(x.round)); const showBadge=r!=='Open'||existingRounds.length>1; if(!showBadge) return null; const clr=ROUND_COLOR[r]||C.textMuted; return <span style={{fontSize:10,fontWeight:700,padding:'2px 9px',borderRadius:10,background:r==='Final'?clr:'transparent',color:r==='Final'?'#fff':clr,border:`1px solid ${clr}`,textTransform:'uppercase',letterSpacing:'0.05em'}}>{r}</span>;})()}
                <span style={{fontSize:10,color:C.textMuted}}>{me.evt.eventType} - {me.evt.entryType}</span>
                {meetTab==='entries' && meetDayCount > 1 && (
                  <select value={me.day} onChange={e=>setEventDay(me.eventId, parseInt(e.target.value), me.round)} style={{fontSize:10,fontWeight:600,padding:'2px 4px',borderRadius:10,border:`1px solid ${C.accent}`,background:C.accentMuted,color:C.accent,cursor:'pointer'}}>
                    {Array.from({length:meetDayCount},(_,i)=>i+1).map(d=><option key={d} value={d}>Day {d}</option>)}
                  </select>
                )}
                {me.entries.length>0&&(()=>{const mx=getMaxForEvent(me.eventId);const over=mx>0&&me.entries.length>mx;return <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,fontWeight:700,background:over?C.dangerMuted:C.surface2,color:over?C.danger:C.textSecondary,border:over?`1px solid ${C.danger}`:'none'}}>{me.entries.length}{mx>0?`/${mx}`:''}{over?' ⚠':''}</span>;})()}
                {meetTab==='entries' && (()=>{const existingRounds=new Set(meetEvents.filter(x=>x.eventId===me.eventId).map(x=>normalizeRound(x.round)));const missing=ROUND_LABELS.filter(r=>!existingRounds.has(r));if(!missing.length) return null;return <select defaultValue="" onChange={e=>{if(e.target.value){addRoundCard(me.eventId, e.target.value);e.target.value='';}}} style={{fontSize:10,fontWeight:600,padding:'2px 4px',borderRadius:10,border:`1px dashed ${C.textMuted}`,background:'transparent',color:C.textSecondary,cursor:'pointer'}}><option value="">+ Round…</option>{missing.map(r=><option key={r} value={r}>{r}</option>)}</select>;})()}
                {meetTab==='entries' && (()=>{const r=normalizeRound(me.round);if(r==='Open')return null;return <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:11,padding:'2px 6px'}} onClick={()=>removeRoundCard(me.eventId, me.round)} title={`Remove ${r} card for this event`}>✕ {r}</button>;})()}
              </div>
              <div style={{display:'flex',gap:6}}>
                {meetTab==='entries' && <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 14px'}} onClick={()=>{setEditEntryIdx(null);setShowEntryModal({eventId:me.eventId,round:me.round});}}>+ Entry</button>}
                {meetTab==='entries' && hasEntries && <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'6px 14px'}} onClick={()=>goToRecord(me)}>Record</button>}
                {meetTab==='entries' && hasEntries && (()=>{const mek=`${me.eventId}|${normalizeRound(me.round)}`;const on=resultsEntryEvent===mek;return <button style={{...S.btn,fontSize:12,padding:'6px 14px',background:on?C.accent+'20':C.surface2,color:on?C.accent:C.textSecondary,border:`1px solid ${on?C.accent:C.border}`}} onClick={()=>{if(on){setResultsEntryEvent(null);setResultsEntryData({});}else openResultsEntry(me);}}>Results</button>;})()}
                {meetTab==='results' && hasEntries && (()=>{const mek=`${me.eventId}|${normalizeRound(me.round)}`;const on=resultsEntryEvent===mek;return <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'6px 14px'}} onClick={()=>{if(on){setResultsEntryEvent(null);setResultsEntryData({});}else openResultsEntry(me);}}>{on?'Close':'Edit Results'}</button>;})()}
                {meetTab==='results' && !hasEntries && <span style={{fontSize:11,color:C.textMuted,padding:'6px 10px',fontStyle:'italic'}}>No entries on this card</span>}
              </div>
            </div>
            {(()=>{
              const evtNote = (meet.eventNotes||{})[me.eventId]||'';
              return (<div style={{marginBottom:evtNote||isFieldEvent(me.evt)?6:0}}>
                {evtNote&&<div style={{fontSize:11,padding:'4px 10px',background:'#fef3c7',border:'1px solid #f59e0b',borderRadius:6,color:'#92400e',marginBottom:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>{evtNote}</span>
                  <button style={{background:'none',border:'none',color:'#92400e',cursor:'pointer',fontSize:10,padding:'0 4px',fontWeight:700}} onClick={()=>{const v=prompt('Event note:',evtNote);if(v!==null)save({...data,meets:data.meets.map(m=>m.id===meetId?{...m,eventNotes:{...(m.eventNotes||{}),[me.eventId]:v}}:m)});}}>✎</button>
                </div>}
                {!evtNote&&<button style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:10,padding:'2px 0'}} onClick={()=>{const v=prompt('Add note (e.g. minimum height, entry requirement):');if(v)save({...data,meets:data.meets.map(m=>m.id===meetId?{...m,eventNotes:{...(m.eventNotes||{}),[me.eventId]:v}}:m)});}}>+ Add note</button>}
              </div>);
            })()}
            {meetTab==='entries' && hasEntries && (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr><th style={S.th}>Athlete</th><th style={S.th}>PR</th><th style={S.th}>Goal</th><th style={{...S.th,width:70}}></th></tr></thead>
                <tbody>
                  {entries.map((en,ei) => {
                    if(me.evt.entryType === 'Relay') {
                      return [
                        <tr key={`${ei}-header`} style={{background:C.accentMuted}}>
                          <td colSpan={2} style={{...S.td,fontWeight:700,fontSize:11,color:C.accent,textTransform:'uppercase',borderBottom:`2px solid ${C.accent}`,padding:'6px 12px'}}>Relay #{ei+1}</td>
                          <td style={{...S.td,borderBottom:`2px solid ${C.accent}`,padding:'6px 12px'}}></td>
                          <td style={{...S.td,borderBottom:`2px solid ${C.accent}`,padding:'6px 12px'}}><div style={{display:'flex',gap:4}}><button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'2px 6px'}} onClick={()=>{setEditEntryIdx(ei);setShowEntryModal({eventId:me.eventId,round:me.round});}}>Edit</button><button style={{...S.btn,...S.btnDanger,fontSize:10,padding:'2px 6px'}} onClick={()=>saveEntries(me.eventId,entries.filter((_,i)=>i!==ei),me.round)}>✕</button></div></td>
                        </tr>,
                        ...(en.athletes||[]).map((a,ai) => {
                          const ath = data.athletes.find(at=>at.id===a.athleteId);
                          const pr = getAthletePR(a.athleteId, me.eventId);
                          const legCount = (en.athletes||[]).length;
                          return (
                            <tr key={`${ei}-${ai}`}>
                              <td style={{...S.td,paddingLeft:16}}><span style={{fontSize:10,color:C.textMuted,marginRight:6}}>Leg {ai+1}</span>{ath?athDisplay(ath):'-'}</td>
                              <td style={S.td}>{pr ? formatTime(pr.timeMs) : '-'}</td>
                              <td style={S.td}>{a.goalMs ? formatTime(a.goalMs) : '-'}</td>
                              <td style={S.td}>
                                <div style={{display:'flex',gap:2}}>
                                  <button style={{background:'none',border:`1px solid ${C.border}`,borderRadius:4,cursor:'pointer',padding:'2px 6px',fontSize:11,color:ai===0?C.border:C.textSecondary}} disabled={ai===0} onClick={()=>swapRelayLegs(me.eventId,me.round,ei,ai,ai-1)}>↑</button>
                                  <button style={{background:'none',border:`1px solid ${C.border}`,borderRadius:4,cursor:'pointer',padding:'2px 6px',fontSize:11,color:ai>=legCount-1?C.border:C.textSecondary}} disabled={ai>=legCount-1} onClick={()=>swapRelayLegs(me.eventId,me.round,ei,ai,ai+1)}>↓</button>
                                </div>
                              </td>
                            </tr>
                          );
                        }),
                        ...((en.alternates||[]).length>0 ? [
                          <tr key={`${ei}-alt-header`}><td colSpan={4} style={{...S.td,fontSize:10,fontWeight:600,color:C.textMuted,fontStyle:'italic',padding:'4px 12px'}}>Alternates</td></tr>,
                          ...(en.alternates||[]).map((a,ai) => {
                            const ath = data.athletes.find(at=>at.id===a.athleteId);
                            return (<tr key={`${ei}-alt-${ai}`} style={{opacity:0.6}}><td style={{...S.td,paddingLeft:16,fontStyle:'italic'}}>{ath?athDisplay(ath):'-'}</td><td style={S.td}></td><td style={S.td}></td><td style={S.td}></td></tr>);
                          })
                        ] : [])
                      ];
                    }
                    const ath = data.athletes.find(a=>a.id===en.athleteId);
                    const pr = getAthletePR(en.athleteId, me.eventId);
                    return (
                      <tr key={ei}>
                        <td style={{...S.td,fontWeight:500}}>{ath?athDisplay(ath):'-'}</td>
                        <td style={S.td}>{pr ? (isFieldEvent(me.evt) ? fieldToStr(pr.ft,pr.inch,pr.qtr) : formatTime(pr.timeMs)) : '-'}</td>
                        <td style={S.td}>{en.goalMs ? formatTime(en.goalMs) : '-'}</td>
                        <td style={S.td}><div style={{display:'flex',gap:4}}><button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'2px 6px'}} onClick={()=>{setEditEntryIdx(ei);setShowEntryModal({eventId:me.eventId,round:me.round});}}>Edit</button><button style={{...S.btn,...S.btnDanger,fontSize:10,padding:'2px 6px'}} onClick={()=>saveEntries(me.eventId,entries.filter((_,i)=>i!==ei),me.round)}>✕</button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {meetTab==='results' && hasEntries && (()=>{
              const meR = normalizeRound(me.round);
              const isField = isFieldEvent(me.evt);
              const isRelay = me.evt.entryType === 'Relay';
              const cardResults = (data.results||[]).filter(r => r.eventId === me.eventId && r.meetId === meetId && normalizeRound(r.round) === meR && !r.isRelaySplit);
              if(isRelay) {
                return (<table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>
                    <th style={S.th}>Relay</th>
                    <th style={S.th}>Lineup</th>
                    <th style={{...S.th,textAlign:'right'}}>Total time</th>
                    <th style={{...S.th,width:60,textAlign:'center'}}>Place</th>
                    <th style={S.th}></th>
                  </tr></thead>
                  <tbody>
                    {entries.map((en,ei)=>{
                      const athleteIds = (en.athletes||[]).map(a=>a.athleteId).filter(Boolean);
                      const sortedKey = [...athleteIds].sort().join(',');
                      const composite = cardResults.find(r => r.isRelay && [...(r.relayAthletes||[])].sort().join(',')===sortedKey);
                      const lineupNames = athleteIds.map(aid=>{const ath=data.athletes.find(a=>a.id===aid);return ath?athDisplay(ath):'?';}).join(', ')||'(no lineup)';
                      const time = composite ? formatTime(composite.timeMs||0) : '—';
                      const place = composite&&composite.place;
                      const quals = composite ? getAllQualifyingForResult(data, events, composite) : [];
                      return (<tr key={ei}>
                        <td style={{...S.td,fontWeight:700,color:'#6b46c1',fontSize:11}}>#{ei+1}</td>
                        <td style={{...S.td,fontSize:12}}>{lineupNames}</td>
                        <td style={{...S.td,textAlign:'right',fontWeight:700,fontSize:13,color:composite?C.text:C.textMuted}}>{time}</td>
                        <td style={{...S.td,textAlign:'center'}}>{place && <span style={{fontSize:10,fontWeight:700,color:C.accent,padding:'1px 7px',borderRadius:8,background:C.accentMuted,border:`1px solid ${C.accent}`}}>{place}</span>}</td>
                        <td style={S.td}>
                          <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                            {composite && composite.verified && <VerifiedBadge verified={true} small />}
                            {quals.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                          </div>
                        </td>
                      </tr>);
                    })}
                  </tbody>
                </table>);
              }
              const athleteIds = entries.flatMap(en=>[en.athleteId]).filter(Boolean);
              const unique = [...new Set(athleteIds)];
              return (<table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>
                  <th style={S.th}>Athlete</th>
                  <th style={{...S.th,textAlign:'right'}}>{isField?'Mark':'Time'}</th>
                  <th style={{...S.th,width:60,textAlign:'center'}}>Place</th>
                  <th style={S.th}></th>
                </tr></thead>
                <tbody>
                  {unique.map(aid=>{
                    const ath = data.athletes.find(a=>a.id===aid);
                    if(!ath) return null;
                    const result = cardResults.find(r=>r.athleteId===aid);
                    const time = result ? (isField?fieldToStr(result.ft||0,result.inch||0,result.qtr||0):formatTime(result.timeMs||0)) : '—';
                    const place = result&&result.place;
                    const quals = result ? getAllQualifyingForResult(data, events, result) : [];
                    return (<tr key={aid}>
                      <td style={{...S.td,fontSize:12,fontWeight:500}}>
                        {athDisplay(ath)}
                        {ath.gradYear && <span style={{color:C.textMuted,fontSize:11,marginLeft:4}}>'{(ath.gradYear+'').slice(-2)}</span>}
                      </td>
                      <td style={{...S.td,textAlign:'right',fontWeight:700,fontSize:13,color:result?C.text:C.textMuted}}>{time}</td>
                      <td style={{...S.td,textAlign:'center'}}>{place && <span style={{fontSize:10,fontWeight:700,color:C.accent,padding:'1px 7px',borderRadius:8,background:C.accentMuted,border:`1px solid ${C.accent}`}}>{place}</span>}</td>
                      <td style={S.td}>
                        <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                          {result && result.verified && <VerifiedBadge verified={true} small />}
                          {quals.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                        </div>
                      </td>
                    </tr>);
                  })}
                </tbody>
              </table>);
            })()}
            {resultsEntryEvent===`${me.eventId}|${normalizeRound(me.round)}`&&(()=>{
              const isField = isFieldEvent(me.evt);
              const isRelay = me.evt.entryType==='Relay';
              const entries = me.entries||[];
              if(isRelay) {
                return (<div style={{marginTop:8,padding:'10px 12px',background:C.bg,borderRadius:8,border:`1px solid ${C.accent}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:C.accent}}>Enter Relay Results{normalizeRound(me.round)!=='Open'&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:8,background:ROUND_COLOR[normalizeRound(me.round)]||C.textMuted,color:'#fff',marginLeft:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>{normalizeRound(me.round)}</span>}</span>
                    <div style={{display:'flex',gap:6}}>
                      <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'6px 16px'}} onClick={()=>saveResultsEntry(me.eventId, me.round)}>Save All</button>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px'}} onClick={()=>{setResultsEntryEvent(null);setResultsEntryData({});}}>Cancel</button>
                    </div>
                  </div>
                  {entries.map((en,ei)=>{
                    const relayKey = '_relay_'+ei;
                    const v = resultsEntryData[relayKey]||{};
                    const hasExisting = !!v.resultId;
                    const athleteNames = (en.athletes||[]).map(a=>{const at=data.athletes.find(x=>x.id===a.athleteId);return at?athDisplay(at):'?';}).join(' → ');
                    return (<div key={ei} style={{padding:'8px 10px',marginBottom:8,borderRadius:8,background:hasExisting?C.successMuted:C.surface2,border:`1px solid ${hasExisting?C.success+'40':C.border}`}}>
                      <div style={{fontSize:11,fontWeight:600,color:'#6b46c1',marginBottom:6}}>Relay #{ei+1}: <span style={{fontWeight:400,color:C.textSecondary}}>{athleteNames}</span></div>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <span style={{fontSize:12,fontWeight:600,color:C.textSecondary,minWidth:80}}>Total Time:</span>
                        <input style={{...S.input,width:60,fontSize:14,padding:'6px 8px',textAlign:'center',fontWeight:600}} type="text" inputMode="numeric" value={v.min||''} onChange={e=>{const n={...resultsEntryData};n[relayKey]={...v,min:e.target.value};setResultsEntryData(n);}} />
                        <span style={{fontSize:16,fontWeight:700,color:C.textMuted}}>:</span>
                        <input style={{...S.input,width:85,fontSize:14,padding:'6px 8px',textAlign:'center',fontWeight:600}} type="text" inputMode="decimal" placeholder="00.00" value={v.sec||''} onChange={e=>{const n={...resultsEntryData};n[relayKey]={...v,sec:e.target.value};setResultsEntryData(n);}} />
                        <span style={{fontSize:12,color:C.textMuted,marginLeft:8}}>Place:</span>
                        <input style={{...S.input,width:45,fontSize:13,padding:'6px',textAlign:'center'}} type="text" inputMode="numeric" placeholder="#" value={v.place||''} onChange={e=>{const n={...resultsEntryData};n[relayKey]={...v,place:e.target.value};setResultsEntryData(n);}} />
                        {hasExisting&&<span style={{fontSize:10,fontWeight:700,color:C.success,marginLeft:4}}>✓ Saved</span>}
                        {hasExisting&&<button style={{...S.btn,...S.btnDanger,fontSize:10,padding:'4px 10px',marginLeft:4}} title="Delete the saved result (and its leg splits) so you can re-enter it" onClick={()=>{
                          if(!window.confirm('Delete the saved time for this relay AND its leg splits? You can then re-enter it.')) return;
                          const composite = (data.results||[]).find(r=>r.id===v.resultId);
                          const compDate = composite ? composite.date : null;
                          const compId = v.resultId;
                          const aidSet = new Set(v.athleteIds||[]);
                          const newResults = (data.results||[]).filter(r=>{
                            if(r.id===compId) return false;
                            if(!r.isRelaySplit) return true;
                            if(r.relayCompositeId && r.relayCompositeId===compId) return false;
                            if(r.eventId===me.eventId && r.meetId===meetId && r.date===compDate && aidSet.has(r.athleteId)) return false;
                            return true;
                          });
                          save({...data, results:newResults});
                          const cleared = {...resultsEntryData};
                          cleared[relayKey] = {min:'',sec:'',place:'',athleteIds:v.athleteIds||[]};
                          setResultsEntryData(cleared);
                        }}>Delete</button>}
                      </div>
                      {(v.legs||[]).length>0 && (
                        <div style={{marginTop:6}}>
                          <button style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:11,fontWeight:600,padding:'2px 0'}} onClick={()=>{const n={...resultsEntryData};n[relayKey]={...v,legsOpen:!v.legsOpen};setResultsEntryData(n);}}>{v.legsOpen?'▾':'▸'} Edit legs ({(v.legs||[]).length})</button>
                          {v.legsOpen && (
                            <div style={{marginTop:4,padding:'8px 10px',background:C.surface2,borderRadius:6,border:`1px solid ${C.borderLight}`}}>
                              <div style={{fontSize:10,color:C.textMuted,marginBottom:6,fontStyle:'italic'}}>Edit any split times that were off. These don't have to add up to the total above.</div>
                              {(v.legs||[]).map((leg,li)=>{
                                const ath = data.athletes.find(a=>a.id===leg.athleteId);
                                return (
                                  <div key={leg.id||li} style={{display:'flex',gap:6,alignItems:'center',marginBottom:4,flexWrap:'wrap'}}>
                                    <span style={{fontSize:11,fontWeight:700,color:'#6b46c1',minWidth:48}}>Leg {leg.relayLeg||(li+1)}</span>
                                    <span style={{fontSize:11,color:C.textSecondary,minWidth:120,flex:'0 1 auto'}}>{ath?athDisplay(ath):'(unknown)'}</span>
                                    <input style={{...S.input,width:50,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="numeric" value={leg.min||''} onChange={e=>{const n={...resultsEntryData};const legs=[...(v.legs||[])];legs[li]={...legs[li],min:e.target.value};n[relayKey]={...v,legs};setResultsEntryData(n);}} />
                                    <span style={{fontSize:13,color:C.textMuted}}>:</span>
                                    <input style={{...S.input,width:70,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="decimal" placeholder="00.00" value={leg.sec||''} onChange={e=>{const n={...resultsEntryData};const legs=[...(v.legs||[])];legs[li]={...legs[li],sec:e.target.value};n[relayKey]={...v,legs};setResultsEntryData(n);}} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>);
                  })}
                  <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
                    <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'8px 24px'}} onClick={()=>saveResultsEntry(me.eventId, me.round)}>Save All Results</button>
                  </div>
                </div>);
              }
              const athleteIds = entries.flatMap(en=>[en.athleteId]).filter(Boolean);
              const unique = [...new Set(athleteIds)];
              return (<div style={{marginTop:8,padding:'10px 12px',background:C.bg,borderRadius:8,border:`1px solid ${C.accent}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.accent}}>Enter Results{normalizeRound(me.round)!=='Open'&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:8,background:ROUND_COLOR[normalizeRound(me.round)]||C.textMuted,color:'#fff',marginLeft:6,textTransform:'uppercase',letterSpacing:'0.05em'}}>{normalizeRound(me.round)}</span>}</span>
                  <div style={{display:'flex',gap:6}}>
                    <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'6px 16px'}} onClick={()=>saveResultsEntry(me.eventId, me.round)}>Save All</button>
                    <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px'}} onClick={()=>{setResultsEntryEvent(null);setResultsEntryData({});}}>Cancel</button>
                  </div>
                </div>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr>
                    <th style={{...S.th,textAlign:'left'}}>Athlete</th>
                    {isField?<><th style={{...S.th,width:55}}>Ft</th><th style={{...S.th,width:55}}>In</th><th style={{...S.th,width:55}}>Qtr</th></>:<><th style={{...S.th,width:55}}>Min</th><th style={{...S.th,width:10}}></th><th style={{...S.th,width:75}}>Sec</th></>}
                    <th style={{...S.th,width:45}}>Pl</th>
                    <th style={{...S.th,width:20}}></th>
                  </tr></thead>
                  <tbody>{unique.map(aid=>{
                    const ath = data.athletes.find(a=>a.id===aid);
                    if(!ath) return null;
                    const v = resultsEntryData[aid]||{};
                    const hasExisting = !!v.resultId;
                    return (<tr key={aid} style={{background:hasExisting?C.successMuted+'60':'transparent'}}>
                      <td style={{...S.td,fontSize:12,fontWeight:500}}>{athDisplay(ath)}{ath.gradYear&&<span style={{color:C.textMuted,marginLeft:4,fontSize:10}}>'{(ath.gradYear+'').slice(-2)}</span>}</td>
                      {isField?<>
                        <td style={S.td}><input style={{...S.input,width:'100%',fontSize:13,padding:'6px',textAlign:'center'}} type="text" inputMode="numeric" value={v.ft||''} onChange={e=>{const n={...resultsEntryData};n[aid]={...v,ft:e.target.value};setResultsEntryData(n);}} /></td>
                        <td style={S.td}><input style={{...S.input,width:'100%',fontSize:13,padding:'6px',textAlign:'center'}} type="text" inputMode="numeric" value={v.inch||''} onChange={e=>{const n={...resultsEntryData};n[aid]={...v,inch:e.target.value};setResultsEntryData(n);}} /></td>
                        <td style={S.td}><input style={{...S.input,width:'100%',fontSize:13,padding:'6px',textAlign:'center'}} type="text" inputMode="decimal" value={v.qtr||''} onChange={e=>{const n={...resultsEntryData};n[aid]={...v,qtr:e.target.value};setResultsEntryData(n);}} /></td>
                      </>:<>
                        <td style={S.td}><input style={{...S.input,width:'100%',fontSize:13,padding:'6px',textAlign:'center'}} type="text" inputMode="numeric" value={v.min||''} onChange={e=>{const n={...resultsEntryData};n[aid]={...v,min:e.target.value};setResultsEntryData(n);}} /></td>
                        <td style={{...S.td,textAlign:'center',color:C.textMuted,fontSize:14,padding:0,fontWeight:700}}>:</td>
                        <td style={S.td}><input style={{...S.input,width:'100%',fontSize:13,padding:'6px',textAlign:'center'}} type="text" inputMode="decimal" placeholder="00.00" value={v.sec||''} onChange={e=>{const n={...resultsEntryData};n[aid]={...v,sec:e.target.value};setResultsEntryData(n);}} /></td>
                      </>}
                      <td style={S.td}><input style={{...S.input,width:'100%',fontSize:12,padding:'6px',textAlign:'center'}} type="text" inputMode="numeric" placeholder="#" value={v.place||''} onChange={e=>{const n={...resultsEntryData};n[aid]={...v,place:e.target.value};setResultsEntryData(n);}} /></td>
                      <td style={S.td}>{hasExisting&&<span style={{fontSize:9,fontWeight:700,color:C.success}}>✓</span>}</td>
                    </tr>);
                  })}</tbody>
                </table>
                <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
                  <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'8px 24px'}} onClick={()=>saveResultsEntry(me.eventId, me.round)}>Save All Results</button>
                </div>
              </div>);
            })()}
          </div>
          </React.Fragment>
        );
        });
      })()}
      {!filtered.length && <div style={{...S.card,textAlign:'center',padding:20,color:C.textMuted}}>No events match your filters.</div>}
      </>)}
      {meetTab==='entries' && meetSubTab==='athlete' && (()=>{
        const notParticipating = meet.notParticipating||[];
        const athleteEntryMap = {};
        meetEvents.forEach(me=>{
          (me.entries||[]).forEach((en,ei)=>{
            if(me.evt.entryType==='Relay') {
              (en.athletes||[]).forEach(a=>{
                if(!a.athleteId) return;
                if(!athleteEntryMap[a.athleteId]) athleteEntryMap[a.athleteId]=[];
                athleteEntryMap[a.athleteId].push({evt:me.evt,role:'Relay',entryIdx:ei});
              });
              (en.alternates||[]).forEach(a=>{
                if(!a.athleteId) return;
                if(!athleteEntryMap[a.athleteId]) athleteEntryMap[a.athleteId]=[];
                athleteEntryMap[a.athleteId].push({evt:me.evt,role:'Alternate',entryIdx:ei});
              });
            } else {
              if(!en.athleteId) return;
              if(!athleteEntryMap[en.athleteId]) athleteEntryMap[en.athleteId]=[];
              athleteEntryMap[en.athleteId].push({evt:me.evt,role:'Individual',entryIdx:ei});
            }
          });
        });
        const removeAthleteEntry = (athleteId, evtObj, entryIdx) => {
          const me = (meet.events||[]).find(e=>e.eventId===evtObj.id);
          if(!me) return;
          let newEntries;
          if(evtObj.entryType==='Relay') {
            newEntries = (me.entries||[]).map((en,i)=>{
              if(i!==entryIdx) return en;
              return {...en, athletes:(en.athletes||[]).filter(a=>a.athleteId!==athleteId), alternates:(en.alternates||[]).filter(a=>a.athleteId!==athleteId)};
            });
          } else {
            newEntries = (me.entries||[]).filter((en,i)=>!(i===entryIdx&&en.athleteId===athleteId));
          }
          saveEntries(evtObj.id, newEntries);
        };
        const addAthleteEntry = (athleteId, eventId) => {
          const me = (meet.events||[]).find(e=>e.eventId===eventId && (e.round||'Open')==='Open');
          const entries = me ? [...(me.entries||[])] : [];
          entries.push({athleteId, goalMs:0});
          saveEntries(eventId, entries, 'Open');
        };
        const activeAthletes = data.athletes.filter(a=>a.active!==false);
        let athList = activeAthletes.filter(a=>{
          if(notParticipating.includes(a.id)) return false;
          if(athViewSearch && !athSearch(a,athViewSearch)) return false;
          if(athViewGender && a.gender!==athViewGender) return false;
          return true;
        });
        athList.sort((a,b)=>{
          if(athViewSort==='events') return (athleteEntryMap[b.id]||[]).length - (athleteEntryMap[a.id]||[]).length;
          return athLast(a).localeCompare(athLast(b));
        });
        const indivEvents = applicableEvents.filter(e=>e.entryType==='Individual');
        return (<div>
          <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
            <input style={{...S.input,maxWidth:200}} placeholder="Search athletes..." value={athViewSearch} onChange={e=>setAthViewSearch(e.target.value)} />
            <select style={S.select} value={athViewGender} onChange={e=>setAthViewGender(e.target.value)}>
              <option value="">All Genders</option><option value="M">Boys</option><option value="F">Girls</option>
            </select>
            <select style={S.select} value={athViewSort} onChange={e=>setAthViewSort(e.target.value)}>
              <option value="name">Sort by Name</option><option value="events">Sort by # Events</option>
            </select>
            <span style={{fontSize:12,color:C.textMuted,marginLeft:'auto'}}>{athList.length} athletes</span>
          </div>
          {athList.map(a=>{
            const myEvents = athleteEntryMap[a.id]||[];
            const assignedEventIds = myEvents.map(me=>me.evt.id);
            const availableEvents = indivEvents.filter(e=>!assignedEventIds.includes(e.id)&&(!e.gender||e.gender==='Mixed'||e.gender===(a.gender==='M'?'Boy':'Girl')));
            return (
              <div key={a.id} style={{...S.card,padding:'10px 14px',borderLeft:myEvents.length>0?`3px solid ${C.success}`:`3px solid ${C.border}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                    <span style={{fontWeight:600,fontSize:14,color:C.text}}>{athDisplay(a)}</span>
                    {a.gradYear&&<span style={{color:C.textMuted,fontSize:12,marginLeft:6}}>'{(a.gradYear+'').slice(-2)}</span>}
                    <span style={{fontSize:11,color:a.gender==='M'?C.blue:'#d53f8c',marginLeft:6}}>{a.gender==='M'?'B':'G'}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:maxEventsPerAthlete>0&&myEvents.length>maxEventsPerAthlete?C.danger:myEvents.length>0?C.success:C.textMuted}}>{myEvents.length} event{myEvents.length!==1?'s':''}{maxEventsPerAthlete>0&&myEvents.length>maxEventsPerAthlete?' ⚠':''}</span>
                </div>
                {myEvents.length>0 && (
                  <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:6}}>
                    {myEvents.map((me,i)=>(
                      <span key={i} style={{fontSize:10,padding:'2px 8px',borderRadius:12,fontWeight:600,background:me.role==='Alternate'?C.surface2:me.role==='Relay'?C.accentMuted:C.successMuted,color:me.role==='Alternate'?C.textMuted:me.role==='Relay'?C.accent:C.success,border:`1px solid ${me.role==='Alternate'?C.border:me.role==='Relay'?C.accent:C.success}`,display:'inline-flex',alignItems:'center',gap:4}}>
                        {getEventLabel(me.evt)}{me.role==='Relay'?' (R)':me.role==='Alternate'?' (Alt)':''}
                        <button style={{background:'none',border:'none',cursor:'pointer',color:'inherit',fontSize:10,padding:0,lineHeight:1,fontWeight:700,opacity:0.7}} onClick={()=>removeAthleteEntry(a.id,me.evt,me.entryIdx)} title="Remove from event">✕</button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{display:'flex',gap:4,marginTop:6,alignItems:'center'}}>
                  {availableEvents.length>0&&<select style={{...S.select,fontSize:10,padding:'3px 6px',flex:1,maxWidth:200}} defaultValue="" onChange={e=>{if(e.target.value){addAthleteEntry(a.id,e.target.value);e.target.value='';}}}>
                    <option value="">+ Add event...</option>
                    {availableEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}
                  </select>}
                </div>
              </div>
            );
          })}
        </div>);
      })()}
      {meetTab==='results' && meetSubTab==='athlete' && (()=>{
        const allMeetResults = (data.results||[]).filter(r=>r.meetId===meetId);
        const meetResults = allMeetResults.filter(r=>!r.isRelay&&!r.isRelaySplit);
        const _relayRaw = allMeetResults.filter(r=>r.isRelay);
        const _relayBest = {};
        _relayRaw.forEach(r => {
          const k = `${r.eventId}|${r.meetId||''}|${r.date}`;
          const prev = _relayBest[k];
          if(!prev) { _relayBest[k] = r; return; }
          if(r.verified && !prev.verified) _relayBest[k] = r;
        });
        const relayResults = Object.values(_relayBest);
        const relaySplits = allMeetResults.filter(r=>r.isRelaySplit);
        const allGroups = data.workoutGroups||[];
        const allGradYears = [...new Set(data.athletes.map(a=>a.gradYear).filter(Boolean))].sort((a,b)=>b-a);
        const isPR = (r) => {
          if(r.isRelaySplit||r.isRelay) return false;
          const ath = data.athletes.find(a=>a.id===r.athleteId);
          if(!ath) return false;
          const evt = events.find(e=>e.id===r.eventId);
          if(!evt) return false;
          const allResultsForAth = (data.results||[]).filter(rs=>rs.athleteId===r.athleteId&&rs.eventId===r.eventId&&!rs.isRelay&&!rs.isRelaySplit);
          if(isFieldEvent(evt)) {
            const myVal = (r.ft||0)*12 + (r.inch||0) + (r.qtr||0);
            return !allResultsForAth.some(rs=>rs.id!==r.id && rs.date<=r.date && ((rs.ft||0)*12+(rs.inch||0)+(rs.qtr||0)) > myVal);
          } else {
            if(!r.timeMs) return false;
            return !allResultsForAth.some(rs=>rs.id!==r.id && rs.date<=r.date && rs.timeMs && rs.timeMs < r.timeMs);
          }
        };
        const meetTiming = meet.timingSystem||'FAT';
        const getStdTimingType = (stdName) => {
          const sn = (stdName||'').trim().toLowerCase();
          for(const t of (data.qualifyingStandardTypes||[])) {
            const tn = (t.name||'').trim().toLowerCase();
            if(tn===sn) return t.timingType||'Both';
            for(const s of (t.subtypes||[])) { if((t.name+' - '+s).trim().toLowerCase()===sn) return (t.subtypeTimingTypes||{})[s]||'Both'; }
            if(sn.startsWith(tn)) return t.timingType||'Both';
          }
          return 'Both';
        };
        const stdMatchesTiming = (stdName) => {
          const tt = getStdTimingType(stdName);
          return tt==='Both' || tt===meetTiming;
        };
        const isQualifying = (r) => {
          if(r.isRelaySplit) return null;
          const evt = events.find(e=>e.id===r.eventId);
          if(!evt || !(evt.qualifyingStandards||[]).length) return null;
          const applicable = (evt.qualifyingStandards||[]).filter(s=>stdMatchesTiming(s.name));
          if(!applicable.length) return null;
          if(isFieldEvent(evt)) {
            const myVal = (r.ft||0)*12 + (r.inch||0) + (r.qtr||0);
            return applicable.find(s=>{
              const sVal = (s.ft||0)*12+(s.inch||0)+(s.qtr||0);
              return sVal>0 && myVal>=sVal;
            });
          } else {
            const rawMs = r.timeMs || (r._relayTotal) || 0;
            if(!rawMs) return null;
            return applicable.find(s=>{
              if(!s.timeMs||s.timeMs<=0) return false;
              const stdTT = getStdTimingType(s.name);
              let checkMs = rawMs;
              if(meetTiming==='Hand' && (stdTT==='FAT'||stdTT==='Both')) checkMs = handToFAT(rawMs);
              return checkMs<=s.timeMs;
            });
          }
        };
        const getAllQualifying = (r) => {
          if(r.isRelaySplit) return [];
          const evt = events.find(e=>e.id===r.eventId);
          if(!evt || !(evt.qualifyingStandards||[]).length) return [];
          const applicable = (evt.qualifyingStandards||[]).filter(s=>stdMatchesTiming(s.name));
          if(isFieldEvent(evt)) {
            const myVal = (r.ft||0)*12 + (r.inch||0) + (r.qtr||0);
            return applicable.filter(s=>{const sVal=(s.ft||0)*12+(s.inch||0)+(s.qtr||0);return sVal>0&&myVal>=sVal;});
          } else {
            const rawMs = r.timeMs || (r._relayTotal) || 0;
            if(!rawMs) return [];
            return applicable.filter(s=>{
              if(!s.timeMs||s.timeMs<=0) return false;
              const stdTT = getStdTimingType(s.name);
              let checkMs = rawMs;
              if(meetTiming==='Hand' && (stdTT==='FAT'||stdTT==='Both')) checkMs = handToFAT(rawMs);
              return checkMs<=s.timeMs;
            });
          }
        };
        const isRelayQualifying = (relayResult) => {
          const evt = events.find(e=>e.id===relayResult.eventId);
          if(!evt || !(evt.qualifyingStandards||[]).length) return null;
          const applicable = (evt.qualifyingStandards||[]).filter(s=>stdMatchesTiming(s.name));
          if(!applicable.length||!relayResult.timeMs) return null;
          return applicable.find(s=>{
            if(!s.timeMs||s.timeMs<=0) return false;
            const stdTT = getStdTimingType(s.name);
            let checkMs = relayResult.timeMs;
            if(meetTiming==='Hand' && (stdTT==='FAT'||stdTT==='Both')) checkMs = handToFAT(relayResult.timeMs);
            return checkMs<=s.timeMs;
          });
        };
        const resultsByAthlete = {};
        meetResults.forEach(r=>{
          if(!r.athleteId) return;
          if(!resultsByAthlete[r.athleteId]) resultsByAthlete[r.athleteId]=[];
          resultsByAthlete[r.athleteId].push(r);
        });
        relaySplits.forEach(r=>{
          if(!r.athleteId) return;
          if(!resultsByAthlete[r.athleteId]) resultsByAthlete[r.athleteId]=[];
          resultsByAthlete[r.athleteId].push(r);
        });
        relayResults.forEach(rr=>{
          (rr.relayAthletes||[]).forEach(aid=>{
            if(!resultsByAthlete[aid]) resultsByAthlete[aid]=[];
            const hasSplit = relaySplits.some(rs=>rs.athleteId===aid&&rs.eventId===rr.eventId&&rs.date===rr.date);
            if(!hasSplit) {
              const legSplit = (rr.splits||[]).find(s=>s.athleteId===aid);
              resultsByAthlete[aid].push({
                id:rr.id+'-'+aid, athleteId:aid, eventId:rr.eventId, date:rr.date, meetId:rr.meetId,
                timeMs:legSplit?legSplit.split:null, isRelaySplit:true, relayLeg:legSplit?legSplit.lap:null,
                _relayTotal:rr.timeMs, _fromComposite:true
              });
            }
          });
        });
        const athletesWithResults = Object.keys(resultsByAthlete).map(id=>data.athletes.find(a=>a.id===id)).filter(Boolean);
        let filteredAthletes = athletesWithResults.filter(a=>{
          if(resSearch && !athSearch(a, resSearch)) return false;
          if(resGender && a.gender!==resGender) return false;
          if(resGradYear && String(a.gradYear)!==String(resGradYear)) return false;
          if(resGroup && !(a.groups||[]).some(g=>g.groupId===resGroup) && a.trainingGroup!==resGroup) return false;
          if(resEventFilter && !(resultsByAthlete[a.id]||[]).some(r=>r.eventId===resEventFilter)) return false;
          return true;
        });
        filteredAthletes.sort((a,b)=>{
          let av,bv;
          switch(resSort){
            case 'name': av=athLast(a).toLowerCase(); bv=athLast(b).toLowerCase(); break;
            case 'gradYear': av=a.gradYear||0; bv=b.gradYear||0; break;
            case 'gender': av=a.gender||''; bv=b.gender||''; break;
            case 'group': av=((a.groups||[])[0]||{}).groupId||a.trainingGroup||''; bv=((b.groups||[])[0]||{}).groupId||b.trainingGroup||''; break;
            case 'eventCount': av=(resultsByAthlete[a.id]||[]).length; bv=(resultsByAthlete[b.id]||[]).length; break;
            default: av=athLast(a).toLowerCase(); bv=athLast(b).toLowerCase();
          }
          if(av<bv) return resSortDir==='asc'?-1:1;
          if(av>bv) return resSortDir==='asc'?1:-1;
          return 0;
        });
        const allEventIds = [...new Set([...meetResults,...relaySplits,...relayResults].map(r=>r.eventId))];
        const eventsForFilter = allEventIds.map(id=>events.find(e=>e.id===id)).filter(Boolean);
        const orphanSplits = (() => {
          const isOrphan = (rs) => {
            const evt = events.find(e=>e.id===rs.eventId);
            const relayEvt = !!evt && evt.entryType==='Relay';
            const isSplitLike = rs.isRelaySplit || (relayEvt && rs.athleteId && !rs.isRelay);
            if(!isSplitLike) return false;
            if(rs.relayCompositeId) {
              return !relayResults.some(rr => rr.id === rs.relayCompositeId);
            }
            return !relayResults.some(rr => rr.eventId===rs.eventId && rr.date===rs.date && (rr.relayAthletes||[]).includes(rs.athleteId));
          };
          return allMeetResults.filter(isOrphan);
        })();
        return (<div>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
            <button style={{...S.btn,fontSize:10,padding:'4px 10px',background:showRawMeetRows?C.danger:C.surface2,color:showRawMeetRows?'#fff':C.textMuted,border:`1px solid ${showRawMeetRows?C.danger:C.border}`,borderRadius:6}} onClick={()=>setShowRawMeetRows(v=>!v)} title="Show every stored result row for this meet, including odd or hidden ones, with delete buttons">
              {showRawMeetRows?'Hide':'Show'} all stored rows
            </button>
          </div>
          {showRawMeetRows && (
            <div style={{...S.card,padding:'10px 12px',marginBottom:12,border:`1px solid ${C.danger}`}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:6}}>Every result row stored for this meet ({allMeetResults.length} total). Use this if a normal row delete isn't clearing something — the "raw delete" here only removes the single row you click (no cascade), so use it surgically.</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
                <thead><tr>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>Type</th>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>Event</th>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>Athlete</th>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>Date</th>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>Mark</th>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>Splits</th>
                  <th style={{...S.th,padding:'3px 4px',fontSize:9}}>ID</th>
                  <th style={{...S.th,padding:'3px 4px',width:28}}></th>
                </tr></thead>
                <tbody>
                  {allMeetResults.map(r=>{
                    const evt = events.find(e=>e.id===r.eventId);
                    const ath = r.athleteId ? data.athletes.find(a=>a.id===r.athleteId) : null;
                    const isField = evt && isFieldEvent(evt);
                    const mark = r.isRelay ? formatTime(r.timeMs||0) : (isField ? fieldToStr(r.ft||0,r.inch||0,r.qtr||0) : formatTime(r.timeMs||0));
                    const type = r.isRelay ? 'Relay composite' : r.isRelaySplit ? `Relay split (leg ${r.relayLeg||'?'})` : 'Individual';
                    return (
                      <tr key={r.id}>
                        <td style={{...S.td,padding:'3px 4px',fontSize:11,color:r.isRelay?'#6b46c1':r.isRelaySplit?'#8b5cf6':C.text,fontWeight:600}}>{type}</td>
                        <td style={{...S.td,padding:'3px 4px',fontSize:11}}>{evt?getEventLabel(evt):'(unknown event)'}{evt&&evt.entryType==='Relay'?<span style={{fontSize:9,color:C.textMuted}}> [relay event]</span>:null}</td>
                        <td style={{...S.td,padding:'3px 4px',fontSize:11}}>{ath?athDisplay(ath):r.relayAthletes?`Relay (${(r.relayAthletes||[]).length} athletes)`:'(no athlete)'}</td>
                        <td style={{...S.td,padding:'3px 4px',fontSize:11,color:C.textMuted}}>{r.date}</td>
                        <td style={{...S.td,padding:'3px 4px',fontSize:11,fontWeight:600}}>{mark}</td>
                        <td style={{...S.td,padding:'3px 4px',fontSize:11,color:C.textMuted}}>{Array.isArray(r.splits)?r.splits.length:0}</td>
                        <td style={{...S.td,padding:'3px 4px',fontSize:9,fontFamily:'monospace',color:C.textMuted}}>{(r.id||'').slice(-6)}</td>
                        <td style={{...S.td,padding:'3px 4px'}}>
                          <button style={{...S.btn,...S.btnDanger,fontSize:9,padding:'2px 6px'}} title="Raw delete this single row (no cascade)" onClick={()=>{
                            if(!window.confirm(`Delete this ${type.toLowerCase()} row?`)) return;
                            save({...data, results:(data.results||[]).filter(x=>x.id!==r.id)});
                          }}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                  {allMeetResults.length===0&&<tr><td colSpan={8} style={{...S.td,textAlign:'center',color:C.textMuted,padding:8}}>No stored result rows for this meet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {orphanSplits.length>0 && (
            <div style={{padding:'10px 14px',marginBottom:12,borderRadius:8,background:C.dangerMuted,border:`1px solid ${C.danger}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,flexWrap:'wrap'}}>
              <div style={{fontSize:12,color:C.danger}}>
                <strong>{orphanSplits.length} stranded relay leg row{orphanSplits.length!==1?'s':''}</strong> for this meet (leg or split results whose relay composite has been deleted).
              </div>
              <button style={{...S.btn,...S.btnDanger,fontSize:12,padding:'6px 14px'}} onClick={()=>{
                if(!window.confirm(`Permanently delete ${orphanSplits.length} stranded relay leg row${orphanSplits.length!==1?'s':''}?`)) return;
                const ids = new Set(orphanSplits.map(r=>r.id));
                save({...data, results:(data.results||[]).filter(r=>!ids.has(r.id))});
              }}>Clear them</button>
            </div>
          )}
          <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
            <input style={{...S.input,maxWidth:180}} placeholder="Search athletes..." value={resSearch} onChange={e=>setResSearch(e.target.value)} />
            <select style={S.select} value={resGender} onChange={e=>setResGender(e.target.value)}>
              <option value="">All Genders</option><option value="M">Boys</option><option value="F">Girls</option>
            </select>
            <select style={S.select} value={resGradYear} onChange={e=>setResGradYear(e.target.value)}>
              <option value="">All Years</option>
              {allGradYears.map(y=><option key={y} value={y}>'{(y+'').slice(-2)}</option>)}
            </select>
            <select style={S.select} value={resGroup} onChange={e=>setResGroup(e.target.value)}>
              <option value="">All Groups</option>
              {allGroups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <select style={S.select} value={resEventFilter} onChange={e=>setResEventFilter(e.target.value)}>
              <option value="">All Events</option>
              {eventsForFilter.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}
            </select>
            <select style={S.select} value={resSort} onChange={e=>setResSort(e.target.value)}>
              <option value="name">Sort: Name</option>
              <option value="gradYear">Sort: Grad Year</option>
              <option value="gender">Sort: Gender</option>
              <option value="group">Sort: Group</option>
              <option value="eventCount">Sort: # Results</option>
            </select>
            <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>setResSortDir(d=>d==='asc'?'desc':'asc')}>{resSortDir==='asc'?'A→Z':'Z→A'}</button>
            {(resSearch||resGender||resGroup||resGradYear||resEventFilter)&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>{setResSearch('');setResGender('');setResGroup('');setResGradYear('');setResEventFilter('');}}>Clear</button>}
            <span style={{fontSize:12,color:C.textMuted,marginLeft:'auto'}}>{filteredAthletes.length} athletes · {allMeetResults.length} results</span>
          </div>
          {filteredAthletes.length===0 && <div style={{...S.card,textAlign:'center',padding:30,color:C.textMuted}}>No results match your filters.</div>}
          {filteredAthletes.map(a=>{
            const indivResults = (resultsByAthlete[a.id]||[]).filter(r=>!r.isRelaySplit&&!r.isRelay);
            const athRelaySplits = (resultsByAthlete[a.id]||[]).filter(r=>r.isRelaySplit);
            const athRelays = relayResults.filter(rr=>(rr.relayAthletes||[]).includes(a.id));
            const allMyResults = [...indivResults, ...athRelaySplits];
            const filtered2 = allMyResults.filter(r=>!resEventFilter||r.eventId===resEventFilter).sort((x,y)=>{const ea=events.find(e=>e.id===x.eventId);const eb=events.find(e=>e.id===y.eventId);return (ea?getDefaultOrder(ea):999)-(eb?getDefaultOrder(eb):999);});
            const grpName = ((data.workoutGroups||[]).find(g=>((a.groups||[])[0]||{}).groupId===g.id||a.trainingGroup===g.id)||{}).name||'';
            return (
              <div key={a.id} style={{...S.card,padding:'10px 14px',marginBottom:8,borderLeft:`3px solid ${a.gender==='M'?C.blue:'#d53f8c'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <div style={{cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                    <span style={{fontWeight:600,fontSize:14,color:C.text}}>{athDisplay(a)}</span>
                    {a.gradYear&&<span style={{color:C.textMuted,fontSize:12,marginLeft:6}}>'{(a.gradYear+'').slice(-2)}</span>}
                    <span style={{fontSize:11,color:a.gender==='M'?C.blue:'#d53f8c',marginLeft:6}}>{a.gender==='M'?'B':'G'}</span>
                    {grpName&&<span style={{fontSize:11,color:C.textMuted,marginLeft:6}}>· {grpName}</span>}
                  </div>
                  <span style={{fontSize:11,color:C.textMuted}}>{filtered2.length} result{filtered2.length!==1?'s':''}</span>
                </div>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr><th style={{...S.th,padding:'4px 6px'}}>Event</th><th style={{...S.th,padding:'4px 6px'}}>Time/Mark</th><th style={{...S.th,padding:'4px 6px',width:60}}></th><th style={{...S.th,padding:'4px 6px',width:110}}></th></tr></thead>
                  <tbody>
                    {filtered2.map(r=>{
                      const evt = events.find(e=>e.id===r.eventId);
                      if(!evt) return null;
                      const isField = isFieldEvent(evt);
                      const valStr = r.timeMs ? (isField ? fieldToStr(r.ft,r.inch,r.qtr) : formatTime(r.timeMs)) : (isField&&(r.ft||r.inch||r.qtr)?fieldToStr(r.ft,r.inch,r.qtr):'-');
                      const pr = !r.isRelaySplit && isPR(r);
                      const allQuals = getAllQualifying(r);
                      const relayComposite = r.isRelaySplit ? (r._relayTotal ? {timeMs:r._relayTotal} : athRelays.find(rr=>rr.eventId===r.eventId&&rr.date===r.date)) : null;
                      const relayQuals = r.isRelaySplit && relayComposite ? getAllQualifying({eventId:r.eventId,timeMs:relayComposite.timeMs,meetId:meetId,isRelay:true}) : [];
                      const isEditing = editResultId===r.id;
                      return [
                        <tr key={r.id}>
                          <td style={{...S.td,padding:'4px 6px',fontSize:12}}>
                            {getEventLabel(evt)}
                            {(()=>{const rr=normalizeRound(r.round);if(rr==='Open')return null;const clr=ROUND_COLOR[rr]||C.textMuted;return <span style={{fontSize:9,fontWeight:700,padding:'1px 7px',borderRadius:8,background:rr==='Final'?clr:'transparent',color:rr==='Final'?'#fff':clr,border:`1px solid ${clr}`,textTransform:'uppercase',letterSpacing:'0.05em',marginLeft:6}}>{rr}</span>;})()}
                            {r.isRelaySplit&&<span style={{fontSize:9,color:'#6b46c1',fontWeight:600,marginLeft:4}}>{r.relayLeg?`Leg ${r.relayLeg} split`:'Relay'}</span>}
                            {Array.isArray(r.splits)&&r.splits.length>=2&&<button style={{marginLeft:6,background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:10,fontWeight:600,padding:0}} onClick={()=>setSplitsOpen(p=>({...p,[r.id]:!p[r.id]}))} title="Show lap splits">{splitsOpen[r.id]?'▾':'▸'} splits</button>}
                          </td>
                          <td style={{...S.td,padding:'4px 6px',fontWeight:600,fontSize:13}}>
                            {valStr}
                            {r.place&&<span style={{fontSize:10,fontWeight:700,color:C.accent,marginLeft:8,padding:'1px 7px',borderRadius:8,background:C.accentMuted,border:`1px solid ${C.accent}`}}>{r.place}{r.place==='1'?'st':r.place==='2'?'nd':r.place==='3'?'rd':'th'}</span>}
                            {relayComposite&&<span style={{fontSize:10,color:C.textMuted,fontWeight:400,marginLeft:6}}>({formatTime(relayComposite.timeMs)} total)</span>}
                          </td>
                          <td style={{...S.td,padding:'4px 6px'}}>
                            <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                              {r.verified&&<VerifiedBadge verified={true} small />}
                              {pr && <span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:8,background:C.successMuted,color:C.success,border:`1px solid ${C.success}`}}>PR</span>}
                              {allQuals.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                              {relayQuals.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                              {r.isRelaySplit&&<span style={{fontSize:9,fontWeight:700,padding:'2px 6px',borderRadius:8,background:'#6b46c120',color:'#6b46c1',border:'1px solid #6b46c1'}}>R</span>}
                            </div>
                          </td>
                          <td style={{...S.td,padding:'4px 6px'}}>
                            {!r._fromComposite&&<div style={{display:'flex',gap:3}}>
                              {!r.verified&&<button style={{...S.btn,...S.btnSecondary,fontSize:9,padding:'2px 6px'}} onClick={()=>verifyResult(r.id)} title="Mark as verified">✓</button>}
                              {r.verified&&<button style={{...S.btn,fontSize:9,padding:'2px 6px',background:'rgba(43,108,176,0.1)',color:'#2b6cb0',border:'1px solid #2b6cb0'}} onClick={()=>unverifyResult(r.id)} title="Unverify">✓</button>}
                              <button style={{...S.btn,...S.btnSecondary,fontSize:9,padding:'2px 6px'}} onClick={()=>{if(isEditing){setEditResultId(null);}else{setEditResultId(r.id);if(isField)setEditResultForm({ft:r.ft||'',inch:r.inch||'',qtr:r.qtr||'',place:(r.place||'')+''});else{const ms=r.timeMs||0;setEditResultForm({min:Math.floor(ms/60000)+'',sec:((ms%60000)/1000).toFixed(2),place:(r.place||'')+''});}}}}>{isEditing?'Cancel':'Edit'}</button>
                              <button style={{...S.btn,...S.btnDanger,fontSize:9,padding:'2px 6px'}} onClick={()=>deleteResult(r.id)}>✕</button>
                            </div>}
                          </td>
                        </tr>,
                        isEditing&&<tr key={r.id+'-edit'}>
                          <td colSpan={4} style={{...S.td,padding:'6px',background:C.bg}}>
                            <div style={{display:'flex',gap:6,alignItems:'center'}}>
                              <span style={{fontSize:11,color:C.textSecondary,fontWeight:600}}>Official time:</span>
                              {isField ? (<>
                                <input style={{...S.input,width:50,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="numeric" placeholder="ft" value={editResultForm.ft} onChange={e=>setEditResultForm(f=>({...f,ft:e.target.value}))} />
                                <span style={{fontSize:11,color:C.textMuted}}>'</span>
                                <input style={{...S.input,width:50,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="numeric" placeholder="in" value={editResultForm.inch} onChange={e=>setEditResultForm(f=>({...f,inch:e.target.value}))} />
                                <span style={{fontSize:11,color:C.textMuted}}>"</span>
                                <input style={{...S.input,width:50,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="decimal" placeholder="qtr" value={editResultForm.qtr} onChange={e=>setEditResultForm(f=>({...f,qtr:e.target.value}))} />
                              </>) : (<>
                                <input style={{...S.input,width:50,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="numeric" value={editResultForm.min} onChange={e=>setEditResultForm(f=>({...f,min:e.target.value}))} />
                                <span style={{fontSize:11,color:C.textMuted}}>:</span>
                                <input style={{...S.input,width:70,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="decimal" placeholder="00.00" value={editResultForm.sec} onChange={e=>setEditResultForm(f=>({...f,sec:e.target.value}))} />
                              </>)}
                              <span style={{fontSize:11,color:C.textMuted,marginLeft:8}}>Place:</span>
                              <input style={{...S.input,width:46,fontSize:12,padding:'4px 6px',textAlign:'center'}} type="text" inputMode="numeric" placeholder="#" value={editResultForm.place||''} onChange={e=>setEditResultForm(f=>({...f,place:e.target.value}))} />
                              <button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'4px 12px'}} onClick={saveEditResult}>Save & Verify</button>
                            </div>
                          </td>
                        </tr>,
                        Array.isArray(r.splits)&&r.splits.length>=2&&splitsOpen[r.id]&&<tr key={r.id+'-splits'}>
                          <td colSpan={4} style={{padding:'4px 12px 8px',background:C.bg}}>
                            <div style={{display:'flex',gap:8,flexWrap:'wrap',fontSize:11}}>
                              {r.splits.map((sp,si)=>(
                                <div key={si} style={{padding:'3px 8px',background:C.surface2,border:`1px solid ${C.borderLight}`,borderRadius:4}}>
                                  <span style={{color:C.textMuted,marginRight:4}}>Lap {sp.lap||(si+1)}:</span>
                                  <span style={{fontWeight:600}}>{formatTime(sp.split||0)}</span>
                                  {sp.cumulative!=null&&<span style={{color:C.textMuted,marginLeft:4,fontSize:10}}>({formatTime(sp.cumulative)})</span>}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ];
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>);
      })()}
      {meetTab==='scores' && (()=>{
        const opponents = getOpponents(data);
        const dimensions = getOpponentDimensions(data);
        const scores = meet.teamScores || { mode: 'split', boys: [], girls: [], combined: [] };
        const mode = scores.mode || 'split';
        const updateScores = (next) => save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, teamScores:next}:m)});
        const setMode = (newMode) => updateScores({...scores, mode:newMode});
        const sectionRows = (key) => scores[key] || [];
        const setRows = (key, rows) => updateScores({...scores, [key]:rows});
        const addRow = (key) => setRows(key, [...sectionRows(key), {id:uid(), opponentId:'', points:'', place:''}]);
        const updateRow = (key, idx, patch) => setRows(key, sectionRows(key).map((r,i)=>i===idx?{...r,...patch}:r));
        const removeRow = (key, idx) => setRows(key, sectionRows(key).filter((_,i)=>i!==idx));
        const renderTable = (key, label, accentColor) => {
          const rows = sectionRows(key);
          const selfRow = rows.find(r=>r.opponentId==='self');
          const summary = selfRow && selfRow.place ? `${(team&&(team.school||team.name))||'Our Team'}: ${selfRow.place}${selfRow.place===1?'st':selfRow.place===2?'nd':selfRow.place===3?'rd':'th'} of ${rows.length}${selfRow.points!==''&&selfRow.points!=null?` (${selfRow.points} pts)`:''}` : null;
          return (
            <div style={{...S.card, padding:'12px 14px', marginBottom:14, borderLeft:`4px solid ${accentColor}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,gap:8,flexWrap:'wrap'}}>
                <div>
                  <h3 style={{margin:0,fontSize:14,color:accentColor,textTransform:'uppercase',letterSpacing:'0.05em'}}>{label}</h3>
                  {summary && <div style={{fontSize:11,color:C.textSecondary,marginTop:2,fontWeight:600}}>{summary}</div>}
                </div>
                <div style={{display:'flex',gap:6}}>
                  {rows.length>1 && <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textMuted,border:`1px solid ${C.border}`}} onClick={()=>{const sorted=[...rows].sort((a,b)=>{const pa=parseInt(a.place)||999,pb=parseInt(b.place)||999;return pa-pb;});setRows(key, sorted);}} title="Reorder rows so place 1 is on top">Sort by place</button>}
                  <button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'4px 10px'}} onClick={()=>{setTeamPickerTarget({key,idx:null});setTeamPickerSearch('');setTeamPickerSelected([]);setPickerNewName('');setPickerAdding(false);}}>+ Add team</button>
                </div>
              </div>
              {rows.length===0 ? (
                <div style={{padding:'14px',textAlign:'center',color:C.textMuted,fontSize:12,fontStyle:'italic',border:`1px dashed ${C.border}`,borderRadius:6}}>No team scores yet. Click "+ Add team" to start.</div>
              ) : (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr>
                      <th style={{...S.th,textAlign:'left'}}>Team</th>
                      <th style={{...S.th,textAlign:'left',width:240}}>Categories</th>
                      <th style={{...S.th,textAlign:'right',width:90}}>Points</th>
                      <th style={{...S.th,textAlign:'right',width:70}}>Place</th>
                      <th style={{...S.th,width:36}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r,idx)=>{
                      const isSelf = r.opponentId === 'self';
                      const dimLabel = getOpponentDimensionsLabel(r.opponentId, opponents, dimensions, data);
                      return (
                        <tr key={r.id||idx} style={{background:isSelf?C.accentMuted:'transparent'}}>
                          <td style={{...S.td,padding:'4px 6px'}}>
                            <button type="button" onClick={()=>{setTeamPickerTarget({key,idx});setTeamPickerSearch('');setTeamPickerSelected([]);setPickerNewName('');setPickerAdding(false);}} style={{...S.btn,fontSize:12,fontWeight:isSelf?700:500,width:'100%',textAlign:'left',padding:'5px 10px',background:r.opponentId?C.surface:C.bg,color:r.opponentId?(isSelf?C.accent:C.text):C.textMuted,border:`1px solid ${r.opponentId?C.border:C.borderLight}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:6}}>
                              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{isSelf?`${(team&&(team.school||team.name))||'Our Team'} (us)`:(r.opponentId?(opponents.find(o=>o.id===r.opponentId)?.name||'(removed)'):'(pick a team)')}</span>
                              <span style={{fontSize:10,color:C.textMuted,flexShrink:0}}>▾</span>
                            </button>
                          </td>
                          <td style={{...S.td,padding:'4px 6px',color:C.textMuted,fontSize:11}}>{dimLabel||<span style={{fontStyle:'italic',color:C.textMuted}}>{isSelf?'(set under Settings → Opponents)':'(no categories)'}</span>}</td>
                          <td style={{...S.td,padding:'4px 6px',textAlign:'right'}}><input style={{...S.input,fontSize:12,textAlign:'right',padding:'4px 8px'}} type="number" step="0.5" value={r.points==null?'':r.points} onChange={e=>updateRow(key,idx,{points:e.target.value===''?'':parseFloat(e.target.value)})} /></td>
                          <td style={{...S.td,padding:'4px 6px',textAlign:'right'}}><input style={{...S.input,fontSize:12,textAlign:'right',padding:'4px 8px'}} type="number" min="1" value={r.place==null?'':r.place} onChange={e=>updateRow(key,idx,{place:e.target.value===''?'':parseInt(e.target.value)})} /></td>
                          <td style={{...S.td,padding:'4px 6px',textAlign:'center'}}><button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:14}} onClick={()=>removeRow(key,idx)} title="Remove team">✕</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        };
        return (
          <div>
            <div style={{...S.card,padding:'12px 14px',marginBottom:14}}>
              <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap'}}>
                <span style={{fontSize:11,fontWeight:700,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.05em'}}>Scoring</span>
                {[['split','Split Boys & Girls'],['combined','Combined']].map(([k,lbl])=>(
                  <label key={k} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,cursor:'pointer'}}>
                    <input type="radio" name={`scoresMode-${meetId}`} checked={mode===k} onChange={()=>setMode(k)} />
                    <span>{lbl}</span>
                  </label>
                ))}
                {opponents.length===0 && <span style={{marginLeft:'auto',fontSize:11,color:C.textMuted,fontStyle:'italic'}}>Tip: add opponent schools in Settings → Opponents to tag league status.</span>}
              </div>
            </div>
            {mode==='split' ? (<>
              {renderTable('boys','Boys', '#2b6cb0')}
              {renderTable('girls','Girls', '#c53030')}
            </>) : (
              renderTable('combined','Combined', C.accent)
            )}
            <Modal open={!!teamPickerTarget} onClose={()=>setTeamPickerTarget(null)} width={520}>
              <h2 style={S.h2}>{teamPickerTarget && teamPickerTarget.idx===null ? 'Add a team' : 'Pick a team'}</h2>
              {(()=>{
                const tgt = teamPickerTarget || {};
                const isAddMode = tgt.idx === null;
                const currentId = !isAddMode && tgt.key && tgt.idx!=null ? ((scores[tgt.key]||[])[tgt.idx]||{}).opponentId : null;
                const usedIds = new Set((tgt.key?scores[tgt.key]||[]:[]).map((r,i)=>(!isAddMode && i===tgt.idx)?null:r.opponentId).filter(Boolean));
                const selfLabel = (team&&(team.school||team.name))||'Our Team';
                const ourDV = getOurTeamDimensionValues(data);
                const selfMatch = {id:'self', name:`${selfLabel} (us)`, dimensionValues:ourDV};
                const filtered = [selfMatch, ...opponents].filter(o=>{
                  if(teamPickerSearch.trim() && !o.name.toLowerCase().includes(teamPickerSearch.toLowerCase())) return false;
                  for(const [dimId, valueId] of Object.entries(teamPickerFilters)) {
                    if(!valueId) continue;
                    const assigned = (o.dimensionValues||{})[dimId];
                    if(valueId === '__none') { if(assigned) return false; }
                    else if(assigned !== valueId) return false;
                  }
                  return true;
                }).sort((a,b)=>{
                  if(a.id==='self') return -1;
                  if(b.id==='self') return 1;
                  return teamPickerSort==='asc'?a.name.localeCompare(b.name):b.name.localeCompare(a.name);
                });
                const pick = (opponentId) => {
                  if(!tgt.key) return;
                  setRows(tgt.key, (scores[tgt.key]||[]).map((r,i)=>i===tgt.idx?{...r,opponentId}:r));
                  setTeamPickerTarget(null);
                };
                const toggleSelected = (oppId) => {
                  if(usedIds.has(oppId)) return;
                  setTeamPickerSelected(sel => sel.includes(oppId) ? sel.filter(x=>x!==oppId) : [...sel, oppId]);
                };
                const addSelected = () => {
                  if(!tgt.key || !teamPickerSelected.length) return;
                  const newRows = teamPickerSelected.map(opponentId => ({id:uid(), opponentId, points:'', place:''}));
                  const otherKey = mode==='split' && (tgt.key==='boys'||tgt.key==='girls') ? (tgt.key==='boys'?'girls':'boys') : null;
                  if(otherKey && pickerMirror) {
                    const existingOther = new Set((scores[otherKey]||[]).map(r=>r.opponentId).filter(Boolean));
                    const mirrorRows = teamPickerSelected.filter(id => !existingOther.has(id)).map(opponentId => ({id:uid(), opponentId, points:'', place:''}));
                    const nextScores = {...scores, [tgt.key]: [...(scores[tgt.key]||[]), ...newRows], [otherKey]: [...(scores[otherKey]||[]), ...mirrorRows]};
                    updateScores(nextScores);
                  } else {
                    setRows(tgt.key, [...(scores[tgt.key]||[]), ...newRows]);
                  }
                  setTeamPickerTarget(null); setTeamPickerSelected([]);
                };
                const selectableIds = filtered.filter(o => !usedIds.has(o.id)).map(o=>o.id);
                const allFilteredSelected = selectableIds.length>0 && selectableIds.every(id => teamPickerSelected.includes(id));
                const toggleSelectAll = () => {
                  if(allFilteredSelected) {
                    setTeamPickerSelected(sel => sel.filter(id => !selectableIds.includes(id)));
                  } else {
                    setTeamPickerSelected(sel => Array.from(new Set([...sel, ...selectableIds])));
                  }
                };
                const addNewOpponent = () => {
                  const name = pickerNewName.trim();
                  if(!name) return;
                  const dupe = (data.opponents||[]).find(o=>(o.name||'').trim().toLowerCase()===name.toLowerCase());
                  if(dupe) {
                    if(isAddMode && !usedIds.has(dupe.id) && !teamPickerSelected.includes(dupe.id)) setTeamPickerSelected(sel=>[...sel,dupe.id]);
                    setPickerNewName(''); setPickerAdding(false);
                    return;
                  }
                  const newOpp = { id:uid(), name, dimensionValues:{} };
                  save({...data, opponents:[...(data.opponents||[]), newOpp]});
                  if(isAddMode) setTeamPickerSelected(sel=>[...sel, newOpp.id]);
                  else pick(newOpp.id);
                  setPickerNewName(''); setPickerAdding(false);
                };
                const activeFilterCount = Object.values(teamPickerFilters).filter(v=>v).length;
                return (
                  <div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:6}}>
                      <input style={{...S.input,fontSize:12,padding:'4px 8px',flex:'1 1 160px',minWidth:120}} placeholder="Search by name…" value={teamPickerSearch} autoFocus onChange={e=>setTeamPickerSearch(e.target.value)} />
                      {dimensions.map(d=>(
                        <select key={d.id} style={{...S.select,fontSize:11,padding:'3px 6px'}} value={teamPickerFilters[d.id]||''} onChange={e=>setTeamPickerFilters(f=>({...f,[d.id]:e.target.value}))} title={`Filter by ${d.name}`}>
                          <option value="">All {d.name}</option>
                          <option value="__none">— No {d.name}</option>
                          {getDimensionValues(d).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                      ))}
                      <button onClick={()=>setTeamPickerSort(d=>d==='asc'?'desc':'asc')} style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`}}>Name {teamPickerSort==='asc'?'↑':'↓'}</button>
                      {(activeFilterCount>0||teamPickerSearch) && <button onClick={()=>{setTeamPickerFilters({});setTeamPickerSearch('');}} style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.danger,border:`1px solid ${C.danger}`}}>Clear</button>}
                      {isAddMode && selectableIds.length>0 && <button onClick={toggleSelectAll} style={{...S.btn,fontSize:11,padding:'4px 10px',background:allFilteredSelected?C.accent:'transparent',color:allFilteredSelected?'#fff':C.accent,border:`1px solid ${C.accent}`}}>{allFilteredSelected?`Deselect ${selectableIds.length}`:`Select all (${selectableIds.length})`}</button>}
                    </div>
                    {pickerAdding ? (
                      <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:10,padding:'8px 10px',background:C.accentMuted,borderRadius:6,border:`1px solid ${C.accent}`}}>
                        <input style={{...S.input,fontSize:12,padding:'5px 8px',flex:1}} placeholder="New opponent name (e.g. Lincoln HS)" value={pickerNewName} autoFocus onChange={e=>setPickerNewName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addNewOpponent();else if(e.key==='Escape'){setPickerAdding(false);setPickerNewName('');}}} />
                        <button onClick={addNewOpponent} style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'4px 12px'}} disabled={!pickerNewName.trim()}>Add</button>
                        <button onClick={()=>{setPickerAdding(false);setPickerNewName('');}} style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{marginBottom:8,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                        <button onClick={()=>setPickerAdding(true)} style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.accent,border:`1px dashed ${C.accent}`}}>+ Add new opponent</button>
                        <span style={{fontSize:10,color:C.textMuted,fontStyle:'italic'}}>Categorize later under Settings → Opponents.</span>
                      </div>
                    )}
                    <div style={{maxHeight:'52vh',overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
                      {filtered.length===0 ? (
                        <div style={{padding:18,textAlign:'center',color:C.textMuted,fontSize:12,fontStyle:'italic'}}>No teams match these filters.</div>
                      ) : filtered.map(o=>{
                        const isOurSelf = o.id==='self';
                        const isCurrent = o.id===currentId;
                        const isUsed = usedIds.has(o.id);
                        const isChecked = teamPickerSelected.includes(o.id);
                        const label = isOurSelf ? getDimensionsLabelForValues(ourDV, dimensions) : getOpponentDimensionsLabel(o.id, opponents, dimensions, data);
                        const anyAssigned = isOurSelf ? Object.values(ourDV||{}).some(Boolean) : Object.values(o.dimensionValues||{}).some(Boolean);
                        const rowBg = isAddMode ? (isChecked?C.accentMuted:(isUsed?C.bg:'transparent')) : (isCurrent?C.accentMuted:(isUsed?C.bg:'transparent'));
                        return (
                          <div key={o.id} onClick={()=>{if(isAddMode) toggleSelected(o.id); else pick(o.id);}} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,padding:'8px 12px',borderBottom:`1px solid ${C.borderLight}`,cursor:(isAddMode&&isUsed)?'not-allowed':'pointer',background:rowBg,opacity:(isAddMode&&isUsed)?0.55:1}}>
                            {isAddMode && <input type="checkbox" checked={isChecked} disabled={isUsed} onChange={()=>toggleSelected(o.id)} onClick={e=>e.stopPropagation()} style={{cursor:isUsed?'not-allowed':'pointer'}} />}
                            <div style={{minWidth:0,flex:1}}>
                              <div style={{fontSize:13,fontWeight:isOurSelf?700:600,color:isOurSelf?C.accent:C.text}}>{o.name}{isUsed&&<span style={{fontSize:10,color:C.textMuted,marginLeft:6,fontWeight:500}}>(already used)</span>}</div>
                              <div style={{fontSize:11,color:C.textMuted,marginTop:2,fontStyle:anyAssigned?'normal':'italic'}}>{anyAssigned?label:'(no categories)'}</div>
                            </div>
                            {!isAddMode && isCurrent && <span style={{fontSize:11,fontWeight:700,color:C.accent}}>Current</span>}
                          </div>
                        );
                      })}
                    </div>
                    {isAddMode && mode==='split' && (tgt.key==='boys'||tgt.key==='girls') && (
                      <label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:C.textSecondary,marginTop:8,padding:'6px 10px',background:C.bg,borderRadius:5,cursor:'pointer'}}>
                        <input type="checkbox" checked={pickerMirror} onChange={e=>setPickerMirror(e.target.checked)} />
                        Also add to {tgt.key==='boys'?'Girls':'Boys'} <span style={{color:C.textMuted,fontStyle:'italic'}}>(skip teams already there)</span>
                      </label>
                    )}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12,gap:8,flexWrap:'wrap'}}>
                      <div style={{fontSize:11,color:C.textMuted}}>{isAddMode ? (teamPickerSelected.length>0 ? `${teamPickerSelected.length} selected` : `Tap rows or checkboxes to add teams`) : ((activeFilterCount>0||teamPickerSearch)?`Showing ${filtered.length} of ${opponents.length+1}`:`${filtered.length} team${filtered.length===1?'':'s'}`)}</div>
                      <div style={{display:'flex',gap:6}}>
                        {!isAddMode && currentId && <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.danger,border:`1px solid ${C.danger}`}} onClick={()=>pick('')}>Clear selection</button>}
                        <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'5px 14px'}} onClick={()=>setTeamPickerTarget(null)}>Cancel</button>
                        {isAddMode && <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'5px 14px',opacity:teamPickerSelected.length===0?0.5:1,cursor:teamPickerSelected.length===0?'not-allowed':'pointer'}} disabled={teamPickerSelected.length===0} onClick={addSelected}>Add {teamPickerSelected.length || ''} team{teamPickerSelected.length===1?'':'s'}</button>}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Modal>
          </div>
        );
      })()}
      <Modal open={showManageEvents} onClose={()=>setShowManageEvents(false)} width={640}>
        <h2 style={S.h2}>Manage Events for this Meet</h2>
        <p style={{fontSize:12,color:C.textMuted,marginTop:4,marginBottom:12}}>Uncheck events to hide them. Add meet-specific events (they'll be saved to the library but won't appear in other meets unless added).</p>
        <div style={{padding:'10px 14px',marginBottom:16,background:C.bg,borderRadius:8,border:`1px solid ${C.borderLight}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:8}}>Entry Limits (optional)</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            <div>
              <label style={{fontSize:11,color:C.textMuted,display:'block',marginBottom:2}}>Max events per athlete</label>
              <input style={{...S.input,fontSize:13}} type="text" inputMode="numeric" placeholder="No limit" value={meet.maxEventsPerAthlete||''} onChange={e=>{const v=parseInt(e.target.value)||0;save({...data,meets:data.meets.map(m=>m.id===meetId?{...m,maxEventsPerAthlete:v}:m)});}} />
            </div>
            <div>
              <label style={{fontSize:11,color:C.textMuted,display:'block',marginBottom:2}}>Max per individual event</label>
              <input style={{...S.input,fontSize:13}} type="text" inputMode="numeric" placeholder="No limit" value={meet.maxEntriesPerEvent||''} onChange={e=>{const v=parseInt(e.target.value)||0;save({...data,meets:data.meets.map(m=>m.id===meetId?{...m,maxEntriesPerEvent:v}:m)});}} />
            </div>
            <div>
              <label style={{fontSize:11,color:C.textMuted,display:'block',marginBottom:2}}>Max per relay event</label>
              <input style={{...S.input,fontSize:13}} type="text" inputMode="numeric" placeholder="No limit" value={meet.maxRelayEntries||''} onChange={e=>{const v=parseInt(e.target.value)||0;save({...data,meets:data.meets.map(m=>m.id===meetId?{...m,maxRelayEntries:v}:m)});}} />
            </div>
          </div>
          <p style={{fontSize:10,color:C.textMuted,marginTop:6,marginBottom:0}}>Set to 0 or leave blank for no limit. Violations show as warnings on the meet page.</p>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Default events ({defaultApplicable.length})</div>
          <div style={{maxHeight:240,overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
            {defaultApplicable.sort((a,b)=>getDefaultOrder(a)-getDefaultOrder(b)).map(e=>{
              const excluded = excludedEvents.includes(e.id);
              return (
                <label key={e.id} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',borderBottom:`1px solid ${C.borderLight}`,cursor:'pointer',background:excluded?C.surface2:'transparent'}}>
                  <input type="checkbox" checked={!excluded} onChange={()=>toggleExcludeEvent(e.id)} />
                  <span style={{flex:1,fontSize:13,opacity:excluded?0.5:1,textDecoration:excluded?'line-through':'none'}}>{getEventLabel(e)}</span>
                  <span style={{fontSize:10,color:C.textMuted}}>{e.eventType} / {e.entryType}</span>
                </label>
              );
            })}
          </div>
        </div>
        {customEvents.length>0&&(
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:C.accent,textTransform:'uppercase',marginBottom:6}}>Meet-specific events ({customEvents.length})</div>
            <div style={{border:`1px solid ${C.accent}33`,borderRadius:6}}>
              {customEvents.map(e=>(
                <div key={e.id} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',borderBottom:`1px solid ${C.borderLight}`}}>
                  <span style={{flex:1,fontSize:13,fontWeight:500}}>{getEventLabel(e)}</span>
                  <span style={{fontSize:10,color:C.textMuted}}>{e.eventType} / {e.entryType}</span>
                  <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>removeCustomEventFromMeet(e.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {(()=>{
          const libAvailable = (data.events||[]).filter(e=>e.meetSpecific&&!customEventIds.includes(e.id)&&(e.trackType===meet.trackType||e.trackType==='Both'));
          return libAvailable.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Available from library</div>
              <div style={{maxHeight:150,overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
                {libAvailable.map(e=>(
                  <div key={e.id} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',borderBottom:`1px solid ${C.borderLight}`}}>
                    <span style={{flex:1,fontSize:13}}>{getEventLabel(e)}</span>
                    <span style={{fontSize:10,color:C.textMuted}}>{e.eventType} / {e.entryType}</span>
                    <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>addCustomEventToMeet(e.id)}>+ Add</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        <div style={{padding:12,background:C.bg,borderRadius:6,border:`1px solid ${C.borderLight}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:8}}>+ Create new meet-specific event</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
            <div><label style={{fontSize:11,color:C.textMuted}}>Name</label><input style={{...S.input,fontSize:12}} placeholder="e.g. 2000m Racewalk" value={newEventForm.name} onChange={e=>setNewEventForm({...newEventForm,name:e.target.value})} /></div>
            <div><label style={{fontSize:11,color:C.textMuted}}>Gender</label><select style={{...S.select,fontSize:12}} value={newEventForm.gender} onChange={e=>setNewEventForm({...newEventForm,gender:e.target.value})}><option>Boy</option><option>Girl</option><option>Mixed</option></select></div>
            <div><label style={{fontSize:11,color:C.textMuted}}>Event Type</label><select style={{...S.select,fontSize:12}} value={newEventForm.eventType} onChange={e=>setNewEventForm({...newEventForm,eventType:e.target.value})}><option>Track</option><option>Field</option></select></div>
            <div><label style={{fontSize:11,color:C.textMuted}}>Entry Type</label><select style={{...S.select,fontSize:12}} value={newEventForm.entryType} onChange={e=>setNewEventForm({...newEventForm,entryType:e.target.value})}><option>Individual</option><option>Relay</option></select></div>
            <div><label style={{fontSize:11,color:C.textMuted}}>Measured As</label><select style={{...S.select,fontSize:12}} value={newEventForm.measurableType} onChange={e=>setNewEventForm({...newEventForm,measurableType:e.target.value})}><option>Time</option><option>Length</option><option>Height</option></select></div>
          </div>
          <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'6px 14px'}} onClick={createAndAddEvent} disabled={!newEventForm.name.trim()}>Create & Add to Meet</button>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowManageEvents(false)}>Done</button>
        </div>
      </Modal>
      <Modal open={showReorderModal} onClose={()=>setShowReorderModal(false)} width={560}>
        <h2 style={S.h2}>Reorder Events</h2>
        <p style={{fontSize:12,color:C.textMuted,marginTop:4,marginBottom:10}}>Drag a row by its handle, or use the up/down buttons. Save to apply.{meetDayCount>1?' Day groups are shown for reference — events keep their assigned day after reordering.':''}</p>
        <div style={{maxHeight:'60vh',overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
          {reorderList.length === 0 && <div style={{padding:20,textAlign:'center',color:C.textMuted,fontSize:12}}>No events to reorder.</div>}
          {(()=>{ let lastDay=null; return reorderList.map((row, idx) => {
            const evt = events.find(e=>e.id===row.eventId);
            if(!evt) return null;
            const isOver = reorderDragOver===idx && reorderDragIdx!==idx && reorderDragIdx!==null;
            const isDragging = reorderDragIdx===idx;
            const r = normalizeRound(row.round);
            const sameEventRoundCount = reorderList.filter(x=>x.eventId===row.eventId).length;
            const showRoundBadge = r!=='Open' || sameEventRoundCount>1;
            const roundClr = ROUND_COLOR[r]||C.textMuted;
            const showDayHeader = meetDayCount>1 && row.day!==lastDay;
            lastDay = row.day;
            const rowKey = `${row.eventId}::${r}::${row.day}::${idx}`;
            return (
              <React.Fragment key={rowKey}>
                {showDayHeader && <div style={{fontSize:11,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',letterSpacing:'0.05em',padding:'8px 12px 4px',borderBottom:`2px solid ${C.border}`,background:C.surface2,position:'sticky',top:0,zIndex:1}}>Day {row.day}</div>}
                <div
                  draggable
                  onDragStart={e=>{setReorderDragIdx(idx);try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(idx));}catch(_){}}}
                  onDragOver={e=>{e.preventDefault();if(reorderDragOver!==idx)setReorderDragOver(idx);}}
                  onDragLeave={()=>{if(reorderDragOver===idx)setReorderDragOver(null);}}
                  onDrop={e=>{e.preventDefault();if(reorderDragIdx===null||reorderDragIdx===idx){setReorderDragIdx(null);setReorderDragOver(null);return;}const next=[...reorderList];const [moved]=next.splice(reorderDragIdx,1);next.splice(idx,0,moved);setReorderList(next);setReorderDragIdx(null);setReorderDragOver(null);}}
                  onDragEnd={()=>{setReorderDragIdx(null);setReorderDragOver(null);}}
                  style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderBottom:`1px solid ${C.borderLight}`,background:isDragging?C.surface2:(isOver?C.accentMuted:C.surface),borderTop:isOver?`2px solid ${C.accent}`:'2px solid transparent',cursor:'grab',userSelect:'none'}}>
                  <span style={{fontSize:18,color:C.textMuted,minWidth:18,textAlign:'center',cursor:'grab'}} title="Drag to reorder">⋮⋮</span>
                  <span style={{fontSize:11,color:C.textMuted,minWidth:24,textAlign:'right'}}>{idx+1}.</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                      <span style={{fontSize:13,fontWeight:600,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getEventLabel(evt)}</span>
                      {showRoundBadge && <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:9,background:r==='Final'?roundClr:'transparent',color:r==='Final'?'#fff':roundClr,border:`1px solid ${roundClr}`,textTransform:'uppercase',letterSpacing:'0.05em'}}>{r}</span>}
                    </div>
                    <div style={{fontSize:10,color:C.textMuted}}>{evt.eventType} · {evt.entryType}{evt.gender?` · ${evt.gender==='Boy'?'Boys':evt.gender==='Girl'?'Girls':evt.gender}`:''}</div>
                  </div>
                  <div style={{display:'flex',gap:2}}>
                    <button style={{background:'none',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:'4px 8px',cursor:idx===0?'default':'pointer',opacity:idx===0?0.3:1,fontSize:12}} disabled={idx===0} title="Move up" onClick={()=>{if(idx===0)return;const next=[...reorderList];const [m]=next.splice(idx,1);next.splice(idx-1,0,m);setReorderList(next);}}>↑</button>
                    <button style={{background:'none',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:'4px 8px',cursor:idx>=reorderList.length-1?'default':'pointer',opacity:idx>=reorderList.length-1?0.3:1,fontSize:12}} disabled={idx>=reorderList.length-1} title="Move down" onClick={()=>{if(idx>=reorderList.length-1)return;const next=[...reorderList];const [m]=next.splice(idx,1);next.splice(idx+1,0,m);setReorderList(next);}}>↓</button>
                  </div>
                </div>
              </React.Fragment>
            );
          }); })()}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,marginTop:14,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <button style={{...S.btn,fontSize:11,padding:'6px 10px',background:'transparent',color:C.textMuted,border:`1px solid ${C.border}`}} onClick={()=>setReorderList(buildReorderRows())}>Reset to current order</button>
            {eventOrder.length > 0 && <button style={{...S.btn,fontSize:11,padding:'6px 10px',background:'transparent',color:C.danger,border:`1px solid ${C.danger}`}} onClick={()=>{if(!window.confirm('Clear the custom order for this meet and fall back to the template default?')) return; saveEventOrder([]); setShowReorderModal(false);}} title="Clear this meet's custom order and fall back to the template default">Reset to template default</button>}
            <button style={{...S.btn,fontSize:11,padding:'6px 10px',background:'transparent',color:C.accent,border:`1px solid ${C.accent}`}} onClick={()=>{
              const name = window.prompt('Save current order as a new template — name it:', `Order from ${meet.name||'this meet'}`);
              if(!name) return;
              const uniqIds = dedupeEventIds(reorderList);
              const entries = uniqIds.map(eid=>{const e=events.find(ev=>ev.id===eid); return e?{name:e.name, gender:e.gender}:null;}).filter(Boolean);
              if(!entries.length) { alert('No events to save.'); return; }
              const newTemplate = { id:uid(), name:name.trim(), isDefault:false, entries };
              const templates = [...(data.eventOrderTemplates||[]), newTemplate];
              save({...data, eventOrderTemplates:templates, meets:data.meets.map(m=>m.id===meetId?{...m, eventOrderTemplateId:newTemplate.id}:m)});
              alert(`Saved as "${name.trim()}" and pinned to this meet. You can edit it under Settings → Event Order.`);
            }}>Save as new template…</button>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowReorderModal(false)}>Cancel</button>
            <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{saveEventOrder(dedupeEventIds(reorderList));setShowReorderModal(false);}}>Save Order</button>
          </div>
        </div>
      </Modal>
      <MeetEntryModal data={data} save={save} meetId={meetId} eventId={(showEntryModal||{}).eventId||null} round={(showEntryModal||{}).round||'Open'} events={events} open={!!showEntryModal} onClose={()=>{setShowEntryModal(null);setEditEntryIdx(null);}} getAthletePR={getAthletePR} saveEntries={saveEntries} editEntryIdx={editEntryIdx} />
    </div>
  );
}
function MeetEntryModal({ data, save, meetId, eventId, round, events, open, onClose, getAthletePR, saveEntries, editEntryIdx }) {
  const meRound = round || 'Open';
  const [entries, setEntries] = useState([{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' }]);
  const [relayAthletes, setRelayAthletes] = useState([{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' }]);
  const [relayAlternates, setRelayAlternates] = useState([]);
  const [restrictionError, setRestrictionError] = useState('');
  const [focusField, setFocusField] = useState('');
  const [dragLeg, setDragLeg] = useState(null);
  const [dragOverLeg, setDragOverLeg] = useState(null);
  const [sortByRank, setSortByRank] = useState(false);
  const initRef = useRef(null);
  const blurRef = useRef(null);
  const handleFocus = (f) => { clearTimeout(blurRef.current); setFocusField(f); };
  const handleBlur = () => { blurRef.current = setTimeout(()=>setFocusField(''), 200); };
  if(!open || !eventId) return null;
  const evt = events.find(e=>e.id===eventId);
  if(!evt) return null;
  const meet = data.meets.find(m=>m.id===meetId);
  const me = ((meet||{}).events||[]).find(e=>e.eventId===eventId && (e.round||'Open')===meRound);
  const existingEntries = (me||{}).entries || [];
  const maxEntries = evt && evt.entryType==='Relay' ? ((meet||{}).maxRelayEntries || null) : ((meet||{}).maxEntriesPerEvent || null);
  const maxEvents = (meet||{}).maxEventsPerAthlete || null;
  const countAthleteEvents = (athleteId, excludeEventId, excludeEntryIdx) => {
    let count = 0;
    ((meet||{}).events||[]).forEach(mev => {
      (mev.entries||[]).forEach((en, idx) => {
        if(excludeEventId===mev.eventId && excludeEntryIdx===idx) return;
        if(en.athletes) {
          if((en.athletes||[]).some(a=>a.athleteId===athleteId)) count++;
        } else if(en.athleteId===athleteId) count++;
      });
    });
    return count;
  };
  const validateRestrictions = (newAthleteIds, isRelayEntry) => {
    const errors = [];
    if(maxEntries) {
      const currentCount = existingEntries.length - (isEditing ? 1 : 0);
      if(currentCount + 1 > maxEntries) errors.push(`Max ${maxEntries} entries per event for this meet (${currentCount} already entered)`);
    }
    if(maxEvents) {
      newAthleteIds.forEach(aid => {
        const existing = countAthleteEvents(aid, isEditing?eventId:null, isEditing?editEntryIdx:null);
        if(existing + 1 > maxEvents) {
          const ath = data.athletes.find(a=>a.id===aid);
          errors.push(`${ath?athDisplay(ath):'Athlete'} would exceed max ${maxEvents} events (${existing} already)`);
        }
      });
    }
    return errors;
  };
  const isEditing = editEntryIdx != null && editEntryIdx >= 0 && editEntryIdx < existingEntries.length;
  const editKey = eventId+'-'+editEntryIdx;
  if(initRef.current !== editKey) {
    initRef.current = editKey;
    if(isEditing) {
      const en = existingEntries[editEntryIdx];
      if(evt.entryType==='Relay' && en && en.athletes) {
        setRelayAthletes(en.athletes.map(a=>{
          const ath=data.athletes.find(at=>at.id===a.athleteId);
          const ms=a.goalMs||0;
          return {athleteId:a.athleteId,search:ath?athDisplay(ath):'',goalMin:Math.floor(ms/60000)+'',goalSec:((ms%60000)/1000).toFixed(2),goalSource:a.goalSource||'custom'};
        }));
        setRelayAlternates((en.alternates||[]).map(a=>{
          const ath=data.athletes.find(at=>at.id===a.athleteId);
          return {athleteId:a.athleteId,search:ath?athDisplay(ath):''};
        }));
      } else if(en && en.athleteId) {
        const ath=data.athletes.find(a=>a.id===en.athleteId);
        const ms=en.goalMs||0;
        setEntries([{athleteId:en.athleteId,search:ath?athDisplay(ath):'',goalMin:Math.floor(ms/60000)+'',goalSec:((ms%60000)/1000).toFixed(2),goalSource:en.goalSource||'custom'}]);
      }
    } else {
      setEntries([{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' }]);
      setRelayAthletes([{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' }]);
      setRelayAlternates([]);
    }
  }
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const genderMatch = activeAthletes.filter(a=>!evt.gender || evt.gender==='Mixed' || a.gender===(evt.gender==='Boy'?'M':'F'));
  const athName = (a) => athDisplay(a);
  const resolveGoalMs = (en) => {
    const src = en.goalSource || 'custom';
    if(src.startsWith('std:')) {
      const sid = src.slice(4);
      const s = (evt.qualifyingStandards||[]).find(st=>st.id===sid);
      return s ? (s.timeMs||0) : 0;
    }
    if(src === 'pr' && en.athleteId) {
      const pr = getAthletePR(en.athleteId, eventId);
      return pr ? (pr.timeMs||0) : 0;
    }
    return parseTimeToMs(en.goalMin, en.goalSec);
  };
  const saveIndividuals = () => {
    const valid = entries.filter(en=>en.athleteId);
    if(!valid.length) return;
    const ids = valid.map(en=>en.athleteId);
    if(maxEntries) {
      const currentCount = existingEntries.length - (isEditing ? 1 : 0);
      if(currentCount + valid.length > maxEntries) { setRestrictionError(`Max ${maxEntries} entries per event for this meet. Currently ${currentCount} entered, trying to add ${valid.length}.`); return; }
    }
    if(maxEvents) {
      const errors = [];
      ids.forEach(aid => {
        const existing = countAthleteEvents(aid, isEditing?eventId:null, isEditing?editEntryIdx:null);
        if(existing + 1 > maxEvents) {
          const ath = data.athletes.find(a=>a.id===aid);
          errors.push(`${ath?athDisplay(ath):'Athlete'} would exceed max ${maxEvents} events (${existing} already)`);
        }
      });
      if(errors.length) { setRestrictionError(errors.join('. ')); return; }
    }
    setRestrictionError('');
    const newEntries = valid.map(en=>({ athleteId:en.athleteId, goalMs:resolveGoalMs(en), goalSource:en.goalSource||'custom' }));
    if(isEditing) {
      const updated = [...existingEntries]; updated[editEntryIdx] = newEntries[0];
      saveEntries(eventId, updated, meRound);
    } else {
      saveEntries(eventId, [...existingEntries, ...newEntries], meRound);
    }
    initRef.current = null;
    setEntries([{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' }]);
    onClose();
  };
  const saveRelay = () => {
    const athletes = relayAthletes.filter(a=>a.athleteId).map(a=>({ athleteId:a.athleteId, goalMs:resolveGoalMs(a), goalSource:a.goalSource||'custom' }));
    const alternates = relayAlternates.filter(a=>a.athleteId).map(a=>({ athleteId:a.athleteId }));
    if(!athletes.length) return;
    if(maxEntries) {
      const currentCount = existingEntries.length - (isEditing ? 1 : 0);
      if(currentCount + 1 > maxEntries) { setRestrictionError(`Max ${maxEntries} relay entries per event for this meet.`); return; }
    }
    if(maxEvents) {
      const errors = [];
      athletes.forEach(a => {
        const existing = countAthleteEvents(a.athleteId, isEditing?eventId:null, isEditing?editEntryIdx:null);
        if(existing + 1 > maxEvents) {
          const ath = data.athletes.find(at=>at.id===a.athleteId);
          errors.push(`${ath?athDisplay(ath):'Athlete'} would exceed max ${maxEvents} events (${existing} already)`);
        }
      });
      if(errors.length) { setRestrictionError(errors.join('. ')); return; }
    }
    setRestrictionError('');
    if(isEditing) {
      const updated = [...existingEntries]; updated[editEntryIdx] = { athletes, alternates };
      saveEntries(eventId, updated, meRound);
    } else {
      saveEntries(eventId, [...existingEntries, { athletes, alternates }], meRound);
    }
    initRef.current = null;
    setRelayAthletes([{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' },{ athleteId:'', search:'', goalMin:0, goalSec:0, goalSource:'custom' }]);
    setRelayAlternates([]);
    onClose();
  };
  const handleLegDrop = (from, to) => {
    if(from===to) return;
    const arr = [...relayAthletes];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setRelayAthletes(arr);
  };
  const filteredAthletes = (search, excludeIds=[]) => {
    let list = genderMatch.filter(a=>
      !excludeIds.includes(a.id) && (!search || athSearch(a, search))
    );
    if(sortByRank) {
      const isField = isFieldEvent(evt);
      const isRelayEvt = evt.entryType==='Relay';
      const baseDistance = isRelayEvt ? getDistance(evt)/4 : 0;
      const getIndividualRank = (athId) => {
        if(isRelayEvt && baseDistance>0) {
          const indivEvt = events.find(e=>e.entryType==='Individual'&&getDistance(e)===baseDistance&&(e.gender===evt.gender||evt.gender==='Mixed'));
          if(indivEvt) {
            const pr = getAthletePR(athId, indivEvt.id);
            if(pr) return isFieldEvent(indivEvt)?(pr.ft||0)*12+(pr.inch||0)+(pr.qtr||0):pr.timeMs;
          }
          const splits = (data.results||[]).filter(r=>r.athleteId===athId&&r.eventId===eventId&&r.isRelaySplit);
          if(splits.length) return splits.reduce((best,r)=>(!best||r.timeMs<best.timeMs)?r:best,null).timeMs;
          return null;
        }
        const pr = getAthletePR(athId, eventId);
        if(!pr) return null;
        return isField ? (pr.ft||0)*12+(pr.inch||0)+(pr.qtr||0) : pr.timeMs;
      };
      list = list.map(a=>({a, rankVal:getIndividualRank(a.id)}));
      list.sort((x,y)=>{
        if(x.rankVal===null && y.rankVal===null) return athLast(x.a).localeCompare(athLast(y.a));
        if(x.rankVal===null) return 1;
        if(y.rankVal===null) return -1;
        return isField ? y.rankVal-x.rankVal : x.rankVal-y.rankVal;
      });
      list = list.map(x=>x.a);
    }
    return list;
  };
  const renderRow = (row, index, fieldPrefix, rows, setRows, excludeIds) => {
    const fieldName = `${fieldPrefix}-${index}`;
    const opts = filteredAthletes(row.search, excludeIds);
    const pr = row.athleteId ? getAthletePR(row.athleteId, eventId) : null;
    return (
      <div key={index} style={{display:'flex',gap:6,alignItems:'flex-start',marginBottom:8,flexWrap:'wrap'}}>
        <span style={{fontSize:12,fontWeight:700,color:C.accent,width:24,paddingTop:10,textAlign:'center'}}>{index+1}</span>
        <div style={{flex:'1 1 200px',minWidth:180,position:'relative'}}>
          <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="Type athlete name..." value={row.search} onChange={e=>{const c=[...rows];c[index]={...c[index],search:e.target.value,athleteId:''};setRows(c);}} onFocus={()=>handleFocus(fieldName)} onBlur={handleBlur} />
          {focusField===fieldName && opts.length>0 && (
            <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
              {opts.map((a,oi)=>{
                const isRelayEvt2 = evt.entryType==='Relay';
                const baseD = isRelayEvt2 ? getDistance(evt)/4 : 0;
                let aPr = null, aPrLabel = '';
                if(isRelayEvt2 && baseD>0) {
                  const indEvt = events.find(e=>e.entryType==='Individual'&&getDistance(e)===baseD&&(e.gender===evt.gender||evt.gender==='Mixed'));
                  if(indEvt) { aPr = getAthletePR(a.id, indEvt.id); if(aPr) aPrLabel = formatTime(aPr.timeMs)+' ('+indEvt.name+')'; }
                  if(!aPr) {
                    const spl = (data.results||[]).filter(r=>r.athleteId===a.id&&r.eventId===eventId&&r.isRelaySplit);
                    if(spl.length) { const best=spl.reduce((b,r)=>(!b||r.timeMs<b.timeMs)?r:b,null); aPrLabel=formatTime(best.timeMs)+' (split)'; aPr=best; }
                  }
                } else {
                  aPr = getAthletePR(a.id, eventId);
                  if(aPr) aPrLabel = isFieldEvent(evt)?fieldToStr(aPr.ft,aPr.inch,aPr.qtr):formatTime(aPr.timeMs);
                }
                return <div key={a.id} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`,display:'flex',alignItems:'center',gap:8}} onMouseDown={()=>{const c=[...rows];c[index]={...c[index],athleteId:a.id,search:athName(a)};setRows(c);setFocusField('');}}>
                  {sortByRank&&<span style={{fontSize:11,fontWeight:700,color:aPr?(oi<3?'#c9a830':C.textMuted):C.border,minWidth:20,textAlign:'center'}}>{aPr?(oi+1):'-'}</span>}
                  <span style={{flex:1}}>{athName(a)}{a.gradYear&&<span style={{color:C.textMuted,marginLeft:6,fontSize:12}}>{"'"+((a.gradYear+'').slice(-2))}</span>}</span>
                  {aPr && <span style={{fontSize:12,color:C.accent,fontWeight:sortByRank?700:400}}>{aPrLabel}</span>}
                  {sortByRank&&!aPr&&<span style={{fontSize:10,color:C.textMuted,fontStyle:'italic'}}>No PR</span>}
                </div>;
              })}
            </div>
          )}
          {row.athleteId && pr && <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>PR: {isFieldEvent(evt)?fieldToStr(pr.ft,pr.inch,pr.qtr):formatTime(pr.timeMs)}</div>}
        </div>
        {isTrackEvent(evt) && (()=>{
          const stds = (evt.qualifyingStandards||[]).filter(s=>(s.timeMs||0)>0);
          const source = row.goalSource || 'custom';
          let derivedMs = null;
          if(source === 'pr' && row.athleteId) {
            const prX = getAthletePR(row.athleteId, eventId);
            derivedMs = prX ? (prX.timeMs||null) : null;
          } else if(source.startsWith('std:')) {
            const sid = source.slice(4);
            const s = stds.find(st=>st.id===sid);
            derivedMs = s ? (s.timeMs||null) : null;
          }
          const setSource = (v) => {
            const c=[...rows];
            let nm = c[index].goalMin, ns = c[index].goalSec;
            if(v==='pr' && c[index].athleteId) {
              const prY = getAthletePR(c[index].athleteId, eventId);
              if(prY) { nm = Math.floor((prY.timeMs||0)/60000)+''; ns = (((prY.timeMs||0)%60000)/1000).toFixed(2); }
            } else if(v.startsWith('std:')) {
              const s = stds.find(st=>st.id===v.slice(4));
              if(s) { nm = Math.floor((s.timeMs||0)/60000)+''; ns = (((s.timeMs||0)%60000)/1000).toFixed(2); }
            }
            c[index] = {...c[index], goalSource:v, goalMin:nm, goalSec:ns};
            setRows(c);
          };
          return (
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              <select style={{...S.select,fontSize:11,padding:'3px 6px',minWidth:120}} value={source} onChange={e=>setSource(e.target.value)} title="Goal source">
                <option value="custom">Custom goal</option>
                {row.athleteId && <option value="pr">Match PR</option>}
                {stds.map(s=><option key={s.id} value={'std:'+s.id}>{s.name||'Standard'}</option>)}
              </select>
              {source==='custom'
                ? <TimeDropdown min={row.goalMin} sec={row.goalSec} onMinChange={v=>{const c=[...rows];c[index]={...c[index],goalMin:v};setRows(c);}} onSecChange={v=>{const c=[...rows];c[index]={...c[index],goalSec:v};setRows(c);}} compact />
                : <span style={{fontSize:13,fontWeight:700,color:derivedMs?C.accent:C.textMuted,padding:'6px 8px',background:C.surface2,borderRadius:4,minWidth:88,textAlign:'center',border:`1px solid ${C.border}`}} title={derivedMs?'Auto from '+(source==='pr'?'PR':'standard'):'No value yet — pick an athlete'}>{derivedMs?formatTime(derivedMs):'—'}</span>}
            </div>
          );
        })()}
        {rows.length>1 && <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:16,padding:'8px 4px'}} onClick={()=>{const c=[...rows];c.splice(index,1);setRows(c);}}>✕</button>}
      </div>
    );
  };
  return (
    <Modal open={open} onClose={()=>{initRef.current=null;onClose();}} width={550}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h2 style={{...S.h2,margin:0}}>{isEditing?'Edit':'Add'} - {getEventLabel(evt)}</h2>
        <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:sortByRank?C.accent:C.surface2,color:sortByRank?'#fff':C.textSecondary,border:`1px solid ${sortByRank?C.accent:C.border}`,borderRadius:6}} onClick={()=>setSortByRank(p=>!p)}>
          {sortByRank?'★ Ranked':'Sort by Rank'}
        </button>
      </div>
      <p style={{fontSize:13,color:C.textSecondary,marginBottom:8}}>{(meet||{}).name}</p>
      {(maxEntries||maxEvents)&&(
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
          {maxEntries&&<span style={{fontSize:10,fontWeight:600,color:existingEntries.length>=maxEntries?C.danger:C.textSecondary,padding:'3px 8px',borderRadius:10,background:existingEntries.length>=maxEntries?C.dangerMuted:C.surface2,border:`1px solid ${existingEntries.length>=maxEntries?C.danger:C.border}`}}>{existingEntries.length}/{maxEntries} entries</span>}
          {maxEvents&&<span style={{fontSize:10,fontWeight:600,color:C.textSecondary,padding:'3px 8px',borderRadius:10,background:C.surface2,border:`1px solid ${C.border}`}}>Max {maxEvents} events/athlete</span>}
        </div>
      )}
      {restrictionError&&<div style={{padding:'8px 12px',background:C.dangerMuted,border:`1px solid ${C.danger}`,borderRadius:6,fontSize:12,color:C.danger,marginBottom:12,fontWeight:500}}>{restrictionError}</div>}
      {evt.entryType === 'Relay' ? (
        <div>
          <div style={{fontSize:13,fontWeight:600,color:C.textSecondary,marginBottom:10}}>{isEditing?'Edit Relay':'New Relay Entry'}</div>
          {relayAthletes.map((ra,i) => {
            const usedIds = relayAthletes.filter((_,j)=>j!==i).map(r=>r.athleteId).filter(Boolean);
            return (
              <div key={i} draggable style={{opacity:dragLeg===i?0.4:1,border:dragOverLeg===i?`2px dashed ${C.accent}`:'2px solid transparent',borderRadius:6,marginBottom:2}} onDragStart={()=>setDragLeg(i)} onDragOver={e=>{e.preventDefault();setDragOverLeg(i);}} onDragLeave={()=>setDragOverLeg(null)} onDrop={e=>{e.preventDefault();handleLegDrop(dragLeg,i);setDragLeg(null);setDragOverLeg(null);}} onDragEnd={()=>{setDragLeg(null);setDragOverLeg(null);}}>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{cursor:'grab',fontSize:14,color:C.textMuted,userSelect:'none',padding:'0 4px'}}>:::</span>
                  {renderRow(ra, i, 'relay', relayAthletes, setRelayAthletes, usedIds)}
                </div>
              </div>
            );
          })}
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 16px'}} onClick={()=>setRelayAthletes([...relayAthletes,{athleteId:'',search:'',goalMin:0,goalSec:0,goalSource:'custom'}])}>+ Leg</button>
          </div>
          <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.borderLight}`}}>
            <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:8}}>Alternates</div>
            {relayAlternates.map((alt,i) => {
              const allUsed = [...relayAthletes.map(r=>r.athleteId),...relayAlternates.filter((_,j)=>j!==i).map(r=>r.athleteId)].filter(Boolean);
              return renderRow(alt, i, 'alt', relayAlternates, setRelayAlternates, allUsed);
            })}
            <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'6px 14px'}} onClick={()=>setRelayAlternates([...relayAlternates,{athleteId:'',search:'',goalMin:0,goalSec:0,goalSource:'custom'}])}>+ Alternate</button>
          </div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'10px 20px'}} onClick={saveRelay}>{isEditing?'Save Changes':'Add Relay'}</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{fontSize:13,fontWeight:600,color:C.textSecondary,marginBottom:10}}>{isEditing?'Edit Entry':'New Entries'}</div>
          {entries.map((en,i) => {
            const usedIds = [...existingEntries.filter((_,j)=>!isEditing||j!==editEntryIdx).map(e=>e.athleteId).filter(Boolean), ...entries.filter((_,j)=>j!==i).map(e=>e.athleteId).filter(Boolean)];
            return renderRow(en, i, 'indiv', entries, setEntries, usedIds);
          })}
          <div style={{display:'flex',gap:8,marginTop:10}}>
            {!isEditing&&<button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 16px'}} onClick={()=>setEntries([...entries,{athleteId:'',search:'',goalMin:0,goalSec:0,goalSource:'custom'}])}>+ Athlete</button>}
            <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'10px 20px'}} onClick={saveIndividuals}>{isEditing?'Save Changes':'Add Entries'}</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
function AthletesPage({ data, save, nav }) {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const toggleSort = (col) => { if(sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortCol(col); setSortDir('asc'); } };
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', preferredName:'', gradYear:'', gender:'', name:'' });
  const [delId, setDelId] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const groups = data.workoutGroups || [];
  const athletes = data.athletes.filter(a => {
    if(!showInactive && a.active === false) return false;
    if(search && !athSearch(a, search)) return false;
    if(genderFilter && a.gender !== genderFilter) return false;
    if(groupFilter && !(a.groups||[]).some(g=>g.groupId===groupFilter) && a.trainingGroup !== groupFilter) return false;
    return true;
  }).sort((a,b) => {
    let av, bv;
    switch(sortCol) {
      case 'name': av=athLast(a).toLowerCase(); bv=athLast(b).toLowerCase(); break;
      case 'gradYear': av=a.gradYear||''; bv=b.gradYear||''; break;
      case 'gender': av=a.gender||''; bv=b.gender||''; break;
      case 'group': av=(((a.groups||[])[0]||{}).groupId||a.trainingGroup||'z'); bv=(((b.groups||[])[0]||{}).groupId||b.trainingGroup||'z'); break;
      case 'status': av=a.active===false?1:0; bv=b.active===false?1:0; break;
      default: av=''; bv='';
    }
    if(av<bv) return sortDir==='asc'?-1:1;
    if(av>bv) return sortDir==='asc'?1:-1;
    return athLast(a).localeCompare(athLast(b));
  });
  const addAthlete = () => {
    const name = form.name || `${form.firstName} ${form.lastName}`.trim();
    if(!name) return;
    save({ ...data, athletes: [...data.athletes, { id:uid(), name, firstName:form.firstName, lastName:form.lastName, preferredName:form.preferredName||'', gradYear:form.gradYear, gender:form.gender, active:true, groups:[], notes:'' }] });
    setShowAdd(false);
    setForm({ firstName:'', lastName:'', preferredName:'', gradYear:'', gender:'', name:'' });
  };
  const deleteAthlete = () => {
    save({ ...data, athletes:data.athletes.filter(a=>a.id!==delId) });
    setDelId(null);
  };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{display:'flex',gap:12,alignItems:'center',fontSize:12}}>
          <span style={{fontWeight:700,color:C.text}}>{athletes.length} athlete{athletes.length!==1?'s':''}</span>
          {(search||genderFilter||groupFilter)&&<span style={{color:C.textMuted}}>of {data.athletes.filter(a=>a.active!==false).length} active</span>}
          <span style={{color:C.blue}}>{data.athletes.filter(a=>a.active!==false&&a.gender==='M').length} B</span>
          <span style={{color:'#d53f8c'}}>{data.athletes.filter(a=>a.active!==false&&a.gender==='F').length} G</span>
          {showInactive&&<span style={{color:C.textMuted}}>{data.athletes.filter(a=>a.active===false).length} inactive</span>}
        </div>
        <div style={{display:'flex',gap:6}}>
          <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowImport(true)}>Import CSV</button>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>setShowAdd(true)}>+ Add Athlete</button>
        </div>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <input style={{...S.input,maxWidth:200}} placeholder="Search by name..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={S.select} value={genderFilter} onChange={e=>setGenderFilter(e.target.value)}>
          <option value="">All Genders</option><option value="M">Boys</option><option value="F">Girls</option>
        </select>
        <select style={S.select} value={groupFilter} onChange={e=>setGroupFilter(e.target.value)}>
          <option value="">All Groups</option>
          {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <label style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:C.textSecondary,cursor:'pointer',marginLeft:'auto'}}>
          <input type="checkbox" checked={showInactive} onChange={e=>setShowInactive(e.target.checked)} /> Show Inactive
        </label>
      </div>
      <div style={S.card}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>
            <th style={{...S.th,cursor:'pointer',userSelect:'none'}} onClick={()=>toggleSort('name')}>Name {sortCol==='name'?(sortDir==='asc'?'▲':'▼'):''}</th><th style={{...S.th,cursor:'pointer',userSelect:'none'}} onClick={()=>toggleSort('gradYear')}>Year {sortCol==='gradYear'?(sortDir==='asc'?'▲':'▼'):''}</th><th style={{...S.th,cursor:'pointer',userSelect:'none'}} onClick={()=>toggleSort('gender')}>Gender {sortCol==='gender'?(sortDir==='asc'?'▲':'▼'):''}</th><th style={{...S.th,cursor:'pointer',userSelect:'none'}} onClick={()=>toggleSort('group')}>Group(s) {sortCol==='group'?(sortDir==='asc'?'▲':'▼'):''}</th><th style={{...S.th,cursor:'pointer',userSelect:'none'}} onClick={()=>toggleSort('status')}>Status {sortCol==='status'?(sortDir==='asc'?'▲':'▼'):''}</th><th style={S.th}></th>
          </tr></thead>
          <tbody>
            {athletes.map(a => {
              const athleteGroups = (a.groups||[]).map(ag=>(groups.find(g=>g.id===ag.groupId)||{}).name).filter(Boolean).join(', ') || ((groups.find(g=>g.id===a.trainingGroup)||{}).name || '-');
              return (
                <tr key={a.id} style={{cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id,athFilter:{search,genderFilter,groupFilter,showInactive,sortCol,sortDir}})}>
                  <td style={{...S.td,fontWeight:500}}>{athDisplay(a,true)}{a.preferredName&&<span style={{color:C.textMuted,fontWeight:400,marginLeft:4,fontSize:12}}>({a.preferredName})</span>}</td>
                  <td style={S.td}>{a.gradYear||'-'}</td>
                  <td style={S.td}>{a.gender==='M'?'B':a.gender==='F'?'G':'-'}</td>
                  <td style={{...S.td,fontSize:12}}>{athleteGroups}</td>
                  <td style={S.td}><span style={{fontSize:11,fontWeight:600,color:a.active===false?C.danger:C.success}}>{a.active===false?'Inactive':'Active'}</span></td>
                  <td style={S.td}><button style={{background:'none',border:'none',color:C.danger,cursor:'pointer'}} onClick={e=>{e.stopPropagation();setDelId(a.id);}}>✕</button></td>
                </tr>
              );
            })}
            {!athletes.length && <tr><td colSpan={6} style={{...S.td,textAlign:'center',color:C.textMuted}}>No athletes found.</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} width={420}>
        <h2 style={S.h2}>Add Athlete</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>First Name</label><input style={S.input} value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} /></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Last Name</label><input style={S.input} value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} /></div>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Preferred Name <span style={{fontWeight:400,color:C.textMuted}}>(optional)</span></label><input style={S.input} placeholder="Displayed instead of first name" value={form.preferredName} onChange={e=>setForm({...form,preferredName:e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Grad Year</label><input style={S.input} value={form.gradYear} onChange={e=>setForm({...form,gradYear:e.target.value})} placeholder="e.g. 2027" /></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Gender</label>
              <select style={{...S.select,width:'100%'}} value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                <option value="">Select</option><option value="M">Boy</option><option value="F">Girl</option>
              </select>
            </div>
          </div>
          <button style={{...S.btn,...S.btnPrimary}} onClick={addAthlete}>Add Athlete</button>
        </div>
      </Modal>
      <ImportModal open={showImport} onClose={()=>setShowImport(false)} type="athletes" onImport={(rows)=>{
        const newAthletes = rows.map(row=>{
          const name = (row.name||'').trim();
          let firstName = (row.first_name||row['first name']||'').trim();
          let lastName = (row.last_name||row['last name']||'').trim();
          if(!firstName && !lastName) {
            if(name.includes(',')) {
              const parts = name.split(',').map(s=>s.trim());
              lastName = parts[0]||''; firstName = parts[1]||'';
            } else {
              const parts = name.split(/\s+/);
              firstName = parts.length>1?parts.slice(0,-1).join(' '):name;
              lastName = parts.length>1?parts[parts.length-1]:'';
            }
          }
          const fullName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName||lastName);
          return {
            id:uid(), name:fullName, firstName, lastName, preferredName:(row.preferred_name||row['preferred name']||row.nickname||'').trim(),
            gradYear:(row.grad_year||row['grad year']||row.year||'').trim(),
            gender:(row.gender||'').trim().toUpperCase()==='F'?'F':(row.gender||'').trim().toUpperCase()==='M'?'M':'',
            active:true, groups:[], notes:'',
          };
        }).filter(a=>a.name);
        save({...data, athletes:[...data.athletes,...newAthletes]});
      }} />
      <ConfirmModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={deleteAthlete} message="Delete this athlete and all their records?" />
    </div>
  );
}
function AthleteSubPage({ data, save, nav, athleteId, athFilter, events, getAthletePR, checkRecord, checkQualifying, season, team }) {
  const [showQualifying, setShowQualifying] = useState(false);
  const [expandedPerfEvents, setExpandedPerfEvents] = useState({});
  const [expandedSplits, setExpandedSplits] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [progressForm, setProgressForm] = useState({});
  const [noteForm, setNoteForm] = useState({ type:'Other', effectiveDate:'', absenceEnd:'', details:'', painScale:'', trainerCheckIn:false, trainerDate:'', trainerDetails:'', needFollowUp:false, followUpName:'', followUpContact:'', followUpLastDate:'', followUpResolution:'' });
  const [editForm, setEditForm] = useState({});
  const [editPracticeDay, setEditPracticeDay] = useState(null);
  const [practiceEditItems, setPracticeEditItems] = useState([]);
  const [athPracticeForm, setAthPracticeForm] = useState({category:'',type:'',workoutId:'',workoutSearch:''});
  const [athPracticeFocus, setAthPracticeFocus] = useState('');
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [newWorkoutForm, setNewWorkoutForm] = useState({name:'',category:'',type:'',mileage:'',description:''});
  const [showAddResult, setShowAddResult] = useState(false);
  const [resultForm, setResultForm] = useState({eventId:'',date:'',min:'',sec:'',ft:'',inch:'',qtr:'',note:''});
  const [editingPracticeIdx, setEditingPracticeIdx] = useState(null);
  const [newWFocus, setNewWFocus] = useState('');
  const athPracticeBlurRef = useRef(null);
  const athPFocus = (f)=>{clearTimeout(athPracticeBlurRef.current);setAthPracticeFocus(f);};
  const athPBlur = ()=>{athPracticeBlurRef.current=setTimeout(()=>setAthPracticeFocus(''),200);};
  const athlete = data.athletes.find(a=>a.id===athleteId);
  if(!athlete) return <div style={S.card}><p>Athlete not found</p><button style={S.backLink} onClick={()=>nav('athletes')}>{"<- "}Back</button></div>;
  const groups = data.workoutGroups || [];
  const athleteGroups = athlete.groups || (athlete.trainingGroup ? [{ groupId:athlete.trainingGroup, level:athlete.trainingLevel||'Level 1' }] : []);
  const athleteEvents = events.filter(e => e.gender==='Mixed' || (athlete.gender==='M' && e.gender==='Boy') || (athlete.gender==='F' && e.gender==='Girl'));
  const athleteResults = data.results.filter(r=>r.athleteId===athleteId&&!r.isRelaySplit&&!r.isRelay);
  const athleteRelaySplits = data.results.filter(r=>r.athleteId===athleteId&&r.isRelaySplit);
  const athleteRelayComposites = (()=>{
    const all = data.results.filter(r=>r.isRelay&&(r.relayAthletes||[]).includes(athleteId));
    const best = {};
    all.forEach(r => {
      const k = `${r.eventId}|${r.meetId||''}|${r.date}`;
      const prev = best[k];
      if(!prev) { best[k] = r; return; }
      if(r.verified && !prev.verified) best[k] = r;
    });
    return Object.values(best);
  })();
  athleteRelayComposites.forEach(rr=>{
    const hasSplit = athleteRelaySplits.some(rs=>rs.eventId===rr.eventId&&rs.date===rr.date);
    if(!hasSplit) {
      const legSplit = (rr.splits||[]).find(s=>s.athleteId===athleteId);
      athleteRelaySplits.push({
        id:rr.id+'-'+athleteId, athleteId, eventId:rr.eventId, date:rr.date, meetId:rr.meetId,
        timeMs:legSplit?legSplit.split:rr.timeMs, isRelaySplit:true, relayLeg:legSplit?legSplit.lap:null,
        _relayTotal:rr.timeMs, _fromComposite:true
      });
    }
  });
  const seasonResults = season ? athleteResults.filter(r=>isInSeason(r.date,season)) : athleteResults;
  const seasonAttendance = (data.attendance||[]).filter(r=>r.athleteId===athleteId && (!season || isInSeason(r.date,season)));
  const attPct = seasonAttendance.length > 0 ? Math.round(seasonAttendance.filter(r=>r.status==='present'||r.status==='late'||r.status==='signedout').length/seasonAttendance.length*100) : null;
  const eventsParticipated = new Set(seasonResults.map(r=>r.eventId)).size;
  const calcImprovement = () => {
    if(seasonResults.length < 2) return null;
    const byEvent = {};
    seasonResults.forEach(r=>{if(!byEvent[r.eventId])byEvent[r.eventId]=[];byEvent[r.eventId].push(r);});
    let improvements = 0, total = 0;
    Object.entries(byEvent).forEach(([eid,results])=>{
      if(results.length<2) return;
      const sorted = results.sort((a,b)=>(a.date||'').localeCompare(b.date||''));
      const first = sorted[0], last = sorted[sorted.length-1];
      const evt = events.find(e=>e.id===eid);
      if(isFieldEvent(evt)) {
        if(fieldToInches(last.ft||0,last.inch||0,last.qtr||0) > fieldToInches(first.ft||0,first.inch||0,first.qtr||0)) improvements++;
      } else {
        if((last.timeMs||Infinity) < (first.timeMs||Infinity)) improvements++;
      }
      total++;
    });
    return total > 0 ? Math.round(improvements/total*100) : null;
  };
  const improvement = calcImprovement();
  const medicalNotes = (data.medicalNotes||[]).filter(n=>n.athleteId===athleteId).sort((a,b)=>(b.entryDate||'').localeCompare(a.entryDate||''));
  const saveNote = () => {
    if(editNoteId) {
      save({...data, medicalNotes:(data.medicalNotes||[]).map(mn=>mn.id===editNoteId?{...mn,...noteForm}:mn)});
    } else {
      const note = { id:uid(), athleteId, entryDate:new Date().toISOString().split('T')[0], ...noteForm };
      save({ ...data, medicalNotes:[...(data.medicalNotes||[]),note] });
    }
    setShowAddNote(false);
    setEditNoteId(null);
    setNoteForm({ type:'Other', effectiveDate:'', absenceEnd:'', details:'', painScale:'', trainerCheckIn:false, trainerDate:'', trainerDetails:'', needFollowUp:false, followUpName:'', followUpContact:'', followUpLastDate:'', followUpResolution:'' });
  };
  const startEditNote = (n) => {
    setNoteForm({type:n.type||'Other',effectiveDate:n.effectiveDate||'',absenceEnd:n.absenceEnd||'',details:n.details||'',painScale:n.painScale||'',trainerCheckIn:!!n.trainerCheckIn,trainerDate:n.trainerDate||'',trainerDetails:n.trainerDetails||'',needFollowUp:!!n.needFollowUp,followUpName:n.followUpName||'',followUpContact:n.followUpContact||'',followUpLastDate:n.followUpLastDate||'',followUpResolution:n.followUpResolution||''});
    setEditNoteId(n.id);
    setShowAddNote(true);
  };
  const startEdit = () => {
    setEditForm({
      firstName:athlete.firstName||'', lastName:athlete.lastName||'', preferredName:athlete.preferredName||'', name:athlete.name||'',
      gradYear:athlete.gradYear||'', gender:athlete.gender||'', active:athlete.active!==false,
      groups:athleteGroups, notes:athlete.notes||'',
    });
    setShowEditInfo(true);
  };
  const saveEdit = () => {
    const cur = data.athletes.find(a=>a.id===athleteId);
    const wasActive = (cur||{}).active !== false;
    const willBeActive = !!editForm.active;
    const goingInactive = wasActive && !willBeActive;
    const fallbackId = (goingInactive && !af.showInactive)
      ? ((nextAthlete && nextAthlete.id) || (prevAthlete && prevAthlete.id) || null)
      : null;
    const name = editForm.name || `${editForm.firstName} ${editForm.lastName}`.trim();
    save({ ...data, athletes:data.athletes.map(a=>a.id===athleteId?{...a,...editForm,name,active:willBeActive}:a) });
    setShowEditInfo(false);
    if(fallbackId) nav('athleteSub', { athleteId: fallbackId, athFilter: af });
  };
  const af = athFilter||{};
  const sortedAthletes = data.athletes.filter(a=>{
    if(!af.showInactive && a.active===false) return false;
    if(af.search && !athSearch(a, af.search)) return false;
    if(af.genderFilter && a.gender!==af.genderFilter) return false;
    if(af.groupFilter && !(a.groups||[]).some(g=>g.groupId===af.groupFilter) && a.trainingGroup!==af.groupFilter) return false;
    return true;
  }).sort((a,b)=>{
    const sc=af.sortCol||'name';const sd=af.sortDir||'asc';
    let av,bv;
    switch(sc){
      case 'name':av=athLast(a).toLowerCase();bv=athLast(b).toLowerCase();break;
      case 'gradYear':av=a.gradYear||'';bv=b.gradYear||'';break;
      case 'gender':av=a.gender||'';bv=b.gender||'';break;
      case 'group':av=(a.groups||[]).map(ag=>(groups.find(g=>g.id===ag.groupId)||{}).name||'').join(',')||'';bv=(b.groups||[]).map(ag=>(groups.find(g=>g.id===ag.groupId)||{}).name||'').join(',')||'';break;
      default:av=athLast(a).toLowerCase();bv=athLast(b).toLowerCase();
    }
    if(av<bv)return sd==='asc'?-1:1;if(av>bv)return sd==='asc'?1:-1;return 0;
  });
  const curIdx = sortedAthletes.findIndex(a=>a.id===athleteId);
  const prevAthlete = curIdx > 0 ? sortedAthletes[curIdx-1] : null;
  const nextAthlete = curIdx < sortedAthletes.length-1 ? sortedAthletes[curIdx+1] : null;
  const filterLabel = [af.search,af.genderFilter==='M'?'Boys':af.genderFilter==='F'?'Girls':'',af.groupFilter?(groups.find(g=>g.id===af.groupFilter)||{}).name||'':''].filter(Boolean).join(', ');
  return (
    <div>
      <ReportBuilderModal open={showReport} onClose={()=>setShowReport(false)} data={data} save={save} events={events} season={season} team={team} presetAthleteIds={[athleteId]} />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <button style={S.backLink} onClick={()=>nav('athletes')}>{"<- All Athletes"}</button>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'6px 12px'}} onClick={()=>setShowReport(true)} title="Print season report for this athlete">📄 Report</button>
          <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'8px 16px',borderRadius:8,opacity:prevAthlete?1:0.3,display:'flex',flexDirection:'column',alignItems:'center',lineHeight:1.2}} disabled={!prevAthlete} onClick={()=>prevAthlete&&nav('athleteSub',{athleteId:prevAthlete.id,athFilter:af})}>
            {"<- Prev"}{prevAthlete&&<span style={{fontSize:10,fontWeight:400,textTransform:'none',letterSpacing:0}}>{athDisplay(prevAthlete)}</span>}
          </button>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <span style={{fontSize:12,color:C.textMuted,fontWeight:600,minWidth:50,textAlign:'center'}}>{curIdx+1} / {sortedAthletes.length}</span>
            {filterLabel&&<span style={{fontSize:9,color:C.accent,textAlign:'center',marginTop:2}}>{filterLabel}</span>}
          </div>
          <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'8px 16px',borderRadius:8,opacity:nextAthlete?1:0.3,display:'flex',flexDirection:'column',alignItems:'center',lineHeight:1.2}} disabled={!nextAthlete} onClick={()=>nextAthlete&&nav('athleteSub',{athleteId:nextAthlete.id,athFilter:af})}>
            {"Next ->"}{nextAthlete&&<span style={{fontSize:10,fontWeight:400,textTransform:'none',letterSpacing:0}}>{athDisplay(nextAthlete)}</span>}
          </button>
        </div>
      </div>
      
      <div style={{...S.card,display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <h1 style={{...S.h1,marginBottom:4}}>{athDisplay(athlete, true)}</h1>
          {athlete.preferredName && <div style={{fontSize:14,color:C.accent,fontWeight:500,marginBottom:4}}>Goes by "{athlete.preferredName}"</div>}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',fontSize:12,color:C.textSecondary}}>
            {athlete.gradYear && <span>Class of {athlete.gradYear}</span>}
            <span>{athlete.gender==='M'?'Boy':athlete.gender==='F'?'Girl':'-'}</span>
            <span style={{color:athlete.active===false?C.danger:C.success,fontWeight:600}}>{athlete.active===false?'Inactive':'Active'}</span>
          </div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:6}}>
            {athleteGroups.map((ag,i)=>{
              const g = groups.find(gr=>gr.id===ag.groupId);
              return g ? <span key={i} style={{...S.pill(false),fontSize:10}}>{g.name}{ag.level && g.levels.length>1?` (${ag.level})`:''}</span> : null;
            })}
          </div>
          {athlete.notes && <div style={{fontSize:12,color:C.textSecondary,marginTop:6,fontStyle:'italic'}}>{athlete.notes}</div>}
        </div>
        <div style={{display:'flex',gap:6}}>
          <button style={{...S.btn,...S.btnSecondary,fontSize:11}} onClick={startEdit}>Edit</button>
        </div>
      </div>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
        <div style={{...S.card,textAlign:'center',padding:12}}>
          <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:'uppercase'}}>Attendance</div>
          <div style={{fontSize:22,fontWeight:700,color:attPct!==null&&attPct<75?C.danger:C.text}}>{attPct!==null?`${attPct}%`:'-'}</div>
        </div>
        <div style={{...S.card,textAlign:'center',padding:12}}>
          <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:'uppercase'}}>Events</div>
          <div style={{fontSize:22,fontWeight:700,color:C.text}}>{eventsParticipated}</div>
        </div>
        <div style={{...S.card,textAlign:'center',padding:12}}>
          <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:'uppercase'}}>Improvement</div>
          <div style={{fontSize:22,fontWeight:700,color:improvement!==null&&improvement>0?C.success:C.text}}>{improvement!==null?`${improvement}%`:'-'}</div>
        </div>
      </div>
      
      {(()=>{
        const active = medicalNotes.filter(n=>!n.needFollowUp || !n.followUpResolution);
        const resolved = medicalNotes.filter(n=>n.needFollowUp && n.followUpResolution);
        const hasActive = active.some(n=>n.needFollowUp && !n.followUpResolution);
        const renderNote = (n) => {
          const typeColor = n.type==='Injury'?C.danger:n.type==='Illness'?'#b8860b':n.type==='Medical Clearance'?C.success:n.type==='Planned Absence'?'#6b46c1':C.blue;
          const progs = n.progressNotes||[];
          const isExpanded = expandedNotes[n.id];
          const pf = progressForm[n.id]||'';
          const needsAction = n.needFollowUp && !n.followUpResolution;
          return (
            <div key={n.id} style={{padding:'12px 14px',marginBottom:8,borderRadius:8,borderLeft:`4px solid ${typeColor}`,background:needsAction?C.surface:C.bg,border:needsAction?`1px solid ${typeColor}33`:`1px solid ${C.borderLight}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:700,color:typeColor,textTransform:'uppercase',background:typeColor+'15',padding:'2px 8px',borderRadius:4}}>{n.type}</span>
                    <span style={{fontSize:11,color:C.textMuted}}>{n.effectiveDate||n.entryDate}{n.type==='Planned Absence'&&n.absenceEnd?' to '+n.absenceEnd:''}</span>
                    {needsAction && <span style={{fontSize:10,fontWeight:700,color:C.danger,textTransform:'uppercase'}}>Needs Follow-Up</span>}
                  </div>
                  <div style={{fontSize:13,color:C.text,lineHeight:'1.5'}}>{n.details}</div>
                  {n.painScale && <div style={{fontSize:11,marginTop:3,display:'flex',alignItems:'center',gap:4}}><span style={{color:C.textMuted}}>Pain:</span><span style={{fontWeight:700,color:parseInt(n.painScale)>=7?C.danger:parseInt(n.painScale)>=4?'#b8860b':C.success}}>{n.painScale}/10</span></div>}
                  {n.trainerCheckIn && <div style={{fontSize:12,color:C.blue,marginTop:4,padding:'4px 8px',background:C.blue+'10',borderRadius:4}}>Trainer: {n.trainerDate} - {n.trainerDetails}</div>}
                  {n.needFollowUp && <div style={{fontSize:12,color:C.accent,marginTop:4}}>Contact: {n.followUpName}{n.followUpContact?` (${n.followUpContact})`:''}{n.followUpResolution?<span style={{color:C.success,fontWeight:600}}>{' '}Resolved {n.followUpResolution}</span>:''}</div>}
                </div>
                <div style={{display:'flex',gap:6,flexShrink:0,marginLeft:12,alignItems:'center'}}>
                  <button style={{fontSize:11,fontWeight:600,color:C.accent,background:C.accentMuted,border:'none',borderRadius:6,padding:'5px 10px',cursor:'pointer'}} onClick={()=>startEditNote(n)}>Edit</button>
                  {needsAction && <button style={{fontSize:11,fontWeight:600,color:C.success,background:C.successMuted,border:'none',borderRadius:6,padding:'5px 12px',cursor:'pointer'}} onClick={()=>save({...data,medicalNotes:(data.medicalNotes||[]).map(mn=>mn.id===n.id?{...mn,followUpResolution:new Date().toISOString().split('T')[0]}:mn)})}>Resolve</button>}
                  <button style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:13,padding:'4px'}} onClick={()=>save({...data,medicalNotes:(data.medicalNotes||[]).filter(mn=>mn.id!==n.id)})}>✕</button>
                </div>
              </div>
              <div style={{marginTop:8,borderTop:`1px solid ${C.borderLight}`,paddingTop:6}}>
                <div style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer'}} onClick={()=>setExpandedNotes(prev=>({...prev,[n.id]:!prev[n.id]}))}>
                  <span style={{fontSize:11,color:C.accent,fontWeight:600}}>{isExpanded?'▼':'▶'} Progress Notes ({progs.length})</span>
                </div>
                {isExpanded&&<div style={{marginTop:8,paddingLeft:12,borderLeft:`2px solid ${C.accent}33`}}>
                  {progs.map((p,pi)=>(
                    <div key={pi} style={{fontSize:12,color:C.text,padding:'6px 0',borderBottom:`1px solid ${C.borderLight}`}}>
                      <span style={{fontWeight:600,color:C.accent,marginRight:8,fontSize:11}}>{p.date}</span>{p.text}
                    </div>
                  ))}
                  {!progs.length&&<div style={{fontSize:12,color:C.textMuted,padding:'6px 0',fontStyle:'italic'}}>No progress notes yet</div>}
                  <div style={{display:'flex',gap:6,marginTop:8}}>
                    <input style={{...S.input,flex:1,fontSize:12,padding:'6px 10px'}} placeholder="Add progress note..." value={pf} onChange={e=>setProgressForm(prev=>({...prev,[n.id]:e.target.value}))} onKeyDown={e=>{if(e.key==='Enter'&&pf.trim()){const updated=(data.medicalNotes||[]).map(mn=>mn.id===n.id?{...mn,progressNotes:[...(mn.progressNotes||[]),{date:new Date().toISOString().split('T')[0],text:pf.trim()}]}:mn);save({...data,medicalNotes:updated});setProgressForm(prev=>({...prev,[n.id]:''}));}}} />
                    <button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'6px 14px'}} onClick={()=>{if(!pf.trim())return;const updated=(data.medicalNotes||[]).map(mn=>mn.id===n.id?{...mn,progressNotes:[...(mn.progressNotes||[]),{date:new Date().toISOString().split('T')[0],text:pf.trim()}]}:mn);save({...data,medicalNotes:updated});setProgressForm(prev=>({...prev,[n.id]:''}));}}>Add</button>
                  </div>
                </div>}
              </div>
            </div>
          );
        };
        return (<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,marginTop:8}}>
            <h2 style={{...S.h2,marginBottom:0}}>Medical / Notes {hasActive && <span style={{fontSize:12,fontWeight:500,color:C.danger,marginLeft:6}}>• Action Needed</span>}</h2>
            <button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'6px 14px'}} onClick={()=>{setEditNoteId(null);setNoteForm({type:'Other',effectiveDate:'',details:'',painScale:'',trainerCheckIn:false,trainerDate:'',trainerDetails:'',needFollowUp:false,followUpName:'',followUpContact:'',followUpLastDate:'',followUpResolution:''});setShowAddNote(true);}}>+ Add Note</button>
          </div>
          {active.length===0&&resolved.length===0&&<div style={{...S.card,textAlign:'center',color:C.textMuted,fontSize:12,padding:16}}>No medical notes</div>}
          {active.map(renderNote)}
          {resolved.length>0&&(
            <div style={{marginTop:4,marginBottom:12}}>
              <div style={{cursor:'pointer',display:'flex',alignItems:'center',gap:6,padding:'8px 0'}} onClick={()=>setShowResolved(!showResolved)}>
                <span style={{fontSize:12,fontWeight:600,color:C.textMuted}}>{showResolved?'▼':'▶'} Resolved ({resolved.length})</span>
              </div>
              {showResolved&&<div style={{opacity:0.7}}>{resolved.map(renderNote)}</div>}
            </div>
          )}
          <Modal open={showAddNote} onClose={()=>setShowAddNote(false)} width={520}>
            <h2 style={{...S.h2,marginBottom:16}}>{editNoteId?'Edit':'Add'} Medical Note</h2>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Type</label><select style={{...S.select,width:'100%'}} value={noteForm.type} onChange={e=>setNoteForm({...noteForm,type:e.target.value})}>
                  <option>Injury</option><option>Illness</option><option>Medical Clearance</option><option>Planned Absence</option><option>Other</option>
                </select></div>
                <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>{noteForm.type==='Planned Absence'?'Start Date':'Effective Date'}</label><input style={S.input} type="date" value={noteForm.effectiveDate} onChange={e=>setNoteForm({...noteForm,effectiveDate:e.target.value})} /></div>
              </div>
              {noteForm.type==='Planned Absence'&&<div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>End Date</label><input style={S.input} type="date" value={noteForm.absenceEnd} onChange={e=>setNoteForm({...noteForm,absenceEnd:e.target.value})} /></div>}
              {(noteForm.type==='Injury'||noteForm.type==='Illness')&&<div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Pain Scale (1-10)</label><div style={{display:'flex',gap:4}}>{[1,2,3,4,5,6,7,8,9,10].map(v=><button key={v} style={{width:28,height:28,borderRadius:6,border:`1px solid ${noteForm.painScale==v?(v>=7?C.danger:v>=4?'#b8860b':C.success):C.border}`,background:noteForm.painScale==v?(v>=7?C.danger+'20':v>=4?'#b8860b20':C.success+'20'):C.bg,color:noteForm.painScale==v?(v>=7?C.danger:v>=4?'#b8860b':C.success):C.textMuted,fontWeight:noteForm.painScale==v?700:400,fontSize:11,cursor:'pointer'}} onClick={()=>setNoteForm({...noteForm,painScale:v})}>{v}</button>)}</div></div>}
              <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Details</label><textarea style={{...S.input,height:80,resize:'vertical'}} placeholder="Describe the issue, symptoms, or note..." value={noteForm.details} onChange={e=>setNoteForm({...noteForm,details:e.target.value})} /></div>
              <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer',padding:'4px 0'}}><input type="checkbox" checked={noteForm.trainerCheckIn} onChange={e=>setNoteForm({...noteForm,trainerCheckIn:e.target.checked})} /> Trainer Check-In</label>
              {noteForm.trainerCheckIn && <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:10,paddingLeft:24}}>
                <input style={S.input} type="date" value={noteForm.trainerDate} onChange={e=>setNoteForm({...noteForm,trainerDate:e.target.value})} />
                <input style={S.input} placeholder="Trainer recommendations..." value={noteForm.trainerDetails} onChange={e=>setNoteForm({...noteForm,trainerDetails:e.target.value})} />
              </div>}
              <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer',padding:'4px 0'}}><input type="checkbox" checked={noteForm.needFollowUp} onChange={e=>setNoteForm({...noteForm,needFollowUp:e.target.checked})} /> Needs Follow-Up</label>
              {noteForm.needFollowUp && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,paddingLeft:24}}>
                <input style={S.input} placeholder="Follow-up with (name)..." value={noteForm.followUpName} onChange={e=>setNoteForm({...noteForm,followUpName:e.target.value})} />
                <input style={S.input} placeholder="Contact info..." value={noteForm.followUpContact} onChange={e=>setNoteForm({...noteForm,followUpContact:e.target.value})} />
              </div>}
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:8}}>
                <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowAddNote(false)}>Cancel</button>
                <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{saveNote();setShowAddNote(false);}}>{ editNoteId?'Save Changes':'Save Note'}</button>
              </div>
            </div>
          </Modal>
        </>);
      })()}
      <div style={S.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <h2 style={{...S.h2,marginBottom:0}}>Performances</h2>
          <button style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:11,fontWeight:600,padding:'4px 0',marginBottom:4}} onClick={()=>setShowQualifying(q=>!q)}>{showQualifying?'Hide':'Show'} qualifying progress</button>
          <button style={{...S.btn,...S.btnPrimary,fontSize:11}} onClick={()=>{setResultForm({eventId:'',date:'',min:'',sec:'',ft:'',inch:'',qtr:'',note:''});setShowAddResult(true);}}>+ Add Result</button>
        </div>
        {athleteEvents.filter(evt=>{
          return athleteResults.some(r=>r.eventId===evt.id);
        }).map(evt => {
          const evtResults = athleteResults.filter(r=>r.eventId===evt.id).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
          const pr = getAthletePR(athleteId, evt.id);
          const mostRecent = evtResults[0];
          return (
            <div key={evt.id} style={{padding:'10px 0',borderBottom:`1px solid ${C.borderLight}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:600,fontSize:13}}>{getEventLabel(evt)}</span>
                <div style={{display:'flex',gap:8,alignItems:'center',fontSize:12}}>
                  {pr && <span style={S.pr}>PR: {isFieldEvent(evt) ? fieldToStr(pr.ft,pr.inch,pr.qtr) : formatTime(pr.timeMs)}</span>}
                  {mostRecent && <span style={{color:C.textSecondary}}>Last: {isFieldEvent(evt) ? fieldToStr(mostRecent.ft,mostRecent.inch,mostRecent.qtr) : formatTime(mostRecent.timeMs)}</span>}
                </div>
              </div>
              {showQualifying&&(()=>{
                const stds = evt.qualifyingStandards||[];
                if(!stds.length||!pr) return null;
                return (<div style={{marginTop:6,display:'flex',flexDirection:'column',gap:4}}>
                  {stds.map(std=>{
                    let met=false, diff=0, diffStr='', pct=0;
                    if(isFieldEvent(evt)){
                      const prIn=fieldToInches(pr.ft||0,pr.inch||0,pr.qtr||0);
                      const stdIn=fieldToInches(std.ft||0,std.inch||0,std.qtr||0);
                      if(stdIn>0){met=prIn>=stdIn;diff=prIn-stdIn;pct=Math.min(100,Math.round(prIn/stdIn*100));diffStr=met?'Qualified':(Math.abs(diff)/12).toFixed(1)+'ft away';}
                    } else {
                      const prMs=pr.timeMs||0;
                      const stdMs=std.timeMs||0;
                      if(stdMs>0){met=prMs<=stdMs;diff=stdMs-prMs;pct=Math.min(100,Math.round(stdMs/(prMs||1)*100));diffStr=met?'Qualified':formatTime(prMs-stdMs)+' away';}
                    }
                    if(!pct) return null;
                    const barColor=met?C.success:pct>=(data.nearMissPct||90)?'#b8860b':C.accent;
                    return (<div key={std.id} style={{display:'flex',alignItems:'center',gap:8,fontSize:11}}>
                      <span style={{width:70,color:C.textMuted,flexShrink:0}}>{std.name}</span>
                      <div style={{flex:1,height:6,background:C.surface2,borderRadius:3,overflow:'hidden'}}>
                        <div style={{width:pct+'%',height:'100%',background:barColor,borderRadius:3,transition:'width 0.3s'}} />
                      </div>
                      <span style={{width:80,textAlign:'right',flexShrink:0,fontWeight:600,color:met?C.success:pct>=(data.nearMissPct||90)?'#b8860b':C.textMuted}}>{diffStr}</span>
                    </div>);
                  })}
                </div>);
              })()}
              {evtResults.length>0&&(
                <div style={{marginTop:6}}>
                  {evtResults.length>1&&<button style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:11,fontWeight:600,padding:'2px 0'}} onClick={()=>setExpandedPerfEvents(p=>({...p,[evt.id]:!p[evt.id]}))}>{expandedPerfEvents[evt.id]?'Hide':'Show'} all {evtResults.length} performances</button>}
                  {(evtResults.length===1||expandedPerfEvents[evt.id])&&(
                    <table style={{width:'100%',borderCollapse:'collapse',marginTop:4}}>
                      <thead><tr><th style={{...S.th,fontSize:10,padding:'3px 6px'}}>Date</th><th style={{...S.th,fontSize:10,padding:'3px 6px'}}>Meet</th><th style={{...S.th,fontSize:10,padding:'3px 6px',textAlign:'right'}}>Mark</th><th style={{...S.th,fontSize:10,padding:'3px 6px',width:50}}></th></tr></thead>
                      <tbody>{evtResults.flatMap(r=>{
                        const meetObj = r.meetId?data.meets.find(m=>m.id===r.meetId):null;
                        const valStr = isFieldEvent(evt)?fieldToStr(r.ft,r.inch,r.qtr):formatTime(r.timeMs);
                        const isPRResult = pr&&r.id===pr.id;
                        const qualStds = (evt.qualifyingStandards||[]);
                        const allQualStds = getAllQualifyingForResult(data,events,r);
                        const hasSplits = Array.isArray(r.splits) && r.splits.length>=2;
                        const splitsOpen = !!expandedSplits[r.id];
                        const rows = [
                          <tr key={r.id} style={{background:isPRResult?C.successMuted:'transparent'}}>
                            <td style={{...S.td,fontSize:11,padding:'3px 6px'}}>{r.date}{hasSplits&&<button style={{marginLeft:6,background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:10,fontWeight:600,padding:0}} onClick={()=>setExpandedSplits(p=>({...p,[r.id]:!p[r.id]}))} title="Show lap splits">{splitsOpen?'▾':'▸'} splits</button>}</td>
                            <td style={{...S.td,fontSize:11,padding:'3px 6px',color:C.textSecondary}}>{meetObj?meetObj.name:r.isPractice?'Practice':'-'}</td>
                            <td style={{...S.td,fontSize:12,padding:'3px 6px',textAlign:'right',fontWeight:600}}>{valStr}</td>
                            <td style={{...S.td,padding:'3px 6px'}}>
                              <div style={{display:'flex',gap:2}}>
                                {isPRResult&&<span style={{fontSize:8,fontWeight:700,padding:'1px 4px',borderRadius:4,background:C.successMuted,color:C.success}}>PR</span>}
                                {allQualStds.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                                {r.verified&&<span style={{fontSize:8,fontWeight:700,padding:'1px 4px',borderRadius:4,background:'rgba(43,108,176,0.08)',color:'#2b6cb0'}}>V</span>}
                              </div>
                            </td>
                          </tr>
                        ];
                        if(hasSplits && splitsOpen) {
                          rows.push(
                            <tr key={r.id+'-splits'}>
                              <td colSpan={4} style={{padding:'4px 16px 8px',background:C.bg}}>
                                <div style={{display:'flex',gap:10,flexWrap:'wrap',fontSize:11}}>
                                  {r.splits.map((sp,si)=>(
                                    <div key={si} style={{padding:'3px 8px',background:C.surface2,border:`1px solid ${C.borderLight}`,borderRadius:4}}>
                                      <span style={{color:C.textMuted,marginRight:4}}>Lap {sp.lap||(si+1)}:</span>
                                      <span style={{fontWeight:600}}>{formatTime(sp.split||0)}</span>
                                      {sp.cumulative!=null&&<span style={{color:C.textMuted,marginLeft:4,fontSize:10}}>({formatTime(sp.cumulative)})</span>}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return rows;
                      })}</tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {athleteEvents.filter(evt=>athleteResults.some(r=>r.eventId===evt.id)).length === 0 && athleteRelaySplits.length === 0 && (
          <p style={{color:C.textMuted,fontSize:13,textAlign:'center',padding:12}}>No results yet</p>
        )}
        {athleteRelaySplits.length > 0 && (
          <div style={{marginTop:8,paddingTop:8,borderTop:`2px solid ${C.border}`}}>
            <div style={{fontSize:13,fontWeight:700,color:'#6b46c1',marginBottom:8}}>Relay Performances</div>
            {[...new Set(athleteRelaySplits.map(r=>r.eventId))].map(evtId=>{
              const evt = events.find(e=>e.id===evtId);
              if(!evt) return null;
              const splits = athleteRelaySplits.filter(r=>r.eventId===evtId).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
              const bestSplit = splits.reduce((best,r)=>(!best||r.timeMs<best.timeMs)?r:best,null);
              const composites = athleteRelayComposites.filter(rr=>rr.eventId===evtId).sort((a,b)=>a.timeMs-b.timeMs);
              const bestComposite = composites.length>0?composites[0]:null;
              return (
                <div key={evtId} style={{padding:'8px 0',borderBottom:`1px solid ${C.borderLight}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <span style={{fontWeight:600,fontSize:13}}>{getEventLabel(evt)}</span>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      {bestSplit&&<span style={{fontSize:11,color:'#6b46c1',fontWeight:600}}>Best split: {formatTime(bestSplit.timeMs)}</span>}
                      {bestComposite&&<span style={{fontSize:11,color:C.accent,fontWeight:600}}>Best relay: {formatTime(bestComposite.timeMs)}</span>}
                    </div>
                  </div>
                  {showQualifying&&bestComposite&&(()=>{
                    const stds = evt.qualifyingStandards||[];
                    if(!stds.length) return null;
                    return (<div style={{marginBottom:6,display:'flex',flexDirection:'column',gap:4}}>
                      {stds.map(std=>{
                        const stdMs=std.timeMs||0;
                        if(!stdMs) return null;
                        const prMs=bestComposite.timeMs;
                        const met=prMs<=stdMs;
                        const diff=stdMs-prMs;
                        const pct=Math.min(100,Math.round(stdMs/(prMs||1)*100));
                        const diffStr=met?'Qualified':formatTime(prMs-stdMs)+' away';
                        const barColor=met?C.success:pct>=(data.nearMissPct||90)?'#b8860b':C.accent;
                        const info=getStdBadgeInfo(data,std.name);
                        return (<div key={std.id} style={{display:'flex',alignItems:'center',gap:8,fontSize:11}}>
                          <span style={{width:70,color:info.color,fontWeight:600,flexShrink:0}}>{info.abbrev}</span>
                          <span style={{width:55,color:C.textMuted,flexShrink:0,fontSize:10}}>{formatTime(stdMs)}</span>
                          <div style={{flex:1,height:6,background:C.surface2,borderRadius:3,overflow:'hidden'}}>
                            <div style={{width:pct+'%',height:'100%',background:barColor,borderRadius:3,transition:'width 0.3s'}} />
                          </div>
                          <span style={{width:85,textAlign:'right',flexShrink:0,fontWeight:600,color:met?C.success:pct>=(data.nearMissPct||90)?'#b8860b':C.textMuted}}>{diffStr}</span>
                        </div>);
                      })}
                    </div>);
                  })()}
                  {splits.map(r=>{
                    const composite = athleteRelayComposites.find(rr=>rr.eventId===evtId&&rr.date===r.date);
                    const meetObj = r.meetId ? data.meets.find(m=>m.id===r.meetId) : null;
                    return (
                      <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 0 3px 12px',fontSize:12}}>
                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                          <span style={{color:C.textMuted}}>{r.date}</span>
                          {meetObj&&<span style={{color:C.textSecondary}}>{meetObj.name}</span>}
                          {r.isPractice&&<span style={{color:C.textMuted,fontStyle:'italic'}}>Practice</span>}
                        </div>
                        <div style={{display:'flex',gap:8,alignItems:'center'}}>
                          <span style={{fontWeight:600}}>Leg {r.relayLeg}: {formatTime(r.timeMs)}</span>
                          {composite&&<span style={{color:C.textMuted,fontSize:11}}>({formatTime(composite.timeMs)} total)</span>}
                          {composite&&(()=>{const stds=(evt.qualifyingStandards||[]);return getAllQualifyingForResult(data,events,{eventId:evtId,timeMs:composite.timeMs,meetId:composite.meetId}).map(q=><QStdBadge key={q.id} data={data} std={q} />);})()}
                          {bestSplit&&r.id===bestSplit.id&&<span style={{fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:6,background:'#6b46c120',color:'#6b46c1'}}>Best</span>}
                          <button style={{...S.btn,...S.btnDanger,fontSize:9,padding:'2px 6px'}} title="Delete this split (and its relay composite + siblings)" onClick={()=>{if(window.confirm('Delete this leg split? Other legs and the relay composite for the same race will be removed too.')) save({...data, results:(data.results||[]).filter(x=>{if(x.id===r.id) return false; if(x.isRelaySplit && x.eventId===r.eventId && x.meetId===r.meetId && x.date===r.date) return false; if(x.isRelay && x.eventId===r.eventId && x.meetId===r.meetId && x.date===r.date) return false; return true;})});}}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Modal open={showAddResult} onClose={()=>setShowAddResult(false)} width={420}>
        <h2 style={{...S.h2,marginBottom:16}}>Add Previous Result / PR</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Event</label>
            <select style={{...S.select,width:'100%'}} value={resultForm.eventId} onChange={e=>setResultForm({...resultForm,eventId:e.target.value})}>
              <option value="">Select event</option>
              {athleteEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}
            </select>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Date</label>
            <input style={S.input} type="date" value={resultForm.date} onChange={e=>setResultForm({...resultForm,date:e.target.value})} />
          </div>
          {resultForm.eventId && isFieldEvent(events.find(e=>e.id===resultForm.eventId)) ? (
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Distance / Height</label>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:50}} type="text" inputMode="numeric" placeholder="ft" value={resultForm.ft} onChange={e=>setResultForm({...resultForm,ft:e.target.value})} /><span style={{fontSize:12,color:C.textMuted}}>'</span></div>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:50}} type="text" inputMode="numeric" placeholder="in" value={resultForm.inch} onChange={e=>setResultForm({...resultForm,inch:e.target.value})} /><span style={{fontSize:12,color:C.textMuted}}>"</span></div>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:60}} type="text" inputMode="decimal" placeholder=".00" value={resultForm.qtr} onChange={e=>setResultForm({...resultForm,qtr:e.target.value})} /></div>
              </div>
            </div>
          ) : resultForm.eventId ? (
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Time</label>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:50}} type="text" inputMode="numeric" placeholder="min" value={resultForm.min} onChange={e=>setResultForm({...resultForm,min:e.target.value})} /><span style={{fontSize:12,color:C.textMuted}}>:</span></div>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:70}} type="text" inputMode="decimal" placeholder="sec" value={resultForm.sec} onChange={e=>setResultForm({...resultForm,sec:e.target.value})} /></div>
              </div>
            </div>
          ) : null}
          <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Note (optional)</label>
            <input style={S.input} placeholder="e.g. Previous season, invitational..." value={resultForm.note} onChange={e=>setResultForm({...resultForm,note:e.target.value})} />
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:4}}>
            <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowAddResult(false)}>Cancel</button>
            <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{
              const rf=resultForm;
              if(!rf.eventId) return;
              const evt=events.find(e=>e.id===rf.eventId);
              const result={id:uid(),athleteId,eventId:rf.eventId,date:rf.date||new Date().toISOString().split('T')[0],note:rf.note||'',isManual:true};
              if(isFieldEvent(evt)){result.ft=parseInt(rf.ft)||0;result.inch=parseInt(rf.inch)||0;result.qtr=parseFloat(rf.qtr)||0;}
              else{result.timeMs=parseTimeToMs(rf.min,rf.sec);}
              save({...data,results:[...data.results,result]});
              setShowAddResult(false);
              setResultForm({eventId:'',date:'',min:'',sec:'',ft:'',inch:'',qtr:'',note:''});
            }}>Save Result</button>
          </div>
        </div>
      </Modal>
      
      {(()=>{
        const groups = data.workoutGroups||[];
        const categories = data.workoutCategories||[];
        const library = data.workoutLibrary||[];
        const catColors = {}; categories.forEach(cc=>{catColors[cc.name]=cc.color||'#8c929e';});
        const today = new Date().toISOString().split('T')[0];
        const todayDate = new Date(today+'T12:00:00');
        const dow = todayDate.getDay();
        const monday = new Date(todayDate);
        monday.setDate(todayDate.getDate() - (dow===0?6:dow-1));
        const mondayStr = monday.toISOString().split('T')[0];
        const week = (data.workoutPlans||[]).find(w=>padDate(w.startDate)===mondayStr);
        if(!week) return null;
        const myGroups = athleteGroups.length>0 ? athleteGroups : [];
        if(!myGroups.length) return null;
        const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const todayDay = dayNames[dow];
        const overrides = week.athleteOverrides||[];
        const getOverride = (day) => overrides.find(o=>o.athleteId===athleteId&&o.day===day);
        const saveOverride = (day, items, isRest) => {
          const existing = overrides.filter(o=>!(o.athleteId===athleteId&&o.day===day));
          existing.push({athleteId, day, items:items||[], isRest:!!isRest});
          save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id===week.id?{...w,athleteOverrides:existing}:w)});
        };
        const clearOverride = (day) => {
          save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id===week.id?{...w,athleteOverrides:(w.athleteOverrides||[]).filter(o=>!(o.athleteId===athleteId&&o.day===day))}:w)});
          setEditPracticeDay(null);
        };
        const openDayEditor = (day, groupId, level) => {
          const ov = getOverride(day);
          if(ov){
            setPracticeEditItems(ov.items.map(it=>({...it})));
          } else {
            const groupItems = (week.entries||[]).filter(e=>e.groupId===groupId&&e.level===level&&e.day===day);
            setPracticeEditItems(groupItems.map(it=>({name:it.name||it.workoutName||'',category:it.category||'',mileage:it.mileage||'',type:it.type||''})));
          }
          setEditPracticeDay(day);
        };
        const calcAthleteWeekMi = (w) => {
          if(!w) return 0;
          const ov = w.athleteOverrides||[];
          let total = 0;
          ['Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day=>{
            const athleteOv = ov.find(o=>o.athleteId===athleteId&&o.day===day);
            let items = [];
            if(athleteOv) {
              if(athleteOv.isRest) return;
              items = athleteOv.items||[];
            } else {
              myGroups.forEach(ag=>{
                const lv = ag.level||((groups.find(g=>g.id===ag.groupId)||{}).levels||['Level 1'])[0];
                items = items.concat((w.entries||[]).filter(e=>e.groupId===ag.groupId&&e.level===lv&&e.day===day));
              });
            }
            items.forEach(e=>{
              total += entryTotalMiles(e);
            });
          });
          return total;
        };
        const allPlans = (data.workoutPlans||[]).sort((a,b)=>(padDate(a.startDate)||'').localeCompare(padDate(b.startDate)||''));
        const weekIdx = allPlans.findIndex(w=>w.id===week.id);
        const prevWeek = weekIdx>0 ? allPlans[weekIdx-1] : null;
        const thisWeekMi = calcAthleteWeekMi(week);
        const prevWeekMi = calcAthleteWeekMi(prevWeek);
        const miPctDiff = prevWeekMi>0 ? ((thisWeekMi-prevWeekMi)/prevWeekMi)*100 : null;
        return (
          <div style={S.card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h2 style={{...S.h2,marginBottom:0}}>This Week's Practice</h2>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                {thisWeekMi>0&&<span style={{fontSize:12,color:C.accent,fontWeight:700,background:C.accentMuted,padding:'3px 10px',borderRadius:12}}>{thisWeekMi.toFixed(1)} mi</span>}
                {thisWeekMi>0&&miPctDiff!==null&&<span style={{fontSize:10,fontWeight:600,color:miPctDiff>0?C.success:miPctDiff<0?C.danger:C.textMuted,padding:'2px 6px',borderRadius:10,background:miPctDiff>0?C.successMuted:miPctDiff<0?C.dangerMuted:C.surface2}}>{miPctDiff>0?'▲':miPctDiff<0?'▼':'='} {Math.abs(miPctDiff).toFixed(0)}%</span>}
                <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 10px'}} onClick={()=>nav('practicePlans',{weekId:week.id})}>View Full Week</button>
              </div>
            </div>
            {myGroups.map(ag=>{
              const group = groups.find(g=>g.id===ag.groupId);
              if(!group) return null;
              const level = ag.level||group.levels[0]||'Level 1';
              return (
                <div key={ag.groupId+level} style={{marginBottom:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.accent,textTransform:'uppercase',marginBottom:4}}>{group.name}{group.levels.length>1?' - '+level:''}</div>
                  <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}><div style={{display:'grid',gridTemplateColumns:'repeat(6,minmax(70px,1fr))',gap:4,minWidth:420}}>
                    {['Mon','Tue','Wed','Thu','Fri','Sat'].map(day=>{
                      const ov = getOverride(day);
                      const hasOverride = !!ov;
                      const items = hasOverride ? ov.items : (week.entries||[]).filter(e=>e.groupId===ag.groupId&&e.level===level&&e.day===day);
                      const rest = hasOverride ? ov.isRest : (week.restDays||[]).some(rd=>rd.groupId===ag.groupId&&rd.level===level&&rd.day===day);
                      const isToday = day===todayDay;
                      const isEditing = editPracticeDay===day;
                      const dayMi = rest?0:items.reduce((t,e)=>t+entryTotalMiles(e),0);
                      return (
                        <div key={day} style={{padding:'5px 4px',borderRadius:4,background:isToday?C.accentMuted:hasOverride?'rgba(201,106,31,0.06)':C.bg,border:isEditing?`2px solid ${C.accent}`:isToday?`2px solid ${C.accent}`:hasOverride?`1px dashed ${C.accent}`:`1px solid ${C.borderLight}`,minHeight:48,fontSize:10,cursor:'pointer',position:'relative'}} onClick={()=>openDayEditor(day,ag.groupId,level)}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
                            <span style={{fontWeight:700,color:isToday?C.accent:C.textMuted,fontSize:9}}>
                              {day}{hasOverride&&<span style={{color:C.accent,marginLeft:1}} title="Custom">*</span>}
                            </span>
                            {dayMi>0&&<span style={{fontSize:8,fontWeight:700,color:C.accent}}>{dayMi.toFixed(1)}</span>}
                          </div>
                          {rest && <div style={{color:C.success,fontStyle:'italic',textAlign:'center',fontSize:9}}>Rest</div>}
                          {items.map((it,ii)=>(
                            <div key={ii} style={{marginBottom:1}}>
                              <div style={{fontWeight:600,color:catColors[it.category]||C.text,lineHeight:1.2}}>{it.name||it.workoutName||'-'}</div>
                              {it.mileage&&<div style={{color:C.accent,fontWeight:600}}>{it.mileage}mi</div>}
                            </div>
                          ))}
                          {!rest&&!items.length&&<div style={{color:C.borderLight,textAlign:'center'}}>-</div>}
                        </div>
                      );
                    })}
                  </div></div>
                </div>
              );
            })}
            {editPracticeDay && (()=>{
              const library = data.workoutLibrary||[];
              const apf = athPracticeForm;
              const searchQ = apf.workoutSearch||'';
              const catFilter = apf.category||'';
              const typeFilter = apf.type||'';
              const filtered = library.filter(w=>{
                if(catFilter && (w.category||(w.categories||[])[0]||'').toLowerCase()!==catFilter.toLowerCase()) return false;
                if(typeFilter && (w.type||'').toLowerCase()!==typeFilter.toLowerCase()) return false;
                if(searchQ && !w.name.toLowerCase().includes(searchQ.toLowerCase()) && !(w.description||'').toLowerCase().includes(searchQ.toLowerCase())) return false;
                return true;
              });
              const allCats = [...new Set(library.map(l=>l.category||(l.categories||[])[0]||'').filter(Boolean))].sort();
              const allTypes = [...new Set((catFilter?library.filter(l=>(l.category||(l.categories||[])[0]||'').toLowerCase()===catFilter.toLowerCase()):library).map(l=>l.type||'').filter(Boolean))].sort();
              const addFromLib = (w) => {
                setPracticeEditItems([...practiceEditItems, {name:w.name,category:w.category||(w.categories||[])[0]||'',mileage:w.mileage||'',type:w.type||''}]);
                setAthPracticeForm({...apf,workoutSearch:''});
              };
              const createAndAdd = () => {
                const nw = newWorkoutForm;
                if(!nw.name.trim()) return;
                const newW = {id:uid(),name:nw.name.trim(),category:nw.category||'',type:nw.type||'',mileage:nw.mileage||'',description:nw.description||'',exercises:[],isDefault:false};
                save({...data,workoutLibrary:[...(data.workoutLibrary||[]),newW]});
                setPracticeEditItems([...practiceEditItems, {name:newW.name,category:newW.category,mileage:newW.mileage,type:newW.type}]);
                setNewWorkoutForm({name:'',category:'',type:'',mileage:'',description:''});
                setShowCreateWorkout(false);
              };
              return (
              <div style={{marginTop:8,padding:'12px 14px',borderRadius:6,border:`1px solid ${C.accent}`,background:C.accentMuted}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.accent}}>{editPracticeDay} - {athDisplay(athlete)}</span>
                  <div style={{display:'flex',gap:4}}>
                    {getOverride(editPracticeDay)&&<button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'3px 8px'}} onClick={()=>clearOverride(editPracticeDay)}>Reset to Group</button>}
                    <button style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:14}} onClick={()=>{setEditPracticeDay(null);setShowCreateWorkout(false);}}>✕</button>
                  </div>
                </div>
                {practiceEditItems.map((it,i)=>{
                  const isEd = editingPracticeIdx===i;
                  return (
                  <div key={i} style={{marginBottom:4,padding:'6px 10px',background:C.surface,borderRadius:4,border:`1px solid ${isEd?C.accent:C.borderLight}`}}>
                    {!isEd ? (
                      <div style={{display:'flex',gap:4,alignItems:'center'}}>
                        <span style={{flex:2,fontSize:12,fontWeight:600,color:catColors[it.category]||C.text,cursor:'pointer'}} onClick={()=>setEditingPracticeIdx(i)}>{it.name||'-'}</span>
                        <span style={{fontSize:10,color:C.textMuted}}>{it.category}{it.type?' / '+it.type:''}</span>
                        {it.mileage&&<span style={{fontSize:10,color:C.accent,fontWeight:600}}>{it.mileage}mi</span>}
                        <button style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:10,padding:'2px 4px'}} onClick={()=>setEditingPracticeIdx(i)}>Edit</button>
                        <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12,padding:'2px 4px'}} onClick={()=>{const c=[...practiceEditItems];c.splice(i,1);setPracticeEditItems(c);if(editingPracticeIdx===i)setEditingPracticeIdx(null);}}>✕</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{display:'flex',gap:4,marginBottom:4}}>
                          <input style={{...S.input,flex:2,fontSize:11,padding:'4px 8px'}} placeholder="Name" value={it.name} onChange={e=>{const c=[...practiceEditItems];c[i]={...c[i],name:e.target.value};setPracticeEditItems(c);}} />
                          <input style={{...S.input,width:50,fontSize:11,padding:'4px 8px'}} placeholder="mi" value={it.mileage||''} onChange={e=>{const c=[...practiceEditItems];c[i]={...c[i],mileage:e.target.value};setPracticeEditItems(c);}} />
                        </div>
                        <div style={{display:'flex',gap:4,marginBottom:4}}>
                          <div style={{flex:1,position:'relative'}}>
                            <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Category" value={it.category||''} onChange={e=>{const c=[...practiceEditItems];c[i]={...c[i],category:e.target.value};setPracticeEditItems(c);}} onFocus={()=>athPFocus('editCat'+i)} onBlur={athPBlur} />
                            {athPracticeFocus===('editCat'+i)&&(()=>{const opts=allCats.filter(cat=>!it.category||cat.toLowerCase().includes((it.category||'').toLowerCase()));return opts.length>0&&(
                              <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:20,maxHeight:120,overflowY:'auto'}}>
                                {opts.map(cat=><div key={cat} style={{padding:'5px 8px',fontSize:11,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{const c=[...practiceEditItems];c[i]={...c[i],category:cat};setPracticeEditItems(c);setAthPracticeFocus('');}}>{cat}</div>)}
                              </div>);})()}
                          </div>
                          <div style={{flex:1,position:'relative'}}>
                            <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Type" value={it.type||''} onChange={e=>{const c=[...practiceEditItems];c[i]={...c[i],type:e.target.value};setPracticeEditItems(c);}} onFocus={()=>athPFocus('editType'+i)} onBlur={athPBlur} />
                            {athPracticeFocus===('editType'+i)&&(()=>{const tOpts=[...new Set(library.map(l=>l.type||'').filter(Boolean))].sort().filter(t=>!it.type||t.toLowerCase().includes((it.type||'').toLowerCase()));return tOpts.length>0&&(
                              <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:20,maxHeight:120,overflowY:'auto'}}>
                                {tOpts.map(t=><div key={t} style={{padding:'5px 8px',fontSize:11,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{const c=[...practiceEditItems];c[i]={...c[i],type:t};setPracticeEditItems(c);setAthPracticeFocus('');}}>{t}</div>)}
                              </div>);})()}
                          </div>
                        </div>
                        <button style={{...S.btn,...S.btnPrimary,fontSize:10,padding:'3px 8px'}} onClick={()=>setEditingPracticeIdx(null)}>Done</button>
                      </div>
                    )}
                  </div>);
                })}
                <div style={{marginTop:6,padding:'8px',background:C.surface,borderRadius:6,border:`1px solid ${C.borderLight}`}}>
                  <div style={{position:'relative',marginBottom:6}}>
                    <input style={{...S.input,fontSize:12,padding:'8px 10px'}} placeholder="Search workouts..." value={searchQ} onChange={e=>setAthPracticeForm({...apf,workoutSearch:e.target.value})} onFocus={()=>athPFocus('athSearch')} onBlur={athPBlur} />
                    {athPracticeFocus==='athSearch'&&searchQ&&filtered.length>0&&(
                      <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,boxShadow:'0 4px 16px rgba(0,0,0,0.12)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                        {filtered.slice(0,20).map(w=>(
                          <div key={w.id} style={{padding:'8px 12px',cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`,fontSize:12}} onMouseDown={()=>addFromLib(w)}>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                              <span style={{fontWeight:600}}>{w.name}</span>
                              <span style={{color:C.textMuted,fontSize:10}}>{w.category||(w.categories||[])[0]||''}{w.type?' / '+w.type:''}</span>
                            </div>
                            {(w.mileage||w.description)&&<div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{w.mileage?w.mileage+'mi ':''}{w.description||''}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6}}>
                    <select style={{...S.select,fontSize:11,padding:'3px 6px'}} value={catFilter} onChange={e=>setAthPracticeForm({...apf,category:e.target.value,type:''})}>
                      <option value="">All Categories</option>
                      {allCats.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                    <select style={{...S.select,fontSize:11,padding:'3px 6px'}} value={typeFilter} onChange={e=>setAthPracticeForm({...apf,type:e.target.value})}>
                      <option value="">All Types</option>
                      {allTypes.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    {(catFilter||typeFilter)&&<button style={{background:'none',border:'none',color:C.accent,cursor:'pointer',fontSize:10,fontWeight:600}} onClick={()=>setAthPracticeForm({category:'',type:'',workoutSearch:''})}>Clear</button>}
                  </div>
                  <div style={{maxHeight:160,overflowY:'auto',borderTop:`1px solid ${C.borderLight}`}}>
                    {filtered.map(w=>(
                      <div key={w.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 8px',borderBottom:`1px solid ${C.borderLight}`,cursor:'pointer',fontSize:11}} onClick={()=>addFromLib(w)}>
                        <div style={{flex:1,minWidth:0}}>
                          <span style={{fontWeight:600,color:C.text}}>{w.name}</span>
                          <span style={{color:C.textMuted,marginLeft:6,fontSize:10}}>{w.category||(w.categories||[])[0]||''}{w.type?' / '+w.type:''}</span>
                          {w.mileage&&<span style={{color:C.accent,marginLeft:6,fontWeight:600}}>{w.mileage}mi</span>}
                        </div>
                        <span style={{color:C.accent,fontWeight:700,fontSize:16,flexShrink:0,marginLeft:8}}>+</span>
                      </div>
                    ))}
                    {filtered.length===0&&<div style={{fontSize:11,color:C.textMuted,padding:10,textAlign:'center'}}>No workouts match filters</div>}
                  </div>
                </div>
                <div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>
                  <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 10px'}} onClick={()=>setShowCreateWorkout(!showCreateWorkout)}>+ Create New Workout</button>
                  <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 10px'}} onClick={()=>{saveOverride(editPracticeDay,[],true);setEditPracticeDay(null);setShowCreateWorkout(false);}}>Set Rest Day</button>
                  <button style={{...S.btn,...S.btnPrimary,fontSize:10,padding:'4px 10px',marginLeft:'auto'}} onClick={()=>{saveOverride(editPracticeDay,practiceEditItems.filter(it=>it.name.trim()),false);setEditPracticeDay(null);setShowCreateWorkout(false);}}>Save</button>
                </div>
                {showCreateWorkout&&(
                  <div style={{marginTop:8,padding:'10px',background:C.bg,borderRadius:6,border:`1px dashed ${C.accent}`}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.accent,marginBottom:6}}>New Workout (saves to library)</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,marginBottom:4}}>
                      <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Name *" value={newWorkoutForm.name} onChange={e=>setNewWorkoutForm({...newWorkoutForm,name:e.target.value})} />
                      <div style={{position:'relative'}}>
                        <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Category" value={newWorkoutForm.category} onChange={e=>setNewWorkoutForm({...newWorkoutForm,category:e.target.value})} onFocus={()=>{setNewWFocus('nwCat');athPFocus('nwCat');}} onBlur={athPBlur} />
                        {athPracticeFocus==='nwCat'&&(()=>{const opts=allCats.filter(c=>!newWorkoutForm.category||c.toLowerCase().includes(newWorkoutForm.category.toLowerCase()));return opts.length>0&&(
                          <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:20,maxHeight:120,overflowY:'auto'}}>
                            {opts.map(c=><div key={c} style={{padding:'5px 8px',fontSize:11,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setNewWorkoutForm({...newWorkoutForm,category:c});setAthPracticeFocus('');}}>{c}</div>)}
                          </div>);})()}
                      </div>
                      <div style={{position:'relative'}}>
                        <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Type" value={newWorkoutForm.type} onChange={e=>setNewWorkoutForm({...newWorkoutForm,type:e.target.value})} onFocus={()=>{setNewWFocus('nwType');athPFocus('nwType');}} onBlur={athPBlur} />
                        {athPracticeFocus==='nwType'&&(()=>{const tOpts=[...new Set(library.map(l=>l.type||'').filter(Boolean))].sort().filter(t=>!newWorkoutForm.type||t.toLowerCase().includes(newWorkoutForm.type.toLowerCase()));return tOpts.length>0&&(
                          <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:20,maxHeight:120,overflowY:'auto'}}>
                            {tOpts.map(t=><div key={t} style={{padding:'5px 8px',fontSize:11,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setNewWorkoutForm({...newWorkoutForm,type:t});setAthPracticeFocus('');}}>{t}</div>)}
                          </div>);})()}
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:4,marginBottom:6}}>
                      <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Mileage" value={newWorkoutForm.mileage} onChange={e=>setNewWorkoutForm({...newWorkoutForm,mileage:e.target.value})} />
                      <input style={{...S.input,fontSize:11,padding:'4px 8px'}} placeholder="Description" value={newWorkoutForm.description} onChange={e=>setNewWorkoutForm({...newWorkoutForm,description:e.target.value})} />
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      <button style={{...S.btn,...S.btnPrimary,fontSize:10,padding:'4px 10px'}} onClick={createAndAdd}>Create & Add</button>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 10px'}} onClick={()=>setShowCreateWorkout(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
              );
            })()}
          </div>
        );
      })()}
      
      <Modal open={showEditInfo} onClose={()=>setShowEditInfo(false)} width={480}>
        <h2 style={S.h2}>Edit Athlete</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>First Name</label><input style={S.input} value={editForm.firstName||''} onChange={e=>setEditForm({...editForm,firstName:e.target.value})} /></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Last Name</label><input style={S.input} value={editForm.lastName||''} onChange={e=>setEditForm({...editForm,lastName:e.target.value})} /></div>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Preferred Name <span style={{fontWeight:400,color:C.textMuted}}>(optional)</span></label><input style={S.input} placeholder="Displayed instead of first name" value={editForm.preferredName||''} onChange={e=>setEditForm({...editForm,preferredName:e.target.value})} /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Grad Year</label><input style={S.input} value={editForm.gradYear||''} onChange={e=>setEditForm({...editForm,gradYear:e.target.value})} /></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Gender</label>
              <select style={{...S.select,width:'100%'}} value={editForm.gender||''} onChange={e=>setEditForm({...editForm,gender:e.target.value})}>
                <option value="">-</option><option value="M">Boy</option><option value="F">Girl</option>
              </select>
            </div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Status</label>
              <select style={{...S.select,width:'100%'}} value={editForm.active?'active':'inactive'} onChange={e=>setEditForm({...editForm,active:e.target.value==='active'})}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{fontSize:12,color:C.textSecondary}}>Groups</label>
            {(editForm.groups||[]).map((ag,i)=>(
              <div key={i} style={{display:'flex',gap:6,alignItems:'center',marginTop:4}}>
                <select style={{...S.select,flex:1}} value={ag.groupId} onChange={e=>{const c=[...(editForm.groups||[])];c[i]={...c[i],groupId:e.target.value};setEditForm({...editForm,groups:c});}}>
                  <option value="">Select group</option>
                  {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <select style={S.select} value={ag.level||''} onChange={e=>{const c=[...(editForm.groups||[])];c[i]={...c[i],level:e.target.value};setEditForm({...editForm,groups:c});}}>
                  {((groups.find(g=>g.id===ag.groupId)||{}).levels||['Level 1']).map(l=><option key={l} value={l}>{l}</option>)}
                </select>
                <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer'}} onClick={()=>{const c=[...(editForm.groups||[])];c.splice(i,1);setEditForm({...editForm,groups:c});}}>✕</button>
              </div>
            ))}
            <button style={{...S.btn,...S.btnSecondary,fontSize:11,marginTop:6}} onClick={()=>setEditForm({...editForm,groups:[...(editForm.groups||[]),{groupId:'',level:'Level 1'}]})}>+ Add Group</button>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Notes</label><textarea style={{...S.input,height:60,resize:'vertical'}} value={editForm.notes||''} onChange={e=>setEditForm({...editForm,notes:e.target.value})} /></div>
          <button style={{...S.btn,...S.btnPrimary}} onClick={saveEdit}>Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}
function DailyPracticeView({ data, nav, date }) {
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dateObj = new Date((date||new Date().toISOString().split('T')[0])+'T12:00:00');
  const dayName = dayNames[dateObj.getDay()];
  const dateStr = dateObj.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const dow = dateObj.getDay();
  const monday = new Date(dateObj);
  monday.setDate(dateObj.getDate() - (dow === 0 ? 6 : dow - 1));
  const mondayStr = monday.toISOString().split('T')[0];
  const week = (data.workoutPlans||[]).find(w => padDate(w.startDate) === mondayStr);
  const groups = data.workoutGroups || [];
  const categories = data.workoutCategories || [];
  const catColors = {}; categories.forEach(c => { catColors[c.name] = c.color || '#8c929e'; });
  const getDayItems = (groupId, level) => {
    if(!week) return [];
    return (week.entries||[]).filter(e => e.groupId===groupId && e.level===level && e.day===dayName);
  };
  const isRest = (groupId, level) => {
    if(!week) return false;
    return (week.restDays||[]).some(rd => rd.groupId===groupId && rd.level===level && rd.day===dayName);
  };
  const hasAnyContent = groups.some(g => g.levels.some(lv => getDayItems(g.id, lv).length > 0 || isRest(g.id, lv)));
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <button style={S.backLink} onClick={()=>nav('dashboard')}>{"<- "}Dashboard</button>
        {week && <button style={{...S.btn,...S.btnSecondary,fontSize:11}} onClick={()=>nav('practicePlans',{weekId:week.id})}>Go to Week -></button>}
      </div>
      <h1 style={S.h1}>{dayName+"'s Practice"}</h1>
      <p style={S.h3}>{dateStr}</p>
      {!hasAnyContent && (
        <div style={{...S.card, textAlign:'center', padding:30, color:C.textSecondary}}>
          {week ? 'No workouts planned for this day.' : 'No week found for this date.'}
        </div>
      )}
      {groups.map(group => {
        const groupHasContent = group.levels.some(lv => getDayItems(group.id, lv).length > 0 || isRest(group.id, lv));
        if(!groupHasContent) return null;
        return (
          <div key={group.id} style={{marginBottom:20}}>
            <h2 style={{fontSize:16,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:10}}>{group.name}</h2>
            {group.levels.map(level => {
              const items = getDayItems(group.id, level);
              const rest = isRest(group.id, level);
              if(!items.length && !rest) return null;
              return (
                <div key={level} style={{marginBottom:12,marginLeft:group.levels.length>1?12:0}}>
                  {group.levels.length > 1 && <div style={{fontSize:12,fontWeight:600,color:C.textSecondary,marginBottom:6}}>{level}</div>}
                  {rest ? (
                    <div style={{...S.card,padding:'16px 20px',textAlign:'center',color:C.textMuted,fontStyle:'italic',fontSize:14}}>Rest Day</div>
                  ) : (
                    items.map(item => {
                      const exercises = item.exercises || [];
                      return (
                        <div key={item.id} style={{...S.card, padding:'14px 18px', borderLeft:`4px solid ${catColors[item.category]||C.textMuted}`}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:exercises.length>0?10:0}}>
                            <div>
                              <div style={{fontSize:15,fontWeight:700,color:C.text}}>{item.name}</div>
                              <div style={{display:'flex',gap:8,marginTop:2}}>
                                {item.category && <span style={{fontSize:11,color:catColors[item.category]||C.textMuted,fontWeight:600}}>{item.category}</span>}
                                {item.type && <span style={{fontSize:11,color:C.textSecondary}}>{item.type}</span>}
                              </div>
                              {item.description&&<div style={{fontSize:12,color:C.textMuted,marginTop:4,fontStyle:'italic'}}>{item.description}</div>}
                            </div>
                          </div>
                          {exercises.length > 0 && (()=>{
                            const isExp = expandedWorkouts[item.id];
                            const summary = exercises.map(ex=>ex.exercise).filter(Boolean).join(', ');
                            return (<div>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',padding:'4px 0'}} onClick={()=>setExpandedWorkouts(p=>({...p,[item.id]:!p[item.id]}))}>
                                <div style={{fontSize:11,color:C.textSecondary}}>
                                  <span style={{fontWeight:600}}>{exercises.length} exercise{exercises.length!==1?'s':''}</span>
                                  {!isExp&&summary&&<span style={{marginLeft:6,color:C.textMuted}}>{summary.length>60?summary.slice(0,60)+'...':summary}</span>}
                                </div>
                                <span style={{fontSize:11,color:C.accent,fontWeight:600}}>{isExp?'^ Hide':'v Show'}</span>
                              </div>
                              {isExp&&(
                                <div style={{overflowX:'auto',marginTop:4}}>
                                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                                    <thead><tr>
                                      <th style={{...S.th,padding:'6px 8px',width:36}}>Set</th>
                                      {EXERCISE_COLUMNS.map(col=>(<th key={col.key} style={{...S.th,padding:'6px 8px'}}>{col.label}</th>))}
                                    </tr></thead>
                                    <tbody>{exercises.map((ex,i)=>(
                                      <tr key={i}>
                                        <td style={{...S.td,padding:'6px 8px',textAlign:'center',fontWeight:600,color:C.textMuted}}>{i+1}</td>
                                        {EXERCISE_COLUMNS.map(col=>(
                                          <td key={col.key} style={{...S.td,padding:'6px 8px',fontSize:13}}>{ex[col.key]||<span style={{color:C.border}}>-</span>}</td>
                                        ))}
                                      </tr>
                                    ))}</tbody>
                                  </table>
                                </div>
                              )}
                            </div>);
                          })()}
                          {exercises.length===0&&(item.mileage||item.time||item.distance||item.sets||item.reps||item.weight||item.effort)&&(
                            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
                              {item.mileage&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Mileage:</span> <span style={{fontWeight:600,color:C.accent}}>{item.mileage} mi</span></div>}
                              {item.time&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Time:</span> <span style={{fontWeight:600}}>{item.time}</span></div>}
                              {item.distance&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Distance:</span> <span style={{fontWeight:600}}>{item.distance}</span></div>}
                              {item.sets&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Sets:</span> <span style={{fontWeight:600}}>{item.sets}</span></div>}
                              {item.reps&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Reps:</span> <span style={{fontWeight:600}}>{item.reps}</span></div>}
                              {item.weight&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Weight:</span> <span style={{fontWeight:600}}>{item.weight}</span></div>}
                              {item.effort&&<div style={{fontSize:13}}><span style={{color:C.textMuted}}>Effort:</span> <span style={{fontWeight:600}}>{item.effort}</span></div>}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
const emptyRow = () => ({ exercise:'', type:'', time:'', mileage:'', distance:'', reps:'', weight:'', effort:'' });
function ExerciseTable({ exercises, onChange, readOnly, library }) {
  const [focusCell, setFocusCell] = useState('');
  const [dragRow, setDragRow] = useState(null);
  const [dragOverRow, setDragOverRow] = useState(null);
  const blurRef = useRef(null);
  const onFocus = (f) => { clearTimeout(blurRef.current); setFocusCell(f); };
  const onBlur = () => { blurRef.current = setTimeout(()=>setFocusCell(''), 200); };
  const moveRow = (from, to) => {
    if(from===to||!onChange) return;
    const c=[...exercises]; const [item]=c.splice(from,1); c.splice(to,0,item); onChange(c);
  };
  const exerciseCatalog = useMemo(() => {
    if(!library) return [];
    const map = {};
    (library||[]).forEach(w => {
      (w.exercises||[]).forEach(ex => {
        const name = (ex.exercise||'').trim();
        if(name && !map[name.toLowerCase()]) map[name.toLowerCase()] = {...ex, exercise:name};
      });
    });
    return Object.values(map).sort((a,b)=>a.exercise.localeCompare(b.exercise));
  }, [library]);
  return (
    <div style={{overflowX:'auto',marginTop:4}}>
      <table style={{width:'100%',borderCollapse:'collapse',minWidth:580}}>
        <thead><tr>
          {!readOnly && <th style={{...S.th,width:28,padding:'6px 2px'}}></th>}
          <th style={{...S.th,width:36,padding:'6px 6px',fontSize:12}}>Set</th>
          {EXERCISE_COLUMNS.map(col=>(<th key={col.key} style={{...S.th,width:col.width==='flex'?undefined:col.width,padding:'6px 6px',fontSize:12}}>{col.label}</th>))}
          {!readOnly && <th style={{...S.th,width:56,padding:'6px 6px'}}></th>}
        </tr></thead>
        <tbody>
          {exercises.map((row,i)=>(
            <tr key={i} draggable={!readOnly} data-rowidx={i}
              onDragStart={readOnly?undefined:()=>setDragRow(i)}
              onDragOver={readOnly?undefined:e=>{e.preventDefault();setDragOverRow(i);}}
              onDrop={readOnly?undefined:()=>{if(dragRow!==null&&dragRow!==i)moveRow(dragRow,i);setDragRow(null);setDragOverRow(null);}}
              onDragEnd={readOnly?undefined:()=>{setDragRow(null);setDragOverRow(null);}}
              style={{opacity:dragRow===i?0.4:1,background:dragOverRow===i&&dragRow!==i?C.accentMuted:'transparent',transition:'background 0.1s'}}>
              {!readOnly && <td style={{...S.td,padding:'3px 2px',textAlign:'center',cursor:'grab',color:C.textMuted,fontSize:14,userSelect:'none'}}>:::</td>}
              <td style={{...S.td,textAlign:'center',padding:'4px 6px',fontSize:13,fontWeight:600,color:C.textMuted}}>{i+1}</td>
              {EXERCISE_COLUMNS.map(col=>(
                <td key={col.key} style={{...S.td,padding:'3px 4px',position:col.key==='exercise'?'relative':undefined}}>
                  {readOnly ? <span style={{fontSize:13,color:row[col.key]?C.text:C.textMuted}}>{row[col.key]||'-'}</span> :
                  <input style={{...S.input,padding:'6px 8px',fontSize:13,border:`1px solid ${C.borderLight}`,background:C.surface}} value={row[col.key]||''} placeholder={col.placeholder}
                    onChange={e=>{const c=[...exercises];c[i]={...c[i],[col.key]:e.target.value};onChange(c);}}
                    onFocus={col.key==='exercise'?()=>onFocus(`ex-${i}`):undefined}
                    onBlur={col.key==='exercise'?onBlur:undefined}
                  />}
                  {!readOnly && col.key==='exercise' && focusCell===`ex-${i}` && (()=>{
                    const q = (row.exercise||'').toLowerCase();
                    const opts = exerciseCatalog.filter(ex=>!q||ex.exercise.toLowerCase().includes(q));
                    return opts.length>0 && (
                      <div style={{position:'absolute',top:'100%',left:0,minWidth:240,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.12)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                        {opts.slice(0,10).map(ex=>(
                          <div key={ex.exercise} style={{padding:'8px 12px',fontSize:13,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}}
                            onMouseDown={()=>{
                              const c=[...exercises];
                              c[i]={...c[i],exercise:ex.exercise,type:ex.type||c[i].type||'',time:ex.time||c[i].time||'',mileage:ex.mileage||c[i].mileage||'',distance:ex.distance||c[i].distance||'',reps:ex.reps||c[i].reps||'',weight:ex.weight||c[i].weight||'',effort:ex.effort||c[i].effort||''};
                              onChange(c);setFocusCell('');
                            }}>
                            <div style={{fontWeight:600,color:C.text}}>{ex.exercise}</div>
                            <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{[ex.type,ex.time?`T:${ex.time}`:'',ex.reps?`${ex.reps} reps`:'',ex.distance?`${ex.distance}m`:'',ex.mileage?`${ex.mileage}mi`:''].filter(Boolean).join(' - ')}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </td>
              ))}
              {!readOnly && <td style={{...S.td,padding:'3px 4px',whiteSpace:'nowrap'}}>
                <button title="Duplicate" style={{background:'none',border:'none',color:C.textSecondary,cursor:'pointer',fontSize:14,padding:4}} onClick={()=>{const c=[...exercises];c.splice(i+1,0,{...row});onChange(c);}}>++</button>
                <button title="Remove" style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:14,padding:4}} onClick={()=>{const c=[...exercises];c.splice(i,1);onChange(c);}}>✕</button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && <button style={{...S.btn,...S.btnSecondary,fontSize:12,marginTop:6,padding:'6px 14px'}} onClick={()=>onChange([...exercises,emptyRow()])}>+ Add Row</button>}
    </div>
  );
}
function PracticePlansPage({ data, save, nav, season, initialWeekId }) {
  const [tab, setTab] = useState('weekly');
  const [selectedWeek, setSelectedWeek] = useState(()=>{
    if(initialWeekId) return initialWeekId;
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    const mondayStr = monday.toISOString().split('T')[0];
    const match = (data.workoutPlans||[]).find(w=>w.startDate===mondayStr);
    return match ? match.id : null;
  });
  const [editingDay, setEditingDay] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [dragDay, setDragDay] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [swapSelect, setSwapSelect] = useState(null);
  const swapDays = (weekId, groupId, level, fromDay, toDay) => {
    if(fromDay===toDay) return;
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>{
      if(w.id!==weekId) return w;
      const entries = (w.entries||[]).map(e=>{
        if(e.groupId!==groupId||e.level!==level) return e;
        if(e.day===fromDay) return {...e, day:toDay};
        if(e.day===toDay) return {...e, day:fromDay};
        return e;
      });
      const restDays = (w.restDays||[]).map(r=>{
        if(r.groupId!==groupId||r.level!==level) return r;
        if(r.day===fromDay) return {...r, day:toDay};
        if(r.day===toDay) return {...r, day:fromDay};
        return r;
      });
      return {...w, entries, restDays};
    })});
  };
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [focusField, setFocusField] = useState('');
  const blurTimeout = useRef(null);
  const handleFocus = (field) => { clearTimeout(blurTimeout.current); setFocusField(field); };
  const handleBlur = () => { blurTimeout.current = setTimeout(()=>setFocusField(''), 200); };
  const [addItemForm, setAddItemForm] = useState({ category:'', type:'', workoutId:'' });
  const [delWeekId, setDelWeekId] = useState(null);
  const [showEditMeets, setShowEditMeets] = useState(false);
  const [showAddLib, setShowAddLib] = useState(false);
  const [editLibId, setEditLibId] = useState(null);
  const [libForm, setLibForm] = useState({ name:'', category:'', type:'', isDefault:false, exercises:[{ exercise:'', type:'', time:'', distance:'', reps:'', weight:'', effort:'' }] });
  const [libSearch, setLibSearch] = useState('');
  const [expandedLib, setExpandedLib] = useState({});
  const [libCatFilter, setLibCatFilter] = useState('');
  const [libTypeFilter, setLibTypeFilter] = useState('');
  const [libSort, setLibSort] = useState('name');
  const [showImportLib, setShowImportLib] = useState(false);
  const [importLibText, setImportLibText] = useState('');
  const [showEditGroup, setShowEditGroup] = useState(null);
  const [groupForm, setGroupForm] = useState({ name:'', levels:[] });
  const [newLevelInput, setNewLevelInput] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [bulkAssignGroup, setBulkAssignGroup] = useState(null);
  const [bulkAssignLevel, setBulkAssignLevel] = useState('');
  const [bulkSelected, setBulkSelected] = useState({});
  const [showAddCat, setShowAddCat] = useState(false);
  const [catForm, setCatForm] = useState({ name:'', color:'#2b6cb0' });
  const [editCatId, setEditCatId] = useState(null);
  const [delCatId, setDelCatId] = useState(null);
  const groups = data.workoutGroups || [];
  const library = data.workoutLibrary || [];
  const categories = data.workoutCategories || [];
  const plans = (data.workoutPlans||[]).sort((a,b)=>(a.startDate||'').localeCompare(b.startDate||''));
  const defaultCat = (categories[0]||{}).name || 'Main';
  const catColors = {}; categories.forEach(c => { catColors[c.name] = c.color || C.textMuted; });
  const weekLabel = (sd) => { if(!sd) return 'New Week'; const d=new Date(sd+'T12:00:00'); return `Week of ${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`; };
  useEffect(() => {
    if(!season) return;
    const existing = new Set((data.workoutPlans||[]).map(w=>w.startDate));
    const start = new Date(season.startDate+'T12:00:00');
    const end = new Date(season.endDate+'T12:00:00');
    const dow = start.getDay();
    const firstMon = new Date(start); firstMon.setDate(start.getDate()-(dow===0?6:dow-1));
    const newWeeks = [];
    const d = new Date(firstMon);
    while(d <= end) {
      const ds = d.toISOString().split('T')[0];
      if(!existing.has(ds)) newWeeks.push({ id:uid(), startDate:ds, meetIds:[], entries:[], restDays:[] });
      d.setDate(d.getDate()+7);
    }
    if(newWeeks.length > 0) save({...data, workoutPlans:[...(data.workoutPlans||[]), ...newWeeks]});
  }, [(season||{}).id]);
  const dayCatLib = addItemForm.category ? library.filter(l=>(l.category||(l.categories||[])[0]||"").toLowerCase().includes(addItemForm.category.toLowerCase())) : library;
  const dayTypesInCat = [...new Set(dayCatLib.map(l=>l.type||'').filter(Boolean))].sort();
  const dayTypeLib = addItemForm.type ? dayCatLib.filter(l=>(l.type||"").toLowerCase().includes(addItemForm.type.toLowerCase())) : dayCatLib;
  const daySelW = addItemForm.workoutId ? dayTypeLib.find(l=>l.id===addItemForm.workoutId) : null;
  const getSyncSource = (gid, lv) => {
    const g = groups.find(gr=>gr.id===gid);
    return g && g.levelSync ? g.levelSync[lv] || null : null;
  };
  const hasOwnItems = (wid,gid,lv,day) => {
    const w = (data.workoutPlans||[]).find(w=>w.id===wid);
    if(!w) return false;
    return (w.entries||[]).some(e=>e.groupId===gid&&e.level===lv&&e.day===day) || (w.restDays||[]).some(rd=>rd.groupId===gid&&rd.level===lv&&rd.day===day);
  };
  const getDayItems = (wid,gid,lv,day) => {
    const w = (data.workoutPlans||[]).find(w=>w.id===wid);
    if(!w) return [];
    const own = (w.entries||[]).filter(e=>e.groupId===gid&&e.level===lv&&e.day===day);
    if(own.length>0) return own;
    const syncSrc = getSyncSource(gid,lv);
    if(syncSrc && !hasOwnItems(wid,gid,lv,day)) {
      return (w.entries||[]).filter(e=>e.groupId===gid&&e.level===syncSrc&&e.day===day);
    }
    return [];
  };
  const isRestDay = (wid,gid,lv,day) => {
    const w = (data.workoutPlans||[]).find(w=>w.id===wid);
    if(!w) return false;
    if((w.restDays||[]).some(rd=>rd.groupId===gid&&rd.level===lv&&rd.day===day)) return true;
    const syncSrc = getSyncSource(gid,lv);
    if(syncSrc && !hasOwnItems(wid,gid,lv,day)) {
      return (w.restDays||[]).some(rd=>rd.groupId===gid&&rd.level===syncSrc&&rd.day===day);
    }
    return false;
  };
  const isSynced = (wid,gid,lv,day) => {
    const syncSrc = getSyncSource(gid,lv);
    return syncSrc && !hasOwnItems(wid,gid,lv,day);
  };
  const copyFromSync = (wid,gid,lv,day) => {
    const syncSrc = getSyncSource(gid,lv);
    if(!syncSrc) return;
    const w = (data.workoutPlans||[]).find(w2=>w2.id===wid);
    if(!w) return;
    const srcItems = (w.entries||[]).filter(e=>e.groupId===gid&&e.level===syncSrc&&e.day===day);
    const srcRest = (w.restDays||[]).some(rd=>rd.groupId===gid&&rd.level===syncSrc&&rd.day===day);
    const newEntries = srcItems.map(e=>({...e,id:uid(),level:lv}));
    const newRds = srcRest?[{groupId:gid,level:lv,day}]:[];
    save({...data,workoutPlans:(data.workoutPlans||[]).map(w2=>w2.id!==wid?w2:{...w2,entries:[...(w2.entries||[]),...newEntries],restDays:[...(w2.restDays||[]),...newRds]})});
  };
  const restoreSync = (wid,gid,lv,day) => {
    save({...data,workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).filter(e=>!(e.groupId===gid&&e.level===lv&&e.day===day)),restDays:(w.restDays||[]).filter(rd=>!(rd.groupId===gid&&rd.level===lv&&rd.day===day))})});
  };
  const addDayItem = (wid,gid,lv,day,item) => {
    const synced = isSynced(wid,gid,lv,day);
    if(synced) {
      const syncSrc = getSyncSource(gid,lv);
      const w = (data.workoutPlans||[]).find(w2=>w2.id===wid);
      if(w&&syncSrc) {
        const srcItems = (w.entries||[]).filter(e=>e.groupId===gid&&e.level===syncSrc&&e.day===day);
        const copied = srcItems.map(e=>({...e,id:uid(),level:lv}));
        save({...data, workoutPlans:(data.workoutPlans||[]).map(w2=>w2.id!==wid?w2:{...w2,entries:[...(w2.entries||[]),...copied,{id:uid(),groupId:gid,level:lv,day,...item}]})});
        return;
      }
    }
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:[...(w.entries||[]),{id:uid(),groupId:gid,level:lv,day,...item}]})});
  };
  const removeDayItem = (wid,iid) => {
    if(editingDay) {
      const {groupId,level,day} = editingDay;
      const synced = isSynced(wid,groupId,level,day);
      if(synced) {
        const syncSrc = getSyncSource(groupId,level);
        const w = (data.workoutPlans||[]).find(w2=>w2.id===wid);
        if(w&&syncSrc) {
          const srcItems = (w.entries||[]).filter(e=>e.groupId===groupId&&e.level===syncSrc&&e.day===day);
          const copied = srcItems.filter(e=>e.id!==iid).map(e=>({...e,id:uid(),level}));
          save({...data, workoutPlans:(data.workoutPlans||[]).map(w2=>w2.id!==wid?w2:{...w2,entries:[...(w2.entries||[]),...copied]})});
          return;
        }
      }
    }
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).filter(e=>e.id!==iid)})});
  };
  const updateDayItem = (wid,iid,updates) => save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).map(e=>e.id===iid?{...e,...updates}:e)})});
  const replaceDayItem = (wid,iid,newWorkout) => {
    if(editingDay) {
      const {groupId,level,day} = editingDay;
      const synced = isSynced(wid,groupId,level,day);
      if(synced) {
        const syncSrc = getSyncSource(groupId,level);
        const w = (data.workoutPlans||[]).find(w2=>w2.id===wid);
        if(w && syncSrc) {
          const srcItems = (w.entries||[]).filter(e=>e.groupId===groupId&&e.level===syncSrc&&e.day===day);
          const newEntries = srcItems.map(e=>{
            const newId = uid();
            if(e.id===iid) return {...e,id:newId,level,name:newWorkout.name,category:newWorkout.category||(newWorkout.categories||[])[0]||'',type:newWorkout.type||'',description:newWorkout.description||'',exercises:newWorkout.exercises||[],mileage:newWorkout.mileage||'',time:newWorkout.time||'',distance:newWorkout.distance||'',sets:newWorkout.sets||'',reps:newWorkout.reps||'',weight:newWorkout.weight||'',effort:newWorkout.effort||''};
            return {...e,id:newId,level};
          });
          save({...data, workoutPlans:(data.workoutPlans||[]).map(w2=>w2.id!==wid?w2:{...w2,entries:[...(w2.entries||[]),...newEntries]})});
          setReplaceItemId(null);
          setReplaceSearch('');
          return;
        }
      }
    }
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).map(e=>e.id!==iid?e:{...e,name:newWorkout.name,category:newWorkout.category||(newWorkout.categories||[])[0]||'',type:newWorkout.type||'',description:newWorkout.description||'',exercises:newWorkout.exercises||[],mileage:newWorkout.mileage||'',time:newWorkout.time||'',distance:newWorkout.distance||'',sets:newWorkout.sets||'',reps:newWorkout.reps||'',weight:newWorkout.weight||'',effort:newWorkout.effort||''})})});
    setReplaceItemId(null);
    setReplaceSearch('');
  };
  const [replaceItemId, setReplaceItemId] = useState(null);
  const [replaceSearch, setReplaceSearch] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemForm, setEditItemForm] = useState({});
  const saveEditItem = () => {
    if(!editItemId||!editingDay) return;
    const {weekId,groupId,level,day} = editingDay;
    const synced = isSynced(weekId,groupId,level,day);
    if(synced) {
      const syncSrc = getSyncSource(groupId,level);
      const w = (data.workoutPlans||[]).find(w2=>w2.id===weekId);
      if(w&&syncSrc) {
        const srcItems = (w.entries||[]).filter(e=>e.groupId===groupId&&e.level===syncSrc&&e.day===day);
        const newEntries = srcItems.map(e=>{
          const nid=uid();
          if(e.id===editItemId) return {...e,id:nid,level,...editItemForm};
          return {...e,id:nid,level};
        });
        save({...data,workoutPlans:(data.workoutPlans||[]).map(w2=>w2.id!==weekId?w2:{...w2,entries:[...(w2.entries||[]),...newEntries]})});
        setEditItemId(null);setEditItemForm({});return;
      }
    }
    updateDayItem(weekId,editItemId,editItemForm);
    setEditItemId(null);setEditItemForm({});
  };
  const moveDayItem = (wid,gid,lv,day,fromIdx,toIdx) => {
    const plan = (data.workoutPlans||[]).find(w=>w.id===wid);
    if(!plan) return;
    const dayItems = (plan.entries||[]).filter(e=>e.groupId===gid&&e.level===lv&&e.day===day);
    const otherItems = (plan.entries||[]).filter(e=>!(e.groupId===gid&&e.level===lv&&e.day===day));
    if(fromIdx<0||toIdx<0||fromIdx>=dayItems.length||toIdx>=dayItems.length) return;
    const moved = [...dayItems];
    const [item] = moved.splice(fromIdx, 1);
    moved.splice(toIdx, 0, item);
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:[...otherItems,...moved]})});
  };
  const clearDay = (wid,gid,lv,day) => save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).filter(e=>!(e.groupId===gid&&e.level===lv&&e.day===day)),restDays:(w.restDays||[]).filter(rd=>!(rd.groupId===gid&&rd.level===lv&&rd.day===day))})});
  const setRestDay = (wid,gid,lv,day,on) => save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>{if(w.id!==wid)return w;const rds=(w.restDays||[]).filter(rd=>!(rd.groupId===gid&&rd.level===lv&&rd.day===day));if(on)rds.push({groupId:gid,level:lv,day});return{...w,restDays:rds,entries:on?(w.entries||[]).filter(e=>!(e.groupId===gid&&e.level===lv&&e.day===day)):(w.entries||[])};})});
  const applyDefaults = (wid,gid,lv,day) => library.filter(l=>l.isDefault).forEach(d=>addDayItem(wid,gid,lv,day,{category:d.category||(d.categories||[])[0]||defaultCat,type:d.type||'',name:d.name,exercises:d.exercises||[]}));
  const METERS_PER_MILE = 1609.34;
  const getWeekMileage = (wid,gid,lv) => {
    let total = 0;
    DAYS.forEach(day => {
      const items = getDayItems(wid,gid,lv,day);
      items.forEach(e => { total += entryTotalMiles(e); });
    });
    return total;
  };
  const deleteWeek = () => { save({...data,workoutPlans:(data.workoutPlans||[]).filter(w=>w.id!==delWeekId)}); setDelWeekId(null); if(selectedWeek===delWeekId) setSelectedWeek(null); };
  const curWeek = plans.find(w=>w.id===selectedWeek);
  const curWeekIdx = plans.findIndex(w=>w.id===selectedWeek);
  const filteredLib = library.filter(l=>{
    if(libSearch&&!l.name.toLowerCase().includes(libSearch.toLowerCase())&&!(l.description||'').toLowerCase().includes(libSearch.toLowerCase())&&!(l.exercises||[]).some(ex=>(ex.exercise||'').toLowerCase().includes(libSearch.toLowerCase()))) return false;
    if(libCatFilter&&(l.category||(l.categories||[])[0])!==libCatFilter) return false;
    if(libTypeFilter&&(l.type||'')!==libTypeFilter) return false;
    return true;
  }).sort((a,b)=>{
    if(libSort==='mileage') return (b.mileage||0)-(a.mileage||0);
    return ((a.category||(a.categories||[])[0])||'').localeCompare((b.category||(b.categories||[])[0])||'')||(a.type||'').localeCompare(b.type||'')||(a.name||'').localeCompare(b.name||'');
  });
  const typesForFilter = [...new Set(library.filter(l=>!libCatFilter||(l.category||(l.categories||[])[0])===libCatFilter).map(l=>l.type||'').filter(Boolean))].sort();
  const startAddLib = () => { setLibForm({ name:'', category:'', type:'', description:'', isDefault:false, exercises:[emptyRow()], mileage:'',time:'',distance:'',sets:'',reps:'',weight:'',effort:'' }); setEditLibId(null); setShowAddLib(true); };
  const startEditLib = (item) => { setLibForm({ name:item.name, category:item.category||(item.categories||[])[0]||defaultCat, type:item.type||'', description:item.description||'', isDefault:!!item.isDefault, exercises:(item.exercises||[]).length>0?item.exercises.map(e=>({...e})):[emptyRow()], mileage:item.mileage||'',time:item.time||'',distance:item.distance||'',sets:item.sets||'',reps:item.reps||'',weight:item.weight||'',effort:item.effort||'' }); setEditLibId(item.id); setShowAddLib(true); };
  const saveLib = () => {
    if(!libForm.name) return;
    const exercises = (libForm.exercises||[]).filter(e=>e.exercise.trim());
    const item = { id:editLibId||uid(), name:libForm.name, category:libForm.category, type:libForm.type, description:libForm.description||'', isDefault:libForm.isDefault, exercises, mileage:libForm.mileage||'',time:libForm.time||'',distance:libForm.distance||'',sets:libForm.sets||'',reps:libForm.reps||'',weight:libForm.weight||'',effort:libForm.effort||'' };
    save({...data, workoutLibrary:editLibId?(data.workoutLibrary||[]).map(l=>l.id===editLibId?item:l):[...(data.workoutLibrary||[]),item]});
    setShowAddLib(false); setEditLibId(null);
  };
  const deleteLib = (id) => save({...data,workoutLibrary:(data.workoutLibrary||[]).filter(l=>l.id!==id)});
  const startEditGroup = (g) => { setGroupForm({name:g.name,levels:[...g.levels],levelSync:{...(g.levelSync||{})}}); setShowEditGroup(g.id); };
  const addNewGroup = () => { const g={id:uid(),name:'New Group',levels:['Level 1'],levelSync:{}}; save({...data,workoutGroups:[...(data.workoutGroups||[]),g]}); startEditGroup(g); };
  const saveGroup = () => { if(!groupForm.name) return; save({...data,workoutGroups:(data.workoutGroups||[]).map(g=>g.id===showEditGroup?{...g,name:groupForm.name,levels:groupForm.levels,levelSync:groupForm.levelSync||{}}:g)}); setShowEditGroup(null); };
  const deleteGroup = (id) => save({...data,workoutGroups:(data.workoutGroups||[]).filter(g=>g.id!==id)});
  const removeFromGroup = (athleteId, groupId) => {
    save({...data, athletes:data.athletes.map(a=>{
      if(a.id!==athleteId) return a;
      const newGroups = (a.groups||[]).filter(ag=>ag.groupId!==groupId);
      return {...a, groups:newGroups, trainingGroup:a.trainingGroup===groupId?'':a.trainingGroup};
    })});
  };
  const addToGroup = (athleteId, groupId, level) => {
    save({...data, athletes:data.athletes.map(a=>{
      if(a.id!==athleteId) return a;
      const existing = (a.groups||[]).filter(ag=>ag.groupId!==groupId);
      return {...a, groups:[...existing, {groupId, level}]};
    })});
  };
  const bulkApply = () => {
    if(!bulkAssignGroup||!bulkAssignLevel) return;
    const ids = Object.keys(bulkSelected).filter(k=>bulkSelected[k]);
    if(!ids.length) return;
    save({...data, athletes:data.athletes.map(a=>{
      if(!ids.includes(a.id)) return a;
      const existing = (a.groups||[]).filter(ag=>ag.groupId!==bulkAssignGroup);
      return {...a, groups:[...existing, {groupId:bulkAssignGroup, level:bulkAssignLevel}]};
    })});
    setBulkSelected({});
    setBulkAssignGroup(null);
  };
  const addLevel = () => { if(!newLevelInput.trim()) return; setGroupForm(f=>({...f,levels:[...f.levels,newLevelInput.trim()]})); setNewLevelInput(''); };
  const saveCat = () => {
    if(!catForm.name) return;
    if(editCatId) save({...data,workoutCategories:(data.workoutCategories||[]).map(wc=>wc.id===editCatId?{...wc,...catForm}:wc)});
    else save({...data,workoutCategories:[...(data.workoutCategories||[]),{id:uid(),...catForm}]});
    setShowAddCat(false); setEditCatId(null); setCatForm({name:'',color:'#2b6cb0'});
  };
  const deleteCat = () => { save({...data,workoutCategories:(data.workoutCategories||[]).filter(wc=>wc.id!==delCatId)}); setDelCatId(null); };
  const dayItems = editingDay ? getDayItems(editingDay.weekId, editingDay.groupId, editingDay.level, editingDay.day) : [];
  const dayRest = editingDay ? isRestDay(editingDay.weekId, editingDay.groupId, editingDay.level, editingDay.day) : false;
  const dayGroupName = editingDay ? ((groups.find(g=>g.id===editingDay.groupId)||{}).name||'') : '';
  const libGrouped = {};
  filteredLib.forEach(l=>{const cat=l.category||(l.categories||[])[0]||'Uncategorized';if(!libGrouped[cat])libGrouped[cat]={};const tp=l.type||'General';if(!libGrouped[cat][tp])libGrouped[cat][tp]=[];libGrouped[cat][tp].push(l);});
  const tabStyle = (active) => ({ padding:'8px 16px', fontSize:13, fontWeight:active?600:400, color:active?C.accent:C.textSecondary, borderBottom:active?`2px solid ${C.accent}`:'2px solid transparent', background:'none', border:'none', cursor:'pointer' });
  return (
    <div>
      <div style={{display:'flex',gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:16}}>
        {[['weekly','Weekly Plans'],['library','Library'],['groups','Groups'],['categories','Categories']].map(([k,l])=>(
          <button key={k} style={tabStyle(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      
      {tab==='weekly' && (<div>
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
          {curWeekIdx>0 && <button style={{...S.btn,...S.btnSecondary,padding:'4px 10px'}} onClick={()=>setSelectedWeek(plans[curWeekIdx-1].id)}>{"<-"}</button>}
          <select style={{...S.select,minWidth:220}} value={selectedWeek||''} onChange={e=>setSelectedWeek(e.target.value||null)}>
            <option value="">Select a week...</option>
            {plans.map(w=><option key={w.id} value={w.id}>{weekLabel(w.startDate)} ({w.startDate})</option>)}
          </select>
          {curWeekIdx>=0&&curWeekIdx<plans.length-1 && <button style={{...S.btn,...S.btnSecondary,padding:'4px 10px'}} onClick={()=>setSelectedWeek(plans[curWeekIdx+1].id)}>-></button>}
          <button style={{...S.btn,...S.btnPrimary,fontSize:11}} onClick={()=>{
            const nm=new Date();const dow=nm.getDay();nm.setDate(nm.getDate()+(dow===0?1:8-dow));
            const w={id:uid(),startDate:nm.toISOString().split('T')[0],meetIds:[],entries:[],restDays:[]};
            save({...data,workoutPlans:[...(data.workoutPlans||[]),w]});setSelectedWeek(w.id);
          }}>+ Week</button>
          {selectedWeek && <button style={{...S.btn,...S.btnDanger,fontSize:11}} onClick={()=>setDelWeekId(selectedWeek)}>Delete</button>}
        </div>
        {curWeek ? (<div>
          <h2 style={{...S.h2,marginBottom:8}}>{weekLabel(curWeek.startDate)}</h2>
          {groups.map(group=>{
            const prevWeek = curWeekIdx>0 ? plans[curWeekIdx-1] : null;
            return (<div key={group.id} style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'0.04em',margin:0,fontFamily:HEADING_FONT}}>{group.name}</h3>
            </div>
            {group.levels.map(level=>{
              const mi=getWeekMileage(curWeek.id,group.id,level);
              const prevMi=prevWeek?getWeekMileage(prevWeek.id,group.id,level):0;
              const pctDiff=prevMi>0?((mi-prevMi)/prevMi)*100:null;
              return (<div key={level} style={{...S.card,padding:'12px 16px',marginBottom:6}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,alignItems:'center'}}>
                  {group.levels.length>1&&<span style={{fontSize:12,fontWeight:600}}>{level}</span>}
                  <div style={{display:'flex',alignItems:'center',gap:6,marginLeft:'auto'}}>
                    {mi>0&&<span style={{fontSize:12,color:C.accent,fontWeight:700,background:C.accentMuted,padding:'2px 8px',borderRadius:10}}>{mi.toFixed(1)} mi</span>}
                    {mi>0&&pctDiff!==null&&<span style={{fontSize:11,fontWeight:600,color:pctDiff>0?C.success:pctDiff<0?C.danger:C.textMuted,padding:'2px 8px',borderRadius:10,background:pctDiff>0?C.successMuted:pctDiff<0?C.dangerMuted:C.surface2}}>{pctDiff>0?'^':pctDiff<0?'v':'='} {Math.abs(pctDiff).toFixed(0)}% vs prev</span>}
                    {mi>0&&prevMi>0&&<span style={{fontSize:10,color:C.textMuted}}>({prevMi.toFixed(1)}mi)</span>}
                  </div>
                </div>
                <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch',margin:'0 -4px',padding:'0 4px'}}>
                <div style={{display:'grid',gridTemplateColumns:`repeat(${DAYS.length},minmax(85px,1fr))`,gap:4}}>
                  {DAYS.map((day,dayIdx)=>{
                    const items=getDayItems(curWeek.id,group.id,level,day);
                    const rest=isRestDay(curWeek.id,group.id,level,day);
                    const ws = padDate(curWeek.startDate);
                    const cellDate = (()=>{ const d=new Date(ws+'T12:00:00'); d.setDate(d.getDate()+dayIdx); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
                    const meet = data.meets.find(m=>{ const sd=padDate(m.startDate||m.date||''); const ed=padDate(m.endDate||m.startDate||m.date||''); return sd&&cellDate>=sd&&cellDate<=ed; });
                    const dayMi = items.reduce((t,e)=>t+entryTotalMiles(e),0);
                    const dayDragKey = `${group.id}|${level}|${day}`;
                    const isDayDragOver = dragOverDay===dayDragKey && dragDay!==dayDragKey;
                    const isSwapSelected = swapSelect===dayDragKey;
                    const isSwapTarget = swapSelect && swapSelect!==dayDragKey && swapSelect.split('|')[0]===group.id && swapSelect.split('|')[1]===level;
                    const daySynced = isSynced(curWeek.id,group.id,level,day);
                    const syncSrc = getSyncSource(group.id,level);
                    return (<div key={day} draggable
                      onDragStart={e=>{e.stopPropagation();setDragDay(dayDragKey);}}
                      onDragOver={e=>{e.preventDefault();e.stopPropagation();setDragOverDay(dayDragKey);}}
                      onDrop={e=>{e.stopPropagation();if(dragDay&&dragDay!==dayDragKey){const[gid,lv,fromDay]=dragDay.split('|');if(gid===group.id&&lv===level)swapDays(curWeek.id,group.id,level,fromDay,day);}setDragDay(null);setDragOverDay(null);}}
                      onDragEnd={()=>{setDragDay(null);setDragOverDay(null);}}
                      style={{padding:'6px 8px',borderRadius:6,background:isSwapSelected?C.accentMuted:isDayDragOver?C.accentMuted:meet?C.dangerMuted:rest?C.surface2:items.length?C.surface:C.bg,border:isSwapSelected?`2px solid ${C.accent}`:isSwapTarget?`2px dashed ${C.accent}`:`1px solid ${isDayDragOver?C.accent:meet?C.danger+'66':rest?C.border:items.length?C.borderLight:C.border}`,cursor:'pointer',minHeight:60,fontSize:11,opacity:dragDay===dayDragKey?0.4:1,transition:'background 0.1s, opacity 0.1s'}}
                      onClick={()=>{
                        if(swapSelect && swapSelect!==dayDragKey) {
                          const[gid,lv,fromDay]=swapSelect.split('|');
                          if(gid===group.id&&lv===level){swapDays(curWeek.id,group.id,level,fromDay,day);}
                          setSwapSelect(null);
                        } else {
                          setEditingDay({weekId:curWeek.id,groupId:group.id,level,day});setShowAddItem(false);setShowCreateNew(false);
                        }
                      }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                        <span style={{fontWeight:600,color:C.textMuted,fontSize:10,textTransform:'uppercase'}}>{day}{daySynced&&<span style={{color:C.blue,marginLeft:3,fontSize:8}} title={'Synced from '+syncSrc}>⟳</span>}</span>
                        <div style={{display:'flex',alignItems:'center',gap:3}}>
                          {dayMi>0&&<span style={{fontSize:9,fontWeight:700,color:C.accent}}>{dayMi.toFixed(1)}mi</span>}
                          <button style={{background:'none',border:'none',color:isSwapSelected?C.accent:C.textMuted,cursor:'pointer',fontSize:10,padding:'0 2px',fontWeight:700}} onClick={e=>{e.stopPropagation();setSwapSelect(isSwapSelected?null:dayDragKey);}} title="Tap to swap">{isSwapSelected?'✕':'⇄'}</button>
                        </div>
                      </div>
                      {meet&&<div style={{fontSize:9,fontWeight:700,color:C.danger,marginBottom:3,padding:'2px 4px',background:'rgba(197,48,48,0.15)',borderRadius:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',cursor:'pointer'}} onClick={e=>{e.stopPropagation();nav('meetSub',{meetId:meet.id});}}>{"<> "}{meet.name}</div>}
                      {rest?<div style={{color:C.textMuted,fontStyle:'italic',fontSize:10}}>Rest</div>:
                       items.length>0?items.map(item=>(<div key={item.id} style={{marginBottom:2}}>
                        <span style={{color:catColors[item.category]||C.textMuted,fontSize:8,marginRight:3}}>*</span>
                        <span style={{fontWeight:500,color:C.text,fontSize:10}}>{item.name||item.type}</span>
                       </div>)):<div style={{color:C.textMuted,fontSize:10}}>-</div>}
                    </div>);
                  })}
                </div>
                </div>
              </div>);
            })}
          </div>);})}
        </div>) : (<div style={{...S.card,textAlign:'center',padding:30,color:C.textSecondary,fontSize:13}}>{plans.length===0?'No weeks yet. Set up a season in Settings to auto-generate.':'Select a week above.'}</div>)}
        
        <Modal open={!!editingDay} onClose={()=>{setEditingDay(null);setShowAddItem(false);setShowCreateNew(false);}} width={560}>
          {editingDay&&(()=>{
            const items=getDayItems(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day);
            const rest=isRestDay(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day);
            const gName=(groups.find(g=>g.id===editingDay.groupId)||{}).name||'';
            return (<>
              <h2 style={{fontSize:18,fontWeight:700,margin:'0 0 4px',color:C.text,fontFamily:HEADING_FONT}}>{editingDay.day} - {gName}</h2>
              {(()=>{
                const dayIdx=DAYS.indexOf(editingDay.day);
                if(dayIdx<0||!(curWeek||{}).startDate) return null;
                const ws=padDate(curWeek.startDate);
                const d=new Date(ws+'T12:00:00'); d.setDate(d.getDate()+dayIdx);
                const cellDate=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                const meet=data.meets.find(m=>{const sd=padDate(m.startDate||m.date||'');const ed=padDate(m.endDate||m.startDate||m.date||'');return sd&&cellDate>=sd&&cellDate<=ed;});
                return meet && (
                <div style={{fontSize:12,fontWeight:600,color:C.danger,padding:'4px 10px',background:C.dangerMuted,borderRadius:6,marginBottom:8,cursor:'pointer',display:'inline-block'}} onClick={()=>nav('meetSub',{meetId:meet.id})}>{"<> "}{meet.name}</div>
              );})()}
              <div style={{display:'flex',gap:10,marginTop:12,marginBottom:16,flexWrap:'wrap'}}>
                <button style={{...S.btn,fontSize:13,padding:'10px 20px',borderRadius:8,...(rest?{background:C.accent,color:C.white}:S.btnSecondary)}} onClick={()=>setRestDay(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day,!rest)}>
                  {rest?'✓ Rest Day':'Rest Day'}
                </button>
                {items.length>0&&<button style={{...S.btn,...S.btnDanger,fontSize:13,padding:'10px 20px',borderRadius:8}} onClick={()=>clearDay(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day)}>Clear Day</button>}
                {(()=>{
                  const syncSrc=getSyncSource(editingDay.groupId,editingDay.level);
                  const synced=isSynced(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day);
                  if(!syncSrc) return null;
                  return synced
                    ? <button style={{...S.btn,fontSize:12,padding:'10px 16px',borderRadius:8,background:C.blue+'20',color:C.blue,border:`1px solid ${C.blue}`}} onClick={()=>copyFromSync(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day)}>Override (copy from {syncSrc})</button>
                    : <button style={{...S.btn,fontSize:12,padding:'10px 16px',borderRadius:8,background:C.surface2,color:C.textSecondary,border:`1px solid ${C.border}`}} onClick={()=>restoreSync(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day)}>Restore Sync</button>;
                })()}
              </div>
              {(()=>{const ss=getSyncSource(editingDay.groupId,editingDay.level);const sy=isSynced(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day);return ss&&sy?<div style={{fontSize:11,color:C.blue,marginBottom:8,padding:'4px 8px',background:C.blue+'10',borderRadius:4}}>Synced from {ss} — edit to override</div>:null;})()}
              {!rest&&<>
                {items.map((item,itemIdx)=>(<div key={item.id} draggable
                  onDragStart={()=>setDragIdx(itemIdx)}
                  onDragOver={e=>{e.preventDefault();setDragOverIdx(itemIdx);}}
                  onDrop={()=>{if(dragIdx!==null&&dragIdx!==itemIdx)moveDayItem(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day,dragIdx,itemIdx);setDragIdx(null);setDragOverIdx(null);}}
                  onDragEnd={()=>{setDragIdx(null);setDragOverIdx(null);}}
                  onTouchStart={e=>{setDragIdx(itemIdx);}}
                  onTouchMove={e=>{
                    const touch=e.touches[0];const el=document.elementFromPoint(touch.clientX,touch.clientY);
                    if(el){const row=el.closest('[data-dragidx]');if(row){setDragOverIdx(parseInt(row.dataset.dragidx));}}
                  }}
                  onTouchEnd={()=>{if(dragIdx!==null&&dragOverIdx!==null&&dragIdx!==dragOverIdx)moveDayItem(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day,dragIdx,dragOverIdx);setDragIdx(null);setDragOverIdx(null);}}
                  data-dragidx={itemIdx}
                  style={{padding:'14px 16px',borderRadius:8,background:dragOverIdx===itemIdx&&dragIdx!==itemIdx?C.accentMuted:dragIdx===itemIdx?C.surface2:C.surface,border:`1px solid ${dragOverIdx===itemIdx&&dragIdx!==itemIdx?C.accent:C.borderLight}`,borderLeft:`4px solid ${catColors[item.category]||C.textMuted}`,marginBottom:10,opacity:dragIdx===itemIdx?0.5:1,transition:'background 0.15s, opacity 0.15s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:(item.exercises||[]).length>0||replaceItemId===item.id?8:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,flex:1,minWidth:0}}>
                      <span style={{cursor:'grab',fontSize:18,color:C.textMuted,userSelect:'none',flexShrink:0,padding:'0 4px'}} title="Drag to reorder">:::</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:15,fontWeight:700,color:C.text}}>{item.name}</div>
                        {item.type&&<div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{item.type}</div>}
                        {item.description&&<div style={{fontSize:12,color:C.textMuted,marginTop:2,fontStyle:'italic'}}>{item.description}</div>}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:6,flexShrink:0}}>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px',borderRadius:8}} onClick={()=>{setReplaceItemId(null);setReplaceSearch('');if(editItemId===item.id){saveEditItem();}else{setEditItemId(item.id);setEditItemForm({mileage:item.mileage||'',time:item.time||'',distance:item.distance||'',sets:item.sets||'',reps:item.reps||'',weight:item.weight||'',effort:item.effort||'',exercises:(item.exercises||[]).map(ex=>({...ex}))});}}}>{editItemId===item.id?'Save':'Edit'}</button>
                      {editItemId===item.id&&<button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px',borderRadius:8}} onClick={()=>{setEditItemId(null);setEditItemForm({});}}>Cancel</button>}
                      <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px',borderRadius:8}} onClick={()=>{setEditItemId(null);setEditItemForm({});if(replaceItemId===item.id){setReplaceItemId(null);setReplaceSearch('');}else{setReplaceItemId(item.id);setReplaceSearch('');}}}>{replaceItemId===item.id?'Cancel':'Replace'}</button>
                      <button style={{...S.btn,...S.btnDanger,fontSize:12,padding:'6px 12px',borderRadius:8}} onClick={()=>removeDayItem(editingDay.weekId,item.id)}>Remove</button>
                    </div>
                  </div>
                  {editItemId===item.id&&(
                    <div style={{padding:'8px 0',borderTop:`1px solid ${C.borderLight}`}}>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))',gap:6,marginBottom:8}}>
                        {[{key:'mileage',label:'Mileage (mi)'},{key:'time',label:'Time'},{key:'distance',label:'Distance (m)'},{key:'sets',label:'Sets'},{key:'reps',label:'Reps'},{key:'weight',label:'Weight'},{key:'effort',label:'Effort (%)'}].map(f=>(
                          <div key={f.key}><label style={{fontSize:10,color:C.textMuted,display:'block',marginBottom:2}}>{f.label}</label><input style={{...S.input,fontSize:12,padding:'6px 8px'}} value={editItemForm[f.key]||''} onChange={e=>setEditItemForm(p=>({...p,[f.key]:e.target.value}))} /></div>
                        ))}
                      </div>
                      {(editItemForm.exercises||[]).length>0&&(
                        <div style={{marginTop:4}}>
                          <div style={{fontSize:11,fontWeight:600,color:C.textSecondary,marginBottom:4}}>Exercises</div>
                          <ExerciseTable exercises={editItemForm.exercises} onChange={ex=>setEditItemForm(p=>({...p,exercises:ex}))} library={library} />
                          <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 10px',marginTop:4}} onClick={()=>setEditItemForm(p=>({...p,exercises:[...(p.exercises||[]),{exercise:'',type:'',time:'',mileage:'',distance:'',reps:'',weight:'',effort:''}]}))}>+ Row</button>
                        </div>
                      )}
                      {(editItemForm.exercises||[]).length===0&&(
                        <button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'4px 10px',marginTop:4}} onClick={()=>setEditItemForm(p=>({...p,exercises:[{exercise:'',type:'',time:'',mileage:'',distance:'',reps:'',weight:'',effort:''}]}))}>+ Add Exercises</button>
                      )}
                    </div>
                  )}
                  {replaceItemId===item.id&&(
                    <div style={{padding:'8px 0',borderTop:`1px solid ${C.borderLight}`}}>
                      <div style={{fontSize:11,fontWeight:600,color:C.accent,marginBottom:6}}>Replace with library workout:</div>
                      <input style={{...S.input,fontSize:12,padding:'8px 10px',marginBottom:6}} placeholder="Search workouts..." value={replaceSearch} onChange={e=>setReplaceSearch(e.target.value)} />
                      <div style={{maxHeight:180,overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
                        {library.filter(w=>!replaceSearch||w.name.toLowerCase().includes(replaceSearch.toLowerCase())||(w.category||'').toLowerCase().includes(replaceSearch.toLowerCase())||(w.type||'').toLowerCase().includes(replaceSearch.toLowerCase())).map(w=>(
                          <div key={w.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',borderBottom:`1px solid ${C.borderLight}`,cursor:'pointer',fontSize:12}} onClick={()=>replaceDayItem(editingDay.weekId,item.id,w)}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:600}}>{w.name}</div>
                              <div style={{fontSize:10,color:C.textMuted}}>{w.category||(w.categories||[])[0]||''}{w.type?' / '+w.type:''}{w.mileage?' - '+w.mileage+'mi':''}</div>
                            </div>
                            <span style={{color:C.accent,fontWeight:700,fontSize:14,flexShrink:0,marginLeft:8}}>→</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(item.exercises||[]).length>0&&editItemId!==item.id&&(
                    <div style={{marginTop:6}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',padding:'6px 0'}} onClick={e=>{e.stopPropagation();setExpandedItems(prev=>({...prev,[item.id]:!prev[item.id]}));}}>
                        <div style={{fontSize:11,color:C.textSecondary}}>
                          <span style={{fontWeight:600}}>{(item.exercises||[]).length} exercises</span>
                          {exTotals(item.exercises)&&<span style={{marginLeft:6,color:C.accent,fontWeight:600}}>{exTotals(item.exercises)}</span>}
                          <span style={{marginLeft:8,color:C.textMuted}}>{(item.exercises||[]).map(ex=>ex.exercise).filter(Boolean).join(', ')}</span>
                        </div>
                        <span style={{fontSize:12,color:C.accent,fontWeight:600}}>{expandedItems[item.id]?'^ Hide':'v Show'}</span>
                      </div>
                      {expandedItems[item.id]&&<ExerciseTable exercises={item.exercises} readOnly />}
                    </div>
                  )}
                  {(item.exercises||[]).length===0&&editItemId!==item.id&&(item.mileage||item.time||item.distance||item.sets||item.reps||item.weight||item.effort)&&(
                    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:6}}>
                      {item.mileage&&<span style={{fontSize:12,color:C.accent,fontWeight:600}}>{item.mileage} mi</span>}
                      {item.time&&<span style={{fontSize:12,color:C.textSecondary}}>T: {item.time}</span>}
                      {item.distance&&<span style={{fontSize:12,color:C.textSecondary}}>D: {item.distance}</span>}
                      {item.sets&&<span style={{fontSize:12,color:C.textSecondary}}>{item.sets} sets</span>}
                      {item.reps&&<span style={{fontSize:12,color:C.textSecondary}}>x{item.reps} reps</span>}
                      {item.weight&&<span style={{fontSize:12,color:C.textSecondary}}>W: {item.weight}</span>}
                      {item.effort&&<span style={{fontSize:12,color:C.textSecondary}}>E: {item.effort}</span>}
                    </div>
                  )}
                </div>))}
                {items.length===0&&!showAddItem&&<div style={{textAlign:'center',padding:24,color:C.textMuted,fontSize:14}}>No workouts planned.</div>}
                
                {showAddItem && !showCreateNew && (
                  <div style={{padding:16,borderRadius:10,border:`2px solid ${C.accent}33`,background:C.bg,marginTop:12}}>
                    <div style={{fontSize:14,fontWeight:600,color:C.accent,marginBottom:12}}>Add from Library</div>
                    <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
                      <div style={{position:'relative'}}>
                        <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Category</label>
                        <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="All categories" value={addItemForm.category||''} onChange={e=>setAddItemForm({...addItemForm,category:e.target.value,type:'',workoutId:'',workoutSearch:''})} onFocus={()=>handleFocus('dayCat')} onBlur={handleBlur} />
                        {focusField==='dayCat'&&(()=>{const opts=categories.filter(c=>!addItemForm.category||c.name.toLowerCase().includes((addItemForm.category||'').toLowerCase()));return opts.length>0&&(
                          <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                            {opts.map(c=><div key={c.id} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setAddItemForm({category:c.name,type:'',workoutId:'',workoutSearch:''});setFocusField('');}}>{c.name}</div>)}
                          </div>);})()}
                      </div>
                      <div style={{position:'relative'}}>
                        <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Type</label>
                        <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="All types" value={addItemForm.type||''} onChange={e=>setAddItemForm({...addItemForm,type:e.target.value,workoutId:'',workoutSearch:''})} onFocus={()=>handleFocus('dayType')} onBlur={handleBlur} />
                        {focusField==='dayType'&&(()=>{const opts=dayTypesInCat.filter(t=>!addItemForm.type||t.toLowerCase().includes((addItemForm.type||'').toLowerCase()));return opts.length>0&&(
                          <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                            {opts.map(t=><div key={t} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setAddItemForm({...addItemForm,type:t,workoutId:'',workoutSearch:''});setFocusField('');}}>{t}</div>)}
                          </div>);})()}
                      </div>
                      <div style={{position:'relative'}}>
                        <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Workout</label>
                        <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="Search workouts..." value={addItemForm.workoutSearch||''} onChange={e=>setAddItemForm({...addItemForm,workoutSearch:e.target.value,workoutId:''})} onFocus={()=>handleFocus('dayWork')} onBlur={handleBlur} />
                        {focusField==='dayWork'&&(()=>{const opts=dayTypeLib.filter(w=>!addItemForm.workoutSearch||w.name.toLowerCase().includes((addItemForm.workoutSearch||'').toLowerCase()));return opts.length>0&&(
                          <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:250,overflowY:'auto'}}>
                            {opts.map(w=><div key={w.id} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setAddItemForm({...addItemForm,workoutId:w.id,workoutSearch:w.name,m_mileage:w.mileage||'',m_time:w.time||'',m_distance:w.distance||'',m_sets:w.sets||'',m_reps:w.reps||'',m_weight:w.weight||'',m_effort:w.effort||''});setFocusField('');}}><div style={{display:'flex',justifyContent:'space-between'}}><span>{w.name}</span><span style={{fontSize:12,color:C.textMuted}}>{[w.type,((w.exercises||[]).length>0?`${(w.exercises||[]).length} ex`:''),exTotals(w.exercises)].filter(Boolean).join(' - ')}</span></div>{w.description&&<div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{w.description}</div>}</div>)}
                          </div>);})()}
                      </div>
                    </div>
                    {daySelW&&(daySelW.exercises||[]).length>0&&(
                      <div style={{marginBottom:12,padding:'8px 12px',borderRadius:8,background:C.surface,border:`1px solid ${C.borderLight}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setAddItemForm({...addItemForm,_previewOpen:!addItemForm._previewOpen})}>
                          <div style={{fontSize:12,color:C.textSecondary}}>
                            <span style={{fontWeight:600}}>{(daySelW.exercises||[]).length} exercises:</span>
                            {exTotals(daySelW.exercises)&&<span style={{marginLeft:6,color:C.accent,fontWeight:600}}>{exTotals(daySelW.exercises)}</span>}
                            <span style={{marginLeft:6,color:C.textMuted}}>{(daySelW.exercises||[]).map(ex=>ex.exercise).filter(Boolean).join(', ')}</span>
                          </div>
                          <span style={{fontSize:11,color:C.accent,fontWeight:600,flexShrink:0,marginLeft:8}}>{addItemForm._previewOpen?'^ Hide':'v Show'}</span>
                        </div>
                        {addItemForm._previewOpen&&<div style={{marginTop:8}}><ExerciseTable exercises={daySelW.exercises} readOnly /></div>}
                      </div>
                    )}
                    {daySelW&&(daySelW.exercises||[]).length===0&&(
                      <div style={{padding:12,borderRadius:8,background:C.surface,border:`1px solid ${C.borderLight}`,marginBottom:12}}>
                        <div style={{fontSize:12,color:C.textSecondary,marginBottom:8}}>Measurables</div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))',gap:8}}>
                          {[{key:'mileage',label:'Mileage (mi)',ph:'2.0'},{key:'time',label:'Time (m:s)',ph:'24:00'},{key:'distance',label:'Dist (m)',ph:'400m'},{key:'sets',label:'Sets',ph:'4'},{key:'reps',label:'Reps',ph:'8'},{key:'weight',label:'Wt (lbs)',ph:'25'},{key:'effort',label:'Effort (%)',ph:'80'}].map(m=>(
                            <div key={m.key}>
                              <label style={{fontSize:11,color:C.textMuted,display:'block',marginBottom:2}}>{m.label}</label>
                              <input style={{...S.input,padding:'8px 10px',fontSize:13}} placeholder={m.ph} value={addItemForm[`m_${m.key}`]||''} onChange={e=>setAddItemForm({...addItemForm,[`m_${m.key}`]:e.target.value})} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{display:'flex',gap:8}}>
                      {daySelW&&<button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'10px 24px',borderRadius:8}} onClick={()=>{
                        const measurables={};
                        ['mileage','time','distance','sets','reps','weight','effort'].forEach(k=>{if(addItemForm[`m_${k}`])measurables[k]=addItemForm[`m_${k}`];});
                        addDayItem(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day,{category:addItemForm.category||daySelW.category||(daySelW.categories||[])[0]||defaultCat,type:daySelW.type||addItemForm.type||'',name:daySelW.name,description:daySelW.description||'',exercises:(daySelW.exercises||[]).map(e=>({...e})),...measurables});
                        setAddItemForm({category:'',type:'',workoutId:'',workoutSearch:'',m_mileage:'',m_time:'',m_distance:'',m_sets:'',m_reps:'',m_weight:'',m_effort:''});
                      }}>Add Workout</button>}
                      <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'10px 20px',borderRadius:8}} onClick={()=>setShowCreateNew(true)}>+ Create New</button>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'10px 20px',borderRadius:8}} onClick={()=>setShowAddItem(false)}>Cancel</button>
                    </div>
                  </div>
                )}
                
                {showAddItem && showCreateNew && (
                  <div style={{padding:16,borderRadius:10,border:`2px solid ${C.accent}33`,background:C.bg,marginTop:12}}>
                    <div style={{fontSize:14,fontWeight:600,color:C.accent,marginBottom:12}}>Create New Workout</div>
                    <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                        <div style={{position:'relative'}}>
                          <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Category</label>
                          <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="e.g. Conditioning" value={addItemForm.newCat||''} onChange={e=>setAddItemForm({...addItemForm,newCat:e.target.value})} onFocus={()=>handleFocus('newCat')} onBlur={handleBlur} />
                          {focusField==='newCat'&&(()=>{const opts=categories.filter(c=>!addItemForm.newCat||c.name.toLowerCase().includes((addItemForm.newCat||'').toLowerCase()));return opts.length>0&&(
                            <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                              {opts.map(c=><div key={c.id} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setAddItemForm({...addItemForm,newCat:c.name});setFocusField('');}}>{c.name}</div>)}
                            </div>);})()}
                        </div>
                        <div style={{position:'relative'}}>
                          <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Type</label>
                          <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="e.g. Speed" value={addItemForm.newType||''} onChange={e=>setAddItemForm({...addItemForm,newType:e.target.value})} onFocus={()=>handleFocus('newType')} onBlur={handleBlur} />
                          {focusField==='newType'&&(()=>{const opts=[...new Set(library.map(l=>l.type||'').filter(Boolean))].sort().filter(t=>!addItemForm.newType||t.toLowerCase().includes((addItemForm.newType||'').toLowerCase()));return opts.length>0&&(
                            <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                              {opts.map(t=><div key={t} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setAddItemForm({...addItemForm,newType:t});setFocusField('');}}>{t}</div>)}
                            </div>);})()}
                        </div>
                      </div>
                      <div>
                        <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Workout Name</label>
                        <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="e.g. 4x800" value={addItemForm.newName||''} onChange={e=>setAddItemForm({...addItemForm,newName:e.target.value})} />
                      </div>
                      <div>
                        <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Description</label>
                        <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="Brief description (optional)" value={addItemForm.newDesc||''} onChange={e=>setAddItemForm({...addItemForm,newDesc:e.target.value})} />
                      </div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:6}}>Measurables <span style={{fontWeight:400,fontSize:11}}>(for simple workouts)</span></label>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(90px, 1fr))',gap:6}}>
                        {[{key:'newMileage',label:'Mileage (mi)',ph:'2.0'},{key:'newTime',label:'Time (m:s)',ph:'24:00'},{key:'newDistance',label:'Dist (m)',ph:'400'},{key:'newSets',label:'Sets',ph:'4'},{key:'newReps',label:'Reps',ph:'8'},{key:'newWeight',label:'Wt (lbs)',ph:'25'},{key:'newEffort',label:'Effort (%)',ph:'80'}].map(m=>(
                          <div key={m.key}>
                            <label style={{fontSize:10,color:C.textMuted,display:'block',marginBottom:2}}>{m.label}</label>
                            <input style={{...S.input,padding:'6px 8px',fontSize:12}} placeholder={m.ph} value={addItemForm[m.key]||''} onChange={e=>setAddItemForm({...addItemForm,[m.key]:e.target.value})} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{marginBottom:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom:4}} onClick={()=>setAddItemForm({...addItemForm,_exOpen:!addItemForm._exOpen})}>
                        <label style={{fontSize:12,color:C.textSecondary,cursor:'pointer'}}>Exercises <span style={{fontWeight:400,fontSize:11}}>({(addItemForm.newExercises||[]).filter(e=>(e.exercise||'').trim()).length} added)</span></label>
                        <span style={{fontSize:11,color:C.accent,fontWeight:600}}>{addItemForm._exOpen?'^ Hide':'v Show'}</span>
                      </div>
                      {addItemForm._exOpen&&<ExerciseTable exercises={addItemForm.newExercises||[emptyRow()]} onChange={exs=>setAddItemForm({...addItemForm,newExercises:exs})} library={library} />}
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'10px 20px',borderRadius:8}} onClick={()=>{
                        if(!(addItemForm.newName||'').trim()) return;
                        const cat=addItemForm.newCat||addItemForm.category||defaultCat;
                        const desc=addItemForm.newDesc||'';
                        const exercises=(addItemForm.newExercises||[]).filter(e=>e.exercise.trim());
                        const measurables={mileage:addItemForm.newMileage||'',time:addItemForm.newTime||'',distance:addItemForm.newDistance||'',sets:addItemForm.newSets||'',reps:addItemForm.newReps||'',weight:addItemForm.newWeight||'',effort:addItemForm.newEffort||''};
                        addDayItem(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day,{category:cat,type:addItemForm.newType||'',name:addItemForm.newName,description:desc,exercises,...measurables});
                        save({...data,workoutLibrary:[...(data.workoutLibrary||[]),{id:uid(),name:addItemForm.newName,category:cat,type:addItemForm.newType||'',description:desc,isDefault:false,exercises,...measurables}],workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==editingDay.weekId?w:{...w,entries:[...(w.entries||[]),{id:uid(),groupId:editingDay.groupId,level:editingDay.level,day:editingDay.day,category:cat,type:addItemForm.newType||'',name:addItemForm.newName,description:desc,exercises,...measurables}]})});
                        setShowCreateNew(false);setAddItemForm({category:'',type:'',workoutId:'',workoutSearch:''});
                      }}>Add & Save to Library</button>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'10px 20px',borderRadius:8}} onClick={()=>setShowCreateNew(false)}>Back</button>
                    </div>
                  </div>
                )}
                
                {!showAddItem && (
                  <div style={{display:'flex',gap:8,marginTop:12}}>
                    <button style={{...S.btn,...S.btnPrimary,flex:1,fontSize:14,padding:'12px 20px',borderRadius:8}} onClick={()=>{setAddItemForm({category:'',type:'',workoutId:'',workoutSearch:'',newCat:'',newType:'',newName:'',newDesc:'',newExercises:[emptyRow()],newMileage:'',newTime:'',newDistance:'',newSets:'',newReps:'',newWeight:'',newEffort:''});setShowAddItem(true);setShowCreateNew(false);}}>+ Add Workout</button>
                    {library.some(l=>l.isDefault)&&items.length===0&&<button style={{...S.btn,...S.btnSecondary,fontSize:14,padding:'12px 20px',borderRadius:8}} onClick={()=>applyDefaults(editingDay.weekId,editingDay.groupId,editingDay.level,editingDay.day)}>Defaults</button>}
                  </div>
                )}
              </>}
              <div style={{display:'flex',justifyContent:'flex-end',marginTop:16}}>
                <button style={{...S.btn,...S.btnSecondary,fontSize:14,padding:'10px 24px',borderRadius:8}} onClick={()=>{setEditingDay(null);setShowAddItem(false);setShowCreateNew(false);}}>Done</button>
              </div>
            </>);
          })()}
        </Modal>
        <Modal open={showEditMeets&&!!curWeek} onClose={()=>setShowEditMeets(false)} width={400}>
          <h2 style={S.h2}>Meets - {weekLabel((curWeek||{}).startDate)}</h2>
          <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:12,maxHeight:300,overflowY:'auto'}}>
            {(data.meets||[]).sort((a,b)=>(a.startDate||a.date||'').localeCompare(b.startDate||b.date||'')).map(m=>{
              const sel=((curWeek||{}).meetIds||[]).includes(m.id);
              return (<label key={m.id} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',fontSize:12,cursor:'pointer'}}><input type="checkbox" checked={sel} onChange={()=>{const ids=sel?(curWeek.meetIds||[]).filter(id=>id!==m.id):[...(curWeek.meetIds||[]),m.id];save({...data,workoutPlans:(data.workoutPlans||[]).map(w=>w.id===curWeek.id?{...w,meetIds:ids}:w)});}} /><span style={{fontWeight:sel?600:400}}>{m.name}</span><span style={{color:C.textMuted,marginLeft:'auto'}}>{m.startDate||m.date}</span></label>);
            })}
          </div>
          <button style={{...S.btn,...S.btnPrimary,marginTop:12}} onClick={()=>setShowEditMeets(false)}>Done</button>
        </Modal>
        <ConfirmModal open={!!delWeekId} onClose={()=>setDelWeekId(null)} onConfirm={deleteWeek} message="Delete this week and all its entries?" />
      </div>)}
      
      {tab==='library'&&(()=>{
        const grouped={};
        filteredLib.forEach(l=>{const cat=l.category||(l.categories||[])[0]||'Uncategorized';if(!grouped[cat])grouped[cat]={};const tp=l.type||'General';if(!grouped[cat][tp])grouped[cat][tp]=[];grouped[cat][tp].push(l);});
        return (<div>
        <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
          <input style={{...S.input,maxWidth:180}} placeholder="Search..." value={libSearch} onChange={e=>setLibSearch(e.target.value)} />
          <select style={S.select} value={libCatFilter} onChange={e=>{setLibCatFilter(e.target.value);setLibTypeFilter('');}}>
            <option value="">All</option>{categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {typesForFilter.length>0&&<select style={S.select} value={libTypeFilter} onChange={e=>setLibTypeFilter(e.target.value)}>
            <option value="">All Types</option>{typesForFilter.map(t=><option key={t} value={t}>{t}</option>)}
          </select>}
          <div style={{marginLeft:'auto',display:'flex',gap:6}}>
            <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowImportLib(true)}>Import</button>
            <button style={{...S.btn,...S.btnPrimary}} onClick={startAddLib}>+ Add</button>
          </div>
        </div>
        {Object.keys(grouped).length===0&&<div style={{...S.card,textAlign:'center',color:C.textMuted,padding:20}}>No workouts in library.</div>}
        {Object.entries(grouped).map(([catName,types])=>(
          <div key={catName} style={{marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{width:12,height:12,borderRadius:'50%',background:catColors[catName]||C.textMuted}} />
              <h3 style={{fontSize:14,fontWeight:700,color:catColors[catName]||C.text,textTransform:'uppercase',margin:0}}>{catName}</h3>
            </div>
            {Object.entries(types).sort(([a],[b])=>a.localeCompare(b)).map(([typeName,workouts])=>(
              <div key={typeName} style={{marginLeft:16,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:C.textSecondary,marginBottom:4,textTransform:'uppercase'}}>{typeName}</div>
                {workouts.map(l=>(<div key={l.id} style={{padding:'10px 12px',marginLeft:8,borderRadius:6,background:C.surface,border:`1px solid ${C.borderLight}`,marginBottom:4}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{l.name}</div>
                      {l.description&&<div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{l.description}</div>}
                      {(l.exercises||[]).length>0&&(
                        <div style={{marginTop:4}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',padding:'4px 0'}} onClick={e=>{e.stopPropagation();setExpandedLib(prev=>({...prev,[l.id]:!prev[l.id]}));}}>
                            <div style={{fontSize:12,color:C.textSecondary}}>
                              <span style={{fontWeight:600}}>{(l.exercises||[]).length} exercises:</span>
                              {exTotals(l.exercises)&&<span style={{marginLeft:6,color:C.accent,fontWeight:600}}>{exTotals(l.exercises)}</span>}
                              <span style={{marginLeft:6,color:C.textMuted}}>{(l.exercises||[]).map(ex=>ex.exercise).filter(Boolean).join(', ')}</span>
                            </div>
                            <span style={{fontSize:11,color:C.accent,fontWeight:600,flexShrink:0,marginLeft:8}}>{expandedLib[l.id]?'^ Hide':'v Show'}</span>
                          </div>
                          {expandedLib[l.id]&&(
                            <div style={{marginTop:4,display:'flex',flexDirection:'column',gap:2}}>
                              {(l.exercises||[]).map((ex,ei)=>(
                                <div key={ei} style={{fontSize:12,color:C.textMuted,display:'flex',gap:6,flexWrap:'wrap',padding:'2px 0'}}>
                                  <span style={{fontWeight:500,color:C.text,minWidth:80}}>{ex.exercise||'-'}</span>
                                  {ex.type&&<span>{ex.type}</span>}
                                  {ex.time&&<span>T: {ex.time}</span>}
                                  {ex.mileage&&<span>{ex.mileage} mi</span>}
                                  {ex.distance&&<span>{ex.distance}m</span>}
                                  {ex.reps&&<span>x{ex.reps}</span>}
                                  {ex.weight&&<span>W: {ex.weight}</span>}
                                  {ex.effort&&<span>E: {ex.effort}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {(l.exercises||[]).length===0&&(l.mileage||l.time||l.distance||l.sets||l.reps||l.weight||l.effort)&&(
                        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:4}}>
                          {l.mileage&&<span style={{fontSize:11,color:C.accent,fontWeight:600}}>{l.mileage} mi</span>}
                          {l.time&&<span style={{fontSize:11,color:C.textMuted}}>T: {l.time}</span>}
                          {l.distance&&<span style={{fontSize:11,color:C.textMuted}}>D: {l.distance}</span>}
                          {l.sets&&<span style={{fontSize:11,color:C.textMuted}}>{l.sets} sets</span>}
                          {l.reps&&<span style={{fontSize:11,color:C.textMuted}}>x{l.reps}</span>}
                          {l.weight&&<span style={{fontSize:11,color:C.textMuted}}>W: {l.weight}</span>}
                          {l.effort&&<span style={{fontSize:11,color:C.textMuted}}>E: {l.effort}</span>}
                        </div>
                      )}
                    </div>
                    <div style={{display:'flex',gap:2,alignItems:'center',flexShrink:0,marginLeft:8}}>
                      <button style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:l.isDefault?C.accent:C.border,padding:'4px 8px'}} onClick={()=>save({...data,workoutLibrary:(data.workoutLibrary||[]).map(li=>li.id===l.id?{...li,isDefault:!li.isDefault}:li)})}>{l.isDefault?'*':'o'}</button>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px'}} onClick={()=>startEditLib(l)}>Edit</button>
                      <button style={{...S.btn,...S.btnDanger,fontSize:12,padding:'6px 12px'}} onClick={()=>deleteLib(l.id)}>✕</button>
                    </div>
                  </div>
                </div>))}
              </div>
            ))}
          </div>
        ))}
        <Modal open={showAddLib} onClose={()=>{setShowAddLib(false);setEditLibId(null);}} width={650}>
          <h2 style={S.h2}>{editLibId?'Edit':'Add'} Workout</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              <div style={{position:'relative'}}>
                <label style={{fontSize:12,color:C.textSecondary}}>Category</label>
                <input style={S.input} placeholder="e.g. Conditioning" value={libForm.category} onChange={e=>setLibForm({...libForm,category:e.target.value})} onFocus={()=>handleFocus('libCat')} onBlur={handleBlur} />
                {focusField==='libCat'&&(()=>{const opts=categories.filter(c=>!libForm.category||c.name.toLowerCase().includes(libForm.category.toLowerCase()));return opts.length>0&&(
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                    {opts.map(c=><div key={c.id} style={{padding:'10px 14px',fontSize:13,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setLibForm({...libForm,category:c.name});setFocusField('');}}>{c.name}</div>)}
                  </div>);})()}
              </div>
              <div style={{position:'relative'}}>
                <label style={{fontSize:12,color:C.textSecondary}}>Type</label>
                <input style={S.input} placeholder="e.g. Speed, Core" value={libForm.type} onChange={e=>setLibForm({...libForm,type:e.target.value})} onFocus={()=>handleFocus('libType')} onBlur={handleBlur} />
                {focusField==='libType'&&(()=>{const opts=[...new Set(library.map(l=>l.type||'').filter(Boolean))].sort().filter(t=>!libForm.type||t.toLowerCase().includes(libForm.type.toLowerCase()));return opts.length>0&&(
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                    {opts.map(t=><div key={t} style={{padding:'10px 14px',fontSize:13,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setLibForm({...libForm,type:t});setFocusField('');}}>{t}</div>)}
                  </div>);})()}
              </div>
              <div style={{position:'relative'}}>
                <label style={{fontSize:12,color:C.textSecondary}}>Workout Name</label>
                <input style={S.input} placeholder="e.g. 4x800" value={libForm.name} onChange={e=>setLibForm({...libForm,name:e.target.value})} onFocus={()=>handleFocus('libName')} onBlur={handleBlur} />
                {focusField==='libName'&&libForm.name&&(()=>{const opts=[...new Set(library.map(l=>l.name).filter(Boolean))].sort().filter(n=>n.toLowerCase().includes(libForm.name.toLowerCase())&&n!==libForm.name);return opts.length>0&&(
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
                    {opts.map(n=><div key={n} style={{padding:'10px 14px',fontSize:13,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`}} onMouseDown={()=>{setLibForm({...libForm,name:n});setFocusField('');}}>{n}</div>)}
                  </div>);})()}
              </div>
            </div>
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Description</label>
              <input style={S.input} placeholder="Brief description of this workout" value={libForm.description||''} onChange={e=>setLibForm({...libForm,description:e.target.value})} />
            </div>
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:6}}>Measurables <span style={{fontWeight:400,fontSize:11}}>(for simple workouts)</span></label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(90px, 1fr))',gap:6}}>
                {[{key:'mileage',label:'Mileage (mi)',ph:'2.0'},{key:'time',label:'Time (m:s)',ph:'24:00'},{key:'distance',label:'Dist (m)',ph:'400m'},{key:'sets',label:'Sets',ph:'4'},{key:'reps',label:'Reps',ph:'8'},{key:'weight',label:'Wt (lbs)',ph:'25'},{key:'effort',label:'Effort (%)',ph:'80'}].map(m=>(
                  <div key={m.key}>
                    <label style={{fontSize:10,color:C.textMuted,display:'block',marginBottom:2}}>{m.label}</label>
                    <input style={{...S.input,padding:'6px 8px',fontSize:12}} placeholder={m.ph} value={libForm[m.key]||''} onChange={e=>setLibForm({...libForm,[m.key]:e.target.value})} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',marginBottom:4}} onClick={()=>setLibForm({...libForm,_exOpen:!libForm._exOpen})}>
                <label style={{fontSize:12,color:C.textSecondary,cursor:'pointer'}}>Exercises <span style={{fontWeight:400,fontSize:11}}>({(libForm.exercises||[]).filter(e=>(e.exercise||'').trim()).length} added)</span></label>
                <span style={{fontSize:11,color:C.accent,fontWeight:600}}>{libForm._exOpen?'^ Hide':'v Show'}</span>
              </div>
              {libForm._exOpen&&<ExerciseTable exercises={libForm.exercises||[emptyRow()]} onChange={exs=>setLibForm({...libForm,exercises:exs})} library={library} />}
            </div>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}><input type="checkbox" checked={libForm.isDefault} onChange={e=>setLibForm({...libForm,isDefault:e.target.checked})} /> Default workout</label>
            <button style={{...S.btn,...S.btnPrimary}} onClick={saveLib}>{editLibId?'Save':'Add to Library'}</button>
          </div>
        </Modal>
        <Modal open={showImportLib} onClose={()=>setShowImportLib(false)} width={550}>
          <h2 style={S.h2}>Import Library</h2>
          <p style={{fontSize:12,color:C.textSecondary,marginTop:4,marginBottom:8}}>CSV: Category, Type, Workout</p>
          <textarea style={{...S.input,height:120,fontFamily:'monospace',fontSize:11,resize:'vertical'}} placeholder={"Category,Type,Workout\nMain,Speed,4x800"} value={importLibText} onChange={e=>setImportLibText(e.target.value)} />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
            <button style={{...S.btn,...S.btnSecondary}} onClick={()=>setShowImportLib(false)}>Cancel</button>
            <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{
              if(!importLibText.trim()) return;
              const {rows}=parseCSV(importLibText);
              const items=rows.map(r=>({id:uid(),name:(r.workout||r.name||'').trim(),category:(r.category||defaultCat).trim(),type:(r.type||'').trim(),isDefault:false,exercises:[]})).filter(i=>i.name);
              save({...data,workoutLibrary:[...(data.workoutLibrary||[]),...items]});
              setImportLibText('');setShowImportLib(false);
            }}>Import</button>
          </div>
        </Modal>
      </div>);})()}
      
      {tab==='groups'&&(<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{...S.h2,margin:0}}>Training Groups</h2>
          <div style={{display:'flex',gap:6}}>
            <button style={{...S.btn,...S.btnSecondary}} onClick={()=>{setBulkAssignGroup(bulkAssignGroup?null:(groups[0]||{}).id);setBulkAssignLevel((groups[0]||{}).levels?.[0]||'Level 1');setBulkSelected({});}}>Bulk Assign</button>
            <button style={{...S.btn,...S.btnPrimary}} onClick={addNewGroup}>+ Add Group</button>
          </div>
        </div>
        {bulkAssignGroup&&(
          <div style={{...S.card,border:`2px solid ${C.accent}`,padding:'12px 16px',marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:8}}>Bulk Assign Athletes</div>
            <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
              <select style={S.select} value={bulkAssignGroup} onChange={e=>{setBulkAssignGroup(e.target.value);const g=groups.find(gr=>gr.id===e.target.value);setBulkAssignLevel(g?g.levels[0]:'Level 1');}}>
                {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <select style={S.select} value={bulkAssignLevel} onChange={e=>setBulkAssignLevel(e.target.value)}>
                {(groups.find(g=>g.id===bulkAssignGroup)||{levels:['Level 1']}).levels.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
              <button style={{...S.btn,...S.btnPrimary,fontSize:12}} onClick={bulkApply} disabled={!Object.values(bulkSelected).some(Boolean)}>Assign {Object.values(bulkSelected).filter(Boolean).length} Selected</button>
              <button style={{...S.btn,...S.btnSecondary,fontSize:12}} onClick={()=>setBulkAssignGroup(null)}>Cancel</button>
            </div>
            <div style={{maxHeight:250,overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
              {data.athletes.filter(a=>a.active!==false).sort((a,b)=>athLast(a).localeCompare(athLast(b))).map(a=>{
                const inGroup = (a.groups||[]).some(ag=>ag.groupId===bulkAssignGroup&&ag.level===bulkAssignLevel);
                return (
                  <div key={a.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',borderBottom:`1px solid ${C.borderLight}`,background:inGroup?C.successMuted:'transparent'}}>
                    <input type="checkbox" checked={!!bulkSelected[a.id]} onChange={()=>setBulkSelected(p=>({...p,[a.id]:!p[a.id]}))} disabled={inGroup} />
                    <span style={{flex:1,fontSize:12,fontWeight:500,color:inGroup?C.success:C.text}}>{athDisplay(a)}{a.gradYear&&<span style={{color:C.textMuted,marginLeft:4}}>'{(a.gradYear+'').slice(-2)}</span>}</span>
                    <span style={{fontSize:10,color:a.gender==='M'?C.blue:'#d53f8c'}}>{a.gender==='M'?'B':'G'}</span>
                    {inGroup&&<span style={{fontSize:9,color:C.success,fontWeight:600}}>Already in</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {groups.map(group=>{
          const isExpanded = expandedGroup===group.id;
          const members = data.athletes.filter(a=>a.active!==false&&((a.groups||[]).some(ag=>ag.groupId===group.id)||a.trainingGroup===group.id));
          const byLevel = {};
          group.levels.forEach(lv=>{byLevel[lv]=[];});
          members.forEach(a=>{
            const ag = (a.groups||[]).find(ag=>ag.groupId===group.id);
            const lv = ag?ag.level:(group.levels[0]||'Level 1');
            if(!byLevel[lv]) byLevel[lv]=[];
            byLevel[lv].push(a);
          });
          const unassigned = data.athletes.filter(a=>a.active!==false&&!(a.groups||[]).some(ag=>ag.groupId===group.id)&&a.trainingGroup!==group.id);
          return (<div key={group.id} style={{...S.card,marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{cursor:'pointer',flex:1}} onClick={()=>setExpandedGroup(isExpanded?null:group.id)}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:12,color:C.accent,fontWeight:600}}>{isExpanded?'▼':'▶'}</span>
                  <div><div style={{fontWeight:600,fontSize:14}}>{group.name}</div><div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{group.levels.join(', ')} - {members.length} athlete{members.length!==1?'s':''}</div></div>
                </div>
              </div>
              <div style={{display:'flex',gap:6}}><button style={{...S.btn,...S.btnSecondary,padding:'6px 12px',fontSize:12}} onClick={()=>startEditGroup(group)}>Edit</button><button style={{...S.btn,...S.btnDanger,padding:'6px 12px',fontSize:12}} onClick={()=>deleteGroup(group.id)}>✕</button></div>
            </div>
            {isExpanded&&(<div style={{marginTop:10}}>
              {group.levels.map(lv=>(
                <div key={lv} style={{marginBottom:10}}>
                  {group.levels.length>1&&<div style={{fontSize:11,fontWeight:700,color:C.accent,textTransform:'uppercase',marginBottom:4}}>{lv} ({(byLevel[lv]||[]).length})</div>}
                  {(byLevel[lv]||[]).sort((a,b)=>athLast(a).localeCompare(athLast(b))).map(a=>(
                    <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 8px',borderBottom:`1px solid ${C.borderLight}`,fontSize:12}}>
                      <span style={{fontWeight:500,cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>{athDisplay(a)}{a.gradYear&&<span style={{color:C.textMuted,marginLeft:4}}>'{(a.gradYear+'').slice(-2)}</span>}</span>
                      <div style={{display:'flex',gap:4,alignItems:'center'}}>
                        {group.levels.length>1&&<select style={{...S.select,fontSize:10,padding:'2px 4px'}} value={lv} onChange={e=>addToGroup(a.id,group.id,e.target.value)}>
                          {group.levels.map(l=><option key={l} value={l}>{l}</option>)}
                        </select>}
                        <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:11}} onClick={()=>removeFromGroup(a.id,group.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                  {(byLevel[lv]||[]).length===0&&<div style={{fontSize:11,color:C.textMuted,fontStyle:'italic',padding:'4px 8px'}}>No athletes</div>}
                </div>
              ))}
              <div style={{marginTop:6,padding:'8px',background:C.bg,borderRadius:6,border:`1px solid ${C.borderLight}`}}>
                <div style={{fontSize:11,fontWeight:600,color:C.textSecondary,marginBottom:4}}>Quick Add</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  <select style={{...S.select,flex:1,fontSize:11}} id={`qadd-${group.id}`}>
                    <option value="">Select athlete...</option>
                    {unassigned.sort((a,b)=>athLast(a).localeCompare(athLast(b))).map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}
                  </select>
                  {group.levels.length>1&&<select style={{...S.select,fontSize:11}} id={`qlvl-${group.id}`}>
                    {group.levels.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>}
                  <button style={{...S.btn,...S.btnPrimary,fontSize:10,padding:'4px 10px'}} onClick={()=>{const sel=document.getElementById(`qadd-${group.id}`);const lvl=group.levels.length>1?document.getElementById(`qlvl-${group.id}`).value:group.levels[0];if(sel.value){addToGroup(sel.value,group.id,lvl);sel.value='';}}}>Add</button>
                </div>
              </div>
            </div>)}
          </div>);
        })}
        <Modal open={!!showEditGroup} onClose={()=>setShowEditGroup(null)} width={420}>
          <h2 style={S.h2}>Edit Group</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
            <input style={S.input} placeholder="Group name" value={groupForm.name} onChange={e=>setGroupForm({...groupForm,name:e.target.value})} />
            <div>
              <label style={{fontSize:12,color:C.textSecondary}}>Levels</label>
              {groupForm.levels.map((lvl,i)=>(<div key={i} style={{display:'flex',gap:6,alignItems:'center',marginTop:4}}>
                <input style={{...S.input,flex:1}} value={lvl} onChange={e=>{const nl=[...groupForm.levels];nl[i]=e.target.value;setGroupForm({...groupForm,levels:nl});}} />
                {groupForm.levels.length>1&&<button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:16}} onClick={()=>setGroupForm(f=>({...f,levels:f.levels.filter((_,j)=>j!==i)}))}>✕</button>}
              </div>))}
              <div style={{display:'flex',gap:6,marginTop:8}}>
                <input style={{...S.input,flex:1}} placeholder="New level" value={newLevelInput} onChange={e=>setNewLevelInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')addLevel();}} />
                <button style={{...S.btn,...S.btnSecondary,fontSize:11}} onClick={addLevel}>+ Add</button>
              </div>
            </div>
            {groupForm.levels.length>1&&<div>
              <label style={{fontSize:12,color:C.textSecondary}}>Level Sync</label>
              <p style={{fontSize:11,color:C.textMuted,marginBottom:6}}>Synced levels mirror another level's workouts automatically. Override individual days as needed.</p>
              {groupForm.levels.map((lv,i)=>{
                const syncVal = (groupForm.levelSync||{})[lv]||'';
                const otherLevels = groupForm.levels.filter(l=>l!==lv);
                return (<div key={i} style={{display:'flex',gap:6,alignItems:'center',marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600,minWidth:60}}>{lv}</span>
                  <select style={{...S.select,flex:1,fontSize:12}} value={syncVal} onChange={e=>{const ls={...(groupForm.levelSync||{})};if(e.target.value){ls[lv]=e.target.value;}else{delete ls[lv];}setGroupForm({...groupForm,levelSync:ls});}}>
                    <option value="">Independent</option>
                    {otherLevels.map(ol=><option key={ol} value={ol}>Sync from {ol}</option>)}
                  </select>
                </div>);
              })}
            </div>}
            <button style={{...S.btn,...S.btnPrimary}} onClick={saveGroup}>Save Group</button>
          </div>
        </Modal>
      </div>)}
      
      {tab==='categories'&&(<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{...S.h2,margin:0}}>Workout Categories</h2>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{setCatForm({name:'',color:'#2b6cb0'});setEditCatId(null);setShowAddCat(true);}}>+ Add</button>
        </div>
        <p style={{fontSize:12,color:C.textMuted,marginBottom:12}}>e.g. Main, Warm-Up, Cool-Down, Strength/Conditioning.</p>
        {categories.map(wc=>(
          <div key={wc.id} style={{...S.card,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:14,height:14,borderRadius:'50%',background:wc.color||C.textMuted}} /><span style={{fontWeight:600,fontSize:14}}>{wc.name}</span></div>
            <div style={{display:'flex',gap:6}}>
              <button style={{...S.btn,...S.btnSecondary,padding:'6px 12px',fontSize:12}} onClick={()=>{setCatForm({name:wc.name,color:wc.color||'#2b6cb0'});setEditCatId(wc.id);setShowAddCat(true);}}>Edit</button>
              <button style={{...S.btn,...S.btnDanger,padding:'6px 12px',fontSize:12}} onClick={()=>setDelCatId(wc.id)}>✕</button>
            </div>
          </div>
        ))}
        <Modal open={showAddCat} onClose={()=>{setShowAddCat(false);setEditCatId(null);}} width={380}>
          <h2 style={S.h2}>{editCatId?'Edit':'Add'} Category</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
            <input style={S.input} placeholder="Category name" value={catForm.name} onChange={e=>setCatForm({...catForm,name:e.target.value})} />
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:6}}>Color</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(8, 1fr)',gap:4}}>
                {['#c53030','#c96a1f','#b8860b','#25763b','#0d9488','#2b6cb0','#553c9a','#b83280','#e53e3e','#dd6b20','#d69e2e','#38a169','#319795','#3182ce','#6b46c1','#d53f8c','#fc8181','#f6ad55','#f6e05e','#68d391','#4fd1c5','#63b3ed','#9f7aea','#f687b3','#1a365d','#744210','#1c4532','#234e52','#322659','#521b41','#1a1e26','#64748b'].map((color,i)=>(
                  <button key={i} onClick={()=>setCatForm({...catForm,color})} style={{width:'100%',aspectRatio:'1',borderRadius:4,background:color,border:catForm.color===color?'2px solid #1a1e26':'1px solid rgba(0,0,0,0.1)',cursor:'pointer',boxShadow:catForm.color===color?'0 0 0 2px #fff inset':'none'}} />
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}>
                <span style={{width:24,height:24,borderRadius:4,background:catForm.color,border:'1px solid rgba(0,0,0,0.1)',flexShrink:0}} />
                <input type="color" value={catForm.color} onChange={e=>setCatForm({...catForm,color:e.target.value})} style={{width:32,height:24,border:'none',cursor:'pointer',padding:0}} />
                <input style={{...S.input,fontFamily:'monospace',fontSize:11,flex:1}} value={catForm.color} onChange={e=>setCatForm({...catForm,color:e.target.value})} />
              </div>
            </div>
            <button style={{...S.btn,...S.btnPrimary}} onClick={saveCat}>{editCatId?'Save':'Add Category'}</button>
          </div>
        </Modal>
        <ConfirmModal open={!!delCatId} onClose={()=>setDelCatId(null)} onConfirm={deleteCat} message="Delete this workout category?" />
      </div>)}
    </div>
  );
}
function EventsPage({ data, save, nav }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [entryFilter, setEntryFilter] = useState('');
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name:'', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time', firstLapOutdoor:'', firstLapIndoor:'', lapDistanceOutdoor:'', lapDistanceIndoor:'' });
  const [delId, setDelId] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showAddStandard, setShowAddStandard] = useState(null);
  const [stdForm, setStdForm] = useState({ name:'', customName:'', timeMs:0, ft:0, inch:0, qtr:0, min:0, sec:0 });
  const [showAddRecord, setShowAddRecord] = useState(null);
  const [recForm, setRecForm] = useState({ athleteId:'', timeMs:0, ft:0, inch:0, qtr:0, min:0, sec:0, date:'', type:'School Record' });
  const toggleSort = (col) => { if(sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortCol(col); setSortDir('asc'); } };
  const events = (data.events||[]).filter(e => {
    if(search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if(typeFilter && e.eventType !== typeFilter) return false;
    if(genderFilter && e.gender !== genderFilter) return false;
    if(trackFilter && e.trackType !== trackFilter) return false;
    if(entryFilter && e.entryType !== entryFilter) return false;
    return true;
  }).sort((a,b) => {
    let av, bv;
    switch(sortCol) {
      case 'name': {
        const distA=TRACK_DISTANCES[a.name]||0;
        const distB=TRACK_DISTANCES[b.name]||0;
        if(distA&&distB) { av=distA; bv=distB; }
        else if(distA) { av=0; bv=1; }
        else if(distB) { av=1; bv=0; }
        else { av=a.name.toLowerCase(); bv=b.name.toLowerCase(); }
        break;
      }
      case 'eventType': av=a.eventType; bv=b.eventType; break;
      case 'entryType': av=a.entryType; bv=b.entryType; break;
      case 'gender': av=a.gender; bv=b.gender; break;
      case 'trackType': av=a.trackType; bv=b.trackType; break;
      case 'measurableType': av=a.measurableType; bv=b.measurableType; break;
      case 'standards': av=(a.qualifyingStandards||[]).length; bv=(b.qualifyingStandards||[]).length; break;
      case 'records': av=(a.schoolRecords||[]).length; bv=(b.schoolRecords||[]).length; break;
      default: av=''; bv='';
    }
    if(av<bv) return sortDir==='asc'?-1:1;
    if(av>bv) return sortDir==='asc'?1:-1;
    return 0;
  });
  const _toNumStr = (v) => { const n = parseFloat(v); return (isFinite(n) && n>0) ? n+'' : ''; };
  const addEvent = () => {
    if(!form.name) return;
    const lapFields = {
      firstLapOutdoor: _toNumStr(form.firstLapOutdoor)?parseFloat(form.firstLapOutdoor):null,
      firstLapIndoor: _toNumStr(form.firstLapIndoor)?parseFloat(form.firstLapIndoor):null,
      lapDistanceOutdoor: _toNumStr(form.lapDistanceOutdoor)?parseFloat(form.lapDistanceOutdoor):null,
      lapDistanceIndoor: _toNumStr(form.lapDistanceIndoor)?parseFloat(form.lapDistanceIndoor):null,
    };
    const cleaned = { name:form.name, eventType:form.eventType, entryType:form.entryType, gender:form.gender, trackType:form.trackType, measurableType:form.measurableType, ...lapFields };
    if(editId) { save({...data, events:(data.events||[]).map(e=>e.id===editId?{...e,...cleaned}:e)}); setEditId(null); }
    else { save({...data, events:[...(data.events||[]),{id:uid(),...cleaned,qualifyingStandards:[],schoolRecords:[]}]}); }
    setShowAdd(false); setForm({ name:'', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time', firstLapOutdoor:'', firstLapIndoor:'', lapDistanceOutdoor:'', lapDistanceIndoor:'' });
  };
  const startEdit = (evt) => {
    setForm({ name:evt.name, eventType:evt.eventType, entryType:evt.entryType, gender:evt.gender, trackType:evt.trackType, measurableType:evt.measurableType, firstLapOutdoor:(evt.firstLapOutdoor||'')+'', firstLapIndoor:(evt.firstLapIndoor||'')+'', lapDistanceOutdoor:(evt.lapDistanceOutdoor||'')+'', lapDistanceIndoor:(evt.lapDistanceIndoor||'')+'' });
    setEditId(evt.id); setShowAdd(true);
  };
  const deleteEvent = () => { save({...data, events:(data.events||[]).filter(e=>e.id!==delId)}); setDelId(null); };
  const addStandard = (eventId) => {
    const timeMs = parseTimeToMs(stdForm.min, stdForm.sec);
    const stdName = stdForm.name==='__custom' ? (stdForm.customName||'Custom').trim() : stdForm.name;
    if(!stdName) return;
    const std = { id:uid(), name:stdName, timeMs, ft:parseInt(stdForm.ft)||0, inch:parseInt(stdForm.inch)||0, qtr:parseFloat(stdForm.qtr)||0 };
    save({...data, events:(data.events||[]).map(e=>e.id===eventId?{...e,qualifyingStandards:[...(e.qualifyingStandards||[]),std]}:e)});
    setShowAddStandard(null); setStdForm({ name:'', customName:'', timeMs:0, ft:0, inch:0, qtr:0, min:0, sec:0 });
  };
  const removeStandard = (eventId, stdId) => save({...data, events:(data.events||[]).map(e=>e.id===eventId?{...e,qualifyingStandards:(e.qualifyingStandards||[]).filter(s=>s.id!==stdId)}:e)});
  const addRecord = (eventId) => {
    const timeMs = parseTimeToMs(recForm.min, recForm.sec);
    const rec = { id:uid(), type:recForm.type, athleteId:recForm.athleteId, timeMs, ft:parseInt(recForm.ft)||0, inch:parseInt(recForm.inch)||0, qtr:parseFloat(recForm.qtr)||0, date:recForm.date };
    save({...data, events:(data.events||[]).map(e=>e.id===eventId?{...e,schoolRecords:[...(e.schoolRecords||[]),rec]}:e)});
    setShowAddRecord(null); setRecForm({ athleteId:'', timeMs:0, ft:0, inch:0, qtr:0, min:0, sec:0, date:'', type:'School Record' });
  };
  const removeRecord = (eventId, recId) => save({...data, events:(data.events||[]).map(e=>e.id===eventId?{...e,schoolRecords:(e.schoolRecords||[]).filter(r=>r.id!==recId)}:e)});
  const SortHeader = ({col, label, width}) => (
    <th style={{...S.th, cursor:'pointer', userSelect:'none', width}} onClick={()=>toggleSort(col)}>
      {label} {sortCol===col ? (sortDir==='asc'?'^':'v') : ''}
    </th>
  );
  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:6,marginBottom:12}}>
        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{setForm({name:'',eventType:'Track',entryType:'Individual',gender:'Boy',trackType:'Both',measurableType:'Time',firstLapOutdoor:'',firstLapIndoor:'',lapDistanceOutdoor:'',lapDistanceIndoor:''});setEditId(null);setShowAdd(true);}}>+ Add Event</button>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
        <input style={{...S.input,maxWidth:180}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={S.select} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option value="">All Types</option><option value="Track">Track</option><option value="Field">Field</option></select>
        <select style={S.select} value={genderFilter} onChange={e=>setGenderFilter(e.target.value)}><option value="">All Genders</option><option value="Boy">Boys</option><option value="Girl">Girls</option><option value="Mixed">Mixed</option></select>
        <select style={S.select} value={trackFilter} onChange={e=>setTrackFilter(e.target.value)}><option value="">All Tracks</option><option value="Indoor">Indoor</option><option value="Outdoor">Outdoor</option><option value="Both">Both</option></select>
        <select style={S.select} value={entryFilter} onChange={e=>setEntryFilter(e.target.value)}><option value="">All Entries</option><option value="Individual">Individual</option><option value="Relay">Relay</option></select>
        {(search||typeFilter||genderFilter||trackFilter||entryFilter)&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>{setSearch('');setTypeFilter('');setGenderFilter('');setTrackFilter('');setEntryFilter('');}}>Clear</button>}
      </div>
      <div style={{...S.card, overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:750}}>
          <thead><tr>
            <SortHeader col="name" label="Event" />
            <SortHeader col="gender" label="Gender" width={70} />
            <SortHeader col="eventType" label="Type" width={65} />
            <SortHeader col="entryType" label="Entry" width={80} />
            <SortHeader col="trackType" label="Track" width={75} />
            <SortHeader col="measurableType" label="Measure" width={75} />
            <SortHeader col="standards" label="Stds" width={50} />
            <SortHeader col="records" label="Recs" width={50} />
            <th style={{...S.th,width:140}}></th>
          </tr></thead>
          <tbody>
            {events.map(evt => {
              const expanded = expandedEvent===evt.id;
              return [
                <tr key={evt.id} style={{cursor:'pointer'}} onClick={()=>setExpandedEvent(expanded?null:evt.id)}>
                  <td style={{...S.td,fontWeight:600}}>{evt.name}</td>
                  <td style={S.td}><span style={{fontSize:11,fontWeight:600,color:evt.gender==='Boy'?C.blue:evt.gender==='Girl'?'#d53f8c':C.textSecondary}}>{evt.gender==='Boy'?'B':evt.gender==='Girl'?'G':'Mix'}</span></td>
                  <td style={S.td}>{evt.eventType}</td>
                  <td style={S.td}>{evt.entryType}</td>
                  <td style={S.td}><span style={{fontSize:11,fontWeight:600,color:evt.trackType==='Indoor'?C.blue:evt.trackType==='Outdoor'?C.accent:C.textSecondary}}>{evt.trackType}</span></td>
                  <td style={S.td}>{evt.measurableType}</td>
                  <td style={{...S.td,textAlign:'center'}}>{(evt.qualifyingStandards||[]).length>0?<span style={{color:C.success,fontWeight:600}}>{(evt.qualifyingStandards||[]).length}</span>:'-'}</td>
                  <td style={{...S.td,textAlign:'center'}}>{(evt.schoolRecords||[]).length>0?<span style={{color:'#b8860b',fontWeight:600}}>{(evt.schoolRecords||[]).length}</span>:'-'}</td>
                  <td style={S.td}>
                    <div style={{display:'flex',gap:4}}>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={e=>{e.stopPropagation();const g=evt.gender==='Boy'?'Girl':evt.gender==='Girl'?'Boy':evt.gender;save({...data,events:[...(data.events||[]),{...evt,id:uid(),gender:g,qualifyingStandards:[],schoolRecords:[]}]});}}>Dup</button>
                      <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={e=>{e.stopPropagation();startEdit(evt);}}>Edit</button>
                      <button style={{...S.btn,...S.btnDanger,fontSize:11,padding:'4px 10px'}} onClick={e=>{e.stopPropagation();setDelId(evt.id);}}>✕</button>
                    </div>
                  </td>
                </tr>,
                expanded && <tr key={evt.id+'-detail'}>
                  <td colSpan={9} style={{padding:'12px 16px',background:C.bg,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                          <span style={{fontSize:13,fontWeight:600,color:C.success}}>Qualifying Standards</span>
                          <button style={{...S.btn,...S.btnSuccess,fontSize:10,padding:'3px 10px'}} onClick={()=>setShowAddStandard(evt.id)}>+ Add</button>
                        </div>
                        {(evt.qualifyingStandards||[]).map(std=>{
                          const mq = Math.max(parseInt(std.minQualifiers)||1, getStdMinQualifiers(data, std.name));
                          return (
                          <div key={std.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,padding:'4px 0',fontSize:12}}>
                            <span style={{flex:1}}><span style={{fontWeight:600}}>{std.name}</span> - {evt.measurableType==='Time'?formatTime(std.timeMs):fieldToStr(std.ft,std.inch,std.qtr)}{mq>1&&<span style={{marginLeft:6,fontSize:10,color:'#b8860b',fontWeight:600}} title="Set under Settings → Standards">needs {mq} to count</span>}</span>
                            <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>removeStandard(evt.id,std.id)}>✕</button>
                          </div>
                          );
                        })}
                        {!(evt.qualifyingStandards||[]).length&&<span style={{fontSize:12,color:C.textMuted}}>None set</span>}
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                          <span style={{fontSize:13,fontWeight:600,color:'#b8860b'}}>School Records</span>
                          <button style={{...S.btn,background:'rgba(184,134,11,0.1)',color:'#b8860b',fontSize:10,padding:'3px 10px'}} onClick={()=>setShowAddRecord(evt.id)}>+ Add</button>
                        </div>
                        {(evt.schoolRecords||[]).map(rec=>{
                          const ath=data.athletes.find(a=>a.id===rec.athleteId);
                          return (<div key={rec.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0',fontSize:12}}>
                            <span><span style={{fontWeight:600}}>{rec.type||'School Record'}</span> - {evt.measurableType==='Time'?formatTime(rec.timeMs):fieldToStr(rec.ft,rec.inch,rec.qtr)} - {ath?athDisplay(ath):'-'} ({rec.date||'-'})</span>
                            <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>removeRecord(evt.id,rec.id)}>✕</button>
                          </div>);
                        })}
                        {!(evt.schoolRecords||[]).length&&<span style={{fontSize:12,color:C.textMuted}}>None set</span>}
                      </div>
                    </div>
                  </td>
                </tr>
              ];
            })}
            {!events.length&&<tr><td colSpan={9} style={{...S.td,textAlign:'center',color:C.textMuted,padding:20}}>No events found.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>{events.length} event{events.length!==1?'s':''}</div>
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);setEditId(null);}} width={450}>
        <h2 style={S.h2}>{editId?'Edit':'Add'} Event</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
          <input style={S.input} placeholder="Event name (e.g. 100m, Long Jump, 4x400m)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Event Type</label><select style={{...S.select,width:'100%'}} value={form.eventType} onChange={e=>setForm({...form,eventType:e.target.value})}><option>Track</option><option>Field</option></select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Entry Type</label><select style={{...S.select,width:'100%'}} value={form.entryType} onChange={e=>setForm({...form,entryType:e.target.value})}><option>Individual</option><option>Relay</option></select></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Gender</label><select style={{...S.select,width:'100%'}} value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>Boy</option><option>Girl</option><option>Mixed</option></select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Track Type</label><select style={{...S.select,width:'100%'}} value={form.trackType} onChange={e=>setForm({...form,trackType:e.target.value})}><option>Indoor</option><option>Outdoor</option><option>Both</option></select></div>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Measurable</label><select style={{...S.select,width:'100%'}} value={form.measurableType} onChange={e=>setForm({...form,measurableType:e.target.value})}><option>Time</option><option>Length</option><option>Height</option></select></div>
          {form.eventType==='Track' && (
            <div style={{border:`1px solid ${C.borderLight}`,borderRadius:6,padding:'10px 12px',background:C.bg}}>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:6}}>
                <strong style={{color:C.textSecondary}}>Lap structure (optional).</strong> Leave blank for normal races. Set when the start line isn't at the lap line (e.g. <strong>1500m</strong> outdoor first lap is 300m; <strong>3000m Steeplechase</strong> uses 270m + 7 × 390m).
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <div>
                  <label style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Outdoor (400m track)</label>
                  <div style={{display:'flex',gap:6,marginTop:4}}>
                    <input style={{...S.input,fontSize:12,padding:'5px 8px'}} placeholder="First lap (m)" type="text" inputMode="numeric" value={form.firstLapOutdoor} onChange={e=>setForm({...form,firstLapOutdoor:e.target.value})} />
                    <input style={{...S.input,fontSize:12,padding:'5px 8px'}} placeholder="Lap (m)" type="text" inputMode="numeric" value={form.lapDistanceOutdoor} onChange={e=>setForm({...form,lapDistanceOutdoor:e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em'}}>Indoor (200m track)</label>
                  <div style={{display:'flex',gap:6,marginTop:4}}>
                    <input style={{...S.input,fontSize:12,padding:'5px 8px'}} placeholder="First lap (m)" type="text" inputMode="numeric" value={form.firstLapIndoor} onChange={e=>setForm({...form,firstLapIndoor:e.target.value})} />
                    <input style={{...S.input,fontSize:12,padding:'5px 8px'}} placeholder="Lap (m)" type="text" inputMode="numeric" value={form.lapDistanceIndoor} onChange={e=>setForm({...form,lapDistanceIndoor:e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <button style={{...S.btn,...S.btnPrimary}} onClick={addEvent}>{editId?'Save Changes':'Add Event'}</button>
        </div>
      </Modal>
      <Modal open={!!showAddStandard} onClose={()=>setShowAddStandard(null)} width={400}>
        <h2 style={S.h2}>Add Qualifying Standard</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
          {(data.qualifyingStandardTypes||[]).length>0 ? (
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Standard Type</label>
              <select style={{...S.select,width:'100%'}} value={stdForm.name} onChange={e=>setStdForm({...stdForm,name:e.target.value})}>
                <option value="">Select type...</option>
                {(data.qualifyingStandardTypes||[]).flatMap(t=>{
                  const subs = t.subtypes||[];
                  if(subs.length===0) return [<option key={t.id} value={t.name}>{t.name}</option>];
                  return subs.map((s,si)=><option key={t.id+'-'+si} value={t.name+' - '+s}>{t.name} - {s}</option>);
                })}
                <option value="__custom">Custom...</option>
              </select>
              {stdForm.name==='__custom'&&<input style={{...S.input,marginTop:6}} placeholder="Custom standard name" value={stdForm.customName||''} onChange={e=>setStdForm({...stdForm,customName:e.target.value})} />}
            </div>
          ) : (
            <input style={S.input} placeholder="Standard name (e.g. IAC Qualifier)" value={stdForm.name} onChange={e=>setStdForm({...stdForm,name:e.target.value})} />
          )}
          {(()=>{const evt=(data.events||[]).find(e=>e.id===showAddStandard);
            return (evt||{}).measurableType==='Time' ? <TimeDropdown min={stdForm.min} sec={stdForm.sec} onMinChange={v=>setStdForm({...stdForm,min:v})} onSecChange={v=>setStdForm({...stdForm,sec:v})} label="Time" /> : <FieldMeasure ft={stdForm.ft} inch={stdForm.inch} qtr={stdForm.qtr} onFtChange={v=>setStdForm({...stdForm,ft:v})} onInchChange={v=>setStdForm({...stdForm,inch:v})} onQtrChange={v=>setStdForm({...stdForm,qtr:v})} />;
          })()}
          <span style={{fontSize:11,color:C.textMuted}}>Tip: how many athletes must hit a standard before it counts (e.g. 3 for "3rd entry" rules) is set per standard type under Settings → Standards.</span>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>addStandard(showAddStandard)}>Add Standard</button>
        </div>
      </Modal>
      <Modal open={!!showAddRecord} onClose={()=>setShowAddRecord(null)} width={400}>
        <h2 style={S.h2}>Add School Record</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
          <input style={S.input} placeholder="Record type (e.g. School Record, Freshman Record)" value={recForm.type} onChange={e=>setRecForm({...recForm,type:e.target.value})} />
          <select style={{...S.select,width:'100%'}} value={recForm.athleteId} onChange={e=>setRecForm({...recForm,athleteId:e.target.value})}>
            <option value="">Select athlete</option>
            {data.athletes.map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}
          </select>
          {(()=>{const evt=(data.events||[]).find(e=>e.id===showAddRecord);
            return (evt||{}).measurableType==='Time' ? <TimeDropdown min={recForm.min} sec={recForm.sec} onMinChange={v=>setRecForm({...recForm,min:v})} onSecChange={v=>setRecForm({...recForm,sec:v})} label="Time" /> : <FieldMeasure ft={recForm.ft} inch={recForm.inch} qtr={recForm.qtr} onFtChange={v=>setRecForm({...recForm,ft:v})} onInchChange={v=>setRecForm({...recForm,inch:v})} onQtrChange={v=>setRecForm({...recForm,qtr:v})} />;
          })()}
          <div><label style={{fontSize:12,color:C.textSecondary}}>Date</label><input style={S.input} type="date" value={recForm.date} onChange={e=>setRecForm({...recForm,date:e.target.value})} /></div>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>addRecord(showAddRecord)}>Add Record</button>
        </div>
      </Modal>
      <ConfirmModal open={!!delId} onClose={()=>setDelId(null)} onConfirm={deleteEvent} message="Delete this event? Qualifying standards and records will also be removed." />
    </div>
  );
}
function ToolsPage({ data, save, nav, events, addResult, getAthletePR, checkRecord, checkQualifying, preset }) {
  const tools = [
    { key:'raceTimer', label:'Race Timer', desc:'Single athlete, single event. Lap splits with pace tracking.', icon:'⏱️', color:C.accent },
    { key:'multiSplit', label:'Multi-Split Timer', desc:'Multiple athletes simultaneously. Target times and live pace.', icon:'⏱️', color:C.blue },
    { key:'relayTimer', label:'Relay Timer', desc:'Sequential legs. Each split starts when the previous leg finishes.', icon:'⏱️', color:'#6b46c1' },
    { key:'fieldEvent', label:'Field Event Entry', desc:'Record attempts for jumps, throws, and pole vault.', icon:'📏', color:C.success },
  ];
  return (
    <div>
      {tools.map(t => (
        <button key={t.key} style={{...S.bigBtn, borderLeft:`4px solid ${t.color}`, background:C.surface, marginBottom:8}} onClick={()=>nav(t.key)}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontSize:24,color:t.color}}>{t.icon}</span>
            <div><div style={{fontSize:15,fontWeight:700,color:C.text}}>{t.label}</div><div style={{fontSize:12,color:C.textSecondary,fontWeight:400,marginTop:2,textTransform:'none'}}>{t.desc}</div></div>
          </div>
        </button>
      ))}
    </div>
  );
}
function RaceTimer({ data, save, nav, events, addResult, getAthletePR, checkRecord, checkQualifying, preset }) {
  const [meetId, setMeetId] = useState((preset||{}).meetId||'');
  const [eventId, setEventId] = useState((preset||{}).eventId||'');
  const [athleteId, setAthleteId] = useState((preset||{}).athleteId||'');
  const [trackType, setTrackType] = useState('Outdoor');
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);
  const evt = events.find(e=>e.id===eventId);
  const lapDist = trackType==='Indoor'?INDOOR_LAP:OUTDOOR_LAP;
  const totalDist = getDistance(evt);
  const totalLaps = totalDist > 0 ? Math.ceil(totalDist/lapDist) : 999;
  useEffect(() => {
    if(running && startTime) { timerRef.current = setInterval(()=>setElapsed(Date.now()-startTime),10); return ()=>clearInterval(timerRef.current); }
    return ()=>clearInterval(timerRef.current);
  }, [running, startTime]);
  const start = () => { setStartTime(Date.now()); setRunning(true); setElapsed(0); setLaps([]); setFinished(false); setSaved(false); };
  const lap = () => {
    if(!running) return;
    const now = Date.now();
    const lapTime = now - startTime;
    const prevCum = laps.length > 0 ? laps[laps.length-1].cumulative : 0;
    const newLaps = [...laps, { lap:laps.length+1, split:lapTime-prevCum, cumulative:lapTime }];
    setLaps(newLaps);
    if(newLaps.length >= totalLaps && totalLaps < 999) { clearInterval(timerRef.current); setRunning(false); setElapsed(lapTime); setFinished(true); }
  };
  const stop = () => { clearInterval(timerRef.current); setRunning(false); setFinished(true); };
  const reset = () => { clearInterval(timerRef.current); setRunning(false); setElapsed(0); setLaps([]); setFinished(false); setSaved(false); };
  const handleSave = () => {
    if(!athleteId || !eventId || laps.length===0) return;
    const meet = data.meets.find(m=>m.id===meetId);
    const finalTime = laps[laps.length-1].cumulative;
    addResult({ id:uid(), athleteId, eventId, meetId, date:(meet||{}).startDate||(meet||{}).date||new Date().toISOString().split('T')[0], timeMs:finalTime, splits:laps });
    setSaved(true);
  };
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const trackEvents = events.filter(e=>isTrackEvent(e)&&e.entryType==='Individual');
  return (
    <div>
      <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back</button>
      <h1 style={S.h1}>Race Timer</h1>
      {!running && !finished && (
        <div style={S.card}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Meet</label><select style={{...S.select,width:'100%'}} value={meetId} onChange={e=>setMeetId(e.target.value)}><option value="">Select Meet</option>{data.meets.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Event</label><select style={{...S.select,width:'100%'}} value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select Event</option>{trackEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Athlete</label><select style={{...S.select,width:'100%'}} value={athleteId} onChange={e=>setAthleteId(e.target.value)}><option value="">Select</option>{activeAthletes.map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Track</label><select style={{...S.select,width:'100%'}} value={trackType} onChange={e=>setTrackType(e.target.value)}><option>Indoor</option><option>Outdoor</option></select></div>
            {meetId==='practice-custom'&&<div><label style={{fontSize:12,color:C.textSecondary}}>Practice Date</label><input style={{...S.input}} type="date" id="practiceDate" defaultValue={new Date().toISOString().split('T')[0]} /></div>}
          </div>
        </div>
      )}
      <div style={{textAlign:'center',padding:'20px 0'}}>
        <div style={{fontSize:40,fontWeight:600,fontVariantNumeric:'tabular-nums',color:running?C.accent:C.text}}>{formatTime(elapsed)}</div>
        {evt && totalLaps<999 && <div style={{fontSize:12,color:C.textSecondary,marginTop:4}}>Lap {laps.length+1} of {totalLaps}</div>}
      </div>
      <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
        {!running && !finished && <button style={{...S.btn,...S.btnPrimary,fontSize:18,padding:'14px 40px'}} onClick={start}>> Start</button>}
        {running && <><button style={{...S.btn,...S.btnPrimary,fontSize:18,padding:'14px 30px'}} onClick={lap}>Lap {laps.length+1}</button><button style={{...S.btn,...S.btnDanger,fontSize:14,padding:'14px 20px'}} onClick={stop}>[] Stop</button></>}
        {finished && <>{!saved&&<button style={{...S.btn,...S.btnSuccess}} onClick={handleSave}>Save</button>}<button style={{...S.btn,...S.btnDanger}} onClick={reset}>Reset</button></>}
        {saved && <SavedIndicator saved={true} />}
      </div>
      {laps.length>0 && (
        <div style={S.card}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={S.th}>Lap</th><th style={S.th}>Split</th><th style={S.th}>Cumulative</th></tr></thead>
            <tbody>{laps.map(l=>(<tr key={l.lap}><td style={S.td}>{l.lap}</td><td style={S.td}>{formatTime(l.split)}</td><td style={S.td}>{formatTime(l.cumulative)}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
const navToMeetEvent = (data, events, nav, preset, targetEventId) => {
  if(!targetEventId||!preset||!preset.meetId) return;
  const meet = (data.meets||[]).find(m=>m.id===preset.meetId);
  if(!meet) return;
  const me = (meet.events||[]).find(e=>e.eventId===targetEventId);
  const evt = events.find(e=>e.id===targetEventId);
  if(!me||!evt) return;
  const athIds = (me.entries||[]).flatMap(en=>en.athletes?en.athletes.map(a=>a.athleteId):[en.athleteId]).filter(Boolean);
  const sorted = preset.sortedEventIds || getSortedMeetEventIds(data, events, preset.meetId);
  const idx = sorted.indexOf(targetEventId);
  const nextId = idx>=0&&idx<sorted.length-1?sorted[idx+1]:null;
  const prevId = idx>0?sorted[idx-1]:null;
  const nP = {
    meetId:preset.meetId, eventId:targetEventId, athleteIds:athIds, entries:me.entries,
    sortedEventIds:sorted,
    nextEventId:nextId, nextEventLabel:nextId?getEventLabel(events.find(e=>e.id===nextId)||{}):null,
    prevEventId:prevId, prevEventLabel:prevId?getEventLabel(events.find(e=>e.id===prevId)||{}):null
  };
  if(evt.eventType==='Field') nav('fieldEvent',nP);
  else if(evt.entryType==='Relay') nav('relayTimer',nP);
  else nav('multiSplit',nP);
};
function MultiSplitTimer({ data, save, nav, events, addResult, addResults, getAthletePR, checkRecord, preset }) {
  const [meetId, setMeetId] = useState((preset||{}).meetId||'');
  const [eventId, setEventId] = useState((preset||{}).eventId||'');
  const [trackType, setTrackType] = useState('Outdoor');
  const [athletes, setAthletes] = useState(() => {
    const ids = (preset||{}).athleteIds||[];
    const entries = (preset||{}).entries||[];
    if(ids.length>0) return ids.map(id=>{const en=entries.find(e=>e.athleteId===id||(e.athletes||[]).some(a=>a.athleteId===id));const goalMs=(en||{}).goalMs||(((en||{}).athletes||[]).find(a=>a.athleteId===id)||{}).goalMs||0;return{id:uid(),athleteId:id,laps:[],goalMs};});
    return [{id:uid(),athleteId:'',laps:[],goalMs:0},{id:uid(),athleteId:'',laps:[],goalMs:0}];
  });
  const [selectedIds, setSelectedIds] = useState(()=>{
    const ids = (preset||{}).athleteIds||[];
    const set = {};
    ids.forEach(id=>{
      const hasResult = (data.results||[]).some(r=>r.athleteId===id&&r.eventId===(preset||{}).eventId&&r.meetId===(preset||{}).meetId&&!r.isRelay);
      if(!hasResult) set[id] = true;
    });
    return set;
  });
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [saved, setSaved] = useState(false);
  const presetKey = useRef((preset||{}).eventId||'');
  const msPresetEventId = (preset||{}).eventId||'';
  useEffect(()=>{
    if(msPresetEventId && msPresetEventId !== presetKey.current) {
      presetKey.current = msPresetEventId;
      setMeetId((preset||{}).meetId||'');
      setEventId(msPresetEventId);
      const ids = (preset||{}).athleteIds||[];
      const entries = (preset||{}).entries||[];
      if(ids.length>0) setAthletes(ids.map(id=>{const en=entries.find(e=>e.athleteId===id||(e.athletes||[]).some(a=>a.athleteId===id));const goalMs=(en||{}).goalMs||(((en||{}).athletes||[]).find(a=>a.athleteId===id)||{}).goalMs||0;return{id:uid(),athleteId:id,laps:[],goalMs};}));
      else setAthletes([{id:uid(),athleteId:'',laps:[],goalMs:0},{id:uid(),athleteId:'',laps:[],goalMs:0}]);
      const selSet = {};
      ids.forEach(id=>{
        const hasResult = (data.results||[]).some(r=>r.athleteId===id&&r.eventId===msPresetEventId&&r.meetId===(preset||{}).meetId&&!r.isRelay);
        if(!hasResult) selSet[id] = true;
      });
      setSelectedIds(selSet);
      clearInterval(timerRef.current);
      setRunning(false); setStartTime(null); setElapsed(0); setFinished(false); setCollapsed(false); setSaved(false);
    }
  },[msPresetEventId]);
  const timerRef = useRef(null);
  const evt = events.find(e=>e.id===eventId);
  const _ls = getLapStructure(evt, trackType) || { lapDist: (trackType==='Indoor'?INDOOR_LAP:OUTDOOR_LAP), firstLap: 0, totalDist: 0 };
  const lapDist = _ls.lapDist;
  const totalDist = _ls.totalDist;
  const firstLapDist = _ls.firstLap || lapDist;
  const totalLaps = totalDist>0 ? (1 + Math.max(0, Math.round((totalDist - firstLapDist) / lapDist))) : 999;
  const getLapDist = (lapNum) => lapNum===1 ? firstLapDist : lapDist;
  const getCumDist = (lapNum) => firstLapDist + Math.max(0, lapNum-1) * lapDist;
  const getExpectedCum = (goalMs, lapNum) => totalDist>0 ? goalMs * getCumDist(lapNum) / totalDist : goalMs * lapNum / totalLaps;
  const getExpectedSplit = (goalMs, lapNum) => totalDist>0 ? goalMs * getLapDist(lapNum) / totalDist : goalMs / totalLaps;
  const normalizedPace = (lapTime, lapNum) => lapTime * lapDist / getLapDist(lapNum);
  const lapStructureLabel = (()=>{
    if(totalDist<=0 || totalLaps>=999) return '';
    if(firstLapDist===lapDist) return `${totalLaps} × ${lapDist}m = ${totalDist}m`;
    const rest = totalLaps - 1;
    return `1 × ${firstLapDist}m + ${rest} × ${lapDist}m = ${totalDist}m`;
  })();
  const isRelayEvt = (evt||{}).entryType==='Relay';
  const legsPerAthlete = isRelayEvt ? Math.ceil(totalLaps/athletes.length) : totalLaps;
  const COLORS = ['#2b6cb0','#c96a1f','#25763b','#c53030','#6b46c1','#b8860b'];
  useEffect(() => {
    if(running&&startTime) { timerRef.current=setInterval(()=>setElapsed(Date.now()-startTime),10); return()=>clearInterval(timerRef.current); }
    return()=>clearInterval(timerRef.current);
  }, [running, startTime]);
  const handleStart = () => { setStartTime(Date.now()); setRunning(true); setElapsed(0); setAthletes(a=>a.map(at=>({...at,laps:[]}))); setFinished(false); setSaved(false); setCollapsed(true); };
  const handleLap = (idx) => {
    if(!running) return;
    const now=Date.now(); const lapTime=now-startTime;
    setAthletes(prev=>{
      const copy=[...prev]; const athlete={...copy[idx]};
      const prevCum=athlete.laps.length>0?athlete.laps[athlete.laps.length-1].cumulative:0;
      athlete.laps=[...athlete.laps,{lap:athlete.laps.length+1,split:lapTime-prevCum,cumulative:lapTime}];
      copy[idx]=athlete;
      if(isRelayEvt){const totalRecorded=copy.reduce((s,a)=>s+a.laps.length,0);if(totalRecorded>=totalLaps){clearInterval(timerRef.current);setRunning(false);setElapsed(lapTime);setFinished(true);}}
      else{if(copy.every(a=>a.laps.length>=totalLaps)&&totalLaps<999){clearInterval(timerRef.current);setRunning(false);setElapsed(lapTime);setFinished(true);}}
      return copy;
    });
  };
  const handleStop = () => { clearInterval(timerRef.current); setRunning(false); setFinished(true); };
  const handleReset = () => { clearInterval(timerRef.current); setRunning(false); setElapsed(0); setFinished(false); setSaved(false); setCollapsed(false); setAthletes(a=>a.map(at=>({...at,laps:[]}))); };
  const handleSave = () => {
    const isPractice=meetId==='practice'||meetId==='practice-custom';
    const meet=isPractice?null:data.meets.find(m=>m.id===meetId);
    const raceDate=isPractice?(meetId==='practice-custom'?(document.getElementById('practiceDate')||{}).value||new Date().toISOString().split('T')[0]:new Date().toISOString().split('T')[0]):(meet||{}).startDate||(meet||{}).date||new Date().toISOString().split('T')[0];
    const saveMeetId=isPractice?null:meetId;
    const newResults=[];
    const relayAthleteIds=[];
    athletes.forEach(at=>{
      if(!at.athleteId||at.laps.length===0) return;
      if(!selectedIds[at.athleteId]) return;
      const finalTime=at.laps[at.laps.length-1].cumulative;
      newResults.push({id:uid(),athleteId:at.athleteId,eventId,meetId:saveMeetId,date:raceDate,timeMs:finalTime,splits:at.laps,isPractice:isPractice});
      relayAthleteIds.push(at.athleteId);
    });
    if(isRelayEvt&&relayAthleteIds.length>0){
      const allLaps=athletes.filter(a=>a.athleteId&&a.laps.length>0&&selectedIds[a.athleteId]).flatMap(a=>a.laps);
      const totalTime=Math.max(...allLaps.map(l=>l.cumulative));
      newResults.push({id:uid(),eventId,meetId:saveMeetId,date:raceDate,timeMs:totalTime,isRelay:true,relayAthletes:relayAthleteIds,splits:allLaps,isPractice:isPractice});
    }
    if(newResults.length>0) {
      if(addResults) addResults(newResults);
      else newResults.forEach(r=>addResult(r));
    }
    setSaved(true);
  };
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const trackEvents = events.filter(e=>isTrackEvent(e));
  const gender = (evt||{}).gender;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,flexWrap:'wrap',gap:8}}>
        <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back to Meet</button>
        {(preset||{}).meetId&&((preset||{}).prevEventId||(preset||{}).nextEventId)&&(
          <div style={{display:'flex',gap:6}}>
            {(preset||{}).prevEventId&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'6px 12px'}} onClick={()=>navToMeetEvent(data,events,nav,preset,preset.prevEventId)}>← {preset.prevEventLabel}</button>}
            {(preset||{}).nextEventId&&<button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'6px 12px'}} onClick={()=>navToMeetEvent(data,events,nav,preset,preset.nextEventId)}>{preset.nextEventLabel} →</button>}
          </div>
        )}
      </div>
      <h1 style={S.h1}>Multi-Split Timer</h1>
      {!collapsed && (
        <div style={S.card}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Meet (or Practice)</label><select style={{...S.select,width:'100%'}} value={meetId} onChange={e=>setMeetId(e.target.value)}><option value="">Select</option><option value="practice">Practice (Today)</option><option value="practice-custom">Practice (Custom Date)</option>{data.meets.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Event</label><select style={{...S.select,width:'100%'}} value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select</option>{trackEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Track</label><select style={{...S.select,width:'100%'}} value={trackType} onChange={e=>setTrackType(e.target.value)}><option>Indoor</option><option>Outdoor</option></select></div>
            {meetId==='practice-custom'&&<div><label style={{fontSize:12,color:C.textSecondary}}>Practice Date</label><input style={{...S.input}} type="date" id="practiceDate" defaultValue={new Date().toISOString().split('T')[0]} /></div>}
          </div>
          {evt && lapStructureLabel && <div style={{marginTop:10,padding:'6px 10px',background:C.surface2,borderLeft:`3px solid ${C.accent}`,borderRadius:'0 6px 6px 0',fontSize:11,color:C.textSecondary,display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            <span><strong style={{color:C.text}}>Lap structure:</strong> {lapStructureLabel}</span>
            <span style={{fontSize:10,color:C.textMuted}}>Edit on the event under Settings → Events if this is wrong.</span>
          </div>}
          <div style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:14,fontWeight:600,color:C.textSecondary}}>Athletes</span>
              <button style={{...S.btn,...S.btnSecondary,padding:'4px 12px',fontSize:12}} onClick={()=>setAthletes(a=>[...a,{id:uid(),athleteId:'',laps:[],goalMs:0}])}>+ Add</button>
            </div>
            {athletes.map((at,i)=>{
              const hasResult = at.athleteId && (data.results||[]).some(r=>r.athleteId===at.athleteId&&r.eventId===eventId&&r.meetId===meetId&&!r.isRelay);
              const isSelected = at.athleteId ? !!selectedIds[at.athleteId] : true;
              return (
              <div key={at.id} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center',flexWrap:'wrap',opacity:hasResult?0.5:1,background:hasResult?C.surface2:'transparent',padding:hasResult?'4px 6px':0,borderRadius:hasResult?6:0}}>
                {at.athleteId&&!hasResult&&<input type="checkbox" checked={isSelected} onChange={()=>setSelectedIds(p=>({...p,[at.athleteId]:!p[at.athleteId]}))} title="Include in this heat" />}
                {hasResult&&<span style={{fontSize:10,fontWeight:700,color:C.success,minWidth:20,textAlign:'center'}}>✓</span>}
                <div style={{width:8,height:32,borderRadius:4,background:COLORS[i%COLORS.length],flexShrink:0}} />
                <select style={{...S.select,flex:1,minWidth:120}} value={at.athleteId} onChange={e=>{const c=[...athletes];c[i]={...c[i],athleteId:e.target.value};setAthletes(c);if(e.target.value)setSelectedIds(p=>({...p,[e.target.value]:true}));}} disabled={hasResult}>
                  <option value="">Athlete {i+1}</option>
                  {activeAthletes.filter(a=>!gender||gender==='Mixed'||a.gender===(gender==='Boy'?'M':'F')).map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}
                </select>
                {hasResult&&<span style={{fontSize:10,color:C.success,fontWeight:600}}>Already recorded</span>}
                {!hasResult&&<div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:10,color:C.textMuted}}>Target</span>
                  <select style={{...S.select,width:50,padding:'4px 2px',fontSize:12}} value={Math.floor((at.goalMs||0)/60000)} onChange={e=>{const c=[...athletes];const oldSec=((at.goalMs||0)%60000)/1000;c[i]={...c[i],goalMs:(parseInt(e.target.value)*60+oldSec)*1000};setAthletes(c);}}>
                    {Array.from({length:31},(_,n)=><option key={n} value={n}>{n}</option>)}
                  </select>
                  <span style={{fontSize:12,color:C.textMuted}}>:</span>
                  <input type="text" inputMode="decimal" style={{...S.input,width:60,padding:'4px 2px',fontSize:12,textAlign:'center'}} value={(((at.goalMs||0)%60000)/1000).toFixed(2)} onChange={e=>{const c=[...athletes];const min=Math.floor((at.goalMs||0)/60000);c[i]={...c[i],goalMs:(min*60+parseFloat(e.target.value||0))*1000};setAthletes(c);}} placeholder="00.00" />
                </div>}
                {athletes.length>1&&<button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',flexShrink:0}} onClick={()=>setAthletes(a=>a.filter((_,j)=>j!==i))}>✕</button>}
              </div>);
            })}
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
              <button style={{...S.btn,...S.btnDanger,padding:'4px 12px',fontSize:11}} onClick={()=>setAthletes([{id:uid(),athleteId:'',laps:[],goalMs:0},{id:uid(),athleteId:'',laps:[],goalMs:0}])}>Reset Setup</button>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8,alignItems:'center'}}>
          {evt && <span style={{...S.pill(false),fontSize:11}}>{getEventLabel(evt)}</span>}
          <span style={{...S.pill(false),fontSize:11}}>{trackType}</span>
          <button style={{background:'none',border:'none',color:C.textSecondary,cursor:'pointer',fontSize:12}} onClick={()=>setCollapsed(false)}>v Expand</button>
        </div>
      )}
      <div style={{textAlign:'center',padding:'20px 0'}}>
        <div style={{fontSize:40,fontWeight:600,fontVariantNumeric:'tabular-nums',color:running?C.accent:C.text}}>{formatTime(elapsed)}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:running?'repeat(auto-fit,minmax(260px,1fr))':'auto',gap:18,marginBottom:16,alignItems:'stretch'}}>
        {!running&&!finished&&<button style={{...S.btn,...S.btnPrimary,fontSize:22,padding:'20px 60px',justifySelf:'center',fontWeight:700}} onClick={handleStart}>▶ Start</button>}
        {running&&<>
          {athletes.filter(at=>!at.athleteId||selectedIds[at.athleteId]).map((at,i)=>{
            const athObj=data.athletes.find(a=>a.id===at.athleteId);
            const done=at.laps.length>=(isRelayEvt?legsPerAthlete:totalLaps);
            const currentLap=at.laps.length;
            const realIdx=athletes.findIndex(a=>a.id===at.id);
            let paceLabel='';
            if(at.goalMs&&totalLaps>0&&totalLaps<999&&currentLap>0){const diff=at.laps[currentLap-1].cumulative-getExpectedCum(at.goalMs,currentLap);paceLabel=` ${formatDiff(diff)}`;}
            return (<button key={at.id} disabled={done} style={{...S.btn,background:done?C.surface2:COLORS[realIdx%COLORS.length],color:done?C.textMuted:C.white,fontSize:24,padding:'36px 20px',minHeight:140,opacity:done?0.4:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,fontWeight:700,lineHeight:1.15,textAlign:'center',border:'none',borderRadius:14,boxShadow:done?'none':'0 2px 6px rgba(0,0,0,0.15)',touchAction:'manipulation',userSelect:'none'}} onClick={()=>handleLap(realIdx)}>
              <span style={{fontSize:24,fontWeight:800,letterSpacing:'0.01em'}}>{athObj?athDisplay(athObj):`Ath ${realIdx+1}`}</span>
              <span style={{fontSize:17,opacity:0.95,fontWeight:600}}>Lap {at.laps.length+1}{done?' ✓ DONE':''}</span>
              {paceLabel&&<span style={{fontSize:15,opacity:0.95,fontWeight:600}}>{paceLabel}</span>}
            </button>);
          })}
          <button style={{...S.btn,...S.btnDanger,fontSize:20,padding:'36px 20px',minHeight:140,fontWeight:700,borderRadius:14,touchAction:'manipulation'}} onClick={handleStop}>■ Stop</button>
        </>}
        {finished&&<div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',gridColumn:'1 / -1'}}>
          {!saved&&<button style={{...S.btn,...S.btnSuccess}} onClick={handleSave}>Save All</button>}
          <button style={{...S.btn,...S.btnDanger}} onClick={handleReset}>Reset</button>
          {saved&&<SavedIndicator saved={true} />}
          {saved&&<button style={{...S.btn,...S.btnPrimary,fontSize:14,padding:'10px 24px'}} onClick={()=>{
            clearInterval(timerRef.current);setRunning(false);setElapsed(0);setFinished(false);setSaved(false);setCollapsed(false);
            setAthletes(a=>a.map(at=>({...at,laps:[]})));
            const newSel={};
            athletes.forEach(at=>{
              if(!at.athleteId) return;
              const hasResult = (data.results||[]).some(r=>r.athleteId===at.athleteId&&r.eventId===eventId&&r.meetId===meetId&&!r.isRelay);
              if(!hasResult) newSel[at.athleteId]=true;
            });
            setSelectedIds(newSel);
          }}>Next Heat</button>}
        </div>}
      </div>
      {athletes.map((at,i)=>{
        if(at.laps.length===0) return null;
        const athObj=data.athletes.find(a=>a.id===at.athleteId);
        const athleteColor=COLORS[i%COLORS.length];
        const hasTarget=!!at.goalMs&&totalLaps>0&&totalLaps<999;
        return (<div key={at.id} style={{...S.card,borderLeft:`4px solid ${athleteColor}`}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <h3 style={{fontSize:15,fontWeight:700,margin:0,color:athleteColor}}>{(athObj||{}).name||`Athlete ${i+1}`}</h3>
            {hasTarget&&<span style={{fontSize:11,color:C.textMuted,marginLeft:'auto'}}>Target: {formatTime(at.goalMs)}</span>}
          </div>
          {(()=>{
            const lapsCompleted=at.laps.length;
            const lapsRemaining=Math.max(0,(isRelayEvt?legsPerAthlete:totalLaps)-lapsCompleted);
            const distCovered=getCumDist(lapsCompleted);
            const pacePerMeter=lapsCompleted>0&&distCovered>0?at.laps[lapsCompleted-1].cumulative/distCovered:0;
            const avgLapPace=pacePerMeter*lapDist;
            const remainingDist=totalDist-distCovered;
            const predictedFinish=lapsCompleted>0?at.laps[lapsCompleted-1].cumulative+pacePerMeter*remainingDist:0;
            const hasVariableLaps = lapsCompleted>0 && at.laps.some((l,li)=>getLapDist(l.lap)!==lapDist);
            return (<>
              {lapsCompleted>0&&totalLaps<999&&<div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:6,fontSize:11}}>
                <span style={{color:C.textMuted}}>Avg {lapDist}m pace: <strong style={{color:C.text}}>{formatTime(Math.round(avgLapPace))}</strong></span>
                {lapsRemaining>0&&<span style={{color:C.textMuted}}>Predicted: <strong style={{color:hasTarget&&predictedFinish>at.goalMs?C.danger:C.success}}>{formatTime(Math.round(predictedFinish))}</strong></span>}
                {hasTarget&&lapsRemaining>0&&<span style={{color:C.textMuted}}>Target: <strong>{formatTime(at.goalMs)}</strong></span>}
              </div>}
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr><th style={S.th}>Lap</th><th style={S.th}>Split</th><th style={S.th}>Pace /{lapDist}m</th><th style={S.th}></th><th style={S.th}>Cumulative</th>{hasTarget&&<th style={S.th}>vs Goal</th>}</tr></thead>
                <tbody>{at.laps.map((l,li)=>{
                  const myLapDist = getLapDist(l.lap);
                  const myPace = normalizedPace(l.split, l.lap);
                  const prevPace = li>0 ? normalizedPace(at.laps[li-1].split, at.laps[li-1].lap) : null;
                  const paceDiffPrev = prevPace!==null ? myPace - prevPace : 0;
                  const isFaster = prevPace!==null && myPace < prevPace;
                  const isSlower = prevPace!==null && myPace > prevPace;
                  const goalDiff = hasTarget ? l.cumulative - getExpectedCum(at.goalMs, l.lap) : 0;
                  return (<tr key={l.lap}>
                    <td style={S.td}>
                      <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:28,padding:'2px 8px',borderRadius:20,fontSize:12,fontWeight:700,background:C.white,color:athleteColor,border:`2px solid ${athleteColor}`}}>{l.lap}</span>
                      {hasVariableLaps && myLapDist!==lapDist && <span style={{fontSize:9,color:C.textMuted,marginLeft:4}}>({myLapDist}m)</span>}
                    </td>
                    <td style={S.td}>{formatTime(l.split)}</td>
                    <td style={{...S.td,fontWeight:600}}>{formatTime(Math.round(myPace))}</td>
                    <td style={{...S.td,fontSize:10,fontWeight:600,color:isFaster?C.success:isSlower?C.danger:C.textMuted,padding:'4px 2px'}}>{prevPace!==null?(isFaster?'▼':'▲')+' '+formatDiff(Math.round(paceDiffPrev)):''}</td>
                    <td style={S.td}>{formatTime(l.cumulative)}</td>
                    {hasTarget&&<td style={{...S.td,fontWeight:600,fontSize:12}}><span style={{color:goalDiff<=0?C.success:C.danger}}>{formatDiff(goalDiff)}</span></td>}
                  </tr>);
                })}</tbody>
              </table>
            </>);
          })()}
        </div>);
      })}
    </div>
  );
}
function FieldEventPage({ data, save, nav, events, addResult, getAthletePR, checkRecord, checkQualifying, preset }) {
  const [meetId, setMeetId] = useState((preset||{}).meetId||'');
  const [eventId, setEventId] = useState((preset||{}).eventId||'');
  const [athleteId, setAthleteId] = useState(((preset||{}).athleteIds||[])[0]||'');
  const [ft, setFt] = useState(0);
  const [inch, setInch] = useState(0);
  const [qtr, setQtr] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [saved, setSaved] = useState(false);
  const evt = events.find(e=>e.id===eventId);
  const pr = getAthletePR(athleteId, eventId);
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const fieldEvents = events.filter(e=>isFieldEvent(e)&&e.entryType==='Individual');
  const addAttempt = () => {
    const totalInches = fieldToInches(ft,inch,qtr);
    if(totalInches<=0) return;
    setAttempts(prev=>[...prev,{ft:parseInt(ft),inch:parseInt(inch),qtr:parseFloat(qtr),total:totalInches}]);
  };
  const saveBest = () => {
    if(!attempts.length||!athleteId||!eventId) return;
    const best = attempts.reduce((b,a)=>a.total>b.total?a:b);
    const meet = data.meets.find(m=>m.id===meetId);
    addResult({id:uid(),athleteId,eventId,meetId,date:(meet||{}).startDate||(meet||{}).date||new Date().toISOString().split('T')[0],ft:best.ft,inch:best.inch,qtr:best.qtr});
    setSaved(true);
  };
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,flexWrap:'wrap',gap:8}}>
        <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back to Meet</button>
        {(preset||{}).meetId&&((preset||{}).prevEventId||(preset||{}).nextEventId)&&(
          <div style={{display:'flex',gap:6}}>
            {(preset||{}).prevEventId&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'6px 12px'}} onClick={()=>navToMeetEvent(data,events,nav,preset,preset.prevEventId)}>← {preset.prevEventLabel}</button>}
            {(preset||{}).nextEventId&&<button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'6px 12px'}} onClick={()=>navToMeetEvent(data,events,nav,preset,preset.nextEventId)}>{preset.nextEventLabel} →</button>}
          </div>
        )}
      </div>
      <h1 style={S.h1}>Field Event Entry</h1>
      <div style={S.card}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Meet</label><select style={{...S.select,width:'100%'}} value={meetId} onChange={e=>setMeetId(e.target.value)}><option value="">Select</option>{data.meets.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Event</label><select style={{...S.select,width:'100%'}} value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select</option>{fieldEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}</select></div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Athlete</label><select style={{...S.select,width:'100%'}} value={athleteId} onChange={e=>setAthleteId(e.target.value)}><option value="">Select</option>{activeAthletes.map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}</select></div>
        </div>
        {pr && <div style={{marginTop:8}}><span style={S.pr}>PR: {fieldToStr(pr.ft,pr.inch,pr.qtr)}</span></div>}
      </div>
      <div style={S.card}>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
          <FieldMeasure ft={ft} inch={inch} qtr={qtr} onFtChange={setFt} onInchChange={setInch} onQtrChange={setQtr} />
          <button style={{...S.btn,...S.btnPrimary}} onClick={addAttempt}>+ Attempt</button>
        </div>
        {attempts.length>0 && (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={S.th}>#</th><th style={S.th}>Mark</th><th style={S.th}></th></tr></thead>
            <tbody>{attempts.map((a,i)=>{
              const isBest = a.total === Math.max(...attempts.map(x=>x.total));
              return (<tr key={i}><td style={S.td}>{i+1}</td><td style={{...S.td,fontWeight:isBest?700:400,color:isBest?C.accent:C.text}}>{fieldToStr(a.ft,a.inch,a.qtr)}{isBest&&' *'}</td><td style={S.td}><button style={{background:'none',border:'none',color:C.danger,cursor:'pointer'}} onClick={()=>setAttempts(prev=>prev.filter((_,j)=>j!==i))}>✕</button></td></tr>);
            })}</tbody>
          </table>
        )}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          {attempts.length>0 && !saved && <button style={{...S.btn,...S.btnSuccess}} onClick={saveBest}>Save Best</button>}
          {saved && <SavedIndicator saved={true} />}
        </div>
      </div>
    </div>
  );
}
function RelayTimer({ data, save, nav, events, addResult, addResults, getAthletePR, preset }) {
  const [meetId, setMeetId] = useState((preset||{}).meetId||'');
  const [eventId, setEventId] = useState((preset||{}).eventId||'');
  const [teams, setTeams] = useState(()=>{
    const entries = (preset||{}).entries||[];
    const relayEntries = entries.filter(e=>e.athletes&&e.athletes.length>0);
    if(relayEntries.length>0) return relayEntries.map((re,i)=>({
      id:uid(), name:'Team '+(i+1), 
      legs:re.athletes.map(a=>({id:uid(),athleteId:a.athleteId,goalMs:a.goalMs||0,splitMs:null,cumMs:null})),
      activeLeg:0, finished:false
    }));
    return [{id:uid(),name:'Team 1',legs:[{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null}],activeLeg:0,finished:false}];
  });
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [saved2, setSaved2] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState(()=>{
    const sel = {};
    const entries = (preset||{}).entries||[];
    entries.filter(e=>e.athletes&&e.athletes.length>0).forEach((re,i)=>{
      const aids = re.athletes.map(a=>a.athleteId).filter(Boolean);
      const hasResult = (data.results||[]).some(r=>r.eventId===(preset||{}).eventId&&r.meetId===(preset||{}).meetId&&r.isRelay&&(r.relayAthletes||[]).join(',')==aids.join(','));
      if(!hasResult) sel[i]=true;
    });
    return sel;
  });
  const presetKeyR = useRef((preset||{}).eventId||'');
  const presetEventId = (preset||{}).eventId||'';
  const presetMeetId = (preset||{}).meetId||'';
  useEffect(()=>{
    if(presetEventId && presetEventId !== presetKeyR.current) {
      presetKeyR.current = presetEventId;
      setMeetId(presetMeetId);
      setEventId(presetEventId);
      const entries = (preset||{}).entries||[];
      const relayEntries = entries.filter(e=>e.athletes&&e.athletes.length>0);
      if(relayEntries.length>0) setTeams(relayEntries.map((re,i)=>({id:uid(),name:'Team '+(i+1),legs:re.athletes.map(a=>({id:uid(),athleteId:a.athleteId,goalMs:a.goalMs||0,splitMs:null,cumMs:null})),activeLeg:0,finished:false})));
      const newSel = {};
      relayEntries.forEach((re,i)=>{
        const aids = re.athletes.map(a=>a.athleteId).filter(Boolean);
        const hasResult = (data.results||[]).some(r=>r.eventId===presetEventId&&r.meetId===presetMeetId&&r.isRelay&&(r.relayAthletes||[]).join(',')==aids.join(','));
        if(!hasResult) newSel[i]=true;
      });
      setSelectedTeams(newSel);
      clearInterval(timerRef.current);
      setRunning(false);setStartTime(null);setElapsed(0);setCollapsed(false);setSaved2(false);
    }
  },[presetEventId]);
  const timerRef = useRef(null);
  const evt = events.find(e=>e.id===eventId);
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const gender = (evt||{}).gender||'';
  const allFinished = teams.every((t,i)=>!selectedTeams[i]||t.finished);
  const anySelected = Object.values(selectedTeams).some(v=>v);
  const handleStart = ()=>{setStartTime(Date.now());setRunning(true);setElapsed(0);setSaved2(false);setCollapsed(true);
    setTeams(ts=>ts.map((t,i)=>selectedTeams[i]?{...t,activeLeg:0,finished:false,legs:t.legs.map(l=>({...l,splitMs:null,cumMs:null}))}:t));
  };
  const handleLegTap = (teamIdx)=>{
    if(!running) return;
    const now = Date.now()-startTime;
    setTeams(ts=>ts.map((t,ti)=>{
      if(ti!==teamIdx||t.finished) return t;
      const newLegs = [...t.legs];
      const al = t.activeLeg;
      if(al>=newLegs.length) return t;
      const prevCum = al>0?newLegs[al-1].cumMs:0;
      newLegs[al] = {...newLegs[al], splitMs:now-prevCum, cumMs:now};
      const nextLeg = al+1;
      const done = nextLeg>=newLegs.length;
      return {...t, legs:newLegs, activeLeg:nextLeg, finished:done};
    }));
  };
  const handleStop = ()=>{clearInterval(timerRef.current);setRunning(false);setElapsed(Date.now()-startTime);
    setTeams(ts=>ts.map(t=>({...t,finished:true})));
  };
  const handleReset = ()=>{clearInterval(timerRef.current);setRunning(false);setStartTime(null);setElapsed(0);setSaved2(false);setCollapsed(false);
    setTeams(ts=>ts.map(t=>({...t,activeLeg:0,finished:false,legs:t.legs.map(l=>({...l,splitMs:null,cumMs:null}))})));
  };
  const handleSave = ()=>{
    const raceDate = (data.meets.find(m=>m.id===meetId)||{}).startDate||new Date().toISOString().split('T')[0];
    const newResults = [];
    teams.forEach((team,ti)=>{
      if(!selectedTeams[ti]) return;
      const validLegs = team.legs.filter(l=>l.athleteId&&l.splitMs!==null);
      if(!validLegs.length) return;
      const relayAthleteIds = [];
      const allSplits = [];
      validLegs.forEach((lg,i)=>{
        newResults.push({id:uid(),athleteId:lg.athleteId,eventId,meetId,date:raceDate,timeMs:lg.splitMs,isRelaySplit:true,relayLeg:i+1,splits:[{lap:i+1,split:lg.splitMs,cumulative:lg.cumMs}]});
        relayAthleteIds.push(lg.athleteId);
        allSplits.push({lap:i+1,split:lg.splitMs,cumulative:lg.cumMs,athleteId:lg.athleteId});
      });
      const totalTime = validLegs[validLegs.length-1].cumMs;
      const compositeId = uid();
      newResults.slice(-validLegs.length).forEach(r=>{ r.relayCompositeId = compositeId; });
      newResults.push({id:compositeId,eventId,meetId,date:raceDate,timeMs:totalTime,isRelay:true,relayAthletes:relayAthleteIds,splits:allSplits});
    });
    if(newResults.length) addResults(newResults);
    setSaved2(true);
  };
  useEffect(()=>{
    if(running){timerRef.current=setInterval(()=>setElapsed(Date.now()-startTime),47);}
    return ()=>clearInterval(timerRef.current);
  },[running,startTime]);
  const TEAM_COLORS = ['#2b6cb0','#c53030','#25763b','#c96a1f','#6b46c1','#0d9488'];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,flexWrap:'wrap',gap:8}}>
        <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back to Meet</button>
        {(preset||{}).meetId&&((preset||{}).prevEventId||(preset||{}).nextEventId)&&(
          <div style={{display:'flex',gap:6}}>
            {(preset||{}).prevEventId&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'6px 12px'}} onClick={()=>navToMeetEvent(data,events,nav,preset,preset.prevEventId)}>{"\u2190"} {preset.prevEventLabel}</button>}
            {(preset||{}).nextEventId&&<button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'6px 12px'}} onClick={()=>navToMeetEvent(data,events,nav,preset,preset.nextEventId)}>{preset.nextEventLabel} {"\u2192"}</button>}
          </div>
        )}
      </div>
      <h1 style={S.h1}>Relay Timer{evt?' — '+getEventLabel(evt):''}</h1>
      <div style={{fontSize:36,fontWeight:700,fontVariantNumeric:'tabular-nums',textAlign:'center',padding:'12px 0',color:C.text,letterSpacing:'0.02em'}}>{formatTime(running?(Date.now()-startTime):elapsed)}</div>
      {!collapsed && (
        <div style={S.card}>
          {teams.map((team,ti)=>{
            const aids = team.legs.map(l=>l.athleteId).filter(Boolean);
            const hasResult = aids.length>0 && (data.results||[]).some(r=>r.eventId===eventId&&r.meetId===meetId&&r.isRelay&&(r.relayAthletes||[]).join(',')==aids.join(','));
            const isSelected = !!selectedTeams[ti];
            return (
            <div key={team.id} style={{marginBottom:12,paddingBottom:8,borderBottom:ti<teams.length-1?'1px solid '+C.borderLight:'none',opacity:hasResult?0.5:1,background:hasResult?C.surface2:'transparent',padding:hasResult?'6px':'0',borderRadius:hasResult?8:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                {!hasResult&&<input type="checkbox" checked={isSelected} onChange={()=>setSelectedTeams(p=>({...p,[ti]:!p[ti]}))} />}
                {hasResult&&<span style={{fontSize:11,fontWeight:700,color:C.success}}>✓</span>}
                <span style={{fontWeight:700,fontSize:13,color:TEAM_COLORS[ti%TEAM_COLORS.length]}}>
                  {team.name} ({team.legs.length} legs)
                </span>
                {hasResult&&<span style={{fontSize:10,color:C.success,fontWeight:600}}>Already recorded</span>}
              </div>
              {team.legs.map((lg,i)=>(
                <div key={lg.id} style={{display:'flex',gap:8,marginBottom:4,alignItems:'center'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
                    <button style={{background:'none',border:'1px solid '+C.border,borderRadius:4,cursor:'pointer',padding:'1px 6px',fontSize:10,color:i===0?C.border:C.textSecondary,lineHeight:1}} disabled={i===0} onClick={()=>{setTeams(ts=>ts.map((t,j)=>{if(j!==ti)return t;const c=[...t.legs];[c[i],c[i-1]]=[c[i-1],c[i]];return{...t,legs:c};}));}}>↑</button>
                    <button style={{background:'none',border:'1px solid '+C.border,borderRadius:4,cursor:'pointer',padding:'1px 6px',fontSize:10,color:i>=team.legs.length-1?C.border:C.textSecondary,lineHeight:1}} disabled={i>=team.legs.length-1} onClick={()=>{setTeams(ts=>ts.map((t,j)=>{if(j!==ti)return t;const c=[...t.legs];[c[i],c[i+1]]=[c[i+1],c[i]];return{...t,legs:c};}));}}>↓</button>
                  </div>
                  <div style={{width:8,height:24,borderRadius:4,background:TEAM_COLORS[ti%TEAM_COLORS.length],flexShrink:0}} />
                  <span style={{fontSize:11,fontWeight:700,color:TEAM_COLORS[ti%TEAM_COLORS.length],minWidth:40}}>Leg {i+1}</span>
                  <select style={{...S.select,flex:1,minWidth:100,fontSize:12}} value={lg.athleteId} onChange={e=>{setTeams(ts=>ts.map((t,j)=>{if(j!==ti)return t;const c=[...t.legs];c[i]={...c[i],athleteId:e.target.value};return{...t,legs:c};}));}}>
                    <option value="">Select athlete</option>
                    {activeAthletes.filter(a=>!gender||gender==='Mixed'||a.gender===(gender==='Boy'?'M':'F')).map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}
                  </select>
                </div>
              ))}
            </div>);
          })}
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:16,marginTop:8}}>
        {!running&&!allFinished&&anySelected&&<button style={{...S.btn,...S.btnPrimary,fontSize:22,padding:'20px 40px',gridColumn:'1 / -1',justifySelf:'center',fontWeight:700}} onClick={handleStart}>▶ Start Heat</button>}
        {!running&&!allFinished&&!anySelected&&<div style={{gridColumn:'1 / -1',textAlign:'center',color:C.textMuted,fontSize:13}}>Select teams for this heat above</div>}
        {running&&<>
          {teams.map((team,ti)=>{
            if(!selectedTeams[ti]) return null;
            const al = team.activeLeg;
            const curAth = al<team.legs.length?data.athletes.find(a=>a.id===team.legs[al].athleteId):null;
            const done = team.finished;
            const lastSplit = al>0?team.legs[al-1]:null;
            return (<button key={team.id} disabled={done} style={{...S.btn,background:done?C.surface2:TEAM_COLORS[ti%TEAM_COLORS.length],color:done?C.textMuted:'#fff',fontSize:20,padding:'28px 16px',minHeight:120,opacity:done?0.4:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,fontWeight:700,borderRadius:14,border:'none',boxShadow:done?'none':'0 2px 6px rgba(0,0,0,0.15)',touchAction:'manipulation',userSelect:'none'}} onClick={()=>handleLegTap(ti)}>
              <span style={{fontSize:14,opacity:0.85}}>{team.name}</span>
              <span style={{fontSize:22,fontWeight:800}}>{done?'✓ DONE':curAth?athDisplay(curAth):'Leg '+(al+1)}</span>
              <span style={{fontSize:14,opacity:0.9}}>Leg {Math.min(al+1,team.legs.length)}/{team.legs.length}</span>
              {lastSplit&&<span style={{fontSize:12,opacity:0.8}}>Last: {formatTime(lastSplit.splitMs)}</span>}
            </button>);
          })}
          <button style={{...S.btn,...S.btnDanger,fontSize:18,padding:'28px 16px',minHeight:120,fontWeight:700,borderRadius:14,touchAction:'manipulation'}} onClick={handleStop}>■ Stop</button>
        </>}
      </div>
      {allFinished&&<div style={{marginBottom:16}}>
        {teams.map((team,ti)=>{
          if(!selectedTeams[ti]) return null;
          const totalTime = team.legs.filter(l=>l.cumMs).reduce((max,l)=>Math.max(max,l.cumMs),0);
          return (<div key={team.id} style={{...S.card,marginBottom:8,borderLeft:'4px solid '+TEAM_COLORS[ti%TEAM_COLORS.length]}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <span style={{fontWeight:700,fontSize:14,color:TEAM_COLORS[ti%TEAM_COLORS.length]}}>{team.name}</span>
              <span style={{fontWeight:700,fontSize:18}}>{formatTime(totalTime)}</span>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><th style={S.th}>Leg</th><th style={S.th}>Athlete</th><th style={S.th}>Split</th><th style={S.th}>Cumulative</th></tr></thead>
              <tbody>{team.legs.map((lg,i)=>{
                const ath=data.athletes.find(a=>a.id===lg.athleteId);
                return (<tr key={lg.id}>
                  <td style={S.td}>{i+1}</td>
                  <td style={S.td}>{ath?athDisplay(ath):'-'}</td>
                  <td style={{...S.td,fontWeight:600}}>{lg.splitMs!==null?formatTime(lg.splitMs):'-'}</td>
                  <td style={S.td}>{lg.cumMs!==null?formatTime(lg.cumMs):'-'}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>);
        })}
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          {!saved2&&<button style={{...S.btn,...S.btnSuccess,fontSize:14,padding:'10px 24px'}} onClick={handleSave}>Save All Teams</button>}
          <button style={{...S.btn,...S.btnDanger,fontSize:14,padding:'10px 24px'}} onClick={handleReset}>Reset</button>
          {saved2&&<SavedIndicator saved={true} />}
          {saved2&&<button style={{...S.btn,...S.btnPrimary,fontSize:14,padding:'10px 24px'}} onClick={()=>{
            clearInterval(timerRef.current);setRunning(false);setElapsed(0);setSaved2(false);setCollapsed(false);
            setTeams(ts=>ts.map(t=>({...t,activeLeg:0,finished:false,legs:t.legs.map(l=>({...l,splitMs:null,cumMs:null}))})));
            const newSel={};
            teams.forEach((t,i)=>{
              const aids=t.legs.map(l=>l.athleteId).filter(Boolean);
              const hasResult=aids.length>0&&(data.results||[]).some(r=>r.eventId===eventId&&r.meetId===meetId&&r.isRelay&&(r.relayAthletes||[]).join(',')==aids.join(','));
              if(!hasResult) newSel[i]=true;
            });
            setSelectedTeams(newSel);
          }}>Next Heat</button>}
        </div>
      </div>}
    </div>
  );
}
const DEFAULT_FEEDBACK_SECTIONS = [
  { title:'Strengths', body:'' },
  { title:'Areas for Growth', body:'' },
  { title:'Goals for Next Season', body:'' },
];
const DEFAULT_REPORT_OPTIONS = {
  includeTeamSummary: true,
  includeTeamQualifiers: true,
  includeTopPRs: true,
  includeTeamRankings: true,
  rankingsTopN: 5,
  includeTeamScores: false,
  teamScoresGroupByCategory: true,
  includeAthletePages: true,
  includeAthleteSummary: true,
  includeEventTable: true,
  includePerMeetResults: true,
  includeProgression: true,
  includeHighlights: true,
  includeFeedback: true,
  highlights: { mostImproved:true, prCount:true, eventCount:true, qualStds:true, bestPlace:true, meetCount:true },
  enabledStandards: null,
  genderMode: 'all',
};
const getReportStdLabels = (data) => {
  const set = new Set();
  (data.qualifyingStandardTypes||[]).forEach(t=>{
    const subs = t.subtypes||[];
    if(subs.length===0) set.add(t.name);
    else {
      set.add(t.name); // include bare type name too — events may use it
      subs.forEach(s=>set.add(`${t.name} - ${s}`));
    }
  });
  (data.events||[]).forEach(evt=>{
    (evt.qualifyingStandards||[]).forEach(s=>{ if(s && s.name) set.add(s.name.trim()); });
  });
  return Array.from(set).filter(Boolean).sort((a,b)=>a.localeCompare(b));
};
const resolveStdLabel = (data, stdName) => {
  const sn = (stdName||'').trim().toLowerCase();
  if(!sn) return null;
  const types = (data||{}).qualifyingStandardTypes||[];
  for(const t of types) {
    const tn = (t.name||'').trim().toLowerCase();
    if(!tn) continue;
    if(tn===sn && (!t.subtypes || t.subtypes.length===0)) return t.name;
    for(const s of (t.subtypes||[])) {
      const sub = (s||'').trim().toLowerCase();
      if(!sub) continue;
      const dashed = (t.name+' - '+s).trim().toLowerCase();
      const spaced = (t.name+' '+s).trim().toLowerCase();
      if(sn===dashed || sn===spaced) return `${t.name} - ${s}`;
    }
    if(sn===tn && (!t.subtypes || t.subtypes.length===0)) return t.name;
    if(sn.startsWith(tn+' ') || sn.startsWith(tn+'-')) {
      for(const s of (t.subtypes||[])) {
        const sub = (s||'').trim().toLowerCase();
        if(!sub) continue;
        if(sn.includes(sub)) return `${t.name} - ${s}`;
      }
      if(!t.subtypes || t.subtypes.length===0) return t.name;
    }
  }
  return null;
};
const stdEnabled = (data, stdName, enabledMap) => {
  if(!enabledMap) return true;
  const keys = Object.keys(enabledMap);
  if(keys.length===0) return true;
  const raw = (stdName||'').trim();
  if(!raw) return true;
  // 1. Direct match on the raw name as saved on the event
  if(enabledMap[raw] === false) return false;
  if(enabledMap[raw] === true) return true;
  const target = raw.toLowerCase();
  for(const [k, v] of Object.entries(enabledMap)) {
    if((k||'').trim().toLowerCase()===target) return v !== false;
  }
  // 2. Fuzzy resolve to a canonical type+subtype label
  const label = resolveStdLabel(data, stdName);
  if(label && enabledMap[label] === false) return false;
  if(label && enabledMap[label] === true) return true;
  if(label) {
    const lt = label.trim().toLowerCase();
    for(const [k, v] of Object.entries(enabledMap)) {
      if((k||'').trim().toLowerCase()===lt) return v !== false;
    }
  }
  return true;
};
const filterEnabledQuals = (data, quals, enabledMap) => (quals||[]).filter(q=>stdEnabled(data, q.name, enabledMap));
const computeAthleteSeasonStats = (data, events, athleteId, startDate, endDate, enabledStdMap) => {
  const inRange = (d) => (!startDate || d>=startDate) && (!endDate || d<=endDate);
  const allRes = (data.results||[]).filter(r=>!r.isPractice&&inRange(r.date));
  const myIndiv = allRes.filter(r=>r.athleteId===athleteId&&!r.isRelay&&!r.isRelaySplit);
  const myRelays = (()=>{
    const all = allRes.filter(r=>r.isRelay&&(r.relayAthletes||[]).includes(athleteId));
    const best = {};
    all.forEach(r => {
      const k = `${r.eventId}|${r.meetId||''}|${r.date}`;
      const prev = best[k];
      if(!prev) { best[k] = r; return; }
      if(r.verified && !prev.verified) best[k] = r;
    });
    return Object.values(best);
  })();
  const eventIdsSet = new Set([...myIndiv.map(r=>r.eventId), ...myRelays.map(r=>r.eventId)]);
  const meetIds = new Set([...myIndiv.map(r=>r.meetId), ...myRelays.map(r=>r.meetId)].filter(Boolean));
  const eventRows = [];
  let totalPRs = 0;
  const qualByType = {};
  let bestPlace = null;
  [...eventIdsSet].forEach(evtId => {
    const evt = events.find(e=>e.id===evtId);
    if(!evt) return;
    const isField = isFieldEvent(evt);
    const isRly = evt.entryType==='Relay';
    const rs = isRly ? myRelays.filter(r=>r.eventId===evtId) : myIndiv.filter(r=>r.eventId===evtId);
    const sorted = [...rs].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    if(!sorted.length) return;
    const points = sorted.map(r=>{
      const value = isField ? fieldToInches(r.ft||0,r.inch||0,r.qtr||0) : (r.timeMs||0);
      return { date:r.date, day:dateToDay(r.date), value, result:r };
    }).filter(p=>p.value>0);
    if(!points.length) return;
    const best = isField
      ? sorted.reduce((b,r)=>(!b||fieldToInches(r.ft||0,r.inch||0,r.qtr||0)>fieldToInches(b.ft||0,b.inch||0,b.qtr||0))?r:b, null)
      : sorted.reduce((b,r)=>(!b||(r.timeMs||0)<(b.timeMs||0))?r:b, null);
    const first = points[0], last = points[points.length-1];
    let prsForEvent = 0;
    if(!isRly) {
      let bestSoFar = isField ? -Infinity : Infinity;
      sorted.forEach(r=>{
        if(isField) {
          const v = fieldToInches(r.ft||0,r.inch||0,r.qtr||0);
          if(v>bestSoFar){bestSoFar=v;prsForEvent++;}
        } else {
          const v = r.timeMs||0;
          if(v>0 && v<bestSoFar){bestSoFar=v;prsForEvent++;}
        }
      });
      prsForEvent = Math.max(0, prsForEvent-1);
    }
    totalPRs += prsForEvent;
    sorted.forEach(r=>{
      if(r.place) { const p=parseInt(r.place); if(p>0 && (bestPlace===null||p<bestPlace)) bestPlace=p; }
    });
    const qualBest = filterEnabledQuals(data, getAllQualifyingForResult(data, events, {...best}), enabledStdMap);
    qualBest.forEach(q=>{ const key=q.name||'Q'; qualByType[key]=(qualByType[key]||0)+1; });
    const fmt = (v)=> isField ? `${Math.floor(v/12)}'${(v%12).toFixed(1)}"` : formatTime(v);
    const improvement = isField ? (last.value-first.value) : (first.value-last.value);
    eventRows.push({ evt, isField, isRelay:isRly, points, best, first, last, prsForEvent, qualBest, fmt, improvement });
  });
  eventRows.sort((a,b)=>getDefaultOrder(a.evt)-getDefaultOrder(b.evt));
  let mostImproved = null;
  eventRows.forEach(row=>{
    if(row.points.length<2) return;
    const denom = row.isField ? row.first.value : row.first.value;
    if(!denom) return;
    const pct = (row.improvement/denom)*100;
    if(!mostImproved || pct > mostImproved.pct) mostImproved = { row, pct };
  });
  const meetMap = {};
  [...myIndiv, ...myRelays].forEach(r=>{
    if(!r.meetId) return;
    if(!meetMap[r.meetId]) meetMap[r.meetId] = [];
    meetMap[r.meetId].push(r);
  });
  const perMeetResults = Object.entries(meetMap).map(([mid, rs])=>{
    const meet = (data.meets||[]).find(m=>m.id===mid);
    const meetDate = (meet||{}).startDate || (meet||{}).date || (rs[0]||{}).date || '';
    const rows = rs.map(r=>{
      const evt = events.find(e=>e.id===r.eventId);
      if(!evt) return null;
      const isField = isFieldEvent(evt);
      const isRly = !!r.isRelay;
      const mark = isField ? fieldToStr(r.ft||0,r.inch||0,r.qtr||0) : formatTime(r.timeMs||0);
      const quals = filterEnabledQuals(data, getAllQualifyingForResult(data, events, r), enabledStdMap);
      return { evt, isRelay:isRly, mark, place:r.place||'', quals, date:r.date };
    }).filter(Boolean).sort((a,b)=>getDefaultOrder(a.evt)-getDefaultOrder(b.evt));
    return { meet, meetId:mid, date:meetDate, rows };
  }).filter(g=>g.rows.length).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  return { eventRows, totalPRs, totalEvents:eventRows.length, totalMeets:meetIds.size, qualByType, bestPlace, mostImproved, perMeetResults };
};
const computeTeamSeasonStats = (data, events, athleteIds, startDate, endDate, enabledStdMap) => {
  const inRange = (d) => (!startDate || d>=startDate) && (!endDate || d<=endDate);
  const idSet = new Set(athleteIds);
  const allRes = (data.results||[]).filter(r=>!r.isPractice&&inRange(r.date));
  const indiv = allRes.filter(r=>!r.isRelay&&!r.isRelaySplit&&idSet.has(r.athleteId));
  const relays = (()=>{
    const all = allRes.filter(r=>r.isRelay&&(r.relayAthletes||[]).some(a=>idSet.has(a)));
    const best = {};
    all.forEach(r => {
      const k = `${r.eventId}|${r.meetId||''}|${r.date}`;
      const prev = best[k];
      if(!prev) { best[k] = r; return; }
      if(r.verified && !prev.verified) best[k] = r;
    });
    return Object.values(best);
  })();
  const meetIds = new Set([...indiv.map(r=>r.meetId), ...relays.map(r=>r.meetId)].filter(Boolean));
  const prsByAthlete = {};
  athleteIds.forEach(aid=>{prsByAthlete[aid]=0;});
  const eventIdsForAthlete = {};
  indiv.forEach(r=>{
    if(!eventIdsForAthlete[r.athleteId]) eventIdsForAthlete[r.athleteId]={};
    if(!eventIdsForAthlete[r.athleteId][r.eventId]) eventIdsForAthlete[r.athleteId][r.eventId]=[];
    eventIdsForAthlete[r.athleteId][r.eventId].push(r);
  });
  Object.entries(eventIdsForAthlete).forEach(([aid,byEvt])=>{
    Object.entries(byEvt).forEach(([eid,rs])=>{
      const evt = events.find(e=>e.id===eid);
      if(!evt) return;
      const isField = isFieldEvent(evt);
      const sorted = [...rs].sort((a,b)=>(a.date||'').localeCompare(b.date||''));
      let bestSoFar = isField ? -Infinity : Infinity;
      let prs=0;
      sorted.forEach(r=>{
        if(isField) {const v=fieldToInches(r.ft||0,r.inch||0,r.qtr||0); if(v>bestSoFar){bestSoFar=v;prs++;}}
        else {const v=r.timeMs||0; if(v>0&&v<bestSoFar){bestSoFar=v;prs++;}}
      });
      prsByAthlete[aid] = (prsByAthlete[aid]||0) + Math.max(0,prs-1);
    });
  });
  const qualifiersByStd = {};
  indiv.forEach(r=>{
    const qs = filterEnabledQuals(data, getAllQualifyingForResult(data, events, r), enabledStdMap);
    qs.forEach(q=>{
      const k = q.name||'Q';
      qualifiersByStd[k] = qualifiersByStd[k] || new Set();
      qualifiersByStd[k].add(r.athleteId);
    });
  });
  relays.forEach(r=>{
    const qs = filterEnabledQuals(data, getAllQualifyingForResult(data, events, {...r,timeMs:r.timeMs}), enabledStdMap);
    qs.forEach(q=>{
      const k = q.name||'Q';
      qualifiersByStd[k] = qualifiersByStd[k] || new Set();
      qualifiersByStd[k].add('relay:'+r.id);
    });
  });
  const qualifiersCount = {};
  Object.entries(qualifiersByStd).forEach(([k,s])=>{qualifiersCount[k]=s.size;});
  return { totalMeets:meetIds.size, totalResults: indiv.length+relays.length, totalPRs:Object.values(prsByAthlete).reduce((a,b)=>a+b,0), qualifiersCount, prsByAthlete };
};
const computeTeamRankings = (data, events, athleteIds, startDate, endDate) => {
  const inRange = (d) => (!startDate || d>=startDate) && (!endDate || d<=endDate);
  const idSet = new Set(athleteIds);
  const all = (data.results||[]).filter(r => !r.isPractice && inRange(r.date));
  const indiv = all.filter(r => !r.isRelay && !r.isRelaySplit && r.athleteId && idSet.has(r.athleteId));
  const byEvent = {};
  indiv.forEach(r => { (byEvent[r.eventId] = byEvent[r.eventId] || []).push(r); });
  const rankings = [];
  events.forEach(evt => {
    if(evt.entryType === 'Relay') return;
    const rows = byEvent[evt.id];
    if(!rows || !rows.length) return;
    const isField = isFieldEvent(evt);
    const bestByAth = {};
    rows.forEach(r => {
      const cur = bestByAth[r.athleteId];
      if(!cur) { bestByAth[r.athleteId] = r; return; }
      if(isField) {
        if(((r.ft||0)*12+(r.inch||0)+(r.qtr||0)) > ((cur.ft||0)*12+(cur.inch||0)+(cur.qtr||0))) bestByAth[r.athleteId] = r;
      } else {
        if((r.timeMs||Infinity) < (cur.timeMs||Infinity)) bestByAth[r.athleteId] = r;
      }
    });
    const list = Object.values(bestByAth).sort((a,b) => isField
      ? ((b.ft||0)*12+(b.inch||0)+(b.qtr||0)) - ((a.ft||0)*12+(a.inch||0)+(a.qtr||0))
      : (a.timeMs||Infinity) - (b.timeMs||Infinity)
    );
    rankings.push({ evt, isField, isRelay:false, list });
  });
  const relayRaw = all.filter(r => r.isRelay && (r.relayAthletes||[]).some(a=>idSet.has(a)));
  const relayBest = {};
  relayRaw.forEach(r => {
    const k = `${r.eventId}|${r.meetId||''}|${r.date}`;
    const cur = relayBest[k];
    if(!cur || (r.verified && !cur.verified)) relayBest[k] = r;
  });
  const relaysByEvt = {};
  Object.values(relayBest).forEach(r => { (relaysByEvt[r.eventId] = relaysByEvt[r.eventId] || []).push(r); });
  Object.entries(relaysByEvt).forEach(([eid, list]) => {
    const evt = events.find(e=>e.id===eid);
    if(!evt) return;
    list.sort((a,b)=>(a.timeMs||Infinity)-(b.timeMs||Infinity));
    rankings.push({ evt, isField:false, isRelay:true, list });
  });
  rankings.sort((a,b) => getDefaultOrder(a.evt) - getDefaultOrder(b.evt));
  return rankings;
};
const buildSeasonReportHTML = (data, events, season, team, athletes, options, feedbackByAth) => {
  const start = options.startDate || (season||{}).startDate || '';
  const end = options.endDate || (season||{}).endDate || '';
  const _teamPrimary = (((team||{}).colors||{}).primary) || '#c96a1f';
  const _teamSecondary = (((team||{}).colors||{}).secondary) || '#2b6cb0';
  const primary = _teamPrimary;
  const secondary = _teamSecondary;
  const schoolLine = (team||{}).name || 'Team';
  const seasonLine = (season||{}).name || 'Season Report';
  const titleLine = `${schoolLine} — ${seasonLine}`;
  const subLine = `${start||'(beginning)'} → ${end||'(today)'}  ·  ${athletes.length} athlete${athletes.length!==1?'s':''}`;
  const css = `<style>
    @page{size:portrait;margin:0.45in}
    *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
    html,body{background:#eef0f3}
    body{font-family:'Inter','Helvetica Neue',-apple-system,Helvetica,Arial,sans-serif;color:#1a1f2b;margin:0;font-size:11px;line-height:1.45}
    .page-wrap{max-width:7.5in;margin:24px auto;padding:0.45in;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.08);box-sizing:border-box}
    @media print{html,body{background:#fff}.page-wrap{max-width:none;margin:0;padding:0;box-shadow:none;background:transparent}}
    .report-head{position:relative;overflow:hidden;padding:18px 22px;margin:0 0 16px;border-radius:10px;background:${primary};color:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.08);display:flex;align-items:center;gap:18px}
    .report-head .head-text{flex:1;min-width:0}
    .report-head .head-logo{flex:0 0 auto;width:96px;height:96px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;padding:9px;box-sizing:border-box;box-shadow:0 2px 6px rgba(0,0,0,0.18)}
    .report-head .head-logo img{max-width:100%;max-height:100%;object-fit:contain;border-radius:50%}
    .report-head h1{position:relative;font-size:22px;margin:0;font-weight:800;letter-spacing:-0.015em;color:#fff;line-height:1.1}
    .report-head .season{position:relative;font-size:14px;font-weight:600;color:rgba(255,255,255,0.95);letter-spacing:0.01em;margin-top:2px}
    .report-head .sub{position:relative;font-size:12px;color:rgba(255,255,255,0.88);letter-spacing:0.01em;margin-top:6px}
    h2{font-size:14px;margin:18px 0 8px;color:${primary};text-transform:uppercase;letter-spacing:0.08em;font-weight:800;display:flex;align-items:center;gap:8px}
    h2::before{content:'';display:inline-block;width:6px;height:18px;background:${primary};border-radius:2px}
    h3{font-size:11px;margin:10px 0 4px;color:#555;font-weight:700;text-transform:uppercase;letter-spacing:0.04em}
    .tiles{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
    .tile{flex:1;min-width:96px;border:1px solid #e0e4ea;border-radius:10px;padding:10px 12px;text-align:center;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
    .tile .v{font-size:24px;font-weight:800;color:${primary};line-height:1.0;letter-spacing:-0.02em}
    .tile .l{font-size:9px;color:#788396;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;margin-top:4px}
    table{width:100%;border-collapse:collapse;margin-bottom:4px}
    thead th{text-align:left;font-size:9px;color:#5b6577;text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${primary}30;padding:5px 8px;background:#f7f9fc;font-weight:700}
    tbody td{padding:5px 8px;border-bottom:1px solid #eef0f4;font-size:11px;vertical-align:middle}
    tbody tr:nth-child(even) td{background:#fafbfd}
    .athlete-page{page-break-before:always;padding-top:6px}
    .team-page{page-break-after:always}
    .ath-header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${primary};padding-bottom:6px;margin-bottom:10px}
    .ath-header .name{font-size:22px;font-weight:800;letter-spacing:-0.015em}
    .ath-header .meta{font-size:10px;color:#666}
    .badges{display:flex;gap:4px;flex-wrap:wrap;margin-top:3px}
    .badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:8px;background:${primary}15;color:${primary};border:1px solid ${primary}}
    .highlight{background:#fff7e6;border-left:4px solid ${secondary};padding:7px 11px;margin:5px 0;font-size:11px;border-radius:0 4px 4px 0}
    .feedback-section{margin-top:10px;page-break-inside:avoid}
    .feedback-section .ft{font-weight:800;font-size:11px;color:${primary};border-bottom:1px solid ${primary}40;padding-bottom:3px;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.06em}
    .feedback-section .fb{font-size:11px;white-space:pre-wrap;line-height:1.55;min-height:30px;color:#2a3242}
    .chart-row{display:flex;justify-content:space-between;align-items:center;gap:8px;page-break-inside:avoid;margin:4px 0}
    .chart-label{font-size:10px;font-weight:700;width:120px;color:#444}
    .rank-evt{margin-bottom:10px;page-break-inside:avoid;border:1px solid #e0e4ea;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
    .rank-evt .rh{background:${primary};color:#fff;padding:6px 12px;font-size:11px;font-weight:700;display:flex;justify-content:space-between;align-items:center;border-left:5px solid ${secondary}}
    .rank-evt .rh .sub{font-size:9px;font-weight:500;opacity:0.85;letter-spacing:0.02em}
    .rank-evt table{margin:0}
    .rank-evt .rk{width:24px;text-align:center;color:#788396;font-weight:800;font-size:11px}
    .rank-evt .rk-1{color:#b8860b}
    .qual-card{margin-bottom:10px;page-break-inside:avoid;border:1px solid #e0e4ea;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
    .qual-card .qual-h{background:${primary};color:#fff;padding:6px 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;display:flex;justify-content:space-between;align-items:center;border-left:5px solid ${secondary}}
    .qual-card .qual-n{background:rgba(255,255,255,0.25);padding:1px 8px;border-radius:10px;font-size:10px}
    .toppr{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}
    .toppr-row{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#fff;border:1px solid #e0e4ea;border-left-width:5px;border-radius:8px;page-break-inside:avoid}
    .toppr-1{border-left-color:#d4a017;background:linear-gradient(90deg,#fff8e0 0%,#fff 50%)}
    .toppr-2{border-left-color:#a3a8b0;background:linear-gradient(90deg,#f1f3f7 0%,#fff 50%)}
    .toppr-3{border-left-color:#b87333;background:linear-gradient(90deg,#fbe9d8 0%,#fff 50%)}
    .toppr-rk{font-size:20px;font-weight:800;color:#2a3242;min-width:24px;text-align:center}
    .toppr-body{flex:1;min-width:0}
    .toppr-name{font-size:13px;font-weight:700;color:#1a1f2b}
    .toppr-sub{font-size:10px;color:#5b6577}
    .toppr-pct{font-size:18px;font-weight:800;color:${primary};white-space:nowrap}
    .ts-cat{font-size:13px;font-weight:800;color:${primary};margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid ${primary}40;padding-bottom:3px}
    .ts-meet{margin-bottom:12px;border:1px solid #e0e4ea;border-radius:8px;overflow:hidden;page-break-inside:avoid;box-shadow:0 1px 2px rgba(0,0,0,0.03)}
    .ts-meet-h{background:${primary};color:#fff;padding:5px 12px;font-size:11px;font-weight:700;display:flex;justify-content:space-between;align-items:center;border-left:5px solid ${secondary}}
    .ts-meet-name{font-weight:800;font-size:12px}
    .ts-tag{display:inline-block;font-size:9px;font-weight:700;padding:1px 7px;border-radius:9px;background:rgba(255,255,255,0.22);color:#fff;border:1px solid rgba(255,255,255,0.4);margin-left:6px;text-transform:uppercase;letter-spacing:0.04em;vertical-align:middle}
    .ts-meet-date{font-size:10px;opacity:0.85}
    .ts-side{padding:0}
    .ts-side + .ts-side{border-top:1px solid #e0e4ea}
    .ts-side-h{padding:5px 12px;background:#f4f6fa;font-size:10px;font-weight:700;color:#2a3242;text-transform:uppercase;letter-spacing:0.05em;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
    .ts-self{font-size:10px;font-weight:700;color:${primary};text-transform:none;letter-spacing:0}
    .ts-self-row td{background:#fff8e0!important;font-weight:700}
    @media print{body{margin:0}}
  </style>`;

  const enabledStdMap = options.enabledStandards || null;
  const teamLogo = (team||{}).logo;
  const logoBlock = teamLogo ? `<div class="head-logo"><img src="${esc(teamLogo)}" alt=""></div>` : '';
  let body = `<div class="report-head"><div class="head-text"><h1 class="school">${esc(schoolLine)}</h1><div class="season">${esc(seasonLine)}</div><div class="sub">${esc(subLine)}</div></div>${logoBlock}</div>`;

  const fmtField = (r) => {
    const totalIn = (r.ft||0)*12 + (r.inch||0) + (r.qtr||0);
    const ft = Math.floor(totalIn/12);
    const inches = totalIn - ft*12;
    return `${ft}'${inches.toFixed(2)}"`;
  };
  const valOf = (r, isField) => isField ? ((r.ft||0)*12+(r.inch||0)+(r.qtr||0)) : (r.timeMs||0);
  const fmtVal = (r, isField) => isField ? fmtField(r) : formatTime(r.timeMs||0);

  const computeTopPRsByPct = (subset) => {
    const inRange = (d) => (!start || d>=start) && (!end || d<=end);
    const buckets = { Track: [], Field: [] };
    subset.forEach(a => {
      const rs = (data.results||[]).filter(r => r.athleteId===a.id && inRange(r.date) && !r.isPractice && !r.isRelay && !r.isRelaySplit);
      const byEvent = {};
      rs.forEach(r => { (byEvent[r.eventId] = byEvent[r.eventId] || []).push(r); });
      Object.entries(byEvent).forEach(([eid, list]) => {
        const evt = events.find(e=>e.id===eid);
        if(!evt) return;
        const isField = isFieldEvent(evt);
        const sorted = [...list].sort((x,y)=>(x.date||'').localeCompare(y.date||''));
        const first = sorted[0];
        const best = isField
          ? sorted.reduce((bb,r)=>(valOf(r,true)>valOf(bb,true)?r:bb), sorted[0])
          : sorted.reduce((bb,r)=>((r.timeMs||Infinity)<(bb.timeMs||Infinity)?r:bb), sorted[0]);
        if(!first || !best || first===best) return;
        const firstVal = valOf(first, isField);
        const bestVal = valOf(best, isField);
        if(!firstVal || !bestVal) return;
        const pct = isField ? ((bestVal-firstVal)/firstVal)*100 : ((firstVal-bestVal)/firstVal)*100;
        if(pct <= 0) return;
        buckets[isField?'Field':'Track'].push({ athlete:a, evt, first, best, pct, isField });
      });
    });
    Object.values(buckets).forEach(b => b.sort((x,y)=>y.pct-x.pct));
    return buckets;
  };

  const renderTeamSection = (subset, labelPrefix) => {
    const teamStats = computeTeamSeasonStats(data, events, subset.map(a=>a.id), start, end, enabledStdMap);
    const heading = (txt) => `<h2>${labelPrefix?esc(labelPrefix)+' · ':''}${esc(txt)}</h2>`;

    if(options.includeTeamSummary) {
      body += heading('Team Summary');
      body += '<div class="tiles">';
      body += `<div class="tile"><div class="v">${subset.length}</div><div class="l">Athletes</div></div>`;
      body += `<div class="tile"><div class="v">${teamStats.totalMeets}</div><div class="l">Meets</div></div>`;
      body += `<div class="tile"><div class="v">${teamStats.totalResults}</div><div class="l">Results</div></div>`;
      body += `<div class="tile"><div class="v">${teamStats.totalPRs}</div><div class="l">PRs Set</div></div>`;
      body += `<div class="tile"><div class="v">${Object.values(teamStats.qualifiersCount).reduce((a,b)=>a+b,0)}</div><div class="l">Qual. Marks</div></div>`;
      body += '</div>';
    }

    if(options.includeTeamQualifiers) {
      const inRange = (d) => (!start || d>=start) && (!end || d<=end);
      const subsetIds = new Set(subset.map(a=>a.id));
      const groups = {}; // stdName -> list of {athlete, evt, mark, meetObj, date, isField, isRelay}
      (data.results||[]).forEach(r => {
        if(r.isPractice || !inRange(r.date)) return;
        const evt = events.find(e=>e.id===r.eventId);
        if(!evt) return;
        const isField = isFieldEvent(evt);
        const isRelay = !!r.isRelay;
        const involvedAthletes = isRelay ? (r.relayAthletes||[]).filter(id=>subsetIds.has(id)) : (subsetIds.has(r.athleteId) ? [r.athleteId] : []);
        if(!involvedAthletes.length) return;
        const quals = filterEnabledQuals(data, getAllQualifyingForResult(data, events, r), enabledStdMap);
        if(!quals.length) return;
        const meetObj = r.meetId ? (data.meets||[]).find(m=>m.id===r.meetId) : null;
        quals.forEach(q => {
          const key = q.name || 'Qualifying';
          if(!groups[key]) groups[key] = [];
          if(isRelay) {
            const names = (r.relayAthletes||[]).map(aid => { const a=(data.athletes||[]).find(x=>x.id===aid); return a?athDisplay(a):'?'; }).join(', ');
            groups[key].push({ name:names, evt, mark:formatTime(r.timeMs||0), meetObj, date:r.date, isRelay:true });
          } else {
            const a = (data.athletes||[]).find(x=>x.id===r.athleteId);
            groups[key].push({ name:a?athDisplay(a):'?', gradYear:(a||{}).gradYear, evt, mark: isField ? fmtField(r) : formatTime(r.timeMs||0), meetObj, date:r.date, isRelay:false });
          }
        });
      });
      const stdNames = Object.keys(groups).sort();
      if(stdNames.length) {
        body += heading('Qualifying Achievements');
        stdNames.forEach(name => {
          const list = groups[name];
          const unique = {};
          list.forEach(item => {
            const k = `${item.name}|${item.evt.id}`;
            if(!unique[k]) unique[k] = item;
          });
          const items = Object.values(unique).sort((a,b)=>getDefaultOrder(a.evt)-getDefaultOrder(b.evt));
          body += '<div class="qual-card">';
          body += `<div class="qual-h">${esc(name)} <span class="qual-n">${items.length}</span></div>`;
          body += '<table><thead><tr><th>Athlete</th><th>Event</th><th style="text-align:right">Mark</th><th>Meet</th><th>Date</th></tr></thead><tbody>';
          items.forEach(it => {
            const gradStr = it.gradYear ? ` <span style="color:#999;font-weight:500;font-size:10px">'${(it.gradYear+'').slice(-2)}</span>` : '';
            body += `<tr><td>${esc(it.name)}${gradStr}${it.isRelay?' <span style="color:#6b46c1;font-size:9px;font-weight:600">RELAY</span>':''}</td><td>${esc(getEventLabel(it.evt))}</td><td style="text-align:right;font-weight:700">${esc(it.mark)}</td><td>${esc((it.meetObj||{}).name||'')}</td><td style="color:#777">${esc(it.date||'')}</td></tr>`;
          });
          body += '</tbody></table></div>';
        });
      }
    }

    if(options.includeTopPRs) {
      const top = computeTopPRsByPct(subset);
      const sections = [['Track','Top PRs — Track (% improvement)', top.Track],['Field','Top PRs — Field (% improvement)', top.Field]];
      sections.forEach(([_, title, list]) => {
        if(!list.length) return;
        body += heading(title);
        body += '<div class="toppr">';
        list.slice(0,3).forEach((row,i) => {
          const grad = row.athlete.gradYear ? ` '${(row.athlete.gradYear+'').slice(-2)}` : '';
          body += `<div class="toppr-row toppr-${i+1}"><div class="toppr-rk">${i+1}</div><div class="toppr-body"><div class="toppr-name">${esc(athDisplay(row.athlete))}<span style="color:#888;font-weight:500;font-size:10px">${esc(grad)}</span></div><div class="toppr-sub">${esc(getEventLabel(row.evt))} · ${esc(fmtVal(row.first,row.isField))} → ${esc(fmtVal(row.best,row.isField))}</div></div><div class="toppr-pct">${row.pct.toFixed(2)}%</div></div>`;
        });
        body += '</div>';
      });
    }

    if(options.includeTeamRankings) {
      const topN = Math.max(1, Math.min(50, parseInt(options.rankingsTopN)||5));
      const rankings = computeTeamRankings(data, events, subset.map(a=>a.id), start, end);
      if(rankings.length) {
        body += heading('Ranked Performances by Event');
        rankings.forEach(({evt, isField, isRelay, list}) => {
          const topList = list.slice(0, topN);
          if(!topList.length) return;
          body += '<div class="rank-evt">';
          const sub = evt.gender ? (evt.gender==='Boy'?'Boys':evt.gender==='Girl'?'Girls':evt.gender) : '';
          body += `<div class="rh"><span>${esc(getEventLabel(evt))}</span><span class="sub">${sub?esc(sub):''}${isRelay?' · Relay':''} · ${list.length} entr${list.length===1?'y':'ies'}</span></div>`;
          body += '<table><thead><tr><th class="rk">#</th><th>Athlete</th><th style="text-align:right">Mark</th><th>Meet</th><th>Date</th></tr></thead><tbody>';
          topList.forEach((r,i) => {
            let nameStr;
            if(isRelay) {
              const names = (r.relayAthletes||[]).map(aid=>{const a=(data.athletes||[]).find(x=>x.id===aid);return a?athDisplay(a):'?';}).join(', ');
              nameStr = names || 'Relay';
            } else {
              const a = (data.athletes||[]).find(x=>x.id===r.athleteId);
              nameStr = a ? athDisplay(a) + (a.gradYear?` <span style="color:#888;font-weight:500;font-size:10px">'${(a.gradYear+'').slice(-2)}</span>`:'') : '?';
            }
            const meetObj = r.meetId ? (data.meets||[]).find(m=>m.id===r.meetId) : null;
            body += `<tr><td class="rk ${i===0?'rk-1':''}">${i+1}</td><td>${nameStr}</td><td style="text-align:right;font-weight:700">${esc(fmtVal(r,isField))}</td><td>${esc((meetObj||{}).name||'')}</td><td style="color:#777">${esc(r.date||'')}</td></tr>`;
          });
          body += '</tbody></table></div>';
        });
      }
    }
  };

  const renderTeamScoresSection = () => {
    const meetsAll = (data.meets||[]).filter(m => {
      const ts = m.teamScores;
      if(!ts) return false;
      const hasAny = ((ts.boys||[]).length || (ts.girls||[]).length || (ts.combined||[]).length);
      if(!hasAny) return false;
      const d = m.startDate || m.date;
      if(start && d && d < start) return false;
      if(end && d && d > end) return false;
      return true;
    });
    if(!meetsAll.length) return;
    const opponents = getOpponents(data);
    const oppLabel = (id) => {
      if(id === 'self') return (team && (team.school||team.name)) || 'Our Team';
      const o = opponents.find(x=>x.id===id);
      return o ? o.name : '(removed)';
    };
    const ordinal = (n) => { if(!n||isNaN(n)) return ''; const s=['th','st','nd','rd'],v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); };
    const dimensions = getOpponentDimensions(data);
    const meetAllRows = (m) => [...((m.teamScores||{}).boys||[]),...((m.teamScores||{}).girls||[]),...((m.teamScores||{}).combined||[])];
    const meetValuesInDimension = (m, dimension) => {
      const seen = new Set();
      const out = [];
      meetAllRows(m).forEach(r => {
        if(!r.opponentId || r.opponentId === 'self') return;
        const o = opponents.find(x=>x.id===r.opponentId);
        if(!o || !o.dimensionValues) return;
        const vid = o.dimensionValues[dimension.id];
        if(!vid || seen.has(vid)) return;
        const v = (dimension.values||[]).find(x=>x.id===vid);
        if(v) { seen.add(vid); out.push(v); }
      });
      return out;
    };
    const meetGroupsByTag = (m) => Array.from(new Set((m.tags||[]).filter(Boolean)));
    const renderMeetBlock = (m) => {
      const ts = m.teamScores || {};
      const mode = ts.mode || 'split';
      const sides = [];
      if(mode === 'split') {
        if((ts.boys||[]).length) sides.push({label:'Boys', rows:ts.boys});
        if((ts.girls||[]).length) sides.push({label:'Girls', rows:ts.girls});
      } else {
        if((ts.combined||[]).length) sides.push({label:'Combined', rows:ts.combined});
      }
      if(!sides.length) return '';
      let html = '<div class="ts-meet">';
      const tagsHtml = (m.tags||[]).filter(Boolean).map(t=>`<span class="ts-tag">${esc(t)}</span>`).join('');
      html += `<div class="ts-meet-h"><span class="ts-meet-name">${esc(m.name||'(unnamed meet)')}${tagsHtml?` ${tagsHtml}`:''}</span><span class="ts-meet-date">${esc(m.startDate||m.date||'')}</span></div>`;
      sides.forEach(({label, rows}) => {
        const sorted = [...rows].sort((a,b)=>{const pa=parseInt(a.place)||999,pb=parseInt(b.place)||999;return pa-pb;});
        const selfRow = sorted.find(r=>r.opponentId==='self');
        const total = sorted.length;
        const selfSummary = selfRow && selfRow.place ? `<span class="ts-self">${esc((team&&(team.school||team.name))||'Our Team')}: ${ordinal(parseInt(selfRow.place))} of ${total}${selfRow.points!==''&&selfRow.points!=null?` (${selfRow.points} pts)`:''}</span>` : '';
        html += `<div class="ts-side"><div class="ts-side-h"><span>${esc(label)}</span>${selfSummary}</div>`;
        html += '<table><thead><tr><th class="rk" style="width:30px;text-align:center">#</th><th>Team</th><th style="text-align:right;width:80px">Points</th></tr></thead><tbody>';
        sorted.forEach(r => {
          const isSelf = r.opponentId === 'self';
          html += `<tr${isSelf?' class="ts-self-row"':''}><td class="rk" style="text-align:center">${r.place||'-'}</td><td>${esc(oppLabel(r.opponentId))}</td><td style="text-align:right;font-weight:700">${r.points!==''&&r.points!=null?esc(String(r.points)):'-'}</td></tr>`;
        });
        html += '</tbody></table></div>';
      });
      html += '</div>';
      return html;
    };
    body += '<h2>Team Scores</h2>';
    const groupAxis = options.teamScoresGroupByCategory ? (options.teamScoresGroupBy || 'tag') : null;
    const byDate = (a,b) => (a.startDate||'').localeCompare(b.startDate||'');
    const dimById = (did) => dimensions.find(d=>d.id===did);
    if(groupAxis && groupAxis !== 'tag' && dimById(groupAxis)) {
      const dim = dimById(groupAxis);
      const groups = {};
      const ungrouped = [];
      meetsAll.forEach(m => {
        const vs = meetValuesInDimension(m, dim);
        if(!vs.length) { ungrouped.push(m); return; }
        vs.forEach(v => { (groups[v.id] = groups[v.id] || {value:v, meets:[]}).meets.push(m); });
      });
      Object.values(groups).sort((a,b)=>a.value.name.localeCompare(b.value.name)).forEach(({value, meets}) => {
        body += `<div class="ts-cat">${esc(dim.name)}: ${esc(value.name)}</div>`;
        meets.sort(byDate);
        meets.forEach(m => { body += renderMeetBlock(m); });
      });
      if(ungrouped.length) {
        body += `<div class="ts-cat">No ${esc(dim.name)}</div>`;
        ungrouped.sort(byDate);
        ungrouped.forEach(m => { body += renderMeetBlock(m); });
      }
    } else if(groupAxis === 'tag') {
      const groups = {};
      const untagged = [];
      meetsAll.forEach(m => {
        const tags = meetGroupsByTag(m);
        if(!tags.length) { untagged.push(m); return; }
        tags.forEach(t => { (groups[t] = groups[t] || []).push(m); });
      });
      Object.keys(groups).sort((a,b)=>a.localeCompare(b)).forEach(t => {
        body += `<div class="ts-cat">${esc(t)}</div>`;
        groups[t].sort(byDate);
        groups[t].forEach(m => { body += renderMeetBlock(m); });
      });
      if(untagged.length) {
        body += `<div class="ts-cat">Untagged</div>`;
        untagged.sort(byDate);
        untagged.forEach(m => { body += renderMeetBlock(m); });
      }
    } else {
      [...meetsAll].sort(byDate).forEach(m => { body += renderMeetBlock(m); });
    }
  };

  const hasTeamSection = options.includeTeamSummary||options.includeTeamQualifiers||options.includeTopPRs||options.includeTeamRankings||options.includeTeamScores;
  if(hasTeamSection) {
    body += '<div class="team-page">';
    const gm = options.genderMode || 'all';
    if(gm === 'split') {
      const boys = athletes.filter(a=>a.gender==='M');
      const girls = athletes.filter(a=>a.gender==='F');
      if(boys.length) renderTeamSection(boys, 'Boys');
      if(girls.length) renderTeamSection(girls, 'Girls');
      const other = athletes.filter(a=>a.gender!=='M'&&a.gender!=='F');
      if(other.length) renderTeamSection(other, 'Other');
    } else {
      renderTeamSection(athletes, '');
    }
    if(options.includeTeamScores) renderTeamScoresSection();
    body += '</div>';
  }

  if(options.includeAthletePages) {
    athletes.forEach(a=>{
      const stats = computeAthleteSeasonStats(data, events, a.id, start, end, enabledStdMap);
      const fb = (feedbackByAth||{})[a.id] || { sections: DEFAULT_FEEDBACK_SECTIONS };
      body += '<div class="athlete-page">';
      body += '<div class="ath-header"><div>';
      body += `<div class="name">${esc(athDisplay(a))}</div>`;
      body += `<div class="meta">${a.gradYear?`Class of ${a.gradYear}`:''}${a.gender?(a.gradYear?' · ':'')+(a.gender==='M'?'Boys':'Girls'):''}</div>`;
      body += '</div></div>';

      if(options.includeAthleteSummary) {
        body += '<div class="tiles">';
        body += `<div class="tile"><div class="v">${stats.totalEvents}</div><div class="l">Events</div></div>`;
        body += `<div class="tile"><div class="v">${stats.totalMeets}</div><div class="l">Meets</div></div>`;
        body += `<div class="tile"><div class="v">${stats.totalPRs}</div><div class="l">PRs</div></div>`;
        body += `<div class="tile"><div class="v">${Object.values(stats.qualByType).reduce((s,n)=>s+n,0)}</div><div class="l">Qual. Marks</div></div>`;
        body += `<div class="tile"><div class="v">${stats.bestPlace||'—'}</div><div class="l">Best Place</div></div>`;
        body += '</div>';
      }

      if(options.includeHighlights) {
        const h = options.highlights||{};
        const lines = [];
        if(h.mostImproved && stats.mostImproved && stats.mostImproved.pct>0) {
          const r = stats.mostImproved.row;
          lines.push(`<strong>Most improved:</strong> ${esc(getEventLabel(r.evt))} — from ${esc(r.fmt(r.first.value))} to ${esc(r.fmt(r.last.value))} (${stats.mostImproved.pct.toFixed(1)}%)`);
        }
        if(h.prCount && stats.totalPRs>0) lines.push(`<strong>Personal records:</strong> ${stats.totalPRs} set this season`);
        if(h.eventCount && stats.totalEvents>0) lines.push(`<strong>Events contested:</strong> ${stats.totalEvents}`);
        if(h.meetCount && stats.totalMeets>0) lines.push(`<strong>Meets competed:</strong> ${stats.totalMeets}`);
        if(h.qualStds && Object.keys(stats.qualByType).length) {
          const parts = Object.entries(stats.qualByType).map(([k,v])=>`${esc(k)} ×${v}`);
          lines.push(`<strong>Qualifying marks:</strong> ${parts.join(', ')}`);
        }
        if(h.bestPlace && stats.bestPlace) lines.push(`<strong>Best finish:</strong> ${stats.bestPlace}${stats.bestPlace===1?'st':stats.bestPlace===2?'nd':stats.bestPlace===3?'rd':'th'}`);
        if(lines.length) {
          body += '<h3>Season Highlights</h3>';
          lines.forEach(l=>{body += `<div class="highlight">${l}</div>`;});
        }
      }

      if(options.includeEventTable && stats.eventRows.length) {
        body += '<h3>By Event</h3>';
        body += '<table><thead><tr><th>Event</th><th># Results</th><th>Season Best</th><th>First</th><th>Latest</th><th>Change</th><th>Qualifying</th></tr></thead><tbody>';
        stats.eventRows.forEach(r=>{
          const change = r.points.length>=2 ? (r.isField ? `+${esc(r.fmt(Math.max(0,r.last.value-r.first.value)))}` : (r.last.value<=r.first.value ? `-${esc(formatTime(r.first.value-r.last.value))}` : `+${esc(formatTime(r.last.value-r.first.value))}`)) : '—';
          const bestStr = r.isField ? fieldToStr(r.best.ft||0,r.best.inch||0,r.best.qtr||0) : formatTime(r.best.timeMs||0);
          const quals = r.qualBest.map(q=>`<span class="badge">${esc(q.name||'Q')}</span>`).join(' ');
          body += `<tr><td><strong>${esc(getEventLabel(r.evt))}</strong>${r.isRelay?' <em style="font-size:9px;color:#888">(relay)</em>':''}</td><td>${r.points.length}</td><td><strong>${esc(bestStr)}</strong></td><td>${esc(r.fmt(r.first.value))}</td><td>${esc(r.fmt(r.last.value))}</td><td>${change}</td><td>${quals||'—'}</td></tr>`;
        });
        body += '</tbody></table>';
      }

      if(options.includePerMeetResults && (stats.perMeetResults||[]).length) {
        body += '<h3>Meet-by-Meet Results</h3>';
        stats.perMeetResults.forEach(g=>{
          const meetName = g.meet ? g.meet.name : 'Meet';
          const meetSub = [g.meet && g.meet.venue, g.meet && (g.meet.city||g.meet.state)].filter(Boolean).join(' · ');
          body += `<div style="page-break-inside:avoid;margin-bottom:6px">`;
          body += `<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #999;padding-bottom:1px;margin-bottom:3px"><span style="font-weight:700;font-size:11px">${esc(meetName)}</span><span style="font-size:9px;color:#666">${esc(g.date||'')}${meetSub?' · '+esc(meetSub):''}</span></div>`;
          body += '<table><thead><tr><th>Event</th><th>Mark</th><th style="width:50px">Place</th><th>Notes</th></tr></thead><tbody>';
          g.rows.forEach(r=>{
            const badges = (r.quals||[]).map(q=>`<span class="badge">${esc(q.name||'Q')}</span>`).join(' ');
            const lbl = `${esc(getEventLabel(r.evt))}${r.isRelay?' <em style="font-size:9px;color:#888">(relay)</em>':''}`;
            body += `<tr><td>${lbl}</td><td><strong>${esc(r.mark)}</strong></td><td>${esc(r.place)}</td><td>${badges}</td></tr>`;
          });
          body += '</tbody></table></div>';
        });
      }

      if(options.includeProgression) {
        const eligible = stats.eventRows.filter(r=>r.points.length>=2);
        if(eligible.length) {
          body += '<h3>Progression</h3>';
          eligible.forEach(r=>{
            const fmt = r.isField ? (v)=>`${Math.floor(v/12)}'${(v%12).toFixed(1)}"` : (v)=>formatTime(v);
            const svg = makeProgressionSVG(r.points, { width:540, height:140, formatY:fmt });
            body += `<div class="chart-row"><div class="chart-label">${esc(getEventLabel(r.evt))}</div>${svg}</div>`;
          });
        }
      }

      if(options.includeFeedback) {
        (fb.sections||[]).forEach(sec=>{
          if(!sec.title && !sec.body) return;
          body += `<div class="feedback-section"><div class="ft">${esc(sec.title||'')}</div><div class="fb">${esc(sec.body||'')}</div></div>`;
        });
      }
      body += '</div>';
    });
  }
  return `<!DOCTYPE html><html><head><title>${esc(titleLine)}</title>${css}</head><body><div class="page-wrap">${body}</div></body></html>`;
};
const openSeasonReport = (data, events, season, team, athletes, options, feedbackByAth) => {
  const w = window.open('','_blank','width=1000,height=800');
  if(!w) return;
  const html = buildSeasonReportHTML(data, events, season, team, athletes, options, feedbackByAth);
  w.document.write(html);
  w.document.close();
  setTimeout(()=>w.print(), 500);
};
function ReportBuilderModal({ open, onClose, data, save, events, season, team, presetAthleteIds }) {
  const [opts, setOpts] = useState(DEFAULT_REPORT_OPTIONS);
  const [startDate, setStartDate] = useState((season||{}).startDate||'');
  const [endDate, setEndDate] = useState((season||{}).endDate||'');
  const allAthletes = (()=>{
    const inRange = (d) => (!startDate || d>=startDate) && (!endDate || d<=endDate);
    const idsWithResults = new Set();
    (data.results||[]).forEach(r => {
      if(r.isPractice) return;
      if(!inRange(r.date)) return;
      if(r.athleteId) idsWithResults.add(r.athleteId);
      (r.relayAthletes||[]).forEach(id => idsWithResults.add(id));
    });
    return (data.athletes||[])
      .filter(a => a.active !== false || idsWithResults.has(a.id))
      .sort((a,b)=>athLast(a).localeCompare(athLast(b)));
  })();
  const [selectedIds, setSelectedIds] = useState(presetAthleteIds && presetAthleteIds.length ? presetAthleteIds : allAthletes.map(a=>a.id));
  const [feedbackDraft, setFeedbackDraft] = useState({});
  const [expandedAth, setExpandedAth] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');
  const dirtyRef = useRef(false);
  const saveTimerRef = useRef(null);
  useEffect(()=>{
    if(!open) return;
    setStartDate((season||{}).startDate||'');
    setEndDate((season||{}).endDate||'');
    setSelectedIds(presetAthleteIds && presetAthleteIds.length ? presetAthleteIds : allAthletes.map(a=>a.id));
    const saved = data.reportFeedback || {};
    const savedOpts = data.reportConfig || null;
    setOpts(savedOpts && savedOpts.opts ? {...DEFAULT_REPORT_OPTIONS, ...savedOpts.opts, highlights:{...DEFAULT_REPORT_OPTIONS.highlights, ...((savedOpts.opts||{}).highlights||{})}} : DEFAULT_REPORT_OPTIONS);
    const draft = {};
    allAthletes.forEach(a=>{
      draft[a.id] = saved[a.id] && saved[a.id].sections ? { sections: saved[a.id].sections.map(s=>({...s})) } : { sections: DEFAULT_FEEDBACK_SECTIONS.map(s=>({...s})) };
    });
    setFeedbackDraft(draft);
    setExpandedAth(null);
    setSaveStatus('idle');
    dirtyRef.current = false;
  // eslint-disable-next-line
  }, [open]);
  const saveDraft = () => {
    save({...data, reportFeedback: feedbackDraft, reportConfig: { opts, startDate, endDate }});
    dirtyRef.current = false;
    setSaveStatus('saved');
  };
  useEffect(()=>{
    if(!open || !dirtyRef.current) return;
    if(saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(()=>{
      if(dirtyRef.current) saveDraft();
    }, 1200);
    return () => { if(saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  // eslint-disable-next-line
  }, [feedbackDraft, opts, startDate, endDate, open]);
  useEffect(()=>{
    if(!open) return;
    const onBeforeUnload = (e) => { if(dirtyRef.current) { e.preventDefault(); e.returnValue=''; } };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [open]);
  if(!open) return null;
  const toggle = (k) => { dirtyRef.current=true; setSaveStatus('dirty'); setOpts(o=>({...o, [k]:!o[k]})); };
  const toggleHl = (k) => { dirtyRef.current=true; setSaveStatus('dirty'); setOpts(o=>({...o, highlights:{...o.highlights, [k]:!o.highlights[k]}})); };
  const toggleAth = (id) => setSelectedIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev, id]);
  const selectAll = () => setSelectedIds(allAthletes.map(a=>a.id));
  const selectNone = () => setSelectedIds([]);
  const markDirty = () => { dirtyRef.current = true; setSaveStatus('dirty'); };
  const updateSection = (aid, idx, field, val) => { markDirty(); setFeedbackDraft(prev=>{
    const sections = [...((prev[aid]||{}).sections||[])];
    sections[idx] = {...sections[idx], [field]:val};
    return {...prev, [aid]:{...(prev[aid]||{}), sections}};
  }); };
  const addSection = (aid) => { markDirty(); setFeedbackDraft(prev=>{
    const sections = [...((prev[aid]||{}).sections||[]), {title:'New section', body:''}];
    return {...prev, [aid]:{...(prev[aid]||{}), sections}};
  }); };
  const removeSection = (aid, idx) => { markDirty(); setFeedbackDraft(prev=>{
    const sections = ((prev[aid]||{}).sections||[]).filter((_,i)=>i!==idx);
    return {...prev, [aid]:{...(prev[aid]||{}), sections}};
  }); };
  const closeWithFlush = () => {
    if(dirtyRef.current) saveDraft();
    onClose();
  };
  const persistAndGenerate = () => {
    saveDraft();
    const applyGender = (list) => {
      const gm = opts.genderMode || 'all';
      if(gm === 'boys') return list.filter(a=>a.gender==='M');
      if(gm === 'girls') return list.filter(a=>a.gender==='F');
      return list;
    };
    // When per-athlete pages are off, the team report should cover ALL eligible
    // athletes for the season — the selection only governs per-athlete pages.
    const basePool = opts.includeAthletePages ? allAthletes.filter(a=>selectedIds.includes(a.id)) : allAthletes;
    const athletesForReport = applyGender(basePool);
    openSeasonReport({...data, reportFeedback:feedbackDraft}, events, season, team, athletesForReport, {...opts, startDate, endDate}, feedbackDraft);
    onClose();
  };
  const sectionToggle = (k, label) => (
    <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,padding:'3px 0',cursor:'pointer'}}>
      <input type="checkbox" checked={!!opts[k]} onChange={()=>toggle(k)} />
      <span>{label}</span>
    </label>
  );
  const hlToggle = (k, label) => (
    <label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,padding:'2px 0',cursor:'pointer'}}>
      <input type="checkbox" checked={!!opts.highlights[k]} onChange={()=>toggleHl(k)} />
      <span>{label}</span>
    </label>
  );
  return (
    <Modal open={open} onClose={closeWithFlush} width={760}>
      <h2 style={S.h2}>End-of-Season Report</h2>
      <p style={{fontSize:12,color:C.textMuted,marginTop:4,marginBottom:14}}>Generates a printable report for the active season. Feedback you enter here is saved and used the next time you generate.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <div style={{...S.card,padding:'10px 12px'}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Date Range</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input style={{...S.input,fontSize:12}} type="date" value={startDate} onChange={e=>{markDirty();setStartDate(e.target.value);}} />
            <span style={{color:C.textMuted}}>→</span>
            <input style={{...S.input,fontSize:12}} type="date" value={endDate} onChange={e=>{markDirty();setEndDate(e.target.value);}} />
          </div>
          <div style={{fontSize:10,color:C.textMuted,marginTop:4}}>Default: active season. Adjust to print part of a season.</div>
        </div>
        <div style={{...S.card,padding:'10px 12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,gap:8,flexWrap:'wrap'}}>
            <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase'}}>Sections to include</div>
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11}}>
              <span style={{color:C.textMuted}}>Show</span>
              <select style={{...S.select,fontSize:11,padding:'3px 6px'}} value={opts.genderMode||'all'} onChange={e=>{dirtyRef.current=true;setSaveStatus('dirty');setOpts(o=>({...o,genderMode:e.target.value}));}}>
                <option value="all">Combined</option>
                <option value="boys">Boys only</option>
                <option value="girls">Girls only</option>
                <option value="split">Boys & Girls separately</option>
              </select>
            </div>
          </div>
          <div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase',fontWeight:600,marginBottom:2}}>Team page</div>
          {sectionToggle('includeTeamSummary','Summary tiles')}
          {sectionToggle('includeTeamQualifiers','Qualifying achievements')}
          {sectionToggle('includeTopPRs','Top PRs by % (track + field)')}
          <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,padding:'3px 0',cursor:'pointer'}}>
            <input type="checkbox" checked={!!opts.includeTeamRankings} onChange={()=>toggle('includeTeamRankings')} />
            <span>Ranked performances by event</span>
            <span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:4,fontSize:11,color:C.textMuted}}>
              Top
              <input style={{...S.input,width:46,fontSize:11,padding:'3px 4px',textAlign:'center'}} type="text" inputMode="numeric" value={(opts.rankingsTopN||5)+''} onChange={e=>{const v=Math.max(1,Math.min(50,parseInt(e.target.value)||5));dirtyRef.current=true;setSaveStatus('dirty');setOpts(o=>({...o,rankingsTopN:v}));}} disabled={!opts.includeTeamRankings} />
            </span>
          </label>
          <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,padding:'3px 0',cursor:'pointer'}}>
            <input type="checkbox" checked={!!opts.includeTeamScores} onChange={()=>toggle('includeTeamScores')} />
            <span>Team scores & places by meet</span>
            <label style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:4,fontSize:11,color:C.textMuted,cursor:'pointer'}} title="Group meets by a hierarchy level or by tag">
              <input type="checkbox" checked={!!opts.teamScoresGroupByCategory} onChange={()=>toggle('teamScoresGroupByCategory')} disabled={!opts.includeTeamScores} />
              Group by
              <select value={opts.teamScoresGroupBy||'tag'} onChange={e=>{dirtyRef.current=true;setSaveStatus('dirty');setOpts(o=>({...o,teamScoresGroupBy:e.target.value}));}} disabled={!opts.includeTeamScores||!opts.teamScoresGroupByCategory} style={{fontSize:11,padding:'1px 4px',marginLeft:2}}>
                {getOpponentDimensions(data).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                <option value="tag">Meet tag</option>
              </select>
            </label>
          </label>
          <div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase',fontWeight:600,marginTop:8,marginBottom:2}}>Per-athlete pages</div>
          {sectionToggle('includeAthletePages','Per-athlete pages')}
          {sectionToggle('includeAthleteSummary','Athlete summary tiles')}
          {sectionToggle('includeEventTable','By-event table')}
          {sectionToggle('includePerMeetResults','Meet-by-meet results')}
          {sectionToggle('includeProgression','Progression charts w/ trendline')}
          {sectionToggle('includeHighlights','Season highlights')}
          {sectionToggle('includeFeedback','Coach feedback sections')}
        </div>
      </div>
      <div style={{...S.card,padding:'10px 12px',marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Highlight items</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4}}>
          {hlToggle('mostImproved','Most improved event')}
          {hlToggle('prCount','# of PRs')}
          {hlToggle('eventCount','# of events')}
          {hlToggle('meetCount','# of meets')}
          {hlToggle('qualStds','Qualifying marks')}
          {hlToggle('bestPlace','Best placing')}
        </div>
      </div>
      {(()=>{
        const labels = getReportStdLabels(data);
        if(!labels.length) return null;
        const stdMap = opts.enabledStandards || {};
        const isOn = (lbl) => stdMap[lbl] === undefined ? true : !!stdMap[lbl];
        const toggleStd = (lbl) => { dirtyRef.current=true; setSaveStatus('dirty'); setOpts(o=>{
          const cur = o.enabledStandards || {};
          const next = {...cur};
          const willBe = !(cur[lbl] === undefined ? true : cur[lbl]);
          next[lbl] = willBe;
          return {...o, enabledStandards: next};
        }); };
        const setAllStds = (val) => { dirtyRef.current=true; setSaveStatus('dirty'); setOpts(o=>{
          const next = {};
          labels.forEach(l=>{next[l]=val;});
          return {...o, enabledStandards: next};
        }); };
        return (
          <div style={{...S.card,padding:'10px 12px',marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase'}}>Standards to include</div>
              <div style={{display:'flex',gap:6}}>
                <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 8px'}} onClick={()=>setAllStds(true)}>All</button>
                <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 8px'}} onClick={()=>setAllStds(false)}>None</button>
              </div>
            </div>
            <div style={{fontSize:10,color:C.textMuted,marginBottom:6}}>Hide bookkeeping-only standards from the report. Standards not in this list (custom names) always show.</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2}}>
              {labels.map(lbl=>(
                <label key={lbl} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,cursor:'pointer',padding:'2px 4px'}}>
                  <input type="checkbox" checked={isOn(lbl)} onChange={()=>toggleStd(lbl)} />
                  <span>{lbl}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })()}
      <div style={{...S.card,padding:'10px 12px',marginBottom:14,opacity:opts.includeAthletePages?1:0.55}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase'}}>{opts.includeAthletePages?`Athletes for per-athlete pages (${selectedIds.length} of ${allAthletes.length})`:'Athletes (per-athlete pages off — team report uses all eligible)'}</div>
          <div style={{display:'flex',gap:6}}>
            <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 8px'}} onClick={selectAll} disabled={!opts.includeAthletePages}>All</button>
            <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 8px'}} onClick={selectNone} disabled={!opts.includeAthletePages}>None</button>
          </div>
        </div>
        <div style={{maxHeight:160,overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:6}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2}}>
            {allAthletes.map(a=>(
              <label key={a.id} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,cursor:'pointer',padding:'2px 4px'}}>
                <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={()=>toggleAth(a.id)} />
                <span>{athDisplay(a)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {opts.includeFeedback && selectedIds.length>0 && (
        <div style={{...S.card,padding:'10px 12px',marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Feedback</div>
          <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>Click an athlete to add/edit Strengths, Growth, Goals, etc. Sections are saved with the team data.</div>
          <div style={{maxHeight:280,overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:4}}>
            {allAthletes.filter(a=>selectedIds.includes(a.id)).map(a=>{
              const isExp = expandedAth===a.id;
              const sections = ((feedbackDraft[a.id]||{}).sections)||[];
              const filled = sections.filter(s=>s.body&&s.body.trim()).length;
              return (
                <div key={a.id} style={{borderBottom:`1px solid ${C.borderLight}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',cursor:'pointer',background:isExp?C.surface2:'transparent'}} onClick={()=>setExpandedAth(isExp?null:a.id)}>
                    <span style={{fontSize:12,fontWeight:600}}>{athDisplay(a)}</span>
                    <span style={{fontSize:10,color:filled>0?C.success:C.textMuted}}>{filled}/{sections.length} filled {isExp?'▾':'▸'}</span>
                  </div>
                  {isExp && (
                    <div style={{padding:'6px 10px',background:C.bg}}>
                      {sections.map((sec,si)=>(
                        <div key={si} style={{marginBottom:8}}>
                          <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3}}>
                            <input style={{...S.input,fontSize:12,fontWeight:600,flex:1}} value={sec.title||''} onChange={e=>updateSection(a.id,si,'title',e.target.value)} placeholder="Section title" />
                            <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>removeSection(a.id,si)} title="Remove section">✕</button>
                          </div>
                          <textarea style={{...S.input,fontSize:12,width:'100%',minHeight:48,resize:'vertical',fontFamily:'inherit',lineHeight:1.4}} value={sec.body||''} onChange={e=>updateSection(a.id,si,'body',e.target.value)} placeholder="Notes for this section..." />
                        </div>
                      ))}
                      <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 10px'}} onClick={()=>addSection(a.id)}>+ Add section</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
        <span style={{fontSize:11,color:saveStatus==='saved'?C.success:saveStatus==='dirty'?'#b8860b':C.textMuted,fontWeight:600}}>
          {saveStatus==='saved'?'✓ Draft saved':saveStatus==='dirty'?'● Unsaved changes (auto-saving…)':'Draft autosaves as you type'}
        </span>
        <div style={{display:'flex',gap:8}}>
          <button style={{...S.btn,...S.btnSecondary}} onClick={closeWithFlush}>Close</button>
          <button style={{...S.btn,...S.btnSecondary}} onClick={saveDraft}>Save Draft</button>
          <button style={{...S.btn,...S.btnPrimary}} onClick={persistAndGenerate} disabled={selectedIds.length===0}>Generate Print Preview</button>
        </div>
      </div>
    </Modal>
  );
}
function SeasonResultsPage({ data, save, nav, events, getAthletePR, season, team }) {
  const [tab, setTab] = useState('events');
  const [showReport, setShowReport] = useState(false);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [gradYearFilter, setGradYearFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [expandedStds, setExpandedStds] = useState({});
  const groups = data.workoutGroups||[];
  const allGradYears = [...new Set(data.athletes.map(a=>a.gradYear).filter(Boolean))].sort((a,b)=>b-a);
  const seasonResults = season ? (data.results||[]).filter(r=>isInSeason(r.date,season)&&!r.isRelay&&!r.isRelaySplit&&!r.isPractice) : (data.results||[]).filter(r=>!r.isRelay&&!r.isRelaySplit&&!r.isPractice);
  const seasonRelaySplits = season ? (data.results||[]).filter(r=>isInSeason(r.date,season)&&r.isRelaySplit&&!r.isPractice) : (data.results||[]).filter(r=>r.isRelaySplit&&!r.isPractice);
  const seasonRelays = season ? (data.results||[]).filter(r=>isInSeason(r.date,season)&&r.isRelay&&!r.isPractice) : (data.results||[]).filter(r=>r.isRelay&&!r.isPractice);
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const athMatch = (a) => {
    if(search && !athSearch(a, search)) return false;
    if(genderFilter && a.gender!==genderFilter) return false;
    if(gradYearFilter && String(a.gradYear)!==String(gradYearFilter)) return false;
    if(groupFilter && !(a.groups||[]).some(g=>g.groupId===groupFilter) && a.trainingGroup!==groupFilter) return false;
    return true;
  };
  const eventsWithResults = events.filter(e=>!e.meetSpecific&&seasonResults.some(r=>r.eventId===e.id)).sort((a,b)=>getDefaultOrder(a)-getDefaultOrder(b));
  const relayEventsWithResults = events.filter(e=>!e.meetSpecific&&(seasonRelays.some(r=>r.eventId===e.id)||seasonRelaySplits.some(r=>r.eventId===e.id))).sort((a,b)=>getDefaultOrder(a)-getDefaultOrder(b));
  const allEventsForFilter = [...new Set([...eventsWithResults,...relayEventsWithResults].map(e=>e.id))].map(id=>events.find(e=>e.id===id)).filter(Boolean);
  const clearFilters = () => {setSearch('');setGenderFilter('');setGradYearFilter('');setGroupFilter('');setEventFilter('');};
  const hasFilters = search||genderFilter||gradYearFilter||groupFilter||eventFilter;
  const filterBar = (
    <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
      <input style={{...S.input,maxWidth:180}} placeholder="Search athletes..." value={search} onChange={e=>setSearch(e.target.value)} />
      <select style={S.select} value={genderFilter} onChange={e=>setGenderFilter(e.target.value)}><option value="">All Genders</option><option value="M">Boys</option><option value="F">Girls</option></select>
      <select style={S.select} value={gradYearFilter} onChange={e=>setGradYearFilter(e.target.value)}><option value="">All Years</option>{allGradYears.map(y=><option key={y} value={y}>'{(y+'').slice(-2)}</option>)}</select>
      <select style={S.select} value={groupFilter} onChange={e=>setGroupFilter(e.target.value)}><option value="">All Groups</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select>
      <select style={S.select} value={eventFilter} onChange={e=>setEventFilter(e.target.value)}><option value="">All Events</option>{allEventsForFilter.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}</select>
      {hasFilters&&<button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={clearFilters}>Clear</button>}
    </div>
  );
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 style={{...S.h1,margin:0}}>Season Results{season&&<span style={{fontSize:14,color:C.textMuted,fontWeight:400,marginLeft:8}}>{season.name}</span>}</h1>
        <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'8px 14px'}} onClick={()=>setShowReport(true)}>📄 End-of-Season Report</button>
      </div>
      <ReportBuilderModal open={showReport} onClose={()=>setShowReport(false)} data={data} save={save} events={events} season={season} team={team} presetAthleteIds={null} />
      <div style={{display:'flex',gap:0,marginBottom:12,borderBottom:`2px solid ${C.border}`}}>
        {['events','athletes','standards'].map(t=>(
          <button key={t} style={{padding:'10px 20px',fontSize:13,fontWeight:600,border:'none',borderBottom:tab===t?`3px solid ${C.accent}`:'3px solid transparent',background:'none',color:tab===t?C.accent:C.textMuted,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.04em'}} onClick={()=>setTab(t)}>{t==='events'?'By Event':t==='athletes'?'By Athlete':'By Standard'}</button>
        ))}
      </div>
      {filterBar}
      {tab==='events'&&(
        <div>
          {(eventFilter?allEventsForFilter.filter(e=>e.id===eventFilter):[...eventsWithResults,...relayEventsWithResults.filter(e=>!eventsWithResults.some(x=>x.id===e.id))]).map(evt=>{
            if(eventFilter && evt.id!==eventFilter) return null;
            const isField = isFieldEvent(evt);
            const isRelayEvt = evt.entryType==='Relay';
            let ranked;
            if(isRelayEvt) {
              ranked = seasonRelays.filter(r=>r.eventId===evt.id).sort((a,b)=>isField?((b.ft||0)*12+(b.inch||0)+(b.qtr||0))-((a.ft||0)*12+(a.inch||0)+(a.qtr||0)):a.timeMs-b.timeMs);
            } else {
              const allForEvt = seasonResults.filter(r=>r.eventId===evt.id);
              const bestByAthlete = {};
              allForEvt.forEach(r=>{
                if(!r.athleteId) return;
                const a = data.athletes.find(at=>at.id===r.athleteId);
                if(!a||!athMatch(a)) return;
                if(!bestByAthlete[r.athleteId]) bestByAthlete[r.athleteId]=r;
                else {
                  if(isField) { if(((r.ft||0)*12+(r.inch||0)+(r.qtr||0))>((bestByAthlete[r.athleteId].ft||0)*12+(bestByAthlete[r.athleteId].inch||0)+(bestByAthlete[r.athleteId].qtr||0))) bestByAthlete[r.athleteId]=r; }
                  else { if(r.timeMs<bestByAthlete[r.athleteId].timeMs) bestByAthlete[r.athleteId]=r; }
                }
              });
              ranked = Object.values(bestByAthlete).sort((a,b)=>isField?((b.ft||0)*12+(b.inch||0)+(b.qtr||0))-((a.ft||0)*12+(a.inch||0)+(a.qtr||0)):a.timeMs-b.timeMs);
            }
            if(!ranked.length) return null;
            return (
              <div key={evt.id} style={{...S.card,marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <div>
                    <span style={{fontWeight:700,fontSize:15,color:C.text}}>{getEventLabel(evt)}</span>
                    <span style={{fontSize:11,color:C.textMuted,marginLeft:8}}>{evt.eventType} - {evt.entryType}</span>
                  </div>
                  <span style={{fontSize:12,color:C.textMuted}}>{ranked.length} {isRelayEvt?'teams':'athletes'}</span>
                </div>
                {isRelayEvt&&ranked.length>0&&(evt.qualifyingStandards||[]).length>0&&(
                  <div style={{marginBottom:8,display:'flex',flexDirection:'column',gap:3}}>
                    {(evt.qualifyingStandards||[]).map(std=>{
                      const stdMs=std.timeMs||0;
                      if(!stdMs) return null;
                      const bestMs=ranked[0].timeMs;
                      const met=bestMs<=stdMs;
                      const pct=Math.min(100,Math.round(stdMs/(bestMs||1)*100));
                      const diffStr=met?'Qualified':formatTime(bestMs-stdMs)+' away';
                      const barColor=met?C.success:pct>=(data.nearMissPct||90)?'#b8860b':C.accent;
                      const info=getStdBadgeInfo(data,std.name);
                      return (<div key={std.id} style={{display:'flex',alignItems:'center',gap:8,fontSize:11}}>
                        <span style={{width:65,color:info.color,fontWeight:600,flexShrink:0}}>{info.abbrev}</span>
                        <span style={{width:55,color:C.textMuted,flexShrink:0,fontSize:10}}>{formatTime(stdMs)}</span>
                        <div style={{flex:1,height:6,background:C.surface2,borderRadius:3,overflow:'hidden'}}>
                          <div style={{width:pct+'%',height:'100%',background:barColor,borderRadius:3,transition:'width 0.3s'}} />
                        </div>
                        <span style={{width:85,textAlign:'right',flexShrink:0,fontWeight:600,color:met?C.success:pct>=(data.nearMissPct||90)?'#b8860b':C.textMuted}}>{diffStr}</span>
                      </div>);
                    })}
                  </div>
                )}
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr><th style={{...S.th,width:40}}>#</th><th style={S.th}>{isRelayEvt?'Team':'Athlete'}</th><th style={S.th}>Meet</th><th style={{...S.th,textAlign:'right'}}>Mark</th><th style={{...S.th,width:50}}></th></tr></thead>
                  <tbody>
                    {ranked.map((r,i)=>{
                      const meetObj = r.meetId?data.meets.find(m=>m.id===r.meetId):null;
                      const valStr = isField?fieldToStr(r.ft,r.inch,r.qtr):formatTime(r.timeMs);
                      if(isRelayEvt) {
                        const names = (r.relayAthletes||[]).map(aid=>{const a=data.athletes.find(at=>at.id===aid);return a?athDisplay(a):'?';}).join(', ');
                        return (<tr key={r.id}><td style={{...S.td,textAlign:'center',fontWeight:700,color:i<3?C.accent:C.textMuted}}>{i+1}</td><td style={{...S.td,fontSize:12}}>{names}</td><td style={{...S.td,fontSize:11,color:C.textMuted}}>{meetObj?meetObj.name:r.date}</td><td style={{...S.td,textAlign:'right',fontWeight:600}}>{valStr}</td><td style={S.td}></td></tr>);
                      }
                      const ath = data.athletes.find(a=>a.id===r.athleteId);
                      if(!ath) return null;
                      const allForAth = seasonResults.filter(rs=>rs.athleteId===r.athleteId&&rs.eventId===evt.id);
                      const isSeasonBest = allForAth.length>0 && r.id===allForAth.sort((a,b)=>isField?((b.ft||0)*12+(b.inch||0)+(b.qtr||0))-((a.ft||0)*12+(a.inch||0)+(a.qtr||0)):a.timeMs-b.timeMs)[0].id;
                      const allQualS = getAllQualifyingForResult(data,events,r);
                      return (
                        <tr key={r.id} style={{cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:ath.id})}>
                          <td style={{...S.td,textAlign:'center',fontWeight:700,color:i===0?'#c9a830':i===1?'#888':i===2?'#b87333':C.textMuted,fontSize:i<3?15:13}}>{i+1}</td>
                          <td style={{...S.td,fontWeight:500}}>
                            {athDisplay(ath)}
                            {ath.gradYear&&<span style={{color:C.textMuted,fontSize:11,marginLeft:4}}>'{(ath.gradYear+'').slice(-2)}</span>}
                            <span style={{fontSize:10,color:ath.gender==='M'?C.blue:'#d53f8c',marginLeft:4}}>{ath.gender==='M'?'B':'G'}</span>
                          </td>
                          <td style={{...S.td,fontSize:11,color:C.textMuted}}>{meetObj?meetObj.name:r.date}</td>
                          <td style={{...S.td,textAlign:'right',fontWeight:600,fontSize:13}}>{valStr}</td>
                          <td style={{...S.td}}>
                            <div style={{display:'flex',gap:2}}>
                              {isSeasonBest&&<span style={{fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:6,background:C.successMuted,color:C.success}}>SB</span>}
                              {allQualS.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
          {!eventsWithResults.length&&!relayEventsWithResults.length&&<div style={{...S.card,textAlign:'center',padding:30,color:C.textMuted}}>No results recorded this season.</div>}
        </div>
      )}
      {tab==='athletes'&&(()=>{
        const athsWithResults = activeAthletes.filter(a=>{
          if(!athMatch(a)) return false;
          return seasonResults.some(r=>r.athleteId===a.id) || seasonRelaySplits.some(r=>r.athleteId===a.id) || seasonRelays.some(r=>(r.relayAthletes||[]).includes(a.id));
        }).sort((a,b)=>athLast(a).localeCompare(athLast(b)));
        return (<div>
          {athsWithResults.map(a=>{
            const myResults = seasonResults.filter(r=>r.athleteId===a.id);
            const prByEvent = {};
            myResults.forEach(r=>{
              if(eventFilter&&r.eventId!==eventFilter) return;
              const evt = events.find(e=>e.id===r.eventId);
              if(!evt) return;
              const isField = isFieldEvent(evt);
              if(!prByEvent[r.eventId]) prByEvent[r.eventId]={evt,result:r};
              else {
                const cur = prByEvent[r.eventId].result;
                if(isField) { if(((r.ft||0)*12+(r.inch||0)+(r.qtr||0))>((cur.ft||0)*12+(cur.inch||0)+(cur.qtr||0))) prByEvent[r.eventId].result=r; }
                else { if(r.timeMs<cur.timeMs) prByEvent[r.eventId].result=r; }
              }
            });
            const prList = Object.values(prByEvent).sort((a,b)=>getDefaultOrder(a.evt)-getDefaultOrder(b.evt));
            const grpName = ((groups.find(g=>((a.groups||[])[0]||{}).groupId===g.id||a.trainingGroup===g.id))||{}).name||'';
            if(!prList.length&&eventFilter) return null;
            return (
              <div key={a.id} style={{...S.card,padding:'10px 14px',marginBottom:8,borderLeft:`3px solid ${a.gender==='M'?C.blue:'#d53f8c'}`,cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:prList.length?6:0}}>
                  <div>
                    <span style={{fontWeight:600,fontSize:14,color:C.text}}>{athDisplay(a)}</span>
                    {a.gradYear&&<span style={{color:C.textMuted,fontSize:12,marginLeft:6}}>'{(a.gradYear+'').slice(-2)}</span>}
                    <span style={{fontSize:11,color:a.gender==='M'?C.blue:'#d53f8c',marginLeft:6}}>{a.gender==='M'?'B':'G'}</span>
                    {grpName&&<span style={{fontSize:11,color:C.textMuted,marginLeft:6}}>{grpName}</span>}
                  </div>
                  <span style={{fontSize:11,color:C.textMuted}}>{prList.length} event{prList.length!==1?'s':''}</span>
                </div>
                {prList.length>0&&(
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {prList.map(({evt,result:r})=>{
                      const isField = isFieldEvent(evt);
                      const valStr = isField?fieldToStr(r.ft,r.inch,r.qtr):formatTime(r.timeMs);
                      const allQualA = getAllQualifyingForResult(data,events,{...r,meetId:r.meetId});
                      return (
                        <div key={evt.id} style={{fontSize:11,padding:'4px 10px',borderRadius:8,background:C.surface2,border:`1px solid ${C.borderLight}`,display:'flex',alignItems:'center',gap:4}}>
                          <span style={{fontWeight:600,color:C.textSecondary}}>{getEventLabel(evt)}</span>
                          <span style={{fontWeight:700,color:C.text}}>{valStr}</span>
                          {allQualA.map(q=><QStdBadge key={q.id} data={data} std={q} />)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {!athsWithResults.length&&<div style={{...S.card,textAlign:'center',padding:30,color:C.textMuted}}>No athletes with results match your filters.</div>}
        </div>);
      })()}
      {tab==='standards'&&(()=>{
        const stdTypes = data.qualifyingStandardTypes||[];
        const allStdCombos = [];
        stdTypes.forEach(t=>{
          const subs = t.subtypes||[];
          const baseAbbrev = t.abbrev||t.name.slice(0,4).toUpperCase();
          const baseColor = t.color||'#2b6cb0';
          if(subs.length===0) allStdCombos.push({typeId:t.id,label:t.name,typeName:t.name,subtype:null,abbrev:baseAbbrev,color:baseColor,timingType:t.timingType||'Both'});
          else subs.forEach(s=>allStdCombos.push({typeId:t.id,label:t.name+' - '+s,typeName:t.name,subtype:s,abbrev:baseAbbrev+'-'+s.slice(0,1).toUpperCase(),color:baseColor,timingType:(t.subtypeTimingTypes||{})[s]||'Both'}));
        });
        if(!allStdCombos.length) return <div style={{...S.card,textAlign:'center',padding:30,color:C.textMuted}}>No qualifying standard types defined. Set them up in Settings → Standards.</div>;
        return (<div>
          {allStdCombos.map(combo=>{
            const qualifiedByEvent = {};
            events.forEach(evt=>{
              const allEvtStds = evt.qualifyingStandards||[];
              if(!allEvtStds.length) return;
              const matchStd = allEvtStds.find(s=>(s.name||'').trim().toLowerCase()===(combo.label||'').trim().toLowerCase())
                || allEvtStds.find(s=>(s.name||'').trim().toLowerCase()===(combo.typeName||'').trim().toLowerCase())
                || allEvtStds.find(s=>combo.typeName && (s.name||'').trim().toLowerCase().startsWith((combo.typeName||'').trim().toLowerCase()))
                || (combo.subtype && allEvtStds.find(s=>(s.name||'').toLowerCase().includes((combo.subtype||'').toLowerCase())));
              if(!matchStd) return;
              const isField = isFieldEvent(evt);
              const stdVal = isField ? (matchStd.ft||0)*12+(matchStd.inch||0)+(matchStd.qtr||0) : matchStd.timeMs;
              if(!stdVal) return;
              const qualified = [];
              const allRes = (data.results||[]).filter(r=>r.eventId===evt.id&&(!season||isInSeason(r.date,season))&&!r.isPractice);
              if(evt.entryType==='Relay') {
                allRes.filter(r=>r.isRelay).forEach(rr=>{
                  const rrMeetTiming = getResultTimingSystem(data, rr);
                  let checkMs = rr.timeMs;
                  if(rrMeetTiming==='Hand' && (combo.timingType==='FAT'||combo.timingType==='Both')) checkMs = handToFAT(rr.timeMs);
                  if(!isField && checkMs>0 && checkMs<=stdVal) qualified.push({isRelay:true,result:rr,athletes:rr.relayAthletes||[],convertedMs:rrMeetTiming==='Hand'?checkMs:null});
                });
              } else {
                const bestByAthlete = {};
                allRes.filter(r=>r.athleteId&&!r.isRelay&&!r.isRelaySplit).forEach(r=>{
                  const a = data.athletes.find(at=>at.id===r.athleteId);
                  if(!a||!athMatch(a)) return;
                  const rMeetTiming = getResultTimingSystem(data, r);
                  let checkMs = r.timeMs;
                  if(!isField && rMeetTiming==='Hand' && (combo.timingType==='FAT'||combo.timingType==='Both')) checkMs = handToFAT(r.timeMs);
                  let met = false;
                  if(isField) met = ((r.ft||0)*12+(r.inch||0)+(r.qtr||0)) >= stdVal;
                  else met = checkMs>0 && checkMs<=stdVal;
                  if(met) {
                    const compareMs = isField ? 0 : checkMs;
                    const bestCompareMs = isField ? 0 : (bestByAthlete[r.athleteId]?bestByAthlete[r.athleteId]._checkMs:Infinity);
                    if(!bestByAthlete[r.athleteId]||(!isField&&compareMs<bestCompareMs)||(isField&&((r.ft||0)*12+(r.inch||0)+(r.qtr||0))>((bestByAthlete[r.athleteId].ft||0)*12+(bestByAthlete[r.athleteId].inch||0)+(bestByAthlete[r.athleteId].qtr||0))))
                      bestByAthlete[r.athleteId] = {...r, _checkMs:checkMs, _converted:rMeetTiming==='Hand'&&!isField?checkMs:null};
                  }
                });
                Object.entries(bestByAthlete).forEach(([aid,r])=>qualified.push({isRelay:false,athleteId:aid,result:r}));
              }
              const _stdType = stdTypes.find(t=>t.id===combo.typeId);
              const _comboMinQual = _stdType ? Math.max(1, (combo.subtype ? (parseInt((_stdType.subtypeMinQualifiers||{})[combo.subtype]) || parseInt(_stdType.minQualifiers) || 1) : (parseInt(_stdType.minQualifiers) || 1))) : 1;
              qualifiedByEvent[evt.id] = {evt,std:matchStd,stdVal,qualified,minQual:Math.max(parseInt(matchStd.minQualifiers)||1, _comboMinQual)};
            });
            const evtIds = Object.keys(qualifiedByEvent);
            const totalQualified = evtIds.reduce((s,id)=>s+qualifiedByEvent[id].qualified.length,0);
            const evtsThresholdMet = evtIds.filter(id=>qualifiedByEvent[id].qualified.length>=qualifiedByEvent[id].minQual).length;
            if(eventFilter && !evtIds.includes(eventFilter)) return null;
            const isExpanded = !!expandedStds[combo.label];
            return (
              <div key={combo.label} style={{...S.card,marginBottom:12,borderLeft:`4px solid ${combo.color}`,padding:isExpanded?undefined:'10px 16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setExpandedStds(p=>({...p,[combo.label]:!p[combo.label]}))}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:12,color:combo.color,fontWeight:700}}>{isExpanded?'▼':'▶'}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:10,background:safeHexToRgba(combo.color,0.12),color:combo.color,border:`1px solid ${combo.color}`}}>{combo.abbrev}</span>
                    <span style={{fontWeight:700,fontSize:15,color:C.text}}>{combo.label}</span>
                    <span style={{fontSize:10,color:C.textMuted,padding:'2px 6px',borderRadius:8,background:C.surface2}}>{combo.timingType}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {evtsThresholdMet>0&&<span style={{fontSize:11,fontWeight:700,padding:'3px 12px',borderRadius:12,background:C.success,color:'#fff'}}>{evtsThresholdMet} event{evtsThresholdMet!==1?'s':''} met</span>}
                    {totalQualified>0&&<span style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:12,background:C.surface2,color:C.textSecondary}}>{totalQualified} mark{totalQualified!==1?'s':''}</span>}
                    {totalQualified===0&&<span style={{fontSize:11,fontWeight:600,color:C.textMuted}}>{evtIds.length} events</span>}
                  </div>
                </div>
                {isExpanded&&<div style={{marginTop:10}}>
                {(()=>{const typ=stdTypes.find(t=>t.id===combo.typeId);return typ&&typ.notes?<div style={{fontSize:11,color:C.textSecondary,padding:'6px 10px',background:C.bg,borderRadius:6,marginBottom:10,whiteSpace:'pre-wrap',lineHeight:1.4,borderLeft:`3px solid ${combo.color}`}}>{typ.notes}</div>:null;})()}
                {(eventFilter?evtIds.filter(id=>id===eventFilter):evtIds).map(evtId=>{
                  const {evt,std,stdVal,qualified,minQual} = qualifiedByEvent[evtId];
                  const isField = isFieldEvent(evt);
                  const stdStr = isField?fieldToStr(std.ft,std.inch,std.qtr):formatTime(std.timeMs);
                  const thresholdMet = qualified.length >= minQual;
                  return (
                    <div key={evtId} style={{marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${C.borderLight}`,opacity:(qualified.length>0&&!thresholdMet)?0.85:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{fontWeight:600,fontSize:13}}>{getEventLabel(evt)}</span>
                          {minQual>1
                            ? <span style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:10,background:thresholdMet?C.success:'#b8860b',color:'#fff'}} title={thresholdMet?'Enough athletes have hit this mark':`Needs ${minQual} qualifiers to count`}>{qualified.length} of {minQual} qualified</span>
                            : (qualified.length>0&&<span style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:10,background:C.success,color:'#fff'}}>{qualified.length}</span>)}
                        </div>
                        <span style={{fontSize:11,color:C.textMuted}}>Standard: <strong>{stdStr}</strong>{minQual>1?<span style={{marginLeft:6,color:'#b8860b'}}>(needs {minQual})</span>:null}</span>
                      </div>
                      {qualified.filter(q=>!q.isRelay).sort((a,b)=>isField?((b.result.ft||0)*12+(b.result.inch||0)+(b.result.qtr||0))-((a.result.ft||0)*12+(a.result.inch||0)+(a.result.qtr||0)):a.result.timeMs-b.result.timeMs).map((q,qi)=>{
                        const a = data.athletes.find(at=>at.id===q.athleteId);
                        if(!a) return null;
                        const meetObj = q.result.meetId?data.meets.find(m=>m.id===q.result.meetId):null;
                        const valStr = isField?fieldToStr(q.result.ft,q.result.inch,q.result.qtr):formatTime(q.result.timeMs);
                        const converted = q.result._converted;
                        return (
                          <div key={q.athleteId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',fontSize:12,cursor:'pointer',background:C.successMuted,borderRadius:6,marginBottom:3,border:`1px solid ${C.success}30`}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                            <div style={{display:'flex',alignItems:'center',gap:6}}>
                              <span style={{fontSize:11,fontWeight:700,color:C.success,minWidth:16}}>✓</span>
                              <span style={{fontWeight:600,color:C.text}}>{athDisplay(a)}</span>
                              {a.gradYear&&<span style={{color:C.textMuted,fontSize:11}}>'{(a.gradYear+'').slice(-2)}</span>}
                            </div>
                            <div style={{display:'flex',gap:8,alignItems:'center'}}>
                              <span style={{color:C.textSecondary,fontSize:11}}>{meetObj?meetObj.name:q.result.date}</span>
                              <span style={{fontWeight:700,color:C.success}}>{valStr}</span>
                              {converted&&<span style={{fontSize:9,color:C.textMuted,fontWeight:600}}>(FAT: {formatTime(converted)})</span>}
                            </div>
                          </div>
                        );
                      })}
                      {qualified.filter(q=>q.isRelay).map(q=>{
                        const names = (q.athletes||[]).map(aid=>{const a=data.athletes.find(at=>at.id===aid);return a?athDisplay(a):'?';}).join(', ');
                        const meetObj = q.result.meetId?data.meets.find(m=>m.id===q.result.meetId):null;
                        const diff = stdVal - q.result.timeMs;
                        return (
                          <div key={q.result.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',fontSize:12,background:C.successMuted,borderRadius:6,marginBottom:3,border:`1px solid ${C.success}30`}}>
                            <div style={{display:'flex',alignItems:'center',gap:6}}>
                              <span style={{fontSize:11,fontWeight:700,color:C.success}}>✓</span>
                              <span style={{fontWeight:600,color:'#6b46c1'}}>{names}</span>
                            </div>
                            <div style={{display:'flex',gap:8,alignItems:'center'}}>
                              <span style={{color:C.textSecondary,fontSize:11}}>{meetObj?meetObj.name:q.result.date}</span>
                              <span style={{fontWeight:700,color:C.success}}>{formatTime(q.result.timeMs)}</span>
                              {q.convertedMs&&<span style={{fontSize:9,color:C.textMuted,fontWeight:600}}>(FAT: {formatTime(q.convertedMs)})</span>}
                              {diff>0&&<span style={{fontSize:10,color:C.success,fontWeight:600}}>(-{formatTime(diff)})</span>}
                            </div>
                          </div>
                        );
                      })}
                      {(()=>{
                        if(evt.entryType!=='Relay') return null;
                        const allRelays = seasonRelays.filter(r=>r.eventId===evt.id).sort((a,b)=>a.timeMs-b.timeMs);
                        const notQualified = allRelays.filter(rr=>!qualified.some(q=>q.isRelay&&q.result.id===rr.id));
                        const close = notQualified.filter(rr=>{const pct=Math.round(stdVal/(rr.timeMs||1)*100);return pct>=(data.nearMissPct||90);});
                        if(!close.length) return qualified.length?null:<div style={{fontSize:11,color:C.textMuted,padding:'3px 8px',fontStyle:'italic'}}>No relay results within range</div>;
                        const rKey = `rclose-${evt.id}-${combo.label}`;
                        const closest = close[0];
                        return (<div>
                          <button style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:10,fontWeight:600,padding:'3px 8px'}} onClick={()=>{const el=document.getElementById(rKey);if(el)el.style.display=el.style.display==='none'?'block':'none';}}>Closest relay to qualifying ({close.length}) ▸</button>
                          <div id={rKey} style={{display:'none',padding:'4px 8px',background:C.bg,borderRadius:6}}>
                            {close.map(rr=>{
                              const names = (rr.relayAthletes||[]).map(aid=>{const a=data.athletes.find(at=>at.id===aid);return a?athDisplay(a):'?';}).join(', ');
                              const pct=Math.round(stdVal/(rr.timeMs||1)*100);
                              const awayMs = rr.timeMs - stdVal;
                              const meetObj = rr.meetId?data.meets.find(m=>m.id===rr.meetId):null;
                              return (<div key={rr.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,padding:'2px 0'}}>
                                <span style={{color:'#6b46c1',fontWeight:500}}>{names}</span>
                                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                                  <span style={{color:C.textMuted,fontSize:10}}>{meetObj?meetObj.name:rr.date}</span>
                                  <span style={{fontWeight:600}}>{formatTime(rr.timeMs)}</span>
                                  <span style={{fontSize:10,color:pct>=95?'#b8860b':C.textMuted,fontWeight:600}}>{formatTime(awayMs)} away</span>
                                </div>
                              </div>);
                            })}
                          </div>
                        </div>);
                      })()}
                      {evt.entryType!=='Relay'&&(()=>{
                        const qualifiedIds = new Set(qualified.filter(q=>!q.isRelay).map(q=>q.athleteId));
                        const allRes = (data.results||[]).filter(r=>r.eventId===evt.id&&r.athleteId&&!r.isRelay&&!r.isRelaySplit&&!r.isPractice&&(!season||isInSeason(r.date,season)));
                        const isField = isFieldEvent(evt);
                        const bestByAth = {};
                        allRes.forEach(r=>{
                          const a = data.athletes.find(at=>at.id===r.athleteId);
                          if(!a||!athMatch(a)||qualifiedIds.has(r.athleteId)) return;
                          if(!bestByAth[r.athleteId]||(!isField&&r.timeMs<bestByAth[r.athleteId].timeMs)||(isField&&((r.ft||0)*12+(r.inch||0)+(r.qtr||0))>((bestByAth[r.athleteId].ft||0)*12+(bestByAth[r.athleteId].inch||0)+(bestByAth[r.athleteId].qtr||0))))
                            bestByAth[r.athleteId]=r;
                        });
                        const sorted = Object.values(bestByAth).sort((a,b)=>isField?((b.ft||0)*12+(b.inch||0)+(b.qtr||0))-((a.ft||0)*12+(a.inch||0)+(a.qtr||0)):a.timeMs-b.timeMs);
                        const close = sorted.filter(r=>{
                          const pct=isField?Math.round(((r.ft||0)*12+(r.inch||0)+(r.qtr||0))/stdVal*100):Math.round(stdVal/(r.timeMs||1)*100);
                          return pct>=(data.nearMissPct||90);
                        }).slice(0,5);
                        if(!close.length) return <div style={{fontSize:11,color:C.textMuted,padding:'3px 8px',fontStyle:'italic'}}>{qualified.length?'No other athletes close to this standard':'No results within range yet'}</div>;
                        const cKey = `close-${evt.id}-${combo.label}`;
                        return (<div>
                          <button style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:10,fontWeight:600,padding:'3px 8px'}} onClick={()=>{const el=document.getElementById(cKey);if(el)el.style.display=el.style.display==='none'?'block':'none';}}>Closest to qualifying ({close.length}) ▸</button>
                          <div id={cKey} style={{display:'none',padding:'4px 8px',background:C.bg,borderRadius:6}}>
                            {close.map(r=>{
                              const a=data.athletes.find(at=>at.id===r.athleteId);
                              if(!a) return null;
                              const valStr=isField?fieldToStr(r.ft,r.inch,r.qtr):formatTime(r.timeMs);
                              const pct=isField?Math.round(((r.ft||0)*12+(r.inch||0)+(r.qtr||0))/stdVal*100):Math.round(stdVal/(r.timeMs||1)*100);
                              const awayStr=isField?((stdVal-((r.ft||0)*12+(r.inch||0)+(r.qtr||0)))/12).toFixed(1)+'ft away':formatTime(r.timeMs-stdVal)+' away';
                              return (<div key={r.athleteId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,padding:'2px 0',cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                                <span style={{fontWeight:500}}>{athDisplay(a)}</span>
                                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                                  <span style={{fontWeight:600}}>{valStr}</span>
                                  <span style={{fontSize:10,color:pct>=95?'#b8860b':C.textMuted,fontWeight:600}}>{awayStr}</span>
                                </div>
                              </div>);
                            })}
                          </div>
                        </div>);
                      })()}
                    </div>
                  );
                })}
                {!evtIds.length&&<div style={{fontSize:12,color:C.textMuted,textAlign:'center',padding:12}}>No events with this standard have qualifying results.</div>}
                </div>}
              </div>
            );
          })}
        </div>);
      })()}
    </div>
  );
}
function BulkStandardEntry({ data, save, events, stdTypes, combos }) {
  const [bulkLabel, setBulkLabel] = useState('');
  const [bulkEntries, setBulkEntries] = useState({});
  const allCombos = combos || [];
  const prefill = (label) => {
    setBulkLabel(label);
    const pre = {};
    (data.events||[]).forEach(evt=>{
      const existing = (evt.qualifyingStandards||[]).find(s=>s.name===label);
      if(existing) {
        if(evt.measurableType==='Time') pre[evt.id] = {min:Math.floor((existing.timeMs||0)/60000)+'', sec:(((existing.timeMs||0)%60000)/1000).toFixed(2)};
        else pre[evt.id] = {ft:(existing.ft||'')+'', inch:(existing.inch||'')+'', qtr:(existing.qtr||'')+''};
      }
    });
    setBulkEntries(pre);
  };
  const saveBulk = () => {
    if(!bulkLabel) return;
    const updatedEvents = (data.events||[]).map(evt=>{
      const val = bulkEntries[evt.id];
      const prev = (evt.qualifyingStandards||[]).find(s=>s.name===bulkLabel);
      const carry = (prev&&prev.minQualifiers&&prev.minQualifiers>1) ? {minQualifiers:prev.minQualifiers} : {};
      const existing = (evt.qualifyingStandards||[]).filter(s=>s.name!==bulkLabel);
      if(!val) return {...evt, qualifyingStandards:existing};
      if(evt.measurableType==='Time') {
        const ms = parseTimeToMs(val.min||0, val.sec||0);
        if(!ms) return {...evt, qualifyingStandards:existing};
        return {...evt, qualifyingStandards:[...existing, {id:uid(), name:bulkLabel, timeMs:ms, ...carry}]};
      } else {
        const ft=parseInt(val.ft)||0; const inch=parseInt(val.inch)||0; const qtr=parseFloat(val.qtr)||0;
        if(!ft&&!inch&&!qtr) return {...evt, qualifyingStandards:existing};
        return {...evt, qualifyingStandards:[...existing, {id:uid(), name:bulkLabel, ft, inch, qtr, ...carry}]};
      }
    });
    save({...data, events:updatedEvents, qualifyingStandardTypes:(data.qualifyingStandardTypes||[]).map(t=>{
      const subs = t.subtypes||[];
      const matchesType = subs.length===0 ? t.name===bulkLabel : subs.some(s=>t.name+' - '+s===bulkLabel);
      if(!matchesType) return t;
      if(subs.length===0) return {...t, lastUpdated:new Date().toISOString()};
      const subUpdates = {...(t.subtypeUpdates||{})};
      subs.forEach(s=>{if(t.name+' - '+s===bulkLabel) subUpdates[s]=new Date().toISOString();});
      return {...t, lastUpdated:new Date().toISOString(), subtypeUpdates:subUpdates};
    })});
  };
  const FIELD_ORDER = {'High Jump':1,'Pole Vault':2,'Long Jump':3,'Triple Jump':4,'Shot Put':10,'Discus':11,'Javelin':12,'Hammer':13,'Weight Throw':14};
  const fieldOrder = (e) => (FIELD_ORDER[e.name]||50)*10+(e.gender==='Girl'?0:1);
  const trackEvts = events.filter(e=>e.measurableType==='Time'&&!e.meetSpecific).sort((a,b)=>{
    const da=getDistance(a)||99999; const db=getDistance(b)||99999;
    if(da!==db) return da-db;
    return (a.gender==='Girl'?0:1)-(b.gender==='Girl'?0:1);
  });
  const fieldEvts = events.filter(e=>e.measurableType!=='Time'&&!e.meetSpecific).sort((a,b)=>fieldOrder(a)-fieldOrder(b));
  return (
    <div>
      <h2 style={{...S.h2,marginBottom:8}}>Bulk Enter Standards</h2>
      <div style={{display:'flex',gap:6,marginBottom:12,alignItems:'center'}}>
        <select style={S.select} value={bulkLabel} onChange={e=>prefill(e.target.value)}>
          <option value="">Select standard...</option>
          {allCombos.map((c,i)=><option key={i} value={c.label}>{c.label}</option>)}
        </select>
        {bulkLabel&&<button style={{...S.btn,...S.btnPrimary,fontSize:12}} onClick={saveBulk}>Save All</button>}
      </div>
      {bulkLabel&&(<div style={S.card}>
        <p style={{fontSize:11,color:C.textMuted,marginBottom:8}}>Enter the qualifying mark for each event. Leave blank to skip. Existing values for this standard type will be replaced.</p>
        {trackEvts.length>0&&<div style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Track Events</div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{...S.th,textAlign:'left'}}>Event</th><th style={{...S.th,width:80}}>Min</th><th style={{...S.th,width:12}}></th><th style={{...S.th,width:100}}>Sec</th></tr></thead>
            <tbody>{trackEvts.map(evt=>{
              const v = bulkEntries[evt.id]||{};
              return (<tr key={evt.id}>
                <td style={{...S.td,fontSize:13,fontWeight:500}}>{getEventLabel(evt)}</td>
                <td style={S.td}><input style={{...S.input,width:'100%',fontSize:15,padding:'8px 10px',textAlign:'center',MozAppearance:'textfield',WebkitAppearance:'none'}} type="text" inputMode="numeric" value={v.min||''} onChange={e=>{const ne={...bulkEntries};ne[evt.id]={...v,min:e.target.value};setBulkEntries(ne);}} /></td>
                <td style={{...S.td,textAlign:'center',color:C.textMuted,fontSize:16,padding:0,fontWeight:700}}>:</td>
                <td style={S.td}><input style={{...S.input,width:'100%',fontSize:15,padding:'8px 10px',textAlign:'center'}} type="text" inputMode="decimal" placeholder="00.00" value={v.sec||''} onChange={e=>{const ne={...bulkEntries};ne[evt.id]={...v,sec:e.target.value};setBulkEntries(ne);}} /></td>
              </tr>);
            })}</tbody>
          </table>
        </div>}
        {fieldEvts.length>0&&<div>
          <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',marginBottom:6}}>Field Events</div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{...S.th,textAlign:'left'}}>Event</th><th style={{...S.th,width:75}}>Ft</th><th style={{...S.th,width:75}}>In</th><th style={{...S.th,width:75}}>Qtr</th></tr></thead>
            <tbody>{fieldEvts.map(evt=>{
              const v = bulkEntries[evt.id]||{};
              return (<tr key={evt.id}>
                <td style={{...S.td,fontSize:13,fontWeight:500}}>{getEventLabel(evt)}</td>
                <td style={S.td}><input style={{...S.input,width:'100%',fontSize:15,padding:'8px 10px',textAlign:'center',MozAppearance:'textfield',WebkitAppearance:'none'}} type="text" inputMode="numeric" value={v.ft||''} onChange={e=>{const ne={...bulkEntries};ne[evt.id]={...v,ft:e.target.value};setBulkEntries(ne);}} /></td>
                <td style={S.td}><input style={{...S.input,width:'100%',fontSize:15,padding:'8px 10px',textAlign:'center',MozAppearance:'textfield',WebkitAppearance:'none'}} type="text" inputMode="numeric" value={v.inch||''} onChange={e=>{const ne={...bulkEntries};ne[evt.id]={...v,inch:e.target.value};setBulkEntries(ne);}} /></td>
                <td style={S.td}><input style={{...S.input,width:'100%',fontSize:15,padding:'8px 10px',textAlign:'center',MozAppearance:'textfield',WebkitAppearance:'none'}} type="text" inputMode="decimal" value={v.qtr||''} onChange={e=>{const ne={...bulkEntries};ne[evt.id]={...v,qtr:e.target.value};setBulkEntries(ne);}} /></td>
              </tr>);
            })}</tbody>
          </table>
        </div>}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
          <div style={{fontSize:10,color:C.textMuted}}>{(()=>{const t=stdTypes.find(st=>allCombos.some(c=>c.label===bulkLabel&&c.typeId===st.id));if(!t) return '';const sub=allCombos.find(c=>c.label===bulkLabel);const ts=sub&&sub.subtype&&t.subtypeUpdates?t.subtypeUpdates[sub.subtype]:t.lastUpdated;return ts?'Last saved: '+new Date(ts).toLocaleDateString()+' '+new Date(ts).toLocaleTimeString():'Not yet saved';})()}</div>
          <button style={{...S.btn,...S.btnPrimary,fontSize:14,padding:'10px 28px'}} onClick={saveBulk}>Save All Standards</button>
        </div>
      </div>)}
    </div>
  );
}
function SettingsPage({ data, save, team, updateTeam, user, signOut, nav }) {
  const [tab, setTab] = useState('seasons');
  const [saved, setSaved] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState(null);
  const [templateDragIdx, setTemplateDragIdx] = useState(null);
  const [templateDragOver, setTemplateDragOver] = useState(null);
  const [templateAddSearch, setTemplateAddSearch] = useState('');
  const [stdSortCol, setStdSortCol] = useState('event');
  const [stdSortDir, setStdSortDir] = useState('asc');
  const toggleStdSort = (col) => { if(stdSortCol===col) setStdSortDir(d=>d==='asc'?'desc':'asc'); else { setStdSortCol(col); setStdSortDir('asc'); } };
  const [importData, setImportData] = useState(null);
  const [importMsg, setImportMsg] = useState('');
  const [teamName, setTeamName] = useState((team||{}).name||'');
  const [school, setSchool] = useState((team||{}).school||'');
  const [primaryColor, setPrimaryColor] = useState(((team||{}).colors||{}).primary||'#c96a1f');
  const [secondaryColor, setSecondaryColor] = useState(((team||{}).colors||{}).secondary||'#2b6cb0');
  const [showCustomColors, setShowCustomColors] = useState(false);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [seasonForm, setSeasonForm] = useState({ name:'', startDate:'', endDate:'', trackType:'Outdoor', active:false });
  const [delSeasonId, setDelSeasonId] = useState(null);
  const [showAddMT, setShowAddMT] = useState(false);
  const [mtForm, setMtForm] = useState({ name:'', qualifying:false });
  const [editMTId, setEditMTId] = useState(null);
  const [delMTId, setDelMTId] = useState(null);
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [oppForm, setOppForm] = useState({ name:'', dimensionValues:{} });
  const [editOppId, setEditOppId] = useState(null);
  const [delOppId, setDelOppId] = useState(null);
  const [editDimensionId, setEditDimensionId] = useState(null);
  const [dimensionDraft, setDimensionDraft] = useState('');
  const [delDimensionId, setDelDimensionId] = useState(null);
  const [editValueKey, setEditValueKey] = useState(null); // {dimId, valueId}
  const [valueDraft, setValueDraft] = useState('');
  const [delValueKey, setDelValueKey] = useState(null);
  const [collapsedDimensions, setCollapsedDimensions] = useState({});
  const [collapsedOppSections, setCollapsedOppSections] = useState({});
  const [collapsedStdTypeIds, setCollapsedStdTypeIds] = useState({});
  const [oppSearch, setOppSearch] = useState('');
  const [oppFilters, setOppFilters] = useState({});
  const [oppSortDir, setOppSortDir] = useState('asc');
  useEffect(() => { setTeamName((team||{}).name||''); setSchool((team||{}).school||''); setPrimaryColor(((team||{}).colors||{}).primary||'#c96a1f'); setSecondaryColor(((team||{}).colors||{}).secondary||'#2b6cb0'); }, [team]);
  const handleSaveBranding = async () => {
    await updateTeam(team.id, { name:teamName.trim(), school:school.trim(), colors:{primary:primaryColor,secondary:secondaryColor} });
    C = makeColors(primaryColor,secondaryColor); S = makeStyles(C);
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };
  const handleLogo = (e) => {
    const file = (e.target.files||[])[0];
    if(!file) return;
    if(file.size>500000){alert('Logo must be under 500KB');return;}
    const reader = new FileReader();
    reader.onload = async(ev) => { await updateTeam(team.id,{logo:ev.target.result}); };
    reader.readAsDataURL(file);
  };
  const addSeason = () => {
    if(!seasonForm.name||!seasonForm.startDate||!seasonForm.endDate) return;
    const seasons = [...(data.seasons||[])];
    if(seasonForm.active) seasons.forEach(s=>s.active=false);
    seasons.push({id:uid(),...seasonForm});
    save({...data,seasons});
    setShowAddSeason(false); setSeasonForm({name:'',startDate:'',endDate:'',trackType:'Outdoor',active:false});
  };
  const toggleActiveSeason = (id) => {
    save({...data,seasons:(data.seasons||[]).map(s=>({...s,active:s.id===id}))});
  };
  const deleteSeason = () => {
    save({...data,seasons:(data.seasons||[]).filter(s=>s.id!==delSeasonId)});
    setDelSeasonId(null);
  };
  const saveMT = () => {
    if(!mtForm.name) return;
    if(editMTId) { save({...data,meetTypes:(data.meetTypes||[]).map(mt=>mt.id===editMTId?{...mt,...mtForm}:mt)}); }
    else { save({...data,meetTypes:[...(data.meetTypes||[]),{id:uid(),...mtForm}]}); }
    setShowAddMT(false); setEditMTId(null); setMtForm({name:'',qualifying:false});
  };
  const deleteMT = () => { save({...data,meetTypes:(data.meetTypes||[]).filter(mt=>mt.id!==delMTId)}); setDelMTId(null); };
  const previewC = makeColors(primaryColor,secondaryColor);
  const events = data.events||[];
  return (
    <div>
      <div style={{display:'flex',gap:4,marginBottom:16,flexWrap:'wrap'}}>
        {[['seasons','Seasons'],['branding','Branding'],['meetTypes','Meet Types'],['opponents','Opponents'],['eventOrder','Event Order'],['standards','Standards'],['records','Records'],['team','Team'],['data','Data']].map(([k,l])=>(
          <button key={k} style={S.pill(tab===k)} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      
      {tab==='seasons' && (<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{...S.h2,margin:0}}>Seasons</h2>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>setShowAddSeason(true)}>+ Add Season</button>
        </div>
        {(data.seasons||[]).sort((a,b)=>(b.startDate||'').localeCompare(a.startDate||'')).map(s=>(
          <div key={s.id} style={{...S.card,borderLeft:s.active?`4px solid ${C.accent}`:'4px solid transparent'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{s.name}{s.active&&<span style={{fontSize:10,color:C.accent,marginLeft:8,fontWeight:700}}>ACTIVE</span>}</div>
                <div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{s.startDate} - {s.endDate} - {s.trackType}</div>
              </div>
              <div style={{display:'flex',gap:6}}>
                {!s.active && <button style={{...S.btn,...S.btnPrimary,fontSize:10,padding:'3px 10px'}} onClick={()=>toggleActiveSeason(s.id)}>Set Active</button>}
                <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>setDelSeasonId(s.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
        {!(data.seasons||[]).length && <div style={{...S.card,textAlign:'center',color:C.textMuted,padding:20}}>No seasons defined. Add a season to scope attendance and performance tracking.</div>}
        <Modal open={showAddSeason} onClose={()=>setShowAddSeason(false)} width={420}>
          <h2 style={S.h2}>Add Season</h2>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
            <input style={S.input} placeholder="Season name (e.g. 2026 Outdoor)" value={seasonForm.name} onChange={e=>setSeasonForm({...seasonForm,name:e.target.value})} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div><label style={{fontSize:12,color:C.textSecondary}}>Start Date</label><input style={S.input} type="date" value={seasonForm.startDate} onChange={e=>setSeasonForm({...seasonForm,startDate:e.target.value})} /></div>
              <div><label style={{fontSize:12,color:C.textSecondary}}>End Date</label><input style={S.input} type="date" value={seasonForm.endDate} onChange={e=>setSeasonForm({...seasonForm,endDate:e.target.value})} /></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div><label style={{fontSize:12,color:C.textSecondary}}>Track Type</label><select style={{...S.select,width:'100%'}} value={seasonForm.trackType} onChange={e=>setSeasonForm({...seasonForm,trackType:e.target.value})}><option>Indoor</option><option>Outdoor</option></select></div>
              <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,cursor:'pointer',alignSelf:'end',padding:'8px 0'}}><input type="checkbox" checked={seasonForm.active} onChange={e=>setSeasonForm({...seasonForm,active:e.target.checked})} /> Set as active</label>
            </div>
            <button style={{...S.btn,...S.btnPrimary}} onClick={addSeason}>Create Season</button>
          </div>
        </Modal>
        <ConfirmModal open={!!delSeasonId} onClose={()=>setDelSeasonId(null)} onConfirm={deleteSeason} message="Delete this season?" />
      </div>)}
      
      {tab==='branding' && (<div>
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:12}}>Team Info</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Team Name</label><input style={S.input} value={teamName} onChange={e=>setTeamName(e.target.value)} /></div>
            <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>School</label><input style={S.input} value={school} onChange={e=>setSchool(e.target.value)} /></div>
            <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Logo</label><div style={{display:'flex',alignItems:'center',gap:12}}>{(team||{}).logo&&<img src={team.logo} style={{width:48,height:48,borderRadius:8,objectFit:'contain',border:`1px solid ${C.border}`}} />}<input type="file" accept="image/*" onChange={handleLogo} style={{fontSize:12}} /></div></div>
          </div>
        </div>
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:12}}>Color Scheme</h2>
          <p style={{fontSize:12,color:C.textSecondary,marginBottom:12}}>Choose a preset or create a custom combination.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:8,marginBottom:16}}>
            {COLOR_PRESETS.map(p=>{
              const isSelected = primaryColor===p.primary && secondaryColor===p.secondary;
              return (<button key={p.name} onClick={()=>{setPrimaryColor(p.primary);setSecondaryColor(p.secondary);setShowCustomColors(false);}}
                style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'10px 8px',borderRadius:8,
                  border:isSelected?`2px solid ${C.text}`:`1px solid ${C.border}`,
                  background:isSelected?C.accentMuted:C.surface,cursor:'pointer'}}>
                <div style={{display:'flex',gap:4}}>
                  <span style={{width:22,height:22,borderRadius:4,background:p.primary,border:'1px solid rgba(0,0,0,0.1)'}} />
                  <span style={{width:22,height:22,borderRadius:4,background:p.secondary,border:'1px solid rgba(0,0,0,0.1)'}} />
                </div>
                <span style={{fontSize:9,color:isSelected?C.text:C.textMuted,fontWeight:isSelected?600:400,textAlign:'center',lineHeight:'12px'}}>{p.name}</span>
              </button>);
            })}
          </div>
          <button style={{...S.btn,...(showCustomColors?S.btnPrimary:S.btnSecondary),fontSize:11,marginBottom:showCustomColors?12:0}} onClick={()=>setShowCustomColors(!showCustomColors)}>
            {showCustomColors ? '^ Hide Custom Colors' : 'v Custom Colors'}
          </button>
          {showCustomColors && (
            <div style={{marginTop:12,padding:16,borderRadius:8,border:`1px dashed ${C.border}`,background:C.bg}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                <div>
                  <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Primary Color</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} style={{width:40,height:32,border:'none',cursor:'pointer',borderRadius:4}} />
                    <input style={{...S.input,fontFamily:'monospace',fontSize:12}} value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Secondary Color</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="color" value={secondaryColor} onChange={e=>setSecondaryColor(e.target.value)} style={{width:40,height:32,border:'none',cursor:'pointer',borderRadius:4}} />
                    <input style={{...S.input,fontFamily:'monospace',fontSize:12}} value={secondaryColor} onChange={e=>setSecondaryColor(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={{padding:16,borderRadius:8,border:`1px solid ${C.border}`,marginTop:12,marginBottom:12}}>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:8}}>Preview</div>
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              <span style={{padding:'6px 14px',borderRadius:6,background:previewC.accent,color:'#fff',fontSize:12,fontWeight:600}}>Primary</span>
              <span style={{padding:'6px 14px',borderRadius:6,background:previewC.blue,color:'#fff',fontSize:12,fontWeight:600}}>Secondary</span>
              <span style={{padding:'3px 10px',borderRadius:16,background:previewC.accentMuted,color:previewC.accent,fontSize:11,fontWeight:500,border:`1px solid ${previewC.accent}`}}>Pill</span>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}><button style={{...S.btn,...S.btnPrimary}} onClick={handleSaveBranding}>Save Branding</button><SavedIndicator saved={saved} /></div>
      </div>)}
      
      {tab==='meetTypes' && (<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{...S.h2,margin:0}}>Meet Types</h2>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{setMtForm({name:'',qualifying:false});setEditMTId(null);setShowAddMT(true);}}>+ Add Type</button>
        </div>
        <p style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Define the types of meets your program participates in. e.g. League, Invitational, Sectionals, State Championship - terminology varies by state.</p>
        {(data.meetTypes||[]).map(mt=>(
          <div key={mt.id} style={{...S.card,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><span style={{fontWeight:600}}>{mt.name}</span>{mt.qualifying&&<span style={{fontSize:10,color:C.success,marginLeft:8,fontWeight:600}}>QUALIFYING</span>}</div>
            <div style={{display:'flex',gap:6}}>
              <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 10px'}} onClick={()=>{setMtForm({name:mt.name,qualifying:mt.qualifying});setEditMTId(mt.id);setShowAddMT(true);}}>Edit</button>
              <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>setDelMTId(mt.id)}>✕</button>
            </div>
          </div>
        ))}
        <Modal open={showAddMT} onClose={()=>{setShowAddMT(false);setEditMTId(null);}} width={380}>
          <h2 style={S.h2}>{editMTId?'Edit':'Add'} Meet Type</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
            <input style={S.input} placeholder="Type name (e.g. Invitational)" value={mtForm.name} onChange={e=>setMtForm({...mtForm,name:e.target.value})} />
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}><input type="checkbox" checked={mtForm.qualifying} onChange={e=>setMtForm({...mtForm,qualifying:e.target.checked})} /> Results qualify against event standards</label>
            <button style={{...S.btn,...S.btnPrimary}} onClick={saveMT}>{editMTId?'Save':'Add Type'}</button>
          </div>
        </Modal>
        <ConfirmModal open={!!delMTId} onClose={()=>setDelMTId(null)} onConfirm={deleteMT} message="Delete this meet type?" />
      </div>)}

      {tab==='opponents' && (()=>{
        const opponents = getOpponents(data);
        const dimensions = getOpponentDimensions(data);
        const dimById = (id) => dimensions.find(d=>d.id===id) || null;
        const valueById = (dim, vid) => (dim && (dim.values||[]).find(v=>v.id===vid)) || null;
        const unplacedCount = opponents.filter(o => !Object.values(o.dimensionValues||{}).some(Boolean)).length;

        const saveDimensions = (next) => save({...data, opponentDimensions:next});
        const updateDimension = (dimId, patch) => saveDimensions(dimensions.map(d=>d.id===dimId?{...d,...patch}:d));
        const addDimension = () => {
          const name = window.prompt('Name this dimension (e.g. Section, Class, League, Division):', '');
          if(!name||!name.trim()) return;
          saveDimensions([...dimensions, { id:uid(), name:name.trim(), order:dimensions.length, values:[] }]);
        };
        const renameDimension = (did) => {
          if(!dimensionDraft.trim()) { setEditDimensionId(null); return; }
          updateDimension(did, {name:dimensionDraft.trim()});
          setEditDimensionId(null); setDimensionDraft('');
        };
        const moveDimension = (did, dir) => {
          const ord = [...dimensions].sort((a,b)=>(a.order||0)-(b.order||0));
          const i = ord.findIndex(d=>d.id===did);
          if(i<0) return;
          const j = i + dir;
          if(j<0||j>=ord.length) return;
          [ord[i], ord[j]] = [ord[j], ord[i]];
          saveDimensions(ord.map((d,idx)=>({...d,order:idx})));
        };
        const deleteDimension = () => {
          if(!delDimensionId) return;
          const nextDims = dimensions.filter(d=>d.id!==delDimensionId).map((d,idx)=>({...d,order:idx}));
          const nextOpp = (data.opponents||[]).map(o => {
            if(!o.dimensionValues || !o.dimensionValues[delDimensionId]) return o;
            const dv = {...o.dimensionValues}; delete dv[delDimensionId];
            return {...o, dimensionValues:dv};
          });
          const nextOurDV = {...(data.ourTeamDimensionValues||{})}; delete nextOurDV[delDimensionId];
          save({...data, opponentDimensions:nextDims, opponents:nextOpp, ourTeamDimensionValues:nextOurDV});
          setDelDimensionId(null);
        };

        const addValue = (dim) => {
          const name = window.prompt(`Add a value to "${dim.name}":`, '');
          if(!name||!name.trim()) return;
          updateDimension(dim.id, {values:[...(dim.values||[]), {id:uid(), name:name.trim()}]});
        };
        const saveValueEdit = () => {
          if(!editValueKey) return;
          const dim = dimById(editValueKey.dimId);
          if(!dim) { setEditValueKey(null); setValueDraft(''); return; }
          if(!valueDraft.trim()) { setEditValueKey(null); setValueDraft(''); return; }
          updateDimension(dim.id, {values:(dim.values||[]).map(v=>v.id===editValueKey.valueId?{...v,name:valueDraft.trim()}:v)});
          setEditValueKey(null); setValueDraft('');
        };
        const deleteValue = () => {
          if(!delValueKey) return;
          const dim = dimById(delValueKey.dimId);
          if(!dim) { setDelValueKey(null); return; }
          const nextDim = {...dim, values:(dim.values||[]).filter(v=>v.id!==delValueKey.valueId)};
          const nextOpp = (data.opponents||[]).map(o => {
            if(!o.dimensionValues || o.dimensionValues[delValueKey.dimId] !== delValueKey.valueId) return o;
            const dv = {...o.dimensionValues}; delete dv[delValueKey.dimId];
            return {...o, dimensionValues:dv};
          });
          const ourDV = data.ourTeamDimensionValues||{};
          const nextOurDV = ourDV[delValueKey.dimId] === delValueKey.valueId ? (()=>{const x={...ourDV}; delete x[delValueKey.dimId]; return x;})() : ourDV;
          save({...data, opponentDimensions:dimensions.map(d=>d.id===dim.id?nextDim:d), opponents:nextOpp, ourTeamDimensionValues:nextOurDV});
          setDelValueKey(null);
        };

        const saveOpp = () => {
          if(!oppForm.name.trim()) return;
          const cleanDV = {};
          Object.entries(oppForm.dimensionValues||{}).forEach(([k,v])=>{ if(v) cleanDV[k]=v; });
          const clean = { name:oppForm.name.trim(), dimensionValues:cleanDV };
          const rawOpponents = data.opponents || [];
          if(editOppId) {
            const next = rawOpponents.map(o => {
              if(o.id !== editOppId) return o;
              const { nodeId, isLeague, tags, category, division, ...rest } = o;
              return { ...rest, ...clean };
            });
            save({...data, opponents:next});
          } else {
            save({...data, opponents:[...rawOpponents,{id:uid(),...clean}]});
          }
          setShowAddOpp(false); setEditOppId(null); setOppForm({name:'',dimensionValues:{}});
        };
        const deleteOpp = () => { save({...data, opponents:(data.opponents||[]).filter(o=>o.id!==delOppId)}); setDelOppId(null); };

        const toggleCollapseDim = (did) => setCollapsedDimensions(c=>({...c,[did]:!c[did]}));

        const SECTION_KEYS = ['team','dimensions','opponents'];
        const isSecCollapsed = (k) => !!collapsedOppSections[k];
        const toggleSec = (k) => setCollapsedOppSections(s=>({...s,[k]:!s[k]}));
        const allOppCollapsed = SECTION_KEYS.every(k=>isSecCollapsed(k));
        const noneOppCollapsed = SECTION_KEYS.every(k=>!isSecCollapsed(k));
        return (<div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6,gap:8,flexWrap:'wrap'}}>
            <h2 style={{...S.h2,margin:0}}>Opponents</h2>
            <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
              <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`}} onClick={()=>{const next={};SECTION_KEYS.forEach(k=>{next[k]=true;});setCollapsedOppSections(next);}} disabled={allOppCollapsed}>Collapse all</button>
              <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`}} onClick={()=>setCollapsedOppSections({})} disabled={noneOppCollapsed}>Expand all</button>
              <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{setOppForm({name:'',dimensionValues:{}});setEditOppId(null);setShowAddOpp(true);}}>+ Add Opponent</button>
            </div>
          </div>
          <p style={{fontSize:12,color:C.textMuted,marginBottom:14}}>Set up the categories your state uses (Section, Class, League, Division — name them whatever you want). Each one is independent, so a school can be in any combination. The End-of-Season report can group team scores by any dimension.</p>

          {/* Our team's dimension values */}
          {dimensions.length>0 && (()=>{
            const ourDV = getOurTeamDimensionValues(data);
            const setOurDV = (dimId, valueId) => {
              const next = {...ourDV};
              if(valueId) next[dimId] = valueId; else delete next[dimId];
              save({...data, ourTeamDimensionValues:next});
            };
            const teamLabel = (team && (team.school||team.name)) || 'Our Team';
            const collapsed = isSecCollapsed('team');
            return (
              <div style={{...S.card,padding:0,marginBottom:14,borderLeft:`4px solid ${C.accent}`,overflow:'hidden'}}>
                <div onClick={()=>toggleSec('team')} style={{display:'flex',alignItems:'center',gap:8,padding:'12px 14px',cursor:'pointer',userSelect:'none'}}>
                  <span style={{fontSize:11,color:C.textSecondary,width:14}}>{collapsed?'▶':'▼'}</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'0.05em'}}>Our Team</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>{teamLabel}</span>
                </div>
                {!collapsed && <div style={{padding:'0 14px 12px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10}}>
                    {dimensions.map(d=>{
                      const values = getDimensionValues(d);
                      return (
                        <div key={d.id}>
                          <label style={{fontSize:11,color:C.textSecondary,display:'block',marginBottom:3}}>{d.name}</label>
                          <select style={{...S.select,width:'100%',fontSize:12}} value={ourDV[d.id]||''} onChange={e=>setOurDV(d.id, e.target.value)}>
                            <option value="">— (none)</option>
                            {values.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{fontSize:10,color:C.textMuted,marginTop:8,fontStyle:'italic'}}>Records which categories your own team belongs to. Shown on the team-scores rows for "us" and used wherever the report compares to opponents.</div>
                </div>}
              </div>
            );
          })()}

          {/* Dimensions editor */}
          <div style={{...S.card,padding:0,marginBottom:14,overflow:'hidden'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',gap:8,flexWrap:'wrap'}}>
              <div onClick={()=>toggleSec('dimensions')} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',userSelect:'none',flex:1,minWidth:0}}>
                <span style={{fontSize:11,color:C.textSecondary,width:14}}>{isSecCollapsed('dimensions')?'▶':'▼'}</span>
                <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',letterSpacing:'0.05em'}}>Dimensions{dimensions.length>0?` (${dimensions.length})`:''}</div>
              </div>
              <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 10px'}} onClick={(e)=>{e.stopPropagation();addDimension();}}>+ Add Dimension</button>
            </div>
            {!isSecCollapsed('dimensions') && <div style={{padding:'0 14px 12px'}}>
            {dimensions.length===0 ? (
              <div style={{fontSize:11,color:C.textMuted,fontStyle:'italic',padding:'4px 0'}}>No dimensions yet. Add one (e.g. "Section") to start.</div>
            ) : dimensions.map((d,i)=>{
              const collapsed = !!collapsedDimensions[d.id];
              const values = getDimensionValues(d);
              return (
                <div key={d.id} style={{marginBottom:6,border:`1px solid ${C.borderLight}`,borderRadius:5,background:C.surface}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px'}}>
                    <button onClick={()=>toggleCollapseDim(d.id)} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:C.textSecondary,width:14,padding:0}}>{collapsed?'▶':'▼'}</button>
                    {editDimensionId===d.id ? (
                      <input style={{...S.input,fontSize:13,padding:'4px 8px',flex:1,fontWeight:600}} value={dimensionDraft} autoFocus onChange={e=>setDimensionDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')renameDimension(d.id);else if(e.key==='Escape'){setEditDimensionId(null);setDimensionDraft('');}}} onBlur={()=>renameDimension(d.id)} />
                    ) : (
                      <span style={{fontSize:13,fontWeight:700,color:C.text,flex:1,cursor:'pointer'}} onClick={()=>{setEditDimensionId(d.id);setDimensionDraft(d.name);}} title="Click to rename">{d.name}</span>
                    )}
                    <button onClick={()=>{setEditDimensionId(d.id);setDimensionDraft(d.name);}} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:11,padding:'0 4px'}} title="Edit name">✏️</button>
                    <span style={{fontSize:10,color:C.textMuted}}>{values.length} value{values.length===1?'':'s'}</span>
                    <button onClick={()=>moveDimension(d.id,-1)} disabled={i===0} style={{background:'none',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:'2px 7px',cursor:i===0?'default':'pointer',opacity:i===0?0.3:1,fontSize:11}}>↑</button>
                    <button onClick={()=>moveDimension(d.id,1)} disabled={i===dimensions.length-1} style={{background:'none',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:'2px 7px',cursor:i===dimensions.length-1?'default':'pointer',opacity:i===dimensions.length-1?0.3:1,fontSize:11}}>↓</button>
                    <button onClick={()=>setDelDimensionId(d.id)} style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12,padding:'0 4px'}} title="Delete dimension">✕</button>
                  </div>
                  {!collapsed && <div style={{padding:'4px 14px 8px 30px',background:C.bg}}>
                    {values.length===0 ? (
                      <div style={{fontSize:11,color:C.textMuted,fontStyle:'italic',padding:'4px 0'}}>No values yet.</div>
                    ) : values.map(v=>(
                      <div key={v.id} style={{display:'flex',alignItems:'center',gap:6,padding:'3px 0'}}>
                        <span style={{color:C.textMuted,fontSize:11}}>•</span>
                        {editValueKey && editValueKey.dimId===d.id && editValueKey.valueId===v.id ? (
                          <input style={{...S.input,fontSize:12,padding:'3px 8px',flex:1}} value={valueDraft} autoFocus onChange={e=>setValueDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')saveValueEdit();else if(e.key==='Escape'){setEditValueKey(null);setValueDraft('');}}} onBlur={saveValueEdit} />
                        ) : (
                          <span style={{fontSize:12,color:C.text,flex:1,cursor:'pointer'}} onClick={()=>{setEditValueKey({dimId:d.id,valueId:v.id});setValueDraft(v.name);}} title="Click to rename">{v.name}</span>
                        )}
                        <button onClick={()=>{setEditValueKey({dimId:d.id,valueId:v.id});setValueDraft(v.name);}} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:11,padding:'0 4px'}} title="Edit name">✏️</button>
                        <button onClick={()=>setDelValueKey({dimId:d.id,valueId:v.id})} style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:11,padding:'0 4px'}}>✕</button>
                      </div>
                    ))}
                    <button style={{...S.btn,fontSize:10,padding:'3px 10px',marginTop:6,background:'transparent',color:C.accent,border:`1px solid ${C.accent}`}} onClick={()=>addValue(d)}>+ Add value</button>
                  </div>}
                </div>
              );
            })}
            </div>}
          </div>

          {/* Opponents list */}
          <div style={{...S.card,padding:0,overflow:'hidden'}}>
            <div onClick={()=>toggleSec('opponents')} style={{display:'flex',alignItems:'center',gap:8,padding:'12px 14px',cursor:'pointer',userSelect:'none'}}>
              <span style={{fontSize:11,color:C.textSecondary,width:14}}>{isSecCollapsed('opponents')?'▶':'▼'}</span>
              <div style={{fontSize:12,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',letterSpacing:'0.05em'}}>Opponents{opponents.length>0?` (${opponents.length})`:''}{unplacedCount>0?` · ${unplacedCount} uncategorized`:''}</div>
            </div>
            {!isSecCollapsed('opponents') && <div style={{padding:'0 14px 12px'}}>
            {opponents.length===0 ? (
              <div style={{fontSize:12,color:C.textMuted,textAlign:'center',padding:14,fontStyle:'italic'}}>No opponents yet. Use "+ Add Opponent" at the top to add one.</div>
            ) : (()=>{
              const activeFilterCount = Object.values(oppFilters).filter(v=>v).length;
              const sortedOpps = [...opponents].sort((a,b)=>oppSortDir==='asc'?a.name.localeCompare(b.name):b.name.localeCompare(a.name));
              const filteredOpps = sortedOpps.filter(o=>{
                if(oppSearch.trim() && !o.name.toLowerCase().includes(oppSearch.toLowerCase())) return false;
                for(const [dimId, valueId] of Object.entries(oppFilters)) {
                  if(!valueId) continue;
                  const assigned = (o.dimensionValues||{})[dimId];
                  if(valueId === '__none') { if(assigned) return false; }
                  else if(assigned !== valueId) return false;
                }
                return true;
              });
              return (
                <div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',marginBottom:10,padding:'8px 10px',background:C.bg,borderRadius:6}}>
                    <input style={{...S.input,fontSize:12,padding:'4px 8px',flex:'1 1 160px',minWidth:120}} placeholder="Search by name…" value={oppSearch} onChange={e=>setOppSearch(e.target.value)} />
                    {dimensions.map(d=>(
                      <select key={d.id} style={{...S.select,fontSize:11,padding:'3px 6px'}} value={oppFilters[d.id]||''} onChange={e=>setOppFilters(f=>({...f,[d.id]:e.target.value}))} title={`Filter by ${d.name}`}>
                        <option value="">All {d.name}</option>
                        <option value="__none">— No {d.name}</option>
                        {getDimensionValues(d).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    ))}
                    <button onClick={()=>setOppSortDir(d=>d==='asc'?'desc':'asc')} style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`}} title="Toggle sort direction">Name {oppSortDir==='asc'?'↑':'↓'}</button>
                    {(activeFilterCount>0||oppSearch) && <button onClick={()=>{setOppFilters({});setOppSearch('');}} style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.danger,border:`1px solid ${C.danger}`}}>Clear</button>}
                  </div>
                  {filteredOpps.length===0 ? (
                    <div style={{fontSize:12,color:C.textMuted,textAlign:'center',padding:14,fontStyle:'italic'}}>No opponents match these filters.</div>
                  ) : filteredOpps.map(o=>{
                    const label = getOpponentDimensionsLabel(o.id, opponents, dimensions, data);
                    const anyAssigned = Object.values(o.dimensionValues||{}).some(Boolean);
                    return (
                      <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,padding:'8px 10px',borderBottom:`1px solid ${C.borderLight}`}}>
                        <div style={{minWidth:0,flex:1}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text}}>{o.name}</div>
                          <div style={{fontSize:11,color:anyAssigned?C.textMuted:C.danger,marginTop:2,fontStyle:anyAssigned?'normal':'italic'}}>{anyAssigned?label:'Uncategorized'}</div>
                        </div>
                        <div style={{display:'flex',gap:4}}>
                          <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'3px 10px'}} onClick={()=>{setOppForm({name:o.name,dimensionValues:{...(o.dimensionValues||{})}});setEditOppId(o.id);setShowAddOpp(true);}}>Edit</button>
                          <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>setDelOppId(o.id)}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                  {(activeFilterCount>0||oppSearch) && <div style={{fontSize:10,color:C.textMuted,marginTop:6,fontStyle:'italic'}}>Showing {filteredOpps.length} of {opponents.length} opponent{opponents.length===1?'':'s'}.</div>}
                </div>
              );
            })()}
            </div>}
          </div>

          {/* Opponent add/edit */}
          <Modal open={showAddOpp} onClose={()=>{setShowAddOpp(false);setEditOppId(null);}} width={500}>
            <h2 style={S.h2}>{editOppId?'Edit':'Add'} Opponent</h2>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
              <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>School Name</label><input style={S.input} placeholder="e.g. Lincoln High School" value={oppForm.name} onChange={e=>setOppForm({...oppForm,name:e.target.value})} /></div>
              {dimensions.length === 0 ? (
                <div style={{fontSize:11,color:C.textMuted,fontStyle:'italic',padding:'6px 10px',background:C.bg,borderRadius:4}}>No dimensions defined yet. Add some above to categorize this school.</div>
              ) : dimensions.map(d=>{
                const values = getDimensionValues(d);
                return (
                  <div key={d.id}>
                    <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>{d.name}</label>
                    <select style={{...S.select,width:'100%'}} value={(oppForm.dimensionValues||{})[d.id]||''} onChange={e=>setOppForm(f=>({...f,dimensionValues:{...(f.dimensionValues||{}),[d.id]:e.target.value}}))}>
                      <option value="">— (no {d.name.toLowerCase()})</option>
                      {values.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                );
              })}
              <button style={{...S.btn,...S.btnPrimary}} onClick={saveOpp}>{editOppId?'Save':'Add Opponent'}</button>
            </div>
          </Modal>

          <ConfirmModal open={!!delOppId} onClose={()=>setDelOppId(null)} onConfirm={deleteOpp} message="Delete this opponent? Existing meet scores referencing this opponent will show as (removed)." />
          <ConfirmModal open={!!delDimensionId} onClose={()=>setDelDimensionId(null)} onConfirm={deleteDimension} message={(()=>{const d=dimById(delDimensionId);if(!d)return'';const vc=(d.values||[]).length;const oc=opponents.filter(o=>(o.dimensionValues||{})[d.id]).length;return `Delete the "${d.name}" dimension? ${vc} value(s) will be removed and ${oc} opponent(s) will lose this categorization.`;})()} />
          <ConfirmModal open={!!delValueKey} onClose={()=>setDelValueKey(null)} onConfirm={deleteValue} message={(()=>{if(!delValueKey)return'';const d=dimById(delValueKey.dimId);const v=valueById(d, delValueKey.valueId);if(!v)return'';const oc=opponents.filter(o=>(o.dimensionValues||{})[d.id]===v.id).length;return `Delete "${v.name}"? ${oc} opponent(s) currently use this value.`;})()} />
        </div>);
      })()}

      {tab==='eventOrder' && (()=>{
        const templates = data.eventOrderTemplates || [];
        const editTemplate = editTemplateId ? templates.find(t=>t.id===editTemplateId) : null;
        const saveTemplates = (next) => save({...data, eventOrderTemplates:next});
        const seedFromDefault = () => {
          const t = { id:uid(), name:'Standard', isDefault:true, entries:DEFAULT_MEET_ORDER.map(e=>({...e})) };
          saveTemplates([t]);
        };
        const addTemplate = () => {
          const base = (templates.find(t=>t.isDefault)||templates[0]||{entries:DEFAULT_MEET_ORDER.map(e=>({...e}))}).entries;
          const t = { id:uid(), name:'New template', isDefault:templates.length===0, entries:(base||[]).map(e=>({...e})) };
          saveTemplates([...templates, t]);
          setEditTemplateId(t.id);
        };
        const renameTemplate = (id, name) => saveTemplates(templates.map(t=>t.id===id?{...t,name}:t));
        const setDefaultTemplate = (id) => saveTemplates(templates.map(t=>({...t, isDefault:t.id===id})));
        const duplicateTemplate = (id) => {
          const src = templates.find(t=>t.id===id);
          if(!src) return;
          const copy = { id:uid(), name:`${src.name} copy`, isDefault:false, entries:(src.entries||[]).map(e=>({...e})) };
          saveTemplates([...templates, copy]);
        };
        const deleteTemplate = (id) => {
          if(!window.confirm('Delete this template? Meets using it will fall back to the default.')) return;
          const next = templates.filter(t=>t.id!==id);
          if(!next.some(t=>t.isDefault) && next[0]) next[0].isDefault = true;
          saveTemplates(next);
          if(editTemplateId===id) setEditTemplateId(null);
        };
        const allEntries = (data.events||[]).map(e=>({name:e.name,gender:e.gender}));
        const uniqEntries = (()=>{const seen=new Set();const out=[];allEntries.forEach(e=>{const k=`${e.name}||${e.gender}`;if(!seen.has(k)){seen.add(k);out.push(e);}});return out;})();
        const editEntries = editTemplate ? (editTemplate.entries||[]) : [];
        const editKeys = new Set(editEntries.map(e=>`${e.name}||${e.gender}`));
        const candidates = uniqEntries.filter(e=>!editKeys.has(`${e.name}||${e.gender}`))
          .filter(e=>!templateAddSearch||(`${e.name} ${e.gender}`).toLowerCase().includes(templateAddSearch.toLowerCase()))
          .sort((a,b)=>a.name.localeCompare(b.name)||a.gender.localeCompare(b.gender));
        const updateEntries = (next) => saveTemplates(templates.map(t=>t.id===editTemplateId?{...t,entries:next}:t));
        const moveEntry = (from, to) => {
          if(from===to) return;
          const next = [...editEntries];
          const [m] = next.splice(from,1);
          next.splice(to,0,m);
          updateEntries(next);
        };
        const addEntry = (entry) => { updateEntries([...editEntries, entry]); setTemplateAddSearch(''); };
        const removeEntry = (idx) => updateEntries(editEntries.filter((_,i)=>i!==idx));
        const labelOf = (e) => `${e.name} - ${e.gender==='Boy'?'Boys':e.gender==='Girl'?'Girls':e.gender||'Mixed'}`;
        if(templates.length === 0) {
          return (<div>
            <h2 style={S.h2}>Event Order Templates</h2>
            <p style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Save your usual running order so every new meet starts in the right sequence. You can keep several templates for different competition formats and pick one when you create a meet.</p>
            <div style={{...S.card,padding:24,textAlign:'center'}}>
              <p style={{margin:'0 0 12px',fontSize:13,color:C.textSecondary}}>No templates yet. Start with one based on the built-in standard order — you can rename and edit from there.</p>
              <button style={{...S.btn,...S.btnPrimary}} onClick={seedFromDefault}>Create starter template</button>
            </div>
          </div>);
        }
        return (<div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <h2 style={{...S.h2,margin:0}}>Event Order Templates</h2>
            <button style={{...S.btn,...S.btnPrimary}} onClick={addTemplate}>+ New template</button>
          </div>
          <p style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Templates store an ordered list of <em>event name + gender</em>. Mark one as default — it seeds the order for every new meet. Templates are portable: if you ever delete and recreate an event, the order survives.</p>
          {templates.map(t=>(
            <div key={t.id} style={{...S.card,marginBottom:8,padding:'10px 12px'}}>
              <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <input style={{...S.input,flex:1,minWidth:160,fontSize:14,fontWeight:600}} value={t.name} onChange={e=>renameTemplate(t.id,e.target.value)} />
                {t.isDefault
                  ? <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:8,background:C.successMuted,color:C.success,border:`1px solid ${C.success}`,textTransform:'uppercase',letterSpacing:'0.05em'}}>Default</span>
                  : <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>setDefaultTemplate(t.id)}>Set default</button>
                }
                <span style={{fontSize:11,color:C.textMuted}}>{(t.entries||[]).length} entries</span>
                <button style={{...S.btn,...S.btnPrimary,fontSize:11,padding:'4px 10px'}} onClick={()=>setEditTemplateId(t.id)}>{editTemplateId===t.id?'Editing…':'Edit order'}</button>
                <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>duplicateTemplate(t.id)}>Duplicate</button>
                {templates.length>1 && <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:13}} onClick={()=>deleteTemplate(t.id)} title="Delete">✕</button>}
              </div>
              {editTemplateId===t.id && (
                <div style={{marginTop:10,borderTop:`1px dashed ${C.borderLight}`,paddingTop:10}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:14,alignItems:'start'}}>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Running order ({editEntries.length})</div>
                      <div style={{maxHeight:'50vh',overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
                        {editEntries.length===0 && <div style={{padding:14,textAlign:'center',color:C.textMuted,fontSize:12}}>Empty. Add events from the right panel.</div>}
                        {editEntries.map((entry,idx)=>{
                          const isOver = templateDragOver===idx && templateDragIdx!==idx && templateDragIdx!==null;
                          const isDragging = templateDragIdx===idx;
                          return (<div key={idx}
                            draggable
                            onDragStart={e=>{setTemplateDragIdx(idx);try{e.dataTransfer.effectAllowed='move';}catch(_){}}}
                            onDragOver={e=>{e.preventDefault();if(templateDragOver!==idx)setTemplateDragOver(idx);}}
                            onDragLeave={()=>{if(templateDragOver===idx)setTemplateDragOver(null);}}
                            onDrop={e=>{e.preventDefault();if(templateDragIdx===null||templateDragIdx===idx){setTemplateDragIdx(null);setTemplateDragOver(null);return;}moveEntry(templateDragIdx,idx);setTemplateDragIdx(null);setTemplateDragOver(null);}}
                            onDragEnd={()=>{setTemplateDragIdx(null);setTemplateDragOver(null);}}
                            style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderBottom:`1px solid ${C.borderLight}`,background:isDragging?C.surface2:(isOver?C.accentMuted:C.surface),borderTop:isOver?`2px solid ${C.accent}`:'2px solid transparent',cursor:'grab',userSelect:'none'}}>
                            <span style={{fontSize:14,color:C.textMuted,minWidth:14,textAlign:'center',cursor:'grab'}}>⋮⋮</span>
                            <span style={{fontSize:11,color:C.textMuted,minWidth:22,textAlign:'right'}}>{idx+1}.</span>
                            <span style={{flex:1,fontSize:13,fontWeight:500}}>{labelOf(entry)}</span>
                            <div style={{display:'flex',gap:2}}>
                              <button style={{background:'none',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:'3px 7px',cursor:idx===0?'default':'pointer',opacity:idx===0?0.3:1,fontSize:11}} disabled={idx===0} title="Move up" onClick={()=>moveEntry(idx,idx-1)}>↑</button>
                              <button style={{background:'none',border:`1px solid ${C.borderLight}`,borderRadius:4,padding:'3px 7px',cursor:idx===editEntries.length-1?'default':'pointer',opacity:idx===editEntries.length-1?0.3:1,fontSize:11}} disabled={idx===editEntries.length-1} title="Move down" onClick={()=>moveEntry(idx,idx+1)}>↓</button>
                              <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:13,padding:'0 4px'}} title="Remove" onClick={()=>removeEntry(idx)}>✕</button>
                            </div>
                          </div>);
                        })}
                      </div>
                      <div style={{display:'flex',justifyContent:'flex-end',gap:6,marginTop:8}}>
                        <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>setEditTemplateId(null)}>Done</button>
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:C.textSecondary,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Add event</div>
                      <input style={{...S.input,fontSize:12,padding:'5px 8px',marginBottom:6}} placeholder="Filter…" value={templateAddSearch} onChange={e=>setTemplateAddSearch(e.target.value)} />
                      <div style={{maxHeight:'45vh',overflowY:'auto',border:`1px solid ${C.borderLight}`,borderRadius:6}}>
                        {candidates.length===0 && <div style={{padding:10,textAlign:'center',color:C.textMuted,fontSize:11}}>{uniqEntries.length===0?'No events defined yet.':'Every event is already in the template.'}</div>}
                        {candidates.map((entry,i)=>(
                          <button key={`${entry.name}-${entry.gender}-${i}`} style={{display:'block',width:'100%',textAlign:'left',background:C.surface,border:'none',borderBottom:`1px solid ${C.borderLight}`,padding:'6px 10px',cursor:'pointer',fontSize:12}} onClick={()=>addEntry({name:entry.name,gender:entry.gender})}>
                            <span style={{fontWeight:600}}>{entry.name}</span> <span style={{color:C.textMuted}}>· {entry.gender==='Boy'?'Boys':entry.gender==='Girl'?'Girls':entry.gender||'Mixed'}</span>
                            <span style={{float:'right',color:C.accent,fontSize:11,fontWeight:700}}>+ Add</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>);
      })()}

      {tab==='standards' && (()=>{
        const stdTypes = data.qualifyingStandardTypes||[];
        const allCombos = [];
        stdTypes.forEach(t=>{
          const subs = t.subtypes||[];
          const baseAbbrev = t.abbrev||t.name.slice(0,4).toUpperCase();
          const baseColor = t.color||'#2b6cb0';
          if(subs.length===0) allCombos.push({typeId:t.id,typeName:t.name,subtype:null,label:t.name,timingType:t.timingType||'Both',abbrev:baseAbbrev,color:baseColor});
          else subs.forEach(s=>allCombos.push({typeId:t.id,typeName:t.name,subtype:s,label:t.name+' - '+s,timingType:(t.subtypeTimingTypes||{})[s]||'Both',abbrev:baseAbbrev+(s?'-'+s.slice(0,1).toUpperCase():''),color:baseColor}));
        });
        const allCollapsedStd = stdTypes.length>0 && stdTypes.every(t=>collapsedStdTypeIds[t.id]);
        const noneCollapsedStd = stdTypes.every(t=>!collapsedStdTypeIds[t.id]);
        return (<div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,gap:8,flexWrap:'wrap'}}>
            <h2 style={{...S.h2,margin:0}}>Standards</h2>
            {stdTypes.length>0 && <div style={{display:'flex',gap:6}}>
              <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`}} onClick={()=>{const next={};stdTypes.forEach(t=>{next[t.id]=true;});setCollapsedStdTypeIds(next);}} disabled={allCollapsedStd}>Collapse all</button>
              <button style={{...S.btn,fontSize:11,padding:'4px 10px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`}} onClick={()=>setCollapsedStdTypeIds({})} disabled={noneCollapsedStd}>Expand all</button>
            </div>}
          </div>
          <p style={{fontSize:12,color:C.textMuted,marginBottom:10}}>Define standard types (e.g. IAC Qualifier, State Qualifier) with optional sub-types (e.g. FAT, Hand Timing, Automatic, Provisional). Then bulk-enter marks. The <strong>"Min. qualifiers"</strong> box (or <strong>"min"</strong> on a sub-type) is how many athletes/relays must hit a standard before it shows as met on the Results page — set it to 3 for a "3rd entry" rule, or leave it at 1 for a normal standard.</p>
          <div style={{...S.card,marginBottom:16,padding:'10px 14px',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>"Close to qualifying" cutoff</span>
            <div style={{display:'flex',alignItems:'center',gap:4}}>
              <input style={{...S.input,width:60,textAlign:'center'}} type="text" inputMode="numeric" value={(data.nearMissPct||90)+''} onChange={e=>{const v=Math.min(100,Math.max(1,parseInt(e.target.value)||90));save({...data,nearMissPct:v});}} />
              <span style={{fontSize:13,color:C.textSecondary}}>% of the standard</span>
            </div>
            <span style={{fontSize:11,color:C.textMuted}}>Athletes whose mark is within this much of a standard show as "close" — even if someone else already qualified.</span>
          </div>
          <div style={{...S.card,marginBottom:16}}>
            {stdTypes.map(t=>{
              const stCollapsed = !!collapsedStdTypeIds[t.id];
              return (
              <div key={t.id} style={{padding:'8px 0',borderBottom:`1px solid ${C.borderLight}`,marginBottom:4}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,flex:1}}>
                    <button onClick={()=>setCollapsedStdTypeIds(c=>({...c,[t.id]:!c[t.id]}))} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:C.textSecondary,width:14,padding:0}} title={stCollapsed?'Expand':'Collapse'}>{stCollapsed?'▶':'▼'}</button>
                    <input style={{...S.input,fontWeight:700,fontSize:14,color:t.color||'#2b6cb0',border:'none',borderBottom:`2px solid ${t.color||'#2b6cb0'}`,borderRadius:0,padding:'4px 6px',background:'transparent',maxWidth:200}} value={t.name} onChange={e=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,name:e.target.value}:x)})} />
                    <input style={{...S.input,width:55,fontSize:12,padding:'4px 6px',textAlign:'center',fontWeight:700,border:`2px solid ${C.border}`,borderRadius:6}} value={t.abbrev||''} placeholder="ABBR" onChange={e=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,abbrev:e.target.value.slice(0,5)}:x)})} title="Short abbreviation for badges" />
                    <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:10,background:safeHexToRgba(t.color||'#2b6cb0',0.12),color:t.color||'#2b6cb0',border:`1px solid ${t.color||'#2b6cb0'}`}}>{t.abbrev||t.name.slice(0,4).toUpperCase()}</span>
                    {stCollapsed && (t.subtypes||[]).length>0 && <span style={{fontSize:10,color:C.textMuted}}>{(t.subtypes||[]).length} sub-type{(t.subtypes||[]).length===1?'':'s'}</span>}
                  </div>
                  <button style={{...S.btn,...S.btnDanger,fontSize:11,padding:'4px 10px'}} onClick={()=>save({...data,qualifyingStandardTypes:stdTypes.filter(x=>x.id!==t.id)})}>Remove</button>
                </div>
                {!stCollapsed && <>
                  <div style={{display:'flex',gap:3,marginTop:6,flexWrap:'wrap'}}>
                    {['#2b6cb0','#25763b','#c9a830','#c53030','#6b46c1','#c96a1f','#d53f8c','#0d9488','#1e40af','#7c3aed','#b45309','#4338ca','#047857','#be185d','#374151','#0369a1'].map(clr=>(
                      <button key={clr} style={{width:22,height:22,borderRadius:6,border:(t.color||'#2b6cb0')===clr?'3px solid #1a1e26':`2px solid ${clr}40`,background:clr,cursor:'pointer',padding:0}} onClick={()=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,color:clr}:x)})} />
                    ))}
                  </div>
                  <div style={{marginTop:6,display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                    {!(t.subtypes||[]).length&&<select style={{...S.select,fontSize:11,padding:'4px 8px',width:110}} value={t.timingType||'Both'} onChange={e=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,timingType:e.target.value}:x)})}>
                      <option value="Both">All Timing</option><option value="FAT">FAT Only</option><option value="Hand">Hand Only</option>
                    </select>}
                    {!(t.subtypes||[]).length&&<span style={{display:'flex',alignItems:'center',gap:4}} title="How many athletes (or relays) must hit a standard of this type before it counts as met — e.g. 3 for a '3rd entry' rule. Leave at 1 for normal standards.">
                      <span style={{fontSize:10,color:C.textMuted,fontWeight:600}}>Min. qualifiers to count:</span>
                      <input style={{...S.input,width:38,fontSize:11,padding:'3px 4px',textAlign:'center'}} type="text" inputMode="numeric" value={(t.minQualifiers||1)+''} onChange={e=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,minQualifiers:Math.max(1,parseInt(e.target.value)||1)}:x)})} />
                    </span>}
                  </div>
                  {t.lastUpdated&&<div style={{fontSize:9,color:C.textMuted,marginTop:4}}>Last updated: {new Date(t.lastUpdated).toLocaleDateString()} {new Date(t.lastUpdated).toLocaleTimeString()}</div>}
                  {(t.subtypes||[]).length>0&&<div style={{marginTop:8}}>
                    <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:'uppercase',marginBottom:4}}>Sub-types</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {(t.subtypes||[]).map((s,si)=>(
                        <div key={si} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,padding:'4px 10px',borderRadius:8,background:C.surface2,border:`1px solid ${C.border}`}}>
                          <input style={{border:'none',background:'transparent',fontSize:12,color:C.text,width:Math.max(50,s.length*8),padding:0,fontWeight:600}} value={s} onChange={e=>{const ns=[...(t.subtypes||[])];ns[si]=e.target.value;save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,subtypes:ns}:x)});}} />
                          <select style={{border:'none',background:'transparent',fontSize:10,color:C.textMuted,padding:0,cursor:'pointer'}} value={(t.subtypeTimingTypes||{})[s]||'Both'} onChange={e=>{const st={...(t.subtypeTimingTypes||{})};st[s]=e.target.value;save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,subtypeTimingTypes:st}:x)});}}>
                            <option value="Both">All</option><option value="FAT">FAT</option><option value="Hand">Hand</option>
                          </select>
                          <span style={{fontSize:9,color:C.textMuted,fontWeight:600}} title="Minimum athletes (or relays) who must hit this standard before it counts as met">min</span>
                          <input style={{border:`1px solid ${C.border}`,borderRadius:3,background:C.surface,fontSize:10,color:C.text,width:24,padding:'1px 2px',textAlign:'center'}} type="text" inputMode="numeric" value={(((t.subtypeMinQualifiers||{})[s])||1)+''} onChange={e=>{const sm={...(t.subtypeMinQualifiers||{})};sm[s]=Math.max(1,parseInt(e.target.value)||1);save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,subtypeMinQualifiers:sm}:x)});}} title="Minimum athletes (or relays) who must hit this standard before it counts as met" />
                          <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12,padding:0,fontWeight:700}} onClick={()=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,subtypes:(x.subtypes||[]).filter((_,j)=>j!==si)}:x)})}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>}
                  <div style={{marginTop:6}}>
                    <input style={{...S.input,width:160,fontSize:12,padding:'4px 8px'}} placeholder="+ add sub-type" onKeyDown={e=>{if(e.key==='Enter'&&e.target.value.trim()){save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,subtypes:[...(x.subtypes||[]),e.target.value.trim()]}:x)});e.target.value='';}}} />
                  </div>
                  <div style={{marginTop:8}}>
                    <label style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:'uppercase',display:'block',marginBottom:3}}>Notes</label>
                    <textarea style={{...S.input,width:'100%',fontSize:12,padding:'6px 8px',minHeight:50,resize:'vertical',fontFamily:'inherit'}} placeholder="Qualifying rules, deadlines, special conditions..." value={t.notes||''} onChange={e=>save({...data,qualifyingStandardTypes:stdTypes.map(x=>x.id===t.id?{...x,notes:e.target.value}:x)})} />
                  </div>
                </>}
              </div>
              );
            })}
            {!stdTypes.length&&<span style={{fontSize:12,color:C.textMuted,fontStyle:'italic'}}>No types defined yet</span>}
            <div style={{display:'flex',gap:6,marginTop:8}}>
              <input style={{...S.input,flex:1}} placeholder="New type name (e.g. IAC Qualifier)" id="newStdTypeName" onKeyDown={e=>{if(e.key==='Enter'){const v=e.target.value.trim();if(v){save({...data,qualifyingStandardTypes:[...stdTypes,{id:uid(),name:v,subtypes:[]}]});e.target.value='';}}}} />
              <button style={{...S.btn,...S.btnPrimary,fontSize:12}} onClick={()=>{const el=document.getElementById('newStdTypeName');const v=(el||{}).value||'';if(v.trim()){save({...data,qualifyingStandardTypes:[...stdTypes,{id:uid(),name:v.trim(),abbrev:v.trim().slice(0,4).toUpperCase(),color:'#2b6cb0',subtypes:[]}]});el.value='';}}}>+ Add Type</button>
            </div>
          </div>
          {allCombos.length>0&&(<BulkStandardEntry data={data} save={save} events={events} stdTypes={stdTypes} combos={allCombos} />)}
          <h2 style={{...S.h2,marginTop:20,marginBottom:12}}>All Standards</h2>
          <div style={S.card}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>
                <th style={{...S.th,cursor:'pointer'}} onClick={()=>toggleStdSort('event')}>Event {stdSortCol==='event'?(stdSortDir==='asc'?'↑':'↓'):''}</th>
                <th style={{...S.th,cursor:'pointer'}} onClick={()=>toggleStdSort('gender')}>Gender {stdSortCol==='gender'?(stdSortDir==='asc'?'↑':'↓'):''}</th>
                <th style={{...S.th,cursor:'pointer'}} onClick={()=>toggleStdSort('standard')}>Standard {stdSortCol==='standard'?(stdSortDir==='asc'?'↑':'↓'):''}</th>
                <th style={{...S.th,cursor:'pointer'}} onClick={()=>toggleStdSort('mark')}>Mark {stdSortCol==='mark'?(stdSortDir==='asc'?'↑':'↓'):''}</th>
                <th style={{...S.th,width:30}}></th>
              </tr></thead>
              <tbody>
                {(()=>{
                  const rows = events.flatMap(evt=>(evt.qualifyingStandards||[]).map(std=>({evt,std})));
                  rows.sort((a,b)=>{
                    let va,vb;
                    switch(stdSortCol){
                      case 'event': va=a.evt.name;vb=b.evt.name;break;
                      case 'gender': va=a.evt.gender;vb=b.evt.gender;break;
                      case 'standard': va=a.std.name;vb=b.std.name;break;
                      case 'mark': va=a.evt.measurableType==='Time'?(a.std.timeMs||999999):((a.std.ft||0)*12+(a.std.inch||0)); vb=b.evt.measurableType==='Time'?(b.std.timeMs||999999):((b.std.ft||0)*12+(b.std.inch||0));break;
                      default: va=a.evt.name;vb=b.evt.name;
                    }
                    if(va<vb) return stdSortDir==='asc'?-1:1;
                    if(va>vb) return stdSortDir==='asc'?1:-1;
                    return 0;
                  });
                  return rows.length ? rows.map(({evt,std})=>(
                    <tr key={`${evt.id}-${std.id}`}>
                      <td style={S.td}>{evt.name}</td>
                      <td style={S.td}>{evt.gender}</td>
                      <td style={{...S.td,fontWeight:600}}>{std.name}</td>
                      <td style={S.td}>{evt.measurableType==='Time'?formatTime(std.timeMs):fieldToStr(std.ft,std.inch,std.qtr)}</td>
                      <td style={S.td}><button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:11}} onClick={()=>save({...data,events:(data.events||[]).map(e=>e.id===evt.id?{...e,qualifyingStandards:(e.qualifyingStandards||[]).filter(s=>s.id!==std.id)}:e)})}>✕</button></td>
                    </tr>
                  )) : <tr><td colSpan={5} style={{...S.td,textAlign:'center',color:C.textMuted}}>No standards set yet.</td></tr>;
                })()}
              </tbody>
            </table>
          </div>
        </div>);
      })()}
      
      {tab==='records' && (<div>
        <h2 style={{...S.h2,marginBottom:12}}>School Records - All Events</h2>
        <div style={S.card}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={S.th}>Event</th><th style={S.th}>Gender</th><th style={S.th}>Type</th><th style={S.th}>Mark</th><th style={S.th}>Athlete</th><th style={S.th}>Date</th></tr></thead>
            <tbody>
              {events.flatMap(evt=>(evt.schoolRecords||[]).map(rec=>{
                const ath=data.athletes.find(a=>a.id===rec.athleteId);
                return (<tr key={`${evt.id}-${rec.id}`}>
                  <td style={S.td}>{evt.name}</td>
                  <td style={S.td}>{evt.gender}</td>
                  <td style={{...S.td,fontWeight:600}}>{rec.type||'School Record'}</td>
                  <td style={S.td}>{evt.measurableType==='Time'?formatTime(rec.timeMs):fieldToStr(rec.ft,rec.inch,rec.qtr)}</td>
                  <td style={S.td}>{ath?athDisplay(ath):'-'}</td>
                  <td style={S.td}>{rec.date||'-'}</td>
                </tr>);
              }))}
              {events.every(e=>!(e.schoolRecords||[]).length)&&<tr><td colSpan={6} style={{...S.td,textAlign:'center',color:C.textMuted}}>No records set. Add them in the Events page.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>)}
      
      {tab==='team' && (<div>
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:8}}>Join Code</h2>
          <p style={{fontSize:13,color:C.textSecondary,marginBottom:8}}>Share with co-coaches so they can join your team.</p>
          <div style={{fontSize:24,fontWeight:700,color:C.accent,letterSpacing:'0.08em',fontFamily:'monospace',padding:'12px 20px',background:C.accentMuted,borderRadius:8,display:'inline-block'}}>{(team||{}).joinCode||'-'}</div>
        </div>
        {(team||{}).members && (<div style={S.card}>
          <h2 style={{...S.h2,marginBottom:8}}>Team Members</h2>
          {Object.entries(team.members).map(([uid,m])=>(
            <div key={uid} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.borderLight}`,fontSize:13}}>
              <span style={{fontWeight:500}}>{m.name||m.email}</span>
              <span style={{color:C.textMuted,fontSize:11,textTransform:'uppercase'}}>{m.role}</span>
            </div>
          ))}
        </div>)}
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:8}}>Account</h2>
          <p style={{fontSize:13,color:C.textSecondary,marginBottom:12}}>Signed in as {(user||{}).email}</p>
          {HAS_FIREBASE && <button style={{...S.btn,...S.btnDanger}} onClick={signOut}>Sign Out</button>}
        </div>
      </div>)}
      {tab==='data' && (<div>
        <div style={{...S.card,marginBottom:16}}>
          <h2 style={{...S.h2,marginBottom:8}}>Sync Status</h2>
          {(()=>{
            const sizeBytes = JSON.stringify(data).length;
            const sizeKB = Math.round(sizeBytes/1024);
            const pctFull = Math.round(sizeBytes/1048576*100);
            const isWarning = pctFull > 70;
            const isDanger = pctFull > 90;
            return (<div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:600}}>Data Size: {sizeKB} KB / 1,024 KB</span>
                <span style={{fontSize:12,fontWeight:700,color:isDanger?C.danger:isWarning?'#b8860b':C.success}}>{pctFull}% full</span>
              </div>
              <div style={{height:8,background:C.surface2,borderRadius:4,overflow:'hidden',marginBottom:8}}>
                <div style={{width:Math.min(100,pctFull)+'%',height:'100%',background:isDanger?C.danger:isWarning?'#b8860b':C.success,borderRadius:4}} />
              </div>
              {isDanger&&<div style={{fontSize:11,color:C.danger,fontWeight:600,marginBottom:6}}>Your data is near the Firestore limit. Saves may fail and changes won't sync. Consider archiving old meet results.</div>}
              {isWarning&&!isDanger&&<div style={{fontSize:11,color:'#b8860b',fontWeight:600,marginBottom:6}}>Data is getting large. Monitor this to avoid sync issues.</div>}
              <div style={{fontSize:11,color:C.textMuted}}>
                Athletes: {(data.athletes||[]).length} · Meets: {(data.meets||[]).length} · Results: {(data.results||[]).length} · Attendance: {(data.attendance||[]).length}
              </div>
            </div>);
          })()}
        </div>
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:8}}>Export Data</h2>
          <p style={{fontSize:13,color:C.textSecondary,marginBottom:12}}>Download all your data as a JSON file. Use this to transfer between devices or as a backup.</p>
          <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'10px 20px'}} onClick={()=>{
            const exportObj = {...data, _team:team?{name:team.name,school:team.school,colors:team.colors,logo:team.logo}:null};
            const blob = new Blob([JSON.stringify(exportObj, null, 2)], {type:'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `tf-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}>Export JSON</button>
          <div style={{fontSize:11,color:C.textMuted,marginTop:8}}>
            {(data.athletes||[]).length||0} athletes, {(data.meets||[]).length||0} meets, {(data.events||[]).length||0} events, {(data.workoutLibrary||[]).length} workouts, {(data.attendance||[]).length} attendance records
          </div>
        </div>
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:8}}>Import Data</h2>
          <p style={{fontSize:13,color:C.textSecondary,marginBottom:12}}>Upload a previously exported JSON file. This will replace all current data on this device.</p>
          {importMsg&&<div style={{padding:'8px 12px',borderRadius:6,marginBottom:12,fontSize:13,fontWeight:600,background:importMsg.includes('Error')?C.dangerMuted:C.successMuted,color:importMsg.includes('Error')?C.danger:C.success}}>{importMsg}</div>}
          {!importData && <>
            <input type="file" id="importFileInput" accept=".json,application/json,text/plain,*/*" style={{display:'none'}} onChange={e=>{
              const file = (e.target.files||[])[0];
              if(!file) { setImportMsg('No file selected.'); return; }
              setImportMsg(`Reading ${file.name}...`);
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const parsed = JSON.parse(ev.target.result);
                  if(!parsed.athletes && !parsed.meets && !parsed.events) { setImportMsg('Error: Invalid data file - no athletes, meets, or events found.'); return; }
                  setImportData(parsed);
                  setImportMsg('');
                } catch(err) { setImportMsg('Error: Could not parse file - ' + err.message); }
              };
              reader.onerror = () => setImportMsg('Error: Could not read file.');
              reader.readAsText(file);
              e.target.value = '';
            }} />
            <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'10px 20px'}} onClick={()=>{setImportMsg('');document.getElementById('importFileInput').click();}}>Choose JSON File</button>
          </>}
          {importData && (
            <div style={{padding:'12px 16px',borderRadius:8,border:`1px solid ${C.accent}`,background:C.accentMuted,marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:8}}>Ready to import:</div>
              <div style={{fontSize:13,color:C.textSecondary,marginBottom:4}}>{(importData.athletes||[]).length||0} athletes, {(importData.meets||[]).length||0} meets, {(importData.events||[]).length||0} events</div>
              <div style={{fontSize:13,color:C.textSecondary,marginBottom:4}}>{(importData.workoutLibrary||[]).length} workouts, {(importData.attendance||[]).length} attendance records</div>
              {importData._team&&<div style={{fontSize:13,color:C.textSecondary,marginBottom:12}}>Team: {importData._team.name}{importData._team.school?` - ${importData._team.school}`:''}</div>}
              <div style={{display:'flex',gap:8}}>
                <button style={{...S.btn,...S.btnPrimary,fontSize:13,padding:'10px 20px'}} onClick={()=>{
                  const teamData = importData._team;
                  const cleanData = {...importData};
                  delete cleanData._team;
                  save(cleanData);
                  if(teamData && updateTeam && (team||{}).id) {
                    updateTeam(team.id, {name:teamData.name||team.name, school:teamData.school||team.school, colors:teamData.colors||team.colors, logo:teamData.logo||team.logo});
                  }
                  setImportMsg('Data imported successfully!');
                  setImportData(null);
                }}>Confirm Import</button>
                <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'10px 20px'}} onClick={()=>{setImportData(null);setImportMsg('');}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <div style={S.card}>
          <h2 style={{...S.h2,marginBottom:8,color:C.danger}}>Reset Data</h2>
          <p style={{fontSize:13,color:C.textSecondary,marginBottom:12}}>Clear all data and start fresh. This cannot be undone.</p>
          <button style={{...S.btn,...S.btnDanger,fontSize:13,padding:'10px 20px'}} onClick={()=>{
            if(confirm('Are you sure? This will delete ALL data including athletes, meets, workouts, and attendance. This cannot be undone.')) {
              save({athletes:[],meets:[],events:[],results:[],attendance:[],workoutLibrary:[],workoutPlans:[],workoutCategories:[],workoutGroups:[],meetTypes:[],medicalNotes:[],seasons:[]});
              alert('All data has been reset.');
            }
          }}>Reset All Data</button>
        </div>
      </div>)}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
