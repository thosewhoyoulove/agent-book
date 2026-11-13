# 《星露谷物语》原版音频本地导入说明

本项目已在本机发现 Stardew Valley `1.6.15.24356` 安装目录，并使用当前版本的 `Content/XACT/Wave Bank.xwb` 完成本地 Cue 和音乐流元数据核对及定向 WAV 导出验证。导出文件已复制到项目内被 `.gitignore` 忽略的 `apps/book-web/src/assets/private-audio/`，没有进入版本控制或公开资源目录；只有显式开启本机原版音频配置时，才会进入本机 `dist` 构建产物。

仓库中的公开音频仍然全部是 `CREDITS.md` 标注的 CC0 替代素材。下面的原版 Cue 记录只证明它们存在于本机当前版本 Wave Bank，并不代表这些原版资源获得了公开再分发许可。

## 本次本地核验记录

- 游戏路径：`F:\steam\steamapps\common\Stardew Valley`
- 游戏版本：`Stardew Valley.exe 1.6.15.24356`
- Wave Bank：`Content\XACT\Wave Bank.xwb`
- Wave Bank 流数量：437
- 解码工具：官方 vgmstream CLI `r2168-35-g24ffd6ce`
- 工具包 SHA-256：`0f57f9ce41b0815f44ea288c2b36f2efb9362c93872731f7f224d3ded2ffcb8e`
- 其他本机提取器检查：未发现 `xwb`、XACT、`ww2ogg`、FFmpeg 或其他 vgmstream 命令行工具

| 业务语义 | 原版 Cue 名称 | Wave Bank 流编号 | 本地状态 |
| --- | --- | ---: | --- |
| 普通选择 | `smallSelect` | 21 | 已核对并导出 WAV |
| 打开菜单 | `bigSelect` | 4 | 已核对并导出 WAV |
| 关闭菜单 | `bigDeSelect` | 3 | 已核对并导出 WAV |
| 翻书 | `book_read` | 424 | 已核对并导出 WAV |
| 任务完成 | `questcomplete` | 129 | 已核对并导出 WAV |
| 成就 | `achievement` | 104 | 已核对并导出 WAV |
| 收获 | `harvest` | 327 | 已核对并导出 WAV |
| 春日环境 | `spring_day_ambient` | 180 | 已核对并导出 WAV |
| 春夜环境 | `spring_night_ambient` | 346 | 已核对并导出 WAV |
| 雨声 | `rain` | 117 | 已核对并导出 WAV |
| 海浪 | `ocean` | 176 | 已核对并导出 WAV |
| 壁炉 | `cracklingFire` | 343 | 已核对并导出 WAV |

## 原版音乐本地核验

当前 Wave Bank 中的音乐流也已成功导出并复制到项目的 `apps/book-web/src/assets/private-audio/stardew-music/`，共 26 个文件，全部通过 `RIFF/WAVE` 校验。该目录被 `.gitignore` 忽略；启用本机原版音频配置后，构建插件会按需将它们复制到本机 `dist/private-audio/`。代表性流包括：

- 四季音乐：`spring1`（流 94，原名含 `Pink Petals; spring1`）、`spring2`（92）、`spring3`（93）、`springtown`（95）、`summer1`（123）、`summer2`（124）、`summer3`（116）、`fall1`（122）、`fall2`（120）、`fall3`（121）、`winter1`（127）、`winter2`（125）、`winter3`（126）。
- 主题与场景音乐：`MainTheme`（336）、`title_night`（128）、`grandpas_theme`（337）、`libraryTheme`（342）、`distantBanjo`（348）、`MarlonsTheme`（350）、`Saloon1`（351）、`night_market`（365）、`IslandMusic`（375）、`fieldofficeTentMusic`（376）、`PIRATE_THEME`（391）、`end_credits`（404）。

这些文件只完成了本地解码、导出和元数据检查，已复制到被忽略的私有目录，并通过开发环境专用的资源注册方式接入 `musicAssets` 的选择逻辑；默认构建不会包含它们，显式开启本机原版音频配置后才会写入本机 `dist`。当前博客背景音乐在启用本机配置时按场景使用这些文件，未启用时仍使用仓库中已标注为 CC0 的替代音乐。

## 开发环境接入方式

项目支持通过 `apps/book-web/.env.local` 开启本机原版音乐。当前本机配置指向 `C:\Users\24060\AppData\Local\Temp\agent-book-stardew-music`，启动 `pnpm --filter @agent-book/book-web dev --host 127.0.0.1` 后，Vite 只在开发服务器内通过受限路径 `/__agent-book-local-audio/` 提供这些 WAV 文件。场景选择会映射到对应的本地音乐：春、夏、秋、冬分别使用对应季节曲，夜晚使用 `title_night`，海边使用 `IslandMusic`，壁炉使用 `Saloon1`，雨天使用 `MainTheme`。

该插件在开发服务器中通过受限路径提供音频；当 `VITE_AGENT_BOOK_LOCAL_MUSIC=true` 时，本机 `vite build` 也会把私有 WAV 复制到 `dist/private-audio/` 并让播放器引用这些文件。默认配置仍为 `false`，因此普通生产构建继续回退到仓库内的 CC0 音乐。公开部署前必须确认原版音频具备再分发授权。换机器时复制 `.env.example` 的配置思路，填写自己的私有音频目录即可，不要把 `.env.local` 或原版 WAV 提交到 Git。

这些文件只完成了本地解码、导出和元数据检查，没有把原版文件接入公开资源目录，也没有把它们称为可公开使用的音频。已核对的原版环境 Cue 会在本机开发配置启用时优先播放，其他场景继续使用低频生成式环境层；原版 UI Cue 仍未替换应用内的 CC0 音效。

## 本地流程

1. 在拥有合法安装与使用权的机器上找到游戏的 `Content/XACT` 目录，并确认 `Wave Bank.xwb`、`Wave Bank(1.4).xwb` 与游戏版本匹配。
2. 先阅读 [Stardew Valley Wiki · Modding:Audio](https://stardewvalleywiki.com/Modding:Audio)，核对目标 Cue 名称和当前版本的 Wave Bank 编号。编号不能从旧版本资料直接推断。
3. 只使用来源可审计、开源且与当前版本匹配的 XACT/WAV 提取工具。提取操作应只在本地完成；本仓库不包含提取器、`xwb` 文件或提取结果。
4. 将本地试听文件放到被 `.gitignore` 忽略的 `apps/book-web/src/assets/private-audio/` 目录；当前项目已将音乐复制到 `stardew-music/`，将已核对的 Cue 音效复制到 `stardew-audio/`。通过开发服务器或启用原版音频配置的本机生产构建试听，不要把该目录改成 Vite 的公开静态资源目录。
5. 按上表把已核对的 Cue 映射到业务语义。只有在确认授权允许重新分发时，才可把文件移入公开资源目录，并同步补充来源、版本、许可证和文件校验记录。

代码中的 `localStardewCueMap` 仍然只是待授权导入的语义清单，不代表资源已经获得公开再分发许可。默认生产构建使用 `src/assets` 中的 CC0 音频与 `AudioManager` 生成的回退环境声；本机开发配置会优先使用已核对的原版环境 Cue，显式启用原版音频后本机生产构建也会复制并引用这些文件。要扩展其他主题，应在 `src/audio/themes/` 增加主题配置，在 `audioConfig.ts` 注册公开许可的音乐或音效，并为场景提供兼容的默认值；原版游戏资源仍需单独完成授权审查。
