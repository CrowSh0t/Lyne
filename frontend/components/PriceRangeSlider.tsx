import { useCallback, useRef, useState, CSSProperties } from "react";

const MIN = 50;
const MAX = 5000;
const STEP = 1;

type HandleType = "min" | "max" | null;

export default function PriceRangeSlider() {
  const [minVal, setMinVal] = useState<number>(50);
  const [maxVal, setMaxVal] = useState<number>(5000);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<HandleType>(null);

  const percent = (val: number) => ((val - MIN) / (MAX - MIN)) * 100;
  const clamp = (val: number) => Math.min(Math.max(val, MIN), MAX);

  const valueFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return MIN;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const raw = MIN + ratio * (MAX - MIN);
    const stepped = Math.round(raw / STEP) * STEP;
    return clamp(stepped);
  }, []);

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
      const val = valueFromClientX(clientX);

      if (draggingRef.current === "min") {
        setMinVal(Math.min(val, maxVal - STEP));
      } else {
        setMaxVal(Math.max(val, minVal + STEP));
      }
    },
    [minVal, maxVal, valueFromClientX]
  );

  const stopDragging = useCallback(() => {
    draggingRef.current = null;
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("mouseup", stopDragging);
    window.removeEventListener("touchmove", handlePointerMove);
    window.removeEventListener("touchend", stopDragging);
  }, [handlePointerMove]);

  const startDragging = (handle: HandleType) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    draggingRef.current = handle;
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", stopDragging);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.trackWrapper} ref={trackRef}>
        <div style={styles.trackBase} />
        <div
          style={{
            ...styles.trackActive,
            left: `${percent(minVal)}%`,
            width: `${percent(maxVal) - percent(minVal)}%`,
          }}
        />
        <div
          role="slider"
          aria-label="Minimum price"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={minVal}
          tabIndex={0}
          style={{ ...styles.handle, left: `${percent(minVal)}%` }}
          onMouseDown={startDragging("min")}
          onTouchStart={startDragging("min")}
        />
        <div
          role="slider"
          aria-label="Maximum price"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={maxVal}
          tabIndex={0}
          style={{ ...styles.handle, left: `${percent(maxVal)}%` }}
          onMouseDown={startDragging("max")}
          onTouchStart={startDragging("max")}
        />
      </div>

      <div style={styles.labels}>
        <span style={styles.labelBox}>{minVal}$</span>
        <span style={styles.labelBox}>{maxVal}$</span>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    width: "100%",
    maxWidth: 520,
    padding: "24px 8px 8px",
    fontFamily: "sans-serif",
  },
  trackWrapper: {
    position: "relative",
    height: 20,
    display: "flex",
    alignItems: "center",
  },
  trackBase: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    background: "#000",
  },
  trackActive: {
    position: "absolute",
    height: 1,
    background: "#000",
  },
  handle: {
    position: "absolute",
    width: 12,
    height: 12,
    background: "#8c8c8c",
    transform: "translateX(-50%)",
    cursor: "pointer",
    touchAction: "none",
  },
  labels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
  },
  labelBox: {
    border: "1px solid #d9d9d9",
    borderRadius: 4,
    padding: "4px 10px",
    fontSize: 13,
    color: "#333",
    minWidth: 48,
    textAlign: "center",
  },
};