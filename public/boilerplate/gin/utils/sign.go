package utils

import (
	"crypto/md5"
	"encoding/hex"

	"github.com/fishjar/gin-rest-boilerplate/config"
)

// MD5Pwd 密码哈希函数
func MD5Pwd(username string, password string) string {
	salt := config.PWDSalt
	m := md5.New()
	m.Write([]byte(username))
	m.Write([]byte(password))
	m.Write([]byte(password))
	m.Write([]byte(salt))
	m.Write([]byte(salt))
	m.Write([]byte(salt))
	return hex.EncodeToString(m.Sum(nil))
}
