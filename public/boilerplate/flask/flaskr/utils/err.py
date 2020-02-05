from flask import jsonify
from flask import current_app as app
from werkzeug.exceptions import HTTPException, InternalServerError


class InvalidUsage(Exception):
    """自定义异常类
    """
    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def init_app():
    """注册异常捕获"""
    # @app.errorhandler(404)
    # def resource_not_found(e):
    #     return jsonify(error=str(e)), 404

    app.register_error_handler(Exception, _handle_exception)
    app.register_error_handler(InternalServerError, _handle_serverexception)
    app.register_error_handler(HTTPException, _handle_httpexception)
    app.register_error_handler(404, _handle_404)
    app.register_error_handler(InvalidUsage, _handle_invalid)


def _handle_invalid(e):
    """invalid"""
    app.logger.error(f'自定义错误：{e.message}')
    # response = jsonify(e.to_dict())
    # response.status_code = e.status_code
    # return response
    return jsonify(e.to_dict()), e.status_code


def _handle_exception(e):
    """exception"""
    app.logger.error(f'未知错误：{e}')
    return jsonify(message=getattr(e, "message", None) or getattr(e, "description", str(e))), getattr(e, "code", 500)


def _handle_serverexception(e):
    """serverexception 未处理的异常"""
    app.logger.error(f'SERVER错误：{e}')
    return jsonify(message=getattr(e, "message", None) or getattr(e, "description", str(e))), getattr(e, "code", 500)


def _handle_httpexception(e):
    """httpexception"""
    app.logger.error(f'HTTP错误：{e}')
    return jsonify(message=getattr(e, "message", None) or getattr(e, "description", str(e))), getattr(e, "code", 500)


def _handle_404(e):
    """404"""
    app.logger.error(f'404错误：{e}')
    return jsonify(message=getattr(e, "message", None) or getattr(e, "description", str(e))), 404


def _handle_500(e):
    pass
