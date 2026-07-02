import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function EmployeeQRCard({ employee }) {
  const canvasWrapRef = useRef(null);

  const downloadPng = () => {
    const canvas = canvasWrapRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${employee.full_name.replace(/\s+/g, "_")}_QR.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center bg-panel border border-line rounded-card p-4">
      <div ref={canvasWrapRef}>
        <QRCodeCanvas value={employee.qr_token} size={140} level="M" includeMargin />
      </div>
      <p className="mt-2 font-medium text-ink text-sm text-center">{employee.full_name}</p>
      {employee.department && <p className="text-xs text-ink/50">{employee.department}</p>}
      <button
        onClick={downloadPng}
        className="mt-3 text-xs font-medium text-brand underline"
      >
        PNG indir
      </button>
    </div>
  );
}
