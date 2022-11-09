"use strict";

var shadedCube = function() {

var canvas;
var gl;

var numPositions = 180; //132;

var positionsArray = [];
var normalsArray = [];
var tangentsArray = [];


///  CONSTRUCTION OF THE SOLID FIGURE  ///

var vertices = [

	/// base of the solid ///
        vec4(-0.2, -0.6,  0.2, 1.0), //0
        vec4(-0.2,  0.6,  0.2, 1.0),
        vec4(0.2,  0.6,  0.2, 1.0),
        vec4(0.2, -0.6,  0.2, 1.0),
        vec4(-0.2, -0.6, -0.2, 1.0),
        vec4(-0.2,  0.6, -0.2, 1.0),
        vec4(0.2,  0.6, -0.2, 1.0),
        vec4(0.2, -0.6, -0.2, 1.0),  //7

	///double lateral pyramids///
        vec4(0.2,  0.0,  0.2, 1.0),  //8 
        vec4(0.2,  0.0,  -0.2, 1.0),  //9
	vec4(0.4, 0.3, 0.0, 1.0),  //10
	vec4(0.4, -0.3, 0.0, 1.0),  //11

        vec4(-0.2, 0.0, -0.2, 1.0),  //12
        vec4(-0.2, 0.0, 0.2, 1.0),
	vec4(-0.4, 0.3, 0.0, 1.0),
	vec4(-0.4, -0.3, 0.0, 1.0),  //15


	/// double lateral parallelepipeds ///
        vec4(-0.2, 0.6,  -0.5, 1.0),  //16
        vec4(0.2,  0.6,  -0.5, 1.0),
        vec4(-0.2, 0.2,  -0.5, 1.0),
        vec4(0.2,  0.2,  -0.5, 1.0),
        vec4(-0.2, 0.2,  -0.2, 1.0),
        vec4(0.2,  0.2,  -0.2, 1.0),  //21
        vec4(-0.2, -0.2,  -0.5, 1.0),
        vec4(0.2,  -0.2,  -0.5, 1.0),
        vec4(-0.2, -0.6,  -0.5, 1.0),
        vec4(0.2,  -0.6,  -0.5, 1.0),
        vec4(-0.2, -0.2,  -0.2, 1.0),
        vec4(0.2,  -0.2,  -0.2, 1.0)   //27

    ];

function quad(a, b, c, d) {
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);
     tangentsArray.push(t1);

     positionsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);
     tangentsArray.push(t1);

     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);
     tangentsArray.push(t1);

     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);
     tangentsArray.push(t1);

     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);
     tangentsArray.push(t1);

     positionsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
     tangentsArray.push(t1);
}

function colorSolid(){

  /// visible faces of the main parallelepiped of the solid ///
    quad(5, 1, 2, 6); //(6, 5, 1, 2);
    quad(0, 4, 7, 3); //(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(3, 2, 1, 0);

  /// double lateral pyramids ///
    quad(8, 10, 2, 2);
    quad(3, 11, 8, 8);
    quad(6, 10, 9, 9);
    quad(9, 11, 7, 7);
    quad(2, 10, 6, 6); 
    quad(8, 11, 9, 9);
    quad(9, 10, 8, 8); 
    quad(7, 11, 3, 3);

    quad(12, 14, 5, 5);
    quad(4, 15, 12, 12);
    quad(1, 14, 13, 13);
    quad(13, 15, 0, 0);
    quad(5, 14, 1, 1); 
    quad(12, 15, 13, 13);
    quad(13, 14, 12, 12); 
    quad(0, 15, 4, 4);

  /// double lateral parallelepipeds ///
    quad(16, 5, 6, 17);
    quad(19, 21, 20, 18);  
    quad(5, 16, 18, 20);
    quad(17, 6, 21, 19);
    quad(18, 16, 17, 19);
    quad(22, 26, 27, 23);
    quad(4, 24, 25, 7); 
    quad(26, 22, 24, 4);
    quad(23, 27, 7, 25);
    quad(24, 22, 23, 25);    
}



