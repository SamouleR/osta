import React, { useEffect } from 'react'
import Chatbot from './Chatbot'

export default function App() {
  const [activeMode, setActiveMode] = React.useState('graphique')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/app.js'
    script.async = true
    document.body.appendChild(script)

    showGraphique()

    return () => {
      document.body.removeChild(script)
      document.body.classList.remove('artistic-mode-active')
    }
  }, [])

  const hideAllViews = () => {
    const articleView = document.getElementById('article-view')
    const analyticView = document.getElementById('analytic-view')
    const artisticView = document.getElementById('artistic-view')

    if (articleView) articleView.style.display = 'none'
    if (analyticView) analyticView.style.display = 'none'
    if (artisticView) artisticView.style.display = 'none'
    document.body.classList.remove('artistic-mode-active')
  }

  const showGraphique = () => {
    hideAllViews()
    const analyticView = document.getElementById('analytic-view')
    if (analyticView) analyticView.style.display = 'block'
    document.body.classList.remove('artistic-mode-active')
    setActiveMode('graphique')
  }

  const showCrea = () => {
    hideAllViews()
    const artisticView = document.getElementById('artistic-view')
    if (artisticView) artisticView.style.display = 'flex'
    document.body.classList.add('artistic-mode-active')
    setActiveMode('crea')
  }


  return (
    <div>
      <div id="transition-overlay">
        <div className="transition-text" id="transition-title">CHARGEMENT</div>
        <div className="transition-sub" id="transition-body">Analyse des données en cours...</div>
      </div>

      <div id="intro-screen">
        <div className="intro-content active" id="intro-step-1">
          <div className="intro-sae">SAE 302</div>
          <h1 className="intro-title">DATAVISUALISATION</h1>
        </div>
        <div className="intro-content" id="intro-step-2">
          <h1 className="intro-title-main">Les Français Française face à l'audiovisuel</h1>
          <div className="intro-authors">
            <span className="author-name">Samuel Ralaikoa</span>
            <span className="author-name">Kinaya Zakaria</span>
            <span className="author-name">Dienaba Sow</span>
          </div>
        </div>
        <div className="intro-content" id="intro-step-3">
          <h1 className="intro-title-main">Problématique</h1>
          <p className="intro-subtitle intro-problem-text">
            <span>Quand les femmes parlent à l’écran, leur temps de parole reste systématiquement plus faible que celui des hommes.</span>
            <span>Nos premiers graphiques de part de parole et de bilan global montrent que cet écart est visible dès le premier coup d’œil.</span>
          </p>
        </div>
        <div className="intro-content" id="intro-step-4">
          <h1 className="intro-title-main">Constat</h1>
          <p className="intro-subtitle">
            Les premières données montrent que les femmes restent sous-représentées dans les médias.
            L’analyse de ces graphiques confirme que cet écart est structurel, même lorsqu’on compare les temps de parole entre chaînes publiques et privées.
          </p>
        </div>
      </div>

      <nav className="main-navbar">
        <div className="navbar-inner navbar-center-layout">
          <div className="nav-center">
            <select id="chart-select" defaultValue="0" className="chart-select-dropdown">
              <option value="0">Parité temps de parole</option>
              <option value="1">Hiérarchie des médias</option>
              <option value="2">Films les plus diffusés</option>
              <option value="3">Évolution thématique</option>
            </select>
          </div>
        </div>
      </nav>

      <div id="article-view" style={{ display: 'none' }}></div>

      <div id="analytic-view" style={{ display: 'block' }}>
        <div className="main-layout">
          <div className="left-panel">
            <div id="generic-controls">
              <div className="section-title" data-interactive="true">Navigation</div>
              <div id="filter-list"></div>
              <div id="filter-list-top" className="filter-list-top"></div>
              <div id="streamgraph-legend-left" style={{ display: 'none', marginTop: '8px' }}>
                <div className="section-title">Légende</div>
                <div id="streamgraph-legend-left-inner" className="streamgraph-legend"></div>
              </div>
              <div id="sunburst-controls" style={{ display: 'none', marginTop: '20px' }}>
                <div className="section-title" data-interactive="true">Sexe</div>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                  <button className="retro-btn active" id="btn-all">Tous</button>
                  <button className="retro-btn" id="btn-h">H</button>
                  <button className="retro-btn" id="btn-f">F</button>
                </div>
                <div className="section-title" data-interactive="true">Groupe Média</div>
                <div id="sunburst-groups" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}></div>
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Groupe</label>
                  <select id="hierarchy-group-select" style={{ width: '100%', padding: '8px', borderRadius: '6px' }}>
                    <option value="Tous">Tous</option>
                  </select>
                </div>
                <div id="hierarchy-left-filters" style={{ display: 'none', marginTop: '12px' }}></div>
              </div>
            </div>

            <div id="meta-controls" style={{ display: 'none' }}>
              <div className="section-title" data-interactive="true">Filtres Données</div>
              <div>
                <label>Groupe / Catégorie</label>
                <select id="meta-group-select"><option value="all">Tous</option></select>
              </div>
              <div style={{ marginTop: '15px' }}>
                <label>Média / Nom</label>
                <select id="meta-media-select"><option value="all">Tous</option></select>
              </div>
              <div style={{ marginTop: '20px' }}>
                <button className="retro-btn" id="btn-meta-reset">Réinitialiser Vue</button>
              </div>
            </div>

            <div id="film-controls" style={{ display: 'none' }}>
              <div className="section-title" data-interactive="true">Filtres Films</div>
              <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, marginRight: '6px' }}>Trier</label>
                  <select id="film-sort-select" style={{ padding: '8px', borderRadius: '8px' }}>
                    <option value="year-desc">Année ▼</option>
                    <option value="year-asc">Année ▲</option>
                    <option value="diff-desc">Diffusions ▼</option>
                    <option value="diff-asc">Diffusions ▲</option>
                    <option value="title-asc">Titre A→Z</option>
                    <option value="title-desc">Titre Z→A</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Second</label>
                  <select id="film-sort-secondary" style={{ padding: '8px', borderRadius: '8px' }}>
                    <option value="title-asc">Titre A→Z</option>
                    <option value="title-desc">Titre Z→A</option>
                    <option value="year-desc">Année ▼</option>
                    <option value="year-asc">Année ▲</option>
                    <option value="diff-desc">Diffusions ▼</option>
                    <option value="diff-asc">Diffusions ▲</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700 }}>Top</label>
                <select id="film-top-select" style={{ padding: '8px', borderRadius: '8px' }}>
                  <option value="all">Tous</option>
                  <option value="top20">Top 20 (global)</option>
                  <option value="top20-women">Top 20 (films avec femmes)</option>
                </select>
                <button id="film-toggle-top" className="retro-btn" style={{ padding: '8px 10px' }}>Basculer Top20/Tous</button>
                <input id="film-search" placeholder="Rechercher par titre..." style={{ flex: 1, padding: '8px', borderRadius: '8px' }} />
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <label>Sexe (films)</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button className="retro-btn" id="film-btn-all">Tous</button>
                  <button className="retro-btn" id="film-btn-h">H</button>
                  <button className="retro-btn" id="film-btn-f">F</button>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Filtre actif uniquement si les données de film contiennent un champ de répartition H/F.</div>
              </div>

              <div id="films-list" style={{ marginTop: '12px', maxHeight: '50vh', overflowY: 'auto' }}></div>
              <div>
                <label>Pays de Production</label>
                <select id="country-select">
                  <option value="all">Tous les pays</option>
                  <option value="FR">France (Uniquement)</option>
                  <option value="US">États-Unis</option>
                  <option value="IT">Italie</option>
                  <option value="coprod">Co-productions</option>
                </select>
              </div>
              <div style={{ marginTop: '15px' }}>
                <label>Année de Sortie (min)</label>
                <input type="range" id="year-min" min="1946" max="1999" defaultValue="1946" step="1" />
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  Films après <span id="year-val">1946</span>
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
                <label>Dernière Diffusion</label>
                <select id="diff-select">
                  <option value="all">Toutes</option>
                  <option value="2013">2013</option>
                  <option value="2012">2012</option>
                  <option value="2011">2011</option>
                  <option value="2010">2010</option>
                </select>
              </div>
            </div>

            <div id="reset-container" style={{ display: 'none', marginTop: '20px' }}>
              <button className="retro-btn" id="btn-reset">Réinitialiser</button>
            </div>
          </div>

          <div className="center-panel">
            <div className="chart-main-title" id="main-chart-title" data-interactive="true">PARITÉ TEMPS DE PAROLE</div>
            <div className="chart-wrapper">
              <div id="slide-0" className="slide">
                <div className="slide0-vertical-layout slide0-bg-white">
                  <div className="slide0-chart-grid">
                    <div className="slide0-chart-section slide0-chart-section-large">
                      <div className="slide0-chart-label slide0-label-men">
                        <span className="slide0-label-num">01</span>
                        <span className="slide0-label-title">Part des hommes</span>
                      </div>
                      <div id="chart-men-only" className="slide0-chart-container"></div>
                    </div>
                    <div className="slide0-chart-section slide0-chart-section-large">
                      <div className="slide0-chart-label slide0-label-women">
                        <span className="slide0-label-num">02</span>
                        <span className="slide0-label-title">Part des femmes</span>
                      </div>
                      <div id="chart-women-only" className="slide0-chart-container"></div>
                    </div>
                    <div className="slide0-chart-section slide0-chart-section-large">
                      <div className="slide0-chart-label slide0-label-both">
                        <span className="slide0-label-num">03</span>
                        <span className="slide0-label-title">Bilan global H / F</span>
                      </div>
                      <div id="chart-both" className="slide0-chart-container"></div>
                    </div>
                  </div>
                  <div className="slide-summary" style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Ces graphiques donnent une vue d'ensemble du temps de parole par sexe : comparez les parts hommes/femmes et le flux entre groupes médias.</div>
                  </div>
                  <div className="slide0-chart-section slide0-chart-section-fullwidth">
                    <div className="slide0-chart-label slide0-label-flow">
                      <span className="slide0-label-num">04</span>
                      <span className="slide0-label-title">Flux hommes / femmes</span>
                    </div>
                    <div id="chart-chord-home" className="slide0-chart-container" style={{ minHeight: '360px' }}></div>
                  </div>
                  
                </div>
              </div>
              
              <div id="slide-1" className="slide">
                
                <div id="chart-sunburst" style={{ width: '100%', height: 'min(80vh, 760px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                <div id="sunburst-breadcrumbs" style={{ width: '100%', marginTop: '12px' }}></div>
                <div style={{ width: '100%', marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>La hiérarchie montre l'organisation des groupes et leurs parts de temps de parole ; cliquez sur un arc pour zoomer.</div>
              </div>
              <div id="slide-2" className="slide">
                
                <div className="film-slide-layout">
                <div className="film-chart-panel film-chart-fullwidth">
                  
                  <div style={{ width: '100%', marginBottom: '10px' }} className="slide-text-block">
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Films les plus diffusés</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px' }}>Ce graphique montre les films les plus souvent diffusés à la télévision ; la longueur des barres indique le nombre de diffusions. Survolez une barre pour voir le détail (année, pays, réalisateur).</div>
                  </div>
                  <div id="chart-films" style={{ width: '100%', height: '100%' }}></div>
                </div>
              </div>
              
            </div>
              <div id="slide-3" className="slide">
                
                <div className="streamgraph-layout">
                  <aside className="streamgraph-sidebar">
                    <div id="streamgraph-controls" className="streamgraph-controls">
                      <div className="gender-filter-row">
                        <button className="gender-filter active" id="btn-stream-all">Tous</button>
                        <button className="gender-filter" id="btn-stream-h">H</button>
                        <button className="gender-filter" id="btn-stream-f">F</button>
                      </div>
                    </div>
                      <div className="streamgraph-legend-panel">
                        <div className="section-title">Légende</div>
                        <p className="legend-desc" style={{ margin: '0 0 10px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Les éléments ci-dessous correspondent aux thèmes; cliquez pour isoler un thème dans le graphique.</p>
                        <div id="streamgraph-legend" className="streamgraph-legend"></div>
                      </div>
                  </aside>
                  <div className="streamgraph-chart-panel">
                    <div id="chart-streamgraph" className="streamgraph-chart">Chargement du streamgraph...</div>
                  </div>
                </div>
              </div>
              {/* slide-4 (Infos) removed per request */}
            </div>
          </div>

          <div className="right-panel" id="right-panel-main" style={{ display: 'none' }}>
            
            <h2 className="section-title" id="info-header" data-interactive="true">DÉTAILS</h2>
            <div className="standard-card" id="std-card">
              <div className="sc-header">
                <img id="sc-img" className="sc-img hidden" src="" alt="Icon" />
                <i id="sc-icon" className="fas fa-database sc-placeholder-icon"></i>
              </div>
              <div className="sc-title" id="sc-title">Sélectionnez</div>
              <div className="sc-desc" id="sc-desc">Survolez les graphiques pour voir les détails.</div>
              <div className="gender-container" id="sc-gender-box">
                <div className="gender-labels">
                  <span style={{ color: 'var(--col-men)' }}>H</span>
                  <span style={{ color: 'var(--col-women)' }}>F</span>
                </div>
                <div className="gender-bar-wrapper">
                  <div id="sc-bar-men" className="gender-bar-part men" style={{ width: '50%' }}></div>
                  <div id="sc-bar-women" className="gender-bar-part women" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
            <div className="tv-set" id="tv-card">
              <div className="tv-antenna antenna-l"><div className="antenna-ball"></div></div>
              <div className="tv-antenna antenna-r"><div className="antenna-ball"></div></div>
              <div className="tv-screen-frame">
                <div className="tv-screen">
                  <img id="tv-bg-image" src="https://ui-avatars.com/api/?name=TV&background=333&color=fff" alt="Screen" />
                  <div className="tv-overlay"></div>
                  <div className="tv-content-layer">
                    <div className="tv-text-wrapper">
                      <h3 id="tv-card-title">CANAL 1</h3>
                      <p id="tv-card-desc">En attente de signal...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tv-controls"></div>
            </div>
            <div id="film-controls-right" style={{ display: 'none', width: '100%' }}>
              <div className="section-title" style={{ marginTop: '20px' }}>Filtres Films</div>
              <div style={{ marginBottom: '14px' }}>
                <label>Pays de Production</label>
                <select id="country-select-right" style={{ width: '100%', padding: '10px', background: 'rgba(128,128,128,0.08)', color: 'var(--text-main)', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <option value="all">Tous les pays</option>
                  <option value="FR">France</option>
                  <option value="US">États-Unis</option>
                  <option value="IT">Italie</option>
                  <option value="coprod">Co-productions</option>
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Année de Sortie (min)</label>
                <input type="range" id="year-min-right" min="1946" max="1999" defaultValue="1946" step="1" style={{ width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  Films après <span id="year-val-right">1946</span>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Dernière Diffusion</label>
                <select id="diff-select-right" style={{ width: '100%', padding: '10px', background: 'rgba(128,128,128,0.08)', color: 'var(--text-main)', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <option value="all">Toutes</option>
                  <option value="2013">2013</option>
                  <option value="2012">2012</option>
                  <option value="2011">2011</option>
                  <option value="2010">2010</option>
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Sexe (films)</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button className="retro-btn" id="film-right-btn-all">Tous</button>
                  <button className="retro-btn" id="film-right-btn-h">H</button>
                  <button className="retro-btn" id="film-right-btn-f">F</button>
                </div>
              </div>
            </div>
            {/* Hierarchy filters moved to the left panel (sunburst-controls) */}
          </div>
        </div>

        <button className="nav-btn-corner" id="btn-prev" title="Précédent" style={{ position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 21000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="nav-btn-corner" id="btn-next" title="Suivant" style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 21000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div id="artistic-view" style={{ display: 'none', flexDirection: 'column', position: 'relative', width: '100%', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div id="artistic-content"></div>
      </div>

      <Chatbot />
    </div>
  )
}
