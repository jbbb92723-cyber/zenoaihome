# Zeno 发布中台（本地版）

> 位置：`04_内容发布/00_Zeno发布中台/`  
> 作用：把 Obsidian 里的内容资产，整理成「可审核、可发布、可复盘」的本地发布包。  
> 原则：这里不是 AI 一键发稿工具，而是 Zeno 的发布控制台；最终文案、发布许可和复盘判断都由人把关。

## 一、目录结构

```text
00_Zeno发布中台/
  01_inbox_待分拣/          # 临时丢进来的发布候选、截图、链接、口头想法
  02_packages_发布包/       # 一篇内容一个发布包；内部放文案、图片、发布配置
    _template/              # 发布包模板
    2026-06-02-demo-装修报价里的暂估/
  03_review_待审核/         # 已整理好，但需要 Zeno 审稿/判断
  04_ready_待发布/          # 审核通过，等待同步/人工发布
  05_published_已发布/      # 已发布内容归档
  06_feedback_数据反馈/     # 平台数据、评论反馈、复盘结论
  07_archive_归档/          # 放弃/过期/暂缓的发布包
  _config/                  # 同步配置
  _scripts/                 # 自动同步脚本模板
  _synced/                  # 脚本输出的“待发布副本”，不等于已公开发布
  _logs/                    # 同步日志
```

## 二、推荐状态流

```text
输入候选
→ 01_inbox_待分拣
→ 02_packages_发布包/某个主题
→ 03_review_待审核
→ 04_ready_待发布
→ 脚本复制到 _synced/对应平台
→ 人工发布 / 或后续接 API
→ 05_published_已发布
→ 06_feedback_数据反馈
→ 回填 03_素材证据库 / 04_内容资产单元 / 07_方法论与可调用方法库
```

## 三、发布包最小文件

每个发布包建议至少包含：

```text
publish.yaml   # 标题、平台、状态、CTA、来源资产、发布时间等元数据
copy.md        # 最终候选文案；不要把内部推理过程放进去
assets/        # 小红书图、公众号封面、网站图等发布素材
```

## 四、同步脚本怎么用

脚本路径：

```bash
python "G:/Zenoaihome.com/赞诺内容资产系统/04_内容发布/00_Zeno发布中台/_scripts/zeno_publish_sync.py" --dry-run
```

真正复制输出：

```bash
python "G:/Zenoaihome.com/赞诺内容资产系统/04_内容发布/00_Zeno发布中台/_scripts/zeno_publish_sync.py" --apply
```

脚本默认只做三件事：

1. 扫描 `04_ready_待发布/` 和 `02_packages_发布包/` 中 `publish.yaml` 里 `status: approved` 的发布包；
2. 按平台复制到 `_synced/xiaohongshu`、`_synced/wechat_oa`、`_synced/website`；
3. 写入 `_logs/sync-log.md`，方便回查。

> 注意：当前脚本是“本地同步模板”，不会直接自动发布到小红书/公众号/网站。它适合先做安全中台：把可发布内容整理成平台待发布副本。后续如果接飞书、微信公众号草稿箱、网站 importer，可以在这个脚本上加 API 层。

## 五、Zeno 使用边界

- 小红书：适合图文组、轻判断、低压提醒，不制造焦虑。
- 公众号：适合完整解释、方法卡、案例复盘。
- 网站：只放经过定位校准的长期资产，不同步所有 Obsidian 草稿。
- Feishu：适合做状态看板和审批，不替代 Obsidian 本地资产库。
