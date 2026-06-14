const app = document.getElementById('app');

const belts = [
  { id:'rookie', name:'Rookie Rumble Cup', prestige: 15 },
  { id:'tv', name:'Neon Television Title', prestige: 32 },
  { id:'tag', name:'Hyper Tag Crown', prestige: 42 },
  { id:'inter', name:'Interstellar Championship', prestige: 62 },
  { id:'world', name:'Grand Collision World Championship', prestige: 90 },
  { id:'legend', name:'Hall of Sparks Legacy Belt', prestige: 120 }
];

const opponents = [
  { name:'Turbo Vega', style:'High Flyer', power:18, charisma:14, tech:12, belt:'rookie' },
  { name:'Brick Anthem', style:'Powerhouse', power:30, charisma:18, tech:12, belt:'tv' },
  { name:'Madame Meteor', style:'Showboat', power:22, charisma:34, tech:21, belt:'tag' },
  { name:'The Velvet Hammer', style:'Brawler', power:44, charisma:28, tech:25, belt:'inter' },
  { name:'Cipher Steel', style:'Technician', power:37, charisma:33, tech:49, belt:'world' },
  { name:'King Kinetix', style:'Living Legend', power:60, charisma:58, tech:56, belt:'legend' }
];

const storylines = [
  { id:'tryout', title:'Open Tryout Chaos', minRep:0, reward:{rep:8, charisma:2}, text:'A producer gives you one televised minute to prove you belong.' },
  { id:'rival', title:'Parking Lot Ambush', minRep:12, reward:{rep:13, power:2}, text:'A jealous rookie jumps you before the show. Do you fire back on camera?' },
  { id:'mentor', title:'Legendary Mentor', minRep:26, reward:{rep:15, tech:3}, text:'A retired icon teaches you how to turn a near-loss into a career-making comeback.' },
  { id:'faction', title:'Faction Invitation', minRep:42, reward:{rep:18, charisma:3}, text:'The neon-clad Eclipse Syndicate offers protection, but wants loyalty.' },
  { id:'betrayal', title:'Main Event Betrayal', minRep:62, reward:{rep:24, power:2, tech:2}, text:'A friend costs you a title match. The crowd demands a grudge fight.' },
  { id:'mania', title:'Stadium of Sparks', minRep:86, reward:{rep:34, charisma:4, power:2}, text:'Your road leads to the biggest stage in Grand Collision Entertainment.' }
];

const moves = {
  High_Flyer:['Shooting Neon Press','Ropewalk Rana','Meteor Dropkick'],
  Powerhouse:['Avalanche Spinebuster','Titan Bomb','Concrete Lariat'],
  Technician:['Quantum Lock','Counterpoint Suplex','Circuit Breaker Armbar'],
  Brawler:['Barricade Bash','Streetlight Elbow','Chaos DDT'],
  Showboat:['Spotlight Cutter','Encore Elbow','Red Carpet Rollup']
};

const defaultState = {
  screen:'create',
  week:1,
  money:100,
  wrestler:null,
  completedStories:[],
  ownedBelts:[],
  log:[],
  currentMatch:null
};
let state = loadState();

function saveState(){ localStorage.setItem('neonSlamSave', JSON.stringify(state)); }
function loadState(){
  try { return JSON.parse(localStorage.getItem('neonSlamSave')) || structuredClone(defaultState); }
  catch { return structuredClone(defaultState); }
}
function reset(){ localStorage.removeItem('neonSlamSave'); state = structuredClone(defaultState); render(); }
function toast(msg){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){ wrap = document.createElement('div'); wrap.className='toast-wrap'; document.body.appendChild(wrap); }
  const node = document.createElement('div'); node.className='toast'; node.textContent=msg; wrap.appendChild(node);
  setTimeout(()=>node.remove(), 3600);
}
function addLog(msg){ state.log.unshift(`Week ${state.week}: ${msg}`); state.log = state.log.slice(0,80); }
function statTotal(w=state.wrestler){ return w.power + w.charisma + w.tech + Math.floor(w.rep/4); }
function beltName(id){ return belts.find(b=>b.id===id)?.name || id; }
function styleKey(style){ return style.replace(' ','_'); }

