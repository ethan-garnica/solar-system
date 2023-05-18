// Ethan Garnica
// CST-325
// Final
// 5/12/2023
'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);


 // this will be created after loading from a file
var groundGeometry = null;
var ceilingGeometry = null;
var backGeometry = null;
var leftGeometry = null;
var rightGeometry = null;
var frontGeometry = null;
var sunGeometry = null;
var mercuryGeometry = null;
var venusGeometry = null;
var earthGeometry = null;
var moonGeometry = null;
var marsGeometry = null;
var jupiterGeometry = null;
var saturnGeometry = null;
var uranusGeometry = null;
var neptuneGeometry = null;

var projectionMatrix = new Matrix4();
var lightPosition = new Vector4(0, 0, 0, 0);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    sphereJSON: null,
    sunImage: null,
    mercuryImage: null,
    venusImage: null,
    earthImage: null,
    moonImage: null,
    marsImage: null,
    jupiterImage: null,
    saturnImage: null,
    uranusImage: null,
    neptuneImage: null,
    starsImage: null,
    milkyWayImage: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        loadImage('./data/sun.jpg'),
        loadImage('./data/mercury.jpg'),
        loadImage('./data/venus.jpg'),
        loadImage('./data/earth_daymap.jpg'),
        loadImage('./data/moon.jpg'),
        loadImage('./data/mars.jpg'),
        loadImage('./data/jupiter.jpg'),
        loadImage('./data/saturn.jpg'),
        loadImage('./data/uranus.jpg'),
        loadImage('./data/neptune.jpg'),
        loadImage('./data/stars.jpg'),
        loadImage('./data/milky_way.jpg')
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.sphereJSON = values[2];
        loadedAssets.sunImage = values[3],
        loadedAssets.mercuryImage= values[4],
        loadedAssets.venusImage= values[5],
        loadedAssets.earthImage= values[6],
        loadedAssets.moonImage= values[7],
        loadedAssets.marsImage= values[8],
        loadedAssets.jupiterImage= values[9],
        loadedAssets.saturnImage= values[10],
        loadedAssets.uranusImage= values[11],
        loadedAssets.neptuneImage= values[12],
        loadedAssets.starsImage= values[13],
        loadedAssets.milkyWayImage= values[14]
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    groundGeometry.create(loadedAssets.starsImage);
    ceilingGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    ceilingGeometry.create(loadedAssets.starsImage);
    backGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    backGeometry.create(loadedAssets.starsImage);
    leftGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    leftGeometry.create(loadedAssets.starsImage);
    rightGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    rightGeometry.create(loadedAssets.starsImage);
    frontGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    frontGeometry.create(loadedAssets.starsImage);

    var scale = new Matrix4().makeScale(300.0, 300.0, 300.0);
    var translation = new Matrix4().makeTranslation(0,0,-300)
    var altTranslation = new Matrix4().makeTranslation(0,0,-300)


    

    // compensate for the model being flipped on its side
    var gRotation = new Matrix4().makeRotationX(-90);
    var cRotation = new Matrix4().makeRotationX(90);
    var bRotation = new Matrix4().makeRotationY(-90);
    var lRotation = new Matrix4().makeRotationX(180);
    var rRotation = new Matrix4().makeRotationX(0);
    var fRotation = new Matrix4().makeRotationY(90);


    groundGeometry.worldMatrix.makeIdentity();
    groundGeometry.worldMatrix.multiply(gRotation).multiply(translation).multiply(scale);

    ceilingGeometry.worldMatrix.makeIdentity();
    ceilingGeometry.worldMatrix.multiply(cRotation).multiply(translation).multiply(scale);

    backGeometry.worldMatrix.makeIdentity();
    backGeometry.worldMatrix.multiply(bRotation).multiply(altTranslation).multiply(scale);

    leftGeometry.worldMatrix.makeIdentity();
    leftGeometry.worldMatrix.multiply(lRotation).multiply(translation).multiply(scale);

    rightGeometry.worldMatrix.makeIdentity();
    rightGeometry.worldMatrix.multiply(rRotation).multiply(translation).multiply(scale);

    frontGeometry.worldMatrix.makeIdentity();
    frontGeometry.worldMatrix.multiply(fRotation).multiply(altTranslation).multiply(scale);

    sunGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    sunGeometry.create(loadedAssets.sphereJSON, loadedAssets.sunImage);

    mercuryGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    mercuryGeometry.create(loadedAssets.sphereJSON, loadedAssets.mercuryImage);

    venusGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    venusGeometry.create(loadedAssets.sphereJSON, loadedAssets.venusImage);

    earthGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    earthGeometry.create(loadedAssets.sphereJSON, loadedAssets.earthImage);

    moonGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    moonGeometry.create(loadedAssets.sphereJSON, loadedAssets.moonImage);

    marsGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    marsGeometry.create(loadedAssets.sphereJSON, loadedAssets.marsImage);

    jupiterGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    jupiterGeometry.create(loadedAssets.sphereJSON, loadedAssets.jupiterImage);

    saturnGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    saturnGeometry.create(loadedAssets.sphereJSON, loadedAssets.saturnImage);

    uranusGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    uranusGeometry.create(loadedAssets.sphereJSON, loadedAssets.uranusImage);
    
    neptuneGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    neptuneGeometry.create(loadedAssets.sphereJSON, loadedAssets.neptuneImage);

    var sunRadius = .17;
    var mercuryRadius = 0.0105;
    var venusRadius = 0.0157;
    var earthRadius = 0.0161;
    var moonRadius = 0.0097;
    var marsRadius = 0.0119;
    var jupiterRadius = 0.1004;
    var saturnRadius = 0.0844;
    var uranusRadius = 0.0362;
    var neptuneRadius = 0.0354;

    var sunDistance = 0;
    var mercuryDistance = .17 ;
    var venusDistance = .24 ;
    var earthDistance = .33 ;
    var moonDistance = .35 ;
    var marsDistance = .44 ;
    var jupiterDistance = .55 ;
    var saturnDistance = .70 ;
    var uranusDistance = .85 ;
    var neptuneDistance = 1 ;
    

    // Scaled it down so that the diameter is 3
    var sunTranslation = new Matrix4().makeTranslation(0, 0, 0);
    var sunScale = new Matrix4().makeScale(sunRadius, sunRadius, sunRadius);
    var mercuryTranslation = new Matrix4().makeTranslation(-mercuryDistance*100,0,0);
    var mercuryScale = new Matrix4().makeScale(mercuryRadius, mercuryRadius, mercuryRadius);

    var venusTranslation = new Matrix4().makeTranslation( -venusDistance*100, 0,0);
    var venusScale = new Matrix4().makeScale(venusRadius, venusRadius, venusRadius);
    var earthTranslation = new Matrix4().makeTranslation( -earthDistance*100, 0,0);
    var earthScale = new Matrix4().makeScale(earthRadius, earthRadius, earthRadius);
    var moonTranslation = new Matrix4().makeTranslation( -moonDistance*100, 0,0);
    var moonScale = new Matrix4().makeScale(moonRadius, moonRadius, moonRadius);
    var marsTranslation = new Matrix4().makeTranslation( -marsDistance*100, 0,0);
    var marsScale = new Matrix4().makeScale(marsRadius, marsRadius, marsRadius);
    var jupiterTranslation = new Matrix4().makeTranslation( -jupiterDistance*100, 0,0);
    var jupiterScale = new Matrix4().makeScale(jupiterRadius, jupiterRadius, jupiterRadius);
    var saturnTranslation = new Matrix4().makeTranslation( -saturnDistance*100, 0,0);
    var saturnScale = new Matrix4().makeScale(saturnRadius, saturnRadius, saturnRadius);
    var uranusTranslation = new Matrix4().makeTranslation( -uranusDistance*100, 0,0);
    var uranusScale = new Matrix4().makeScale(uranusRadius, uranusRadius, uranusRadius);
    var neptuneTranslation = new Matrix4().makeTranslation( -neptuneDistance*100, 0,0);
    var neptuneScale = new Matrix4().makeScale(neptuneRadius, neptuneRadius, neptuneRadius);

    sunGeometry.worldMatrix.makeIdentity();
    sunGeometry.worldMatrix.multiply(sunTranslation).multiply(sunScale);
    console.log(sunGeometry.worldMatrix)

    mercuryGeometry.worldMatrix.makeIdentity();
    mercuryGeometry.worldMatrix.multiply(mercuryTranslation).multiply(mercuryScale);
    mercuryGeometry.orbitRadius = mercuryDistance;
    mercuryGeometry.rotationSpeed = 0.01;
    console.log(mercuryGeometry.worldMatrix)

    venusGeometry.worldMatrix.makeIdentity();
    venusGeometry.worldMatrix.multiply(venusTranslation).multiply(venusScale);
    venusGeometry.orbitRadius = venusDistance;
    venusGeometry.rotationSpeed = 0.07;


    earthGeometry.worldMatrix.makeIdentity();
    earthGeometry.worldMatrix.multiply(earthTranslation).multiply(earthScale);
    earthGeometry.orbitRadius = earthDistance;
    earthGeometry.rotationSpeed = 0.12;


    moonGeometry.worldMatrix.makeIdentity();
    moonGeometry.worldMatrix.multiply(moonTranslation).multiply(moonScale);
    moonGeometry.orbitRadius = moonDistance;
    moonGeometry.rotationSpeed = 0.02;


    marsGeometry.worldMatrix.makeIdentity();
    marsGeometry.worldMatrix.multiply(marsTranslation).multiply(marsScale);
    marsGeometry.orbitRadius = marsDistance;
    marsGeometry.rotationSpeed = 0.17;


    jupiterGeometry.worldMatrix.makeIdentity();
    jupiterGeometry.worldMatrix.multiply(jupiterTranslation).multiply(jupiterScale);
    jupiterGeometry.orbitRadius = jupiterDistance;
    jupiterGeometry.rotationSpeed = 0.22;


    saturnGeometry.worldMatrix.makeIdentity();
    saturnGeometry.worldMatrix.multiply(saturnTranslation).multiply(saturnScale);
    saturnGeometry.orbitRadius = saturnDistance;
    saturnGeometry.rotationSpeed = 0.31;


    uranusGeometry.worldMatrix.makeIdentity();
    uranusGeometry.worldMatrix.multiply(uranusTranslation).multiply(uranusScale);
    uranusGeometry.orbitRadius = uranusDistance;
    uranusGeometry.rotationSpeed = 0.44;


    neptuneGeometry.worldMatrix.makeIdentity();
    neptuneGeometry.worldMatrix.multiply(neptuneTranslation).multiply(neptuneScale);
    neptuneGeometry.orbitRadius = neptuneDistance;
    neptuneGeometry.rotationSpeed = 0.90;

}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);
    var mercuryDistance = .17 ;
    var venusDistance = .24 ;
    var earthDistance = .33 ;
    var moonDistance = .35 ;
    var marsDistance = .44 ;
    var jupiterDistance = .55 ;
    var saturnDistance = .70 ;
    var uranusDistance = .85 ;
    var neptuneDistance = 1 ;

    var sunRadius = .17;
    var mercuryRadius = 0.0105;
    var venusRadius = 0.0157;
    var earthRadius = 0.0161;
    var moonRadius = 0.0097;
    var marsRadius = 0.0119;
    var jupiterRadius = 0.1004;
    var saturnRadius = 0.0844;
    var uranusRadius = 0.0362;
    var neptuneRadius = 0.0354;

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;
    var yaw = 0, pitch = 0;
    
    

    var yawMatrix = new Matrix4().makeRotationY(45.0 * time.deltaTime * yaw);
    var pitchMatrix = new Matrix4().makeRotationX(45.0 * time.deltaTime * pitch);
    var rotationMatrix = pitchMatrix.clone().multiply(yawMatrix);

    lightPosition = rotationMatrix.multiplyVector(lightPosition);
    
    time.update();
    camera.update(time.deltaTime);
    var m1radians = (time.secondsElapsedSinceStart*73) * Math.PI /180;
    var vradians = (time.secondsElapsedSinceStart*63.5) * Math.PI /180;
    var eradians = (time.secondsElapsedSinceStart*53) * Math.PI /180;
    var m2radians = (time.secondsElapsedSinceStart*46.5) * Math.PI /180;
    var jradians = (time.secondsElapsedSinceStart*40) * Math.PI /180;
    var sradians = (time.secondsElapsedSinceStart*33.5) * Math.PI /180;
    var uradians = (time.secondsElapsedSinceStart*19) * Math.PI /180;
    var nradians = (time.secondsElapsedSinceStart*9.5) * Math.PI /180;

    var m1cosTime = Math.cos(m1radians);
    var m1sinTime = Math.sin(m1radians);
    var vcosTime = Math.cos(vradians);
    var vsinTime = Math.sin(vradians);
    var ecosTime = Math.cos(eradians);
    var esinTime = Math.sin(eradians);
    var m2cosTime = Math.cos(m2radians);
    var m2sinTime = Math.sin(m2radians);
    var jcosTime = Math.cos(jradians);
    var jsinTime = Math.sin(jradians);
    var scosTime = Math.cos(sradians);
    var ssinTime = Math.sin(sradians);
    var ucosTime = Math.cos(uradians);
    var usinTime = Math.sin(uradians);
    var ncosTime = Math.cos(nradians);
    var nsinTime = Math.sin(nradians);

    var m1delta = 25*time.secondsElapsedSinceStart;
    var vdelta = 12.5*time.secondsElapsedSinceStart;
    var edelta = 50*time.secondsElapsedSinceStart;
    var m2delta = 37.5*time.secondsElapsedSinceStart;
    var jdelta = 100*time.secondsElapsedSinceStart;
    var sdelta = 87.5*time.secondsElapsedSinceStart;
    var udelta = 62.5*time.secondsElapsedSinceStart;
    var ndelta = 75*time.secondsElapsedSinceStart;

    var moonRadians = (time.secondsElapsedSinceStart*75) * Math.PI / 180;
    var moonCosTime = Math.cos(moonRadians);
    var moonSinTime = Math.sin(moonRadians);
    var moonDelta = 50 * time.secondsElapsedSinceStart;
    
    var sunRotation = new Matrix4().makeRotationY(10*time.deltaTime);
    sunGeometry.worldMatrix.multiply(sunRotation);
    
    
    
    mercuryGeometry.worldMatrix.makeIdentity();
    var mercuryTranslation = new Matrix4().makeTranslation(mercuryDistance*100*m1cosTime, 0,mercuryDistance*m1sinTime*100);
    var mercuryRotation = new Matrix4().makeRotationY(m1cosTime);
    var mercuryScale = new Matrix4().makeScale(mercuryRadius, mercuryRadius, mercuryRadius);
    mercuryGeometry.worldMatrix.multiply(mercuryTranslation).multiply(mercuryRotation).multiply(mercuryScale);
    var mercuryRotation2 = new Matrix4().makeRotationY(m1delta);
    mercuryGeometry.worldMatrix.multiply(mercuryRotation2);
    
    venusGeometry.worldMatrix.makeIdentity();
    var venusTranslation = new Matrix4().makeTranslation(venusDistance*100*vcosTime, 0,venusDistance*vsinTime*100);
    var venusRotation = new Matrix4().makeRotationY(vcosTime);
    var venusScale = new Matrix4().makeScale(venusRadius, venusRadius, venusRadius);
    venusGeometry.worldMatrix.multiply(venusTranslation).multiply(venusRotation).multiply(venusScale);
    var venusRotation2 = new Matrix4().makeRotationY(vdelta);
    venusGeometry.worldMatrix.multiply(venusRotation2);

    earthGeometry.worldMatrix.makeIdentity();
    var earthTranslation = new Matrix4().makeTranslation(earthDistance*100*ecosTime, 0,earthDistance*esinTime*100);
    var earthRotation = new Matrix4().makeRotationY(ecosTime);
    var earthScale = new Matrix4().makeScale(earthRadius, earthRadius, earthRadius);
    earthGeometry.worldMatrix.multiply(earthTranslation).multiply(earthRotation).multiply(earthScale);
    var earthRotation2 = new Matrix4().makeRotationY(edelta);
    earthGeometry.worldMatrix.multiply(earthRotation2);


    moonGeometry.worldMatrix.makeIdentity();
    var moonTranslation2 = new Matrix4().makeTranslation(((moonDistance-earthDistance))*100*(moonCosTime), 0,((moonDistance-earthDistance))*(moonSinTime)*100);
    var moonTranslation = new Matrix4().makeTranslation(moonDistance*100*ecosTime, 0,moonDistance*100*esinTime);
    // var earthTranslation = new Matrix4().makeTranslation( -earthDistance*100, 0,0);
    var moonRotation = new Matrix4().makeRotationY(moonDelta);
    var moonScale = new Matrix4().makeScale(moonRadius, moonRadius, moonRadius);
    // moonGeometry.worldMatrix.multiply(moonTranslation).multiply(moonTranslation2).multiply(moonRotation).multiply(moonScale);

   
    var moonRotation2 = new Matrix4().makeRotationY(moonDelta);
    // var moonRT2 = moonTranslation2.multiply(earthRotation);
    moonGeometry.worldMatrix.multiply(moonTranslation2).multiply(moonTranslation).multiply(moonScale).multiply(moonRotation);



    marsGeometry.worldMatrix.makeIdentity();
    var marsTranslation = new Matrix4().makeTranslation(marsDistance*100*m2cosTime, 0,marsDistance*m2sinTime*100);
    var marsRotation = new Matrix4().makeRotationY(m2cosTime);
    var marsScale = new Matrix4().makeScale(marsRadius, marsRadius, marsRadius);
    marsGeometry.worldMatrix.multiply(marsTranslation).multiply(marsRotation).multiply(marsScale);
    var marsRotation2 = new Matrix4().makeRotationY(m2delta);
    marsGeometry.worldMatrix.multiply(marsRotation2);

    jupiterGeometry.worldMatrix.makeIdentity();
    var jupiterTranslation = new Matrix4().makeTranslation(jupiterDistance*100*jcosTime, 0,jupiterDistance*jsinTime*100);
    var jupiterRotation = new Matrix4().makeRotationY(jcosTime);
    var jupiterScale = new Matrix4().makeScale(jupiterRadius, jupiterRadius, jupiterRadius);
    jupiterGeometry.worldMatrix.multiply(jupiterTranslation).multiply(jupiterRotation).multiply(jupiterScale);
    var jupiterRotation2 = new Matrix4().makeRotationY(jdelta);
    jupiterGeometry.worldMatrix.multiply(jupiterRotation2);

    saturnGeometry.worldMatrix.makeIdentity();
    var saturnTranslation = new Matrix4().makeTranslation(saturnDistance*100*scosTime, 0,saturnDistance*ssinTime*100);
    var saturnRotation = new Matrix4().makeRotationY(scosTime);
    var saturnScale = new Matrix4().makeScale(saturnRadius, saturnRadius, saturnRadius);
    saturnGeometry.worldMatrix.multiply(saturnTranslation).multiply(saturnRotation).multiply(saturnScale);
    var saturnRotation2 = new Matrix4().makeRotationY(sdelta);
    saturnGeometry.worldMatrix.multiply(saturnRotation2);

    uranusGeometry.worldMatrix.makeIdentity();
    var uranusTranslation = new Matrix4().makeTranslation(uranusDistance*100*ucosTime, 0,uranusDistance*usinTime*100);
    var uranusRotation = new Matrix4().makeRotationY(ucosTime);
    var uranusScale = new Matrix4().makeScale(uranusRadius, uranusRadius, uranusRadius);
    uranusGeometry.worldMatrix.multiply(uranusTranslation).multiply(uranusRotation).multiply(uranusScale);
    var uranusRotation2 = new Matrix4().makeRotationY(udelta);
    uranusGeometry.worldMatrix.multiply(uranusRotation2);

    neptuneGeometry.worldMatrix.makeIdentity();
    var neptuneTranslation = new Matrix4().makeTranslation(neptuneDistance*100*ncosTime, 0,neptuneDistance*nsinTime*100);
    var neptuneRotation = new Matrix4().makeRotationY(ncosTime);
    var neptuneScale = new Matrix4().makeScale(neptuneRadius, neptuneRadius, neptuneRadius);
    neptuneGeometry.worldMatrix.multiply(neptuneTranslation).multiply(neptuneRotation).multiply(neptuneScale);
    var neptuneRotation2 = new Matrix4().makeRotationY(ndelta);
    neptuneGeometry.worldMatrix.multiply(neptuneRotation2);
   
    
    
   var earthPostion = new Vector3(
                                    earthGeometry.worldMatrix.elements[3],
                                    earthGeometry.worldMatrix.elements[7],
                                    earthGeometry.worldMatrix.elements[11]
                                );
   


    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongShaderProgram);
    var uniforms = phongShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    if (appInput.one) camera.lookAt(cameraPosition, new Vector3(0,0,0));
    if (appInput.two) camera.lookAt(new Vector3((earthPostion.x-5),earthPostion.y+3,(earthPostion.z-5)), earthPostion);
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);
    groundGeometry.render(camera, projectionMatrix, phongShaderProgram);
    ceilingGeometry.render(camera, projectionMatrix, phongShaderProgram);
    
    backGeometry.render(camera, projectionMatrix, phongShaderProgram);
    leftGeometry.render(camera, projectionMatrix, phongShaderProgram);
    rightGeometry.render(camera, projectionMatrix, phongShaderProgram);
    frontGeometry.render(camera, projectionMatrix, phongShaderProgram);

    sunGeometry.render(camera, projectionMatrix, phongShaderProgram);
    mercuryGeometry.render(camera, projectionMatrix, phongShaderProgram);
    venusGeometry.render(camera, projectionMatrix, phongShaderProgram);
    earthGeometry.render(camera, projectionMatrix, phongShaderProgram);
    moonGeometry.render(camera, projectionMatrix, phongShaderProgram);
    marsGeometry.render(camera, projectionMatrix, phongShaderProgram);
    jupiterGeometry.render(camera, projectionMatrix, phongShaderProgram);
    saturnGeometry.render(camera, projectionMatrix, phongShaderProgram);
    uranusGeometry.render(camera, projectionMatrix, phongShaderProgram);
    neptuneGeometry.render(camera, projectionMatrix, phongShaderProgram);
    
}



// EOF 00100001-10