#define PHYSICAL

varying vec3 vWorldPosition;
uniform sampler2D envMap;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifndef STANDARD
	uniform float clearCoat;
	uniform float clearCoatRoughness;
#endif
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <lights_pars_begin>
#include <lights_pars_maps>
#include <lights_physical_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

vec2 cubeUV ( vec3 ray ) {
	vec3 rayAbs = abs( ray );
	float longest = max( rayAbs.x, max( rayAbs.y, rayAbs.z ) );
	vec2 uv;
	if ( longest == rayAbs.x ) {
		if ( ray.x > 0. ) {
			uv.x = -ray.z;
			uv.y = ray.y;
		} else {
			uv.x = ray.z;
			uv.y = ray.y;
		}
	} else if ( longest == rayAbs.y ) {
		if ( ray.y > 0. ) {
			uv.x = ray.x;
			uv.y = -ray.z;
		} else {
			uv.x = ray.x;
			uv.y = ray.z;
		}
	} else if ( longest == rayAbs.z ) {
		if ( ray.z > 0. ) {
			uv.x = ray.x;
			uv.y = ray.y;
		} else {
			uv.x = -ray.x;
			uv.y = ray.y;
		}
	}
	return 0.5 * ( uv / longest + 1.0 );
}

void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	#ifndef USE_NORMALMAP
		normal = vec3( 0., 0., 1. );
	#endif
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 reflectVec = reflect( cameraToVertex, worldNormal );
	vec4 envColor = texture2D( envMap, cubeUV( reflectVec ) );
	outgoingLight += envColor.xyz;
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
