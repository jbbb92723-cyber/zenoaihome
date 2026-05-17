import type { Metadata } from 'next'
import StageLayout from '@/components/StageLayout'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '看验收｜装修验收怎么做、质保怎么写 | 装修判断 05',
  description:
    '验收不是签字，是对照标准一项项核。签字前把质量异议、整改时限、质保期、售后流程全部写清楚——签字之后再找对方就被动了。',
  alternates: { canonical: 'https://zenoaihome.com/start/inspect' },
}

export default function InspectStagePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '看验收——装修验收怎么做、质保怎么写',
          author: { '@type': 'Person', name: 'Zeno' },
          inLanguage: 'zh-CN',
          url: 'https://zenoaihome.com/start/inspect',
        }}
      />
      <StageLayout
        stageIndex={5}
        stageTotal={6}
        stageLabel="再看验收"
        title="签字之前是甲方，签字之后是乙方"
        subtitle="验收是你和对方关系里最后一次主动权在你手里的时刻。这一步要做的不是「走流程」，是把质保、整改、售后全部锁死。"
        coreProblem={
          <>
            <p>
              验收最大的误区是把它当成「最后一道签字」。其实它是装修周期里你议价能力最强的一刻——
              因为最后一笔尾款还在你手里，对方有动力配合。
            </p>
            <p>
              这一步要做四件事：按节点对照标准核、所有问题书面列单、整改时限和方式写清、质保和售后落到合同附件。
            </p>
          </>
        }
        pitfalls={[
          {
            title: '一次性验收所有项目',
            body: '隐蔽工程（水电、防水）的验收必须在它们完工时做，不能等竣工再验——那时候都盖住了。',
          },
          {
            title: '验收当天才到现场',
            body: '验收前 3-5 天先去走一遍，把问题列单交给工长整改。验收当天再验，避免被现场气氛带着走。',
          },
          {
            title: '问题口头说一下就签字',
            body: '所有问题必须写在《验收问题清单》上，对方签字确认，约定整改时限和复验日期。',
          },
          {
            title: '尾款一次付清',
            body: '保留 5-10% 作为质保金，约定 1 年（或质保期）后或重大问题处理完后支付，写进合同。',
          },
          {
            title: '质保只写"保修一年"',
            body: '要写：质保期多久、保修范围（哪些算、哪些不算）、响应时间（接到通知后多少小时到场）、责任划分（材料/人工/水电分别多久）。',
          },
        ]}
        criteria={[
          {
            title: '隐蔽工程现场验，不等竣工',
            body: '水电、防水必须在它们完工时验收，签《阶段验收单》。竣工时只验表面。',
          },
          {
            title: '验收前自己先走一遍',
            body: '提前 3-5 天用清单走一遍。问题列单提前交给工长，给整改时间，避免验收当天才发现一堆问题。',
          },
          {
            title: '验收清单要留两份',
            body: '一份留你，一份对方签字。整改完成后再签《整改完成确认单》，注明整改内容和复验结果。',
          },
          {
            title: '质保和售后落到合同附件',
            body: '质保期、响应时间、保修范围、维修流程、留尾款比例和支付条件——全部写成附件，签字归档。',
          },
        ]}
        tools={[
          { label: '装修验收清单', href: '/resources#yanshou-qingdan' },
          { label: '验收向导（按节点生成）', href: '/tools/inspection-guide' },
          { label: '质保售后落字模板', href: '/resources' },
        ]}
        services={[
          { label: '深度版签约前判断 ¥699（含付款和质保提醒）', href: '/services/renovation#quote-deep' },
        ]}
        prev={{ label: '再看施工：开工后盯什么', href: '/start/build' }}
        next={{ label: '再看居住：住进去顺不顺手', href: '/start/living' }}
      />
    </>
  )
}
