# Huya 直播主题落地页（仅学习使用，学习ai创建宣传网站）

使用 HTML、CSS 和 JavaScript 构建的响应式直播平台展示页面。

当前版本：**1.1**

[在线预览](https://zhang1845.github.io/huya/) · [源代码](https://github.com/zhang1845/huya)

## 功能

- 首页、热门分类、人气主播、赛事中心、主播入驻、关于我们和下载展示区块。
- 移动端抽屉菜单、锚点导航和当前区块高亮。
- GSAP / ScrollTrigger 滚动动画和 Swiper 轮播。
- 支持系统减少动态效果设置。

这是前端演示项目；观看、下载、入驻和赛事提醒等交互为展示用途，没有接入直播、账号或通知后端。本项目与虎牙官方无关联。

## 本地运行

无需安装依赖或构建。在项目根目录启动静态服务器：

```sh
python3 -m http.server 8000
```

然后打开 <http://localhost:8000>。也可以直接在浏览器中打开 `index.html`。

页面通过 jsDelivr 加载 GSAP 3.12.5 和 Swiper 11，通过 Picsum Photos 加载占位图片，因此需要联网。

## 文件结构

```text
index.html   页面内容
styles.css   响应式样式
main.js      导航、轮播和动画交互
.nojekyll    让 GitHub Pages 直接发布静态文件
LICENSE      MIT 许可证
```

## 部署到 GitHub Pages

本仓库使用 `main` 分支根目录发布。在 GitHub 仓库的 **Settings → Pages** 中，发布来源为 **Deploy from a branch**，分支为 **main**，目录为 **/(root)**。

后续修改并推送到 `main` 后，GitHub Pages 会自动更新网站：

```sh
git add index.html styles.css main.js
git commit -m "Update website"
git push origin main
```

## 开源许可

项目代码采用 [MIT License](LICENSE)。第三方库遵循各自的许可证；页面中涉及的品牌、商标和第三方素材不包含在本项目的 MIT 授权范围内。
