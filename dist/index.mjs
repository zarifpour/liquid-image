import * as React from 'react'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'

var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
var __getOwnPropDescs = Object.getOwnPropertyDescriptors
var __getOwnPropSymbols = Object.getOwnPropertySymbols
var __hasOwnProp = Object.prototype.hasOwnProperty
var __propIsEnum = Object.prototype.propertyIsEnumerable
var __defNormalProp = (obj, key, value) =>
  key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value)
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
    }
  return a
}
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b))
var __objRest = (source, exclude) => {
  var target = {}
  for (var prop in source) if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop]
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop]
    }
  return target
}

// src/utils/logger.ts
var msg = (message) => {
  return `\u{1F4A7} LiquidImage: ${message}`
}
var consoleError = (message, ...args) => {
  console.error(msg(message), ...args)
}

// src/utils/params.ts
var params = {
  refraction: {
    min: 0,
    max: 0.06,
    step: 1e-3,
    default: 0.015
  },
  edge: {
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.4
  },
  patternBlur: {
    min: 0,
    max: 0.05,
    step: 1e-3,
    default: 5e-3
  },
  liquid: {
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.07
  },
  speed: {
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.3
  },
  patternScale: {
    min: 1,
    max: 10,
    step: 0.1,
    default: 2
  }
}
var defaultParams = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, value.default]))

