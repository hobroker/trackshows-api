help: ## Show this help message
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

update-db: ## Update db
	cd charts/tshows-db; \
    	  helm dependency update; \
    	  helm upgrade --install tshows-db .

update-api: ## Update api
	cd charts/tshows-api; \
    	  helm dependency update; \
    	  helm upgrade --install tshows-api .

.PHONY: help
