package model

import (
	"time"

	"github.com/fishjar/gin-rest-boilerplate/db"
	uuid "github.com/satori/go.uuid"
)

// Auth 定义模型
// gorm tags参考：https://gorm.io/docs/models.html
// binding tags参考：https://godoc.org/gopkg.in/go-playground/validator.v8
// 时间格式比较严格，参考：https://golang.org/pkg/time/#pkg-constants
// 模型定义中全部使用指针类型，是为了可以插入null值到数据库，但这样会造成一些使用的麻烦
// 也可以使用"database/sql"或"github.com/guregu/null"包中封装的类型
// 但是这样会造成binding验证失效，目前没有更好的实现办法，所以暂时全部使用指针类型
type Auth struct {
	Base
	UserID     uuid.UUID  `json:"userId" gorm:"column:user_id;not null"`                                  // 用户ID
	User       *User      `json:"user" gorm:"foreignkey:UserID"`                                          // 用户
	AuthType   string     `json:"authType" gorm:"column:auth_type;type:VARCHAR(16);not null"`             // 鉴权类型
	AuthName   string     `json:"authName" gorm:"column:auth_name;type:VARCHAR(128);not null"`            // 鉴权名称
	AuthCode   *string    `json:"authCode" gorm:"column:auth_code" binding:"omitempty"`                   // 鉴权识别码
	VerifyTime *time.Time `json:"verifyTime" gorm:"column:verify_time;type:DATETIME" binding:"omitempty"` // 认证时间
	ExpireTime *time.Time `json:"expireTime" gorm:"column:expire_time;type:DATETIME" binding:"omitempty"` // 过期时间
	IsEnabled  *bool      `json:"isEnabled" gorm:"column:is_enabled" binding:"omitempty"`                 // 是否启用
}

// TableName 自定义表名
func (Auth) TableName() string {
	return "auth"
}

func init() {
	db.DB.AutoMigrate(&Auth{}) // 同步表
}
