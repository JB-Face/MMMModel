// 默认游戏数据
const DEFAULT_GAME_DATA = {
    attributes: {
        毛色: {
            options: ["黑色", "白色", "橘色", "灰色", "奶牛色"],
            weights: [20, 20, 20, 20, 20],
            rarity: [1, 1, 1, 1, 2],
            geneStrength: [80, 80, 80, 80, 60],
            isMultiSelect: false
        },
        花纹: {
            options: ["纯色", "虎斑", "奶牛纹", "玳瑁", "点状"],
            weights: [30, 20, 20, 15, 15],
            rarity: [1, 2, 2, 3, 3],
            geneStrength: [90, 75, 75, 60, 60],
            isMultiSelect: false
        },
        眼睛: {
            options: ["黄色", "蓝色", "绿色", "异色瞳"],
            weights: [30, 30, 30, 10],
            rarity: [1, 1, 1, 5],
            geneStrength: [85, 85, 85, 40],
            isMultiSelect: false
        },
        尾巴: {
            options: ["短尾", "中等", "长尾", "无尾"],
            weights: [20, 40, 30, 10],
            rarity: [2, 1, 1, 4],
            geneStrength: [70, 90, 80, 50],
            isMultiSelect: false
        },
        性格: {
            options: ["温顺", "活泼", "高冷", "傲娇", "腹黑"],
            weights: [30, 25, 20, 15, 10],
            rarity: [1, 1, 2, 3, 4],
            geneStrength: [75, 75, 70, 60, 50],
            isMultiSelect: false
        },
        性别: {
            options: ["公", "母"],
            weights: [50, 50],
            rarity: [1, 1],
            geneStrength: [100, 100],
            isMultiSelect: false
        },
        特征: {
            options: ["优雅", "敏捷", "强壮", "聪明", "胆小", "好奇"],
            weights: [20, 20, 20, 20, 10, 10],
            rarity: [2, 2, 2, 2, 1, 1],
            geneStrength: [70, 70, 70, 70, 80, 80],
            isMultiSelect: true,
            maxSelect: 3 // 最多可以选择3个特征
        }
    },
    breedingCooldown: 24,
    defaultMutationRate: 10,
    defaultAberrationRate: 5,
    aberrationBonus: 2,
    initialMaxBreedingCooldown: 24,
    cdReductionPerBreeding: 8,
    coinMultiplier: 1,
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

// 添加金币相关变量
let playerCoins = 1000; // 初始金币

// 更新金币显示
function updateCoinsDisplay() {
    const coinsDisplay = document.getElementById('shopCoins');
    if (coinsDisplay) {
        coinsDisplay.textContent = `金币: ${playerCoins}`;
    }
}

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
            <div class="input-group">
                <label>
                    <input type="checkbox" id="editAttrMultiSelect" ${attr.isMultiSelect ? 'checked' : ''}> 允许多选
                </label>
            </div>
            <div class="input-group" id="editMaxSelectGroup" style="display: ${attr.isMultiSelect ? 'block' : 'none'}">
                <label>最大可选数量:</label>
                <input type="number" id="editAttrMaxSelect" value="${attr.maxSelect || 3}" min="1">
            </div>
            <div class="dialog-buttons">
                <button onclick="saveAttributeEdit('${attrName}')" class="primary-button">保存</button>
                <button onclick="closeAttributeDialog()" class="secondary-button">取消</button>
            </div>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 添加多选复选框的事件监听
    const multiSelectCheckbox = document.getElementById('editAttrMultiSelect');
    const maxSelectGroup = document.getElementById('editMaxSelectGroup');
    multiSelectCheckbox.addEventListener('change', function() {
        maxSelectGroup.style.display = this.checked ? 'block' : 'none';
    });
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
            <div class="input-group">
                <label>
                    <input type="checkbox" id="newAttrMultiSelect"> 允许多选
                </label>
            </div>
            <div class="input-group" id="maxSelectGroup" style="display: none;">
                <label>最大可选数量:</label>
                <input type="number" id="newAttrMaxSelect" value="3" min="1">
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

    // 添加多选复选框的事件监听
    const multiSelectCheckbox = document.getElementById('newAttrMultiSelect');
    const maxSelectGroup = document.getElementById('maxSelectGroup');
    multiSelectCheckbox.addEventListener('change', function() {
        maxSelectGroup.style.display = this.checked ? 'block' : 'none';
    });
}

