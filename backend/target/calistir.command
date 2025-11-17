#!/bin/bash
# Bu betiğin bulunduğu klasöre git (JAR dosyasını bulabilmesi için)
cd "$(dirname "$0")"

echo "Tahtam2.0 sunucusu baslatiliyor..."
echo "Sunucu hazir oldugunda (yaklasik 5-10 saniye) tarayici otomatik olarak acilacaktir."
echo "----------------------------------------------------------------"

# 1. Tarayıcıyı açma işlemini 7 saniye gecikmeyle arka plana at (&)
#    'sleep 7' sunucunun ayağa kalkması için zaman tanır.
#    'open' komutu Mac'e özeldir ve varsayılan tarayıcıyı açar.
(sleep 7 && open http://localhost:2000) &

# 2. Sunucuyu ön planda (bu terminal penceresinde) çalıştır.
#    Bu komut terminali meşgul edecek ve logları buraya yazdıracaktır.
java -jar backend-0.0.1-SNAPSHOT.jar

echo "Sunucu kapatildi."