import functools

from flask import request, g
from werkzeug.exceptions import abort
from flaskr.utils import jwt


def init_app(app):
    """认证"""

    @app.before_request
    def login_required():
        """登录验证"""
        if(request.path.startswith("/login/")):
            return
        token = request.headers.get("authorization", "")
        if not token:
            abort(403, "缺少token")

        u = jwt.jwt_decode(token)
        if u is None:
            abort(403, "token解析错误")

        authId = u.get("authId", None)
        authType = u.get("authType", None)
        authName = u.get("authName", None)
        if (authId is None) or (authType is None) or (authName is None):
            abort(403, "token信息有误")

        from flaskr.model import Auth
        auth = Auth.query.get_(authId)
        if auth is None:
            abort(403, "帐号不存在")
        if not auth.isEnabled:
            abort(403, "帐号已停用")
        if not auth.user:
            abort(403, "帐号异常")

        # 挂载到全局情境信息
        g.auth = auth

    @app.after_request
    def refresh_token(response):
        """刷新token"""
        auth = g.get("auth", None)
        if auth is not None:
            new_token = jwt.jwt_encode(
                authId=auth.id, authType=auth.authType, authName=auth.authName)
            response.headers["X-authToken"] = new_token
        return response


def role_required(roles=["admin"]):
    """角色权限装饰器

    Args:
        roles: 权限所需的角色
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            auth = g.get("auth", None)
            if auth is None:
                abort(403, "需要登录")
            auth_roles = [role.name for role in auth.user.roles]
            if not (set(roles) & set(auth_roles)):
                abort(403, "角色缺少权限")
            return func(*args, **kw)
        return wrapper
    return decorator
