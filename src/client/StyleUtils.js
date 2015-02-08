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

export function translate3d(x, y, z) {
  return `translate3d(${Math.round(x)}px, ${Math.round(y)}px, ${Math.round(z)}px)`;
}

export function boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color) {
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;
}

export function insetBoxShadow(offsetX, offsetY, blurRadius, spreadRadius, color) {
  return `inset ${boxShadow(offsetX, offsetY, blurRadius, spreadRadius, color)}`;
}
