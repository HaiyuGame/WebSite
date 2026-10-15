# Haiyu 官网

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

