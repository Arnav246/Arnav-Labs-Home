/* ==========================================================
   Arnav Labs V3
   Part 1
   Canvas Background Engine
   ========================================================== */

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

const DPR = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {

    canvas.width = innerWidth * DPR;
    canvas.height = innerHeight * DPR;

    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ==========================================================
   Mouse
   ========================================================== */

const mouse = {

    x: innerWidth / 2,
    y: innerHeight / 2,

    tx: innerWidth / 2,
    ty: innerHeight / 2

};

window.addEventListener("mousemove", e => {

    mouse.tx = e.clientX;
    mouse.ty = e.clientY;

});

/* ==========================================================
   Wave Layers
   ========================================================== */

const ribbons = [];

function createRibbons(){

    ribbons.length = 0;

    const pageHeight =
        document.documentElement.scrollHeight;

    const count = Math.max(
        16,
        Math.floor(pageHeight / 260)
    );

    for(let i=0;i<count;i++){

        ribbons.push({

            y:
                (i+1)/(count+1),

            amplitude:
                18 + Math.random()*32,

            spacing:
                8 + Math.random()*6,

            speed:
                .00012 + Math.random()*.00012,

            radius:
                1.1 + Math.random()*1.3,

            alpha:
                .08 + Math.random()*.14,

            parallax:
                .006 + Math.random()*.010,

            phase:
                Math.random()*Math.PI*2

        });

    }

}

createRibbons();

window.addEventListener(
    "resize",
    createRibbons
);

/* ==========================================================
   Helpers
   ========================================================== */

function lerp(a,b,t){

    return a+(b-a)*t;

}

function circle(x,y,r,a){

    ctx.beginPath();

    ctx.fillStyle = `rgba(110,180,255,${a})`;

    ctx.arc(x,y,r,0,Math.PI*2);

    ctx.fill();
}


/* ==========================================================
   Main Loop
   ========================================================== */

function render(time){

    mouse.x=lerp(mouse.x,mouse.tx,.045);
    mouse.y=lerp(mouse.y,mouse.ty,.045);

    ctx.clearRect(0,0,innerWidth,innerHeight);
    /* ==========================================================
   Ribbon Background
   ========================================================== */

const pageHeight =
document.documentElement.scrollHeight;

ctx.fillStyle = "rgba(109,179,255,.16)";

ribbons.forEach(ribbon=>{

    const worldY =
        ribbon.y * pageHeight;

    const baseY =
        worldY - window.scrollY;

    if(
        baseY < -180 ||
        baseY > innerHeight + 180
    ) return;

    for(
        let x=-100;
        x<innerWidth+100;
        x+=ribbon.spacing
    ){

        const y =
            baseY +

            Math.sin(
                x*.004 +
                time*ribbon.speed +
                ribbon.phase
            ) * ribbon.amplitude +

            Math.cos(
                x*.009 +
                ribbon.phase
            ) * 12;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            ribbon.radius,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

});

    /* Hero Glow */

    const glow=ctx.createRadialGradient(

        mouse.x,
        mouse.y,

        0,

        mouse.x,
        mouse.y,

        340

    );

    glow.addColorStop(
        0,
        "rgba(95,170,255,.12)"
    );

    glow.addColorStop(
        1,
        "rgba(95,170,255,0)"
    );

    ctx.fillStyle=glow;

    ctx.fillRect(
        0,
        0,
        innerWidth,
        innerHeight
    );

    /* Waves */

    
    /* Tiny floating stars */

    for(

        let i=0;

        i<45;

        i++

    ){

        const x=

        (i*287)%innerWidth;

        const y=

        ((i*173)+time*.01)

        %innerHeight;

        circle(

            x,

            y,

            .8,

            .035

        );

    }

    requestAnimationFrame(render);

}

requestAnimationFrame(render);

/* ==========================================================
   End of Part 1
   Part 2 continues below...
   ========================================================== */

/* ==========================================================
   Arnav Labs V3
   Part 2
   Interactions & Premium Animations
   ========================================================== */

/* ==========================================================
   Hero Reveal
   ========================================================== */

const heroTimeline = [
    ".badge",
    ".hero h1",
    ".hero p",
    ".hero-scroll"
];

heroTimeline.forEach((selector, index) => {

    const element = document.querySelector(selector);

    if (!element) return;

    element.animate(
        [
            {
                opacity: 0,
                transform: "translateY(30px)"
            },
            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],
        {
            duration: 900,
            delay: index * 180,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "forwards"
        }
    );

});

/* ==========================================================
   Logo Float + Mouse Parallax
   ========================================================== */

const brandLogo = document.querySelector(".brand img");

if (brandLogo) {

    let lx = 0;
    let ly = 0;

    function animateLogo() {

        const tx =
            (mouse.x - innerWidth / 2) * 0.012;

        const ty =
            (mouse.y - innerHeight / 2) * 0.012;

        lx = lerp(lx, tx, 0.08);
        ly = lerp(ly, ty, 0.08);

        const floating =
            Math.sin(performance.now() * 0.0012) * 4;

        brandLogo.style.transform =
            `translate(${lx}px,${ly + floating}px)`;

        requestAnimationFrame(animateLogo);

    }

    animateLogo();

}

/* ==========================================================
   Premium Card Interaction
   ========================================================== */

document.querySelectorAll(".card").forEach(card => {

    let rx = 0;
    let ry = 0;

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x =
            (e.clientX - rect.left) / rect.width;

        const y =
            (e.clientY - rect.top) / rect.height;

        card.style.setProperty(
            "--mx",
            `${x * 100}%`
        );

        card.style.setProperty(
            "--my",
            `${y * 100}%`
        );

        const targetY =
            (x - .5) * 7;

        const targetX =
            (0.5 - y) * 7;

        rx = targetX;
        ry = targetY;

        card.style.transform =
            `
            perspective(1200px)
            rotateX(${rx}deg)
            rotateY(${ry}deg)
            translateY(-8px)
            `;
    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)";

    });

});

