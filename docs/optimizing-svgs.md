# Index Section Icons

These are the slightly customized Flaticons for the index page.

> [!NOTE]
> I've disabled inlining of assets (see `assetsInlineLimit` in `astro.config.ts`)
> so this step is no longer necessary.

## Optimization

For some [reason](https://github.com/PlayForm/Compress/issues/450)
`@playform/compress` does not compressing these when they are inlined as
data-urls into the index.css file. So I will manually run svgo on them.

```sh
svgo --input raw-assets/svgs/*.svg --output src/assets/
```

> [!WARNING]
> `svgo` will copy every file matched on input to output even if not an SVG file.
> So that is why I used `--input raw-assets/svgs/*.svg`.

But it left in the `xml:space="preserve"` which I don't think is actually
necessary, so I manually removed it.

> [!NOTE]
> `src/assets/mozilla.svg` is not here beause it is used with an `<Image>` and
> so `@playform/compress` applies svgo automatically.
