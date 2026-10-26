# 演示视频放这里

页面上的「▶ 看它怎么用」按钮会播放这个目录下的文件。**文件名必须对上**：

| 项目 | 文件名 |
|---|---|
| vAgent | `vagent.mp4` |
| ai-agent | `ai-agent.mp4` |
| hookflow | `hookflow.mp4` |

放进去、推送到 GitHub，Vercel 自动部署后按钮就能用了。文件不存在时，
弹层会显示「演示视频还在录制中」并给一个去 GitHub 的链接，不会白屏报错。

## 录制建议

- **格式**：MP4（H.264 + AAC）。屏幕录制工具默认常常是 `.mov` 或 `.webm`，
  建议转成 MP4，Safari 对 webm 支持不好。
- **时长**：30～60 秒。超过 90 秒基本没人看完。
- **分辨率**：1280×720 起步，1080p 更清晰但文件更大。
- **体积**：单个控制在 **5 MB 以内**。Vercel 对单文件没有硬限制，但访客不会等一个 40 MB 的视频。
  超了就降码率，或用 `ffmpeg -i in.mp4 -vcodec libx264 -crf 28 -preset slow out.mp4` 压一下。
- **节奏**：开头 3 秒必须出现「能用的界面」，不要留启动日志、终端滚动。
- **字幕**：你的站是中文的，录屏里的中文界面已经足够，不必额外加字幕。

## Windows 上怎么录

1. `Win + G` 打开 Xbox Game Bar → 点录制（最简单，输出 MP4）
2. 或 OBS Studio（免费）：输出设 `mp4`，比特率 2500～4000 kbps
3. 只录浏览器窗口：`Win + Shift + S` 只能截图，录屏用上面两个

## 用 ffmpeg 压缩（可选）

```powershell
# 压到 720p、约 5 MB，去掉音轨（录屏通常不需要声音）
ffmpeg -i 原始录像.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -an vagent.mp4
```
