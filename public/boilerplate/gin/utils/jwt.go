/*
	工具包
*/

package utils

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/fishjar/gin-rest-boilerplate/config"
)

// MyClaims JWT加密的结构体
type MyClaims struct {
	AuthID   string `json:"authID"`   // 用户ID
	AuthName string `json:"authName"` // 用户名
	AuthType string `json:"authType"` // 用户类型
	jwt.StandardClaims
}

// MakeToken 创建JWT的TOKEN
func MakeToken(authID string, authName string, authType string) (string, error) {

	signKey := config.JWTSignKey     // JWT加密用的密钥
	expiresAt := config.JWTExpiresAt // JWT过期时间，分钟为单位
	mySigningKey := []byte(signKey)  // 密钥格式转换

	claims := MyClaims{
		authID,
		authName,
		authType,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(expiresAt) * time.Minute).Unix(),
			Issuer:    "test",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(mySigningKey)
}

// ParseToken 解析JWT的TOKEN
func ParseToken(tokenString string) (*MyClaims, error) {

	signKey := config.JWTSignKey    // JWT加密用的密钥
	mySigningKey := []byte(signKey) // 密钥格式转换

	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
		return mySigningKey, nil
	})

	if err != nil {
		return nil, err
	}

	// 验证成功
	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, nil
	}

	// 验证失败
	return nil, errors.New("验证失败")
}

// 测试JWT功能是否正常
func init() {
	// 测试生成token
	token, err := MakeToken("123", "gabe", "account")
	if err != nil {
		fmt.Println(err)
		panic("JWT生成token出错")
	}

	// 测试解析token
	claims, err := ParseToken(token)
	if err != nil {
		fmt.Println(err)
		panic("JWT解析token出错")
	}

	fmt.Println("JWT正常")
	fmt.Println("AuthID:", claims.AuthID)
	fmt.Println("AuthName:", claims.AuthName)
	fmt.Println("AuthType:", claims.AuthType)
}
