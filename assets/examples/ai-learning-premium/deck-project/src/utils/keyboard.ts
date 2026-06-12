export function isEditableTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(element?.closest("[contenteditable=true], input, textarea, select"));
}
