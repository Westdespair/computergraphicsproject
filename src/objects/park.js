import * as THREE from 'three';

class Park {
    // Heatmap_res is the resolution of the heatmap texture in pixels per meter width
    constructor(group, pos, width, height, color, heatmap_res, heatmap_canvas) {
        this.width = width;
        this.height = height;
        this.color = color;

        // Visible mesh
        this.geometry = new THREE.PlaneGeometry(this.width, this.height);
        this.material = new THREE.MeshLambertMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.set(pos.x, pos.y, pos.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        group.add(this.mesh);
        
        // Mesh for computing shadow heatmap on
        this.heatmap = new Object();
        this.heatmap.material = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White color for fully lit
        this.heatmap.mesh = new THREE.Mesh(this.geometry, this.heatmap.material);
        this.heatmap.mesh.rotation.x = -Math.PI / 2;
        this.heatmap.mesh.position.set(pos.x, pos.y, pos.z);
        this.heatmap.mesh.castShadow = true;
        this.heatmap.mesh.receiveShadow = true;
        group.add(this.heatmap.mesh);
        // Create camera above the mesh
        this.heatmap.camera = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 0.95, 1.05);
        this.heatmap.camera.position.set(pos.x, pos.y + 1, pos.z);
        this.heatmap.camera.lookAt(pos.x, pos.y, pos.z);

        this.heatmap.renderer = new THREE.WebGLRenderer({ canvas: heatmap_canvas, antialias: true });
        this.heatmap.renderer.setSize(heatmap_canvas.clientWidth, heatmap_canvas.clientWidth * this.height / this.width);
        this.heatmap.renderer.shadowMap.enabled = true;
        this.heatmap.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    renderHeatmap(scene) {
        // Just output current scene to heatmap canvas for now
        // Swap visible mesh with heatmap mesh and render
        this.heatmap.mesh.visible = true;
        this.mesh.visible = false;
        this.heatmap.renderer.clear();
        this.heatmap.renderer.render(scene, this.heatmap.camera);
        // Swap back
        this.heatmap.mesh.visible = false;
        this.mesh.visible = true;
    }
}

export { Park };
