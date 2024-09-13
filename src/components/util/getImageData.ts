import { PixelCrop } from 'react-image-crop';
import { drowCanvas } from './drowCanvas';

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve: any) => {
    canvas.toBlob(resolve);
  });
}

export async function getImageData(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale: number,
  rotate = 0,
) {
  const canvas = document.createElement('canvas');

  await drowCanvas(image, canvas, crop, scale, rotate);

  const blob = await toBlob(canvas);

  return blob;
}
