import logging
import time
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app
from pythonjsonlogger import jsonlogger

# Logger setup
logger = logging.getLogger("security-api")
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

app = FastAPI(title="Container Security Pipeline API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"Path: {request.url.path} Duration: {duration:.4f}s Status: {response.status_code}")
    return response

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/dashboard/summary")
def get_dashboard_summary():
    return {
        "trust_score": 94.2,
        "signed_images": 1420,
        "critical_vulnerabilities": 3,
        "blocked_admissions": 12,
        "active_runtime_threats": 0
    }

@app.get("/findings")
def get_findings():
    return [
        {"id": "V-101", "severity": "Critical", "package": "openssl", "cve": "CVE-2024-1234", "status": "Open"},
        {"id": "V-102", "severity": "High", "package": "python-requests", "cve": "CVE-2024-5678", "status": "In Progress"}
    ]

@app.post("/scans/run")
def run_scan(image: str):
    logger.info(f"Triggering scan for image: {image}")
    return {"status": "Scan queued", "image": image, "scan_id": "scan-99"}

@app.get("/policies")
def get_policies():
    return [
        {"name": "No Critical Vulnerabilities", "enforcement": "Reject", "status": "Active"},
        {"name": "Require Cosign Signature", "enforcement": "Reject", "status": "Active"},
        {"name": "No Root User", "enforcement": "Audit", "status": "Warning"}
    ]
