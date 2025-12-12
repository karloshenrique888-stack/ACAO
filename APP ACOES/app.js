
const STORAGE_KEY = 'acoes_registradas_v4';
const AUTH_KEY = 'app_autorizado';

function getActions() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveActions(arr) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {} }
function addAction(descricao, dataISO) { const arr = getActions(); const id = Date.now(); arr.push({ id, descricao, data: dataISO, status: 'pendente', createdAt: new Date().toISOString() }); saveActions(arr); return id; }
function setStatus(id, status) { const arr = getActions(); const i = arr.findIndex(a=>a.id===id); if(i>=0){arr[i].status=status; saveActions(arr);} }
function removeAction(id) { const arr = getActions().filter(a=>a.id!==id); saveActions(arr); }
function filterByDate(dateISO) { return getActions().filter(a=>a.data===dateISO); }
function filterByRange(inicioISO, fimISO) {
  if(!inicioISO && !fimISO) return getActions();
  const arr = getActions();
  return arr.filter(a => {
    const d = a.data;
    const geInicio = inicioISO ? d >= inicioISO : true;
    const leFim = fimISO ? d <= fimISO : true;
    return geInicio && leFim;
  });
}
function getCounts(dateISO=null, inicioISO=null, fimISO=null) {
  let arr = [];
  if (dateISO) arr = filterByDate(dateISO);
  else if (inicioISO || fimISO) arr = filterByRange(inicioISO, fimISO);
  else arr = getActions();
  const total = arr.length;
  const pendentes = arr.filter(a=>a.status==='pendente').length;
  const concluidas = arr.filter(a=>a.status==='concluida').length;
  return { total, pendentes, concluidas };
}

function login(senha){ if(senha==='Karlos123'){ sessionStorage.setItem(AUTH_KEY,'true'); return true;} return false; }
function isAuthed(){ return sessionStorage.getItem(AUTH_KEY)==='true'; }
function requireAuth(){ if(!isAuthed()) window.location.href='index.html'; }
function logout(){ sessionStorage.removeItem(AUTH_KEY); window.location.href='index.html'; }

