/*
	配置文件
*/

package config

// 配置参数设置
const (
	DBDriver string = "sqlite3"                                                 // 数据库驱动
	DBPath   string = "/src/github.com/fishjar/gin-rest-boilerplate/db/test.db" // 数据库链接
	// DBDriver     string = "mysql"                                                     // 数据库驱动
	// DBPath       string = "root:123456@/testdb?charset=utf8&parseTime=True&loc=Local" // 数据库链接
	HTTPPort     int    = 4000                                                       // 端口号
	LogPath      string = "/src/github.com/fishjar/gin-rest-boilerplate/log/gin.log" // 日志目录
	JWTSignKey   string = "123456"                                                   // JWT加密用的密钥
	JWTExpiresAt int    = 60 * 24                                                    // JWT过期时间，分钟为单位
	PWDSalt      string = "123456"                                                   // 密码哈希盐
)
