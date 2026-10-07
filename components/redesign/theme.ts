/**
 * The redesign's colour tokens ("Bright": forest-black ground, a lively brand
 * green, a crisp pale-green accent). Components only ever use var(--ov-*), so
 * a colour change is a change here and nowhere else.
 *
 * .ov-panel marks "screens" (the playground, the code, transcript and call
 * windows). They re-declare the neutrals so they stay dark even if a page
 * section is ever given a lighter ground.
 */
export const themeCss = `
.ov-root {
  --ov-ground: #121411;
  --ov-ground-glass: rgba(18, 20, 17, 0.9);
  --ov-text: #EEF0EA;
  --ov-text-soft: rgba(238, 240, 234, 0.82);
  --ov-muted: #9AA096;
  --ov-line: rgba(255, 255, 255, 0.09);
  --ov-line-strong: rgba(255, 255, 255, 0.18);
  --ov-line-stronger: rgba(255, 255, 255, 0.4);
  --ov-hover: rgba(255, 255, 255, 0.04);
  --ov-brand: #3B8336;
  --ov-brand-hover: #44933E;
  --ov-brand-tint: rgba(59, 131, 54, 0.24);
  --ov-on-brand: #FFFFFF;
  --ov-accent: #C4E8A8;
  --ov-accent-line: rgba(196, 232, 168, 0.5);
  --ov-accent-faint: rgba(196, 232, 168, 0.3);
  --ov-btn: #EEF0EA;
  --ov-btn-hover: #FFFFFF;
  --ov-btn-text: #121411;
  --ov-field: #3B8336;
  --ov-field-alt: #C4E8A8;
  --ov-wave: #3B8336;
  --ov-wave-peak: #C4E8A8;
  --ov-mark-dim: #2C3A29;
  --ov-mark-lit: #62B455;
}

.ov-panel {
  --ov-ground: #121411;
  --ov-text: #EEF0EA;
  --ov-text-soft: rgba(238, 240, 234, 0.82);
  --ov-muted: #9AA096;
  --ov-line: rgba(255, 255, 255, 0.09);
  --ov-line-strong: rgba(255, 255, 255, 0.18);
  --ov-line-stronger: rgba(255, 255, 255, 0.4);
  --ov-hover: rgba(255, 255, 255, 0.04);
  --ov-btn: #EEF0EA;
  --ov-btn-hover: #FFFFFF;
  --ov-btn-text: #121411;
  background-color: var(--ov-ground);
  color: var(--ov-text);
}
`;
