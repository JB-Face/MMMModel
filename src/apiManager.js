/**
 * API URL管理函数
 * 提供获取、设置和使用API URL的功能
 */
const ApiManager = {
    // 获取存储的API URL或使用默认值
    getApiUrl: function() {
        return localStorage.getItem('api_base_url') || 'http://localhost:3000/api';
    },

    // 在页面上显示当前API URL
    displayApiUrl: function(elementId = 'api-info') {
        const apiUrl = this.getApiUrl();
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `API: ${apiUrl}`;
        }
    },

    // 发送GET请求到API
    get: async function(endpoint, requireAuth = true) {
        try {
            const url = `${this.getApiUrl()}/${endpoint}`;
            const headers = {};

            // 如果需要认证，添加token
            if (requireAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('未登录，请先登录');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            // 处理response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '请求失败');
            }

            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    },

    // 发送POST请求到API
    post: async function(endpoint, data, requireAuth = true) {
        try {
            const url = `${this.getApiUrl()}/${endpoint}`;
            const headers = {
                'Content-Type': 'application/json'
            };

            // 如果需要认证，添加token
            if (requireAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('未登录，请先登录');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            // 处理response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '请求失败');
            }

            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    },

    // 发送DELETE请求到API
    delete: async function(endpoint, requireAuth = true) {
        try {
            const url = `${this.getApiUrl()}/${endpoint}`;
            const headers = {};

            // 如果需要认证，添加token
            if (requireAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('未登录，请先登录');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });

            // 处理response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '请求失败');
            }

            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    },

    // 发送PATCH请求到API
    patch: async function(endpoint, data, requireAuth = true) {
        try {
            const url = `${this.getApiUrl()}/${endpoint}`;
            const headers = {
                'Content-Type': 'application/json'
            };

            // 如果需要认证，添加token
            if (requireAuth) {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('未登录，请先登录');
                }
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(data)
            });

            // 处理response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '请求失败');
            }

            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }
};

// 使用示例：
/*
// 1. 初始化并显示API URL
ApiManager.displayApiUrl();
  
// 2. 获取用户猫咪列表
try {
  const catsData = await ApiManager.get('ops/user/cats');
  console.log('用户猫咪:', catsData);
} catch (error) {
  alert('获取猫咪失败: ' + error.message);
}
  
// 3. 创建随机猫咪
try {
  const catData = await ApiManager.post('ops/test/CreateRandomCat', {});
  console.log('新猫咪:', catData);
} catch (error) {
  alert('创建猫咪失败: ' + error.message);
}
  
// 4. 修改猫咪名字
try {
  const result = await ApiManager.patch('ops/user/cat/cat_key123/rename', {newName: '小花猫'});
  console.log('修改结果:', result);
} catch (error) {
  alert('修改猫咪名字失败: ' + error.message);
}
  
// 5. 删除猫咪
try {
  const result = await ApiManager.delete('ops/user/cat/cat_key123');
  console.log('删除结果:', result);
} catch (error) {
  alert('删除猫咪失败: ' + error.message);
}
*/