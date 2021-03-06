#!/usr/bin/env bash
LOG=$(git pull 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
       echo "Error running git pull:"
       echo ${LOG}
       exit ${RC}
fi

LOG=$(npm install 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
        echo "Error running npm install:"
        echo ${LOG}
        exit ${RC}
fi

LOG=$(grunt build 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
        echo "Error running grunt build:"
        echo ${LOG}
        exit ${RC}
fi

LOG=$(git submodule update --remote --checkout --recursive 2>&1)
if [[ ${RC} -ne 0 ]]
then
        echo "Error running git submodule update:"
        echo ${LOG}
        exit ${RC}
fi

rm indexErrors.txt &>/dev/null

INDEX_ERRORS=$(TFLOOKUP_INDEXFILE=documentationIndex.json TFLOOKUP_STORE_INDEX=true TFLOOKUP_START_SERVER=false TFLOOKUP_IGNORE_INDEX=true node index.js 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
        echo "Error updating the index:"
        echo ${INDEX_ERRORS}
        exit ${RC}
fi

echo "${INDEX_ERRORS}" | grep "Can't load" | awk '{ print $7 }' | sed -e "s/:$//g" > indexErrors.txt

LOG=$(git add documentationIndex.json indexErrors.txt 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
       echo "Error adding files:"
       echo ${LOG}
       exit ${RC}
fi

LOG=$(git commit -am "chore: Updated documentation index" 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
       echo "Error commiting changes:"
       echo ${LOG}
       exit ${RC}
fi

LOG=$(git push origin master 2>&1)
RC=$?
if [[ ${RC} -ne 0 ]]
then
       echo "Error pushing changes:"
       echo ${LOG}
       exit ${RC}
fi
