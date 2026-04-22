# 诊断：Vercel 部署源检查

生成时间：2026-04-22

---

## 背景

本地代码已修改并 build 通过，但 zenoaihome.com 显示的仍是旧版本。
这是 Vercel 部署源或 DNS 的问题，不是代码问题。

---

## 你需要在浏览器里做的检查

### 第一步：登录 Vercel

打开：https://vercel.com/dashboard

---

### 第二步：找到对应项目

在 Dashboard 里找到你的项目（名字可能是 zeno-site 或 zenoaihome）。

**要确认的事：**

| 检查项 | 你需要看哪里 |
|--------|-------------|
| 绑定的 GitHub 仓库是哪个 | 项目页 → Settings → Git |
| Root Directory 是什么 | 项目页 → Settings → General → Root Directory |
| 最近一次部署时间 | 项目页 → Deployments（第一条） |
| 最近一次部署来自哪个分支 | 项目页 → Deployments → 点开第一条 |
| 默认域名（.vercel.app）显示是否最新 | 项目页 → Domains |

---

### 第三步：区分两种问题

**情况 A：Vercel 默认域名（xxx.vercel.app）也没变**

→ 说明代码没有推送到 GitHub，Vercel 没有重新部署。

解决方法：在 `g:\Zenoaihome.com\zeno-site` 目录里执行：

```powershell
git add .
git commit -m "强制回滚首页克制风格"
git push
```

推送后 Vercel 会自动部署，等 1-2 分钟刷新页面。

---

**情况 B：Vercel 默认域名有变化，但 zenoaihome.com 没变**

→ 说明 zenoaihome.com 的 DNS 还没有指向 Vercel，仍然指向旧的 WordPress 服务器。

解决方法：
1. 登录你的域名注册商（万网/阿里云/腾讯云等）
2. 找到 zenoaihome.com 的 DNS 设置
3. 把 A 记录或 CNAME 指向 Vercel 提供的地址

Vercel 里查看正确的 DNS 地址：
→ 项目页 → Settings → Domains → 点击 zenoaihome.com → 查看「Configure DNS」

---

### 第四步：临时验证方法

不管 DNS 有没有切换，你都可以直接用 Vercel 给你分配的默认域名访问最新版本：

格式类似：`https://zeno-site-xxxxx.vercel.app`

在项目的 Deployments 页面，点开最新的部署记录，会有「Visit」按钮。
用这个地址访问，如果能看到红色测试标记，说明代码部署是对的。

---

## 总结判断树

```
浏览器看不到变化
    │
    ├── 先访问 http://localhost:3000（本地 dev server）
    │       有测试标记？ → 代码正确，问题在 Vercel
    │       没有标记？ → dev server 没启动，运行 npm run dev
    │
    └── 访问 Vercel 默认域名（xxx.vercel.app）
            有测试标记？ → Vercel 部署正确，问题在 DNS（zenoaihome.com 没切换）
            没有标记？ → 代码没有 push 到 GitHub，需要 git push
```

---

## 最快的验证路径

1. 打开 PowerShell
2. 运行：
```powershell
cd "g:\Zenoaihome.com\zeno-site"
npm run dev
```
3. 打开 http://localhost:3000
4. 看到红色小字 `【视觉回滚测试：2026-04-22】` → 本地代码正确
5. 告诉我你在哪一步没看到，我帮你判断是 git push 问题还是 DNS 问题