/* ==========================================================
   Scroll Reveal
   ========================================================== */

const revealObserver =
new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting)
            return;

        entry.target.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(40px) scale(.98)",
                    filter:
                        "blur(8px)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0px) scale(1)",
                    filter:
                        "blur(0px)"
                }
            ],
            {
                duration: 900,
                easing:
                    "cubic-bezier(.2,.8,.2,1)",
                fill: "forwards"
            }
        );

        revealObserver.unobserve(entry.target);

    });

},
{
    threshold: .18
});

document
.querySelectorAll(
".card,.future,.section-title"
)
.forEach(el => {

    el.style.opacity = 0;

    revealObserver.observe(el);

});

/* ==========================================================
   Navbar Glass
   ========================================================== */

const navbar =
document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {

        navbar.style.background =
            "rgba(8,12,20,.72)";

        navbar.style.backdropFilter =
            "blur(18px)";

        navbar.style.borderRadius =
            "24px";

        navbar.style.padding =
            "0 24px";

        navbar.style.border =
            "1px solid rgba(255,255,255,.05)";

    }

    else {

        navbar.style.background =
            "transparent";

        navbar.style.backdropFilter =
            "none";

        navbar.style.border =
            "none";

        navbar.style.padding =
            "0";

    }

});

/* ==========================================================
   Play Button Hover
   ========================================================== */

document
.querySelectorAll(".play")
.forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.animate(
            [
                {
                    transform:
                        "scale(1)"
                },
                {
                    transform:
                        "scale(1.05)"
                }
            ],
            {
                duration: 180,
                fill: "forwards"
            }
        );

    });

    button.addEventListener("mouseleave", () => {

        button.animate(
            [
                {
                    transform:
                        "scale(1.05)"
                },
                {
                    transform:
                        "scale(1)"
                }
            ],
            {
                duration: 180,
                fill: "forwards"
            }
        );

    });

});

/* ==========================================================
   Footer Watermark Parallax
   ========================================================== */

const watermark =
document.querySelector(".footer-watermark");

if (watermark) {

    window.addEventListener("mousemove", e => {

        const x =
            (e.clientX / innerWidth - .5) * 18;

        const y =
            (e.clientY / innerHeight - .5) * 10;

        watermark.style.transform =
            `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

    });

}

/* ==========================================================
   Ambient Hero Pulse
   ========================================================== */

const glow =
document.querySelector(".hero-glow");

if (glow) {

    function pulse() {

        const scale =
            1 +
            Math.sin(performance.now() * 0.0004)
            * .05;

        glow.style.transform =
            `scale(${scale})`;

        requestAnimationFrame(pulse);

    }

    pulse();

}

/* ==========================================================
   Finished
   ========================================================== */

console.log(
    "%cArnav Labs v3 Loaded",
    "color:#6db3ff;font-size:18px;font-weight:bold;"
);
``