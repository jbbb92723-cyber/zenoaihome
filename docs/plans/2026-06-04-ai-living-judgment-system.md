# AI Living Judgment System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade ZenoAIHome from a quote-risk-first site into an AI-assisted living judgment system for self-improving families, while preserving the existing quote-risk conversion path.

**Architecture:** Keep the existing Next.js 14 + Prisma + Postgres monolith. Add a new "living diagnosis" domain layer with deterministic local scoring first, optional LLM integration later. Public pages submit diagnosis records into Postgres; admin pages review those records and can later turn them into paid reports or service requests.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Prisma, Postgres/Supabase, Auth.js, Zod, existing admin panel.

---

## Scope

Implement the recommended B scope:

1. Update positioning documents and front-page narrative.
2. Add `/living-diagnosis` as a public AI living diagnosis page.
3. Persist diagnosis submissions in the database.
4. Add admin review pages for living diagnoses.
5. Keep `/tools/quote-check`, risk dictionary, checklists, project risks, and current quote services intact.

Do not build paid report delivery, file upload, LLM report generation, or a full case-review database in this phase. Those become follow-up work after diagnosis submissions prove useful.

---

## Task 1: Update Positioning Documents

**Files:**
- Modify: `docs/zeno-constitution/01-brand-positioning.md`
- Modify: `docs/zeno-constitution/05-product-funnel.md`
- Modify: `docs/strategy/zeno-one-page-business-model.md`

**Step 1: Replace the top-level positioning**

In `docs/zeno-constitution/01-brand-positioning.md`, change the core positioning from quote-risk-first to:

```markdown
ZenoAIHome 是一个面向自我成长型家庭的 AI 居住判断系统。

它用 16 年装修现场经验 + AI 辅助分析，帮助用户在装修前看清真实生活方式、空间秩序、预算取舍、审美偏好和签约风险。
```

Keep the existing "签约前报价风险" as a core product entry, not the whole brand.

**Step 2: Update product path**

In `docs/zeno-constitution/05-product-funnel.md`, add a new early stage before budget and quote:

```markdown
| 3 | 觉得生活方式、审美和空间需求没想清 | AI 居住诊断 | 免费 | 先识别生活矛盾、空间优先级和下一步路径 | 去需求报告 / 报价初筛 / 服务页 |
| 4 | 想低成本获得完整需求梳理 | 居住需求洞察报告 Beta | 199-399 元 | 把模糊需求翻译成空间、预算和风险判断 | 进入报价快审或签约前判断 |
```

Keep existing quote review and signing package stages after this.

**Step 3: Update one-page business model**

In `docs/strategy/zeno-one-page-business-model.md`, update the one-line definition:

```markdown
ZenoAIHome 不是装修公司、不是流量平台、也不是泛 AI 顾问，而是站在自我成长型家庭与装修行业之间，把居住需求、空间秩序、预算取舍和签约风险做成可判断、可交付、可复用的系统。
```

**Step 4: Review**

Run:

```bash
git diff -- docs/zeno-constitution/01-brand-positioning.md docs/zeno-constitution/05-product-funnel.md docs/strategy/zeno-one-page-business-model.md
```

Expected: only positioning/product strategy text changes.

**Step 5: Commit**

```bash
git add docs/zeno-constitution/01-brand-positioning.md docs/zeno-constitution/05-product-funnel.md docs/strategy/zeno-one-page-business-model.md
git commit -m "docs: reposition zeno as ai living judgment system"
```

---

## Task 2: Add Living Diagnosis Domain Data

**Files:**
- Create: `zeno-site/data/living-diagnosis.ts`
- Create: `zeno-site/lib/living-diagnosis.ts`

**Step 1: Create diagnosis configuration**

Create `zeno-site/data/living-diagnosis.ts`:

