// 默认游戏数据
const DEFAULT_GAME_DATA = {
    attributes: {
        毛色: {
            options: ["黑色", "白色", "橘色", "灰色", "奶牛色"],
            weights: [20, 20, 20, 20, 20],
            rarity: [1, 1, 1, 1, 2],
            geneStrength: [80, 80, 80, 80, 60]
        },
        花纹: {
            options: ["纯色", "虎斑", "奶牛纹", "玳瑁", "点状"],
            weights: [30, 20, 20, 15, 15],
            rarity: [1, 2, 2, 3, 3],
            geneStrength: [90, 75, 75, 60, 60]
        },
        眼睛: {
            options: ["黄色", "蓝色", "绿色", "异色瞳"],
            weights: [30, 30, 30, 10],
            rarity: [1, 1, 1, 5],
            geneStrength: [85, 85, 85, 40]
        },
        尾巴: {
            options: ["短尾", "中等", "长尾", "无尾"],
            weights: [20, 40, 30, 10],
            rarity: [2, 1, 1, 4],
            geneStrength: [70, 90, 80, 50]
        },
        性格: {
            options: ["温顺", "活泼", "高冷", "傲娇", "腹黑"],
            weights: [30, 25, 20, 15, 10],
            rarity: [1, 1, 2, 3, 4],
            geneStrength: [75, 75, 70, 60, 50]
        },
        性别: {
            options: ["公", "母"],
            weights: [50, 50],
            rarity: [1, 1],
            geneStrength: [100, 100]
        }
    },
    breedingCooldown: 24,
    defaultMutationRate: 10,
    simulationHistory: []
};

// 默认名字数据
const DEFAULT_NAME_DATA = {
    names: [
        "亚当", "莉莉丝", "萨麦尔", "沙利叶", "拉米尔", "加百列", "伊瑟拉菲尔",
        "阿拉腊特", "巴德尔", "撒哈尔", "伊洛尔", "巴尔迪尔", "泽鲁尔", "阿玛瑟尔",
        "阿尔米萨尔", "塔布里斯", "利慕伊勒", "萨基尔", "图理尔", "雷利姆", "阿尔玛斯",
        "拉斐尔", "米迦勒", "乌利尔", "圣德芬", "阿斯塔禄", "阿撒兹勒", "亚巴顿",
        "拉米尔", "塔尔塔洛斯", "阿斯蒙蒂斯", "贝利尔", "阿斯塔蒂", "阿斯塔罗特"
    ],
    titles: [
        "使徒", "天使", "守护者", "先知", "执行者", "裁决者", "观察者",
        "破坏者", "创造者", "守望者", "引导者", "审判者", "启示者"
    ]
};

// 添加预设配置
const PRESETS = {
    "玄幻": "presets/fantasy.json",
    "现实": "presets/realistic.json",
    "科幻": "presets/scifi.json"
};

// 渲染属性列表
function renderAttributeList() {
    const attributeList = document.getElementById('attributeList');
    attributeList.innerHTML = '';

    Object.entries(gameData.attributes).forEach(([attrName, attrData]) => {
        const attrDiv = document.createElement('div');
        attrDiv.className = 'attribute-list-item';
        attrDiv.innerHTML = `
            <div class="attribute-header">
                <span class="attribute-name">${attrName}</span>
                <div class="attribute-actions">
                    <button onclick="editAttribute('${attrName}')" class="action-button">编辑</button>
                    <button onclick="deleteAttribute('${attrName}')" class="action-button delete">删除</button>
                </div>
            </div>
            <div class="attribute-options">
                ${attrData.options.map(opt => `<span class="option-tag">${opt}</span>`).join('')}
            </div>
        `;
        attributeList.appendChild(attrDiv);
    });
}

