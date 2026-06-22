
// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════
const SKUS = [
  {name:'Mango Fizz 500ml',cat:'Beverages',rev:142,val:0.82,cx:0.31,stockouts:1,promo:0.28,margin:41,growth:0.18,lead:14},
  {name:'Aloe Vera Drink',cat:'Beverages',rev:98,val:0.68,cx:0.44,stockouts:3,promo:0.51,margin:34,growth:0.09,lead:18},
  {name:'Green Tea RTD',cat:'Beverages',rev:76,val:0.59,cx:0.58,stockouts:4,promo:0.62,margin:29,growth:-0.04,lead:22},
  {name:'Oat Cookies',cat:'Snacks',rev:121,val:0.77,cx:0.29,stockouts:1,promo:0.22,margin:44,growth:0.22,lead:12},
  {name:'Masala Puffs',cat:'Snacks',rev:88,val:0.64,cx:0.38,stockouts:2,promo:0.33,margin:38,growth:0.11,lead:14},
  {name:'Choco Wafers',cat:'Snacks',rev:44,val:0.34,cx:0.71,stockouts:5,promo:0.72,margin:22,growth:-0.12,lead:28},
  {name:'Hand Cream SPF',cat:'Personal Care',rev:62,val:0.48,cx:0.52,stockouts:3,promo:0.44,margin:31,growth:0.06,lead:20},
  {name:'Herbal Shampoo',cat:'Personal Care',rev:108,val:0.74,cx:0.34,stockouts:1,promo:0.19,margin:47,growth:0.28,lead:11},
  {name:'Foam Face Wash',cat:'Personal Care',rev:55,val:0.42,cx:0.63,stockouts:4,promo:0.57,margin:26,growth:-0.08,lead:25},
  {name:'Floor Cleaner',cat:'Household',rev:38,val:0.29,cx:0.74,stockouts:6,promo:0.68,margin:19,growth:-0.16,lead:31},
  {name:'Dish Soap 1L',cat:'Household',rev:92,val:0.65,cx:0.35,stockouts:2,promo:0.28,margin:36,growth:0.14,lead:13},
  {name:'Fabric Softener',cat:'Household',rev:28,val:0.22,cx:0.81,stockouts:7,promo:0.76,margin:15,growth:-0.22,lead:35},
];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CHANNELS = ['Modern Trade','E-Commerce','General Trade','Pharmacy','D2C'];
const isDark = () => document.documentElement.classList.contains('dark');
const plt = (id,data,layout,config={scrollZoom:true,displayModeBar:false,responsive:true}) => {
  const bg = isDark()?'#1c1c18':'#ffffff';
  const fc = isDark()?'#b0afa5':'#555555';
  const gc = isDark()?'#2e2e28':'#e0dfd8';
  Plotly.react(id,data,{
    paper_bgcolor:'transparent',plot_bgcolor:'transparent',
    font:{family:'IBM Plex Sans,system-ui,sans-serif',color:fc,size:11},
    margin:{t:20,r:20,b:50,l:60},
    xaxis:{gridcolor:gc,zerolinecolor:gc,...(layout.xaxis||{})},
    yaxis:{gridcolor:gc,zerolinecolor:gc,...(layout.yaxis||{})},
    ...layout
  },config);
};

let customSKU = null;
let signals = [
  {id:1,title:'Fabric Softener stockout — 7 events Q4',sev:'critical',type:'Supply',detail:'Highest stockout frequency in portfolio. Lead time 35 days is 2.5× benchmark.',ack:false},
  {id:2,title:'Choco Wafers promo dependency at 72%',sev:'critical',type:'Margin',detail:'Only 28% of revenue is organic. Margin collapses if promo budget cut.',ack:false},
  {id:3,title:'Green Tea RTD revenue declining YoY −4%',sev:'warning',type:'Demand',detail:'Also 62% promo dependent. Double-risk SKU — flag for rationalization review.',ack:false},
  {id:4,title:'Herbal Shampoo growth at 28% — scale supply',sev:'info',type:'Supply',detail:'Fastest-growing SKU. Lead time 11 days allows rapid ramp-up.',ack:false},
  {id:5,title:'Beverages cannibalization risk elevated',sev:'warning',type:'Cannibalization',detail:'Mango Fizz variants showing −0.62 promo correlation. Review variant architecture.',ack:false},
  {id:6,title:'Floor Cleaner complexity score 0.74',sev:'warning',type:'Supply',detail:'Highest complexity + lowest value. Priority rationalization candidate.',ack:false},
];
let scenarios = [];

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
function switchSection(id){
  // Hide all sections, show selected one
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('section-'+id).classList.add('active');
  
  // Update sidebar navigation
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('nav-'+id).classList.add('active');
  
  // Render charts and refresh UI for each section
  setTimeout(()=>{
    // Refresh role banner and highlights (if functions exist)
    if(typeof injectRoleBanner === 'function') injectRoleBanner();
    if(typeof highlightRoleKPIs === 'function') highlightRoleKPIs();
    
    // Section-specific rendering
    if(id==='portfolio') {
      updateKPIs();
      renderTopSKUs();
    }
    if(id==='launch') {
      // Launch readiness renders when form is submitted
    }
    if(id==='profitability') {
      // Profitability tree renders when form is submitted
    }
    if(id==='sku') {
      renderCannChart();
      renderPromoErosion();
    }
    if(id==='signals') {
      if(typeof renderInbox === 'function') renderInbox();
      renderSignals();
      renderSignalTimeline();
    }
    if(id==='vp-exec') {
      if(typeof initVPDashboard === 'function') initVPDashboard();
    }
  }, 50);
}
function switchTab(btn,id){
  btn.closest('.tab-row').querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  const section = btn.closest('.section');
  section.querySelectorAll('.ph-tab').forEach(t=>{t.style.display='none'});
  document.getElementById(id).style.display='block';
  setTimeout(()=>{
    if(id==='ph-kpi') {updateKPIs();renderTopSKUs();}
    if(id==='ph-matrix') renderMatrixChart();
    if(id==='ph-pareto') renderPareto(80);
    if(id==='ph-channel') {renderChannelChart();renderChannelMix();}
    if(id==='ph-sim') runSim();
  },50);
}
function toggleGuide(id){
  const el = document.getElementById(id);
  el.classList.toggle('open');
}
function toggleTheme(){
  const d = document.documentElement.classList.toggle('dark');
  localStorage.setItem('acies_dark_mode',d);
  document.getElementById('theme-icon').textContent = d?'☀':'☾';
  document.getElementById('theme-label').textContent = d?'Light mode':'Dark mode';
  renderAllCharts();
}
function renderAllCharts(){
  updateKPIs();renderTopSKUs();renderMatrixChart();renderPareto(80);renderChannelChart();renderChannelMix();runSim();renderCannChart();renderPromoErosion();renderSignalTimeline();
}
function setRole(role,btn){
  document.querySelectorAll('[id^=role-]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const subs = {vp:'Monitor portfolio-level risks and growth opportunities.',pm:'Track your SKU\'s value score, launch readiness, and shelf performance.',pricing:'Focus on margin leakage, promo dependency, and profitability drivers.'};
  document.getElementById('portfolio-subtitle').textContent = subs[role];
}

