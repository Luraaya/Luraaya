from engine.compute_contract import compute_contract


def test_facts_hash_is_reproducible():
    payload = {
        "birth_date": "1990-01-01",
        "birth_time": "12:00",
        "birth_place": {
            "lat": 46.9480,
            "lon": 7.4474,
            "tz_iana": "Europe/Zurich",
        },
    }

    r1 = compute_contract(payload)
    r2 = compute_contract(payload)

    assert r1["facts_hash"] == r2["facts_hash"]
