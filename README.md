# Kuno.Neos.PreviewVariants

Inspector view for the Neos UI (8.3) that lets editors preview the display
variants of a single content node — without persisting anything.

Edit/preview modes in Neos are page-wide, and inspector editors write node
properties. Some elements have states that only exist at runtime (a countdown
before/after its launch date, closed accordion panels, logged-in/out views).
This package adds a third thing: a per-node, non-persisted preview switch.
The choice lives in the browser session only; it never reaches the content
repository and is never published.

## How it works

1. The element renders all of its variants in the backend and marks each
   container with `data-preview-variant="<key>"`. The server decides which one is
   visible (usually via the `hidden` attribute) — exactly as on the website.
2. The inspector view shows a button group: *As on the website* plus one button
   per variant. Clicking a variant toggles the `hidden` attribute of the variant
   containers inside the focused node in the guest frame and marks the node with
   `data-preview-variant-active="<key>"`. *As on the website* restores the
   server-rendered state.
3. The choice is stored in `sessionStorage` of the backend window and re-applied
   whenever the guest frame reloads (e.g. after *Apply*).

Nothing is committed to the node; the view never calls `commit`.

## Usage

```yaml
'Vendor.Site:Content.Countdown':
  ui:
    inspector:
      groups:
        countdown: { label: 'Countdown', position: 5 }
      views:
        previewVariants:
          group: countdown
          label: 'Vorschau im Backend'
          position: 20
          view: 'Kuno.Neos/Inspector/Views/PreviewVariants'
          viewOptions:
            autoLabel: 'Wie auf der Website'   # optional, translatable id or plain text
            variants:
              before: 'Countdown'
              after: 'Nach Ablauf'
```

Template (Fluid/AFX), backend rendering:

```html
<div data-preview-variant="before" {f:if(condition: isLaunched, then: 'hidden')}>…</div>
<div data-preview-variant="after" {f:if(condition: isLaunched, else: 'hidden')}>…</div>
```

Labels are passed through the UI i18n registry, so translation ids
(`Vendor.Site:NodeTypes.Countdown:variants.after`) and plain text both work.

## Installation

```bash
composer require kuno/neos-preview-variants
```

The built plugin (`Resources/Public/JavaScript/PreviewVariants/Plugin.js`) is
committed, so no JS build is needed when installing.

## Development

```bash
cd Resources/Private/PreviewVariants
npm install
npm run build      # or: npm run watch
```

The build uses esbuild with the alias map from `@neos-project/neos-ui-extensibility`,
so `react`, `react-redux`, `@neos-project/*` etc. resolve to the host UI at runtime.
