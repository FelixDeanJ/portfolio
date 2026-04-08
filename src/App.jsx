import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import "./App.css";
import xIcon from "./assets/x.png";
import discordIcon from "./assets/discord.png";
import robloxIcon from "./assets/roblox.png";

function App() {
  const [columns, setColumns] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);

  const CLOUD = "db1ir89rz";

  const projects = Array.from({ length: 20 }, (_, i) => ({
    image: `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_1200/portfolio/art_${i + 1}?v=${Date.now()}`,
  }));

  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w < 640) setColumns(1);
      else if (w < 768) setColumns(2);
      else if (w < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (currentIndex === null) return;

      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setCurrentIndex(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  const next = () => {
    setZoomed(false);
    setDrag({ x: 0, y: 0 });
    setCurrentIndex((i) => (i + 1) % projects.length);
  };

  const prev = () => {
    setZoomed(false);
    setDrag({ x: 0, y: 0 });
    setCurrentIndex((i) => (i - 1 + projects.length) % projects.length);
  };

  const handleZoom = (e) => {
    e.stopPropagation();

    if (!zoomed) {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomPos({ x, y });
      setZoomed(true);
    } else {
      setZoomed(false);
      setDrag({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = () => {
    dragging.current = true;
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!dragging.current || !zoomed) return;

    setDrag((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(270deg, #a855f7, #ec4899, #3b82f6)",
          backgroundSize: "600% 600%",
          animation: "gradientMove 20s ease infinite",
        }}
      />
      <div className="absolute inset-0 -z-10 backdrop-blur-3xl bg-black/40" />

      {/* MINIMAL ABOUT */}
      <div className="w-full max-w-3xl mx-auto px-6 pt-12 text-left space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Hi, I'm <span className="font-bold">Einster</span>
          <span className="text-white/50"> — you can call me Ein.</span>
        </h1>

        <p className="text-sm text-white/70 leading-relaxed">
          An illustrator passionate about experimenting with diverse art styles
          and turning imagination into expressive visuals. I also enjoy playing
          Roblox.
        </p>

        <p className="text-sm text-white/60">
          I’m open for commissions — feel free to reach out by clicking below,
          or on Discord (@7billion). I offer good prices („• ֊ •„)
        </p>

        <div className="flex pt-4 items-center gap-8">
          <a href="https://x.com/einsterr" target="_blank" className="group">
            <img
              src={xIcon}
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
              className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300"
            />
          </a>

          <a
            href="https://discord.com/users/259179304162689024"
            target="_blank"
            className="group"
          >
            <img
              src={discordIcon}
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
              className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300"
            />
          </a>

          <a
            href="https://www.roblox.com/users/138566116/profile"
            target="_blank"
            className="group"
          >
            <img
              src={robloxIcon}
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
              className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300"
            />
          </a>
        </div>
      </div>

      {/* GALLERY */}
      <div className="w-full px-4 py-8">
        <div style={{ columnCount: columns, columnGap: "16px" }}>
          {projects.map((item, i) => (
            <div key={i} style={{ marginBottom: "16px", breakInside: "avoid" }}>
              <Card
                onClick={() => {
                  setCurrentIndex(i);
                  setZoomed(false);
                }}
                className="cursor-pointer overflow-hidden bg-white/5 border-white/10"
              >
                <CardContent className="p-0">
                  <img
                    src={item.image}
                    alt=""
                    onError={(e) => (e.target.style.display = "none")}
                    className="block w-full h-auto align-top"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {currentIndex !== null && (
        <div
          onClick={() => setCurrentIndex(null)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "15%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(to right, rgba(0,0,0,0.4), transparent)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "44px", color: "#fff", opacity: 0.9 }}>
              ‹
            </span>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "15%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(to left, rgba(0,0,0,0.4), transparent)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "44px", color: "#fff", opacity: 0.9 }}>
              ›
            </span>
          </div>

          <img
            src={projects[currentIndex].image}
            alt=""
            onClick={handleZoom}
            onMouseDown={handleMouseDown}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              transform: `scale(${zoomed ? 2 : 1}) translate(${drag.x}px, ${drag.y}px)`,
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transition: dragging.current ? "none" : "transform 0.3s ease",
              cursor: zoomed ? "grab" : "zoom-in",
            }}
          />
        </div>
      )}
      {/* FOOTER */}
      <div className="w-full px-6 pb-12 pt-16 flex flex-col items-center text-center text-white/40 text-xs space-y-1">
        <div className="w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>

        <p className="tracking-wide leading-tight">
          © {new Date().getFullYear()} Einster
        </p>

        <p className="text-white/30 leading-tight">
          All artworks are original. Unauthorized use is prohibited.
        </p>

        <p className="text-white/20 text-[10px] tracking-widest uppercase leading-tight">
          Digital Illustration • Portfolio
        </p>
      </div>
    </div>
  );
}

export default App;