function avatarHTML(w){
  return `<div class="avatar" style="--gear:${w.gear};--accent:${w.accent};--skin:${w.skin};--hair:${w.hair}">
    <div class="hair"></div><div class="head"></div><div class="eye left"></div><div class="eye right"></div><div class="mouth"></div>
    <div class="arm left"></div><div class="arm right"></div><div class="torso"></div><div class="belt"></div>
    <div class="leg left"></div><div class="leg right"></div><div class="boot left"></div><div class="boot right"></div>
  </div>`;
}

function render(){
  saveState();
  if(state.screen === 'create') return renderCreate();
  if(state.screen === 'match') return renderMatch();
  return renderGame();
}

function renderCreate(){
  app.innerHTML = `<section class="hero">
    <div class="card">
      <div class="panel-title"><h2>Create Your Rookie</h2><button class="secondary" onclick="loadExisting()">Load Save</button></div>
      <p class="notice">Join <b>Grand Collision Entertainment</b>, a fictional global wrestling empire full of fireworks, betrayals, rankings, factions, and championship gold.</p>
      <div class="grid two" style="margin-top:18px">
        <div><label>Ring Name</label><input id="name" value="Roxy Riot" maxlength="24"></div>
        <div><label>Hometown</label><input id="home" value="Brooklyn, NY" maxlength="28"></div>
        <div><label>Wrestling Style</label><select id="style"><option>High Flyer</option><option>Powerhouse</option><option>Technician</option><option>Brawler</option><option>Showboat</option></select></div>
        <div><label>Catchphrase</label><input id="catch" value="The lights go out when I show up!" maxlength="70"></div>
        <div><label>Gear Color</label><input id="gear" type="color" value="#ff2bd6"></div>
        <div><label>Accent Color</label><input id="accent" type="color" value="#ffe45e"></div>
        <div><label>Skin Tone</label><input id="skin" type="color" value="#d78752"></div>
        <div><label>Hair Color</label><input id="hair" type="color" value="#111111"></div>
      </div>
      <div class="footer-actions"><button onclick="startCareer()">Sign Rookie Contract</button><button class="danger" onclick="reset()">Clear Save</button></div>
    </div>
    <div class="card wrestler-stage">
      <div class="ring"></div>
      ${avatarHTML({gear:'#ff2bd6',accent:'#ffe45e',skin:'#d78752',hair:'#111'})}
    </div>
  </section>`;
  ['gear','accent','skin','hair'].forEach(id=>document.getElementById(id).addEventListener('input', previewAvatar));
}
function previewAvatar(){
  document.querySelector('.wrestler-stage').innerHTML = `<div class="ring"></div>${avatarHTML({gear:gear.value,accent:accent.value,skin:skin.value,hair:hair.value})}`;
}
function loadExisting(){
  const saved = loadState();
  if(saved?.wrestler){ state=saved; state.screen='home'; render(); }
  else toast('No saved rookie yet. Create one and sign a contract.');
}
function startCareer(){
  const style = document.getElementById('style').value;
  let base = { power:12, charisma:12, tech:12 };
  if(style==='High Flyer') base = {power:10,charisma:15,tech:15};
  if(style==='Powerhouse') base = {power:20,charisma:10,tech:10};
  if(style==='Technician') base = {power:10,charisma:10,tech:20};
  if(style==='Brawler') base = {power:17,charisma:10,tech:13};
  if(style==='Showboat') base = {power:10,charisma:22,tech:8};
  state = structuredClone(defaultState);
  state.screen='home';
  state.wrestler = {
    name: document.getElementById('name').value.trim() || 'Mystery Rookie',
    hometown: document.getElementById('home').value.trim() || 'Parts Unknown',
    style, catchphrase: document.getElementById('catch').value.trim() || 'Believe the hype!',
    gear: gear.value, accent: accent.value, skin: skin.value, hair: hair.value,
    rep:0, stamina:100, morale:80, fans:25, ...base
  };
  addLog(`${state.wrestler.name} signed a developmental contract with Grand Collision Entertainment.`);
  render();
}

