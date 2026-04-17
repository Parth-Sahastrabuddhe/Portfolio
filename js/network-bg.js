(function initNetworkBg() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const NODE_COUNT = 28;
    const LINK_DISTANCE = 140;
    const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = false;
    let rafId = null;
    const nodes = [];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
        nodes.length = 0;
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.18,
                vy: (Math.random() - 0.5) * 0.18,
                pulse: 0
            });
        }
    }

    function themeColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light'
            ? { r: 79, g: 70, b: 229, nodeA: 0.42, linkMul: 0.16 }
            : { r: 129, g: 140, b: 248, nodeA: 0.55, linkMul: 0.22 };
    }

    function draw() {
        const c = themeColor();
        ctx.clearRect(0, 0, width, height);

        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -10) n.x = width + 10;
            else if (n.x > width + 10) n.x = -10;
            if (n.y < -10) n.y = height + 10;
            else if (n.y > height + 10) n.y = -10;
            n.pulse *= 0.94;
        }

        if (Math.random() < 0.012) {
            nodes[Math.floor(Math.random() * nodes.length)].pulse = 1;
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distSq = dx * dx + dy * dy;
                if (distSq < LINK_DISTANCE_SQ) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / LINK_DISTANCE) * c.linkMul;
                    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha.toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        for (const n of nodes) {
            const r = 2 + n.pulse * 3.5;
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.nodeA})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fill();
            if (n.pulse > 0.08) {
                const haloA = (n.pulse * 0.22).toFixed(3);
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${haloA})`;
                ctx.beginPath();
                ctx.arc(n.x, n.y, r + n.pulse * 14, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function tick() {
        if (!running) return;
        draw();
        rafId = requestAnimationFrame(tick);
    }

    function start() {
        if (running) return;
        running = true;
        tick();
    }

    function stop() {
        running = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    resize();
    initNodes();

    if (reduced) {
        draw();
    } else {
        start();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            initNodes();
            if (reduced) draw();
        }, 150);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else if (!reduced) start();
    });
})();
