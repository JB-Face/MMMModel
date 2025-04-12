# MMModel 项目文档

## 1. 项目概述

### 1.1 项目简介
MMModel是一个基于Web的猫咪培育游戏系统，允许用户通过基因组合培育不同品种的猫咪，进行旅行收集明信片，并可以与其他玩家分享自己的猫咪和机票。

### 1.2 技术栈
- 前端：原生JavaScript + HTML5 + CSS3
- 后端：Node.js + Express
- 数据库：MongoDB
- 认证：JWT (JSON Web Tokens)

## 2. 系统架构

### 2.1 目录结构
```
MMMModel/
├── Game.html          # 主游戏界面
├── share.html         # 分享页面
├── script.js          # 主要游戏逻辑
├── styles.css         # 样式表
├── lib/              # 第三方库
│   └── qrcode.min.js # 二维码生成库
└── MMMModelServer/   # 服务端代码
    ├── server.js     # 服务器入口
    ├── models/       # 数据模型
    └── routes/       # API路由
```

### 2.2 核心模块
1. 用户系统
2. 猫咪培育系统
3. 商店系统
4. 旅行系统
5. 分享系统
6. 图鉴系统

## 3. 功能模块详解

### 3.1 用户系统

#### 3.1.1 用户模型
```javascript
const userSchema = new Schema({
    username: String,
    password: String,
    cats: [catSchema],
    tickets: [ticketSchema],
    shares: [shareSchema],
    encyclopedia: {
        discoveredCats: [String],
        discoveredColors: [String]
    }
});
```

#### 3.1.2 认证流程
1. 用户注册/登录
2. 获取JWT令牌
3. 使用令牌访问API

### 3.2 猫咪培育系统

#### 3.2.1 基因系统
```javascript
const GENE_DATA = [
    ["W", "w"],     // 梵色
    ["i", "l", "S"], // 品种
    ["B", "b", "O", "o"], // 颜色
    ["D", "d"],     // 减淡
    ["A", "a"],     // 山猫
    ["F", "f"]      // 翎毛
];
```

#### 3.2.2 繁殖机制
```javascript
function breedCats(cat1, cat2) {
    // 检查CD时间
    if (!checkBreedingCD(cat1, cat2)) {
        return { success: false, message: "猫咪正在繁殖冷却中" };
    }
    
    // 生成子代基因
    const childGenes = generateChildGenes(cat1.genes, cat2.genes);
    
    // 计算外观
    const appearance = calculateAppearance(childGenes);
    
    return {
        success: true,
        child: {
            genes: childGenes,
            appearance: appearance
        }
    };
}
```

### 3.3 商店系统

#### 3.3.1 商店类型
1. 猫咪商店
2. 机票商店

#### 3.3.2 商店刷新机制
```javascript
async function refreshShop(type) {
    const response = await ApiManager.post(`/shop/${type}/refresh`);
    if (response.success) {
        updateShopDisplay(type, response.data);
    }
}
```

### 3.4 旅行系统

#### 3.4.1 机票管理
```javascript
async function useTicket(ticketId) {
    const response = await ApiManager.post(`/ops/travel/start`, {
        ticketId: ticketId
    });
    if (response.success) {
        updateTravelStatus(response.data);
    }
}
```

#### 3.4.2 明信片系统
```javascript
async function collectPostcard(location) {
    const response = await ApiManager.post(`/ops/travel/collect`, {
        location: location
    });
    if (response.success) {
        updatePostcards(response.data);
    }
}
```

### 3.5 分享系统

#### 3.5.1 分享功能
```javascript
async function shareContent(type, id) {
    const response = await ApiManager.post(`/share/create`, {
        type: type,
        contentId: id
    });
    if (response.success) {
        showShareDialog(response.data);
    }
}
```

#### 3.5.2 二维码生成
```javascript
function generateQRCode(url) {
    if (typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById("qrcode"), {
            text: url,
            width: 128,
            height: 128
        });
    } else {
        console.error("QRCode library not loaded");
    }
}
```

### 3.6 "我的分享"管理
```javascript
async function loadMyShares() {
    const sharesContainer = document.getElementById('shares-display');
    sharesContainer.innerHTML = '<p class="loading-text">加载中...</p>';
    
    try {
        const response = await ApiManager.get('share/my-shares');
        
        if (response.success && response.data.length > 0) {
            sharesContainer.innerHTML = '';
            response.data.forEach(share => {
                const shareItem = createShareItem(share);
                sharesContainer.appendChild(shareItem);
            });
        } else {
            sharesContainer.innerHTML = '<p class="no-data">您还没有分享任何内容</p>';
        }
    } catch (error) {
        sharesContainer.innerHTML = '<p class="error-text">加载失败，请稍后重试</p>';
    }
}
```

## 4. API接口文档

### 4.1 认证接口
```
POST /api/auth/register
POST /api/auth/login
```

### 4.2 游戏操作接口
```
POST /api/ops/breed
POST /api/ops/travel/start
POST /api/ops/travel/collect
```

### 4.3 商店接口
```
GET /api/shop/cats
GET /api/shop/tickets
POST /api/shop/refresh
```

### 4.4 分享接口
```
POST /api/share/create
GET /api/share/my-shares
DELETE /api/share/:id
```

## 5. 使用流程

### 5.1 项目启动
1. 安装依赖包：
```bash
# 在服务器目录下
cd MMMModelServer
npm install
```

2. 启动服务器：
```bash
# 在服务器目录下
node server.js
```

3. 打开游戏：
   直接在浏览器中打开Game.html文件，或通过服务器访问该文件。

### 5.2 新用户入门
1. 注册账号
2. 购买初始猫咪
3. 了解基因系统
4. 开始培育

### 5.3 猫咪培育
1. 选择两只猫咪
2. 点击繁殖按钮
3. 等待CD时间
4. 获得子代猫咪

### 5.4 旅行系统
1. 购买机票
2. 选择目的地
3. 开始旅行
4. 收集明信片

### 5.5 分享功能
1. 选择要分享的内容
2. 生成分享链接
3. 复制链接或扫描二维码
4. 分享给其他玩家

## 6. 错误处理

### 6.1 常见错误
1. 网络连接错误
2. 认证失败
3. 操作CD中
4. 资源不足

### 6.2 错误处理机制
```javascript
try {
    const response = await ApiManager.post(url, data);
    if (!response.success) {
        showError(response.message);
    }
} catch (error) {
    showError("操作失败，请稍后重试");
}
```

## 7. 开发和维护

### 7.1 开发环境
- Node.js v14+
- MongoDB v4+
- 现代浏览器 (支持ES6)

### 7.2 调试提示
- 前端：使用浏览器开发者工具检查网络请求和控制台输出
- 后端：查看服务器日志文件，使用postman测试API

### 7.3 版本更新
1. 功能迭代
2. bug修复
3. 性能优化

## 8. 联系和支持
如果您有任何问题或建议，请联系项目维护者。 
