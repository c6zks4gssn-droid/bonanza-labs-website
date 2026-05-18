"""Agent identity and authentication — JWT tokens, API keys, OAuth flows for AI agents."""

from __future__ import annotations
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from pydantic import BaseModel, Field
import jwt


class AgentIdentity(BaseModel):
    """An AI agent's identity — like a digital passport."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    wallet_id: str = ""  # Links to Agent Wallet
    public_key: str = ""  # For verification
    scopes: list[str] = ["read"]  # Permission scopes
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class APIKey(BaseModel):
    """An API key for agent-to-service authentication."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str
    key_hash: str = ""  # SHA256 of the key (we never store raw key)
    prefix: str = ""  # First 8 chars for identification
    scopes: list[str] = ["read"]
    expires_at: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_used_at: str = ""
    active: bool = True


class AuthToken(BaseModel):
    """A JWT-based auth token for agent-to-agent communication."""
    token: str
    agent_id: str
    scopes: list[str]
    expires_at: str


class AuthManager:
    """Manage agent identities, API keys, and JWT tokens."""

    def __init__(self, jwt_secret: str = ""):
        self.jwt_secret = jwt_secret or secrets.token_hex(32)
        self._identities: dict[str, AgentIdentity] = {}
        self._api_keys: dict[str, APIKey] = {}
        self._raw_keys: dict[str, str] = {}  # id -> raw key (only at creation)

    def create_identity(self, name: str, description: str = "", wallet_id: str = "", scopes: list[str] = None) -> AgentIdentity:
        """Create a new agent identity."""
        identity = AgentIdentity(name=name, description=description, wallet_id=wallet_id, scopes=scopes or ["read"])
        self._identities[identity.id] = identity
        return identity

    def create_api_key(self, agent_id: str, scopes: list[str] = None, expires_hours: int = 8760) -> tuple[APIKey, str]:
        """Create a new API key. Returns (APIKey, raw_key) — raw_key shown only once."""
        raw_key = f"bza_{secrets.token_hex(24)}"
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        prefix = raw_key[:8]
        expires_at = (datetime.now(timezone.utc) + timedelta(hours=expires_hours)).isoformat()

        api_key = APIKey(
            agent_id=agent_id,
            key_hash=key_hash,
            prefix=prefix,
            scopes=scopes or ["read"],
            expires_at=expires_at,
        )
        self._api_keys[api_key.id] = api_key
        self._raw_keys[api_key.id] = raw_key
        return api_key, raw_key

    def verify_api_key(self, raw_key: str) -> Optional[APIKey]:
        """Verify an API key and return the key object if valid."""
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        for ak in self._api_keys.values():
            if ak.key_hash == key_hash and ak.active:
                ak.last_used_at = datetime.now(timezone.utc).isoformat()
                return ak
        return None

    def create_jwt(self, agent_id: str, scopes: list[str] = None, expires_hours: int = 24) -> AuthToken:
        """Create a JWT for agent-to-agent auth."""
        identity = self._identities.get(agent_id)
        if not identity:
            raise ValueError(f"Agent {agent_id} not found")

        scopes = scopes or identity.scopes
        expires = datetime.now(timezone.utc) + timedelta(hours=expires_hours)
        payload = {
            "sub": agent_id,
            "name": identity.name,
            "scopes": scopes,
            "exp": expires,
            "iat": datetime.now(timezone.utc),
        }
        token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")
        return AuthToken(token=token, agent_id=agent_id, scopes=scopes, expires_at=expires.isoformat())

    def verify_jwt(self, token: str) -> Optional[dict]:
        """Verify a JWT and return payload if valid."""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def list_identities(self) -> list[AgentIdentity]:
        return list(self._identities.values())

    def revoke_api_key(self, key_id: str) -> bool:
        ak = self._api_keys.get(key_id)
        if ak:
            ak.active = False
            return True
        return False