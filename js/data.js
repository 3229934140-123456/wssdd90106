// 敏感词规则数据
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

// 初始敏感词规则
let sensitiveWords = [
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

// 初始告警数据
let alerts = [
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
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 68 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 80 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 100 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 150 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 210 * 60000).toISOString(),
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
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    status: 'pending',
    level: 'red',
    url: 'https://weibo.com/example/12'
  }
];

// 重点关注账号
const keyAccounts = [
  { name: '本地大V李老师', avatar: '李', platform: 'weibo', fans: 580000, alertCount: 23, riskLevel: 'high', lastActive: '10分钟前', color: 'red' },
  { name: '新闻深度观察', avatar: '深', platform: 'wechat', fans: 320000, alertCount: 18, riskLevel: 'high', lastActive: '25分钟前', color: 'red' },
  { name: '都市快报记者', avatar: '记', platform: 'toutiao', fans: 185000, alertCount: 15, riskLevel: 'medium', lastActive: '1小时前', color: 'orange' },
  { name: '匿名爆料君', avatar: '爆', platform: 'zhihu', fans: 96000, alertCount: 12, riskLevel: 'medium', lastActive: '2小时前', color: 'orange' },
  { name: '短视频娱乐博主', avatar: '娱', platform: 'douyin', fans: 1250000, alertCount: 8, riskLevel: 'medium', lastActive: '3小时前', color: 'yellow' },
  { name: '本地论坛管理员', avatar: '论', platform: 'tianya', fans: 67000, alertCount: 6, riskLevel: 'low', lastActive: '5小时前', color: 'blue' }
];

// 班次信息
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

// 生成告警统计
function getAlertStats() {
  const pending = alerts.filter(a => a.status === 'pending').length;
  const verifying = alerts.filter(a => a.status === 'verifying').length;
  const reporting = alerts.filter(a => a.status === 'reporting').length;
  const falseAlarm = alerts.filter(a => a.status === 'false_alarm').length;
  const done = alerts.filter(a => a.status === 'done').length;
  const total = alerts.length;
  const highLevel = alerts.filter(a => a.level === 'red').length;
  
  return { total, pending, verifying, reporting, falseAlarm, done, highLevel };
}

// 生成高频词
function getTopWords() {
  const wordCount = {};
  alerts.forEach(a => {
    if (!wordCount[a.hitWord]) {
      wordCount[a.hitWord] = { word: a.hitWord, count: 0, category: a.category };
    }
    wordCount[a.hitWord].count++;
  });
  
  // 加入一些规则中的高频词
  sensitiveWords.forEach(w => {
    if (w.hitCount > 50) {
      if (!wordCount[w.word]) {
        wordCount[w.word] = { word: w.word, count: 0, category: w.category };
      }
      wordCount[w.word].count += Math.floor(w.hitCount / 20);
    }
  });
  
  return Object.values(wordCount).sort((a, b) => b.count - a.count).slice(0, 20);
}

// 生成平台分布
function getPlatformStats() {
  const stats = {};
  alerts.forEach(a => {
    if (!stats[a.platform]) {
      stats[a.platform] = { platform: a.platform, count: 0 };
    }
    stats[a.platform].count++;
  });
  return Object.values(stats).sort((a, b) => b.count - a.count);
}

// 生成分类统计
function getCategoryStats() {
  const stats = {};
  alerts.forEach(a => {
    if (!stats[a.category]) {
      stats[a.category] = { category: a.category, count: 0 };
    }
    stats[a.category].count++;
  });
  return Object.entries(WORD_CATEGORIES).map(([key, info]) => ({
    category: key,
    name: info.name,
    color: info.color,
    count: stats[key]?.count || 0
  }));
}

// 工具函数
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
    done: '已办结'
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
