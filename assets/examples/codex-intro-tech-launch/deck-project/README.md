# Codex 入门 HTML PPT

这是一个新野兽派风格的 10 页 HTML PPT。HTML/React 是源文件，PDF、PNG、PPTX 是导出物。

## 启动

```bash
npm install
npm run dev
```

## 修改文字

在 Edit Mode 中点击标题、正文或标签文字，直接编辑。修改会自动保存到浏览器 `localStorage`。

## 替换图片

当前版本以代码渲染图形为主。后续添加图片区域时，可使用 `EditableImage`，支持点击上传、拖拽上传、JPG/PNG/WebP/SVG 和本地保存。

## 模式

- `edit`：编辑文字、导入导出 JSON。
- `preview`：隐藏编辑控件，查看最终视觉。
- `present`：正式播放，支持方向键、空格和 Esc。
- `export`：显示导出入口和命令。

## 导出

```bash
npm run export:pdf
npm run export:png
npm run export:pptx
```

导出文件位于 `exports/`。

## deck.json

主要内容集中在 `src/data/deck.json`。可以在工具栏导出或导入当前 `deck.json`。

## 恢复默认内容

点击工具栏 `Reset`。

## 修改主题色

编辑 `src/theme/tokens.css` 和 `src/theme/visual-lock.json`。

## 调整比例

当前为 `16:9`。如需调整，修改 `.deck-stage` 和 `.slide` 的 aspect ratio，并同步更新 `deck.json` 与 `visual-lock.json`。
