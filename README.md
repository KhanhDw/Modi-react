# React + Vite1

tạo 1 branch mới (đây là tạo local): 
``` git checkout -b TenNGdung ```

Đẩy lên lần đầu: 
```git push --set-upstream origin TenNGdung```
(lần sau chỉ sài git push là được) 
(lệnh này tác dụng tạo một branch và cập nhật branch lên git luôn - không còn là local nữa)

# cách clone một nhánh cụ thể 
```git clone --branch <tên-nhánh> --single-branch <url-repo>```
ví dụ
```git clone --branch develop --single-branch https://github.com/user/repo.git```

# cách 2 Clone bình thường rồi checkout nhánh sau

``` git fetch origin ```
``` git checkout <tên-nhánh>```

# Kiểm tra các nhánh hiện có (sau khi clone):

``` git branch -a ```
