requireLogin();(function(){
  const nome=document.getElementById('novoPerfilNome');
  const btnAdd=document.getElementById('btnAddPerfil');
  const lista=document.getElementById('listaPerfis');

  function loadProfiles(){ try{ return JSON.parse(localStorage.getItem('profiles'))||['default']; }catch{ return ['default']; } }
  function saveProfiles(p){ localStorage.setItem('profiles', JSON.stringify(p)); }
  function render(){ lista.innerHTML=''; const profiles = loadProfiles(); profiles.forEach(pid=>{
    const div = document.createElement('div'); div.className='row';
    const label = document.createElement('div'); label.className='col'; label.textContent = pid + (pid===currentProfile() ? ' (ativo)' : '');
    const sel = document.createElement('button'); sel.className='btn'; sel.textContent='Selecionar'; sel.addEventListener('click',()=>{ localStorage.setItem('profileId', pid); window.location.href='index.html'; });
    const del = document.createElement('button'); del.className='btn danger'; del.textContent='Excluir'; del.addEventListener('click',()=>{
      if(!confirm('Tem certeza que deseja excluir o perfil '+pid+'?')) return;
      const p2 = loadProfiles().filter(x=>x!==pid); saveProfiles(p2);
      if(localStorage.getItem('profileId')===pid){ localStorage.setItem('profileId','default'); }
      localStorage.removeItem('treino_store__'+pid);
      render();
    });
    div.appendChild(label); div.appendChild(sel); if(pid!=='default') div.appendChild(del);
    lista.appendChild(div);
  }); }
  btnAdd.addEventListener('click',()=>{
    const raw = (nome.value||'').trim(); if(!raw) return; const pid = raw.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
    const p = loadProfiles(); if(p.includes(pid)){ alert('Já existe um perfil com esse nome.'); return; }
    p.push(pid); saveProfiles(p); nome.value=''; render();
  });
  render();
})();
