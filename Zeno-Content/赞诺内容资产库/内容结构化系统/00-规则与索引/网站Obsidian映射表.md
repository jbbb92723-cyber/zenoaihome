# 网站 ↔ Obsidian 映射表

> 左边是你的 Obsidian 知识库（内部工厂），右边是网站（对外橱窗）。
> 改了哪边，在这张表上记一笔。

---

## 已发布文章（有 Obsidian 追溯）

| 文章ID | 网站URL | Obsidian原始草稿 | 状态 |
|--------|---------|-----------------|------|
| 107 | `/blog/yue-bu-dong-yue-gan-kan-jia` | 越不懂越敢砍价_达克效应.md | CTA已强化 |
| 108 | `/blog/wo-shi-shui-17-nian-gongdi` | ART-20260710_我是谁_身份长文.md | Hub of Hubs |
| 109 | `/blog/baojiadan-zeren-bianjie-biao` | 报价单不是价格表是责任边界表_总纲.md | 核心认知模型 |
| 110 | `/blog/pianyi-baojia-zui-gui` | 便宜报价往往最贵.md | Anti-Vision |
| 111 | `/blog/an-shi-jie-suan-qi-ge-zi` | 按实际结算七个字背后的规则.md | 合同风险 |
| 112 | `/blog/fukuan-jiedian-zhudongquan` | 付款节点主动权安排.md | 付款安全 |
| 113 | `/blog/xinxicha-zui-yinbi-de-chengben` | 信息差最隐蔽的成本.md | 元叙事 |
| 114 | `/blog/zhuangxiu-zeren-zhenkong` | 2026-07-09_装修里的责任真空.md | 责任真空Hub |

另5篇未在Obsidian中有对应草稿：

| 文章ID | 网站URL | 标题 |
|--------|---------|------|
| 102 | `/blog/ai-gaodian-xiufu` | AI草稿五步修复法 |
| 103 | `/blog/yiren-gongsi-chanpinhua` | 一人公司的产品化 |
| 104 | `/blog/yiren-gongsi-fengxian-guankong` | 一人公司的风险管理 |
| 105 | `/blog/yiren-gongsi-dongli` | 一人公司的动力系统 |
| 106 | `/blog/cong-zhuangxiu-boke-dao-panduan-caozuo-xitong` | 从装修博客到判断操作系统 |

---

## 两个仓库的关系

```
Zeno-Content/赞诺内容资产库/          Zeno-Code/zeno-site/
（Obsidian 知识库）                   （Next.js 网站代码）
        │                                     │
        │  ① 在 Obsidian 写草稿               │
        │     06-选题装配/xxx.md               │
        │           │                          │
        │           │  ② 定稿后                │
        │           ↓                          │
        │     Hermes 把草稿改写               │
        │     成公开版                         │
        │           │                          │
        │           ↓                          │
        │                              data/content/article-*-content.ts
        │                                     │
        │  ③ 发布后拆零件                      │  ④ 部署上线
        │     02-内容单元库/                    │  next build
        │                                     │
        └──────── ⑤ 回头看映射表 ──────────────┘
                 知道哪篇已发、哪篇待发
```

---

## 待发布的 Obsidian 草稿（22篇）

这些选题在 Obsidian 里有草稿，但还没改写成网站文章：

| 草稿 | 优先级建议 |
|------|----------|
| 基础部分总合计不是最终价.md | ★★★ 报价系列核心 |
| 水电15个那个字到底指什么.md | ★★★ 报价系列 |
| 防水只写品牌只是七分之一.md | ★★★ 报价系列 |
| 封窗报价专业感不等于完整性.md | ★★ 专项 |
| 另计甲供暂估三个词.md | ★★★ 报价系列核心 |
| 垃圾外运前后冲突试纸.md | ★★ |
| 口头承诺白纸黑字五类.md | ★★★ |
| 材料只写品牌不够要型号.md | ★★ |
| 工期60天不只是个数字.md | ★★ |
| 验收不是签个字是闭个环.md | ★★ |
| 沟通失真比技术更贵.md | ★★ |
| 低价报价六个位置排查.md | ★★ |
| 直觉在装修上不可靠.md | ★ |
| 判断力是最稀缺的装修能力.md | ★ |
| 经验是护城河不是负担.md | ★ OPC向 |
| 不只是教人装修.md | ★ OPC向 |
| 从工地看世界.md | ★ OPC向 |
| 实住派装修反对什么.md | ★ |
| 家不是样板间.md | ★ 已有旧版 |
| 耐住十年的装修优先级.md | ★ |
| 装修完最后悔的五件事.md | ★ |
| 装修里的责任真空.md | ★ |
| 坚持还是换方向.md | ★ OPC向 |

---

## 使用规则

1. **发布新文章时**：在这个表加一行，同时在Obsidian草稿里加 `published_as` frontmatter
2. **回头找灵感时**：看"待发布"列，已经有人脑风暴过但没执行
3. **删除Obsidian草稿前**：查这个表——如果标记了"已发布"，不要删
4. **改了网站文章**：在这里记录版本变化

---

> 创建：2026-07-10 | 下次更新：发布新文章时
