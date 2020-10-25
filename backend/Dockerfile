FROM tiangolo/meinheld-gunicorn-flask:python3.7

COPY ./ /app

RUN pip install psycopg2 flask-cors

ENV MODULE_NAME=backend
