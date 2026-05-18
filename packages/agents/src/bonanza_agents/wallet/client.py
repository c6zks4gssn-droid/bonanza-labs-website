"""Bonanza Agent Wallet client.

Adds budget enforcement and a stable Python API above Stripe Link CLI.
"""

from __future__ import annotations

from .link_cli import LinkCLIClient
from .models import CredentialType, SpendRequest, Wallet


class BudgetExceededError(RuntimeError):
    """Raised when an agent tries to exceed its wallet budget."""


class WalletClient:
    """Agent Wallet orchestration layer.

    This intentionally does not store card details. It creates Link spend requests,
    waits for user approval when requested, and records spend against local budgets.
    """

    def __init__(self, wallet: Wallet | None = None, link: LinkCLIClient | None = None):
        self.wallet = wallet or Wallet()
        self.link = link or LinkCLIClient()

    def auth_status(self) -> dict:
        return self.link.auth_status()

    def login(self, client_name: str = "Bonanza Agent Wallet") -> dict:
        return self.link.login(client_name=client_name)

    def payment_methods(self) -> dict:
        return self.link.list_payment_methods()

    def create_spend_request(
        self,
        *,
        agent_id: str,
        payment_method_id: str,
        merchant_name: str,
        merchant_url: str,
        context: str,
        amount_cents: int,
        currency: str = "USD",
        line_items: list[str] | None = None,
        totals: list[str] | None = None,
        credential_type: CredentialType = CredentialType.VIRTUAL_CARD,
        request_approval: bool = True,
        test: bool = False,
    ) -> dict:
        amount_usd = amount_cents / 100
        if not self.wallet.can_spend(amount_usd):
            raise BudgetExceededError(
                f"Spend ${amount_usd:.2f} exceeds remaining wallet budget "
                f"${self.wallet.remaining_budget_usd:.2f}."
            )

        local_request = SpendRequest(
            agent_id=agent_id,
            payment_method_id=payment_method_id,
            merchant_name=merchant_name,
            merchant_url=merchant_url,
            context=context,
            amount_cents=amount_cents,
            currency=currency.upper(),
            credential_type=credential_type,
        )
        self.wallet.spend_requests.append(local_request)

        result = self.link.create_spend_request(
            payment_method_id=payment_method_id,
            merchant_name=merchant_name,
            merchant_url=merchant_url,
            context=context,
            amount_cents=amount_cents,
            currency=currency,
            line_items=line_items,
            totals=totals,
            credential_type=credential_type.value,
            request_approval=request_approval,
            test=test,
        )

        # Only record spend after Link has accepted/approved the request in test/live flow.
        status = str(result.get("status", "")).lower()
        if status in {"approved", "consumed"}:
            self.wallet.record_spend(amount_usd)

        return {
            "wallet": self.wallet.model_dump(),
            "local_request": local_request.model_dump(),
            "link": result,
        }

    def retrieve_spend_request(self, spend_request_id: str, include_card: bool = False) -> dict:
        return self.link.retrieve_spend_request(spend_request_id, include_card=include_card)
