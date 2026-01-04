import swisseph as swe

from engine.ephemeris_adapter import init_swiss_ephemeris, calc_ecliptic_lon_lat, BODIES


def test_swiss_ephemeris_smoke():
    # Pfad muss existieren, Ephemeriden-Dateien können noch fehlen.
    init_swiss_ephemeris("src/python/engine/ephe")

    lon, lat, speed_lon = calc_ecliptic_lon_lat(2460680.5, BODIES["sun"])  # Beispiel JD
    assert 0.0 <= lon < 360.0
    assert -90.0 <= lat <= 90.0
    assert isinstance(speed_lon, float)

from engine.ephemeris_adapter import calc_houses_placidus


def test_houses_placidus_smoke():
    init_swiss_ephemeris("src/python/engine/ephe")
    cusps, ascmc = calc_houses_placidus(2460680.5, 46.9480, 7.4474)  # Bern
    assert len(cusps) == 12 # 12 Häuserspitzen (1..12) als Tuple
    assert len(ascmc) >= 8