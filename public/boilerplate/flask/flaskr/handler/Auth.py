import json

from flask import current_app as app
from flask import abort, g, redirect, request, jsonify
from werkzeug.exceptions import abort
from flaskr import db
from flaskr.model import Auth, AuthSchema
from flaskr.utils.err import InvalidUsage
from flaskr.utils.auth import role_required

schema = AuthSchema()
schemas = AuthSchema(many=True)


@role_required(["admin"])
def findAndCountAll():
    """查询多条信息"""
    page_num = int(request.args.get('pageNum', '1'))
    page_size = int(request.args.get('pageSize', '10'))
    # sorter = request.args.getlist('sorter', None)
    data = Auth.query.paginate_(
        page=page_num, per_page=page_size, error_out=False)
    return {
        "count": data.total,
        "rows": schemas.dump(data.items),
        # "rows": [item.to_dict() for item in data.items]
    }


@role_required(["admin"])
def singleCreate():
    """创建单条信息"""
    kwds = request.get_json()
    app.logger.info(f'用户提交数据：{kwds}')  # 记录提交的数据
    item = Auth(**kwds)
    db.session.add(item)
    db.session.commit()
    return schema.dump(item)


@role_required(["admin"])
def bulkUpdate():
    """更新多条信息"""
    ids = request.args.getlist('id')
    if len(ids) == 0:
        abort(400, "ID参数不能为空")
    kwds = request.get_json()
    app.logger.info(f'用户提交数据：{ids} - {kwds}')  # 记录提交的数据
    items = [Auth.query.with_for_update().get(id) for id in ids] # 加锁
    for item in items:
        item.update(**kwds)
    db.session.commit()
    return {
        "rows": schemas.dump(items)
    }


@role_required(["admin"])
def bulkDestroy():
    """删除多条信息"""
    ids = request.args.getlist('id')
    if len(ids) == 0:
        abort(400, "ID参数不能为空")
    items = [Auth.query.get(id) for id in ids]
    for item in items:
        item.delete()
    db.session.commit()
    return {
        "count": len(ids)
    }


def findByPk(id):
    """根据主键查询单条信息"""
    # item = Auth.query.get(id)
    # if item is None:
    #     abort(404, description="记录不存在")
    item = Auth.query.get_or_404_(id)
    return schema.dump(item)


def updateByPk(id):
    """更新单条"""
    item = Auth.query.with_for_update().get(id) # 此处加锁
    if item is None or item.deletedAt is not None:
        abort(404, "记录不存在")
    kwds = request.get_json()
    item.update(**kwds)
    db.session.commit()
    return schema.dump(item)


@role_required(["admin"])
def destroyByPk(id):
    """删除单条"""
    item = Auth.query.get_or_404_(id)
    item.delete()
    db.session.commit()
    return schema.dump(item)


@role_required(["admin"])
def bulkCreate():
    """创建多条信息"""
    kwds_list = request.get_json()
    app.logger.info(f'用户提交数据：{kwds_list}')  # 记录提交的数据
    items = [Auth(**kwds) for kwds in kwds_list]
    db.session.add_all(items)
    db.session.commit()
    return {
        "rows": schemas.dump(items)
    }
