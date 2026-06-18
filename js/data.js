// ==========================================
// 基础配置常量
// ==========================================
const WORD_CATEGORIES = {
  politics: { name: '涉政', color: 'red', icon: '🚨', level: '一级' },
  stability: { name: '涉稳', color: 'orange', icon: '⚠️', level: '二级' },
  disaster: { name: '灾害', color: 'yellow', icon: '🌊', level: '二级' },
  rumor: { name: '谣言', color: 'purple', icon: '📢', level: '三级' },
  vulgar: { name: '低俗', color: 'blue', icon: '🚫', level: '三级' },
  other: { name: '其他', color: 'gray', icon: '📋', level: '四级' }
};

const PLATFORMS = {
  weibo: { name: '新浪微博', icon: '🟥', color: 'red' },
  wechat: { name: '微信公众号', icon: '🟩', color: 'green' },
  toutiao: { name: '今日头条', icon: '🟦', color: 'blue' },
  douyin: { name: '抖音', icon: '🎵', color: 'cyan' },
  kuaishou: { name: '快手', icon: '⚡', color: 'orange' },
  bilibili: { name: 'B站', icon: '📺', color: 'pink' },
  zhihu: { name: '知乎', icon: '💡', color: 'blue' },
  tieba: { name: '百度贴吧', icon: '🏠', color: 'blue' },
  tianya: { name: '天涯论坛', icon: '🌍', color: 'gray' },
  xinhua: { name: '新华网评论', icon: '📰', color: 'red' },
  people: { name: '人民网留言', icon: '📝', color: 'red' }
};

const STORAGE_KEYS = {
  WORDS: 'yq_sensitive_words',
  ALERTS: 'yq_alerts',
  LOGS: 'yq_operation_logs',
  HANDOVER_NOTES: 'yq_handover_notes',
  READ_IDS: 'yq_read_alert_ids',
  LAST_RESET: 'yq_last_reset_date'
};