// ═══════════════════════════════════════════════════════════════════════════
// GUIDED TOUR
// ═══════════════════════════════════════════════════════════════════════════
const TOUR_STEPS = [
  {title:'Welcome to AgenticBus',desc:'Your AI-powered portfolio intelligence platform. Let\'s walk through the key features in 2 minutes.',target:null},
  {title:'KPI Filter Form',desc:'Filter your entire portfolio by category, region, year, or minimum revenue. Every chart updates instantly based on your selection.',target:'kpi-filter-form'},
  {title:'KPI Strip',desc:'8 headline metrics at a glance. Green ▲ = healthy growth. Red ▲ = rising risk (complexity, stockouts). Hover any card for calculation details.',target:'kpi-strip'},
  {title:'Value × Complexity Matrix',desc:'Navigate to this tab to see every SKU plotted by commercial value vs operational complexity. The quadrants tell you which SKUs to keep, grow, consolidate, or rationalize.',target:'nav-portfolio',action:()=>{switchSection('portfolio');setTimeout(()=>switchTab(document.querySelectorAll('.tab')[1],'ph-matrix'),100);}},
  {title:'Launch Readiness',desc:'Score new SKU launches across 5 dimensions before committing resources. Compare against category benchmarks to de-risk product development.',target:'nav-launch',action:()=>switchSection('launch')},
  {title:'Profitability Tree',desc:'Decompose any SKU into its profitability drivers. Model what-if scenarios by adjusting price, cost, or promo spend to see instant margin impact.',target:'nav-profitability',action:()=>switchSection('profitability')},
  {title:'SKU Rationalization',desc:'Identify cannibalization risk between variants and promo-dependent SKUs. Use this to prioritize tail SKUs for removal.',target:'nav-sku',action:()=>switchSection('sku')},
  {title:'Signals Board',desc:'AI-surfaced alerts ranked by urgency. Critical signals (🔴) require immediate action. Filter by type to focus on your domain.',target:'nav-signals',action:()=>switchSection('signals')},
  {title:'Persona Switching',desc:'Toggle between VP Product Management, Product Manager, and Pricing & Margin to see role-specific KPIs and insights.',target:'role-vp'},
  {title:'Dark Mode',desc:'Prefer dark theme? Toggle here. All charts and tables adapt automatically.',target:'tour-start'},
  {title:'Guided Learning',desc:'Every tab has a 📖 guide button that breaks down how to interpret the data and what actions to take. Click one now to see!',target:'guide-trigger'},
  {title:'You\'re Ready!',desc:'Explore the tabs, run simulations, and export insights. Click "Start Tour" anytime to replay this walkthrough.',target:null}
];
let tourStep = 0;
function startTour(){
  tourStep = 0;
  document.getElementById('tour-overlay').classList.add('active');
  renderTourStep();
}
function skipTour(){
  document.getElementById('tour-overlay').classList.remove('active');
}
function tourNext(){
  if(tourStep < TOUR_STEPS.length-1){
    tourStep++;
    renderTourStep();
  } else {
    skipTour();
  }
}
function tourPrev(){
  if(tourStep > 0){
    tourStep--;
    renderTourStep();
  }
}
function renderTourStep(){
  const step = TOUR_STEPS[tourStep];
  document.getElementById('tour-count').textContent = `Step ${tourStep+1} of ${TOUR_STEPS.length}`;
  document.getElementById('tour-title').textContent = step.title;
  document.getElementById('tour-desc').textContent = step.desc;
  document.getElementById('tour-progress').style.width = ((tourStep+1)/TOUR_STEPS.length*100)+'%';
  document.getElementById('tour-prev').style.display = tourStep>0?'block':'none';
  document.getElementById('tour-next').textContent = tourStep===TOUR_STEPS.length-1?'Finish':'Next →';
  
  const dots = TOUR_STEPS.map((_,i)=>`<div class="tour-dot ${i===tourStep?'active':''}"></div>`).join('');
  document.getElementById('tour-dots').innerHTML = dots;
  
  if(step.action) step.action();
  
  const spotlight = document.getElementById('tour-spotlight');
  const tooltip = document.getElementById('tour-tooltip');
  if(step.target){
    const el = document.getElementById(step.target) || document.querySelector('.'+step.target);
    if(el){
      const rect = el.getBoundingClientRect();
      spotlight.style.left = rect.left+'px';
      spotlight.style.top = rect.top+'px';
      spotlight.style.width = rect.width+'px';
      spotlight.style.height = rect.height+'px';
      spotlight.style.opacity = '1';
      tooltip.style.left = (rect.left + rect.width/2)+'px';
      tooltip.style.top = (rect.bottom + 16)+'px';
      tooltip.style.transform = 'translateX(-50%)';
      if(rect.bottom + 200 > window.innerHeight){
        tooltip.style.top = (rect.top - 16)+'px';
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
      }
    }
  } else {
    spotlight.style.opacity = '0';
    tooltip.style.left = '50%';
    tooltip.style.top = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// KPI
// ═══════════════════════════════════════════════════════════════════════════
function computeKPIs(skus){
  const totalRev = skus.reduce((a,s)=>a+s.rev,0);
  const avgMargin = skus.reduce((a,s)=>a+s.margin,0)/skus.length;
  const avgGrowth = skus.reduce((a,s)=>a+s.growth,0)/skus.length;
  const avgCx = skus.reduce((a,s)=>a+s.cx,0)/skus.length;
  const avgPromo = skus.reduce((a,s)=>a+s.promo,0)/skus.length;
  const avgLead = skus.reduce((a,s)=>a+s.lead,0)/skus.length;
  const totalStockout = skus.reduce((a,s)=>a+s.stockouts,0);
  const highVal = skus.filter(s=>s.val>=0.6).length;
  const pci = (avgCx*0.8 + avgPromo*0.5 + (avgLead/35)*0.4)/1.7;
  return [
    {label:'Total Revenue',value:'₹'+Math.round(totalRev)+'Cr',delta:'+12%',dir:'up',risk:false},
    {label:'Avg Gross Margin',value:avgMargin.toFixed(1)+'%',delta:'+1.4pp',dir:'up',risk:false},
    {label:'Revenue Growth',value:(avgGrowth*100).toFixed(1)+'%',delta:'YoY',dir:avgGrowth>0?'up':'down',risk:false},
    {label:'Portfolio Complexity',value:pci.toFixed(3),delta:'+0.04',dir:'up',risk:true},
    {label:'Promo Dependency',value:(avgPromo*100).toFixed(0)+'%',delta:'+3pp',dir:'up',risk:true},
    {label:'Avg Lead Time',value:Math.round(avgLead)+'d',delta:'+2d',dir:'up',risk:true},
    {label:'Total Stockouts',value:totalStockout,delta:'events',dir:totalStockout>15?'down':'up',risk:true},
    {label:'High-Value SKUs',value:highVal+'/'+skus.length,delta:'',dir:'up',risk:false},
  ];
}
function updateKPIs(){
  const cat = document.getElementById('kpi-cat').value;
  const minRev = parseFloat(document.getElementById('kpi-minrev').value)||0;
  let skus = SKUS.filter(s=>(cat==='all'||s.cat===cat)&&s.rev>=minRev);
  const kpis = computeKPIs(skus.length?skus:SKUS);
  const strip = document.getElementById('kpi-strip');
  strip.innerHTML = kpis.map(k=>`<div class="kpi-card">
    <div class="kpi-label">${k.label}</div>
    <div class="kpi-value">${k.value}</div>
    ${k.delta?`<div class="kpi-delta ${k.risk&&k.dir==='up'?'risk-up':k.dir}">${k.dir==='up'?'▲':'▼'} ${k.delta}</div>`:''}
  </div>`).join('');
  setTimeout(highlightRoleKPIs, 50);
}
function resetKPIFilters(){
  document.getElementById('kpi-cat').value='all';
  document.getElementById('kpi-region').value='all';
  document.getElementById('kpi-year').value='2023';
  document.getElementById('kpi-minrev').value='0';
  updateKPIs();
  renderTopSKUs();  // Also re-render the chart
}
function generateReport(){
  const cat = document.getElementById('kpi-cat').value;
  const skus = cat==='all'?SKUS:SKUS.filter(s=>s.cat===cat);
  const kpis = computeKPIs(skus);
  alert(`Portfolio Report — ${cat==='all'?'All Categories':cat}\n\n`+kpis.map(k=>`${k.label}: ${k.value}`).join('\n')+`\n\nGenerated: ${new Date().toLocaleString()}`);
}
function renderTopSKUs(){
  const top = [...SKUS].sort((a,b)=>b.rev-a.rev).slice(0,10);
  const clrMap = {Beverages:isDark()?'#7F77DD':'#534AB7',Snacks:isDark()?'#5DCAA5':'#0F6E56','Personal Care':isDark()?'#EF9F27':'#854F0B',Household:isDark()?'#E24B4A':'#A32D2D'};
  const cats = [...new Set(top.map(s=>s.cat))];
  const traces = cats.map(c=>{
    const sk = top.filter(s=>s.cat===c);
    return {name:c,x:sk.map(s=>s.cx),y:sk.map(s=>s.val),mode:'markers',type:'scatter',
      marker:{size:sk.map(s=>Math.sqrt(s.rev)*3.5),color:clrMap[c]||'#888',opacity:.8,line:{width:1,color:isDark()?'#333':'#fff'}},
      text:sk.map(s=>`<b>${s.name}</b><br>Revenue: ₹${s.rev}Cr<br>Value: ${s.val}<br>Complexity: ${s.cx}`),
      hovertemplate:'%{text}<extra></extra>'};
  });
  plt('chart-top-skus',traces,{height:340,xaxis:{title:'Complexity →',range:[0,1]},yaxis:{title:'← Value',range:[0,1]},legend:{orientation:'h',y:-0.2}});
}

// ═══════════════════════════════════════════════════════════════════════════
// MATRIX
// ═══════════════════════════════════════════════════════════════════════════
function renderMatrixChart(){
  const data = [...SKUS,...(customSKU?[customSKU]:[])];
  const clrMap = {Beverages:isDark()?'#7F77DD':'#534AB7',Snacks:isDark()?'#5DCAA5':'#0F6E56','Personal Care':isDark()?'#EF9F27':'#854F0B',Household:isDark()?'#E24B4A':'#A32D2D',Custom:isDark()?'#ED93B1':'#993556'};
  const quadShapes = [
    {type:'rect',x0:0,y0:0.5,x1:0.5,y1:1,fillcolor:isDark()?'rgba(15,110,86,.08)':'rgba(15,110,86,.06)',line:{width:0}},
    {type:'rect',x0:0.5,y0:0.5,x1:1,y1:1,fillcolor:isDark()?'rgba(24,95,165,.08)':'rgba(24,95,165,.06)',line:{width:0}},
    {type:'rect',x0:0,y0:0,x1:0.5,y1:0.5,fillcolor:isDark()?'rgba(132,79,11,.08)':'rgba(132,79,11,.06)',line:{width:0}},
    {type:'rect',x0:0.5,y0:0,x1:1,y1:0.5,fillcolor:isDark()?'rgba(163,45,45,.08)':'rgba(163,45,45,.06)',line:{width:0}},
  ];
  const annots = [
    {x:.25,y:.85,text:'Keep',showarrow:false,font:{size:11,color:isDark()?'#5DCAA5':'#0F6E56'}},
    {x:.75,y:.85,text:'Grow',showarrow:false,font:{size:11,color:isDark()?'#85B7EB':'#185FA5'}},
    {x:.25,y:.12,text:'Consolidate',showarrow:false,font:{size:11,color:isDark()?'#EF9F27':'#854F0B'}},
    {x:.75,y:.12,text:'Rationalize',showarrow:false,font:{size:11,color:isDark()?'#E24B4A':'#A32D2D'}},
  ];
  const cats = [...new Set(data.map(s=>s.cat))];
  const traces = cats.map(c=>{
    const sk = data.filter(s=>s.cat===c);
    return {name:c,x:sk.map(s=>s.cx),y:sk.map(s=>s.val),mode:'markers',type:'scatter',
      marker:{size:sk.map(s=>Math.sqrt(s.rev)*3.5),color:clrMap[c]||'#888',opacity:.8,line:{width:1,color:isDark()?'#333':'#fff'}},
      text:sk.map(s=>`<b>${s.name}</b><br>Revenue: ₹${s.rev}Cr<br>Value: ${s.val}<br>Complexity: ${s.cx}<br>Action: ${s.cx>0.5&&s.val<0.5?'Rationalize':s.cx<0.5&&s.val>0.5?'Keep':s.val>0.5?'Grow':'Consolidate'}`),
      hovertemplate:'%{text}<extra></extra>'};
  });
  plt('chart-matrix',traces,{
    height:420,shapes:quadShapes,annotations:annots,
    xaxis:{title:'Operational Complexity Score →',range:[0,1]},
    yaxis:{title:'← Commercial Value Score',range:[0,1]},
    legend:{orientation:'h',y:-0.2},
  });
}
function addCustomSKU(){
  customSKU={name:document.getElementById('sku-name').value||'Custom SKU',cat:'Custom',
    rev:parseFloat(document.getElementById('sku-rev').value)||50,
    val:parseFloat(document.getElementById('sku-val').value)||0.5,
    cx:parseFloat(document.getElementById('sku-cx').value)||0.5,
    stockouts:0,promo:0.3,margin:30,growth:0.1,lead:15};
  renderMatrixChart();
}
function removeCustomSKU(){customSKU=null;renderMatrixChart();}

// ═══════════════════════════════════════════════════════════════════════════
// PARETO
// ═══════════════════════════════════════════════════════════════════════════
function updatePareto(pct){
  document.getElementById('pareto-pct-lbl').textContent=pct+'%';
  renderPareto(parseInt(pct));
}
function renderPareto(pct){
  const sort = document.getElementById('pareto-sort')?.value||'desc';
  const skus = [...SKUS].sort((a,b)=>sort==='desc'?b.rev-a.rev:a.rev-b.rev);
  const total = skus.reduce((a,s)=>a+s.rev,0);
  let cum=0;
  const cumPct = skus.map(s=>{cum+=s.rev;return+(cum/total*100).toFixed(1);});
  const threshold = parseFloat(pct);
  const bar_clrs = skus.map((s,i)=>cumPct[i]<=threshold?(isDark()?'#7F77DD':'#534AB7'):(isDark()?'rgba(127,119,221,.3)':'rgba(83,74,183,.25)'));
  plt('chart-pareto',[
    {name:'Revenue',x:skus.map(s=>s.name),y:skus.map(s=>s.rev),type:'bar',marker:{color:bar_clrs},
      text:skus.map(s=>`<b>${s.name}</b><br>₹${s.rev}Cr<br>${s.cat}`),hovertemplate:'%{text}<extra></extra>'},
    {name:'Cumulative %',x:skus.map(s=>s.name),y:cumPct,type:'scatter',mode:'lines+markers',yaxis:'y2',
      line:{color:isDark()?'#EF9F27':'#854F0B',width:2},marker:{size:5}},
  ],{
    height:360,barmode:'group',
    yaxis:{title:'Revenue ₹Cr'},
    yaxis2:{title:'Cumulative %',overlaying:'y',side:'right',range:[0,105]},
    legend:{orientation:'h',y:-0.25},
    shapes:[{type:'line',x0:-0.5,x1:skus.length-0.5,y0:threshold,y1:threshold,yref:'y2',line:{color:'red',width:1,dash:'dot'}}],
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// CHANNEL
// ═══════════════════════════════════════════════════════════════════════════
function renderChannelChart(){
  const margin = [42,38,31,45,36];
  const vol = [0.28,0.19,0.44,0.22,0.31];
  const stockout = [12,8,22,6,14];
  const clr = isDark()?['#7F77DD','#5DCAA5','#EF9F27']:['#534AB7','#0F6E56','#854F0B'];
  plt('chart-channel',[
    {name:'Margin %',x:CHANNELS,y:margin,type:'bar',marker:{color:clr[0]},yaxis:'y'},
    {name:'Volatility (CV)',x:CHANNELS,y:vol,type:'scatter',mode:'lines+markers',line:{color:clr[1],width:2},marker:{size:7},yaxis:'y2'},
    {name:'Stockouts',x:CHANNELS,y:stockout,type:'bar',marker:{color:clr[2],opacity:.6},yaxis:'y'},
  ],{
    barmode:'group',height:320,
    legend:{orientation:'h',y:-0.2},
    yaxis:{title:'Margin % / Stockouts'},
    yaxis2:{title:'Volatility',overlaying:'y',side:'right',showgrid:false},
  });
}
function renderChannelMix(){
  const vals = [320,185,280,95,110];
  plt('chart-channel-mix',[{
    type:'pie',labels:CHANNELS,values:vals,
    marker:{colors:isDark()?['#7F77DD','#5DCAA5','#EF9F27','#85B7EB','#ED93B1']:['#534AB7','#0F6E56','#854F0B','#185FA5','#993556']},
    textinfo:'label+percent',
    hovertemplate:'<b>%{label}</b><br>₹%{value}Cr<br>%{percent}<extra></extra>',
  }],{height:320,showlegend:false});
}

// ═══════════════════════════════════════════════════════════════════════════
// SIM
// ═══════════════════════════════════════════════════════════════════════════
function runSim(){
  const cxT = parseFloat(document.getElementById('sim-cx').value)||0.6;
  const revF = parseFloat(document.getElementById('sim-rev').value)||20;
  const transfer = parseFloat(document.getElementById('sim-transfer').value)/100;
  const opsRate = parseFloat(document.getElementById('sim-ops').value)/100;
  document.getElementById('sim-cx-lbl').textContent = cxT.toFixed(2);
  document.getElementById('sim-rev-lbl').textContent = revF;
  document.getElementById('sim-transfer-lbl').textContent = Math.round(document.getElementById('sim-transfer').value)+'%';
  document.getElementById('sim-ops-lbl').textContent = Math.round(document.getElementById('sim-ops').value)+'%';

  const candidates = SKUS.filter(s=>s.cx>=cxT&&s.rev<=revF);
  const totalRev = SKUS.reduce((a,s)=>a+s.rev,0);
  const candRev = candidates.reduce((a,s)=>a+s.rev,0);
  const revAtRisk = candRev*(1-transfer);
  const opsSaving = candRev*opsRate;
  const newPCI = ((SKUS.reduce((a,s)=>a+s.cx,0)-candidates.reduce((a,s)=>a+s.cx,0))/(SKUS.length-candidates.length||1)).toFixed(3);

  document.getElementById('sim-results').style.display='block';
  document.getElementById('sim-metrics').innerHTML=`
    <div class="result-metric"><div class="rm-label">Candidates</div><div class="rm-value rm-red">${candidates.length} SKUs</div></div>
    <div class="result-metric"><div class="rm-label">Rev at Risk</div><div class="rm-value rm-amber">₹${Math.round(revAtRisk)}Cr</div></div>
    <div class="result-metric"><div class="rm-label">Ops Saving</div><div class="rm-value rm-green">₹${Math.round(opsSaving)}Cr</div></div>
    <div class="result-metric"><div class="rm-label">New PCI</div><div class="rm-value rm-blue">${newPCI}</div></div>
  `;

  const netRevAfter = totalRev - revAtRisk;
  const clr = isDark()?['#7F77DD','#E24B4A','#5DCAA5','#7F77DD']:['#534AB7','#A32D2D','#0F6E56','#534AB7'];
  plt('chart-waterfall',[{
    type:'waterfall',orientation:'v',
    x:['Portfolio Revenue','Revenue at Risk','Ops Savings','Net Portfolio'],
    y:[totalRev,-revAtRisk,opsSaving,0],
    measure:['absolute','relative','relative','total'],
    connector:{line:{color:isDark()?'#444':'#ccc'}},
    increasing:{marker:{color:clr[2]}},
    decreasing:{marker:{color:clr[1]}},
    totals:{marker:{color:clr[0]}},
    text:[`₹${Math.round(totalRev)}Cr`,`-₹${Math.round(revAtRisk)}Cr`,`+₹${Math.round(opsSaving)}Cr`,`₹${Math.round(netRevAfter+opsSaving)}Cr`],
    textposition:'outside',
  }],{height:320,yaxis:{title:'₹ Crore'}});

  const tbody = document.getElementById('sim-tbody');
  tbody.innerHTML = candidates.length ? candidates.map(s=>`<tr>
    <td>${s.name}</td><td>${s.cat}</td><td>₹${s.rev}Cr</td>
    <td><span style="color:${isDark()?'#E24B4A':'#A32D2D'}">${s.cx.toFixed(2)}</span></td>
    <td>${s.stockouts}</td>
    <td><span class="tag tag-rationalize">Rationalize</span></td>
  </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:20px">No candidates at current thresholds</td></tr>';
}
function exportCandidates(){
  const cxT = parseFloat(document.getElementById('sim-cx').value)||0.6;
  const revF = parseFloat(document.getElementById('sim-rev').value)||20;
  const candidates = SKUS.filter(s=>s.cx>=cxT&&s.rev<=revF);
  const csv = 'SKU,Category,Revenue,Complexity,Stockouts\n'+candidates.map(s=>`${s.name},${s.cat},${s.rev},${s.cx},${s.stockouts}`).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a');a.href=URL.createObjectURL(blob);a.download='rationalization_candidates.csv';a.click();
}

// ═══════════════════════════════════════════════════════════════════════════
// LAUNCH READINESS
// ═══════════════════════════════════════════════════════════════════════════
function scoreLaunch(){
  const rev = parseFloat(document.getElementById('lr-rev').value)||100;
  const margin = parseFloat(document.getElementById('lr-margin').value)||35;
  const lead = parseFloat(document.getElementById('lr-lead').value)||20;
  const promo = parseFloat(document.getElementById('lr-promo').value)||20;
  const suppliers = parseInt(document.getElementById('lr-suppliers').value)||3;
  const channels = parseInt(document.getElementById('lr-channels').value)||3;

  const scores = {
    'Market Fit':Math.min(100,Math.round(rev/2+margin)),
    'Supply Readiness':Math.min(100,Math.round(100-(lead-10)*2.5+suppliers*3)),
    'Margin Health':Math.min(100,Math.round(margin*2-promo*0.8)),
    'Channel Coverage':Math.min(100,Math.round(channels/6*100)),
    'Risk Profile':Math.min(100,Math.round(100-promo*1.5-Math.max(0,lead-15)*2)),
  };
  const avg = Object.values(scores).reduce((a,v)=>a+v,0)/5;
  const verdict = avg>=75?'✅ Launch Ready — proceed to plan':avg>=50?'⚠️ Conditional — address gaps first':'🚫 Not Ready — significant risks remain';

  document.getElementById('lr-result').style.display='block';
  document.getElementById('lr-verdict').textContent = verdict;
  document.getElementById('lr-metrics').innerHTML = Object.entries(scores).map(([k,v])=>`<div class="result-metric"><div class="rm-label">${k}</div><div class="rm-value ${v>=70?'rm-green':v>=50?'rm-amber':'rm-red'}">${v}/100</div></div>`).join('');

  const labels = Object.keys(scores);
  const vals = Object.values(scores);
  const benchmark = [68,72,65,75,70];
  plt('chart-radar',[
    {type:'scatterpolar',r:vals,theta:labels,fill:'toself',name:'Your SKU',line:{color:isDark()?'#7F77DD':'#534AB7'},fillcolor:isDark()?'rgba(127,119,221,.2)':'rgba(83,74,183,.15)'},
    {type:'scatterpolar',r:benchmark,theta:labels,fill:'toself',name:'Benchmark',line:{color:isDark()?'#888':'#ccc',dash:'dot'},fillcolor:isDark()?'rgba(150,150,150,.1)':'rgba(150,150,150,.1)'},
  ],{height:360,polar:{radialaxis:{range:[0,100]}},legend:{orientation:'h',y:-0.15}},{scrollZoom:false,displayModeBar:false,responsive:true});

  const milestones = [
    {title:'Supplier Onboarding',status:suppliers>=2?'complete':'in-progress',progress:suppliers>=2?100:60,date:'Week 2'},
    {title:'Channel Agreements',status:channels>=3?'complete':'in-progress',progress:channels>=3?100:75,date:'Week 4'},
    {title:'Production Trials',status:margin>=35?'complete':'blocked',progress:margin>=35?100:40,date:'Week 6'},
    {title:'Distribution Setup',status:'in-progress',progress:85,date:'Week 8'},
    {title:'Marketing Campaign',status:'in-progress',progress:50,date:'Week 10'},
    {title:'Launch',status:'in-progress',progress:0,date:'Week 12'},
  ];
  document.getElementById('lr-milestones').style.display='block';
  document.getElementById('milestone-grid').innerHTML = milestones.map(m=>`
    <div class="milestone-card ${m.status}">
      <div class="milestone-header">
        <div class="milestone-icon" style="background:${m.status==='complete'?'var(--teal-bg)':m.status==='blocked'?'var(--red-bg)':'var(--amber-bg)'};color:${m.status==='complete'?'var(--teal)':m.status==='blocked'?'var(--red)':'var(--amber)'}">
          ${m.status==='complete'?'✓':m.status==='blocked'?'!':'○'}
        </div>
        <div class="milestone-title">${m.title}</div>
      </div>
      <div class="milestone-desc">${m.status==='complete'?'Completed':m.status==='blocked'?'Blocked':'In Progress'}</div>
      <div class="milestone-progress">
        <div class="milestone-progress-bar" style="width:${m.progress}%;background:${m.status==='complete'?'var(--teal)':m.status==='blocked'?'var(--red)':'var(--amber)'}"></div>
      </div>
      <div class="milestone-meta">
        <span>${m.progress}%</span>
        <span>${m.date}</span>
      </div>
    </div>
  `).join('');
}
function resetLaunch(){
  // Hide results
  document.getElementById('lr-result').style.display='none';
  document.getElementById('lr-milestones').style.display='none';
  
  // Reset all form fields to default values
  document.getElementById('lr-name').value = 'Mango Fizz 500ml';
  document.getElementById('lr-cat').value = 'Beverages';
  document.getElementById('lr-rev').value = '120';
  document.getElementById('lr-margin').value = '38';
  document.getElementById('lr-lead').value = '18';
  document.getElementById('lr-promo').value = '12';
  document.getElementById('lr-suppliers').value = '3';
  document.getElementById('lr-channels').value = '4';
}
function compareLaunches(){
  // Get current form values
  const currentName = document.getElementById('lr-name').value || 'Current SKU';
  const currentRev = parseFloat(document.getElementById('lr-rev').value) || 100;
  const currentMargin = parseFloat(document.getElementById('lr-margin').value) || 35;
  
  // Show comparison with typical benchmarks
  const comparison = `
📊 LAUNCH READINESS COMPARISON

Your SKU: ${currentName}
├─ Projected Revenue: ₹${currentRev} Cr
├─ Gross Margin: ${currentMargin}%
└─ Status: ${currentRev >= 100 && currentMargin >= 35 ? '✅ Above benchmark' : '⚠️ Below benchmark'}

Category Benchmarks:
├─ Beverages: ₹120 Cr, 38% margin
├─ Snacks: ₹110 Cr, 42% margin
├─ Personal Care: ₹95 Cr, 45% margin
└─ Household: ₹85 Cr, 33% margin

💡 Tip: Run "Score Readiness" to see detailed radar chart comparison
  `;
  
  alert(comparison);
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFITABILITY TREE
// ═══════════════════════════════════════════════════════════════════════════
function buildProfitTree(){
  const units = parseFloat(document.getElementById('pt-units').value)||850;
  const price = parseFloat(document.getElementById('pt-price').value)||180;
  const cost = parseFloat(document.getElementById('pt-cost').value)||95;
  const logistics = parseFloat(document.getElementById('pt-logistics').value)||18;
  const promo = parseFloat(document.getElementById('pt-promo').value)||4.5;
  const overhead = parseFloat(document.getElementById('pt-overhead').value)||8;

  const rev = units*price/100;
  const cogs = units*cost/100;
  const gm = rev-cogs;
  const logCost = units*logistics/100;
  const gmAfterLog = gm-logCost;
  const ebit = gmAfterLog-promo-overhead;
  const gmPct = (gm/rev*100).toFixed(1);
  const ebitPct = (ebit/rev*100).toFixed(1);

  document.getElementById('pt-result').style.display='block';
  document.getElementById('pt-metrics').innerHTML=`
    <div class="result-metric"><div class="rm-label">Revenue</div><div class="rm-value rm-blue">₹${Math.round(rev)}Cr</div></div>
    <div class="result-metric"><div class="rm-label">Gross Margin</div><div class="rm-value rm-green">₹${Math.round(gm)}Cr (${gmPct}%)</div></div>
    <div class="result-metric"><div class="rm-label">EBIT</div><div class="rm-value ${ebit>0?'rm-green':'rm-red'}">₹${Math.round(ebit)}Cr (${ebitPct}%)</div></div>
    <div class="result-metric"><div class="rm-label">Units (000s)</div><div class="rm-value">${units}</div></div>
  `;

  plt('chart-profit',[{
    type:'waterfall',orientation:'v',
    x:['Revenue','COGS','Gross Margin','Logistics','After Log','Promo','Overhead','EBIT'],
    y:[rev,-cogs,0,-logCost,0,-promo,-overhead,0],
    measure:['absolute','relative','total','relative','total','relative','relative','total'],
    connector:{line:{color:isDark()?'#444':'#ccc'}},
    increasing:{marker:{color:isDark()?'#5DCAA5':'#0F6E56'}},
    decreasing:{marker:{color:isDark()?'#E24B4A':'#A32D2D'}},
    totals:{marker:{color:isDark()?'#7F77DD':'#534AB7'}},
    text:[rev,cogs,gm,logCost,gmAfterLog,promo,overhead,ebit].map(v=>'₹'+Math.round(v)+'Cr'),
    textposition:'outside',
  }],{height:360,yaxis:{title:'₹ Crore'}});
}
function saveScenario(){
  const name = prompt('Scenario name:',`Scenario ${scenarios.length+1}`);
  if(!name) return;
  const units = parseFloat(document.getElementById('pt-units').value)||850;
  const price = parseFloat(document.getElementById('pt-price').value)||180;
  const cost = parseFloat(document.getElementById('pt-cost').value)||95;
  const logistics = parseFloat(document.getElementById('pt-logistics').value)||18;
  const promo = parseFloat(document.getElementById('pt-promo').value)||4.5;
  const overhead = parseFloat(document.getElementById('pt-overhead').value)||8;
  const rev = units*price/100;
  const cogs = units*cost/100;
  const gm = rev-cogs;
  const logCost = units*logistics/100;
  const ebit = gm-logCost-promo-overhead;
  scenarios.push({name,rev:Math.round(rev),gm:Math.round(gm),ebit:Math.round(ebit),gmPct:(gm/rev*100).toFixed(1)});
  renderScenarios();
}
function renderScenarios(){
  if(!scenarios.length) return;
  document.getElementById('pt-scenarios').style.display='block';
  document.getElementById('scenario-grid').innerHTML = scenarios.map((s,i)=>`
    <div class="scenario-card">
      <div class="scenario-header">
        <h4>${s.name}</h4>
        <span class="scenario-badge" style="background:var(--accent-bg);color:var(--accent)">Saved</span>
      </div>
      <div class="scenario-metrics">
        <div class="scenario-metric"><span class="scenario-metric-label">Revenue</span><span class="scenario-metric-value rm-blue">₹${s.rev}Cr</span></div>
        <div class="scenario-metric"><span class="scenario-metric-label">Gross Margin</span><span class="scenario-metric-value rm-green">₹${s.gm}Cr</span></div>
        <div class="scenario-metric"><span class="scenario-metric-label">EBIT</span><span class="scenario-metric-value ${s.ebit>0?'rm-green':'rm-red'}">₹${s.ebit}Cr</span></div>
        <div class="scenario-metric"><span class="scenario-metric-label">GM %</span><span class="scenario-metric-value">${s.gmPct}%</span></div>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// CANNIBALIZATION
// ═══════════════════════════════════════════════════════════════════════════
function scorePair(){
  const a = document.getElementById('skup-a').value||'SKU A';
  const b = document.getElementById('skup-b').value||'SKU B';
  const corr = parseFloat(document.getElementById('skup-corr').value)||0;
  const risk = Math.max(0,-corr);
  const label = risk>0.5?'High Risk':risk>0.25?'Moderate':'Low Risk';
  const clsMap = {'High Risk':'rm-red','Moderate':'rm-amber','Low Risk':'rm-green'};
  document.getElementById('skup-result').style.display='block';
  document.getElementById('skup-metrics').innerHTML=`
    <div class="result-metric"><div class="rm-label">SKU A</div><div class="rm-value">${a}</div></div>
    <div class="result-metric"><div class="rm-label">SKU B</div><div class="rm-value">${b}</div></div>
    <div class="result-metric"><div class="rm-label">Correlation</div><div class="rm-value rm-amber">${corr.toFixed(2)}</div></div>
    <div class="result-metric"><div class="rm-label">Risk</div><div class="rm-value ${clsMap[label]}">${label}</div></div>
  `;
}
function renderCannChart(){
  const pairs = [
    {a:'Mango Fizz 500ml',b:'Aloe Vera Drink',risk:0.62,cat:'Beverages',revAtRisk:42},
    {a:'Oat Cookies',b:'Choco Wafers',risk:0.38,cat:'Snacks',revAtRisk:18},
    {a:'Herbal Shampoo',b:'Hand Cream SPF',risk:0.24,cat:'Personal Care',revAtRisk:12},
    {a:'Dish Soap 1L',b:'Floor Cleaner',risk:0.51,cat:'Household',revAtRisk:28},
    {a:'Green Tea RTD',b:'Mango Fizz 500ml',risk:0.44,cat:'Beverages',revAtRisk:22},
  ];
  plt('chart-cann',[{
    type:'scatter',mode:'markers',
    x:pairs.map(p=>p.risk),
    y:pairs.map((_,i)=>i),
    marker:{size:pairs.map(p=>Math.sqrt(p.revAtRisk)*5),color:pairs.map(p=>p.risk>0.5?'#A32D2D':p.risk>0.3?'#854F0B':'#0F6E56'),opacity:.8},
    text:pairs.map(p=>`<b>${p.a}</b> ↔ <b>${p.b}</b><br>Risk: ${p.risk}<br>Revenue at risk: ₹${p.revAtRisk}Cr<br>Category: ${p.cat}`),
    hovertemplate:'%{text}<extra></extra>',
  }],{
    height:320,
    xaxis:{title:'Cannibalization Risk Score →',range:[0,1]},
    yaxis:{tickvals:pairs.map((_,i)=>i),ticktext:pairs.map(p=>p.a+' ↔ '+p.b),automargin:true},
  });
}
function renderPromoErosion(){
  const top = [...SKUS].sort((a,b)=>b.promo-a.promo).slice(0,10);
  plt('chart-promo-erosion',[{
    type:'bar',orientation:'h',
    x:top.map(s=>s.promo*100),
    y:top.map(s=>s.name),
    marker:{color:top.map(s=>s.promo>0.5?(isDark()?'#E24B4A':'#A32D2D'):s.promo>0.3?(isDark()?'#EF9F27':'#854F0B'):(isDark()?'#5DCAA5':'#0F6E56'))},
    text:top.map(s=>s.promo*100),
    texttemplate:'%{text:.0f}%',
    textposition:'outside',
    hovertemplate:'<b>%{y}</b><br>Promo dependency: %{x:.0f}%<extra></extra>',
  }],{height:Math.max(280,top.length*40+60),xaxis:{title:'Promo Dependency %',range:[0,100]},yaxis:{automargin:true}});
}

// ═══════════════════════════════════════════════════════════════════════════
// SIGNALS
// ═══════════════════════════════════════════════════════════════════════════
let sigFilter = 'all';
function filterSignals(f,btn){
  sigFilter=f;
  document.querySelectorAll('.inner-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSignals();
}
function renderSignals(){
  const filtered = sigFilter==='all'?signals:signals.filter(s=>s.sev===sigFilter);
  const sevColors = {critical:isDark()?'#E24B4A':'#A32D2D',warning:isDark()?'#EF9F27':'#854F0B',info:isDark()?'#85B7EB':'#185FA5'};
  const sevBg = {critical:isDark()?'#501313':'#FCEBEB',warning:isDark()?'#412402':'#FAEEDA',info:isDark()?'#042C53':'#E6F1FB'};
  const sevIcon = {critical:'🔴',warning:'🟡',info:'🔵'};
  document.getElementById('signals-list').innerHTML = filtered.length ? filtered.map(s=>`
    <div class="signal-row" id="sig-${s.id}" style="opacity:${s.ack?0.5:1}">
      <div class="signal-icon" style="background:${sevBg[s.sev]}">${sevIcon[s.sev]}</div>
      <div class="signal-body">
        <h4>${s.title} <span style="font-size:10px;color:var(--text3)">${s.type}</span></h4>
        <p>${s.detail}</p>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <span class="signal-severity" style="background:${sevBg[s.sev]};color:${sevColors[s.sev]}">${s.sev.toUpperCase()}</span>
        <button class="btn btn-ghost" style="font-size:11px;padding:4px 8px" onclick="ackSignal(${s.id})">${s.ack?'Acknowledged':'Acknowledge'}</button>
      </div>
    </div>`).join('') : '<div style="text-align:center;padding:32px;color:var(--text3)">No signals in this category.</div>';
}
function ackSignal(id){
  const s = signals.find(x=>x.id===id);
  if(s) s.ack = !s.ack;
  renderSignals();
}
function addSignal(){
  const title = document.getElementById('sig-title').value;
  if(!title){alert('Please enter a signal title.');return;}
  signals.unshift({id:Date.now(),title,sev:document.getElementById('sig-sev').value,type:document.getElementById('sig-type').value,detail:document.getElementById('sig-detail').value||'No detail provided.',ack:false});
  document.getElementById('sig-title').value='';document.getElementById('sig-detail').value='';
  renderSignals();
}
function renderSignalTimeline(){
  const days = 30;
  const dates = Array.from({length:days},(_,i)=>{
    const d = new Date();
    d.setDate(d.getDate()-days+i);
    return d.toISOString().split('T')[0];
  });
  const criticals = dates.map(()=>Math.floor(Math.random()*3));
  const warnings = dates.map(()=>Math.floor(Math.random()*5));
  const infos = dates.map(()=>Math.floor(Math.random()*4));
  plt('chart-signal-timeline',[
    {name:'Critical',x:dates,y:criticals,type:'scatter',mode:'lines',fill:'tozeroy',line:{color:isDark()?'#E24B4A':'#A32D2D',width:2}},
    {name:'Warning',x:dates,y:warnings,type:'scatter',mode:'lines',fill:'tozeroy',line:{color:isDark()?'#EF9F27':'#854F0B',width:2}},
    {name:'Info',x:dates,y:infos,type:'scatter',mode:'lines',fill:'tozeroy',line:{color:isDark()?'#85B7EB':'#185FA5',width:2}},
  ],{height:280,yaxis:{title:'Signal Count'},legend:{orientation:'h',y:-0.2}});
}


// ═══════════════════════════════════════════════════════════════════════════
// AUTH & ROLE SYSTEM  (v2 — persona lock + inbox messaging)
// ═══════════════════════════════════════════════════════════════════════════

// Load users from localStorage or initialize empty
function loadUserDB() {
  try {
    const stored = localStorage.getItem('acies_users_db');
    return stored ? JSON.parse(stored) : {};
  } catch(e) {
    return {};
  }
}

function saveUserDB(db) {
  try {
    localStorage.setItem('acies_users_db', JSON.stringify(db));
  } catch(e) {
    console.error('Failed to save user database');
  }
}

let USER_DB = loadUserDB();

const DEMO_USERS = {
  vp:      {name:'Vikram Anand',  role:'vp',      email:'vikram@acies.com',  company:'Acies FMCG', initials:'VA', color:'#534AB7'},
  pm:      {name:'Priya Sharma',  role:'pm',      email:'priya@acies.com',   company:'Acies FMCG', initials:'PS', color:'#0F6E56'},
  pricing: {name:'Rohan Mehta',   role:'pricing', email:'rohan@acies.com',   company:'Acies FMCG', initials:'RM', color:'#854F0B'},
};

const ROLE_LABELS = {vp:'VP Product Management', pm:'Product Manager', pricing:'Pricing & Margin Partner'};

// VP can only see VP tabs. PM can only see PM tabs. Pricing only Pricing tabs.
// "locked" = persona can't visit; VP sees a lock wall with contact options
const ROLE_CONFIG = {
  vp: {
    color:'#534AB7',
    focusMsg:'Executive portfolio view — strategic KPIs, complexity risk, and rationalization decisions.',
    tabs:{portfolio:'primary', profitability:'visible', sku:'visible', signals:'primary', launch:'visible'},
    kpiHighlight:[0,1,2,3,6],
    signalTypes:['Supply','Demand','Margin','Cannibalization','Launch'],
    // personas this role CANNOT switch to (must request)
    blockedPersonas:['pm','pricing'],
  },
  pm: {
    color:'#0F6E56',
    focusMsg:'Operational SKU view — launch pipeline, stockout tracking, and supply risk.',
    tabs:{portfolio:'visible', launch:'primary', profitability:'visible', sku:'primary', signals:'visible'},
    kpiHighlight:[0,4,5,6,7],
    signalTypes:['Supply','Demand','Launch'],
    blockedPersonas:['vp','pricing'],
  },
  pricing: {
    color:'#854F0B',
    focusMsg:'Margin & profitability view — P&L decomposition, promo dependency, and pricing levers.',
    tabs:{portfolio:'visible', profitability:'primary', sku:'primary', launch:'visible', signals:'visible'},
    kpiHighlight:[1,2,3,4],
    signalTypes:['Margin','Cannibalization','Demand'],
    blockedPersonas:['vp','pm'],
  }
};

let currentUser = null;

// ── INBOX (in-memory per session) ─────────────────────────────────────────
// keyed by recipient role
let inboxMessages = {vp:[], pm:[], pricing:[]};

// ── AUTH HELPERS ──────────────────────────────────────────────────────────
function authTab(tab){
  document.getElementById('tab-login').classList.toggle('active', tab==='login');
  document.getElementById('tab-signup').classList.toggle('active', tab==='signup');
  document.getElementById('form-login').style.display  = tab==='login'?'block':'none';
  document.getElementById('form-signup').style.display = tab==='signup'?'block':'none';
  document.getElementById('auth-error').style.display  = 'none';
}
function showAuthError(msg){
  const el=document.getElementById('auth-error');
  el.textContent=msg; el.style.display='block';
}
function doLogin(){
  const email=document.getElementById('li-email').value.trim().toLowerCase();
  const pass=document.getElementById('li-pass').value;
  if(!email||!pass){showAuthError('Please fill in all fields.');return;}
  const user=USER_DB[email];
  if(!user){showAuthError('Account not found. Please sign up first.');return;}
  if(user.pass!==pass){showAuthError('Incorrect password. Please try again.');return;}
  loginAs({...user,email});
}
function doSignup(){
  const name=document.getElementById('su-name').value.trim();
  const email=document.getElementById('su-email').value.trim().toLowerCase();
  const pass=document.getElementById('su-pass').value;
  const role=document.getElementById('su-role').value;
  const company=document.getElementById('su-company').value.trim()||'Acies FMCG';
  if(!name||!email||!pass||!role){showAuthError('Please fill in all required fields.');return;}
  if(pass.length<6){showAuthError('Password must be at least 6 characters.');return;}
  if(USER_DB[email]){showAuthError('An account with this email already exists. Please sign in.');return;}
  const initials=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const color=ROLE_CONFIG[role]?.color||'#534AB7';
  const newUser={name,role,email,company,initials,color,pass};
  USER_DB[email]=newUser;
  saveUserDB(USER_DB);  // Persist to localStorage
  alert('Account created successfully! Logging you in...');
  loginAs(newUser);
}
// Persona card entry — direct login by role
function enterPersona(role){
  const user=DEMO_USERS[role];
  if(!user)return;
  loginAs(user);
}
// loginAs — shared by enterPersona and persisted session
function loginAs(user){
  currentUser=user;
  try{localStorage.setItem('acies_user',JSON.stringify({name:user.name,role:user.role,email:user.email,company:user.company,initials:user.initials,color:user.color}));}catch(e){}
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app-shell').style.display='flex';
  applyRoleUI();
  if(user.role==='vp'){
    document.getElementById('nav-vp-exec').style.display='flex';
    setTimeout(()=>{switchSection('vp-exec');initVPDashboard();},200);
  } else {
    document.getElementById('nav-vp-exec').style.display='none';
    setTimeout(()=>{updateKPIs();renderTopSKUs();},150);
  }
}
function doLogout(){
  currentUser=null;
  try{localStorage.removeItem('acies_user');}catch(e){}
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('app-shell').style.display='none';
}

// ── ROLE UI APPLICATION ────────────────────────────────────────────────────
function applyRoleUI(){
  if(!currentUser)return;
  const role=currentUser.role;
  const cfg=ROLE_CONFIG[role];

  // Sidebar user block
  const av=document.getElementById('sb-avatar');
  av.textContent=currentUser.initials||currentUser.name[0];
  av.style.background=`linear-gradient(135deg,${currentUser.color||cfg.color},${(currentUser.color||cfg.color)}99)`;
  document.getElementById('sb-user-name').textContent=currentUser.name;
  document.getElementById('sb-user-role').textContent=ROLE_LABELS[role]||role;

  // Lock / unlock persona buttons
  ['vp','pm','pricing'].forEach(r=>{
    const btn=document.getElementById('role-'+r);
    if(!btn)return;
    const isBlocked=cfg.blockedPersonas.includes(r);
    btn.classList.toggle('persona-locked', isBlocked);
    btn.classList.toggle('active', r===role);
  });

  // Highlight active persona
  document.getElementById('role-'+role)?.classList.add('active');

  // Tab nav access
  applyTabLocks();

  // Show/hide inbox panel (only PM and Pricing receive requests)
  const inboxPanel=document.getElementById('inbox-panel');
  if(inboxPanel) inboxPanel.style.display=(role==='pm'||role==='pricing')?'block':'none';

  // Refresh inbox
  renderInbox();

  setTimeout(()=>{
    injectRoleBanner();
    highlightRoleKPIs();
    if(role!=='vp') filterSignalsByRole();
  },300);
}

function applyTabLocks(){
  if(!currentUser)return;
  const cfg=ROLE_CONFIG[currentUser.role];
  const navMap={portfolio:'nav-portfolio',launch:'nav-launch',profitability:'nav-profitability',sku:'nav-sku',signals:'nav-signals','vp-exec':'nav-vp-exec'};
  Object.entries(navMap).forEach(([section,navId])=>{
    const btn=document.getElementById(navId);
    if(!btn)return;
    const access=cfg.tabs[section]||'visible';
    btn.classList.remove('tab-locked');
    btn.title='';
    if(access==='locked'){btn.classList.add('tab-locked');btn.title='Restricted — contact the owning persona';}
    btn.style.fontWeight=access==='primary'?'600':'';
    btn.style.color=access==='primary'?'var(--accent)':'';
  });
}

// ── PERSONA CLICK HANDLER ─────────────────────────────────────────────────
function handlePersonaClick(targetRole, btn){
  if(!currentUser)return;
  const blocked=ROLE_CONFIG[currentUser.role].blockedPersonas||[];
  if(blocked.includes(targetRole)){
    openPersonaLock(targetRole);
    return;
  }
  // Same role or allowed → just highlight (personas can't actually switch in this version)
  // VP clicking VP = already active, do nothing
}

// ── PERSONA LOCK MODAL ────────────────────────────────────────────────────
let lockTargetRole='';
function openPersonaLock(targetRole){
  lockTargetRole=targetRole;
  const target=DEMO_USERS[targetRole];
  const wall=document.getElementById('persona-lock-wall');
  const av=document.getElementById('lock-avatar');
  av.textContent=target.initials;
  av.style.background=`linear-gradient(135deg,${ROLE_CONFIG[targetRole].color},${ROLE_CONFIG[targetRole].color}99)`;
  document.getElementById('lock-name').textContent=target.name;
  document.getElementById('lock-role-label').textContent=ROLE_LABELS[targetRole];
  document.getElementById('lock-desc').textContent=
    `The ${ROLE_LABELS[targetRole]} view is owned by ${target.name}. As ${ROLE_LABELS[currentUser.role]}, you cannot directly switch into this persona. You can request access by emailing or messaging ${target.name.split(' ')[0]}.`;
  document.getElementById('lock-to-email').value=target.email;
  document.getElementById('lock-to-msg').value=target.name;
  document.getElementById('lock-subject').value=`Request: View access to ${ROLE_LABELS[targetRole]} dashboard`;
  document.getElementById('lock-email-body').value=`Hi ${target.name.split(' ')[0]},\n\nI'd like to review your ${ROLE_LABELS[targetRole]} dashboard view for our upcoming planning sync. Could you share a snapshot or grant temporary read access?\n\nThanks,\n${currentUser.name}`;
  document.getElementById('lock-msg-body').value=`Hi ${target.name.split(' ')[0]}, could you share your ${ROLE_LABELS[targetRole]} dashboard view? I need to review it for our meeting.`;
  // Reset forms
  document.getElementById('lock-success').style.display='none';
  document.getElementById('lock-form-email').style.display='block';
  document.getElementById('lock-form-message').style.display='none';
  document.querySelectorAll('.lock-tab').forEach(t=>t.classList.remove('active'));
  document.querySelector('.lock-tab').classList.add('active');
  wall.classList.add('open');
}
function closePersonaLock(){
  document.getElementById('persona-lock-wall').classList.remove('open');
  lockTargetRole='';
}
function lockTab(type, btn){
  document.querySelectorAll('.lock-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('lock-form-email').style.display=type==='email'?'block':'none';
  document.getElementById('lock-form-message').style.display=type==='message'?'block':'none';
}
function sendLockEmail(){
  const subject=document.getElementById('lock-subject').value.trim();
  const body=document.getElementById('lock-email-body').value.trim();
  if(!subject||!body){alert('Please fill in subject and message.');return;}
  deliverMessage(lockTargetRole,'email',subject,body);
}
function sendLockMessage(){
  const body=document.getElementById('lock-msg-body').value.trim();
  if(!body){alert('Please write a message.');return;}
  deliverMessage(lockTargetRole,'message',`Message from ${currentUser.name}`,body);
}
function deliverMessage(toRole, type, subject, body){
  const msg={
    id:Date.now(),
    from:currentUser.name,
    fromRole:currentUser.role,
    fromInitials:currentUser.initials,
    fromColor:currentUser.color||ROLE_CONFIG[currentUser.role].color,
    type,subject,body,
    time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
    read:false
  };
  inboxMessages[toRole].unshift(msg);
  // Show success
  document.getElementById('lock-form-email').style.display='none';
  document.getElementById('lock-form-message').style.display='none';
  const succ=document.getElementById('lock-success');
  succ.style.display='block';
  document.getElementById('lock-success-title').textContent=type==='email'?'Email Sent!':'Message Sent!';
  document.getElementById('lock-success-body').textContent=
    `Your ${type} to ${DEMO_USERS[toRole].name} has been delivered. They'll see it in their Signals Board inbox when they log in.`;
  // Update sidebar badge
  updateInboxBadge(toRole);
  setTimeout(closePersonaLock,3000);
}

// ── INBOX RENDERING ───────────────────────────────────────────────────────
function renderInbox(){
  if(!currentUser)return;
  const role=currentUser.role;
  const msgs=inboxMessages[role]||[];
  const el=document.getElementById('inbox-messages');
  if(!el)return;
  const unread=msgs.filter(m=>!m.read).length;
  const badge=document.getElementById('inbox-count-badge');
  if(badge){badge.textContent=unread;badge.style.display=unread?'inline-flex':'none';}
  if(!msgs.length){
    el.innerHTML='<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">No messages yet.</div>';
    return;
  }
  el.innerHTML=msgs.map(m=>`
    <div class="inbox-msg${m.read?'':' inbox-unread'}" onclick="markRead(${m.id})">
      <div class="inbox-from-avatar" style="background:linear-gradient(135deg,${m.fromColor},${m.fromColor}99)">${m.fromInitials}</div>
      <div class="inbox-msg-body">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
          <span class="inbox-msg-from">${m.from}</span>
          <span class="inbox-msg-type" style="background:${m.type==='email'?'var(--blue-bg)':'var(--teal-bg)'};color:${m.type==='email'?'var(--blue)':'var(--teal)'}">${m.type==='email'?'Email':'Message'}</span>
        </div>
        <div class="inbox-msg-subject">${m.subject}</div>
        <div class="inbox-msg-preview">${m.body.slice(0,120)}${m.body.length>120?'…':''}</div>
      </div>
      <div class="inbox-msg-time">${m.time}</div>
    </div>`).join('');
}
function markRead(id){
  const role=currentUser.role;
  const msg=inboxMessages[role].find(m=>m.id===id);
  if(msg){msg.read=true;}
  renderInbox();
  updateInboxBadge(role);
}
function updateInboxBadge(role){
  const badge=document.getElementById('inbox-badge-'+role);
  if(!badge)return;
  const count=inboxMessages[role].filter(m=>!m.read).length;
  badge.textContent=count;
  badge.style.display=count?'inline-flex':'none';
}

// ── ROLE BANNER & KPI HIGHLIGHT ───────────────────────────────────────────
function injectRoleBanner(){
  if(!currentUser)return;
  const cfg=ROLE_CONFIG[currentUser.role];
  document.querySelectorAll('.role-banner').forEach(el=>el.remove());
  const activeSection=document.querySelector('.section.active .content');
  if(!activeSection)return;
  const banner=document.createElement('div');
  banner.className='role-banner';
  banner.innerHTML=`<span>👤 <strong>${ROLE_LABELS[currentUser.role]}:</strong> ${cfg.focusMsg}</span><span class="role-focus-badge">✦ Role View</span>`;
  activeSection.insertBefore(banner,activeSection.firstChild);
}
function highlightRoleKPIs(){
  if(!currentUser)return;
  const hi=ROLE_CONFIG[currentUser.role].kpiHighlight||[];
  document.querySelectorAll('.kpi-card').forEach((c,i)=>{
    c.classList.remove('role-highlight','role-dim');
    c.classList.add(hi.includes(i)?'role-highlight':'role-dim');
  });
}
function filterSignalsByRole(){
  if(!currentUser||currentUser.role==='vp')return;
  const allowed=ROLE_CONFIG[currentUser.role].signalTypes;
  const rel=signals.filter(s=>allowed.includes(s.type));
  const sevC={critical:isDark()?'#E24B4A':'#A32D2D',warning:isDark()?'#EF9F27':'#854F0B',info:isDark()?'#85B7EB':'#185FA5'};
  const sevB={critical:isDark()?'#501313':'#FCEBEB',warning:isDark()?'#412402':'#FAEEDA',info:isDark()?'#042C53':'#E6F1FB'};
  const sevI={critical:'🔴',warning:'🟡',info:'🔵'};
  const el=document.getElementById('signals-list');
  if(!el)return;
  el.innerHTML=rel.length?rel.map(s=>`
    <div class="signal-row" id="sig-${s.id}" style="opacity:${s.ack?0.5:1}">
      <div class="signal-icon" style="background:${sevB[s.sev]}">${sevI[s.sev]}</div>
      <div class="signal-body"><h4>${s.title} <span style="font-size:10px;color:var(--text3)">${s.type}</span></h4><p>${s.detail}</p></div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <span class="signal-severity" style="background:${sevB[s.sev]};color:${sevC[s.sev]}">${s.sev.toUpperCase()}</span>
        <button class="btn btn-ghost" style="font-size:11px;padding:4px 8px" onclick="ackSignal(${s.id})">${s.ack?'Acknowledged':'Acknowledge'}</button>
      </div>
    </div>`).join(''):'<div style="text-align:center;padding:32px;color:var(--text3)">No signals assigned to your role.</div>';
}

// switchSection override removed - integrated into main function


// ═══════════════════════════════════════════════════════════════════════════
// VP EXECUTIVE DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

const VP_KPI_BASE = [
  {label:'Total Revenue',value:851,unit:'₹ Cr',trend:+8.4,spark:[720,748,771,790,810,822,838,851],color:'#534AB7',fmt:v=>v+' Cr'},
  {label:'Gross Margin',value:36.2,unit:'%',trend:+1.1,spark:[33.1,33.8,34.2,34.9,35.4,35.8,36.0,36.2],color:'#0F6E56',fmt:v=>v+'%'},
  {label:'Active SKUs',value:127,unit:'',trend:-3,spark:[134,133,131,130,129,128,128,127],color:'#185FA5',fmt:v=>v},
  {label:'Critical Alerts',value:2,unit:'',trend:+2,spark:[0,0,1,0,1,2,2,2],color:'#A32D2D',fmt:v=>v},
];

const VP_ALERTS = [
  {id:'a1',sev:'critical',title:'Fabric Softener — 7 stockout events this quarter',detail:'Supply · Lead time 35d vs 14d benchmark',ack:false},
  {id:'a2',sev:'critical',title:'Choco Wafers promo dependency at 72% — margin risk',detail:'Margin · Organic revenue only 28%',ack:false},
  {id:'a3',sev:'warning',title:'Green Tea RTD revenue −4% YoY with high promo load',detail:'Demand · Dual rationalization signal',ack:false},
  {id:'a4',sev:'warning',title:'Beverages cannibalization risk elevated across variants',detail:'Cannibalization · Mango Fizz pair correlation −0.62',ack:false},
  {id:'a5',sev:'warning',title:'Floor Cleaner: highest complexity, lowest value',detail:'Supply · Rationalization priority #1',ack:false},
  {id:'a6',sev:'info',title:'Herbal Shampoo growing 28% — scale supply chain',detail:'Supply · Opportunity to expand',ack:false},
];

const VP_APPROVALS = [
  {id:'p1',title:'Mango Fizz 750ml — Launch budget ₹4.2 Cr',type:'Launch',urgency:'high',age:'2d',done:false},
  {id:'p2',title:'Choco Wafers promo extension — Q4',type:'Promo',urgency:'medium',age:'4d',done:false},
  {id:'p3',title:'Foam Face Wash rationalization sign-off',type:'Rationalize',urgency:'low',age:'6d',done:false},
];

const VP_FORECAST = [
  {region:'APAC',actual:312,target:290,delta:'+7.6%',up:true},
  {region:'Americas',actual:228,target:240,delta:'-5.0%',up:false},
  {region:'EMEA',actual:311,target:305,delta:'+2.0%',up:true},
];

let vpRefreshInterval = null;
let vpAlerts = VP_ALERTS.map(a=>({...a}));
let vpApprovals = VP_APPROVALS.map(a=>({...a}));
let vpRevChart = null, vpCatChart = null;

function initVPDashboard(){
  // Date line
  const now = new Date();
  const el = document.getElementById('vp-dateline');
  if(el) el.textContent = now.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  renderVPKPIs();
  renderVPAlerts();
  renderVPCharts();
  renderVPSKUPerf();
  renderVPApprovals();
  renderVPForecast();
  updateVPRefreshTime();
  if(vpRefreshInterval) clearInterval(vpRefreshInterval);
  vpRefreshInterval = setInterval(()=>{
    jitterKPIs();
    updateVPRefreshTime();
  }, 15000);
}

function vpRefresh(){
  jitterKPIs();
  renderVPAlerts();
  updateVPRefreshTime();
}

function updateVPRefreshTime(){
  const el = document.getElementById('vp-last-refresh');
  if(el) el.textContent = 'Refreshed ' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}

function jitterKPIs(){
  VP_KPI_BASE[0].value = +(VP_KPI_BASE[0].value + (Math.random()*.6-.2)).toFixed(1);
  VP_KPI_BASE[1].value = +(VP_KPI_BASE[1].value + (Math.random()*.04-.01)).toFixed(1);
  VP_KPI_BASE[0].spark.push(VP_KPI_BASE[0].value); VP_KPI_BASE[0].spark.shift();
  VP_KPI_BASE[1].spark.push(VP_KPI_BASE[1].value); VP_KPI_BASE[1].spark.shift();
  renderVPKPIs();
  if(vpRevChart) updateRevChart();
}

function renderVPKPIs(){
  const row = document.getElementById('vp-kpi-row');
  if(!row) return;
  const dark = isDark();
  row.innerHTML = VP_KPI_BASE.map((k,i)=>{
    const up = k.trend >= 0;
    const isRisk = i===3;
    const trendColor = isRisk ? (up ? '#ef4444':'#22c55e') : (up ? '#22c55e':'#ef4444');
    const trendIcon = up ? '▲' : '▼';
    const sparkId = 'vp-spark-'+i;
    return `<div class="vp-kpi" onclick="vpDrillKPI(${i})">
      <div class="vp-kpi-accent" style="background:${k.color}"></div>
      <div class="vp-kpi-label">${k.label}</div>
      <div class="vp-kpi-value">${k.fmt(k.value)}</div>
      <div class="vp-kpi-trend" style="color:${trendColor}">${trendIcon} ${Math.abs(k.trend)}${i===0?' Cr':i===1?'pp':''} vs last month</div>
      <canvas class="vp-kpi-sparkline" id="${sparkId}" role="img" aria-label="Sparkline for ${k.label}"></canvas>
    </div>`;
  }).join('');
  setTimeout(()=>{
    VP_KPI_BASE.forEach((k,i)=>{
      const c = document.getElementById('vp-spark-'+i);
      if(!c) return;
      const ctx = c.getContext('2d');
      const w = c.offsetWidth; const h = 32;
      c.width=w; c.height=h;
      const mn=Math.min(...k.spark), mx=Math.max(...k.spark), rng=mx-mn||1;
      const pts = k.spark.map((v,j)=>({x:j/(k.spark.length-1)*w, y:h-(v-mn)/rng*(h-4)-2}));
      ctx.clearRect(0,0,w,h);
      ctx.beginPath();
      ctx.moveTo(pts[0].x,pts[0].y);
      pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.strokeStyle=k.color; ctx.lineWidth=1.5; ctx.stroke();
    });
  },50);
}

function renderVPAlerts(){
  const list = document.getElementById('vp-alerts-list');
  const badge = document.getElementById('vp-alert-badge');
  if(!list) return;
  const active = vpAlerts.filter(a=>!a.ack);
  if(badge) badge.textContent = active.length;
  if(!active.length){
    list.innerHTML='<div style="text-align:center;padding:20px;font-size:12px;color:var(--text3)">✅ No active alerts — all clear</div>';
    return;
  }
  list.innerHTML = active.map(a=>`
    <div class="vp-alert-item" id="vp-alert-${a.id}">
      <div class="vp-alert-sev ${a.sev}"></div>
      <div class="vp-alert-body">
        <div class="vp-alert-title">${a.title}</div>
        <div class="vp-alert-meta">${a.detail}</div>
      </div>
      <button class="vp-ack-btn" onclick="vpAck('${a.id}');event.stopPropagation()">Dismiss</button>
    </div>`).join('');
}

function vpAck(id){
  const a = vpAlerts.find(x=>x.id===id);
  if(a) a.ack=true;
  renderVPAlerts();
}
function vpAckAll(){
  vpAlerts.forEach(a=>a.ack=true);
  renderVPAlerts();
}

function renderVPCharts(){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const actual = [58,61,65,70,74,77,80,84,88,91,0,0];
  const target = [60,63,66,70,74,76,80,83,86,90,93,96];
  const now = new Date().getMonth();
  const actData = actual.slice(0,now+1);
  const fc = isDark()?'#b0afa5':'#555';
  const gc = isDark()?'#2e2e28':'#e8e8e0';

  if(vpRevChart) { vpRevChart.destroy(); vpRevChart=null; }
  const revCtx = document.getElementById('vp-rev-chart');
  if(revCtx) {
    vpRevChart = new Chart(revCtx, {
      type:'line',
      data:{
        labels: months.slice(0,Math.max(actData.length, target.length)),
        datasets:[
          {label:'Actual',data:actData,borderColor:'#534AB7',backgroundColor:'rgba(83,74,183,.1)',fill:true,tension:.4,pointRadius:3,borderDash:[]},
          {label:'Target',data:target.slice(0,12),borderColor:isDark()?'#444':'#ccc',borderDash:[4,3],fill:false,tension:.4,pointRadius:0},
        ]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${ctx.dataset.label}: ₹${ctx.raw} Cr`}}},
        scales:{
          x:{ticks:{color:fc,font:{size:10}},grid:{color:gc}},
          y:{ticks:{color:fc,font:{size:10},callback:v=>'₹'+v},grid:{color:gc}}
        }
      }
    });
  }

  if(vpCatChart) { vpCatChart.destroy(); vpCatChart=null; }
  const catCtx = document.getElementById('vp-cat-chart');
  if(catCtx) {
    const cats = ['Beverages','Snacks','Personal Care','Household'];
    const vals = [316,253,225,145];
    const colors = ['#534AB7','#0F6E56','#185FA5','#854F0B'];
    vpCatChart = new Chart(catCtx, {
      type:'bar',
      data:{labels:cats,datasets:[{label:'Revenue ₹ Cr',data:vals,backgroundColor:colors,borderRadius:4}]},
      options:{
        responsive:true,maintainAspectRatio:false,indexAxis:'y',
        plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`₹${ctx.raw} Cr`}}},
        scales:{
          x:{ticks:{color:fc,font:{size:10},callback:v=>'₹'+v},grid:{color:gc}},
          y:{ticks:{color:fc,font:{size:10}},grid:{display:false}}
        }
      }
    });
  }
}

function updateRevChart(){
  if(!vpRevChart) return;
  const last = vpRevChart.data.datasets[0].data;
  if(last.length>0) last[last.length-1] = VP_KPI_BASE[0].value/9.5;
  vpRevChart.update('none');
}

function renderVPSKUPerf(){
  const el = document.getElementById('vp-sku-perf');
  if(!el) return;
  const top = [...SKUS].sort((a,b)=>b.rev-a.rev).slice(0,5);
  const max = top[0].rev;
  el.innerHTML = top.map(s=>`
    <div class="vp-perf-row">
      <div class="vp-perf-label" title="${s.name}">${s.name.split(' ').slice(0,2).join(' ')}</div>
      <div class="vp-perf-bar-wrap"><div class="vp-perf-bar" style="width:${Math.round(s.rev/max*100)}%;background:#534AB7"></div></div>
      <div class="vp-perf-val">₹${s.rev}Cr</div>
    </div>`).join('');
}

function renderVPApprovals(){
  const el = document.getElementById('vp-approvals');
  const cnt = document.getElementById('vp-appr-count');
  if(!el) return;
  const pending = vpApprovals.filter(a=>!a.done);
  if(cnt) cnt.textContent = pending.length+' pending';
  if(!pending.length){
    el.innerHTML='<div style="text-align:center;padding:16px;font-size:12px;color:var(--text3)">All caught up!</div>';
    return;
  }
  const urgColor={high:'#ef4444',medium:'#f59e0b',low:'#3b82f6'};
  const urgBg={high:'#fef2f2',medium:'#fffbeb',low:'#eff6ff'};
  el.innerHTML = pending.map(a=>`
    <div class="vp-approval-row" id="vpa-${a.id}">
      <span class="vp-approval-badge" style="background:${urgBg[a.urgency]};color:${urgColor[a.urgency]}">${a.type}</span>
      <span class="vp-approval-name" title="${a.title}">${a.title.slice(0,28)}…</span>
      <span class="vp-approval-meta">${a.age}</span>
      <button class="vp-approve-btn" onclick="vpApprove('${a.id}')">✓</button>
      <button class="vp-reject-btn" onclick="vpReject('${a.id}')">✕</button>
    </div>`).join('');
}

function vpApprove(id){ const a=vpApprovals.find(x=>x.id===id); if(a)a.done=true; renderVPApprovals(); }
function vpReject(id){ const a=vpApprovals.find(x=>x.id===id); if(a)a.done=true; renderVPApprovals(); }

function renderVPForecast(){
  const el = document.getElementById('vp-forecast');
  if(!el) return;
  const max = Math.max(...VP_FORECAST.map(r=>Math.max(r.actual,r.target)));
  el.innerHTML = VP_FORECAST.map(r=>`
    <div>
      <div class="vp-forecast-row">
        <span class="vp-forecast-label">${r.region}</span>
        <div class="vp-forecast-nums">
          <span class="vp-forecast-actual">₹${r.actual}Cr</span>
          <span class="vp-forecast-target">/ ₹${r.target}Cr target</span>
          <span class="vp-forecast-gap ${r.up?'over':'under'}">${r.delta}</span>
        </div>
      </div>
      <div class="vp-fcast-bar"><div class="vp-fcast-bar-fill" style="width:${Math.round(r.actual/r.target*100)}%;background:${r.up?'#0F6E56':'#A32D2D'}"></div></div>
    </div>`).join('');
}

function vpDrillKPI(i){
  const labels = ['portfolio','profitability','signals','signals'];
  switchSection(labels[i]||'portfolio');
}

// ── PERSISTED SESSION ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  try{
    const saved=JSON.parse(localStorage.getItem('acies_user')||'null');
    if(saved&&saved.email&&saved.role){
      currentUser={...saved,pass:'(persisted)'};
      loginAs(currentUser);
    }
  }catch(e){}
});


// ═══════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  const d = document.documentElement.classList.contains('dark');
  document.getElementById('theme-icon').textContent = d?'☀':'☾';
  document.getElementById('theme-label').textContent = d?'Light mode':'Dark mode';
  updateKPIs();
  setTimeout(()=>{renderTopSKUs();},100);
});
