import type { Metadata } from 'next'
import StageLayout from '@/components/StageLayout'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '看合同｜装修合同怎么审、口头承诺怎么落字 | 装修判断 03',
  description:
    '装修合同签完就改不了。签约前把口头承诺写进去，把材料型号写清楚，把付款节点、工期、违约责任都定清楚——出了问题才有依据。',
  alternates: { canonical: 'https://zenoaihome.com/start/contract' },
}

export default function ContractStagePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '看合同——装修合同怎么审、口头承诺怎么落字',
          author: { '@type': 'Person', name: 'Zeno' },
          inLanguage: 'zh-CN',
          url: 'https://zenoaihome.com/start/contract',
        }}
      />
      <StageLayout
        stageIndex={3}
        stageTotal={6}
        stageLabel="再看合同"
        title="合同是你后面唯一能用的武器"
        subtitle="谈得再好，落不到字面上都是空话。签约前必须把口头承诺、材料型号、付款节点、工期、违约责任全部写进去——这是你后面所有判断的依据。"
        coreProblem={
          <>
            <p>
              很多人签合同时被一句话带过：「放心，到时候肯定给你做。」这句话在合同没落字之前，等于零。
              合同是你和对方关系破裂时唯一能用的武器，不是友好时才看的文件。
            </p>
            <p>
              这一步要做三件事：让对方把模糊的报价改成具体的合同条款；让口头承诺以书面附件形式写进合同；让付款节点、增项规则、工期、违约责任全部具体到可执行。
            </p>
          </>
        }
        pitfalls={[
          {
            title: '"按实际增减项目结算"——没说怎么算',
            body: '这句话最坑。一定要追问：什么算实际？谁来确认？按什么单价？没有书面流程的"按实际"，等于对方说了算。',
          },
          {
            title: '材料只写品牌不写型号',
            body: '"使用某品牌"和"使用某品牌某型号"是两件事。同品牌不同型号价差能差三倍。型号、规格、替换规则必须写清楚。',
          },
          {
            title: '付款节点和验收脱钩',
            body: '"水电完成付 30%" 不够。要写：水电完成且通过双方验收且无质量异议后付 30%。验收的标准也要附在合同后面。',
          },
          {
            title: '工期只写天数不写顺延规则',
            body: '"工期 90 天"对方一周不开工也算开工。要写：开工日期、顺延条件（哪些情况可顺延、最多顺延多少天）、延期违约金。',
          },
          {
            title: '增项没有签字流程',
            body: '现场说一句「加个插座」就增项，最后结算时才看到数字。要写：增项必须书面确认、单价提前定、未签字不算。',
          },
        ]}
        criteria={[
          {
            title: '签约前先列"必改清单"',
            body: '把你看到的所有含糊条款列出来，签约前一次性提出修改。一旦签字，后面只能口头沟通，对方没有任何动力改。',
          },
          {
            title: '所有"另计 / 暂估"要在合同里给上限',
            body: '另计和暂估不是不能写，但要给数量上限和单价。"水电按实结算，但不超过 ¥XX，超出部分书面确认"才是可控的。',
          },
          {
            title: '把口头承诺写进合同附件',
            body: '"赠送一套柜体""赠送清运"这种口头话，必须写成附件，标明数量、品牌、规格、何时交付。',
          },
          {
            title: '验收标准提前附在合同后',
            body: '每个节点的验收标准（什么算合格、用什么工具验）必须提前定，不是验收当天对方说了算。',
          },
        ]}
        tools={[
          { label: '合同签约前检查模板', href: '/checklists/contract-pre-signing-check' },
          { label: '风险词典：口头承诺未写入合同', href: '/risk-dictionary/oral-promise-not-written' },
          { label: '报价初筛工具', href: '/tools/quote-check' },
        ]}
        services={[
          { label: '深度版签约前判断 ¥699', href: '/services/renovation#quote-deep' },
        ]}
        prev={{ label: '再看钱：预算 + 报价', href: '/start/budget' }}
        next={{ label: '再看施工：开工后盯什么', href: '/start/build' }}
      />
    </>
  )
}
