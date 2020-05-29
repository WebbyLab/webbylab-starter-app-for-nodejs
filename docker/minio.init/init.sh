#!/bin/sh

/usr/bin/mc config host add minio http://"${MINIO_HOST}":"${MINIO_PORT}" "${MINIO_ACCESS_KEY}" "${MINIO_SECRET_KEY}" --api S3v4
/usr/bin/mc mb -p minio/"${MINIO_BUCKET}"
/usr/bin/mc policy set public minio/"${MINIO_BUCKET}"/"${MINIO_IMAGES_DIR}"
/usr/bin/mc mirror /minio.init/restore minio/"${MINIO_BUCKET}" --exclude .gitkeep