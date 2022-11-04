"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

//each square has an index in order to indicate to which object it belongs (sheep, grass, shede)
var ObjectIndex;  

//for the bump in the vertex shader
//var bumpT;


var vertices = [   //vertices of the cube (base figure of all the components of the sheep)

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

/////////////////  GRASS and SHEDE TEXTURES  ///////////////////
var texSize = 32;//128;
var texCoordsArray = [];
var texture_grass;
var texture_wood;
var texture_bump;
var texture_sheep;
var texture_sheep_face;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
]



function configureTexture( image1, image2, image3, image4, image5 ) {
    //grass texture
    texture_grass = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture_grass);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);

    //wood/fence texture
    texture_wood = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture_wood);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_wood"), 1);


    //Wool texture BUMP
    texture_bump = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture_bump);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_sheep"), 2);


    //texture image for the head, tail an upper legs of the sheep
    texture_sheep = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture_sheep);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image4);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_sheep_image"), 3);



    //texture image for the face
    texture_sheep_face = gl.createTexture();
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture_sheep_face);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image5);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap_sheep_face"), 4);

}


//grass texture loaded image
var image_grass = new Image();
image_grass.src = "grass2.jpg"

//wood texture loaded image
var image_wood = new Image();
image_wood.src = "wood.jpg"

var image_sheep = new Image();
image_sheep.src = "wool.jpg"

var image_sheep_face = new Image();
image_sheep_face.src = "wool_face_.jpg"


///////////////////////////////////////////////////


/////////////////////////////BUMPPPPPPP PROVA

var data = new Array()
    for (var i = 0; i<= texSize; i++)  data[i] = new Array();
    for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
        data[i][j] = 0.0;
    for (var i = 0; i<=texSize; i+=3) for (var j=0; j<=texSize; j+=3)
        data[i][j] = 1.0;


// Bump Map Normals

var normalst = new Array()
    for (var i=0; i<texSize; i++)  normalst[i] = new Array();
    for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++)
        normalst[i][j] = new Array();
    for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++) {
        normalst[i][j][0] = data[i][j]-data[i+1][j];
        normalst[i][j][1] = data[i][j]-data[i][j+1];
        normalst[i][j][2] = 1;
    }

// Scale to Texture Coordinates

    for (var i=0; i<texSize; i++) for (var j=0; j<texSize; j++) {
       var d = 0;
       for(k=0;k<3;k++) d+=normalst[i][j][k]*normalst[i][j][k];
       d = Math.sqrt(d);
       for(k=0;k<3;k++) normalst[i][j][k]= 0.5*normalst[i][j][k]/d + 0.5;
    }

// Normal Texture Array

var woolTexture = new Uint8Array(3*texSize*texSize);

    for ( var i = 0; i < texSize; i++ )
        for ( var j = 0; j < texSize; j++ )
           for(var k =0; k<3; k++)
                woolTexture[3*texSize*i+3*j+k] = 255*normalst[i][j][k];








///////// PER FAR FUNGERE LA BUMP MAP  -  PROVA ///////////////////

var nMatrix;

var lightPosition = vec4(-50.0, 50.0, 90.0, 1.0);//vec4(-11.0, 2.0, 14.0, 1.0);
var lightDiffuse = vec4(0.85, 0.85, 0.85, 1.0);//vec4(1.0, 1.0, 1.0, 1.0);

var materialDiffuse_sheep = vec4(1.0, 1.0, 1.0, 1.0); //erano tutti 1 //vec4(0.7, 0.7, 0.7, 1.0);

//var normal = vec4(0.0, 1.0, 0.0, 0.0);
var normal = vec3(0.0, 1.0, 0.0);
var tangent = vec3(1.0, 0.0, 0.0);

var normalsArray = [];
var tangentsArray = [];

// components necessary in order to have the light influence also the
// other objects of the scene.

