# 控制课程大作业

六自由度主动隔振平台 Model-1019 的作业说明与教学材料下载网站。

网站：<https://pifuyuini.github.io/modern-control-project/>

## 内容

- 项目背景与主动隔振平台介绍
- 小组专题文献调研（四个主题全覆盖，由两名调研成员各承担两个主题）
- 课程模型的状态、输入输出与 SI 单位约定
- 无控制与闭环仿真系统说明
- 模型分析、FZ 至 Z 单通道设计及 MIMO 控制器设计
- 六通道 Control off / Control on ASD 对比规范
- 教学包、独立 MAT 模型下载与 Python / MATLAB 使用入口
- 独立使用手册页面：<https://pifuyuini.github.io/modern-control-project/docs/>

公开正文采用课程所需的接口说明，不包含内部辨识推导、具体整定参数、参考衰减指标或评分规则。

## 文件

`site/` 是完整静态网站，无框架和构建依赖。`site/downloads/model1019_coursework_v1.zip` 保留教师提供的模型、信号资源与示例，离线手册已移至网站，包内 README 与包信息已更新在线文档地址。

`site/downloads/model1019.mat` 与教学包内的 MAT 文件逐字节一致，单独提供 A、B、C、D 及模型接口字段。原研究目录中的分发包未被修改。

`site/docs/USER_GUIDE.md` 是审阅后的手册正文，`site/docs/index.html` 是同内容的网页，`site/docs/USER_GUIDE.html` 保留为入口兼容地址。公开手册省略标定长度数值、原始实验文件名、研究版本与内部导出关系，保留运行与数值接口所需信息。修改手册时应同步 Markdown 与 HTML。

修改页面内容：`site/index.html`。视觉样式：`site/styles.css`。目录定位与命令复制：`site/script.js`。

## 部署

仓库的 GitHub Pages 来源设为 **GitHub Actions**。向 `main` 推送后，`.github/workflows/pages.yml` 将 `site/` 上传并部署到 Pages；也可在 Actions 中手动运行。

部署流程参考 [GitHub 官方静态站点工作流](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)。页面资源使用相对路径，适用于项目站点 `/modern-control-project/`。

## 教学包与验证边界

网页提供课堂任务与下载入口。教学包示例为无控制系统，不包含控制器或预生成的性能结果。网站发布检查不代表已经运行或验证 Python / MATLAB 科学计算示例。
