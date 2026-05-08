'use client'

import { useMemo, useState } from 'react'
import ToolSeoAssetSection from '@/components/tools/ToolSeoAssetSection'
import { BridgePanel, ResultPanel, ToolPageShell } from '@/components/tools/ToolPageShell'
import { toolSeoAssets } from '@/data/toolSeoAssets'

const stages = [
  {
    key: 'hydro',
    label: '水电',
    focus: '路线、点位、拍照留档、后期检修。',
    checks: ['强弱电是否分开走线', '开关插座位置是否和生活动线匹配', '水管打压是否有记录', '管线走向是否拍照留档', '厨房卫生间点位是否和设备匹配'],
    photos: ['总管走向', '厨卫水路', '强弱电交叉处', '每面墙点位'],
    redFlags: ['口头说没问题但没有照片', '水电增项没有签字确认', '点位和图纸不一致还继续封槽'],
  },
  {
    key: 'waterproof',
    label: '防水',
    focus: '闭水、墙面高度、门槛和管根。',
    checks: ['卫生间闭水是否足够时间', '楼下对应位置是否查看', '管根和阴角是否加强处理', '淋浴区墙面高度是否到位', '门槛石或挡水处理是否明确'],
    photos: ['闭水水位', '管根细节', '门口位置', '楼下顶面'],
    redFlags: ['没有闭水就贴砖', '只刷地面不处理墙面', '管根周边开裂或漏刷'],
  },
  {
    key: 'tile',
    label: '泥工瓷砖',
    focus: '空鼓、坡度、缝隙、收口。',
    checks: ['墙地砖是否有明显空鼓', '卫生间地漏坡度是否排水顺畅', '砖缝是否均匀', '阴阳角是否顺直', '门槛、窗台、阳角收口是否干净'],
    photos: ['地漏坡度测试', '空鼓标记', '阳角收口', '大面铺贴效果'],
    redFlags: ['大面积空鼓', '地漏反坡积水', '切割边粗糙还被安排美缝遮盖'],
  },
  {
    key: 'wood',
    label: '木作定制',
    focus: '尺寸、垂直、开合、收边。',
    checks: ['柜体尺寸是否和现场匹配', '门板开合是否顺畅', '墙地顶收边是否处理', '五金是否按约定品牌型号', '潮湿区域是否有防潮处理'],
    photos: ['柜体整体', '五金细节', '收边位置', '开合状态'],
    redFlags: ['柜门大面积不齐', '五金品牌替换未确认', '缝隙用胶硬遮盖'],
  },
  {
    key: 'paint',
    label: '油漆',
    focus: '基层、平整、色差、修补。',
    checks: ['墙面是否明显波浪或裂纹', '阴阳角是否顺直', '色差和流挂是否明显', '开关面板周边是否干净', '修补位置是否二次打磨'],
    photos: ['逆光墙面', '阴阳角', '开关周边', '修补位置'],
    redFlags: ['基层未干就刷漆', '大面积色差', '裂纹只用漆覆盖'],
  },
  {
    key: 'install',
    label: '安装',
    focus: '设备、洁具、灯具、门窗和收口。',
    checks: ['洁具排水是否顺畅', '灯具开关是否对应', '门窗开启是否顺滑', '电器尺寸和散热是否预留', '玻璃、五金、封边是否完整'],
    photos: ['设备铭牌', '安装收口', '通电测试', '排水测试'],
    redFlags: ['设备先装上再说', '打胶粗糙漏水', '开关回路混乱'],
  },
  {
    key: 'final',
    label: '竣工',
    focus: '资料、保修、遗留项、尾款。',
    checks: ['增减项是否结清并有明细', '保修范围和时间是否写清', '水电图纸和照片是否归档', '遗留问题是否列清单', '尾款是否和整改完成绑定'],
    photos: ['全屋现状', '遗留问题', '保修资料', '水电图纸'],
    redFlags: ['只催尾款不处理遗留项', '保修只口头承诺', '没有竣工资料交接'],
  },
]

export default function InspectionGuideClient() {
  const [stageKey, setStageKey] = useState(stages[0].key)
  const [done, setDone] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const stage = useMemo(() => stages.find((item) => item.key === stageKey) ?? stages[0], [stageKey])
  const progress = Math.round((done.length / stage.checks.length) * 100)

  function toggle(item: string) {
    setDone((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])
  }

  async function copyChecklist() {
    await navigator.clipboard.writeText(`${stage.label}验收清单\n重点：${stage.focus}\n检查项：\n${stage.checks.map((item) => `- ${item}`).join('\n')}\n拍照：\n${stage.photos.map((item) => `- ${item}`).join('\n')}\n高风险信号：\n${stage.redFlags.map((item) => `- ${item}`).join('\n')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <ToolPageShell label="Inspection Guide" title="验收不是挑刺，是把问题留在付款之前。" subtitle="选择当前施工节点，得到一份业主能看懂、能拍照、能沟通的验收清单。它不替代第三方监理，但能先把明显风险拦住。" bestFor="正在施工或准备阶段验收的人" time="5-10 分钟" prepare={["当前施工节点", "现场照片", "报价/合同"]}>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <p className="mb-3 text-sm font-semibold text-ink">选择验收节点</p>
          <div className="grid gap-2">
            {stages.map((item) => (
              <button key={item.key} type="button" onClick={() => { setStageKey(item.key); setDone([]) }} className={`border px-4 py-3 text-left text-sm ${stageKey === item.key ? 'border-stone bg-stone/5 text-ink' : 'border-border bg-canvas text-ink-muted hover:border-stone/50'}`}>
                <span className="font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed">{item.focus}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <ResultPanel title={`${stage.label}节点：完成 ${progress}%`} actions={<button type="button" onClick={copyChecklist} className="inline-flex h-10 items-center bg-stone px-4 text-sm font-semibold text-white hover:bg-stone/90">{copied ? '已复制' : '复制清单'}</button>}>
            <div className="h-2 bg-stone-pale"><div className="h-full bg-stone" style={{ width: `${progress}%` }} /></div>
          </ResultPanel>

          <div className="border border-border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-ink">现场检查</h2>
            <div className="mt-4 space-y-2">
              {stage.checks.map((item) => (
                <label key={item} className="flex cursor-pointer items-start gap-3 border border-border bg-canvas p-3 text-sm text-ink-muted hover:border-stone/50">
                  <input type="checkbox" checked={done.includes(item)} onChange={() => toggle(item)} className="mt-1 h-4 w-4 accent-stone" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">必须拍照</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">{stage.photos.map((item) => <li key={item}>- {item}</li>)}</ul>
            </div>
            <div className="border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-ink">高风险信号</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">{stage.redFlags.map((item) => <li key={item}>- {item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <BridgePanel items={[
          { label: '报价初筛工具', href: '/tools/quote-check', desc: '验收前先确认合同里有没有验收标准。' },
          { label: '找 Zeno 判断现场问题', href: '/services#service-form', desc: '清单看完仍不确定，可以提交资料。' },
          { label: '资料与清单', href: '/resources', desc: '领取预算、报价和验收相关资料。' },
        ]} />
      </section>
      <ToolSeoAssetSection asset={toolSeoAssets.inspectionGuide} />
    </ToolPageShell>
  )
}
