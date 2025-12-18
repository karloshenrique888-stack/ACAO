requireLogin();(function(){
  const dataTreino=document.getElementById('dataTreino'); const btnAbrir=document.getElementById('btnAbrirTreino'); const btnSair=document.getElementById('btnSair'); const previewSemana=document.getElementById('previewSemana');
  const ageSel=document.getElementById('ageGroup'); const levelSel=document.getElementById('level');
  ageSel.value = localStorage.getItem('ageGroup')||'8-10';
  levelSel.value = localStorage.getItem('level')||'iniciante';
  function saveCfg(){ localStorage.setItem('ageGroup', ageSel.value); localStorage.setItem('level', levelSel.value); }
  ageSel.addEventListener('change', ()=>{ saveCfg(); renderSemana(); });
  levelSel.addEventListener('change', ()=>{ saveCfg(); renderSemana(); });
  dataTreino.value = (new Date()).toISOString().split('T')[0];
  function renderSemana(){ previewSemana.innerHTML=''; const ini=startOfWeek(dataTreino.value); const dias=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']; for(let i=0;i<7;i++){ const iso=addDays(ini,i); const plano=planoPorDia(iso); const previsto=plano.length; const cell=document.createElement('div'); cell.className='week-cell'; cell.innerHTML=`<div class="day">${dias[i]}</div><div class="hint">${formatBR(iso)}</div><div class="hint">Previstos: ${previsto}</div>`; cell.addEventListener('click',()=>{ window.location.href='treino.html?date='+encodeURIComponent(iso); }); previewSemana.appendChild(cell); } }
  renderSemana(); dataTreino.addEventListener('change', renderSemana);
  btnAbrir.addEventListener('click',()=>{ const iso=dataTreino.value; window.location.href='treino.html?date='+encodeURIComponent(iso); });
  btnSair.addEventListener('click',()=>logout());
})();
