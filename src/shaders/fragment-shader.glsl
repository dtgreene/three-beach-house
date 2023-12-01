uniform float cellWidth;
uniform float time;
uniform sampler2D diffuse;

varying vec2 vUvs;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.13); 
  p3 += dot(p3, p3.yzx + 3.333); 
  
  return fract((p3.x + p3.y) * p3.z); 
}

// https://www.shadertoy.com/view/4dS3Wd
float noise2D(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  // Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
  vec2 u = f * f * (3.0 - 2.0 * f);

	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  // Compresses the closer to the edge
  
  float xStretch = pow(4.0, vUvs.x * 10.0 - 10.0);
  float xScroll = time * 0.25;
  
  float yNoise = noise2D(vUvs * 3.0 + time * 2.0) * 0.1;

  vec2 uv = vec2(
    vUvs.x * cellWidth + xStretch + xScroll, 
    vUvs.y + yNoise
  ) * 8.0;

  gl_FragColor = texture2D(diffuse, uv);
}
