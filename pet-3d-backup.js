// ==================== THREE.js 3D猫咪系统 ====================

// 检查THREE.js是否可用
if (!window.THREE) {
    console.error('❌ Three.js 库未加载。检查网络连接或CDN可用性。');
    console.info('ℹ️ 系统将自动降级到 CSS 2D 版本。');
    window.initPet3D = function() {
        console.log('Three.js不可用，调用CSS版本...');
        if (window.initPetCSS) {
            initPetCSS();
        }
    };
} else {

class PetCat3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cat = null;
        this.animationId = null;
        this.isInitialized = false;
        
        // 动画参数
        this.breathePhase = 0;
        this.blinkPhase = 0;
        this.idleRotation = 0;
    }

    /**
     * 初始化Three.js场景
     */
    init() {
        if (this.isInitialized) return;

        // 场景设置
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xfaf8f5); // 柔和背景

        // 相机设置
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // 渲染器设置
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 创建猫咪
        this.cat = this._createCat();
        this.scene.add(this.cat);

        // 设置灯光
        this._setupLights();

        // 开始动画循环
        this._animate();

        // 窗口resize处理
        window.addEventListener('resize', () => this._onWindowResize());

        this.isInitialized = true;
        console.log('✅ 3D猫咪已初始化');
    }

    /**
     * 创建3D猫咪模型
     */
    _createCat() {
        const cat = new THREE.Group();
        cat.scale.set(1.5, 1.5, 1.5);

        // 身体颜色
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xffe8d6,
            shininess: 100,
            emissive: 0xfff5eb
        });

        const pinkMaterial = new THREE.MeshPhongMaterial({
            color: 0xffb8a8,
            shininess: 80
        });

        // ==================== 身体 ====================
        const torsoGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.y = -0.5;
        torso.castShadow = true;
        torso.receiveShadow = true;
        cat.add(torso);

        // ==================== 头部 ====================
        const headGeometry = new THREE.SphereGeometry(0.9, 32, 32);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.2;
        head.castShadow = true;
        head.receiveShadow = true;
        cat.add(head);

        // 头上的纹理（条纹）
        const stripeGeometry = new THREE.TorusGeometry(0.85, 0.08, 8, 32);
        const stripeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffd6c0,
            shininess: 90
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.y = 1.6;
        stripe.position.z = 0.3;
        stripe.rotation.x = Math.PI / 6;
        stripe.castShadow = true;
        cat.add(stripe);

        // ==================== 耳朵 ====================
        const earGeometry = new THREE.ConeGeometry(0.35, 0.8, 32);
        
        // 左耳
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(-0.6, 2.0, 0);
        leftEar.rotation.z = -Math.PI / 6;
        leftEar.castShadow = true;
        cat.add(leftEar);

        // 右耳
        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(0.6, 2.0, 0);
        rightEar.rotation.z = Math.PI / 6;
        rightEar.castShadow = true;
        cat.add(rightEar);

        // 耳朵内部
        const earInnerGeometry = new THREE.ConeGeometry(0.15, 0.5, 16);
        const earInnerMaterial = new THREE.MeshPhongMaterial({
            color: 0xff9b7b,
            shininess: 100
        });

        const leftEarInner = new THREE.Mesh(earInnerGeometry, earInnerMaterial);
        leftEarInner.position.set(-0.6, 1.8, 0.1);
        leftEarInner.rotation.z = -Math.PI / 6;
        leftEarInner.scale.set(0.8, 0.8, 0.8);
        cat.add(leftEarInner);

        const rightEarInner = new THREE.Mesh(earInnerGeometry, earInnerMaterial);
        rightEarInner.position.set(0.6, 1.8, 0.1);
        rightEarInner.rotation.z = Math.PI / 6;
        rightEarInner.scale.set(0.8, 0.8, 0.8);
        cat.add(rightEarInner);

        // ==================== 眼睛 ====================
        const eyeGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B5A3C,
            shininess: 120
        });

        // 左眼
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.35, 1.5, 0.7);
        leftEye.castShadow = true;
        leftEye.userData.isEye = true;
        leftEye.userData.eyeIndex = 0;
        cat.add(leftEye);

        // 右眼
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.35, 1.5, 0.7);
        rightEye.castShadow = true;
        rightEye.userData.isEye = true;
        rightEye.userData.eyeIndex = 1;
        cat.add(rightEye);

        // 眼睛高光
        const shineGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const shineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            emissive: 0xffffff
        });

        const leftShine = new THREE.Mesh(shineGeometry, shineMaterial);
        leftShine.position.set(-0.3, 1.6, 1.0);
        cat.add(leftShine);

        const rightShine = new THREE.Mesh(shineGeometry, shineMaterial);
        rightShine.position.set(0.4, 1.6, 1.0);
        cat.add(rightShine);

        // ==================== 鼻子 ====================
        const noseGeometry = new THREE.TetrahedronGeometry(0.15, 2);
        const noseMaterial = new THREE.MeshPhongMaterial({
            color: 0xffb8a8,
            shininess: 100
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 1.0, 1.0);
        nose.castShadow = true;
        cat.add(nose);

        // ==================== 嘴 ====================
        const mouthCurveGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 20);
        const mouthMaterial = new THREE.MeshPhongMaterial({
            color: 0xdb9b88,
            shininess: 80
        });
        const mouth = new THREE.Mesh(mouthCurveGeometry, mouthMaterial);
        mouth.position.set(0, 0.7, 1.0);
        mouth.rotation.x = Math.PI / 3;
        mouth.castShadow = true;
        cat.add(mouth);

        // ==================== 腮红 ====================
        const blushGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const blushMaterial = new THREE.MeshPhongMaterial({
            color: 0xffb8d0,
            shininess: 80,
            transparent: true,
            opacity: 0.7
        });

        // 左腮红
        const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        leftBlush.position.set(-0.75, 1.2, 0.3);
        leftBlush.scale.set(0.4, 0.35, 0.3);
        cat.add(leftBlush);

        // 右腮红
        const rightBlush = new THREE.Mesh(blushGeometry, blushMaterial);
        rightBlush.position.set(0.75, 1.2, 0.3);
        rightBlush.scale.set(0.4, 0.35, 0.3);
        cat.add(rightBlush);

        // ==================== 前腿 ====================
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
        
        // 左腿
        const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        leftLeg.position.set(-0.35, -1.2, 0.2);
        leftLeg.castShadow = true;
        leftLeg.receiveShadow = true;
        cat.add(leftLeg);

        // 右腿
        const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        rightLeg.position.set(0.35, -1.2, 0.2);
        rightLeg.castShadow = true;
        rightLeg.receiveShadow = true;
        cat.add(rightLeg);

        // ==================== 尾巴 ====================
        const tailCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.3, -0.3, -0.5),
            new THREE.Vector3(0.5, 0.2, -1.2),
            new THREE.Vector3(0.7, 0.8, -1.5),
            new THREE.Vector3(0.4, 1.2, -1.2),
            new THREE.Vector3(0.1, 1.5, -0.5)
        ]);

        const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.25, 8);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.castShadow = true;
        tail.receiveShadow = true;
        tail.userData.isTail = true;
        cat.add(tail);

        // ==================== 胡须 ====================
        const whiskerMaterial = new THREE.LineBasicMaterial({
            color: 0xffd6c0,
            linewidth: 2
        });

        // 左胡须
        const leftWhiskerPoints = [
            new THREE.Vector3(-0.5, 1.0, 0.8),
            new THREE.Vector3(-1.2, 1.0, 0.5)
        ];
        const leftWhiskerGeom = new THREE.BufferGeometry().setFromPoints(leftWhiskerPoints);
        const leftWhisker = new THREE.Line(leftWhiskerGeom, whiskerMaterial);
        cat.add(leftWhisker);

        // 右胡须
        const rightWhiskerPoints = [
            new THREE.Vector3(0.5, 1.0, 0.8),
            new THREE.Vector3(1.2, 1.0, 0.5)
        ];
        const rightWhiskerGeom = new THREE.BufferGeometry().setFromPoints(rightWhiskerPoints);
        const rightWhisker = new THREE.Line(rightWhiskerGeom, whiskerMaterial);
        cat.add(rightWhisker);

        // 保存引用用于动画
        cat.userData.torso = torso;
        cat.userData.head = head;
        cat.userData.leftEye = leftEye;
        cat.userData.rightEye = rightEye;
        cat.userData.tail = tail;
        cat.userData.leftLeg = leftLeg;
        cat.userData.rightLeg = rightLeg;

        return cat;
    }

    /**
     * 设置灯光
     */
    _setupLights() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 主光源（上方）
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);

        // 侧光（增加立体感）
        const sideLight = new THREE.DirectionalLight(0xffcaaa, 0.4);
        sideLight.position.set(-5, 2, 3);
        this.scene.add(sideLight);

        // 背光（增加分离感）
        const backLight = new THREE.DirectionalLight(0xff99dd, 0.3);
        backLight.position.set(0, 1, -5);
        this.scene.add(backLight);

        // 点光源（增加高光）
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(3, 3, 3);
        this.scene.add(pointLight);
    }

    /**
     * 动画循环
     */
    _animate = () => {
        this.animationId = requestAnimationFrame(this._animate);

        if (!this.cat) return;

        // 呼吸动画
        this.breathePhase += 0.02;
        const breatheScale = 1 + Math.sin(this.breathePhase) * 0.05;
        this.cat.scale.set(1.5 * breatheScale, 1.5 * breatheScale, 1.5 * breatheScale);

        // 眨眼动画
        this.blinkPhase = (this.blinkPhase + 0.015) % (Math.PI * 2);
        const blinkScale = Math.max(0.2, Math.cos(this.blinkPhase / 6) * 1);
        if (this.cat.userData.leftEye) {
            this.cat.userData.leftEye.scale.y = blinkScale;
            this.cat.userData.rightEye.scale.y = blinkScale;
        }

        // 转头（轻微）
        this.idleRotation += 0.005;
        this.cat.rotation.y = Math.sin(this.idleRotation) * 0.2;
        this.cat.userData.head.rotation.x = Math.sin(this.idleRotation * 0.5) * 0.1;

        // 尾巴摇晃
        if (this.cat.userData.tail) {
            this.cat.userData.tail.rotation.z = Math.sin(this.idleRotation * 1.5) * 0.3;
        }

        // 腿部轻微摇晃
        if (this.cat.userData.leftLeg && this.cat.userData.rightLeg) {
            this.cat.userData.leftLeg.position.x = -0.35 + Math.sin(this.idleRotation) * 0.05;
            this.cat.userData.rightLeg.position.x = 0.35 - Math.sin(this.idleRotation) * 0.05;
        }

        // 渲染
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 点击反应（反弹）
     */
    bounce() {
        let bouncePhase = 0;
        const bounceInterval = setInterval(() => {
            bouncePhase += 0.1;
            
            // 上下运动 + 旋转
            this.cat.position.y = Math.sin(bouncePhase) * 0.5;
            this.cat.rotation.z = Math.sin(bouncePhase) * 0.1;

            if (bouncePhase > Math.PI) {
                clearInterval(bounceInterval);
                this.cat.position.y = 0;
                this.cat.rotation.z = 0;
            }
        }, 16);
    }

    /**
     * 高压力反应（温柔）
     */
    comfort() {
        let comfortPhase = 0;
        const comfortInterval = setInterval(() => {
            comfortPhase += 0.08;
            
            // 缓慢摇晃
            this.cat.rotation.x = Math.sin(comfortPhase) * 0.15;
            this.cat.rotation.z = Math.cos(comfortPhase) * 0.1;

            if (comfortPhase > Math.PI * 2) {
                clearInterval(comfortInterval);
                this.cat.rotation.x = 0;
                this.cat.rotation.z = 0;
            }
        }, 16);
    }

    /**
     * 窗口resize处理
     */
    _onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * 清理资源
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// 全局实例
let petCat3D = null;

/**
 * 初始化3D猫咪
 */
function initPet3D() {
    petCat3D = new PetCat3D('pet');
    petCat3D.init();
}

/**
 * 触发3D猫咪的弹跳动画
 */
function triggerPetBounce() {
    if (petCat3D) {
        petCat3D.bounce();
    }
}

/**
 * 触发3D猫咪的安慰动画
 */
function triggerPetComfort() {
    if (petCat3D) {
        petCat3D.comfort();
    }
}

} // 闭合 THREE.js 可用性检查的 else 语句
