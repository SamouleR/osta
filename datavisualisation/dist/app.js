var CUSTOM_PALETTE = [
    "#4E79A7", // bleu acier
    "#E15759", // rouge corail
    "#59A14F", // vert sauge
    "#F28E2B", // orange ambre
    "#B07AA1", // violet lavande
    "#76B7B2", // turquoise doux
    "#EDC948", // or sable
    "#FF9DA7", // rose poudré
    "#9C755F", // marron cacao
    "#BAB0AC"  // gris perle
];

var COLORS = { 
    men: "#2196F3",   
    women: "#F44336", 
    palette: CUSTOM_PALETTE 
};

var MEDIA_DOMAINS = { 
    "TF1": "tf1.fr", "France 2": "france.tv", "France 3": "france.tv", 
    "Canal+": "canalplus.com", "France 5": "france.tv", "M6": "m6.fr", 
    "Arte": "arte.tv", "C8": "c8.fr", "W9": "6play.fr", "TMC": "tf1.fr", 
    "TFX": "tf1.fr", "NRJ 12": "nrj12.fr", "LCP": "lcp.fr", "France 4": "france.tv", 
    "BFM TV": "bfmtv.com", "CNews": "cnews.fr", "CStar": "cstar.fr", "Gulli": "gulli.fr", 
    "France O": "france.tv", "L'Equipe": "lequipe.fr", "6ter": "6play.fr", 
    "RMC Story": "rmcstory.bfmtv.com", "RMC Découverte": "rmcdecouverte.bfmtv.com", 
    "Chérie 25": "cherie25.fr", "LCI": "lci.fr", "France Info": "francetvinfo.fr", 
    "Paris Première": "paris-premiere.fr", "Téva": "teva.fr", "RTL 9": "rtl9.fr", 
    "TV Breizh": "tf1.fr", "Canal+ Sport": "canalplus.com", "Canal+ Cinéma": "canalplus.com", 
    "Planète+": "canalplus.com", "Eurosport": "eurosport.fr", "Disney Channel": "disney.fr", 
    "Ushuaïa TV": "ushuaiatv.fr", "Histoire TV": "histoire.fr", 
    "Toute l'Histoire": "toutelhistoire.com", 
    "France Télévisions": "francetelevisions.fr", "Groupe TF1": "groupe-tf1.fr", 
    "Groupe M6": "groupem6.fr", "Groupe Canal+": "groupe-canal-plus.com", 
    "NextRadioTV": "alticefrance.com", "NRJ Group": "nrjgroup.fr", 
    "Lagardère Active": "lagardere.com",
    "Public Sénat": "publicsenat.fr", "Euronews": "euronews.com",
    "RMC": "rmc.bfmtv.com", "Europe 1": "europe1.fr", "RTL": "rtl.fr",
    "France Inter": "franceinter.fr", "France Culture": "franceculture.fr",
    "Fip": "fip.fr", "France Musique": "francemusique.fr", "Mouv": "mouv.fr",
    "RFI": "rfi.fr", "FunRadio": "funradio.fr", "NRJ": "nrj.fr", "NOSTALGIE": "nostalgie.fr",
    "franceinfo": "francetvinfo.fr", "France 24": "france24.com",
    "CANAL PLUS": "canalplus.com", "CNEWS": "cnews.fr", "FRANCE 2": "france.tv",
    "FRANCE 3": "france.tv", "FRANCE 4": "france.tv", "FRANCE 5": "france.tv",
    "BFMTV": "bfmtv.com", "CSTAR": "cstar.fr", "GULLI": "gulli.fr",
    "France Ô": "france.tv", "Virgin Radio": "virginradio.fr", "6TER": "6play.fr"
};

var SLIDE_INSIGHTS = [
    {
        title: " Parité de la parole dans les Médias",
        text: "L'analyse des données de temps de parole révèle une disparité persistante. Sur l'ensemble des chaînes analysées, la moyenne du temps de parole féminin reste inférieure à <span class='analysis-stat-highlight'>40%</span>. Les chaînes publiques (France Télévisions) tendent à montrer une meilleure équité que certaines chaînes privées historiques."
    },
    {
        title: " Hiérarchie & Groupes",
        text: "Les groupes majeurs (TF1, M6, France TV) dominent le paysage avec une structure ramifiée. On observe une concentration forte : les chaînes de la TNT plus récentes sont souvent regroupées dans des entités rachetées par ces grands groupes historiques."
    },
    {
        title: " Cinéma à la Télévision",
        text: "L'étude des 50 films les plus diffusés depuis 1950 montre une hégémonie culturelle des comédies populaires françaises des années 60-80 (ex: <span class='analysis-stat-highlight'>Le Capitan</span>, <span class='analysis-stat-highlight'>La Grande Vadrouille</span>). La télévision linéaire capitalise sur ces valeurs sûres en prime-time."
    },
    {
        title: " Évolution Thématique (2000-2020)",
        text: "Ce Streamgraph, issu du Baromètre de l'INA, montre comment l'agenda médiatique a basculé au fil du temps. On observe des pics correspondant aux grands événements (élections, crises) et l'émergence progressive de l'Environnement et de l'Association/Société."
    },
    {
        title: " Spécialisation par Chaîne",
        text: "Le graphique radial révèle la ligne éditoriale de chaque chaîne. Certaines se spécialisent dans le fait divers ou le sport, tandis que d'autres, notamment publiques, gardent une structure plus équilibrée entre Société, International et Culture."
    },
    {
        title: " Infos",
        text: "Cette page rassemble les points clés à retenir de l'analyse : déséquilibres H/F, tendances thématiques et pistes pour mieux comprendre l'évolution des médias."
    }
];

