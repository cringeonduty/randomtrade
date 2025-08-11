const wheels = [
  {
    canvas: document.getElementById("wheel1"),
    angle: 0,
    spinning: false,
    sectors: [
      { color: "#33FF00", label: "Long" },
      { color: "#FF0000", label: "Short" },
      { color: "#33FF00", label: "Long" },
      { color: "#FF0000", label: "Short" },
      { color: "#33FF00", label: "Long" },
      { color: "#FF0000", label: "Short" },
      { color: "#33FF00", label: "Long" },
      { color: "#FF0000", label: "Short" }
    ]
  },
  {
    canvas: document.getElementById("wheel2"),
    angle: 0,
    spinning: false,
    sectors: [
      { color: "#F7931A", label: "BTC" },
      { color: "#3C3C3D", label: "ETH" },
      { color: "#66F9A1", label: "SOL" },
      { color: "#00AAE4", label: "XRP" },
      { color: "#C2A633", label: "DOGE" },
      { color: "#8BC34A", label: "PEPE" },
      { color: "#2A5ADA", label: "LINK" },
      { color: "#FF6D6D", label: "BONK" },
      { color: "#2B2B2B", label: "SUI" },
      { color: "#B8B8B8", label: "LTC" },
      { color: "#0033AD", label: "ADA" },
      { color: "#2F5AFD", label: "TON" },
      { color: "#000000", label: "NEAR" },
      { color: "#2E3148", label: "ATOM" },
      { color: "#8247E5", label: "POL" }
    ]
  },
  {
    canvas: document.getElementById("wheel3"),
    angle: 0,
    spinning: false,
    sectors: [
      { color: "#FF0000", label: "x100" },
      { color: "#FF6600", label: "x75" },
      { color: "#FF9900", label: "x50" },
      { color: "#FFCC00", label: "x25" },
      { color: "#FFFF00", label: "x20" },
      { color: "#CCFF00", label: "x10" },
      { color: "#99FF00", label: "x5" },
      { color: "#66FF00", label: "x3" },
      { color: "#33FF00", label: "x2" }
    ]
  }
];

function drawWheel(ctx, diameter, angle, sectors) {
  const radius = diameter / 2;
  const arc = (2 * Math.PI) / sectors.length;
  ctx.clearRect(0, 0, diameter, diameter);

  sectors.forEach((sector, i) => {
    const start = angle + i * arc;
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, start + arc);
    ctx.lineTo(radius, radius);
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(sector.label, radius - 10, 10);
    ctx.restore();
  });

  // Указатель
  const pointerOffset = -5;
  const pointerWidth = 30;
  const pointerHeight = 18;
  const baseY = radius - (diameter / 2) + pointerOffset;
  const apexY = baseY + pointerHeight;

  ctx.fillStyle = "#ffffff";

  ctx.beginPath();
  ctx.moveTo(radius - pointerWidth / 2, baseY);
  ctx.lineTo(radius + pointerWidth / 2, baseY);
  ctx.lineTo(radius, apexY);
  ctx.closePath();
  ctx.fill();
}

function spinAll() {
  if (wheels.some(w => w.spinning)) return;

  document.getElementById("result").textContent = "";

  wheels.forEach(wheel => {
    wheel.spinning = true;
    wheel.spinTime = 0;
    wheel.spinTimeTotal = Math.random() * 3000 + 4000;
    wheel.spinAngleStart = Math.random() * 10 + 10;
  });

  function animate() {
    let allStopped = true;

    wheels.forEach(wheel => {
      if (!wheel.spinning) return;

      wheel.spinTime += 30;
      if (wheel.spinTime >= wheel.spinTimeTotal) {
        wheel.spinning = false;
        return;
      }
      const spinAngle = wheel.spinAngleStart - easeOut(wheel.spinTime, 0, wheel.spinAngleStart, wheel.spinTimeTotal);
      wheel.angle += (spinAngle * Math.PI) / 180;

      allStopped = false;
    });

    wheels.forEach(wheel => {
      const ctx = wheel.canvas.getContext("2d");
      drawWheel(ctx, wheel.canvas.width, wheel.angle, wheel.sectors);
    });

    if (!allStopped) {
      requestAnimationFrame(animate);
    } else {
      const results = wheels.map(wheel => {
        const degrees = (wheel.angle * 180) / Math.PI + 90;
        const arcDeg = 360 / wheel.sectors.length;
        const index = Math.floor((wheel.sectors.length - (degrees % 360) / arcDeg) % wheel.sectors.length);
        return wheel.sectors[index].label;
      });

      document.getElementById("result").textContent = results.join(" ");
    }
  }

  requestAnimationFrame(animate);
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

wheels.forEach(wheel => {
  drawWheel(wheel.canvas.getContext("2d"), wheel.canvas.width, wheel.angle, wheel.sectors);
});

document.getElementById("spin").addEventListener("click", spinAll);
