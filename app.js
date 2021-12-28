const fs = require('fs');
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

const url = 'https://cyb.ec/abcdef';
const logo = 'https://cdn.cybassets.com/s/files/17068/theme/55479/assets/img/1634198956_f4efe642_og_image.jpg?1634198956';

const width = 500;
const logoSize = 150;
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
    const dx = image.width * shrinkRatio;
    const dy = image.height * shrinkRatio;
    const startXY = (width - logoSize) / 2;
    const logoX = startXY + (logoSize - dx) / 2;
    const logoY = startXY + (logoSize - dy) / 2;

    // draw ract
    const rectX = startXY - rectMargin;
    const rectY = startXY - rectMargin;
    const rectSize = logoSize + rectMargin * 2;
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle= 'white';
    ctx.fillRect(rectX, rectY, rectSize, rectSize);
    ctx.rect(rectX, rectY, rectSize, rectSize);
    ctx.stroke();

    // print logo
    ctx.drawImage(image, logoX, logoY, dx, dy);
    
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./qrcode.png', buffer)
})();