var lightAmbient = vec4(0.8, 0.8, 0.8, 1.0); //vec4(0.8, 0.8, 0.8, 1.0); //
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.8, 0.8, 0.8, 1.0); //vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0); //vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(0.8, 0.8, 0.8, 1.0); //vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

var ambientColor, diffuseColor, specularColor;

///////////////////////////////////////////////////////////////////



//////////////////////////  ANIMATION  //////////////////////////////

var animationFlag = false;

/////////////////////////////////////////////////////////////////////



/////////////////////////  MOVING THE CAMERA  //////////////////////////

var left = -13.0;
var right = 14.0;
var bottom = -13.0;
var topp = 13.0;
var near = -23.0;
var far = 23.0;

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var phiCamera = 0.0;
var thetaCamera = 0.0;
var radius = 5.0;  //radius ok from 0.0 to 10.0

var dr = 5.0 * Math.PI/180.0;
////////////////////////////////////////////////////////////////////////




var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 16;  //#####
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId = 10;  //tail of the sheep   //
var grassId = 11;  //surface with grass   #####
var fenceLateral1Id = 12;  // vertical component of the fence (the one that comes out of the canvas)
var fenceLateral2Id = 13;  // vertical component of the fence (the one further from the camera)
var fenceHorizontal1Id = 14; //lower horizontal component of the fence
var fenceHorizontal2Id = 15; //upper horizontal component of the fence

var torsoHeight = 3.0;
var torsoWidth = 4.3;
var upperArmHeight = 1.0;
var lowerArmHeight = 0.7;
var upperArmWidth  = 0.7; //0.7
var lowerArmWidth  = 0.4;
var upperLegWidth  = 0.7; //0.7
var lowerLegWidth  = 0.4;
var lowerLegHeight = 0.7;
var upperLegHeight = 1.0;
var headHeight = 1.3;
var headWidth = 2.0;
var tailHeight = 0.4;  // 
var tailWidth = 2.0;  // 
var grassHeight = 12.0;  //1.0; //#####
var grassWidth = 28; // #####
var fenceLateral1Height = 5.0;
var fenceLateral1Width = 0.9;
//var fenceLateral2Height = 5.0;
//var fenceLateral2Width = 0.9;
var fenceHorizontal1Height = 0.9;
var fenceHorizontal1Width = 11.1;



var numNodes = 16;  //10; #####
var numAngles = 17;  //11; #####
var angle = 0;