// 编辑属性
function editAttribute(attrName) {
    const attr = gameData.attributes[attrName];
    if (!attr) return;

    const dialog = document.createElement('div');
    dialog.className = 'attribute-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>编辑属性: ${attrName}</h3>
            <div class="input-group">
                <label>属性名称:</label>
                <input type="text" id="editAttrName" value="${attrName}">
            </div>
            <div class="input-group">
                <label>选项 (用逗号分隔):</label>
                <input type="text" id="editAttrOptions" value="${attr.options.join(',')}">
            </div>
            <div class="dialog-buttons">
                <button onclick="saveAttributeEdit('${attrName}')" class="primary-button">保存</button>
                <button onclick="closeAttributeDialog()" class="secondary-button">取消</button>
            </div>
        </div>
    `;

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

// 保存属性编辑
function saveAttributeEdit(oldAttrName) {
    const newAttrName = document.getElementById('editAttrName').value.trim();
    const optionsStr = document.getElementById('editAttrOptions').value.trim();
    const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt);

    if (!newAttrName || options.length === 0) {
        alert('属性名和选项不能为空');
        return;
    }

    // 如果是重命名属性
    if (oldAttrName !== newAttrName) {
        const { [oldAttrName]: oldAttr, ...rest } = gameData.attributes;
        gameData.attributes = {
            ...rest,
            [newAttrName]: {
                options: options,
                weights: options.map(() => 50),
                rarity: options.map(() => 1),
                geneStrength: options.map(() => 75)
            }
        };
    } else {
        // 更新现有属性
        gameData.attributes[newAttrName] = {
            options: options,
            weights: options.map((_, i) => 
                i < gameData.attributes[oldAttrName].weights.length 
                    ? gameData.attributes[oldAttrName].weights[i] 
                    : 50
            ),
            rarity: options.map((_, i) => 
                i < gameData.attributes[oldAttrName].rarity.length 
                    ? gameData.attributes[oldAttrName].rarity[i] 
                    : 1
            ),
            geneStrength: options.map((_, i) => 
                i < gameData.attributes[oldAttrName].geneStrength.length 
                    ? gameData.attributes[oldAttrName].geneStrength[i] 
                    : 75
            )
        };
    }

    closeAttributeDialog();
    renderAttributeList();
    renderControls();
    saveToLocalStorage();
}

// 删除属性
function deleteAttribute(attrName) {
    if (attrName === '性别') {
        alert('性别属性不能删除');
        return;
    }

    if (confirm(`确定要删除属性 "${attrName}" 吗？`)) {
        const { [attrName]: removed, ...rest } = gameData.attributes;
        gameData.attributes = rest;
        renderAttributeList();
        renderControls();
        saveToLocalStorage();
    }
}

// 添加新属性
function addNewAttribute() {
    const dialog = document.createElement('div');
    dialog.className = 'attribute-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>添加新属性</h3>
            <div class="input-group">
                <label>属性名称:</label>
                <input type="text" id="newAttrName" placeholder="例如: 毛色">
            </div>
            <div class="input-group">
                <label>选项 (用逗号分隔):</label>
                <input type="text" id="newAttrOptions" placeholder="例如: 黑色,白色,灰色">
            </div>
            <div class="dialog-buttons">
                <button onclick="saveNewAttribute()" class="primary-button">保存</button>
                <button onclick="closeAttributeDialog()" class="secondary-button">取消</button>
            </div>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

// 保存新属性
function saveNewAttribute() {
    const attrName = document.getElementById('newAttrName').value.trim();
    const optionsStr = document.getElementById('newAttrOptions').value.trim();
    const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt);

    if (!attrName || options.length === 0) {
        alert('属性名和选项不能为空');
        return;
    }

    if (gameData.attributes[attrName]) {
        alert('属性名已存在');
        return;
    }

    gameData.attributes[attrName] = {
        options: options,
        weights: options.map(() => 50),
        rarity: options.map(() => 1),
        geneStrength: options.map(() => 75)
    };

    closeAttributeDialog();
    renderAttributeList();
    renderControls();
    saveToLocalStorage();
}

// 关闭属性对话框
function closeAttributeDialog() {
    const overlay = document.querySelector('.dialog-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// 切换面板显示状态
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const header = panel.previousElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    if (!panel || !header || !icon) return;
    
    panel.classList.toggle('collapsed');
    icon.textContent = panel.classList.contains('collapsed') ? '▼' : '▲';
}

// 渲染控制面板
function renderControls() {
    try {
        const weightControls = document.getElementById('weightControls');
        const rarityControls = document.getElementById('rarityControls');
        const geneStrengthControls = document.getElementById('geneStrengthControls');
        
        if (!weightControls || !rarityControls || !geneStrengthControls) {
            throw new Error('找不到必要的DOM元素');
        }
        
        weightControls.innerHTML = '';
        rarityControls.innerHTML = '';
        geneStrengthControls.innerHTML = '';
        
        if (!gameData || !gameData.attributes) {
            throw new Error('游戏数据未正确加载');
        }
        
        // 为每个属性创建控制面板
        Object.entries(gameData.attributes).forEach(([attrName, attrData]) => {
            if (!attrData || !Array.isArray(attrData.options) || 
                !Array.isArray(attrData.weights) || 
                !Array.isArray(attrData.rarity) || 
                !Array.isArray(attrData.geneStrength)) {
                console.error(`属性 ${attrName} 数据结构不完整`);
                return;
            }
            
            // 创建权重控制面板
            const weightPanel = document.createElement('div');
            weightPanel.className = 'attribute-item';
            weightPanel.innerHTML = `
                <label>${attrName} 权重设置:</label>
                ${attrData.options.map((opt, idx) => `
                    <div>
                        <label>${opt}:</label>
                        <input type="number" 
                               value="${attrData.weights[idx] || 0}" 
                               min="0" 
                               max="100"
                               onchange="updateWeight('${attrName}', ${idx}, this.value)">
                    </div>
                `).join('')}
            `;
            weightControls.appendChild(weightPanel);
            
            // 创建稀有度控制面板
            const rarityPanel = document.createElement('div');
            rarityPanel.className = 'attribute-item';
            rarityPanel.innerHTML = `
                <label>${attrName} 稀有度设置:</label>
                ${attrData.options.map((opt, idx) => `
                    <div>
                        <label>${opt}:</label>
                        <input type="number" 
                               value="${attrData.rarity[idx] || 1}" 
                               min="1"
                               onchange="updateRarity('${attrName}', ${idx}, this.value)">
                    </div>
                `).join('')}
            `;
            rarityControls.appendChild(rarityPanel);
            
            // 创建基因强度控制面板
            const geneStrengthPanel = document.createElement('div');
            geneStrengthPanel.className = 'attribute-item';
            geneStrengthPanel.innerHTML = `
                <label>${attrName} 基因强度设置:</label>
                ${attrData.options.map((opt, idx) => `
                    <div>
                        <label>${opt}:</label>
                        <input type="number" 
                               value="${attrData.geneStrength[idx] || 50}" 
                               min="0"
                               max="100"
                               onchange="updateGeneStrength('${attrName}', ${idx}, this.value)">
                    </div>
                `).join('')}
            `;
            geneStrengthControls.appendChild(geneStrengthPanel);
        });
    } catch (error) {
        console.error('渲染控制面板失败:', error);
        alert('渲染控制面板失败: ' + error.message);
    }
}

// 更新属性权重
function updateWeight(attrName, index, value) {
    if (gameData.attributes[attrName]) {
        gameData.attributes[attrName].weights[index] = parseInt(value) || 0;
        saveToLocalStorage();
    }
}

// 更新属性稀有度
function updateRarity(attrName, index, value) {
    if (gameData.attributes[attrName]) {
        gameData.attributes[attrName].rarity[index] = parseInt(value) || 1;
        saveToLocalStorage();
    }
}

// 更新基因强度
function updateGeneStrength(attrName, index, value) {
    if (gameData.attributes[attrName]) {
        gameData.attributes[attrName].geneStrength[index] = parseInt(value) || 50;
        saveToLocalStorage();
    }
}

// 修改初始化函数
async function initGame() {
    try {
        // 初始化默认数据
        gameData = { ...DEFAULT_GAME_DATA };
        nameData = { ...DEFAULT_NAME_DATA };

        // 从localStorage加载用户修改的数据
        const savedData = localStorage.getItem('catBreederData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.attributes) {
                Object.entries(parsedData.attributes).forEach(([key, value]) => {
                    if (gameData.attributes[key]) {
                        gameData.attributes[key] = {
                            ...gameData.attributes[key],
                            ...value
                        };
                    } else {
                        gameData.attributes[key] = value;
                    }
                });
            }
            if (parsedData.simulationHistory) {
                gameData.simulationHistory = parsedData.simulationHistory;
            }
        }

        // 初始化界面
        renderAttributeList();
        renderControls();

        // 添加事件监听
        document.getElementById('addNewAttribute').addEventListener('click', addNewAttribute);
        document.getElementById('startBreeding').addEventListener('click', startBreeding);
        document.getElementById('randomCat').addEventListener('click', () => {
            const cat = generateRandomCat();
            displayCurrentCat(cat);
        });
        document.getElementById('exportResults').addEventListener('click', exportResults);
        document.getElementById('clearResults').addEventListener('click', clearResults);
        document.getElementById('exportAttributes').addEventListener('click', exportAttributes);
        document.getElementById('importAttributes').addEventListener('click', importAttributes);
        
        // 添加预设选择事件监听
        document.getElementById('presetSelect').addEventListener('change', (e) => {
            if (e.target.value && confirm(`确定要加载 ${e.target.value} 预设吗？这将覆盖当前的属性设置。`)) {
                loadPreset(e.target.value);
            }
        });

        // 默认折叠所有面板
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.classList.add('collapsed');
        });
        
    } catch (error) {
        console.error('初始化游戏失败:', error);
        alert('初始化游戏失败: ' + error.message);
    }
}

// 保存数据到localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('catBreederData', JSON.stringify(gameData));
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 当页面加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', initGame);

// 生成随机名字
function generateRandomName() {
    const name = nameData.names[Math.floor(Math.random() * nameData.names.length)];
    const title = nameData.titles[Math.floor(Math.random() * nameData.titles.length)];
    return `${name}·${title}`;
}

// 生成随机猫咪
function generateRandomCat(targetGender = null) {
    const minRarity = parseInt(document.getElementById('initialRarityMin').value) || 1;
    const maxRarity = parseInt(document.getElementById('initialRarityMax').value) || 10;
    
    // 检查阈值设置是否合理
    const minPossibleRarity = Object.values(gameData.attributes)
        .reduce((sum, attr) => sum + Math.min(...attr.rarity), 0);
    const maxPossibleRarity = Object.values(gameData.attributes)
        .reduce((sum, attr) => sum + Math.max(...attr.rarity), 0);
    
    if (minRarity > maxRarity) {
        alert('稀有度下限不能大于上限！已自动调整为合理范围。');
        document.getElementById('initialRarityMin').value = minPossibleRarity;
        document.getElementById('initialRarityMax').value = maxPossibleRarity;
        return generateRandomCat(targetGender);
    }
    
    if (minRarity < minPossibleRarity || maxRarity > maxPossibleRarity) {
        alert(`当前属性设置下，可能的稀有度范围为 ${minPossibleRarity} - ${maxPossibleRarity}。\n已自动调整为合理范围。`);
        document.getElementById('initialRarityMin').value = Math.max(minRarity, minPossibleRarity);
        document.getElementById('initialRarityMax').value = Math.min(maxRarity, maxPossibleRarity);
        return generateRandomCat(targetGender);
    }
    
    let attempts = 0;
    const MAX_ATTEMPTS = 100; // 防止无限循环
    let lastCat = null;
    
    while (attempts < MAX_ATTEMPTS) {
        const cat = {
            id: Math.random().toString(36).substr(2, 9),
            name: generateRandomName(),
            parents: [],
            children: [],
            breedingCooldown: 0,
            isShopCat: false
        };

        // 生成属性
        Object.entries(gameData.attributes).forEach(([attrName, attrData]) => {
            let selectedIndex;
            if (attrName === '性别' && targetGender) {
                selectedIndex = attrData.options.indexOf(targetGender);
            } else {
                // 根据权重随机选择
                const totalWeight = attrData.weights.reduce((sum, w) => sum + w, 0);
                let random = Math.random() * totalWeight;
                selectedIndex = attrData.weights.findIndex(weight => {
                    random -= weight;
                    return random <= 0;
                });
            }
            
            if (selectedIndex === -1) selectedIndex = 0;
            
            cat[attrName] = {
                value: attrData.options[selectedIndex],
                rarity: attrData.rarity[selectedIndex]
            };
        });

        // 计算总稀有度
        cat.totalRarity = Object.values(cat)
            .filter(value => value && typeof value === 'object' && 'rarity' in value)
            .reduce((sum, attr) => sum + attr.rarity, 0);

        lastCat = cat;
        
        // 检查是否满足稀有度范围要求
        if (cat.totalRarity >= minRarity && cat.totalRarity <= maxRarity) {
            return cat;
        }

        attempts++;
    }

    // 如果多次尝试都无法生成符合条件的猫咪
    alert(`在${MAX_ATTEMPTS}次尝试后仍无法生成满足稀有度范围(${minRarity}-${maxRarity})的猫咪。\n将使用最后一次生成的结果(稀有度: ${lastCat.totalRarity})。`);
    return lastCat;
}

// 根据基因强度选择属性
function selectAttributeBasedOnGeneStrength(parent1Attr, parent2Attr, attrData) {
    try {
        const parent1Index = attrData.options.indexOf(parent1Attr.value);
        const parent2Index = attrData.options.indexOf(parent2Attr.value);
        
        if (parent1Index === -1 || parent2Index === -1) {
            throw new Error('父母属性值无效');
        }

        const parent1Strength = attrData.geneStrength[parent1Index];
        const parent2Strength = attrData.geneStrength[parent2Index];
        
        if (typeof parent1Strength !== 'number' || typeof parent2Strength !== 'number') {
            throw new Error('基因强度无效');
        }

        const totalStrength = parent1Strength + parent2Strength;
        if (totalStrength === 0) {
            // 如果总强度为0，随机选择
            const randomParent = Math.random() < 0.5 ? parent1Attr : parent2Attr;
            return randomParent;
        }

        // 根据基因强度概率选择
        const random = Math.random() * totalStrength;
        if (random < parent1Strength) {
            return parent1Attr;
        } else {
            return parent2Attr;
        }
    } catch (error) {
        console.error('选择属性时出错:', error);
        // 出错时随机返回一个父母的属性
        return Math.random() < 0.5 ? parent1Attr : parent2Attr;
    }
}

// 繁殖猫咪
function breedCats(cat1, cat2) {
    try {
        // 检查性别和CD
        if (!cat1 || !cat2 || !cat1.性别 || !cat2.性别 ||
            cat1.性别.value === cat2.性别.value || 
            cat1.breedingCooldown > 0 || cat2.breedingCooldown > 0) {
            return null;
        }
        
        const newCat = {
            id: Math.random().toString(36).substr(2, 9),
            name: generateRandomName(),
            parents: [cat1.id, cat2.id],
            children: [],
            mutations: new Set(),
            inheritanceInfo: {},
            breedingCooldown: 0
        };
        
        // 更新父母的children数组
        cat1.children.push(newCat.id);
        cat2.children.push(newCat.id);
        
        // 获取变异率
        const mutationRate = parseInt(document.getElementById('mutationRate').value) || gameData.defaultMutationRate;
        
        // 确保所有必要的属性都被初始化
        Object.entries(gameData.attributes).forEach(([attrName, attrData]) => {
            try {
                if (!Array.isArray(attrData.options) || !attrData.options.length) {
                    throw new Error(`属性 ${attrName} 的选项无效`);
                }

                // 获取父母的属性值
                const parent1Value = cat1[attrName] && cat1[attrName].value;
                const parent2Value = cat2[attrName] && cat2[attrName].value;
                const parent1Strength = parent1Value ? (attrData.geneStrength[attrData.options.indexOf(parent1Value)] || 50) : 0;
                const parent2Strength = parent2Value ? (attrData.geneStrength[attrData.options.indexOf(parent2Value)] || 50) : 0;

                // 检查是否发生变异
                if (Math.random() * 100 < mutationRate) {
                    // 发生变异
                    const mutationIndex = Math.floor(Math.random() * attrData.options.length);
                    newCat[attrName] = {
                        value: attrData.options[mutationIndex],
                        rarity: attrData.rarity[mutationIndex] || 1
                    };
                    newCat.mutations.add(attrName);
                    
                    // 即使发生突变也记录父母信息
                    newCat.inheritanceInfo[attrName] = {
                        parent1: {
                            value: parent1Value,
                            strength: parent1Strength
                        },
                        parent2: {
                            value: parent2Value,
                            strength: parent2Strength
                        }
                    };
                } else {
                    // 根据基因强度遗传
                    if (!parent1Value || !parent2Value) {
                        // 如果父母缺少该属性，随机生成
                        const randomIndex = Math.floor(Math.random() * attrData.options.length);
                        newCat[attrName] = {
                            value: attrData.options[randomIndex],
                            rarity: attrData.rarity[randomIndex] || 1
                        };
                    } else {
                        const selectedAttr = selectAttributeBasedOnGeneStrength(
                            cat1[attrName],
                            cat2[attrName],
                            attrData
                        );
                        
                        newCat[attrName] = {
                            value: selectedAttr.value,
                            rarity: selectedAttr.rarity || 1
                        };
                    }
                    
                    // 记录继承信息
                    newCat.inheritanceInfo[attrName] = {
                        parent1: {
                            value: parent1Value,
                            strength: parent1Strength
                        },
                        parent2: {
                            value: parent2Value,
                            strength: parent2Strength
                        }
                    };
                }
            } catch (error) {
                console.error(`处理属性 ${attrName} 时出错:`, error);
                // 出错时生成一个默认值
                const defaultIndex = 0;
                newCat[attrName] = {
                    value: attrData.options[defaultIndex],
                    rarity: attrData.rarity[defaultIndex] || 1
                };
            }
        });
        
        // 计算总稀有度
        newCat.totalRarity = Object.values(newCat)
            .filter(value => value && typeof value === 'object' && 'rarity' in value)
            .reduce((sum, attr) => sum + attr.rarity, 0);
        
        // 设置繁殖CD
        newCat.breedingCooldown = gameData.breedingCooldown;
        cat1.breedingCooldown = gameData.breedingCooldown;
        cat2.breedingCooldown = gameData.breedingCooldown;

        return newCat;
    } catch (error) {
        console.error('繁殖过程出错:', error);
        return null;
    }
}

// 显示当前猫咪
function displayCurrentCat(cat) {
    const currentCats = document.getElementById('currentCats');
    if (!currentCats) return;

    const catCard = document.createElement('div');
    catCard.className = 'cat-card';
    catCard.innerHTML = `
        <div class="cat-header">
            <h3>稀有度: ${cat.totalRarity}</h3>
            <span class="cat-gender">${cat.性别.value}</span>
        </div>
        <div class="cat-name">${cat.name || '未知'}</div>
        ${displayCatAttributes(cat)}
        <p>培育CD: ${cat.breedingCooldown}小时</p>
    `;
    
    currentCats.innerHTML = '';
    currentCats.appendChild(catCard);
}

// 清空结果
function clearResults() {
    if (confirm('确定要清空所有结果吗？')) {
        document.getElementById('breedingResults').innerHTML = '';
        gameData.simulationHistory = [];
        saveToLocalStorage();
    }
}

// 导出结果
function exportResults() {
    const data = {
        timestamp: new Date().toISOString(),
        simulationHistory: gameData.simulationHistory,
        gameSettings: {
            attributes: gameData.attributes,
            mutationRate: document.getElementById('mutationRate').value,
            breedingCooldown: gameData.breedingCooldown
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat_breeding_results_${new Date().toISOString().slice(0,19).replace(/[:-]/g, '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 显示猫咪属性
function displayCatAttributes(cat) {
    const threshold = parseInt(document.getElementById('rarityThreshold').value) || 10;
    const isHighRarity = cat.totalRarity > threshold;
    
    return `
        <div class="cat-card ${isHighRarity ? 'high-rarity' : ''} ${cat.isShopCat ? 'shop-cat' : ''}">
            ${Object.entries(cat)
                .filter(([key, value]) => {
                    return key !== 'totalRarity' && 
                           key !== 'breedingCooldown' && 
                           key !== 'id' && 
                           key !== 'parents' && 
                           key !== 'children' && 
                           key !== 'name' && 
                           key !== 'mutations' && 
                           key !== 'inheritanceInfo' &&
                           value && 
                           typeof value === 'object' &&
                           'value' in value;
                })
                .map(([key, value]) => {
                    const isMutated = cat.mutations && cat.mutations.has(key);
                    const inheritanceInfo = cat.inheritanceInfo && cat.inheritanceInfo[key];
                    const rarityClass = `rarity-${Math.min(20, Math.max(1, Math.round(value.rarity)))}`;
                    
                    let parentInfo = '';
                    if (inheritanceInfo || isMutated) {
                        const parent1 = inheritanceInfo ? inheritanceInfo.parent1 : { value: '未知', strength: 0 };
                        const parent2 = inheritanceInfo ? inheritanceInfo.parent2 : { value: '未知', strength: 0 };
                        
                        // 获取父母属性的稀有度
                        const parent1Rarity = getAttributeRarity(key, parent1.value);
                        const parent2Rarity = getAttributeRarity(key, parent2.value);
                        const parent1RarityClass = `rarity-${Math.min(20, Math.max(1, Math.round(parent1Rarity)))}`;
                        const parent2RarityClass = `rarity-${Math.min(20, Math.max(1, Math.round(parent2Rarity)))}`;
                        
                        parentInfo = `
                            <div class="parent-info">
                                父: ${parent1.value} <span class="${parent1RarityClass}">[${parent1Rarity}]</span> (${parent1.strength}), 
                                母: ${parent2.value} <span class="${parent2RarityClass}">[${parent2Rarity}]</span> (${parent2.strength})
                            </div>
                        `;
                    }
                    
                    return `
                        <div class="cat-attribute ${isMutated ? 'mutated' : ''}">
                            <div>
                                <span>${key}: ${value.value}</span>
                                <span class="${rarityClass}">[${value.rarity}]</span>
                                ${isMutated ? '<span class="mutation-marker">突变</span>' : ''}
                            </div>
                            ${parentInfo}
                        </div>
                    `;
                }).join('')}
        </div>
    `;
}

// 获取属性的稀有度值
function getAttributeRarity(attrName, value) {
    if (!gameData.attributes[attrName]) return 1;
    const index = gameData.attributes[attrName].options.indexOf(value);
    return index >= 0 ? gameData.attributes[attrName].rarity[index] : 1;
}

// 显示繁殖结果
function displayBreedingResults(results, cats, allCats, generation = 0, previousGenRarity = null) {
    const generationDiv = document.createElement('div');
    generationDiv.className = 'generation-container';
    
    // 添加代数标记
    const generationMarker = document.createElement('div');
    generationMarker.className = 'generation-marker';
    generationMarker.textContent = `第 ${generation} 代`;
    generationDiv.appendChild(generationMarker);
    
    // 计算当前代的平均稀有度
    const currentGenRarity = cats.reduce((sum, cat) => sum + cat.totalRarity, 0) / cats.length;
    
    // 添加代际统计
    const statsDiv = document.createElement('div');
    statsDiv.className = 'generation-stats';
    let rarityChange = '';
    if (previousGenRarity !== null) {
        const change = currentGenRarity - previousGenRarity;
        rarityChange = `
            <p>较上代变化: <span class="${change >= 0 ? 'rarity-gain' : 'rarity-loss'}">
                ${change >= 0 ? '+' : ''}${change.toFixed(2)}
            </span></p>
        `;
    }
    
    // 计算超过阈值的猫咪数量
    const threshold = parseInt(document.getElementById('rarityThreshold').value) || 10;
    const highRarityCats = cats.filter(cat => cat.totalRarity > threshold).length;
    
    statsDiv.innerHTML = `
        <h4>第 ${generation} 代统计</h4>
        <p>猫咪数量: ${cats.length}</p>
        <p>平均稀有度: ${currentGenRarity.toFixed(2)}</p>
        ${rarityChange}
        <p>高稀有度(>${threshold})猫咪: ${highRarityCats}</p>
    `;
    generationDiv.appendChild(statsDiv);

    // 创建猫咪容器
    const catsContainer = document.createElement('div');
    catsContainer.className = 'generation-cats';
    
    // 显示当前代的所有猫咪
    cats.forEach(cat => {
        const catCard = document.createElement('div');
        catCard.className = 'cat-card';
        
        // 构建家族关系信息
        let familyInfo = '';
        if (cat.parents.length > 0) {
            familyInfo = '<div class="family-info"><h4>家族关系：</h4>';
            familyInfo += '<p>父母：' + cat.parents.map(parentId => {
                const parent = allCats.get(parentId);
                if (parent) {
                    return `${parent.name}（${parent.性别.value}）`;
                }
                return '未知';
            }).join('、') + '</p>';
            
            if (cat.children.length > 0) {
                familyInfo += '<p>后代数量：' + cat.children.length + '</p>';
            }
            familyInfo += '</div>';
        }
        
        catCard.innerHTML = `
            <div class="cat-header">
                <h3>稀有度: ${cat.totalRarity}</h3>
                <span class="cat-gender">${cat.性别.value}</span>
            </div>
            <div class="cat-name">${cat.name || '未知'}</div>
            ${displayCatAttributes(cat)}
            <p>培育CD: ${cat.breedingCooldown}小时</p>
            ${familyInfo}
        `;
        
        catsContainer.appendChild(catCard);
    });

    generationDiv.appendChild(catsContainer);
    results.appendChild(generationDiv);
    
    return currentGenRarity;
}

// 商店相关变量
let shopCats = [];

// 生成商店猫咪
function generateShopCats() {
    shopCats = [];
    for (let i = 0; i < 4; i++) {
        const cat = generateRandomCat();
        cat.isShopCat = true;
        shopCats.push(cat);
    }
    displayShopCats();
}

// 显示商店猫咪
function displayShopCats() {
    const shopDiv = document.getElementById('shopCats');
    if (!shopDiv) return;
    
    shopDiv.innerHTML = '<h4>商店猫咪</h4>';
    shopCats.forEach((cat, index) => {
        const catCard = document.createElement('div');
        catCard.className = `cat-card ${cat.totalRarity > (parseInt(document.getElementById('rarityThreshold').value) || 10) ? 'high-rarity' : ''}`;
        catCard.innerHTML = `
            <div class="cat-header">
                <h3>稀有度: ${cat.totalRarity}</h3>
                <span class="cat-gender">${cat.性别.value}</span>
            </div>
            <div class="cat-name">${cat.name || '未知'}</div>
            ${displayCatAttributes(cat)}
            <button onclick="addShopCatToPool(${index})" class="primary-button">添加到培育池</button>
        `;
        shopDiv.appendChild(catCard);
    });
}

// 将商店猫咪添加到培育池
function addShopCatToPool(index) {
    const maxCats = parseInt(document.getElementById('maxCats').value) || 10;
    
    if (currentGenerationCats.size >= maxCats) {
        alert(`已达到最大猫咪数量限制 (${maxCats})，请先删除一些猫咪。`);
        return;
    }
    
    const cat = shopCats[index];
    if (!cat) return;
    
    breedingPool.set(cat.id, cat);
    currentGenerationCats.set(cat.id, cat);
    shopCats.splice(index, 1); // 从商店中移除
    
    updateBreedingPoolDisplay();
    updateParentSelectors();
    displayShopCats();
}

// 自动选择商店猫咪
function autoSelectShopCat() {
    if (shopCats.length === 0) return null;
    
    const breedingStrategy = document.getElementById('breedingStrategy').value;
    let selectedIndex = 0;
    
    if (breedingStrategy === 'highestRarity') {
        // 选择稀有度最高的猫咪
        selectedIndex = shopCats.reduce((maxIndex, cat, currentIndex, arr) => 
            cat.totalRarity > arr[maxIndex].totalRarity ? currentIndex : maxIndex
        , 0);
    } else {
        // 随机选择
        selectedIndex = Math.floor(Math.random() * shopCats.length);
    }
    
    return shopCats[selectedIndex];
}

// 修改切换培育模式函数
function toggleBreedingMode() {
    const mode = document.getElementById('breedingMode').value;
    const autoControls = document.getElementById('autoBreedingControls');
    const manualControls = document.getElementById('manualBreedingControls');
    const shopDiv = document.getElementById('shopCats');
    
    // 重置所有显示
    autoControls.style.display = 'none';
    manualControls.style.display = 'none';
    if (shopDiv) shopDiv.style.display = 'none';
    
    // 根据模式设置显示
    switch (mode) {
        case 'auto':
            autoControls.style.display = 'block';
            break;
        case 'auto_shop':
            autoControls.style.display = 'block';
            shopDiv.style.display = 'block';
            generateShopCats();
            break;
        case 'manual':
            manualControls.style.display = 'block';
            initializeManualBreeding();
            break;
        case 'manual_shop':
            manualControls.style.display = 'block';
            shopDiv.style.display = 'block';
            initializeManualBreeding();
            generateShopCats();
            break;
    }
}

// 修改进入下一代函数
document.getElementById('nextGeneration').addEventListener('click', () => {
    if (currentGenerationCats.size === 0) {
        alert('当前代没有猫咪');
        return;
    }
    
    // 显示当前代结果
    const results = document.getElementById('breedingResults');
    const previousGenRarity = currentGeneration === 0 ? null : 
        Array.from(currentGenerationCats.values()).reduce((sum, cat) => sum + cat.totalRarity, 0) / currentGenerationCats.size;
    
    displayBreedingResults(
        results,
        Array.from(currentGenerationCats.values()),
        breedingPool,
        currentGeneration,
        previousGenRarity
    );
    
    // 重置CD
    currentGenerationCats.forEach(cat => {
        cat.breedingCooldown = 0;
    });
    
    currentGeneration++;
    generateShopCats(); // 生成新的商店猫咪
    updateBreedingPoolDisplay();
    updateParentSelectors();
});

// 修改自动培育函数
function startBreeding() {
    const generations = parseInt(document.getElementById('generationCount').value) || 1;
    const breedingStrategy = document.getElementById('breedingStrategy').value;
    const results = document.getElementById('breedingResults');
    results.innerHTML = '';
    
    if (generations < 1) {
        alert('请输入有效的代数（至少为1）');
        return;
    }
    
    // 生成初始猫咪（一公一母）
    let cats = [
        generateRandomCat('公'),
        generateRandomCat('母')
    ];
    
    // 存储所有生成的猫咪
    const allCats = new Map();
    cats.forEach(cat => allCats.set(cat.id, cat));
    
    // 显示初始代
    let previousGenRarity = null;
    previousGenRarity = displayBreedingResults(results, cats, allCats, 0, null);
    
    // 开始繁殖循环
    for (let i = 0; i < generations; i++) {
        // 生成商店猫咪
        generateShopCats();
        const shopCat = autoSelectShopCat();
        if (shopCat) {
            cats.push(shopCat);
            allCats.set(shopCat.id, shopCat);
        }
        
        // 获取所有可能的配对
        let possiblePairs = [];
        for (const cat1 of allCats.values()) {
            for (const cat2 of allCats.values()) {
                if (cat1.id !== cat2.id && 
                    cat1.性别.value !== cat2.性别.value && 
                    cat1.breedingCooldown === 0 && 
                    cat2.breedingCooldown === 0) {
                    possiblePairs.push([cat1, cat2]);
                }
            }
        }
        
        // 根据策略排序配对
        if (breedingStrategy === 'highestRarity') {
            possiblePairs.sort((a, b) => {
                const rarityA = a[0].totalRarity + a[1].totalRarity;
                const rarityB = b[0].totalRarity + b[1].totalRarity;
                return rarityB - rarityA;
            });
        } else {
            // 随机打乱配对顺序
            possiblePairs = possiblePairs.sort(() => Math.random() - 0.5);
        }
        
        // 进行配对繁殖
        const newCats = [];
        while (possiblePairs.length > 0) {
            const [cat1, cat2] = possiblePairs.shift();
            
            // 移除其他包含这两只猫的配对
            possiblePairs = possiblePairs.filter(pair => 
                !pair.includes(cat1) && !pair.includes(cat2)
            );
            
            const newCat = breedCats(cat1, cat2);
            if (newCat) {
                newCats.push(newCat);
                allCats.set(newCat.id, newCat);
            }
        }
        
        // 更新所有猫的CD
        for (const cat of allCats.values()) {
            if (cat.breedingCooldown > 0) {
                cat.breedingCooldown = Math.max(0, cat.breedingCooldown - 24);
            }
        }
        
        if (newCats.length === 0) {
            const endNote = document.createElement('p');
            endNote.className = 'end-note';
            endNote.textContent = '由于没有可配对的猫咪，繁殖在此代结束。';
            results.appendChild(endNote);
            break;
        }
        
        // 显示新一代
        previousGenRarity = displayBreedingResults(results, newCats, allCats, i + 1, previousGenRarity);
        cats = newCats;
    }
    
    // 保存模拟结果
    gameData.simulationHistory.push({
        date: new Date().toISOString(),
        generations: generations,
        finalCats: Array.from(allCats.values())
    });
    saveToLocalStorage();
}

// 手动培育相关变量
let currentGeneration = 0;
let breedingPool = new Map();
let currentGenerationCats = new Map();

// 初始化手动培育
function initializeManualBreeding() {
    currentGeneration = 0;
    breedingPool.clear();
    currentGenerationCats.clear();
    
    // 生成初始猫咪（一公一母）
    const initialCats = [
        generateRandomCat('公'),
        generateRandomCat('母')
    ];
    
    initialCats.forEach(cat => {
        breedingPool.set(cat.id, cat);
        currentGenerationCats.set(cat.id, cat);
    });
    
    updateBreedingPoolDisplay();
    updateParentSelectors();
}

// 更新培育池显示
function updateBreedingPoolDisplay() {
    const poolDiv = document.getElementById('breedingPool');
    poolDiv.innerHTML = '';
    
    currentGenerationCats.forEach(cat => {
        const catCard = document.createElement('div');
        catCard.className = 'cat-card';
        catCard.innerHTML = `
            <div class="cat-header">
                <h3>稀有度: ${cat.totalRarity}</h3>
                <span class="cat-gender">${cat.性别.value}</span>
            </div>
            <div class="cat-name">${cat.name || '未知'}</div>
            ${displayCatAttributes(cat)}
            <p>培育CD: ${cat.breedingCooldown}小时</p>
            <button onclick="removeCatFromPool('${cat.id}')" class="delete-button">移除</button>
        `;
        poolDiv.appendChild(catCard);
    });
}

// 更新父母选择器
function updateParentSelectors() {
    const parent1Select = document.getElementById('parent1');
    const parent2Select = document.getElementById('parent2');
    
    parent1Select.innerHTML = '<option value="">选择父本</option>';
    parent2Select.innerHTML = '<option value="">选择母本</option>';
    
    currentGenerationCats.forEach(cat => {
        if (cat.breedingCooldown === 0) {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.name} (${cat.性别.value}, 稀有度: ${cat.totalRarity})`;
            
            if (cat.性别.value === '公') {
                parent1Select.appendChild(option);
            } else {
                parent2Select.appendChild(option);
            }
        }
    });
}

