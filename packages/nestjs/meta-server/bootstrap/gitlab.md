### add gitlab_home => .zshrc
export GITLAB_HOME=$HOME/gitlab

### docker
```sh
docker run \
  --detach \
  --restart unless-stopped \
  --name gitlab-ce \
  --privileged \
  --memory 8G \
  --publish 22:22 \
  --publish 8092:80 \
  --publish 443:443 \
  --hostname localhost \
  --env GITLAB_ROOT_PASSWORD="enochjs@pwd" \
  --volume $GITLAB_HOME/gitlab-ce/conf:/etc/gitlab:z \
  --volume $GITLAB_HOME/gitlab-ce/logs:/var/log/gitlab:z \
  --volume $GITLAB_HOME/gitlab-ce/data:/var/opt/gitlab:z \
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
