// ==================== CSS 2D 猫咪初始化（备用方案）====================

/**
 * 当Three.js不可用时使用CSS版本
 * 这确保应用总是可以工作，即使CDN失败
 */

function initPetCSS() {
    console.log('🎨 初始化 CSS 2D 猫咪版本...');
    
    // 显示CSS猫咪容器
    const cssCatContainer = document.getElementById('csscat-container');
    if (cssCatContainer) {
        cssCatContainer.style.display = 'block';
    }
    
    // 获取宠物容器
    const petContainer = document.getElementById('pet');
    if (petContainer) {
        // 移除Three.js渲染器
        const canvas = petContainer.querySelector('canvas');
        if (canvas) {
            canvas.remove();
        }
        
        // 恢复CSS样式（移除Three.js覆盖）
        petContainer.style.position = 'relative';
        petContainer.style.display = 'flex';
        petContainer.style.alignItems = 'center';
        petContainer.style.justifyContent = 'center';
    }
    
    console.log('✅ CSS 2D 版本已激活');
}

// 添加全局标记
window.initPetCSS = initPetCSS;
