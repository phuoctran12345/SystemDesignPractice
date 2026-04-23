## Ghi chú lệnh quan trọng (K8s/Helm/Minikube/Git)

File này là “cheat sheet” để bạn copy/paste khi làm lab hoặc deploy mini-project.

---

## 0) Nguyên tắc tránh lỗi hay gặp

- **Không gõ y nguyên placeholder** như `<nestjs-pod-name>` hoặc `<10.0.0.1>`.
  - Bạn phải **thay bằng tên thật** (pod name/service name).
- `kubectl exec` là **exec vào Pod name**, không phải Service IP.
- `127.0.0.1:<port>` là **localhost máy bạn** → thiết bị khác **không truy cập được**.
- Khi terminal báo `zsh: event not found: ...` thường do có dấu `!` (history expansion).

---

## 1) Lệnh “xem nhanh” Kubernetes (cực hay dùng)

```bash
kubectl get pods
kubectl get svc
kubectl get deploy
kubectl get sts
kubectl get cm
kubectl get secret
kubectl get pvc
```

Xem theo label (rất hữu ích với Helm):

```bash
kubectl get pods -l app.kubernetes.io/instance=my-postgresql
kubectl get pods -l app.kubernetes.io/instance=my-redis
kubectl get pods -l app.kubernetes.io/instance=my-pg-ha
```

---

## 2) Debug nhanh khi Pod lỗi

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs deploy/<deployment-name>
```

Theo dõi pod thay đổi liên tục:

```bash
kubectl get pods -w
```

---

## 3) DNS trong Kubernetes (resolve service name)

Lấy 1 pod rồi chạy `nslookup`:

```bash
POD=$(kubectl get pods -l app=nestjs -o jsonpath='{.items[0].metadata.name}')
kubectl exec "$POD" -- nslookup mysql-service
kubectl exec "$POD" -- nslookup redis-service
```

---

## 4) Port-forward (mở “đường hầm” từ máy bạn vào Service/Pod)

Port-forward service:

```bash
kubectl port-forward svc/<service-name> 8080:80
kubectl port-forward svc/<service-name> 3000:3000
```

Port-forward postgres:

```bash
kubectl port-forward svc/my-postgresql 5432:5432
```

Lưu ý:
- Link kiểu `http://127.0.0.1:8080` chỉ dùng **trên máy bạn**.

---

## 5) Redis (Helm Bitnami) – lấy password + test replication

Lấy password:

```bash
export REDIS_PASSWORD=$(kubectl get secret my-redis -o jsonpath="{.data.redis-password}" | base64 -d)
echo "$REDIS_PASSWORD"
```

Xem replication:

```bash
kubectl exec -it my-redis-master-0 -- redis-cli -a "$REDIS_PASSWORD" INFO replication
```

SET ở master, GET ở replica:

```bash
kubectl exec -it my-redis-master-0 -- redis-cli -a "$REDIS_PASSWORD" SET testkey "hello-ha"
kubectl exec -it my-redis-replicas-0 -- redis-cli -a "$REDIS_PASSWORD" GET testkey
```

---

## 6) PostgreSQL (Helm Bitnami) – lấy password + test SQL

### 6.1) PostgreSQL thường (`my-postgresql`)

Lấy password:

```bash
export POSTGRES_PASSWORD=$(kubectl get secret my-postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)
echo "$POSTGRES_PASSWORD"
```

Port-forward + test nhanh:

```bash
kubectl port-forward svc/my-postgresql 5432:5432
PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -U postgres -d helmdb -p 5432
```

SQL test:

```sql
CREATE TABLE test_table (id SERIAL PRIMARY KEY, name VARCHAR(50));
INSERT INTO test_table (name) VALUES ('helm-test');
SELECT * FROM test_table;
```

### 6.2) PostgreSQL HA (`my-pg-ha`) – connect qua Pgpool

Lấy password (xem NOTES của chart để đúng secret key):

```bash
export PASSWORD=$(kubectl get secret -n default my-pg-ha-postgresql-ha-postgresql -o jsonpath="{.data.password}" | base64 -d)
echo "$PASSWORD"
```

Liệt kê service để lấy đúng tên pgpool:

```bash
kubectl get svc -l app.kubernetes.io/instance=my-pg-ha
```

Port-forward service pgpool (ví dụ):

```bash
kubectl port-forward svc/<pgpool-service-name> 5432:5432
PGPASSWORD="$PASSWORD" psql -h 127.0.0.1 -p 5432 -U postgres -d hadb
```

---

## 7) Helm – lệnh quan trọng

Repo:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

Install / list / status:

```bash
helm install <release> bitnami/<chart> -f values.yaml -n default
helm list -A
helm status <release> -n default
```

Upgrade (khi release đã tồn tại, tránh lỗi “cannot reuse a name”):

```bash
helm upgrade --install <release> bitnami/<chart> -f values.yaml -n default
```

Uninstall:

```bash
helm uninstall <release> -n default
```

---

## 8) Minikube – lệnh quan trọng

```bash
minikube status
minikube start
minikube update-context
minikube ip
```

Docker build image dùng Minikube docker-env:

```bash
eval $(minikube docker-env)
docker build -t <image>:latest .
```

---

## 9) Git – thói quen để không mất code

Trước khi nhảy nhánh / pull / push:

```bash
git status
git add .
git commit -m "your message"
```

Nếu `git add .` bị lỗi do repo lồng nhau:

```bash
find . -name ".git" -type d
```

---

## 10) Xoá lab (dọn cluster)

Xoá manifest (nếu bạn apply bằng file YAML):

```bash
kubectl delete -f <file>.yaml
```

Xoá Helm releases:

```bash
helm uninstall my-postgresql -n default
helm uninstall my-redis -n default
helm uninstall my-pg-ha -n default
```

Xoá PVC (cẩn thận: **mất dữ liệu**):

```bash
kubectl get pvc
kubectl delete pvc <pvc-name>
```

