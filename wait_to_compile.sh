#!/bin/bash

max_retry=20
counter=0
FILE=/app/done

if [ ! -f "$FILE" ]; then
  sleep 0.5
fi

until [[ -f "$FILE" ]]
do
   sleep 0.5
   [[ counter -eq $max_retry ]] && echo "Failed: is the watcher service running? The first execution can take several minutes. Wait for the 'Starting compilation in watch mode' message" && exit 1
   ((counter++))
done
npm run start