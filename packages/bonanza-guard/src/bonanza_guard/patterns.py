"""Known attack patterns for prompt injection detection."""

# Common prompt injection patterns
INJECTION_PATTERNS: list[dict[str, str]] = [
    {"pattern": r"ignore\s+(all\s+)?previous\s+instructions", "severity": "critical", "description": "Attempt to ignore previous instructions"},
    {"pattern": r"forget\s+(all\s+)?previous\s+instructions", "severity": "critical", "description": "Attempt to forget previous instructions"},
    {"pattern": r"disregard\s+(all\s+)?(previous|above|prior)\s+instructions", "severity": "critical", "description": "Attempt to disregard previous instructions"},
    {"pattern": r"you\s+are\s+now\s+a", "severity": "high", "description": "Attempt to reassign identity"},
    {"pattern": r"new\s+instructions?\s*:", "severity": "high", "description": "Attempt to inject new instructions"},
    {"pattern": r"system\s*:\s*", "severity": "high", "description": "Attempt to inject system message"},
    {"pattern": r"assistant\s*:\s*", "severity": "medium", "description": "Attempt to inject assistant message"},
    {"pattern": r"<\|im_start\|>", "severity": "critical", "description": "ChatML injection attempt"},
    {"pattern": r"<\|im_end\|>", "severity": "critical", "description": "ChatML injection attempt"},
    {"pattern": r"\[INST\]", "severity": "high", "description": "Llama-style instruction injection"},
    {"pattern": r"\[/INST\]", "severity": "high", "description": "Llama-style instruction injection"},
    {"pattern": r"```(python|bash|sh|javascript|sql)", "severity": "medium", "description": "Code execution attempt"},
    {"pattern": r"import\s+os\b", "severity": "high", "description": "OS module import attempt"},
    {"pattern": r"subprocess\.", "severity": "high", "description": "Subprocess call attempt"},
    {"pattern": r"eval\s*\(", "severity": "high", "description": "Eval execution attempt"},
    {"pattern": r"exec\s*\(", "severity": "high", "description": "Exec execution attempt"},
    {"pattern": r"__import__\s*\(", "severity": "high", "description": "Import injection attempt"},
    {"pattern": r"os\.system\s*\(", "severity": "critical", "description": "OS command execution attempt"},
    {"pattern": r"rm\s+-rf\s+/", "severity": "critical", "description": "Destructive command attempt"},
    {"pattern": r"DROP\s+TABLE", "severity": "high", "description": "SQL injection attempt"},
    {"pattern": r";\s*(SELECT|INSERT|UPDATE|DELETE|DROP)\s+", "severity": "high", "description": "SQL injection attempt"},
    {"pattern": r"https?://[^\s]+\.(exe|bat|cmd|ps1|sh)", "severity": "medium", "description": "Suspicious URL with executable"},
    {"pattern": r"reveal\s+your\s+(system|initial)\s+prompt", "severity": "high", "description": "Attempt to extract system prompt"},
    {"pattern": r"what\s+are\s+your\s+(instructions|rules|guidelines)", "severity": "medium", "description": "Attempt to extract instructions"},
    {"pattern": r"repeat\s+(your|the)\s+(system|initial)\s+prompt", "severity": "high", "description": "Attempt to extract system prompt"},
    {"pattern": r"pretend\s+you\s+are", "severity": "medium", "description": "Attempt to reassign identity"},
    {"pattern": r"act\s+as\s+if\s+you\s+(are|were)", "severity": "medium", "description": "Attempt to reassign identity"},
    {"pattern": r"jailbreak", "severity": "medium", "description": "Jailbreak keyword"},
    {"pattern": r"DAN\s+mode", "severity": "high", "description": "DAN mode activation attempt"},
    {"pattern": r"developer\s+mode", "severity": "medium", "description": "Developer mode activation attempt"},
    {"pattern": r"debug\s+mode", "severity": "low", "description": "Debug mode mention"},
]

# PII detection patterns
PII_PATTERNS: list[dict[str, str]] = [
    {"pattern": r"\b\d{3}[-.]?\d{2}[-.]?\d{4}\b", "type": "ssn", "description": "US Social Security Number"},
    {"pattern": r"\b\d{16}[-\s]?\d{0,4}\b", "type": "credit_card", "description": "Credit card number"},
    {"pattern": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", "type": "email", "description": "Email address"},
    {"pattern": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b", "type": "phone", "description": "US phone number"},
    {"pattern": r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", "type": "ip_address", "description": "IP address"},
    {"pattern": r"\b[A-Z]{2}\d{6,9}\b", "type": "passport", "description": "Passport number pattern"},
    {"pattern": r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b", "type": "bank_account", "description": "Bank account number"},
    {"pattern": r"\b0x[a-fA-F0-9]{40}\b", "type": "crypto_wallet", "description": "Ethereum wallet address"},
    {"pattern": r"\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b", "type": "crypto_wallet", "description": "Bitcoin wallet address"},
]

# Toxicity/safety keywords (basic - extend as needed)
TOXICITY_KEYWORDS: list[str] = [
    "bomb", "explosive", "terrorist", "kill", "murder", "assassinate",
    "suicide", "self-harm", "overdose", "hack into", "steal",
    "identity theft", "phishing", "ransomware", "malware",
]