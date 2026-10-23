# shifang37.com — 个人主页

纯静态站点（HTML + CSS + 原生 JS），零依赖、零构建。
托管在境外免费平台，域名解析在阿里云云解析，**不需要 ICP 备案**。

---

## 1. 目录结构

```
personal-web/
├── index.html          页面内容和结构（改文字基本都在这里）
├── assets/
│   ├── style.css       样式（配色在文件顶部的变量里）
│   └── main.js         主题切换 / 移动端菜单 / 滚动淡入
├── preview.mjs         本地预览服务器（只用于本地，不要上传也没关系）
├── robots.txt          告诉搜索引擎可以抓取
├── CNAME               GitHub Pages 绑定自定义域名用（Vercel 会忽略）
├── docs/
│   └── aliyun-beian.md 路线 B：阿里云服务器 + ICP 备案全套流程
├── deploy/
│   ├── nginx.conf      服务器上的 Nginx 站点配置模板
│   └── upload.ps1      一键上传静态文件到服务器
└── README.md
```

## 2. 本地预览

```powershell
node preview.mjs
```

然后打开 <http://127.0.0.1:5500> 。改完文件刷新浏览器就能看到效果，按 `Ctrl+C` 停止。

> 也可以直接双击 `index.html` 打开，但那样 `mailto:` 之外的一些行为可能和线上略有差别，建议用上面的方式。

## 3. 上线前必须改的地方

打开 `index.html`，搜索替换下面这些（都在 HTML 注释里标了「改这里」）：

| 位置 | 现在的内容 | 改成 |
|---|---|---|
| `<title>` / `brand` / `h1` / 页脚 | `你的名字` | 你的真名或昵称 |
| Hero 的 `.lede` | 示例自我介绍 | 一两句话介绍你自己 |
| `.meta` 三个标签 | 📍 深圳 / 💼 开放合作 / 🎧 | 你的实际情况，或直接删掉 |
| 「关于我」三段 | 示例文案 | 你的经历 |
| `.skills` 标签 | TypeScript / React ... | 你真会的技术 |
| 三张 `.project` 卡片 | 项目名称一/二/三 | 你的项目，链接填仓库或演示地址 |
| `mailto:hello@shifang37.com` | 占位邮箱 | 你真实的邮箱 |
| GitHub / X 链接 | `你的用户名` | 你的账号，没有就删掉整个 `<a>` |

顺手把 `og:title`、`og:description`、`<meta name="description">` 也换成自己的，分享出去更好看。

## 4. 部署（两种都免费，二选一）

### 方案一：Vercel（推荐，最省事）

1. 把项目推到一个 GitHub 仓库：
   ```powershell
   cd C:\Users\shifang37\Desktop\personal-web
   git init
   git add .
   git commit -m "init: personal homepage"
   ```
   在 GitHub 上新建仓库（不要勾选 README），然后：
   ```powershell
   git remote add origin https://github.com/你的用户名/personal-web.git
   git branch -M main
   git push -u origin main
   ```
2. 打开 <https://vercel.com>，用 GitHub 登录 → **Add New → Project** → 选这个仓库 → **Deploy**。
   这是纯静态站，**不需要填 Build Command，Framework 选 Other**，Output Directory 留空。
3. 部署完成后会得到 `xxx.vercel.app`，先访问确认没问题。
4. 进入项目 **Settings → Domains → Add**，填 `shifang37.com`，再 Add 一次 `www.shifang37.com`。
5. Vercel 会显示需要添加的 DNS 记录，照着下一步在阿里云填。

### 方案二：GitHub Pages

1. 同上推到 GitHub，仓库 **Settings → Pages → Source** 选 `main` 分支 `/ (root)`，Save。
2. **Custom domain** 填 `shifang37.com`，Save（仓库里自带的 `CNAME` 文件内容就是它）。
3. 等几分钟，勾上 **Enforce HTTPS**。

## 5. 阿里云 DNS 怎么填

登录阿里云控制台 → **域名** → `shifang37.com` → **解析设置** → **添加记录**。

### 如果托管在 Vercel

| 记录类型 | 主机记录 | 记录值 | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | 600 |
| CNAME | `www` | `cname.vercel-dns.com` | 600 |

### 如果托管在 GitHub Pages

| 记录类型 | 主机记录 | 记录值 | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |
| CNAME | `www` | `你的用户名.github.io` | 600 |

> ⚠️ 两条注意事项：
> 1. **具体 IP / 域名以平台后台显示的为准**，平台改过 DNS 值的话按平台来，不要照抄别处的旧教程。
> 2. `@` 和 `www` 都要加。只加 `@` 的话 `www.shifang37.com` 会打不开。
> 3. 阿里云云解析支持 `@` 的 CNAME，但会和 MX 等其他记录冲突；以后要开企业邮箱就改用 A 记录。

## 6. 验证是否生效

```powershell
# 看解析结果（应该返回上面的 IP 或 CNAME）
nslookup shifang37.com
nslookup www.shifang37.com

# 或者在浏览器里
# https://shifang37.com
# https://www.shifang37.com
```

DNS 生效通常 10 分钟到几小时，最长按 TTL 算。HTTPS 证书是平台自动签发的，
域名解析生效后一般几分钟内就能拿到，第一次访问如果提示证书问题，等一会儿再刷新。

## 7. 常见问题

**访问显示「不安全」/ 证书错误**
证书要等平台签发完成。Vercel 一般在 DNS 验证通过后 1~5 分钟自动签好；GitHub Pages 需要先在 Pages 设置里勾 **Enforce HTTPS**。

**改了内容但线上没变**
浏览器缓存，`Ctrl+F5` 强制刷新。GitHub Pages 本身有几十秒的构建延迟。

**域名打不开，但 `xxx.vercel.app` 正常**
DNS 没生效或记录填错。用上面的 `nslookup` 检查，注意别把 IP 填成 CNAME。

**想用 `hello@shifang37.com` 这个邮箱**
域名只买了域名本身，不带邮箱。需要单独开通邮箱服务（阿里云企业邮箱免费版、飞书邮箱等），
然后添加服务商给的 MX 记录。在那之前，把页面上的邮箱换成你现在用的。

**以后想要后端 / 数据库**
换到阿里云轻量应用服务器（大陆地域），那就**必须做 ICP 备案**（1~20 个工作日）。
静态站也可以先放阿里云 OSS + CDN，但同样需要备案。到时候域名不用换，只改解析记录。

**大陆访问速度一般**
境外托管不可避免，Vercel / Cloudflare 在国内通常能用，速度取决于线路。
如果对速度有要求，唯一的解法就是备案 + 大陆服务器。

## 8. 想加内容时

- **加一个项目**：复制 `index.html` 里一整块 `<article class="card project" data-reveal>`，改文字和编号。
- **换配色**：只改 `assets/style.css` 顶部 `:root` 里 `--accent`、`--accent-2` 两个变量。
- **加页面**（比如 `blog.html`）：复制 `index.html` 的 header / footer，中间换成新内容，导航里加链接。
- **加图片**：放进 `assets/`，用相对路径 `<img src="assets/photo.jpg" alt="说明">`。
  注意压缩，单张控制在 300KB 以内。
