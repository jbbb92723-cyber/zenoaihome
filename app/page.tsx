export default function HomePage() {
  return (
    <main>
      <section className="container hero">
        <div className="kicker">Zeno AI Home / 赞诺内容母站</div>
        <h1>从工地看世界，帮你做更清醒、更耐久的居住选择。</h1>
        <p>
          我是赞诺，一个从工地走出来的现实派生活建造者。这里不是普通装修技巧库，
          而是把真实工地经验、生活观察、长期主义判断和 AI 工具实践，沉淀成可复用的内容资产。
        </p>
        <p>
          <a className="btn" href="/admin/publish">进入发布后台</a>
          <a className="btn secondary" href="#services">查看服务方向</a>
        </p>
      </section>

      <section className="container">
        <h2>我主要讲什么</h2>
        <div className="grid">
          {[
            ["居住与装修", "预算、报价、施工、材料、工地、交付。"],
            ["美学与生活", "家不是样板间，是长期生活的容器。"],
            ["人性与判断", "装修表面是花钱，本质是在不确定里做判断。"],
            ["成长与长期主义", "一个传统行业人如何重建自己的能力结构。"],
            ["AI与个体升级", "AI 不是替代人，而是放大人的判断和经验。"]
          ].map(([title, desc]) => (
            <div className="card" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" id="services">
        <h2>服务入口</h2>
        <div className="grid">
          {[
            ["装修报价单审核", "帮你看漏项、单价、工艺、增项边界。"],
            ["装修预算咨询", "帮你把硬装、定制、家具家电和入住预算分清楚。"],
            ["真实居住派装修服务", "不只追求好看，更关注长期实住。"],
            ["AI+传统行业内容系统咨询", "帮传统行业老板搭建内容资产系统。"]
          ].map(([title, desc]) => (
            <div className="card" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
              <p className="small">咨询入口：【待补充】</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