var App = {
    dataChaines: [], dataGenres: [], dataMeta: [], dataFilms: [], movieCovers: {}, mediaLogos: {},
    currentSlide: 0, activeGender: 'H', activeSunburstGroups: new Set(['Tous']), selectedIds: new Set(), activeFilters: new Set(['Tous']), streamgraphGender: 'ALL', hiddenStreamgraphThemes: new Set(),

    // FONCTION SIMPLIFIEE : CHARGE ET LANCE DIRECTEMENT
    async init() {
        // Logique de l'écran d'accueil (intro screen)
        const introScreen = document.getElementById('intro-screen');
        const introStep1 = document.getElementById('intro-step-1');
        const introStep2 = document.getElementById('intro-step-2');
        const introStep3 = document.getElementById('intro-step-3');
        
        if (introScreen) {
            setTimeout(() => {
                if (introStep1) introStep1.classList.remove('active');
                if (introStep2) introStep2.classList.add('active');
                
                setTimeout(() => {
                    if (introStep2) introStep2.classList.remove('active');
                    if (introStep3) introStep3.classList.add('active');
                    
                    setTimeout(() => {
                        introScreen.classList.add('fade-out');
                    }, 2500);
                }, 1500);
            }, 2000);
        }

        if(!document.getElementById('viz-tooltip')) { 
            const tt = document.createElement('div'); 
            tt.id = 'viz-tooltip'; 
            tt.className = 'custom-tooltip'; 
            document.body.appendChild(tt); 
        }

        const btnPrev = document.getElementById('btn-prev');
        if (btnPrev) btnPrev.addEventListener('click', () => this.prevSlide());

        const btnNext = document.getElementById('btn-next');
        if (btnNext) btnNext.addEventListener('click', () => this.nextSlide());

        const chartSelectEl = document.getElementById('chart-select');
        if (chartSelectEl) {
            chartSelectEl.addEventListener('change', (e) => this.setSlide(parseInt(e.target.value)));
        }

        const btnAll = document.getElementById('btn-all');
        if (btnAll) btnAll.addEventListener('click', () => this.toggleGender('ALL'));

        const btnH = document.getElementById('btn-h');
        if (btnH) btnH.addEventListener('click', () => this.toggleGender('H'));

        const btnF = document.getElementById('btn-f');
        if (btnF) btnF.addEventListener('click', () => this.toggleGender('F'));
        
        const countrySelect = document.getElementById('country-select');
        if (countrySelect) countrySelect.addEventListener('change', () => this.filterFilmsData());

        const yearMin = document.getElementById('year-min');
        if (yearMin) yearMin.addEventListener('input', () => this.filterFilmsData());

        const diffSelect = document.getElementById('diff-select');
        if (diffSelect) diffSelect.addEventListener('change', () => this.filterFilmsData());
        
        const btnReset = document.getElementById('btn-reset');
        if (btnReset) btnReset.addEventListener('click', () => Viz.resetView());

        const chartWrapper = document.querySelector('.chart-wrapper');
        if (chartWrapper) chartWrapper.addEventListener('click', (e) => Viz.resetSelection(e));
        
        const metaGroupSelect = document.getElementById('meta-group-select');
        if (metaGroupSelect) metaGroupSelect.addEventListener('change', () => this.filterMetaData());

        const metaMediaSelect = document.getElementById('meta-media-select');
        if (metaMediaSelect) metaMediaSelect.addEventListener('change', () => this.filterMetaData());

        const btnMetaReset = document.getElementById('btn-meta-reset');
        if (btnMetaReset) {
            btnMetaReset.addEventListener('click', () => {
                if (metaGroupSelect) metaGroupSelect.value = 'all';
                if (metaMediaSelect) metaMediaSelect.value = 'all';
                this.filterMetaData();
            });
        }

        this.initTitleInteractions();
        // this.initSwitches(); // Now handled by React in App.jsx

        try {
            // csvFilmsRaw is a global from films.js, fallbackCovers from covers.js
            const [chaines, genres, meta, covers, logos] = await Promise.all([
                d3.csv("csv/ina-csa-parole-femmes-chaines.csv").catch(()=>[]),
                d3.csv("csv/ina-csa-parole-femmes-genreprogramme.csv").catch(()=>[]),
                d3.csv("csv/6710e8d60f12d58334949614.csv").catch(()=>[]),
                d3.json("data.json").catch(()=>({})),
                d3.json("logos.json").catch(()=>({}))
            ]);
            
            this.dataChaines = chaines.filter(d => d.Editeur); 
            this.dataGenres = genres; 
            this.dataMeta = meta; 
            this.movieCovers = Object.keys(covers).length > 0 ? covers : fallbackCovers;
            this.mediaLogos = logos;
            
            this.dataFilms = d3.csvParse(csvFilmsRaw, d => ({ 
                ...d, 
                Diffusions: +d.Diffusions, 
                Rank: +d.Rank, 
                Year: +d.Year, 
                LastDiffusion: +d.LastDiffusion 
            }));
            
            this.dataFilms.forEach(d => { 
                d.Poster = this.movieCovers[d.Title] || ("https://placehold.co/300x450/5D4037/ffffff?text=" + encodeURIComponent(d.Title.substring(0,25))); 
            });
            


            this.setSlide(0);
            Viz.renderArticleDonuts();
        } catch (e) { 
            console.error("Erreur critique lors du chargement des données.", e); 
        }
    },

    initMetaControls() {
        const data = this.dataMeta;
        if(!data || data.length === 0) return;

        const keys = Object.keys(data[0]);
        const groupKey = keys.find(k => k.toLowerCase().includes('genre') || k.toLowerCase().includes('cat') || k.toLowerCase().includes('group')) || keys[1];
        const labelKey = keys[0]; 

        if (groupKey) {
            const groups = [...new Set(data.map(d => d[groupKey]))].sort();
            const groupSel = document.getElementById('meta-group-select');
            groupSel.innerHTML = '<option value="all">Tous</option>';
            groups.forEach(g => {
                if(g) {
                    const opt = document.createElement('option');
                    opt.value = g;
                    opt.innerText = g;
                    groupSel.appendChild(opt);
                }
            });
        }

        const media = [...new Set(data.map(d => d[labelKey]))].sort();
        const mediaSel = document.getElementById('meta-media-select');
        mediaSel.innerHTML = '<option value="all">Tous</option>';
        media.forEach(m => {
            if(m) {
                const opt = document.createElement('option');
                opt.value = m;
                opt.innerText = m;
                mediaSel.appendChild(opt);
            }
        });
    },

    filterMetaData() {
        const groupVal = document.getElementById('meta-group-select').value;
        const mediaVal = document.getElementById('meta-media-select').value;
        
        const data = this.dataMeta;
        if(!data || data.length === 0) return;

        const keys = Object.keys(data[0]);
        const groupKey = keys.find(k => k.toLowerCase().includes('genre') || k.toLowerCase().includes('cat') || k.toLowerCase().includes('group')) || keys[1];
        const labelKey = keys[0];
        const targetKey = keys[1] || keys[0]; 

        let filtered = data.filter(d => {
            let matchGroup = true;
            if(groupVal !== 'all' && groupKey) {
                matchGroup = (d[groupKey] === groupVal);
            }
            
            let matchMedia = true;
            if(mediaVal !== 'all') {
                matchMedia = (d[labelKey] === mediaVal || d[targetKey] === mediaVal);
            }
            
            return matchGroup && matchMedia;
        });

        Viz.renderEdgeBundlingMeta(filtered);
    },

    initTitleInteractions() {},

    initSwitches() {
        const btnArticle = document.getElementById('nav-mode-article');
        const btnGraphique = document.getElementById('nav-mode-graphique');
        const btnCrea = document.getElementById('nav-mode-crea');
        
        const articleView = document.getElementById('article-view');
        const analyticView = document.getElementById('analytic-view');
        const artisticView = document.getElementById('artistic-view');
        const toggleTheme = document.getElementById('toggle-theme');

        if (toggleTheme) {
            toggleTheme.addEventListener('change', (e) => {
                if(e.target.checked) document.body.classList.add('dark-mode');
                else document.body.classList.remove('dark-mode');
            });
        }

        const resetViews = () => {
            if(articleView) articleView.style.display = 'none';
            analyticView.style.display = 'none';
            artisticView.style.display = 'none';
            document.body.classList.remove('artistic-mode-active');
            if(btnArticle) btnArticle.classList.remove('active');
            btnGraphique.classList.remove('active');
            if(btnCrea) btnCrea.classList.remove('active');
        };

        if (btnArticle) {
            btnArticle.addEventListener('click', () => {
                resetViews();
                if(articleView) articleView.style.display = 'flex';
                btnArticle.classList.add('active');
                Viz.renderArticleDonuts();
            });
        }

        if (btnGraphique) {
            btnGraphique.addEventListener('click', () => {
                resetViews();
                analyticView.style.display = 'block';
                btnGraphique.classList.add('active');
            });
        }
        
        if (btnCrea) {
            btnCrea.addEventListener('click', () => {
                resetViews();
                artisticView.style.display = 'flex';
                document.body.classList.add('artistic-mode-active');
                btnCrea.classList.add('active');
            });
        }
    },

    nextSlide() {
        const slides = document.querySelectorAll('.slide');
        const count = slides.length || 1;
        const nextIndex = (this.currentSlide + 1) % count;
        this.setSlide(nextIndex);
    },

    prevSlide() {
        const slides = document.querySelectorAll('.slide');
        const count = slides.length || 1;
        const prevIndex = (this.currentSlide + count - 1) % count;
        this.setSlide(prevIndex);
    },

    setSlide(index) {
        this.currentSlide = index; 
        const chartSelect = document.getElementById('chart-select');
        if (chartSelect) chartSelect.value = index;
        this.selectedIds.clear(); 
        Viz.clearSelectionStyle(); 
        this.activeFilters.clear(); 
        this.activeFilters.add('Tous');
        
        document.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === index));
        
        const titleEl = document.getElementById('main-chart-title'); 
        const sbControls = document.getElementById('sunburst-controls');
        const filters = document.getElementById('filter-list'); 
        const genericControls = document.getElementById('generic-controls');
        const filmControls = document.getElementById('film-controls'); 
        const metaControls = document.getElementById('meta-controls');
        const stdCard = document.getElementById('std-card'); 
        const tvCard = document.getElementById('tv-card');
        
        const setDisplay = (el, value) => { if (el) el.style.display = value; };
        
        // Contextes intégrés sur les pages
        const overlay = document.getElementById('analysis-overlay');
        const overlayHeader = document.getElementById('analysis-header');
        const overlayBody = document.getElementById('analysis-body');
        const insight = SLIDE_INSIGHTS[index];
        // Slide 0 has inline editorial text blocks, so no overlay needed
        if (overlay && insight && index !== 0) {
            overlayHeader.innerHTML = insight.title;
            overlayBody.innerHTML = insight.text;
            overlay.classList.add('visible');
        } else if (overlay) {
            overlay.classList.remove('visible');
        }

        // Note: films-world-panel, film-controls-right, left-panel and main-layout films-mode class
        // are handled by React state (selectedChartIndex) in App.jsx
        if (index === 2) { 
            setDisplay(stdCard, 'none'); 
            setDisplay(tvCard, 'block');
        } else { 
            setDisplay(stdCard, 'flex'); 
            setDisplay(tvCard, 'none');
        }
        
        if (index === 2) { 
            setDisplay(genericControls, 'none');
            setDisplay(metaControls, 'none');
            setDisplay(filmControls, 'none'); // hidden in left panel, shown in right panel
            setDisplay(sbControls, 'none');
        } else if (index >= 3) { 
            setDisplay(genericControls, 'none');
            setDisplay(metaControls, 'none');
            setDisplay(filmControls, 'none');
            setDisplay(sbControls, 'none');
        } else { 
            setDisplay(genericControls, 'block'); 
            setDisplay(metaControls, 'none');
            setDisplay(filmControls, 'none'); 
            setDisplay(sbControls, (index === 1) ? 'block' : 'none');
        }
        
        this.updateStats([]); 

        if (index === 0) {
            titleEl.innerText = ""; 
            filters.style.display = 'flex';
            this.updateCard({title: "Vue d'ensemble", desc: "Temps de parole H/F par groupe média."});
            const groups = this.dataChaines.map(d => d.group); 
            this.renderFilters(groups); 
            this.applyCurrentViewFilters();
        } else if (index === 1) {
            titleEl.innerText = ""; 
            filters.style.display = 'none'; 
            this.updateCard({title: "Hiérarchie", desc: "Cliquez sur les arcs pour zoomer dans les groupes."});
            
            const groups = [...new Set(this.dataChaines.map(d => d.group).filter(x=>x))].sort();
            const gContainer = document.getElementById('sunburst-groups'); 
            gContainer.innerHTML = '';
            gContainer.className = 'filter-container-grid-layout';

            // 1. Create Top Row
            const topRow = document.createElement('div');
            topRow.className = 'filter-top-row';

            const btnAll = document.createElement('button');
            btnAll.className = 'filter-top-btn ' + (this.activeSunburstGroups.has('Tous') ? 'active' : '');
            btnAll.setAttribute('data-filter', 'Tous');
            btnAll.innerText = 'Tous';
            btnAll.onclick = () => {
                this.activeSunburstGroups.clear();
                this.activeSunburstGroups.add('Tous');
                this.updateSunburstFilterButtons();
                Viz.renderSunburst(this.activeGender, this.activeSunburstGroups);
            };

            const btnReset = document.createElement('button');
            btnReset.className = 'filter-top-btn secondary';
            btnReset.innerText = 'Réinitialiser';
            btnReset.onclick = () => {
                this.activeSunburstGroups.clear();
                this.activeSunburstGroups.add('Tous');
                this.updateSunburstFilterButtons();
                Viz.renderSunburst(this.activeGender, this.activeSunburstGroups);
            };

            topRow.appendChild(btnAll);
            topRow.appendChild(btnReset);
            gContainer.appendChild(topRow);

            // 2. Create Grid of Cards
            const grid = document.createElement('div');
            grid.className = 'filter-grid-cards';

            groups.forEach(g => {
                const cardContainer = document.createElement('div');
                cardContainer.className = 'filter-card-container';

                const btn = document.createElement('button');
                btn.className = 'filter-card-btn ' + (this.activeSunburstGroups.has(g) ? 'active' : '');
                btn.setAttribute('data-filter', g);

                const logoPath = App.mediaLogos && App.mediaLogos[g] ? App.mediaLogos[g] : null;
                if (logoPath) {
                    const img = document.createElement('img');
                    img.src = logoPath;
                    img.className = 'filter-card-img';
                    img.alt = g;
                    btn.appendChild(img);
                } else {
                    const span = document.createElement('span');
                    span.innerText = g;
                    btn.appendChild(span);
                }

                btn.onclick = () => {
                    if (this.activeSunburstGroups.has('Tous')) this.activeSunburstGroups.delete('Tous');
                    if (this.activeSunburstGroups.has(g)) this.activeSunburstGroups.delete(g);
                    else this.activeSunburstGroups.add(g);
                    if (this.activeSunburstGroups.size === 0) this.activeSunburstGroups.add('Tous');
                    this.updateSunburstFilterButtons();
                    Viz.renderSunburst(this.activeGender, this.activeSunburstGroups);
                };

                const label = document.createElement('div');
                label.className = 'filter-card-label';
                label.innerText = g;

                cardContainer.appendChild(btn);
                cardContainer.appendChild(label);
                grid.appendChild(cardContainer);
            });

            gContainer.appendChild(grid);
            
            Viz.renderSunburst(this.activeGender, this.activeSunburstGroups);
        } else if (index === 2) {
            titleEl.innerText = "FILMS LES PLUS DIFFUSÉS"; 
            filters.style.display = 'none';
            this.updateCard({title: "Cinéma TV", desc: "Survolez les barres pour voir les détails sur la TV."}); 
            this.filterFilmsData();
        } else if (index === 3) {
            titleEl.innerText = "ÉVOLUTION THÉMATIQUE (2000-2020)";
            filters.style.display = 'none';
            this.updateCard({title: "Évolution", desc: "Évolution du volume de sujets par thème dans les JT du soir."});
            Viz.renderBarometreStreamgraph(this.dataBarometre, 'chart-streamgraph');
            this.initStreamgraphControls();
        } else if (index === 4) {
            titleEl.innerText = "INFOS";
            filters.style.display = 'none';
            this.updateCard({title: "Infos", desc: "Détails et points clés des analyses publiées."});
        }
        document.getElementById('reset-container').style.display = 'none';
    },

    renderFilters(items) {
        const uniqueItems = [...new Set(items.map(x => x ? x.trim() : x))].filter(x => x).sort(); 
        const container = document.getElementById('filter-list'); 
        container.innerHTML = '';
        container.className = 'filter-container-grid-layout';

        // 1. Create Top Row
        const topRow = document.createElement('div');
        topRow.className = 'filter-top-row';

        const btnAll = document.createElement('button');
        btnAll.className = 'filter-top-btn ' + (this.activeFilters.has('Tous') ? 'active' : '');
        btnAll.setAttribute('data-filter', 'Tous');
        btnAll.innerText = 'Tous';
        btnAll.onclick = () => {
            this.activeFilters.clear();
            this.activeFilters.add('Tous');
            this.updateFilterButtons();
            this.applyCurrentViewFilters();
        };

        const btnReset = document.createElement('button');
        btnReset.className = 'filter-top-btn secondary';
        btnReset.innerText = 'Réinitialiser';
        btnReset.onclick = () => {
            this.activeFilters.clear();
            this.activeFilters.add('Tous');
            this.updateFilterButtons();
            this.applyCurrentViewFilters();
        };

        topRow.appendChild(btnAll);
        topRow.appendChild(btnReset);
        container.appendChild(topRow);

        // 2. Create Grid of Cards
        const grid = document.createElement('div');
        grid.className = 'filter-grid-cards';

        uniqueItems.forEach(item => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'filter-card-container';

            const btn = document.createElement('button');
            btn.className = 'filter-card-btn ' + (this.activeFilters.has(item) ? 'active' : '');
            btn.setAttribute('data-filter', item);

            const logoPath = App.mediaLogos && App.mediaLogos[item] ? App.mediaLogos[item] : null;
            if (logoPath) {
                const img = document.createElement('img');
                img.src = logoPath;
                img.className = 'filter-card-img';
                img.alt = item;
                btn.appendChild(img);
            } else {
                const span = document.createElement('span');
                span.innerText = item;
                btn.appendChild(span);
            }

            btn.onclick = () => {
                if (this.activeFilters.has('Tous')) this.activeFilters.delete('Tous');
                if (this.activeFilters.has(item)) this.activeFilters.delete(item);
                else this.activeFilters.add(item);
                if (this.activeFilters.size === 0) this.activeFilters.add('Tous');
                this.updateFilterButtons();
                this.applyCurrentViewFilters();
            };

            const label = document.createElement('div');
            label.className = 'filter-card-label';
            label.innerText = item;

            cardContainer.appendChild(btn);
            cardContainer.appendChild(label);
            grid.appendChild(cardContainer);
        });

        container.appendChild(grid);
        this.updateFilterButtons();
    },

    updateFilterButtons() { 
        const items = document.querySelectorAll('#filter-list .filter-card-btn, #filter-list .filter-top-btn'); 
        items.forEach(item => { 
            const val = item.getAttribute('data-filter'); 
            if(this.activeFilters.has(val)) item.classList.add('active'); 
            else item.classList.remove('active'); 
        }); 
    },

    initStreamgraphControls() {
        const btnAll = document.getElementById('btn-stream-all');
        const btnH = document.getElementById('btn-stream-h');
        const btnF = document.getElementById('btn-stream-f');
        if (btnAll) btnAll.onclick = () => this.setStreamgraphGender('ALL');
        if (btnH) btnH.onclick = () => this.setStreamgraphGender('H');
        if (btnF) btnF.onclick = () => this.setStreamgraphGender('F');
        this.updateStreamgraphControlButtons();
    },

    setStreamgraphGender(gender) {
        this.streamgraphGender = gender;
        this.updateStreamgraphControlButtons();
        Viz.renderBarometreStreamgraph(this.dataBarometre, 'chart-streamgraph');
    },

    updateStreamgraphControlButtons() {
        const buttons = {
            ALL: document.getElementById('btn-stream-all'),
            H: document.getElementById('btn-stream-h'),
            F: document.getElementById('btn-stream-f')
        };
        Object.entries(buttons).forEach(([key, button]) => {
            if (button) button.classList.toggle('active', this.streamgraphGender === key);
        });
    },

    toggleStreamgraphTheme(theme) {
        if (this.hiddenStreamgraphThemes.has(theme)) {
            this.hiddenStreamgraphThemes.delete(theme);
        } else {
            this.hiddenStreamgraphThemes.add(theme);
        }
        Viz.renderBarometreStreamgraph(this.dataBarometre, 'chart-streamgraph');
    },

    renderSlide0Charts(data) {
        let men = 0, women = 0;
        data.forEach(d => {
            men += parseFloat(d.men_speech_duration_2020) || 0;
            women += parseFloat(d.women_speech_duration_2020) || 0;
        });
        const total = men + women || 1;
        const pctMen = Math.round((men / total) * 100);
        const pctWomen = Math.round((women / total) * 100);

        const drawGauge = (containerId, val, color, label, emptyColor = 'rgba(128,128,128,0.2)') => {
            const container = document.getElementById(containerId);
            if(!container) return;
            container.innerHTML = '';
            // Use fixed dimensions so charts render correctly even if slide is not yet visible
            const width = 700, height = 420;
            const radius = Math.min(width, height) / 2 - 24;
            
            const svg = d3.select(container).append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${width} ${height}`)
                .append("g")
                .attr("transform", `translate(${width/2},${height/2})`);
            
            const pie = d3.pie().value(d => d.value).sort(null);
            let pieData;
            if (Array.isArray(val)) {
                 pieData = pie([
                     {value: val[0], color: color[0], label: 'Hommes'},
                     {value: val[1], color: color[1], label: 'Femmes'}
                 ]);
            } else {
                 pieData = pie([
                     {value: val, color: color, label},
                     {value: 100 - val, color: emptyColor, label: 'Reste'}
                 ]);
            }
            
            const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius).cornerRadius(8);
            const innerArc = d3.arc().innerRadius(radius * 0.35).outerRadius(radius * 0.58).cornerRadius(6);
            
            if (Array.isArray(val)) {
                svg.append('g')
                    .selectAll('path')
                    .data(pieData)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => d.data.color)
                    .style('opacity', 0.95)
                    .style('filter', 'drop-shadow(0 10px 18px rgba(0,0,0,0.12))');

                svg.append('circle')
                    .attr('r', radius * 0.34)
                    .attr('fill', 'var(--bg-color)')
                    .attr('opacity', 0.96);

                svg.append('text').attr('text-anchor', 'middle').attr('dy', '-0.6em')
                    .style('font-size', '2rem').style('font-weight', '800').style('fill', 'var(--text-main)')
                    .text('H / F');
                svg.append('text').attr('text-anchor', 'middle').attr('dy', '1.4em')
                    .style('font-size', '1rem').style('font-weight', '700').style('fill', 'var(--text-muted)')
                    .text(`${val[0]}% / ${val[1]}%`);

                svg.append('g')
                    .attr('transform', `translate(${-110}, ${radius * 0.6})`)
                    .selectAll('g')
                    .data(pieData)
                    .join('g')
                    .call(g => {
                        g.append('rect')
                            .attr('width', 16)
                            .attr('height', 16)
                            .attr('rx', 4)
                            .attr('fill', d => d.data.color);
                        g.append('text')
                            .attr('x', 22)
                            .attr('y', 12)
                            .text(d => d.data.label)
                            .style('fill', 'var(--text-main)')
                            .style('font-size', '0.9rem')
                            .style('font-weight', '700');
                    });
            } else {
                svg.selectAll('path')
                    .data(pieData)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => d.data.color)
                    .style('opacity', 0.95)
                    .style('filter', 'drop-shadow(0 10px 18px rgba(0,0,0,0.12))');

                svg.append('circle')
                    .attr('r', radius * 0.5)
                    .attr('fill', 'var(--bg-color)')
                    .attr('opacity', 0.96);

                svg.append('text').attr('text-anchor', 'middle').attr('dy', '0em')
                    .style('font-size', '4rem').style('font-weight', '900').style('fill', color)
                    .text(`${val}%`);
                svg.append('text').attr('text-anchor', 'middle').attr('dy', '2.4em')
                    .style('font-size', '1.2rem').style('font-weight', '800').style('fill', 'var(--text-main)')
                    .text(label);
            }
        };

        drawGauge('chart-men-only', pctMen, 'var(--col-men)', 'Hommes');
        drawGauge('chart-women-only', pctWomen, 'var(--col-women)', 'Femmes');
        drawGauge('chart-both', [pctMen, pctWomen], ['var(--col-men)', 'var(--col-women)'], 'Écart');
    },

    applyCurrentViewFilters() {
        if(this.currentSlide === 0) { 
            let filteredData = this.dataChaines; 
            if(!this.activeFilters.has('Tous')) { 
                filteredData = this.dataChaines.filter(d => this.activeFilters.has(d.group)); 
            } 
            this.renderSlide0Charts(filteredData); 
            this.updateCardForCurrentFilters();
        } 
    },

    toggleGender(gender) {
        this.activeGender = gender; 
        const sbDiv = document.getElementById('sunburst-controls'); 
        if(sbDiv) sbDiv.querySelectorAll('div:first-of-type .retro-btn').forEach(b => b.classList.remove('active'));
        
        if (gender === 'H') document.getElementById('btn-h').classList.add('active'); 
        else if (gender === 'F') document.getElementById('btn-f').classList.add('active'); 
        else document.getElementById('btn-all').classList.add('active');
        
        if(this.currentSlide === 1) Viz.renderSunburst(gender, this.activeSunburstGroups);
    },

    filterFilmsData() {
        const country = document.getElementById('country-select').value; 
        const yearMin = +document.getElementById('year-min').value; 
        const diffYear = document.getElementById('diff-select').value;
        document.getElementById('year-val').innerText = yearMin;
        let filtered = this.dataFilms.filter(d => {
            let matchCountry = true; 
            if(country === 'FR') matchCountry = (d.Country.includes('FR')); 
            else if(country === 'US') matchCountry = (d.Country.includes('US')); 
            else if(country === 'IT') matchCountry = (d.Country.includes('IT')); 
            else if(country === 'coprod') matchCountry = d.Country.includes('/');
            const matchYear = (d.Year >= yearMin); 
            let matchDiff = true; 
            if(diffYear !== 'all') matchDiff = (d.LastDiffusion === +diffYear);
            return matchCountry && matchYear && matchDiff;
        });
        Viz.renderRadialFilms(filtered); 
        this.updateStats(filtered.map(d => d.Diffusions));
    },

    updateStats(values) {
        // Stats removed
    },

    drawStatsHistogram(values) {
        // Stats removed
    },

    populateStatsModal() {
        // Stats removed
    },


    updateCard(data) {
        const isTV = document.getElementById('tv-card').style.display === 'block'; 
        const title = data.title; 
        const desc = data.desc;
        const localLogo = App.mediaLogos && App.mediaLogos[title] ? App.mediaLogos[title] : null;
        const domain = MEDIA_DOMAINS[title] || null; 
        const realLogo = localLogo ? localLogo : (domain ? 'https://logo.clearbit.com/' + domain : null); 
        const logoUrl = data.Poster ? data.Poster : (realLogo ? realLogo : "");

        if(isTV) { 
            document.getElementById('tv-card-title').innerText = title; 
            document.getElementById('tv-card-desc').innerHTML = desc; 
            document.getElementById('tv-bg-image').src = logoUrl; 
        } else {
            document.getElementById('sc-title').innerText = title; 
            document.getElementById('sc-desc').innerHTML = desc;
            const imgEl = document.getElementById('sc-img'); 
            const iconEl = document.getElementById('sc-icon');
            
            if(logoUrl && !logoUrl.includes('ui-avatars')) { 
                imgEl.src = logoUrl; 
                imgEl.classList.remove('hidden'); 
                iconEl.style.display = 'none'; 
            } else { 
                imgEl.src = ""; 
                imgEl.classList.add('hidden'); 
                iconEl.style.display = 'block'; 
                if(data.men !== undefined) iconEl.className = "fas fa-chart-pie sc-placeholder-icon"; 
                else iconEl.className = "fas fa-film sc-placeholder-icon"; 
            }
            
            const scGender = document.getElementById('sc-gender-box');
            if(data.men !== undefined && data.women !== undefined) {
                const total = data.men + data.women; 
                const pctMen = total > 0 ? Math.round((data.men / total) * 100) : 0; 
                const pctWomen = total > 0 ? 100 - pctMen : 0;
                document.getElementById('sc-bar-men').style.width = pctMen + "%"; 
                document.getElementById('sc-bar-women').style.width = pctWomen + "%"; 
                scGender.style.opacity = 1;
            } else { 
                scGender.style.opacity = 0.3; 
            }
        }
    },

    updateCardForCurrentFilters() {
        if(this.currentSlide === 0) { 
            let totalMen = 0;
            let totalWomen = 0;
            if(this.activeFilters.has('Tous')) {
                this.dataChaines.forEach(d => {
                    totalMen += parseFloat(d.men_speech_duration_2020) || 0;
                    totalWomen += parseFloat(d.women_speech_duration_2020) || 0;
                });
                this.updateCard({
                    title: "Tous",
                    desc: "Tous les groupes de médias.",
                    men: totalMen,
                    women: totalWomen
                });
            } else {
                const filtered = this.dataChaines.filter(d => this.activeFilters.has(d.group));
                filtered.forEach(d => {
                    totalMen += parseFloat(d.men_speech_duration_2020) || 0;
                    totalWomen += parseFloat(d.women_speech_duration_2020) || 0;
                });
                
                if (this.activeFilters.size === 1) {
                    const groupName = Array.from(this.activeFilters)[0];
                    this.updateCard({
                        title: groupName,
                        desc: "Groupe de chaînes.",
                        men: totalMen,
                        women: totalWomen
                    });
                } else {
                    const groupNames = Array.from(this.activeFilters).join(", ");
                    this.updateCard({
                        title: "Sélection filtrée",
                        desc: `Groupes: ${groupNames}`,
                        men: totalMen,
                        women: totalWomen
                    });
                }
            }
        }
    },

    toggleSelection(id, value, name) { 
        if (this.selectedIds.has(id)) this.selectedIds.delete(id); 
        else this.selectedIds.add(id); 
        document.getElementById('reset-container').style.display = this.selectedIds.size > 0 ? 'block' : 'none'; 
        return this.selectedIds; 
    },

    updateSunburstFilterButtons() {
        const btns = document.querySelectorAll('#sunburst-groups .filter-card-btn, #sunburst-groups .filter-top-btn');
        btns.forEach(b => {
            const val = b.getAttribute('data-filter');
            if(this.activeSunburstGroups.has(val)) b.classList.add('active');
            else b.classList.remove('active');
        });
    }
};

var Viz = {
    showTooltip(e, content) { 
        const tt = document.getElementById('viz-tooltip'); 
        tt.innerHTML = content; 
        tt.style.opacity = 1; 
        tt.style.left = (e.pageX + 15) + "px"; 
        tt.style.top = (e.pageY + 15) + "px"; 
    },
    moveTooltip(e) { 
        const tt = document.getElementById('viz-tooltip'); 
        tt.style.left = (e.pageX + 15) + "px"; 
        tt.style.top = (e.pageY + 15) + "px"; 
    },
    hideTooltip() { 
        const tt = document.getElementById('viz-tooltip'); 
        tt.style.opacity = 0; 
    },

    renderArticleDonuts() {
        const container = document.getElementById('d3-circular-charts');
        if (!container) return;
        container.innerHTML = '';
        
        const data2010 = [{label: 'Femmes', value: 31.6}, {label: 'Hommes', value: 68.4}];
        const data2019 = [{label: 'Femmes', value: 38.7}, {label: 'Hommes', value: 61.3}];

        const drawDonut = (data, titleText, colorScale) => {
            const width = 280, height = 280, margin = 20;
            const radius = Math.min(width, height) / 2 - margin;
            
            const div = document.createElement('div');
            container.appendChild(div);
            
            const svg = d3.select(div)
              .append("svg")
                .attr("width", width)
                .attr("height", height)
              .append("g")
                .attr("transform", `translate(${width/2},${height/2})`);
            
            const pie = d3.pie().value(d => d.value).sort(null);
            const data_ready = pie(data);
            const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
            
            svg.selectAll('path')
              .data(data_ready)
              .join('path')
              .attr('d', arc)
              .attr('fill', d => colorScale(d.data.label))
              .attr("stroke", "var(--bg-main)")
              .style("stroke-width", "3px")
              .style("opacity", 0.9)
              .style("cursor", "pointer")
              .on('mouseover', function(event, d) {
                  d3.select(this).style("opacity", 1).style("stroke-width", "0");
                  Viz.showTooltip(event, `<strong>${d.data.label}</strong> : ${d.data.value}%`);
              })
              .on('mouseout', function() {
                  d3.select(this).style("opacity", 0.9).style("stroke-width", "3px");
                  Viz.hideTooltip();
              });
              
            svg.append("text")
               .attr("text-anchor", "middle")
               .attr("dy", "-0.2em")
               .style("font-size", "28px")
               .style("font-weight", "bold")
               .style("fill", "var(--text-main)")
               .text(titleText);
               
            svg.append("text")
               .attr("text-anchor", "middle")
               .attr("dy", "1.5em")
               .style("font-size", "14px")
               .style("fill", "var(--text-main)")
               .style("opacity", 0.8)
               .text(`${data[0].value}% de femmes`);
        };
        
        const color = d3.scaleOrdinal()
          .domain(["Femmes", "Hommes"])
          .range(["#F44336", "#2196F3"]);
          
        drawDonut(data2010, "2010", color);
        drawDonut(data2019, "2019", color);
    },

    renderChord(data) {
        const container = document.getElementById('chart-chord'); 
        if(!container) return; 
        container.innerHTML = ''; 
        
        const width = container.clientWidth, 
              height = container.clientHeight, 
              size = Math.min(width, height) * 0.92; 
        const innerR = size * 0.4, 
              outerR = innerR + 15;

        if(data.length === 0) { 
            container.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100%;font-style:italic;color:var(--text-main);opacity:0.6'>Aucune donnée pour cette sélection</div>"; 
            return; 
        }
        
        const colTotal = "total_declarations_duration_2020"; 
        let validData = data.filter(d => parseFloat(d[colTotal]) > 0); 
        const topData = validData.sort((a,b) => parseFloat(b[colTotal]) - parseFloat(a[colTotal])).slice(0, 15);
        
        const entities = ["Hommes", "Femmes", ...topData.map(d => d.Editeur)]; 
        const matrix = Array(entities.length).fill().map(() => Array(entities.length).fill(0));
        const rawDataMap = {};
        
        const statsArray = [];

        topData.forEach((d, i) => {
            const idx = i + 2; 
            const m = parseFloat(d.men_speech_duration_2020)||0; 
            const f = parseFloat(d.women_speech_duration_2020)||0;
            matrix[0][idx] = m; 
            matrix[idx][0] = m; 
            matrix[1][idx] = f; 
            matrix[idx][1] = f; 
            rawDataMap[idx] = { name: d.Editeur, men: m, women: f, desc: `Catégorie: ${d.group}` };
            statsArray.push(m + f);
        });
        
        App.updateStats(statsArray);

        const chord = d3.chord().padAngle(0.04).sortSubgroups(d3.descending)(matrix);
        const arc = d3.arc().innerRadius(innerR).outerRadius(outerR);
        const ribbon = d3.ribbon().radius(innerR);
        
        const colorPalette = d3.scaleOrdinal(COLORS.palette);
        const color = i => i===0 ? COLORS.men : (i===1 ? COLORS.women : colorPalette(i));

        const svg = d3.select(container).append("svg").attr("viewBox", [-width/2, -height/2, width, height]);
        const group = svg.append("g").selectAll("g").data(chord.groups).join("g");
        
        group.append("path")
            .attr("class", "chord-group")
            .attr("d", arc)
            .style("fill", d => color(d.index))
            .style("stroke", "var(--bg-color)")
            .on("click", (e, d) => { e.stopPropagation(); App.toggleSelection(d.index, d.value, entities[d.index]); this.updateVisualsChord(svg); })
            .on("mouseover", (e, d) => {
                svg.selectAll(".chord-ribbon").style("opacity", 0.35).filter(r => r.source.index === d.index || r.target.index === d.index).style("opacity", 1.0).style("stroke", "rgba(0,0,0,0.15)");
                const info = rawDataMap[d.index]; 
                let tooltipHtml = "";
                if(info) {
                    const total = info.men + info.women; 
                    const pctM = total > 0 ? Math.round((info.men/total)*100) : 0; 
                    const pctF = total > 0 ? 100 - pctM : 0;
                    tooltipHtml = `<div class="tooltip-title">${info.name}</div><div class="tooltip-row"><span style="color:${COLORS.men}">Hommes</span> <span>${info.men.toFixed(0)}h (${pctM}%)</span></div><div class="tooltip-row"><span style="color:${COLORS.women}">Femmes</span> <span>${info.women.toFixed(0)}h (${pctF}%)</span></div>`;
                    App.updateCard({title: info.name, desc: info.desc, men: info.men, women: info.women});
                } else if(d.index === 0) { 
                    tooltipHtml = `<div class="tooltip-title">TOTAL HOMMES</div><div>${d.value.toFixed(0)} heures cumulées</div>`; 
                    App.updateCard({title: "HOMMES", desc: "Temps de parole global des hommes.", men: 100, women: 0}); 
                } else if(d.index === 1) { 
                    tooltipHtml = `<div class="tooltip-title">TOTAL FEMMES</div><div>${d.value.toFixed(0)} heures cumulées</div>`; 
                    App.updateCard({title: "FEMMES", desc: "Temps de parole global des femmes.", men: 0, women: 100}); 
                }
                this.showTooltip(e, tooltipHtml);
            })
            .on("mousemove", (e) => { this.moveTooltip(e); })
            .on("mouseout", () => { 
                this.hideTooltip(); 
                svg.selectAll(".chord-ribbon").style("opacity", 0.7).style("stroke", "none"); 
                if(App.selectedIds.size > 0) this.updateVisualsChord(svg); 
                App.updateCardForCurrentFilters();
            });

        // ── CHORD TEXT LABELS ────────────────────────────────────
        group.append("text")
            .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", "0.35em")
            .attr("class", "chord-label")
            .attr("transform", d => `
                rotate(${d.angle * 180 / Math.PI - 90})
                translate(${outerR + 10})
                ${d.angle > Math.PI ? "rotate(180)" : ""}
            `)
            .attr("text-anchor", d => d.angle > Math.PI ? "end" : "start")
            .text(d => entities[d.index])
            .style("fill", "var(--text-main)")
            .style("font-size", "11px")
            .style("font-weight", "600")
            .on("click", (e, d) => { e.stopPropagation(); App.toggleSelection(d.index, d.value, entities[d.index]); this.updateVisualsChord(svg); })
            .on("mouseover", (e, d) => {
                svg.selectAll(".chord-ribbon").style("opacity", 0.35).filter(r => r.source.index === d.index || r.target.index === d.index).style("opacity", 1.0);
            })
            .on("mouseout", () => {
                svg.selectAll(".chord-ribbon").style("opacity", 0.7);
            });

        svg.append("g").selectAll("path").data(chord).join("path").attr("d", ribbon).attr("class", "chord-ribbon")
            .style("fill", d => color(d.source.index)).style("stroke", "none").style("mix-blend-mode", "multiply").style("opacity", 0.7)
            .on("mouseover", (e, d) => { 
                d3.select(e.target).style("opacity", 1.0); 
                const sourceName = entities[d.source.index]; 
                const targetName = entities[d.target.index]; 
                const val = d.source.value;
                const tooltipHtml = `<div class="tooltip-title">FLUX</div><div class="tooltip-row">${sourceName} <i class="fas fa-arrow-right"></i> ${targetName}</div><div style="font-weight:900; font-size:1.1em">${val.toFixed(1)} heures</div>`;
                this.showTooltip(e, tooltipHtml);
            })
            .on("mousemove", (e) => { this.moveTooltip(e); }).on("mouseout", (e) => { this.hideTooltip(); d3.select(e.target).style("opacity", 0.7); });
    },

    updateVisualsChord(svg) {
        if (App.selectedIds.size === 0) { svg.selectAll("path").classed("dimmed", false).classed("active-selected", false); return; }
        svg.selectAll(".chord-group").classed("dimmed", d => !App.selectedIds.has(d.index)).classed("active-selected", d => App.selectedIds.has(d.index));
        svg.selectAll(".chord-ribbon").classed("dimmed", d => !App.selectedIds.has(d.source.index) && !App.selectedIds.has(d.target.index));
    },

    renderSunburst(gender, groupFilter) {
        const container = document.getElementById('chart-sunburst'); 
        if(!container) return; 
        container.innerHTML = '';
        
        const width = container.clientWidth, height = container.clientHeight, radius = Math.min(width, height) / 2.2;
        const hierarchy = { name: "TOTAL", children: [] }; const map = new Map(), lookup = {};
        const statsArray = [];

        App.dataChaines.forEach(d => {
            if(!groupFilter.has('Tous') && !groupFilter.has(d.group)) return;
            const g = d.group || "Autre"; 
            const men = parseFloat(d.men_speech_duration_2020)||0, women = parseFloat(d.women_speech_duration_2020)||0;
            lookup[d.Editeur] = { men: men, women: women, group: g }; 
            if(!map.has(g)) map.set(g, { name: g, children: [] });
            let val = (gender === 'ALL') ? men + women : (gender === 'H' ? men : women); 
            if(val > 0) { 
                map.get(g).children.push({ name: d.Editeur, value: val }); 
                statsArray.push(val);
            }
        });
        
        App.updateStats(statsArray);

        hierarchy.children = Array.from(map.values());
        const root = d3.hierarchy(hierarchy).sum(d => d.value).sort((a,b) => b.value - a.value);
        d3.partition().size([2*Math.PI, radius*radius])(root);
        const arc = d3.arc().startAngle(d => d.x0).endAngle(d => d.x1).innerRadius(d => Math.sqrt(d.y0)).outerRadius(d => Math.sqrt(d.y1));
        // Zoom in slightly (reduce viewBox size by 10% to make chart 10% bigger)
        const svg = d3.select(container).append("svg").attr("viewBox", [-width/2.2, -height/2.2, width/1.1, height/1.1]);

        // Color scale: one distinct color per group (depth 1)
        const groups = root.children ? root.children.map(d => d.data.name) : [];
        const groupColorScale = d3.scaleOrdinal().domain(groups).range(COLORS.palette);

        // Get group color for any node
        const getGroupColor = (d) => {
            if(d.depth === 1) return groupColorScale(d.data.name);
            if(d.depth === 2 && d.parent) {
                const base = d3.color(groupColorScale(d.parent.data.name));
                // Get index among siblings for variation
                const siblings = d.parent.children || [];
                const idx = siblings.indexOf(d);
                const total = siblings.length;
                // Create shade variations: lighten progressively
                const t = total > 1 ? idx / (total - 1) : 0.5;
                return d3.interpolateRgb(base, base.brighter(1.5))(t);
            }
            return "#999";
        };

        // Precompute color for each node so breadcrumb can use it
        root.descendants().forEach(d => {
            d.data.computedColor = getGroupColor(d);
        });

        const cell = svg.selectAll("g").data(root.descendants().filter(d => d.depth)).join("g");

        cell.append("path").attr("d", arc).attr("class", "sunburst-arc")
            .style("fill", d => d.data.computedColor)
            .on("click", (e, d) => { e.stopPropagation(); App.toggleSelection(d.data.name, d.value, d.data.name); this.updateVisualsSunburst(svg); })
            .on("mouseover", (e, d) => {
                this.updateBreadcrumbs(d, root.value); d3.selectAll(".sunburst-arc").style("opacity", 0.5); d3.select(e.target).style("opacity", 1);
                // Also highlight sibling arcs from same group
                if(d.depth === 2 && d.parent) {
                    d.parent.children.forEach(sibling => {
                        svg.selectAll(".sunburst-arc").filter(s => s === sibling).style("opacity", 0.85);
                    });
                }
                d3.select(e.target).style("opacity", 1);
                
                const info = lookup[d.data.name]; 
                let tooltipHtml = "";
                if(info) {
                    // Channel (Depth 2)
                    const total = info.men + info.women;
                    const pctM = total > 0 ? Math.round((info.men/total)*100) : 0;
                    const pctF = total > 0 ? 100 - pctM : 0;
                    tooltipHtml = `<div class="tooltip-title">${d.data.name}</div>
                                   <div class="tooltip-row"><span style="color:${COLORS.men}">Hommes</span> <span>${Math.round(info.men).toLocaleString()}h (${pctM}%)</span></div>
                                   <div class="tooltip-row"><span style="color:${COLORS.women}">Femmes</span> <span>${Math.round(info.women).toLocaleString()}h (${pctF}%)</span></div>
                                   <div class="tooltip-row" style="font-weight:bold; margin-top:5px; border-top:1px solid rgba(128,128,128,0.2); padding-top:5px;"><span>Total</span> <span>${Math.round(total).toLocaleString()}h</span></div>`;
                    App.updateCard({title: d.data.name, desc: `Groupe: ${info.group}<br><strong>Total : ${Math.round(total).toLocaleString()}h</strong>`, men: info.men, women: info.women}); 
                } else if(d.depth === 1 && d.children) {
                    // Group (Depth 1)
                    let sumM = 0, sumF = 0;
                    d.children.forEach(c => {
                        const cInfo = lookup[c.data.name];
                        if(cInfo) {
                            sumM += cInfo.men;
                            sumF += cInfo.women;
                        }
                    });
                    const total = sumM + sumF;
                    const pctM = total > 0 ? Math.round((sumM/total)*100) : 0;
                    const pctF = total > 0 ? 100 - pctM : 0;
                    tooltipHtml = `<div class="tooltip-title">${d.data.name}</div>
                                   <div class="tooltip-row"><span style="color:${COLORS.men}">Hommes</span> <span>${Math.round(sumM).toLocaleString()}h (${pctM}%)</span></div>
                                   <div class="tooltip-row"><span style="color:${COLORS.women}">Femmes</span> <span>${Math.round(sumF).toLocaleString()}h (${pctF}%)</span></div>
                                   <div class="tooltip-row" style="font-weight:bold; margin-top:5px; border-top:1px solid rgba(128,128,128,0.2); padding-top:5px;"><span>Total</span> <span>${Math.round(total).toLocaleString()}h</span></div>`;
                    App.updateCard({title: d.data.name, desc: `Groupe de médias<br><strong>Total : ${Math.round(total).toLocaleString()}h</strong>`, men: sumM, women: sumF});
                } else {
                    // Root / Tous (Depth 0)
                    let sumM = 0, sumF = 0;
                    Object.values(lookup).forEach(val => {
                        sumM += val.men;
                        sumF += val.women;
                    });
                    const total = sumM + sumF;
                    App.updateCard({title: "Tous", desc: `Totalité des médias<br><strong>Total : ${Math.round(total).toLocaleString()}h</strong>`, men: sumM, women: sumF});
                }
                if (tooltipHtml) this.showTooltip(e, tooltipHtml);
            })
            .on("mousemove", (e) => { this.moveTooltip(e); })
            .on("mouseout", () => { 
                this.hideTooltip();
                document.getElementById('sunburst-breadcrumbs').innerHTML = ""; 
                d3.selectAll(".sunburst-arc").style("opacity", 1); 
                if(App.selectedIds.size > 0) this.updateVisualsSunburst(svg); 
                App.updateCard({title: "Hiérarchie", desc: "Cliquez sur les arcs pour zoomer dans les groupes."});
            });
        // ── LOGOS AND LABELS INSIDE ARCS ────────────────────────────────────
        const defs = svg.append("defs");
        let labelId = 0;

        cell.each(function(d) {
            const angleSpan = d.x1 - d.x0;
            const innerR    = Math.sqrt(d.y0);
            const outerR    = Math.sqrt(d.y1);
            const midR      = (innerR + outerR) / 2;
            const thickness = outerR - innerR;
            const arcLen    = angleSpan * midR;

            const name     = d.data.name;
            const logoPath = App.mediaLogos && App.mediaLogos[name] ? App.mediaLogos[name] : null;
            const grp      = d3.select(this);

            const bg  = d3.color(getGroupColor(d));
            const lum = bg.r * 0.299 + bg.g * 0.587 + bg.b * 0.114;
            const col = lum > 155 ? "#111" : "#fff";

            if (logoPath) {
                // Determine image size dynamically
                const imgSize = d.depth === 1 ? 24 : 18;
                if (arcLen < imgSize || thickness < imgSize) return;

                const midAngle = (d.x0 + d.x1) / 2;
                const cx = Math.sin(midAngle) * midR;
                const cy = -Math.cos(midAngle) * midR;

                grp.append("image")
                   .attr("href", logoPath)
                   .attr("x", cx - imgSize / 2)
                   .attr("y", cy - imgSize / 2 - 3)
                   .attr("width", imgSize)
                   .attr("height", imgSize)
                   .style("pointer-events", "none");

                if (arcLen >= imgSize && thickness >= (imgSize + 8)) {
                    grp.append("text")
                       .attr("x", cx)
                       .attr("y", cy + imgSize / 2 + 5)
                       .attr("text-anchor", "middle")
                       .style("font-size", d.depth === 1 ? "9px" : "7.5px")
                       .style("font-weight", "800")
                       .style("fill", col)
                       .style("pointer-events", "none")
                       .text(`${Math.round(d.value)}h`);
                }
            } else {
                // Fallback to text label only if no logo is available and there's enough space
                if (arcLen < (d.depth === 1 ? 45 : 30) || thickness < (d.depth === 1 ? 16 : 11)) return;

                const id  = "sl-" + (labelId++);
                const mid   = (d.x0 + d.x1) / 2;
                const flip  = mid > Math.PI;
                const sa    = flip ? d.x1 : d.x0;
                const ea    = flip ? d.x0 : d.x1;

                const x0 = Math.sin(sa) * midR;
                const y0 = -Math.cos(sa) * midR;
                const x1 = Math.sin(ea) * midR;
                const y1 = -Math.cos(ea) * midR;
                const largeArc = Math.abs(ea - sa) > Math.PI ? 1 : 0;
                const sweep = sa < ea ? 1 : 0;
                const pathData = `M ${x0} ${y0} A ${midR} ${midR} 0 ${largeArc} ${sweep} ${x1} ${y1}`;

                defs.append("path")
                    .attr("id", id)
                    .attr("d", pathData);

                const fsize    = d.depth === 1 ? 10 : 8;
                const cw       = d.depth === 1 ? 6.5 : 5.5;
                const maxChars = Math.floor(arcLen / cw);
                
                const labelText = `${name} (${Math.round(d.value)}h)`;
                const label    = labelText.length > maxChars
                    ? labelText.substring(0, Math.max(maxChars - 1, 3)) + "…"
                    : labelText;

                grp.append("text")
                    .style("font-size",   fsize + "px")
                    .style("font-weight", d.depth === 1 ? "700" : "500")
                    .style("fill",        col)
                    .style("pointer-events", "none")
                    .style("letter-spacing", "0.05em")
                    .append("textPath")
                        .attr("href",        "#" + id)
                        .attr("startOffset", "50%")
                        .attr("text-anchor", "middle")
                        .text(label);
            }
        });
    },

    updateBreadcrumbs(node, totalValue) {
        const bContainer = document.getElementById('sunburst-breadcrumbs'); 
        bContainer.innerHTML = '';
        const sequence = node.ancestors().reverse(); 
        sequence.shift(); 
        sequence.forEach((d, i) => {
            const el = document.createElement('div'); 
            el.className = 'breadcrumb-item'; 
            
            const bgColor = d.data.computedColor || '#333';
            const base = d3.color(bgColor);
            const brightness = base.r * 0.299 + base.g * 0.587 + base.b * 0.114;
            const textColor = brightness > 150 ? '#000' : '#fff';
            el.style.background = bgColor;
            el.style.color = textColor;
            el.innerHTML = `<span>${d.data.name}</span>`;
            if (i === sequence.length - 1) { 
                const pct = ((d.value / totalValue) * 100).toFixed(1); 
                el.innerHTML += `<span class="breadcrumb-pct" style="background:${textColor};color:${bgColor}">${pct}%</span>`; 
            }
            bContainer.appendChild(el);
        });
    },

    updateVisualsSunburst(svg) { 
        if (App.selectedIds.size === 0) { svg.selectAll(".sunburst-arc").classed("dimmed", false).classed("active-selected", false); return; } 
        svg.selectAll(".sunburst-arc").classed("dimmed", d => !App.selectedIds.has(d.data.name)).classed("active-selected", d => App.selectedIds.has(d.data.name)); 
    },

    renderEdgeBundlingMeta(data) {
        const container = document.getElementById('chart-bundling');
        if (!container || !data || data.length === 0) return;
        container.innerHTML = '';

        const width = container.clientWidth;
        const height = container.clientHeight;
        
        const radius = Math.min(width, height) / 2.8;

        const keys = Object.keys(data[0]);
        const sourceKey = keys[0];
        const targetKey = keys[1] || keys[0];

        const vibrantColors = CUSTOM_PALETTE; 
        const color = d3.scaleOrdinal(vibrantColors);

        const nodesMap = new Map();
        const addToMap = (n) => {
            if(!nodesMap.has(n)) nodesMap.set(n, {name: n, imports: []});
        };

        data.forEach(d => {
            const source = d[sourceKey];
            const target = d[targetKey];
            if(source && target && source !== target) {
                addToMap(source);
                addToMap(target);
                nodesMap.get(source).imports.push(target);
            }
        });

        const rootData = {
            name: "root",
            children: Array.from(nodesMap.values()).map(d => ({name: d.name, imports: d.imports}))
        };

        const hierarchy = d3.hierarchy(rootData);
        
        const cluster = d3.cluster().size([2 * Math.PI, radius - 100]);
        const root = cluster(hierarchy);

        const map = new Map(root.leaves().map(d => [d.data.name, d]));
        
        const links = [];
        root.leaves().forEach(d => {
            if (d.data.imports) {
                d.data.imports.forEach(i => {
                    if (map.get(i)) {
                        links.push(d.path(map.get(i)));
                    }
                });
            }
        });

        const svg = d3.select(container).append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .style("font", "10px sans-serif");

        const line = d3.lineRadial()
            .curve(d3.curveBundle.beta(0.85))
            .radius(d => d.y)
            .angle(d => d.x);

        const link = svg.append("g")
            .attr("fill", "none")
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("class", "link-path")
            .style("stroke", d => color(d[0].data.name)) 
            .style("stroke-width", "3px") 
            .attr("d", line);

        const node = svg.append("g")
            .selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            .text(d => d.data.name)
            .attr("fill", "transparent")
            .style("font-weight", "bold")
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                link.style("stroke-opacity", 0.05);
                link.filter(l => l[0] === d || l[l.length - 1] === d)
                    .style("stroke-opacity", 1)
                    .style("stroke-width", "6px") 
                    .raise(); 
                App.updateCard({title: d.data.name, desc: "Élément du réseau relationnel."});
            })
            .on("mouseout", () => {
                link.style("stroke-opacity", 0.5)
                    .style("stroke-width", "3px");
                App.updateCard({title: "Interconnexions", desc: "Visualisation des liens complexes du réseau."});
            });
        
        App.updateStats([]);
    },

    renderRadialFilms(data) {
        const container = document.getElementById('chart-films'); 
        if(!container) return; 
        container.innerHTML = '';
        
        data.sort((a,b) => b.Diffusions - a.Diffusions);
        
        const width = container.clientWidth || 720;
        const height = container.clientHeight || 480;
        const outerRadius = Math.max(Math.min(width, height) / 2 - 20, 0);
        const innerRadius = Math.min(130, outerRadius * 0.5);
        if (outerRadius <= 0) {
            container.innerHTML = '<div style="padding:16px;color:var(--text-main);">Zone trop petite pour afficher le graphique.</div>';
            return;
        }
        
        const svg = d3.select(container).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", `translate(${width / 2},${height / 2})`);
        const x = d3.scaleBand().range([0, 2 * Math.PI]).align(0).domain(data.map(d => d.Title));
        let y = (typeof d3.scaleRadial === 'function') ? d3.scaleRadial().range([innerRadius, outerRadius]).domain([0, d3.max(data, d => d.Diffusions) || 10]) : d3.scaleLinear().range([innerRadius, outerRadius]).domain([0, d3.max(data, d => d.Diffusions) || 10]);
        
        const minDiff = d3.min(data, d => d.Diffusions) || 0;
        const maxDiff = d3.max(data, d => d.Diffusions) || 10;
        
        const colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["#ef4444", "#f59e0b", "#3b82f6"])).domain([minDiff - 1, maxDiff]);

        svg.append("g").selectAll("path").data(data).join("path").attr("class", "radial-bar").attr("fill", d => colorScale(d.Diffusions))
            .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(d => y(d.Diffusions)).startAngle(d => x(d.Title)).endAngle(d => x(d.Title) + x.bandwidth()).padAngle(0.02).padRadius(innerRadius))
            .on("mouseover", (e, d) => {
                d3.select(".center-rank").text("#" + d.Rank); 
                d3.select(".center-title").text(d.Title.length > 25 ? d.Title.substring(0,25)+"..." : d.Title);
                d3.select(".center-detail").html(`${d.Director}<br>${d.Year} - ${d.Country}`); 
                d3.select(".center-count").html(`${d.Diffusions} <span style="font-size:0.8rem; vertical-align:middle">DIFF</span>`);
                App.updateCard({ title: d.Title, desc: `<strong>${d.Director}</strong> (${d.Year})<br>${d.Diffusions} diffusions au total.<br>Dernière : ${d.LastDiffusion}`, logo: null, Poster: d.Poster });
                d3.selectAll(".radial-bar").style("opacity", 0.2); 
                d3.select(e.target).style("opacity", 1).style("stroke", "var(--text-main)").raise();
            })
            .on("mouseout", (e) => {
                d3.select(".center-rank").text("INFO"); d3.select(".center-title").text("Survolez un film"); d3.select(".center-detail").text("Visualisation Interactive"); d3.select(".center-count").text("--"); d3.selectAll(".radial-bar").style("opacity", 1).style("stroke", "none");
                App.updateCard({title: "Cinéma TV", desc: "Survolez les barres pour voir les détails sur la TV."});
            });
        
        const yAxis = svg.append("g").attr("text-anchor", "middle").style("pointer-events", "none");
        const ticks = [Math.floor(maxDiff/2), maxDiff]; 
        yAxis.selectAll("circle").data(ticks).join("circle").attr("fill", "none").attr("stroke", "var(--text-main)").attr("stroke-opacity", 0.1).attr("r", y);
        if(data.length === 0) { svg.append("text").text("Aucun résultat").attr("text-anchor","middle").attr("dy", "0.35em"); }
    },

    renderGenderChart(data, containerId = "chart-gender") {
        const container = document.getElementById(containerId);
        if(!container) return;
        container.innerHTML = "";
        
        let men = 0, women = 0;
        data.forEach(d => {
            men += parseFloat(d.men_speech_duration_2020) || 0;
            women += parseFloat(d.women_speech_duration_2020) || 0;
        });
        
        if(men === 0 && women === 0) return;
        
        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;
        const radius = Math.min(width, height) / 2 - 20;
        
        const svg = d3.select(container).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width/2},${height/2})`);
            
        const pie = d3.pie().value(d => d.value).sort(null);
        const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
        
        const pieData = pie([
            {key: "H", value: men, color: "#2196F3"},
            {key: "F", value: women, color: "#F44336"}
        ]);
        
        svg.selectAll("path")
            .data(pieData)
            .join("path")
            .attr("d", arc)
            .attr("fill", d => d.data.color)
            .style("stroke", "var(--bg-main)")
            .style("stroke-width", "2px")
            .on("mouseover", function(e, d) {
                d3.select(this).style("opacity", 0.8);
                App.updateCard({title: d.data.key === "H" ? "Hommes" : "Femmes", desc: `Total: ${(d.data.value/3600).toFixed(0)}h`, men: d.data.key==="H"?1:0, women: d.data.key==="F"?1:0});
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);
            });
            
        svg.selectAll("text")
            .data(pieData)
            .join("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("fill", "#fff")
            .style("font-weight", "bold")
            .text(d => d.data.key + " " + Math.round(d.data.value / (men+women) * 100) + "%");
    },

    renderRadialStacked(data, containerId = 'chart-radial-stacked') {
        const container = document.getElementById(containerId);
        if(!container) return;
        container.innerHTML = '';
        
        let validData = data.filter(d => d.genre && (parseFloat(d.women_speech_duration_2020) > 0 || parseFloat(d.men_speech_duration_2020) > 0));
        
        validData = validData.map(d => ({
            genre: d.genre,
            F: parseFloat(d.women_speech_duration_2020) || 0,
            H: parseFloat(d.men_speech_duration_2020) || 0,
            total: (parseFloat(d.women_speech_duration_2020) || 0) + (parseFloat(d.men_speech_duration_2020) || 0)
        })).sort((a, b) => b.total - a.total);
        
        const width = container.clientWidth, height = container.clientHeight;
        const innerRadius = 130, outerRadius = Math.min(width, height) / 2 - 40;
        
        const svg = d3.select(container).append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("width", width)
            .attr("height", height);
            
        const defs = svg.append("defs");
        const gradientF = defs.append("linearGradient").attr("id", "gradF").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
        gradientF.append("stop").attr("offset", "0%").attr("stop-color", "#F44336");
        gradientF.append("stop").attr("offset", "100%").attr("stop-color", "#FF8A80");
        
        const gradientH = defs.append("linearGradient").attr("id", "gradH").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
        gradientH.append("stop").attr("offset", "0%").attr("stop-color", "#2196F3");
        gradientH.append("stop").attr("offset", "100%").attr("stop-color", "#80D8FF");

        const x = d3.scaleBand()
            .domain(validData.map(d => d.genre))
            .range([0, 2 * Math.PI])
            .align(0);

        const y = (typeof d3.scaleRadial === 'function') ? d3.scaleRadial()
            .domain([0, d3.max(validData, d => d.total)])
            .range([innerRadius, outerRadius]) : d3.scaleLinear().domain([0, d3.max(validData, d => d.total)]).range([innerRadius, outerRadius]);

        const arc = d3.arc()
            .innerRadius(d => y(d[0]))
            .outerRadius(d => y(d[1]))
            .startAngle(d => x(d.data.genre))
            .endAngle(d => x(d.data.genre) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius);

        const series = d3.stack().keys(["H", "F"])(validData);

        const colorScale = d3.scaleOrdinal()
            .domain(["H", "F"])
            .range(["url(#gradH)", "url(#gradF)"]);

        const g = svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => colorScale(d.key))
            .selectAll("path")
            .data(d => d)
            .join("path")
            .attr("d", arc)
            .attr("class", "radial-stacked-path")
            .on("mouseover", function(e, d) {
                d3.selectAll(".radial-stacked-path").style("opacity", 0.3);
                d3.select(this).style("opacity", 1);
                const genreData = d.data;
                const pctF = ((genreData.F / genreData.total) * 100).toFixed(1);
                const pctH = ((genreData.H / genreData.total) * 100).toFixed(1);
                App.updateCard({
                    title: genreData.genre, 
                    desc: `Total: ${(genreData.total/3600).toFixed(0)}h<br><span style="color:#2196F3">Hommes: ${pctH}%</span> | <span style="color:#F44336">Femmes: ${pctF}%</span>`
                });
            })
            .on("mouseout", function() {
                d3.selectAll(".radial-stacked-path").style("opacity", 1);
                App.updateCard({title: "Genre de Programme", desc: "Parité hommes/femmes par format d'émission."});
            });

        const labelGroup = svg.append("g").selectAll("g")
            .data(validData)
            .join("g")
            .attr("text-anchor", d => (x(d.genre) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "start" : "end")
            .attr("transform", d => `
                rotate(${((x(d.genre) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                translate(${outerRadius + 15},0)
            `);

        labelGroup.append("text")
            .attr("transform", d => (x(d.genre) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "" : "rotate(180)")
            .text(d => d.genre.length > 20 ? d.genre.substring(0, 20) + '...' : d.genre)
            .style("font-size", "11px")
            .style("fill", "var(--text-main)")
            .style("font-weight", "600")
            .style("pointer-events", "none");
            
        if(containerId === 'chart-radial-stacked') {
            App.updateStats(validData.map(d => d.total));
        }
    },

    resetView() { App.selectedIds.clear(); this.clearSelectionStyle(); App.updateCard({title:"Vue Globale", desc:"Sélection réinitialisée."}); document.getElementById('reset-container').style.display = 'none'; d3.selectAll("path").style("opacity", null); d3.selectAll(".bubble").style("opacity", null); },
    clearSelectionStyle() { d3.selectAll(".dimmed").classed("dimmed", false); },
    resetSelection(e) { if(e.target.className.includes && e.target.className.includes('chart-wrapper')) this.resetView(); },

    renderBarometreStreamgraph(data, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !data || !Array.isArray(data.streamgraph)) return;
        container.innerHTML = '';

        const chartData = data.streamgraph;
        const themes = data.themes || (chartData.length ? Object.keys(chartData[0]).filter(k => k !== 'year') : []);
        const summaryEl = document.querySelector('#slide-3 #streamgraph-summary p');
        const legendEl = document.getElementById('streamgraph-legend');

        if (chartData.length === 0 || themes.length === 0) {
            if (summaryEl) summaryEl.innerHTML = 'Aucune donnée thématique disponible pour ce streamgraph.';
            if (legendEl) legendEl.innerHTML = '';
            return;
        }

        const visibleThemes = themes.filter(theme => !App.hiddenStreamgraphThemes.has(theme));
        if (visibleThemes.length === 0) {
            if (summaryEl) summaryEl.innerHTML = 'Aucun thème sélectionné. Cliquez sur la légende pour réactiver des thèmes.';
            if (legendEl) {
                legendEl.innerHTML = '';
                themes.forEach(theme => {
                    const button = document.createElement('button');
                    button.className = 'streamgraph-legend-item inactive';
                    button.textContent = theme;
                    button.onclick = () => App.toggleStreamgraphTheme(theme);
                    legendEl.appendChild(button);
                });
            }
            return;
        }

        const years = chartData.map(d => d.year);
        const width = Math.max(container.clientWidth, 720);
        const height = Math.max(container.clientHeight, 480);
        const margin = {top: 20, right: 30, bottom: 30, left: 50};

        const colorPalettes = {
            ALL: CUSTOM_PALETTE,
            H: ["#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"],
            F: ["#B91C1C", "#DC2626", "#EF4444", "#F97316", "#FB7185", "#FBCFE8", "#FDE8F1"]
        };

        const series = d3.stack()
            .keys(visibleThemes)
            .offset(d3.stackOffsetWiggle)
            (chartData);

        const svg = d3.select(container).append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("max-width", "100%")
            .style("height", "auto");

        const x = d3.scaleLinear()
            .domain(d3.extent(years))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(series, d => d3.min(d, dd => dd[0])), d3.max(series, d => d3.max(d, dd => dd[1]))])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal(colorPalettes[App.streamgraphGender] || CUSTOM_PALETTE).domain(visibleThemes);

        const area = d3.area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
            .curve(d3.curveBasis);

        const tooltip = d3.select(container).append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("background", "var(--bg-card)")
            .style("border", "1px solid var(--accent-ui)")
            .style("padding", "10px")
            .style("border-radius", "8px")
            .style("color", "var(--text-main)")
            .style("pointer-events", "none")
            .style("z-index", 100);

        const paths = svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", d => color(d.key))
            .attr("d", area)
            .style("opacity", 0.85)
            .style("stroke", "var(--bg-color)")
            .style("stroke-width", 0.4)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 1).style("stroke", "var(--text-main)").style("stroke-width", 1);
                const coords = d3.pointer(event, container);
                tooltip.transition().duration(200).style("opacity", 1);
                const total = d3.sum(d, dd => dd[1] - dd[0]);
                tooltip.html(`<strong>${d.key}</strong><br>${d3.format(",")(total)} sujets cumulés`)
                    .style("left", `${coords[0] + 15}px`)
                    .style("top", `${coords[1] - 28}px`);
            })
            .on("mousemove", function(event) {
                const coords = d3.pointer(event, container);
                tooltip.style("left", `${coords[0] + 15}px`)
                    .style("top", `${coords[1] - 28}px`);
            })
            .on("mouseout", function() {
                d3.select(this).style("opacity", 0.85).style("stroke", "var(--bg-color)").style("stroke-width", 0.4);
                tooltip.transition().duration(300).style("opacity", 0);
            });

        paths.transition()
            .delay((d, i) => i * 60)
            .duration(1200)
            .ease(d3.easeCubicOut)
            .attr("d", area)
            .style("opacity", 0.95);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format("d")))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height + margin.top + margin.bottom)
                .attr("stroke-opacity", 0.08))
            .selectAll("text")
            .style("fill", "var(--text-main)");
            
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(0))
            .call(g => g.select(".domain").remove());

        const totals = themes.map(theme => {
            const total = d3.sum(chartData, row => +row[theme] || 0);
            return {
                theme,
                total,
                first: +chartData[0][theme] || 0,
                last: +chartData[chartData.length - 1][theme] || 0
            };
        });

        const totalSum = d3.sum(totals, d => d.total);
        const sorted = totals.slice().sort((a, b) => b.total - a.total);
        const topThemes = sorted.slice(0, 3).map(d => d.theme).join(', ');
        const topShare = totalSum ? Math.round((sorted[0].total / totalSum) * 100) : 0;

        const trend = totals.map(d => ({
            theme: d.theme,
            delta: d.last - d.first
        }));
        const biggestRise = trend.reduce((best, current) => current.delta > best.delta ? current : best, trend[0]);
        const biggestDrop = trend.reduce((best, current) => current.delta < best.delta ? current : best, trend[0]);

        if (summaryEl) {
            summaryEl.innerHTML = `Le streamgraph montre l’évolution de ${themes.length} thèmes entre ${years[0]} et ${years[years.length - 1]}. ${topThemes} dominent la couverture et constituent ${topShare}% du volume total. Entre les deux extrêmes, <strong>${biggestRise.theme}</strong> a gagné ${d3.format(",")(biggestRise.delta)} unités tandis que <strong>${biggestDrop.theme}</strong> a perdu ${d3.format(",")(Math.abs(biggestDrop.delta))} unités.`;
        }

        if (legendEl) {
            legendEl.innerHTML = '';
            themes.forEach(theme => {
                const visible = !App.hiddenStreamgraphThemes.has(theme);
                const button = document.createElement('button');
                button.className = `streamgraph-legend-item ${visible ? 'active' : 'inactive'}`;
                button.innerHTML = `<span class="legend-dot" style="background:${color(theme)}"></span><span>${theme}</span>`;
                button.onclick = () => App.toggleStreamgraphTheme(theme);
                legendEl.appendChild(button);
            });
        }

        App.updateStreamgraphControlButtons();
    },

    renderBarometreRadialStacked(data, containerId) {
        const container = document.getElementById(containerId);
        if(!container || !data) return;
        container.innerHTML = '';

        const chartData = data.radial;
        const chaines = data.chaines;
        if (chartData.length === 0) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        const innerRadius = 150;
        const outerRadius = Math.min(width, height) / 2 - 40;

        const svg = d3.select(container).append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("width", width)
            .attr("height", height);

        const x = d3.scaleBand()
            .domain(chartData.map(d => d.theme))
            .range([0, 2 * Math.PI])
            .align(0);

        const yScale = (typeof d3.scaleRadial === 'function') ? d3.scaleRadial() : d3.scaleLinear();
        const y = yScale
            .domain([0, d3.max(chartData, d => d.total)])
            .range([innerRadius, outerRadius]);

        const arc = d3.arc()
            .innerRadius(d => y(d[0]))
            .outerRadius(d => y(d[1]))
            .startAngle(d => x(d.data.theme))
            .endAngle(d => x(d.data.theme) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius);

        const series = d3.stack().keys(chaines)(chartData);
        const color = d3.scaleOrdinal(CUSTOM_PALETTE).domain(chaines);

        const tooltip = d3.select(container).append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("background", "var(--bg-card)")
            .style("border", "1px solid var(--accent-ui)")
            .style("padding", "10px")
            .style("border-radius", "8px")
            .style("color", "var(--text-main)")
            .style("pointer-events", "none")
            .style("z-index", 100);

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("path")
            .data(d => d.map(item => { item.key = d.key; return item; }))
            .join("path")
            .attr("d", arc)
            .style("stroke", "var(--bg-card)")
            .style("stroke-width", "1px")
            .on("mouseover", function(event, d) {
                d3.selectAll("path").style("opacity", 0.3);
                d3.select(this).style("opacity", 1);
                const coords = d3.pointer(event, container);
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${d.data.theme}</strong><br>${d.key}: ${(d[1]-d[0]).toFixed(0)} s`)
                    .style("left", (coords[0] + width/2 + 15) + "px")
                    .style("top", (coords[1] + height/2 - 28) + "px");
            })
            .on("mousemove", function(event) {
                const coords = d3.pointer(event, container);
                tooltip.style("left", (coords[0] + width/2 + 15) + "px")
                    .style("top", (coords[1] + height/2 - 28) + "px");
            })
            .on("mouseout", function() {
                d3.selectAll("path").style("opacity", 1);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        const labelGroup = svg.append("g").selectAll("g")
            .data(chartData)
            .join("g")
            .attr("text-anchor", d => (x(d.theme) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "start" : "end")
            .attr("transform", d => `
                rotate(${((x(d.theme) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                translate(${outerRadius + 15},0)
            `);

        labelGroup.append("text")
            .attr("transform", d => (x(d.theme) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "" : "rotate(180)")
            .text(d => d.theme.length > 20 ? d.theme.substring(0, 20) + '...' : d.theme)
            .style("font-size", "11px")
            .style("fill", "var(--text-main)")
            .style("font-weight", "600")
            .style("pointer-events", "none");

        // Legend
        const legend = svg.append("g")
            .attr("transform", `translate(-${width/2 - 20}, -${height/2 - 20})`)
            .selectAll("g")
            .data(chaines)
            .join("g")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color);

        legend.append("text")
            .attr("x", 25)
            .attr("y", 12)
            .text(d => d)
            .style("fill", "var(--text-main)")
            .style("font-size", "12px");
    }
};

App.init();
