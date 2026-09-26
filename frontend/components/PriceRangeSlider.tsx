import { useCallback, useEffect, useRef, useState, CSSProperties } from "react";

const MIN = 50;
const MAX = 50000;
const STEP = 1;

type HandleType = "min" | "max" | null;

export default function PriceRangeSlider({
  onChange,
}: {
  onChange?: (min: number, max: number) => void;
}) {
  const [minVal, setMinVal] = useState<number>(50);
  const [maxVal, setMaxVal] = useState<number>(5000);
  // Локальні текстові значення інпутів — окремо від minVal/maxVal,
  // щоб можна було тимчасово мати "невалідний" текст під час набору (наприклад, пустий рядок)
  const [minInput, setMinInput] = useState<string>(String(MIN));
  const [maxInput, setMaxInput] = useState<string>(String(MAX));

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<HandleType>(null);

  const percent = (val: number) => ((val - MIN) / (MAX - MIN)) * 100;
  const clamp = (val: number) => Math.min(Math.max(val, MIN), MAX);

  useEffect(() => {
    onChange?.(minVal, maxVal);
    // Синхронізуємо текстові поля щоразу, коли значення змінюється через слайдер
    setMinInput(String(minVal));
    setMaxInput(String(maxVal));
  }, [minVal, maxVal]);

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

  // Введення в поле "Min" — дозволяємо вільно друкувати, валідуємо тільки при втраті фокусу / Enter
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
  };

  const commitMinInput = () => {
    const parsed = Number(minInput);
    if (Number.isNaN(parsed)) {
      setMinInput(String(minVal));
      return;
    }
    const clamped = clamp(Math.min(parsed, maxVal - STEP));
    setMinVal(clamped);
    setMinInput(String(clamped));
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
  };

  const commitMaxInput = () => {
    const parsed = Number(maxInput);
    if (Number.isNaN(parsed)) {
      setMaxInput(String(maxVal));
      return;
    }
    const clamped = clamp(Math.max(parsed, minVal + STEP));
    setMaxVal(clamped);
    setMaxInput(String(clamped));
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

      {/* Числові поля вводу замість статичних лейблів */}
      <div style={styles.labels}>
        <div style={styles.inputGroup}>
          <input
            type="number"
            min={MIN}
            max={MAX}
            value={minInput}
            onChange={handleMinInputChange}
            onBlur={commitMinInput}
            onKeyDown={(e) => e.key === 'Enter' && commitMinInput()}
            style={styles.numberInput}
            aria-label="Minimum price input"
          />
          <span style={styles.dollarSign}>$</span>
        </div>

        <div style={styles.inputGroup}>
          <input
            type="number"
            min={MIN}
            max={MAX}
            value={maxInput}
            onChange={handleMaxInputChange}
            onBlur={commitMaxInput}
            onKeyDown={(e) => e.key === 'Enter' && commitMaxInput()}
            style={styles.numberInput}
            aria-label="Maximum price input"
          />
          <span style={styles.dollarSign}>$</span>
        </div>
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
    gap: 12,
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d9d9d9",
    borderRadius: 4,
    padding: "4px 10px",
    minWidth: 64,
  },
  numberInput: {
    width: 48,
    border: "none",
    outline: "none",
    fontSize: 13,
    color: "#333",
    textAlign: "right",
    // Прибираємо стрілочки в number-інпуті для чистішого вигляду
    MozAppearance: "textfield",
  },
  dollarSign: {
    fontSize: 13,
    color: "#333",
    marginLeft: 2,
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