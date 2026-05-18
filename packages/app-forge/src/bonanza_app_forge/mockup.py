"""Mockup generator — turns text prompts into visual app mockups."""

import base64
import os
from pathlib import Path

import requests


MOCKUP_SYSTEM = """You are an expert UI/UX designer. Generate a clean, modern app mockup image 
based on the user's description. The mockup should look like a real app screenshot — 
proper layout, realistic content, professional styling. Use a modern design system 
with proper spacing, typography, and colors."""


def generate_mockup_openai(prompt: str, output_path: str, api_key: str | None = None) -> str:
    """Generate a mockup image using OpenAI's GPT Image 2 / DALL-E 3."""
    api_key = api_key or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not set. Run: export OPENAI_API_KEY=sk-...")

    # Use DALL-E 3 for now (GPT Image 2 support varies)
    from openai import OpenAI
    client = OpenAI(api_key=api_key)

    design_prompt = (
        f"Create a modern, professional app UI mockup screenshot for: {prompt}. "
        "The image should look like a real app running in a browser — clean layout, "
        "realistic data, proper typography, modern design system. No placeholder text. "
        "Include realistic content and proper spacing."
    )

    response = client.images.generate(
        model="dall-e-3",
        prompt=design_prompt,
        size="1792x1024",
        quality="hd",
        n=1,
    )

    image_url = response.data[0].url
    img_data = requests.get(image_url, timeout=60).content

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(img_data)

    return output_path


def generate_mockup_ollama(prompt: str, output_path: str, host: str = "http://localhost:11434") -> str:
    """Generate a mockup using a local Ollama model (if available)."""
    # Ollama doesn't have native image gen yet — use a placeholder approach
    # that creates a simple HTML mockup instead
    raise NotImplementedError(
        "Ollama image generation not available yet. Use --provider openai for mockup generation."
    )


def image_to_base64(image_path: str) -> str:
    """Convert an image file to base64 for sending to vision models."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")