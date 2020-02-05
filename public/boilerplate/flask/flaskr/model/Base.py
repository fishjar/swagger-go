import uuid
import datetime
from flaskr import db
from flask import abort
from flask_sqlalchemy import BaseQuery


class CustomQuery(BaseQuery):
    """ 自定义查询
    """

    def paginate_(self, **kwargs):
        """分页查询-过滤软删除"""
        return self.filter_by(deletedAt=None).paginate(**kwargs)

    def get_or_404_(self, id):
        """查询-过滤软删除"""
        obj = self.get_or_404(id, "记录不存在")
        if obj.deletedAt is not None:
            abort(404, "记录已删除")
        return obj

    def get_(self, id):
        """查询-过滤软删除"""
        obj = self.get(id)
        if obj is None or obj.deletedAt is not None:
            return None
        return obj


class Column(db.Column):
    """ 字段的基类
    """
    __abstract__ = True

    def __init__(self, *args, **kwargs):
        """接收并挂载验证器"""
        validator = kwargs.pop("validator", None)
        if validator is not None:
            self.validator = validator
        super(Column, self).__init__(*args, **kwargs)


class BaseModel(db.Model):
    """ 模型的基类
    """
    __abstract__ = True
    query_class = CustomQuery

    id = db.Column("id", db.String(64),  primary_key=True,
                   default=lambda: str(uuid.uuid4()), comment="id")
    createdAt = db.Column("created_at", db.DateTime,
                          default=datetime.datetime.utcnow, comment="创建时间")
    updatedAt = db.Column("update_at", db.DateTime,
                          default=datetime.datetime.utcnow, comment="更新时间")
    deletedAt = db.Column("deleted_at", db.DateTime, comment="删除时间")

    # __mapper_args__ = {
    #     "order_by": createdAt.desc()
    # }

    def __new__(cls, *args, **kwargs):
        """模型验证"""
        errors = []
        for k, v in kwargs.items():
            field = getattr(cls, k, None)
            if field:
                validator = getattr(field, "validator", None)
                if validator:
                    schema, msg = validator
                    try:
                        # 验证格式参考
                        # https://github.com/keleshev/schema
                        schema.validate(v)
                    except Exception as e:
                        errors.append(f'字段[{k}]:{msg or str(e)}')
            else:
                # 模型没有该属性
                # 即使此处不拦截，SQLAlchemy也会抛出异常
                errors.append(f'字段[{k}]:多余的')
        if errors:
            abort(500, "; ".join(errors))
        return super(BaseModel, cls).__new__(cls)

    def __setattr__(self, name, value):
        """属性验证"""
        field = getattr(self.__class__, name, None)
        if field is not None:
            validator = getattr(field, "validator", None)
            if validator is not None:
                schema, msg = validator
                try:
                    # https://github.com/keleshev/schema
                    schema.validate(value)
                except Exception as e:
                    raise Exception(f'参数[{name}]:{msg or str(e)}')
        super(BaseModel, self).__setattr__(name, value)

    def update(self, **kwds):
        """字典更新到模型"""
        # self.__dict__.update(kwds)
        # 软删除的数据不再更新
        if self.deletedAt is None:
            errors = []
            for (k, v) in kwds.items():
                try:
                    setattr(self, k, v)
                except Exception as e:
                    errors.append(str(e))
            if errors:
                abort(500, "; ".join(errors))

    def delete(self):
        """软删除"""
        self.deletedAt = datetime.datetime.utcnow()
