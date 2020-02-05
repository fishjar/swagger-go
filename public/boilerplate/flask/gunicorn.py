# 参考： https://github.com/benoitc/gunicorn/blob/master/examples/example_config.py

workers = 4

backlog = 2048

# 指定每个工作的线程数
threads = 2

# 监听端口8000
bind = '0.0.0.0:8000'

# 守护进程,将进程交给supervisor管理
daemon = 'false'

# 工作模式协程
worker_class = 'gevent'

# 最大并发量
worker_connections = 2000

# 进程文件
# pidfile = '/var/run/gunicorn.pid'

# 访问日志和错误日志
# accesslog = '/var/log/gunicorn_acess.log'
# errorlog = '/var/log/gunicorn_error.log'
# accesslog = './gunicorn_acess.log'
# errorlog = './gunicorn_error.log'
accesslog = './flaskr/tmp/gunicorn_acess.log'
errorlog = './flaskr/tmp/gunicorn_error.log'

# 日志级别
loglevel = 'debug'

# 环境变量
raw_env = ['FLASK_ENV=production']
