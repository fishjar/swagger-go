package model

import (
	"github.com/fishjar/gin-rest-boilerplate/db"
)

// Role 定义模型
// gorm tags参考：https://gorm.io/docs/models.html
// binding tags参考：https://godoc.org/gopkg.in/go-playground/validator.v8
// 时间格式比较严格，参考：https://golang.org/pkg/time/#pkg-constants
// 模型定义中全部使用指针类型，是为了可以插入null值到数据库，但这样会造成一些使用的麻烦
// 也可以使用"database/sql"或"github.com/guregu/null"包中封装的类型
// 但是这样会造成binding验证失效，目前没有更好的实现办法，所以暂时全部使用指针类型
type Role struct {
	Base
	Name  string  `json:"name" gorm:"column:name;type:VARCHAR(32);unique;not null" binding:"min=3,max=20"` // 角色名称
	Users []*User `json:"users" gorm:"many2many:userrole;"`                                                // 用户
	Menus []*Menu `json:"menus" gorm:"many2many:rolemenu;"`                                                // 菜单
}

// TableName 自定义表名
func (Role) TableName() string {
	return "role"
}

func init() {
	db.DB.AutoMigrate(&Role{}) // 同步表
}
