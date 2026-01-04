# src/python/engine/hashing.py
from __future__ import annotations

import hashlib
import json
from typing import Any, Dict


def _canonical_json(obj: Any) -> str:
    """
    Kanonische JSON-Serialisierung:
    - sort_keys=True (keine Reihenfolge-Abhängigkeit bei Dicts)
    - separators ohne Whitespace
    - ensure_ascii=False (stabile Umlaute)
    """
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def compute_facts_hash(
    *,
    normalized_input: Dict[str, Any],
    calc_version: str,
    facts: Dict[str, Any],
) -> str:
    payload = {
        "normalized_input": normalized_input,
        "calc_version": calc_version,
        "facts": facts,
    }
    data = _canonical_json(payload).encode("utf-8")
    return hashlib.sha256(data).hexdigest()
