# AI 学习 HTML PPT

这是 `better-ppt-html-deck` 生成的 10 页可编辑 HTML PPT。主题为明亮的软件产品风格，包含轻量毛玻璃质感和 GPT Image 生成的本地主视觉资产。

## Start

```bash
npm install
npm run dev
```

## Edit

- 进入 `Edit` 模式后，点击标题、正文、列表、卡片、流程节点、prompt 和讲者备注即可编辑。
- 点击任意配图槽可替换图片，支持 JPG、PNG、WebP、SVG。
- 修改会自动保存到浏览器本地存储。
- 使用 `JSON` 按钮导出当前 `deck.json`，也可以导入新的 `deck.json`。
- `Reset` 会恢复到 `src/data/deck.json` 的默认内容。

## Present And Preview

- `Preview` 隐藏编辑辅助 UI。
- `Present` 进入演示模式，方向键或空格切换页面，Esc 退出。
- 页脚显示当前页码和进度条。

## Export

- 浏览器工具栏里的 `PPTX` 按钮可一键导出图片型 PPTX。
- 命令行也保留导出脚本：

```bash
npm run export:pdf
npm run export:png
npm run export:pptx
```

## QA

```bash
npm run validate
npm run screenshot
npm run build
```

## Theme

主题色和布局 token 位于：

- `src/theme/tokens.css`
- `src/theme/theme.ts`
- `src/theme/visual-lock.json`

比例默认为 16:9。若需要改比例，请同步调整 `.deck-stage`、导出脚本中的 viewport 和 PPTX layout。
