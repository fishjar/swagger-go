def init_app(app):
    """注册蓝图"""
    from flaskr import router
    app.register_blueprint(router.login)
    app.register_blueprint(router.user)
    app.register_blueprint(router.role)
    app.register_blueprint(router.auth)
    app.register_blueprint(router.menu)
    app.register_blueprint(router.group)
    app.register_blueprint(router.usergroup)
