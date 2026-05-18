"""Bonanza Guard — Security guardrails for AI agents.

Input filtering, prompt injection detection, and output validation.
Drop-in protection for any LLM or agent pipeline.
"""

__version__ = "0.1.0"
__author__ = "Bonanza Labs"

from .guard import Guard, GuardResult, GuardRule
from .patterns import INJECTION_PATTERNS, PII_PATTERNS, TOXICITY_KEYWORDS

__all__ = [
    "Guard",
    "GuardResult",
    "GuardRule",
    "INJECTION_PATTERNS",
    "PII_PATTERNS",
    "TOXICITY_KEYWORDS",
]