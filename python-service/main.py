from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal, Optional, List, Any, Dict
import hashlib

app = FastAPI()

class BirthPlace(BaseModel):
    lat: float
    lon: float
    place_id: str
    name: str
    country_code: str

class ComputeRequestV1(BaseModel):
    language: Literal["de", "en", "fr"]
    plan_tier: Literal["base", "premium"]
    birth_date: str
    birth_time: Optional[str] = None
    birth_place: BirthPlace
    name: str

class ComputeError(BaseModel):
    code: str
    message: str

class ComputeResponseV1(BaseModel):
    schema_version: Literal["v1"] = "v1"
    calc_version: str = "1.0.0"
    facts_hash: str
    has_birth_time: bool
    errors: List[ComputeError] = []
    facts: Dict[str, Any] = {}
    signals: List[Any] = []

@app.get("/")
def root():
    return {"status": "ok", "service": "luraaya-python"}

@app.get("/healthz")
def healthz():
    return {"status": "healthy"}

@app.post("/v1/compute", response_model=ComputeResponseV1)
def compute(payload: ComputeRequestV1):
    # model_dump_json() ist der sicherste Weg in Pydantic v2
    raw_input = payload.model_dump_json()
    facts_hash = hashlib.sha256(raw_input.encode("utf-8")).hexdigest()

    return ComputeResponseV1(
        schema_version="v1",
        calc_version="1.0.0-mock",
        facts_hash=facts_hash,
        has_birth_time=payload.birth_time is not None,
        errors=[],
        facts={"message": "Logic ready", "user": payload.name},
        signals=[]
    )