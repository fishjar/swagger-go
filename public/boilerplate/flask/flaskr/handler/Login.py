import json
import datetime

from flask import abort, Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
from werkzeug.exceptions import abort
from werkzeug.security import generate_password_hash, check_password_hash
from flaskr import db
from flaskr.model import Auth
from flaskr.utils.jwt import jwt_decode, jwt_encode


def account():
    """帐号登录"""
    kwds = request.get_json()
    auth_name = kwds.get("userName", None)
    password = kwds.get("password", None)

    if not auth_name or not password:
        abort(401, "缺少参数")

    auth_type = "account"
    auth = Auth.query.filter_by(authType=auth_type, authName=auth_name, deletedAt=None).first()
    if not auth:
        abort(401, "用户不存在")
    elif not auth.isEnabled:
        abort(401, "此帐号已禁用")
    elif auth.expireTime < datetime.datetime.utcnow():
        abort(401, "此帐号已过期")
    elif not auth.user:
        abort(401, "帐号异常")
    elif not check_password_hash(auth.authCode, password):
        abort(401, "密码错误")
    # elif not auth.check_password(password):
    #     abort(401, "密码错误")

    token = jwt_encode(authId=auth.id, authType=auth.authType,
                       authName=auth.authName)
    roles = [role.name for role in auth.user.roles]

    return {
        "status": "ok",
        "type": "account",
        "message": "登录成功",
        "authToken": token,
        "currentAuthority": roles
    }


def phone():
    """手机号登录"""
    pass


def wechat():
    """微信登录"""
    pass
