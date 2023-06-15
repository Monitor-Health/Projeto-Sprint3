#include "DHT.h"
#define dht_type DHT11 //define qual o tipo de sensor DHTxx que se está utilizando


/**
* Configurações iniciais sobre os sensores
* DHT11, LM35, LDR5 e TCRT5000
*/

// int dht_pin = A1;
// DHT dht_1 = DHT(dht_pin, dht_type); //pode-se configurar diversos sensores DHTxx

int lm35_pin = A0, leitura_lm35 = 0;
float temperatura;

// int ldr_pin = A2, leitura_ldr = 0;

int switch_pin = 5;

void setup()
{
  Serial.begin(9600);
  // dht_1.begin();
  pinMode(switch_pin, INPUT);
}

void loop()
{
   /**
   * Bloco do DHT11
   */
//    float umidade = dht_1.readHumidity();
//    float temperatura = dht_1.readTemperature();
//    if (isnan(temperatura) or isnan(umidade))
//  {
//      Serial.println("Erro ao ler o DHT");
//  }
//  else
//  {
//    Serial.print(umidade);
//    Serial.print(";");
//    Serial.print(temperatura);
//    Serial.print(";");
//  }

 leitura_lm35 = analogRead(lm35_pin);
 temperatura = (5.0/1023) * leitura_lm35 * 100;
 float temperaturaSimulada = temperatura*0.28-2.2;
 float temperaturaCongelante = temperaturaSimulada * 0.1;
 float temperaturaDerretendo = temperaturaSimulada * 5;
 float temperaturaFria = temperaturaSimulada * 0.8;
 float temperaturaQuente = temperaturaSimulada * 1.3;
 Serial.print(temperaturaSimulada);
 Serial.print(";");

//  leitura_ldr = analogRead(ldr_pin);
//  Serial.print(leitura_ldr);
//  Serial.print(";");
/**
* Bloco do TCRT5000
*/
if(digitalRead(switch_pin) == LOW){
  Serial.print(1);
  
}
    else {
Serial.print(0);

}
  Serial.print(";");
  Serial.print(temperaturaCongelante);
  Serial.print(";");
  if(digitalRead(switch_pin) == LOW){
    Serial.print(1);
  }else{
    Serial.print(0);
  }

  Serial.print(";");
  Serial.print(temperaturaDerretendo);
  Serial.print(";");
  if(digitalRead(switch_pin) == LOW){
    Serial.print(0);
  }else{
    Serial.print(1);
  }

  Serial.print(";");
  Serial.print(temperaturaFria);
  Serial.print(";");
  if(digitalRead(switch_pin) == LOW){
    Serial.print(1);
  }else{
    Serial.print(0);
  }

  Serial.print(";");
  Serial.print(temperaturaQuente);
  Serial.print(";");
  if(digitalRead(switch_pin) == LOW){
    Serial.println(0);
  }else{
    Serial.println(1);
  }

  delay(1000);

}

