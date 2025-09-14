
    document.getElementById('year').textContent = new Date().getFullYear();

    // thème clair/sombre avec préférence conservée
    const root = document.documentElement;
    const key = 'mr-theme';
    function applyTheme(t){ root.classList.remove('light','dark'); if(t) root.classList.add(t); }
    function currentPreferred(){
      const saved = localStorage.getItem(key);
      if(saved) return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme(localStorage.getItem(key));
    document.getElementById('themeToggle').addEventListener('click', ()=>{
      const next = (currentPreferred()==='light') ? 'dark' : 'light';
      localStorage.setItem(key, next); applyTheme(next);
    });

    //repos publics grâce à l’API GitHub
    (async function loadRepos(){
      const list = document.getElementById('repoList');
      const username = 'RegameyManuel';
      try{
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if(!res.ok) throw new Error('API GitHub: ' + res.status);
        const repos = await res.json();
        list.innerHTML = '';
        // filtre des archives/forks
        const filtered = repos.filter(r => !r.fork).slice(0, 30);
        if(filtered.length === 0){
          list.innerHTML = '<li class="muted">Aucun dépôt public trouvé.</li>';
          return;
        }
        for(const r of filtered){
          // lien “Pages” potentiel (404 si Pages pas activé)
          const pagesUrl = `https://${username.toLowerCase()}.github.io/${encodeURIComponent(r.name)}/`;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = r.homepage && r.homepage.trim() ? r.homepage : pagesUrl;
          a.target = "_blank";
          a.rel = "noopener";
          a.innerHTML = `<strong>${r.name}</strong> <span>${r.language ?? ''} · ${new Date(r.updated_at).toLocaleDateString('fr-FR')}</span>`;
          li.appendChild(a);
          list.appendChild(li);
        }
      }catch(e){
        list.innerHTML = `
          <li class="muted">Impossible de récupérer la liste automatiquement.</li>
          <li><a href="https://github.com/${username}?tab=repositories" target="_blank" rel="noopener">Voir mes dépôts sur GitHub →</a></li>
        `;
        console.warn(e);
      }
    })();