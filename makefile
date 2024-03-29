start:
	docker-compose up --build

down: 
	docker-compose down --volumes

clean:
	docker-compose down --rmi local --volumes --remove-orphans

test: 
	docker-compose run --rm pagatracks npm run test 

lint: 
	docker-compose run --rm pagatracks npm run lint 

test-watch: 
	docker-compose run --rm pagatracks npm run test -- --watch 