```ts
export type LivingDiagnosisDimension =
  | 'lifeOrder'
  | 'familyRelation'
  | 'aestheticMaturity'
  | 'workAndStudy'
  | 'storageAndMaintenance'
  | 'budgetClarity'
  | 'signingRisk'

export type LivingDiagnosisQuestion = {
  id: string
  dimension: LivingDiagnosisDimension
  title: string
  helper: string
  options: Array<{
    value: string
    label: string
    score: number
  }>
}

export const livingDiagnosisQuestions: LivingDiagnosisQuestion[] = [
  {
    id: 'current-stage',
    dimension: 'signingRisk',
    title: '你现在处在装修的哪个阶段？',
    helper: '阶段决定下一步该先看需求、预算，还是报价合同。',
    options: [
      { value: 'thinking', label: '还在想怎么住，没定方案', score: 1 },
      { value: 'planning', label: '有户型或灵感图，准备做方案', score: 2 },
      { value: 'quote', label: '已经拿到报价，准备比较', score: 4 },
      { value: 'signing', label: '快签约了，心里没底', score: 5 },
    ],
  },
  {
    id: 'life-problem',
    dimension: 'lifeOrder',
    title: '你最想让这个家改善哪件事？',
    helper: '这不是风格问题，而是空间要支持的生活问题。',
    options: [
      { value: 'order', label: '生活更有秩序，不再乱', score: 5 },
      { value: 'emotion', label: '情绪更稳定，回家能放松', score: 4 },
      { value: 'relation', label: '家人之间更舒服，少冲突', score: 4 },
      { value: 'efficiency', label: '工作、学习、家务更顺手', score: 3 },
    ],
  },
  {
    id: 'aesthetic-state',
    dimension: 'aestheticMaturity',
    title: '你对审美最担心什么？',
    helper: '成熟审美不是追流行，而是知道什么适合长期生活。',
    options: [
      { value: 'trend', label: '怕被网红风带偏', score: 4 },
      { value: 'boring', label: '怕太实用但不好看', score: 3 },
      { value: 'messy', label: '喜欢很多东西，但组合起来乱', score: 5 },
      { value: 'unclear', label: '说不清自己到底喜欢什么', score: 5 },
    ],
  },
  {
    id: 'budget-mindset',
    dimension: 'budgetClarity',
    title: '你现在怎么看预算？',
    helper: '预算不是总价，是取舍顺序。',
    options: [
      { value: 'only-total', label: '只知道一个总预算', score: 5 },
      { value: 'fear-overrun', label: '最怕后期超预算', score: 5 },
      { value: 'can-tradeoff', label: '愿意为核心空间多花，其他后置', score: 2 },
      { value: 'unclear', label: '完全不知道怎么拆', score: 5 },
    ],
  },
]
```

**Step 2: Create local analyzer**

Create `zeno-site/lib/living-diagnosis.ts`:

```ts
import { livingDiagnosisQuestions } from '@/data/living-diagnosis'

export type LivingDiagnosisAnswer = {
  questionId: string
  value: string
}

export type LivingDiagnosisResult = {
  primaryType: string
  riskLevel: 'low' | 'medium' | 'high'
  totalScore: number
  summary: string
  priorities: string[]
  nextSteps: Array<{ label: string; href: string }>
}

export function analyzeLivingDiagnosis(answers: LivingDiagnosisAnswer[]): LivingDiagnosisResult {
  const score = answers.reduce((sum, answer) => {
    const question = livingDiagnosisQuestions.find((item) => item.id === answer.questionId)
    const option = question?.options.find((item) => item.value === answer.value)
    return sum + (option?.score ?? 0)
  }, 0)

  const stage = answers.find((item) => item.questionId === 'current-stage')?.value
  const riskLevel = score >= 17 ? 'high' : score >= 10 ? 'medium' : 'low'

  if (stage === 'quote' || stage === 'signing') {
    return {
      primaryType: '签约前风险型',
      riskLevel,
      totalScore: score,
      summary: '你已经接近报价或签约阶段，不能只继续讨论风格。下一步要把生活需求、预算取舍和报价合同边界放在一起看。',
      priorities: ['报价边界', '预算取舍', '口头承诺落字'],
      nextSteps: [
        { label: '先做报价风险初筛', href: '/tools/quote-check' },
        { label: '查看签约前服务', href: '/services/renovation' },
      ],
    }
  }

  return {
    primaryType: '居住需求未定型',
    riskLevel,
    totalScore: score,
    summary: '你现在最重要的不是马上定风格，而是先把生活方式、家庭关系、空间秩序和预算优先级说清楚。',
    priorities: ['生活方式', '空间秩序', '审美偏好'],
    nextSteps: [
      { label: '保存诊断结果', href: '/living-diagnosis' },
      { label: '查看案例复盘', href: '/cases' },
    ],
  }
}
```

