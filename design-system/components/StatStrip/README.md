# StatStrip

Three or four proof figures in one white card, each with a tinted icon disc (`blue`, `green` or `amber`).

```jsx
<StatStrip label="Airiona in numbers" items={[{ icon: 'globe-alt', value: '140', label: 'Airports' }, { icon: 'users', value: '28K+', label: 'Happy flyers', tone: 'amber' }]} />
```

```html
<ar-stat-strip label="Airiona in numbers" [items]="stats" />
```

It is a list. Each item reads as figure, then label ("140 Airports"). Use it for social proof under a hero or a promo, not for dashboards; use StatCard or MetricTile there.
