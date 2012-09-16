var three = require('./three');
var createMesh = require('./mesh');

var addElements = require('./add_elements');
var serialize = require('./serialize');

var shoe = require('shoe');
var Model = require('scuttlebutt/model');

function createScene (render) {
    var scene = new three.Scene();
    var objects = [];
    
    var model = (function () {
        var stream = shoe('/shoe');
        var m = new Model;
        stream.pipe(m.createStream()).pipe(stream);
        return m;
    })();
    
window.model = model; 
    model.on('update', function (ix, obj) {
        var option = $('<option>').text(ix + ' (' + obj.type + ')').val(ix);
        option.appendTo('#selected');
        
        if (!objects[ix]) {
            objects[ix] = addElements(scene, [obj])[0];
        }
        
        if (obj.type === 'sphere') {
            objects[ix].position.x = obj.position[0];
            objects[ix].position.y = obj.position[1];
            objects[ix].position.z = obj.position[2];
        }
        else {
            obj.vertices.forEach(function (v, i) {
                objects[ix].geometry.vertices[i].position.x = v[0];
                objects[ix].geometry.vertices[i].position.y = v[1];
                objects[ix].geometry.vertices[i].position.z = v[2];
            });
        }
    });
    
    $(window).on('keydown', function (ev) {
        var delta = {
            38 : [ 0, +1 ],
            40 : [ 0, -1 ],
            37 : [ -1, 0 ],
            39 : [ +1, 0 ]
        }[ev.keyCode];
        if (!delta) return;
        var ix = $('#selected').val();
        
        objects[ix].position.x += delta[0] * 4;
        objects[ix].position.y += delta[1] * 4;
        
        model.set(String(ix), serialize(objects[ix]));
    });
    
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

        if (typeof render === 'function') render(t);
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
    var scene = createScene(function (t) {});

    var w = Math.floor($(window).width() - 4) / 2;
    var h = Math.floor($(window).height() - 4) / 2;
    var initTop = 40;

    var v0 = scene.createViewport({
        width : w, height : h
    }).appendTo('#port0');

    v0.camera.position.z = 300;
    v0.camera.lookAt(scene.position);
    $('#port0')
        .css({ left : 1, top : initTop })
        .width(w).height(h)
    ;

    var v1 = scene.createViewport({
        width : w, height : h
    }).appendTo('#port1');

    v1.camera.position.y = 300;
    v1.camera.lookAt(scene.position);
    $('#port1')
        .css({ left : w + 2, top : initTop })
        .width(w).height(h)
    ;

    var v2 = scene.createViewport({
        width : w, height : h
    }).appendTo('#port2');

    v2.camera.position.x = 300;
    v2.camera.lookAt(scene.position);
    $('#port2')
        .css({ left : 1, top : h + initTop + 1 })
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
        .css({ left : w + 2, top : h + initTop + 1 })
        .width(w).height(h)
    ;

    // Color pikcer
    $(".color").miniColors({
        letterCase: 'uppercase',
        open: function(hex, rgb) {
        },
        close: function(hex, rgb) {
        },
        change: function(hex, rgb) {
            scene.children[5].material.color = new three.Color('0x' + hex.substr(1));
        },
    });
});