// ==========================================
// localStorage 持久化层
// ==========================================
const Store = {
  get(key, defaultValue) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('读取存储失败:', key, e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('写入存储失败:', key, e);
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// ==========================================
// 每日重置检测（新的一天重置告警等模拟数据）
// ==========================================
function checkDailyReset() {
  const today = new Date().toDateString();
  const lastReset = Store.get(STORAGE_KEYS.LAST_RESET, '');
  if (lastReset !== today) {
    Store.set(STORAGE_KEYS.LAST_RESET, today);
    return true;
  }
  return false;
}

// ==========================================
// 初始基准数据
// ==========================================
function getDefaultWords() {
  return [
    { id: 1, word: '非法集会', category: 'stability', matchType: 'exact', level: '二级', enabled: true, hitCount: 128, creator: '张伟', createdAt: '2026-06-15 09:30', remark: '群体性事件预警' },
    { id: 2, word: '上访请愿', category: 'stability', matchType: 'exact', level: '二级', enabled: true, hitCount: 87, creator: '张伟', createdAt: '2026-06-15 09:32', remark: '信访类敏感词' },
    { id: 3, word: '打砸抢烧', category: 'stability', matchType: 'exact', level: '一级', enabled: true, hitCount: 42, creator: '李娜', createdAt: '2026-06-14 14:20', remark: '暴力事件' },
    { id: 4, word: '地震', category: 'disaster', matchType: 'fuzzy', level: '二级', enabled: true, hitCount: 256, creator: '李娜', createdAt: '2026-06-10 10:15', remark: '自然灾害类' },
    { id: 5, word: '洪灾', category: 'disaster', matchType: 'fuzzy', level: '二级', enabled: true, hitCount: 134, creator: '李娜', createdAt: '2026-06-10 10:16', remark: '自然灾害类' },
    { id: 6, word: '山体滑坡', category: 'disaster', matchType: 'exact', level: '二级', enabled: true, hitCount: 58, creator: '王强', createdAt: '2026-06-12 16:45', remark: '地质灾害' },
    { id: 7, word: '政府腐败', category: 'politics', matchType: 'fuzzy', level: '一级', enabled: true, hitCount: 312, creator: '张伟', createdAt: '2026-06-08 11:00', remark: '涉政负面' },
    { id: 8, word: '领导作风', category: 'politics', matchType: 'fuzzy', level: '二级', enabled: true, hitCount: 189, creator: '张伟', createdAt: '2026-06-08 11:02', remark: '干部作风类' },
    { id: 9, word: '辟谣', category: 'rumor', matchType: 'exact', level: '三级', enabled: false, hitCount: 0, creator: '王强', createdAt: '2026-06-16 08:30', remark: '待审核' },
    { id: 10, word: '假消息', category: 'rumor', matchType: 'fuzzy', level: '三级', enabled: true, hitCount: 201, creator: '王强', createdAt: '2026-06-11 13:20', remark: '谣言类' },
    { id: 11, word: '内幕消息', category: 'rumor', matchType: 'exact', level: '三级', enabled: true, hitCount: 76, creator: '王强', createdAt: '2026-06-11 13:22', remark: '不实信息' },
    { id: 12, word: '低俗色情', category: 'vulgar', matchType: 'exact', level: '三级', enabled: true, hitCount: 445, creator: '李娜', createdAt: '2026-06-09 15:00', remark: '不良内容' },
    { id: 13, word: '暴力血腥', category: 'vulgar', matchType: 'exact', level: '三级', enabled: true, hitCount: 234, creator: '李娜', createdAt: '2026-06-09 15:02', remark: '不良内容' },
    { id: 14, word: '跳楼自杀', category: 'other', matchType: 'fuzzy', level: '二级', enabled: true, hitCount: 67, creator: '张伟', createdAt: '2026-06-13 09:45', remark: '心理危机干预' },
    { id: 15, word: '罢工游行', category: 'stability', matchType: 'exact', level: '一级', enabled: true, hitCount: 23, creator: '张伟', createdAt: '2026-06-15 09:35', remark: '群体性事件' }
  ];
}

function getDefaultAlerts() {
  const now = Date.now();
  return [
    {
      id: 1,
      platform: 'weibo',
      category: 'politics',
      hitWord: '政府腐败',
      matchType: '近似命中',
      author: '围观群众甲',
      authorAvatar: '群',
      authorFans: 15600,
      content: '某地政府腐败问题严重，当地群众多次举报无果，希望上级部门能够彻查此事，还老百姓一个公道。#民生关注#',
      context: '原帖发布于15分钟前，已有234条评论，部分网友跟帖表示支持调查，也有人持观望态度。',
      heat: 87,
      repost: 1234,
      comment: 456,
      like: 892,
      deadline: 30,
      createdAt: new Date(now - 8 * 60000).toISOString(),
      status: 'pending',
      level: 'red',
      url: 'https://weibo.com/example/1'
    },
    {
      id: 2,
      platform: 'douyin',
      category: 'stability',
      hitWord: '非法集会',
      matchType: '精确命中',
      author: '街头拍客',
      authorAvatar: '拍',
      authorFans: 89200,
      content: '现场实拍！有人在市中心广场进行非法集会活动，现场人头攒动，情况看起来有些紧张，希望有关部门尽快处理。',
      context: '视频已获得12.3万次观看，评论区有人在询问具体位置，也有账号在煽动情绪。',
      heat: 95,
      repost: 3420,
      comment: 1820,
      like: 6780,
      deadline: 15,
      createdAt: new Date(now - 3 * 60000).toISOString(),
      status: 'pending',
      level: 'red',
      url: 'https://douyin.com/example/2'
    },
    {
      id: 3,
      platform: 'toutiao',
      category: 'disaster',
      hitWord: '地震',
      matchType: '近似命中',
      author: '本地资讯博主',
      authorAvatar: '资',
      authorFans: 45000,
      content: '凌晨2点30分左右，我市北部山区发生3.2级地震，震感明显，不少居民被震醒。目前暂无人员伤亡报告，请大家不信谣不传谣。',
      context: '相关文章在2小时内阅读量突破10万+，评论区有群众询问是否会有余震。',
      heat: 72,
      repost: 890,
      comment: 567,
      like: 2340,
      deadline: 60,
      createdAt: new Date(now - 25 * 60000).toISOString(),
      status: 'verifying',
      level: 'orange',
      url: 'https://toutiao.com/example/3'
    },
    {
      id: 4,
      platform: 'zhihu',
      category: 'rumor',
      hitWord: '假消息',
      matchType: '近似命中',
      author: '匿名用户',
      authorAvatar: '匿',
      authorFans: 230,
      content: '听说某医院有内幕消息，最近的疫情数据不真实，实际情况比报道的严重得多，大家小心点吧。',
      context: '该回答发布后被多名用户举报，目前已有社区管理员介入标记为"可能存在事实错误"。',
      heat: 45,
      repost: 120,
      comment: 234,
      like: 89,
      deadline: 120,
      createdAt: new Date(now - 45 * 60000).toISOString(),
      status: 'pending',
      level: 'yellow',
      url: 'https://zhihu.com/example/4'
    },
    {
      id: 5,
      platform: 'wechat',
      category: 'politics',
      hitWord: '领导作风',
      matchType: '精确命中',
      author: '时评公众号',
      authorAvatar: '评',
      authorFans: 128000,
      content: '文章《从某地领导作风问题看基层治理》深度剖析了当前干部队伍中存在的形式主义、官僚主义问题，引发广泛讨论。',
      context: '该公众号文章阅读量已达8万+，在看数超过5000，多个工作群中有转发。',
      heat: 68,
      repost: 2340,
      comment: 789,
      like: 4560,
      deadline: 45,
      createdAt: new Date(now - 68 * 60000).toISOString(),
      status: 'reporting',
      level: 'orange',
      url: 'https://mp.weixin.qq.com/example/5'
    },
    {
      id: 6,
      platform: 'bilibili',
      category: 'vulgar',
      hitWord: '低俗色情',
      matchType: '近似命中',
      author: 'UP主某某',
      authorAvatar: 'U',
      authorFans: 234000,
      content: '新视频发布啦，今天带大家看一些有点低俗色情擦边球的内容，保证你们喜欢，三连支持一下呗~',
      context: '视频发布1小时播放量超过5万，评论区有用户举报内容违规。',
      heat: 56,
      repost: 560,
      comment: 1230,
      like: 3450,
      deadline: 90,
      createdAt: new Date(now - 80 * 60000).toISOString(),
      status: 'pending',
      level: 'blue',
      url: 'https://bilibili.com/example/6'
    },
    {
      id: 7,
      platform: 'tieba',
      category: 'stability',
      hitWord: '上访请愿',
      matchType: '精确命中',
      author: '贴吧老用户',
      authorAvatar: '吧',
      authorFans: 3400,
      content: '我们村的拆迁补偿问题一直得不到解决，全村人准备集体去市政府上访请愿，有媒体朋友愿意关注一下吗？',
      context: '该帖已有45页回复，部分吧友在讨论具体时间地点，也有人劝其走正规渠道。',
      heat: 78,
      repost: 340,
      comment: 2340,
      like: 560,
      deadline: 30,
      createdAt: new Date(now - 100 * 60000).toISOString(),
      status: 'reporting',
      level: 'red',
      url: 'https://tieba.baidu.com/example/7'
    },
    {
      id: 8,
      platform: 'kuaishou',
      category: 'disaster',
      hitWord: '洪灾',
      matchType: '近似命中',
      author: '乡村记录者',
      authorAvatar: '乡',
      authorFans: 67000,
      content: '连续暴雨引发洪灾，我们村很多房子都被淹了，庄稼也全毁了，求助！有没有人知道救灾联系方式？',
      context: '视频已被转发至多个本地群，当地应急管理部门已关注到此信息。',
      heat: 82,
      repost: 1560,
      comment: 890,
      like: 5670,
      deadline: 45,
      createdAt: new Date(now - 120 * 60000).toISOString(),
      status: 'verifying',
      level: 'orange',
      url: 'https://kuaishou.com/example/8'
    },
    {
      id: 9,
      platform: 'xinhua',
      category: 'stability',
      hitWord: '打砸抢烧',
      matchType: '精确命中',
      author: '新华网网友',
      authorAvatar: '网',
      authorFans: 560,
      content: '听说昨晚某商场附近发生打砸抢烧事件，是真的吗？有没有现场的朋友出来说说情况？',
      context: '评论区已有官方账号回复辟谣，称系不实信息，已组织警力巡逻。',
      heat: 34,
      repost: 45,
      comment: 123,
      like: 67,
      deadline: 60,
      createdAt: new Date(now - 150 * 60000).toISOString(),
      status: 'false_alarm',
      level: 'yellow',
      url: 'https://xinhuanet.com/example/9'
    },
    {
      id: 10,
      platform: 'people',
      category: 'rumor',
      hitWord: '内幕消息',
      matchType: '精确命中',
      author: '留言板游客',
      authorAvatar: '游',
      authorFans: 0,
      content: '我有内幕消息，下个月要出大事了，你们自己想想最近的政策变化就知道了，不方便多说。',
      context: '该留言已被审核人员标记为疑似谣言内容，等待进一步处理。',
      heat: 28,
      repost: 23,
      comment: 67,
      like: 34,
      deadline: 120,
      createdAt: new Date(now - 180 * 60000).toISOString(),
      status: 'pending',
      level: 'yellow',
      url: 'https://people.com.cn/example/10'
    },
    {
      id: 11,
      platform: 'tianya',
      category: 'other',
      hitWord: '跳楼自杀',
      matchType: '近似命中',
      author: '天涯网友',
      authorAvatar: '涯',
      authorFans: 1200,
      content: '生活压力太大了，每天一睁眼就是房贷车贷，真的撑不下去了，有时候真想一了百了跳楼自杀算了。',
      context: '帖子下有很多网友留言安慰，部分网友询问联系方式想提供帮助。',
      heat: 52,
      repost: 234,
      comment: 567,
      like: 189,
      deadline: 45,
      createdAt: new Date(now - 210 * 60000).toISOString(),
      status: 'verifying',
      level: 'orange',
      url: 'https://tianya.cn/example/11'
    },
    {
      id: 12,
      platform: 'weibo',
      category: 'stability',
      hitWord: '罢工游行',
      matchType: '精确命中',
      author: '工厂内部人士',
      authorAvatar: '厂',
      authorFans: 780,
      content: '开发区某电子厂工人因工资问题正在罢工游行，现场有警察维持秩序，不知道最后会怎么处理。',
      context: '该微博已被多次举报，部分图片显示为旧图拼接，正在核实真实性。',
      heat: 88,
      repost: 2890,
      comment: 1560,
      like: 980,
      deadline: 20,
      createdAt: new Date(now - 240 * 60000).toISOString(),
      status: 'pending',
      level: 'red',
      url: 'https://weibo.com/example/12'
    }
  ];
}

function getDefaultLogs() {
  const now = Date.now();
  const shift = getCurrentShift();
  return [
    { id: 1, alertId: 2, type: 'status', fromStatus: 'pending', toStatus: 'pending', operator: shift.operator, remark: '系统自动检测命中"非法集会"敏感词', createdAt: new Date(now - 3 * 60000).toISOString() },
    { id: 2, alertId: 1, type: 'status', fromStatus: 'pending', toStatus: 'pending', operator: shift.operator, remark: '系统自动检测命中"政府腐败"敏感词', createdAt: new Date(now - 8 * 60000).toISOString() },
    { id: 3, alertId: 7, type: 'status', fromStatus: 'pending', toStatus: 'reporting', operator: '张伟', remark: '涉及群体性上访事件，已上报市委宣传部舆情处', createdAt: new Date(now - 95 * 60000).toISOString() },
    { id: 4, alertId: 5, type: 'status', fromStatus: 'pending', toStatus: 'reporting', operator: '李娜', remark: '涉领导作风问题，按二级响应流程上报', createdAt: new Date(now - 65 * 60000).toISOString() },
    { id: 5, alertId: 9, type: 'status', fromStatus: 'pending', toStatus: 'false_alarm', operator: '张伟', remark: '核实为不实信息，官方已辟谣', createdAt: new Date(now - 140 * 60000).toISOString() },
    { id: 6, alertId: 3, type: 'status', fromStatus: 'pending', toStatus: 'verifying', operator: '李娜', remark: '已联系地震局核实震级与影响范围', createdAt: new Date(now - 22 * 60000).toISOString() },
    { id: 7, alertId: 8, type: 'status', fromStatus: 'pending', toStatus: 'verifying', operator: '张伟', remark: '已转应急管理局，等待救援进展反馈', createdAt: new Date(now - 115 * 60000).toISOString() }
  ];
}

// ==========================================
// 核心数据（带持久化）
// ==========================================
let sensitiveWords = loadWords();
let alerts = loadAlerts();
let operationLogs = loadLogs();

function loadWords() {
  const stored = Store.get(STORAGE_KEYS.WORDS, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  const defaults = getDefaultWords();
  Store.set(STORAGE_KEYS.WORDS, defaults);
  return defaults;
}

function loadAlerts() {
  const stored = Store.get(STORAGE_KEYS.ALERTS, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    // 如果跨天了，则重置为默认数据
    if (checkDailyReset()) {
      const defaults = getDefaultAlerts();
      Store.set(STORAGE_KEYS.ALERTS, defaults);
      Store.set(STORAGE_KEYS.READ_IDS, []);
      Store.set(STORAGE_KEYS.LOGS, getDefaultLogs());
      return defaults;
    }
    return stored;
  }
  const defaults = getDefaultAlerts();
  Store.set(STORAGE_KEYS.ALERTS, defaults);
  return defaults;
}

function loadLogs() {
  const stored = Store.get(STORAGE_KEYS.LOGS, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  const defaults = getDefaultLogs();
  Store.set(STORAGE_KEYS.LOGS, defaults);
  return defaults;
}

function saveWords() {
  Store.set(STORAGE_KEYS.WORDS, sensitiveWords);
}

function saveAlerts() {
  Store.set(STORAGE_KEYS.ALERTS, alerts);
}

function saveLogs() {
  Store.set(STORAGE_KEYS.LOGS, operationLogs);
}

// ==========================================
// 敏感词规则 API
// ==========================================
const WordAPI = {
  getAll() { return sensitiveWords; },
  getById(id) { return sensitiveWords.find(w => w.id === id); },
  getByCategory(category) {
    if (category === 'all') return sensitiveWords;
    return sensitiveWords.filter(w => w.category === category);
  },
  exists(word, excludeId = null) {
    return sensitiveWords.some(w => 
      w.word === word && w.id !== excludeId
    );
  },
  fuzzyExists(word, excludeId = null) {
    return sensitiveWords.filter(w => 
      w.id !== excludeId && (
        w.word.includes(word) || word.includes(w.word)
      )
    );
  },
  add(wordData) {
    const newWord = {
      id: Date.now(),
      word: wordData.word,
      category: wordData.category,
      matchType: wordData.matchType,
      level: wordData.level,
      remark: wordData.remark || '',
      enabled: wordData.enabled !== false,
      hitCount: 0,
      creator: getCurrentShift().operator,
      createdAt: formatNowDateTime()
    };
    sensitiveWords.unshift(newWord);
    saveWords();
    return newWord;
  },
  batchImport(list) {
    const results = { success: 0, skipped: 0, errors: [], words: [] };
    const now = formatNowDateTime();
    const operator = getCurrentShift().operator;
    list.forEach(item => {
      if (!item.word) {
        results.errors.push({ word: item.word, reason: '词为空' });
        results.skipped++;
        return;
      }
      if (this.exists(item.word)) {
        results.skipped++;
        results.errors.push({ word: item.word, reason: '已存在' });
        return;
      }
      const newWord = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        word: item.word,
        category: item.category || 'other',
        matchType: item.matchType || 'exact',
        level: item.level || '三级',
        remark: item.remark || '',
        enabled: item.enabled !== false,
        hitCount: 0,
        creator: operator,
        createdAt: now
      };
      sensitiveWords.unshift(newWord);
      results.words.push(newWord);
      results.success++;
    });
    saveWords();
    return results;
  },
  update(id, updates) {
    const word = this.getById(id);
    if (!word) return null;
    Object.assign(word, updates);
    saveWords();
    return word;
  },
  toggleEnabled(id) {
    const word = this.getById(id);
    if (!word) return null;
    word.enabled = !word.enabled;
    saveWords();
    return word;
  },
  remove(id) {
    const idx = sensitiveWords.findIndex(w => w.id === id);
    if (idx === -1) return false;
    const removed = sensitiveWords.splice(idx, 1);
    saveWords();
    return removed[0];
  },
  getStats() {
    const total = sensitiveWords.length;
    const enabled = sensitiveWords.filter(w => w.enabled).length;
    const totalHits = sensitiveWords.reduce((s, w) => s + w.hitCount, 0);
    const level1 = sensitiveWords.filter(w => w.level === '一级').length;
    const level2 = sensitiveWords.filter(w => w.level === '二级').length;
    const byCategory = {};
    Object.keys(WORD_CATEGORIES).forEach(k => {
      byCategory[k] = sensitiveWords.filter(w => w.category === k).length;
    });
    return { total, enabled, disabled: total - enabled, totalHits, level1, level2, byCategory };
  }
};

// ==========================================
// 告警 API
// ==========================================
const AlertAPI = {
  getAll() { return alerts; },
  getById(id) { return alerts.find(a => a.id === id); },
  getByStatus(status) { return alerts.filter(a => a.status === status); },
  getPending() { return alerts.filter(a => a.status === 'pending'); },
  add(alertData) {
    const newAlert = {
      id: Date.now(),
      platform: alertData.platform,
      category: alertData.category,
      hitWord: alertData.hitWord,
      matchType: alertData.matchType || '精确命中',
      author: alertData.author,
      authorAvatar: alertData.authorAvatar || alertData.author?.charAt(0) || '匿',
      authorFans: alertData.authorFans || 0,
      content: alertData.content,
      context: alertData.context || '',
      heat: alertData.heat || 50,
      repost: alertData.repost || 0,
      comment: alertData.comment || 0,
      like: alertData.like || 0,
      deadline: alertData.deadline || 60,
      createdAt: new Date().toISOString(),
      status: 'pending',
      level: alertData.level || 'yellow',
      url: alertData.url || '#'
    };
    alerts.unshift(newAlert);
    saveAlerts();

    // 自动记录一条操作日志
    LogAPI.add({
      alertId: newAlert.id,
      type: 'detect',
      toStatus: 'pending',
      operator: '系统',
      remark: `命中敏感词"${newAlert.hitWord}"，自动生成告警`
    });

    return newAlert;
  },
  updateStatus(id, status, remark = '') {
    const alert = this.getById(id);
    if (!alert) return null;
    const oldStatus = alert.status;
    alert.status = status;
    saveAlerts();

    // 自动记录操作日志
    LogAPI.add({
      alertId: id,
      type: 'status',
      fromStatus: oldStatus,
      toStatus: status,
      operator: getCurrentShift().operator,
      remark: remark || `状态变更为"${getStatusText(status)}"`
    });

    return alert;
  },
  addRemark(id, remark) {
    const alert = this.getById(id);
    if (!alert) return null;
    LogAPI.add({
      alertId: id,
      type: 'remark',
      operator: getCurrentShift().operator,
      remark: `添加备注：${remark}`
    });
    return alert;
  },
  report(id, department) {
    const alert = this.getById(id);
    if (!alert) return null;
    const oldStatus = alert.status;
    alert.status = 'reporting';
    saveAlerts();
    LogAPI.add({
      alertId: id,
      type: 'report',
      fromStatus: oldStatus,
      toStatus: 'reporting',
      operator: getCurrentShift().operator,
      remark: `上报至 ${department}`
    });
    return alert;
  },
  getStats() {
    const total = alerts.length;
    const pending = alerts.filter(a => a.status === 'pending').length;
    const verifying = alerts.filter(a => a.status === 'verifying').length;
    const reporting = alerts.filter(a => a.status === 'reporting').length;
    const falseAlarm = alerts.filter(a => a.status === 'false_alarm').length;
    const done = alerts.filter(a => a.status === 'done').length;
    const highLevel = alerts.filter(a => a.level === 'red').length;
    const falseAlarmRate = total > 0 ? ((falseAlarm / total) * 100).toFixed(1) + '%' : '0%';
    return { total, pending, verifying, reporting, falseAlarm, done, highLevel, falseAlarmRate };
  },
  getUnprocessed() {
    return alerts.filter(a => a.status !== 'done' && a.status !== 'false_alarm')
      .sort((a, b) => {
        const levelOrder = { red: 0, orange: 1, yellow: 2, blue: 3 };
        if (levelOrder[a.level] !== levelOrder[b.level]) return levelOrder[a.level] - levelOrder[b.level];
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  },
  remove(id) {
    const idx = alerts.findIndex(a => a.id === id);
    if (idx > -1) {
      alerts.splice(idx, 1);
      saveAlerts();
      return true;
    }
    return false;
  },
  getTopWords(limit = 20) {
    const wordCount = {};
    alerts.forEach(a => {
      if (!wordCount[a.hitWord]) {
        wordCount[a.hitWord] = { word: a.hitWord, count: 0, category: a.category };
      }
      wordCount[a.hitWord].count++;
    });
    return Object.values(wordCount).sort((a, b) => b.count - a.count).slice(0, limit);
  },
  getPlatformStats() {
    const stats = {};
    alerts.forEach(a => {
      if (!stats[a.platform]) stats[a.platform] = { platform: a.platform, count: 0 };
      stats[a.platform].count++;
    });
    return Object.values(stats).sort((a, b) => b.count - a.count);
  },
  getCategoryStats() {
    const stats = {};
    alerts.forEach(a => {
      if (!stats[a.category]) stats[a.category] = { category: a.category, count: 0 };
      stats[a.category].count++;
    });
    return Object.entries(WORD_CATEGORIES).map(([key, info]) => ({
      category: key,
      name: info.name,
      color: info.color,
      icon: info.icon,
      count: stats[key]?.count || 0
    }));
  }
};

// ==========================================
// 操作日志 API
// ==========================================
const LogAPI = {
  getAll() { return operationLogs; },
  getByAlertId(alertId) {
    return operationLogs
      .filter(l => l.alertId === alertId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getByOperator(operator) {
    return operationLogs.filter(l => l.operator === operator);
  },
  getByType(type) {
    return operationLogs.filter(l => l.type === type);
  },
  add(logData) {
    const log = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      alertId: logData.alertId,
      type: logData.type || 'status',
      fromStatus: logData.fromStatus || null,
      toStatus: logData.toStatus || null,
      operator: logData.operator || getCurrentShift().operator,
      remark: logData.remark || '',
      createdAt: new Date().toISOString()
    };
    operationLogs.unshift(log);
    saveLogs();
    return log;
  },
  getTimeline() {
    return operationLogs
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getShiftLogs(shiftName) {
    // 简化实现：返回所有日志按时间排序
    return this.getTimeline();
  }
};

// ==========================================
// 重点账号数据
// ==========================================
const keyAccounts = [
  { name: '本地大V李老师', avatar: '李', platform: 'weibo', fans: 580000, alertCount: 23, riskLevel: 'high', lastActive: '10分钟前', color: 'red' },
  { name: '新闻深度观察', avatar: '深', platform: 'wechat', fans: 320000, alertCount: 18, riskLevel: 'high', lastActive: '25分钟前', color: 'red' },
  { name: '都市快报记者', avatar: '记', platform: 'toutiao', fans: 185000, alertCount: 15, riskLevel: 'medium', lastActive: '1小时前', color: 'orange' },
  { name: '匿名爆料君', avatar: '爆', platform: 'zhihu', fans: 96000, alertCount: 12, riskLevel: 'medium', lastActive: '2小时前', color: 'orange' },
  { name: '短视频娱乐博主', avatar: '娱', platform: 'douyin', fans: 1250000, alertCount: 8, riskLevel: 'medium', lastActive: '3小时前', color: 'yellow' },
  { name: '本地论坛管理员', avatar: '论', platform: 'tianya', fans: 67000, alertCount: 6, riskLevel: 'low', lastActive: '5小时前', color: 'blue' }
];

// ==========================================
// 班次信息
// ==========================================
function getCurrentShift() {
  const hour = new Date().getHours();
  if (hour >= 8 && hour < 16) {
    return { name: '早班', startTime: '08:00', endTime: '16:00', operator: '张伟', assistant: '李娜' };
  } else if (hour >= 16 && hour < 24) {
    return { name: '中班', startTime: '16:00', endTime: '24:00', operator: '王强', assistant: '赵敏' };
  } else {
    return { name: '夜班', startTime: '00:00', endTime: '08:00', operator: '刘洋', assistant: '陈静' };
  }
}

// ==========================================
// 工具函数
// ==========================================
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function formatFullTime(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function formatNowDateTime() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatNumber(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function getHeatColor(heat) {
  if (heat >= 80) return 'var(--accent-red)';
  if (heat >= 60) return 'var(--accent-orange)';
  if (heat >= 40) return 'var(--accent-yellow)';
  return 'var(--accent-blue)';
}

function getStatusText(status) {
  const map = {
    pending: '待处理',
    verifying: '待核实',
    reporting: '需上报',
    false_alarm: '误报',
    done: '已办结',
    detect: '系统检测'
  };
  return map[status] || status;
}

function getStatusTagClass(status) {
  const map = {
    pending: 'tag-yellow',
    verifying: 'tag-blue',
    reporting: 'tag-red',
    false_alarm: 'tag-gray',
    done: 'tag-green'
  };
  return map[status] || 'tag-gray';
}

function getLogTypeText(type) {
  const map = {
    detect: '系统检测',
    status: '状态变更',
    remark: '添加备注',
    report: '上报'
  };
  return map[type] || type;
}

function getLogTypeTagClass(type) {
  const map = {
    detect: 'tag-cyan',
    status: 'tag-blue',
    remark: 'tag-purple',
    report: 'tag-red'
  };
  return map[type] || 'tag-gray';
}

// 交班笔记存取
const HandoverNotes = {
  get() {
    return Store.get(STORAGE_KEYS.HANDOVER_NOTES, {
      content: '1. 继续关注"开发区电子厂罢工"事件的后续发展，该事件真实性正在核实中\n2. 抖音账号"街头拍客"发布的非法集会视频热度较高，需持续监测传播情况\n3. 暴雨导致的洪灾救援相关舆情需保持关注，及时回应群众求助信息\n4. 领导批示的"领导作风"文章已上报，需跟踪上级部门反馈\n5. 夜间重点关注天涯论坛、贴吧等论坛类平台的突发舆情',
      operator: '',
      updatedAt: ''
    });
  },
  save(content, operator) {
    Store.set(STORAGE_KEYS.HANDOVER_NOTES, {
      content,
      operator,
      updatedAt: formatNowDateTime()
    });
  }
};

// 已读告警 ID
const ReadAlerts = {
  get() {
    return new Set(Store.get(STORAGE_KEYS.READ_IDS, []));
  },
  add(id) {
    const set = this.get();
    set.add(id);
    Store.set(STORAGE_KEYS.READ_IDS, Array.from(set));
    return set;
  },
  markAll() {
    const allIds = alerts.map(a => a.id);
    Store.set(STORAGE_KEYS.READ_IDS, allIds);
    return new Set(allIds);
  },
  has(id) {
    return this.get().has(id);
  }
};
