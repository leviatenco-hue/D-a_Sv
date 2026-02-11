document.addEventListener('DOMContentLoaded', () => {
    // MODIFICA TU FECHA AQUÍ: (Año, Mes[0-11], Día, Hora, Minuto)
    const fechaInicio = new Date(2016, 10, 1, 0, 0, 0); 
    
    const btn = document.getElementById('btn-corazon');
    let tCtx, pCtx, tCanvas, pCanvas;
    let petalos = [];
    let viento = 0;
    const colores = ['#ff4d6d', '#ff758f', '#c9184a', '#ff8fa3'];

    function actualizarReloj() {
        const ahora = new Date();
        const inicio = fechaInicio;
        let anos = ahora.getFullYear() - inicio.getFullYear();
        let meses = ahora.getMonth() - inicio.getMonth();
        let dias = ahora.getDate() - inicio.getDate();

        if (dias < 0) {
            meses--;
            const ultimoDiaMesPasado = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
            dias += ultimoDiaMesPasado;
        }
        if (meses < 0) {
            anos--;
            meses += 12;
        }

        const diffMs = ahora - inicio;
        const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diffMs / 1000 / 60) % 60);
        const s = Math.floor((diffMs / 1000) % 60);

        document.getElementById('reloj').innerHTML = 
            `${anos} años, ${meses} meses, ${dias} días<br>${h}h ${m}m ${s}s`;
    }

    function dibujarCorazon(ctx, x, y, size, color, rot) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.beginPath(); ctx.fillStyle = color;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -size/2, -size, -size/2, -size, 0);
        ctx.bezierCurveTo(-size, size/1.5, 0, size, 0, size);
        ctx.bezierCurveTo(0, size, size, size/1.5, size, 0);
        ctx.bezierCurveTo(size, -size/2, 0, -size/2, 0, 0);
        ctx.fill(); ctx.restore();
    }

    function crearRama(x, y, angulo, extension, grosor, iteracion) {
        if (iteracion > 6) return;
        const x2 = x + Math.cos(angulo) * extension;
        const y2 = y + Math.sin(angulo) * extension;
        tCtx.strokeStyle = "#3d2b26"; 
        tCtx.lineWidth = grosor; tCtx.lineCap = "round";
        tCtx.beginPath(); tCtx.moveTo(x, y); tCtx.lineTo(x2, y2); tCtx.stroke();

        if (iteracion >= 2) {
            for(let i=0; i<4; i++) {
                setTimeout(() => {
                    const tam = Math.random()*5+3;
                    const hX = x2 + (Math.random()*40-20);
                    const hY = y2 + (Math.random()*40-20);
                    const col = colores[Math.floor(Math.random()*colores.length)];
                    dibujarCorazon(tCtx, hX, hY, tam, col, Math.random()*Math.PI);
                    if (Math.random() > 0.75) {
                        petalos.push({ x: hX, y: hY, vy: Math.random()*1.2+0.5, size: tam, color: col, osc: Math.random()*100 });
                    }
                }, i * 150);
            }
        }
        setTimeout(() => {
            crearRama(x2, y2, angulo - 0.35, extension * 0.78, grosor * 0.7, iteracion + 1);
            crearRama(x2, y2, angulo + 0.35, extension * 0.78, grosor * 0.7, iteracion + 1);
        }, 120);
    }

    function animar() {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        viento = Math.sin(Date.now() * 0.001) * 1.5;
        petalos.forEach(p => {
            p.y += p.vy;
            p.x += Math.sin(p.osc + p.y / 25) * 0.7 + (viento * 0.2);
            dibujarCorazon(pCtx, p.x, p.y, p.size, p.color, p.y/60);
            if (p.y > pCanvas.height) { p.y = -15; p.x = Math.random() * pCanvas.width; }
        });
        requestAnimationFrame(animar);
    }

    btn.addEventListener('click', () => {
        document.getElementById('pantalla-inicio').classList.add('hidden');
        document.getElementById('contenedor-final').classList.remove('hidden');
        setInterval(actualizarReloj, 1000);

        setTimeout(() => {
            tCanvas = document.getElementById('treeCanvas');
            pCanvas = document.getElementById('petalCanvas');
            tCtx = tCanvas.getContext('2d'); pCtx = pCanvas.getContext('2d');
            tCanvas.width = pCanvas.width = tCanvas.parentElement.clientWidth;
            tCanvas.height = pCanvas.height = tCanvas.parentElement.clientHeight;

            crearRama(tCanvas.width/2, tCanvas.height - 30, -Math.PI/2, tCanvas.height/7, 7, 0);
            animar();

            setTimeout(() => {
                document.getElementById('main-layout').classList.add('split-mode');
                // TU POEMA AQUÍ
                const poema = "No te quiero por un día, ni por una eternidad vacía,\nte quiero en el tictac que nos construye.\nEn la calma del café mientras amanece el día,\ny en la sombra que el reloj nos sustituye.\n\nNuestro amor no es un rayo, es una hoguera,\nque se alimenta de inviernos y de espera.\nEl tiempo no nos quita, nos regala el derecho\nde habitar, para siempre, el uno en el otro pecho.";
                
                let i = 0;
                const interval = setInterval(() => {
                    document.getElementById('poema-escrito').innerHTML += poema.charAt(i);
                    i++; if(i >= poema.length) clearInterval(interval);
                }, 45);
            }, 3500);
        }, 300);
    });
});
                                     
