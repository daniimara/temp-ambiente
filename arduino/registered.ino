#include <dht11.h>
#include <SPI.h>
#include <Ethernet2.h>
#include <IPStack.h>
#include <Countdown.h>
#include <MQTTClient.h>

#define MQTT_MAX_PACKET_SIZE 100
#define SIZE 100

#define MQTT_PORT 1883

#define PUBLISH_TOPIC "iot-2/evt/status/fmt/json"
#define SUBSCRIBE_TOPIC "iot-2/cmd/+/fmt/json"
#define AUTHMETHOD "use-token-auth"

int ledPin = 13;

#define CLIENT_ID "d:uguhsp:iotsample-arduino:14a3643cbb11"
#define MS_PROXY "uguhsp.messaging.internetofthings.ibmcloud.com"
#define AUTHTOKEN "HL@9OyoP8du6NmGa7Q"

//14:a3:64:3c:bb:11
byte mac[] = { 0x14, 0xA3, 0x64, 0x3C, 0xBB, 0x11 };
byte ip[] = {192, 168, 1, 10};
EthernetClient c; // replace by a YunClient if running on a Yun
IPStack ipstack(c);

MQTT::Client<IPStack, Countdown, 100, 1> client = MQTT::Client<IPStack, Countdown, 100, 1>(ipstack);

void messageArrived(MQTT::MessageData& md);

dht11 DHT11;
String deviceEvent;

void setup() {
  DHT11.attach(3);
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }  
  Ethernet.begin(mac);
  pinMode(ledPin, OUTPUT); 
  delay(1000);
}

void loop() {
  int rc = -1;
  if (!client.isConnected()) {
    Serial.print("Connecting using Registered mode with clientid : ");
    Serial.print(CLIENT_ID);
    Serial.print("\tto MQTT Broker : ");
    Serial.print(MS_PROXY);
    Serial.print("\ton topic : ");
    Serial.println(PUBLISH_TOPIC);
    while (rc != 0) {
      rc = ipstack.connect(MS_PROXY, MQTT_PORT);
    }
    MQTTPacket_connectData options = MQTTPacket_connectData_initializer;
    options.MQTTVersion = 3;
    options.clientID.cstring = CLIENT_ID;
    options.username.cstring = AUTHMETHOD;
    options.password.cstring = AUTHTOKEN;
    options.keepAliveInterval = 10;
    rc = -1;
    while ((rc = client.connect(options)) != 0)
      ;
    //unsubscribe the topic, if it had subscribed it before.
 
    client.unsubscribe(SUBSCRIBE_TOPIC);
    //Try to subscribe for commands
    if ((rc = client.subscribe(SUBSCRIBE_TOPIC, MQTT::QOS0, messageArrived)) != 0) {
            Serial.print("Subscribe failed with return code : ");
            Serial.println(rc);
    } else {
          Serial.println("Subscribed\n");
    }
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
  Serial.println("Registered:");
  Serial.println(buffer);
  message.payload = buffer;
  message.payloadlen = strlen(buffer);
  
  rc = client.publish(PUBLISH_TOPIC, message);
  
  if (rc != 0) {
    Serial.print("Registered: Message publish failed with return code : ");
    Serial.println(rc);
  }
  client.yield(1000);
}

void messageArrived(MQTT::MessageData& md) {
  Serial.print("\nMessage Received\t");
  MQTT::Message &message = md.message;
  int topicLen = strlen(md.topicName.lenstring.data) + 1;

  char * topic = md.topicName.lenstring.data;
  topic[topicLen] = '\0';
  
  int payloadLen = message.payloadlen + 1;

  char * payload = (char*)message.payload;
  payload[payloadLen] = '\0';
  
  String topicStr = topic;
  String payloadStr = payload;
  
  //Command topic: iot-2/cmd/blink/fmt/json

  if(strstr(topic, "/cmd/blink") != NULL) {
    Serial.print("Command IS Supported : ");
    Serial.print(payload);
    Serial.println("\t.....\n");
    //Blink
    for(int i = 0 ; i < 2 ; i++ ) {
      digitalWrite(ledPin, HIGH);
      delay(1000);
      digitalWrite(ledPin, LOW);
      delay(1000);
    }
  } else {
    Serial.println("Command Not Supported:");            
  }
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
