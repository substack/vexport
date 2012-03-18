var three = require('./three');

$(function () {
    var width = 400, height = 300;
    var renderer = new three.SVGRenderer();
    
    renderer.setSize(width, height);
    $('#viewer').append(renderer.domElement);
    
    var camera = new three.PerspectiveCamera(45, width / height, 0.1, 10000);
    var scene = new three.Scene();
    camera.position.z = 300;
        
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
    
    (function () {
        (function animate () {
            window.requestAnimationFrame(animate);
            render();
        })();
        
        var t = 0;
        var t0 = Date.now();
        function render () {
            var t1 = Date.now();
            var dt = t1 - t0;
            t0 = t1;
            t += dt;
            
            camera.position.x = Math.cos(t * 0.001) * 200;
            camera.position.z = Math.sin(t * 0.001) * 200;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
    })();
});
