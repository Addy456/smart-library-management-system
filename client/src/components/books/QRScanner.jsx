import { useState, useRef, useCallback, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { issueBook, returnByQR } from "../../redux/slices/borrowSlice";
import toast from "react-hot-toast";
import { X as FiX, Camera as FiCamera, Download, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// ─── Portal wrapper ────────────────────────────────────────────
// Renders children into #modal-root so the modal escapes any ancestor
// stacking context (transform, opacity, will-change) that breaks
// `position: fixed` centering.
const ModalPortal = ({ children }) => {
  const container = document.getElementById("modal-root") || document.body;
  return createPortal(children, container);
};

// ─── Scan-line animation keyframes (injected once) ─────────────
const SCANLINE_STYLE_ID = "qr-scanline-style";
if (typeof document !== "undefined" && !document.getElementById(SCANLINE_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = SCANLINE_STYLE_ID;
  style.textContent = `
    @keyframes qr-scanline {
      0%   { top: 0; }
      50%  { top: calc(100% - 4px); }
      100% { top: 0; }
    }
    .qr-scanline-anim {
      animation: qr-scanline 2.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

// ─── Helper: convert SVG QR to PNG data-URL ────────────────────
const qrSvgToPngDataUrl = (svgElement, size = 400) =>
  new Promise((resolve) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      const canvas = Object.assign(document.createElement("canvas"), { width: size, height: size });
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  });

// ─── QR display for a single book (shown to admins) ────────────
export const BookQRCode = ({ book }) => {
  const [show, setShow] = useState(false);
  const qrRef = useRef(null);

  // Only need _id to generate the QR
  if (!book._id) return null;

  const handleDownload = async () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const dataUrl = await qrSvgToPngDataUrl(svg, 400);
    const a = Object.assign(document.createElement("a"), {
      href: dataUrl,
      download: `QR-${book.title?.replace(/[^a-zA-Z0-9]/g, "_") || book._id}.png`,
    });
    a.click();
  };

  const handlePrint = async () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const dataUrl = await qrSvgToPngDataUrl(svg, 300);
    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><title>Print QR — ${book.title || ""}</title>
      <style>
        body { margin: 0; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 24px; padding: 24px; font-family: system-ui, sans-serif; }
        .qr-card { text-align: center; page-break-inside: avoid; }
        .qr-card img { width: 180px; height: 180px; }
        .qr-card p { margin: 6px 0 0; font-size: 11px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        @media print { body { gap: 16px; padding: 12px; } .qr-card img { width: 140px; height: 140px; } }
      </style></head><body>
      ${Array(8).fill(`<div class="qr-card"><img src="${dataUrl}" alt="QR"/><p>${book.title || book._id}</p></div>`).join("")}
      </body></html>
    `);
    win.document.close();
    win.onafterprint = () => win.close();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        title="View QR Code"
      >
        <FiCamera className="w-3.5 h-3.5" /> QR
      </button>

      {show && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShow(false)}
          >
            <div className="bg-white dark:bg-surface-100 rounded-2xl p-6 shadow-xl max-w-xs w-full text-center">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Book QR Code</h3>
                <button
                  onClick={() => setShow(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {book.title}
              </p>
              {/* Render SVG QR code from the book's ID */}
              <div ref={qrRef} className="flex justify-center mb-4">
                <QRCodeSVG
                  value={book._id}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#4f46e5"
                  level="M"
                />
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-lg px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-lg px-3 py-2 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Grid
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Scan to quickly issue or return this book
              </p>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

// ─── Floating action button for QR scanner on member dashboard ─
export const QRScannerFAB = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
    title="Scan QR Code"
    aria-label="Open QR Scanner"
    style={{ minWidth: "56px", minHeight: "56px" }}
  >
    <FiCamera className="text-2xl" />
  </button>
);

// ─── Scanner viewfinder overlay ────────────────────────────────
const ScannerOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="w-56 h-56 relative">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-7 h-7 border-t-[3px] border-l-[3px] border-indigo-400 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-7 h-7 border-t-[3px] border-r-[3px] border-indigo-400 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[3px] border-l-[3px] border-indigo-400 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[3px] border-r-[3px] border-indigo-400 rounded-br-lg" />
      {/* Animated scan line */}
      <div className="absolute left-2 right-2 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full qr-scanline-anim" />
    </div>
  </div>
);

// ─── QR Scanner panel ──────────────────────────────────────────
// Camera + manual entry with issue/return support.
// Rendered via portal so it always centres correctly.
const QRScanner = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [manualId, setManualId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState("issue");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Unique ID per mount — no duplicate DOM IDs
  const reactId = useId();
  const qrContainerId = `qr-reader-${reactId.replace(/:/g, "")}`;

  const scannerInstanceRef = useRef(null);
  const isStartingRef = useRef(false);
  const lastScannedRef = useRef("");
  const RESCAN_DELAY_MS = 3000;

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Deduplicated scan handler
  const handleScanSuccess = useCallback(
    async (decodedText) => {
      if (lastScannedRef.current === decodedText) return;
      lastScannedRef.current = decodedText;

      const bookId = decodedText.trim();
      if (!bookId) return;

      setManualId(bookId);
      setProcessing(true);

      const result = mode === "return"
        ? await dispatch(returnByQR(bookId))
        : await dispatch(issueBook(bookId));

      setProcessing(false);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(mode === "return" ? "Book returned via QR!" : "Book issued via QR!");
        setManualId("");
        lastScannedRef.current = "";
        onClose?.();
      } else {
        toast.error(result.payload || `Failed to ${mode} book`);
        setTimeout(() => { lastScannedRef.current = ""; }, RESCAN_DELAY_MS);
      }
    },
    [dispatch, mode, onClose]
  );

  // Safely stop + clear the scanner instance
  const stopCamera = useCallback(async () => {
    const scanner = scannerInstanceRef.current;
    if (scanner) {
      try {
        const state = scanner.getState?.();
        if (state === 2 || state === 3) await scanner.stop();
      } catch { /* already stopped */ }
      try {
        scanner.clear();
      } catch { /* container already empty */ }
      scannerInstanceRef.current = null;
    }
    isStartingRef.current = false;
    setCameraActive(false);
  }, []);

  // Start camera scanner — called from useEffect AFTER container renders
  const startCamera = useCallback(async () => {
    if (isStartingRef.current || scannerInstanceRef.current) return;
    isStartingRef.current = true;
    setCameraError("");

    try {
      // ── Step 1: Pre-check camera access ──────────────────────
      let preCheckStream;
      try {
        preCheckStream = await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (mediaErr) {
        const msg = mediaErr.toString();
        if (msg.includes("NotAllowed") || msg.includes("Permission")) {
          setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (msg.includes("NotFound")) {
          setCameraError("No camera found on this device.");
        } else if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
          setCameraError("Camera requires HTTPS. On mobile, use an HTTPS tunnel (e.g. npx localtunnel --port 5173).");
        } else {
          setCameraError("Camera not available. Use manual entry below.");
        }
        isStartingRef.current = false;
        setCameraActive(false);
        return;
      } finally {
        preCheckStream?.getTracks().forEach((t) => t.stop());
      }

      // ── Step 2: Import library ───────────────────────────────
      const { Html5Qrcode } = await import("html5-qrcode");

      // ── Step 3: Let the browser finish painting ──────────────
      // Container is already in DOM (useEffect runs after render),
      // but we give the browser one extra frame + 300ms to finish
      // layout so html5-qrcode measures the right dimensions.
      await new Promise((r) => setTimeout(r, 300));

      const container = document.getElementById(qrContainerId);
      if (!container) {
        setCameraError("Scanner container not found. Please try again.");
        isStartingRef.current = false;
        setCameraActive(false);
        return;
      }

      // Clear stale content from any previous attempt
      container.innerHTML = "";

      // ── Step 4: Start scanner ────────────────────────────────
      const scanner = new Html5Qrcode(qrContainerId);
      scannerInstanceRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
        },
        handleScanSuccess,
        () => {} // ignore non-QR frames
      );

      // ── Step 5: Force video to fill container ────────────────
      setTimeout(() => {
        const video = container.querySelector("video");
        if (video) {
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "cover";
        }
      }, 300);
    } catch (err) {
      console.error("QR scanner start failed:", err);
      setCameraError(
        err.toString().includes("NotAllowed")
          ? "Camera permission denied. Please allow camera access."
          : "Camera failed to start. Use manual entry below."
      );
      setCameraActive(false);
      if (scannerInstanceRef.current) {
        try { scannerInstanceRef.current.clear(); } catch { /* ignore */ }
        scannerInstanceRef.current = null;
      }
    }
    isStartingRef.current = false;
  }, [handleScanSuccess, qrContainerId]);

  // When cameraActive becomes true → container renders → this
  // effect fires → startCamera runs with DOM guaranteed present.
  useEffect(() => {
    if (!cameraActive) return;
    startCamera();
  }, [cameraActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const handleManualAction = async () => {
    const bookId = manualId.trim();
    if (!bookId) {
      toast.error("Please enter a book ID");
      return;
    }
    setProcessing(true);

    const result = mode === "return"
      ? await dispatch(returnByQR(bookId))
      : await dispatch(issueBook(bookId));

    setProcessing(false);
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(mode === "return" ? "Book returned successfully!" : "Book issued successfully!");
      setManualId("");
      onClose?.();
    } else {
      toast.error(result.payload || `Failed to ${mode} book`);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose?.();
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div className="bg-white dark:bg-surface-100 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">📷 QR Issue / Return</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 mb-4">
            <button
              onClick={() => setMode("issue")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "issue"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800"
              }`}
            >
              Issue Book
            </button>
            <button
              onClick={() => setMode("return")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === "return"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800"
              }`}
            >
              Return Book
            </button>
          </div>

          {user?.role === "admin" && mode === "return" && (
            <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg px-3 py-2 mb-3">
              Admin mode: can return any user&apos;s book
            </p>
          )}

          {/* Camera scanner area */}
          <div className="mb-4">
            {!cameraActive ? (
              <button
                onClick={() => setCameraActive(true)}
                className="w-full bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <FiCamera className="text-3xl text-indigo-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Tap to open camera scanner
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Point at a book&apos;s QR code
                </p>
              </button>
            ) : (
              /* Scanner container — only mounted when cameraActive is
                 true so useEffect + startCamera always find the DOM. */
              <div
                id={qrContainerId}
                className="w-full h-[260px] bg-black rounded-xl overflow-hidden"
              />
            )}
            {cameraActive && (
              <div className="relative -mt-[260px] h-[260px] pointer-events-none z-10">
                <ScannerOverlay />
              </div>
            )}

            {cameraActive && (
              <button
                onClick={stopCamera}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Stop camera
              </button>
            )}

            {cameraError && (
              <p className="text-xs text-red-500 mt-2">{cameraError}</p>
            )}
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-surface-100 px-3 text-xs text-gray-400">
                or enter manually
              </span>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Book ID
          </label>
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Paste book ID here…"
            className="w-full border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm bg-white dark:bg-surface-200 text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 outline-none mb-3"
            onKeyDown={(e) => e.key === "Enter" && handleManualAction()}
          />
          <button
            onClick={handleManualAction}
            disabled={processing}
            className={`w-full text-white py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors ${
              mode === "return"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {processing
              ? "Processing…"
              : mode === "return"
                ? "Return Book"
                : "Issue Book"}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};

export default QRScanner;