// 保存新属性
function saveNewAttribute() {
    const attrName = document.getElementById('newAttrName').value.trim();
    const optionsStr = document.getElementById('newAttrOptions').value.trim();
    const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt);
    const isMultiSelect = document.getElementById('newAttrMultiSelect').checked;
    const maxSelect = isMultiSelect ? parseInt(document.getElementById('newAttrMaxSelect').value) || 3 : 1;

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
        geneStrength: options.map(() => 75),
        isMultiSelect: isMultiSelect,
        maxSelect: maxSelect
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
    console.log('切换面板:', panelId);
    const panel = document.getElementById(panelId);
    if (!panel) {
        console.warn('找不到面板元素:', panelId);
        return;
    }
    
    const header = panel.closest('.collapsible-section').querySelector('.section-header');
    const icon = header.querySelector('.toggle-icon');
    
    if (!header || !icon) {
        console.warn('找不到面板头部或图标元素');
        return;
    }
    
    const isExpanded = panel.classList.contains('expanded');
    console.log('当前状态:', isExpanded ? '展开' : '折叠');
    
    // 切换展开状态
    if (isExpanded &&  panel.classList.contains('expanded')) {
        requestAnimationFrame(() => {
            panel.classList.remove('expanded');
            icon.textContent = '▼';
            panel.style.display = 'none';
        });

    } else {
        panel.style.display = 'block';
        // 使用requestAnimationFrame确保display:block生效后再添加expanded类
        requestAnimationFrame(() => {
            panel.classList.add('expanded');
            icon.textContent = '▲';
        });
    }
    
    console.log('切换后状态:', panel.classList.contains('expanded') ? '展开' : '折叠');
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

        // 添加初始最大CD设置控件
        const breedingPanel = document.querySelector('.breeding-panel .breeding-controls');
        if (breedingPanel) {
            const cdControl = document.createElement('div');
            cdControl.className = 'parameter-group';
            cdControl.innerHTML = `
                <label for="initialMaxCD">初始最大CD值</label>
                <input type="number" 
                       id="initialMaxCD" 
                       min="8" 
                       value="${gameData.initialMaxBreedingCooldown || 24}" 
                       onchange="updateInitialMaxCD(this.value)">
            `;
            breedingPanel.insertBefore(cdControl, breedingPanel.firstChild);
        }

        // 添加CD减少值设置控件
        if (breedingPanel) {
            const cdReductionControl = document.createElement('div');
            cdReductionControl.className = 'parameter-group';
            cdReductionControl.innerHTML = `
                <label for="cdReductionPerBreeding">每次交配减少CD值</label>
                <input type="number" 
                       id="cdReductionPerBreeding" 
                       min="1" 
                       max="24"
                       value="${gameData.cdReductionPerBreeding || 8}" 
                       onchange="updateCDReduction(this.value)">
            `;
            breedingPanel.insertBefore(cdReductionControl, breedingPanel.firstChild);
        }

        // 添加金币倍率设置控件
        if (breedingPanel) {
            const coinMultiplierControl = document.createElement('div');
            coinMultiplierControl.className = 'parameter-group';
            coinMultiplierControl.innerHTML = `
                <label for="coinMultiplier">每日金币产出倍率</label>
                <input type="number" 
                       id="coinMultiplier" 
                       min="0.1" 
                       step="0.1"
                       value="${gameData.coinMultiplier || 1}" 
                       onchange="updateCoinMultiplier(this.value)">
            `;
            breedingPanel.insertBefore(coinMultiplierControl, breedingPanel.firstChild);
        }

        // 添加异变概率控制
        const aberrationControl = document.createElement('div');
        aberrationControl.className = 'parameter-group';
        aberrationControl.innerHTML = `
            <label for="aberrationRate">异变概率 (%)</label>
            <input type="number" 
                   id="aberrationRate" 
                   min="0" 
                   max="100" 
                   value="${gameData.defaultAberrationRate || 5}" 
                   step="1">
            <p class="parameter-description">异变不会遗传，但会提升稀有度</p>
        `;
        breedingPanel.insertBefore(aberrationControl, breedingPanel.firstChild);
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

// 添加更新初始最大CD的函数
function updateInitialMaxCD(value) {
    const newValue = parseInt(value);
    if (newValue >= 8) {
        gameData.initialMaxBreedingCooldown = newValue;
        saveToLocalStorage();
    } else {
        alert('初始最大CD值不能小于8');
        document.getElementById('initialMaxCD').value = gameData.initialMaxBreedingCooldown || 24;
    }
}

// 添加更新CD减少值的函数
function updateCDReduction(value) {
    const newValue = parseInt(value);
    if (newValue >= 1 && newValue <= 24) {
        gameData.cdReductionPerBreeding = newValue;
        saveToLocalStorage();
    } else {
        alert('每次交配减少CD值必须在1到24之间');
        document.getElementById('cdReductionPerBreeding').value = gameData.cdReductionPerBreeding || 8;
    }
}

// 添加更新金币倍率的函数
function updateCoinMultiplier(value) {
    const newValue = parseFloat(value);
    if (newValue >= 0.1) {
        gameData.coinMultiplier = newValue;
        saveToLocalStorage();
    } else {
        alert('金币倍率不能小于0.1');
        document.getElementById('coinMultiplier').value = gameData.coinMultiplier || 1;
    }
}

// 修改初始化函数
function initGame() {
    try {
        // 初始化默认数据
        gameData = { ...DEFAULT_GAME_DATA };
        nameData = { ...DEFAULT_NAME_DATA };
        playerCoins = 1000; // 重置初始金币

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
            if (parsedData.playerCoins !== undefined) {
                playerCoins = parsedData.playerCoins;
            }
        }

        // 渲染界面
        renderAttributeList();
        renderControls();

        // 根据不同模式初始化
        const currentPath = window.location.pathname;
        if (currentPath.includes('auto.html')) {
            // 自动模式初始化
            const initialCat = generateRandomCat();
            displayCurrentCat(initialCat);
            
            // 启用相关按钮
            const startBreedingBtn = document.getElementById('startBreeding');
            const randomCatBtn = document.getElementById('randomCat');
            if (startBreedingBtn) startBreedingBtn.disabled = false;
            if (randomCatBtn) randomCatBtn.disabled = false;
        } else if (currentPath.includes('auto_shop.html')) {
            // 自动+商店模式初始化
            const initialCat = generateRandomCat();
            displayCurrentCat(initialCat);
            generateShopCats();
        } else if (currentPath.includes('manual.html')) {
            // 手动模式初始化
            initializeManualBreeding();
        } else if (currentPath.includes('manual_shop.html')) {
            // 手动+商店模式初始化
            initializeManualBreeding();
            generateShopCats();
        }

        // 绑定事件监听器
        bindEventListeners();

        // 更新金币显示
        updateCoinsDisplay();

    } catch (error) {
        console.error('初始化游戏失败:', error);
        alert('初始化游戏失败: ' + error.message);
    }
}

