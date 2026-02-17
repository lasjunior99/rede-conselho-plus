const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Create an HTML file that will render and convert the SVG
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SVG to PNG Converter</title>
</head>
<body>
  <div id="svg-container">${svgContent}</div>
  <canvas id="canvas" width="180" height="180"></canvas>
  <script>
    const svg = document.querySelector('svg');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.download = 'apple-touch-icon.png';
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    };
    
    img.src = url;
  </script>
</body>
</html>
`;

// Write the HTML file
const htmlPath = path.join(__dirname, 'convert-favicon.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('Arquivo HTML criado em:', htmlPath);
console.log('Abra este arquivo no navegador para baixar o PNG.');