var theta = [0, 0, 180, 0, 180, 0, 180, 0, 180, 0, -70, 180, 0, 0, 0, 0, 0]; // ### -70 referred to the tail

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function updateNodes(Id, inc_x, inc_y){
    var m = mat4();

    switch(Id){
    
    case torsoId:
    m = translate(-9.0+inc_x, 0.0+inc_y, 0.0);
    m = mult(m, rotate(theta[torsoId], vec3(0, 0, 1)));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    }
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:


    m = translate(-9.0, 0.0, 0.0);
    m = mult(m, rotate(theta[torsoId], vec3(0, 1, 0)));
    //m = rotate(theta[torsoId], vec3(0, 1, 0) );
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


    m = translate(torsoWidth/2+headWidth/4, torsoHeight+0.5*headHeight, 0.0);
	  m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)))
	  m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;


    case leftUpperArmId:

    m = translate(-(torsoWidth/2-0.5), 0.0*torsoHeight, torsoWidth/2-0.5);

    //if(animationFlag==false){
        
	  m = mult(m, rotate(theta[leftUpperArmId], vec3(0, 0, 1)));  
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(torsoWidth/2-0.5, 0.0*torsoHeight, torsoWidth/2-0.5);
	  m = mult(m, rotate(theta[rightUpperArmId], vec3(0, 0, 1)));   
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(torsoWidth/2-0.5), 0.0*upperLegHeight, -(torsoWidth/2-0.5));
	  m = mult(m , rotate(theta[leftUpperLegId], vec3(0, 0, 1)));  
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(torsoWidth/2-0.5, 0.0*upperLegHeight, -(torsoWidth/2-0.5));
	  m = mult(m, rotate(theta[rightUpperLegId], vec3(0, 0, 1))); 
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );//null, rightLowerLegId );
    break;     


    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], vec3(0, 0, 1)));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], vec3(0, 0, 1)));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId],vec3(0, 0, 1)));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], vec3(0, 0, 1)));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;


    // tail is a sibling of the upper parts of the legs and has no child
    case tailId:

    m = translate(-(torsoWidth/2+tailWidth/2)+0.7, torsoHeight-0.9, 0.0); //-0.9 needed because of the rotation of the tail to incline it
      m = mult(m , rotate(theta[tailId], vec3(0, 0, 1)));   //rotation around the z axis in order to have the tail inclined
    figure[tailId] = createNode( m, tail, null, null );
    break;


    case grassId:

      //+0.1 percchè così la pecora non vola quando le muovo le zampe
    m = translate(0.0, -torsoHeight/2-lowerArmHeight/3+0.1, 0.0);
      m = mult(m , rotate(theta[grassId], vec3(1, 0, 0)));   
    figure[grassId] = createNode( m, grass, null, null );  //QUA
    break;


    case fenceLateral1Id:
    m = translate(3.5, -torsoHeight/2-lowerArmHeight/3, 6.0); 
      m = mult(m , rotate(theta[fenceLateral1Id], vec3(1, 0, 0)));  
    figure[fenceLateral1Id] = createNode( m, fenceLateral1, null, fenceLateral2Id );  //NULL
    break;

    case fenceLateral2Id:
    m = translate(0, 0, -12.0);  // since fenceLateral2 is child of fencelateral1 
    // & since I want the x and y components of fence2 to be equale to those of fence1, 
    // I simply have to translate along the z axis wrt the 'fenceLateral2Id'
      m = mult(m , rotate(theta[fenceLateral2Id], vec3(1, 0, 0)));  
    figure[fenceLateral2Id] = createNode( m, fenceLateral2, fenceHorizontal1Id, null );
    break;

    case fenceHorizontal1Id:
    m = translate(0, fenceLateral1Height/5, -fenceHorizontal1Width/2-fenceLateral1Width/2);  
      m = mult(m , rotate(theta[fenceHorizontal1Id], vec3(1, 0, 0)));  
    figure[fenceHorizontal1Id] = createNode( m, fenceHorizontal1, fenceHorizontal2Id, null );
    break;

    case fenceHorizontal2Id:
    m = translate(0, 3*fenceLateral1Height/5, -fenceHorizontal1Width/2-fenceLateral1Width/2); 
      m = mult(m , rotate(theta[fenceHorizontal2Id], vec3(1, 0, 0)));  
    figure[fenceHorizontal2Id] = createNode( m, fenceHorizontal2, null, null );
    break;


    }

}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.2);
    
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    //in order to have a different texture on the frontal face of the sheep
    gl.uniform1f(ObjectIndex, 0.0);  //wool texture image
    gl.drawArrays(gl.TRIANGLE_FAN, 4*0, 4);
    gl.uniform1f(ObjectIndex, 0.3);  //frontal face has a different texture
    gl.drawArrays(gl.TRIANGLE_FAN, 4*1, 4);
    gl.uniform1f(ObjectIndex, 0.0); //wool texture image
    for(var i =2; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.1);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.1);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.1);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.1);
   
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


//fne for the tail
function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailHeight) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 0.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//fne for the grass
function grass() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * grassHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(grassWidth, grassHeight, grassWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 1.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function fenceLateral1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * fenceLateral1Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(fenceLateral1Width, fenceLateral1Height, fenceLateral1Width) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 2.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}


function fenceLateral2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * fenceLateral1Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(fenceLateral1Width, fenceLateral1Height, fenceLateral1Width) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 2.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}

