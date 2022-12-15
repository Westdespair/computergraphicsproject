import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { Sun } from '/src/objects/sun.js';
import { Ground } from '/src/objects/ground.js';
import { Park } from '/src/objects/park.js';
import { Cube } from '/src/objects/cube.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Road} from "./objects/roads.js";

const sun_position = document.getElementById('sun_slider');
const fov_slider = document.getElementById('fov_slider');
const reset_camera_btn = document.getElementById('reset_camera_btn');
const main_canvas = document.getElementById('main_canvas');
const heatmap_canvas = document.getElementById('heatmap_canvas');
const addButton = document.getElementById("addBtn");
const heatmapSamples = document.getElementById("calc_samples");
const heatmapProgress = document.getElementById("calc_progress");
const heatmapCalcButton = document.getElementById("calc_heatmap_btn");
const heatmapCanvasWidth = document.getElementById("calc_canv_width");


const scene = new THREE.Scene();

// Create renderer
const renderer = new THREE.WebGLRenderer( { canvas: main_canvas, antialias: true } );
renderer.setSize( main_canvas.parentElement.clientWidth, main_canvas.parentElement.clientHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor("#87CEEB", 1);

fov_slider.oninput = function(event) {
    document.getElementById('fov_display').value=event.target.value;
    camera.fov = event.target.value;
    camera.updateProjectionMatrix();
}
const camera = new THREE.PerspectiveCamera( 75, main_canvas.parentElement.clientWidth / main_canvas.parentElement.clientHeight, 0.1, 1e6 )
fov_slider.value = camera.fov; fov_slider.dispatchEvent(new Event('input'));
camera.position.set(0, 300, 300);
camera.lookAt(0, 0, 0);

// Create a group to hold all objects
const group = new THREE.Group();

// Mouse drag controls and related raycaster
const control = new TransformControls( camera, renderer.domElement );
control.enabled = false;
control.showY = false; // Disable vertical movement
control.select = function(object) {
    this.attach( object );
    this.enabled = true;
    object.material.transparent=true;
    object.material.opacity=0.5;
    object.material.emissive.set( 0x008800 );
};
control.deselect = function() {
    if( this.object != null ) {
        this.object.material.opacity=1;
        this.object.material.emissive.set( 0x000000 );
    }
    this.detach();
    this.enabled = false;
};

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.maxDistance = 800;
orbit.minDistance = 2;
reset_camera_btn.onclick = function() { orbit.reset(); }

const stats = new Stats();
stats.dom.style.cssText = "position: fixed; cursor: pointer; opacity: 0.9; z-index: 10000;"; // Fix position on top of main canvas
main_canvas.parentNode.appendChild( stats.dom );


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

main_canvas.onmousedown = function(event) {
    event.preventDefault();
    orbit.enabled = true;
    // possible race condition if dragging not set before this handler runs?
    if (control.dragging) {
        orbit.enabled = false;
        return;
    }
    // If control is enabled, clicking outside the drag handles will disable it
    if ( control.enabled ) {
        control.deselect();
        return;
    }
    // Get mouse position in camera image plane, raycast to find intersecting objects
    mouse.x = ( (event.clientX - renderer.domElement.parentElement.offsetLeft) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = -( (event.clientY - renderer.domElement.parentElement.offsetTop) / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    const selectable = group.children.filter( function( object ) { return object.selectable; } ); // Filter out only objects with selectable property
    const intersects = raycaster.intersectObjects(selectable);
    if ( intersects.length > 0 ) {
        const object = intersects[0].object;
        control.select(object);
    }
};

main_canvas.onmouseup = function(event) {
    orbit.enabled = true;
}

addButton.onclick = function() {
    const name = (shape.value)

    switch(name) {
        case "Cube":
            add_cube()
        break;

        case "House":
            add_gltf("enebolig1")
        break;

        case "Tree":
            add_gltf("tree")
            break;

        case "Skyscraper":
            add_gltf("skyscraper1")
            break;

        case "Bush":
            add_gltf("bush")
            break;

        case "Playground":
            add_gltf("swingset")
            break;

        case "Picnicbench":
            add_gltf("picnicbench")
            break;

        case "Parkbench":
            add_gltf("parkbench")
            break;

        case "Landmark":
            add_gltf("landmark")
            break;
    }
}

// Reset heatmap calculation
heatmapCalcButton.onclick = function() {
    park.initRenderHeatmap(group, sun, heatmap_canvas, heatmapSamples.value, heatmapProgress);
}

heatmapCanvasWidth.onchange = function() {
    heatmap_canvas.width = heatmapCanvasWidth.value;
    console.log(heatmap_canvas.width);
}


function add_cube() {
    // Randomize x, z position and color
    const pos = new THREE.Vector3( Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2 );   
    const color = Math.random() * 0xffffff;
    const cube = new Cube(group, pos, new THREE.Vector3(1, 1, 1), color);
    cube.mesh.selectable = true;
};

// Reference to animated objects
let car1;
let truck1;

function add_gltf(object, scalex, scaley, scalez, posx, posy, posz) {
    if (scalex === undefined) {
        scalex = 3;
    } if (scaley === undefined) {
        scaley = 3;
    } if (scalez === undefined) {
        scalez = 3;
    } if (posx === undefined) {
        posx = 0;
    } if (posy === undefined) {
        posy = 0;
    } if (posz === undefined) {
        posz = 0;
    }

    // Randomize x, z position and color
    const pos = new THREE.Vector3(posx, 0.5, posz);
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('res/objects/'+object+'.gltf', (gltf) => {
        const root = gltf.scene;
        gltf.scene.children[0].scale.set(scalex*gltf.scene.children[0].scale.x, scaley*gltf.scene.children[0].scale.y, scalez*gltf.scene.children[0].scale.z);
        gltf.scene.children[0].position.set(posx, posy, posz);
        gltf.scene.children[0].recieveShadow = true;
        gltf.scene.children[0].castShadow = true;
        gltf.scene.children[0].selectable = true; // Needed to select with mouse
        group.add(gltf.scene.children[0]);

        // We need to keep track of the animated objects, store
        if (object === "car") {
            car1 = group.children[group.children.length-1];
            car1.selectable = false;
        } else if (object === "truck") {
            truck1 = group.children[group.children.length-1];
            truck1.selectable = false;
        }
    })

}


// Key events
document.addEventListener('keydown', function(event) {
    if (event.key === "Delete") {
        if (control.enabled) {
            group.remove(control.object);
            control.deselect();
        }
    } else if (event.key === "Escape") {
        control.deselect();
    } else if (event.key === "Shift") {
        control.setTranslationSnap(2);
        control.setRotationSnap(THREE.MathUtils.degToRad(15));
    } else if (event.key.toLowerCase() === "r") {
        if (control.mode === "rotate") {
            control.setMode("translate");
            control.showX = true; control.showY = false; control.showZ = true;
        } else {
            control.setMode("rotate");
            control.showX = false; control.showY = true; control.showZ = false;
        }
    }
});

document.addEventListener( 'keyup', function(event) {
    if (event.key === "Shift") {
        control.setTranslationSnap(null);
        control.setRotationSnap(null);
    }
}
);

window.addEventListener( 'resize', function() {
    camera.aspect = main_canvas.parentElement.clientWidth / main_canvas.parentElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( main_canvas.parentElement.clientWidth, main_canvas.parentElement.clientHeight );
});

const sun = new Sun(group);
sun.disableHelper();

let ground_length = 1000;
let ground_width = 1000;
const ground = new Ground(group, new THREE.Vector3(0, 0, 0), ground_width, ground_length, 0x262626);
const park = new Park(group, new THREE.Vector3(0, 0.05, 0), 250, 300, 0x0e6e28);


for (let i = -400; i < 400; i = i + 200) {
    if (i !== 0) {
        let road = new Road(group, new THREE.Vector3(0, 0.05, i), 1000, 20, 0x949494, ground_length / 6, 6);
    }
}

for (let i = -400; i < 400; i = i + 200) {
    if (i !== 0) {
        let road = new Road(group, new THREE.Vector3(i, 0.05, 0), 1000, 20, 0x949494, 1, 6);
    }
}

// Add some cars
add_gltf("car", 5, 5, 5, 50, 0, 200);
add_gltf("truck", 5, 5, 5, -50, 0, -200);

function updateCars() {
    // Check that the objects are loaded
    if (car1 === undefined || truck1 === undefined) {
        return;
    }
    // Animate
    car1.position.x -= 1;

    truck1.position.x -= 1;
    // Wrap around map
    if (car1.position.x < -500) {
        car1.position.x = 500;
    }
    if (truck1.position.x < -500) {
        truck1.position.x = 500;
    }
}

// Add all obejcts to renderable scene
scene.add( group );
scene.add( control );


add_gltf("landmark", 3, 3, 3, 0, 0, -120);

add_gltf("tree", 2,3,2, 30, 0, -60);
add_gltf("tree", 2,3.5,2, 30, 0, -70);
add_gltf("tree", 2,4,2, 30, 0, -80);
add_gltf("tree", 2,4,2, 30, 0, -90);
add_gltf("tree", 2,3.5,2, 30, 0, -100);
add_gltf("tree", 2,3,2, 30, 0, -110);
add_gltf("tree", 2,3,2, -30, 0, -60);
add_gltf("tree", 2,3.5,2, -30, 0, -70);
add_gltf("tree", 2,4,2, -30, 0, -80);
add_gltf("tree", 2,4,2, -30, 0, -90);
add_gltf("tree", 2,3.5,2, -30, 0, -100);
add_gltf("tree", 2,3,2, -30, 0, -110);

add_gltf("swingset", 3,3,3, 100,0,120)
add_gltf("swingset", 3,3,3, 100,0,90)
add_gltf("swingset", 3,3,3, 100,0,50)

add_gltf("parkbench", 3,3,3, -10,0,-100)
add_gltf("parkbench", 3,3,3, 10,0,-100)

add_gltf("picnicbench", 3,3,3, 0,0,0)
add_gltf("picnicbench", 3,3,3, 0,0,-30)



add_gltf("bush", 3,3,3, 100,0,35)
add_gltf("bush", 3,3,3, 100,0,30)
add_gltf("bush", 3,3,3, 100,0,25)
add_gltf("bush", 3,3,3, 100,0,20)
add_gltf("bush", 3,3,3, 95,0,35)
add_gltf("bush", 3,3,3, 95,0,30)
add_gltf("bush", 3,3,3, 95,0,25)
add_gltf("bush", 3,3,3, 95,0,20)


add_gltf("bush", 3,3,3, -50,0,35)
add_gltf("bush", 3,3,3, -80,0,30)
add_gltf("bush", 3,3,3, -36,0,25)
add_gltf("bush", 3,3,3, -67,0,20)
add_gltf("bush", 3,3,3, -50,0,55)
add_gltf("bush", 3,3,3, -80,0,-0)
add_gltf("bush", 3,3,3, -36,0,-25)
add_gltf("bush", 3,3,3, -67,0,-60)


add_gltf("skyscraper1", 3, 0.8, 3, 0, 0, 170);
add_gltf("skyscraper1", 3, 1.2, 3, 30, 0, 170);
add_gltf("skyscraper1", 3, 1, 3, 60, 0, 170);
add_gltf("skyscraper1", 3, 1.1, 3, 90, 0, 170);
add_gltf("skyscraper1", 3, 0.9, 3, 120, 0, 170);
add_gltf("skyscraper1", 3, 1, 3, 150, 0, 170);
add_gltf("skyscraper1", 3, 1, 3, -30, 0, 170);
add_gltf("skyscraper1", 3, 1.1, 3, -60, 0, 170);
add_gltf("skyscraper1", 3, 0.8, 3, -90, 0, 170);
add_gltf("skyscraper1", 3, 1.5, 3, -120, 0, 170);
add_gltf("skyscraper1", 3, 1.3, 3, -150, 0, 170);


add_gltf("skyscraper1", 3, 1.3, 3, -150, 0, 150);
add_gltf("skyscraper1", 3, 1.2, 3, -150, 0, 120);
add_gltf("skyscraper1", 3, 1.1, 3, -150, 0, 90);
add_gltf("skyscraper1", 3, 1.0, 3, -150, 0, 60);
add_gltf("skyscraper1", 3, 1.2, 3, -150, 0, 30);
add_gltf("skyscraper1", 3, 0.8, 3, -150, 0, 0);
add_gltf("skyscraper1", 3, 0.9, 3, -150, 0, -30);
add_gltf("skyscraper1", 3, 1.1, 3, -150, 0, -60);
add_gltf("skyscraper1", 3, 1.1, 3, -150, 0, -90);
add_gltf("skyscraper1", 3, 1.0, 3, -150, 0, -120);
add_gltf("skyscraper1", 3, 1.1, 3, -150, 0, -150);


add_gltf("skyscraper1", 3, 0.8, 3, 0, 0, -170);
add_gltf("skyscraper1", 3, 1.2, 3, 30, 0, -170);
add_gltf("skyscraper1", 3, 1, 3, 60, 0, -170);
add_gltf("skyscraper1", 3, 1.1, 3, 90, 0, -170);
add_gltf("skyscraper1", 3, 0.9, 3, 120, 0, -170);
add_gltf("skyscraper1", 3, 1, 3, 150, 0, -170);
add_gltf("skyscraper1", 3, 1, 3, -30, 0, -170);
add_gltf("skyscraper1", 3, 1.1, 3, -60, 0, -170);
add_gltf("skyscraper1", 3, 0.8, 3, -90, 0, -170);
add_gltf("skyscraper1", 3, 1.5, 3, -120, 0, -170);
add_gltf("skyscraper1", 3, 1.3, 3, -150, 0, -170);


add_gltf("skyscraper1", 3, 1.3, 3, 150, 0, 150);
add_gltf("skyscraper1", 3, 1.2, 3, 150, 0, 120);
add_gltf("skyscraper1", 3, 1.1, 3, 150, 0, 90);
add_gltf("skyscraper1", 3, 1.0, 3, 150, 0, 60);
add_gltf("skyscraper1", 3, 1.2, 3, 150, 0, 30);
add_gltf("skyscraper1", 3, 0.8, 3, 150, 0, 0);
add_gltf("skyscraper1", 3, 0.9, 3, 150, 0, -30);
add_gltf("skyscraper1", 3, 1.1, 3, 150, 0, -60);
add_gltf("skyscraper1", 3, 1.1, 3, 150, 0, -90);
add_gltf("skyscraper1", 3, 1.0, 3, 150, 0, -120);
add_gltf("skyscraper1", 3, 1.1, 3, 150, 0, -150);







// Animation loop
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update(); // FPS counter
};

function render() {
    park.stepRenderHeatmap();
    renderer.clear();
    renderer.render( scene, camera );
    sun.setPosition(sun_position.value * THREE.MathUtils.DEG2RAD);
    updateCars();
}

animate();
