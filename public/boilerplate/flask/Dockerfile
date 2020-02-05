# FROM python:3.8.0-alpine
FROM python:3.8.0

# 将工作目录设置为 /app
WORKDIR /app

# 将当前目录内容复制到位于 /app 中的容器中
ADD . /app

# 安装依赖包
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 环境变量（移到 docker-compose 配置更灵活）
# ENV FLASK_APP=flaskr
# ENV FLASK_ENV=production
