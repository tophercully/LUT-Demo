#ifdef GL_ES
precision highp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

//textures and uniforms from p5
uniform sampler2D p;
uniform vec2 u_resolution;
uniform float seed;
uniform vec3 bgc;
uniform float marg;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}



float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vTexCoord*u_resolution;
  vec2 st = vTexCoord;
  vec2 stB = vTexCoord;

  //flip the upside down image
  st.y = 1.0 - st.y;

  //form noise
  st.xy += (random(st.xy)*0.001)-0.0005;
  float warp = map(noise(seed+st.xy*5.0), 0.0, 1.0, -0.005, 0.005);
  //st.xy += warp;

  vec4 texP = texture2D(p, st);

  //color noise
  float noiseGray = random(st.xy)*0.25;

  vec3 color = vec3(0.0);
  vec3 final = vec3(0.0);
  color = vec3(texP.r, texP.g, texP.b);

  //Draw margin
  float margX = marg;
  float margY = margX*0.8;
  if(stB.x < margX || stB.x > 1.0-margX || stB.y < margY || stB.y > 1.0-margY) {
    color = vec3(bgc.r, bgc.g, bgc.b);
  }


  gl_FragColor = vec4(color+noiseGray, 1.0);
}
