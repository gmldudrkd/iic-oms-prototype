#!/bin/bash

MKCERT_INSTALLED=$(which mkcert)

if [ -z $MKCERT_INSTALLED ];then
    brew install mkcert
fi

mkcert -install
mkcert -key-file local-oms-key.pem -cert-file local-oms-cert.pem localhost oms-local.systemiic.com 127.0.0.1 ::1