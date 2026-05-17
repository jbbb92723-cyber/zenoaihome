import type { Metadata } from 'next'
import StageLayout from '@/components/StageLayout'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '看钱｜装修预算和报价怎么定 | 装修判断 02',
  description:
    '装修预算和报价不是一回事。预算是你愿意花多少，报价是对方想拿多少。这两个数字之间的差，就是你需要建立判断力的地方。',
  alternates: { canonical: 'https://zenoaihome.com/start/budget' },
}

export default function BudgetStagePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '看钱——装修预算和报价怎么定',
          author: { '@type': 'Person', name: 'Zeno' },
          inLanguage: 'zh-CN',
          url: 'https://zenoaihome.com/start/budget',
        }}
      />
      <StageLayout
        stageIndex={2}
        stageTotal={6}
        stageLabel="再看钱"
        title="预算是你的底线，报价是对方的开口"
        subtitle="不要拿到报价才开始想预算。先把自己愿意花的钱拆清楚，再去看报价里哪些数字合理，哪些是包装，哪些是后期肯定要加的。"
        coreProblem={
          <>
            <p>
              装修预算超支不是因为对方报价不准，而是因为你没有在签约前把预算结构想清楚。
              拿一个含糊的总数去对一个含糊的报价，最后一定超。
            </p>
            <p>
              这一步要做两件事：第一，把你的预算按取向拆开（基础、品质、亮点）；第二，把对方的报价按真实成本看穿（哪些是基础包、哪些是另计、哪些是后期增项的种子）。
            </p>
          </>
        }
        pitfalls={[
          {
            title: '只看每平米单价',
            body: '"全包 1000 元/㎡" 这种数字没有意义。要看每平米里包含什么、不包含什么、什么材料什么品牌什么型号。',
          },
          {
            title: '把"低价报价"当成捡到便宜',
            body: '明显低于市场价的报价，背后一定有补回去的方式：另计项、增项、低品质材料、人工克扣。',
          },
          {
            title: '没有给增项留预算',
            body: '哪怕全包报价，水电、墙体改造、防水加做、电路升级几乎一定会增。预留 15-20% 不为过。',
          },
          {
            title: '签约时只看总价不看付款节点',
            body: '低首付看起来好，但中期付款占比太重会让你失去议价能力。要看每个节点付多少、对应什么验收。',
          },
        ]}
        criteria={[
          {
            title: '先拆预算，再看报价',
            body: '把总预算分成三块：基础（硬装/水电/防水）、品质（厨卫/门窗/地板）、亮点（柜体/灯光/软装）。三块比例自己定，然后再拿报价对照。',
          },
          {
            title: '看报价的"四个边界"',
            body: '一份合格报价必须写清楚：包什么品牌型号、不包什么、按面积还是按个、超出多少按什么单价结算。任一项含糊都要追问。',
          },
          {
            title: '识别"另计 / 甲供 / 暂估"',
            body: '这三个词出现在哪一项，那一项的最终价就是不确定的。要么签前敲定，要么自己心里有数。',
          },
          {
            title: '比报价不要只比总价',
            body: '把两份报价的每一项拉到同一张表里比单价、比品牌、比包含范围。看完会发现"低的那家"反而贵。',
          },
        ]}
        tools={[
          { label: '报价初筛（在线工具）', href: '/tools/quote-check' },
          { label: '预算分配工具', href: '/tools/budget-structure' },
          { label: '超预算原因自测', href: '/tools/budget-risk' },
          { label: '报价风险自查指南 ¥39', href: '/pricing/baojia-guide' },
        ]}
        services={[
          { label: '报价风险快审 ¥699', href: '/services/renovation#baojia-shenhe' },
          { label: '预算取舍诊断 ¥399', href: '/services/renovation#yusuan-zixun' },
        ]}
        prev={{ label: '先看人：装修公司 / 工长 / 师傅', href: '/start/people' }}
        next={{ label: '再看合同：签约前必须改什么', href: '/start/contract' }}
      />
    </>
  )
}
