import { test, expect } from '@playwright/test';
const base='http://127.0.0.1:5173/';
const mobile='https://github.com/HaiyuGame/Haiyu.Mobile';
async function fits(page){const size=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}));expect(size.scrollWidth).toBeLessThanOrEqual(size.width);expect(size.scrollHeight).toBeLessThanOrEqual(size.height);}
test('desktop screenshot switching, theme and downloads',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:900});await page.goto(base);await fits(page);
 await expect(page.getByRole('img',{name:/首页实机截图/})).toBeVisible();await page.getByRole('tab',{name:'游戏页',exact:true}).click();await expect(page.locator('.screenshot img')).toHaveAttribute('src','/launcher.png');await page.getByRole('tab',{name:'首页',exact:true}).click();await expect(page.locator('.screenshot img')).toHaveAttribute('src','/home.png');
 await page.getByRole('button',{name:'切换深色主题'}).click();await page.reload();await expect(page.locator('.site')).toHaveClass(/dark/);await page.screenshot({path:'test-results/dark.png'});await page.getByRole('button',{name:'切换浅色主题'}).click();await page.getByRole('button',{name:'下载 Windows 版'}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('link',{name:/Microsoft Store/})).toHaveAttribute('href',/apps.microsoft.com/);await page.keyboard.press('Escape');
 await page.screenshot({path:'test-results/desktop.png'});await page.getByRole('tab',{name:'功能',exact:true}).click();await page.getByRole('button',{name:'云鸣潮',exact:true}).click();await expect(page.locator('.feature-detail')).toContainText('抽卡记录分析');await fits(page);await page.getByRole('tab',{name:'常见问题'}).click();await page.getByRole('button',{name:'遇到问题怎么办？'}).click();await expect(page.getByRole('link',{name:'GitHub Issues'})).toBeVisible();await fits(page);expect(errors).toEqual([]);
});
test('developer and mobile pages with hash links',async({page})=>{
 await page.goto(base+'#developers');await expect(page.getByRole('heading',{name:'技术栈',exact:true})).toBeVisible();await page.getByRole('tab',{name:'开始开发'}).click();await expect(page.locator('.clone-command')).toContainText('git clone');await page.getByRole('tab',{name:'相关文档'}).click();await expect(page.getByRole('link',{name:/Pull requests/})).toHaveAttribute('href',/\/pulls$/);await fits(page);await page.screenshot({path:'test-results/developers.png'});
 await page.getByRole('link',{name:'手机客户端',exact:true}).click();await expect(page).toHaveURL(/#mobile$/);await expect(page.getByRole('link',{name:'下载 Android 版'})).toHaveAttribute('href',mobile);await expect(page.getByRole('link',{name:'前往下载'})).toHaveAttribute('href',mobile);await page.reload();await expect(page.getByRole('heading',{name:'Android 客户端'})).toBeVisible();await fits(page);await page.screenshot({path:'test-results/android.png'});
});
test('all views fit desktop and mobile screens',async({page})=>{
 for(const viewport of [{width:1280,height:720},{width:390,height:844},{width:375,height:667}]){
 await page.setViewportSize(viewport);await page.goto(base+'#desktop');await fits(page);
 for(const tab of ['功能','常见问题','界面预览']){await page.getByRole('tab',{name:tab,exact:true}).click();await fits(page)}
 if(viewport.width===390)await page.screenshot({path:'test-results/mobile.png'});
 await page.getByRole('link',{name:'开发者',exact:true}).click();for(const tab of ['开始开发','相关文档','项目结构']){await page.getByRole('tab',{name:tab}).click();await fits(page)}
 await page.getByRole('link',{name:'手机客户端',exact:true}).click();await fits(page);
 }
});
test('preview fits resized windows and keeps the full bitmap',async({page})=>{
 for(const viewport of [{width:1407,height:719},{width:939,height:719},{width:752,height:575},{width:626,height:479}]){
 await page.setViewportSize(viewport);await page.goto(base+'#desktop');await expect(page.locator('.intro-top .eyebrow')).toHaveCount(0);
 for(const name of ['首页','游戏页']){await page.getByRole('tab',{name,exact:true}).click();await expect(page.locator('.screenshot')).toHaveClass(/image-ready/);await fits(page);const state=await page.locator('.preview-container').evaluate(el=>({h:el.clientHeight,sh:el.scrollHeight,w:el.clientWidth,sw:el.scrollWidth}));expect(state.sh).toBeLessThanOrEqual(state.h+1);expect(state.sw).toBeLessThanOrEqual(state.w+1);await expect(page.locator('.screenshot img')).toHaveCSS('object-fit','contain');}
 if(viewport.width===939)await page.screenshot({path:'test-results/preview-939.png'});
 }
});
test('developer frame stays fixed and README contains original requirements',async({page})=>{
 await page.setViewportSize({width:1407,height:719});await page.goto(base+'#developers');let frame;
 for(const tab of ['技术栈','项目结构','开始开发','相关文档']){await page.getByRole('tab',{name:tab,exact:true}).click();const box=await page.locator('.developer-panel').boundingBox();if(!frame)frame=box;expect(box.width).toBeCloseTo(frame.width,0);expect(box.height).toBeCloseTo(frame.height,0);expect(box.x).toBeCloseTo(frame.x,0);}
 await page.getByRole('tab',{name:'开始开发'}).click();await expect(page.locator('.readme-content')).toContainText('RAM最低要求32GB');await expect(page.locator('.readme-content')).toContainText('src/WutheringWavesTool.slnx');await page.screenshot({path:'test-results/readme.png'});
 await page.getByRole('link',{name:'桌面客户端',exact:true}).click();await page.getByRole('tab',{name:'常见问题'}).click();await page.getByRole('button',{name:'与官方启动器兼容吗？'}).click();await expect(page.locator('.answer')).toContainText('与官方启动器完全不兼容');
 await page.getByRole('tab',{name:'功能',exact:true}).click();await expect(page.locator('.feature-points article')).toHaveCount(4);await page.screenshot({path:'test-results/features.png'});
});
test('loading and transition animations respect reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base);await expect(page.locator('.boot-loader')).toHaveClass(/loaded/);await expect(page.locator('.panel')).toHaveCSS('animation-name','panel-enter');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.panel')).toHaveCSS('animation-name','none');
});
test('feedback group entry and performance promotion removal',async({page})=>{await page.goto(base);await expect(page.getByRole('tab',{name:'性能优化',exact:true})).toHaveCount(0);await expect(page.locator('.performance-entry')).toHaveCount(0);await expect(page.locator('.header-actions .feedback-link')).toHaveAttribute('href','https://qm.qq.com/q/37qXKhoSYE');await page.getByRole('tab',{name:'常见问题'}).click();await page.getByRole('button',{name:'遇到问题怎么办？'}).click();await expect(page.locator('.feedback-actions').getByRole('link',{name:'加入反馈群'})).toHaveAttribute('href','https://qm.qq.com/q/37qXKhoSYE');await page.setViewportSize({width:375,height:667});await fits(page);await expect(page.locator('.header-actions .feedback-link')).toBeVisible();});
test('ambient background follows motion preference without blocking content',async({page})=>{
 await page.goto(base);const canvas=page.locator('.ambient-background');await expect(canvas).toHaveAttribute('aria-hidden','true');await expect(canvas).toHaveAttribute('data-animated','false');await expect(canvas).toHaveCSS('pointer-events','none');
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(canvas).toHaveAttribute('data-animated','true');await page.getByRole('tab',{name:'功能',exact:true}).click();await expect(page.getByRole('heading',{name:'功能',exact:true})).toBeVisible();await page.screenshot({path:'test-results/ambient.png'});
 await page.emulateMedia({reducedMotion:'reduce'});await expect(canvas).toHaveAttribute('data-animated','false');
});
test('tools category explains extensions and links to feedback group',async({page})=>{
 await page.goto(base);await page.getByRole('tab',{name:'功能',exact:true}).click();await expect(page.getByRole('button',{name:'截图',exact:true})).toHaveCount(0);await page.getByRole('button',{name:'工具',exact:true}).click();await expect(page.locator('.feature-points')).toContainText('FPS 监控');await expect(page.locator('.feature-points')).toContainText('PC 性能监控');await expect(page.locator('.feature-points')).toContainText('Windows 内存清理');await expect(page.locator('.extension-callout').getByRole('link',{name:'加入反馈群'})).toHaveAttribute('href','https://qm.qq.com/q/37qXKhoSYE');await page.screenshot({path:'test-results/tools.png'});
});
test('release assets, mirror switching and official fallback',async({page})=>{
 await page.route('https://api.github.com/repos/HaiyuGame/Haiyu/releases/latest',r=>r.fulfill({json:{tag_name:'v1.2.3',draft:false,prerelease:false,assets:[{id:1,name:'Haiyu-x64.zip',size:10485760,browser_download_url:'https://github.com/HaiyuGame/Haiyu/releases/download/v1.2.3/Haiyu-x64.zip'},{id:2,name:'Haiyu.msix',size:20971520,browser_download_url:'https://github.com/HaiyuGame/Haiyu/releases/download/v1.2.3/Haiyu.msix'},{id:3,name:'evil.exe',size:1,browser_download_url:'https://example.com/evil.exe'}]}}));
 await page.goto(base);await page.getByRole('button',{name:'下载 Windows 版'}).click();await expect(page.getByLabel('安装包',{exact:true})).toBeVisible();await expect(page.getByLabel('安装包',{exact:true}).locator('option')).toHaveCount(2);
 await page.getByLabel('下载线路',{exact:true}).selectOption('ghproxy');await expect(page.getByRole('link',{name:'下载所选安装包'})).toHaveAttribute('href','https://gh-proxy.org/https://github.com/HaiyuGame/Haiyu/releases/download/v1.2.3/Haiyu-x64.zip');
 await page.getByLabel('安装包',{exact:true}).selectOption('2');await page.getByLabel('下载线路',{exact:true}).selectOption('ghfast');await expect(page.getByRole('link',{name:'下载所选安装包'})).toHaveAttribute('href','https://ghfast.top/https://github.com/HaiyuGame/Haiyu/releases/download/v1.2.3/Haiyu.msix');
 await page.getByLabel('下载线路',{exact:true}).selectOption('github');await expect(page.getByRole('link',{name:'下载所选安装包'})).toHaveAttribute('href','https://github.com/HaiyuGame/Haiyu/releases/download/v1.2.3/Haiyu.msix');await page.screenshot({path:'test-results/downloads.png'});
});
test('release query failure can retry through mirror',async({page})=>{
 await page.route('https://api.github.com/repos/HaiyuGame/Haiyu/releases/latest',r=>r.fulfill({status:403,json:{message:'rate limit'}}));await page.route('https://gh-proxy.org/https://api.github.com/repos/HaiyuGame/Haiyu/releases/latest',r=>r.fulfill({json:{tag_name:'v2',draft:false,prerelease:false,assets:[]}}));
 await page.goto(base);await page.getByRole('button',{name:'下载 Windows 版'}).click();await expect(page.getByRole('status').filter({hasText:'版本查询暂时限流'})).toBeVisible();await page.getByRole('button',{name:'使用镜像查询'}).click();await expect(page.getByText('当前版本暂无支持的安装包，请查看发布页。')).toBeVisible();await expect(page.getByRole('link',{name:'GitHub Releases',exact:true})).toBeVisible();
});
test('SEO metadata and static crawlable content exist',async({page,request})=>{
 const html=await (await request.get(base)).text();expect(html).toContain('name="robots" content="index,follow');expect(html).toContain('application/ld+json');expect(html).toContain('Haiyu 启动器下载：鸣潮、战双帕弥什');expect(html).toContain('rel="canonical" href="https://website.haiyu.party/"');await page.goto(base);await expect(page).toHaveTitle(/Haiyu 启动器下载.*鸣潮/);expect(await (await request.get(base+'robots.txt')).text()).toContain('Sitemap: https://website.haiyu.party/sitemap.xml');expect(await (await request.get(base+'sitemap.xml')).text()).toContain('<loc>https://website.haiyu.party/</loc>');
});