// 从培育池移除猫咪
function removeCatFromPool(catId) {
    if (confirm('确定要移除这只猫咪吗？')) {
        currentGenerationCats.delete(catId);
        updateBreedingPoolDisplay();
        updateParentSelectors();
    }
}

// 导出属性设置
function exportAttributes() {
    const attributesData = {
        attributes: gameData.attributes,
        breedingCooldown: gameData.breedingCooldown,
        defaultMutationRate: gameData.defaultMutationRate
    };
    
    const blob = new Blob([JSON.stringify(attributesData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat_attributes_${new Date().toISOString().slice(0,19).replace(/[:-]/g, '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 导入属性设置
function importAttributes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // 验证数据结构
                if (!data.attributes) {
                    throw new Error('无效的属性数据格式');
                }
                
                // 更新游戏数据
                gameData.attributes = data.attributes;
                if (data.breedingCooldown) gameData.breedingCooldown = data.breedingCooldown;
                if (data.defaultMutationRate) gameData.defaultMutationRate = data.defaultMutationRate;
                
                // 重新渲染界面
                renderAttributeList();
                renderControls();
                saveToLocalStorage();
                
                alert('属性设置导入成功！');
            } catch (error) {
                console.error('导入属性设置失败:', error);
                alert('导入失败: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// 加载预设配置
async function loadPreset(presetName) {
    try {
        const response = await fetch(PRESETS[presetName]);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 更新游戏数据
        gameData.attributes = data.attributes;
        gameData.breedingCooldown = data.breedingCooldown;
        gameData.defaultMutationRate = data.defaultMutationRate;
        if (data.names) nameData.names = data.names;
        if (data.titles) nameData.titles = data.titles;
        
        // 重新渲染界面
        renderAttributeList();
        renderControls();
        saveToLocalStorage();
        
        alert(`成功加载 ${presetName} 预设！`);
    } catch (error) {
        console.error('加载预设失败:', error);
        alert('加载预设失败: ' + error.message);
    }
}

// 手动配对
function breedPair() {
    const maxCats = parseInt(document.getElementById('maxCats').value) || 10;
    
    if (currentGenerationCats.size >= maxCats) {
        alert(`已达到最大猫咪数量限制 (${maxCats})，请先删除一些猫咪。`);
        return;
    }
    
    const parent1Id = document.getElementById('parent1').value;
    const parent2Id = document.getElementById('parent2').value;
    
    if (!parent1Id || !parent2Id) {
        alert('请选择两只猫咪进行配对');
        return;
    }
    
    const parent1 = currentGenerationCats.get(parent1Id);
    const parent2 = currentGenerationCats.get(parent2Id);
    
    if (!parent1 || !parent2) {
        alert('选择的猫咪不存在');
        return;
    }
    
    const newCat = breedCats(parent1, parent2);
    
    if (newCat) {
        currentGenerationCats.set(newCat.id, newCat);
        breedingPool.set(newCat.id, newCat);
        updateBreedingPoolDisplay();
        updateParentSelectors();
    } else {
        alert('配对失败，请检查猫咪的性别和CD');
    }
}

// 添加随机猫咪按钮事件监听
document.getElementById('addCat').addEventListener('click', () => {
    const maxCats = parseInt(document.getElementById('maxCats').value) || 10;
    
    if (currentGenerationCats.size >= maxCats) {
        alert(`已达到最大猫咪数量限制 (${maxCats})，请先删除一些猫咪。`);
        return;
    }
    
    const newCat = generateRandomCat();
    breedingPool.set(newCat.id, newCat);
    currentGenerationCats.set(newCat.id, newCat);
    updateBreedingPoolDisplay();
    updateParentSelectors();
});