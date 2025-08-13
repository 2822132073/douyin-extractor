# 多阶段构建：第一阶段 - 编译Next.js应用
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖（包括开发依赖）
RUN pnpm install

# 复制应用代码
COPY . .

# 构建 Next.js 应用（静态导出）
RUN pnpm run build

# 多阶段构建：第二阶段 - 部署到Nginx
FROM nginx:alpine AS runner

# 创建应用目录
WORKDIR /usr/share/nginx/html

# 从构建阶段复制静态导出文件
COPY --from=builder /app/out ./

# Nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]