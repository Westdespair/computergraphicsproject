// List of objects as parameters for the add_gltf() function
function getDefaultObjects() {
    let objects = [];
    objects.push(["landmark", 3, 3, 3, 0, 0, -120]);

    objects.push(["tree", 2,3,2, 30, 0, -60]);
    objects.push(["tree", 2,3.5,2, 30, 0, -70]);
    objects.push(["tree", 2,4,2, 30, 0, -80]);
    objects.push(["tree", 2,4,2, 30, 0, -90]);
    objects.push(["tree", 2,3.5,2, 30, 0, -100]);
    objects.push(["tree", 2,3,2, 30, 0, -110]);
    objects.push(["tree", 2,3,2, -30, 0, -60]);
    objects.push(["tree", 2,3.5,2, -30, 0, -70]);
    objects.push(["tree", 2,4,2, -30, 0, -80]);
    objects.push(["tree", 2,4,2, -30, 0, -90]);
    objects.push(["tree", 2,3.5,2, -30, 0, -100]);
    objects.push(["tree", 2,3,2, -30, 0, -110]);

    objects.push(["swingset", 3,3,3, 100,0,120])
    objects.push(["swingset", 3,3,3, 100,0,90])
    objects.push(["swingset", 3,3,3, 100,0,50])

    objects.push(["parkbench", 3,3,3, -10,0,-100])
    objects.push(["parkbench", 3,3,3, 10,0,-100])

    objects.push(["picnicbench", 3,3,3, 0,0,0])
    objects.push(["picnicbench", 3,3,3, 0,0,-30])



    objects.push(["bush", 3,3,3, 100,0,35])
    objects.push(["bush", 3,3,3, 100,0,30])
    objects.push(["bush", 3,3,3, 100,0,25])
    objects.push(["bush", 3,3,3, 100,0,20])
    objects.push(["bush", 3,3,3, 95,0,35])
    objects.push(["bush", 3,3,3, 95,0,30])
    objects.push(["bush", 3,3,3, 95,0,25])
    objects.push(["bush", 3,3,3, 95,0,20])


    objects.push(["bush", 3,3,3, -50,0,35])
    objects.push(["bush", 3,3,3, -80,0,30])
    objects.push(["bush", 3,3,3, -36,0,25])
    objects.push(["bush", 3,3,3, -67,0,20])
    objects.push(["bush", 3,3,3, -50,0,55])
    objects.push(["bush", 3,3,3, -80,0,-0])
    objects.push(["bush", 3,3,3, -36,0,-25])
    objects.push(["bush", 3,3,3, -67,0,-60])


    objects.push(["skyscraper1", 3, 0.8, 3, 0, 0, 170]);
    objects.push(["skyscraper1", 3, 1.2, 3, 30, 0, 170]);
    objects.push(["skyscraper1", 3, 1, 3, 60, 0, 170]);
    objects.push(["skyscraper1", 3, 1.1, 3, 90, 0, 170]);
    objects.push(["skyscraper1", 3, 0.9, 3, 120, 0, 170]);
    objects.push(["skyscraper1", 3, 1, 3, 150, 0, 170]);
    objects.push(["skyscraper1", 3, 1, 3, -30, 0, 170]);
    objects.push(["skyscraper1", 3, 1.1, 3, -60, 0, 170]);
    objects.push(["skyscraper1", 3, 0.8, 3, -90, 0, 170]);
    objects.push(["skyscraper1", 3, 1.5, 3, -120, 0, 170]);
    objects.push(["skyscraper1", 3, 1.3, 3, -150, 0, 170]);


    objects.push(["skyscraper1", 3, 1.3, 3, -150, 0, 150]);
    objects.push(["skyscraper1", 3, 1.2, 3, -150, 0, 120]);
    objects.push(["skyscraper1", 3, 1.1, 3, -150, 0, 90]);
    objects.push(["skyscraper1", 3, 1.0, 3, -150, 0, 60]);
    objects.push(["skyscraper1", 3, 1.2, 3, -150, 0, 30]);
    objects.push(["skyscraper1", 3, 0.8, 3, -150, 0, 0]);
    objects.push(["skyscraper1", 3, 0.9, 3, -150, 0, -30]);
    objects.push(["skyscraper1", 3, 1.1, 3, -150, 0, -60]);
    objects.push(["skyscraper1", 3, 1.1, 3, -150, 0, -90]);
    objects.push(["skyscraper1", 3, 1.0, 3, -150, 0, -120]);
    objects.push(["skyscraper1", 3, 1.1, 3, -150, 0, -150]);


    objects.push(["skyscraper1", 3, 0.8, 3, 0, 0, -170]);
    objects.push(["skyscraper1", 3, 1.2, 3, 30, 0, -170]);
    objects.push(["skyscraper1", 3, 1, 3, 60, 0, -170]);
    objects.push(["skyscraper1", 3, 1.1, 3, 90, 0, -170]);
    objects.push(["skyscraper1", 3, 0.9, 3, 120, 0, -170]);
    objects.push(["skyscraper1", 3, 1, 3, 150, 0, -170]);
    objects.push(["skyscraper1", 3, 1, 3, -30, 0, -170]);
    objects.push(["skyscraper1", 3, 1.1, 3, -60, 0, -170]);
    objects.push(["skyscraper1", 3, 0.8, 3, -90, 0, -170]);
    objects.push(["skyscraper1", 3, 1.5, 3, -120, 0, -170]);
    objects.push(["skyscraper1", 3, 1.3, 3, -150, 0, -170]);


    objects.push(["skyscraper1", 3, 1.3, 3, 150, 0, 150]);
    objects.push(["skyscraper1", 3, 1.2, 3, 150, 0, 120]);
    objects.push(["skyscraper1", 3, 1.1, 3, 150, 0, 90]);
    objects.push(["skyscraper1", 3, 1.0, 3, 150, 0, 60]);
    objects.push(["skyscraper1", 3, 1.2, 3, 150, 0, 30]);
    objects.push(["skyscraper1", 3, 0.8, 3, 150, 0, 0]);
    objects.push(["skyscraper1", 3, 0.9, 3, 150, 0, -30]);
    objects.push(["skyscraper1", 3, 1.1, 3, 150, 0, -60]);
    objects.push(["skyscraper1", 3, 1.1, 3, 150, 0, -90]);
    objects.push(["skyscraper1", 3, 1.0, 3, 150, 0, -120]);
    objects.push(["skyscraper1", 3, 1.1, 3, 150, 0, -150]);

    return objects;
}

export {getDefaultObjects}
