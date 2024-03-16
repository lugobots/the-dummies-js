FROM node:18.19.0-slim

RUN apt-get update && apt-get install -y git


WORKDIR /output
COPY project_setup.sh /setup_intern.sh
RUN chmod +x /setup_intern.sh
CMD [ "/setup_intern.sh" ]
