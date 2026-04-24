/**
 * 批量读取 赞诺内容资产系统/09_网站母站/网站文章/ 下的50篇文章
 * 生成可直接追加到 data/articles.ts 的内容
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 源目录
const CONTENT_DIR = path.resolve(__dirname, '../../赞诺内容资产系统/09_网站母站/网站文章')

// 分类映射
const categoryMap = {
  '01_居住与装修': '居住与装修',
  '02_美学与生活': '美学与生活',
  '03_人性与判断': '人性与判断',
  '04_成长与长期主义': '成长与长期主义',
  '05_AI与个体升级': 'AI 与新生产力',
}

// 现有文章 slugs（避免重复）
const existingSlugs = new Set([
  '01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu',
  '02-jia-bu-shi-yangban-jian',
  '03-cong-gongdi-kan-shijie',
  '04-wei-shenme-wo-kaishi-renzheng-xue-ai',
  '05-changqi-zhuyi-bushi-rennai',
  'zhuangxiu-yusuan-weishenme-zongchao',
])

function toSlug(filename) {
  // 去掉编号和后缀，转成 kebab-case
  return filename
    .replace(/^\d+_/, '')
    .replace(/\.md$/, '')
    .replace(/[，。！？、：；""''【】《》]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5-]/g, '')
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]/g, (c) => {
      // pinyin mapping for common chars - just keep Chinese chars with prefix
      return c
    })
}

function generateSlugFromTitle(title, index, catPrefix) {
  // Generate a reasonable English-ish slug based on index and category
  const slugMap = {
    // 居住与装修
    '为什么装修预算总超': 'zhuangxiu-yusuan-weishenme-zongchao',
    '报价单真正该怎么看': 'baojia-dan-zenme-kan',
    '实住派装修究竟反对什么': 'shizhu-pai-fandui-shenme',
    '水电工程为什么总是超预算': 'shuidian-gongcheng-zongchao-yusuan',
    '装修合同里你可能没看到的条款': 'zhuangxiu-hetong-tiaokuan',
    '装修完最后悔的五件事': 'zhuangxiu-hou-hue-de-wu-jian',
    '真正耐住十年的装修优先级是什么': 'naizhu-shinian-youxianj',
    '旧房改造先验旧再动手': 'jiufang-gaizao-yanjiu',
    '验房不是走过场': 'yanfang-bu-shi-zou-guochang',
    '装修里的沟通失真比技术问题更贵': 'goutong-shizhen-bi-jishu-gui',
    // 美学与生活
    '家不是样板间': 'jia-bu-shi-yangban-jian',
    '真正的审美不是摆拍出来的': 'shenme-bu-shi-bai-pai',
    '美感不是贵而是克制': 'meigan-bu-shi-gui-shi-kezhi',
    '光线是家里最被低估的设计': 'guangxian-di-gu-sheji',
    '收纳不是柜子越多越好': 'shona-bu-shi-guizi-duo',
    '材质选择不是越贵越高级': 'caizhi-bu-shi-gui',
    '为什么越来越多人放弃网红风': 'fangqi-wanghong-feng',
    '留白不是空是呼吸': 'liubai-bu-shi-kong',
    '一个家住五年后审美会变成什么': 'jia-zhuwunian-shenme',
    '软装是最容易被低估的地方': 'ruanzhuang-di-gu',
    // 人性与判断
    '装修现场为什么最容易看清一个人': 'gongdi-kan-qing-yige-ren',
    '信息差是装修里最隐蔽的成本': 'xinxi-cha-yinbi-chengben',
    '判断力才是普通人最稀缺的装修能力': 'panduanli-xique',
    '便宜的报价往往是最贵的选择': 'pianyi-baojia-zui-gui',
    '甲方认可是合同里最危险的四个字': 'jiafang-renke-weixian',
    '为什么有些人越装修越花钱': 'yue-zhuangxiu-yue-hua-qian',
    '你的直觉在装修上为什么不可靠': 'zhijue-bu-kekao',
    '如何识别一个靠谱的施工方': 'shibie-kaopude-shigong',
    '装修里的责任真空': 'zeren-zhenkong',
    '决策焦虑选不出来往往不是选项的问题': 'juece-jiaolv-bu-shi-xuanxiang',
    // 成长与长期主义
    '长期主义不是忍耐': 'changqi-zhuyi-bushi-rennai',
    '克制不是委屈是排序': 'kezhi-bu-shi-weiqiu-shi-paixu',
    '为什么多数人不是没有目标而是顺序错了': 'mubiao-shunxu-cuo',
    '从工地学到的管理课': 'gongdi-guanlike',
    '一件事做好比做很多事更难': 'yijianshi-zuo-hao',
    '稳定不是理想的反面': 'wending-bu-shi-lixiang-fanmian',
    '经验是护城河不是负担': 'jingyan-huchenghe',
    '低噪音生活的代价和收益': 'di-zaosheng-shenghuo',
    '复利不是速度快是方向对': 'fuli-fangxiang-dui',
    '什么时候该坚持什么时候该换方向': 'jianzhi-huan-fangxiang',
    // AI与个体升级
    '为什么传统行业人必须认真学AI': 'chuantong-hangye-xue-ai',
    '内容资产才是传统行业人的第二生产线': 'neirong-zichan-shengchan',
    '从工地到AI我为什么开始做OPC一人公司实验': 'gongdi-dao-ai-opc',
    'AI帮我做了什么没帮我做什么': 'ai-bang-wo-zuo-shenme',
    '用AI写内容怎么保持自己的声音': 'ai-xie-neirong-ziji-shengyin',
    '提示词不是咒语是工作流': 'tishici-bu-shi-zhuyuyu',
    '传统行业人用AI的最大优势': 'chuantong-ai-youshi',
    '我的内容系统是怎么建起来的': 'neirong-xitong-jianqi',
    '网站母站为什么你需要一个自己的阵地': 'wangzhan-muzhan-zhendi',
    '个体生产力升级的三个层次': 'geti-shengchanlv-sange-cengci',
  }
  for (const [key, slug] of Object.entries(slugMap)) {
    if (title.includes(key)) return slug
  }
  return `article-${catPrefix}-${String(index).padStart(2, '0')}`
}

function parseArticle(content, filename, category, catPrefix) {
  const lines = content.split('\n')
  let title = ''
  let excerpt = ''
  let tags = []
  let bodyStart = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('# ')) {
      title = line.slice(2).trim()
    } else if (line.startsWith('> 标签：') || line.startsWith('> 标签:')) {
      const tagStr = line.replace(/^> 标签[：:]/, '').trim()
      tags = tagStr.split(/[,，\s]+/).filter(Boolean)
    } else if (line.startsWith('> 摘要：') || line.startsWith('> 摘要:') || line.startsWith('> 简介：') || line.startsWith('> 简介:')) {
      excerpt = line.replace(/^> [摘简][要介][：:]/, '').trim()
    } else if (line === '---' || (line === '' && i > 8 && title)) {
      // Content starts after frontmatter
      if (bodyStart === 0 && i > 3) bodyStart = i + 1
    }
  }

  // Extract excerpt from first paragraph if not found in metadata
  if (!excerpt) {
    let inContent = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!inContent && line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('---')) {
        // Skip metadata-like lines
        if (i < 10) continue
        inContent = true
        excerpt = line.slice(0, 120).trim()
        if (excerpt.length === 120) excerpt += '...'
        break
      }
    }
  }

  // Get article body (skip metadata lines at top)
  let bodyLines = []
  let pastHeader = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!pastHeader) {
      if (line.trim().startsWith('# ')) { pastHeader = false; continue }
      if (line.trim().startsWith('>')) continue
      if (line.trim().startsWith('---')) continue
      if (line.trim() === '' && i < 12) continue
      pastHeader = true
    }
    bodyLines.push(line)
  }

  const body = bodyLines.join('\n').trim()

  const index = parseInt(filename.match(/^(\d+)/)?.[1] || '0', 10)
  const slug = generateSlugFromTitle(title, index, catPrefix)

  // Date based on category ordering (simulate spread over recent months)
  const baseDates = {
    '居住与装修': '2026-03',
    '美学与生活': '2026-03',
    '人性与判断': '2026-03',
    '成长与长期主义': '2026-04',
    'AI 与新生产力': '2026-04',
  }
  const baseDate = baseDates[category] || '2026-04'
  const day = String(Math.min(index * 2 + 1, 28)).padStart(2, '0')
  const date = `${baseDate}-${day}`

  return { title, excerpt: excerpt || `${title}。本文从实践角度深入探讨。`, tags, body, slug, category, date, index }
}

const results = []

for (const [catDir, catName] of Object.entries(categoryMap)) {
  const catPath = path.join(CONTENT_DIR, catDir)
  if (!fs.existsSync(catPath)) {
    console.error(`目录不存在: ${catPath}`)
    continue
  }
  const files = fs.readdirSync(catPath)
    .filter(f => f.endsWith('.md') && !f.includes('_骨架'))
    .sort()

  const catPrefix = catDir.slice(0, 2)

  for (const file of files) {
    const content = fs.readFileSync(path.join(catPath, file), 'utf-8')
    const parsed = parseArticle(content, file, catName, catPrefix)

    if (existingSlugs.has(parsed.slug)) {
      console.log(`SKIP (already exists): ${parsed.slug}`)
      continue
    }

    results.push(parsed)
    console.log(`PARSED: [${catName}] ${parsed.title} → ${parsed.slug}`)
  }
}

// Generate articles.ts entries
const tsEntries = results.map((a, i) => {
  const id = String(i + 7).padStart(2, '0')
  const escapedBody = a.body
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')

  return `  {
    id: '${id}',
    slug: '${a.slug}',
    title: '${a.title.replace(/'/g, "\\'")}',
    excerpt: '${(a.excerpt || '').replace(/'/g, "\\'")}',
    category: '${a.category}',
    tags: [${a.tags.map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')}],
    date: '${a.date}',
    coverImage: '',
    coverAlt: '${a.title.replace(/'/g, "\\'")} — 文章封面',
    content: \`${escapedBody}\`,
  },`
}).join('\n\n')

// Write to a temp file
const outputPath = path.resolve(__dirname, '../data/articles-new.ts')
fs.writeFileSync(outputPath, `// AUTO-GENERATED - additional articles\n// Total: ${results.length} new articles\n\nexport const additionalArticles = [\n${tsEntries}\n]\n`, 'utf-8')

console.log(`\n✓ 生成完成：${results.length} 篇新文章`)
console.log(`输出文件：${outputPath}`)
