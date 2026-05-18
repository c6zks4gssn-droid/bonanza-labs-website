"""Code generator — reads mockup images and generates working app code."""

import os
from pathlib import Path


CODE_SYSTEM = """You are an expert full-stack developer. You will receive a screenshot/mockup of a web application.
Your job is to generate a complete, working Next.js + Tailwind CSS application that exactly matches the design.

Rules:
1. Generate a single-page Next.js app (App Router)
2. Use Tailwind CSS for all styling
3. Match the layout, colors, typography, and spacing from the mockup
4. Use realistic placeholder data (not lorem ipsum)
5. Make it responsive
6. Include all interactive elements (buttons, forms, charts)
7. Use proper semantic HTML
8. For charts, use recharts library
9. Output the COMPLETE page.tsx file — no shortcuts, no placeholders

Output ONLY the code, no explanations."""


def generate_code_claude(
    image_path: str,
    prompt: str,
    api_key: str | None = None,
    model: str = "claude-sonnet-4-20250514",
) -> str:
    """Generate app code from a mockup using Claude."""
    api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not set. Run: export ANTHROPIC_API_KEY=sk-...")

    import anthropic
    from .mockup import image_to_base64

    client = anthropic.Anthropic(api_key=api_key)
    b64 = image_to_base64(image_path)

    # Determine media type
    ext = Path(image_path).suffix.lower()
    media_type = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"}.get(ext.lstrip("."), "image/png")

    message = client.messages.create(
        model=model,
        max_tokens=8192,
        system=CODE_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": media_type, "data": b64},
                    },
                    {
                        "type": "text",
                        "text": f"Create a working Next.js + Tailwind CSS app that matches this design. Original prompt: {prompt}",
                    },
                ],
            }
        ],
    )

    return message.content[0].text


def generate_code_openai(
    image_path: str,
    prompt: str,
    api_key: str | None = None,
    model: str = "gpt-4o",
) -> str:
    """Generate app code from a mockup using OpenAI."""
    api_key = api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not set. Run: export OPENAI_API_KEY=sk-...")

    from openai import OpenAI
    from .mockup import image_to_base64

    client = OpenAI(api_key=api_key)
    b64 = image_to_base64(image_path)

    ext = Path(image_path).suffix.lower()
    media_type = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"}.get(ext.lstrip("."), "image/png")

    response = client.chat.completions.create(
        model=model,
        max_tokens=8192,
        messages=[
            {"role": "system", "content": CODE_SYSTEM},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{media_type};base64,{b64}"}},
                    {"type": "text", "text": f"Create a working Next.js + Tailwind CSS app that matches this design. Original prompt: {prompt}"},
                ],
            },
        ],
    )

    return response.choices[0].message.content


def generate_code_ollama(
    image_path: str,
    prompt: str,
    model: str = "gemma3:12b",
    host: str = "http://localhost:11434",
) -> str:
    """Generate app code from a mockup using Ollama (local)."""
    from .mockup import image_to_base64

    b64 = image_to_base64(image_path)

    payload = {
        "model": model,
        "prompt": f"{CODE_SYSTEM}\n\nCreate a working Next.js + Tailwind CSS app that matches this design. Original prompt: {prompt}",
        "images": [b64],
        "stream": False,
        "options": {"num_predict": 8192},
    }

    import requests
    resp = requests.post(f"{host}/api/generate", json=payload, timeout=300)
    resp.raise_for_status()
    return resp.json()["response"]


def extract_code(raw: str) -> str:
    """Extract code from markdown-wrapped AI output."""
    import re
    # Try to find code blocks
    match = re.search(r"```(?:tsx?|jsx?)\n(.*?)```", raw, re.DOTALL)
    if match:
        return match.group(1)
    # Try without language hint
    match = re.search(r"```\n(.*?)```", raw, re.DOTALL)
    if match:
        return match.group(1)
    # Return as-is if no code blocks found
    return raw