**Step 3: Typecheck**

Run:

```bash
cd zeno-site
npm run lint
```

Expected: no TypeScript or lint errors from the new files.

**Step 4: Commit**

```bash
git add zeno-site/data/living-diagnosis.ts zeno-site/lib/living-diagnosis.ts
git commit -m "feat: add living diagnosis domain rules"
```

---

## Task 3: Add Prisma Models

**Files:**
- Modify: `zeno-site/prisma/schema.prisma`

**Step 1: Add user relation**

Inside `model User`, add:

```prisma
  livingDiagnoses  LivingDiagnosis[]
```

**Step 2: Add models before `AdminLog`**

Append these models before `AdminLog`:

```prisma
model LivingDiagnosis {
  id           String   @id @default(cuid())
  userId       String?
  source       String   @default("living_diagnosis_page")
  stage        String?
  city         String?
  homeType     String?
  area         String?
  budgetRange  String?
  contactName  String?
  contactWechat String?
  contactEmail String?
  answers      Json
  result       Json?
  status       String   @default("submitted") // submitted | reviewing | report_draft | completed | archived
  adminNote    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user   User?            @relation(fields: [userId], references: [id], onDelete: SetNull)
  report DiagnosisReport?

  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("living_diagnoses")
}

model DiagnosisReport {
  id          String   @id @default(cuid())
  diagnosisId String  @unique
  title       String
  status      String  @default("draft") // draft | reviewed | published | archived
  aiSummary   String?
  zenoReview  String?
  report      Json
  publicToken String? @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?

  diagnosis LivingDiagnosis @relation(fields: [diagnosisId], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([createdAt])
  @@map("diagnosis_reports")
}
```

**Step 3: Validate Prisma schema**

Run:

```bash
cd zeno-site
npx prisma validate
npm run prisma:generate
```

Expected: schema validates and Prisma client generates.

**Step 4: Create migration**

Run:

```bash
cd zeno-site
npx prisma migrate dev --name add_living_diagnosis
```

Expected: a new folder under `zeno-site/prisma/migrations/`.

**Step 5: Commit**

```bash
git add zeno-site/prisma/schema.prisma zeno-site/prisma/migrations
git commit -m "feat: persist living diagnosis records"
```

---

## Task 4: Add Public Diagnosis API

**Files:**
- Create: `zeno-site/app/api/living-diagnosis/route.ts`

**Step 1: Implement POST endpoint**

Create `zeno-site/app/api/living-diagnosis/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { analyzeLivingDiagnosis } from '@/lib/living-diagnosis'
import { z } from 'zod'

const AnswerSchema = z.object({
  questionId: z.string().min(1).max(80),
  value: z.string().min(1).max(120),
})

const Schema = z.object({
  stage: z.string().max(80).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
  homeType: z.string().max(80).optional().or(z.literal('')),
  area: z.string().max(40).optional().or(z.literal('')),
  budgetRange: z.string().max(80).optional().or(z.literal('')),
  contactName: z.string().max(50).optional().or(z.literal('')),
  contactWechat: z.string().max(80).optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
  answers: z.array(AnswerSchema).min(1).max(20),
})

export async function POST(req: Request) {
  const session = await auth()

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: '参数校验失败', detail: parsed.error.flatten() }, { status: 422 })
  }

  const result = analyzeLivingDiagnosis(parsed.data.answers)

  const diagnosis = await prisma.livingDiagnosis.create({
    data: {
      userId: session?.user?.id ?? null,
      stage: parsed.data.stage || null,
      city: parsed.data.city || null,
      homeType: parsed.data.homeType || null,
      area: parsed.data.area || null,
      budgetRange: parsed.data.budgetRange || null,
      contactName: parsed.data.contactName || null,
      contactWechat: parsed.data.contactWechat || null,
      contactEmail: parsed.data.contactEmail || null,
      answers: parsed.data.answers,
      result,
      status: 'submitted',
    },
  })

  await prisma.analyticsEvent.create({
    data: {
      userId: session?.user?.id ?? null,
      event: 'living_diagnosis_submitted',
      path: '/living-diagnosis',
      metadata: { diagnosisId: diagnosis.id, primaryType: result.primaryType, riskLevel: result.riskLevel },
    },
  })

  return NextResponse.json({ ok: true, diagnosisId: diagnosis.id, result }, { status: 201 })
}
```

