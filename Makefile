.PHONY: build push run stop clean clean-static

# 镜像名称
IMAGE_NAME = douyin-extractor
# 镜像标签
IMAGE_TAG = latest

# 构建 Docker 镜像
build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# 运行 Docker 容器
run:
	docker run -d -p 80:80 --name $(IMAGE_NAME) $(IMAGE_NAME):$(IMAGE_TAG)

# 停止并删除 Docker 容器
stop:
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

# 清理 Docker 镜像
clean:
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) || true

# 清理Next.js构建生成的静态文件
clean-static:
	rm -rf .next

# 一键部署（构建、停止旧容器、运行新容器）
deploy: stop build run

# 开发模式运行
run-dev:
	docker run -d -p 3000:3000 -v $$(pwd):/app --name $(IMAGE_NAME)-dev node:18-alpine sh -c "cd /app && npm install -g pnpm && pnpm install && pnpm run dev"