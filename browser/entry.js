var three = require('./three');
var createMesh = require('./mesh');

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
        scene.viewports.forEach(function (v) {
            v.render();
        });
    }
    
    process.nextTick(function animate () {
        window.requestAnimationFrame(animate);
        display();
    });
    
    scene.viewports = [];
    scene.createViewport = function (width, height) {
        return createViewport(scene, width, height);
    };
    
    return scene;
}

function createViewport (scene, opts) {
    if (!opts) opts = {};
    var width = opts.width || 400;
    var height = opts.height || 300;
    
    var renderer = new three.SVGRenderer();
    renderer.setSize(width, height);
    
    var camera = opts.fov
        ? new three.PerspectiveCamera(
            opts.fov,
            width / height,
            opts.near === undefined ? 0.1 : opts.near,
            opts.far === undefined ? 10000 : opts.far
        )
        : new three.OrthographicCamera(
            width / - 2, width / 2, height / 2, height / - 2,
            opts.near === undefined ? -2000 : opts.near,
            opts.far === undefined ? 1000 : opts.far
        )
    ;
    scene.add(camera);
    
    var viewport = {
        camera : camera,
        renderer : renderer,
        appendTo : function (target) {
            $(renderer.domElement).appendTo(target);
            return viewport;
        },
        render : function () {
            renderer.render(scene, camera);
        },
    };
    scene.viewports.push(viewport);
    
    return viewport;
}

$(function () {
    var scene = createScene(function (t) {
        scene.children[0].rotation.y = t * 0.001;
    });
    
    var w = Math.floor($(window).width() - 4) / 2;
    var h = Math.floor($(window).height() - 4) / 2;
    
    var v0 = scene.createViewport({
        width : w, height : h
    }).appendTo('#port0');
    
    v0.camera.position.z = 300;
    v0.camera.lookAt(scene.position);
    $('#port0')
        .css({ left : 1, top : 1 })
        .width(w).height(h)
    ;
    
    var v1 = scene.createViewport({
        width : w, height : h
    }).appendTo('#port1');
    
    v1.camera.position.y = 300;
    v1.camera.lookAt(scene.position);
    $('#port1')
        .css({ left : w + 2, top : 1 })
        .width(w).height(h)
    ;
    
    var v2 = scene.createViewport({
        width : w, height : h
    }).appendTo('#port2');
    
    v2.camera.position.x = 300;
    v2.camera.lookAt(scene.position);
    $('#port2')
        .css({ left : 1, top : h + 2 })
        .width(w).height(h)
    ;
    
    var v3 = scene.createViewport({
        width : w, height : h, fov : 45
    }).appendTo('#port3');
    
    v3.camera.position.x = 200;
    v3.camera.position.y = 150;
    v3.camera.position.z = 200;
    v3.camera.lookAt(scene.position);
    $('#port3')
        .css({ left : w + 2, top : h + 2 })
        .width(w).height(h)
    ;
});
