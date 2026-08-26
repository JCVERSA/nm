import { useEffect, useRef } from "react";
import { createLayout, stagger } from "animejs";

export default function GridLayoutAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const layout = createLayout(containerRef.current);
    let running = true;

    function animateLayout() {
      if (!running) return;
      layout.update(({ root }: any) => {
        root.dataset.grid = ((++iRef.current % 4) + 1) as any;
      }, {
        duration: 1000,
        delay: stagger(150),
        onComplete: () => animateLayout(),
      });
    }
    animateLayout();
    return () => { running = false; };
  }, []);

  return (
    <div id="layout" className="large layout centered row">
      <style>{`
        #layout { padding: 2rem; }
        .layout-container { display: grid; gap: 1rem; }
        #layout .grid-layout { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; }
        #layout [data-grid="2"] { grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; }
        #layout [data-grid="3"] .item:nth-child(4) { grid-column: 1; grid-row: 1; }
        #layout [data-grid="3"] .item:nth-child(3) { grid-column: 2; grid-row: 1 / 3; }
        #layout [data-grid="3"] .item:nth-child(2) { grid-column: 1; grid-row: 2 / 4; }
        #layout [data-grid="3"] .item:nth-child(1) { grid-column: 2; grid-row: 3; }
        #layout [data-grid="4"] { grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; }
        #layout [data-grid="1"] .item:nth-child(1) { grid-column: 1; grid-row: 1 / 3; }
        #layout [data-grid="1"] .item:nth-child(2) { grid-column: 2; grid-row: 1; }
        #layout [data-grid="1"] .item:nth-child(3) { grid-column: 1; grid-row: 3; }
        #layout [data-grid="1"] .item:nth-child(4) { grid-column: 2; grid-row: 2 / 4; }
        #layout [data-grid="2"] .item:nth-child(1), #layout [data-grid="2"] .item:nth-child(4) { grid-row: 1 / 3; }
        #layout [data-grid="4"] .item:nth-child(1) { grid-column: 1; grid-row: 1; }
        #layout [data-grid="4"] .item:nth-child(2) { grid-column: 1; grid-row: 2; }
        #layout [data-grid="4"] .item:nth-child(3), #layout [data-grid="4"] .item:nth-child(4) { grid-row: 1 / 3; }
        .item { background: linear-gradient(135deg, #312e81, #4f46e5); color: white; font-weight: 800; border-radius: 1rem; padding: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; box-shadow: 0 10px 30px rgba(124,58,237,0.35); transition: transform 0.3s ease; }
        .item:hover { transform: translateY(-4px); }
      `}</style>
      <div ref={containerRef} className="layout-container col grid-layout" data-grid={1}>
        {[
          "Item A",
          "Item B",
          "Item C",
          "Item D",
        ].map((label) => (
          <div key={label} className="item">{label}</div>
        ))}
      </div>
    </div>
  );
}
