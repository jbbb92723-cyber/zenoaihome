import type { QuoteImportRow } from './types'

export const MAX_QUOTE_IMPORT_BYTES = 10 * 1024 * 1024

export const quoteFieldKeys = [
  'category',
  'itemName',
  'specification',
  'unit',
  'quantity',
  'unitPrice',
  'total',
  'notes',
] as const

export type QuoteFieldKey = (typeof quoteFieldKeys)[number]
export type QuoteFieldMapping = Record<QuoteFieldKey, number | null>

export type ParsedSheet = {
  name: string
  rows: string[][]
}

export type ParsedQuoteFile = {
  fileName: string
  kind: 'csv' | 'xlsx'
  sheets: ParsedSheet[]
}

export type DetectedQuoteLayout = {
  headerRowIndex: number
  mapping: QuoteFieldMapping
}

const FIELD_ALIASES: Record<QuoteFieldKey, string[]> = {
  category: ['分类', '类别', '分项', '章节', '项目分类', '工程类别', '大类'],
  itemName: ['项目名称', '项目名', '名称', '施工项目', '报价项目', '清单项目', '项目内容', '品名'],
  specification: ['规格', '型号', '品牌规格', '规格型号', '材料规格', '工艺说明', '项目特征'],
  unit: ['单位', '计量单位'],
  quantity: ['数量', '工程量', '面积', '用量'],
  unitPrice: ['单价', '综合单价', '单位价格', '材料单价', '人工单价'],
  total: ['合价', '总价', '金额', '小计', '合计', '项目金额', '综合合价'],
  notes: ['备注', '说明', '补充说明', '施工说明', '备注说明'],
}

function normalizeHeader(value: string) {
  return value
    .replace(/\s+/g, '')
    .replace(/[（(].*?[）)]/g, '')
    .replace(/[：:]/g, '')
    .toLowerCase()
}

function aliasScore(value: string, aliases: string[]) {
  const normalized = normalizeHeader(value)
  if (!normalized) return 0
  let best = 0
  for (const alias of aliases) {
    const target = normalizeHeader(alias)
    if (normalized === target) best = Math.max(best, 10)
    else if (normalized.includes(target) || target.includes(normalized)) best = Math.max(best, 5)
  }
  return best
}

function detectDelimiter(text: string) {
  const candidates = [',', '\t', ';'] as const
  const sample = text.slice(0, 20_000)
  let best: { delimiter: string; count: number } = { delimiter: ',', count: -1 }

  for (const delimiter of candidates) {
    let count = 0
    let quoted = false
    for (let index = 0; index < sample.length; index += 1) {
      const char = sample[index]
      if (char === '"') {
        if (quoted && sample[index + 1] === '"') index += 1
        else quoted = !quoted
      } else if (!quoted && char === delimiter) {
        count += 1
      }
    }
    if (count > best.count) best = { delimiter, count }
  }

  return best.delimiter
}

export function parseCsv(text: string): string[][] {
  const input = text.replace(/^\uFEFF/, '')
  const delimiter = detectDelimiter(input)
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"' && field.length === 0) {
      quoted = true
    } else if (char === delimiter) {
      row.push(field.trim())
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[index + 1] === '\n') index += 1
      row.push(field.trim())
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  row.push(field.trim())
  if (row.some((cell) => cell.length > 0)) rows.push(row)
  return rows
}

async function parseXlsx(file: File): Promise<ParsedSheet[]> {
  const xlsx = await import('read-excel-file/browser')
  const sheets = (await xlsx.default(file)).map(({ sheet: name, data }) => {
    const rows = data
      .map((row) => row.map((cell) => {
        if (cell === null || cell === undefined) return ''
        if (cell instanceof Date) return cell.toISOString().slice(0, 10)
        return String(cell).trim()
      }))
      .filter((row) => row.some(Boolean))
    return { name, rows }
  })

  return sheets.filter((sheet) => sheet.rows.length > 0)
}

function replacementCharacterCount(value: string) {
  return value.split('\uFFFD').length - 1
}

async function readCsvText(file: File) {
  const bytes = await file.arrayBuffer()
  const utf8Text = new TextDecoder('utf-8').decode(bytes)
  const utf8ReplacementCount = replacementCharacterCount(utf8Text)

  if (utf8ReplacementCount === 0) return utf8Text

  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return utf8Text
  } catch {
    // Invalid UTF-8 bytes are common in GBK/GB18030 exports from local quote software.
  }

  try {
    const gb18030Text = new TextDecoder('gb18030').decode(bytes)
    return replacementCharacterCount(gb18030Text) < utf8ReplacementCount
      ? gb18030Text
      : utf8Text
  } catch {
    return utf8Text
  }
}

