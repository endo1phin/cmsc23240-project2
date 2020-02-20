/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

// Relay pin is controlled with D8. The active wire is connected to Normally Closed and common
int relay = 8;
volatile byte relayState = LOW;

// Timer Variables
long lastDebounceTime = 0;  
long debounceDelay = 10000;

void setup() {
  // Pin for relay module set as output
  pinMode(relay, OUTPUT);
  digitalWrite(relay, HIGH);
  // Serial communication for debugging purposes
  Serial.begin(9600);
  Serial.println("<Arduino is ready>");
}

//From https://forum.arduino.cc/index.php?topic=288234.0
char receivedChar;
boolean newData = false;

void recvOneChar() {
 if (Serial.available() > 0) {
    receivedChar = Serial.read();
    newData = true;
 }
}

void showNewData() {
 if (newData == true) {
   Serial.print("This just in ... ");
   Serial.println(receivedChar);
   newData = false;
 }
}

void shortPress(){
    digitalWrite(relay, LOW);
    Serial.println("Short Press");
    delay(100);
    digitalWrite(relay, HIGH);
}

void longPress(){
    digitalWrite(relay, LOW);
    Serial.println("Long Press");
    delay(1500);
    digitalWrite(relay, HIGH);
}

void loop() {
  recvOneChar();
  showNewData();
  if (receivedChar == 'S'){
    //Short press 
    receivedChar = 'a';
    shortPress();
    delay(200);    
  }
  if (receivedChar == 'L'){
    //long press 
    receivedChar = 'a';
    longPress();
    delay(200);    
  }
  if (receivedChar == 'h'){
    //high alert odor release
    receivedChar = 'a';
    shortPress();
    delay(5000);
    shortPress();
    delay(200);
    shortPress();
    delay(200);    
  }
  if (receivedChar == 'l'){
    //low alert odor release
    receivedChar = 'a';
    shortPress();
    delay(1500);
    shortPress();
    delay(200);
    shortPress();
    delay(200);    
  }
}