**Step 2: Verify build types**

Run:

```bash
cd zeno-site
npm run lint
```

Expected: no lint errors.

**Step 3: Commit**

```bash
git add zeno-site/app/api/living-diagnosis/route.ts
git commit -m "feat: add living diagnosis submission api"
```

---

## Task 5: Build Public Diagnosis Page

**Files:**
- Create: `zeno-site/app/living-diagnosis/page.tsx`
- Create: `zeno-site/components/living-diagnosis/LivingDiagnosisClient.tsx`

**Step 1: Create server page**

Create `zeno-site/app/living-diagnosis/page.tsx`:

```tsx
import type { Metadata } from 'next'
import LivingDiagnosisClient from '@/components/living-diagnosis/LivingDiagnosisClient'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'AI 居住诊断｜装修前先看清你真正想怎样生活',
  description:
    'ZenoAIHome 的 AI 居住诊断帮助自我成长型家庭在装修前梳理生活方式、空间秩序、审美偏好、预算取舍和签约风险。',
  alternates: { canonical: 'https://zenoaihome.com/living-diagnosis' },
}

export default function LivingDiagnosisPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'AI 居住诊断',
          url: 'https://zenoaihome.com/living-diagnosis',
          description: '装修前先看清真实生活方式、空间秩序、预算取舍和签约风险。',
          inLanguage: 'zh-CN',
        }}
      />
      <LivingDiagnosisClient />
    </>
  )
}
```

**Step 2: Create client component**

Create `zeno-site/components/living-diagnosis/LivingDiagnosisClient.tsx`.

Use:

- `livingDiagnosisQuestions` from `@/data/living-diagnosis`
- local state for answers and optional contact fields
- `fetch('/api/living-diagnosis', { method: 'POST' })`
- render returned `result.summary`, `result.priorities`, and `result.nextSteps`

Required UI sections:

1. Hero:
   - Title: `装修前，先看清你真正想怎样生活。`
   - Subtitle: `这不是风格测试，而是把生活方式、空间秩序、审美偏好、预算取舍和签约风险放在一起看。`
2. Basic info fields:
   - city
   - homeType
   - area
   - budgetRange
3. Diagnosis questions.
4. Optional contact:
   - contactName
   - contactWechat
   - contactEmail
5. Result panel.

Use existing visual language:

- `bg-canvas`, `bg-surface`, `border-border`, `text-ink`, `text-stone`
- squared or low-radius controls
- no purple AI-gradient style

**Step 3: Manual browser check**

Run:

```bash
cd zeno-site
npm run dev
```

Open:

```text
http://localhost:3000/living-diagnosis
```

Expected:

- Page renders.
- Selecting answers updates state.
- Submit creates a result.
- Result links point to existing routes.

**Step 4: Commit**

```bash
git add zeno-site/app/living-diagnosis/page.tsx zeno-site/components/living-diagnosis/LivingDiagnosisClient.tsx
git commit -m "feat: add public living diagnosis page"
```

---

## Task 6: Add Admin Diagnosis Review

**Files:**
- Modify: `zeno-site/components/admin/AdminSidebar.tsx`
- Modify: `zeno-site/lib/actions/admin.ts`
- Create: `zeno-site/app/admin/(protected)/living-diagnoses/page.tsx`
- Create: `zeno-site/app/admin/(protected)/living-diagnoses/[id]/page.tsx`

**Step 1: Add sidebar item**

In `AdminSidebar.tsx`, under `内容与服务`, add:

```ts
{ href: '/admin/living-diagnoses', label: '居住诊断' },
```

**Step 2: Add admin action**

In `lib/actions/admin.ts`, add:

