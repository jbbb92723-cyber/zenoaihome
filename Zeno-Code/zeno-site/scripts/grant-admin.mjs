import { PrismaClient } from '@prisma/client'

const email = process.argv[2]?.trim().toLowerCase()
const prisma = new PrismaClient()

if (!email || !email.includes('@')) {
  console.error('用法：npm run admin:grant -- admin@example.com')
  process.exitCode = 1
} else {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, role: true },
    })
    console.log(`已授权管理员：${user.email} (${user.role})`)
  } catch {
    console.error('授权失败。请确认该邮箱已经注册，并且数据库迁移已执行。')
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}
