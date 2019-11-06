package model

import (
	"github.com/fishjar/gin-rest-boilerplate/db"
	uuid "github.com/satori/go.uuid"
)

// Menu 定义模型
// gorm tags参考：https://gorm.io/docs/models.html
// binding tags参考：https://godoc.org/gopkg.in/go-playground/validator.v8
// 时间格式比较严格，参考：https://golang.org/pkg/time/#pkg-constants
// 模型定义中全部使用指针类型，是为了可以插入null值到数据库，但这样会造成一些使用的麻烦
// 也可以使用"database/sql"或"github.com/guregu/null"包中封装的类型
// 但是这样会造成binding验证失效，目前没有更好的实现办法，所以暂时全部使用指针类型
type Menu struct {
	Base
	ParentID uuid.UUID `json:"parentId" gorm:"column:parent_id" binding:"omitempty"` // 父ID
	Parent   *Menu     `json:"parent" gorm:"foreignkey:ParentID"`                    // 父菜单
	Children []*Menu   `json:"children" gorm:"foreignkey:ParentID"`                  // 子菜单
	Name     string    `json:"name" gorm:"column:name;not null"`                     // 菜单名称
	Path     string    `json:"path" gorm:"column:path;not null"`                     // 菜单路径
	Icon     *string   `json:"icon" gorm:"column:icon" binding:"omitempty"`          // 菜单图标
	Sort     *int      `json:"sort" gorm:"column:sort" binding:"omitempty"`          // 排序
	Roles    []*Role   `json:"roles" gorm:"many2many:rolemenu;"`                     // 角色
}

// TableName 自定义表名
func (Menu) TableName() string {
	return "menu"
}

func init() {
	db.DB.AutoMigrate(&Menu{}) // 同步表
}