/////  TEXTURE  //////
var texSize = 32; //32;
var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var image1 = new Array()
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        var c = (((i & 0x8) == 0) ^ ((j & 0x8) == 0));
        image1[i][j] = [c, c, c, 1];
    }

var image2 = new Uint8Array(4*texSize*texSize);
    for (var i = 0; i < texSize; i++)
        for (var j = 0; j < texSize; j++)
           for(var k =0; k<4; k++)
                image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];


function configureTexture(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}



////  BUMP MAP  /////

// Bump Data

var data = new Array()
    for (var i = 0; i<= texSize; i++)  data[i] = new Array();
    for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
        data[i][j] = 0.0;
    for (var i = 0; i<=texSize; i+=3) for (var j=0; j<=texSize; j+=3)
        data[i][j] = 1.0;



/*
//// OTHER POSSIBILITY OF TEXTURE ////
var data = new Array()
    for (var i = 0; i<= texSize; i++)  data[i] = new Array();
    for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
        data[i][j] = 0.0;
    for (var i = 0; i<texSize; i++) 
	for (var j = 0; j<texSize; j++)
            if(i%8==0) data[i][j] = 1.0;
	    //if(i%4==0 && j%4==0) data[i][j] = 1.0;

    //for (var i=0; i=1)
*/

/*
var data = new Array()
    for (var i = 0; i<= texSize; i++)  data[i] = new Array();
    for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
        data[i][j] = 0.0;
    for (var i = texSize/4; i<3*texSize/4; i++) for (var j = texSize/4; j<3*texSize/4; j++)
        data[i][j] = 1.0;
*/

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

var normals = new Uint8Array(3*texSize*texSize);

    for ( var i = 0; i < texSize; i++ )
        for ( var j = 0; j < texSize; j++ )
           for(var k =0; k<3; k++)
                normals[3*texSize*i+3*j+k] = 255*normalst[i][j][k];



function configureTextureBump(image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
}

var bumpFlag = false;
var bumpFlagLoc = false;








///  LIGHT  ///
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);



///  MATERIAL MAIN SOLID: SILVER  ///
var materialAmbient = vec4(0.19225, 0.19225, 0.19225, 1.0);  
var materialDiffuse = vec4(0.50754, 0.50754, 0.50754, 1.0);  
var materialSpecular = vec4(0.508273, 0.508273, 0.508273, 1.0); 
var materialShininess = 0.4*128;   


///  SHADING  ///
var ctm;
var ambientColor, diffuseColor, specularColor;


var nMatrixLoc, nMatrix;

var shadingFlag = false;

//  PERSPECTIVE  ///
var near = -4.0; 
var far = 4.0; 
var radius = 7.0;  //the distance, along the z axis, between the viewer and the origin
var theta1 = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;
var viewerPos;  //eye
const at = vec3(0.0, 0.0, 0.0); //the viewer is always looking in the direction of the origin
const up = vec3(0.0, 1.0, 0.0); //I always keep my camera perpendicular to the y axis
var fovy = 20.0; 
var aspect;

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;


// the figure is symmetric along the x and y axis. So the barycenter is only translated along the z axis
var barycenter_solid = vec3(0.0, 0.0, -0.1167);
var traslation_matrix = mat4(vec4(1.0, 0.0, 0.0, barycenter_solid[0]), 
			 vec4(0.0, 1.0, 0.0, barycenter_solid[1]), 
			 vec4(0.0, 0.0, 1.0, barycenter_solid[2]), 
			 vec4(0.0, 0.0, 0.0, 1.0));

var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta = vec3(0, 0, 0);
var thetaLoc;

var flag = false;
var direction = false;






