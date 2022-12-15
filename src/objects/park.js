import * as THREE from 'three';

class Park {
    // Heatmap_res is the resolution of the heatmap texture in pixels per meter width
    constructor(group, pos, width, height, color) {
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
        this.mesh.renderOrder = 1;

        group.add(this.mesh);
    }


    // Begin new heatmap render
    initRenderHeatmap(group, sun, heatmap_canvas, n_samples, progress_bar) {
        this.hm_sun = sun;
        this.hm_heatmap_canvas = heatmap_canvas;
        this.hm_n_samples = n_samples;
        this.hm_progress_bar = progress_bar;
        // Calculate the size of the heatmap canvas from the park size
        this.hm_w = heatmap_canvas.width
        this.hm_h = Math.floor(this.hm_w * this.height / this.width);
        // Resize the canvas to fit
        this.hm_heatmap_canvas.height = this.hm_h;

        this.hm_image_center_x = this.hm_w / 2;
        this.hm_image_center_y = this.hm_h / 2;
        this.hm_light_intensity = new Array(this.hm_w * this.hm_h).fill(0);

        // Only consider mesh objects
        // Exclude the park mesh itself and the sun
        // Only consider objects that are set to cast shadows
        this.hm_hittable_objects = group.children.filter((object) => 
            object.type == "Mesh" && 
            object != this.mesh && 
            object != sun.sun_sphere &&
            object.castShadow == true);
        
        this.hm_raycaster = new THREE.Raycaster();
        this.hm_sun_start = sun.angle;
        this.hm_samples = 0;
    }

    // Take one step of updating the sun position and sampling the park light intensity
    // After init has been called, this has to be called repeatedly to complete the calculation
    stepRenderHeatmap() {
        // Only run if we have not finished
        if(this.hm_samples >= this.hm_n_samples || this.hm_samples == null) {
            return;
        }

        // Update the sun position - sweep from east to west
        const horizon_offset = 10; // Start and end offset from the horizon
        const angle = horizon_offset + this.hm_samples / this.hm_n_samples * (180-horizon_offset);
        this.hm_sun.setPosition(angle * THREE.MathUtils.DEG2RAD);
        // Get the sun position in world space
        const sun_pos = this.hm_sun.light.position.clone();
        // Sample from positions in the park by raycasting to the sun
        for (let x = 0; x < this.hm_w; x++) {
            for (let y = 0; y < this.hm_h; y++) {
                // Get position of the park pixel in world space
                const park_offset = new THREE.Vector3((x - this.hm_image_center_x) * this.width / this.hm_w, 0, (y - this.hm_image_center_y) * this.height / this.hm_h);
                const park_pos = new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
                park_pos.add(park_offset);
                const ray = sun_pos.clone().sub(park_pos); // Vector from park to sun
                ray.normalize(); // Raycaster needs unit vector
                this.hm_raycaster.set(park_pos, ray);
                const intersect_meshes = this.hm_raycaster.intersectObjects(this.hm_hittable_objects, true);
                // If there are no mesh objects hit, then the sun is not blocked
                if (intersect_meshes.length == 0) {
                    this.hm_light_intensity[x + y * this.hm_w] += 1;
                }
            }
        }
        this.hm_samples += 1;
        // Update on current progress
        //console.log("Sample " + this.hm_samples + " of " + this.hm_n_samples);
        this.hm_progress_bar.value = this.hm_samples / this.hm_n_samples;

        // Only draw the heatmap if we have finished
        if (this.hm_samples < this.hm_n_samples) {
            return;
        }

        // Reset sun position
        this.hm_sun.setPosition(this.hm_sun_start);
        // Draw the heatmap of shadow intensity
        const context = this.hm_heatmap_canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        const data = context.getImageData(0, 0, this.hm_heatmap_canvas.width, this.hm_heatmap_canvas.height);
        for (let x = 0; x < this.hm_heatmap_canvas.width; x++) {
            for (let y = 0; y < this.hm_heatmap_canvas.height; y++) {
                let index = (x + y * this.hm_heatmap_canvas.width) * 4;
                let intensity = this.hm_light_intensity[x + y * this.hm_w] / this.hm_samples; // 0..1
                intensity = (intensity - 0.5) * 2; // -1..1
                // Below 0 - shaded, output as red
                const r = Math.floor(-Math.min(0, intensity) * 255 )
                // Above 0 - lit, output as blue
                const b = Math.floor(Math.max(0, intensity) * 255 )
                // Set the pixel color
                data.data[index + 0] = r;       // red
                data.data[index + 1] = 0;       // green
                data.data[index + 2] = b;       // blue
                data.data[index + 3] = 255;     // alpha
            }
        }
        context.putImageData(data, 0, 0);
    }
}

export { Park };
