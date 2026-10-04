# OptionList

Pick one option from rich rows: a photo, a title, short facts, a price and a radio mark. Use it to choose an aircraft, a cabin or a plan, anywhere the choice needs more than a label. It is one column on phones and adds columns as room allows. The whole row is the touch target, and arrow keys move and select (a radio group with a roving tab stop). It is a form control: `[(value)]`, `[(ngModel)]`, `formControlName`.

```jsx
<OptionList label="Aircraft" options={aircraft} value={choice} onChange={setChoice} error={error} />
```

```html
<ar-option-list label="Aircraft" [options]="aircraft" formControlName="aircraft" [error]="form.error('aircraft')" />
```

Keep `meta` to two short facts and `note` to one word ("all-in", "per night"). Use `badge` on at most one option ("Best value"). Use a Select instead when the options are plain labels, and MobileSegmented when there are two or three short ones.
