import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
  table: ({ node: _node, ...props }) => (
    <div className="article-table-scroll" tabIndex={0} role="region" aria-label="可横向滚动的表格">
      <table {...props} />
    </div>
  ),
}
