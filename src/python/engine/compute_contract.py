# src/python/engine/compute_contract.py
from __future__ import annotations

from typing import Any, Dict, Optional

from .ephemeris_adapter import init_swiss_ephemeris
from .versioning import CALC_VERSION, get_tzdata_version
from .hashing import compute_facts_hash


def compute_contract(
    payload: Dict[str, Any],
    ephe_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Single Entry Point der Python Engine.

    V1-Prinzipien:
    - stateless
    - deterministisch
    - keine DB-Writes
    - keine externen Provider-Keys
    """

    # Swiss Ephemeris initialisieren (lokale Ephemeriden)
    ephe_meta = init_swiss_ephemeris(ephe_path or "src/python/engine/ephe")

    # TZ-Datenbasis bestimmen
    tzdata_version = get_tzdata_version()

    # Normalisierter Input für Hashing (keine Berechnung hier)
    normalized_input = {
        "birth_date": payload.get("birth_date"),
        "birth_time": payload.get("birth_time"),
        "birth_place": payload.get("birth_place"),
    }

    # Deterministische Fakten (V1 minimal, wird später erweitert)
    facts = {
        "ephemeris_version": ephe_meta.ephemeris_version,
        "swisseph_version": ephe_meta.swe_version,
    }

    # Reproduzierbarer Fakten-Hash
    facts_hash = compute_facts_hash(
        normalized_input=normalized_input,
        calc_version=CALC_VERSION,
        facts=facts,
    )

    # Contract v1 (minimal)
    return {
        "schema_version": "v1",
        "calc_version": CALC_VERSION,
        "ephemeris_version": ephe_meta.ephemeris_version,
        "tzdata_version": tzdata_version,
        "facts_hash": facts_hash,
    }
