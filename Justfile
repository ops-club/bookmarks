set dotenv-load := true


help:
    @just --evaluate
    @echo ---
    @just --list

build: sort venv
    @./.venv/bin/python3 main.py

sort: venv
    @./.venv/bin/python3 sort_yaml.py 'bookmarks.d/bookmarks-user.yaml'
    @./.venv/bin/python3 sort_yaml.py 'bookmarks.d/bookmarks-admin.yaml'
    @./.venv/bin/python3 sort_yaml.py 'bookmarks.d/bookmarks-partenaire.yaml'

[private]
venv:
  @[ -d .venv ] || python3 -m venv .venv
  @./.venv/bin/pip install -r requirements.txt --quiet