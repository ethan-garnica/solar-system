// Ethan Garnica
// CST-325
// Final
// 5/12/2023
precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;
uniform sampler2D uEmissiveTexture;


varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    float distanceToLight = distance(vWorldPosition,uLightPosition);
    
    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    vec3 finalColor;

    // Check if current fragment belongs to the sun
    ; // Adjust this value to fit your specific texture
    if (distanceToLight < 9.0) {
        finalColor = albedo; // Use texture color for emissive lighting
    } else {
        // Planets and Moon
        vec3 normalLightDirection = normalize(uLightPosition - vWorldPosition);
        vec3 interpolatedNormal = normalize(vWorldNormal);
        float lambert = max(dot(interpolatedNormal, normalLightDirection), 0.0);

        finalColor = albedo * lambert; // Use diffuse lighting for the planets/moon
    }

    gl_FragColor = vec4(finalColor, 1.0);
}