///  CYLINDER ///
function cylinder(numSlices, numStacks, caps) {

var slices = 36;
if(numSlices) slices = numSlices;
var stacks = 1;
if(numStacks) stacks = numStacks;
var capsFlag = true;
if(caps==false) capsFlag = caps;

var data = {};

var top = 0.5;
var bottom = -0.5;
var radius = 0.5;
var topCenter = [0.0, top, 0.0];
var bottomCenter = [0.0, bottom, 0.0];


var sideColor = [1.0, 0.0, 0.0, 1.0];
var topColor = [0.0, 1.0, 0.0, 1.0];
var bottomColor = [0.0, 0.0, 1.0, 1.0];


var cylinderVertexCoordinates = [];
var cylinderNormals = [];
var cylinderVertexColors = [];
var cylinderTextureCoordinates = [];

// side

for(var j=0; j<stacks; j++) {
  var stop = bottom + (j+1)*(top-bottom)/stacks;
  var sbottom = bottom + j*(top-bottom)/stacks;
  var topPoints = [];
  var bottomPoints = [];
  var topST = [];
  var bottomST = [];
  for(var i =0; i<slices; i++) {
    var theta = 2.0*i*Math.PI/slices;
    topPoints.push([radius*Math.sin(theta), stop, radius*Math.cos(theta), 1.0]);
    bottomPoints.push([radius*Math.sin(theta), sbottom, radius*Math.cos(theta), 1.0]);
  };

  topPoints.push([0.0, stop, radius, 1.0]);
  bottomPoints.push([0.0,  sbottom, radius, 1.0]);


  for(var i=0; i<slices; i++) {
    var a = topPoints[i];
    var d = topPoints[i+1];
    var b = bottomPoints[i];
    var c = bottomPoints[i+1];
    var u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
    var v = [c[0]-b[0], c[1]-b[1], c[2]-b[2]];

    var normal = [
      u[1]*v[2] - u[2]*v[1],
      u[2]*v[0] - u[0]*v[2],
      u[0]*v[1] - u[1]*v[0]
    ];

    var mag = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2])
    normal = [normal[0]/mag, normal[1]/mag, normal[2]/mag];
    cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([i/slices, (j-1)*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, (j-1)*(top-bottom)/stacks]);

    cylinderVertexCoordinates.push([d[0], d[1], d[2], 1.0]);
    cylinderVertexColors.push(sideColor);
    cylinderNormals.push([normal[0], normal[1], normal[2]]);
    cylinderTextureCoordinates.push([(i+1)/slices, j*(top-bottom)/stacks]);
  };
};

  var topPoints = [];
  var bottomPoints = [];
  for(var i =0; i<slices; i++) {
    var theta = 2.0*i*Math.PI/slices;
    topPoints.push([radius*Math.sin(theta), top, radius*Math.cos(theta), 1.0]);
    bottomPoints.push([radius*Math.sin(theta), bottom, radius*Math.cos(theta), 1.0]);
  };
  topPoints.push([0.0, top, radius, 1.0]);
  bottomPoints.push([0.0,  bottom, radius, 1.0]);

