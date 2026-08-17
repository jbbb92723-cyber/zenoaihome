import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: '隐私说明',
  description: 'ZenoAIHome 对账号、服务申请、订单和站点使用数据的收集、使用、保存与删除说明。',
  alternates: { canonical: 'https://zenoaihome.com/privacy' },
}

const sections = [
  {
    title: '我们收集什么',
    body: [
      '当你注册或登录时，我们会处理邮箱、姓名和必要的登录信息；如果使用 Google 登录，还会接收该登录服务提供的公开账户资料。',
      '当你申请服务、申请加入星火者或使用需要留痕的工具时，我们会处理你主动填写的姓名、微信、电话、邮箱、问题描述、诊断答案，以及你主动提交的项目背景和材料。',
      '当你创建订单或参与人工付款确认时，我们会记录订单号、商品、金额、付款方式、订单状态和必要的沟通记录。我们不会在本站保存银行卡密码或支付平台登录密码。',
      '为保障安全和了解站点使用情况，系统可能记录访问路径、来源页面、IP、浏览器信息、会话 Cookie 和匿名使用事件。',
    ],
  },
  {
    title: '这些信息用来做什么',
    body: [
      '用于创建和保护账号、提供工具结果、处理服务申请、联系你确认范围、完成订单和兑现已经确认的权益。',
      '用于排查异常请求、限制滥用、维护网站安全，以及在获得必要依据后改进内容、工具和交付流程。',
      '如果你使用站内 AI 功能，相关输入可能发送给当前配置的 AI 服务商用于生成结果。AI 输出仅作辅助，不替代合同、法律、财务、医疗或其他专业判断。',
    ],
  },
  {
    title: '谁可以访问',
    body: [
      '赞诺本人和被授权处理运营、交付或客服工作的人员，可以在完成相应工作所必需的范围内访问数据。管理员权限按工作需要分配，并记录关键操作。',
      '网站托管、数据库、身份认证、邮件、分析和 AI 等服务商，可能在提供基础服务所必需的范围内处理相应数据。我们不会把你的联系方式作为独立商品出售。',
      '除非得到你的授权、为了履行你主动发起的服务，或法律要求，我们不会公开你的个人资料和项目原始材料。公开案例会先做必要的去标识化并尽量征得你的同意。',
    ],
  },
  {
    title: '保存多久',
    body: [
      '账号数据通常保存到你提出删除请求，或保存到继续提供账号服务所必需的期限。已完成的订单、付款和服务记录，会在售后、争议处理、财务记录和法律义务所需期间保留，超过必要期限后删除或匿名化。',
      '验证码只在验证所需期间有效，当前有效期为 30 分钟；失效或使用后的验证码不会继续用于登录或验证。安全日志和匿名统计只在排查安全问题、统计使用和改进服务所需期间保留。',
      '备份、第三方基础设施和依法必须留存的记录，删除时间可能晚于在线系统。我们会在合理范围内同步清理，并以不再可识别为目标。',
    ],
  },
  {
    title: '你可以怎么做',
    body: [
      '你可以请求查看、更正或删除与你有关的资料，也可以撤回尚未完成的服务申请、停止继续提交材料，或询问某项数据的用途和保存情况。',
      '请通过联系页或邮箱说明账号邮箱、请求内容和可验证的身份信息。涉及订单、法律义务或他人权益的数据，可能只能做必要范围内的更正、限制使用或匿名化处理。',
      '提交给 AI 或第三方服务前，请主动删除身份证号、银行卡信息、密码、未公开的客户隐私和其他不必要的敏感信息。',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="bg-canvas text-ink">
      <PageHero
        label="隐私说明"
        title="你交给网站的信息，应当有清楚的去向。"
        subtitle="本说明解释 ZenoAIHome 收集哪些信息、为什么使用、谁可能访问、保存多久，以及你如何提出查看、更正或删除请求。"
        note="最后更新：2026 年 8 月 13 日"
      />

      <Container size="reading" className="py-14 sm:py-20">
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-border pt-6">
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-8 text-ink-muted">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}

          <section className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-ink">联系我们</h2>
            <p className="mt-4 text-sm leading-8 text-ink-muted">
              如果你对隐私、材料使用或删除请求有疑问，请发送邮件至{' '}
              <a href="mailto:zenoaihome@qq.com" className="font-semibold text-ink underline underline-offset-4">zenoaihome@qq.com</a>
              {' '}，或通过<Link href="/contact" className="font-semibold text-ink underline underline-offset-4">联系页</Link>沟通。我们会先核实请求人的身份，再在合理期限内处理。
            </p>
          </section>

          <p className="border-t border-border pt-6 text-xs leading-6 text-ink-faint">
            本说明适用于 ZenoAIHome 网站及其站内账号、工具、服务申请和订单相关功能。不同服务如另有单独说明，以你在提交前看到的具体说明为准。
          </p>
        </div>
      </Container>
    </main>
  )
}
