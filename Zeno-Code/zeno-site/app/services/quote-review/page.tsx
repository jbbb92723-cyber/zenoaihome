import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import CTA from '@/components/ui/CTA'
import StructuredData from '@/components/ui/StructuredData'

export const metadata: Metadata = {
  title: '装修报价零加价保障审查｜¥2,500，审过的项目被加价我帮你追',
  description:
    '17年经验的人逐项审核你的报价单，24小时内出报告。13个风险边界逐项排查。保证：审核过的项目施工中被变相加价，我帮你追回差额。追不回，全额退款。',
  alternates: {
    canonical: 'https://zenoaihome.com/services/quote-review',
  },
}

/* ── 13边界 ── */
const boundaries = [
  { label: '基础部分总合计', risk: '是不是最终价，还是后面还有' },
  { label: '水电点位', risk: '"个"字背后的计量陷阱——多一个插座涨多少？' },
  { label: '按实际结算', risk: '七个字底下该有的半页纸规则，没写就全看对方心情' },
  { label: '防水', risk: '只写品牌名，不写型号、厚度、遍数——品牌只回答了七分之一' },
  { label: '封窗', risk: '型材、玻璃、五金、安装——参数之外的增项来源' },
  { label: '垃圾外运', risk: '报价编号自己跟自己打架：这边含了，那边另计' },
  { label: '另计·甲供·暂估', risk: '三个词告诉你总价不完整——实际完工价≠报价总价' },
  { label: '口头承诺', risk: '没写进报价单的那句话，等于没说过' },
  { label: '低价报价', risk: '便宜来自清晰取舍，还是漏项少算？' },
  { label: '付款节点', risk: '不是财务细节，是主动权安排——钱付完了你还有多少筹码' },
  { label: '验收质保', risk: '"已验收"三个字的背后——什么时候验、按什么标准验' },
  { label: '材料型号', risk: '同一个品牌的不同系列，差价可达一倍' },
  { label: '工期顺延', risk: '60天从哪天算起——合同上写了吗？' },
]

/* ── 赠品堆叠 ── */
const bonusItems = [
  { name: '装修合同陷阱避雷指南', value: '¥299', desc: '合同里常见的8个坑，和怎么把口头承诺写进合同，让它有法律效力' },
  { name: '施工前3个月微信答疑', value: '¥499', desc: '签约后遇到不确定的事——增项、工艺、付款节点——随时拍照发我' },
  { name: '入住后1年售后咨询', value: '¥599', desc: '住进去之后发现问题？发照片给我，我帮你判断是正常现象还是该找施工方' },
  { name: '装修公司谈判话术模板', value: '¥199', desc: '不知道怎么开口拒绝加价？模板给你，你复制粘贴——重点是"你是内行，你不好糊弄"' },
]

/* ── 保证 ── */
const guaranteeItems = [
  '审核过的项目如果在施工中被变相加价，我帮你追回差额',
  '追不回，¥2,500全额退款——没有条件，不用解释',
  '退一万步说，即使你对报告不满意，你也免费拿到了一份¥299的装修合同避雷指南',
]

/* ── 算账 ── */
const comparison = [
  {
    label: '不审核',
    items: [
      '隐藏加价平均 ¥20,000–50,000',
      '施工中反复扯皮，工期一拖就是3个月',
      '材料偷换、工艺缩水，住进去才发现',
      '每次去工地都心里没底，不知道在看什么',
    ],
  },
  {
    label: '花 ¥2,500 审核',
    items: [
      '13个风险边界逐项排查，每个问题标注到"第几页第几行"',
      '签约前把所有模糊描述改清楚——口头承诺变成白纸黑字',
      '施工中遇到加价——有人帮你判断这钱该不该给',
      '拿着报告去谈，施工方知道你是内行在看，不好糊弄',
    ],
  },
]

/* ── 不适合这个服务的人 ── */
const notForItems = [
  { label: '你已经完全信任施工方，不想多一道审核', detail: '不用买。信任比审核更值钱。' },
  { label: '装修预算在 ¥50,000 以下', detail: '审核费占比例太高，不划算。' },
  { label: '你觉得"装修嘛，差不多就行"', detail: '这个服务的颗粒度对你来说是过度投入。' },
]

/* ── FAQ ── */
const faqs = [
  {
    q: '¥2,500是一次还是一年？',
    a: '一次。一份报价单的全量审核。如果你换了施工方需要重新审，第二次半价 ¥1,250。',
  },
  {
    q: '你只服务南宁吗？',
    a: '全国的装修报价单都能审。你拍照发我，我标注问题发回给你。线上完成，不需要见面。',
  },
  {
    q: '审完就完了吗？施工中出了问题你管吗？',
    a: '管。上面写了——审核过的项目如果在施工中被变相加价，我帮你追。不是"一次性服务"，是我在为你站台。',
  },
  {
    q: '能帮我砍价吗？',
    a: '我不帮你砍价。我给你的是一份逐项标注的报告——"第3页第5项水电点位多算了¥1,200"——拿着这个去谈，你不需要砍价，你只需要问"这一项为什么是这个价"。这是两种谈判。',
  },
  {
    q: '你不怕退款吗？',
    a: '17年经验。如果我的审核会出错，我不会拿自己的全额退款开玩笑。敢保证，是因为我知道自己看到的东西不会错。',
  },
]

