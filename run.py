#!/usr/bin/env python3
"""
MediSense AI — Single-Command Development Server
Launches both FastAPI Backend (port 8000) and Vite Frontend (port 5173) simultaneously,
and automatically opens the dashboard interface in your default browser.

Usage:
    python run.py
    run.bat
    npm start
"""

import os
import sys
import time
import signal
import shutil
import webbrowser
import subprocess
import threading
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def free_port_if_in_use(port: int):
    """If a port is already occupied on Windows from an old run, terminate that process."""
    if sys.platform != "win32":
        return
    try:
        cmd = f'netstat -ano | findstr :{port}'
        res = subprocess.check_output(cmd, shell=True, stderr=subprocess.DEVNULL).decode()
        for line in res.strip().splitlines():
            parts = line.strip().split()
            if len(parts) >= 5 and "LISTENING" in line and f":{port}" in parts[1]:
                pid = parts[-1]
                if pid and pid != "0" and pid != str(os.getpid()):
                    subprocess.call(["taskkill", "/F", "/PID", pid],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass

def stream_output(process, prefix, color_code):
    reset_code = "\033[0m"
    try:
        for line in iter(process.stdout.readline, ""):
            cleaned = line.rstrip()
            if cleaned:
                print(f"{color_code}{prefix}{reset_code} {cleaned}", flush=True)
    except Exception:
        pass

def open_browser_when_ready(url: str = "http://localhost:5173/", timeout: float = 12.0):
    """Waits for Vite frontend to become responsive, then opens default browser."""
    start = time.time()
    opened = False
    while time.time() - start < timeout and not opened:
        try:
            with urllib.request.urlopen(url, timeout=0.8) as resp:
                if resp.status == 200:
                    time.sleep(0.3)
                    print(f"\n[Browser] Opening {url} in your default browser...\n", flush=True)
                    webbrowser.open(url)
                    opened = True
                    return
        except Exception:
            time.sleep(0.3)

    # Fallback open if timeout reached
    if not opened:
        try:
            webbrowser.open(url)
        except Exception:
            pass

def main():
    print("=" * 64)
    print("  MediSense AI — Medical Reports, Made Clear")
    print("  Starting unified development environment...")
    print("=" * 64)

    # 1. Verify directories
    if not BACKEND_DIR.exists():
        print(f"Error: Backend directory not found at {BACKEND_DIR}")
        sys.exit(1)
    if not FRONTEND_DIR.exists():
        print(f"Error: Frontend directory not found at {FRONTEND_DIR}")
        sys.exit(1)

    # 2. Check node/npm command
    npm_cmd = "npm.cmd" if sys.platform == "win32" and shutil.which("npm.cmd") else "npm"
    if not shutil.which(npm_cmd) and not shutil.which("npm"):
        print("Error: Node.js / npm is required to run the frontend.")
        sys.exit(1)

    # Free ports 8000 and 5173 if lingering from prior abrupt terminal exit
    free_port_if_in_use(8000)
    free_port_if_in_use(5173)

    processes = []

    def shutdown(signum=None, frame=None):
        print("\n\nShutting down MediSense AI servers gracefully...")
        for proc in processes:
            try:
                if sys.platform == "win32":
                    subprocess.call(
                        ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                else:
                    proc.terminate()
            except Exception:
                pass
        print("All servers stopped. Goodbye!\n")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    # 3. Start Backend (FastAPI on port 8000)
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "main:app",
        "--reload",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(BACKEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
    )
    processes.append(backend_proc)

    # Stream backend logs with cyan prefix
    t_back = threading.Thread(
        target=stream_output,
        args=(backend_proc, "[Backend]", "\033[96m"),
        daemon=True,
    )
    t_back.start()

    # 4. Start Frontend (Vite on port 5173)
    print("[2/2] Starting Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = [npm_cmd, "run", "dev", "--", "--port", "5173", "--host"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(FRONTEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
        shell=(sys.platform == "win32"),
    )
    processes.append(frontend_proc)

    # Stream frontend logs with green prefix
    t_front = threading.Thread(
        target=stream_output,
        args=(frontend_proc, "[Frontend]", "\033[92m"),
        daemon=True,
    )
    t_front.start()

    # 5. Automatically open the browser as soon as the interface is ready
    t_browser = threading.Thread(
        target=open_browser_when_ready,
        args=("http://localhost:5173/", 12.0),
        daemon=True,
    )
    t_browser.start()

    time.sleep(2)
    print("\n" + "=" * 64)
    print("  MediSense AI is now running!")
    print("  -> Frontend: http://localhost:5173/ (opening in your browser...)")
    print("  -> Backend:  http://127.0.0.1:8000/docs (Swagger API Docs)")
    print("  Press Ctrl+C anytime to stop both servers.")
    print("=" * 64 + "\n", flush=True)

    # Keep alive and monitor child processes
    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print(f"[Backend] Process terminated with code {backend_proc.returncode}")
                shutdown()
            if frontend_proc.poll() is not None:
                print(f"[Frontend] Process terminated with code {frontend_proc.returncode}")
                shutdown()
    except KeyboardInterrupt:
        shutdown()

if __name__ == "__main__":
    main()
