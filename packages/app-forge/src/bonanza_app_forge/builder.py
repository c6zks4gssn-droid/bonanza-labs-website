"""Project builder — creates a Next.js project from generated code."""

import os
import subprocess
import shutil
from pathlib import Path


NEXTJS_TEMPLATE = """{{
  "name": "{name}",
  "version": "0.1.0",
  "private": true,
  "scripts": {{
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }},
  "dependencies": {{
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.12.0",
    "lucide-react": "^0.400.0",
    "framer-motion": "^11.0.0"
  }},
  "devDependencies": {{
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.5.0"
  }}
}}
"""

LAYOUT_TSX = """import type {{ Metadata }} from "next";
import "./globals.css";

export const metadata: Metadata = {{
  title: "{title}",
}};

export default function RootLayout({{ children }}: {{ children: React.ReactNode }}) {{
  return (
    <html lang="en">
      <body>{{children}}</body>
    </html>
  );
}}
"""

GLOBALS_CSS = """@import "tailwindcss";
"""

POSTCSS_CONFIG = """module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
"""

TS_CONFIG = """{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"""

NEXT_CONFIG = """/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
"""


def create_project(
    name: str,
    page_code: str,
    output_dir: str = "./output",
) -> str:
    """Create a complete Next.js project from generated page code."""
    from .codegen import extract_code

    project_dir = Path(output_dir) / name
    src_dir = project_dir / "src" / "app"
    src_dir.mkdir(parents=True, exist_ok=True)

    # Clean code
    code = extract_code(page_code)

    # Write all project files
    (project_dir / "package.json").write_text(NEXTJS_TEMPLATE.format(name=name))
    (project_dir / "next.config.js").write_text(NEXT_CONFIG)
    (project_dir / "tsconfig.json").write_text(TS_CONFIG)
    (project_dir / "postcss.config.js").write_text(POSTCSS_CONFIG)
    (src_dir / "layout.tsx").write_text(LAYOUT_TSX.format(title=name.replace("-", " ").title()))
    (src_dir / "globals.css").write_text(GLOBALS_CSS)
    (src_dir / "page.tsx").write_text(code)

    return str(project_dir)


def build_project(project_dir: str) -> bool:
    """Build the Next.js project for static export."""
    try:
        # Install dependencies
        subprocess.run(["npm", "install"], cwd=project_dir, capture_output=True, timeout=120, check=True)

        # Add static export to next.config
        config_path = Path(project_dir) / "next.config.js"
        config = config_path.read_text()
        if "output:" not in config:
            config = config.replace(
                "const nextConfig = {};",
                "const nextConfig = { output: 'export' };",
            )
            config_path.write_text(config)

        # Build
        subprocess.run(["npm", "run", "build"], cwd=project_dir, capture_output=True, timeout=120, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def deploy_tiiny(project_dir: str, domain: str, api_key: str) -> bool:
    """Deploy built project to tiiny.host."""
    import zipfile
    import tempfile
    import requests

    out_dir = Path(project_dir) / "out"
    if not out_dir.exists():
        return False

    # Zip the output
    zip_path = tempfile.mktemp(suffix=".zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in out_dir.rglob("*"):
            if file_path.is_file():
                arcname = file_path.relative_to(out_dir)
                zf.write(file_path, arcname)

    # Upload
    with open(zip_path, "rb") as f:
        resp = requests.post(
            "https://ext.tiiny.host/v1/upload",
            headers={"x-api-key": api_key, "user-agent": "n8n"},
            files={"files": f},
            data={"domain": domain},
            timeout=60,
        )

    os.unlink(zip_path)
    return resp.status_code == 200