export default function QuoteReviewPage() {
  return (
    <>
      <StructuredData
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: '装修报价零加价保障审查',
            description:
              '17年装修经验的人逐项审核您的报价单，13个风险边界逐一排查。24小时内出详细审核报告。审核过的项目如在施工中被变相加价，帮您追回差额。追不回，全额退款。',
            provider: { '@type': 'Person', name: 'Zeno' },
            offers: { '@type': 'Offer', priceCurrency: 'CNY', price: '2500' },
            url: 'https://zenoaihome.com/services/quote-review',
          },
        ]}
      />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(222,210,190,0.42),transparent_38%)]" aria-hidden />
        <Container size="content" className="relative py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Zeno Quote Review · 旗舰服务
          </p>
          <h1 className="editorial-display mt-5 max-w-4xl text-[2.2rem] leading-[1.12] text-ink sm:text-[3.2rem]">
            你在装修上多花的每一块钱，都是因为签合同之前没有17年经验的人帮你看了一眼报价单。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
            一份装修报价单，少则几页，多则几十页。你不需要看懂——你只需要找一个看得懂的人，帮你在签字之前把每一个可能变成加价通知的隐藏项都找出来。
          </p>

          {/* 价格 */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-ink">¥2,500</span>
            <span className="text-base text-ink-muted">/ 一次审核，24小时内出结果</span>
          </div>

          {/* 保证 */}
          <div className="mt-3 border-l-2 border-stone pl-4">
            <p className="text-sm font-semibold text-stone">
              审核过的项目施工中被变相加价 → 我帮你追回差额。追不回，全额退款。
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              这不是营销话术。这是17年经验给我的一双手——我知道合同上哪一行字会在第几周变成加价通知。
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CTA href="/contact" label="把报价单发给我 →" variant="primary" />
            <p className="text-sm text-ink-muted">
              微信 zanxiansheng2025 · 备注「审报价」· 拍照发来就行
            </p>
          </div>
        </Container>
      </section>

      <Container size="content" className="py-section">

        {/* ── 你得到什么 ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-ink mb-3">¥2,500，你得到什么</h2>
          <p className="text-sm text-ink-muted mb-8 max-w-2xl">
            不是"这份报价有问题"，而是<b>第3页第5项水电点位按'个'报价却没写超出单价，如果多加3个插座，成本从¥800变成¥3,200</b>。这个颗粒度。
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                label: '逐项审核报告',
                desc: '13个风险边界，逐项排查。每个问题标注到"第几页第几行、具体什么风险、建议怎么改"。',
              },
              {
                label: '24小时内交付',
                desc: '你今晚发，明天下午拿到报告。不耽误你的签约时间。着急的话跟我说，我会尽量快。',
              },
              {
                label: '你只做一件事',
                desc: '把报价单拍照发给我。不用整理Excel，不用打字说明，不需要"先学习怎么看报价"——拍张照，等报告。',
              },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone mb-3">
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed text-ink">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 13个风险边界 ── */}
        <section className="mb-16 border border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            13个风险边界，逐项排查
          </h2>
          <p className="text-sm text-ink-muted mb-6">
            每一个都是17年工地经验里真实发生过的事——不是理论，是血泪。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {boundaries.map((b) => (
              <div key={b.label} className="border border-border bg-canvas p-4">
                <h3 className="text-sm font-semibold text-ink">{b.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{b.risk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 赠品价值堆叠 ── */}
        <section className="mb-16 border-2 border-stone bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-2">
            不只是审核——你还免费获得这些
          </h2>
          <p className="text-sm text-ink-muted mb-6 max-w-2xl">
            一份¥2,500的报价审核 = ¥4,096的价值。不是因为定价低，是因为这些事我们做起来不费力，但对你价值巨大。
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bonusItems.map((bonus) => (
              <div key={bonus.name} className="border border-border bg-canvas p-5">
                <p className="text-lg font-bold text-stone">{bonus.value}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{bonus.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{bonus.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4 flex items-baseline gap-3">
            <span className="text-sm text-ink-muted line-through">赠品总价值 ¥1,596</span>
            <span className="text-2xl font-bold text-ink">¥0</span>
            <span className="text-sm text-ink-muted">购买审核服务即免费获得</span>
          </div>
        </section>

        {/* ── 风险逆转：保证 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">
            你的风险是零。我的风险是全额退款。
          </h2>
          <div className="border-2 border-stone bg-surface p-6 sm:p-8">
            <p className="text-sm text-ink-muted mb-5">
              成交最大的阻力不是你嫌贵，是你担心"买了没用"。所以我们把这个风险从你身上转移到我自己身上：
            </p>
            <ul className="space-y-3">
              {guaranteeItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink">
                  <span className="mt-0.5 shrink-0 text-stone font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-ink-faint max-w-2xl">
            让客户零风险买，不是因为我敢赌——是因为我17年看过的报价单告诉我：我的判断不会错。如果错了，是我该退的钱，不是客户该赔的装修款。
          </p>
        </section>

        {/* ── 算账 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">算一笔账</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {comparison.map((col) => (
              <div key={col.label} className="border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-ink mb-4">{col.label}：</p>
                <ul className="space-y-2">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-muted">
                      <span className="shrink-0 text-stone">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 border border-stone bg-surface-warm p-5">
            <p className="text-sm font-semibold text-ink mb-2">你可能会损失 ¥20,000+，也可能花 ¥2,500 避免这笔损失。</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              这是 12.5% 的保险费用。任何保险都不会写"理赔不成功，全额退保费"。我们敢。因为我们的赔付率是零——17年里，审过的地方没有被加价成功的案例。
            </p>
          </div>
        </section>

        {/* ── 为什么是 ¥2,500 ── */}
        <section className="mb-16 border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink mb-4">为什么是 ¥2,500</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                num: '¥20,000+',
                label: '不审核的平均损失',
                desc: '一份没审过的报价单，隐藏加价项平均多算2-5万。这是17年的真实数据。',
              },
              {
                num: '12.5%',
                label: '保险费率',
                desc: '¥2,500帮你避免¥20,000的损失——花1块钱，省8块。这个回报率，任何理财产品都给不了。',
              },
              {
                num: '17年',
                label: '你买的不只是审核',
                desc: '是17年里见过几千份报价单、几百个工地现场的人，用经验帮你挡一次坑。一次就够了。',
              },
            ].map((item) => (
              <div key={item.label} className="text-center p-4">
                <p className="text-2xl font-bold text-stone">{item.num}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 不适合这个服务的人 ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-4">谁不适合这个服务</h2>
          <p className="text-sm text-ink-muted mb-5">
            我们不接所有单。只接我们能真正帮到的。如果你属于以下情况，这个服务对你可能不是最优解：
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {notForItems.map((item) => (
              <div key={item.label} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.label}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-ink mb-6">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 最终 CTA ── */}
        <section className="border-2 border-stone bg-surface-warm p-6 sm:p-8 text-center">
          <h2 className="text-xl font-semibold text-ink mb-3">
            现在，把你的报价单发给我
          </h2>
          <p className="text-2xl font-bold text-stone tracking-wide mb-2">zanxiansheng2025</p>
          <p className="text-sm text-ink-muted mb-5 max-w-md mx-auto">
            加微信，备注「审报价」。把报价单拍照发来。24小时内，你手里会有一份被17年经验看过、13个风险边界逐一排查、每一个问题都标注到"第几页第几行"的审核报告。
          </p>
          <p className="text-xs text-ink-faint">
            审核过的项目施工中被变相加价，我帮你追回差额。追不回，¥2,500全额退款。这不是促销话术——这是承诺。
          </p>
        </section>

        {/* ── 还不确定？先用免费工具 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">还不确定？</h2>
          <p className="text-sm text-ink leading-relaxed mb-2">
            先用免费的「装修报价风险初筛」扫一眼你的报价单。
          </p>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            花2分钟，系统帮你标记风险区域。如果扫完你觉得安心了——那可能真的没问题，¥2,500省下来了。
            如果扫完你心里更没底了——那种"不确定感"就是¥2,500帮你消除的东西。你知道怎么找我。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/tools/quote-check" label="先做免费初筛 →" variant="primary" />
            <CTA href="/blog" label="先看文章，建立判断 →" variant="secondary" />
          </div>
        </section>

        {/* ── 签完合同了？盯施工 ── */}
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="text-lg font-semibold text-ink mb-3">签完合同，要开工了？</h2>
          <p className="text-sm text-ink-muted mb-5 max-w-xl">
            如果你已经签了合同准备开工，施工节点顾问可以在每个关键节点帮你看一眼——水电、防水、贴砖、竣工。拍照片发我，告诉你看什么、漏了什么。¥2,000起，第一个节点不满意全额退款。
          </p>
          <div className="flex flex-wrap gap-4">
            <CTA href="/services/node-advisor" label="¥2,000起 节点顾问 →" variant="primary" />
            <CTA href="/renovation" label="看完整判断路径 →" variant="secondary" />
          </div>
        </section>

      </Container>
    </>
  )
}