export async function parseQuoteFile(file: File): Promise<ParsedQuoteFile> {
  if (file.size > MAX_QUOTE_IMPORT_BYTES) {
    throw new Error('文件超过 10 MB，请先精简后再导入。')
  }

  const lowerName = file.name.toLowerCase()
  if (lowerName.endsWith('.csv')) {
    return {
      fileName: file.name,
      kind: 'csv',
      sheets: [{ name: 'CSV', rows: parseCsv(await readCsvText(file)) }],
    }
  }

  if (lowerName.endsWith('.xlsx')) {
    return {
      fileName: file.name,
      kind: 'xlsx',
      sheets: await parseXlsx(file),
    }
  }

  throw new Error('目前只支持 CSV 和 XLSX 文件。')
}

export function detectQuoteLayout(rows: string[][]): DetectedQuoteLayout {
  const candidates = rows.slice(0, 12).map((row, headerRowIndex) => {
    const mapping = Object.fromEntries(quoteFieldKeys.map((key) => [key, null])) as QuoteFieldMapping
    const usedColumns = new Set<number>()
    let score = 0

    for (const key of quoteFieldKeys) {
      let best: { column: number; score: number } | null = null
      for (let column = 0; column < row.length; column += 1) {
        if (usedColumns.has(column)) continue
        const cell = row[column]
        const currentScore = aliasScore(cell, FIELD_ALIASES[key])
        if (currentScore > 0 && (!best || currentScore > best.score)) {
          best = { column, score: currentScore }
        }
      }
      if (best) {
        mapping[key] = best.column
        usedColumns.add(best.column)
        score += best.score
      }
    }

    if (mapping.itemName !== null) score += 10
    if (mapping.total !== null || mapping.unitPrice !== null) score += 5
    return { headerRowIndex, mapping, score }
  })

  return candidates.sort((left, right) => right.score - left.score)[0] ?? {
    headerRowIndex: 0,
    mapping: Object.fromEntries(quoteFieldKeys.map((key) => [key, null])) as QuoteFieldMapping,
  }
}

function cellAt(row: string[], column: number | null) {
  return column === null ? '' : (row[column] ?? '').trim()
}

function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-' || trimmed === '/') return null
  const negative = /^\(.*\)$/.test(trimmed)
  const normalized = trimmed
    .replace(/[￥¥$,，\s]/g, '')
    .replace(/[()]/g, '')
    .replace(/[^\d.+-]/g, '')
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) return null
  return negative ? -parsed : parsed
}

function toCents(value: string) {
  const parsed = parseNumber(value)
  return parsed === null ? null : Math.round(parsed * 100)
}

export function mapQuoteRows({
  sheet,
  headerRowIndex,
  mapping,
}: {
  sheet: ParsedSheet
  headerRowIndex: number
  mapping: QuoteFieldMapping
}): QuoteImportRow[] {
  const rows: QuoteImportRow[] = []

  sheet.rows.slice(headerRowIndex + 1).forEach((row, offset) => {
    const itemName = cellAt(row, mapping.itemName)
    const category = cellAt(row, mapping.category)
    const specification = cellAt(row, mapping.specification)
    const unit = cellAt(row, mapping.unit)
    const quantity = parseNumber(cellAt(row, mapping.quantity))
    const unitPriceCents = toCents(cellAt(row, mapping.unitPrice))
    const explicitTotal = toCents(cellAt(row, mapping.total))
    const totalCents = explicitTotal ?? (
      quantity !== null && unitPriceCents !== null
        ? Math.round(quantity * unitPriceCents)
        : null
    )

    if (!itemName && !category && totalCents === null) return

    // The original workbook is retained separately. Keep only provenance here;
    // columns the customer chose not to import must not be duplicated in JSON.
    const rawData: Record<string, unknown> = { __sourceSheet: sheet.name }

    const mappedSignals = [itemName, category, specification, unit].filter(Boolean).length
      + [quantity, unitPriceCents, totalCents].filter((value) => value !== null).length

    rows.push({
      section: category || null,
      itemName: itemName || category || `未命名项目 ${offset + 1}`,
      materialSpec: specification || null,
      unit: unit || null,
      quantity,
      unitPriceCents,
      amountCents: totalCents,
      description: cellAt(row, mapping.notes) || null,
      sourceRow: headerRowIndex + offset + 2,
      rawData,
      confidence: Math.min(1, Math.max(0.35, mappedSignals / 7)),
    })
  })

  return rows
}
