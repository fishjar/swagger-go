import os
import logging

from logging.handlers import TimedRotatingFileHandler
from flask import has_request_context, request
from flaskr.config import base_dir


class RequestFormatter(logging.Formatter):
    """请求信息注入日志
    """

    def format(self, record):
        if has_request_context():
            record.url = request.url  # 服务端地址
            record.remote_addr = request.remote_addr  # 客户端地址
        else:
            record.url = None
            record.remote_addr = None

        return super().format(record)


def init_app(app):
    """添加日志记录器"""
    app.logger.addHandler(_file_handler())


def _file_handler():
    """文件日志记录器"""
    tmp_dir = os.path.join(base_dir, "tmp")
    os.makedirs(tmp_dir, exist_ok=True)  # 确保文件夹存在
    filename = os.path.join(tmp_dir, "flask.log")
    handler = TimedRotatingFileHandler(
        filename, when="D", interval=1, backupCount=7, encoding="utf-8")
    # formatter = logging.Formatter(
    #     '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    formatter = RequestFormatter(
        '[%(asctime)s] %(remote_addr)s requested %(url)s %(levelname)s in %(module)s: %(message)s'
    )
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)
    return handler


def _sorckt_handler():
    """网络日志记录器"""
    pass


def _smtp_handler():
    """邮件日志记录器"""
    pass
