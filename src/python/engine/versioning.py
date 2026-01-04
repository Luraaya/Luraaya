# src/python/engine/versioning.py
from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version


# Einzige semantische Versionsquelle (Engine + Regeln + Zeitlogik + Contract)
CALC_VERSION = "1.0.0"


def get_tzdata_version() -> str:
    """
    Ermittelt deterministisch die TZ-Datenbasis.
    - Wenn das PyPI-Paket 'tzdata' installiert ist: dessen Version.
    - Sonst: 'system' (OS tzdata / Windows zoneinfo) als Marker.
    """
    try:
        return f"tzdata:{version('tzdata')}"
    except PackageNotFoundError:
        return "tzdata:system"