function fmtDate(iso){ if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`; }
function localISODate(date=new Date()){ const y=date.getFullYear(); const m=String(date.getMonth()+1).padStart(2,'0'); const d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; }

function initLogin(){ const form=document.getElementById('login-form'); const senhaInput=document.getElementById('senha'); const erro=document.getElementById('erro'); form.addEventListener('submit',(ev)=>{ ev.preventDefault(); const ok=login(senhaInput.value.trim()); if(ok){ window.location.href='menu.html'; } else { erro.classList.remove('hidden'); erro.textContent='Senha incorreta. Tente novamente.'; } }); }
function initMenu(){ requireAuth(); }
function initRegistrar(){ requireAuth(); const form=document.getElementById('form-registrar'); const descricao=document.getElementById('descricao'); const data=document.getElementById('data'); const msgOk=document.getElementById('msg-ok'); const msgBad=document.getElementById('msg-bad'); form.addEventListener('submit',(ev)=>{ ev.preventDefault(); msgOk.classList.add('hidden'); msgBad.classList.add('hidden'); const descVal=descricao.value.trim(); const dateVal=data.value; if(!descVal||!dateVal){ msgBad.textContent='Informe a descrição e a data.'; msgBad.classList.remove('hidden'); return; } addAction(descVal,dateVal); msgOk.textContent='Ação registrada com sucesso!'; msgOk.classList.remove('hidden'); form.reset(); descricao.focus(); }); }

function renderActionsForDate(dateVal){ const list=document.getElementById('lista-acoes'); list.innerHTML=''; const items=filterByDate(dateVal); if(items.length===0){ const empty=document.createElement('div'); empty.className='subtitle'; empty.textContent='Nenhuma ação para esta data.'; list.appendChild(empty); return; }
  items.sort((a,b)=> (a.status===b.status)?0:(a.status==='pendente'?-1:1));
  items.forEach(a=>{ const item=document.createElement('div'); item.className='action-item';
    const main=document.createElement('div'); main.className='action-main';
    const title=document.createElement('div'); title.className='action-title'; title.textContent=a.descricao;
    const date=document.createElement('div'); date.className='action-date'; date.textContent='Data: '+fmtDate(a.data);
    main.appendChild(title); main.appendChild(date);

    const controls=document.createElement('div'); controls.className='action-controls';
    const btnConcluida=document.createElement('button'); btnConcluida.className='btn '+(a.status==='concluida'?'btn-success':'btn-outline'); btnConcluida.textContent='Concluída';
    const btnPendente=document.createElement('button'); btnPendente.className='btn '+(a.status==='pendente'?'btn-danger':'btn-outline'); btnPendente.textContent='Pendente';
    const btnRemover=document.createElement('button'); btnRemover.className='btn btn-warning'; btnRemover.textContent='Remover';

    btnConcluida.addEventListener('click',()=>{ setStatus(a.id,'concluida'); renderActionsForDate(dateVal); });
    btnPendente.addEventListener('click',()=>{ setStatus(a.id,'pendente'); renderActionsForDate(dateVal); });
    btnRemover.addEventListener('click',()=>{ if(confirm('Remover esta ação? Esta operação não pode ser desfeita.')){ removeAction(a.id); renderActionsForDate(dateVal); } });

    controls.appendChild(btnConcluida); controls.appendChild(btnPendente); controls.appendChild(btnRemover);
    item.appendChild(main); item.appendChild(controls); list.appendChild(item);
  });
}

function initData(){ requireAuth(); const datePicker=document.getElementById('data-picker'); const iso=localISODate(new Date()); datePicker.value=iso; renderActionsForDate(iso); datePicker.addEventListener('change',(e)=> renderActionsForDate(e.target.value)); }

function updateStats(dateISO=null, inicioISO=null, fimISO=null){ const {total,pendentes,concluidas}=getCounts(dateISO, inicioISO, fimISO); document.getElementById('stat-total').textContent=total; document.getElementById('stat-pendentes').textContent=pendentes; document.getElementById('stat-concluidas').textContent=concluidas; }
function renderHistoricoList(arr){ const list=document.getElementById('hist-lista'); if(!list) return; list.innerHTML=''; if(arr.length===0){ const empty=document.createElement('div'); empty.className='subtitle'; empty.textContent='Nenhuma ação no período.'; list.appendChild(empty); return; } arr.sort((a,b)=> (a.data===b.data)?0:(a.data<b.data?-1:1)); arr.forEach(a=>{ const item=document.createElement('div'); item.className='action-item'; const main=document.createElement('div'); main.className='action-main'; const title=document.createElement('div'); title.className='action-title'; title.textContent=a.descricao; const date=document.createElement('div'); date.className='action-date'; date.textContent=`${fmtDate(a.data)} • ${a.status==='concluida'?'Concluída':'Pendente'}`; main.appendChild(title); main.appendChild(date); item.appendChild(main); list.appendChild(item); }); }

function initHistorico(){ requireAuth(); const datePicker=document.getElementById('hist-data-picker'); const inicio=document.getElementById('hist-inicio'); const fim=document.getElementById('hist-fim');
  // Totais gerais inicialmente
  updateStats(null, null, null);
  renderHistoricoList(getActions());

  // Filtro único por data específica
  datePicker.addEventListener('change',(e)=>{
    const val=e.target.value;
    if(val){ updateStats(val, null, null); renderHistoricoList(filterByDate(val)); }
    else { updateStats(null, null, null); renderHistoricoList(getActions()); }
  });

  // Filtro por intervalo (de/até)
  function applyRange(){
    const ini = inicio.value || null;
    const fi = fim.value || null;
    const arr = filterByRange(ini, fi);
    updateStats(null, ini, fi);
    renderHistoricoList(arr);
  }
  inicio.addEventListener('change', applyRange);
  fim.addEventListener('change', applyRange);
}
