import { useMemo } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
}

// Simple QR code generator using SVG patterns
// For production, use a library like qrcode.react
export const QRCode = ({ value, size = 200 }: QRCodeProps) => {
  const pattern = useMemo(() => {
    // Create a simple deterministic pattern from the value
    const hash = value.split("").reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    const cells: boolean[][] = [];
    const gridSize = 21; // Standard QR code size

    for (let i = 0; i < gridSize; i++) {
      cells[i] = [];
      for (let j = 0; j < gridSize; j++) {
        // Create finder patterns (corners)
        const isFinderPattern =
          (i < 7 && j < 7) || // Top-left
          (i < 7 && j >= gridSize - 7) || // Top-right
          (i >= gridSize - 7 && j < 7); // Bottom-left

        if (isFinderPattern) {
          // Finder pattern structure
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6 ||
            (j >= gridSize - 7 && (i === 0 || i === 6 || j === gridSize - 1 || j === gridSize - 7)) ||
            (i >= gridSize - 7 && (i === gridSize - 1 || i === gridSize - 7 || j === 0 || j === 6));
          const isInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
            (i >= 2 && i <= 4 && j >= gridSize - 5 && j <= gridSize - 3) ||
            (i >= gridSize - 5 && i <= gridSize - 3 && j >= 2 && j <= 4);
          cells[i][j] = isOuter || isInner;
        } else {
          // Data pattern based on hash
          cells[i][j] = ((hash * (i + 1) * (j + 1)) % 7) < 3;
        }
      }
    }

    return cells;
  }, [value]);

  const cellSize = size / 21;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg"
    >
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, i) =>
        row.map((cell, j) =>
          cell ? (
            <rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  );
};

export default QRCode;
