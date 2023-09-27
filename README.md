# NOTE
This is a work in progress and is not ready for use yet.

# Github action
This GitHub action is responsible for building and deploying the specified docker compose file to ComposeDeploy.

The GitHub action will do the following.
1. Build the docker compose file
2. Push the docker compose file to the specified registry (using the generated api key(password) and project id(username))
3. Upload the docker compose to the API backend (so the backend know what services to start etc).
4. Tell the API to setup to deploy the docker compose file.
5. Wait for the API to finish deploying the docker compose file.
6. Done!

# Setup
This action is created using nodejs 20 and Typescript.
