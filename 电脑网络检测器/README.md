# 电脑网络检测器

Java Swing 桌面程序，检测当前电脑网络连通状态。

## 功能

- 启动后弹出进度条窗口
- 后台通过 DNS 解析 + TCP 连接多重检测网络状态
- 检测完成后弹窗显示结果（有网 / 没网）

## 运行

```bash
javac -encoding UTF-8 src/NetworkDetector.java -d out
java -cp out NetworkDetector
```

## 项目结构

```
├── src/
│   └── NetworkDetector.java   # 源码
├── out/                        # 编译输出（gitignore）
└── .gitignore
```

## 检测逻辑

1. DNS 解析：依次尝试解析 baidu.com、qq.com、aliyun.com、google.com、8.8.8.8
2. TCP 连接：尝试连接常用端口（80、443、53）
3. 任一成功即判定为有网
