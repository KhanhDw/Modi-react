import React, { useRef, useEffect } from 'react';


// Thêm chấm nhiễu (dot noise)
// Chữ random màu
// Font random trong nhóm monospace / sans-serif
// Xoay chữ ngẫu nhiên + nghiêng
// Lệch baseline nhẹ nhàng

const CaptchaImage = ({ captchaText }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Cấu hình
    canvas.width = 150;
    canvas.height = 50;

    // Nền
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Font ngẫu nhiên
    const fonts = [
      'Courier New', 'Arial', 'Georgia', 'Verdana',
      'Times New Roman', 'Tahoma', 'Comic Sans MS'
    ];

    // 🎯 1. Thêm nhiễu (đường kẻ)
    for (let i = 0; i < 10; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 🎯 2. Thêm chấm nhiễu
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random()})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 1.5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // 🎯 3. Vẽ từng ký tự
    const chars = captchaText.split('');
    const charWidth = canvas.width / (chars.length + 1);
    
    chars.forEach((char, i) => {
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      const angle = (Math.random() - 0.5) * 0.6; // Xoay ngẫu nhiên
      const skewX = (Math.random() - 0.5) * 0.6; // Nghiêng chữ
      const yOffset = (Math.random() - 0.5) * 10; // Lệch baseline

      ctx.save();
      ctx.translate(charWidth * (i + 1), canvas.height / 2 + yOffset);
      ctx.rotate(angle);
      ctx.transform(1, 0, skewX, 1, 0, 0); // matrix: scaleX, skewY, skewX, scaleY, translateX, translateY

      ctx.font = `bold 28px ${font}`;
      ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 30%)`; // random màu
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 0, 0);

      ctx.restore();
    });

  }, [captchaText]);

  return (
    <canvas ref={canvasRef} className="rounded-lg w-full h-full" />
  );
};

export default CaptchaImage;
