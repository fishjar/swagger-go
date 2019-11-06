/*
	对应路由的处理函数
*/

package handler

import (
	"net/http"

	"github.com/fishjar/gin-rest-boilerplate/db"
	"github.com/fishjar/gin-rest-boilerplate/model"
	"github.com/fishjar/gin-rest-boilerplate/utils"
	"github.com/gin-gonic/gin"
)

// LoginAccount 登录处理函数
func LoginAccount(c *gin.Context) {

	// LoginForm 登录表单
	type LoginForm struct {
		UserName string `form:"userName" binding:"required"`
		PassWord string `form:"password" binding:"required"`
	}
	var login LoginForm

	// 绑定数据
	if err := c.ShouldBind(&login); err != nil {
		utils.Log.Warning.Println("登录失败，参数有误：", err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "登录失败，参数有误",
		})
		return
	}

	// 查询用户是否存在
	authType := "account"
	passWord := utils.MD5Pwd(login.UserName, login.PassWord)
	var auth model.Auth
	if err := db.DB.Where(&model.Auth{
		AuthName: login.UserName,
		AuthType: authType,
		AuthCode: &passWord,
	}).First(&auth).Error; err != nil {
		utils.Log.Warning.Println("登录失败，用户名或密码错误：", err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "登录失败，用户名或密码错误",
		})
		return
	}

	// 生成token
	id := auth.ID.String()
	authtoken, err := utils.MakeToken(id, auth.AuthName, auth.AuthType)
	if err != nil {
		utils.Log.Warning.Println("登录失败，获取token失败：", err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "登录失败，获取token失败",
		})
		return
	}

	// 登录成功
	c.JSON(http.StatusOK, gin.H{
		"message":   "登录成功",
		"authtoken": authtoken,
	})

}
