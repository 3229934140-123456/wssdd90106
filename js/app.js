// 顶部导航渲染
function renderTopNav(activePage) {
  const stats = AlertAPI.getStats();
  const pendingCount = stats.pending + stats.verifying;
  const shift = getCurrentShift();
  
  const navHTML = `
    <nav class="top-nav">
      <div class="nav-brand">
        <div class="nav-brand-icon">🛡️</div>
        <span>舆情告警工作台</span>
      </div>
      <div class="nav-tabs">
        <a href="rules.html" class="nav-tab ${activePage === 'rules' ? 'active' : ''}">
          <span>📋</span> 敏感词规则
        </a>
        <a href="alerts.html" class="nav-tab ${activePage === 'alerts' ? 'active' : ''}">
          <span>🚨</span> 实时告警
          ${pendingCount > 0 ? `<span class="nav-tab-badge">${pendingCount}</span>` : ''}
        </a>
        <a href="handover.html" class="nav-tab ${activePage === 'handover' ? 'active' : ''}">
          <span>🔄</span> 交接班
        </a>
      </div>
      <div class="nav-right">
        <div class="shift-info">
          <span class="shift-label">当前班次</span>
          <span class="shift-value">${shift.name} · ${shift.operator}</span>
        </div>
        <div class="clock" id="globalClock">--:--:--</div>
        <div class="user-avatar" title="${shift.operator}">${shift.operator.charAt(0)}</div>
      </div>
    </nav>
  `;
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  startClock();
}

// 时钟
function startClock() {
  const clockEl = document.getElementById('globalClock');
  if (!clockEl) return;
  
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

// 模态框
function showModal(title, bodyHTML, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" id="modalCloseBtn">✕</button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-footer">
        <button class="btn" id="modalCancelBtn">取消</button>
        <button class="btn btn-primary" id="modalConfirmBtn">确认</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKeyDown);
  }
  
  function onKeyDown(e) {
    if (e.key === 'Escape') close();
  }
  document.addEventListener('keydown', onKeyDown);
  
  overlay.querySelector('#modalCloseBtn').onclick = close;
  overlay.querySelector('#modalCancelBtn').onclick = close;
  overlay.querySelector('#modalConfirmBtn').onclick = () => {
    if (onConfirm) {
      const result = onConfirm(overlay);
      if (result !== false) close();
    } else {
      close();
    }
  };
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };
  
  return overlay;
}

// Toast 通知
function showNotification(title, text, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerHTML = `
    <div class="notification-title">${title}</div>
    <div class="notification-text">${text}</div>
  `;
  if (type === 'success') {
    toast.style.borderColor = 'var(--accent-green)';
    toast.style.borderLeftColor = 'var(--accent-green)';
    toast.querySelector('.notification-title').style.color = 'var(--accent-green)';
  } else if (type === 'warning') {
    toast.style.borderColor = 'var(--accent-yellow)';
    toast.style.borderLeftColor = 'var(--accent-yellow)';
    toast.querySelector('.notification-title').style.color = 'var(--accent-yellow)';
  }
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 模拟新告警推送
let simulatedAlertInterval = null;
function startSimulatedAlerts(onNewAlert) {
  if (simulatedAlertInterval) return;
  
  const sampleContents = [
    { category: 'stability', hitWord: '非法集会', word: '非法集会', level: 'red', platform: 'weibo' },
    { category: 'rumor', hitWord: '假消息', word: '假消息', level: 'yellow', platform: 'zhihu' },
    { category: 'disaster', hitWord: '山体滑坡', word: '山体滑坡', level: 'orange', platform: 'toutiao' },
    { category: 'politics', hitWord: '政府腐败', word: '政府腐败', level: 'red', platform: 'wechat' },
    { category: 'other', hitWord: '跳楼自杀', word: '跳楼自杀', level: 'orange', platform: 'bilibili' },
    { category: 'stability', hitWord: '罢工游行', word: '罢工游行', level: 'red', platform: 'tieba' },
    { category: 'vulgar', hitWord: '低俗色情', word: '低俗色情', level: 'blue', platform: 'douyin' },
    { category: 'rumor', hitWord: '内幕消息', word: '内幕消息', level: 'yellow', platform: 'kuaishou' }
  ];
  
  const authors = ['热心市民', '网络观察员', '匿名投稿', '本地通', '时事评论员', '普通网友'];
  
  simulatedAlertInterval = setInterval(() => {
    if (Math.random() > 0.5) return;
    
    const sample = sampleContents[Math.floor(Math.random() * sampleContents.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const platforms = Object.keys(PLATFORMS);
    const platform = sample.platform || platforms[Math.floor(Math.random() * platforms.length)];
    
    const newAlert = AlertAPI.add({
      platform,
      category: sample.category,
      hitWord: sample.hitWord,
      matchType: Math.random() > 0.5 ? '精确命中' : '近似命中',
      author,
      authorFans: Math.floor(Math.random() * 100000),
      content: `最新消息：${sample.word}相关内容正在网络上传播，请相关部门关注。用户发布内容中包含敏感词汇"${sample.word}"，请值班员及时研判处置。`,
      context: `该内容发布后短时间内获得多人转发，正在监测传播路径。`,
      heat: Math.floor(30 + Math.random() * 70),
      repost: Math.floor(Math.random() * 2000),
      comment: Math.floor(Math.random() * 1000),
      like: Math.floor(Math.random() * 5000),
      deadline: Math.floor(15 + Math.random() * 120),
      level: sample.level
    });

    if (AlertAPI.getAll().length > 100) {
      const oldest = AlertAPI.getAll().slice(-1)[0];
      if (oldest) AlertAPI.remove(oldest.id);
    }
    
    if (onNewAlert) onNewAlert(newAlert);
  }, 15000);
}

// 通用统计卡片渲染
function renderStatCard(options) {
  const { icon, title, value, trend, color } = options;
  const trendClass = trend?.startsWith('+') ? 'up' : (trend?.startsWith('-') ? 'down' : '');
  return `
    <div class="stat-card ${color}">
      <div class="stat-card-header">
        <div class="stat-card-title">${title}</div>
        <div class="stat-card-icon">${icon}</div>
      </div>
      <div class="stat-card-value">${value}</div>
      ${trend ? `<div class="stat-card-trend ${trendClass}">${trend}</div>` : ''}
    </div>
  `;
}

// 导出到全局
window.renderTopNav = renderTopNav;
window.showModal = showModal;
window.showNotification = showNotification;
window.startSimulatedAlerts = startSimulatedAlerts;
window.renderStatCard = renderStatCard;