function fenceHorizontal1(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * fenceHorizontal1Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(fenceHorizontal1Height, fenceHorizontal1Height, fenceHorizontal1Width) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 2.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}


function fenceHorizontal2(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * fenceHorizontal1Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(fenceHorizontal1Height, fenceHorizontal1Height, fenceHorizontal1Width) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    gl.uniform1f(ObjectIndex, 2.0);

    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

}




function quad(a, b, c, d) {

    // computation of normals and tangents needed for the bump map.
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);
    normal = normalize(normal);

    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal);
    tangentsArray.push(t1);

    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal);
    tangentsArray.push(t1);

    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);
    tangentsArray.push(t1);

    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
    normalsArray.push(normal);
    tangentsArray.push(t1);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad(6, 7, 3, 2);  //quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad(1, 0, 4, 5); //quad( 5, 4, 0, 1 );
}




window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 0.87, 1.0, 1.0, 1.0 );   //light blue fot the sky
    //gl.clearColor( 0.74, 0.85, 1.0, 1.0 );   //light blue fot the sky

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);


    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    instanceMatrix = mat4();


    projectionMatrix = ortho(left, right, bottom, topp, near, far);
    modelViewMatrix = mat4(); //lookAt(eye, at, up);


    nMatrix = normalMatrix(modelViewMatrix, true);  // #########


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    //index needed in order to distinguish the objects (sheep, grass, shede) and assign to it the correct texture
    ObjectIndex = gl.getUniformLocation(program, "uObjectIndex");


    cube();

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );


    ///////   normals buffer  //////////   
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation( program, "aNormal" );
    gl.vertexAttribPointer( normalLoc, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( normalLoc );

    ///////   textures buffer  //////////   
    var tangBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tangBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tangentsArray), gl.STATIC_DRAW);

    var tangentLoc = gl.getAttribLocation( program, "aTangent" );
    gl.vertexAttribPointer( tangentLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( tangentLoc );



    ////////////////////////////// TEXTURE /////////////////////////////////////////
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    configureTexture(image_grass, image_wood, woolTexture, image_sheep, image_sheep_face); //image_sheep);

    ///////////////////////////////////////////////////////////////////////////////


    ////////////////////////// BUMP MAP - normale+uniform variables  ////////////////////////////

    var diffuseProduct_sheep = mult(lightDiffuse, materialDiffuse_sheep);

    gl.uniform4fv( gl.getUniformLocation(program, "uDiffuseProduct_sheep"), diffuseProduct_sheep);
    gl.uniform4fv( gl.getUniformLocation(program, "uLightPosition"), lightPosition);

    ////change with the right normals and tangents
    gl.uniform3fv( gl.getUniformLocation(program, "aNormal"), normal);
    gl.uniform3fv( gl.getUniformLocation(program, "aTangent"), tangent);


    gl.uniformMatrix3fv( gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));


    //to have the light influence also the other objects in the scene.
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), ambientProduct);
    gl.uniform4fv( gl.getUniformLocation(program, "uDiffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"), specularProduct);
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);


    ////////////////////////////////////////////////////////////////////////////


    //////////////////////// BUTTONS & SLIDERS ////////////////////////////

        document.getElementById("slider0").onchange = function(event) {
        theta[torsoId ] = event.target.value;
        initNodes(torsoId);
    };


   ////////////////////  BUTTONS TO HANDLE CAMERA ORIENTATION  ///////////////////
   document.getElementById("ThetaCameraIncrease").onclick = function() {
       thetaCamera += dr;
       //console.log(thetaCamera)
    };

    document.getElementById("ThetaCameraDecrease").onclick = function() {
        thetaCamera -= dr;
        //console.log(thetaCamera)
    };
 
     document.getElementById("PhiCameraIncrease").onclick = function() {
        phiCamera += dr;
        //console.log(thetaCamera)
    };
 
    document.getElementById("PhiCameraDecrease").onclick = function() {
        phiCamera -= dr;
        //console.log(thetaCamera)
    };
 
    document.getElementById("sliderRadius").onchange = function(event) {
        radius = event.target.value;
   };

    document.getElementById("depthSlider").onchange = function(event) {
        far = event.target.value/2;
        near = -event.target.value/2;
    };


    document.getElementById("Button9").onclick = function(){left  *= 0.9; right *= 0.9;};
    document.getElementById("Button10").onclick = function(){left *= 1.1; right *= 1.1;};
    document.getElementById("Button11").onclick = function(){topp  *= 0.9; bottom *= 0.9;};
    document.getElementById("Button12").onclick = function(){topp *= 1.1; bottom *= 1.1;};

    //////////////////////////////////////////////////////////////////////////////

    ///////////////////////  ANIMATION BUTTON  ////////////////////////////



    document.getElementById("ButtonStart").onclick = function(event) {
        animationFlag=true;
        setInterval(function(){
            animate();
        }, 120); //160);
    }

    document.getElementById("ButtonReset").onclick = function(event) {
        window.location.reload();
    }

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}