if(capsFlag) {

//top

for(i=0; i<slices; i++) {
  normal = [0.0, 1.0, 0.0];
  var a = [0.0, top, 0.0, 1.0];
  var b = topPoints[i];
  var c = topPoints[i+1];
  cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
  cylinderVertexColors.push(topColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
  cylinderVertexColors.push(topColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
  cylinderVertexColors.push(topColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);
};

//bottom

for(i=0; i<slices; i++) {
  normal = [0.0, -1.0, 0.0];
  var a = [0.0, bottom, 0.0, 1.0];
  var b = bottomPoints[i];
  var c = bottomPoints[i+1];
  cylinderVertexCoordinates.push([a[0], a[1], a[2], 1.0]);
  cylinderVertexColors.push(bottomColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([b[0], b[1], b[2], 1.0]);
  cylinderVertexColors.push(bottomColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);

  cylinderVertexCoordinates.push([c[0], c[1], c[2], 1.0]);
  cylinderVertexColors.push(bottomColor);
  cylinderNormals.push(normal);
  cylinderTextureCoordinates.push([0, 1]);
};

};


function translate(x, y, z){
   for(var i=0; i<cylinderVertexCoordinates.length; i++) {
     cylinderVertexCoordinates[i][0] += x;
     cylinderVertexCoordinates[i][1] += y;
     cylinderVertexCoordinates[i][2] += z;
   };
}

function scale(sx, sy, sz){
    for(var i=0; i<cylinderVertexCoordinates.length; i++) {
        cylinderVertexCoordinates[i][0] *= sx;
        cylinderVertexCoordinates[i][1] *= sy;
        cylinderVertexCoordinates[i][2] *= sz;
        cylinderNormals[i][0] /= sx;
        cylinderNormals[i][1] /= sy;
        cylinderNormals[i][2] /= sz;
    };
}

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

function rotate( angle, axis) {

    var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

    var x = axis[0]/d;
    var y = axis[1]/d;
    var z = axis[2]/d;

    var c = Math.cos( radians(angle) );
    var omc = 1.0 - c;
    var s = Math.sin( radians(angle) );

    var mat = [
        [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
        [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
        [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
    ];

    for(var i=0; i<cylinderVertexCoordinates.length; i++) {
          var u = [0, 0, 0];
          var v = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++) {
              u[j] += mat[j][k]*cylinderVertexCoordinates[i][k];
              v[j] += mat[j][k]*cylinderNormals[i][k];
            };
           for( var j =0; j<3; j++) {
             cylinderVertexCoordinates[i][j] = u[j];
             cylinderNormals[i][j] = v[j];
           };
    };
}

data.TriangleVertices = cylinderVertexCoordinates;
data.TriangleNormals = cylinderNormals;
data.TriangleVertexColors = cylinderVertexColors;
data.TextureCoordinates = cylinderTextureCoordinates;
data.rotate = rotate;
data.translate = translate;
data.scale = scale;
return data;

}


var program2;

var numPositionsCylinder;
var colorsArray = [];

var modelViewMatrixLoc2, projectionMatrixLoc2;
var modelViewMatrix2, projectionMatrix2;

var nMatrixLoc2, nMatrix2;


///  LIGHT RED  ///
/// 3 lights from the bottom. It is recognizable when it rotates how the top of the figure remains grey, not red.
var lightPositionRed = vec4(0.0, -1.0, 1.0, 0.0); //(-0.2, 0.2, -0.5, 0.0);
var lightAmbientRed = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuseRed = vec4(1.0, 1.0, 1.0, 1.0); ////vec4(1.0, 0.0, 0.0, 1.0); //
var lightSpecularRed = vec4(1.0, 1.0, 1.0, 1.0);

var lightPositionRed2 = vec4(-0.5, -1.0, 1.0, 0.0);
var lightPositionRed3 = vec4(0.5, -1.0, 1.0, 0.0);


///  MATERIAL CYLINDER :  ///
var materialAmbientCylinder = vec4(0.0, 0.0, 0.0, 1.0);  //vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuseCylinder = vec4(1.0, 1.0, 1.0, 1.0); //(0.50754, 0.50754, 0.50754, 1.0);  //vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecularCylinder = vec4(0.0, 0.0, 0.0, 1.0);//(0.633, 0.727811, 0.633, 1.0); //vec4(1.0, 0.8, 0.0, 1.0);
var materialShininessCylinder = 25.0; // 40.0;  //100.0;  
var emissiveCyl = vec4(0.2, 0.2, 0.2, 1.0);

var threeFlag = false;




init();

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect = canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    program2 = initShaders(gl, "vertex-shader2", "fragment-shader2");


    var mySolid = colorSolid();

    var myCylinder = cylinder(82, 2, true);
    myCylinder.scale(0.15, 1.4, 0.5);
    myCylinder.rotate(90.0, [0,0,1]);  //0,1,0 xk I want to rotate only around the y axis
    myCylinder.translate(0.0, -1.0, 1.0);

    numPositionsCylinder = myCylinder.TriangleVertices.length;


    positionsArray = positionsArray.concat(myCylinder.TriangleVertices);
    normalsArray = normalsArray.concat(myCylinder.TriangleNormals);
    //colorsArray = myCylinder.TriangleVertexColors;
    texCoordsArray = texCoordsArray.concat(myCylinder.TextureCoordinates);



///  BUFFERS  /// 
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var normal2Loc = gl.getAttribLocation(program2, "aNormal");
    gl.vertexAttribPointer(normal2Loc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normal2Loc);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var position2Loc = gl.getAttribLocation(program2, "aPosition");
    gl.vertexAttribPointer(position2Loc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position2Loc);


     ///  texture  ///
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    //var texCoord2Loc = gl.getAttribLocation(program2, "aTexCoord");
    //gl.vertexAttribPointer(texCoord2Loc, 2, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(texCoord2Loc);


    // tangents Buffer for Bump Map //
    var tangBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tangentsArray), gl.STATIC_DRAW);

    var tangentLoc = gl.getAttribLocation(program, "aTangent");
    gl.vertexAttribPointer(tangentLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tangentLoc);



 
  ///  LIGHT FOR MY SOLID ///

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    var ambientProductRed = mult(lightAmbientRed, materialAmbient);
    var diffuseProductRed = mult(lightDiffuseRed, materialDiffuse);
    var specularProductRed = mult(lightSpecularRed, materialSpecular);

  /// LIGHT FOR CYLINDER ///
    var ambientProductCylinder = mult(lightAmbient, materialAmbientCylinder);
    var diffuseProductCylinder = mult(lightDiffuse, materialDiffuseCylinder);
    var specularProductCylinder = mult(lightSpecular, materialSpecularCylinder);

    var ambientProductCylinderRed = mult(lightAmbientRed, materialAmbientCylinder);
    var diffuseProductCylinderRed = mult(lightDiffuseRed, materialDiffuseCylinder);
    var specularProductCylinderRed = mult(lightSpecularRed, materialSpecularCylinder);



  ///  PROGRAM   ///
    gl.useProgram(program);

    bumpFlagLoc = gl.getUniformLocation(program, "uBumpFlag");


    configureTexture(image2);  //texture di default
    //configureTextureBump(normals); //it activates by pushing the respective botton
    //gl.uniform1i( gl.getUniformLocation(program, "uTextureMap"), 0);

    thetaLoc = gl.getUniformLocation(program, "theta");


    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
       specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"), materialShininess);

    gl.uniform1f(gl.getUniformLocation(program, "uThreeFlag"), threeFlag);
    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductR"),
       ambientProductRed);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductR"),
       diffuseProductRed );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductR"),
       specularProductRed );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionR"),
       lightPositionRed );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionR2"),
       lightPositionRed2 );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPositionR3"),
       lightPositionRed3 );



    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");


  /// PROGRAM 2 ///
    gl.useProgram(program2);
    gl.uniform4fv(gl.getUniformLocation(program2, "uAmbientProduct"),
       ambientProductCylinder);
    gl.uniform4fv(gl.getUniformLocation(program2, "uDiffuseProduct"),
       diffuseProductCylinder );
    gl.uniform4fv(gl.getUniformLocation(program2, "uSpecularProduct"),
       specularProductCylinder );
    gl.uniform4fv(gl.getUniformLocation(program2, "uLightPosition"),
       lightPosition );

    gl.uniform4fv(gl.getUniformLocation(program2, "uEmissiveCyl"), emissiveCyl);

    gl.uniform1f(gl.getUniformLocation(program2,
       "uShininess"), materialShininessCylinder);

    gl.uniform1f(gl.getUniformLocation(program2, "uThreeFlag"), threeFlag);
    gl.uniform4fv(gl.getUniformLocation(program2, "uAmbientProductR"),
       ambientProductCylinderRed);
    gl.uniform4fv(gl.getUniformLocation(program2, "uDiffuseProductR"),
       diffuseProductCylinderRed );
    gl.uniform4fv(gl.getUniformLocation(program2, "uSpecularProductR"),
       specularProductCylinderRed );
    gl.uniform4fv(gl.getUniformLocation(program2, "uLightPositionR"),
       lightPositionRed );
    gl.uniform4fv(gl.getUniformLocation(program2, "uLightPositionR2"),
       lightPositionRed2 );
    gl.uniform4fv(gl.getUniformLocation(program2, "uLightPositionR3"),
       lightPositionRed3 );


    modelViewMatrixLoc2 = gl.getUniformLocation(program2, "uModelViewMatrix");
    projectionMatrixLoc2 = gl.getUniformLocation(program2, "uProjectionMatrix");
    nMatrixLoc2 = gl.getUniformLocation(program2, "uNormalMatrix");



  /// BUTTON FOR SWITCHING between Per-Vertex (default) and Per-Fragment Shading model ///
   document.getElementById("ButtonSwitch").onclick = function(){
      shadingFlag = !shadingFlag;
      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "uShadingFlag"), shadingFlag);
      gl.useProgram(program2);
      gl.uniform1f(gl.getUniformLocation(program2, "uShadingFlag"), shadingFlag);
   };


  /// BUTTON FOR SWITCHING ON/OFF THE 3 LIGHTS IN THE CYLINDER ///
   document.getElementById("threelights").onclick = function(){
      threeFlag = !threeFlag;
      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "uThreeFlag"), threeFlag);
      gl.useProgram(program2);
      gl.uniform1f(gl.getUniformLocation(program2, "uThreeFlag"), threeFlag);
   };



  /// BUTTON FOR SWITCHING ON/OFF THE ROUGH TEXTURE ///
   document.getElementById("bumpBotton").onclick = function(){
      bumpFlag = !bumpFlag;
      //gl.useProgram(program);
      //gl.uniform1f(gl.getUniformLocation(program, "uBumpFlag"), bumpFlag);
   };

   gl.useProgram(program);
   bumpFlagLoc = gl.getUniformLocation(program, "uBumpFlag");


  ///  BUTTONS for changing viewer position and viewing volume  ///
    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 1.111;}; //2.0
    document.getElementById("Button4").onclick = function(){radius *= 0.9;}; //0.5
    document.getElementById("Button5").onclick = function(){theta1 += dr;};
    document.getElementById("Button6").onclick = function(){theta1 -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

  
  ///  BUTTONS FOR THE ROTATION OF THE SOLID ALONG THE AXIS  ///
    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};
    document.getElementById("ButtonDir").onclick = function(){direction = !direction;};
    


    render();
}

