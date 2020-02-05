import datetime
import jwt

from flask import current_app as app


def jwt_encode(**kwds):
    """jwt加密
    
    Args:
        authId: 鉴权ID
        authType: 鉴权类型
        authName: 鉴权帐号名
    """
    if not kwds:
        return ""
    secret = app.config.get("JWT_SECRET", "secret")
    try:
        kwds["exp"] = datetime.datetime.utcnow(
        ) + datetime.timedelta(seconds=60*60*24)
        # app.logger.info(f'jwt加密：{kwds}')
        b = jwt.encode(kwds, secret, algorithm='HS256')
    except e:
        app.logger.error(f'jwt加密错误：{e}')
        return ""
    return bytes.decode(b)


def jwt_decode(token):
    """jwt解密
    
    Args:
        token: 需要解密的字符串("Bearer "开头)
    """
    if not token:
        return None
    s = token.replace("Bearer ", "")
    if not s:
        return None
    secret = app.config.get("JWT_SECRET", "secret")
    try:
        d = jwt.decode(s, secret, algorithm='HS256')
    except jwt.ExpiredSignatureError as e:
        app.logger.error(f'jwt过期：{e}')
        return None
    return d
