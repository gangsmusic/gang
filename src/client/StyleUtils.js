import keyMirror from 'key-mirror';

export function border(width, style, color) {
  return `${width}px ${style} ${color}`;
}

border.style = keyMirror({
  none: null,
  hidden: null,
  dotted: null,
  dashed: null,
  solid: null,
  double: null,
  groove: null,
  ridge: null,
  inset: null,
  outset: null
});

export function rgb(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgba(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function scale3d(x, y, z) {
  return `scale3d(${x}, ${y}, ${z})`;
}

export function translate3d(x, y, z) {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, ${Math.round(z)}px)`;
}

export function boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color) {
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;
}

export function insetBoxShadow(offsetX, offsetY, blurRadius, spreadRadius, color) {
  return `inset ${boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color)}`;
}

export function backgroundImage(image, repeat = 'no-repeat', size = 'contain') {
  return {
    backgroundImage: `url(${image})`,
    backgroundRepeat: repeat,
    backgroundSize: size
  };
}

/**
 * A thin shim over Web Animation API which probably allows us to implement
 * other backends in the future (if needed).
 */
class AnimationShim {

  constructor(keyframes, options) {
    this.keyframes = keyframes;
    this.options = options;
  }

  apply(node, options) {
    let options = {...this.options, ...options};
    let player = node.animate(this.keyframes, options);
    return player;
  }
}

export function createAnimation(keyframes, options) {
  return new AnimationShim(keyframes, options);
}
