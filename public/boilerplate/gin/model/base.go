/*
	模型定义
*/

package model

import (
	"time"

	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"
)

// Base 给所有模型共用
type Base struct {
	ID        uuid.UUID  `json:"id" gorm:"column:id;primary_key;not null"`                           // ID
	CreatedAt time.Time  `json:"createdAt" gorm:"column:created_at;not null"`                        // 创建时间
	UpdatedAt time.Time  `json:"updatedAt" gorm:"column:update_at;not null"`                         // 更新时间
	DeletedAt *time.Time `json:"deletedAt" sql:"index" gorm:"column:deleted_at" binding:"omitempty"` // 软删除时间
}

// BeforeCreate 在创建前给ID赋值一个UUID
func (base *Base) BeforeCreate(scope *gorm.Scope) error {
	uuid, err := uuid.NewV4()
	if err != nil {
		return err
	}
	return scope.SetColumn("ID", uuid)
}
