#include <dht11.h>
#include <SPI.h>
#include <Ethernet2.h>
#include <IPStack.h>
#include <Countdown.h>
#include <MQTTClient.h>
#define MS_PROXY "quickstart.messaging.internetofthings.ibmcloud.com"
#define MQTT_PORT 1883
#define MQTT_MAX_PACKET_SIZE 100

//14:a3:64:3c:bb:11
byte mac[] = { 0x14, 0xA3, 0x64, 0x3C, 0xBB, 0x11 };
byte ip[] = {192, 168, 1, 11};
//The convention to be followed is d:quickstart:iotsample-arduino:<MAC Address>

#define MQTT_CLIENTID "d:quickstart:iotsample-arduino:14a3643cbb11"
#define MQTT_TOPIC "iot-2/evt/status/fmt/json"

EthernetClient c;
IPStack ipstack(c);

MQTT::Client<IPStack, Countdown, 100, 1> client = MQTT::Client<IPStack, Countdown, 100, 1>(ipstack);

dht11 DHT11;
String deviceEvent;

void setup() {
  DHT11.attach(3);
  Serial.begin(9600);
  Ethernet.begin(mac);
  delay(2000);
}

void loop() {
  int rc = -1;
  if (!client.isConnected()) {
    Serial.println("Quickstart Connecting to IoT Foundation");
    while (rc != 0) {
      rc = ipstack.connect(MS_PROXY, MQTT_PORT);
    }
    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;
    data.MQTTVersion = 3;
    data.clientID.cstring = MQTT_CLIENTID;
    rc = -1;
    while ((rc = client.connect(data)) != 0)
    ;
    Serial.println("Connected successfully\n");
  }
  
  MQTT::Message message;
  message.qos = MQTT::QOS0;
  message.retained = false;
  
  deviceEvent = String("{\"d\":{");
  char buffer[30];
  deviceEvent += "\"temperatura\":";
  dtostrf(getTemperatura(),1,2, buffer);
  deviceEvent += buffer;
  deviceEvent += "}}";
  deviceEvent.toCharArray(buffer, 30);
  Serial.println("Quickstart:");
  Serial.println(buffer);
  message.payload = buffer;
  message.payloadlen = strlen(buffer);
  
  rc = client.publish(MQTT_TOPIC, message);
  
  if (rc != 0) {
    Serial.print("Quickstart: return code from publish was ");
    Serial.println(rc);
  }
  client.yield(1000);
}

int getTemperatura() {
  int chk = DHT11.read();
  int temperatura = 0;
  switch (chk)
  {
  case 0: 
    Serial.println("Read OK");
    temperatura = (int)DHT11.temperature;
    break;
  default: 
    Serial.println("Error DHT11"); 
    break;
  }
  return (temperatura);
}
