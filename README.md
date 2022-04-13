### register
设置先在redis中存储，过时删除，必须在一定的时间内完成验证，使用username作为key

users create index base userId or username

use redis 布隆过滤器验证用户重复登录

### 聊天
#### 发信息
- 限制刷屏
redis存储当前信息(use hash key)

- 限制db持续写入
使用redis缓存，缓存达到数量再进行写入


### uses

### rooms 
user redis cache db to reduce frequent read;

### online 
use redis hash store


## logger
隔离生产/开发环境