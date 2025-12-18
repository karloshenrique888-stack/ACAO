// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js'); });
}

// Theme toggle
(function(){
  const body = document.body; const saved = localStorage.getItem('theme') || 'dark'; if(saved==='light') body.classList.add('light');
  function setIcon(){ const btn = document.getElementById('btnTheme'); if(btn) btn.textContent = body.classList.contains('light') ? '🌞' : '🌙'; }
  document.addEventListener('click', e=>{ if(e.target && e.target.id==='btnTheme'){ body.classList.toggle('light'); localStorage.setItem('theme', body.classList.contains('light')?'light':'dark'); setIcon(); } });
  window.addEventListener('DOMContentLoaded', setIcon);
})();

// Accessibility toggles
(function(){
  function applyAcc(){
    const body=document.body;
    if(localStorage.getItem('acc_big_text')==='1') body.classList.add('big-text'); else body.classList.remove('big-text');
    if(localStorage.getItem('acc_high_contrast')==='1') body.classList.add('high-contrast'); else body.classList.remove('high-contrast');
    if(localStorage.getItem('acc_large_buttons')==='1') body.classList.add('large-buttons'); else body.classList.remove('large-buttons');
  }
  window.addEventListener('DOMContentLoaded', applyAcc);
  document.addEventListener('click', (e)=>{
    if(e.target && e.target.id==='btnTextoGrande'){ localStorage.setItem('acc_big_text', localStorage.getItem('acc_big_text')==='1'?'0':'1'); applyAcc(); }
    if(e.target && e.target.id==='btnAltoContraste'){ localStorage.setItem('acc_high_contrast', localStorage.getItem('acc_high_contrast')==='1'?'0':'1'); applyAcc(); }
    if(e.target && e.target.id==='btnBotoesGrandes'){ localStorage.setItem('acc_large_buttons', localStorage.getItem('acc_large_buttons')==='1'?'0':'1'); applyAcc(); }
  });
})();

// i18n
const I18N = {
  pt: {
    title:'TREINO PARA MELHORIA DE ATRIBUTOS', footer:'PWA offline · Progresso salvo no dispositivo', settings:'Configurações',
    login_title:'Login', login_label:'Senha:', login_button:'Entrar', login_hint:'Acesso restrito.',
    calendar_title:'Escolher dia do treino', calendar_date:'Data do treino:', open_day:'Abrir treino do dia', history:'Histórico', monthly:'Plano mensal', week_preview:'Prévia da semana', tap_hint:'Toque em um dia para abrir o treino correspondente.', logout:'Sair',
    monthly_title:'Plano mensal', month:'Mês:', weekly_goal:'Meta semanal (dias/semana):', consistency_alert:'Alerta de consistência (%):', save:'Salvar',
    day_training:'Treino do dia', add_exercise:'+ Adicionar exercício', mark_all:'Marcar todos como realizado', notes_effort:'Observações & Esforço', notes:'Observações do dia:', effort:'Esforço (1–10):', save_progress:'Salvar progresso',
    start:'Início:', end:'Fim:', filter:'Filtrar', export_pdf:'Exportar PDF', date:'Data', planned:'Previstos', done:'Executados', completed:'Concluídos (%)', visual_summary:'Resumo visual', chart_hint:'Executados vs. previstos, esforço e tendência de conclusão.',
    firebase_title:'Backup/Sincronização (Firebase)', firebase_hint:'Preencha sua configuração do Firebase para sincronizar dados entre dispositivos. Se não preencher, o app funciona offline normalmente.', test_sync:'Testar sincronização'
  },
  en: {
    title:'TRAINING TO IMPROVE ATTRIBUTES', footer:'Offline PWA · Progress saved on device', settings:'Settings',
    login_title:'Sign in', login_label:'Password:', login_button:'Sign in', login_hint:'Restricted access.',
    calendar_title:'Choose training day', calendar_date:'Training date:', open_day:"Open today's training", history:'History', monthly:'Monthly plan', week_preview:'Week preview', tap_hint:'Tap a day to open its training.', logout:'Log out',
    monthly_title:'Monthly plan', month:'Month:', weekly_goal:'Weekly goal (days/week):', consistency_alert:'Consistency alert (%):', save:'Save',
    day_training:'Training of the day', add_exercise:'+ Add exercise', mark_all:'Mark all as done', notes_effort:'Notes & Effort', notes:'Notes of the day:', effort:'Effort (1–10):', save_progress:'Save progress',
    start:'Start:', end:'End:', filter:'Filter', export_pdf:'Export PDF', date:'Date', planned:'Planned', done:'Completed', completed:'Completed (%)', visual_summary:'Visual summary', chart_hint:'Completed vs. planned, effort and completion trend.',
    firebase_title:'Backup/Sync (Firebase)', firebase_hint:'Fill your Firebase config to sync data across devices. If not set, the app works offline.', test_sync:'Test sync'
  }
};
(function(){
  const langSaved = localStorage.getItem('lang') || 'pt';
  document.documentElement.lang = langSaved==='en'?'en':'pt-BR';
  function applyI18n(){
    const dict = I18N[localStorage.getItem('lang')||'pt'];
    document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(dict[k]) el.textContent = dict[k]; });
    const btn = document.getElementById('btnLang'); if(btn) btn.textContent = (localStorage.getItem('lang')||'pt').toUpperCase();
  }
  applyI18n();
  document.addEventListener('click', e=>{
    if(e.target && e.target.id==='btnLang'){
      const cur = localStorage.getItem('lang')||'pt'; const nxt = cur==='pt'?'en':'pt'; localStorage.setItem('lang',nxt); document.documentElement.lang = nxt==='en'?'en':'pt-BR'; applyI18n();
    }
  });
})();

