#include <Wire.h>
#include <Adafruit_NFCShield_I2C.h>

Adafruit_NFCShield_I2C nfc(2, 3);

void setup() {

	Serial.begin(115200);

	nfc.begin();

	if (!nfc.getFirmwareVersion()) {
		while(1);
	}

	nfc.setPassiveActivationRetries(0xFF);

	nfc.SAMConfig();
}

void loop() {

	boolean			success;
	uint8_t			uid[]= { 0, 0, 0, 0, 0, 0, 0 };
	uint8_t			uidLength;
	unsigned long	uid2= 0;
	
	success= nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength);
	
	if (success && uidLength==4) {

		for (uint8_t i=0; i<uidLength; i++) {
			unsigned long tmp= uid[i];
			tmp= tmp<<(uidLength-1-i)*8;
			uid2= uid2 | tmp;
		}

		Serial.println(uid2, HEX);
		
		delay(66);
	}
}
