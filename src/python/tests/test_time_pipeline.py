from datetime import date
from python.engine.time_pipeline import local_to_utc_and_jd, local_day_interval_to_jd

def main():
    tzid = "Europe/Zurich"
    dob = date(1990, 6, 1)

    r1 = local_to_utc_and_jd(dob, "12:30", tzid)
    print("WITH TIME")
    print("UTC:", r1.utc_datetime.isoformat())
    print("JD :", r1.jd_ut)

    r2 = local_day_interval_to_jd(dob, tzid)
    print("\nWITHOUT TIME")
    print("JD_START:", r2.jd_start_ut)
    print("JD_END  :", r2.jd_end_ut)

    print("\nDST NON-EXISTENT (should error)")
    try:
        # Europe/Zurich: 2023-03-26 spring forward, 02:30 does not exist
        local_to_utc_and_jd(date(2023, 3, 26), "02:30", tzid)
        print("ERROR: expected TimeNonExistent, but got no error")
    except Exception as e:
        print("OK:", type(e).__name__, str(e))

    print("\nDST AMBIGUOUS (should choose fold=0)")
    try:
        # Europe/Zurich: 2023-10-29 fall back, 02:30 occurs twice
        r = local_to_utc_and_jd(date(2023, 10, 29), "02:30", tzid)
        print("UTC:", r.utc_datetime.isoformat())
        print("JD :", r.jd_ut)
    except Exception as e:
        print("ERROR:", type(e).__name__, str(e))

if __name__ == "__main__":
    main()
