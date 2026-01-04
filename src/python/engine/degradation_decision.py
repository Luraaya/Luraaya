from __future__ import annotations
from dataclasses import dataclass
from typing import Literal

Decision = Literal["FULL", "DEGRADED"]


@dataclass(frozen=True)
class DegradationDecision:
    decision: Decision
    has_birth_time: bool
    reason: str


def decide_degradation(has_birth_time: bool) -> DegradationDecision:
    """
    Rule (final, Option A):
    - With birth time -> FULL
    - Without birth time -> DEGRADED
    No heuristics, no partial upgrades.
    """
    if has_birth_time:
        return DegradationDecision(
            decision="FULL",
            has_birth_time=True,
            reason="BIRTH_TIME_PROVIDED"
        )

    return DegradationDecision(
        decision="DEGRADED",
        has_birth_time=False,
        reason="BIRTH_TIME_MISSING"
    )
