/*
	GIN + GROM 的 REST 项目模板
*/

package main

import (
	"fmt"

	"github.com/fishjar/gin-rest-boilerplate/config"
	"github.com/fishjar/gin-rest-boilerplate/db"
	"github.com/fishjar/gin-rest-boilerplate/model"
	"github.com/fishjar/gin-rest-boilerplate/router"
	"github.com/fishjar/gin-rest-boilerplate/utils"
)

func main() {
	defer db.DB.Close()         // 关闭数据库连接
	defer utils.LogFile.Close() // 关闭日志文件

	r := router.InitRouter()                   // 获取gin对象
	r.Run(fmt.Sprintf(":%d", config.HTTPPort)) // 启动服务

	// 下面是定制启动参数的写法
	// s := &http.Server{
	// 	Addr:           fmt.Sprintf(":%d", config.HTTPPort),
	// 	Handler:        r,
	// 	ReadTimeout:    10 * time.Second,
	// 	WriteTimeout:   10 * time.Second,
	// 	MaxHeaderBytes: 1 << 20,
	// }
	// s.ListenAndServe()
}

func init() {
	// 创建默认用户
	name := "gabe"
	gender := 1
	user := model.User{
		Name:   name,
		Gender: &gender,
	}
	if err := db.DB.Where(&user).First(&user).Error; err == nil {
		fmt.Println("默认用户已存在：", err)
		return
	}

	// 创建默认用户
	db.DB.Create(&user)
	fmt.Println("默认用户已创建")
	fmt.Println("user：", user)

	// 创建认证帐号
	authType := "account"
	authCode := utils.MD5Pwd("gabe", "123456")
	auth := model.Auth{
		UserID:   user.ID,
		AuthType: authType,
		AuthName: name,
		AuthCode: &authCode,
	}
	db.DB.Create(&auth)

	// 创建测试用户
	jack := model.User{Name: "jack"}
	rose := model.User{Name: "rose"}
	db.DB.Create(&jack)
	db.DB.Create(&rose)

	// 创建角色
	adminRole := model.Role{Name: "admin"}
	userRole := model.Role{Name: "user"}
	guestRole := model.Role{Name: "guest"}
	db.DB.Create(&adminRole)
	db.DB.Create(&userRole)
	db.DB.Create(&guestRole)

	// 创建组
	titanicGroup := model.Group{
		Name:     "titanic",
		LeaderID: jack.ID,
	}
	rayjarGroup := model.Group{
		Name:     "rayjar",
		LeaderID: user.ID,
	}
	db.DB.Create(&titanicGroup)
	db.DB.Create(&rayjarGroup)

	// 创建菜单
	icon := "smile"
	sort := 0
	welcomeMenu := model.Menu{
		Name: "welcome",
		Path: "/welcome",
		Icon: &icon,
		Sort: &sort,
	}
	db.DB.Create(&welcomeMenu)

	icon = "dashboard"
	sort = 1
	dashboardMenu := model.Menu{
		Name: "dashboard",
		Path: "/dashboard",
		Icon: &icon,
		Sort: &sort,
	}
	db.DB.Create(&dashboardMenu)

	sort = 0
	usersMenu := model.Menu{
		ParentID: dashboardMenu.ID,
		Name:     "welcome",
		Path:     "/dashboard/users",
		Sort:     &sort,
	}
	db.DB.Create(&usersMenu)

	sort = 1
	authsMenu := model.Menu{
		ParentID: dashboardMenu.ID,
		Name:     "auths",
		Path:     "/dashboard/auths",
		Sort:     &sort,
	}
	db.DB.Create(&authsMenu)

	// 关联角色菜单
	db.DB.Model(&adminRole).Association("Menus").Append([]model.Menu{welcomeMenu, dashboardMenu, usersMenu, authsMenu})
	db.DB.Model(&userRole).Association("Menus").Append([]model.Menu{welcomeMenu, dashboardMenu, usersMenu})

	// 关联用户角色
	db.DB.Model(&user).Association("Roles").Append([]model.Role{adminRole, userRole, guestRole})
	db.DB.Model(&jack).Association("Roles").Append([]model.Role{userRole, guestRole})
	db.DB.Model(&rose).Association("Roles").Append([]model.Role{guestRole})

	// 关联用户团队
	db.DB.Model(&user).Association("Groups").Append([]model.Group{titanicGroup})
	db.DB.Model(&jack).Association("Groups").Append([]model.Group{titanicGroup, rayjarGroup})
	db.DB.Model(&rose).Association("Groups").Append([]model.Group{titanicGroup, rayjarGroup})

	// 关联用户友谊
	db.DB.Model(&user).Association("Friends").Append(jack)
	db.DB.Model(&user).Association("Friends").Append(rose)
	db.DB.Model(&jack).Association("Friends").Append(rose)
}
