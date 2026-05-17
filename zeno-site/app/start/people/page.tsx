import type { Metadata } from 'next'
import StageLayout from '@/components/StageLayout'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '看人｜装修公司、设计师、工长、师傅怎么判断 | 装修判断 01',
  description:
    '装修第一步不是看报价，是看人。装修公司、设计师、工长、师傅各自的判断标准不同，先把人看清楚，后面的报价、合同、施工才有意义。',
  alternates: { canonical: 'https://zenoaihome.com/start/people' },
}

export default function PeopleStagePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '看人——装修公司、设计师、工长、师傅怎么判断',
          author: { '@type': 'Person', name: 'Zeno' },
          inLanguage: 'zh-CN',
          url: 'https://zenoaihome.com/start/people',
        }}
      />
      <StageLayout
        stageIndex={1}
        stageTotal={6}
        stageLabel="先看人"
        title="装修第一步不是看报价，是看人"
        subtitle="找谁做，决定了后面的报价能不能信、合同有没有用、工地能不能盯。人没看准，工具和合同都救不回来。"
        coreProblem={
          <>
            <p>
              很多业主上来就比报价、比品牌、比团购价，这一步顺序错了。
              报价是对方写出来给你看的，是包装结果；人是这份报价的来源，是包装本身。
            </p>
            <p>
              这一步要回答的是四个问题：你接触的是装修公司、独立设计师、工长，还是直接对接师傅？
              对方的角色不同，看的方法完全不同，价格也完全不同。
            </p>
          </>
        }
        pitfalls={[
          {
            title: '把销售当设计师',
            body: '第一次接触你的人，多数是销售。设计师、项目经理、工长都不是销售，区分清楚再聊。',
          },
          {
            title: '只看大品牌不看实际工长',
            body: '装修公司挂的品牌，落到你家是哪个工长在干，工长才是关键。签约前一定要确认工长身份。',
          },
          {
            title: '只看效果图不看在做工地',
            body: '效果图都精修过，在做工地才看得出真实水平。一定要去对方正在施工的现场看一次。',
          },
          {
            title: '直接找熟人工长不签合同',
            body: '熟人也要合同。出问题的时候，合同是保护熟人关系的唯一方式，不是不信任。',
          },
        ]}
        criteria={[
          {
            title: '先分清四种角色',
            body: '装修公司：销售+设计+施工一条龙，省事但贵，水分大。独立设计师：只出方案，施工需要另外找。工长：直接干活，价格低但需要自己懂监督。师傅：单工种（水电/泥工/木工），适合局部翻新。',
          },
          {
            title: '看在做的工地，不看样板间',
            body: '样板间是展示，工地是真相。看至少一个对方正在做的工地，重点看：水电走线、防水细节、收口、垃圾管理。',
          },
          {
            title: '确认实际干活的工长身份',
            body: '问清楚：我家是哪个工长？工长姓名、电话、之前做过的项目地址。签合同前要写进合同附件。',
          },
          {
            title: '判断对方是否听得懂你的需求',
            body: '把你最在意的 3 个生活场景说给对方听（例如：早上 7 点全家三人同时用卫生间）。听不懂或马上推回风格、推回报价的，不是合适的人。',
          },
        ]}
        tools={[
          { label: '看人前的判断清单（资料页）', href: '/resources' },
          { label: '看工地现场记录模板', href: '/resources' },
        ]}
        services={[
          { label: '帮你过一遍候选名单（咨询服务）', href: '/services/renovation#quote-deep' },
        ]}
        next={{ label: '再看钱：预算 + 报价', href: '/start/budget' }}
      />
    </>
  )
}
