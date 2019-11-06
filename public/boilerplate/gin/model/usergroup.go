package model

import (
	"time"

	"github.com/fishjar/gin-rest-boilerplate/db"
	uuid "github.com/satori/go.uuid"
)

// UserGroup 定义模型
// gorm tags参考：https://gorm.io/docs/models.html
// binding tags参考：https://godoc.org/gopkg.in/go-playground/validator.v8
// 时间格式比较严格，参考：https://golang.org/pkg/time/#pkg-constants
// 模型定义中全部使用指针类型，是为了可以插入null值到数据库，但这样会造成一些使用的麻烦
// 也可以使用"database/sql"或"github.com/guregu/null"包中封装的类型
// 但是这样会造成binding验证失效，目前没有更好的实现办法，所以暂时全部使用指针类型
type UserGroup struct {
	Base
	UserID   uuid.UUID  `json:"userId" gorm:"column:user_id;not null"`                                // 用户ID
	User     *User      `json:"user" gorm:"foreignkey:UserID"`                                        // 用户
	GroupID  uuid.UUID  `json:"groupId" gorm:"column:user_id;not null"`                               // 组ID
	Group    *Group     `json:"group" gorm:"foreignkey:GroupID"`                                      // 组
	Level    *int       `json:"level" gorm:"column:level;type:TINYINT;default:0" binding:"omitempty"` // 级别
	JoinTime *time.Time `json:"joinTime" gorm:"column:join_time;type:DATETIME" binding:"omitempty"`   // 加入时间
}

// TableName 自定义表名
func (UserGroup) TableName() string {
	return "usergroup"
}

func init() {
	db.DB.AutoMigrate(&UserGroup{}) // 同步表
}
