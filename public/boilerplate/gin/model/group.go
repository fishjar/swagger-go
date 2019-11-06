package model

import (
	"github.com/fishjar/gin-rest-boilerplate/db"
	uuid "github.com/satori/go.uuid"
)

// Group 定义模型
// gorm tags参考：https://gorm.io/docs/models.html
// binding tags参考：https://godoc.org/gopkg.in/go-playground/validator.v8
// 时间格式比较严格，参考：https://golang.org/pkg/time/#pkg-constants
// 模型定义中全部使用指针类型，是为了可以插入null值到数据库，但这样会造成一些使用的麻烦
// 也可以使用"database/sql"或"github.com/guregu/null"包中封装的类型
// 但是这样会造成binding验证失效，目前没有更好的实现办法，所以暂时全部使用指针类型
type Group struct {
	Base
	Name     string    `json:"name" gorm:"column:name;type:VARCHAR(32);not null" binding:"min=3,max=20"` // 组名称
	LeaderID uuid.UUID `json:"leaderId" gorm:"column:leader_id;not null"`                                // 队长ID
	Leader   *User     `json:"leader" gorm:"foreignkey:LeaderID"`                                        // 队长
	Users    []*User   `json:"users" gorm:"many2many:usergroup;"`                                        // 队员
}

// TableName 自定义表名
func (Group) TableName() string {
	return "group"
}

func init() {
	db.DB.AutoMigrate(&Group{}) // 同步表
}
