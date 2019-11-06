/*
	中间件
*/

package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/fishjar/gin-rest-boilerplate/db"
	"github.com/fishjar/gin-rest-boilerplate/model"

	"github.com/fishjar/gin-rest-boilerplate/utils"
	"github.com/gin-gonic/gin"
)

// JWTAuth 验证中间件
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {

		// 登录链接不做验证
		path := c.Request.URL.Path
		if path == "/login/account" {
			c.Next()
			return
		}

		// 获取token
		authorization := c.Request.Header.Get("Authorization")
		utils.Log.Error.Println("req authorization: ", authorization)
		tokenString := strings.Replace(authorization, "Bearer ", "", 1)

		if tokenString == "" {
			// 验证失败
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "没有权限：token不能为空",
			})
			c.Abort() // 直接返回
			return
		}

		// 解析token
		claims, err := utils.ParseToken(tokenString)
		if claims == nil || err != nil {
			// 验证失败
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "没有权限：token解析错误",
			})
			c.Abort() // 直接返回
			return
		}

		authID := claims.AuthID
		authName := claims.AuthName
		authType := claims.AuthType
		var auth model.Auth

		fmt.Println("authID", authID)

		// 验证帐号
		if err := db.DB.Where("id = ?", authID).First(&auth).Error; err != nil {
			// 验证失败
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "没有权限：帐号不存在",
			})
			c.Abort() // 直接返回
			return
		}

		// 验证密码
		if auth.AuthName != authName || auth.AuthType != authType {
			// 验证失败
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "没有权限：帐号或密码错误",
			})
			c.Abort() // 直接返回
			return
		}

		// 验证成功
		// 挂载到全局
		c.Set("authID", authID)
		c.Set("authName", authName)
		c.Set("authType", authType)

		// 返回一个新token给客户端(未验证)
		if newToken, err := utils.MakeToken(authID, authName, authType); err == nil {
			c.Writer.Header().Set("authtoken", newToken)
		}

		c.Next()

	}
}
