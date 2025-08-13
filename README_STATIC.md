# 静态版本部署说明

此文档说明如何将应用构建和部署为静态网站。

## 构建静态版本

```bash
npm run build
```

这将生成一个 `out` 目录，其中包含所有静态文件。

## 本地开发

```bash
npm run dev
```

这将在开发模式下运行应用，支持热重载。

## 使用Docker部署

### 构建Docker镜像

```bash
make build
```

### 运行Docker容器

```bash
make run
```

这将在端口80上启动应用。

### 开发模式运行

```bash
make run-dev
```

这将在端口3000上启动开发服务器。

## 手动部署到静态主机

将 `out` 目录中的所有文件上传到您的静态主机提供商（如Vercel、Netlify、GitHub Pages等）。

## 注意事项

1. 静态版本不包含API路由功能，所有数据都是模拟的。
2. 如果需要真实的API功能，需要单独部署API服务。