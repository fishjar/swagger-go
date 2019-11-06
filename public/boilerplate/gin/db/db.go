/*
	db 数据库连接
*/

package db

import (
	"fmt"
	"os"
	"time"

	"github.com/fishjar/gin-rest-boilerplate/config"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite" // 引入sqlite驱动
	// _ "github.com/jinzhu/gorm/dialects/mysql" // 引入mysql驱动
)

// DB 为ORM全局实例
var DB *gorm.DB

func init() {
	var dbPath string
	dbPath = config.DBPath // mysql
	if config.DBDriver == "sqlite3" {
		dbPath = os.Getenv("GOPATH") + config.DBPath //sqlite
	}
	db, err := gorm.Open(config.DBDriver, dbPath)
	if err != nil {
		fmt.Println("打开数据库错误：", err)
		panic("连接数据库失败")
	}

	db.LogMode(true) // 生产环境建议关闭

	db.DB()
	db.DB().Ping()

	// 链接池设置
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(100)
	db.DB().SetConnMaxLifetime(time.Hour)

	DB = db
}