function renderGame(tab='home'){
  const w = state.wrestler;
  app.innerHTML = `<div class="nav">
    ${['home','training','matches','story','rankings','belts','journal'].map(t=>`<button class="${tab===t?'':'secondary'}" onclick="renderGame('${t}')">${t.toUpperCase()}</button>`).join('')}
  </div>
  <section class="grid two">
    <aside class="card">
      <div class="panel-title"><h2>${w.name}</h2><span class="pill">Week ${state.week}</span></div>
      <div class="wrestler-stage" style="min-height:310px"><div class="ring"></div>${avatarHTML(w)}</div>
      <div class="kv"><span class="pill">${w.style}</span><span class="pill">${w.hometown}</span><span class="pill">$${state.money}</span><span class="pill">Fans ${w.fans}k</span></div>
      <p class="notice">“${w.catchphrase}”</p>
      ${statBlock('Reputation', w.rep, 130)}${statBlock('Stamina', w.stamina, 100)}${statBlock('Morale', w.morale, 100)}
      <div class="grid three" style="margin-top:12px">${miniStat('Power',w.power)}${miniStat('Charisma',w.charisma)}${miniStat('Technique',w.tech)}</div>
    </aside>
    <section class="card" id="panel"></section>
  </section>`;
  renderPanel(tab);
}
function statBlock(name,val,max){ return `<div class="stat"><b><span>${name}</span><span>${val}/${max}</span></b><div class="bar"><div class="fill" style="width:${Math.min(100,val/max*100)}%"></div></div></div>`; }
function miniStat(name,val){ return `<div class="stat"><b>${name}</b><div class="big">${val}</div></div>`; }
function renderPanel(tab){
  const panel = document.getElementById('panel');
  const w = state.wrestler;
  if(tab==='home') panel.innerHTML = `<div class="panel-title"><h2>Booking Office</h2><span class="pill">Overall ${statTotal()}</span></div>
    <p class="notice">Choose how to spend each week: train, cut promos, accept story beats, or chase a title match. Win belts and climb the GCE rankings to unlock the legendary finale.</p>
    <div class="grid two" style="margin-top:16px">
      <button onclick="renderGame('training')">Hit the Training Center</button>
      <button onclick="renderGame('matches')">Book a Match</button>
      <button onclick="renderGame('story')">Progress Storyline</button>
      <button onclick="restWeek()" class="secondary">Rest and Recover</button>
    </div>
    <h3>Next Goal</h3>${nextGoalHTML()}`;
  if(tab==='training') panel.innerHTML = `<div class="panel-title"><h2>Training Center</h2><span class="pill">Costs stamina</span></div>
    <div class="grid two">
      ${trainingButton('Power Gym','power',12,12,'Throw heavier opponents and survive brawls.')}
      ${trainingButton('Promo Class','charisma',10,10,'Win crowds, sell feuds, and earn faster reputation.')}
      ${trainingButton('Chain Wrestling','tech',11,11,'Reverse finishers and outsmart champions.')}
      ${trainingButton('Meet Fans','fans',8,5,'Grow your following and morale.')}
    </div>`;
  if(tab==='matches') panel.innerHTML = `<div class="panel-title"><h2>Match Card</h2><span class="pill">Pick your fight</span></div>${opponents.map(o=>matchRow(o)).join('')}`;
  if(tab==='story') panel.innerHTML = `<div class="panel-title"><h2>Storylines</h2><span class="pill">Drama = Reputation</span></div>${storylines.map(s=>storyRow(s)).join('')}`;
  if(tab==='rankings') panel.innerHTML = `<div class="panel-title"><h2>GCE Rankings</h2><span class="pill">Beat higher stars to rise</span></div>${rankingHTML()}`;
  if(tab==='belts') panel.innerHTML = `<div class="panel-title"><h2>Championship Room</h2><span class="pill">${state.ownedBelts.length}/${belts.length} Belts</span></div>${belts.map(b=>beltRow(b)).join('')}`;
  if(tab==='journal') panel.innerHTML = `<div class="panel-title"><h2>Career Journal</h2><button class="danger" onclick="reset()">Start Over</button></div><div class="log">${state.log.map(l=>`<div class="log-entry">${l}</div>`).join('') || '<p>No entries yet.</p>'}</div>`;
}
function nextGoalHTML(){
  const nextBelt = belts.find(b=>!state.ownedBelts.includes(b.id));
  if(!nextBelt) return `<p class="notice">You own every belt. You are the neon immortal. Start over with a new style for a different career arc.</p>`;
  return `<div class="belt-row"><div><b>${nextBelt.name}</b><div class="small">Required reputation: ${nextBelt.prestige}</div></div><button onclick="renderGame('matches')">Chase It</button></div>`;
}
function trainingButton(label,stat,cost,gain,desc){ return `<div class="stat"><h3>${label}</h3><p class="small">${desc}</p><button onclick="train('${stat}',${cost},${gain})">Train -${cost} stamina</button></div>`; }
function train(stat,cost,gain){
  const w=state.wrestler; if(w.stamina<cost) return toast('Too tired. Rest before training.');
  w.stamina-=cost;
  if(stat==='fans'){ w.fans+=gain; w.morale=Math.min(100,w.morale+6); addLog(`${w.name} met fans at a neon signing. Fanbase grew to ${w.fans}k.`); }
  else { w[stat]+=Math.ceil(Math.random()*3); w.rep+=Math.ceil(gain/3); addLog(`${w.name} trained ${stat} and gained momentum.`); }
  advanceWeek(); renderGame('training');
}
function restWeek(){ state.wrestler.stamina=Math.min(100,state.wrestler.stamina+30); state.wrestler.morale=Math.min(100,state.wrestler.morale+8); addLog(`${state.wrestler.name} recovered, studied tape, and recharged.`); advanceWeek(); renderGame('home'); }
function advanceWeek(){ state.week++; state.money += 20 + Math.floor(state.wrestler.rep/5); }
function matchRow(o){
  const req = belts.find(b=>b.id===o.belt)?.prestige || 0;
  const locked = state.wrestler.rep + 12 < req;
  return `<div class="match-row"><div><b>${o.name}</b><div class="small">${o.style} • Target: ${beltName(o.belt)} • Threat ${o.power+o.charisma+o.tech}</div></div><button ${locked?'disabled':''} onclick='startMatch(${JSON.stringify(o)})'>${locked?'Build Rep':'Fight'}</button></div>`;
}
function startMatch(o){
  state.currentMatch = { opponent:o, momentum:50, round:1, notes:[`${state.wrestler.name} enters under a storm of lights.`] };
  state.screen='match'; render();
}
function renderMatch(){
  const m=state.currentMatch, w=state.wrestler, o=m.opponent;
  app.innerHTML = `<section class="card match-screen">
    <h2>${w.name} vs ${o.name}</h2>
    <div class="versus"><div>${avatarHTML(w)}<h3>${w.name}</h3></div><div class="vs">VS</div><div>${avatarHTML({gear:'#45d7ff',accent:'#ffdf4d',skin:'#b97048',hair:'#22110a'})}<h3>${o.name}</h3></div></div>
    <div class="meter"><div class="meter-inner" style="width:${m.momentum}%"></div></div><p class="small">Momentum ${m.momentum}% • Round ${m.round}/5</p>
    <div class="choice">
      <button onclick="matchMove('power')">Power Move</button>
      <button onclick="matchMove('charisma')">Crowd Taunt</button>
      <button onclick="matchMove('tech')">Technical Counter</button>
      <button class="secondary" onclick="matchMove('risk')">High Risk Finisher</button>
    </div>
    <div class="log" style="text-align:left;margin-top:18px">${m.notes.map(n=>`<div class="log-entry">${n}</div>`).join('')}</div>
  </section>`;
}
function matchMove(type){
  const m=state.currentMatch, w=state.wrestler, o=m.opponent;
  const moveList = moves[styleKey(w.style)] || moves.Brawler;
  let skill = type==='risk' ? Math.max(w.power,w.charisma,w.tech) : w[type];
  let opp = type==='power'?o.power:type==='charisma'?o.charisma:type==='tech'?o.tech:Math.max(o.power,o.charisma,o.tech);
  let roll = Math.floor(Math.random()*20)+1 + skill - Math.floor(opp/2);
  let swing = type==='risk' ? (roll>18?24:-18) : (roll>13?14:-9);
  m.momentum = Math.max(0, Math.min(100, m.momentum+swing));
  const move = type==='risk' ? moveList[0] : moveList[Math.floor(Math.random()*moveList.length)];
  m.notes.unshift(swing>0 ? `${w.name} lands ${move}! The crowd explodes.` : `${o.name} scouts it and steals the spotlight.`);
  m.round++;
  if(m.momentum>=88 || m.round>5 || m.momentum<=12) return finishMatch();
  render();
}
function finishMatch(){
  const m=state.currentMatch, w=state.wrestler, o=m.opponent;
  const chance = m.momentum + statTotal()/3 - (o.power+o.charisma+o.tech)/4 + Math.random()*30;
  const win = chance > 55;
  let text;
  if(win){
    const repGain = 10 + Math.floor((o.power+o.charisma+o.tech)/12);
    w.rep = Math.min(130, w.rep + repGain); w.fans += 4 + Math.floor(repGain/2); w.morale=Math.min(100,w.morale+8);
    text = `${w.name} defeated ${o.name} and gained ${repGain} reputation.`;
    const belt = belts.find(b=>b.id===o.belt);
    if(belt && w.rep>=belt.prestige && !state.ownedBelts.includes(belt.id)) { state.ownedBelts.push(belt.id); text += ` NEW CHAMPION: ${belt.name}!`; }
  } else {
    w.rep = Math.max(0, w.rep-2); w.morale=Math.max(0,w.morale-7); text = `${w.name} lost to ${o.name}, but learned from the spotlight.`;
  }
  w.stamina = Math.max(0, w.stamina - 18); addLog(text); advanceWeek(); state.currentMatch=null; state.screen='home'; toast(text); renderGame('home');
}
function storyRow(s){
  const done=state.completedStories.includes(s.id), locked=state.wrestler.rep<s.minRep;
  return `<div class="story-row"><div><b>${s.title}</b><div class="small">${s.text} Required rep ${s.minRep}</div></div><button ${done||locked?'disabled':''} onclick="playStory('${s.id}')">${done?'Complete':locked?'Locked':'Play'}</button></div>`;
}
function playStory(id){
  const s=storylines.find(x=>x.id===id), w=state.wrestler;
  if(!s || w.rep<s.minRep || state.completedStories.includes(id)) return;
  state.completedStories.push(id);
  Object.entries(s.reward).forEach(([k,v])=> w[k]=(w[k]||0)+v);
  w.morale=Math.min(100,w.morale+5); addLog(`Storyline complete: ${s.title}. ${w.name} became hotter than ever.`); advanceWeek(); renderGame('story');
}
function rankingHTML(){
  const roster = opponents.map(o=>({name:o.name,total:o.power+o.charisma+o.tech})).concat([{name:state.wrestler.name,total:statTotal(), current:true}]).sort((a,b)=>b.total-a.total);
  return roster.map((r,i)=>`<div class="rank-row ${r.current?'current':''}"><div><b>#${i+1} ${r.name}</b><div class="small">Score ${r.total}</div></div>${r.current?'<span class="pill">YOU</span>':''}</div>`).join('');
}
function beltRow(b){
  const owned=state.ownedBelts.includes(b.id);
  return `<div class="belt-row"><div><b>${owned?'🏆 ':' '}${b.name}</b><div class="small">Prestige requirement ${b.prestige}</div></div><span class="pill">${owned?'Won':'Vacant Target'}</span></div>`;
}

render();