```ts
export async function updateLivingDiagnosisStatus(diagnosisId: string, status: string) {
  await requireAdmin()
  const validStatuses = ['submitted', 'reviewing', 'report_draft', 'completed', 'archived']
  if (!validStatuses.includes(status)) throw new Error('Invalid status')

  await prisma.livingDiagnosis.update({ where: { id: diagnosisId }, data: { status } })
  await prisma.adminLog.create({ data: { action: 'update_living_diagnosis_status', target: diagnosisId, detail: { status } } })
  revalidatePath('/admin/living-diagnoses')
  revalidatePath(`/admin/living-diagnoses/${diagnosisId}`)
}
```

**Step 3: Create admin list page**

Create `app/admin/(protected)/living-diagnoses/page.tsx`:

- Query latest 100 diagnoses.
- Include user email.
- Show status filter.
- Show createdAt, city, area, budgetRange, contactWechat, primaryType from `result`.
- Link each record to detail page.

**Step 4: Create admin detail page**

Create `app/admin/(protected)/living-diagnoses/[id]/page.tsx`:

- Load diagnosis by id.
- Render basic info, contact, answers JSON, result summary.
- Add status update form using `updateLivingDiagnosisStatus`.
- Include quick links to service requests and quote-check page.

**Step 5: Verify**

Run:

```bash
cd zeno-site
npm run lint
```

Expected: no lint errors.

**Step 6: Commit**

```bash
git add zeno-site/components/admin/AdminSidebar.tsx zeno-site/lib/actions/admin.ts zeno-site/app/admin/\(protected\)/living-diagnoses
git commit -m "feat: add admin living diagnosis review"
```

---

## Task 7: Update Homepage Narrative

**Files:**
- Modify: `zeno-site/app/page.tsx`
- Modify: `zeno-site/components/home/HomePageGptSkill.tsx`

**Step 1: Update metadata**

In `app/page.tsx`, change title and description:

```ts
title: 'AI 居住判断系统｜装修前看清生活方式、预算和签约风险｜ZenoAIHome',
description:
  'ZenoAIHome 面向自我成长型家庭，用 AI 辅助分析和 16 年装修现场经验，帮助你在装修前看清真实生活方式、空间秩序、预算取舍、报价合同和签约风险。',
```

Update structured data descriptions similarly.

**Step 2: Update hero**

In `HomePageGptSkill.tsx`, change hero title:

```tsx
<span className="block">装修前，先看清</span>
<span className="block">你真正想怎样生活</span>
```

Change hero body:

```tsx
ZenoAIHome 用 AI 辅助分析和 16 年装修现场经验，帮你把居住需求、空间秩序、预算取舍、报价合同风险想清楚，再决定怎么装、花多少钱、能不能签。
```

Change primary CTA:

```tsx
<ActionLink href="/living-diagnosis">开始 AI 居住诊断</ActionLink>
```

Keep secondary CTA:

```tsx
<ActionLink href="/tools/quote-check" variant="secondary">已有报价，先做风险初筛</ActionLink>
```

**Step 3: Update problem cards**

Add two cards before quote-risk cards:

```ts
{
  icon: HouseLine,
  title: '说不清自己真正想怎么住',
  body: '先把生活方式、家人关系、情绪需求和空间秩序说清，再谈风格和预算。',
  href: '/living-diagnosis',
},
{
  icon: Notebook,
  title: '喜欢很多图，但不知道自己到底喜欢什么',
  body: '灵感图不是答案，要翻译成色彩、材质、光线、收纳和动线判断。',
  href: '/living-diagnosis',
},
```

Keep quote-risk cards after them.

**Step 4: Rename method framework**

Change framework from quote-only:

- 01 看生活方式
- 02 看空间秩序
- 03 看预算取舍
- 04 看报价边界
- 05 看合同风险
- 06 给下一步清单

**Step 5: Verify homepage**

Run:

```bash
cd zeno-site
npm run lint
npm run build
```

Expected: build succeeds.

**Step 6: Commit**

```bash
git add zeno-site/app/page.tsx zeno-site/components/home/HomePageGptSkill.tsx
git commit -m "feat: reposition homepage around living judgment"
```

---

## Task 8: Update Product Ladder and Services Copy

**Files:**
- Modify: `zeno-site/data/services.ts`
- Modify: `zeno-site/data/commercial-ladder.ts`
- Modify: `zeno-site/app/services/renovation/page.tsx`

**Step 1: Add service**

In `data/services.ts`, add:

