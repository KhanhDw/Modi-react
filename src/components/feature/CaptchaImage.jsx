// CaptchaImage.js
import React, { useRef, useEffect } from 'react';

const CaptchaImage = ({ captchaText }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const text = captchaText;

    // 1. Thiết lập kích thước và nền
    canvas.width = 150;
    canvas.height = 50;
    ctx.fillStyle = '#e5e7eb'; // Màu nền xám nhạt (bg-slate-200)
    // Nếu muốn hỗ trợ dark mode, bạn cần truyền màu nền từ props
    // ctx.fillStyle = isDarkMode ? '#334155' : '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Thêm nhiễu (đường kẻ, chấm) để chống bot
    for (let i = 0; i < 15; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 3. Vẽ chữ CAPTCHA
    ctx.font = 'bold 32px "Courier New", monospace';
    ctx.fillStyle = '#1f2937'; // Màu chữ tối (text-slate-800)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Thêm một chút xoay ngẫu nhiên cho mỗi ký tự
    const chars = text.split('');
    const charWidth = canvas.width / (chars.length + 1);
    
    chars.forEach((char, i) => {
        ctx.save();
        ctx.translate(charWidth * (i + 1), canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4); // Xoay ngẫu nhiên
        ctx.fillText(char, 0, 0);
        ctx.restore();
    });

  }, [captchaText]); // Vẽ lại mỗi khi mã captcha thay đổi

  return (
    <canvas ref={canvasRef} className="rounded-lg w-full h-full" />
  );
};

export default CaptchaImage;