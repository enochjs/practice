### add gitlab_home => .zshrc
export GITLAB_HOME=$HOME/gitlab

### docker
```sh
docker run \
  --detach \
  --restart unless-stopped \
  --name gitlab-ce \
  --privileged \
  --memory 12G \
  --publish 22:22 \
  --publish 8092:80 \
  --publish 443:443 \
  --hostname 10.10.0.253 \
  --env GITLAB_ROOT_PASSWORD="enochjs@pwd" \
  --volume $GITLAB_HOME/conf:/etc/gitlab:z \
  --volume $GITLAB_HOME/logs:/var/log/gitlab:z \
  --volume $GITLAB_HOME/data:/var/opt/gitlab:z \
  yrzr/gitlab-ce-arm64v8:latest
```

### set password
sudo docker exec -it gitlab-ce grep 'Password:' /etc/gitlab/initial_root_password

### gitlab runner
```sh
docker volume create gitlab-runner-config
docker run -d --name gitlab-runner --restart always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v gitlab-runner-config:/etc/gitlab-runner \
    gitlab/gitlab-runner:latest
```

docker run --rm -it -v gitlab-runner-config/config:/etc/gitlab-runner gitlab/gitlab-runner register

docker exec -it gitlab-runner gitlab-runner register  --url http://10.10.0.253:8092  --token glrt-zywLDyfbhSXMV8YyoxFH

#Gitlab最终的访问地址
external_url 'http://10.10.0.253:8092/'
#最终的SSH地址
gitlab_rails['gitlab_ssh_host'] = '10.10.0.253'
#nginx监听地址
nginx['listen_addresses'] = ['*']
#容器内部nginx的监听端口
nginx['listen_port'] = 80

gitlab-ctl reconfigure

<!-- https://www.jianshu.com/p/f2b79af2fdc8 -->