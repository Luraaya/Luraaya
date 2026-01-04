from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timezone, timedelta
from zoneinfo import ZoneInfo


class TimePipelineError(Exception):
    """Base error for time pipeline."""


class MissingTimezone(TimePipelineError):
    pass


class InvalidTimeFormat(TimePipelineError):
    pass


class TimeNonExistent(TimePipelineError):
    """Local civil time does not exist (DST spring forward)."""
    pass


@dataclass(frozen=True)
class WithBirthTimeResult:
    has_birth_time: bool
    utc_datetime: datetime  # tz-aware UTC
    jd_ut: float


@dataclass(frozen=True)
class WithoutBirthTimeResult:
    has_birth_time: bool
    jd_start_ut: float
    jd_end_ut: float


def _parse_hhmm(s: str) -> time:
    try:
        parts = s.strip().split(":")
        if len(parts) != 2:
            raise ValueError
        hh = int(parts[0])
        mm = int(parts[1])
        if not (0 <= hh <= 23 and 0 <= mm <= 59):
            raise ValueError
        return time(hour=hh, minute=mm)
    except Exception as e:
        raise InvalidTimeFormat("INVALID_TIME_FORMAT") from e


def _is_nonexistent_local(naive_local: datetime, tz: ZoneInfo) -> bool:
    """
    Detect non-existent local time by roundtrip:
    local (fold=0) -> UTC -> local; if it does not match original naive, it's non-existent.
    """
    aware0 = naive_local.replace(tzinfo=tz, fold=0)
    back = aware0.astimezone(timezone.utc).astimezone(tz)
    back_naive = back.replace(tzinfo=None)
    return back_naive != naive_local


def _is_ambiguous_local(naive_local: datetime, tz: ZoneInfo) -> bool:
    """
    Detect ambiguous local time by comparing offsets for fold=0 vs fold=1.
    If offsets differ, the time is ambiguous (DST fall back).
    """
    aware0 = naive_local.replace(tzinfo=tz, fold=0)
    aware1 = naive_local.replace(tzinfo=tz, fold=1)
    return aware0.utcoffset() != aware1.utcoffset()


def _to_utc_option_b(naive_local: datetime, tzid: str) -> datetime:
    """
    Option B (final):
    - ambiguous time (fall back): choose first occurrence (fold=0)
    - non-existent time (spring forward): abort
    """
    if not tzid:
        raise MissingTimezone("MISSING_TIMEZONE")

    tz = ZoneInfo(tzid)

    # Non-existent: abort
    if _is_nonexistent_local(naive_local, tz):
        raise TimeNonExistent("TIME_NON_EXISTENT")

    # Ambiguous: choose fold=0 (first occurrence)
    fold = 0 if _is_ambiguous_local(naive_local, tz) else 0
    aware = naive_local.replace(tzinfo=tz, fold=fold)
    return aware.astimezone(timezone.utc)


def _julian_day_gregorian(y: int, m: int, d: int, hour_decimal: float) -> float:
    """
    Deterministic Julian Day (Gregorian calendar).
    Equivalent to standard astronomical algorithm. No external dependency.
    """
    a = (14 - m) // 12
    y2 = y + 4800 - a
    m2 = m + 12 * a - 3

    jdn = d + ((153 * m2 + 2) // 5) + 365 * y2 + (y2 // 4) - (y2 // 100) + (y2 // 400) - 32045
    # JDN starts at noon; JD starts at noon as well. We want JD with fraction of day.
    return jdn - 0.5 + (hour_decimal / 24.0)


def local_to_utc_and_jd(
    dob: date,
    birth_time_hhmm: str,
    tzid: str
) -> WithBirthTimeResult:
    """
    With birth time:
    local civil datetime -> UTC -> JD(UT)
    """
    t = _parse_hhmm(birth_time_hhmm)
    naive_local = datetime.combine(dob, t)
    utc_dt = _to_utc_option_b(naive_local, tzid)

    hour_decimal = utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0 + utc_dt.microsecond / 3_600_000_000.0
    jd_ut = _julian_day_gregorian(utc_dt.year, utc_dt.month, utc_dt.day, hour_decimal)

    return WithBirthTimeResult(
        has_birth_time=True,
        utc_datetime=utc_dt,
        jd_ut=jd_ut
    )


def local_day_interval_to_jd(
    dob: date,
    tzid: str
) -> WithoutBirthTimeResult:
    """
    Without birth time:
    Use local day interval [00:00, 24:00) in tz -> UTC -> JD interval.
    No default time.
    """
    if not tzid:
        raise MissingTimezone("MISSING_TIMEZONE")

    tz = ZoneInfo(tzid)

    start_local = datetime.combine(dob, time(0, 0))
    end_local = start_local + timedelta(days=1)

    # For midnight boundaries, DST ambiguity is extremely rare; we still treat them deterministically.
    start_utc = start_local.replace(tzinfo=tz, fold=0).astimezone(timezone.utc)
    end_utc = end_local.replace(tzinfo=tz, fold=0).astimezone(timezone.utc)

    h1 = start_utc.hour + start_utc.minute / 60.0 + start_utc.second / 3600.0 + start_utc.microsecond / 3_600_000_000.0
    h2 = end_utc.hour + end_utc.minute / 60.0 + end_utc.second / 3600.0 + end_utc.microsecond / 3_600_000_000.0

    jd_start = _julian_day_gregorian(start_utc.year, start_utc.month, start_utc.day, h1)
    jd_end = _julian_day_gregorian(end_utc.year, end_utc.month, end_utc.day, h2)

    return WithoutBirthTimeResult(
        has_birth_time=False,
        jd_start_ut=jd_start,
        jd_end_ut=jd_end
    )