function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag && !direction){
        theta[axis] += 2.0;
    } else if(flag && direction) {
        theta[axis] -= 2.0;
    }

    viewerPos = vec3(radius*Math.sin(theta1)*Math.cos(phi),
        radius*Math.sin(theta1)*Math.sin(phi), radius*Math.cos(theta1));

    modelViewMatrix = lookAt(viewerPos, at , up);
    modelViewMatrix = mult(traslation_matrix, modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));
    modelViewMatrix = mult(modelViewMatrix, inverse(traslation_matrix));
    
    modelViewMatrix2 = lookAt(viewerPos, at , up);
    modelViewMatrix2 = mult(traslation_matrix, modelViewMatrix2);
    modelViewMatrix2 = mult(modelViewMatrix2, inverse(traslation_matrix));
  
    projectionMatrix = perspective(fovy, aspect, near, far);
    projectionMatrix2 = perspective(fovy, aspect, near, far);

    nMatrix = normalMatrix(modelViewMatrix, true);
    nMatrix2 = normalMatrix(modelViewMatrix2, true);

    //console.log("barycenter translation along z = " + barycenter_solid[2]);
    //console.log(bumpFlag);

   /// MAIN SOLID, PROGRAM ///
    gl.useProgram(program);
   ///  BUMP MAP  ////
    gl.uniform1i(bumpFlagLoc, bumpFlag);
    if(bumpFlag){
	configureTextureBump(normals);
	gl.uniform1i(gl.getUniformLocation(program, "uBumpFlag"), 0)
    }else{
	configureTexture(image2);
	gl.uniform1i(gl.getUniformLocation(program, "uBumpFlag"), 0)
    }
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

   ///  CYLINDER, PROGRAM 2  ///
    gl.useProgram(program2);
    
    gl.uniformMatrix4fv(modelViewMatrixLoc2, false, flatten(modelViewMatrix2));
    gl.uniformMatrix4fv(projectionMatrixLoc2, false, flatten(projectionMatrix2));

    gl.uniformMatrix3fv(nMatrixLoc2, false, flatten(nMatrix2));

    gl.drawArrays(gl.TRIANGLES, numPositions, numPositionsCylinder);

    requestAnimationFrame(render);
}

}

shadedCube();


