(function(){
  const input = document.getElementById('codigoAcesso');
  const btn = document.getElementById('btnLogin');
  const SECRET_HASH = '77173ace11f118f4cfaaa33d7c35ec612a1ca67dae67d54a4a677a465124b087';
  async function sha256Hex(str){ const enc=new TextEncoder().encode(str); const hashBuf=await crypto.subtle.digest('SHA-256', enc); const view=new Uint8Array(hashBuf); return Array.from(view).map(b=>b.toString(16).padStart(2,'0')).join(''); }
  btn.addEventListener('click', async ()=>{ const code=(input.value||'').trim().toLowerCase(); const h=await sha256Hex(code); if(h===SECRET_HASH){ localStorage.setItem('logado','1'); window.location.href='calendar.html'; } else { alert('Acesso negado.'); } });
})();