// src/utils/liquid-frag.ts
var liquidFragSource =
  /* glsl */
  `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_patternScale;
uniform float u_refraction;
uniform float u_edge;
uniform float u_patternBlur;
uniform float u_liquid;


#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846


vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
    m = m*m;
    m = m*m;
    vec3 x = 2. * fract(p * C.www) - 1.;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130. * dot(m, g);
}

vec2 get_img_uv() {
    vec2 img_uv = vUv;
    img_uv -= .5;
    if (u_ratio > u_img_ratio) {
        img_uv.x = img_uv.x * u_ratio / u_img_ratio;
    } else {
        img_uv.y = img_uv.y * u_img_ratio / u_ratio;
    }
    float scale_factor = 1.;
    img_uv *= scale_factor;
    img_uv += .5;

    img_uv.y = 1. - img_uv.y;

    return img_uv;
}
vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {
    float ch = c2;
    float border = 0.;
    float blur = u_patternBlur + extra_blur;

    ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));

    border = w[0];
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));

    b = smoothstep(.2, .8, b);
    border = w[0] + .4 * (1. - b) * w[1];
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));

    border = w[0] + .5 * (1. - b) * w[1];
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));

    border = w[0] + w[1];
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));

    float gradient_t = (stripe_p - w[0] - w[1]) / w[2];
    float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));
    ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));

    return ch;
}

float get_img_frame_alpha(vec2 uv, float img_frame_width) {
    float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
    img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
    return img_frame_alpha;
}

void main() {
    vec2 uv = vUv;
    uv.y = 1. - uv.y;
    uv.x *= u_ratio;

    float diagonal = uv.x - uv.y;

    float t = .001 * u_time;

    vec2 img_uv = get_img_uv();
    vec4 img = texture(u_image_texture, img_uv);

    vec3 color = vec3(0.);
    float opacity = 1.;

    vec3 color1 = vec3(.98, 0.98, 1.);
    vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));

    float edge = img.r;


    vec2 grad_uv = uv;
    grad_uv -= .5;

    float dist = length(grad_uv + vec2(0., .2 * diagonal));

    grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * PI);

    float bulge = pow(1.8 * dist, 1.2);
    bulge = 1. - bulge;
    bulge *= pow(uv.y, .3);


    float cycle_width = u_patternScale;
    float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);
    float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);
    float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);

    float thin_strip_1_width = cycle_width * thin_strip_1_ratio;
    float thin_strip_2_width = cycle_width * thin_strip_2_ratio;

    opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);
    opacity *= get_img_frame_alpha(img_uv, 0.01);


    float noise = snoise(uv - t);

    edge += (1. - edge) * u_liquid * noise;

    float refr = 0.;
    refr += (1. - bulge);
    refr = clamp(refr, 0., 1.);

    float dir = grad_uv.x;


    dir += diagonal;

    dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));

    bulge *= clamp(pow(uv.y, .1), .3, 1.);
    dir *= (.1 + (1.1 - edge) * bulge);

    dir *= smoothstep(1., .7, edge);

    dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));
    dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));

    dir *= (.5 + .5 * pow(uv.y, 2.));

    dir *= cycle_width;

    dir -= t;

    float refr_r = refr;
    refr_r += .03 * bulge * noise;
    float refr_b = 1.3 * refr;

    refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));
    refr_r -= diagonal;

    refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));
    refr_b -= .2 * edge;

    refr_r *= u_refraction;
    refr_b *= u_refraction;

    vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);
    w[1] -= .02 * smoothstep(.0, 1., edge + bulge);
    float stripe_r = mod(dir + refr_r, 1.);
    float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);
    float stripe_g = mod(dir, 1.);
    float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01 / (1. - diagonal), bulge);
    float stripe_b = mod(dir - refr_b, 1.);
    float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);

    color = vec3(r, g, b);

    color *= opacity;

    fragColor = vec4(color, opacity);
}
`
var vertexShaderSource = `#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`
function Canvas({ imageData, params: params2 }) {
  if (typeof window === 'undefined') {
    consoleError('Canvas is not supported in the browser')
    return
  }
  const canvasRef = useRef(null)
  const [gl, setGl] = useState(null)
  const [uniforms, setUniforms] = useState({})
  const totalAnimationTime = useRef(0)
  const lastRenderTime = useRef(0)
  function updateUniforms() {
    if (!gl || !uniforms) return
    gl.uniform1f(uniforms.u_edge, params2.edge)
    gl.uniform1f(uniforms.u_patternBlur, params2.patternBlur)
    gl.uniform1f(uniforms.u_time, 0)
    gl.uniform1f(uniforms.u_patternScale, params2.patternScale)
    gl.uniform1f(uniforms.u_refraction, params2.refraction)
    gl.uniform1f(uniforms.u_liquid, params2.liquid)
  }
  useEffect(() => {
    function initShader() {
      const canvas = canvasRef.current
      const gl2 =
        canvas == null
          ? void 0
          : canvas.getContext('webgl2', {
              antialias: true,
              alpha: true
            })
      if (!canvas || !gl2) {
        consoleError('Failed to initialize shader. Does your browser support WebGL2?')
        return
      }
      function createShader(gl3, sourceCode, type) {
        const shader = gl3.createShader(type)
        if (!shader) {
          consoleError('Failed to create shader')
          return null
        }
        gl3.shaderSource(shader, sourceCode)
        gl3.compileShader(shader)
        if (!gl3.getShaderParameter(shader, gl3.COMPILE_STATUS)) {
          consoleError(`An error occurred compiling the shaders: ${gl3.getShaderInfoLog(shader)}`)
          gl3.deleteShader(shader)
          return null
        }
        return shader
      }
      const vertexShader = createShader(gl2, vertexShaderSource, gl2.VERTEX_SHADER)
      const fragmentShader = createShader(gl2, liquidFragSource, gl2.FRAGMENT_SHADER)
      const program = gl2.createProgram()
      if (!program || !vertexShader || !fragmentShader) {
        consoleError('Failed to create program or shaders')
        return
      }
      gl2.attachShader(program, vertexShader)
      gl2.attachShader(program, fragmentShader)
      gl2.linkProgram(program)
      if (!gl2.getProgramParameter(program, gl2.LINK_STATUS)) {
        consoleError(`Unable to initialize the shader program: ${gl2.getProgramInfoLog(program)}`)
        return null
      }
      function getUniforms(program2, gl3) {
        var _a
        const uniforms3 = {}
        const uniformCount = gl3.getProgramParameter(program2, gl3.ACTIVE_UNIFORMS)
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = (_a = gl3.getActiveUniform(program2, i)) == null ? void 0 : _a.name
          if (!uniformName) continue
          uniforms3[uniformName] = gl3.getUniformLocation(program2, uniformName)
        }
        return uniforms3
      }
      const uniforms2 = getUniforms(program, gl2)
      setUniforms(uniforms2)
      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
      const vertexBuffer = gl2.createBuffer()
      gl2.bindBuffer(gl2.ARRAY_BUFFER, vertexBuffer)
      gl2.bufferData(gl2.ARRAY_BUFFER, vertices, gl2.STATIC_DRAW)
      gl2.useProgram(program)
      const positionLocation = gl2.getAttribLocation(program, 'a_position')
      gl2.enableVertexAttribArray(positionLocation)
      gl2.bindBuffer(gl2.ARRAY_BUFFER, vertexBuffer)
      gl2.vertexAttribPointer(positionLocation, 2, gl2.FLOAT, false, 0, 0)
      setGl(gl2)
    }
    initShader()
    updateUniforms()
  }, [params2])
  useEffect(() => {
    if (!gl || !uniforms) return
    updateUniforms()
  }, [gl, uniforms, params2])
  useEffect(() => {
    if (!gl || !uniforms) return
    let renderId
    function render(currentTime) {
      const deltaTime = currentTime - lastRenderTime.current
      lastRenderTime.current = currentTime
      totalAnimationTime.current += deltaTime * params2.speed
      gl == null ? void 0 : gl.uniform1f(uniforms.u_time, totalAnimationTime.current)
      gl == null ? void 0 : gl.drawArrays(gl == null ? void 0 : gl.TRIANGLE_STRIP, 0, 4)
      renderId = requestAnimationFrame(render)
    }
    lastRenderTime.current = performance.now()
    renderId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(renderId)
    }
  }, [gl, uniforms, params2.speed])
  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl || !gl || !uniforms) return
    function resizeCanvas() {
      if (!canvasEl || !gl || !uniforms) return
      const imgRatio = imageData.width / imageData.height
      gl.uniform1f(uniforms.u_img_ratio, imgRatio)
      const side = 1e3
      canvasEl.width = side * devicePixelRatio
      canvasEl.height = side * devicePixelRatio
      gl.viewport(0, 0, canvasEl.height, canvasEl.height)
      gl.uniform1f(uniforms.u_ratio, 1)
      gl.uniform1f(uniforms.u_img_ratio, imgRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [gl, uniforms, imageData])
  useEffect(() => {
    if (!gl || !uniforms) return
    const existingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D)
    if (existingTexture) {
      gl.deleteTexture(existingTexture)
    }
    const imageTexture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, imageTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    try {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        imageData.width,
        imageData.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageData.data
      )
      gl.uniform1i(uniforms.u_image_texture, 0)
    } catch (e) {
      consoleError('Error uploading texture:', e)
    }
    return () => {
      if (imageTexture) {
        gl.deleteTexture(imageTexture)
      }
    }
  }, [gl, uniforms, imageData])
  return /* @__PURE__ */ jsx('canvas', {
    ref: canvasRef,
    style: { height: '100%', width: '100%', objectFit: 'contain' }
  })
}
function setRef(ref, value) {
  if (typeof ref === 'function') {
    return ref(value)
  }
  if (ref !== null && ref !== void 0) {
    ref.current = value
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node)
      if (!hasCleanup && typeof cleanup === 'function') {
        hasCleanup = true
      }
      return cleanup
    })
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i]
          if (typeof cleanup === 'function') {
            cleanup()
          } else {
            setRef(refs[i], null)
          }
        }
      }
    }
  }
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs)
}
var NumberInput = (_a) => {
  var _b = _a,
    {
      integer = false,
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY,
      increments = [1, 10],
      format = (value) => {
        const float = Number.parseFloat(value)
        return Number.isInteger(float) ? value : float.toFixed(3)
      }
    } = _b,
    props = __objRest(_b, ['integer', 'min', 'max', 'increments', 'format'])
  const ref = useRef(null)
  return /* @__PURE__ */ jsx(
    Input,
    __spreadProps(__spreadValues({}, props), {
      format,
      ref: useComposedRefs(ref, props.ref),
      onKeyDown: (event) => {
        var _a2
        if (!ref.current) {
          return
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault()
          const direction = event.key === 'ArrowUp' ? 1 : -1
          const [smallIncrement, largeIncrement] = increments
          const amount = event.shiftKey ? largeIncrement : smallIncrement
          const defaultNumber = Math.max(min, Math.min(0, max))
          const value = ref.current.value
          const defaultValue = defaultNumber
          let number = defaultNumber
          let newValue = defaultValue
          if (value !== null) {
            number = integer ? Number.parseInt(value) : Number.parseFloat(value)
          }
          if (!Number.isNaN(number)) {
            newValue = decimal(Math.min(max, Math.max(min, number + amount * direction)))
          }
          flushSync(() => {
            var _a3
            return (_a3 = ref.current) == null ? void 0 : _a3.commitValue(newValue.toString())
          })
          ref.current.select()
        }
        ;(_a2 = props.onKeyDown) == null ? void 0 : _a2.call(props, event)
      }
    })
  )
}
function Input(_a) {
  var _b = _a,
    { onValueCommit, format = defaultFormatter, parse = defaultParser } = _b,
    props = __objRest(_b, ['onValueCommit', 'format', 'parse'])
  const sourceValue = format(props.value)
  const [value, setValue] = useState(sourceValue)
  const [input, setInput] = useState(null)
  const isDirty = useRef(false)
  const shouldResetValue = input && document.activeElement !== input && sourceValue !== value
  if (shouldResetValue) {
    setValue(sourceValue)
  }
  function commitValue(value2) {
    const parsed = parse(value2)
    if (parsed === null) {
      setValue(sourceValue)
      return
    }
    const formatted = format(parsed)
    setValue(formatted)
    onValueCommit == null ? void 0 : onValueCommit(parsed)
  }
  const commitValueRef = useRef(commitValue)
  commitValueRef.current = commitValue
  useImperativeHandle(
    props.ref,
    () => {
      if (input) {
        return Object.assign(input, {
          setValue,
          commitValue: (value2) => {
            commitValueRef.current(value2)
          }
        })
      }
      return null
    },
    [input]
  )
  function handleBlur() {
    if (isDirty.current) {
      commitValue(value)
    }
    isDirty.current = false
  }
  const handleBlurRef = useRef(handleBlur)
  handleBlurRef.current = handleBlur
  useEffect(() => {
    return () => handleBlurRef.current()
  }, [])
  return /* @__PURE__ */ jsx(
    'input',
    __spreadProps(__spreadValues(__spreadValues({}, baseInputProps), props), {
      ref: setInput,
      value,
      onBlur: (event) => {
        var _a2
        handleBlur()
        ;(_a2 = props.onBlur) == null ? void 0 : _a2.call(props, event)
      },
      onFocus: (event) => {
        var _a2
        event.target.select()
        ;(_a2 = props.onFocus) == null ? void 0 : _a2.call(props, event)
      },
      onChange: (event) => {
        var _a2
        isDirty.current = true
        setValue(event.target.value)
        ;(_a2 = props.onChange) == null ? void 0 : _a2.call(props, event)
      },
      onBeforeInput: () => {
        isDirty.current = true
      },
      onKeyDown: (event) => {
        var _a2
        if (event.key === 'Escape') {
          if (value === sourceValue) {
            input == null ? void 0 : input.blur()
          } else {
            flushSync(() => setValue(sourceValue))
            input == null ? void 0 : input.select()
          }
        }
        if (event.key === 'Enter') {
          isDirty.current = true
          input == null ? void 0 : input.blur()
        }
        ;(_a2 = props.onKeyDown) == null ? void 0 : _a2.call(props, event)
      },
      onPointerDown: (event) => {
        var _a2
        handlePointerDown(input)
        ;(_a2 = props.onPointerDown) == null ? void 0 : _a2.call(props, event)
      }
    })
  )
}
function defaultFormatter(value) {
  return value
}
function defaultParser(value) {
  return value.trim().replace(/\s+/g, ' ') || null
}
function handlePointerDown(input) {
  if (document.activeElement !== input) {
    if (input) {
      input.focus()
      input.selectionStart = null
      input.selectionEnd = null
    }
    const handleSelectionChange = () => {
      if ((input == null ? void 0 : input.selectionStart) !== (input == null ? void 0 : input.selectionEnd)) {
        document.removeEventListener('selectionchange', handleSelectionChange)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }
    const handlePointerUp = (event) => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      if (event.target && event.target === input) {
        input.select()
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('pointerup', handlePointerUp, {
      once: true,
      passive: true
    })
  }
}
var baseInputProps = {
  type: 'text',
  autoCapitalize: 'none',
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: 'false',
  // Turn off common password managers
  // https://www.stefanjudis.com/snippets/turn-off-password-managers/
  'data-1p-ignore': 'true',
  'data-lpignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other'
}
function decimal(number) {
  return +number.toFixed(12)
}
function LiquidImageControls({ state, setState }) {
  return /* @__PURE__ */ jsxs('div', {
    style: {
      borderRadius: '12px',
      display: 'grid',
      gridTemplateColumns: 'auto 120px auto',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      width: 'fit-content'
    },
    children: [
      /* @__PURE__ */ jsx('div', {
        children: /* @__PURE__ */ jsx('label', {
          style: { fontSize: '13px', fontWeight: 500 },
          htmlFor: 'background',
          children: 'Background'
        })
      }),
      /* @__PURE__ */ jsxs('div', {
        style: {
          gridColumn: 'span 2',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        },
        children: [
          /* @__PURE__ */ jsx('button', {
            type: 'button',
            style: {
              position: 'relative',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              borderRadius: '9999px',
              fontSize: '0px',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              background: 'transparent',
              transition: 'all 0.2s ease'
            },
            onClick: () =>
              setState((prevState) =>
                __spreadProps(__spreadValues({}, prevState), {
                  background: 'transparent'
                })
              ),
            children: /* @__PURE__ */ jsxs('svg', {
              viewBox: '0 0 24 24',
              style: {
                position: 'absolute',
                inset: '0',
                margin: 'auto',
                width: '12px',
                height: '12px',
                color: 'white'
              },
              stroke: 'currentColor',
              strokeWidth: '2',
              fill: 'none',
              children: [
                /* @__PURE__ */ jsx('title', { children: 'Transparent' }),
                /* @__PURE__ */ jsx('path', { d: 'M18 6L6 18M6 6l12 12' })
              ]
            })
          }),
          ['metal', 'white', 'black'].map((color) =>
            /* @__PURE__ */ jsx(
              'button',
              {
                type: 'button',
                style: {
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  borderRadius: '9999px',
                  fontSize: '0px',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  background: color === 'metal' ? 'linear-gradient(to bottom, #eee, #b8b8b8)' : color,
                  transition: 'all 0.2s ease'
                },
                onClick: () =>
                  setState((prevState) => __spreadProps(__spreadValues({}, prevState), { background: color })),
                children: color
              },
              color
            )
          ),
          /* @__PURE__ */ jsxs('label', {
            style: {
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              borderRadius: '9999px',
              fontSize: '0px',
              border: '2px solid white',
              background: `
              conic-gradient(
                from 90deg,
                hsl(0 100% 50%),
                hsl(30 100% 50%),
                hsl(60 100% 50%),
                hsl(90 100% 50%),
                hsl(120 100% 50%),
                hsl(150 100% 50%),
                hsl(180 100% 50%),
                hsl(210 100% 50%),
                hsl(240 100% 50%),
                hsl(270 100% 50%),
                hsl(300 100% 50%),
                hsl(330 100% 50%),
                hsl(360 100% 50%)
              )
            `,
              position: 'relative',
              transition: 'all 0.2s ease'
            },
            children: [
              /* @__PURE__ */ jsx('div', {
                style: {
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
                }
              }),
              /* @__PURE__ */ jsx('input', {
                style: { width: '0', height: '0', opacity: 0 },
                type: 'color',
                onChange: (event) => {
                  if (event.target) {
                    setState((prevState) =>
                      __spreadProps(__spreadValues({}, prevState), {
                        background: event.target.value
                      })
                    )
                  }
                }
              }),
              'Custom'
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx('div', {
        children: /* @__PURE__ */ jsx('label', {
          style: { fontSize: '13px', fontWeight: 500 },
          htmlFor: 'invert',
          children: 'Invert'
        })
      }),
      /* @__PURE__ */ jsx('div', {
        style: {
          gridColumn: 'span 2',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        },
        children: /* @__PURE__ */ jsxs('label', {
          style: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          },
          children: [
            /* @__PURE__ */ jsx('input', {
              type: 'checkbox',
              id: 'invert',
              checked: state.invert,
              onChange: (e) =>
                setState((prevState) =>
                  __spreadProps(__spreadValues({}, prevState), {
                    invert: e.target.checked
                  })
                ),
              style: {
                appearance: 'none',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                background: state.invert ? 'rgba(93, 188, 255, 0.8)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                margin: 0,
                padding: 0,
                display: 'grid',
                placeContent: 'center'
              }
            }),
            /* @__PURE__ */ jsxs('svg', {
              viewBox: '0 0 24 24',
              style: {
                position: 'absolute',
                left: '6px',
                width: '12px',
                height: '12px',
                color: 'white',
                opacity: state.invert ? 1 : 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none'
              },
              stroke: 'currentColor',
              strokeWidth: '3',
              fill: 'none',
              children: [
                /* @__PURE__ */ jsx('title', { children: 'Invert colors' }),
                /* @__PURE__ */ jsx('path', { d: 'M20 6L9 17l-5-5' })
              ]
            })
          ]
        })
      }),
      /* @__PURE__ */ jsx(Control, {
        label: 'Refraction',
        value: state.refraction,
        min: params.refraction.min,
        max: params.refraction.max,
        step: params.refraction.step,
        onValueChange: (value) => setState((state2) => __spreadProps(__spreadValues({}, state2), { refraction: value }))
      }),
      /* @__PURE__ */ jsx(Control, {
        label: 'Edge',
        value: state.edge,
        min: params.edge.min,
        max: params.edge.max,
        step: params.edge.step,
        onValueChange: (value) => setState((state2) => __spreadProps(__spreadValues({}, state2), { edge: value }))
      }),
      /* @__PURE__ */ jsx(Control, {
        label: 'Pattern Blur',
        value: state.patternBlur,
        min: params.patternBlur.min,
        max: params.patternBlur.max,
        step: params.patternBlur.step,
        onValueChange: (value) =>
          setState((state2) => __spreadProps(__spreadValues({}, state2), { patternBlur: value }))
      }),
      /* @__PURE__ */ jsx(Control, {
        label: 'Liquify',
        value: state.liquid,
        min: params.liquid.min,
        max: params.liquid.max,
        step: params.liquid.step,
        onValueChange: (value) => setState((state2) => __spreadProps(__spreadValues({}, state2), { liquid: value }))
      }),
      /* @__PURE__ */ jsx(Control, {
        label: 'Speed',
        value: state.speed,
        min: params.speed.min,
        max: params.speed.max,
        step: params.speed.step,
        onValueChange: (value) => setState((state2) => __spreadProps(__spreadValues({}, state2), { speed: value }))
      }),
      /* @__PURE__ */ jsx(Control, {
        label: 'Pattern Scale',
        value: state.patternScale,
        min: params.patternScale.min,
        max: params.patternScale.max,
        step: params.patternScale.step,
        format: (value) => (value === '0' || value === '10' ? value : Number.parseFloat(value).toFixed(1)),
        onValueChange: (value) =>
          setState((state2) => __spreadProps(__spreadValues({}, state2), { patternScale: value }))
      }),
      /* @__PURE__ */ jsx('div', {
        style: {
          gridColumn: 'span 3',
          fontSize: '13px',
          opacity: 0.8,
          marginTop: '8px',
          maxWidth: '300px',
          lineHeight: '1.4'
        },
        children:
          '\u{1F4A1} Tip: transparent or white background is required. Shapes work better than words. Use an SVG or a high-resolution image. Blur the image to make it look more smooth.'
      })
    ]
  })
}
function Control({ label, min, max, step, format, value, onValueChange }) {
  if (value < min || value > max) {
    consoleError(`"${label}" value (${value}) is outside allowed range [${min}, ${max}]`)
  }
  const percentage = ((value - min) / (max - min)) * 100
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx('div', {
        style: { minWidth: '80px' },
        children: /* @__PURE__ */ jsx('label', {
          style: { fontSize: '13px', fontWeight: 500 },
          htmlFor: label,
          children: label
        })
      }),
      /* @__PURE__ */ jsx('div', {
        style: { width: '120px' },
        children: /* @__PURE__ */ jsx('div', {
          style: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '24px',
            touchAction: 'none',
            userSelect: 'none'
          },
          children: /* @__PURE__ */ jsx('input', {
            type: 'range',
            min,
            max,
            step,
            value,
            onChange: (e) => onValueChange(Number(e.target.value)),
            style: {
              width: '100%',
              height: '3px',
              WebkitAppearance: 'none',
              appearance: 'none',
              background: `linear-gradient(to right,
                rgba(93, 188, 255, 0.8) 0%,
                rgba(93, 188, 255, 0.8) ${percentage}%,
                rgba(255, 255, 255, 0.1) ${percentage}%,
                rgba(255, 255, 255, 0.1) 100%
              )`,
              borderRadius: '9999px',
              outline: 'none',
              cursor: 'pointer'
            },
            className: 'custom-range'
          })
        })
      }),
      /* @__PURE__ */ jsx('div', {
        children: /* @__PURE__ */ jsx(NumberInput, {
          id: label,
          min,
          max,
          increments: [step, step * 10],
          format,
          style: {
            borderRadius: '4px',
            height: '22px',
            width: '64px',
            background: 'rgba(255, 255, 255, 0.1)',
            paddingLeft: '6px',
            fontSize: '12px',
            fontWeight: '500',
            fontVariantNumeric: 'tabular-nums',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'white',
            transition: 'all 0.2s ease'
          },
          value: value.toString(),
          onValueCommit: (value2) => onValueChange(Number.parseFloat(value2))
        })
      })
    ]
  })
}
function LiquidImage({
  src,
  invert = false,
  className,
  width,
  height,
  background = 'transparent',
  refraction = 0.015,
  edge = 0.4,
  patternBlur = 5e-3,
  liquid = 0.07,
  speed = 0.3,
  patternScale = 2,
  showControls = false
}) {
  const [bitmap, setBitmap] = useState(null)
  const [img, setImg] = useState(null)
  const [finalHeight, setFinalHeight] = useState(null)
  const [finalWidth, setFinalWidth] = useState(null)
  const [state, setState] = useState(
    __spreadProps(__spreadValues({}, defaultParams), {
      background,
      refraction,
      edge,
      patternBlur,
      liquid,
      speed,
      patternScale,
      invert
    })
  )
  const [imageData, setImageData] = useState(null)
  useEffect(() => {
    async function updateImageData() {
      try {
        let canvas
        if (src.startsWith('http')) {
          const res = await fetch(src)
          const blob = await res.blob()
          const bitmap2 = await createImageBitmap(blob)
          setBitmap(bitmap2)
          canvas = document.createElement('canvas')
          canvas.width = width || bitmap2.width
          canvas.height = height || bitmap2.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Failed to create canvas context')
          }
          ctx.drawImage(bitmap2, 0, 0, canvas.width, canvas.height)
          if (state.invert) {
            ctx.globalCompositeOperation = 'difference'
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height)
          setImageData(imageData2)
        } else {
          const img2 = new Image()
          await new Promise((resolve, reject) => {
            img2.onload = () => resolve()
            img2.onerror = () => reject(new Error(`Failed to load local image \`${src}\``))
            img2.src = src
          })
          setImg(img2)
          const actualWidth = img2.width
          const actualHeight = img2.height
          canvas = document.createElement('canvas')
          let finalWidth2
          let finalHeight2
          if (width !== void 0 && height !== void 0) {
            finalWidth2 = width
            finalHeight2 = height
          } else if (width !== void 0 || height !== void 0) {
            const scaleWidth = width !== void 0 ? width / actualWidth : Number.POSITIVE_INFINITY
            const scaleHeight = height !== void 0 ? height / actualHeight : Number.POSITIVE_INFINITY
            const scale = Math.min(scaleWidth, scaleHeight)
            finalWidth2 = actualWidth * scale
            finalHeight2 = actualHeight * scale
          }
          canvas.width = finalWidth2 || actualWidth
          canvas.height = finalHeight2 || actualHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Failed to create canvas context')
          }
          ctx.drawImage(img2, 0, 0, canvas.width, canvas.height)
          if (state.invert) {
            ctx.globalCompositeOperation = 'difference'
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }
          const imageData2 = ctx.getImageData(0, 0, canvas.width, canvas.height)
          setImageData(imageData2)
        }
        setFinalHeight(canvas.height)
        setFinalWidth(canvas.width)
      } catch (error) {
        consoleError(`${error}`)
      }
    }
    updateImageData()
  }, [src, state.invert, width, height])
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx('div', {
        className,
        style: {
          width: finalWidth || (bitmap == null ? void 0 : bitmap.width) || (img == null ? void 0 : img.width) || 400,
          height:
            finalHeight || (bitmap == null ? void 0 : bitmap.height) || (img == null ? void 0 : img.height) || 400,
          aspectRatio: width && !height ? 'auto' : height && !width ? 'auto' : void 0,
          background: state.background === 'metal' ? 'linear-gradient(to bottom, #eee, #b8b8b8)' : state.background
        },
        children: imageData && /* @__PURE__ */ jsx(Canvas, { imageData, params: state })
      }),
      showControls &&
        /* @__PURE__ */ jsx('div', {
          style: { marginTop: '2rem' },
          children: /* @__PURE__ */ jsx(LiquidImageControls, { state, setState })
        })
    ]
  })
}

export { LiquidImage }
