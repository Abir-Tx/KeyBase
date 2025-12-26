.PHONY: req run

# I am using pip freeze to generate the requirements files
req:
	pip freeze > requirements.txt

run:
	uvicorn app.main:app --reload --host 0.0.0.0
