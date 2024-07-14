set dotenv-load := true


help:
    @just --evaluate
    @echo ---
    @just --list

build: venv
    @./.venv/bin/python3 main.py

[private]
venv:
  @[ -d .venv ] || python3 -m venv .venv
  @./.venv/bin/pip install -r requirements.txt --quiet