var inc_x = 1.0;
var inc_y = 0.0;
var ang = 3;
var switchLegsMoved = false;
var transitionLegs = false;

function animate(){
    if(animationFlag){

        if(inc_x<7){  //7

            if(!switchLegsMoved && !transitionLegs){

            // translation of the torso that makes translate all the other parts of the sheep's body
                updateNodes(torsoId, inc_x, inc_y);

                //legs that proceed forward
                theta[leftUpperArmId]=160;
                initNodes(leftUpperArmId);
                theta[rightUpperLegId]=160;
                initNodes(rightUpperLegId); //

                theta[rightUpperArmId]=-160;
                initNodes(rightUpperArmId);
                theta[leftUpperLegId]=-160;
                initNodes(leftUpperLegId);

                theta[leftLowerArmId]=20;
                initNodes(leftLowerArmId);
                theta[rightLowerLegId]=20;
                initNodes(rightLowerLegId);  

                inc_x += 1.0;
                switchLegsMoved = true;
                transitionLegs = true;
                console.log(inc_x);
            }
            else if(switchLegsMoved && !transitionLegs){

            // translation of the torso that makes translate all the other parts of the sheep's body
                updateNodes(torsoId, inc_x, inc_y);

                //legs that proceed forward
                theta[rightUpperArmId]=160;
                initNodes(rightUpperArmId);
                theta[leftUpperLegId]=160;
                initNodes(leftUpperLegId);

                theta[leftUpperArmId]=-160;
                initNodes(leftUpperArmId);
                theta[rightUpperLegId]=-160;
                initNodes(rightUpperLegId);  

                theta[rightLowerArmId]=20;
                initNodes(rightLowerArmId);
                theta[leftLowerLegId]=20;
                initNodes(leftLowerLegId); 

                inc_x += 1.0;
                switchLegsMoved = false;
                transitionLegs = true;
                console.log(inc_x);
            }
            else if(transitionLegs){
                updateNodes(torsoId, inc_x, inc_y);

                theta = [0, 0, 180, 0, 180, 0, 180, 0, 180, 0, -70, 180, 0, 0]; 

            //legs that proceed forward
                initNodes(rightUpperArmId);
                initNodes(leftUpperLegId);
                initNodes(leftUpperArmId);
                initNodes(rightUpperLegId);
                initNodes(rightLowerArmId);
                initNodes(leftLowerArmId);  
                initNodes(rightLowerLegId);
                initNodes(leftLowerLegId);

                inc_x += 1.0;
                transitionLegs = false;
                console.log(inc_x);
            }

        }
        else if(inc_x<7.5){ //7.5
            inc_x += 0.25;
            inc_y += 0.7;
            theta[torsoId] = -45;
            updateNodes(torsoId, inc_x, inc_y);

            //movement of the upper legs while jumping
            theta[leftUpperLegId] = 160;
            initNodes(leftUpperLegId);
            theta[rightUpperLegId] = 160;
            initNodes(rightUpperLegId);
            theta[leftUpperArmId] = 160;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] = 160;
            initNodes(rightUpperArmId);
            //movement of the lower legs while jumping
            theta[leftLowerLegId] = 70;
            initNodes(leftLowerLegId);
            theta[rightLowerLegId] = 70;
            initNodes(rightLowerLegId);
            theta[leftLowerArmId] = 70;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] = 70;
            initNodes(rightLowerArmId);



        }
        else if(inc_x<11.5){
            inc_x += 0.25;
            inc_y += 0.45;  //0.45
            theta[torsoId] += ang;
            updateNodes(torsoId, inc_x, inc_y);

            //movement of the upper legs while jumping
            theta[leftUpperLegId] = 140;
            initNodes(leftUpperLegId);
            theta[rightUpperLegId] = 140;
            initNodes(rightUpperLegId);
            theta[leftUpperArmId] = 140;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] = 140;
            initNodes(rightUpperArmId);
            //movement of the lower legs while jumping
            theta[leftLowerLegId] = 90;
            initNodes(leftLowerLegId);
            theta[rightLowerLegId] = 90;
            initNodes(rightLowerLegId);
            theta[leftLowerArmId] = 90;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] = 90;
            initNodes(rightLowerArmId);

        }

        else if(inc_x < 14.75){
            inc_x += 0.25;
            inc_y -= 0.3;
            theta[torsoId] += ang;
            updateNodes(torsoId, inc_x, inc_y);
        }

        else if(inc_x<18.5){
            inc_x +=0.25;
            inc_y -= 0.3;
            theta[torsoId] -= ang;
            updateNodes(torsoId, inc_x, inc_y);

            //movement of the upper legs while jumping
            theta[leftUpperLegId] = 160;
            initNodes(leftUpperLegId);
            theta[rightUpperLegId] = 160;
            initNodes(rightUpperLegId);
            theta[leftUpperArmId] = 160;
            initNodes(leftUpperArmId);
            theta[rightUpperArmId] = 160;
            initNodes(rightUpperArmId);
            //movement of the lower legs while jumping
            theta[leftLowerLegId] = 70;
            initNodes(leftLowerLegId);
            theta[rightLowerLegId] = 70;
            initNodes(rightLowerLegId);
            theta[leftLowerArmId] = 70;
            initNodes(leftLowerArmId);
            theta[rightLowerArmId] = 70;
            initNodes(rightLowerArmId);
        }
        else if(inc_x=18.5){
            theta = [0, 0, 180, 0, 180, 0, 180, 0, 180, 0, -70, 180, 0, 0]; 
            theta[torsoId] = 0;
            updateNodes(torsoId, inc_x, 0.0);
            //movement of the upper legs while jumping
            initNodes(leftUpperLegId);
            initNodes(rightUpperLegId);
            initNodes(leftUpperArmId);
            initNodes(rightUpperArmId);
            //movement of the lower legs while jumping
            initNodes(leftLowerLegId);
            initNodes(rightLowerLegId);
            initNodes(leftLowerArmId);
            initNodes(rightLowerArmId);
      } 
    }
}

var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        var eye = vec3(radius*Math.sin(thetaCamera)*Math.cos(phiCamera), radius*Math.sin(thetaCamera)*Math.sin(phiCamera), radius*Math.cos(thetaCamera));  
        modelViewMatrix = lookAt(eye, at, up);
        //
        projectionMatrix = ortho(left, right, bottom, topp, near, far);
///*
        nMatrix = normalMatrix(modelViewMatrix, true);  // #########
        gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
        //
        gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );
        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
        gl.uniformMatrix3fv( gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));

//*/
        traverse(torsoId);
        traverse(fenceLateral1Id);
        traverse(grassId);
        //console.log(animationFlag);
        requestAnimationFrame(render);
}
