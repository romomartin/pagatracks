start:
	docker-compose up --build

down: 
	docker-compose down --volumes

clean:
	docker-compose down --rmi local --volumes --remove-orphans