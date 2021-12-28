const fs = require('fs');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

const url = 'https://cyb.ec/abcdef';
const logo = 'https://cdn.cybassets.com/s/files/17068/theme/57865/assets/img/navbar_logo.png?1615536658';

const width = 2000;
const logoSize = 1200;
const rectMargin = 0;

const canvas = createCanvas(width, width);
const ctx = canvas.getContext('2d');
(async () => {
  await QRCode.toCanvas(canvas, url, {
    width,
    margin: 1,
    errorCorrectionLevel: 'H',
    maskPattern: 7,
  });

  const image = await loadImage(logo);
  const maxSide = Math.max(image.width, image.height);
  const shrinkRatio = logoSize / maxSide;
  const imageWidth = image.width * shrinkRatio;
  const imageHeight = image.height * shrinkRatio;
  const startX = (width - logoSize) / 2;
  const startY = (width - logoSize) / 2;
  const logoX = startX + (logoSize - imageWidth) / 2;
  const logoY = startY + (logoSize - imageHeight) / 2;

  // draw ract
  const rectX = logoX - rectMargin;
  const rectY = logoY - rectMargin;
  const rectDX = imageWidth + rectMargin * 2;
  const rectDY = imageHeight + rectMargin * 2;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.fillRect(rectX, rectY, rectDX, rectDY);
  ctx.rect(rectX, rectY, rectDX, rectDY);
  ctx.stroke();

  // print logo
  ctx.drawImage(image, logoX, logoY, imageWidth, imageHeight);

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('./qrcode.png', buffer)
})();
