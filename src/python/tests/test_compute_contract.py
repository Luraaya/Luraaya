from engine.compute_contract import compute_contract


def test_compute_contract_ephemeris_init():
    result = compute_contract(payload={})
    assert result["schema_version"] == "v1"
    assert "ephemeris_version" in result
    assert "swisseph_version" in result
