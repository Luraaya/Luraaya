from __future__ import annotations
from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class StabilityResult:
    stable: bool
    reason: str


def is_signal_stable(
    signal_at_start: Callable[[], str],
    signal_at_end: Callable[[], str]
) -> StabilityResult:
    """
    Option A (final):
    A signal is stable if it is identical at start and end of the local day interval.
    """
    try:
        s1 = signal_at_start()
        s2 = signal_at_end()
    except Exception as e:
        return StabilityResult(
            stable=False,
            reason=f"EVALUATION_ERROR:{type(e).__name__}"
        )

    if s1 == s2:
        return StabilityResult(
            stable=True,
            reason="STABLE_OVER_INTERVAL"
        )

    return StabilityResult(
        stable=False,
        reason="CHANGES_WITHIN_INTERVAL"
    )
