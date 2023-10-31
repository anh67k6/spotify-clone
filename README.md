# spotify-clone

Git flow:

Cách làm việc với git:

Clone code từ repository về local 

Chạy npm/yarn/npx install để cài node modules về local


Branch: 

main: là bản final, hoàn thiện, chỉ được phép push bằng merge, không được commit trực tiếp lên

test: merge từ các nhánh con vào để test, test hoàn thiện từng feature rồi mới được merge vào main

Mỗi khi làm tính năng:

Tính năng mới: 

git checkout main
git pull <remote> main
git checkout -b <tên tính năng> (Cái này để tạo nhánh mới)

Sau khi làm xong:
Pull code từ nhánh main về để xem có conflict gì không -> self test lại 1 lần
Commit và đẩy lên nhánh tính năng đó vào nhánh hiện tại
Vào nhánh test, merge vào test rồi test tiếp
Xong nhắn vào group, done

ví dụ 
git pull <remote> main
git commit -m "add login final"
git push <remote> login

Lưu ý: 
Không git add . , hãy add từng file mình sửa bằng git status, ai làm gì sửa nhánh đấy
Hãy clean code trước khi push
Và ĐỪNG PUSH NODE MODULE nhé ạ

 **Note**
 Tạo file .env rồi copy content từ .env.example để có thể kết nối với mongoDB
