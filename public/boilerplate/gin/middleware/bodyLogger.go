package middleware

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"time"

	"github.com/fishjar/gin-rest-boilerplate/utils"

	"github.com/gin-gonic/gin"
)

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	if n, err := w.body.Write(b); err != nil {
		utils.Log.Error.Println(err)
		return n, err
	}
	return w.ResponseWriter.Write(b)
}

// BodyLogger 日志中间件
func BodyLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()
		data, err := c.GetRawData()
		if err != nil {
			utils.Log.Error.Println("req body: ", err.Error())
		} else {
			buffer := new(bytes.Buffer)
			if err := json.Compact(buffer, data); err != nil {
				utils.Log.Error.Println("req body: ", err.Error())
			} else {
				utils.Log.Info.Println("req body: ", buffer)
			}
		}

		c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(data)) // 获取到的数据重新写入body

		// 请求前
		blw := &bodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = blw
		c.Next()

		// 请求后
		latency := time.Since(t)
		utils.Log.Info.Println("res latency: ", latency)

		statusCode := c.Writer.Status()
		utils.Log.Info.Println("res code: ", statusCode)
		if statusCode >= 400 {
			utils.Log.Warning.Println("res body: ", blw.body.String())
		} else {
			utils.Log.Info.Println("res body: ", blw.body.String())
		}

	}
}
