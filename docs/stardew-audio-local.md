# 三款游戏原版音频本地导入说明

本项目已在本机发现 Stardew Valley `1.6.15.24356` 安装目录，并使用当前版本的 `Content/XACT/Wave Bank.xwb` 完成本地 Cue 和音乐流元数据核对及定向 WAV 导出验证。导出文件已复制到项目内被 `.gitignore` 忽略的 `apps/book-web/src/assets/private-audio/`，原始 WAV/OGG 没有进入版本控制；线上构建使用由这些本地文件生成的响度处理 OGG 副本，放在 `apps/book-web/public/online-audio/` 并随 GitHub Pages 公开发布。

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
| 翻书（快速连续翻页） | `book_read` | 424 | 已核对并导出 WAV |
| 翻页（单页） | `newRecipe` | 215 | 已核对并导出 WAV |
| 任务完成 | `questcomplete` | 129 | 已核对并导出 WAV |
| 成就 | `achievement` | 104 | 已核对并导出 WAV |
| 收获 | `harvest` | 327 | 已核对并导出 WAV |
| 春日环境 | `spring_day_ambient` | 180 | 已核对并导出 WAV |
| 春夜环境 | `spring_night_ambient` | 346 | 已核对并导出 WAV |
| 雨声 | `rain` | 117 | 已核对并导出 WAV |
| 海浪 | `ocean` | 176 | 已核对并导出 WAV |
| 壁炉 | `cracklingFire` | 343 | 已核对并导出 WAV |

## 原版音乐本地核验

当前 Wave Bank 中的音乐流也已成功导出并复制到项目的 `apps/book-web/src/assets/private-audio/stardew-music/`，共 26 个文件，全部通过 `RIFF/WAVE` 校验。该目录被 `.gitignore` 忽略；线上使用其中已映射曲目的 OGG 压缩副本，本机开发配置仍读取原始文件。代表性流包括：

- 四季音乐：`spring1`（流 94，原名含 `Pink Petals; spring1`）、`spring2`（92）、`spring3`（93）、`springtown`（95）、`summer1`（123）、`summer2`（124）、`summer3`（116）、`fall1`（122）、`fall2`（120）、`fall3`（121）、`winter1`（127）、`winter2`（125）、`winter3`（126）。
- 主题与场景音乐：`MainTheme`（336）、`title_night`（128）、`grandpas_theme`（337）、`libraryTheme`（342）、`distantBanjo`（348）、`MarlonsTheme`（350）、`Saloon1`（351）、`night_market`（365）、`IslandMusic`（375）、`fieldofficeTentMusic`（376）、`PIRATE_THEME`（391）、`end_credits`（404）。

这些文件只完成了本地解码、导出和元数据检查，已复制到被忽略的私有目录，并通过开发环境专用的资源注册方式接入 `musicAssets` 的选择逻辑；默认构建不会包含它们，显式开启本机原版音频配置后才会写入本机 `dist`。当前博客背景音乐在启用本机配置时按场景使用这些文件，未启用时仍使用仓库中已标注为 CC0 的替代音乐。

## 开发环境接入方式

项目支持通过 `apps/book-web/.env.local` 开启本机原版音乐和音效。当前本机配置指向项目内被忽略的 `apps/book-web/src/assets/private-audio/stardew-music`；蔚蓝和空洞骑士的资源分别位于同一目录下的 `celeste/{music,audio}` 与 `hollow/{music,audio}`。启动 `pnpm --filter @agent-book/book-web dev --host 127.0.0.1` 后，Vite 只在开发服务器内通过受限路径 `/__agent-book-local-audio/` 提供这些文件。场景选择会映射到对应的本地音乐：春、夏、秋、冬分别使用对应季节曲，夜晚使用 `title_night`，海边使用 `IslandMusic`，壁炉使用 `Saloon1`，雨天使用 `MainTheme`。

本机原版音频只在开发服务器中通过受限路径提供；生产构建固定使用仓库 `public/online-audio/` 中经过压缩和响度处理的线上资源，不会读取本机私有目录。默认配置仍为 `false`，设置为 `true` 后，本机开发服务器会优先播放已核对的原版 UI、环境音和音乐。换机器时复制 `.env.example` 的配置思路，填写自己的私有音频目录即可，不要把 `.env.local` 或原版 WAV 提交到 Git。

