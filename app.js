// ── DATA ────────────────────────────────────────────────
const GROUPS = [
  { name:'A组', teams:[{flag:'🇲🇽',name:'墨西哥',fav:false},{flag:'🇰🇷',name:'韩国',fav:false},{flag:'🇿🇦',name:'南非',fav:false},{flag:'🇨🇿',name:'捷克',fav:false}] },
  { name:'B组', teams:[{flag:'🇨🇦',name:'加拿大',fav:false},{flag:'🇨🇭',name:'瑞士',fav:false},{flag:'🇶🇦',name:'卡塔尔',fav:false},{flag:'🇧🇦',name:'波黑',fav:false}] },
  { name:'C组', teams:[{flag:'🇧🇷',name:'巴西',fav:true},{flag:'🇲🇦',name:'摩洛哥',fav:false},{flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',name:'苏格兰',fav:false},{flag:'🇭🇹',name:'海地',fav:false}] },
  { name:'D组', teams:[{flag:'🇺🇸',name:'美国',fav:false},{flag:'🇵🇾',name:'巴拉圭',fav:false},{flag:'🇦🇺',name:'澳大利亚',fav:false},{flag:'🇹🇷',name:'土耳其',fav:false}] },
  { name:'E组', teams:[{flag:'🇩🇪',name:'德国',fav:true},{flag:'🇨🇮',name:'科特迪瓦',fav:false},{flag:'🇪🇨',name:'厄瓜多尔',fav:false},{flag:'🇨🇼',name:'库拉索',fav:false}] },
  { name:'F组', teams:[{flag:'🇳🇱',name:'荷兰',fav:false},{flag:'🇯🇵',name:'日本',fav:false},{flag:'🇸🇪',name:'瑞典',fav:false},{flag:'🇹🇳',name:'突尼斯',fav:false}] },
  { name:'G组', teams:[{flag:'🇧🇪',name:'比利时',fav:false},{flag:'🇪🇬',name:'埃及',fav:false},{flag:'🇮🇷',name:'伊朗',fav:false},{flag:'🇳🇿',name:'新西兰',fav:false}] },
  { name:'H组', teams:[{flag:'🇪🇸',name:'西班牙',fav:true},{flag:'🇺🇾',name:'乌拉圭',fav:false},{flag:'🇸🇦',name:'沙特',fav:false},{flag:'🇨🇻',name:'佛得角',fav:false}] },
  { name:'I组',  teams:[{flag:'🇫🇷',name:'法国',fav:true},{flag:'🇳🇴',name:'挪威',fav:false},{flag:'🇸🇳',name:'塞内加尔',fav:false},{flag:'🇮🇶',name:'伊拉克',fav:false}] },
  { name:'J组',  teams:[{flag:'🇦🇷',name:'阿根廷',fav:true},{flag:'🇦🇹',name:'奥地利',fav:false},{flag:'🇩🇿',name:'阿尔及利亚',fav:false},{flag:'🇯🇴',name:'约旦',fav:false}] },
  { name:'K组', teams:[{flag:'🇵🇹',name:'葡萄牙',fav:true},{flag:'🇨🇴',name:'哥伦比亚',fav:false},{flag:'🇨🇩',name:'刚果',fav:false},{flag:'🇺🇿',name:'乌兹别克斯坦',fav:false}] },
  { name:'L组',  teams:[{flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',name:'英格兰',fav:true},{flag:'🇭🇷',name:'克罗地亚',fav:false},{flag:'🇬🇭',name:'加纳',fav:false},{flag:'🇵🇦',name:'巴拿马',fav:false}] },
];

const RANK_MAP = {
  '西班牙':1,'阿根廷':2,'法国':3,'英格兰':4,'巴西':5,
  '葡萄牙':7,'荷兰':8,'比利时':9,'克罗地亚':10,'摩洛哥':11,
  '德国':12,'哥伦比亚':13,'美国':14,'墨西哥':15,'乌拉圭':16,
  '瑞士':17,'日本':20,'韩国':22,'澳大利亚':26
};

const ODDS = {sf:2, ch:4};
const MAX_SEL = {sf:4, ch:1};
const ADMIN_PASSWORD = '2026wc'; // 管理员密码，可自行修改

const state = {
  sf: {selected:new Set(), amount:null},
  ch: {selected:new Set(), amount:null},
  bets: [],
  nextId: 1,
  adminUnlocked: false,
};

let lastSubmittedBetShareText = '';

// ── INIT ───────────────────────────────────────────────
function init() {
  initCountdown();
  renderTicker();
  renderGroups();
  renderTeamsList('sf');
  renderTeamsList('ch');
  renderLedger();
}

// ── TOAST NOTIFICATION ─────────────────────────────────
let toastTimeout;
function showToast(msg, icon = '⚽') {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ── COUNTDOWN TIMER ───────────────────────────────────
function initCountdown() {
  // 揭幕战：美加墨当地时间 2026-06-11，设定目标时间 2026-06-11 00:00:00 
  const targetDate = new Date('2026-06-11T00:00:00');
  const wrap = document.getElementById('countdownWrap');
  const timer = document.getElementById('countdownTime');

  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = 'flex';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    timer.innerHTML = `${days}<span>天</span>${String(hours).padStart(2,'0')}<span>时</span>${String(mins).padStart(2,'0')}<span>分</span>${String(secs).padStart(2,'0')}<span>秒</span>`;
  }
  update();
  setInterval(update, 1000);
}

// ── TICKER ─────────────────────────────────────────────
function renderTicker() {
  const items=['西班牙 ESP ★ 夺冠热门','法国 FRA ★ 联合最热','英格兰 ENG ★ 赔率第三','阿根廷 ARG ★ 卫冕冠军','巴西 BRA 五星巴西','葡萄牙 POR','德国 GER 重建完成','荷兰 NED 橙色军团','日本 JPN 亚洲之光','摩洛哥 MAR 非洲骄傲'];
  const html = items.map(i=>`<span>⚽</span> ${i} `).join('').repeat(3);
  document.getElementById('ticker').innerHTML = html+html;
}

// ── INFO GROUPS ────────────────────────────────────────
function renderGroups() {
  document.getElementById('groupsGrid').innerHTML = GROUPS.map(g=>`
    <div class="group-card">
      <div class="g-name">${g.name}</div>
      ${g.teams.map(t=>`
        <div class="g-team ${t.fav?'fav':''}">
          ${t.fav?'<div class="dot"></div>':'<div style="width:5px"></div>'}
          <span style="font-size:15px">${t.flag}</span> ${t.name}
          ${RANK_MAP[t.name]?`<small style="color:#7a8c7e;font-size:10px">#${RANK_MAP[t.name]}</small>`:''}
          ${t.fav?' ★':''}
        </div>`).join('')}
    </div>`).join('');
}

function toggleInfo() {
  document.getElementById('infoBody').classList.toggle('open');
  document.getElementById('toggleIcon').classList.toggle('open');
}

// ── GROUPED TEAM LIST ──────────────────────────────────
function renderTeamsList(type) {
  const el = document.getElementById(type==='sf'?'sfTeamsList':'chTeamsList');
  let html = '';
  GROUPS.forEach(g => {
    html += `<div class="group-header"><span class="gh-label">${g.name}</span></div>`;
    g.teams.forEach(t => {
      const sel = state[type].selected.has(t.name);
      const rank = RANK_MAP[t.name] ? `FIFA #${RANK_MAP[t.name]}` : '';
      html += `<button class="team-btn ${sel?'selected':''}" onclick="toggleTeam('${type}','${t.name.replace(/'/g,"\\'")}')">
        <span class="flag-emoji">${t.flag}</span>
        <span class="t-name">${t.name}${t.fav?'<span class="t-hot"> ★</span>':''}</span>
        ${rank?`<span class="t-rank">${rank}</span>`:''}
        <span class="check">${sel?'✓':''}</span>
      </button>`;
    });
  });
  el.innerHTML = html;
  updateCount(type);
}

function toggleTeam(type, name) {
  const s = state[type].selected;
  const max = MAX_SEL[type];
  if (s.has(name)) { s.delete(name); }
  else {
    if (s.size >= max) {
      if (max===1) {
        s.clear();
      } else {
        showToast(`已选满 ${max} 支球队！请先取消其他球队的选择。`, '⚠️');
        return;
      }
    }
    s.add(name);
  }
  renderTeamsList(type);
  updateSubmitBtn(type);
  updatePayout(type);
}

function updateCount(type) {
  const max = MAX_SEL[type];
  const count = state[type].selected.size;
  const el = document.getElementById(type==='sf'?'sfCount':'chCount');
  el.textContent = `已选 ${count} / ${max} 支球队`;
  el.style.color = count===max ? 'var(--gold-light)' : 'var(--muted)';

  // 控制清空按钮显示
  const clearEl = document.getElementById(type==='sf'?'sfClear':'chClear');
  if (count > 0) {
    clearEl.style.display = 'inline';
  } else {
    clearEl.style.display = 'none';
  }
}

// ── CLEAR SELECTED ─────────────────────────────────────
function clearSelected(type) {
  state[type].selected.clear();
  renderTeamsList(type);
  updateSubmitBtn(type);
  updatePayout(type);
  showToast(`已清空${type === 'sf' ? '四强' : '冠军'}的已选球队`);
}

// ── AMOUNT ─────────────────────────────────────────────
function setAmount(type, val, el) {
  document.getElementById(type==='sf'?'sfAmount':'chAmount').value = val;
  state[type].amount = val;
  document.querySelectorAll(`#${type==='sf'?'sfChips':'chChips'} .amount-chip`).forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  updatePayout(type);
  updateSubmitBtn(type);
}

function updatePayout(type) {
  const inputEl = document.getElementById(type==='sf'?'sfAmount':'chAmount');
  let rawVal = inputEl.value;

  // 正则过滤，只允许正整数
  rawVal = rawVal.replace(/\D/g, '');
  if (rawVal !== '') {
    const num = parseInt(rawVal, 10);
    if (num < 1) {
      inputEl.value = '';
      state[type].amount = null;
    } else {
      inputEl.value = num;
      state[type].amount = num;
    }
  } else {
    state[type].amount = null;
  }

  const amount = state[type].amount;
  const odds = ODDS[type];
  if (amount>0) {
    const profit = amount*(odds-1);
    document.getElementById(type==='sf'?'sfPayout':'chPayout').innerHTML =
      `猜中可获赔付 <strong>¥${(amount*odds).toLocaleString()}</strong>（本金 ¥${amount} + 盈利 <strong style="color:#5dd48c">+¥${profit.toLocaleString()}</strong>）`;
  } else {
    document.getElementById(type==='sf'?'sfPayout':'chPayout').textContent='';
  }
  updateSubmitBtn(type);
}

function updateSubmitBtn(type) {
  document.getElementById(type==='sf'?'sfSubmit':'chSubmit').disabled =
    !(state[type].selected.size===MAX_SEL[type] && state[type].amount>0);
}

// 监视失焦事件以自动纠正格式
document.addEventListener('focusout', e=>{
  if(e.target.id==='sfAmount') updatePayout('sf');
  if(e.target.id==='chAmount') updatePayout('ch');
});

// ── SUBMIT ─────────────────────────────────────────────
function submitBet(type) {
  const nameId = type==='sf'?'sfName':'chName';
  const name = document.getElementById(nameId).value.trim();
  if (!name) { document.getElementById(nameId).focus(); return; }

  const odds = ODDS[type];
  const amount = state[type].amount;
  const teams = [...state[type].selected];
  const payout = amount*odds;
  const profit = amount*(odds-1);

  const bet = {id:state.nextId++, type, name, teams, amount, payout, profit, paid:false, time:new Date()};
  state.bets.unshift(bet);

  // 生成分享文本
  lastSubmittedBetShareText = generateShareText(bet);

  document.getElementById('modalDetail').innerHTML = `
    <div>👤 下注人：<strong>${name}</strong></div>
    <div>${type==='sf'?'🏟️ 选择球队':'👑 冠军预测'}：<strong>${teams.join(' · ')}</strong></div>
    <div>📜 获奖条件：${type==='sf'?'选4队中至少 <strong>3队进四强</strong> 即中奖':'该队 <strong>夺得冠军</strong> 即中奖'}</div>
    <div>💰 投注金额：<strong>¥${amount}</strong></div>
    <div>🏆 若猜中赔付：<strong>¥${payout.toLocaleString()}</strong>（赔率 1:${odds}，盈利 +¥${profit.toLocaleString()}）</div>
    <div style="margin-top:6px;padding:6px 8px;background:rgba(224,123,57,.1);border-radius:6px;font-size:11px;color:var(--unpaid-color)">⏳ 付款状态：待确认收款 (复制下方注单发给庄家对账)</div>
  `;
  document.getElementById('modal').classList.add('open');

  // reset
  state[type].selected.clear();
  state[type].amount = null;
  document.getElementById(nameId).value='';
  document.getElementById(type==='sf'?'sfAmount':'chAmount').value='';
  document.querySelectorAll(`#${type==='sf'?'sfChips':'chChips'} .amount-chip`).forEach(c=>c.classList.remove('active'));
  document.getElementById(type==='sf'?'sfPayout':'chPayout').textContent='';
  renderTeamsList(type);
  renderLedger();
  updateSubmitBtn(type);
}

// ── SHARE TEXT GENERATOR ───────────────────────────────
function generateShareText(bet) {
  const timeStr = `${bet.time.getFullYear()}-${String(bet.time.getMonth()+1).padStart(2,'0')}-${String(bet.time.getDate()).padStart(2,'0')} ${String(bet.time.getHours()).padStart(2,'0')}:${String(bet.time.getMinutes()).padStart(2,'0')}`;
  const payload = `${bet.name}|${bet.type}|${bet.teams.join(',')}|${bet.amount}|${bet.id}`;
  const checksum = btoa(unescape(encodeURIComponent(payload))).substring(0, 8);

  return `【2026世界杯竞猜单】
👤 下注人：${bet.name}
🎫 竞猜盘：${bet.type==='sf'?'四强竞猜 (选4中3即赢)':'冠军竞猜 (猜中夺冠即赢)'}
⚽ 预测球队：${bet.teams.join(' · ')}
💰 投注金额：¥${bet.amount}
🏆 若中赔付：¥${bet.payout}
🕒 下注时间：${timeStr}
🔑 校验单号：#WC26-${bet.type.toUpperCase()}-${bet.id}-${checksum}

------------ 庄家导入密文 (请勿修改) ------------
${JSON.stringify({
  id: bet.id,
  type: bet.type,
  name: bet.name,
  teams: bet.teams,
  amount: bet.amount,
  payout: bet.payout,
  profit: bet.profit,
  paid: bet.paid,
  time: bet.time.getTime(),
  chk: checksum
})}
----------------------------------------------`;
}

function copyShareText() {
  if (!lastSubmittedBetShareText) return;
  navigator.clipboard.writeText(lastSubmittedBetShareText).then(() => {
    showToast('📋 注单分享文本已复制！快去发送给庄家付款吧~', '✅');
  }).catch(err => {
    // 降级使用 textarea
    const ta = document.createElement('textarea');
    ta.value = lastSubmittedBetShareText;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('📋 注单分享文本已复制！快去发送给庄家付款吧~', '✅');
    } catch(e) {
      showToast('❌ 自动复制失败，请截图或手动复制。');
    }
    document.body.removeChild(ta);
  });
}

// ── ADMIN ──────────────────────────────────────────────
function openAdminModal() {
  document.getElementById('adminPwd').value='';
  document.getElementById('adminErr').textContent='';
  document.getElementById('adminModal').classList.add('open');
  setTimeout(()=>document.getElementById('adminPwd').focus(),300);
}

function checkAdmin() {
  const pwd = document.getElementById('adminPwd').value;
  if (pwd === ADMIN_PASSWORD) {
    state.adminUnlocked = true;
    closeModal('adminModal');
    document.getElementById('adminBar').style.display='flex';
    document.getElementById('adminModeTag').style.display='inline-flex';
    document.getElementById('adminBtn').textContent='✅ 管理员已登录';
    document.getElementById('adminBtn').style.color='var(--paid-color)';
    renderLedger();
  } else {
    document.getElementById('adminErr').textContent='❌ 密码错误，请重试';
    document.getElementById('adminPwd').value='';
    document.getElementById('adminPwd').focus();
  }
}

function lockAdmin() {
  state.adminUnlocked = false;
// ── DATA SYNC / API ────────────────────────────────────
let useRemoteApi = true; // 是否启用云端 API 同步，如果接口检测无环境密钥将自动关闭并降级

async function loadBetsFromDb() {
  if (!useRemoteApi) return;
  try {
    const res = await fetch('/api/get-bets');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (data.fallbackMode) {
      console.warn('后端提示：缺少环境变量，已自动切换为本地内存模式。');
      useRemoteApi = false;
      return;
    }
    state.bets = data;
    // 找出目前最大的 bet_id，更新本地的 nextId 保证不重复
    if (state.bets.length > 0) {
      const maxId = Math.max(...state.bets.map(b => b.id || 0));
      state.nextId = maxId + 1;
    }
  } catch (err) {
    console.error('拉取云端数据失败，已自动降级为本地内存模式。原因:', err.message);
    useRemoteApi = false;
  }
}

async function syncToDb(payload) {
  if (!useRemoteApi) return true;
  try {
    const res = await fetch('/api/save-bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const resData = await res.json();
    if (resData.fallbackMode) {
      useRemoteApi = false;
      return true;
    }
    return resData.success;
  } catch (err) {
    console.error('同步云端数据失败:', err.message);
    showToast('⚠️ 云端同步失败，已暂存至本地内存', '⚠️');
    return false;
  }
}

// ── INIT ───────────────────────────────────────────────
async function init() {
  initCountdown();
  renderTicker();
  renderGroups();
  renderTeamsList('sf');
  renderTeamsList('ch');
  
  // 异步从数据库载入，载入完成后渲染 Ledger
  await loadBetsFromDb();
  renderLedger();
}

// ── TOAST NOTIFICATION ─────────────────────────────────
let toastTimeout;
function showToast(msg, icon = '⚽') {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ── COUNTDOWN TIMER ───────────────────────────────────
function initCountdown() {
  // 揭幕战：美加墨当地时间 2026-06-11，设定目标时间 2026-06-11 00:00:00 
  const targetDate = new Date('2026-06-11T00:00:00');
  const wrap = document.getElementById('countdownWrap');
  const timer = document.getElementById('countdownTime');

  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = 'flex';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    timer.innerHTML = `${days}<span>天</span>${String(hours).padStart(2,'0')}<span>时</span>${String(mins).padStart(2,'0')}<span>分</span>${String(secs).padStart(2,'0')}<span>秒</span>`;
  }
  update();
  setInterval(update, 1000);
}

// ── TICKER ─────────────────────────────────────────────
function renderTicker() {
  const items=['西班牙 ESP ★ 夺冠热门','法国 FRA ★ 联合最热','英格兰 ENG ★ 赔率第三','阿根廷 ARG ★ 卫冕冠军','巴西 BRA 五星巴西','葡萄牙 POR','德国 GER 重建完成','荷兰 NED 橙色军团','日本 JPN 亚洲之光','摩洛哥 MAR 非洲骄傲'];
  const html = items.map(i=>`<span>⚽</span> ${i} `).join('').repeat(3);
  document.getElementById('ticker').innerHTML = html+html;
}

// ── INFO GROUPS ────────────────────────────────────────
function renderGroups() {
  document.getElementById('groupsGrid').innerHTML = GROUPS.map(g=>`
    <div class="group-card">
      <div class="g-name">${g.name}</div>
      ${g.teams.map(t=>`
        <div class="g-team ${t.fav?'fav':''}">
          ${t.fav?'<div class="dot"></div>':'<div style="width:5px"></div>'}
          <span style="font-size:15px">${t.flag}</span> ${t.name}
          ${RANK_MAP[t.name]?`<small style="color:#7a8c7e;font-size:10px">#${RANK_MAP[t.name]}</small>`:''}
          ${t.fav?' ★':''}
        </div>`).join('')}
    </div>`).join('');
}

// ── TOGGLE INFO ────────────────────────────────────────
function toggleInfo() {
  document.getElementById('infoBody').classList.toggle('open');
  document.getElementById('toggleIcon').classList.toggle('open');
}

// ── GROUPED TEAM LIST ──────────────────────────────────
function renderTeamsList(type) {
  const el = document.getElementById(type==='sf'?'sfTeamsList':'chTeamsList');
  let html = '';
  GROUPS.forEach(g => {
    html += `<div class="group-header"><span class="gh-label">${g.name}</span></div>`;
    g.teams.forEach(t => {
      const sel = state[type].selected.has(t.name);
      const rank = RANK_MAP[t.name] ? `FIFA #${RANK_MAP[t.name]}` : '';
      html += `<button class="team-btn ${sel?'selected':''}" onclick="toggleTeam('${type}','${t.name.replace(/'/g,"\\'")}')">
        <span class="flag-emoji">${t.flag}</span>
        <span class="t-name">${t.name}${t.fav?'<span class="t-hot"> ★</span>':''}</span>
        ${rank?`<span class="t-rank">${rank}</span>`:''}
        <span class="check">${sel?'✓':''}</span>
      </button>`;
    });
  });
  el.innerHTML = html;
  updateCount(type);
}

function toggleTeam(type, name) {
  const s = state[type].selected;
  const max = MAX_SEL[type];
  if (s.has(name)) { s.delete(name); }
  else {
    if (s.size >= max) {
      if (max===1) {
        s.clear();
      } else {
        showToast(`已选满 ${max} 支球队！请先取消其他球队的选择。`, '⚠️');
        return;
      }
    }
    s.add(name);
  }
  renderTeamsList(type);
  updateSubmitBtn(type);
  updatePayout(type);
}

function updateCount(type) {
  const max = MAX_SEL[type];
  const count = state[type].selected.size;
  const el = document.getElementById(type==='sf'?'sfCount':'chCount');
  el.textContent = `已选 ${count} / ${max} 支球队`;
  el.style.color = count===max ? 'var(--gold-light)' : 'var(--muted)';

  // 控制清空按钮显示
  const clearEl = document.getElementById(type==='sf'?'sfClear':'chClear');
  if (count > 0) {
    clearEl.style.display = 'inline';
  } else {
    clearEl.style.display = 'none';
  }
}

// ── CLEAR SELECTED ─────────────────────────────────────
function clearSelected(type) {
  state[type].selected.clear();
  renderTeamsList(type);
  updateSubmitBtn(type);
  updatePayout(type);
  showToast(`已清空${type === 'sf' ? '四强' : '冠军'}的已选球队`);
}

// ── AMOUNT ─────────────────────────────────────────────
function setAmount(type, val, el) {
  document.getElementById(type==='sf'?'sfAmount':'chAmount').value = val;
  state[type].amount = val;
  document.querySelectorAll(`#${type==='sf'?'sfChips':'chChips'} .amount-chip`).forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  updatePayout(type);
  updateSubmitBtn(type);
}

function updatePayout(type) {
  const inputEl = document.getElementById(type==='sf'?'sfAmount':'chAmount');
  let rawVal = inputEl.value;

  // 正则过滤，只允许正整数
  rawVal = rawVal.replace(/\D/g, '');
  if (rawVal !== '') {
    const num = parseInt(rawVal, 10);
    if (num < 1) {
      inputEl.value = '';
      state[type].amount = null;
    } else {
      inputEl.value = num;
      state[type].amount = num;
    }
  } else {
    state[type].amount = null;
  }

  const amount = state[type].amount;
  const odds = ODDS[type];
  if (amount>0) {
    const profit = amount*(odds-1);
    document.getElementById(type==='sf'?'sfPayout':'chPayout').innerHTML =
      `猜中可获赔付 <strong>¥${(amount*odds).toLocaleString()}</strong>（本金 ¥${amount} + 盈利 <strong style="color:#5dd48c">+¥${profit.toLocaleString()}</strong>）`;
  } else {
    document.getElementById(type==='sf'?'sfPayout':'chPayout').textContent='';
  }
  updateSubmitBtn(type);
}

function updateSubmitBtn(type) {
  document.getElementById(type==='sf'?'sfSubmit':'chSubmit').disabled =
    !(state[type].selected.size===MAX_SEL[type] && state[type].amount>0);
}

// 监视失焦事件以自动纠正格式
document.addEventListener('focusout', e=>{
  if(e.target.id==='sfAmount') updatePayout('sf');
  if(e.target.id==='chAmount') updatePayout('ch');
});

// ── SUBMIT ─────────────────────────────────────────────
async function submitBet(type) {
  const nameId = type==='sf'?'sfName':'chName';
  const name = document.getElementById(nameId).value.trim();
  if (!name) { document.getElementById(nameId).focus(); return; }

  const odds = ODDS[type];
  const amount = state[type].amount;
  const teams = [...state[type].selected];
  const payout = amount*odds;
  const profit = amount*(odds-1);

  const bet = {id:state.nextId++, type, name, teams, amount, payout, profit, paid:false, time:new Date()};
  
  // 先乐观更新前端 UI，提供流畅体验
  state.bets.unshift(bet);
  renderLedger();

  // 后台向后端发送同步
  const success = await syncToDb({ action: 'insert', bet });
  if (!success && useRemoteApi) {
    // 若同步失败且我们在 API 模式下，回滚该条本地数据以保持一致
    const idx = state.bets.findIndex(b => b.id === bet.id);
    if (idx !== -1) state.bets.splice(idx, 1);
    renderLedger();
    showToast('❌ 投注保存失败，请稍后重试', '❌');
    return;
  }

  // 生成分享文本
  lastSubmittedBetShareText = generateShareText(bet);

  document.getElementById('modalDetail').innerHTML = `
    <div>👤 下注人：<strong>${name}</strong></div>
    <div>${type==='sf'?'🏟️ 选择球队':'👑 冠军预测'}：<strong>${teams.join(' · ')}</strong></div>
    <div>📜 获奖条件：${type==='sf'?'选4队中至少 <strong>3队进四强</strong> 即中奖':'该队 <strong>夺得冠军</strong> 即中奖'}</div>
    <div>💰 投注金额：<strong>¥${amount}</strong></div>
    <div>🏆 若猜中赔付：<strong>¥${payout.toLocaleString()}</strong>（赔率 1:${odds}，盈利 +¥${profit.toLocaleString()}）</div>
    <div style="margin-top:6px;padding:6px 8px;background:rgba(224,123,57,.1);border-radius:6px;font-size:11px;color:var(--unpaid-color)">⏳ 付款状态：待确认收款 (复制下方注单发给庄家对账)</div>
  `;
  document.getElementById('modal').classList.add('open');

  // reset
  state[type].selected.clear();
  state[type].amount = null;
  document.getElementById(nameId).value='';
  document.getElementById(type==='sf'?'sfAmount':'chAmount').value='';
  document.querySelectorAll(`#${type==='sf'?'sfChips':'chChips'} .amount-chip`).forEach(c=>c.classList.remove('active'));
  document.getElementById(type==='sf'?'sfPayout':'chPayout').textContent='';
  renderTeamsList(type);
  updateSubmitBtn(type);
}

// ── SHARE TEXT GENERATOR ───────────────────────────────
function generateShareText(bet) {
  const timeDate = bet.time instanceof Date ? bet.time : new Date(bet.time);
  const timeStr = `${timeDate.getFullYear()}-${String(timeDate.getMonth()+1).padStart(2,'0')}-${String(timeDate.getDate()).padStart(2,'0')} ${String(timeDate.getHours()).padStart(2,'0')}:${String(timeDate.getMinutes()).padStart(2,'0')}`;
  const payload = `${bet.name}|${bet.type}|${bet.teams.join(',')}|${bet.amount}|${bet.id}`;
  const checksum = btoa(unescape(encodeURIComponent(payload))).substring(0, 8);

  return `【2026世界杯竞猜单】
👤 下注人：${bet.name}
🎫 竞猜盘：${bet.type==='sf'?'四强竞猜 (选4中3即赢)':'冠军竞猜 (猜中夺冠即赢)'}
⚽ 预测球队：${bet.teams.join(' · ')}
💰 投注金额：¥${bet.amount}
🏆 若中赔付：¥${bet.payout}
🕒 下注时间：${timeStr}
🔑 校验单号：#WC26-${bet.type.toUpperCase()}-${bet.id}-${checksum}

------------ 庄家导入密文 (请勿修改) ------------
${JSON.stringify({
  id: bet.id,
  type: bet.type,
  name: bet.name,
  teams: bet.teams,
  amount: bet.amount,
  payout: bet.payout,
  profit: bet.profit,
  paid: bet.paid,
  time: timeDate.getTime(),
  chk: checksum
})}
----------------------------------------------`;
}

function copyShareText() {
  if (!lastSubmittedBetShareText) return;
  navigator.clipboard.writeText(lastSubmittedBetShareText).then(() => {
    showToast('📋 注单分享文本已复制！快去发送给庄家付款吧~', '✅');
  }).catch(err => {
    // 降级使用 textarea
    const ta = document.createElement('textarea');
    ta.value = lastSubmittedBetShareText;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('📋 注单分享文本已复制！快去发送给庄家付款吧~', '✅');
    } catch(e) {
      showToast('❌ 自动复制失败，请截图或手动复制。');
    }
    document.body.removeChild(ta);
  });
}

// ── ADMIN ──────────────────────────────────────────────
function openAdminModal() {
  document.getElementById('adminPwd').value='';
  document.getElementById('adminErr').textContent='';
  document.getElementById('adminModal').classList.add('open');
  setTimeout(()=>document.getElementById('adminPwd').focus(),300);
}

function checkAdmin() {
  const pwd = document.getElementById('adminPwd').value;
  if (pwd === ADMIN_PASSWORD) {
    state.adminUnlocked = true;
    closeModal('adminModal');
    document.getElementById('adminBar').style.display='flex';
    document.getElementById('adminModeTag').style.display='inline-flex';
    document.getElementById('adminBtn').textContent='✅ 管理员已登录';
    document.getElementById('adminBtn').style.color='var(--paid-color)';
    renderLedger();
  } else {
    document.getElementById('adminErr').textContent='❌ 密码错误，请重试';
    document.getElementById('adminPwd').value='';
    document.getElementById('adminPwd').focus();
  }
}

function lockAdmin() {
  state.adminUnlocked = false;
  document.getElementById('adminBar').style.display='none';
  document.getElementById('adminModeTag').style.display='none';
  document.getElementById('adminBtn').textContent='🔐 管理员登录';
  document.getElementById('adminBtn').style.color='';
  renderLedger();
}

async function togglePaid(id) {
  if (!state.adminUnlocked) return;
  const bet = state.bets.find(b=>b.id===id);
  if (bet) {
    const nextPaidState = !bet.paid;
    // 乐观更新
    bet.paid = nextPaidState;
    renderLedger();

    // 后台同步
    const success = await syncToDb({ action: 'update_paid', id, paid: nextPaidState });
    if (!success && useRemoteApi) {
      bet.paid = !nextPaidState; // 回滚
      renderLedger();
    }
  }
}

async function markAllPaid() {
  // 备份
  const backup = state.bets.map(b => b.paid);
  state.bets.forEach(b=>b.paid=true);
  renderLedger();

  const success = await syncToDb({ action: 'update_all_paid', paid: true });
  if (success) {
    showToast('✅ 已将当前所有注单标记为已付款！');
  } else if (useRemoteApi) {
    state.bets.forEach((b, idx) => b.paid = backup[idx]);
    renderLedger();
  }
}

async function markAllUnpaid() {
  const backup = state.bets.map(b => b.paid);
  state.bets.forEach(b=>b.paid=false);
  renderLedger();

  const success = await syncToDb({ action: 'update_all_paid', paid: false });
  if (success) {
    showToast('⭕ 已重置所有注单为未付款！');
  } else if (useRemoteApi) {
    state.bets.forEach((b, idx) => b.paid = backup[idx]);
    renderLedger();
  }
}

// ── IMPORT & EXPORT ────────────────────────────────────
function openImportModal() {
  document.getElementById('importData').value = '';
  document.getElementById('importErr').textContent = '';
  document.getElementById('importModal').classList.add('open');
  setTimeout(() => document.getElementById('importData').focus(), 300);
}

async function submitImport() {
  const raw = document.getElementById('importData').value.trim();
  if (!raw) return;

  try {
    let betObj = null;
    let importList = [];

    if (raw.startsWith('{') && raw.endsWith('}')) {
      betObj = JSON.parse(raw);
    } 
    else if (raw.startsWith('[') && raw.endsWith(']')) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        importList = list;
      }
    }
    else {
      const match = raw.match(/------------ 庄家导入密文 \(请勿修改\) ------------\s*(\{[\s\S]*?\})\s*----------------------------------------------/);
      if (match && match[1]) {
        betObj = JSON.parse(match[1]);
      }
    }

    if (!importList.length && betObj) {
      importList = [betObj];
    }

    if (!importList.length) {
      throw new Error('无效的注单格式');
    }

    const newBetsToInsert = [];
    const duplicatedNames = [];

    importList.forEach(item => {
      const bet = {
        id: state.nextId++,
        type: item.type,
        name: item.name,
        teams: item.teams,
        amount: Number(item.amount),
        payout: Number(item.payout),
        profit: Number(item.profit),
        paid: item.paid || false,
        time: item.time ? new Date(item.time) : new Date()
      };

      const isDup = state.bets.some(b => b.name === bet.name && b.type === bet.type && JSON.stringify(b.teams) === JSON.stringify(bet.teams) && b.amount === bet.amount);
      if (isDup) {
        duplicatedNames.push(bet.name);
      } else {
        newBetsToInsert.push(bet);
      }
    });

    if (duplicatedNames.length > 0 && newBetsToInsert.length === 0) {
      document.getElementById('importErr').textContent = `⚠️ 注单已存在，请勿重复导入！(${duplicatedNames.join(', ')})`;
      return;
    }

    if (newBetsToInsert.length > 0) {
      // 乐观更新
      newBetsToInsert.forEach(b => state.bets.unshift(b));
      renderLedger();
      closeModal('importModal');

      const success = await syncToDb({ action: 'batch_insert', bets: newBetsToInsert });
      if (success) {
        showToast(`📥 成功导入并汇总 ${newBetsToInsert.length} 笔投注记录！`, '✅');
      } else if (useRemoteApi) {
        // 回滚
        newBetsToInsert.forEach(b => {
          const idx = state.bets.findIndex(sb => sb.id === b.id);
          if (idx !== -1) state.bets.splice(idx, 1);
        });
        renderLedger();
        showToast('❌ 同步云端数据库失败！', '❌');
      }
    }

  } catch (err) {
    document.getElementById('importErr').textContent = '❌ 解析失败！请确保复制并粘贴了包含密文的完整分享消息或 JSON 数组。';
  }
}

function openExportModal() {
  if (!state.bets.length) {
    showToast('⚠️ 当前无投注记录，无法导出！', '⚠️');
    return;
  }
  const exportList = state.bets.map(b => ({
    ...b,
    time: b.time instanceof Date ? b.time.getTime() : new Date(b.time).getTime()
  }));
  document.getElementById('exportData').value = JSON.stringify(exportList, null, 2);
  document.getElementById('exportModal').classList.add('open');
}

function copyExportData() {
  const txt = document.getElementById('exportData').value;
  navigator.clipboard.writeText(txt).then(() => {
    showToast('📋 数据已成功复制到剪贴板！', '✅');
    closeModal('exportModal');
  }).catch(err => {
    showToast('❌ 复制失败，请手动全选复制。');
  });
}

// ── LEDGER ─────────────────────────────────────────────
async function deleteBet(id) {
  const i = state.bets.findIndex(b=>b.id===id);
  if (i!==-1) {
    const backupBet = { ...state.bets[i] };
    const name = state.bets[i].name;

    // 乐观删除
    state.bets.splice(i,1);
    renderLedger();

    const success = await syncToDb({ action: 'delete', id });
    if (success) {
      showToast(`🗑️ 已成功撤销 ${name} 的注单`);
    } else if (useRemoteApi) {
      // 回滚
      state.bets.splice(i, 0, backupBet);
      renderLedger();
    }
  }
}

function renderLedger() {
  const totalAmount  = state.bets.reduce((a,b)=>a+b.amount,0);
  const totalPayout  = state.bets.reduce((a,b)=>a+b.payout,0);
  const paidAmount   = state.bets.filter(b=>b.paid).reduce((a,b)=>a+b.amount,0);
  const unpaidAmount = totalAmount - paidAmount;

  document.getElementById('statTotal').textContent = state.bets.length;
  document.getElementById('statAmount').textContent = `¥${totalAmount.toLocaleString()}`;
  document.getElementById('statPayout').textContent = `¥${totalPayout.toLocaleString()}`;
  document.getElementById('statPaid').textContent   = `¥${paidAmount.toLocaleString()}`;
  document.getElementById('statUnpaid').textContent = `¥${unpaidAmount.toLocaleString()}`;

  const body = document.getElementById('ledgerBody');
  if (!state.bets.length) {
    body.innerHTML='<div class="ledger-empty">暂无投注记录，快来下注吧 ⚽</div>';
    return;
  }

  const adminCols = state.adminUnlocked
    ? '<th>付款状态</th><th>操作</th>'
    : '<th>付款状态</th>';

  body.innerHTML = `<table class="ledger-table">
    <thead>
      <tr>
        <th>#</th><th>姓名</th><th>类型</th><th>竞猜内容</th>
        <th>获奖条件</th><th>金额</th><th>若中赔付</th><th>下注时间</th>
        ${adminCols}
      </tr>
    </thead>
    <tbody>
      ${state.bets.map(b => {
        const paidBadge = b.paid
          ? `<span class="status-badge paid" onclick="${state.adminUnlocked?`togglePaid(${b.id})`:''}" style="${state.adminUnlocked?'':'cursor:default'}">✅ 已付款</span>`
          : `<span class="status-badge unpaid" onclick="${state.adminUnlocked?`togglePaid(${b.id})`:''}" style="${state.adminUnlocked?'':'cursor:default'}">⏳ 未付款</span>`;
        const delBtn = state.adminUnlocked
          ? `<td><button class="del-btn" onclick="deleteBet(${b.id})">撤单</button></td>`
          : '';
        const timeDate = b.time instanceof Date ? b.time : new Date(b.time);
        return `<tr>
          <td style="color:var(--muted)">${b.id}</td>
          <td><strong>${b.name}</strong></td>
          <td><span class="type-badge ${b.type==='sf'?'badge-sf':'badge-ch'}">${b.type==='sf'?'四强':'冠军'}</span></td>
          <td style="font-size:12px;color:rgba(245,240,232,.85)">${b.teams.join(' · ')}</td>
          <td style="font-size:11px;color:var(--muted)">${b.type==='sf'?'3队进四强':'夺冠'}</td>
          <td>¥${b.amount}</td>
          <td class="payout-amount">¥${b.payout.toLocaleString()}</td>
          <td style="font-size:11px;color:var(--muted)">${fmt(timeDate)}</td>
          <td>${paidBadge}</td>
          ${delBtn}
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

function fmt(d) {
  const dateObj = d instanceof Date ? d : new Date(d);
  return `${String(dateObj.getHours()).padStart(2,'0')}:${String(dateObj.getMinutes()).padStart(2,'0')}:${String(dateObj.getSeconds()).padStart(2,'0')}`;
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

init();
