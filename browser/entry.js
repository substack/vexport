var three = require('./three');

function createScene (render) {
    var scene = new three.Scene();
    
    var radius = 50, segments = 16, rings = 16;
    
    var sphere = new three.Mesh(
        new three.SphereGeometry(radius, segments, rings),
        new three.MeshLambertMaterial({
            color: 0xCC0000
        })
    );
    scene.add(sphere);
    
    var pointLight = new three.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight);
    
    var t = 0;
    var t0 = Date.now();
    function display () {
        var t1 = Date.now();
        var dt = t1 - t0;
        t0 = t1;
        t += dt;
        
        render(t);
    }
    
    process.nextTick(function animate () {
        window.requestAnimationFrame(animate);
        display();
    });
    
    return scene;
}

$(function () {
    var renderers = [
        new three.SVGRenderer(),
        new three.SVGRenderer()
    ];
    renderers[0].setSize(400, 300);
    renderers[1].setSize(400, 300);
    
    var cameras = [
        new three.PerspectiveCamera(45, 400 / 300, 0.1, 10000),
        new three.PerspectiveCamera(45, 400 / 300, 0.1, 10000)
    ];
    cameras[0].position.z = 300;
    cameras[1].position.y = 300;
    
    var scene = createScene(function (t) {
        cameras[0].position.x = Math.cos(t * 0.001) * 200;
        cameras[0].position.z = Math.sin(t * 0.001) * 200;
        cameras[0].lookAt(scene.position);
        renderers[0].render(scene, cameras[0]);
        
        cameras[1].position.x = Math.cos(t * 0.01) * 200;
        cameras[1].position.z = Math.sin(t * 0.01) * 200;
        cameras[1].lookAt(scene.position);
        renderers[1].render(scene, cameras[1]);
    });
    scene.add(cameras[0]);
    scene.add(cameras[1]);
    
    $('#port0').append(renderers[0].domElement);
    $('#port1').append(renderers[1].domElement);
});
