### create local mysql

docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql

### start redis

docker run -itd --name redis -p 6379:6379 redis

### 修改config => local config 对应的ip