线上资源会通过 GitHub Pages 的静态托管和缓存分发，音频 URL 对访问者公开可下载；GitHub Pages 不提供静态资源访问控制。公开发布前必须确认原版音频具备再分发授权。已核对的原版环境 Cue 会在本机开发配置启用时优先播放，线上构建则使用 `public/online-audio/` 中的压缩副本。

## 蔚蓝与空洞骑士本地核验

蔚蓝安装目录为 `F:\Celeste`，音频位于 `Content\FMOD\Desktop`。使用开源 `FModBankParser` 及其 `Fmod5Sharp` 子模块解析当前 bank，确认音频编码为 Vorbis 后导出了精选资源：

- 蔚蓝音乐：`mus_lvl1_main_piano_loop`、`mus_lvl2_main_loop`、`mus_lvl3_explore_ambient_loop`、`mus_lvl5_darknorm_loop`、`mus_lvl8_ice1_loop`。
- 蔚蓝 UI：按钮选择、面板展开/收起、日志翻页、晶心完成反馈、草莓收集和卡带切换。
- 蔚蓝环境：主场景、室外风、湖面、寒冷空间和篝火循环。

空洞骑士安装目录为 `F:\steam\steamapps\common\Hollow Knight`，音频位于 Unity `hollow_knight_Data` 资源包。使用开源 `UnityPy 1.25.4` 扫描 `AudioClip` 并导出了精选 WAV：

- 空洞骑士音乐：`Title`、`S5 Green Path Main`、`S26 Crystal MAIN`、`S31 Waterways`。
- 空洞骑士 UI：`ui_option_click`、`ui_change_selection`、`ui_button_confirm`。
- 空洞骑士环境：Dirtmouth 风声、洞穴风声、室外雨声、水道氛围和灯火循环。

文件已经复制到 `apps/book-web/src/assets/private-audio/` 下对应主题目录，并通过音频头部、浏览器解码和资源请求验证。该目录始终被 `.gitignore` 忽略。

代码中的 `gameAudioFiles.json` 是当前已核对并映射到业务的本地资源清单。新增本地主题时，在 `audioConfig.ts` 增加 UI、音乐和环境映射，在 `src/audio/themes/` 增加主题场景配置，并在 `vite.config.ts` 注册私有音频根目录。当前星露谷章节导航使用 `newRecipe.wav`：它是 Wave Bank 中明确标注为“翻页”的单页音效；`book_read.wav` 保留为原版阅读音效，但不再用于章节切换。线上公开副本统一输出为 OGG，并按类别存放在 `public/online-audio/`。

## 本地流程

1. 在拥有合法安装与使用权的机器上找到游戏的 `Content/XACT` 目录，并确认 `Wave Bank.xwb`、`Wave Bank(1.4).xwb` 与游戏版本匹配。
2. 先阅读 [Stardew Valley Wiki · Modding:Audio](https://stardewvalleywiki.com/Modding:Audio)，核对目标 Cue 名称和当前版本的 Wave Bank 编号。编号不能从旧版本资料直接推断。
3. 只使用来源可审计、开源且与当前版本匹配的 XACT/WAV 提取工具。提取操作应只在本地完成；本仓库不包含提取器、`xwb` 文件或提取结果。
4. 将本地试听文件放到被 `.gitignore` 忽略的 `apps/book-web/src/assets/private-audio/` 目录；当前项目已将音乐复制到 `stardew-music/`，将已核对的 Cue 音效复制到 `stardew-audio/`。通过开发服务器或启用原版音频配置的本机生产构建试听，不要把该目录改成 Vite 的公开静态资源目录。
5. 按上表把已核对的 Cue 映射到业务语义。只有在确认授权允许重新分发时，才可把文件移入公开资源目录，并同步补充来源、版本、许可证和文件校验记录。

本地开发配置会优先使用已核对的原版 UI、环境音和音乐；线上 GitHub Pages 构建使用 `public/online-audio/` 中的压缩副本。若要重新生成线上资源，应在具备合法再分发授权的前提下使用 FFmpeg 做响度归一化和 OGG 压缩，并同步补充来源、版本、许可证和文件校验记录。
