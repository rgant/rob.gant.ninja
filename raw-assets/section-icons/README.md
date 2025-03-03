# Index Section Icons

These are the slightly customized Flaticons for the index page.

## Optimization

For some [reason](https://github.com/PlayForm/Compress/issues/450)
`@playform/compress` is not compressing these when they are inlined as data-urls
into the index.css file. So I will manually run svgo on them.

```sh
svgo --input raw-assets/section-icons/*.svg --output src/assets/
```

But it left in the `xml:space="preserve"` which I don't think is actually
necessary, so I manually removed it.

> [!WARNING]
> `svgo` will copy every file matched on input to output even if not an SVG file.
> So that is why I used `--input raw-assets/section-icons/*.svg`.