// Profiles
function currentProfile(){ return localStorage.getItem('profileId') || 'default'; }
function storeKey(){ return 'treino_store__'+currentProfile(); }

// Storage helpers
function toISO(date){ if(!date) return new Date().toISOString().split('T')[0]; if(typeof date==='string') return date; const z=new Date(date); const off=z.getTimezoneOffset(); const d=new Date(z.getTime()-off*60*1000); return d.toISOString().split('T')[0]; }
function formatBR(iso){ const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; }
function loadStore(){ try{ return JSON.parse(localStorage.getItem(storeKey()))||{} }catch{ return {} } }
function saveStore(s){ localStorage.setItem(storeKey(), JSON.stringify(s)); }
function requireLogin(){ if(localStorage.getItem('logado')!=='1'){ window.location.href='index.html'; } }
function logout(){ localStorage.removeItem('logado'); window.location.href='index.html'; }

// Week helpers
function startOfWeek(iso){ const d=new Date(iso+'T00:00:00'); const day=d.getDay(); const diff=(day===0?6:day-1); d.setDate(d.getDate()-diff); return toISO(d); }
function addDays(iso, n){ const d=new Date(iso+'T00:00:00'); d.setDate(d.getDate()+n); return toISO(d); }

// Presets
const PRESETS = [
  {cat:'Habilidade', nome:'Dribles com cones', meta:'3×1 min', video:'drible+cones+crianca+futebol', icon:'cones.svg'},
  {cat:'Habilidade', nome:'Condução com mudanças', meta:'5 repetições', video:'agility+change+of+direction+kids+soccer', icon:'ball.svg'},
  {cat:'Habilidade', nome:'Controle na parede (passes)', meta:'2×2 min', video:'wall+passes+soccer+kids', icon:'ball.svg'},
  {cat:'Arranque', nome:'Sprints de 10 m', meta:'6 repetições', video:'10m+sprints+kids+soccer', icon:'sprint.svg'},
  {cat:'Arranque', nome:'Partida com reação (sinal)', meta:'5 repetições', video:'reaction+start+soccer+kids', icon:'sprint.svg'},
  {cat:'Arranque', nome:'Escada de agilidade', meta:'3×30 s', video:'agility+ladder+kids+soccer', icon:'ladder.svg'},
  {cat:'Mentalidade', nome:'Visualização positiva', meta:'3 min', video:'soccer+visualization+kids', icon:'brain.svg'},
  {cat:'Mentalidade', nome:'Respiração box 4-4-4-4', meta:'3 min', video:'box+breathing+kids', icon:'brain.svg'},
  {cat:'Mentalidade', nome:'Auto-fala positiva', meta:'2 min', video:'positive+self+talk+sports+kids', icon:'brain.svg'}
];

function getConfig(){
  return { ageGroup: localStorage.getItem('ageGroup') || '8-10', level: localStorage.getItem('level') || 'iniciante' };
}

function planoPorDia(isoDate){
  const cfg=getConfig();
  const dow=new Date(isoDate+'T00:00:00').getDay();
  const H=PRESETS.filter(p=>p.cat==='Habilidade');
  const A=PRESETS.filter(p=>p.cat==='Arranque');
  const M=PRESETS.filter(p=>p.cat==='Mentalidade');
  let plan=[];
  switch(dow){ case 1: plan=[...H, M[0], M[1]]; break; case 2: plan=[...A, H[1]]; break; case 3: plan=[...H, M[2]]; break; case 4: plan=[...A, M[0]]; break; case 5: plan=[H[0], A[0], H[2], M[1]]; break; case 6: plan=[H[1], A[1], M[0], M[2]]; break; case 0: plan=[M[0], M[1], H[2]]; break; }
  if(cfg.level==='iniciante'){
    plan = plan.slice(0, Math.max(3, Math.ceil(plan.length*0.7)));
  }
  if(cfg.ageGroup==='13+' && A[2] && plan.indexOf(A[2])<0){ plan.push(A[2]); }
  return plan;
}

// Firebase optional
const FB = { cfg:null, app:null, db:null };
async function _loadFirebase(){ if(window.firebase) return; return new Promise((resolve)=>{ const s=document.createElement('script'); s.src='https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js'; s.onload=()=>{ const s2=document.createElement('script'); s2.src='https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js'; s2.onload=resolve; document.head.appendChild(s2); }; document.head.appendChild(s); }); }
function setFirebaseConfig(cfg){ FB.cfg=cfg; localStorage.setItem('fb_cfg', JSON.stringify(cfg)); }
async function initFirebase(){ try{ await _loadFirebase(); FB.app=firebase.initializeApp(FB.cfg); FB.db=firebase.firestore(); return true; }catch(e){ console.warn('Firebase init failed',e); return false; } }
async function syncPushAll(){ if(!FB.db) return false; const store=loadStore(); const uid='local_'+(localStorage.getItem('profileId')||'default'); const batch=FB.db.batch(); Object.keys(store).forEach(d=>{ const ref=FB.db.collection('treinos').doc(uid).collection('dias').doc(d); batch.set(ref, store[d], {merge:true}); }); await batch.commit(); return true; }
async function syncPullAll(){ if(!FB.db) return false; const uid='local_'+(localStorage.getItem('profileId')||'default'); const snap=await FB.db.collection('treinos').doc(uid).collection('dias').get(); const merged=loadStore(); snap.forEach(doc=>{ merged[doc.id]=doc.data(); }); saveStore(merged); return true; }
