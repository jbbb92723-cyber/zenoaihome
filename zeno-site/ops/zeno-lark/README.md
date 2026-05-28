# Zeno 内容中台 v0.1 / Feishu Base

Base URL: https://fcnq0trbpwz3.feishu.cn/base/MZEybml1aaBX4zsIUPwcVUHcnHc

Base Token: `MZEybml1aaBX4zsIUPwcVUHcnHc`

## Current Setup

- 10 core tables created.
- Operational views created for every table.
- Key status fields converted to single select fields.
- 8 default channel records inserted.
- 30 Obsidian material index records imported from `G:/Zenoaihome.com/赞诺内容资产系统`.
- Key views have filters/sorts for daily operations.

## Main Scripts

- `init-zeno-content-hub.mjs`: create/repair v0.1 tables and fields.
- `configure-views-status-and-seed.mjs`: create views, select fields, default channel records.
- `configure-view-filters.mjs`: apply filters/sorts to key views.
- `import-obsidian-materials.mjs`: import Obsidian markdown file indexes into `materials_素材索引`.

## Next SOP Hook

First MVP loop:

1. Add topic into `topics_选题池`.
2. Match materials from `materials_素材索引`.
3. Score topic and move status to `scored`.
4. Generate Brief into `briefs_生产单`.
5. Generate draft into `drafts_稿件库`.
6. Run quality review into `reviews_质检记录`.
7. Human approval into `approvals_审批记录`.
8. Create publish job into `publish_jobs_发布任务`.
9. Pull metrics into `metrics_数据回流`.
10. Write all CLI/Hermes executions into `task_runs_执行日志`.
