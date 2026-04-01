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
const TRACK_DISTANCES = {
  '55m':55,'100m':100,'200m':200,'400m':400,'800m':800,'1000m':1000,
  '1500m':1500,'1600m':1600,'3000m':3000,'3200m':3200,
  '55m Hurdles':55,'100m Hurdles':100,'110m Hurdles':110,'400m Hurdles':400,
  '2000m Steeplechase':2000,'3000m Steeplechase':3000,
  '4x100m':400,'4x200m':800,'4x400m':1600,'4x800m':3200,
};
const getDistance = (evt) => TRACK_DISTANCES[(evt||{}).name] || 0;
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
const getDefaultOrder = (evt) => {
  const idx = DEFAULT_MEET_ORDER.findIndex(o=>o.name===evt.name&&o.gender===evt.gender);
  return idx>=0?idx:500;
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
  const save = useCallback(async (newData) => {
    setData(newData);
    if(!HAS_FIREBASE) {
      try { await appStorage.set(STORE_KEY, JSON.stringify(newData)); } catch(e) { console.error(e); }
      return;
    }
    if(teamId) {
      try { await db.collection('teams').doc(teamId).collection('data').doc('main').set(newData); }
      catch(e) { console.error('Save error:', e); }
    }
  }, [teamId]);
  return { data, save, loading };
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
const exTotals = (exercises) => {
  let mi=0, m=0;
  (exercises||[]).forEach(ex=>{ mi+=parseFloat(ex.mileage)||0; m+=parseFloat(ex.distance)||0; });
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
const TimeDropdown = ({ min, sec, onMinChange, onSecChange, label, compact }) => (
  <div style={{ display:'flex', gap:4, alignItems:'center' }}>
    {label && <span style={{fontSize:11,color:C.textMuted,marginRight:4}}>{label}</span>}
    <select style={{...S.select, width:compact ? 55 : 65}} value={min} onChange={e=>onMinChange(e.target.value)}>
      {Array.from({length:31},(_,i)=><option key={i} value={i}>{i}</option>)}
    </select>
    <span style={{color:C.textMuted}}>:</span>
    <select style={{...S.select, width:compact ? 65 : 75}} value={sec} onChange={e=>onSecChange(e.target.value)}>
      {Array.from({length:60},(_,i)=><option key={i} value={i.toFixed(2)}>{String(i).padStart(2,'0')}</option>)}
    </select>
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
  const { data, save, loading: dataLoading } = useStore((team||{}).id);
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
      : data.results.filter(r => r.athleteId === athleteId && r.eventId === eventId);
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
    meetSub: () => <MeetSubPage data={data} save={save} nav={nav} meetId={pageParams.meetId} events={events} getAthletePR={getAthletePR} checkQualifying={checkQualifying} />,
    athletes: () => <AthletesPage data={data} save={save} nav={nav} />,
    athleteSub: () => <AthleteSubPage data={data} save={save} nav={nav} athleteId={pageParams.athleteId} events={events} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} season={season} />,
    eventsPage: () => <EventsPage data={data} save={save} nav={nav} />,
    tools: () => <ToolsPage data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} preset={pageParams} />,
    raceTimer: () => <RaceTimer data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} preset={pageParams} />,
    multiSplit: () => <MultiSplitTimer data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} preset={pageParams} />,
    relayTimer: () => <RelayTimer data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} preset={pageParams} />,
    fieldEvent: () => <FieldEventPage data={data} save={save} nav={nav} events={events} addResult={addResult} getAthletePR={getAthletePR} checkRecord={checkRecord} checkQualifying={checkQualifying} preset={pageParams} />,
    settings: () => <SettingsPage data={data} save={save} team={team} updateTeam={teamHook.updateTeam} user={user} signOut={authHook.signOut} nav={nav} />,
  };
  const menuItems = [
    { key:'dashboard', label:'Dashboard', icon:'🏠' },
    { key:'attendance', label:'Attendance', icon:'📋' },
    { key:'practicePlans', label:'Practice Plans', icon:'📅' },
    { key:'meets', label:'Meets', icon:'🏆' },
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
              <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{teamSchool}</div>
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
        let totalQual=0, totalClose=0, totalEvents=0;
        qualEvents.forEach(evt=>{
          const stds = evt.qualifyingStandards||[];
          const matchingAthletes = activeAthletes.filter(a=>evt.gender==='Mixed'||(a.gender==='M'&&evt.gender==='Boy')||(a.gender==='F'&&evt.gender==='Girl'));
          matchingAthletes.forEach(a=>{
            const pr = getAthletePR(a.id, evt.id);
            if(!pr) return;
            totalEvents++;
            stds.forEach(std=>{
              let met=false, pct=0;
              if(isFieldEvent(evt)){
                const prIn=fieldToInches(pr.ft||0,pr.inch||0,pr.qtr||0);
                const stdIn=fieldToInches(std.ft||0,std.inch||0,std.qtr||0);
                if(stdIn>0){met=prIn>=stdIn;pct=Math.round(prIn/stdIn*100);}
              } else {
                const prMs=pr.timeMs||0;
                const stdMs=std.timeMs||0;
                if(stdMs>0){met=prMs<=stdMs;pct=Math.round(stdMs/(prMs||1)*100);}
              }
              if(met) totalQual++;
              else if(pct>=90) totalClose++;
            });
          });
        });
        if(!totalEvents) return null;
        return (
          <div style={{...S.card,padding:'12px 14px'}}>
            <h2 style={{...S.h2,marginBottom:8,fontSize:14}}>Qualifying Progress</h2>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:700,color:C.success}}>{totalQual}</div><div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase'}}>Qualified</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:700,color:'#b8860b'}}>{totalClose}</div><div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase'}}>Close (90%+)</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:700,color:C.textSecondary}}>{totalEvents}</div><div style={{fontSize:10,color:C.textMuted,textTransform:'uppercase'}}>With PRs</div></div>
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
  const getStatus = (athleteId) => {
    const att = (data.attendance||[]).find(r=>r.athleteId===athleteId && r.date===today);
    return (att||{}).status || null;
  };
  const setStatus = (athleteId, status) => {
    const existing = (data.attendance||[]).filter(r=>!(r.athleteId===athleteId && r.date===today));
    if(status) existing.push({id:uid(), athleteId, date:today, status});
    save({...data, attendance:existing});
  };
  const markAll = (status) => {
    const existing = (data.attendance||[]).filter(r=>r.date!==today);
    activeAthletes.forEach(a=>existing.push({id:uid(), athleteId:a.id, date:today, status}));
    save({...data, attendance:existing});
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
      
      <div style={{display:'flex',gap:6,marginBottom:16}}>
        <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 14px'}} onClick={()=>markAll('present')}>All Present</button>
        <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 14px'}} onClick={()=>markAll('absent')}>All Absent</button>
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
      
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <button style={{...S.btn,...S.btnSecondary,padding:'4px 12px'}} onClick={()=>setWeekOffset(w=>w-1)}>{"<- "}Prev</button>
        <span style={{fontSize:13,fontWeight:600,color:C.text}}>
          {new Date(weekDates[0]+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})} - {new Date(weekDates[5]+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}
        </span>
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
            {activeAthletes.sort((a,b)=>athLast(a).localeCompare(athLast(b))).map(a => {
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
function MeetFormModal({ editId, initial, meetTypes, onSave, onClose }) {
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
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Track Type</label>
            <select style={{...S.select,width:'100%'}} value={f.trackType} onChange={e=>setF({...f,trackType:e.target.value})}><option>Indoor</option><option>Outdoor</option></select>
          </div>
          <div><label style={{fontSize:12,color:C.textSecondary}}>Meet Type</label>
            <select style={{...S.select,width:'100%'}} value={f.meetTypeId} onChange={e=>setF({...f,meetTypeId:e.target.value})}>
              <option value="">Select type...</option>
              {meetTypes.map(mt=><option key={mt.id} value={mt.id}>{mt.name}{mt.qualifying?' (Q)':''}</option>)}
            </select>
          </div>
        </div>
        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{if(!f.name||!f.startDate)return;onSave({...f,startDate:padDate(f.startDate),endDate:padDate(f.endDate)});}}>{editId?'Save Changes':'Create Meet'}</button>
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
        initial={editMeet ? {name:editMeet.name||'',startDate:(editMeet.startDate||editMeet.date||'').split('T')[0],endDate:(editMeet.endDate||'').split('T')[0],venue:editMeet.venue||'',city:editMeet.city||'',state:editMeet.state||'',trackType:editMeet.trackType||'Outdoor',meetTypeId:editMeet.meetTypeId||''} : {name:'',startDate:'',endDate:'',venue:'',city:'',state:'',trackType:'Outdoor',meetTypeId:''}}
        meetTypes={meetTypes}
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
function MeetSubPage({ data, save, nav, meetId, events, getAthletePR, checkQualifying }) {
  const [filter, setFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [entryTypeFilter, setEntryTypeFilter] = useState('');
  const [showEntryModal, setShowEntryModal] = useState(null);
  const [editEntryIdx, setEditEntryIdx] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [showRoster, setShowRoster] = useState(false);
  const [selectedForTimer, setSelectedForTimer] = useState({});
  const [meetTab, setMeetTab] = useState('events');
  const [athViewSearch, setAthViewSearch] = useState('');
  const [athViewGender, setAthViewGender] = useState('');
  const [athViewSort, setAthViewSort] = useState('name');
  const meet = data.meets.find(m=>m.id===meetId);
  if(!meet) return <div style={S.card}><p>Meet not found</p><button style={S.backLink} onClick={()=>nav('meets')}>{"<- "}Back to Meets</button></div>;
  const meetType = (data.meetTypes||[]).find(mt=>mt.id===meet.meetTypeId);
  const applicableEvents = events.filter(e => e.trackType === meet.trackType || e.trackType === 'Both');
  const storedEntries = {};
  (meet.events||[]).forEach(me => { storedEntries[me.eventId] = me.entries || []; });
  const meetEvents = applicableEvents.map(evt => ({
    eventId: evt.id,
    evt,
    entries: storedEntries[evt.id] || [],
  }));
  const eventOrder = meet.eventOrder || [];
  const filtered = meetEvents.filter(me => {
    if(genderFilter && me.evt.gender !== genderFilter) return false;
    if(typeFilter && me.evt.eventType !== typeFilter) return false;
    if(entryTypeFilter && me.evt.entryType !== entryTypeFilter) return false;
    if(filter && !me.evt.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  }).sort((a,b) => {
    const idxA = eventOrder.indexOf(a.eventId);
    const idxB = eventOrder.indexOf(b.eventId);
    if(idxA >= 0 && idxB >= 0) return idxA - idxB;
    if(idxA >= 0) return -1;
    if(idxB >= 0) return 1;
    const dA = getDefaultOrder(a.evt);
    const dB = getDefaultOrder(b.evt);
    if(dA !== dB) return dA - dB;
    return a.evt.name.localeCompare(b.evt.name);
  });
  const saveEventOrder = (newOrder) => {
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, eventOrder:newOrder}:m)});
  };
  const handleDrop = (fromIdx, toIdx) => {
    if(fromIdx===toIdx) return;
    const ids = filtered.map(me=>me.eventId);
    const [moved] = ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, moved);
    saveEventOrder(ids);
  };
  const saveEntries = (eventId, newEntries) => {
    const updatedMeetEvents = [...(meet.events||[])];
    const idx = updatedMeetEvents.findIndex(me=>me.eventId===eventId);
    if(idx>=0) updatedMeetEvents[idx] = {...updatedMeetEvents[idx], entries:newEntries};
    else updatedMeetEvents.push({eventId, entries:newEntries});
    save({...data, meets:data.meets.map(m=>m.id===meetId?{...m, events:updatedMeetEvents}:m)});
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
      const sorted = [...meetEvents].sort((a,b)=>{const oa=meet.eventOrder||[];const ia=oa.indexOf(a.eventId);const ib=oa.indexOf(b.eventId);if(ia>=0&&ib>=0)return ia-ib;if(ia>=0)return -1;if(ib>=0)return 1;return getDefaultOrder(a.evt)-getDefaultOrder(b.evt);});
      body += '<table>';
      sorted.forEach(me=>{
        if(!me.entries.length) return;
        const isField = isFieldEvent(me.evt);
        const isRly = me.evt.entryType==='Relay';
        body += '<tr><td colspan="99" class="evt-hdr">'+getEventLabel(me.evt)+'<span class="evt-sub">'+me.evt.eventType+' — '+me.evt.entryType+'</span></td></tr>';
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
  const goToRecord = (me) => {
    const entries = me.entries || [];
    const athleteIds = entries.flatMap(en => en.athletes ? en.athletes.map(a=>a.athleteId) : [en.athleteId]).filter(Boolean);
    if(me.evt.eventType === 'Field') {
      nav('fieldEvent', { meetId, eventId:me.evt.id, athleteIds });
    } else if(me.evt.entryType === 'Relay') {
      nav('relayTimer', { meetId, eventId:me.evt.id, athleteIds, entries });
    } else if(athleteIds.length > 1) {
      nav('multiSplit', { meetId, eventId:me.evt.id, athleteIds, entries });
    } else {
      nav('raceTimer', { meetId, eventId:me.evt.id, athleteId:athleteIds[0], entries });
    }
  };
  const goToRecordSelected = (me) => {
    const sel = selectedForTimer[me.eventId]||{};
    const selEntries = (me.entries||[]).filter((_,i)=>sel[i]);
    const athleteIds = selEntries.flatMap(en => en.athletes ? en.athletes.map(a=>a.athleteId) : [en.athleteId]).filter(Boolean);
    if(!athleteIds.length) return;
    if(me.evt.eventType === 'Field') {
      nav('fieldEvent', { meetId, eventId:me.evt.id, athleteIds });
    } else if(me.evt.entryType === 'Relay') {
      nav('relayTimer', { meetId, eventId:me.evt.id, athleteIds, entries:selEntries });
    } else if(athleteIds.length > 1) {
      nav('multiSplit', { meetId, eventId:me.evt.id, athleteIds, entries:selEntries });
    } else {
      nav('raceTimer', { meetId, eventId:me.evt.id, athleteId:athleteIds[0], entries:selEntries });
    }
  };
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
      <h1 style={S.h1}>{meet.name}</h1>
      <p style={S.h3}>
        {meet.startDate}{meet.endDate?` - ${meet.endDate}`:''} - {meet.trackType}
        {meet.venue && ` - ${meet.venue}`}{meet.city && `, ${meet.city}`}{meet.state && ` ${meet.state}`}
        {meetType && <span style={{marginLeft:8,color:meetType.qualifying?C.success:C.textMuted,fontWeight:600}}>({meetType.name})</span>}
      </p>
      <div style={{display:'flex',gap:0,marginBottom:12,borderBottom:`2px solid ${C.border}`,alignItems:'center'}}>
        {['events','athletes'].map(t=>(
          <button key={t} style={{padding:'10px 20px',fontSize:13,fontWeight:600,border:'none',borderBottom:meetTab===t?`3px solid ${C.accent}`:'3px solid transparent',background:'none',color:meetTab===t?C.accent:C.textMuted,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.04em'}} onClick={()=>setMeetTab(t)}>{t==='events'?'By Event':'By Athlete'}</button>
        ))}
        <button style={{marginLeft:'auto',background:'none',border:`1px solid ${C.border}`,borderRadius:6,padding:'6px 14px',fontSize:12,fontWeight:600,color:C.textSecondary,cursor:'pointer'}} onClick={()=>printMeet(meetTab)}>Print</button>
      </div>
      {meetTab==='events' && (<>
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
        {eventOrder.length > 0 && <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'4px 10px'}} onClick={()=>saveEventOrder([])}>Reset Order</button>}
      </div>
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
      {filtered.map((me, meIdx) => {
        const entries = me.entries;
        const hasEntries = entries.length > 0;
        return (
          <div key={me.eventId} draggable style={{...S.card,padding:'14px 16px',borderLeft:`3px solid ${me.evt.gender==='Boy'?C.blue:me.evt.gender==='Girl'?'#d53f8c':C.accent}`, opacity:dragIdx===meIdx?0.5:1, border:dragOverIdx===meIdx?`2px dashed ${C.accent}`:`1px solid ${C.border}`}} onDragStart={()=>setDragIdx(meIdx)} onDragOver={e=>{e.preventDefault();setDragOverIdx(meIdx);}} onDragLeave={()=>setDragOverIdx(null)} onDrop={e=>{e.preventDefault();handleDrop(dragIdx,meIdx);setDragIdx(null);setDragOverIdx(null);}} onDragEnd={()=>{setDragIdx(null);setDragOverIdx(null);}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:hasEntries?8:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{cursor:'grab',fontSize:16,color:C.textMuted,userSelect:'none',marginRight:4}}>:::</span>
                <span style={{fontWeight:700,fontSize:15}}>{getEventLabel(me.evt)}</span>
                <span style={{fontSize:10,color:C.textMuted}}>{me.evt.eventType} - {me.evt.entryType}</span>
              </div>
              <div style={{display:'flex',gap:6}}>
                <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 14px'}} onClick={()=>{setEditEntryIdx(null);setShowEntryModal(me.eventId);}}>+ Entry</button>
                {hasEntries && <button style={{...S.btn,...S.btnPrimary,fontSize:12,padding:'6px 14px'}} onClick={()=>goToRecord(me)}>Record All</button>}
                {selCount(me.eventId)>0 && <button style={{...S.btn,background:C.blue,color:C.white,fontSize:12,padding:'6px 14px'}} onClick={()=>goToRecordSelected(me)}>Record {selCount(me.eventId)}</button>}
              </div>
            </div>
            {hasEntries && (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr><th style={{...S.th,width:28}}></th><th style={S.th}>Athlete</th><th style={S.th}>PR</th><th style={S.th}>Goal</th><th style={{...S.th,width:70}}></th></tr></thead>
                <tbody>
                  {entries.map((en,ei) => {
                    const isChecked = !!((selectedForTimer[me.eventId]||{})[ei]);
                    if(me.evt.entryType === 'Relay') {
                      return [
                        <tr key={`${ei}-header`} style={{background:C.accentMuted}}>
                          <td style={{...S.td,borderBottom:`2px solid ${C.accent}`,padding:'6px 8px'}}><input type="checkbox" checked={isChecked} onChange={()=>toggleSelect(me.eventId,ei)} /></td>
                          <td colSpan={2} style={{...S.td,fontWeight:700,fontSize:11,color:C.accent,textTransform:'uppercase',borderBottom:`2px solid ${C.accent}`,padding:'6px 12px'}}>Relay #{ei+1}</td>
                          <td style={{...S.td,borderBottom:`2px solid ${C.accent}`,padding:'6px 12px'}}><div style={{display:'flex',gap:4}}><button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'2px 6px'}} onClick={()=>{setEditEntryIdx(ei);setShowEntryModal(me.eventId);}}>Edit</button><button style={{...S.btn,...S.btnDanger,fontSize:10,padding:'2px 6px'}} onClick={()=>saveEntries(me.eventId,entries.filter((_,i)=>i!==ei))}>✕</button></div></td>
                        </tr>,
                        ...(en.athletes||[]).map((a,ai) => {
                          const ath = data.athletes.find(at=>at.id===a.athleteId);
                          const pr = getAthletePR(a.athleteId, me.eventId);
                          return (
                            <tr key={`${ei}-${ai}`}>
                              <td style={S.td}></td>
                              <td style={{...S.td,paddingLeft:16}}><span style={{fontSize:10,color:C.textMuted,marginRight:6}}>Leg {ai+1}</span>{ath?athDisplay(ath):'-'}</td>
                              <td style={S.td}>{pr ? formatTime(pr.timeMs) : '-'}</td>
                              <td style={S.td}>{a.goalMs ? formatTime(a.goalMs) : '-'}</td>
                              <td style={S.td}></td>
                            </tr>
                          );
                        }),
                        ...((en.alternates||[]).length>0 ? [
                          <tr key={`${ei}-alt-header`}><td style={S.td}></td><td colSpan={4} style={{...S.td,fontSize:10,fontWeight:600,color:C.textMuted,fontStyle:'italic',padding:'4px 12px'}}>Alternates</td></tr>,
                          ...(en.alternates||[]).map((a,ai) => {
                            const ath = data.athletes.find(at=>at.id===a.athleteId);
                            return (<tr key={`${ei}-alt-${ai}`} style={{opacity:0.6}}><td style={S.td}></td><td style={{...S.td,paddingLeft:16,fontStyle:'italic'}}>{ath?athDisplay(ath):'-'}</td><td style={S.td}></td><td style={S.td}></td><td style={S.td}></td></tr>);
                          })
                        ] : [])
                      ];
                    }
                    const ath = data.athletes.find(a=>a.id===en.athleteId);
                    const pr = getAthletePR(en.athleteId, me.eventId);
                    return (
                      <tr key={ei}>
                        <td style={{...S.td,padding:'6px 8px'}}><input type="checkbox" checked={isChecked} onChange={()=>toggleSelect(me.eventId,ei)} /></td>
                        <td style={{...S.td,fontWeight:500}}>{ath?athDisplay(ath):'-'}</td>
                        <td style={S.td}>{pr ? (isFieldEvent(me.evt) ? fieldToStr(pr.ft,pr.inch,pr.qtr) : formatTime(pr.timeMs)) : '-'}</td>
                        <td style={S.td}>{en.goalMs ? formatTime(en.goalMs) : '-'}</td>
                        <td style={S.td}><div style={{display:'flex',gap:4}}><button style={{...S.btn,...S.btnSecondary,fontSize:10,padding:'2px 6px'}} onClick={()=>{setEditEntryIdx(ei);setShowEntryModal(me.eventId);}}>Edit</button><button style={{...S.btn,...S.btnDanger,fontSize:10,padding:'2px 6px'}} onClick={()=>saveEntries(me.eventId,entries.filter((_,i)=>i!==ei))}>✕</button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
      {!filtered.length && <div style={{...S.card,textAlign:'center',padding:20,color:C.textMuted}}>No events match your filters.</div>}
      </>)}
      {meetTab==='athletes' && (()=>{
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
            return (
              <div key={a.id} style={{...S.card,padding:'10px 14px',borderLeft:myEvents.length>0?`3px solid ${C.success}`:`3px solid ${C.border}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
                    <span style={{fontWeight:600,fontSize:14,color:C.text}}>{athDisplay(a)}</span>
                    {a.gradYear&&<span style={{color:C.textMuted,fontSize:12,marginLeft:6}}>'{(a.gradYear+'').slice(-2)}</span>}
                    <span style={{fontSize:11,color:a.gender==='M'?C.blue:'#d53f8c',marginLeft:6}}>{a.gender==='M'?'B':'G'}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:myEvents.length>0?C.success:C.textMuted}}>{myEvents.length} event{myEvents.length!==1?'s':''}</span>
                </div>
                {myEvents.length>0 && (
                  <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:6}}>
                    {myEvents.map((me,i)=>(
                      <span key={i} style={{fontSize:10,padding:'2px 8px',borderRadius:12,fontWeight:600,background:me.role==='Alternate'?C.surface2:me.role==='Relay'?C.accentMuted:C.successMuted,color:me.role==='Alternate'?C.textMuted:me.role==='Relay'?C.accent:C.success,border:`1px solid ${me.role==='Alternate'?C.border:me.role==='Relay'?C.accent:C.success}`}}>{getEventLabel(me.evt)}{me.role==='Relay'?' (R)':me.role==='Alternate'?' (Alt)':''}</span>
                    ))}
                  </div>
                )}
                {myEvents.length===0 && <div style={{fontSize:11,color:C.danger,marginTop:4,fontStyle:'italic'}}>No events assigned</div>}
              </div>
            );
          })}
        </div>);
      })()}
      <MeetEntryModal data={data} save={save} meetId={meetId} eventId={showEntryModal} events={events} open={!!showEntryModal} onClose={()=>{setShowEntryModal(null);setEditEntryIdx(null);}} getAthletePR={getAthletePR} saveEntries={saveEntries} editEntryIdx={editEntryIdx} />
    </div>
  );
}
function MeetEntryModal({ data, save, meetId, eventId, events, open, onClose, getAthletePR, saveEntries, editEntryIdx }) {
  const [entries, setEntries] = useState([{ athleteId:'', search:'', goalMin:0, goalSec:0 }]);
  const [relayAthletes, setRelayAthletes] = useState([{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 }]);
  const [relayAlternates, setRelayAlternates] = useState([]);
  const [focusField, setFocusField] = useState('');
  const [dragLeg, setDragLeg] = useState(null);
  const [dragOverLeg, setDragOverLeg] = useState(null);
  const initRef = useRef(null);
  const blurRef = useRef(null);
  const handleFocus = (f) => { clearTimeout(blurRef.current); setFocusField(f); };
  const handleBlur = () => { blurRef.current = setTimeout(()=>setFocusField(''), 200); };
  if(!open || !eventId) return null;
  const evt = events.find(e=>e.id===eventId);
  if(!evt) return null;
  const meet = data.meets.find(m=>m.id===meetId);
  const me = ((meet||{}).events||[]).find(e=>e.eventId===eventId);
  const existingEntries = (me||{}).entries || [];
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
          return {athleteId:a.athleteId,search:ath?athDisplay(ath):'',goalMin:Math.floor(ms/60000)+'',goalSec:((ms%60000)/1000).toFixed(2)};
        }));
        setRelayAlternates((en.alternates||[]).map(a=>{
          const ath=data.athletes.find(at=>at.id===a.athleteId);
          return {athleteId:a.athleteId,search:ath?athDisplay(ath):''};
        }));
      } else if(en && en.athleteId) {
        const ath=data.athletes.find(a=>a.id===en.athleteId);
        const ms=en.goalMs||0;
        setEntries([{athleteId:en.athleteId,search:ath?athDisplay(ath):'',goalMin:Math.floor(ms/60000)+'',goalSec:((ms%60000)/1000).toFixed(2)}]);
      }
    } else {
      setEntries([{ athleteId:'', search:'', goalMin:0, goalSec:0 }]);
      setRelayAthletes([{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 }]);
      setRelayAlternates([]);
    }
  }
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const genderMatch = activeAthletes.filter(a=>!evt.gender || evt.gender==='Mixed' || a.gender===(evt.gender==='Boy'?'M':'F'));
  const athName = (a) => athDisplay(a);
  const saveIndividuals = () => {
    const valid = entries.filter(en=>en.athleteId);
    if(!valid.length) return;
    const newEntries = valid.map(en=>({ athleteId:en.athleteId, goalMs:parseTimeToMs(en.goalMin, en.goalSec) }));
    if(isEditing) {
      const updated = [...existingEntries]; updated[editEntryIdx] = newEntries[0];
      saveEntries(eventId, updated);
    } else {
      saveEntries(eventId, [...existingEntries, ...newEntries]);
    }
    initRef.current = null;
    setEntries([{ athleteId:'', search:'', goalMin:0, goalSec:0 }]);
    onClose();
  };
  const saveRelay = () => {
    const athletes = relayAthletes.filter(a=>a.athleteId).map(a=>({ athleteId:a.athleteId, goalMs:parseTimeToMs(a.goalMin,a.goalSec) }));
    const alternates = relayAlternates.filter(a=>a.athleteId).map(a=>({ athleteId:a.athleteId }));
    if(!athletes.length) return;
    if(isEditing) {
      const updated = [...existingEntries]; updated[editEntryIdx] = { athletes, alternates };
      saveEntries(eventId, updated);
    } else {
      saveEntries(eventId, [...existingEntries, { athletes, alternates }]);
    }
    initRef.current = null;
    setRelayAthletes([{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 },{ athleteId:'', search:'', goalMin:0, goalSec:0 }]);
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
  const filteredAthletes = (search, excludeIds=[]) => genderMatch.filter(a=>
    !excludeIds.includes(a.id) && (!search || athSearch(a, search))
  );
  const renderRow = (row, index, fieldPrefix, rows, setRows, excludeIds) => {
    const fieldName = `${fieldPrefix}-${index}`;
    const opts = filteredAthletes(row.search, excludeIds);
    const pr = row.athleteId ? getAthletePR(row.athleteId, eventId) : null;
    return (
      <div key={index} style={{display:'flex',gap:6,alignItems:'flex-start',marginBottom:8}}>
        <span style={{fontSize:12,fontWeight:700,color:C.accent,width:24,paddingTop:10,textAlign:'center'}}>{index+1}</span>
        <div style={{flex:1,position:'relative'}}>
          <input style={{...S.input,padding:'10px 12px',fontSize:14}} placeholder="Type athlete name..." value={row.search} onChange={e=>{const c=[...rows];c[index]={...c[index],search:e.target.value,athleteId:''};setRows(c);}} onFocus={()=>handleFocus(fieldName)} onBlur={handleBlur} />
          {focusField===fieldName && opts.length>0 && (
            <div style={{position:'absolute',top:'100%',left:0,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:20,maxHeight:200,overflowY:'auto'}}>
              {opts.map(a=>{
                const aPr = getAthletePR(a.id, eventId);
                return <div key={a.id} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',borderBottom:`1px solid ${C.borderLight}`,display:'flex',justifyContent:'space-between'}} onMouseDown={()=>{const c=[...rows];c[index]={...c[index],athleteId:a.id,search:athName(a)};setRows(c);setFocusField('');}}>
                  <span>{athName(a)}{a.gradYear&&<span style={{color:C.textMuted,marginLeft:6,fontSize:12}}>{"'"+((a.gradYear+'').slice(-2))}</span>}</span>
                  {aPr && <span style={{fontSize:12,color:C.accent}}>{isFieldEvent(evt)?fieldToStr(aPr.ft,aPr.inch,aPr.qtr):formatTime(aPr.timeMs)}</span>}
                </div>;
              })}
            </div>
          )}
          {row.athleteId && pr && <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>PR: {isFieldEvent(evt)?fieldToStr(pr.ft,pr.inch,pr.qtr):formatTime(pr.timeMs)}</div>}
        </div>
        {isTrackEvent(evt) && <TimeDropdown min={row.goalMin} sec={row.goalSec} onMinChange={v=>{const c=[...rows];c[index]={...c[index],goalMin:v};setRows(c);}} onSecChange={v=>{const c=[...rows];c[index]={...c[index],goalSec:v};setRows(c);}} compact />}
        {rows.length>1 && <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:16,padding:'8px 4px'}} onClick={()=>{const c=[...rows];c.splice(index,1);setRows(c);}}>✕</button>}
      </div>
    );
  };
  return (
    <Modal open={open} onClose={()=>{initRef.current=null;onClose();}} width={550}>
      <h2 style={S.h2}>{isEditing?'Edit':'Add'} - {getEventLabel(evt)}</h2>
      <p style={{fontSize:13,color:C.textSecondary,marginBottom:16}}>{(meet||{}).name}</p>
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
            <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 16px'}} onClick={()=>setRelayAthletes([...relayAthletes,{athleteId:'',search:'',goalMin:0,goalSec:0}])}>+ Leg</button>
          </div>
          <div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${C.borderLight}`}}>
            <div style={{fontSize:13,fontWeight:600,color:C.textMuted,marginBottom:8}}>Alternates</div>
            {relayAlternates.map((alt,i) => {
              const allUsed = [...relayAthletes.map(r=>r.athleteId),...relayAlternates.filter((_,j)=>j!==i).map(r=>r.athleteId)].filter(Boolean);
              return renderRow(alt, i, 'alt', relayAlternates, setRelayAlternates, allUsed);
            })}
            <button style={{...S.btn,...S.btnSecondary,fontSize:11,padding:'6px 14px'}} onClick={()=>setRelayAlternates([...relayAlternates,{athleteId:'',search:'',goalMin:0,goalSec:0}])}>+ Alternate</button>
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
            {!isEditing&&<button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'8px 16px'}} onClick={()=>setEntries([...entries,{athleteId:'',search:'',goalMin:0,goalSec:0}])}>+ Athlete</button>}
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
                <tr key={a.id} style={{cursor:'pointer'}} onClick={()=>nav('athleteSub',{athleteId:a.id})}>
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
function AthleteSubPage({ data, save, nav, athleteId, events, getAthletePR, checkRecord, checkQualifying, season }) {
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [progressForm, setProgressForm] = useState({});
  const [noteForm, setNoteForm] = useState({ type:'Other', effectiveDate:'', details:'', painScale:'', trainerCheckIn:false, trainerDate:'', trainerDetails:'', needFollowUp:false, followUpName:'', followUpContact:'', followUpLastDate:'', followUpResolution:'' });
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
  const athleteResults = data.results.filter(r=>r.athleteId===athleteId);
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
    setNoteForm({ type:'Other', effectiveDate:'', details:'', painScale:'', trainerCheckIn:false, trainerDate:'', trainerDetails:'', needFollowUp:false, followUpName:'', followUpContact:'', followUpLastDate:'', followUpResolution:'' });
  };
  const startEditNote = (n) => {
    setNoteForm({type:n.type||'Other',effectiveDate:n.effectiveDate||'',details:n.details||'',painScale:n.painScale||'',trainerCheckIn:!!n.trainerCheckIn,trainerDate:n.trainerDate||'',trainerDetails:n.trainerDetails||'',needFollowUp:!!n.needFollowUp,followUpName:n.followUpName||'',followUpContact:n.followUpContact||'',followUpLastDate:n.followUpLastDate||'',followUpResolution:n.followUpResolution||''});
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
    const name = editForm.name || `${editForm.firstName} ${editForm.lastName}`.trim();
    save({ ...data, athletes:data.athletes.map(a=>a.id===athleteId?{...a,...editForm,name,active:editForm.active}:a) });
    setShowEditInfo(false);
  };
  const sortedAthletes = data.athletes.filter(a=>a.active!==false).sort((a,b)=>athLast(a).localeCompare(athLast(b))||athFirst(a).localeCompare(athFirst(b)));
  const curIdx = sortedAthletes.findIndex(a=>a.id===athleteId);
  const prevAthlete = curIdx > 0 ? sortedAthletes[curIdx-1] : null;
  const nextAthlete = curIdx < sortedAthletes.length-1 ? sortedAthletes[curIdx+1] : null;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <button style={S.backLink} onClick={()=>nav('athletes')}>{"<- All Athletes"}</button>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'8px 16px',borderRadius:8,opacity:prevAthlete?1:0.3,display:'flex',flexDirection:'column',alignItems:'center',lineHeight:1.2}} disabled={!prevAthlete} onClick={()=>prevAthlete&&nav('athleteSub',{athleteId:prevAthlete.id})}>
            {"<- Prev"}{prevAthlete&&<span style={{fontSize:10,fontWeight:400,textTransform:'none',letterSpacing:0}}>{athDisplay(prevAthlete)}</span>}
          </button>
          <span style={{fontSize:12,color:C.textMuted,fontWeight:600,minWidth:50,textAlign:'center'}}>{curIdx+1} / {sortedAthletes.length}</span>
          <button style={{...S.btn,...S.btnSecondary,fontSize:13,padding:'8px 16px',borderRadius:8,opacity:nextAthlete?1:0.3,display:'flex',flexDirection:'column',alignItems:'center',lineHeight:1.2}} disabled={!nextAthlete} onClick={()=>nextAthlete&&nav('athleteSub',{athleteId:nextAthlete.id})}>
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
          const typeColor = n.type==='Injury'?C.danger:n.type==='Illness'?'#b8860b':n.type==='Medical Clearance'?C.success:C.blue;
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
                    <span style={{fontSize:11,color:C.textMuted}}>{n.effectiveDate||n.entryDate}</span>
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
                  <option>Injury</option><option>Illness</option><option>Medical Clearance</option><option>Other</option>
                </select></div>
                <div><label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Effective Date</label><input style={S.input} type="date" value={noteForm.effectiveDate} onChange={e=>setNoteForm({...noteForm,effectiveDate:e.target.value})} /></div>
              </div>
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
              {(()=>{
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
                    const barColor=met?C.success:pct>=90?'#b8860b':C.accent;
                    return (<div key={std.id} style={{display:'flex',alignItems:'center',gap:8,fontSize:11}}>
                      <span style={{width:70,color:C.textMuted,flexShrink:0}}>{std.name}</span>
                      <div style={{flex:1,height:6,background:C.surface2,borderRadius:3,overflow:'hidden'}}>
                        <div style={{width:pct+'%',height:'100%',background:barColor,borderRadius:3,transition:'width 0.3s'}} />
                      </div>
                      <span style={{width:80,textAlign:'right',flexShrink:0,fontWeight:600,color:met?C.success:pct>=90?'#b8860b':C.textMuted}}>{diffStr}</span>
                    </div>);
                  })}
                </div>);
              })()}
            </div>
          );
        })}
        {athleteEvents.filter(evt=>athleteResults.some(r=>r.eventId===evt.id)).length === 0 && (
          <p style={{color:C.textMuted,fontSize:13,textAlign:'center',padding:12}}>No results yet</p>
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
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:50}} type="number" placeholder="ft" value={resultForm.ft} onChange={e=>setResultForm({...resultForm,ft:e.target.value})} /><span style={{fontSize:12,color:C.textMuted}}>'</span></div>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:50}} type="number" placeholder="in" value={resultForm.inch} onChange={e=>setResultForm({...resultForm,inch:e.target.value})} /><span style={{fontSize:12,color:C.textMuted}}>"</span></div>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:60}} type="number" step="0.25" placeholder=".00" value={resultForm.qtr} onChange={e=>setResultForm({...resultForm,qtr:e.target.value})} /></div>
              </div>
            </div>
          ) : resultForm.eventId ? (
            <div>
              <label style={{fontSize:12,color:C.textSecondary,display:'block',marginBottom:4}}>Time</label>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:50}} type="number" placeholder="min" value={resultForm.min} onChange={e=>setResultForm({...resultForm,min:e.target.value})} /><span style={{fontSize:12,color:C.textMuted}}>:</span></div>
                <div style={{display:'flex',alignItems:'center',gap:2}}><input style={{...S.input,width:70}} type="number" step="0.01" placeholder="sec" value={resultForm.sec} onChange={e=>setResultForm({...resultForm,sec:e.target.value})} /></div>
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
              total += parseFloat(e.mileage)||0;
              const m = parseFloat(e.distance)||0;
              if(m>0) total += m/1609.34;
              (e.exercises||[]).forEach(ex=>{
                total += parseFloat(ex.mileage)||0;
                const em = parseFloat(ex.distance)||0;
                if(em>0) total += em/1609.34;
              });
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
                      const dayMi = rest?0:items.reduce((t,e)=>{let s=parseFloat(e.mileage)||0;(e.exercises||[]).forEach(ex=>{s+=parseFloat(ex.mileage)||0;});return t+s;},0);
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
                          {exercises.length > 0 && (
                            <div style={{overflowX:'auto'}}>
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
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:[...(w.entries||[]),{id:uid(),groupId:gid,level:lv,day,...item}]})});
  };
  const removeDayItem = (wid,iid) => save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).filter(e=>e.id!==iid)})});
  const updateDayItem = (wid,iid,updates) => save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).map(e=>e.id===iid?{...e,...updates}:e)})});
  const replaceDayItem = (wid,iid,newWorkout) => {
    save({...data, workoutPlans:(data.workoutPlans||[]).map(w=>w.id!==wid?w:{...w,entries:(w.entries||[]).map(e=>e.id!==iid?e:{...e,name:newWorkout.name,category:newWorkout.category||(newWorkout.categories||[])[0]||'',type:newWorkout.type||'',description:newWorkout.description||'',exercises:newWorkout.exercises||[],mileage:newWorkout.mileage||'',time:newWorkout.time||'',distance:newWorkout.distance||'',sets:newWorkout.sets||'',reps:newWorkout.reps||'',weight:newWorkout.weight||'',effort:newWorkout.effort||''})})});
    setReplaceItemId(null);
    setReplaceSearch('');
  };
  const [replaceItemId, setReplaceItemId] = useState(null);
  const [replaceSearch, setReplaceSearch] = useState('');
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
    const items=(((data.workoutPlans||[]).find(w=>w.id===wid)||{}).entries||[]).filter(e=>e.groupId===gid&&e.level===lv);
    let total = 0;
    items.forEach(e => {
      total += parseFloat(e.mileage) || 0;
      const topMeters = parseFloat(e.distance) || 0;
      if(topMeters > 0) total += topMeters / METERS_PER_MILE;
      (e.exercises||[]).forEach(ex => {
        total += parseFloat(ex.mileage) || 0;
        const exMeters = parseFloat(ex.distance) || 0;
        if(exMeters > 0) total += exMeters / METERS_PER_MILE;
      });
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
            const groupTotalMi = group.levels.reduce((s,lv)=>s+getWeekMileage(curWeek.id,group.id,lv),0);
            const prevWeek = curWeekIdx>0 ? plans[curWeekIdx-1] : null;
            const prevMi = prevWeek ? group.levels.reduce((s,lv)=>s+getWeekMileage(prevWeek.id,group.id,lv),0) : 0;
            const pctDiff = prevMi>0 ? ((groupTotalMi-prevMi)/prevMi)*100 : null;
            return (<div key={group.id} style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <h3 style={{fontSize:14,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'0.04em',margin:0,fontFamily:HEADING_FONT}}>{group.name}</h3>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                {groupTotalMi>0&&<span style={{fontSize:13,color:C.accent,fontWeight:700,background:C.accentMuted,padding:'3px 10px',borderRadius:12}}>{groupTotalMi.toFixed(2)} mi</span>}
                {groupTotalMi>0&&pctDiff!==null&&<span style={{fontSize:11,fontWeight:600,color:pctDiff>0?C.success:pctDiff<0?C.danger:C.textMuted,padding:'2px 8px',borderRadius:10,background:pctDiff>0?C.successMuted:pctDiff<0?C.dangerMuted:C.surface2}}>{pctDiff>0?'^':pctDiff<0?'v':'='} {Math.abs(pctDiff).toFixed(0)}%</span>}
              </div>
            </div>
            {group.levels.map(level=>{
              const mi=getWeekMileage(curWeek.id,group.id,level);
              return (<div key={level} style={{...S.card,padding:'12px 16px',marginBottom:6}}>
                {group.levels.length>1&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12,fontWeight:600}}>{level}</span>{mi>0&&<span style={{fontSize:11,color:C.accent,fontWeight:600}}>{mi.toFixed(2)} mi</span>}</div>}
                <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch',margin:'0 -4px',padding:'0 4px'}}>
                <div style={{display:'grid',gridTemplateColumns:`repeat(${DAYS.length},minmax(85px,1fr))`,gap:4}}>
                  {DAYS.map((day,dayIdx)=>{
                    const items=getDayItems(curWeek.id,group.id,level,day);
                    const rest=isRestDay(curWeek.id,group.id,level,day);
                    const ws = padDate(curWeek.startDate);
                    const cellDate = (()=>{ const d=new Date(ws+'T12:00:00'); d.setDate(d.getDate()+dayIdx); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();
                    const meet = data.meets.find(m=>{ const sd=padDate(m.startDate||m.date||''); const ed=padDate(m.endDate||m.startDate||m.date||''); return sd&&cellDate>=sd&&cellDate<=ed; });
                    const dayMi = items.reduce((t,e)=>{let s=parseFloat(e.mileage)||0;const tm=parseFloat(e.distance)||0;if(tm>0)s+=tm/METERS_PER_MILE;(e.exercises||[]).forEach(ex=>{s+=parseFloat(ex.mileage)||0;const em=parseFloat(ex.distance)||0;if(em>0)s+=em/METERS_PER_MILE;});return t+s;},0);
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
                      <button style={{...S.btn,...S.btnSecondary,fontSize:12,padding:'6px 12px',borderRadius:8}} onClick={()=>{if(replaceItemId===item.id){setReplaceItemId(null);setReplaceSearch('');}else{setReplaceItemId(item.id);setReplaceSearch('');}}}>{replaceItemId===item.id?'Cancel':'Replace'}</button>
                      <button style={{...S.btn,...S.btnDanger,fontSize:12,padding:'6px 12px',borderRadius:8}} onClick={()=>removeDayItem(editingDay.weekId,item.id)}>Remove</button>
                    </div>
                  </div>
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
                  {(item.exercises||[]).length>0&&(
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
                  {(item.exercises||[]).length===0&&(item.mileage||item.time||item.distance||item.sets||item.reps||item.weight||item.effort)&&(
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
  const [form, setForm] = useState({ name:'', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time' });
  const [delId, setDelId] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showAddStandard, setShowAddStandard] = useState(null);
  const [stdForm, setStdForm] = useState({ name:'', timeMs:0, ft:0, inch:0, qtr:0, min:0, sec:0 });
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
  const addEvent = () => {
    if(!form.name) return;
    if(editId) { save({...data, events:(data.events||[]).map(e=>e.id===editId?{...e,...form}:e)}); setEditId(null); }
    else { save({...data, events:[...(data.events||[]),{id:uid(),...form,qualifyingStandards:[],schoolRecords:[]}]}); }
    setShowAdd(false); setForm({ name:'', eventType:'Track', entryType:'Individual', gender:'Boy', trackType:'Both', measurableType:'Time' });
  };
  const startEdit = (evt) => {
    setForm({ name:evt.name, eventType:evt.eventType, entryType:evt.entryType, gender:evt.gender, trackType:evt.trackType, measurableType:evt.measurableType });
    setEditId(evt.id); setShowAdd(true);
  };
  const deleteEvent = () => { save({...data, events:(data.events||[]).filter(e=>e.id!==delId)}); setDelId(null); };
  const addStandard = (eventId) => {
    const timeMs = parseTimeToMs(stdForm.min, stdForm.sec);
    const std = { id:uid(), name:stdForm.name, timeMs, ft:parseInt(stdForm.ft)||0, inch:parseInt(stdForm.inch)||0, qtr:parseFloat(stdForm.qtr)||0 };
    save({...data, events:(data.events||[]).map(e=>e.id===eventId?{...e,qualifyingStandards:[...(e.qualifyingStandards||[]),std]}:e)});
    setShowAddStandard(null); setStdForm({ name:'', timeMs:0, ft:0, inch:0, qtr:0, min:0, sec:0 });
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
        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>{setForm({name:'',eventType:'Track',entryType:'Individual',gender:'Boy',trackType:'Both',measurableType:'Time'});setEditId(null);setShowAdd(true);}}>+ Add Event</button>
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
                        {(evt.qualifyingStandards||[]).map(std=>(
                          <div key={std.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0',fontSize:12}}>
                            <span><span style={{fontWeight:600}}>{std.name}</span> - {evt.measurableType==='Time'?formatTime(std.timeMs):fieldToStr(std.ft,std.inch,std.qtr)}</span>
                            <button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontSize:12}} onClick={()=>removeStandard(evt.id,std.id)}>✕</button>
                          </div>
                        ))}
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
          <button style={{...S.btn,...S.btnPrimary}} onClick={addEvent}>{editId?'Save Changes':'Add Event'}</button>
        </div>
      </Modal>
      <Modal open={!!showAddStandard} onClose={()=>setShowAddStandard(null)} width={400}>
        <h2 style={S.h2}>Add Qualifying Standard</h2>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
          <input style={S.input} placeholder="Standard name (e.g. Automatic, Provisional)" value={stdForm.name} onChange={e=>setStdForm({...stdForm,name:e.target.value})} />
          {(()=>{const evt=(data.events||[]).find(e=>e.id===showAddStandard);
            return (evt||{}).measurableType==='Time' ? <TimeDropdown min={stdForm.min} sec={stdForm.sec} onMinChange={v=>setStdForm({...stdForm,min:v})} onSecChange={v=>setStdForm({...stdForm,sec:v})} label="Time" /> : <FieldMeasure ft={stdForm.ft} inch={stdForm.inch} qtr={stdForm.qtr} onFtChange={v=>setStdForm({...stdForm,ft:v})} onInchChange={v=>setStdForm({...stdForm,inch:v})} onQtrChange={v=>setStdForm({...stdForm,qtr:v})} />;
          })()}
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
function MultiSplitTimer({ data, save, nav, events, addResult, getAthletePR, checkRecord, preset }) {
  const [meetId, setMeetId] = useState((preset||{}).meetId||'');
  const [eventId, setEventId] = useState((preset||{}).eventId||'');
  const [trackType, setTrackType] = useState('Outdoor');
  const [athletes, setAthletes] = useState(() => {
    const ids = (preset||{}).athleteIds||[];
    const entries = (preset||{}).entries||[];
    if(ids.length>0) return ids.map(id=>{const en=entries.find(e=>e.athleteId===id||(e.athletes||[]).some(a=>a.athleteId===id));const goalMs=(en||{}).goalMs||(((en||{}).athletes||[]).find(a=>a.athleteId===id)||{}).goalMs||0;return{id:uid(),athleteId:id,laps:[],goalMs};});
    return [{id:uid(),athleteId:'',laps:[],goalMs:0},{id:uid(),athleteId:'',laps:[],goalMs:0}];
  });
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);
  const evt = events.find(e=>e.id===eventId);
  const lapDist = trackType==='Indoor'?INDOOR_LAP:OUTDOOR_LAP;
  const totalDist = getDistance(evt);
  const totalLaps = totalDist>0?Math.ceil(totalDist/lapDist):999;
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
    const relayAthleteIds=[];
    athletes.forEach(at=>{
      if(!at.athleteId||at.laps.length===0) return;
      const finalTime=at.laps[at.laps.length-1].cumulative;
      addResult({id:uid(),athleteId:at.athleteId,eventId,meetId:saveMeetId,date:raceDate,timeMs:finalTime,splits:at.laps,isPractice:isPractice});
      relayAthleteIds.push(at.athleteId);
    });
    if(isRelayEvt&&relayAthleteIds.length>0){
      const allLaps=athletes.filter(a=>a.athleteId&&a.laps.length>0).flatMap(a=>a.laps);
      const totalTime=Math.max(...allLaps.map(l=>l.cumulative));
      addResult({id:uid(),eventId,meetId:saveMeetId,date:raceDate,timeMs:totalTime,isRelay:true,relayAthletes:relayAthleteIds,splits:allLaps,isPractice:isPractice});
    }
    setSaved(true);
  };
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const trackEvents = events.filter(e=>isTrackEvent(e));
  const gender = (evt||{}).gender;
  return (
    <div>
      <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back</button>
      <h1 style={S.h1}>Multi-Split Timer</h1>
      {!collapsed && (
        <div style={S.card}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Meet (or Practice)</label><select style={{...S.select,width:'100%'}} value={meetId} onChange={e=>setMeetId(e.target.value)}><option value="">Select</option><option value="practice">Practice (Today)</option><option value="practice-custom">Practice (Custom Date)</option>{data.meets.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Event</label><select style={{...S.select,width:'100%'}} value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select</option>{trackEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Track</label><select style={{...S.select,width:'100%'}} value={trackType} onChange={e=>setTrackType(e.target.value)}><option>Indoor</option><option>Outdoor</option></select></div>
            {meetId==='practice-custom'&&<div><label style={{fontSize:12,color:C.textSecondary}}>Practice Date</label><input style={{...S.input}} type="date" id="practiceDate" defaultValue={new Date().toISOString().split('T')[0]} /></div>}
          </div>
          <div style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:14,fontWeight:600,color:C.textSecondary}}>Athletes</span>
              <button style={{...S.btn,...S.btnSecondary,padding:'4px 12px',fontSize:12}} onClick={()=>setAthletes(a=>[...a,{id:uid(),athleteId:'',laps:[],goalMs:0}])}>+ Add</button>
            </div>
            {athletes.map((at,i)=>(
              <div key={at.id} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center',flexWrap:'wrap'}}>
                <div style={{width:8,height:32,borderRadius:4,background:COLORS[i%COLORS.length],flexShrink:0}} />
                <select style={{...S.select,flex:1,minWidth:120}} value={at.athleteId} onChange={e=>{const c=[...athletes];c[i]={...c[i],athleteId:e.target.value};setAthletes(c);}}>
                  <option value="">Athlete {i+1}</option>
                  {activeAthletes.filter(a=>!gender||gender==='Mixed'||a.gender===(gender==='Boy'?'M':'F')).map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}
                </select>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:10,color:C.textMuted}}>Target</span>
                  <select style={{...S.select,width:50,padding:'4px 2px',fontSize:12}} value={Math.floor((at.goalMs||0)/60000)} onChange={e=>{const c=[...athletes];const oldSec=((at.goalMs||0)%60000)/1000;c[i]={...c[i],goalMs:(parseInt(e.target.value)*60+oldSec)*1000};setAthletes(c);}}>
                    {Array.from({length:31},(_,n)=><option key={n} value={n}>{n}</option>)}
                  </select>
                  <span style={{fontSize:12,color:C.textMuted}}>:</span>
                  <select style={{...S.select,width:60,padding:'4px 2px',fontSize:12}} value={(((at.goalMs||0)%60000)/1000).toFixed(2)} onChange={e=>{const c=[...athletes];const min=Math.floor((at.goalMs||0)/60000);c[i]={...c[i],goalMs:(min*60+parseFloat(e.target.value))*1000};setAthletes(c);}}>
                    {Array.from({length:60},(_,n)=><option key={n} value={n.toFixed(2)}>{String(n).padStart(2,'0')}</option>)}
                  </select>
                </div>
                {athletes.length>1&&<button style={{background:'none',border:'none',color:C.danger,cursor:'pointer',flexShrink:0}} onClick={()=>setAthletes(a=>a.filter((_,j)=>j!==i))}>✕</button>}
              </div>
            ))}
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
      <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
        {!running&&!finished&&<button style={{...S.btn,...S.btnPrimary,fontSize:18,padding:'14px 40px'}} onClick={handleStart}>> Start</button>}
        {running&&<>
          {athletes.map((at,i)=>{
            const athObj=data.athletes.find(a=>a.id===at.athleteId);
            const done=at.laps.length>=(isRelayEvt?legsPerAthlete:totalLaps);
            const currentLap=at.laps.length;
            let paceLabel='';
            if(at.goalMs&&totalLaps>0&&totalLaps<999&&currentLap>0){const targetPerLap=at.goalMs/totalLaps;const diff=at.laps[currentLap-1].cumulative-targetPerLap*currentLap;paceLabel=` ${formatDiff(diff)}`;}
            return (<button key={at.id} disabled={done} style={{...S.btn,background:done?C.surface2:COLORS[i%COLORS.length],color:C.white,fontSize:14,padding:'12px 20px',opacity:done?0.5:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}} onClick={()=>handleLap(i)}>
              <span>{(athObj||{}).name||`Ath ${i+1}`} (Lap {at.laps.length+1})</span>
              {paceLabel&&<span style={{fontSize:11,opacity:0.9}}>{paceLabel}</span>}
            </button>);
          })}
          <button style={{...S.btn,...S.btnDanger,fontSize:14,padding:'12px 20px'}} onClick={handleStop}>[] Stop</button>
        </>}
        {finished&&<>{!saved&&<button style={{...S.btn,...S.btnSuccess}} onClick={handleSave}>Save All</button>}<button style={{...S.btn,...S.btnDanger}} onClick={handleReset}>Reset</button></>}
        {saved&&<SavedIndicator saved={true} />}
      </div>
      {athletes.map((at,i)=>{
        if(at.laps.length===0) return null;
        const athObj=data.athletes.find(a=>a.id===at.athleteId);
        const athleteColor=COLORS[i%COLORS.length];
        const hasTarget=!!at.goalMs&&totalLaps>0&&totalLaps<999;
        const targetPerLap=hasTarget?at.goalMs/totalLaps:0;
        return (<div key={at.id} style={{...S.card,borderLeft:`4px solid ${athleteColor}`}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <h3 style={{fontSize:15,fontWeight:700,margin:0,color:athleteColor}}>{(athObj||{}).name||`Athlete ${i+1}`}</h3>
            {hasTarget&&<span style={{fontSize:11,color:C.textMuted,marginLeft:'auto'}}>Target: {formatTime(at.goalMs)}</span>}
          </div>
          {(()=>{
            const lapsCompleted=at.laps.length;
            const lapsRemaining=Math.max(0,(isRelayEvt?legsPerAthlete:totalLaps)-lapsCompleted);
            const avgSplit=lapsCompleted>0?at.laps[lapsCompleted-1].cumulative/lapsCompleted:0;
            const predictedFinish=lapsCompleted>0?at.laps[lapsCompleted-1].cumulative+avgSplit*lapsRemaining:0;
            return (<>
              {lapsCompleted>0&&totalLaps<999&&<div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:6,fontSize:11}}>
                <span style={{color:C.textMuted}}>Avg split: <strong style={{color:C.text}}>{formatTime(avgSplit)}</strong></span>
                {lapsRemaining>0&&<span style={{color:C.textMuted}}>Predicted: <strong style={{color:hasTarget&&predictedFinish>at.goalMs?C.danger:C.success}}>{formatTime(Math.round(predictedFinish))}</strong></span>}
                {hasTarget&&lapsRemaining>0&&<span style={{color:C.textMuted}}>Target: <strong>{formatTime(at.goalMs)}</strong></span>}
              </div>}
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr><th style={S.th}>Lap</th><th style={S.th}>Split</th><th style={S.th}></th><th style={S.th}>Cumulative</th>{hasTarget&&<th style={S.th}>Pace</th>}</tr></thead>
                <tbody>{at.laps.map((l,li)=>{
                  const prevSplit=li>0?at.laps[li-1].split:null;
                  const splitDiff=prevSplit!==null?l.split-prevSplit:0;
                  const isFaster=prevSplit!==null&&l.split<prevSplit;
                  const isSlower=prevSplit!==null&&l.split>prevSplit;
                  const paceDiff=hasTarget?l.cumulative-targetPerLap*l.lap:0;
                  return (<tr key={l.lap}>
                    <td style={S.td}><span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:28,padding:'2px 8px',borderRadius:20,fontSize:12,fontWeight:700,background:C.white,color:athleteColor,border:`2px solid ${athleteColor}`}}>{l.lap}</span></td>
                    <td style={S.td}>{formatTime(l.split)}</td>
                    <td style={{...S.td,fontSize:10,fontWeight:600,color:isFaster?C.success:isSlower?C.danger:C.textMuted,padding:'4px 2px'}}>{prevSplit!==null?(isFaster?'▼':'▲')+' '+formatDiff(splitDiff):''}</td>
                    <td style={S.td}>{formatTime(l.cumulative)}</td>
                    {hasTarget&&<td style={{...S.td,fontWeight:600,fontSize:12}}><span style={{color:paceDiff<=0?C.success:C.danger}}>{formatDiff(paceDiff)}</span></td>}
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
      <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back</button>
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
function RelayTimer({ data, save, nav, events, addResult, getAthletePR, preset }) {
  const [meetId, setMeetId] = useState((preset||{}).meetId||'');
  const [eventId, setEventId] = useState((preset||{}).eventId||'');
  const [trackType, setTrackType] = useState('Outdoor');
  const [legs, setLegs] = useState(()=>{
    const entries = (preset||{}).entries||[];
    const relay = entries.find(e=>e.athletes);
    if(relay) return relay.athletes.map(a=>({id:uid(),athleteId:a.athleteId,goalMs:a.goalMs||0,splitMs:null,cumMs:null}));
    const ids = (preset||{}).athleteIds||[];
    if(ids.length>0) return ids.map(id=>({id:uid(),athleteId:id,goalMs:0,splitMs:null,cumMs:null}));
    return [{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null}];
  });
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [activeLeg, setActiveLeg] = useState(0);
  const [finished, setFinished] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [saved2, setSaved2] = useState(false);
  const timerRef = useRef(null);
  const evt = events.find(e=>e.id===eventId);
  const lapDist = trackType==='Indoor'?INDOOR_LAP:OUTDOOR_LAP;
  const totalDist = getDistance(evt);
  const totalLaps = totalDist>0?Math.ceil(totalDist/lapDist):4;
  const lapsPerLeg = Math.ceil(totalLaps/legs.length);
  const COLORS = ['#2b6cb0','#c96a1f','#25763b','#c53030','#6b46c1','#b8860b'];
  const activeAthletes = data.athletes.filter(a=>a.active!==false);
  const trackEvents = events.filter(e=>isTrackEvent(e)&&e.entryType==='Relay');
  const gender = (evt||{}).gender;
  useEffect(()=>{
    if(running&&startTime){timerRef.current=setInterval(()=>setElapsed(Date.now()-startTime),10);return()=>clearInterval(timerRef.current);}
    return()=>clearInterval(timerRef.current);
  },[running,startTime]);
  const handleStart = ()=>{setStartTime(Date.now());setRunning(true);setElapsed(0);setActiveLeg(0);setFinished(false);setSaved2(false);setCollapsed(true);setLegs(l=>l.map(lg=>({...lg,splitMs:null,cumMs:null})));};
  const handleSplit = ()=>{
    if(!running) return;
    const now=Date.now();const cumMs=now-startTime;
    const prevCum=activeLeg>0?legs[activeLeg-1].cumMs||0:0;
    const splitMs=cumMs-prevCum;
    setLegs(prev=>{const c=[...prev];c[activeLeg]={...c[activeLeg],splitMs,cumMs};return c;});
    if(activeLeg>=legs.length-1){clearInterval(timerRef.current);setRunning(false);setElapsed(cumMs);setFinished(true);}
    else{setActiveLeg(activeLeg+1);}
  };
  const handleStop = ()=>{clearInterval(timerRef.current);setRunning(false);setFinished(true);};
  const handleReset = ()=>{clearInterval(timerRef.current);setRunning(false);setElapsed(0);setActiveLeg(0);setFinished(false);setSaved2(false);setCollapsed(false);setLegs(l=>l.map(lg=>({...lg,splitMs:null,cumMs:null})));};
  const handleSave = ()=>{
    const isPractice=meetId==='practice'||meetId==='practice-custom';
    const meet2=isPractice?null:data.meets.find(m=>m.id===meetId);
    const raceDate=isPractice?(meetId==='practice-custom'?(document.getElementById('relayPracticeDate')||{}).value||new Date().toISOString().split('T')[0]:new Date().toISOString().split('T')[0]):(meet2||{}).startDate||(meet2||{}).date||new Date().toISOString().split('T')[0];
    const saveMeetId=isPractice?null:meetId;
    const relayAthleteIds=[];
    const allSplits=[];
    legs.forEach((lg,i)=>{
      if(!lg.athleteId||lg.splitMs===null) return;
      addResult({id:uid(),athleteId:lg.athleteId,eventId,meetId:saveMeetId,date:raceDate,timeMs:lg.splitMs,splits:[{lap:i+1,split:lg.splitMs,cumulative:lg.cumMs}],isPractice});
      relayAthleteIds.push(lg.athleteId);
      allSplits.push({lap:i+1,split:lg.splitMs,cumulative:lg.cumMs});
    });
    if(relayAthleteIds.length>0){
      const totalTime=legs.filter(l=>l.cumMs!==null).reduce((m,l)=>Math.max(m,l.cumMs),0);
      addResult({id:uid(),eventId,meetId:saveMeetId,date:raceDate,timeMs:totalTime,isRelay:true,relayAthletes:relayAthleteIds,splits:allSplits,isPractice});
    }
    setSaved2(true);
  };
  const totalGoal = legs.reduce((s,l)=>s+(l.goalMs||0),0);
  return (
    <div>
      <button style={S.backLink} onClick={()=>(preset||{}).meetId?nav('meetSub',{meetId:preset.meetId}):nav('tools')}>{"<- "}Back</button>
      <h1 style={S.h1}>Relay Timer</h1>
      {!collapsed && (
        <div style={S.card}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Meet</label><select style={{...S.select,width:'100%'}} value={meetId} onChange={e=>setMeetId(e.target.value)}><option value="">Select</option><option value="practice">Practice (Today)</option><option value="practice-custom">Practice (Custom Date)</option>{data.meets.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Event</label><select style={{...S.select,width:'100%'}} value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select</option>{trackEvents.map(e=><option key={e.id} value={e.id}>{getEventLabel(e)}</option>)}</select></div>
            <div><label style={{fontSize:12,color:C.textSecondary}}>Track</label><select style={{...S.select,width:'100%'}} value={trackType} onChange={e=>setTrackType(e.target.value)}><option>Indoor</option><option>Outdoor</option></select></div>
            {meetId==='practice-custom'&&<div><label style={{fontSize:12,color:C.textSecondary}}>Date</label><input style={S.input} type="date" id="relayPracticeDate" defaultValue={new Date().toISOString().split('T')[0]} /></div>}
          </div>
          <div style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:14,fontWeight:600,color:C.textSecondary}}>Legs</span>
              <div style={{display:'flex',gap:6}}>
                <button style={{...S.btn,...S.btnSecondary,padding:'4px 12px',fontSize:12}} onClick={()=>setLegs(l=>[...l,{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null}])}>+ Leg</button>
                <button style={{...S.btn,...S.btnDanger,padding:'4px 12px',fontSize:11}} onClick={()=>setLegs([{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null},{id:uid(),athleteId:'',goalMs:0,splitMs:null,cumMs:null}])}>Reset</button>
              </div>
            </div>
            {legs.map((lg,i)=>(
              <div key={lg.id} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center',flexWrap:'wrap'}}>
                <div style={{width:8,height:32,borderRadius:4,background:COLORS[i%COLORS.length],flexShrink:0}} />
                <span style={{fontSize:12,fontWeight:700,color:COLORS[i%COLORS.length],minWidth:40}}>Leg {i+1}</span>
                <select style={{...S.select,flex:1,minWidth:100}} value={lg.athleteId} onChange={e=>{const c=[...legs];c[i]={...c[i],athleteId:e.target.value};setLegs(c);}}>
                  <option value="">Select athlete</option>
                  {activeAthletes.filter(a=>!gender||gender==='Mixed'||a.gender===(gender==='Boy'?'M':'F')).map(a=><option key={a.id} value={a.id}>{athDisplay(a)}</option>)}
                </select>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:10,color:C.textMuted}}>Goal</span>
                  <select style={{...S.select,width:50,padding:'4px 2px',fontSize:12}} value={Math.floor((lg.goalMs||0)/60000)} onChange={e=>{const c=[...legs];const oldSec=((lg.goalMs||0)%60000)/1000;c[i]={...c[i],goalMs:(parseInt(e.target.value)*60+oldSec)*1000};setLegs(c);}}>
                    {Array.from({length:31},(_,n)=><option key={n} value={n}>{n}</option>)}
                  </select>
                  <span style={{fontSize:12,color:C.textMuted}}>:</span>
                  <select style={{...S.select,width:60,padding:'4px 2px',fontSize:12}} value={(((lg.goalMs||0)%60000)/1000).toFixed(2)} onChange={e=>{const c=[...legs];const min=Math.floor((lg.goalMs||0)/60000);c[i]={...c[i],goalMs:(min*60+parseFloat(e.target.value))*1000};setLegs(c);}}>
                    {Array.from({length:60},(_,n)=><option key={n} value={n.toFixed(2)}>{String(n).padStart(2,'0')}</option>)}
                  </select>
                </div>
                {legs.length>2&&<button style={{background:'none',border:'none',color:C.danger,cursor:'pointer'}} onClick={()=>setLegs(l=>l.filter((_,j)=>j!==i))}>✕</button>}
              </div>
            ))}
            {!!totalGoal&&<div style={{fontSize:12,color:C.textMuted,marginTop:4}}>Total target: {formatTime(totalGoal)}</div>}
          </div>
        </div>
      )}
      {collapsed && (
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8,alignItems:'center'}}>
          {evt && <span style={{...S.pill(false),fontSize:11}}>{getEventLabel(evt)}</span>}
          <span style={{...S.pill(false),fontSize:11}}>{trackType}</span>
          {!!totalGoal&&<span style={{...S.pill(false),fontSize:11}}>Target: {formatTime(totalGoal)}</span>}
          <button style={{background:'none',border:'none',color:C.textSecondary,cursor:'pointer',fontSize:12}} onClick={()=>setCollapsed(false)}>v Expand</button>
        </div>
      )}
      <div style={{textAlign:'center',padding:'16px 0'}}>
        <div style={{fontSize:40,fontWeight:600,fontVariantNumeric:'tabular-nums',color:running?C.accent:C.text}}>{formatTime(elapsed)}</div>
        {running&&activeLeg<legs.length&&(()=>{
          const lg=legs[activeLeg];const prevCum=activeLeg>0?legs[activeLeg-1].cumMs||0:0;const legElapsed=elapsed-prevCum;
          const ath=data.athletes.find(a=>a.id===lg.athleteId);
          return <div style={{fontSize:14,color:COLORS[activeLeg%COLORS.length],fontWeight:600,marginTop:4}}>Leg {activeLeg+1}: {ath?athDisplay(ath):'?'} — {formatTime(legElapsed)}</div>;
        })()}
      </div>
      <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:16}}>
        {!running&&!finished&&<button style={{...S.btn,...S.btnPrimary,fontSize:18,padding:'14px 40px'}} onClick={handleStart}> Start</button>}
        {running&&<>
          <button style={{...S.btn,background:COLORS[activeLeg%COLORS.length],color:C.white,fontSize:16,padding:'16px 32px',minWidth:200}} onClick={handleSplit}>
            {(()=>{const ath=data.athletes.find(a=>a.id===legs[activeLeg].athleteId);return ath?athDisplay(ath):`Leg ${activeLeg+1}`;})()}
            {activeLeg<legs.length-1?' — Split':' — Finish'}
          </button>
          <button style={{...S.btn,...S.btnDanger,fontSize:14,padding:'12px 20px'}} onClick={handleStop}>Stop</button>
        </>}
        {finished&&<>{!saved2&&<button style={{...S.btn,...S.btnSuccess}} onClick={handleSave}>Save All</button>}<button style={{...S.btn,...S.btnDanger}} onClick={handleReset}>Reset</button></>}
        {saved2&&<SavedIndicator saved={true} />}
      </div>
      {legs.some(l=>l.splitMs!==null)&&(
        <div style={S.card}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={S.th}>Leg</th><th style={S.th}>Athlete</th><th style={S.th}>Split</th><th style={S.th}>Cumulative</th><th style={S.th}>vs Goal</th></tr></thead>
            <tbody>{legs.map((lg,i)=>{
              if(lg.splitMs===null) return null;
              const ath=data.athletes.find(a=>a.id===lg.athleteId);
              const goalDiff=lg.goalMs?lg.splitMs-lg.goalMs:0;
              const cumGoal=legs.slice(0,i+1).reduce((s,l)=>s+(l.goalMs||0),0);
              const cumDiff=cumGoal?lg.cumMs-cumGoal:0;
              const prevSplit=i>0&&legs[i-1].splitMs!==null?legs[i-1].splitMs:null;
              const faster=prevSplit!==null&&lg.splitMs<prevSplit;
              const slower=prevSplit!==null&&lg.splitMs>prevSplit;
              return (<tr key={i}>
                <td style={S.td}><span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:28,padding:'2px 8px',borderRadius:20,fontSize:12,fontWeight:700,background:C.white,color:COLORS[i%COLORS.length],border:`2px solid ${COLORS[i%COLORS.length]}`}}>{i+1}</span></td>
                <td style={{...S.td,fontWeight:500}}>{ath?athDisplay(ath):'-'}</td>
                <td style={S.td}>{formatTime(lg.splitMs)}{prevSplit!==null&&<span style={{fontSize:10,fontWeight:600,color:faster?C.success:slower?C.danger:C.textMuted,marginLeft:6}}>{faster?'\u25BC':'\u25B2'}{formatDiff(lg.splitMs-prevSplit)}</span>}</td>
                <td style={S.td}>{formatTime(lg.cumMs)}</td>
                <td style={S.td}>{lg.goalMs?<span style={{fontWeight:600,color:goalDiff<=0?C.success:C.danger}}>{formatDiff(goalDiff)}</span>:'-'}</td>
              </tr>);
            })}</tbody>
          </table>
          {finished&&!!totalGoal&&(()=>{const finalTime=legs.filter(l=>l.cumMs!==null).reduce((m,l)=>Math.max(m,l.cumMs),0);const diff=finalTime-totalGoal;return <div style={{textAlign:'center',padding:'8px 0',fontSize:14,fontWeight:600,color:diff<=0?C.success:C.danger}}>Final: {formatTime(finalTime)} ({formatDiff(diff)} vs target)</div>;})()}
        </div>
      )}
    </div>
  );
}
function SettingsPage({ data, save, team, updateTeam, user, signOut, nav }) {
  const [tab, setTab] = useState('seasons');
  const [saved, setSaved] = useState(false);
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
        {[['seasons','Seasons'],['branding','Branding'],['meetTypes','Meet Types'],['qualifying','Qualifying'],['records','Records'],['team','Team'],['data','Data']].map(([k,l])=>(
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
      
      {tab==='qualifying' && (<div>
        <h2 style={{...S.h2,marginBottom:12}}>Qualifying Standards - All Events</h2>
        <div style={S.card}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={S.th}>Event</th><th style={S.th}>Gender</th><th style={S.th}>Standard</th><th style={S.th}>Mark</th></tr></thead>
            <tbody>
              {events.flatMap(evt=>(evt.qualifyingStandards||[]).map(std=>(
                <tr key={`${evt.id}-${std.id}`}>
                  <td style={S.td}>{evt.name}</td>
                  <td style={S.td}>{evt.gender}</td>
                  <td style={{...S.td,fontWeight:600}}>{std.name}</td>
                  <td style={S.td}>{evt.measurableType==='Time'?formatTime(std.timeMs):fieldToStr(std.ft,std.inch,std.qtr)}</td>
                </tr>
              )))}
              {events.every(e=>!(e.qualifyingStandards||[]).length)&&<tr><td colSpan={4} style={{...S.td,textAlign:'center',color:C.textMuted}}>No standards set. Add them in the Events page.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>)}
      
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
