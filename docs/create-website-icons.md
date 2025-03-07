# Steps for generating icons

[How to Favicon in 2025: Three files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)

## Favicon

```sh
magick public/icon.svg -define icon:auto-resize=32,16 public/favicon.ico
```

## Apple Touch Icon

```sh
magick public/icon.svg -resize 140x140 -gravity center -extent 180x180 public/apple-touch-icon.png
```

## Web app manifest Icons

```sh
magick public/icon.svg -resize 192x192 public/icons/icon-192.png
magick public/icon.svg -resize 512x512 public/icons/icon-512.png
magick public/icon.svg -resize 320x320 -gravity center -extent 512x512+0+40 public/icons/icon-mask.png
```

> [!NOTE]
> `-extent 512x512+0+40` is used to shift the triangle up 40px from center for
> better masking.

## Future Ideas

- Consider [automatically generating](https://kremalicious.com/favicon-generation-with-astro/)
  with Astro

## Old way

For the Parcel website I did this:

- favicon

  ```sh
  magick -density 256x256 -background transparent src/icon.svg -define icon:auto-resize -colors 256 src/favicon.ico
  ```

- Apple Touch Icon (Put 20px of padding around the icon.):

  ```sh
  magick -density 256x256 -background '#3e454c' src/icon.svg -resize 152x152 -gravity center -extent 192x192 src/icon.png
  ```

- Android Icon (Big icon; so 58px of padding around icon.):

  ```sh
  magick -density 256x256 -background '#3e454c' src/icon.svg -resize 454x454 -gravity center -extent 512x512 src/icon-512.png
  ```

Some parts of this might be better, but I doubt it. Keeping around for a while
to find out.
