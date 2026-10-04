# PromoBanner

A photo offer card. It holds a pill eyebrow, a title with a highlighted part in gold, a line of text and one white action. The photo fades into Ion Blue on the copy side, so the white text stays legible.

```jsx
<PromoBanner image="assets/photos/aviation/promo-jet.webp" eyebrow="Limited time" title="Empty legs up to" highlight="40% off"
  text="One-way repositioning flights across the Gulf this month." action="View deals" onAction={openDeals} />
```

```html
<ar-promo-banner image="…" eyebrow="Limited time" title="Empty legs up to" highlight="40% off" text="…" action="View deals" (press)="openDeals()" />
```

Pick a photo whose subject sits on the right, because the left half is covered by the gradient. Keep the title to about six words and the text to one line on desktop.
