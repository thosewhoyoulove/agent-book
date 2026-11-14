import { localGameAudioEnabled, onlineGameAudioEnabled, sceneProfiles } from "../audio/audioConfig";
import { audioThemes } from "../audio/themes";
import type { AudioSceneId, AudioSettings } from "../audio/audioTypes";
import type { GameWorldId } from "../content/gameWorlds";

interface AudioSettingsPanelProps {
  worldId: GameWorldId;
  settings: AudioSettings;
  ambientAvailable: boolean;
  musicAvailable: boolean;
  onChange: (patch: Partial<AudioSettings>) => void;
  onReset: () => void;
  onClose: () => void;
}

export function AudioSettingsPanel({
  worldId,
  settings,
  ambientAvailable,
  musicAvailable,
  onChange,
  onReset,
  onClose
}: AudioSettingsPanelProps) {
  const availableScenes = audioThemes[worldId].ambientScenes;
  const setNumber = (key: "masterVolume" | "uiVolume" | "ambientVolume" | "musicVolume", value: string) => {
    onChange({ [key]: Number(value) / 100 });
  };

  return (
    <div className="audio-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className={`audio-panel audio-panel--${worldId}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-panel-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="audio-panel__header">
          <div>
            <span className="audio-panel__eyebrow">SOUND & ATMOSPHERE · 音频工坊</span>
            <h2 id="audio-panel-title">环境音设置</h2>
            <p>音频默认保持关闭；点击下方开关后，当前卡带才会启动环境音或音乐。</p>
          </div>
          <button className="audio-panel__close" type="button" onClick={onClose} aria-label="关闭声音设置">
            ×
          </button>
        </div>

        <div className="audio-panel__body">
          <label className="audio-range">
            <span><b>总音量</b><output>{Math.round(settings.masterVolume * 100)}%</output></span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(settings.masterVolume * 100)}
              onChange={(event) => setNumber("masterVolume", event.target.value)}
              aria-label="总音量"
            />
          </label>

          <div className="audio-control-card">
            <div className="audio-control-card__head">
              <label><input type="checkbox" checked={settings.uiEnabled} onChange={(event) => onChange({ uiEnabled: event.target.checked })} /> UI 反馈音</label>
              <span>点击、展开、翻页与任务反馈</span>
            </div>
            <label className="audio-range audio-range--compact">
              <span><b>音效音量</b><output>{Math.round(settings.uiVolume * 100)}%</output></span>
              <input type="range" min="0" max="100" value={Math.round(settings.uiVolume * 100)} onChange={(event) => setNumber("uiVolume", event.target.value)} aria-label="UI 音效音量" />
            </label>
          </div>

          <div className="audio-control-card">
            <div className="audio-control-card__head">
              <label><input type="checkbox" disabled={!ambientAvailable} checked={settings.ambientEnabled} onChange={(event) => onChange({ ambientEnabled: event.target.checked })} /> 环境音</label>
              <span>{ambientAvailable ? (onlineGameAudioEnabled ? "线上压缩原版环境音" : localGameAudioEnabled ? "本机原版环境音" : "Web Audio 场景层") : "当前浏览器不支持"}</span>
            </div>
            <label className="audio-range audio-range--compact">
              <span><b>环境音音量</b><output>{Math.round(settings.ambientVolume * 100)}%</output></span>
              <input type="range" min="0" max="100" value={Math.round(settings.ambientVolume * 100)} onChange={(event) => setNumber("ambientVolume", event.target.value)} aria-label="环境音音量" />
            </label>
          </div>

          <div className="audio-control-card">
            <div className="audio-control-card__head">
              <label><input type="checkbox" disabled={!musicAvailable} checked={settings.musicEnabled} onChange={(event) => onChange({ musicEnabled: event.target.checked })} /> 背景音乐</label>
              <span>{musicAvailable ? (onlineGameAudioEnabled ? "线上压缩原版音乐" : localGameAudioEnabled ? "本机原版音乐" : "当前卡带 CC0 音乐") : "当前主题暂无曲目"}</span>
            </div>
            <label className="audio-range audio-range--compact">
              <span><b>音乐音量</b><output>{Math.round(settings.musicVolume * 100)}%</output></span>
              <input type="range" min="0" max="100" value={Math.round(settings.musicVolume * 100)} onChange={(event) => setNumber("musicVolume", event.target.value)} aria-label="背景音乐音量" />
            </label>
          </div>

          <label className="audio-scene-select">
            <span><b>当前环境场景</b><small>切换会平滑停止旧场景</small></span>
            <select value={settings.scene} onChange={(event) => onChange({ scene: event.target.value as AudioSceneId })} aria-label="当前环境音场景">
              {availableScenes.map((id) => (
                <option key={id} value={id}>{audioThemes[worldId].sceneLabels[id] ?? sceneProfiles[id].label}</option>
              ))}
            </select>
          </label>

          <label className="audio-mute-row">
            <span><b>一键静音</b><small>暂时关闭所有类别，设置仍会保留</small></span>
            <input type="checkbox" checked={settings.muted} onChange={(event) => onChange({ muted: event.target.checked })} />
          </label>
        </div>

        <div className="audio-panel__footer">
          <span>{onlineGameAudioEnabled ? "线上使用经过压缩和响度处理的音频资源；本机开发可切换到已核对的原版文件。" : "本机原版环境音会优先使用已核对的场景文件；没有对应文件时使用低频生成层。"}</span>
          <button className="button button--ghost" type="button" onClick={onReset}>恢复默认</button>
        </div>
      </section>
    </div>
  );
}
