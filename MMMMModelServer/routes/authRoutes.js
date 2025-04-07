async function alculateBreedState(breedingpair, user) {
    // 获取当前时间

    // 首先循环breedingpair根据公母来区分，然后从中随机选择一公一母，如果只有一种性别直接pass
    let fatherCat = [];
    let motherCat = [];
    for (const cat of breedingpair) {
        if (cat.value.性别.value === '公') {
            fatherCat.push(cat);
        } else {
            motherCat.push(cat);
        }
    }
    if (fatherCat.length === 0 || motherCat.length === 0) {
        return;
    }
}