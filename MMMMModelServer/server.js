// ... existing code ...
// 中间件
app.use(cors());
app.use(express.json());

// 添加CSP头
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; connect-src 'self' http://localhost:* http://127.0.0.1:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    next();
});

// 处理分享页面路由
app.get('/share', (req, res) => {
    res.sendFile(path.join(__dirname, '../MMMModel/share.html'));
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../MMMModel')));

// ... existing code ...