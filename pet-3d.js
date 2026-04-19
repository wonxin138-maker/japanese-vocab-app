// ==================== 简化版 Three.js 猫咪系统 ====================
// 使用最基础的 Three.js API，确保最大兼容性

if (!window.THREE) {
    console.error('❌ Three.js 库未加载');
    window.initPet3D = function() { console.log('Three.js不可用'); };
} else {

class SimplePetCat3D {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cat = null;
        this.animationId = null;
        
        // 动画参数
        this.time = 0;
    }

    init() {
        try {
            // === 场景设置 ===
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xfaf8f5);

            // === 相机设置 ===
            const width = this.container.clientWidth || 500;
            const height = this.container.clientHeight || 500;
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 5;

            // === 渲染器设置 ===
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(width, height);
            this.renderer.shadowMap.enabled = true;
            this.container.appendChild(this.renderer.domElement);

            // === 灯光设置 ===
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            directionalLight.castShadow = true;
            this.scene.add(directionalLight);

            // === 创建猫咪 ===
            this._createSimpleCat();

            // === 启动动画循环 ===
            this._animate();

            console.log('✨ Three.js 简化版猫咪初始化成功');
        } catch (error) {
            console.error('❌ Three.js 初始化失败:', error);
            // 降级到CSS版本
            if (window.initPetCSS) {
                window.USE_CSS_VERSION = true;
                window.initPetCSS();
            }
        }
    }

    _createSimpleCat() {
        this.cat = new THREE.Group();

        // 材质
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xfffaf0,
            shininess: 100
        });

        // === 头部 ===
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 32, 32),
            bodyMaterial
        );
        head.position.y = 1.2;
        head.castShadow = true;
        head.receiveShadow = true;
        this.cat.add(head);

        // === 耳朵 ===
        const earGeometry = new THREE.ConeGeometry(0.35, 0.7, 8);
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(-0.5, 1.8, 0);
        leftEar.rotation.z = -0.3;
        this.cat.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(0.5, 1.8, 0);
        rightEar.rotation.z = 0.3;
        this.cat.add(rightEar);

        // === 眼睛 ===
        const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.25, 1.4, 0.7);
        this.cat.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.25, 1.4, 0.7);
        this.cat.add(rightEye);

        // === 鼻子 ===
        const noseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xffb8a8 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 1.0, 0.8);
        this.cat.add(nose);

        // === 身体 ===
        const torso = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8),
            bodyMaterial
        );
        torso.position.y = -0.5;
        torso.castShadow = true;
        this.cat.add(torso);

        // === 前腿 ===
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.7, 8);
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(-0.3, -1.1, 0.2);
        this.cat.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(0.3, -1.1, 0.2);
        this.cat.add(rightLeg);

        // === 尾巴 ===
        const tailGeometry = new THREE.CylinderGeometry(0.15, 0.1, 1.2, 8);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(0.7, -0.3, -0.3);
        tail.rotation.z = 0.5;
        this.cat.add(tail);

        this.scene.add(this.cat);
    }

    _animate = () => {
        this.animationId = requestAnimationFrame(this._animate);
        this.time += 0.016;

        if (this.cat) {
            // 呼吸效果
            const breathe = Math.sin(this.time * 2) * 0.03 + 1;
            this.cat.scale.y = breathe;

            // 头部轻微晃动
            this.cat.rotation.y = Math.sin(this.time * 0.5) * 0.1;

            // 眼睛眨眼
            const blink = Math.abs(Math.sin(this.time * 2)) > 0.95 ? 0.2 : 1;
        }

        this.renderer.render(this.scene, this.camera);
    }

    bounce() {
        if (this.cat) {
            const originalY = this.cat.position.y;
            this.cat.position.y = originalY + 0.3;
            setTimeout(() => { this.cat.position.y = originalY; }, 200);
        }
    }

    comfort() {
        if (this.cat) {
            // 摇晃效果
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.cat.rotation.z = (i % 2 === 0 ? 0.1 : -0.1);
                }, i * 150);
            }
            setTimeout(() => { this.cat.rotation.z = 0; }, 450);
        }
    }

    dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
        if (this.renderer && this.renderer.domElement.parent) {
            this.renderer.domElement.parent.removeChild(this.renderer.domElement);
        }
    }
}

// === 全局实例 ===
let petCat3D = null;

/**
 * 初始化3D猫咪
 */
function initPet3D() {
    const container = document.getElementById('pet');
    if (!container) {
        console.error('❌ 找不到 #pet 容器');
        return;
    }

    try {
        petCat3D = new SimplePetCat3D(container);
        petCat3D.init();
    } catch (error) {
        console.error('❌ 初始化失败:', error);
        // 降级到CSS
        window.USE_CSS_VERSION = true;
        if (window.initPetCSS) window.initPetCSS();
    }
}

/**
 * 触发弹跳动画
 */
function triggerPetBounce() {
    if (petCat3D) petCat3D.bounce();
}

/**
 * 触发安慰动画
 */
function triggerPetComfort() {
    if (petCat3D) petCat3D.comfort();
}

} // 闭合 THREE 检查
