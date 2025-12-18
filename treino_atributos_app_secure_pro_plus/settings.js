requireLogin();(function(){
  const btnTextoGrande=document.getElementById('btnTextoGrande');
  const btnAltoContraste=document.getElementById('btnAltoContraste');
  const btnBotoesGrandes=document.getElementById('btnBotoesGrandes');
  function setState(btn, key){ btn.classList.toggle('primary', localStorage.getItem(key)==='1'); }
  function updateButtons(){ setState(btnTextoGrande,'acc_big_text'); setState(btnAltoContraste,'acc_high_contrast'); setState(btnBotoesGrandes,'acc_large_buttons'); }
  updateButtons();
  btnTextoGrande.addEventListener('click',()=>{ localStorage.setItem('acc_big_text', localStorage.getItem('acc_big_text')==='1'?'0':'1'); updateButtons(); });
  btnAltoContraste.addEventListener('click',()=>{ localStorage.setItem('acc_high_contrast', localStorage.getItem('acc_high_contrast')==='1'?'0':'1'); updateButtons(); });
  btnBotoesGrandes.addEventListener('click',()=>{ localStorage.setItem('acc_large_buttons', localStorage.getItem('acc_large_buttons')==='1'?'0':'1'); updateButtons(); });

  const apiKey=document.getElementById('fb_apiKey'); const authDomain=document.getElementById('fb_authDomain'); const projectId=document.getElementById('fb_projectId'); const storageBucket=document.getElementById('fb_storageBucket'); const messagingSenderId=document.getElementById('fb_messagingSenderId'); const appId=document.getElementById('fb_appId'); const status=document.getElementById('statusFirebase'); const btnSalvar=document.getElementById('btnSalvarFirebase'); const btnTestar=document.getElementById('btnTestarFirebase');
  const saved=JSON.parse(localStorage.getItem('fb_cfg')||'null'); if(saved){ apiKey.value=saved.apiKey||''; authDomain.value=saved.authDomain||''; projectId.value=saved.projectId||''; storageBucket.value=saved.storageBucket||''; messagingSenderId.value=saved.messagingSenderId||''; appId.value=saved.appId||''; }
  btnSalvar.addEventListener('click',()=>{ const cfg={ apiKey:apiKey.value, authDomain:authDomain.value, projectId:projectId.value, storageBucket:storageBucket.value, messagingSenderId:messagingSenderId.value, appId:appId.value }; setFirebaseConfig(cfg); status.textContent='Configuração salva.'; });
  btnTestar.addEventListener('click', async ()=>{ status.textContent='Inicializando Firebase...'; const ok=await initFirebase(); if(!ok){ status.textContent='Falha ao iniciar Firebase.'; return; } status.textContent='Sincronizando...'; try{ await syncPushAll(); await syncPullAll(); status.textContent='Sincronização concluída com sucesso.'; }catch(e){ status.textContent='Erro na sincronização.'; }
  });

  const btnExport=document.getElementById('btnExportJSON'); const fileInput=document.getElementById('fileImport');
  btnExport.addEventListener('click',()=>{
    const data = JSON.stringify(loadStore(), null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download = 'backup_'+currentProfile()+'.json'; a.click(); URL.revokeObjectURL(url);
  });
  fileInput.addEventListener('change', async ()=>{
    const f = fileInput.files[0]; if(!f) return; const text = await f.text(); try{ const obj = JSON.parse(text); const cur = loadStore(); const merged = Object.assign({}, cur, obj); saveStore(merged); alert('Backup importado e mesclado.'); }catch(e){ alert('Arquivo inválido.'); }
  });
})();
