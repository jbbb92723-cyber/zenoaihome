import type { Metadata } from 'next'
import StageLayout from '@/components/StageLayout'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '看施工｜工地怎么盯、变更怎么留痕 | 装修判断 04',
  description:
    '开工后的判断力不是天天泡工地，而是知道每个节点该盯什么、什么时候去、争议怎么留痕。施工管理是判断力的延伸，不是时间消耗。',
  alternates: { canonical: 'https://zenoaihome.com/start/build' },
}

export default function BuildStagePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '看施工——工地怎么盯、变更怎么留痕',
          author: { '@type': 'Person', name: 'Zeno' },
          inLanguage: 'zh-CN',
          url: 'https://zenoaihome.com/start/build',
        }}
      />
      <StageLayout
        stageIndex={4}
        stageTotal={6}
        stageLabel="再看施工"
        title="盯工地不是耗时间，是盯节点"
        subtitle="开工后最容易陷入两个极端：要么完全不管，要么天天去现场。正确的做法是按关键节点去——每个节点知道看什么、留什么、签什么。"
        coreProblem={
          <>
            <p>
              工地管理的本质是「留痕」。不是你信不信工人，而是出了问题你能不能拿出证据。
              没有照片、没有签字、没有书面变更的工地，所有口头沟通最后都会变成各执一词。
            </p>
            <p>
              四个关键节点：水电、防水、瓦工、木油。每个节点都有不能错过的检查项，错过了后面的工序会把问题盖住。
            </p>
          </>
        }
        pitfalls={[
          {
            title: '水电完工没拍水电图就封槽',
            body: '槽一封，后期挂画、装柜体、加插座全是赌运气。水电完工必须拍每面墙的完整走线图，存档。',
          },
          {
            title: '防水做完不闭水试验就贴砖',
            body: '防水必须做闭水试验（蓄水 24-48 小时），通过后才能进下一道。这一步省了，渗水问题三年内一定来。',
          },
          {
            title: '现场口头变更没书面确认',
            body: '"师傅你帮我把这个插座挪一下" 听起来小事，结算时就是增项。所有变更都要写：变更内容、单价、签字。',
          },
          {
            title: '材料进场没核对就签字',
            body: '材料到场必须核对：品牌、型号、规格、数量、合格证。和合同附件一一比对，不符当场拒收。',
          },
          {
            title: '只看完工状态不看过程',
            body: '完工时看到的瓷砖平整、墙面光滑，可能是腻子打太厚、瓷砖找平水泥过厚。过程留痕比完工验收更重要。',
          },
        ]}
        criteria={[
          {
            title: '四个节点必到现场',
            body: '水电完工（封槽前）、防水闭水后（贴砖前）、瓦工完成（验阴阳角和坡度）、木油结束（验柜体和墙面）。其他时间可以远程。',
          },
          {
            title: '每次到场带三样东西',
            body: '手机（拍照）、卷尺（量尺寸）、纸笔（记问题）。问题当场提，工长当场回应，回应内容当场写下让对方签字。',
          },
          {
            title: '建立工地档案',
            body: '一个手机相册或文件夹，按节点分类：水电图、防水试验、材料核对、变更签字单。这是后面验收、出问题时唯一的依据。',
          },
          {
            title: '争议先留痕，再判断要不要找人',
            body: '现场和工长有分歧，先拍照、录视频、写文字记录。不要当场吵——情绪上头反而被对方掌握主动。',
          },
        ]}
        tools={[
          { label: '施工节点检查清单', href: '/resources' },
          { label: '工地变更签字模板', href: '/resources' },
          { label: '材料进场核对表', href: '/resources' },
        ]}
        services={[
          { label: '提交现场判断需求', href: '/services#service-form' },
        ]}
        prev={{ label: '再看合同：签约前必须改什么', href: '/start/contract' }}
        next={{ label: '再看验收：交工时收什么', href: '/start/inspect' }}
      />
    </>
  )
}
