import { useEffect, useState } from 'react';
import { Button, Field, Select, Spinner } from '@fluentui/react-components';
import { ArrowDownload24Regular, ArrowSync24Regular, Open24Regular } from '@fluentui/react-icons';

export const downloadRoutes = [
 { id: 'github', label: 'GitHub 原始线路', prefix: '' },
 { id: 'ghproxy', label: 'GH-Proxy 镜像', prefix: 'https://gh-proxy.org/' },
 { id: 'ghfast', label: 'GHFast 镜像', prefix: 'https://ghfast.top/' },
];
const repository = 'HaiyuGame/Haiyu';
const api = `https://api.github.com/repos/${repository}/releases/latest`;
const cache = { data: null, expires: 0 };
export function validateAsset(asset) {
 if (!asset || typeof asset.name !== 'string' || !/\.(exe|msi|msix|msixbundle|appx|appxbundle|zip|7z)$/i.test(asset.name)) return false;
 try { const u = new URL(asset.browser_download_url); return u.protocol === 'https:' && u.hostname === 'github.com' && u.pathname.startsWith(`/${repository}/releases/download/`) && !u.username && !u.password && !u.search && !u.hash; } catch { return false; }
}
export function ReleaseDownloads() {
 const [route, setRoute] = useState('github');
 const [release, setRelease] = useState(null);
 const [assetId, setAssetId] = useState('');
 const [status, setStatus] = useState('loading');
 const [message, setMessage] = useState('');
 const [attempt, setAttempt] = useState(0);
 const [metadataRoute, setMetadataRoute] = useState('github');
 const [copied, setCopied] = useState(false);
 useEffect(() => {
  const controller = new AbortController(); let active = true;
  const timeout = setTimeout(() => controller.abort(), 10000);
  async function load() {
   setStatus('loading'); setMessage('');
   try {
    let data = cache.expires > Date.now() ? cache.data : null;
    if (!data) {
     const prefix = downloadRoutes.find(r => r.id === metadataRoute).prefix;
     const response = await fetch(prefix + api, { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/vnd.github+json' } });
     if (!response.ok) throw new Error(response.status === 404 ? '还没有可下载的正式版本。' : response.status === 403 || response.status === 429 ? '版本查询暂时限流，请稍后重试或打开发布页。' : '版本查询失败，请重试或切换查询线路。');
     data = await response.json();
     if (!data || typeof data.tag_name !== 'string' || !Array.isArray(data.assets) || data.draft || data.prerelease) throw new Error('版本信息格式异常，请前往 GitHub 发布页确认。');
     // Cache only validated, narrowly scoped release data; never render remote HTML.
     data = { tag_name: data.tag_name, published_at: data.published_at, assets: data.assets.filter(validateAsset).map(a => ({ id: String(a.id), name: a.name, size: Number(a.size) || 0, browser_download_url: a.browser_download_url, digest: typeof a.digest === 'string' && /^sha256:[a-f0-9]{64}$/i.test(a.digest) ? a.digest : null })) };
     cache.data = data; cache.expires = Date.now() + 5 * 60 * 1000;
    }
    if (active) { setRelease(data); setAssetId(data.assets[0]?.id || ''); setStatus(data.assets.length ? 'ready' : 'empty'); }
   } catch (e) { if (active) { setStatus('error'); setMessage(e.name === 'AbortError' ? '版本查询超时，请重试或使用镜像查询。' : e.message); } }
   finally { clearTimeout(timeout); }
  }
  load(); return () => { active = false; clearTimeout(timeout); controller.abort(); };
 }, [attempt, metadataRoute]);
 const selected = release?.assets.find(a => a.id === assetId);
 const source = downloadRoutes.find(r => r.id === route);
 const href = selected ? source.prefix + selected.browser_download_url : '';
 const retry = (mirror = false) => { setMetadataRoute(mirror ? 'ghproxy' : 'github'); setAttempt(a => a + 1); };
 const copy = async () => { try { await navigator.clipboard.writeText(href); setCopied(true); } catch { setCopied(false); } };
 return <section className="release-downloads" aria-label="GitHub 安装包下载"><div className="release-heading"><strong>下载安装包</strong>{release && <span>{release.tag_name}</span>}</div>
 {status === 'loading' && <div className="release-state" role="status"><Spinner size="tiny"/>正在获取最新正式版本…</div>}
 {(status === 'error' || status === 'empty') && <div className="release-state error-state" role="status"><p>{status === 'empty' ? '当前版本暂无支持的安装包，请查看发布页。' : message}</p><div><Button onClick={() => retry()} icon={<ArrowSync24Regular/>}>重试</Button><Button onClick={() => retry(true)}>使用镜像查询</Button></div></div>}
 {status === 'ready' && <><Field label="安装包"><Select value={assetId} onChange={(_, d) => {setAssetId(d.value); setCopied(false);}}>{release.assets.map(a => <option key={a.id} value={a.id}>{a.name} · {(a.size / 1024 / 1024).toFixed(1)} MB</option>)}</Select></Field><Field label="下载线路"><Select value={route} onChange={(_, d) => {setRoute(d.value); setCopied(false);}}>{downloadRoutes.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}</Select></Field><div className="release-buttons"><Button as="a" href={href} target="_blank" rel="noreferrer" appearance="primary" icon={<ArrowDownload24Regular/>}>下载所选安装包</Button><Button onClick={copy}>{copied ? '已复制' : '复制链接'}</Button></div>{selected?.digest && <details className="asset-digest"><summary>GitHub 提供的 SHA-256</summary><code>{selected.digest.slice(7)}</code></details>}</>}
 <a className="original-releases" href="https://github.com/HaiyuGame/Haiyu/releases" target="_blank" rel="noreferrer">GitHub Releases <Open24Regular/></a>
 </section>;
}

