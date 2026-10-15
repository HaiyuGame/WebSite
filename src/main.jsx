import React, { useEffect, useState, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { FluentProvider, webLightTheme, webDarkTheme, Button, TabList, Tab, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@fluentui/react-components';
import { ArrowDownload24Regular, ArrowRight24Regular, WeatherMoon24Regular, WeatherSunny24Regular, Games24Regular, Cloud24Regular, Person24Regular, Wrench24Regular, Code24Regular, Dismiss24Regular, Open24Regular, Phone24Regular, Copy24Regular } from '@fluentui/react-icons';
import './style.css';
import AmbientBackground from './AmbientBackground';
const ReleaseDownloads = lazy(() => import('./ReleaseDownloads').then(m => ({ default: m.ReleaseDownloads })));
const ReactMarkdown = lazy(() => import('react-markdown'));
import desktopReadme from './content/desktop-readme.md?raw';
const readmeSection = (title) => desktopReadme.split('### ' + title)[1]?.split(/\r?\n### |\r?\n---/)[0]?.trim() || '';
function ReadmeContent({ title }) { return <div className="readme-content"><Suspense fallback={<p role="status">正在加载文档…</p>}><ReactMarkdown components={{a: ({href, children}) => <a href={href?.startsWith('http') ? href : 'https://github.com/HaiyuGame/Haiyu/blob/main/' + href} target="_blank" rel="noreferrer">{children}</a>}}>{readmeSection(title)}</ReactMarkdown></Suspense></div>; }
const repo = 'https://github.com/HaiyuGame/Haiyu';
const mobileRepo = 'https://github.com/HaiyuGame/Haiyu.Mobile';
const feedbackGroup = 'https://qm.qq.com/q/37qXKhoSYE';
const pages = [['desktop', '桌面客户端'], ['mobile', '手机客户端'], ['developers', '开发者']];
const featureDetails = [
 { subtitle: '从安装到更新，在启动器内管理游戏文件。', points: [['游戏下载', '选择游戏和渠道，下载对应的游戏文件。'], ['版本更新', '在同一个入口处理游戏更新，更新后再启动游戏。'], ['文件校验', '检查游戏文件，排查文件缺失或损坏问题。'], ['多渠道', '支持国服、国际服、B 服、台服，具体选项见客户端。']], steps: '选择游戏与渠道 → 下载或更新 → 校验文件 → 启动游戏', image: '/launcher.png' },
 { subtitle: '登录库街区后，查看账号数据并使用日常工具。', points: [['账号登录', '支持手机号和 Token 两种库街区登录方式。'], ['数据面板', '查看已登录账号的游戏数据。'], ['自动签到', '使用库街区自动签到功能。'], ['扫码登录', '登录库街区后，支持扫描二维码登录游戏。']], steps: '登录库街区 → 选择账号 → 查看数据或使用签到与扫码登录', image: '/home.png' },
 { subtitle: '启动器内集成云鸣潮入口与抽卡记录分析。', points: [['云游戏入口', '从启动器进入云鸣潮。'], ['一键登录', '在启动器中登录并游玩云鸣潮。'], ['抽卡分析', '查看抽卡记录分析，了解抽取结果。']], steps: '打开云鸣潮 → 登录账号 → 进入云游戏', image: '/launcher.png' },
 { subtitle: '通过后台服务提供监控与系统工具。扩展功能请加入反馈群获取。', points: [['FPS 监控', '监控游戏帧率，查看游戏运行时的 FPS 表现。'], ['PC 性能监控', '查看 PC 性能数据，了解游戏运行时的系统状态。'], ['Windows 内存清理', '提供 Windows 内存清理工具。']], steps: '加入反馈群 → 获取扩展功能与使用说明 → 按说明启用后台服务', image: '/home.png' },
];
const features = [
 { icon: Games24Regular, name: '游戏管理', description: '下载、更新和校验鸣潮与战双游戏文件。支持国服、国际服、B 服、台服等渠道。', tags: ['鸣潮', '战双帕弥什'] },
 { icon: Person24Regular, name: '库街区', description: '手机号或 Token 登录，查看游戏数据、自动签到，以及扫码登录游戏。', tags: ['数据面板', '扫码登录'] },
 { icon: Cloud24Regular, name: '云鸣潮', description: '在启动器内登录云鸣潮，查看抽卡记录分析。', tags: ['云游戏', '抽卡记录'] },
 { icon: Wrench24Regular, name: '工具', description: '后台服务：FPS 监控、PC 性能监控与 Windows 内存清理。加入反馈群获取扩展功能。', tags: ['后台服务', '扩展功能'] },
];
const questions = [
 ['支持哪些游戏？', '支持鸣潮、战双帕弥什，以及云鸣潮。可用渠道以启动器内的选项为准。'],
 ['如何安装和更新？', '通过 Microsoft Store 安装，或在 GitHub Releases 下载发布包。系统要求和版本信息见发布页面。'],
 ['与官方启动器兼容吗？', 'Haiyu 与官方启动器完全不兼容。Haiyu 是独立开源项目，并非库洛游戏官方产品。请勿按兼容官方启动器的方式混用。游戏名称、标识与画面属于各自权利方。'],
 ['遇到问题怎么办？', '可以加入 QQ 反馈群，或在 GitHub Issues 提交应用版本、复现步骤和日志。提交前请隐藏手机号、Token 等个人信息。'],
];
const readPage = () => { const p = location.hash.slice(1); return pages.some(([id]) => id === p) ? p : 'desktop'; };
function ExternalButton({ href, children, ...props }) { return <Button as="a" href={href} target="_blank" rel="noreferrer" {...props}>{children}</Button>; }

function BootLoader() {
 const [ready, setReady] = useState(false);
 useEffect(() => {
  let active = true;
  const image = new Image(); image.src = '/favicon.png';
  Promise.allSettled([image.decode(), document.fonts.ready]).then(() => { if (active) setReady(true); });
  return () => { active = false; };
 }, []);
 return <div className={`boot-loader${ready ? ' loaded' : ''}`} aria-hidden={ready} role="status"><img src="/favicon.png" alt=""/><strong>Haiyu</strong><span className="loading-track"/><span>正在加载</span></div>;
}
function Screenshot({ src, alt }) {
 const [status, setStatus] = useState('loading');
 return <figure className={`screenshot image-${status}`} aria-busy={status === 'loading'}>
 {status === 'loading' && <div className="image-skeleton" role="status"><span className="loading-track"/><span>正在加载截图</span></div>}
 <img src={src} alt={alt} onLoad={() => setStatus('ready')} onError={() => setStatus('error')}/>
 {status === 'error' && <div className="image-error" role="status">截图加载失败，请刷新重试。</div>}
 </figure>;
}

function App() {
 const [page, setPage] = useState(readPage);
 const [tab, setTab] = useState('preview');
 const [shot, setShot] = useState('home');
 const [feature, setFeature] = useState(0);
 const [question, setQuestion] = useState(0);
 const [devTab, setDevTab] = useState('stack');
 const [dark, setDark] = useState(() => localStorage.getItem('haiyu-theme') === 'dark');
 const [download, setDownload] = useState(false);
 const [copied, setCopied] = useState(false);
 useEffect(() => { const sync = () => setPage(readPage()); addEventListener('hashchange', sync); return () => removeEventListener('hashchange', sync); }, []);
 useEffect(() => { document.title = page === 'desktop' ? 'Haiyu 启动器下载｜鸣潮、战双帕弥什｜Windows 与 Android' : page === 'mobile' ? 'Haiyu Android 手机客户端下载｜库洛游戏工具' : 'Haiyu 开发者文档｜开源库洛游戏启动器 · C# 与 WinUI 3'; }, [page]);
 const go = (id) => { location.hash = id; setPage(id); };
 const toggle = () => { setDark(!dark); localStorage.setItem('haiyu-theme', !dark ? 'dark' : 'light'); };
 const copy = async () => { try { await navigator.clipboard.writeText(`git clone ${repo}.git`); setCopied(true); } catch { setCopied(false); } };
 const current = features[feature]; const FeatureIcon = current.icon;
 return <FluentProvider theme={dark ? webDarkTheme : webLightTheme} className={`site${dark ? ' dark' : ''}`}>
 <AmbientBackground dark={dark}/><BootLoader/><header className="header"><a href="#desktop" className="brand"><img src="/favicon.png" alt=""/>Haiyu</a><nav aria-label="页面导航">{pages.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={page === id ? 'page' : undefined}>{label}</a>)}</nav><div className="header-actions"><ExternalButton appearance="subtle" href={feedbackGroup} className="feedback-link">加入反馈群</ExternalButton><Button appearance="subtle" aria-label={dark ? '切换浅色主题' : '切换深色主题'} icon={dark ? <WeatherSunny24Regular/> : <WeatherMoon24Regular/>} onClick={toggle}/><ExternalButton appearance="subtle" href={repo} icon={<Code24Regular/>} aria-label="GitHub 仓库"><span className="github-label">GitHub</span></ExternalButton></div></header>
 <main className="workspace">
 <aside className="intro">
 <div className="intro-top" key={page}><h1>{page === 'desktop' ? <>Haiyu<span>库洛游戏启动器</span></> : page === 'mobile' ? <>Haiyu<span>手机客户端</span></> : <>开发者<span>源码与开发</span></>}</h1><p>{page === 'desktop' ? '管理鸣潮与战双，查看库街区数据。常用的游戏工具，集中在一个窗口。' : page === 'mobile' ? 'Haiyu 的 Android 客户端。安装包与版本说明通过 GitHub 仓库发布。' : '桌面客户端使用 C# 与 WinUI 3。你可以查看源码、提交问题，或参与开发。'}</p></div>
 <div className="intro-actions">{page === 'desktop' ? <><Button size="large" appearance="primary" icon={<ArrowDownload24Regular/>} onClick={() => setDownload(true)}>下载 Windows 版</Button><ExternalButton href={repo} appearance="transparent" iconPosition="after" icon={<Open24Regular/>}>查看源码</ExternalButton><span className="action-note">Microsoft Store / GitHub Releases</span></> : page === 'mobile' ? <><ExternalButton href={mobileRepo} appearance="primary" size="large" icon={<ArrowDownload24Regular/>}>下载 Android 版</ExternalButton><span className="action-note">前往 Haiyu.Mobile 发布仓库</span></> : <><ExternalButton href={repo} appearance="primary" size="large" icon={<Code24Regular/>}>打开源码仓库</ExternalButton><ExternalButton href={repo + '/issues'} appearance="transparent" icon={<ArrowRight24Regular/>} iconPosition="after">提交问题</ExternalButton></>}</div>
 <div className="intro-bottom"><img src="/favicon.png" alt=""/><span>Haiyu<span>{page === 'developers' ? 'C# · .NET · WinUI 3' : '鸣潮 / 战双帕弥什'}</span></span></div>
 </aside>
 <div className="content-area" key={page}>
 {page === 'desktop' && <><TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value)} aria-label="桌面客户端内容"><Tab value="preview">界面预览</Tab><Tab value="features">功能</Tab><Tab value="faq">常见问题</Tab></TabList><section key={tab} className={`panel desktop-panel ${tab}-container`} aria-label={tab === 'preview' ? '界面预览' : tab === 'features' ? '功能' : '常见问题'}>
 {tab === 'preview' && <div className="preview-panel"><div className="panel-heading"><div><h2>{shot === 'home' ? '首页' : '游戏页'}</h2><p>{shot === 'home' ? '活动、账号和工具入口。' : '游戏状态、账号数据与启动入口。'}</p></div><TabList size="small" selectedValue={shot} onTabSelect={(_, d) => setShot(d.value)} aria-label="预览截图"><Tab value="home">首页</Tab><Tab value="game">游戏页</Tab></TabList></div><Screenshot key={shot} src={shot === 'home' ? '/home.png' : '/launcher.png'} alt={shot === 'home' ? 'Haiyu 首页实机截图：当前活动、账号列表、数据面板、资源简报、养成计算器、活动日历、大地图和游戏签到入口' : 'Haiyu 游戏页实机截图：鸣潮背景、账号数据与进入游戏按钮'}/><div className="panel-note"><span>Windows 客户端实机截图</span><span>Fluent Design</span></div></div>}
 {tab === 'features' && <div className="detail-panel features-panel"><div className="panel-heading"><div><h2>功能</h2><p>按用途查看具体功能与使用流程。</p></div></div><div className="selector-row">{features.map(({ icon: Icon, name }, i) => <Button key={name} appearance={feature === i ? 'primary' : 'subtle'} icon={<Icon/>} onClick={() => setFeature(i)} aria-pressed={feature === i}>{name}</Button>)}</div><div className="feature-detail" key={feature}><div className="feature-summary"><FeatureIcon/><div><h3>{current.name}</h3><p>{featureDetails[feature].subtitle}</p></div></div><div className="feature-points">{featureDetails[feature].points.map(([title, text]) => <article key={title}><h4>{title}</h4><p>{text}</p></article>)}</div><div className="usage-flow"><strong>使用流程</strong><p>{featureDetails[feature].steps}</p></div>{feature === 3 && <div className="extension-callout"><div><strong>加入反馈群，获取这些扩展功能</strong><span>FPS 监控、PC 性能监控和 Windows 内存清理。</span></div><ExternalButton href={feedbackGroup} appearance="primary" icon={<Open24Regular/>}>加入反馈群</ExternalButton></div>}<div className="feature-bottom"><div className="tags">{current.tags.map(t => <span key={t}>{t}</span>)}</div><span>可用功能以当前客户端版本为准。</span></div></div></div>}
 {tab === 'faq' && <div className="detail-panel"><div className="panel-heading"><div><h2>常见问题</h2><p>安装、支持范围与问题反馈。</p></div></div><div className="qa-layout"><div className="question-list">{questions.map(([q], i) => <Button key={q} appearance={question === i ? 'primary' : 'subtle'} onClick={() => setQuestion(i)} aria-pressed={question === i}>{q}</Button>)}</div><article className="answer" key={question}><h3>{questions[question][0]}</h3><p>{questions[question][1]}</p>{question === 3 && <div className="feedback-actions"><ExternalButton href={feedbackGroup} appearance="primary" icon={<Open24Regular/>}>加入反馈群</ExternalButton><ExternalButton href={repo + '/issues'} appearance="outline" icon={<Open24Regular/>}>GitHub Issues</ExternalButton></div>}</article></div></div>}
 </section></>}
 {page === 'mobile' && <><div className="page-label"><Phone24Regular/>手机客户端</div><section className="panel mobile-panel"><img className="mobile-logo" src="/favicon.png" alt="Haiyu 应用图标"/><div className="mobile-copy"><span className="eyebrow">Haiyu.Mobile</span><h2>Android 客户端</h2><p>下载和版本说明请查看发布仓库。</p><ExternalButton href={mobileRepo} appearance="primary" size="large" icon={<ArrowDownload24Regular/>}>前往下载</ExternalButton><ExternalButton href={mobileRepo} appearance="transparent" icon={<Open24Regular/>}>HaiyuGame / Haiyu.Mobile</ExternalButton></div><div className="mobile-note"><strong>安装说明</strong><p>在仓库中查看发布状态，按对应版本说明下载和安装。具体功能与系统要求以发布说明为准。</p></div></section></>}
 {page === 'developers' && <><TabList selectedValue={devTab} onTabSelect={(_, d) => setDevTab(d.value)} aria-label="开发者内容"><Tab value="stack">技术栈</Tab><Tab value="overview">项目结构</Tab><Tab value="start">开始开发</Tab><Tab value="more">相关文档</Tab></TabList><section key={devTab} className="panel developer-panel"><div className="panel-heading"><div><h2>{devTab === 'stack' ? '技术栈' : devTab === 'overview' ? '项目结构速览（不完整）' : devTab === 'start' ? '怎么跑起来以及编译注意事项' : '想深入？'}</h2><p>内容取自项目 README。</p></div><ExternalButton appearance="subtle" href={repo + '#readme'} aria-label="打开原始 README" icon={<Open24Regular/>}/></div>
 {devTab === 'stack' && <div className="readme-content"><table><thead><tr><th>层级</th><th>技术</th></tr></thead><tbody>{[['框架', '.NET 10 + WinUI 3 (Windows App SDK 2.0)'], ['语言', 'C# preview+'], ['模式', 'MVVM+DI Service'], ['打包', 'MSIX / 独立 EXE 双模式发布']].map(([name,value]) => <tr key={name}><td>{name}</td><td>{value}</td></tr>)}</tbody></table><p className="readme-source">完整项目说明、致谢与开源协议请查看 <a href={repo + '#readme'} target="_blank" rel="noreferrer">仓库 README</a>。</p></div>}
 {devTab === 'overview' && <ReadmeContent title="项目结构速览（不完整）"/>}
 {devTab === 'start' && <><ReadmeContent title="怎么跑起来以及编译注意事项"/><div className="clone-command"><code>git clone {repo}.git</code><Button aria-label="复制克隆命令" icon={<Copy24Regular/>} onClick={copy}/></div><span className="copy-status" role="status">{copied ? '已复制' : '可选中命令手动复制'}</span></>}
 {devTab === 'more' && <><ReadmeContent title="想深入？"/><div className="developer-links"><ExternalButton href={feedbackGroup} appearance="primary">加入反馈群</ExternalButton><ExternalButton appearance="outline" href={repo + '/issues'}>Issues</ExternalButton><ExternalButton appearance="outline" href={repo + '/pulls'}>Pull requests</ExternalButton><ExternalButton appearance="outline" href={repo + '/blob/main/src/ReadMe.md'}>发布方式说明</ExternalButton></div></>}
 </section></>}
 </div></main>
 <footer><span>© {new Date().getFullYear()} Haiyu</span><span>独立开源项目，非库洛官方产品。</span><a href={page === 'mobile' ? mobileRepo : repo} target="_blank" rel="noreferrer">GitHub <Open24Regular/></a></footer>
 <Dialog open={download} onOpenChange={(_, d) => setDownload(d.open)}><DialogSurface className="download-dialog"><DialogBody><DialogTitle action={<Button appearance="subtle" aria-label="关闭下载窗口" icon={<Dismiss24Regular/>} onClick={() => setDownload(false)}/>}>下载 Haiyu</DialogTitle><DialogContent><p className="dialog-description">选择 Windows 客户端的安装方式。系统要求与版本信息见发布页面。</p>{[['Microsoft Store', '通过应用商店安装与更新', 'https://apps.microsoft.com/detail/9p70bt6bvwfh?hl=zh-CN&gl=CN'], ].map(([title, text, url]) => <a key={title} className="download-option" href={url} target="_blank" rel="noreferrer"><ArrowDownload24Regular/><div><strong>{title}</strong><span>{text}</span></div><Open24Regular/></a>)}<Suspense fallback={<p role="status">正在加载下载选项…</p>}><ReleaseDownloads/></Suspense></DialogContent><DialogActions><Button onClick={() => {setDownload(false); go('mobile');}}>查看 Android 客户端</Button><Button onClick={() => setDownload(false)}>关闭</Button></DialogActions></DialogBody></DialogSurface></Dialog>
 </FluentProvider>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);






