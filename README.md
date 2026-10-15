# Haiyu 官网

纯前端 React + Vite，使用官方 Fluent UI React v9。页面图片存放在 public 中，无后端、无密钥、无外部字体依赖。

## 开发

npm ci
npm run dev

## 构建

npm run build
npm run preview

## Cloudflare Pages（Git 部署）

连接本仓库，选择 Vite 框架：
- 构建命令：npm run build
- 构建输出目录：dist
- Node.js：22 或更高（可设置 NODE_VERSION=22）
- 根目录：若仓库根目录就是 WebSite，留空；若是上层仓库，填写 WebSite。

若使用 Cloudflare Workers 静态资产部署，可使用仓库中的 wrangler.jsonc，先运行 npm run build，再执行 npx wrangler deploy。

## 内容维护

src/main.jsx：页面文案、功能、FAQ、下载链接。
src/style.css：布局与明暗主题。
public/launcher.png：用户提供的启动器实机截图。
public/favicon.png：来自启动器项目的应用图标。

下载入口指向 GitHub Releases 与现有 Microsoft Store 地址；上架状态、系统要求和版本以发布页面为准。网页不硬编码版本号。

## 界面测试

npm test

测试使用本机 Microsoft Edge，开发服务器会自动启动。覆盖主题切换及持久化、下载弹窗、FAQ、移动导航与横向溢出检查。

## 页面与内容

网站采用一屏布局，顶部切换页面，内容区使用 Fluent TabList 切换。常规桌面与手机尺寸无整页滚动；较矮窗口或辅助功能放大时，内容面板可局部滚动，避免文字被裁切。

- #desktop：桌面客户端，包含首页/游戏页实机截图、功能、常见问题。
- #mobile：Android 客户端，下载按钮直接指向 https://github.com/HaiyuGame/Haiyu.Mobile。
- #developers：项目结构、开发环境、克隆命令和贡献入口。
- public/home.png：用户提供的启动器首页截图。
- public/launcher.png：用户提供的启动器游戏页截图。

手机客户端仅展示已确认的 Android 发布入口，版本、具体功能与系统要求由发布仓库维护。
测试覆盖 1440×900、1280×720、390×844、375×667 页面溢出检查与页面切换。

## 本轮调整

- 开发者页使用 src/content/desktop-readme.md 作为本地 README 快照，按原章节显示。更新项目说明时重新同步此文件。
- 性能优化的专门标签、引语与入口已按反馈移除。
- 外框固定尺寸，预览图片按可用空间等比完整显示，开发者长文档仅在内部滚动。
- 原生 CSS 过渡与真实资源加载状态，支持 prefers-reduced-motion。
- 已加入缩小视口、截图溢出、外框稳定性、README 原文及动画设置测试。

- 顶部、常见问题和开发者相关文档增加 QQ 反馈群入口：https://qm.qq.com/q/37qXKhoSYE。


## 下载与搜索引擎

- Windows 下载弹窗实时查询 GitHub 最新正式 Release，缓存有效期为当前页面内存中的 5 分钟；安装包 URL 限定 HaiyuGame/Haiyu 官方仓库。
- GitHub、GH-Proxy（gh-proxy.org）、GHFast（ghfast.top）三条下载线路由用户选择。镜像属于第三方服务，不承诺速度或可用性。
- 版本查询默认直连 GitHub，超时/限流可重试或手动使用镜像查询；不携带 Token。
- 线路维护位置：src/ReleaseDownloads.jsx 的 downloadRoutes。镜像文档：https://gh-proxy.com/docs/quick-start ，https://ghfast.top/ 。
- SHA-256 如由 GitHub 返回则显示；网页没有对远端安装包执行本地校验，请用户核对签名和官方校验值。
- SEO：index.html 包含 description、robots、canonical、Open Graph、Twitter、SoftwareApplication JSON-LD 和可直接读取的静态正文。
- public/robots.txt 与 public/sitemap.xml 使用正式域名 https://website.haiyu.party/ 。修改域名时一并更新。
- 当前内容仍为同页标签切换，站点地图仅列真实首页，不列 hash 伪页面。部署后可向搜索引擎站长平台提交 sitemap.xml；收录与排名由搜索引擎决定。
