# FanVPN Config Extractor

本项目提供了用于解密并提取 FanVPN 高质量节点配置信息的 JavaScript 脚本。

## 数据需求

在使用前，需要先从 FanVPN 的 Chrome 扩展程序的安装目录中获取以下信息：

1. **获取密钥 (`PRIVATE_KEY_PEM`)**
   - 在扩展程序文件夹中找到 `background.js` 文件
   - 搜索 `PRIVATE_KEY_PEM`，复制其对应的 PEM 格式私钥（我们已临时内置了一个
   - 将复制的私钥填入到 `decryptFanVPN.js` 中的 `PRIVATE_KEY` 变量中

2. **获取密文 (`CONFIG_URLS`)**
   - 在 `background.js` 中搜索 `CONFIG_URLS`
   - 从中提取包含加密节点配置的原始文件 URL 组（如 https://www.githubip.xyz/config.json
   - 请求该 URL 即可获取包含 `key`、`iv` 和 `data` 字段的加密配置对象（`configObj`

## 调用示例

在获取到密文后，可通过以下方式调用解密函数：

```javascript
const encryptedConfig = {
    key: "BASE64_ENCRYPTED_AES_KEY...",
    iv: "BASE64_IV...",
    data: "BASE64_ENCRYPTED_DATA..."
};

decryptFanVPN(encryptedConfig)
    .then(config => {
        console.log("result: ", config);// 包含数个代理信息的 JSON
    })
    .catch(err => {
        console.error("failed: ", err);
    });
```

## 注意事项

* 本脚本依赖 Web Crypto API，需在 现代浏览器 或 Node.js 15+ 环境中运行。
* 本项目仅用于技术交流与学术研究，请勿用于违反相关服务条款或法律法规的活动。
* FanVPN 自身完全免费，请勿将本项目用于商业用途。
