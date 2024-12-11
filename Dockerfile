FROM node:20 AS frontend

WORKDIR /app

COPY ./frontend/package.json .

RUN npm install

COPY ./frontend .

RUN npm run build

FROM python:3.10

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

COPY --from=frontend /app/dist /app/frontend/dist

CMD ["uvicorn", "server:app", "--workers", "4", "--host", "0.0.0.0", "--port", "80"]
