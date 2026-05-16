import type { Metadata } from 'next'
import StageLayout from '@/components/StageLayout'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '看居住｜装修对居住体验的影响、怎么避免住进去才后悔 | 装修判断 06',
  description:
    '装修判断的终点不是交工，是住得顺手。先把你的真实生活场景写清楚，再回头看方案——风格在生活面前永远是次要的。',
  alternates: { canonical: 'https://zenoaihome.com/start/living' },
}

export default function LivingStagePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '看居住——装修对居住体验的影响、怎么避免住进去才后悔',
          author: { '@type': 'Person', name: 'Zeno' },
          inLanguage: 'zh-CN',
          url: 'https://zenoaihome.com/start/living',
        }}
      />
      <StageLayout
        stageIndex={6}
        stageTotal={6}
        stageLabel="再看居住"
        title="装修的终点不是交工，是住得顺手"
        subtitle="风格再好，住进去不顺手就是失败。判断方案值不值得做，不是看效果图漂不漂亮，是看它符不符合你每天的真实动作。"
        coreProblem={
          <>
            <p>
              很多人装修完才发现：插座位置不对、动线绕远、收纳不够、采光被柜体挡了、卫生间高峰期排队。
              这些问题不是装修出了错，是设计阶段没有把&ldquo;真实生活&rdquo;写进方案。
            </p>
            <p>
              这一步要在装修开始前就做：把你和家人一天的真实动作列出来，再回头看方案能不能支撑。
              方案服务生活，不是生活迁就方案。
            </p>
          </>
        }
        pitfalls={[
          {
            title: '只看风格不看场景',
            body: '"我想要日式" / "我想要侘寂"——这些是审美表达，不是设计需求。先写场景，再选风格。',
          },
          {
            title: '收纳按"美观"做，不按"使用频率"',
            body: '高频物品收进高柜或储藏间，低频物品摆在客厅显眼处——这是反着的。收纳要按使用频率排位置。',
          },
          {
            title: '插座按效果图排，不按生活动作排',
            body: '床头要充手机、沙发要充电脑、阳台要洗衣机、卫生间要吹风机——这些都是开关插座的真实位置。',
          },
          {
            title: '动线被柜体或岛台切断',
            body: '从玄关到厨房、从厨房到餐厅、从卧室到卫生间——画一下你每天走的线，看方案有没有把这些线切断。',
          },
          {
            title: '采光被设计感"挡掉"',
            body: '高柜、隔断、半墙这些设计元素，先看会不会挡掉自然光。一旦挡了，再贵的灯光都补不回来。',
          },
        ]}
        criteria={[
          {
            title: '先写"一日三场景"再看方案',
            body: '早上 7-9 点、中午 12-14 点、晚上 19-22 点——你和家人各在哪个空间、做什么、用什么、需要什么。写下来给设计师看。',
          },
          {
            title: '收纳分三层：日用、周用、季用',
            body: '日用：30 秒能拿到。周用：1 分钟能拿到。季用：可以收进储藏间或高柜。按这个标准核柜体位置和大小。',
          },
          {
            title: '动线按"重复路径"画',
            body: '一天走 10 次以上的路径必须最短：床到卫生间、厨房到餐桌、玄关到衣柜。其他路径可以为美观让步。',
          },
          {
            title: '关键决策点先试不能装',
            body: '岛台高度、椅子高度、洗手台高度、床高、橱柜高度——能现场比一比就比一比，参数化决定不靠想象。',
          },
        ]}
        tools={[
          { label: '居住场景自查表', href: '/resources#shizhu-pai-zijian-biao' },
          { label: '入住前后复盘表', href: '/resources#living-beyond-completion' },
        ]}
        services={[
          { label: '居住场景装修服务 ¥9800 起（南宁本地）', href: '/services/renovation#shi-zhu-pai-zhuangxiu' },
        ]}
        prev={{ label: '再看验收：交工时收什么', href: '/start/inspect' }}
      />
    </>
  )
}
