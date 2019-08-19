## 初始化資料庫
### 在mysql中新增lungsoundviz資料庫，語系utf8_general_ci，產生資料表的sql檔案在目錄db-init中，
### terminal中切換到目錄 cd db-init 產生模擬資料，file.js會產生一年的檔案資料，日期可自行調整
1. 執行 node file.js
2. 執行 node feature.js
3. 執行 node feature_section.js

### feature裡的percentage應該是來自於feature_section的總和/30s *100%，日後可以修正這段
### 啟動專案，terminal目錄切換至專案root下，執行 nodemon
### 瀏覽器輸入 localhost:4000
