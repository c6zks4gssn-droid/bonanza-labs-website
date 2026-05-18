"""Tests for bonanza-app-forge."""

import pytest
from pathlib import Path
from bonanza_app_forge.templates import list_templates, get_template, TEMPLATES
from bonanza_app_forge.codegen import extract_code
from bonanza_app_forge.builder import create_project, NEXTJS_TEMPLATE, LAYOUT_TSX


class TestTemplates:
    """Test template system."""

    def test_list_templates(self):
        templates = list_templates()
        assert "faceless" in templates
        assert "saas-dashboard" in templates
        assert "portfolio" in templates
        assert templates["faceless"]["name"] == "Faceless Content Studio"

    def test_get_template(self):
        code = get_template("faceless")
        assert code is not None
        assert "FacelessStudio" in code
        assert "niches" in code

    def test_get_template_invalid(self):
        assert get_template("nonexistent") is None

    def test_all_templates_have_valid_code(self):
        for name, tpl in TEMPLATES.items():
            code = tpl["code"]
            assert len(code) > 100, f"Template {name} is too short"
            assert "export default" in code, f"Template {name} missing React component"


class TestCodegen:
    """Test code extraction."""

    def test_extract_code_tsx(self):
        raw = '```tsx\nexport default function App() { return <div>Hello</div>; }\n```'
        result = extract_code(raw)
        assert "export default" in result
        assert "Hello" in result

    def test_extract_code_no_language(self):
        raw = '```\nexport default function App() { return <div>Hello</div>; }\n```'
        result = extract_code(raw)
        assert "export default" in result

    def test_extract_code_plain(self):
        raw = 'export default function App() { return <div>Hello</div>; }'
        result = extract_code(raw)
        assert result == raw


class TestBuilder:
    """Test project creation."""

    def test_create_project(self, tmp_path):
        code = 'export default function App() { return <div>Test</div>; }'
        project_dir = create_project("test-app", code, str(tmp_path))
        assert Path(project_dir).exists()
        assert (Path(project_dir) / "package.json").exists()
        assert (Path(project_dir) / "src" / "app" / "page.tsx").exists()
        assert (Path(project_dir) / "src" / "app" / "layout.tsx").exists()
        assert (Path(project_dir) / "src" / "app" / "globals.css").exists()

    def test_create_project_name_in_package(self, tmp_path):
        code = 'export default function App() { return <div>Test</div>; }'
        project_dir = create_project("my-app", code, str(tmp_path))
        pkg = (Path(project_dir) / "package.json").read_text()
        assert '"my-app"' in pkg


class TestCLI:
    """Test CLI commands."""

    def test_cli_imports(self):
        from bonanza_app_forge.cli import main
        assert main is not None

    def test_template_names_match(self):
        for name in TEMPLATES:
            assert get_template(name) is not None