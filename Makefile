dev:
	docker-compose up --build -d

prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f
