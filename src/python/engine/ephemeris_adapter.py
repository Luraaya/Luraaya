# src/python/engine/ephemeris_adapter.py
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Tuple, Optional

import swisseph as swe


@dataclass(frozen=True)
class EphemerisMeta:
    ephemeris_version: str
    swe_version: str


def init_swiss_ephemeris(ephe_path: str | Path) -> EphemerisMeta:
    """
    Initialisiert Swiss Ephemeris mit lokalem Ephemeriden-Pfad.
    Keine Berechnungslogik, nur Setup und Metadaten.
    """
    p = Path(ephe_path)
    swe.set_ephe_path(str(p))
    # swe.version liefert typischerweise die SWISS EPHEMERIS Versionsangabe
    swe_version = str(swe.version)
    # ephemeris_version ist in v1 bewusst technisch, z.B. Pfad-Basename oder Release-String
    ephemeris_version = p.name
    return EphemerisMeta(ephemeris_version=ephemeris_version, swe_version=swe_version)


# Verbindlicher Scope (keine Lilith/Chiron/Asteroiden)
BODIES: Dict[str, int] = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mercury": swe.MERCURY,
    "venus": swe.VENUS,
    "mars": swe.MARS,
    "jupiter": swe.JUPITER,
    "saturn": swe.SATURN,
    "uranus": swe.URANUS,
    "neptune": swe.NEPTUNE,
    "pluto": swe.PLUTO,
}


def calc_ecliptic_lon_lat(
    jd_ut: float,
    body_id: int,
    *,
    flags: int = swe.FLG_SWIEPH | swe.FLG_SPEED,
) -> Tuple[float, float, float]:
    """
    Liefert (lon, lat, speed_lon) in Grad.
    """
    (lon, lat, _dist, speed_lon, _speed_lat, _speed_dist), _retflags = swe.calc_ut(
        jd_ut, body_id, flags
    )
    return float(lon), float(lat), float(speed_lon)


def calc_houses_placidus(
    jd_ut: float,
    lat: float,
    lon: float,
) -> Tuple[Tuple[float, ...], Tuple[float, ...]]:
    """
    Liefert (cuspitudes[1..12], ascmc[0..]) gemäss Placidus.
    """
    # house system 'P' = Placidus
    cusps, ascmc = swe.houses(jd_ut, float(lat), float(lon), b"P")
    return tuple(float(x) for x in cusps), tuple(float(x) for x in ascmc)
