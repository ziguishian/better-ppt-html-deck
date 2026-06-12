export function enterFullscreen() {
  document.documentElement.requestFullscreen?.();
}

export function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
}
