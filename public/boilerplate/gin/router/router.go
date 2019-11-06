/*
	路由配置
*/

package router

import (
	"github.com/fishjar/gin-rest-boilerplate/handler"
	"github.com/fishjar/gin-rest-boilerplate/middleware"

	"github.com/gin-gonic/gin"
)

// InitRouter 注入路由，及返回一个gin对象
func InitRouter() *gin.Engine {

	// r := gin.New()
	r := gin.Default() // Default 使用 Logger 和 Recovery 中间件

	r.Use(middleware.BodyLogger()) // 日志中间件
	r.Use(middleware.JWTAuth())    // JWT验证中间件

	r.POST("/login/account", handler.LoginAccount) //登录

	{

		r.GET("/auths", handler.AuthFindAndCountAll)    // 获取多条
		r.GET("/auths/:id", handler.AuthFindByPk)       // 按ID查找
		r.POST("/auths", handler.AuthSingleCreate)      // 创建单条
		r.PATCH("/auths/:id", handler.AuthUpdateByPk)   // 按ID更新
		r.DELETE("/auths/:id", handler.AuthDestroyByPk) // 按ID删除
		r.POST("/auth", handler.AuthFindOrCreate)       // 查询或创建
	}
	{
		r.GET("/groups", handler.GroupFindAndCountAll)    // 获取多条
		r.GET("/groups/:id", handler.GroupFindByPk)       // 按ID查找
		r.POST("/groups", handler.GroupSingleCreate)      // 创建单条
		r.PATCH("/groups/:id", handler.GroupUpdateByPk)   // 按ID更新
		r.DELETE("/groups/:id", handler.GroupDestroyByPk) // 按ID删除
		r.POST("/group", handler.GroupFindOrCreate)       // 查询或创建
	}
	{
		r.GET("/menus", handler.MenuFindAndCountAll)    // 获取多条
		r.GET("/menus/:id", handler.MenuFindByPk)       // 按ID查找
		r.POST("/menus", handler.MenuSingleCreate)      // 创建单条
		r.PATCH("/menus/:id", handler.MenuUpdateByPk)   // 按ID更新
		r.DELETE("/menus/:id", handler.MenuDestroyByPk) // 按ID删除
		r.POST("/menu", handler.MenuFindOrCreate)       // 查询或创建
	}
	{
		r.GET("/roles", handler.RoleFindAndCountAll)    // 获取多条
		r.GET("/roles/:id", handler.RoleFindByPk)       // 按ID查找
		r.POST("/roles", handler.RoleSingleCreate)      // 创建单条
		r.PATCH("/roles/:id", handler.RoleUpdateByPk)   // 按ID更新
		r.DELETE("/roles/:id", handler.RoleDestroyByPk) // 按ID删除
		r.POST("/role", handler.RoleFindOrCreate)       // 查询或创建
	}
	{
		r.GET("/users", handler.UserFindAndCountAll)    // 获取多条
		r.GET("/users/:id", handler.UserFindByPk)       // 按ID查找
		r.POST("/users", handler.UserSingleCreate)      // 创建单条
		r.PATCH("/users/:id", handler.UserUpdateByPk)   // 按ID更新
		r.DELETE("/users/:id", handler.UserDestroyByPk) // 按ID删除
		r.POST("/user", handler.UserFindOrCreate)       // 查询或创建
	}
	{
		r.GET("/usergroups", handler.UserGroupFindAndCountAll)    // 获取多条
		r.GET("/usergroups/:id", handler.UserGroupFindByPk)       // 按ID查找
		r.POST("/usergroups", handler.UserGroupSingleCreate)      // 创建单条
		r.PATCH("/usergroups/:id", handler.UserGroupUpdateByPk)   // 按ID更新
		r.DELETE("/usergroups/:id", handler.UserGroupDestroyByPk) // 按ID删除
		r.POST("/usergroup", handler.UserGroupFindOrCreate)       // 查询或创建
	}

	return r
}