```ts
{
  id: '00',
  slug: 'living-insight-beta',
  title: '居住需求洞察报告 Beta',
  tagline: '还没定方案，先把生活方式和空间优先级说清',
  description: '适合装修前期还说不清真实需求、审美偏好和预算取舍的家庭。',
  solves: '把模糊的“想要温馨、实用、高级、不乱”，翻译成空间秩序、预算优先级和下一步决策。',
  forWho: ['还没定方案的人', '攒了很多灵感图但说不清偏好的人', '想让家支持更好生活的人'],
  notForWho: ['已经快签约且只想审报价的人', '只想要效果图的人', '希望 AI 自动替你拍板的人'],
  youProvide: ['家庭成员和生活场景', '户型图或面积说明', '预算范围', '审美参考或关键词'],
  iDeliver: ['居住类型判断', '空间优先级', '预算取舍建议', '下一步行动清单'],
  boundary: '不是设计方案，不出施工图，不替你决定最终风格。',
  price: '199-399 元 / Beta',
  contactNote: '先完成 AI 居住诊断，再决定是否需要人工整理成报告。',
  tag: '居住',
}
```

**Step 2: Update ladder**

In `data/commercial-ladder.ts`, update comments and include living diagnosis before quote check:

```ts
title: 'AI 居住诊断',
whoFor: '还没想清怎么住、怎么取舍的人',
delivers: '识别生活方式、空间优先级、预算取舍和下一步路径',
href: '/living-diagnosis',
cta: '先做居住诊断',
```

Keep quote check as the next rung, not removed.

**Step 3: Update services page hero**

In `app/services/renovation/page.tsx`, shift title to:

```text
装修前居住判断与签约风险服务
```

Explain that services now split into:

1. 居住需求洞察
2. 报价风险快审
3. 签约前深度判断

**Step 4: Verify**

Run:

```bash
cd zeno-site
npm run lint
npm run build
```

Expected: services page builds and links resolve.

**Step 5: Commit**

```bash
git add zeno-site/data/services.ts zeno-site/data/commercial-ladder.ts zeno-site/app/services/renovation/page.tsx
git commit -m "feat: add living insight offer to service ladder"
```

---

## Task 9: QA and gstack Dogfood

**Files:**
- No file edits unless issues are found.

**Step 1: Run static checks**

```bash
cd zeno-site
npm run lint
npm run build
```

Expected: both pass.

**Step 2: Run local server**

```bash
cd zeno-site
npm run dev
```

Expected: local server starts on `http://localhost:3000`.

**Step 3: Dogfood flows**

Using gstack/browser QA, verify:

1. `/` loads and primary CTA goes to `/living-diagnosis`.
2. `/living-diagnosis` can submit a diagnosis.
3. Result panel appears and links work.
4. `/tools/quote-check` still works.
5. `/services/renovation` still shows quote services.
6. `/admin/living-diagnoses` is inaccessible unless admin-authenticated.
7. Mobile viewport has no overlapping text or broken cards.

**Step 4: Fix issues**

If any issue is found:

1. Reproduce.
2. Patch the smallest affected file.
3. Re-run `npm run lint`.
4. Re-run the affected browser flow.

**Step 5: Commit fixes**

```bash
git add <changed-files>
git commit -m "fix: polish living diagnosis rollout"
```

---

## Final Acceptance Criteria

- Homepage presents ZenoAIHome as an AI-assisted living judgment system, not just a quote-risk site.
- Quote-risk tools and services remain discoverable and functional.
- `/living-diagnosis` exists, renders, submits, and returns a useful local result.
- Submitted diagnoses are persisted in Postgres.
- Admin can list and inspect diagnosis submissions.
- No LLM key is required for first launch.
- `npm run lint` passes.
- `npm run build` passes.
- Browser QA confirms desktop and mobile flows.

---

## Follow-Up Work After This Plan

Only after this phase is live and receiving real submissions:

1. Add paid `DiagnosisReport` generation and public report pages.
2. Add upload support for inspiration images and floor plans.
3. Add LLM-assisted report drafts behind manual review.
4. Upgrade `/cases` into database-backed case reviews.
5. Add service-request linkage from diagnosis to order.
6. Build B-side "builder notes" and method-library pages.