// 添加事件监听器绑定函数
function bindEventListeners() {
    // 获取所有需要绑定事件的元素
    const elements = {
        addNewAttribute: document.getElementById('addNewAttribute'),
        startBreeding: document.getElementById('startBreeding'),
        randomCat: document.getElementById('randomCat'),
        exportResults: document.getElementById('exportResults'),
        clearResults: document.getElementById('clearResults'),
        exportAttributes: document.getElementById('exportAttributes'),
        importAttributes: document.getElementById('importAttributes'),
        presetSelect: document.getElementById('presetSelect'),
        addRandomCat: document.getElementById('addRandomCat'),
        breedPair: document.getElementById('breedPair'),
        startSimulation: document.getElementById('startSimulation'),
        refreshShop: document.getElementById('refreshShop'),
        nextGeneration: document.getElementById('nextGeneration')
    };

    // 绑定事件
    if (elements.addNewAttribute) {
        elements.addNewAttribute.addEventListener('click', addNewAttribute);
    }
    if (elements.startBreeding) {
        elements.startBreeding.addEventListener('click', startBreeding);
    }
    if (elements.randomCat) {
        elements.randomCat.addEventListener('click', () => {
            const cat = generateRandomCat();
            displayCurrentCat(cat);
        });
    }
    if (elements.exportResults) {
        elements.exportResults.addEventListener('click', exportResults);
    }
    if (elements.clearResults) {
        elements.clearResults.addEventListener('click', clearResults);
    }
    if (elements.exportAttributes) {
        elements.exportAttributes.addEventListener('click', exportAttributes);
    }
    if (elements.importAttributes) {
        elements.importAttributes.addEventListener('click', importAttributes);
    }
    if (elements.addRandomCat) {
        elements.addRandomCat.addEventListener('click', () => {
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
    }
    if (elements.breedPair) {
        elements.breedPair.addEventListener('click', breedPair);
    }
    if (elements.startSimulation) {
        elements.startSimulation.addEventListener('click', () => {
            const cat = generateRandomCat();
            displayCurrentCat(cat);
        });
        
        // 在开始模拟按钮后添加重新模拟按钮（如果不存在）
        if (!document.getElementById('resetSimulation')) {
            const resetButton = document.createElement('button');
            resetButton.id = 'resetSimulation';
            resetButton.className = 'start-simulation-button';
            resetButton.textContent = '重新模拟';
            resetButton.onclick = resetSimulation;
            elements.startSimulation.parentNode.insertBefore(resetButton, elements.startSimulation.nextSibling);
        }
    }
    
    // 添加预设选择事件监听
    if (elements.presetSelect) {
        elements.presetSelect.addEventListener('change', (e) => {
            if (e.target.value && confirm(`确定要加载 ${e.target.value} 预设吗？这将覆盖当前的属性设置。`)) {
                loadPreset(e.target.value);
            }
        });
    }

    // 添加刷新商店按钮的事件监听
    if (elements.refreshShop) {
        elements.refreshShop.addEventListener('click', refreshShop);
    }

    // 添加下一代按钮事件监听
    if (elements.nextGeneration) {
        elements.nextGeneration.addEventListener('click', () => {
            proceedToNextGeneration();
        });
    }

    // 初始化面板状态
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            console.log('面板头部被点击');
            const panel = header.nextElementSibling;
            const panelId = panel.id;
            if (panelId) {
                togglePanel(panelId);
            } else {
                console.warn('面板缺少 ID');
            }
        });
    });
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
function generateRandomCat(targetGender = null, isInitialCat = false) {
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
            breedingCooldown: isInitialCat ? (gameData.initialMaxBreedingCooldown || 24) : 0,
            maxBreedingCooldown: gameData.initialMaxBreedingCooldown || 24,
            isShopCat: false
        };

        // 生成属性
        Object.entries(gameData.attributes).forEach(([attrName, attrData]) => {
            if (attrData.isMultiSelect) {
                // 处理多选属性
                const maxSelect = attrData.maxSelect || 3;
                const selectedCount = Math.floor(Math.random() * maxSelect) + 1; // 至少选择1个
                const selectedValues = [];
                const selectedRarities = [];
                
                // 根据权重随机选择多个选项
                for (let i = 0; i < selectedCount; i++) {
                    const totalWeight = attrData.weights.reduce((sum, w) => sum + w, 0);
                    let random = Math.random() * totalWeight;
                    let selectedIndex = attrData.weights.findIndex(weight => {
                        random -= weight;
                        return random <= 0;
                    });
                    
                    if (selectedIndex === -1) selectedIndex = 0;
                    
                    // 避免重复选择
                    if (!selectedValues.includes(attrData.options[selectedIndex])) {
                        selectedValues.push(attrData.options[selectedIndex]);
                        selectedRarities.push(attrData.rarity[selectedIndex]);
                    }
                }
                
                cat[attrName] = {
                    values: selectedValues,
                    rarities: selectedRarities,
                    isMultiSelect: true
                };
            } else {
                // 处理单选属性
                let selectedIndex;
                if (attrName === '性别' && targetGender) {
                    selectedIndex = attrData.options.indexOf(targetGender);
                } else {
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
            }
        });

        // 计算总稀有度（包括多选属性）
        cat.totalRarity = Object.entries(cat)
            .filter(([key, value]) => value && typeof value === 'object')
            .reduce((sum, [key, value]) => {
                if (value.isMultiSelect) {
                    return sum + value.rarities.reduce((s, r) => s + r, 0);
                } else if ('rarity' in value) {
                    return sum + value.rarity;
                }
                return sum;
            }, 0);

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
        // 检查CD是否足够
        const requiredCD = gameData.cdReductionPerBreeding || 8;
        if (!cat1 || !cat2 || !cat1.性别 || !cat2.性别 ||
            cat1.性别.value === cat2.性别.value || 
            cat1.breedingCooldown < requiredCD || cat2.breedingCooldown < requiredCD) {
            return null;
        }
        
        const newCat = {
            id: Math.random().toString(36).substr(2, 9),
            name: generateRandomName(),
            parents: [cat1.id, cat2.id],
            children: [],
            mutations: new Set(),
            aberrations: new Set(),
            inheritanceInfo: {},
            breedingCooldown: 0,
            maxBreedingCooldown: gameData.initialMaxBreedingCooldown || 24
        };
        
        // 更新父母的CD和最大CD
        const cdReduction = gameData.cdReductionPerBreeding || 8;
        cat1.breedingCooldown = Math.max(0, cat1.breedingCooldown - cdReduction);
        cat2.breedingCooldown = Math.max(0, cat2.breedingCooldown - cdReduction);
        
        // 减少父母的最大CD，但不低于8
        cat1.maxBreedingCooldown = Math.max(8, cat1.maxBreedingCooldown - cdReduction);
        cat2.maxBreedingCooldown = Math.max(8, cat2.maxBreedingCooldown - cdReduction);
        
        // 更新父母的children数组
        cat1.children.push(newCat.id);
        cat2.children.push(newCat.id);
        
        // 获取变异率和异变率
        const mutationRate = parseInt(document.getElementById('mutationRate').value) || gameData.defaultMutationRate;
        const aberrationRate = parseInt(document.getElementById('aberrationRate').value) || gameData.defaultAberrationRate;
        
        // 确保所有必要的属性都被初始化
        Object.entries(gameData.attributes).forEach(([attrName, attrData]) => {
            try {
                if (!Array.isArray(attrData.options) || !attrData.options.length) {
                    throw new Error(`属性 ${attrName} 的选项无效`);
                }

                // 获取父母的属性值
                const parent1Value = cat1[attrName];
                const parent2Value = cat2[attrName];

                // 首先检查是否发生异变
                if (Math.random() * 100 < aberrationRate) {
                    if (attrData.isMultiSelect) {
                        // 多选属性的异变
                        const maxSelect = attrData.maxSelect || 3;
                        const selectedCount = Math.floor(Math.random() * maxSelect) + 1;
                        const selectedValues = [];
                        const selectedRarities = [];
                        
                        for (let i = 0; i < selectedCount; i++) {
                            const idx = Math.floor(Math.random() * attrData.options.length);
                            if (!selectedValues.includes(attrData.options[idx])) {
                                selectedValues.push(attrData.options[idx]);
                                selectedRarities.push(attrData.rarity[idx] * (gameData.aberrationBonus || 2));
                            }
                        }
                        
                        newCat[attrName] = {
                            values: selectedValues,
                            rarities: selectedRarities,
                            isMultiSelect: true,
                            isAberration: true
                        };
                        newCat.aberrations.add(attrName);
                    } else {
                        // 单选属性的异变
                        const aberrationIndex = Math.floor(Math.random() * attrData.options.length);
                        const baseRarity = attrData.rarity[aberrationIndex] || 1;
                        newCat[attrName] = {
                            value: attrData.options[aberrationIndex],
                            rarity: baseRarity * (gameData.aberrationBonus || 2),
                            isAberration: true
                        };
                        newCat.aberrations.add(attrName);
                    }
                } else if (Math.random() * 100 < mutationRate) {
                    if (attrData.isMultiSelect) {
                        // 多选属性的变异
                        const maxSelect = attrData.maxSelect || 3;
                        const selectedCount = Math.floor(Math.random() * maxSelect) + 1;
                        const selectedValues = [];
                        const selectedRarities = [];
                        
                        for (let i = 0; i < selectedCount; i++) {
                            const idx = Math.floor(Math.random() * attrData.options.length);
                            if (!selectedValues.includes(attrData.options[idx])) {
                                selectedValues.push(attrData.options[idx]);
                                selectedRarities.push(attrData.rarity[idx]);
                            }
                        }
                        
                        newCat[attrName] = {
                            values: selectedValues,
                            rarities: selectedRarities,
                            isMultiSelect: true
                        };
                        newCat.mutations.add(attrName);
                    } else {
                        // 单选属性的变异
                        const mutationIndex = Math.floor(Math.random() * attrData.options.length);
                        newCat[attrName] = {
                            value: attrData.options[mutationIndex],
                            rarity: attrData.rarity[mutationIndex] || 1
                        };
                        newCat.mutations.add(attrName);
                    }
                } else {
                    // 正常遗传
                    if (attrData.isMultiSelect) {
                        // 多选属性的遗传
                        const parent1Values = parent1Value ? parent1Value.values : [];
                        const parent2Values = parent2Value ? parent2Value.values : [];
                        const allParentValues = [...new Set([...parent1Values, ...parent2Values])];
                        
                        const selectedValues = [];
                        const selectedRarities = [];
                        const maxSelect = attrData.maxSelect || 3;
                        
                        // 从父母的特征中随机选择
                        while (selectedValues.length < maxSelect && allParentValues.length > 0) {
                            const randomIndex = Math.floor(Math.random() * allParentValues.length);
                            const selectedValue = allParentValues[randomIndex];
                            const attrIndex = attrData.options.indexOf(selectedValue);
                            
                            if (attrIndex !== -1) {
                                selectedValues.push(selectedValue);
                                selectedRarities.push(attrData.rarity[attrIndex]);
                            }
                            
                            allParentValues.splice(randomIndex, 1);
                        }
                        
                        // 如果没有继承到任何特征，随机生成一个
                        if (selectedValues.length === 0) {
                            const randomIndex = Math.floor(Math.random() * attrData.options.length);
                            selectedValues.push(attrData.options[randomIndex]);
                            selectedRarities.push(attrData.rarity[randomIndex]);
                        }
                        
                        newCat[attrName] = {
                            values: selectedValues,
                            rarities: selectedRarities,
                            isMultiSelect: true
                        };
                    } else {
                        // 单选属性的遗传
                        if (!parent1Value || !parent2Value) {
                            const randomIndex = Math.floor(Math.random() * attrData.options.length);
                            newCat[attrName] = {
                                value: attrData.options[randomIndex],
                                rarity: attrData.rarity[randomIndex] || 1
                            };
                        } else {
                            const selectedAttr = selectAttributeBasedOnGeneStrength(
                                parent1Value,
                                parent2Value,
                                attrData
                            );
                            newCat[attrName] = {
                                value: selectedAttr.value,
                                rarity: selectedAttr.rarity || 1
                            };
                        }
                    }
                }
                
                // 记录继承信息
                newCat.inheritanceInfo[attrName] = {
                    parent1: parent1Value ? {
                        value: parent1Value.isMultiSelect ? parent1Value.values.join('、') : parent1Value.value,
                        strength: getAttributeStrength(attrName, parent1Value)
                    } : { value: '未知', strength: 0 },
                    parent2: parent2Value ? {
                        value: parent2Value.isMultiSelect ? parent2Value.values.join('、') : parent2Value.value,
                        strength: getAttributeStrength(attrName, parent2Value)
                    } : { value: '未知', strength: 0 }
                };
            } catch (error) {
                console.error(`处理属性 ${attrName} 时出错:`, error);
                // 出错时使用默认值
                if (attrData.isMultiSelect) {
                    newCat[attrName] = {
                        values: [attrData.options[0]],
                        rarities: [attrData.rarity[0] || 1],
                        isMultiSelect: true
                    };
                } else {
                    newCat[attrName] = {
                        value: attrData.options[0],
                        rarity: attrData.rarity[0] || 1
                    };
                }
            }
        });
        
        // 计算总稀有度
        newCat.totalRarity = Object.values(newCat)
            .filter(value => value && typeof value === 'object' && 'rarity' in value)
            .reduce((sum, attr) => sum + attr.rarity, 0);

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
            <span class="cat-gender gender-${cat.性别.value}">${cat.性别.value}</span>
        </div>
        <div class="cat-name">${cat.name || '未知'}</div>
        ${displayCatAttributes(cat)}
        <p>培育CD: ${cat.breedingCooldown}/${cat.maxBreedingCooldown}点</p>
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

// 修改displayCatAttributes函数，添加默认阈值
function displayCatAttributes(cat) {
    const thresholdElement = document.getElementById('rarityThreshold');
    const threshold = thresholdElement ? parseInt(thresholdElement.value) || 50 : 50;
    const isHighRarity = cat.totalRarity > threshold;
    
    let attributesHtml = '';
    Object.entries(cat)
        .filter(([key, value]) => {
            return key !== 'totalRarity' && 
                   key !== 'breedingCooldown' && 
                   key !== 'id' && 
                   key !== 'parents' && 
                   key !== 'children' && 
                   key !== 'name' && 
                   key !== 'mutations' && 
                   key !== 'aberrations' &&
                   key !== 'inheritanceInfo' &&
                   value && 
                   typeof value === 'object' &&
                   (value.isMultiSelect || 'value' in value);
        })
        .forEach(([key, value]) => {
            const isMutated = cat.mutations && cat.mutations.has(key);
            const isAberrated = cat.aberrations && cat.aberrations.has(key);
            const inheritanceInfo = cat.inheritanceInfo && cat.inheritanceInfo[key];
            
            if (value.isMultiSelect) {
                // 处理多选属性的显示
                const combinedRarity = value.rarities.reduce((sum, r) => sum + r, 0);
                const rarityClass = `rarity-${Math.min(20, Math.max(1, Math.round(combinedRarity)))}`;
                
                let valuesDisplay = value.values.map((val, idx) => {
                    const valueRarityClass = `rarity-${Math.min(20, Math.max(1, Math.round(value.rarities[idx])))}`;
                    return `<span class="${valueRarityClass}">${val}[${value.rarities[idx]}]</span>`;
                }).join('、');
                
                attributesHtml += `
                    <div class="cat-attribute ${isMutated ? 'mutated' : ''} ${isAberrated ? 'aberrated' : ''}">
                        <div>
                            <span>${key}: ${valuesDisplay}</span>
                            <span class="${rarityClass}">[总: ${combinedRarity}]</span>
                            ${isMutated ? '<span class="mutation-marker">突变</span>' : ''}
                            ${isAberrated ? '<span class="aberration-marker">异变</span>' : ''}
                        </div>
                    </div>
                `;
            } else {
                // 原有的单选属性显示逻辑
                const rarityClass = `rarity-${Math.min(20, Math.max(1, Math.round(value.rarity)))}`;
                
                let parentInfo = '';
                if (inheritanceInfo || isMutated || isAberrated) {
                    const parent1 = inheritanceInfo ? inheritanceInfo.parent1 : { value: '未知', strength: 0 };
                    const parent2 = inheritanceInfo ? inheritanceInfo.parent2 : { value: '未知', strength: 0 };
                    
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
                
                attributesHtml += `
                    <div class="cat-attribute ${isMutated ? 'mutated' : ''} ${isAberrated ? 'aberrated' : ''}">
                        <div>
                            <span>${key}: ${value.value}</span>
                            <span class="${rarityClass}">[${value.rarity}]</span>
                            ${isMutated ? '<span class="mutation-marker">突变</span>' : ''}
                            ${isAberrated ? '<span class="aberration-marker">异变</span>' : ''}
                        </div>
                        ${parentInfo}
                    </div>
                `;
            }
        });
    
    return `
        ${attributesHtml}
        <p>培育CD: ${cat.breedingCooldown}/${cat.maxBreedingCooldown}点</p>
    `;
}

// 获取属性的稀有度值
function getAttributeRarity(attrName, value) {
    if (!gameData.attributes[attrName]) return 1;
    const index = gameData.attributes[attrName].options.indexOf(value);
    return index >= 0 ? gameData.attributes[attrName].rarity[index] : 1;
}

// 显示繁殖结果
function displayBreedingResults(results, cats, allCats, day = 0, previousDayRarity = null) {
    try {
        console.log('开始显示繁殖结果，猫咪数量:', cats.length);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'generation-container';
        
        // 添加天数标记
        const dayMarker = document.createElement('div');
        dayMarker.className = 'generation-marker';
        dayMarker.textContent = `第 ${day} 天`;
        dayDiv.appendChild(dayMarker);
        
        // 计算当前天的平均稀有度
        let currentDayRarity = 0;
        try {
            currentDayRarity = cats.reduce((sum, cat) => {
                if (typeof cat.totalRarity !== 'number') {
                    console.warn('猫咪缺少稀有度数据:', cat);
                    return sum;
                }
                return sum + cat.totalRarity;
            }, 0) / cats.length;
        } catch (error) {
            console.error('计算平均稀有度时出错:', error);
            currentDayRarity = 0;
        }
        
        // 添加统计信息
        const statsDiv = document.createElement('div');
        statsDiv.className = 'generation-stats';
        let rarityChange = '';
        if (previousDayRarity !== null) {
            const change = currentDayRarity - previousDayRarity;
            rarityChange = `
                <p>较昨天变化: <span class="${change >= 0 ? 'rarity-gain' : 'rarity-loss'}">
                    ${change >= 0 ? '+' : ''}${change.toFixed(2)}
                </span></p>
            `;
        }
        
        // 计算超过阈值的猫咪数量
        const threshold = parseInt(document.getElementById('rarityThreshold')?.value || 50);
        const highRarityCats = cats.filter(cat => cat.totalRarity > threshold).length;
        
        statsDiv.innerHTML = `
            <h4>第 ${day} 天统计</h4>
            <p>猫咪数量: ${cats.length}</p>
            <p>平均稀有度: ${currentDayRarity.toFixed(2)}</p>
            ${rarityChange}
            <p>高稀有度(>${threshold})猫咪: ${highRarityCats}</p>
        `;
        dayDiv.appendChild(statsDiv);

        // 创建猫咪容器
        const catsContainer = document.createElement('div');
        catsContainer.className = 'generation-cats';
        
        // 显示当前天的所有猫咪
        cats.forEach((cat, index) => {
            try {
                if (!cat || typeof cat !== 'object') {
                    console.warn(`跳过无效的猫咪数据 [${index}]:`, cat);
                    return;
                }

                const catCard = document.createElement('div');
                catCard.className = 'cat-card';
                
                // 验证必要的属性
                if (!cat.性别 || !cat.性别.value) {
                    console.warn(`猫咪 [${index}] 缺少性别数据:`, cat);
                    cat.性别 = { value: '未知' };
                }
                
                // 构建家族关系信息
                let familyInfo = '';
                if (Array.isArray(cat.parents) && cat.parents.length > 0) {
                    familyInfo = '<div class="family-info"><h4>家族关系：</h4>';
                    familyInfo += '<p>父母：' + cat.parents.map(parentId => {
                        const parent = allCats.get(parentId);
                        if (parent && parent.性别 && parent.name) {
                            return `${parent.name}（${parent.性别.value}）`;
                        }
                        return '未知';
                    }).join('、') + '</p>';
                    
                    if (Array.isArray(cat.children) && cat.children.length > 0) {
                        familyInfo += '<p>后代数量：' + cat.children.length + '</p>';
                    }
                    familyInfo += '</div>';
                }
                
                catCard.innerHTML = `
                    <div class="cat-header">
                        <h3>稀有度: ${cat.totalRarity || 0}</h3>
                        <span class="cat-gender gender-${cat.性别.value}">${cat.性别.value}</span>
                    </div>
                    <div class="cat-name">${cat.name || '未知'}</div>
                    ${displayCatAttributes(cat)}
                    ${familyInfo}
                `;
                
                catsContainer.appendChild(catCard);
            } catch (catError) {
                console.error(`处理猫咪 [${index}] 时出错:`, catError);
            }
        });

        dayDiv.appendChild(catsContainer);
        results.appendChild(dayDiv);
        
        console.log('繁殖结果显示完成');
        return currentDayRarity;
    } catch (error) {
        console.error('显示繁殖结果时出错:', error);
        throw error;
    }
}

// 商店相关变量
let shopCats = [];

// 生成商店猫咪
function generateShopCats() {
    shopCats = [];
    for (let i = 0; i < 4; i++) {
        const cat = generateRandomCat();
        cat.isShopCat = true;
        cat.price = Math.floor(cat.totalRarity * 10); // 设置价格
        shopCats.push(cat);
    }
    displayShopCats();
}

// 显示商店猫咪
function displayShopCats() {
    const shopDiv = document.getElementById('shopCats');
    if (!shopDiv) return;
    
    shopDiv.innerHTML = '';
    shopCats.forEach((cat, index) => {
        const catCard = document.createElement('div');
        const threshold = parseInt(document.getElementById('rarityThreshold')?.value || 50);
        catCard.className = `shop-cat-card ${cat.totalRarity > threshold ? 'high-rarity' : ''}`;
        
        catCard.innerHTML = `
            <div class="cat-header">
                <h3>稀有度: ${cat.totalRarity}</h3>
                <span class="cat-gender gender-${cat.性别.value}">${cat.性别.value}</span>
            </div>
            <div class="cat-name">${cat.name || '未知'}</div>
            ${displayCatAttributes(cat)}
            <p>价格: ${Math.floor(cat.totalRarity * 10)} 金币</p>
            <button onclick="addShopCatToPool(${index})" class="primary-button">购买</button>
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
    
    // 检查金币是否足够
    const price = Math.floor(cat.totalRarity * 10);
    if (playerCoins < price) {
        alert(`金币不足！需要 ${price} 金币。`);
        return;
    }
    
    // 扣除金币
    playerCoins -= price;
    updateCoinsDisplay();
    
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
    
    // 检查元素是否存在
    if (autoControls) {
        autoControls.style.display = 'none';
    }
    if (manualControls) {
        manualControls.style.display = 'none';
    }
    if (shopDiv) {
        shopDiv.style.display = 'none';
    }
    
    // 根据模式设置显示
    switch (mode) {
        case 'auto':
            if (autoControls) {
                autoControls.style.display = 'block';
            }
            break;
        case 'auto_shop':
            if (autoControls) {
                autoControls.style.display = 'block';
            }
            if (shopDiv) {
                shopDiv.style.display = 'block';
                generateShopCats();
            }
            break;
        case 'manual':
            if (manualControls) {
                manualControls.style.display = 'block';
                initializeManualBreeding();
            }
            break;
        case 'manual_shop':
            if (manualControls) {
                manualControls.style.display = 'block';
                initializeManualBreeding();
            }
            if (shopDiv) {
                shopDiv.style.display = 'block';
                generateShopCats();
            }
            break;
    }
}

// 手动培育相关变量
let currentDay = 0;
let breedingPool = new Map();
let currentGenerationCats = new Map();

// 初始化手动培育
function initializeManualBreeding() {
    currentDay = 0;
    breedingPool.clear();
    currentGenerationCats.clear();
    
    // 生成初始猫咪（一公一母），传入true表示是初始猫咪
    const initialMale = generateRandomCat('公', true);
    const initialFemale = generateRandomCat('母', true);
    
    // 确保两只初始猫咪的CD都是满的
    initialMale.breedingCooldown = initialMale.maxBreedingCooldown;
    initialFemale.breedingCooldown = initialFemale.maxBreedingCooldown;
    
    // 添加到培育池
    breedingPool.set(initialMale.id, initialMale);
    breedingPool.set(initialFemale.id, initialFemale);
    currentGenerationCats.set(initialMale.id, initialMale);
    currentGenerationCats.set(initialFemale.id, initialFemale);
    
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
                <span class="cat-gender gender-${cat.性别.value}">${cat.性别.value}</span>
            </div>
            <div class="cat-name">${cat.name || '未知'}</div>
            ${displayCatAttributes(cat)}
            <p>培育CD: ${cat.breedingCooldown}/${cat.maxBreedingCooldown}点</p>
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
    
    const requiredCD = gameData.cdReductionPerBreeding || 8;
    
    currentGenerationCats.forEach(cat => {
        if (cat.breedingCooldown >= requiredCD) { // 使用设置的CD减少值作为门槛
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.name} (${cat.性别.value}, 稀有度: ${cat.totalRarity}, CD: ${cat.breedingCooldown}/${cat.maxBreedingCooldown})`;
            
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
        defaultMutationRate: gameData.defaultMutationRate,
        defaultAberrationRate: gameData.defaultAberrationRate,
        aberrationBonus: gameData.aberrationBonus,
        initialMaxBreedingCooldown: gameData.initialMaxBreedingCooldown,
        cdReductionPerBreeding: gameData.cdReductionPerBreeding,
        coinMultiplier: gameData.coinMultiplier
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
                if (data.defaultAberrationRate) gameData.defaultAberrationRate = data.defaultAberrationRate;
                if (data.aberrationBonus) gameData.aberrationBonus = data.aberrationBonus;
                if (data.initialMaxBreedingCooldown) gameData.initialMaxBreedingCooldown = data.initialMaxBreedingCooldown;
                if (data.cdReductionPerBreeding) gameData.cdReductionPerBreeding = data.cdReductionPerBreeding;
                if (data.coinMultiplier) gameData.coinMultiplier = data.coinMultiplier;
                
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

// 添加刷新商店函数
function refreshShop() {
    generateShopCats();
}

// 添加进入下一天的功能
function proceedToNextGeneration() {
    try {
        console.log('开始进入下一天处理...');
        
        // 检查游戏数据
        if (typeof gameData === 'undefined') {
            throw new Error('游戏数据未初始化');
        }
        console.log('游戏数据检查通过');

        // 检查必要的变量是否已初始化
        if (typeof currentGenerationCats === 'undefined') {
            throw new Error('当前猫咪数据未初始化');
        }
        if (typeof currentDay === 'undefined') {
            currentDay = 0;
        }
        console.log('当前天数:', currentDay);
        console.log('当前猫咪数量:', currentGenerationCats.size);

        // 检查是否有猫咪
        if (!currentGenerationCats || currentGenerationCats.size < 1) {
            alert('需要至少一只猫咪才能进入下一天！');
            return;
        }

        // 记录当前的繁殖结果
        const results = document.getElementById('breedingResults');
        if (!results) {
            throw new Error('找不到繁殖结果显示区域 (breedingResults)');
        }
        console.log('获取到繁殖结果显示区域');

        // 转换当前猫咪数据
        const currentCats = Array.from(currentGenerationCats.values());
        console.log('当前猫咪数组长度:', currentCats.length);

        if (!currentCats || currentCats.length === 0) {
            throw new Error('当前猫咪数据转换失败');
        }

        try {
            // 显示繁殖结果
            console.log('开始显示繁殖结果...');
            displayBreedingResults(results, currentCats, currentGenerationCats, currentDay);
            console.log('繁殖结果显示完成');
        } catch (displayError) {
            console.error('显示繁殖结果时出错:', displayError);
            throw new Error('显示繁殖结果失败: ' + displayError.message);
        }

        // 增加天数
        currentDay++;
        console.log('进入新的一天:', currentDay);

        // 修改CD恢复逻辑
        try {
            currentGenerationCats.forEach((cat, id) => {
                if (cat) {
                    // 每天恢复24点CD，但不超过最大值
                    cat.breedingCooldown = Math.min(
                        cat.maxBreedingCooldown,
                        cat.breedingCooldown + 24
                    );
                } else {
                    console.warn('发现无效的猫咪数据，ID:', id);
                }
            });
            console.log('更新繁殖CD完成');
        } catch (resetError) {
            console.error('更新繁殖CD时出错:', resetError);
            throw new Error('更新繁殖CD失败: ' + resetError.message);
        }

        // 刷新商店（如果在商店模式下）
        const currentPath = window.location.pathname;
        if (currentPath.includes('shop')) {
            try {
                console.log('开始刷新商店...');
                generateShopCats();
                console.log('商店刷新完成');
            } catch (shopError) {
                console.error('刷新商店时出错:', shopError);
            }
        }

        // 更新界面
        try {
            console.log('开始更新界面...');
            updateBreedingPoolDisplay();
            updateParentSelectors();
            console.log('界面更新完成');
        } catch (updateError) {
            console.error('更新界面时出错:', updateError);
            throw new Error('更新界面失败: ' + updateError.message);
        }

        // 修改金币计算逻辑
        let dailyIncome = 0;
        currentGenerationCats.forEach(cat => {
            dailyIncome += Math.floor(cat.totalRarity * 10 * (gameData.coinMultiplier || 1));
        });
        
        playerCoins += dailyIncome;
        console.log(`获得每日金币: ${dailyIncome} (倍率: ${gameData.coinMultiplier || 1})`);
        updateCoinsDisplay();
        
        // 显示金币获得提示
        alert(`已进入第 ${currentDay} 天！\n今日获得金币: ${dailyIncome} (倍率: ${gameData.coinMultiplier || 1})`);
        console.log('进入下一天处理完成');
        
    } catch (error) {
        console.error('进入下一天时出错:', error);
        console.error('错误堆栈:', error.stack);
        alert('进入下一天失败: ' + error.message);
    }
}

// 修改保存函数
function saveToLocalStorage() {
    try {
        const dataToSave = {
            attributes: gameData.attributes,
            breedingCooldown: gameData.breedingCooldown,
            defaultMutationRate: gameData.defaultMutationRate,
            currentDay: currentDay,
            simulationHistory: gameData.simulationHistory,
            playerCoins: playerCoins,
            initialMaxBreedingCooldown: gameData.initialMaxBreedingCooldown,
            cdReductionPerBreeding: gameData.cdReductionPerBreeding,
            coinMultiplier: gameData.coinMultiplier
        };
        localStorage.setItem('catBreederData', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 添加重新模拟功能
function resetSimulation() {
    if (confirm('确定要重新开始模拟吗？这将清空所有当前数据。')) {
        // 保存当前的属性设置
        const currentAttributes = { ...gameData.attributes };
        const currentSettings = {
            breedingCooldown: gameData.breedingCooldown,
            defaultMutationRate: gameData.defaultMutationRate,
            defaultAberrationRate: gameData.defaultAberrationRate,
            aberrationBonus: gameData.aberrationBonus,
            initialMaxBreedingCooldown: gameData.initialMaxBreedingCooldown,
            cdReductionPerBreeding: gameData.cdReductionPerBreeding,
            coinMultiplier: gameData.coinMultiplier
        };
        
        // 重置所有相关数据
        currentDay = 0;
        breedingPool.clear();
        currentGenerationCats.clear();
        playerCoins = 1000;
        
        // 清空显示区域
        const breedingResults = document.getElementById('breedingResults');
        if (breedingResults) {
            breedingResults.innerHTML = '';
        }
        
        // 重新初始化游戏，但保留属性设置
        gameData = { ...DEFAULT_GAME_DATA };
        gameData.attributes = currentAttributes;
        Object.assign(gameData, currentSettings);
        
        // 重新渲染界面
        renderAttributeList();
        renderControls();
        
        // 如果在商店模式下，刷新商店
        const currentPath = window.location.pathname;
        if (currentPath.includes('shop')) {
            generateShopCats();
        }
        
        // 根据不同模式初始化
        if (currentPath.includes('manual')) {
            initializeManualBreeding();
        } else if (currentPath.includes('auto')) {
            const initialCat = generateRandomCat();
            displayCurrentCat(initialCat);
        }
        
        alert('模拟已重置！属性设置已保留。');
    }
}

// 获取属性的基因强度
function getAttributeStrength(attrName, attrValue) {
    if (!gameData.attributes[attrName] || !attrValue) return 0;
    
    if (attrValue.isMultiSelect) {
        // 对于多选属性，返回所有选中值的平均基因强度
        return attrValue.values.reduce((sum, value) => {
            const index = gameData.attributes[attrName].options.indexOf(value);
            return sum + (index >= 0 ? gameData.attributes[attrName].geneStrength[index] : 0);
        }, 0) / attrValue.values.length;
    } else {
        // 对于单选属性，返回选中值的基因强度
        const index = gameData.attributes[attrName].options.indexOf(attrValue.value);
        return index >= 0 ? gameData.attributes[attrName].geneStrength[index] : 0;
    }
}