### create local mysql

docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql


### 授权其他用户：先创建远程用户，再授权
create user 'admin'@'%' identified by '123456';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
flush privileges;
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY '123456';